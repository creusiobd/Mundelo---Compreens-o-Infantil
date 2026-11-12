/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChildProfile, Observation, Caregiver } from '../types';

export const VAULT_FORMAT_IDENTIFIER = 'MUNDELO_VAULT';
export const VAULT_CURRENT_VERSION = 1;
export const VAULT_DEFAULT_PBKDF2_ITERATIONS = 600000;
export const VAULT_MIN_PBKDF2_ITERATIONS = 100000;
export const VAULT_MAX_PBKDF2_ITERATIONS = 1000000;
export const VAULT_MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface VaultCryptoHeader {
  algorithm: 'AES-GCM';
  keyLength: 256;
  iv: string; // Base64 (12 bytes)
  kdf: 'PBKDF2';
  kdfHash: 'SHA-256';
  kdfIterations: number;
  kdfSalt: string; // Base64 (16 bytes)
  aad: string; // Base64 do AAD canônico
}

/**
 * Envelope público versionado do cofre criptografado
 */
export interface MundeloVaultEnvelopeV1 {
  format: typeof VAULT_FORMAT_IDENTIFIER;
  formatVersion: 1;
  appVersion: string;
  exportedAt: string; // ISO 8601
  childId: string;
  childName: string;
  recordCount: number;
  crypto: VaultCryptoHeader;
  ciphertext: string; // Base64 (AES-GCM ciphertext + 16 bytes auth tag)
}

/**
 * Payload descriptografado contendo os dados infantis sintéticos
 */
export interface VaultPayload {
  version: 1;
  exportedAt: string;
  childProfile: ChildProfile;
  observations: Observation[];
  linkedCaregivers: Caregiver[];
  metadata: {
    origin: string;
    description: string;
    isSyntheticData: true;
  };
}

/**
 * Resultado da análise preliminar de importação para exibição de prévia
 */
export interface VaultImportPreview {
  childProfile: ChildProfile;
  observationCount: number;
  newObservations: Observation[];
  conflictingObservations: {
    existing: Observation;
    incoming: Observation;
  }[];
  caregivers: Caregiver[];
  exportedAt: string;
}
