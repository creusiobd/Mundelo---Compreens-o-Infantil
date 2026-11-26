import {test} from 'node:test';
import assert from 'node:assert/strict';
import {evaluateAccess,selectPermittedSources,authorizeEffect,type PolicySnapshot,type AccessRequest} from '../src/domain/persistentAccessContract';

const grant={
 id:'g1',childId:'synthetic-child-A',recipientId:'professional-A',
 grantedById:'guardian-A',authorityVerified:true,state:'ACTIVE' as const,
 revision:2,purpose:'follow-up',
 operations:['READ','USE'] as const,categories:['OBSERVATION'] as const,
 sourceIds:['s1'],allowedVersions:{s1:[1]},
 validFrom:'2026-01-01T00:00:00Z',validUntil:'2027-01-01T00:00:00Z',
};
const snapshot:PolicySnapshot={
 policyRevision:6,restrictionRevision:3,grants:[grant],
 sources:[
  {id:'s1',childId:'synthetic-child-A',version:1,category:'OBSERVATION',restricted:false},
  {id:'s1',childId:'synthetic-child-A',version:2,category:'OBSERVATION',restricted:false},
  {id:'s2',childId:'synthetic-child-B',version:1,category:'OBSERVATION',restricted:false},
  {id:'s3',childId:'synthetic-child-A',version:1,category:'INTERPRETATION',restricted:false},
 ],
};
const request:AccessRequest={
 actor:{subjectId:'professional-A',authenticated:true},operation:'READ',
 childId:'synthetic-child-A',purpose:'follow-up',
 sourceRefs:[{id:'s1',version:1}],recipientId:'professional-A',
 expectedPolicyRevision:6,expectedRestrictionRevision:3,
 expectedGrantRevisions:{g1:2},evaluatedAt:'2026-11-25T12:00:00Z',
};
const blocked=(snap:PolicySnapshot,req:AccessRequest)=> {
 const r=selectPermittedSources(snap,req);
 assert.equal(r.status,'BLOCK');assert.equal(Object.hasOwn(r,'sources'),false);
};
test('PG06-N04: only scoped source/version/purpose operation is readable',()=>{
 assert.equal(evaluateAccess(snapshot,request).status,'ALLOW');
 const selection=selectPermittedSources(snapshot,request);
 assert.equal(selection.status,'ALLOW');
 if(selection.status==='ALLOW') assert.deepEqual(selection.sources.map(s=>s.id),['s1']);
});
test('PG06-N04: unrelated child or source never discloses foreign metadata',()=>{
 blocked(snapshot,{...request,childId:'synthetic-child-B',sourceRefs:[{id:'s2',version:1}]});
 blocked(snapshot,{...request,sourceRefs:[{id:'s2',version:1}]});
 blocked(snapshot,{...request,sourceRefs:[{id:'s1',version:1},{id:'s2',version:1}]});
});
test('PG06-N04: recipient and purpose mismatches deny read',()=>{
 blocked(snapshot,{...request,actor:{subjectId:'other-professional',authenticated:true}});
 blocked(snapshot,{...request,recipientId:'other-professional'});
 blocked(snapshot,{...request,purpose:'publicity'});
});
test('PG06-N04: READ is not SHARE, EXPORT or PREPARE',()=>{
 for(const operation of ['SHARE','EXPORT','PREPARE'] as const)
  blocked(snapshot,{...request,operation});
 assert.equal(evaluateAccess(snapshot,{...request,operation:'USE'}).status,'ALLOW');
});
test('PG06-N04: category and version restrictions do not expand by inference',()=>{
 blocked(snapshot,{...request,sourceRefs:[{id:'s1',version:2}]});
 blocked(snapshot,{...request,sourceRefs:[{id:'s3',version:1}]});
});
test('PG06-N04: authorization must be verified and live, not inferred from household',()=>{
 blocked({...snapshot,grants:[{...grant,authorityVerified:false}]},request);
 blocked({...snapshot,grants:[{...grant,state:'REVOKED'}]},request);
 blocked({...snapshot,grants:[{...grant,state:'EXPIRED'}]},request);
});
test('PG06-N04: expiration and start dates are enforced',()=>{
 blocked(snapshot,{...request,evaluatedAt:'2027-01-01T00:00:00Z'});
 blocked(snapshot,{...request,evaluatedAt:'2025-12-31T23:59:59Z'});
});
test('PG06-N04: stale grant, policy and restriction revisions do not survive effect',()=>{
 blocked({...snapshot,grants:[{...grant,revision:3}]},request);
 blocked({...snapshot,policyRevision:7},request);
 blocked({...snapshot,restrictionRevision:4},request);
});
test('PG06-N04: revalidation after revocation blocks prepared delivery',()=>{
 assert.equal(evaluateAccess(snapshot,request).status,'ALLOW');
 const latest={...snapshot,policyRevision:7,grants:[{...grant,state:'REVOKED' as const,revision:3}]};
 assert.equal(authorizeEffect(latest,request).status,'BLOCK');
 blocked(latest,request);
});
test('PG06-N04: restricted source blocks even with active grant',()=>{
 const latest={...snapshot,sources:snapshot.sources.map(s=>s.id==='s1'?{...s,restricted:true}:s)};
 blocked(latest,request);
});
test('PG06-N04: missing or duplicate source refs do not imply an empty permitted set',()=>{
 blocked(snapshot,{...request,sourceRefs:[]});
 blocked(snapshot,{...request,sourceRefs:[{id:'s1',version:1},{id:'s1',version:1}]});
 blocked(snapshot,{...request,sourceRefs:[{id:'missing',version:1}]});
});
test('PG06-N04: authentication must originate from trusted actor at the effect boundary',()=>{
 blocked(snapshot,{...request,actor:{subjectId:'professional-A',authenticated:false}});
});
