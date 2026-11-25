/* PG06-N12: Synthetic, isolated JWT-backed human-decision flow. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {randomUUID} from 'node:crypto';
const [,,envPath,identitiesPath]=process.argv;
if(!envPath||!identitiesPath) throw Error('usage: node pg06-n12-human-api.mjs local-env synthetic-users');
const env={};
for(const line of fs.readFileSync(envPath,'utf8').split(/\r?\n/)){
 const m=line.match(/^([A-Z_]+)=(.*)$/);
 if(m)env[m[1]]=m[2].replace(/^['"]|['"]$/g,'');
}
const url=env.API_URL||env.SUPABASE_URL;
const apiKey=env.ANON_KEY||env.PUBLISHABLE_KEY||env.SUPABASE_ANON_KEY;
if(!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(url||'')||!apiKey)
 throw Error('Hosted Supabase forbidden: local-only synthetic tests');
const users=JSON.parse(fs.readFileSync(identitiesPath,'utf8'));
const child='11111111-1111-4111-8111-111111111111';
const source=n=>'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa'+n;
const derived=n=>'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb'+n;
const evidence=n=>'10000000-0000-4000-8000-00000000000'+n;
const perspectives=n=>[
 '20000000-0000-4000-8000-00000000000'+n,
 '20000000-0000-4000-8000-00000000001'+n,
];
const version=n=>n===1||n===2||n===7||n===8?2:1;
const origin=n=>n===2?1:n;
const snapshot=n=>[{id:source(origin(n)),version:version(n)}];
const reason='Synthetic reviewed observations, limitations and distinct adult perspectives retained.';
let assertions=0;
function ok(cond,message){assert.ok(cond,message);assertions++;console.log('PASS: '+message);}
async function post(name,fn,payload,tokenOverride){
 const token=tokenOverride??users[name]?.token;
 const res=await fetch(url+'/rest/v1/rpc/'+fn,{
  method:'POST',headers:{apikey:apiKey,Authorization:'Bearer '+token,
   'Content-Type':'application/json',Accept:'application/json'},
  body:JSON.stringify(payload)
 });
 const raw=await res.text();let data;
 try{data=JSON.parse(raw)}catch{data=raw}
 return {status:res.status,data};
}
const deliver=(n,operation='READ',ms=0)=>post('professional','pg06_n10_deliver',
 {p_derived:derived(n),p_purpose:'care',p_operation:operation,p_hold_ms:ms});
const decide=(name,p)=>post(name,'pg06_n12_decide',p);
const newDecision=(n,outcome,rev,overrides={})=>({
 p_decision:randomUUID(),p_child:child,p_derived:derived(n),
 p_outcome:outcome,p_expected_revision:rev,p_versions:snapshot(n),
 p_reason:reason,p_evidence:evidence(n),p_perspective_ids:perspectives(n),
 p_request:outcome==='REQUEST_COMPLEMENT'?'Clarify synthetic context and attach another observation.':null,
 p_purpose:'care',...overrides
});
const sourceChange=(n,rev)=>post('guardian','pg06_n10_record_event',{
 p_event:randomUUID(),p_child:child,p_kind:'SOURCE_REVISED',
 p_target:source(n),p_expected_revision:rev,p_recipient:null
});
function denied(resp,message){
 ok([401,403,404,409].includes(resp.status),message+' rejected');
 ok(!JSON.stringify(resp.data).includes('SYNTH-'),message+' no body leak');
}
async function notDeliver(n,label){
 for(const op of ['READ','SHARE','EXPORT'])denied(await deliver(n,op),label+' '+op);
}
await notDeliver(1,'pre-review synthesis stays blocked');
const req=newDecision(1,'REQUEST_COMPLEMENT',6);
denied(await decide('professional',req),'professional without review authority');
denied(await decide('familyB',req),'other family without review authority');
denied(await decide('outsider',req),'outsider without review authority');
const tampered=users.guardian.token.slice(0,-5)+'abcde';
denied(await post('guardian','pg06_n12_decide',req,tampered),'tampered JWT');
denied(await post('guardian','pg06_n11_revalidate',{
 p_review:req.p_decision,p_child:child,p_derived:derived(1),p_purpose:'care',
 p_expected_revision:6,p_versions:snapshot(1),p_reason:reason,p_evidence:evidence(1)
}),'direct legacy revalidation route closed');
denied(await decide('guardian',{...req,p_reason:'not enough'}),'missing review reasoning');
denied(await decide('guardian',{...req,p_perspective_ids:[]}), 'missing perspectives');
denied(await decide('guardian',{...req,p_perspective_ids:[perspectives(1)[0],perspectives(1)[0]]}),
 'duplicated perspective reference');
denied(await decide('guardian',{...req,p_perspective_ids:perspectives(2)}),
 'viewpoints from a different derivative');
denied(await decide('guardian',{...req,p_versions:[{id:source(1),version:1}]}),
 'source version prior to correction');
denied(await decide('guardian',{...req,p_evidence:evidence(2)}),
 'review evidence for other derivative');
denied(await decide('guardian',{...req,p_request:null}),
 'incomplete complement request');
denied(await decide('guardian',{...req,p_expected_revision:5}),'stale human CAS');
let resp=await decide('guardian',req);
ok(resp.status===200&&resp.data===7,'REQUEST_COMPLEMENT recorded at child revision 7');
await notDeliver(1,'complement requested, no release');
resp=await decide('guardian',req);
ok(resp.status===200&&resp.data===7,'exact complement replay idempotent');
denied(await decide('guardian',{...req,p_request:'Provide rewritten assertions as fact.'}),
 'replay mutation rejected');

const keep=newDecision(3,'KEEP_BLOCKED',7);
resp=await decide('guardian',keep);
ok(resp.status===200&&resp.data===8,'KEEP_BLOCKED recorded with justification');
await notDeliver(3,'human keeps contested interpretation blocked');
denied(await decide('guardian',newDecision(2,'APPROVE',8)),
 'downstream approval cannot bypass blocked ancestor');

const approve1=newDecision(1,'APPROVE',8);
resp=await decide('guardian',approve1);
ok(resp.status===200&&resp.data===9,'APPROVE source synthesis with exact evidence');
for(const op of ['READ','SHARE','EXPORT']){
 const r=await deliver(1,op);
 ok(r.status===200&&r.data==='SYNTH-CORRECTION-DERIVED',
   'approved synthesis available only under old scoped '+op+' grant');
}
await notDeliver(2,'downstream still blocked until own human review');
resp=await decide('guardian',newDecision(2,'APPROVE',9));
ok(resp.status===200&&resp.data===10,'downstream separately approved after ancestor');
ok((await deliver(2)).status===200,'previously blocked report now available');

resp=await decide('guardian',newDecision(3,'APPROVE',10));
ok(resp.status===200&&resp.data===11,'later independent review of contested interpretation');
ok((await deliver(3)).status===200,'reviewed contestation eligible only for authorized viewer');

resp=await decide('guardian',newDecision(4,'APPROVE',11));
ok(resp.status===200&&resp.data===12,'review of formerly revoked derivative recorded');
await notDeliver(4,'human approval does not restore revoked grants');
const raceApprove=newDecision(7,'APPROVE',12);
const raceBlock=newDecision(7,'KEEP_BLOCKED',12);
const [a,b]=await Promise.all([
 decide('guardian',raceApprove),decide('guardian',raceBlock)
]);
ok([a.status,b.status].filter(x=>x===200).length===1,
 'simultaneous opposed decisions yield exactly one winner');
ok([a.status,b.status].filter(x=>[403,409].includes(x)).length===1,
 'competing human choice is rejected by CAS or hold');
const latestSource7=await sourceChange(7,13);
ok(latestSource7.status===200&&latestSource7.data===14,
 'new source change invalidates winning decision');
await notDeliver(7,'new change reblocks after opposing-decision race');
denied(await decide('guardian',{...raceApprove,p_expected_revision:14}),
 'old review evidence cannot unlock new block');
const newSource1=await sourceChange(1,14);
ok(newSource1.status===200&&newSource1.data===15,
 'new correction after approval invalidates prior review');
await notDeliver(1,'correction re-blocks already approved synthesis');
await notDeliver(2,'correction re-blocks approved descendant');
denied(await decide('guardian',{...approve1,p_expected_revision:15}),
 'historical human decision cannot be recycled into fresh approval');
denied(await decide('guardian',newDecision(1,'APPROVE',15,{
 p_versions:[{id:source(1),version:3}]
})), 'old evidence cannot attest newest source version');

for(const name of ['perspectives','authorities','decisions']){
 const q=await fetch(url+'/rest/v1/pg06_n12_'+name+'?select=*',{
  headers:{apikey:apiKey,Authorization:'Bearer '+users.professional.token}
 });
 ok([401,403,404].includes(q.status),'private decision metadata hidden '+name);
}
console.log('PG06-N12: '+assertions+' human-decision API assertions passed with synthetic JWTs.');
