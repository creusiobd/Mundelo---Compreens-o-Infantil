/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import {
  VAULT_FORMAT_IDENTIFIER,
  VAULT_MIN_PBKDF2_ITERATIONS,
  VAULT_MAX_PBKDF2_ITERATIONS,
} from './types';
import { ChildProfileSchema, ObservationSchema, CaregiverSchema } from '../validation/schemas';

export const VaultCryptoHeaderSchema = z.object({
  algorithm: z.literal('AES-GCM', {
    message: 'Algoritmo de cifra não suportado. Requer AES-GCM.',
  }),
  keyLength: z.literal(256, {
    message: 'Tamanho de chave não suportado. Requer 256 bits.',
  }),
  iv: z
    .string()
    .min(16, 'IV inválido (deve possuir 12 bytes em base64).')
    .max(32, 'IV excessivamente longo.')
    .regex(/^[A-Za-z0-9+/]+={0,2}$/, 'IV deve conter apenas caracteres Base64 válidos.'),
  kdf: z.literal('PBKDF2', {
    message: 'Função KDF não suportada. Requer PBKDF2.',
  }),
  kdfHash: z.literal('SHA-256', {
    message: 'Hash de derivação não suportado. Requer SHA-256.',
  }),
  kdfIterations: z
    .number()
    .int()
    .min(
      VAULT_MIN_PBKDF2_ITERATIONS,
      `Iterações de PBKDF2 inseguras (mínimo exigido: ${VAULT_MIN_PBKDF2_ITERATIONS}).`
    )
    .max(
      VAULT_MAX_PBKDF2_ITERATIONS,
      `Iterações de PBKDF2 excessivas (máximo permitido: ${VAULT_MAX_PBKDF2_ITERATIONS}).`
    ),
  kdfSalt: z
    .string()
    .min(20, 'Salt criptográfico inválido (mínimo de 16 bytes em base64).')
    .max(128, 'Salt criptográfico excessivamente longo.')
    .regex(/^[A-Za-z0-9+/]+={0,2}$/, 'Salt deve conter apenas caracteres Base64 válidos.'),
  aad: z.string().min(1, 'Dados autenticados associados (AAD) são obrigatórios.').max(512),
});

export const VaultEnvelopeSchema = z.object({
  format: z.literal(VAULT_FORMAT_IDENTIFIER, {
    message: 'Formato de arquivo inválido. Deve ser um cofre MUNDELO_VAULT.',
  }),
  formatVersion: z.literal(1, {
    message: 'Versão de formato não suportada. Esta versão do Mundelo aceita apenas o formato v1.',
  }),
  appVersion: z.string().min(1).max(64),
  exportedAt: z.string().min(10, 'Data de exportação inválida.').max(64),
  childId: z.string().min(1, 'Identificador da criança no cofre é obrigatório.').max(128),
  childName: z.string().min(1, 'Nome da criança no cofre é obrigatório.').max(128),
  recordCount: z.number().int().nonnegative().max(5000),
  crypto: VaultCryptoHeaderSchema,
  ciphertext: z
    .string()
    .min(16, 'Texto cifrado vazio ou corrompido.')
    .max(10 * 1024 * 1024)
    .regex(/^[A-Za-z0-9+/]+={0,2}$/, 'Ciphertext deve conter apenas caracteres Base64 válidos.'),
});

export const VaultPayloadSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string().min(10).max(64),
  childProfile: ChildProfileSchema,
  observations: z
    .array(ObservationSchema)
    .max(2000, 'Limite de observações por cofre excedido (máximo: 2000).'),
  linkedCaregivers: z
    .array(CaregiverSchema)
    .max(50, 'Limite de cuidadores por cofre excedido (máximo: 50).'),
  metadata: z.object({
    origin: z.string().max(256),
    description: z.string().max(1000),
    isSyntheticData: z.literal(true, {
      message: 'O cofre deve declarar expressamente dados 100% sintéticos.',
    }),
  }),
});
