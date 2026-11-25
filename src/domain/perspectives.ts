/**
 * PG06-N02: núcleo puro e experimental de perspectivas. Apenas dados sintéticos.
 * Não é fronteira de autorização, persistência, consentimento ou retenção.
 */
export type EvidenceState = 'INFORMED' | 'UNKNOWN' | 'NOT_OBSERVED' | 'NOT_APPLICABLE';
export type Claim = Readonly<{ state: EvidenceState; text?: string }>;
export type Attribution = Readonly<{
  recorderId: string; // sujeito autenticado no ensaio, nunca autor automático de interpretação
  observerId?: string;
  reportedByLabel?: string; // alegação textual, não identidade verificada
  interpreterId?: string; // somente se fornecido explicitamente
}>;
export type Perspective = Readonly<{
  id: string;
  childId: string;
  version: number;
  observation: Claim;
  interpretation: Claim;
  context: Claim;
  occurredAt?: string; // nunca inferir a partir de ingestão
  recordedAt: string;
  attribution: Attribution;
  relatesTo?: Readonly<{ id: string; version: number; relation: 'CONTESTS' | 'CONTEXTUALIZES' }>;
  previousVersion?: number;
  changedBy?: string; // ato de edição, não autoria retroativa
}>;

export type Permission = Readonly<{
  current: boolean;
  actorId: string;
  allowedOperations: readonly ('CREATE' | 'REVISE' | 'CONTEST' | 'READ' | 'USE')[];
  childIds: readonly string[];
}>;
export type Result<T> = { ok: true; value: T } | { ok: false; reason: 'DENIED' | 'CONFLICT' | 'INVALID' | 'UNVERIFIED' };

export function claim(state: EvidenceState, text?: string): Claim {
  if (state === 'INFORMED' && (!text || !text.trim())) throw new Error('INFORMED requer texto');
  if (state !== 'INFORMED' && text !== undefined) throw new Error('lacuna não recebe texto presumido');
  return state === 'INFORMED' ? {state, text} : {state};
}
export function permitted(permission: Permission, childId: string, operation: Permission['allowedOperations'][number]): boolean {
  return permission.current && permission.childIds.includes(childId) && permission.allowedOperations.includes(operation);
}
export function registerPerspective(input: Perspective, permission: Permission): Result<Perspective> {
  if (!permitted(permission,input.childId,'CREATE') || input.attribution.recorderId !== permission.actorId) return {ok:false,reason:'DENIED'};
  if (!input.id.trim() || !input.childId.trim() || input.version !== 1 || input.previousVersion !== undefined ||
      !input.recordedAt || (input.interpretation.state === 'INFORMED' && !input.attribution.interpreterId))
    return {ok:false,reason:'INVALID'};
  return {ok:true,value:structuredClone(input)};
}
export function revisePerspective(current: Perspective, next: Perspective, permission: Permission): Result<Perspective> {
  if (!permitted(permission,current.childId,'REVISE')) return {ok:false,reason:'DENIED'};
  if (next.id !== current.id || next.childId !== current.childId || next.previousVersion !== current.version ||
      next.version !== current.version + 1) return {ok:false,reason:'CONFLICT'};
  if (next.attribution.recorderId !== current.attribution.recorderId || next.changedBy !== permission.actorId ||
      (next.interpretation.state === 'INFORMED' && !next.attribution.interpreterId)) return {ok:false,reason:'INVALID'};
  return {ok:true,value:structuredClone(next)};
}
export function contestPerspective(target: Perspective, dissent: Perspective, permission: Permission): Result<Perspective> {
  if (!permitted(permission,target.childId,'CONTEST')) return {ok:false,reason:'DENIED'};
  if (dissent.childId !== target.childId || dissent.relatesTo?.id !== target.id ||
      dissent.relatesTo.version !== target.version || dissent.relatesTo.relation !== 'CONTESTS' ||
      dissent.id === target.id || dissent.version !== 1 ||
      dissent.attribution.recorderId !== permission.actorId) return {ok:false,reason:'INVALID'};
  return {ok:true,value:structuredClone(dissent)};
}
export function canUseForSummary(perspectives: readonly Perspective[], permission: Permission): boolean {
  // No partial disclosure: no identifiers, counts or derived text should be emitted on failure.
  return perspectives.length > 0 && perspectives.every(p => permitted(permission,p.childId,'READ') &&
    permitted(permission,p.childId,'USE') && p.context.state === 'INFORMED');
}
export type LegacyRecord = Readonly<{
  id: string; childId: string; recordedByCaregiverId?: string;
  notes?: string; revision?: number; updatedAt?: string; importedAt: string;
}>;
export function describeLegacy(record: LegacyRecord) {
  // Retain declared metadata only. Do not manufacture previous versions/author or event time.
  return {
    id: record.id, childId: record.childId,
    recorderClaim: record.recordedByCaregiverId ?? null,
    interpretationAuthor: null,
    editor: null,
    occurredAt: null,
    declaredRevision: record.revision ?? null,
    declaredUpdatedAt: record.updatedAt ?? null,
    importedAt: record.importedAt,
    historicalVersionsVerified: false,
  } as const;
}
