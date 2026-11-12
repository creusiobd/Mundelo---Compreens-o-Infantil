/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Observation } from '../types';
import { validateObservation } from './schemas';

/**
 * Função de migração canônica de registros da Foundation v0.2 para Foundation v0.3.
 * Preserva integralmente o histórico, atribuindo proveniência estruturada,
 * cuidador registrador e revisão inicial #1.
 */
export function migrateObservationV2ToV3(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  legacy: any,
  fallbackCaregiverId = 'cg-helena'
): Observation {
  if (!legacy || typeof legacy !== 'object') {
    throw new Error('Registro legado inválido para migração.');
  }

  const provenance = legacy.provenance === 'REPORTED_BY_OTHER' ? 'REPORTED_BY_OTHER' : 'DIRECT';
  const recordedByCaregiverId =
    legacy.recordedByCaregiverId || legacy.caregiverId || fallbackCaregiverId;

  const observedByCaregiverId =
    legacy.observedByCaregiverId ||
    (provenance === 'DIRECT' ? (legacy.caregiverId || fallbackCaregiverId) : undefined);

  const reportedByLabel =
    legacy.reportedByLabel ||
    (provenance === 'REPORTED_BY_OTHER' ? 'Relatado por terceiro' : undefined);

  const revision =
    typeof legacy.revision === 'number' && legacy.revision >= 1 ? legacy.revision : 1;

  const candidate: Observation = {
    id: legacy.id || `migrated-${Date.now()}`,
    childId: legacy.childId || 'tomas',
    recordedByCaregiverId,
    observedByCaregiverId,
    reportedByLabel,
    provenance,
    occurredAt: legacy.occurredAt || new Date().toISOString().slice(0, 16),
    recordedAt: legacy.recordedAt || new Date().toISOString(),
    updatedAt: legacy.updatedAt,
    revision,
    environment: legacy.environment || 'casa',
    observerRole: legacy.observerRole || 'mae',
    eventType: legacy.eventType || 'conquista',
    description: legacy.description || 'Observação migrada sem descrição detalhada.',
    antecedents: legacy.antecedents || 'Não observado',
    communicationSignals: legacy.communicationSignals || 'Não observado',
    supportOffered: legacy.supportOffered || 'Apenas observação atenta',
    observedOutcome: legacy.observedOutcome || 'Não observado',
    positiveAspects: legacy.positiveAspects || 'Não observado',
    notes: legacy.notes || 'Registro migrado da versão v0.2.',
  };

  return validateObservation(candidate);
}

/**
 * Migra lote de observações legadas
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function migrateObservationBatch(batch: any[], fallbackCaregiverId = 'cg-helena'): Observation[] {
  return batch.map((item) => migrateObservationV2ToV3(item, fallbackCaregiverId));
}
