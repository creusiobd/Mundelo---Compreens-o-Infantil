/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MundeloVaultEnvelopeV1,
  VaultPayload,
  VAULT_FORMAT_IDENTIFIER,
  VAULT_CURRENT_VERSION,
  VAULT_DEFAULT_PBKDF2_ITERATIONS,
  VAULT_MIN_PBKDF2_ITERATIONS,
  VAULT_MAX_PBKDF2_ITERATIONS,
  VAULT_MAX_FILE_BYTES,
} from './types';
import { VaultEnvelopeSchema, VaultPayloadSchema } from './schemas';

/**
 * Converte Uint8Array para Base64 de forma isomórfica (Navegador e Node.js)
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converte Base64 para Uint8Array de forma isomórfica
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    const buf = Buffer.from(base64, 'base64');
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Obtém a interface SubtleCrypto do ambiente (W3C Web Cryptography API)
 */
export function getCryptoSubtle(): SubtleCrypto {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    return globalThis.crypto.subtle;
  }
  throw new Error(
    'Acesso à Web Cryptography API não disponível no ambiente atual. Verifique se a aplicação está sendo executada em contexto seguro (HTTPS ou localhost).'
  );
}

/**
 * Constrói os Dados Autenticados Associados (AAD) canônicos
 */
export function buildCanonicalAAD(
  formatVersion: number,
  childId: string,
  format: string = VAULT_FORMAT_IDENTIFIER
): string {
  return `${format}:${formatVersion}:${childId}`;
}

/**
 * Deriva uma chave simétrica AES-GCM de 256 bits a partir de senha usando PBKDF2-HMAC-SHA256
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array,
  iterations: number = VAULT_DEFAULT_PBKDF2_ITERATIONS
): Promise<CryptoKey> {
  if (!password || password.length < 8) {
    throw new Error('A senha do cofre deve possuir no mínimo 8 caracteres.');
  }
  if (
    iterations < VAULT_MIN_PBKDF2_ITERATIONS ||
    iterations > VAULT_MAX_PBKDF2_ITERATIONS
  ) {
    throw new Error(
      `Número de iterações PBKDF2 fora dos limites seguros (${VAULT_MIN_PBKDF2_ITERATIONS} a ${VAULT_MAX_PBKDF2_ITERATIONS}).`
    );
  }

  const subtle = getCryptoSubtle();
  const enc = new TextEncoder();
  const rawKeyMaterial = await subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    rawKeyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Cifra um payload de dados infantis sintéticos em um envelope versionado v1
 */
export async function encryptVault(
  payload: VaultPayload,
  password: string,
  iterations: number = VAULT_DEFAULT_PBKDF2_ITERATIONS
): Promise<MundeloVaultEnvelopeV1> {
  // 1. Validação estrita do payload antes da cifra
  const validatedPayload = VaultPayloadSchema.parse(payload);

  const subtle = getCryptoSubtle();
  const enc = new TextEncoder();

  // 2. Geração de Salt (16 bytes) e IV único (12 bytes / 96 bits) via CSPRNG
  const salt = new Uint8Array(16);
  const iv = new Uint8Array(12);
  globalThis.crypto.getRandomValues(salt);
  globalThis.crypto.getRandomValues(iv);

  // 3. Construção do AAD canônico (amarrando formato, versão e criança)
  const canonicalAAD = buildCanonicalAAD(
    VAULT_CURRENT_VERSION,
    validatedPayload.childProfile.id
  );
  const aadBytes = enc.encode(canonicalAAD);

  // 4. Derivação da chave
  const derivedKey = await deriveKeyFromPassword(password, salt, iterations);

  // 5. Cifra com AES-GCM-256 com autenticação de AAD
  const serializedPlaintext = JSON.stringify(validatedPayload);
  const ciphertextBuffer = await subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
      additionalData: aadBytes as BufferSource,
    },
    derivedKey,
    enc.encode(serializedPlaintext)
  );

  const ciphertextArray = new Uint8Array(ciphertextBuffer);

  // 6. Montagem do envelope público versionado
  const envelope: MundeloVaultEnvelopeV1 = {
    format: VAULT_FORMAT_IDENTIFIER,
    formatVersion: 1,
    appVersion: 'v0.4A',
    exportedAt: new Date().toISOString(),
    childId: validatedPayload.childProfile.id,
    childName: validatedPayload.childProfile.name,
    recordCount: validatedPayload.observations.length,
    crypto: {
      algorithm: 'AES-GCM',
      keyLength: 256,
      iv: uint8ArrayToBase64(iv),
      kdf: 'PBKDF2',
      kdfHash: 'SHA-256',
      kdfIterations: iterations,
      kdfSalt: uint8ArrayToBase64(salt),
      aad: uint8ArrayToBase64(aadBytes),
    },
    ciphertext: uint8ArrayToBase64(ciphertextArray),
  };

  // 7. Auto-validação do envelope gerado antes da liberação
  return VaultEnvelopeSchema.parse(envelope) as MundeloVaultEnvelopeV1;
}

