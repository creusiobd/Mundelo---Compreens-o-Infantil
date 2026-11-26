/**
 * PG06-N04: contrato executável para uma futura fronteira persistente.
 * PROIBIDO usar decisões a partir do estado React ou de payload do cliente.
 * Este módulo puro NÃO implementa banco/RLS, identidade ou compartilhamento real.
 */
export type AccessOperation = 'READ'|'USE'|'PREPARE'|'SHARE'|'EXPORT';
export type AccessCategory = 'OBSERVATION'|'INTERPRETATION'|'CONTEXT'|'RELATION';
export type DecisionReason = 'DENIED'|'PENDING_VERIFICATION'|'STALE_AUTHORITY'|'STALE_SOURCE';
export type Decision = Readonly<{status:'ALLOW'}> | Readonly<{status:'BLOCK';reason:DecisionReason}>;

export type AuthenticatedActor = Readonly<{
  subjectId:string;
  authenticated:boolean;
}>;
export type Grant = Readonly<{
  id:string;
  childId:string;
  recipientId:string;
  grantedById:string;
  // Authority must already have been verified independently and cannot be inferred from role.
  authorityVerified:boolean;
  state:'ACTIVE'|'REVOKED'|'EXPIRED';
  revision:number;
  purpose:string;
  operations:readonly AccessOperation[];
  categories:readonly AccessCategory[];
  sourceIds:readonly string[];
  // null means all available versions, never implicitly granted.
  allowedVersions:Readonly<Record<string,readonly number[]>>;
  validFrom:string;
  validUntil:string;
}>;
export type Source = Readonly<{
  id:string;
  childId:string;
  version:number;
  category:AccessCategory;
  restricted:boolean;
}>;
export type PolicySnapshot = Readonly<{
  policyRevision:number;
  restrictionRevision:number;
  grants:readonly Grant[];
  sources:readonly Source[];
}>;
export type AccessRequest = Readonly<{
  actor:AuthenticatedActor;
  operation:AccessOperation;
  childId:string;
  purpose:string;
  sourceRefs:readonly Readonly<{id:string;version:number}>[];
  recipientId?:string;
  expectedPolicyRevision:number;
  expectedRestrictionRevision:number;
  expectedGrantRevisions:Readonly<Record<string,number>>;
  evaluatedAt:string;
}>;

export function evaluateAccess(snapshot:PolicySnapshot,req:AccessRequest):Decision {
  if (!req.actor.authenticated || !req.actor.subjectId || !req.childId ||
      !req.purpose || !Number.isSafeInteger(req.expectedPolicyRevision) ||
      !Number.isSafeInteger(req.expectedRestrictionRevision) ||
      !Number.isFinite(Date.parse(req.evaluatedAt))) return {status:'BLOCK',reason:'DENIED'};
  if(snapshot.policyRevision!==req.expectedPolicyRevision ||
     snapshot.restrictionRevision!==req.expectedRestrictionRevision)
    return {status:'BLOCK',reason:'STALE_AUTHORITY'};
  if(!req.sourceRefs.length || !req.recipientId || req.recipientId!==req.actor.subjectId)
    return {status:'BLOCK',reason:'DENIED'};
  const refs=new Set(req.sourceRefs.map(x=>x.id+':'+x.version));
  if(refs.size!==req.sourceRefs.length) return {status:'BLOCK',reason:'DENIED'};
  for(const ref of req.sourceRefs){
    const source=snapshot.sources.find(x=>x.id===ref.id && x.version===ref.version);
    if(!source || source.childId!==req.childId) return {status:'BLOCK',reason:'DENIED'};
    if(source.restricted) return {status:'BLOCK',reason:'DENIED'};
    const grants=snapshot.grants.filter(g=>g.recipientId===req.actor.subjectId &&
      g.childId===req.childId && g.purpose===req.purpose &&
      g.sourceIds.includes(source.id) && g.categories.includes(source.category) &&
      g.operations.includes(req.operation) && g.allowedVersions[source.id]?.includes(source.version));
    if(!grants.length) return {status:'BLOCK',reason:'DENIED'};
    // At least one applicable grant must be valid; absence of verified authority blocks delivery.
    const eligible=grants.some(g=>
      g.authorityVerified && g.state==='ACTIVE' &&
      Number.isFinite(Date.parse(g.validFrom)) && Number.isFinite(Date.parse(g.validUntil)) &&
      Date.parse(g.validFrom)<=Date.parse(req.evaluatedAt) &&
      Date.parse(req.evaluatedAt)<Date.parse(g.validUntil) &&
      req.expectedGrantRevisions[g.id]===g.revision);
    if(!eligible){
      if(grants.some(g=>!g.authorityVerified)) return {status:'BLOCK',reason:'PENDING_VERIFICATION'};
      return {status:'BLOCK',reason:'STALE_AUTHORITY'};
    }
  }
  return {status:'ALLOW'};
}
/** A prepared decision is not an effect. Re-evaluate with a trusted latest snapshot. */
export function authorizeEffect(current:PolicySnapshot,request:AccessRequest):Decision {
  return evaluateAccess(current,request);
}
/** No partial source, count, list, title or relation is returned on blocked requests. */
export function selectPermittedSources(current:PolicySnapshot,request:AccessRequest):
  Readonly<{status:'ALLOW'; sources:readonly Source[]}> | Readonly<{status:'BLOCK';reason:DecisionReason}> {
  const decision=authorizeEffect(current,request);
  if(decision.status==='BLOCK') return decision;
  const selected=request.sourceRefs.map(ref=>current.sources.find(x=>x.id===ref.id && x.version===ref.version));
  if(selected.some(x=>!x)) return {status:'BLOCK',reason:'STALE_SOURCE'};
  return {status:'ALLOW',sources:selected as Source[]};
}
