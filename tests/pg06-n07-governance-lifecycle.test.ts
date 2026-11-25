import {test} from 'node:test';
import assert from 'node:assert/strict';
import {canAuthorizeGrant,appendRevision,validateDerivation,selectExport,reconcileRestored,
 type AuthorityCheck,type Unit,type ScopedGrant} from '../src/domain/governanceLifecycle';
const at=Date.parse('2026-11-25T04:00:00Z');
const authority:AuthorityCheck={
 actorId:'guardian-a',childId:'synthetic-a',operation:'SHARE',category:'C01',purpose:'care',
 recipientId:'professional-a',verificationReference:'synthetic-external-review',
 verifiedByCompetentReviewer:true,legalBasisApproved:true,bestInterestCaseReviewed:true,
 conflictOfRepresentativesResolved:true,validUntil:at+60000
};
const a:Unit={ref:{id:'p-a',version:1,childId:'synthetic-a'},category:'C01',body:'synthetic-observation',
 authorId:'guardian-a',interpreterId:'guardian-a',sourceRefs:[],recordedAt:at,priorVersion:null,retained:true,restricted:false};
const b:Unit={...a,ref:{id:'p-b',version:1,childId:'synthetic-a'},body:'independent interpretation',authorId:'professional-a',interpreterId:'professional-a'};
const derived:Unit={...a,ref:{id:'d-a',version:1,childId:'synthetic-a'},category:'C04',body:'partial interpretation',
 sourceRefs:[a.ref,b.ref],authorId:'curator-a',interpreterId:'curator-a'};
const grants:ScopedGrant[]=[{recipientId:'professional-a',childId:'synthetic-a',purpose:'care',operation:'EXPORT',category:'C01',
 sourceId:a.ref.id,versions:[1],revision:1,active:true}];

test('PG06-N07: grant requires all legal reviews; client role is insufficient',()=>{
 assert.deepEqual(canAuthorizeGrant(authority,at),{ok:true});
 for(const bad of [
  {...authority,verifiedByCompetentReviewer:false},
  {...authority,legalBasisApproved:false},
  {...authority,bestInterestCaseReviewed:false},
  {...authority,conflictOfRepresentativesResolved:false},
  {...authority,verificationReference:null},
  {...authority,validUntil:at},
 ])assert.equal(canAuthorizeGrant(bad,at).ok,false);
});
test('PG06-N07: revision is append only with exact version and actor',()=>{
 const v2={...a,ref:{...a.ref,version:2},priorVersion:1,recordedAt:at+1,body:'corrected'};
 const out=appendRevision([a],v2,'guardian-a');
 assert.equal(out.ok,true);
 if(out.ok){assert.deepEqual(out.history[0],a);assert.deepEqual(out.history[1],v2);}
 assert.equal(appendRevision([a,v2],v2,'guardian-a').ok,false);
 assert.equal(appendRevision([a],v2,'professional-a').ok,false);
});
test('PG06-N07: other interpreter cannot be silently overwritten',()=>{
 const v2={...b,ref:{...b.ref,version:2},priorVersion:1,recordedAt:at+1,body:'altered'};
 assert.equal(appendRevision([b],{...v2,authorId:'guardian-a'},'guardian-a').ok,false);
 assert.equal(appendRevision([b],{...v2,interpreterId:'guardian-a'},'professional-a').ok,false);
});
test('PG06-N07: derivative preserves exact sources and rejects missing, restricted, mixed, cyclic or duplicated',()=>{
 assert.equal(validateDerivation([a,b],derived).ok,true);
 assert.equal(validateDerivation([a],derived).ok,false);
 assert.equal(validateDerivation([{...a,restricted:true},b],derived).ok,false);
 assert.equal(validateDerivation([a,b],{...derived,sourceRefs:[a.ref,a.ref]}).ok,false);
 assert.equal(validateDerivation([a,b],{...derived,sourceRefs:[derived.ref]}).ok,false);
 assert.equal(validateDerivation([a,b],{...derived,ref:{...derived.ref,childId:'synthetic-b'}}).ok,false);
 assert.equal(validateDerivation([a,b],{...derived,interpreterId:null}).ok,false);
});
test('PG06-N07: READ grant does not authorize EXPORT; no partial export from mixed sources',()=>{
 const req={actorId:'professional-a',childId:'synthetic-a',purpose:'care',recipientId:'professional-a',refs:[a.ref]};
 const allowed=selectExport([a,b],grants,req);
 assert.equal(allowed.ok,true);
 assert.deepEqual(selectExport([a,b],grants,{...req,refs:[a.ref,b.ref]}),{ok:false,reason:'DENIED'});
 assert.equal(selectExport([a],grants.map(g=>({...g,operation:'READ'})),req).ok,false);
 assert.equal(selectExport([a],grants,{...req,purpose:'publicity'}).ok,false);
 assert.equal(selectExport([a],grants.map(g=>({...g,active:false})),req).ok,false);
 assert.equal(selectExport([a],grants,{...req,refs:[a.ref,{...a.ref,version:2}]}).ok,false);
 assert.equal(selectExport([a],grants,{...req,refs:[a.ref,{...a.ref,childId:'synthetic-b'}]}).ok,false);
});
test('PG06-N07: restore must reconcile authoritative tombstones before use',()=>{
 const tombstone={ref:a.ref,decidedAt:at,authorityReference:'synthetic-deletion-review',verified:true};
 const restored=reconcileRestored([a,b],[tombstone]);
 assert.equal(restored.ok,true);
 if(restored.ok){assert.deepEqual(restored.units.map(u=>u.ref.id),['p-b']);assert.deepEqual(restored.units[0],b);}
 assert.equal(reconcileRestored([a,b],[{...tombstone,verified:false}]).ok,false);
 assert.equal(reconcileRestored([a,b],[{...tombstone,authorityReference:''}]).ok,false);
});
