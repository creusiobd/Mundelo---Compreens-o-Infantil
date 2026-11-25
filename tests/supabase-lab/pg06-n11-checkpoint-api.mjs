/* PG06-N11 | Real local Supabase Auth JWT + PostgREST synthetic checkpoint tests. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {randomUUID} from 'node:crypto';
const [,,envFile,usersFile]=process.argv;
if(!envFile||!usersFile)throw Error('Usage: node pg06-n11-checkpoint-api.mjs env identities');
const env={};
for(const line of fs.readFileSync(envFile,'utf8').split(/\r?\n/)){
 const m=line.match(/^([A-Z_]+)=(.*)$/);if(m)env[m[1]]=m[2].replace(/^['"]|['"]$/g,'');
}
const url=env.API_URL||env.SUPABASE_URL,key=env.ANON_KEY||env.PUBLISHABLE_KEY||env.SUPABASE_ANON_KEY;
if(!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(url||'')||!key)
 throw Error('Hosted Supabase API forbidden');
const users=JSON.parse(fs.readFileSync(usersFile,'utf8'));
const child='11111111-1111-4111-8111-111111111111';
const source=n=>'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa'+n;
const derived=n=>'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb'+n;
const evidence=n=>'10000000-0000-4000-8000-00000000000'+n;
const snapshot=(n,version)=>[{id:source(n),version}];
let count=0;
const check=(value,label)=>{assert.ok(value,label);count++;console.log('PASS: '+label)};
async function call(name,fn,body,override){
 const token=override??users[name]?.token;
 const res=await fetch(url+'/rest/v1/rpc/'+fn,{
  method:'POST',headers:{apikey:key,Authorization:'Bearer '+token,
    'Content-Type':'application/json',Accept:'application/json'},
  body:JSON.stringify(body)
 });
 const raw=await res.text();
 let data;try{data=JSON.parse(raw)}catch{data=raw}
 return {status:res.status,data};
}
const reason='Independent synthetic review: sources checked; preserve multiple perspectives.';
const versionSnapshotForDerived=n=>snapshot(
 n===2?1:n===3?2:n===4?3:n,
 n===1||n===2||n===7||n===8?2:1
);
const review=(n,revision,versions=versionSnapshotForDerived(n),extras={})=>({
 p_review:randomUUID(),p_child:child,p_derived:derived(n),p_purpose:'care',
 p_expected_revision:revision,p_versions:versions,p_reason:reason,p_evidence:evidence(n),...extras
});
const event=(n,revision)=>({
 p_event:randomUUID(),p_child:child,p_kind:'SOURCE_REVISED',
 p_target:source(n),p_expected_revision:revision,p_recipient:null
});
const submit=(name,payload,token)=>call(name,'pg06_n11_revalidate',payload,token);
const record=(payload)=>call('guardian','pg06_n10_record_event',payload);
const deliver=(n,op='READ',hold=0)=>call('professional','pg06_n10_deliver',{
 p_derived:derived(n),p_purpose:'care',p_operation:op,p_hold_ms:hold
});
const denied=(res,label)=>{
 check([401,403,404,409].includes(res.status),label+' status');
 check(!JSON.stringify(res.data).includes('SYNTH-'),label+' no content leak');
};
for(const n of [1,2,3,4,7]){
 denied(await deliver(n),'blocked before reviewed '+n);
}
const input=review(1,6);
denied(await submit('professional',input),'professional without authority cannot approve');
denied(await submit('familyB',input),'different family cannot approve');
denied(await submit('outsider',input),'outsider cannot approve');
const tampered=users.guardian.token.slice(0,-5)+'abcde';
denied(await submit('guardian',input,tampered),'tampered JWT cannot approve');
denied(await submit('guardian',{...input,p_reason:'OK'}),'unjustified approval denied');
denied(await submit('guardian',{...input,p_versions:snapshot(1,1)}),'stale source version denied');
denied(await submit('guardian',{...input,p_versions:[]}), 'omitted sources denied');
denied(await submit('guardian',{...input,p_evidence:evidence(2)}),'evidence for different derived unit denied');
denied(await submit('guardian',{...input,p_evidence:randomUUID()}),'unverified evidence ID denied');
denied(await submit('guardian',{...input,p_expected_revision:5}),'stale checkpoint CAS denied');
denied(await submit('guardian',review(2,6)),'downstream cannot reopen before upstream');
let res=await submit('guardian',input);
check(res.status===200&&res.data===7,'reviewer commits authorized source-bound checkpoint');
for(const op of ['READ','SHARE','EXPORT']){
 const d=await deliver(1,op);
 check(d.status===200&&d.data==='SYNTH-CORRECTION-DERIVED','explicit review opens '+op);
}
denied(await deliver(2),'downstream still blocked after upstream approved');
res=await submit('guardian',input);
check(res.status===200&&res.data===7,'exact checkpoint retry is idempotent');
denied(await submit('guardian',{...input,p_reason:reason+' edited'}),'replay mutation denied');
const next=review(2,7);
res=await submit('guardian',next);
check(res.status===200&&res.data===8,'downstream approved only after upstream checkpoint');
check((await deliver(2)).status===200,'transitive report now available to permitted recipient');
res=await submit('guardian',review(3,8));
check(res.status===200&&res.data===9,'contested interpretation reviewed with preserved attribution');
check((await deliver(3)).status===200,'reviewed contested derivative eligible for authorized read');
res=await submit('guardian',review(4,9));
check(res.status===200&&res.data===10,'revalidation records evidence for revoked source');
for(const op of ['READ','SHARE','EXPORT']){
 denied(await deliver(4,op),'revalidation never recreates revoked grant '+op);
}
const newCorrection=event(1,10);
res=await record(newCorrection);
check(res.status===200&&res.data===11,'new correction after checkpoint creates fresh revision');
for(const n of [1,2])denied(await deliver(n),'new revision quarantines previously reviewed '+n);
denied(await submit('guardian',{...input,p_expected_revision:11}),
 'replaying earlier review cannot undo new block');
denied(await submit('guardian',review(1,11,snapshot(1,3))),
 'previous evidence cannot authorize a new blocked generation');
denied(await submit('guardian',review(2,11,snapshot(1,3))),
 'downstream previous evidence cannot authorize new source version');
// Competing reviewer and source change must never both win against one CAS revision.
const competingReview=review(7,11);
const competingEvent=event(7,11);
const [reviewRace,eventRace]=await Promise.all([
 submit('guardian',competingReview),record(competingEvent)
]);
check([200,409].includes(reviewRace.status)&&[200,409].includes(eventRace.status),
 'concurrent review and revision each returns success/conflict');
check([reviewRace,eventRace].filter(r=>r.status===200).length===1,
 'one and only one competing CAS operation commits');
let revision=12;
if(reviewRace.status===200){
 res=await record({...competingEvent,p_expected_revision:12});
 check(res.status===200&&res.data===13,
  'corrective event after successful review re-blocks the result');
 revision=13;
}
denied(await deliver(7),'fresh event wins over older evidence after concurrency');
denied(await submit('guardian',review(7,revision,snapshot(7,3))),
 'new block cannot be revalidated with old evidence');
const reopenedRead=deliver(3,'READ',600);
await new Promise(resolve=>setTimeout(resolve,130));
const eventAfterReview=event(2,revision);
const [oldRead,newBlock]=await Promise.all([reopenedRead,record(eventAfterReview)]);
check(newBlock.status===200&&newBlock.data===revision+1,
 'block commits after competing previously approved read');
check((oldRead.status===200&&oldRead.data==='SYNTH-CONTEST-DERIVED')||oldRead.status===403,
 'in-flight read serialized before/after new block');
for(const op of ['READ','SHARE','EXPORT']){
 denied(await deliver(3,op),'post-commit operation denied '+op);
}
const newRevision=revision+1;
denied(await submit('guardian',review(3,newRevision,snapshot(2,2))),
 'evidence from previous block cannot reopen contested source after another change');
for(const tbl of ['source_versions','holds','review_authorities','verified_evidence','reviews']){
 const response=await fetch(url+'/rest/v1/pg06_n11_'+tbl+'?select=*',{
  headers:{apikey:key,Authorization:'Bearer '+users.professional.token}
 });
 check([401,403,404].includes(response.status),'private review metadata stays unexposed '+tbl);
}
console.log('PG06-N11: '+count+' checkpoint API assertions passed with signed synthetic JWTs.');
