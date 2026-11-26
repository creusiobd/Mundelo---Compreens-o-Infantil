import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resolveDependencyClosure} from '../src/domain/derivationClosure';
import {validateDerivation,selectExport,type Unit,type ScopedGrant} from '../src/domain/governanceLifecycle';

const base:Unit={
 ref:{id:'source',version:1,childId:'child-A'},category:'C01',
 body:'Synthetic original observation',authorId:'parent-A',interpreterId:null,
 sourceRefs:[],recordedAt:1,priorVersion:null,retained:true,restricted:false
};
const mid:Unit={...base,ref:{id:'mid',version:1,childId:'child-A'},category:'C04',
 body:'Synthetic first summary',authorId:'curator-A',interpreterId:'curator-A',sourceRefs:[base.ref]};
const top:Unit={...mid,ref:{id:'top',version:1,childId:'child-A'},
 body:'Synthetic synthesis of first summary',sourceRefs:[mid.ref]};
const grant=(unit:Unit):ScopedGrant=>({
 recipientId:'professional-A',childId:'child-A',purpose:'care',operation:'EXPORT',category:unit.category,
 sourceId:unit.ref.id,versions:[unit.ref.version],revision:1,active:true
});
const request={actorId:'professional-A',childId:'child-A',purpose:'care',recipientId:'professional-A',refs:[top.ref]};
test('PG06-N07 transitive closure resolves all levels without disclosing unrelated sources',()=>{
 const result=resolveDependencyClosure([base,mid,top],[top.ref]);
 assert.equal(result.ok,true);
 if(result.ok)assert.deepEqual(result.units.map(x=>x.ref.id),['source','mid','top']);
 assert.equal(validateDerivation([base,mid],top).ok,true);
});
test('PG06-N07 descendant invalid when the grandparent is restricted, deleted or absent',()=>{
 for(const rows of [
  [{...base,restricted:true},mid,top],
  [{...base,retained:false},mid,top],
  [mid,top],
 ]){
   assert.equal(resolveDependencyClosure(rows,[top.ref]).ok,false);
   assert.equal(selectExport(rows,[grant(base),grant(mid),grant(top)],request).ok,false);
 }
});
test('PG06-N07 detects indirect cycles and duplicate source references',()=>{
 const cycle={...base,sourceRefs:[top.ref]};
 assert.deepEqual(resolveDependencyClosure([cycle,mid,top],[top.ref]).ok,false);
 assert.equal(resolveDependencyClosure([base,{...mid,sourceRefs:[base.ref,base.ref]},top],[top.ref]).ok,false);
});
test('PG06-N07 denies mixed children and inconsistent duplicated version keys',()=>{
 const outsider={...base,ref:{id:'foreign',version:1,childId:'child-B'}};
 assert.equal(resolveDependencyClosure([outsider,{...mid,sourceRefs:[outsider.ref]},top],[top.ref]).ok,false);
 assert.equal(resolveDependencyClosure([base,{...base,body:'conflicting copy'},mid,top],[top.ref]).ok,false);
});
test('PG06-N07 derived export requires scoped grant for every ancestor',()=>{
 const all=[base,mid,top],allGrants=all.map(grant);
 assert.equal(selectExport(all,allGrants,request).ok,true);
 for(const missing of all){
  const without=allGrants.filter(g=>g.sourceId!==missing.ref.id);
  assert.deepEqual(selectExport(all,without,request),{ok:false,reason:'DENIED'});
 }
 const result=selectExport(all,allGrants,request);
 if(result.ok)assert.deepEqual(result.items.map(x=>x.ref.id),['top']);
 assert.equal(selectExport(all,[...allGrants.slice(0,2),{...grant(top),operation:'READ'}],request).ok,false);
 assert.equal(selectExport(all,allGrants,{...request,recipientId:'unauthorized-recipient'}).ok,false);
});
test('PG06-N07 a revised source is never silently substituted into derivative dependency',()=>{
 const other={...base,ref:{...base.ref,version:2},body:'Revised text'};
 assert.equal(resolveDependencyClosure([other,mid,top],[top.ref]).ok,false);
 assert.equal(selectExport([other,mid,top],[grant(other),grant(mid),grant(top)],request).ok,false);
});
