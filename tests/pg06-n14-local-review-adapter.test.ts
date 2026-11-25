import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createLocalReviewAdapter,ReviewServerUnavailable,type ServerReviewSnapshot} from '../src/domain/localReviewTransactionAdapter';

const credentials={
 url:'http://127.0.0.1:54321',
 anonKey:'synthetic-anon-only',
 accessToken:'synthetic-jwt-only',
 childId:'11111111-1111-4111-8111-111111111111',
 derivedId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
 purpose:'care' as const
};
const state:ServerReviewSnapshot={
 childId:credentials.childId,derivedId:credentials.derivedId,purpose:'care',
 revision:6,
 sourceVersions:[{id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',version:2}],
 evidenceId:'10000000-0000-4000-8000-000000000001',
 perspectives:[
  {id:'20000000-0000-4000-8000-000000000001',authorId:'30000000-0000-4000-8000-000000000001',provenance:'DIRECT_OBSERVATION',statement:'Synthetic parent observation'},
  {id:'20000000-0000-4000-8000-000000000011',authorId:'30000000-0000-4000-8000-000000000002',provenance:'INTERPRETATION',statement:'Synthetic independent interpretation'}
 ],
 history:[],status:'BLOCKED',retentionPending:true
};
const cmd={
 outcome:'REQUEST_COMPLEMENT' as const,
 reason:'More synthetic context is needed for all attributed perspectives.',
 requestedInformation:'Describe the context in a second synthetic setting.',
 expectedRevision:6,
 perspectiveIds:state.perspectives.map(p=>p.id),
 decisionId:'40000000-0000-4000-8000-000000000001'
};
test('PG06-N14 refuses non-loopback and non-fixture children',()=>{
 assert.throws(()=>createLocalReviewAdapter({...credentials,url:'https://example.com'}),ReviewServerUnavailable);
 assert.throws(()=>createLocalReviewAdapter({...credentials,childId:'22222222-2222-4222-8222-222222222222'}),ReviewServerUnavailable);
});
test('PG06-N14 confirmed state only after POST and fresh authorized snapshot',async()=>{
 const requests:string[]=[];
 const snapshots=[state,{...state,revision:7,status:'COMPLEMENT_REQUESTED',
  history:[{id:cmd.decisionId,authorId:'30000000-0000-4000-8000-000000000001',
   outcome:'REQUEST_COMPLEMENT',reason:cmd.reason,request:cmd.requestedInformation,revision:7,
   perspectives:state.perspectives.map(p=>({id:p.id,author:p.authorId,provenance:p.provenance}))}]}];
 const transport:typeof fetch=async(url,init)=>{
  const op=String(url).split('/').at(-1)!;
  requests.push(op);
  assert.equal(init?.cache,'no-store');
  const headers=init?.headers as Record<string,string>;
  assert.equal(headers.apikey,credentials.anonKey);
  assert.equal(headers.Authorization,'Bearer '+credentials.accessToken);
  const sent=JSON.parse(String(init?.body));
  if(op==='pg06_n12_decide'){
   assert.deepEqual(sent.p_versions,state.sourceVersions);
   assert.equal(sent.p_evidence,state.evidenceId);
   assert.deepEqual(sent.p_perspective_ids,cmd.perspectiveIds);
   return Response.json(7);
  }
  return Response.json(snapshots.shift());
 };
 const adapter=createLocalReviewAdapter(credentials,transport);
 const before=await adapter.load();
 const after=await adapter.decide(cmd,before);
 assert.equal(before.status,'BLOCKED');
 assert.equal(after.status,'COMPLEMENT_REQUESTED');
 assert.deepEqual(requests,['pg06_n14_review_state','pg06_n12_decide','pg06_n14_review_state']);
});
test('PG06-N14 rejects stale browser snapshot without posting a decision',async()=>{
 let requests=0;
 const transport:typeof fetch=async()=>{requests++;return Response.json(null);};
 const adapter=createLocalReviewAdapter(credentials,transport);
 await assert.rejects(adapter.decide(cmd,{...state,revision:8}),ReviewServerUnavailable);
 assert.equal(requests,0);
});
test('PG06-N14 rejects network loss and invalid result instead of optimistic approval',async()=>{
 const network=createLocalReviewAdapter(credentials,async()=>{throw Error('network down');});
 await assert.rejects(network.load(),(e:unknown)=>e instanceof ReviewServerUnavailable&&e.code==='NETWORK');
 const malformed=createLocalReviewAdapter(credentials,async()=>Response.json({status:'REVIEWED'}));
 await assert.rejects(malformed.load(),(e:unknown)=>e instanceof ReviewServerUnavailable&&e.code==='MALFORMED');
 const denied=createLocalReviewAdapter(credentials,async()=>new Response('unavailable',{status:403}));
 await assert.rejects(denied.load(),(e:unknown)=>e instanceof ReviewServerUnavailable&&e.code==='DENIED');
});
