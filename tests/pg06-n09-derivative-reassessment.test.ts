import {test} from 'node:test';
import assert from 'node:assert/strict';
import {
 reassessDerivatives,redactReassessment,type ReassessmentEvent
} from '../src/domain/derivativeReassessment';
import type {Unit, ScopedGrant} from '../src/domain/governanceLifecycle';

const source:Unit={
 ref:{id:'observation',version:1,childId:'child-a'},category:'C01',
 body:'Synthetic observation: toy on shelf',authorId:'adult-a',interpreterId:null,
 sourceRefs:[],recordedAt:1,priorVersion:null,retained:true,restricted:false
};
const interpretation:Unit={
 ...source,ref:{id:'interpretation',version:1,childId:'child-a'},
 body:'Synthetic adult hypothesis',authorId:'adult-b',interpreterId:'adult-b'
};
const synthesis:Unit={
 ...source,ref:{id:'summary',version:1,childId:'child-a'},category:'C04',
 body:'Synthetic first synthesis',authorId:'curator-a',interpreterId:'curator-a',
 sourceRefs:[source.ref,interpretation.ref]
};
const downstream:Unit={
 ...synthesis,ref:{id:'report',version:1,childId:'child-a'},
 sourceRefs:[synthesis.ref],body:'Synthetic report'
};
const unrelated:Unit={
 ...synthesis,ref:{id:'unrelated',version:1,childId:'child-b'},
 sourceRefs:[{...source.ref,childId:'child-b'}]
};
const independentSource:Unit={
 ...source,ref:{...source.ref,childId:'child-b'}
};
const full=[source,interpretation,synthesis,downstream,independentSource,unrelated];
const makeGrants=(units:Unit[],operation:'READ'|'USE'):ScopedGrant[]=>units.map(u=>({
 recipientId:'professional-a',childId:u.ref.childId,purpose:'follow-up',operation,
 category:u.category,sourceId:u.ref.id,versions:[u.ref.version],revision:1,active:true
}));
const grants=[...makeGrants(full,'READ'),...makeGrants(full,'USE')];
const evalEvents=(events:ReassessmentEvent[],rows=full,gs=grants)=>
 reassessDerivatives(rows,gs,events,'professional-a','follow-up');

test('PG06-N09: observation correction affects direct and transitive derivatives, not another child',()=>{
 const revised={...source,ref:{...source.ref,version:2},body:'Correction',priorVersion:1};
 const result=evalEvents([{kind:'SOURCE_REVISED',previous:source.ref,replacement:revised.ref}],
    [...full,revised]);
 assert.deepEqual(result.affected.map(x=>x.ref.id),['summary','report']);
 for(const item of result.affected){
  assert.equal(item.validity,'REVIEW_REQUIRED');
  assert.equal(item.presentation,'BLOCK');
  assert.equal(item.use,'BLOCK');
  assert.equal(item.retention,'REVIEW_REQUIRED');
  assert.deepEqual(item.reasons,['SOURCE_CHANGED']);
 }
 assert.deepEqual(result.unaffected.map(x=>x.id),['unrelated']);
});
test('PG06-N09: contesting an adult interpretation preserves it and pauses dependent synthesis',()=>{
 const contest={...interpretation,ref:{id:'contestation',version:1,childId:'child-a'},
  body:'Different adult perspective',authorId:'adult-c',interpreterId:'adult-c'};
 const result=evalEvents([{
  kind:'INTERPRETATION_CONTESTED',target:interpretation.ref,contestation:contest.ref
 }],[...full,contest]);
 assert.equal(result.affected.length,2);
 assert.ok(result.affected.every(x=>x.reasons.includes('INTERPRETATION_CONTESTED')));
 assert.deepEqual(interpretation.body,'Synthetic adult hypothesis');
});
test('PG06-N09: revoked permission blocks only the affected recipient and purpose',()=>{
 const event:ReassessmentEvent={kind:'ACCESS_REVOKED',target:source.ref,
 recipientId:'professional-a',purpose:'follow-up'};
 const revoked=grants.map(g=>g.sourceId==='observation'&&g.childId==='child-a'?{...g,active:false}:g);
 const affected=evalEvents([event],full,revoked);
 assert.deepEqual(affected.affected.map(x=>x.ref.id),['summary','report']);
 assert.ok(affected.affected.every(x=>x.reasons.includes('PERMISSION_CHANGED')));
 const other=reassessDerivatives(full,grants,[event],'professional-other','follow-up');
 assert.equal(other.affected.length,0);
});
test('PG06-N09: restriction and disposal fail closed without deleting provenance',()=>{
 for(const event of [
   {kind:'SOURCE_RESTRICTED',target:source.ref} as const,
   {kind:'SOURCE_DISPOSED',target:source.ref} as const
 ]){
  const rows=full.map(u=>u.ref.id==='observation'&&u.ref.childId==='child-a'?
   {...u,restricted:event.kind==='SOURCE_RESTRICTED',retained:event.kind!=='SOURCE_DISPOSED'}:u);
  const result=evalEvents([event],rows);
  assert.equal(result.affected.length,2);
  assert.ok(result.affected.every(x=>x.validity==='UNVERIFIABLE'));
  assert.ok(result.affected.every(x=>x.retention==='REVIEW_REQUIRED'));
 }
 assert.equal(full[0].retained,true);
});
test('PG06-N09: duplicate event replay does not duplicate change or alter disposition',()=>{
 const event:ReassessmentEvent={kind:'SOURCE_REVISED',previous:source.ref,
 replacement:{...source.ref,version:2}};
 assert.deepEqual(evalEvents([event]),evalEvents([event,event]));
});
test('PG06-N09: independent changes combine into one reasoned, fail-closed result',()=>{
 const ev:ReassessmentEvent[]=[
  {kind:'SOURCE_REVISED',previous:source.ref,replacement:{...source.ref,version:2}},
  {kind:'INTERPRETATION_CONTESTED',target:interpretation.ref,
   contestation:{id:'contest',version:1,childId:'child-a'}}
 ];
 const result=evalEvents(ev);
 assert.equal(result.affected.length,2);
 assert.deepEqual(result.affected[0].reasons,['SOURCE_CHANGED','INTERPRETATION_CONTESTED']);
});
test('PG06-N09: source metadata is hidden from unauthorized status projections',()=>{
 const result=evalEvents([{kind:'SOURCE_RESTRICTED',target:source.ref}]);
 assert.deepEqual(redactReassessment(result,false),{status:'BLOCKED'});
 assert.deepEqual(redactReassessment(result,true),{status:'AUTHORIZED',reviewRequired:true});
 assert.equal(JSON.stringify(redactReassessment(result,false)).includes('observation'),false);
});
test('PG06-N09: missing ancestor is invalid and quarantines affected derivation',()=>{
 const rows=full.filter(u=>u.ref.id!=='interpretation');
 const result=evalEvents([{
  kind:'SOURCE_REVISED',previous:source.ref,
  replacement:{...source.ref,version:2}
 }],rows);
 assert.ok(result.affected.some(x=>x.ref.id==='summary'&&x.validity==='UNVERIFIABLE'));
});
