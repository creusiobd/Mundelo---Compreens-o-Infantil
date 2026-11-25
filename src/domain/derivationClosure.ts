import type {Unit, VersionRef, Verdict} from './governanceLifecycle';

const makeKey=(r:VersionRef)=>JSON.stringify([r.childId,r.id,r.version]);

export type DependencyClosure =
 | Readonly<{ok:true; units:readonly Unit[]}>
 | Readonly<{ok:false;reason:string}>;

/** Synthetic-only complete provenance closure. Fail closed on ambiguity.
 * Never infer that missing ancestry, an old version, or a restricted descendant is safe.
 */
export function resolveDependencyClosure(all:readonly Unit[],roots:readonly VersionRef[]):DependencyClosure {
 if(roots.length===0) return {ok:false,reason:'SOURCE_REQUIRED'};
 const byKey=new Map<string,Unit>();
 for(const unit of all){
   const id=makeKey(unit.ref);
   if(byKey.has(id)) return {ok:false,reason:'AMBIGUOUS_LINEAGE'};
   byKey.set(id,unit);
 }
 const visiting=new Set<string>();
 const completed=new Set<string>();
 const closure:Unit[]=[];
 const visit=(ref:VersionRef,child:string,depth:number):Verdict=>{
   if(depth>10000)return {ok:false,reason:'INVALID_LINEAGE'};
   if(ref.childId!==child)return {ok:false,reason:'SOURCE_UNAVAILABLE'};
   const k=makeKey(ref);
   if(visiting.has(k))return {ok:false,reason:'CYCLIC_LINEAGE'};
   if(completed.has(k))return {ok:true};
   const unit=byKey.get(k);
   if(!unit||!unit.retained||unit.restricted)return {ok:false,reason:'SOURCE_UNAVAILABLE'};
   if(unit.ref.version<1||!Number.isSafeInteger(unit.ref.version))return {ok:false,reason:'INVALID_LINEAGE'};
   if(unit.category==='C04'&&!unit.sourceRefs.length)return {ok:false,reason:'SOURCE_REQUIRED'};
   if(unit.sourceRefs.length>new Set(unit.sourceRefs.map(makeKey)).size)return {ok:false,reason:'INVALID_LINEAGE'};
   visiting.add(k);
   for(const ancestor of unit.sourceRefs){
     const result=visit(ancestor,child,depth+1);
     if(!result.ok){visiting.delete(k);return result;}
   }
   visiting.delete(k);
   completed.add(k);
   closure.push(unit);
   return {ok:true};
 };
 const child=roots[0]?.childId;
 for(const root of roots){
   if(root.childId!==child)return {ok:false,reason:'SOURCE_UNAVAILABLE'};
   const result=visit(root,child,0);
   if(!result.ok)return result;
 }
 return {ok:true,units:closure.map(unit=>structuredClone(unit))};
}
