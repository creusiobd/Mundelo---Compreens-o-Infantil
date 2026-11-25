/**
 * PG06-N09 | Pure, synthetic-only reassessment of derived interpretations.
 * Does NOT mutate source testimony, grant access, store data or release reports.
 *
 * A derived unit has FOUR independent dispositions. Historical retention is
 * never inferred from freshness or access. Operational defaults fail closed.
 */
import type {Unit, VersionRef, ScopedGrant} from './governanceLifecycle';
import {resolveDependencyClosure} from './derivationClosure';

export type ReassessmentEvent =
 | Readonly<{kind:'SOURCE_REVISED'; previous:VersionRef; replacement:VersionRef}>
 | Readonly<{kind:'INTERPRETATION_CONTESTED'; target:VersionRef; contestation:VersionRef}>
 | Readonly<{kind:'ACCESS_REVOKED'; target:VersionRef; recipientId:string;purpose:string}>
 | Readonly<{kind:'SOURCE_RESTRICTED'; target:VersionRef}>
 | Readonly<{kind:'SOURCE_DISPOSED'; target:VersionRef}>;

export type DerivedDisposition = Readonly<{
 ref:VersionRef;
 validity:'CURRENT'|'REVIEW_REQUIRED'|'UNVERIFIABLE';
 presentation:'ALLOW'|'BLOCK';
 use:'ALLOW'|'BLOCK';
 retention:'UNCHANGED'|'REVIEW_REQUIRED';
 reasons:readonly ('SOURCE_CHANGED'|'INTERPRETATION_CONTESTED'|'PERMISSION_CHANGED'|
  'SOURCE_RESTRICTED'|'SOURCE_DISPOSED'|'INVALID_LINEAGE')[];
}>;

export type ReassessmentResult = Readonly<{
 affected:readonly DerivedDisposition[];
 unaffected:readonly VersionRef[];
}>;

const key=(r:VersionRef)=>JSON.stringify([r.childId,r.id,r.version]);
const same=(a:VersionRef,b:VersionRef)=>key(a)===key(b);
const uniq=<T>(xs:readonly T[]):T[]=>[...new Set(xs)];
const orderedReasons:DerivedDisposition['reasons'][number][]=[
 'SOURCE_CHANGED','INTERPRETATION_CONTESTED','PERMISSION_CHANGED',
 'SOURCE_RESTRICTED','SOURCE_DISPOSED','INVALID_LINEAGE'
];

/** Impacts must be recomputed from the complete trusted source snapshot at effect time.
 * Access checks are receiver/purpose-specific; this function never returns content.
 */
export function reassessDerivatives(
 units:readonly Unit[],
 grants:readonly ScopedGrant[],
 events:readonly ReassessmentEvent[],
 recipientId:string,
 purpose:string
):ReassessmentResult {
 // Aggregate by exact version, never by name, inferred author or text.
 const byKey=new Map<string,Unit>();
 const ambiguous=new Set<string>();
 for(const unit of units){
  const k=key(unit.ref);
  if(byKey.has(k))ambiguous.add(k);
  byKey.set(k,unit);
 }
 const impact=new Map<string,Set<DerivedDisposition['reasons'][number]>>();
 const childDerivatives=units.filter(u=>u.category==='C04');
 const depCache=new Map<string,Set<string>>();
 const lineage=(unit:Unit):Set<string>=>{
  const k=key(unit.ref);
  if(depCache.has(k))return depCache.get(k)!;
  const seen=new Set<string>();
  const stack=[...unit.sourceRefs];
  // Fixed finite bound to avoid event-sourced cycles creating infinite loops.
  let budget=units.length*units.length+1;
  while(stack.length && budget-->0){
   const ref=stack.pop()!,id=key(ref);
   if(seen.has(id))continue;
   seen.add(id);
   const source=byKey.get(id);
   if(source)stack.push(...source.sourceRefs);
  }
  depCache.set(k,seen);
  return seen;
 };
 for(const unit of childDerivatives){
  const id=key(unit.ref),ancestors=lineage(unit),reasons=new Set<DerivedDisposition['reasons'][number]>();
  for(const event of events){
   const target=event.kind==='SOURCE_REVISED'?event.previous:event.target;
   if(target.childId!==unit.ref.childId || (!ancestors.has(key(target))&&!same(unit.ref,target)))
     continue;
   if(event.kind==='SOURCE_REVISED' && !same(event.previous,event.replacement))
     reasons.add('SOURCE_CHANGED');
   if(event.kind==='INTERPRETATION_CONTESTED')
     reasons.add('INTERPRETATION_CONTESTED');
   if(event.kind==='SOURCE_RESTRICTED')reasons.add('SOURCE_RESTRICTED');
   if(event.kind==='SOURCE_DISPOSED')reasons.add('SOURCE_DISPOSED');
   if(event.kind==='ACCESS_REVOKED' && event.recipientId===recipientId && event.purpose===purpose)
     reasons.add('PERMISSION_CHANGED');
  }
  const closure=resolveDependencyClosure(units,[unit.ref]);
  if(!closure.ok || ambiguous.has(id) || [...ancestors].some(x=>ambiguous.has(x)))
    reasons.add('INVALID_LINEAGE');
  if(!reasons.size)continue;
  impact.set(id,reasons);
 }
 const affected:DerivedDisposition[]=[];
 const unaffected:VersionRef[]=[];
 for(const unit of childDerivatives){
  const reasons=impact.get(key(unit.ref));
  if(!reasons){unaffected.push({...unit.ref});continue;}
  const hard=reasons.has('INVALID_LINEAGE')||reasons.has('SOURCE_DISPOSED')||
             reasons.has('SOURCE_RESTRICTED');
  const closure=resolveDependencyClosure(units,[unit.ref]);
  const complete=closure.ok?closure.units:[];
  // Both READ and USE must remain permitted for all ancestors.
  const permits=(operation:'READ'|'USE')=>complete.length>0 && complete.every(source=>
   grants.some(g=>g.active && g.recipientId===recipientId && g.childId===source.ref.childId &&
      g.purpose===purpose && g.operation===operation &&
      g.category===source.category && g.sourceId===source.ref.id &&
      g.versions.includes(source.ref.version)));
  const accessChanged=reasons.has('PERMISSION_CHANGED')||!permits('READ')||!permits('USE');
  if(accessChanged)reasons.add('PERMISSION_CHANGED');
  // Any event affecting the synthesis suspends presentation and use until an
  // explicit revalidation operation; no auto-approval after a later grant.
  affected.push({
   ref:{...unit.ref},
   validity:hard?'UNVERIFIABLE':'REVIEW_REQUIRED',
   presentation:'BLOCK',
   use:'BLOCK',
   retention:'REVIEW_REQUIRED',
   reasons:orderedReasons.filter(x=>reasons.has(x))
  });
 }
 return {affected,unaffected};
}

/** This is the only viewer-safe projection. Never expose affected unit IDs,
 * event details, source counts or denial causes to an unauthorized caller.
 * The real API must verify authority independently before using internal results.
 */
export function redactReassessment(result:ReassessmentResult,authorized:boolean):
  Readonly<{status:'AUTHORIZED';reviewRequired:boolean}>|
  Readonly<{status:'BLOCKED'}> {
 if(!authorized)return {status:'BLOCKED'};
 return {status:'AUTHORIZED',reviewRequired:result.affected.length>0};
}
