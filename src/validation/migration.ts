/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Observation } from '../types';
import { validateObservation } from './schemas';

/**
 * Validate legacy records without inventing missing historical facts.
 * Complete records remain compatible. Missing required metadata must be
 * reconciled with its source before migration; no caregiver/context fallback.
 * Revision 1 is structural metadata, not evidence of authorship.
 */
export function migrateObservationV2ToV3(legacy: unknown): Observation {
  if (!legacy || typeof legacy !== 'object' || Array.isArray(legacy)) {
    throw new Error('Registro legado inválido para migração.');
  }
  return validateObservation(legacy);
}

export function migrateObservationBatch(batch: unknown[]): Observation[] {
  return batch.map((item) => migrateObservationV2ToV3(item));
}
