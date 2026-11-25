import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
 applySyntheticReview,
 INITIAL_REVIEW_STATE,
 simulateNewSourceChange,
 SYNTHETIC_CASE,
 type ReviewCommand
} from '../src/domain/reviewLabDemo';

const standard:ReviewCommand={
 outcome:'REQUEST_COMPLEMENT',
 expectedRevision:INITIAL_REVIEW_STATE.revision,
 reason:'As fontes sintéticas precisam de mais contexto antes de fundamentar a interpretação.',
 requestedInformation:'Descrever o ambiente e a sequência do acontecimento.',
 perspectiveIds:SYNTHETIC_CASE.perspectives.map(p=>p.id),
 actor:'Revisor sintético',
 decisionId:'review-01',
 recordedAt:'2026-11-25T12:00:00.000Z'
};

test('PG06-N13 three human choices are distinct and attributed',()=>{
 for(const outcome of ['APPROVE','REQUEST_COMPLEMENT','KEEP_BLOCKED'] as const){
  const result=applySyntheticReview(INITIAL_REVIEW_STATE,SYNTHETIC_CASE,{
   ...standard,outcome,
   requestedInformation:outcome==='REQUEST_COMPLEMENT'?standard.requestedInformation:'',
   decisionId:'review-'+outcome
  });
  assert.equal(result.ok,true);
  if(result.ok){
   assert.equal(result.state.history[0].outcome,outcome);
   assert.equal(result.state.history[0].author,'Revisor sintético');
   assert.equal(result.state.history[0].perspectives.length,3);
   assert.equal(result.state.status,outcome==='APPROVE'?'SIMULATED_REVIEW':
    outcome==='REQUEST_COMPLEMENT'?'COMPLEMENT_REQUESTED':'BLOCKED');
  }
 }
});

test('PG06-N13 reject incomplete rationale or missing synthetic viewpoint',()=>{
 for(const command of [
  {...standard,reason:'Curto'},
  {...standard,perspectiveIds:['perspectiva-familia']},
  {...standard,perspectiveIds:['perspectiva-familia','perspectiva-familia','perspectiva-escola']},
  {...standard,requestedInformation:''},
  {...standard,actor:'  '}
 ]){
  assert.equal(applySyntheticReview(INITIAL_REVIEW_STATE,SYNTHETIC_CASE,command).ok,false);
 }
});

test('PG06-N13 rejected old revision, duplicate decisions and changes reblock simulated approval',()=>{
 const approved=applySyntheticReview(INITIAL_REVIEW_STATE,SYNTHETIC_CASE,{
  ...standard,outcome:'APPROVE',requestedInformation:''
 });
 assert.equal(approved.ok,true);
 if(!approved.ok)return;
 assert.equal(applySyntheticReview(approved.state,SYNTHETIC_CASE,standard).ok,false);
 const reblocked=simulateNewSourceChange(approved.state);
 assert.equal(reblocked.status,'BLOCKED');
 assert.equal(reblocked.history.length,1);
 assert.equal(applySyntheticReview(reblocked,SYNTHETIC_CASE,{
  ...standard,decisionId:'review-after-correction',outcome:'APPROVE',requestedInformation:''
 }).ok,false);
});