/**
 * Autentica e decifra um envelope v1, validando schema e integridade relacional
 */
export async function decryptVault(
  envelopeData: unknown,
  password: string
): Promise<VaultPayload> {
  if (!password || password.length === 0) {
    throw new Error('Por favor, informe a senha do cofre.');
  }

  // 1. Validação estrita do schema do envelope
  const envelope = VaultEnvelopeSchema.parse(envelopeData) as MundeloVaultEnvelopeV1;

  // 2. Extração e validação do IV e Salt
  const iv = base64ToUint8Array(envelope.crypto.iv);
  if (iv.length !== 12) {
    throw new Error(`Tamanho de IV inválido (${iv.length} bytes; esperado: 12 bytes).`);
  }

  const salt = base64ToUint8Array(envelope.crypto.kdfSalt);
  if (salt.length < 16 || salt.length > 64) {
    throw new Error(
      `Tamanho de Salt inseguro (${salt.length} bytes; esperado entre 16 e 64 bytes).`
    );
  }

  // 3. Verificação de integridade do AAD declarado contra o AAD canônico esperado
  const enc = new TextEncoder();
  const expectedCanonicalAAD = buildCanonicalAAD(
    envelope.formatVersion,
    envelope.childId,
    envelope.format
  );
  const declaredAAD = new TextDecoder().decode(base64ToUint8Array(envelope.crypto.aad));

  if (declaredAAD !== expectedCanonicalAAD) {
    throw new Error(
      'Metadados do cofre corrompidos ou adulterados (inconsistência de AAD detectada).'
    );
  }

  // 4. Derivação da chave com os parâmetros especificados (já delimitados pelo schema)
  const subtle = getCryptoSubtle();
  const derivedKey = await deriveKeyFromPassword(
    password,
    salt,
    envelope.crypto.kdfIterations
  );

  // 5. Decifragem com AES-GCM (lança OperationError se a senha estiver errada ou ciphertext adulterado)
  let plaintextBuffer: ArrayBuffer;
  try {
    const ciphertextBytes = base64ToUint8Array(envelope.ciphertext);
    plaintextBuffer = await subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as BufferSource,
        additionalData: enc.encode(expectedCanonicalAAD) as BufferSource,
      },
      derivedKey,
      ciphertextBytes as BufferSource
    );
  } catch {
    throw new Error(
      'Falha na decifragem: senha incorreta ou arquivo adulterado/corrompido.'
    );
  }

  // 6. Parse do texto plano e validação estrita com Zod
  let rawParsed: unknown;
  try {
    const plaintextString = new TextDecoder().decode(plaintextBuffer);
    rawParsed = JSON.parse(plaintextString);
  } catch {
    throw new Error('Conteúdo interno do cofre não é um JSON válido após decifragem.');
  }

  const validatedPayload = VaultPayloadSchema.parse(rawParsed) as VaultPayload;

  // 7. Validação de isolamento e integridade relacional entre criança e observações
  if (validatedPayload.childProfile.id !== envelope.childId) {
    throw new Error(
      `Inconsistência de isolamento: perfil interno (${validatedPayload.childProfile.id}) difere do cabeçalho (${envelope.childId}).`
    );
  }

  if (validatedPayload.childProfile.name !== envelope.childName) {
    throw new Error(
      `Inconsistência de integridade: nome no cabeçalho (${envelope.childName}) difere do perfil descriptografado (${validatedPayload.childProfile.name}).`
    );
  }

  if (validatedPayload.observations.length !== envelope.recordCount) {
    throw new Error(
      `Inconsistência de integridade: a contagem de registros do cabeçalho (${envelope.recordCount}) difere do total descriptografado (${validatedPayload.observations.length}).`
    );
  }

  for (const obs of validatedPayload.observations) {
    if (obs.childId !== envelope.childId) {
      throw new Error(
        `Vazamento detectado: observação ${obs.id} pertence a outra criança (${obs.childId}) e foi rejeitada.`
      );
    }
  }

  return validatedPayload;
}

/**
 * Faz parse seguro de arquivo de texto contendo o cofre JSON com limite de tamanho
 */
export function parseVaultFileString(
  content: string,
  maxBytes: number = VAULT_MAX_FILE_BYTES
): unknown {
  if (typeof content !== 'string') {
    throw new Error('Conteúdo do arquivo inválido.');
  }

  // Verificação de tamanho
  const estimatedBytes = new TextEncoder().encode(content).length;
  if (estimatedBytes > maxBytes) {
    throw new Error(
      `O arquivo excede o limite máximo permitido de ${Math.round(
        maxBytes / (1024 * 1024)
      )} MB.`
    );
  }

  try {
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Estrutura de cofre inválida: o envelope deve ser um objeto JSON.');
    }
    return parsed;
  } catch (err: unknown) {
    if (err instanceof Error && err.message.startsWith('Estrutura de cofre')) {
      throw err;
    }
    throw new Error('O arquivo selecionado não contém uma estrutura JSON válida.');
  }
}
