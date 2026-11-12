/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Observation, ObservationContext, EvidenceRecord } from '../types';

export type ConflictResolutionAction =
  | 'INSERT'
  | 'KEEP'
  | 'NOOP'
  | 'UPDATE'
  | 'CONFLICT';

export interface ConflictResolutionResult {
  action: ConflictResolutionAction;
  observation?: Observation;
  reason: string;
  divergentFields?: string[];
}

export interface BatchResolutionResult {
  success: boolean;
  actionCounts: {
    INSERT: number;
    KEEP: number;
    NOOP: number;
    UPDATE: number;
    CONFLICT: number;
  };
  resolvedObservations: Observation[];
  conflicts: {
    incomingId: string;
    existingId?: string;
    reason: string;
    divergentFields?: string[];
  }[];
}

/**
 * Normaliza strings para comparação canônica eliminando variações irrelevantes de espaços
 */
function normalizeString(val: string | undefined | null): string {
  if (val === undefined || val === null) return '';
  return val.trim();
}

/**
 * Compara contextDetails estruturalmente sem depender de ordenação de propriedades
 */
function compareContextDetails(
  a?: ObservationContext,
  b?: ObservationContext
): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;

  if (a.environment !== b.environment) return false;
  if (normalizeString(a.locationDetail) !== normalizeString(b.locationDetail)) return false;
  if (normalizeString(a.antecedents) !== normalizeString(b.antecedents)) return false;

  const peopleA = (a.peoplePresent || []).map(normalizeString).sort();
  const peopleB = (b.peoplePresent || []).map(normalizeString).sort();
  if (peopleA.length !== peopleB.length) return false;
  for (let i = 0; i < peopleA.length; i++) {
    if (peopleA[i] !== peopleB[i]) return false;
  }

  return true;
}

/**
 * Compara evidenceDetails estruturalmente
 */
function compareEvidenceDetails(
  a?: EvidenceRecord,
  b?: EvidenceRecord
): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;

  return (
    normalizeString(a.communicationSignals) === normalizeString(b.communicationSignals) &&
    normalizeString(a.supportOffered) === normalizeString(b.supportOffered) &&
    normalizeString(a.observedOutcome) === normalizeString(b.observedOutcome) &&
    normalizeString(a.positiveAspects) === normalizeString(b.positiveAspects)
  );
}

/**
 * Compara dois registros de observação estruturalmente, identificando campos divergentes
 */
export function compareObservationContent(
  a: Observation,
  b: Observation
): { isIdentical: boolean; divergentFields: string[] } {
  const divergentFields: string[] = [];

  // Campos imutáveis
  if (a.id !== b.id) divergentFields.push('id');
  if (a.childId !== b.childId) divergentFields.push('childId');
  if (normalizeString(a.recordedAt) !== normalizeString(b.recordedAt)) divergentFields.push('recordedAt');
  if (a.recordedByCaregiverId !== b.recordedByCaregiverId) divergentFields.push('recordedByCaregiverId');

  // Metadados de proveniência
  if (a.provenance !== b.provenance) divergentFields.push('provenance');
  if (normalizeString(a.observedByCaregiverId) !== normalizeString(b.observedByCaregiverId)) divergentFields.push('observedByCaregiverId');
  if (normalizeString(a.reportedByLabel) !== normalizeString(b.reportedByLabel)) divergentFields.push('reportedByLabel');

  // Conteúdo contextual e temporal
  if (normalizeString(a.occurredAt) !== normalizeString(b.occurredAt)) divergentFields.push('occurredAt');
  if (a.environment !== b.environment) divergentFields.push('environment');
  if (a.observerRole !== b.observerRole) divergentFields.push('observerRole');
  if (a.eventType !== b.eventType) divergentFields.push('eventType');
  if (normalizeString(a.description) !== normalizeString(b.description)) divergentFields.push('description');
  if (normalizeString(a.antecedents) !== normalizeString(b.antecedents)) divergentFields.push('antecedents');
  if (normalizeString(a.communicationSignals) !== normalizeString(b.communicationSignals)) divergentFields.push('communicationSignals');
  if (normalizeString(a.supportOffered) !== normalizeString(b.supportOffered)) divergentFields.push('supportOffered');
  if (normalizeString(a.observedOutcome) !== normalizeString(b.observedOutcome)) divergentFields.push('observedOutcome');
  if (normalizeString(a.positiveAspects) !== normalizeString(b.positiveAspects)) divergentFields.push('positiveAspects');
  if (normalizeString(a.notes) !== normalizeString(b.notes)) divergentFields.push('notes');

  // Objetos aninhados
  if (!compareContextDetails(a.contextDetails, b.contextDetails)) divergentFields.push('contextDetails');
  if (!compareEvidenceDetails(a.evidenceDetails, b.evidenceDetails)) divergentFields.push('evidenceDetails');

  return {
    isIdentical: divergentFields.length === 0,
    divergentFields,
  };
}

/**
 * Função pura e determinística para resolver conflito entre uma observação existente e uma importada.
 *
 * Regras estritas:
 * 1. Registro ausente: INSERT se pertencer à criança alvo.
 * 2. Cross-child ID: CONFLICT se childId divergir da criança alvo ou da observação existente.
 * 3. Revisão importada menor: KEEP (preserva o registro local mais recente).
 * 4. Revisão igual e dados idênticos: NOOP (idempotente).
 * 5. Revisão igual e dados divergentes: CONFLICT (rejeita sobrescrita silenciosa; sem last-write-wins).
 * 6. Revisão superior:
 *    - Se campos imutáveis (id, childId, recordedAt, recordedByCaregiverId) forem preservados: UPDATE.
 *    - Se campos imutáveis foram adulterados: CONFLICT.
 */
