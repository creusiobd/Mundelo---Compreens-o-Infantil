/** PG06-N07: synthetic-only executable governance contracts.
 * This is not a legal authorization decision, database policy, or real export endpoint.
 */
export type Op = 'READ'|'USE'|'EXPORT'|'SHARE';
export type Category = 'C01'|'C02'|'C03'|'C04'|'C05'|'C06'|'C07'|'C08'|'C09'|'C10';
export type AuthorityCheck = Readonly<{
  actorId:string;
  childId:string;
  operation:Op;
  category:Category;
  purpose:string;
  recipientId:string;
  // Externally verified, operation-specific evidence; client role is never sufficient.
  verificationReference:string|null;
  verifiedByCompetentReviewer:boolean;
  legalBasisApproved:boolean;
  bestInterestCaseReviewed:boolean;
  conflictOfRepresentativesResolved:boolean;
  validUntil:number;
}>;
export type VersionRef = Readonly<{id:string;version:number;childId:string}>;
export type Unit = Readonly<{
  ref:VersionRef;category:Category;body:string;authorId:string;
  interpreterId:string|null;sourceRefs:readonly VersionRef[];
  recordedAt:number;priorVersion:number|null;
  retained:boolean;restricted:boolean;
}>;
export type ScopedGrant = Readonly<{
  recipientId:string;childId:string;purpose:string;operation:Op;
  category:Category;sourceId:string;versions:readonly number[];
  revision:number;active:boolean;
}>;
export type Verdict = Readonly<{ok:true}>|Readonly<{ok:false;reason:string}>;
const deny=(reason:string):Verdict=>({ok:false,reason});
const same=(a:VersionRef,b:VersionRef)=>a.id===b.id && a.version===b.version && a.childId===b.childId;
const key=(r:VersionRef)=>[r.childId,r.id,r.version].join(':');
export function canAuthorizeGrant(input:AuthorityCheck,at:number):Verdict {
 if(!input.actorId||!input.childId||!input.recipientId||!input.purpose||
  !input.verificationReference||!input.verifiedByCompetentReviewer||
  !input.legalBasisApproved||!input.bestInterestCaseReviewed||
  !input.conflictOfRepresentativesResolved||!Number.isFinite(at)||
  !Number.isFinite(input.validUntil)||at>=input.validUntil) return deny('LEGAL_REVIEW_PENDING');
 return {ok:true};
}
/** A revision is an attributed new unit; no retroactive authorship inference. */
export function appendRevision(history:readonly Unit[],next:Unit,actorId:string):{ok:true;history:readonly Unit[]}|{ok:false;reason:string} {
 const own=history.filter(u=>u.ref.id===next.ref.id&&u.ref.childId===next.ref.childId);
 const last=own[own.length-1];
 if(!last||next.ref.version!==last.ref.version+1||next.priorVersion!==last.ref.version)
   return {ok:false,reason:'VERSION_CONFLICT'};
 if(!actorId||last.authorId!==actorId||next.authorId!==last.authorId||
   next.recordedAt<last.recordedAt) return {ok:false,reason:'AUTHOR_CONFLICT'};
 if(last.interpreterId!==next.interpreterId &&
   (last.interpreterId!==null || next.interpreterId!==actorId)) return {ok:false,reason:'INTERPRETER_CONFLICT'};
 if(last.interpreterId!==actorId && last.interpreterId!==null && next.body!==last.body)
   return {ok:false,reason:'INTERPRETER_CONFLICT'};
 if(next.ref.childId!==last.ref.childId||next.category!==last.category)
   return {ok:false,reason:'SCOPE_CONFLICT'};
 return {ok:true,history:[...history,structuredClone(next)]};
}
/** An interpretation derived from sources has independently attributed authorship;
 * source list is exact, not "best effort", and cannot be cyclic.
 */
export function validateDerivation(units:readonly Unit[],derivative:Unit):Verdict {
 if(!derivative.sourceRefs.length||derivative.category!=='C04')return deny('SOURCE_REQUIRED');
 const all=new Map(units.map(u=>[key(u.ref),u]));
 const keys=new Set<string>();
 for(const ref of derivative.sourceRefs){
  const k=key(ref);const src=all.get(k);
  if(!src||!src.retained||src.restricted||src.ref.childId!==derivative.ref.childId)
    return deny('SOURCE_UNAVAILABLE');
  if(keys.has(k)||same(ref,derivative.ref))return deny('INVALID_LINEAGE');
  keys.add(k);
 }
 if(!derivative.authorId||derivative.interpreterId===null)return deny('ATTRIBUTION_REQUIRED');
 return {ok:true};
}
export type ExportRequest = Readonly<{actorId:string;childId:string;purpose:string;recipientId:string;refs:readonly VersionRef[]}>;
export type ExportResult = Readonly<{ok:true;items:readonly Unit[]}>|Readonly<{ok:false;reason:string}>;
/** Demonstrative serializer selection only. No file, network, or export capability. */
export function selectExport(units:readonly Unit[],grants:readonly ScopedGrant[],req:ExportRequest):ExportResult {
 if(!req.actorId||!req.purpose||!req.recipientId||!req.refs.length)return {ok:false,reason:'DENIED'};
 const seen=new Set<string>();
 const selected:Unit[]=[];
 for(const ref of req.refs){
  const k=key(ref);
  if(seen.has(k)||ref.childId!==req.childId)return {ok:false,reason:'DENIED'};
  seen.add(k);
  const source=units.find(u=>same(u.ref,ref));
  if(!source||source.restricted||!source.retained)return {ok:false,reason:'DENIED'};
  if(!grants.some(g=>g.active&&g.recipientId===req.actorId&&g.childId===req.childId&&
    g.purpose===req.purpose&&g.operation==='EXPORT'&&g.category===source.category&&
    g.sourceId===source.ref.id&&g.versions.includes(ref.version)))return {ok:false,reason:'DENIED'};
  selected.push(structuredClone(source));
 }
 return {ok:true,items:selected};
}
export type Tombstone=Readonly<{ref:VersionRef;decidedAt:number;authorityReference:string;verified:boolean}>;
/** Post-restore reconciliation must remove a previously deleted unit again;
 * restoring technical bytes does not reinstate permission or its content.
 */
export function reconcileRestored(units:readonly Unit[],tombstones:readonly Tombstone[]):{ok:true;units:readonly Unit[]}|{ok:false;reason:string}{
 if(tombstones.some(t=>!t.verified||!t.authorityReference||!Number.isFinite(t.decidedAt)))
   return {ok:false,reason:'RESTORE_QUARANTINE'};
 const deleted=new Set(tombstones.map(t=>key(t.ref)));
 return {ok:true,units:units.filter(u=>!deleted.has(key(u.ref))).map(u=>structuredClone(u))};
}
