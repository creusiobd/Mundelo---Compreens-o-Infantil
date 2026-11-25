/* PG06-N10: HTTP adversarial verification against disposable LOCAL Supabase. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const [,,envFile,usersFile]=process.argv;
if(!envFile||!usersFile)throw new Error('usage: node pg06-n10-api.mjs local-env synthetic-users');
const env={};
for(const line of fs.readFileSync(envFile,'utf8').split(/\r?\n/)){
 const match=line.match(/^([A-Z_]+)=(.*)$/);if(match)env[match[1]]=match[2].replace(/^['"]|['"]$/g,'');
}
const url=env.API_URL||env.SUPABASE_URL;
const key=env.ANON_KEY||env.PUBLISHABLE_KEY||env.SUPABASE_ANON_KEY;
if(!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(url||'')||!key)
 throw new Error('Hosted Supabase prohibited: use ephemeral local API and key');
const users=JSON.parse(fs.readFileSync(usersFile,'utf8'));
const childA='11111111-1111-4111-8111-111111111111';
const childB='22222222-2222-4222-8222-222222222222';
const source=(n)=>'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa'+n;
const derived=(n)=>'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb'+n;
let checks=0;
async function post(name,fn,data,tokenOverride){
 const token=tokenOverride??users[name]?.token;
 const resp=await fetch(url+'/rest/v1/rpc/'+fn,{
  method:'POST',headers:{'apikey':key,'Authorization':'Bearer '+token,
   'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)
 });
 let dataOut;const raw=await resp.text();
 try{dataOut=JSON.parse(raw)}catch{dataOut=raw}
 return {status:resp.status,data:dataOut};
}
const event=(type,n,expected,extra={})=>({
 p_event:randomUUID(),p_child:childA,p_kind:type,
 p_target:source(n),p_expected_revision:expected,p_recipient:null,...extra
});
const deliver=(name,n,operation,ms=0)=>post(name,'pg06_n10_deliver',{
 p_derived:derived(n),p_purpose:'care',p_operation:operation,p_hold_ms:ms
});
const submit=(name,payload,token)=>post(name,'pg06_n10_record_event',payload,token);
function check(value,label){
 assert.ok(value,label);checks++;console.log('PASS: '+label);
}
function isDenied(r,label){
 check([401,403,404,409].includes(r.status),label+' status');
 check(!JSON.stringify(r.data).includes('SYNTH-'),label+' no protected source bytes');
}
async function allDenied(n,label){
 for(const op of ['READ','SHARE','EXPORT']){
  isDenied(await deliver('professional',n,op),label+' '+op);
 }
}
for(const op of ['READ','SHARE','EXPORT']){
 const r=await deliver('professional',1,op);
 check(r.status===200&&r.data==='SYNTH-CORRECTION-DERIVED','pre-event authorized '+op);
}
const forged=users.professional.token.slice(0,-5)+'abcde';
isDenied(await post('professional','pg06_n10_deliver',{
 p_derived:derived(1),p_purpose:'care',p_operation:'READ',p_hold_ms:0
},forged),'tampered JWT');
isDenied(await deliver('outsider',1,'READ'),'outsider not granted');
isDenied(await deliver('familyB',1,'READ'),'different family cannot view child A');
const cross=event('SOURCE_REVISED',1,0);
isDenied(await submit('familyB',cross),'other family cannot register source revision');
isDenied(await submit('professional',cross),'recipient cannot impersonate guardian event authority');
const corrected=event('SOURCE_REVISED',1,0);
let resp=await submit('guardian',corrected);
check(resp.status===200&&resp.data===1,'corrective event inserted with revision 1');
resp=await submit('guardian',corrected);
check(resp.status===200&&resp.data===1,'same event id replay is idempotent');
isDenied(await submit('guardian',{...corrected,p_kind:'INTERPRETATION_CONTESTED'}),
 'same event id cannot be mutated on replay');
isDenied(await submit('guardian',event('SOURCE_REVISED',1,0)),
 'stale expected policy revision conflicts');
await allDenied(1,'corrected immediate derivative blocked');
await allDenied(2,'corrected transitive report blocked');
check((await deliver('professional',3,'READ')).status===200,
 'unrelated synthetic interpretation remains available');
const other=await deliver('familyB',6,'READ');
check(other.status===200&&other.data==='SYNTH-OTHER-CHILD-DERIVED',
 'other child isolated and unaffected');
const contested=event('INTERPRETATION_CONTESTED',2,1);
resp=await submit('guardian',contested);
check(resp.status===200&&resp.data===2,'independent interpretation contestation recorded without overwriting source');
await allDenied(3,'contested derivative blocked');
for(const op of ['READ','SHARE','EXPORT']){
 const before=await deliver('professional',4,op);
 check(before.status===200,'revoke target available before event '+op);
}
const revoke=event('ACCESS_REVOKED',3,2,{p_recipient:users.professional.id});
resp=await submit('guardian',revoke);
check(resp.status===200&&resp.data===3,'grant revocation event and effects committed');
await allDenied(4,'revoked access denied with previous valid JWT');
check((await deliver('familyB',6,'READ')).status===200,'other child remains visible after revoke');
// Race 1: delivery enters transaction, holds lock; event starts after it,
// and must block subsequent delivery once its commit completes.
const inFlight=deliver('professional',5,'EXPORT',600);
await new Promise(resolve=>setTimeout(resolve,125));
const raceEvent=event('SOURCE_REVISED',4,3);
const commit=submit('guardian',raceEvent);
const [first,write]=await Promise.all([inFlight,commit]);
check(write.status===200&&write.data===4,'concurrent event committed in serial revision order');
check((first.status===200&&first.data==='SYNTH-RACE-DERIVED')||first.status===403,
 'racing export delivery serialized before or after event');
await allDenied(5,'no READ/SHARE/EXPORT after concurrent event commit');
const replay=await submit('guardian',raceEvent);
check(replay.status===200&&replay.data===4,'concurrent event replay did not increment revision');
const newEvent=event('SOURCE_REVISED',4,4);
isDenied(await submit('outsider',newEvent),'unauthorized fresh event denied');
for(const endpoint of ['nodes','events','grants','child_state']){
 const q=await fetch(url+'/rest/v1/pg06_events_'+endpoint+'?select=*',{
  headers:{apikey:key,Authorization:'Bearer '+users.professional.token}
 });
 check([401,403,404].includes(q.status),'private metadata endpoint inaccessible '+endpoint);
}
console.log('PG06-N10: '+checks+' authenticated API assertions passed with synthetic accounts.');