export function resolveObservationConflict(
  existing: Observation | undefined,
  incoming: Observation,
  targetChildId: string
): ConflictResolutionResult {
  // 1. Verificação de integridade relacional entre crianças
  if (incoming.childId !== targetChildId) {
    return {
      action: 'CONFLICT',
      reason: `Violação de isolamento: observação ${incoming.id} declara childId='${incoming.childId}', divergente da criança alvo '${targetChildId}'.`,
      divergentFields: ['childId'],
    };
  }

  // 2. Registro inexistente na base local -> INSERT
  if (!existing) {
    return {
      action: 'INSERT',
      observation: incoming,
      reason: `Observação inédita inserida com sucesso (ID: ${incoming.id}, Rev: ${incoming.revision || 1}).`,
    };
  }

  // 3. ID coincidente, mas pertencente a crianças diferentes -> CONFLICT
  if (existing.childId !== incoming.childId) {
    return {
      action: 'CONFLICT',
      reason: `Colisão de identificador: o ID '${incoming.id}' já existe na base local associado à criança '${existing.childId}'.`,
      divergentFields: ['childId'],
    };
  }

  const existingRev = existing.revision || 1;
  const incomingRev = incoming.revision || 1;

  // 4. Revisão importada menor que a local -> KEEP
  if (incomingRev < existingRev) {
    return {
      action: 'KEEP',
      observation: existing,
      reason: `Registro local possui revisão superior (${existingRev} > ${incomingRev}). Registro local preservado.`,
    };
  }

  // 5. Mesma revisão -> Checagem canônica de dados
  if (incomingRev === existingRev) {
    const comparison = compareObservationContent(existing, incoming);
    if (comparison.isIdentical) {
      return {
        action: 'NOOP',
        observation: existing,
        reason: `Registro idêntico com mesma revisão (${existingRev}). Operação idempotente confirmada.`,
      };
    } else {
      return {
        action: 'CONFLICT',
        reason: `Conflito de mesma revisão (${existingRev}): os dados divergem nos campos [${comparison.divergentFields.join(', ')}]. Sobrescrita recusada para evitar perda de dados.`,
        divergentFields: comparison.divergentFields,
      };
    }
  }

  // 6. Revisão superior (incomingRev > existingRev) -> Validar imutabilidade
  const immutableDivergences: string[] = [];
  if (existing.id !== incoming.id) immutableDivergences.push('id');
  if (existing.childId !== incoming.childId) immutableDivergences.push('childId');
  if (normalizeString(existing.recordedAt) !== normalizeString(incoming.recordedAt)) immutableDivergences.push('recordedAt');
  if (existing.recordedByCaregiverId !== incoming.recordedByCaregiverId) immutableDivergences.push('recordedByCaregiverId');

  if (immutableDivergences.length > 0) {
    return {
      action: 'CONFLICT',
      reason: `Tentativa de adulteração de campos imutáveis na revisão ${incomingRev}: [${immutableDivergences.join(', ')}].`,
      divergentFields: immutableDivergences,
    };
  }

  return {
    action: 'UPDATE',
    observation: incoming,
    reason: `Observação atualizada legitimamente de rev ${existingRev} para rev ${incomingRev}.`,
  };
}

/**
 * Resolve conflitos para um lote completo de observações importadas contra a base existente.
 * Se existir QUALQUER conflito não resolvido, o lote inteiro é abortado atomicamente (zero mutações).
 */
export function resolveObservationBatch(
  existingObservations: Observation[],
  incomingObservations: Observation[],
  targetChildId: string
): BatchResolutionResult {
  const existingMap = new Map<string, Observation>();
  const otherChildrenObs: Observation[] = [];

  for (const obs of existingObservations) {
    if (obs.childId === targetChildId) {
      existingMap.set(obs.id, obs);
    } else {
      otherChildrenObs.push(obs);
    }
  }

  const actionCounts = {
    INSERT: 0,
    KEEP: 0,
    NOOP: 0,
    UPDATE: 0,
    CONFLICT: 0,
  };

  const conflicts: BatchResolutionResult['conflicts'] = [];
  const resolvedTargetMap = new Map<string, Observation>(existingMap);

  for (const incoming of incomingObservations) {
    const existing = existingMap.get(incoming.id);
    const decision = resolveObservationConflict(existing, incoming, targetChildId);

    actionCounts[decision.action]++;

    if (decision.action === 'CONFLICT') {
      conflicts.push({
        incomingId: incoming.id,
        existingId: existing?.id,
        reason: decision.reason,
        divergentFields: decision.divergentFields,
      });
    } else if (decision.observation) {
      resolvedTargetMap.set(decision.observation.id, decision.observation);
    }
  }

  // Se houver qualquer conflito no lote, aborta integralmente
  if (conflicts.length > 0) {
    return {
      success: false,
      actionCounts,
      resolvedObservations: existingObservations, // Mantém estado original intacto
      conflicts,
    };
  }

  // Combina observações da criança alvo resolvidas com observações de outras crianças
  const resolvedObservations = [
    ...Array.from(resolvedTargetMap.values()),
    ...otherChildrenObs,
  ];

  return {
    success: true,
    actionCounts,
    resolvedObservations,
    conflicts: [],
  };
}
