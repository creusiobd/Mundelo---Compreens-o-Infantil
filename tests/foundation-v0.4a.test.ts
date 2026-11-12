/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  encryptVault,
  decryptVault,
  parseVaultFileString,
  uint8ArrayToBase64,
  base64ToUint8Array,
} from '../src/crypto/vault';
import { VaultPayload, MundeloVaultEnvelopeV1 } from '../src/crypto/types';
import {
  MOCK_PROFILE_TOMAS,
  MOCK_OBSERVATIONS,
  MOCK_CAREGIVERS,
} from '../src/data/mockData';

describe('Suite de Testes Automatizados — MUNDELO Foundation v0.4A (Cofre Criptografado)', () => {
  const testPassword = 'FraseSecretaSegura!2026';
  const tomasObservations = MOCK_OBSERVATIONS.filter((o) => o.childId === 'tomas');
  const linkedCaregivers = MOCK_CAREGIVERS.filter((c) =>
    c.linkedChildIds.includes('tomas')
  );

  const samplePayload: VaultPayload = {
    version: 1,
    exportedAt: '2026-11-12T10:00:00.000Z',
    childProfile: MOCK_PROFILE_TOMAS,
    observations: tomasObservations,
    linkedCaregivers,
    metadata: {
      origin: 'Mundelo Foundation v0.4A Prototype',
      description: 'Cofre experimental de dados sintéticos',
      isSyntheticData: true,
    },
  };

  // 1. Cifra, Decifragem e Round-Trip
  describe('1. Cifra e Decifragem Autenticada (AES-GCM-256 + PBKDF2)', () => {
    it('deve realizar ciclo completo de cifra e decifragem com fidelidade absoluta', async () => {
      // Usamos 100.000 iterações nos testes rápidos para eficiência do runner mantendo segurança
      const envelope = await encryptVault(samplePayload, testPassword, 100000);

      assert.equal(envelope.format, 'MUNDELO_VAULT');
      assert.equal(envelope.formatVersion, 1);
      assert.equal(envelope.childId, 'tomas');
      assert.equal(envelope.recordCount, tomasObservations.length);
      assert.ok(envelope.ciphertext.length > 50);

      const decrypted = await decryptVault(envelope, testPassword);

      assert.equal(decrypted.childProfile.id, samplePayload.childProfile.id);
      assert.equal(decrypted.childProfile.name, samplePayload.childProfile.name);
      assert.equal(decrypted.observations.length, samplePayload.observations.length);
      assert.deepEqual(decrypted.observations[0], samplePayload.observations[0]);
      assert.equal(decrypted.metadata.isSyntheticData, true);
    });

    it('deve gerar Salt e IV distintos em cada exportação consecutiva (CSPRNG)', async () => {
      const envelope1 = await encryptVault(samplePayload, testPassword, 100000);
      const envelope2 = await encryptVault(samplePayload, testPassword, 100000);

      assert.notEqual(
        envelope1.crypto.kdfSalt,
        envelope2.crypto.kdfSalt,
        'O salt deve ser único e pseudoaleatório por operação'
      );
      assert.notEqual(
        envelope1.crypto.iv,
        envelope2.crypto.iv,
        'O IV deve ser estritamente único por operação para evitar vulnerabilidades de AES-GCM'
      );
      assert.notEqual(
        envelope1.ciphertext,
        envelope2.ciphertext,
        'O ciphertext deve variar mesmo para conteúdos e senhas idênticos'
      );
    });
  });

  // 2. Proteção contra Senha Incorreta
  describe('2. Falha Controlada na Autenticação por Senha', () => {
    it('deve rejeitar decifragem com senha incorreta sem vazar dados', async () => {
      const envelope = await encryptVault(samplePayload, testPassword, 100000);

      await assert.rejects(
        async () => {
          await decryptVault(envelope, 'SenhaTotalmenteErrada!999');
        },
        (err: Error) => {
          assert.match(err.message, /senha incorreta ou arquivo adulterado/i);
          return true;
        }
      );
    });

    it('deve rejeitar senha vazia ou inferior a 8 caracteres', async () => {
      await assert.rejects(
        async () => {
          await encryptVault(samplePayload, 'curta', 100000);
        },
        (err: Error) => {
          assert.match(err.message, /mínimo 8 caracteres/i);
          return true;
        }
      );

      const envelope = await encryptVault(samplePayload, testPassword, 100000);
      await assert.rejects(
        async () => {
          await decryptVault(envelope, '');
        },
        (err: Error) => {
          assert.match(err.message, /informe a senha/i);
          return true;
        }
      );
    });
  });

  // 3. Detecção de Adulteração (Integridade Autenticada e AAD)
  describe('3. Detecção de Adulteração de Texto Cifrado e Metadados (AAD)', () => {
    it('deve detectar adulteração de bits no ciphertext (AES-GCM Auth Tag)', async () => {
      const envelope = await encryptVault(samplePayload, testPassword, 100000);

      // Corrompe o último caractere do ciphertext base64
      const tamperedCiphertext =
        envelope.ciphertext.slice(0, -2) + (envelope.ciphertext.endsWith('A') ? 'B' : 'A');

      const corruptedEnvelope: MundeloVaultEnvelopeV1 = {
        ...envelope,
        ciphertext: tamperedCiphertext,
      };

      await assert.rejects(
        async () => {
          await decryptVault(corruptedEnvelope, testPassword);
        },
        (err: Error) => {
          assert.match(err.message, /senha incorreta ou arquivo adulterado/i);
          return true;
        }
      );
    });

    it('deve detectar adulteração de IV', async () => {
      const envelope = await encryptVault(samplePayload, testPassword, 100000);
      const originalIvBytes = base64ToUint8Array(envelope.crypto.iv);
      originalIvBytes[0] ^= 0xff; // Inverte bits do primeiro byte
      const tamperedIv = uint8ArrayToBase64(originalIvBytes);

      const corruptedEnvelope: MundeloVaultEnvelopeV1 = {
        ...envelope,
        crypto: {
          ...envelope.crypto,
          iv: tamperedIv,
        },
      };

      await assert.rejects(
        async () => {
          await decryptVault(corruptedEnvelope, testPassword);
        },
        (err: Error) => {
          assert.match(err.message, /senha incorreta ou arquivo adulterado/i);
          return true;
        }
      );
    });

    it('deve detectar adulteração de metadados críticos amarrados ao AAD (ex: troca de childId no cabeçalho)', async () => {
      const envelope = await encryptVault(samplePayload, testPassword, 100000);

      // Invasor tenta reatribuir o cofre de Tomás para Lia alterando apenas os metadados de cabeçalho
      const tamperedEnvelope = {
        ...envelope,
        childId: 'lia',
        childName: 'Lia',
      };

      await assert.rejects(
        async () => {
          await decryptVault(tamperedEnvelope, testPassword);
        },
        (err: Error) => {
          assert.match(err.message, /inconsistência de AAD detectada|adulterados/i);
          return true;
        }
      );
    });
  });

  // 4. Proteção contra Downgrade de Parâmetros e Ataques de DoS
  describe('4. Proteção contra Downgrade de Algoritmo e Parâmetros Inseguros', () => {
    it('deve rejeitar cofre com iterações PBKDF2 excessivamente baixas (< 100.000)', async () => {
      const envelope = await encryptVault(samplePayload, testPassword, 100000);
      const insecureEnvelope = {
        ...envelope,
        crypto: {
          ...envelope.crypto,
          kdfIterations: 1000, // Inseguro! Tentativa de downgrade
        },
      };

      await assert.rejects(
        async () => {
          await decryptVault(insecureEnvelope, testPassword);
        },
        (err: Error) => {
          assert.match(err.message, /iterações de pbkdf2 inseguras/i);
          return true;
        }
      );
    });

    it('deve rejeitar cofre com algoritmo não autenticado (ex: AES-CBC)', async () => {
      const envelope = await encryptVault(samplePayload, testPassword, 100000);
      const insecureEnvelope = {
        ...envelope,
        crypto: {
          ...envelope.crypto,
          algorithm: 'AES-CBC', // Inseguro / Não permitido
        },
      };

      await assert.rejects(
        async () => {
          await decryptVault(insecureEnvelope, testPassword);
        },
        (err: Error) => {
          assert.match(err.message, /algoritmo de cifra não suportado/i);
          return true;
        }
      );
    });

    it('deve rejeitar formato ou versão desconhecida', async () => {
      const envelope = await encryptVault(samplePayload, testPassword, 100000);
      const invalidVersionEnvelope = {
        ...envelope,
        formatVersion: 99, // Versão futura desconhecida
      };

      await assert.rejects(
        async () => {
          await decryptVault(invalidVersionEnvelope, testPassword);
        },
        (err: Error) => {
          assert.match(err.message, /versão de formato não suportada/i);
          return true;
        }
      );
    });
  });

  // 5. Integridade Relacional e Isolamento entre Crianças
  describe('5. Integridade Relacional e Isolamento na Decifragem', () => {
    it('deve rejeitar cofre cujo conteúdo interno declare criança diferente do cabeçalho', async () => {
      // Cria payload forjando perfil de Lia mas com childId 'tomas'
      const mismatchedPayload: VaultPayload = {
        ...samplePayload,
        childProfile: {
          ...MOCK_PROFILE_TOMAS,
          id: 'lia', // Divergente
        },
      };

      // Cifra diretamente
      const envelope = await encryptVault(mismatchedPayload, testPassword, 100000);
      // Força childId de volta no envelope para simular discrepância interna
      const forcedEnvelope = {
        ...envelope,
        childId: 'tomas',
      };

      await assert.rejects(
        async () => {
          await decryptVault(forcedEnvelope, testPassword);
        },
        (err: Error) => {
          assert.match(err.message, /inconsistência de AAD|inconsistência de isolamento/i);
          return true;
        }
      );
    });
  });

  // 6. Limite de Tamanho e Tratamento de Arquivo
  describe('6. Limites de Tamanho e Robustez de Entrada de Arquivo', () => {
    it('deve rejeitar arquivo que exceda 5 MB', () => {
      const hugeString = 'x'.repeat(6 * 1024 * 1024); // 6 MB
      assert.throws(
        () => {
          parseVaultFileString(hugeString, 5 * 1024 * 1024);
        },
        (err: Error) => {
          assert.match(err.message, /excede o limite máximo permitido/i);
          return true;
        }
      );
    });

    it('deve rejeitar string que não seja JSON válido', () => {
      assert.throws(
        () => {
          parseVaultFileString('isto nao é um json válido');
        },
        (err: Error) => {
          assert.match(err.message, /não contém uma estrutura json válida/i);
          return true;
        }
      );
    });
  });
});
