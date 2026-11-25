/* PG06-N06: real local Supabase Auth + PostgREST requests, synthetic users only. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const [,,stage,envPath,identitiesPath]=process.argv;
if(!['setup','verify'].includes(stage)||!envPath||!identitiesPath) throw Error('required: setup|verify env-path identity-path');
function readEnv(path){
 const obj={};
 for(const line of fs.readFileSync(path,'utf8').split(/\r?\n/)){
  const m=line.match(/^([A-Z_]+)=(.*)$/);
  if(m)obj[m[1]]=m[2].replace(/^['"]|['"]$/g,'');
 }
 return obj;
}
const vars=readEnv(envPath);
const url=vars.API_URL||vars.SUPABASE_URL;
const key=vars.ANON_KEY||vars.PUBLISHABLE_KEY||vars.SUPABASE_ANON_KEY;
if(!url||!key) throw Error('Missing local API_URL / ANON_KEY from Supabase status; no hosted fallback allowed');
if(!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(url)) throw Error('Remote Supabase URL forbidden in CI lab');
const childA='11111111-1111-4111-8111-111111111111';
const childB='22222222-2222-4222-8222-222222222222';
async function api(path,body,token,method='POST'){
 const headers={'apikey':key,'Content-Type':'application/json','Accept':'application/json'};
 if(token)headers.Authorization='Bearer '+token;
 const res=await fetch(url+path,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)})});
 const raw=await res.text();
 let data;
 try{data=JSON.parse(raw)}catch{data=raw}
 return {status:res.status,data,text:raw};
}
let passed=0;
function ok(cond,description){assert.ok(cond,description);passed++;console.log('PASS: '+description)}
function denied(r,description){
 ok(r.status===401||r.status===403||r.status===404,
 description+' (blocked HTTP '+r.status+')');
 ok(!JSON.stringify(r.data).includes('SYNTH-PERSPECTIVE-PRIVATE'),description+' (no source in response)');
}
async function createAccount(alias){
 const email='mundelo-'+alias+'-'+crypto.randomBytes(5).toString('hex')+'@example.invalid';
 const password=crypto.randomBytes(24).toString('hex')+'A!1';
 const sign=await api('/auth/v1/signup',{email,password});
 if(sign.status<200||sign.status>=300||!sign.data?.user?.id)throw Error('Local Auth signup failed '+alias+' HTTP '+sign.status+' '+JSON.stringify(sign.data).slice(0,200));
 let token=sign.data?.access_token;
 if(!token){
  const login=await api('/auth/v1/token?grant_type=password',{email,password});
  if(login.status!==200||!login.data?.access_token)throw Error('Local Auth password login failed '+alias+': HTTP '+login.status);
  token=login.data.access_token;
 }
 return {id:sign.data.user.id,token,email};
}
async function setup(){
 const accounts={};
 for(const alias of ['guardian','familyB','professional','outsider'])accounts[alias]=await createAccount(alias);
 fs.writeFileSync(identitiesPath,JSON.stringify(accounts),{mode:0o600});
 console.log('PASS: four synthetic identities authenticated by local Supabase Auth');
}
async function verify(){
 const users=JSON.parse(fs.readFileSync(identitiesPath,'utf8'));
 const call=(name,fn,args)=>api('/rest/v1/rpc/'+fn,args,users[name].token);
 const list=(name)=>api('/rest/v1/pg06_lab_perspectives?select=id,version,child_id,body,context',undefined,users[name].token,'GET');
 let r=await api('/rest/v1/pg06_lab_perspectives?select=*',undefined,null,'GET');
 ok(r.status===401||r.status===403||JSON.stringify(r.data)==='[]','anonymous direct table denied');
 const invalid=users.guardian.token.slice(0,-5)+'abcde';
 r=await api('/rest/v1/rpc/pg06_lab_register',{p_child_id:childA,p_category:'OBSERVATION',p_body:'SYNTH-PERSPECTIVE-PRIVATE',p_context:'synthetic home'},invalid);
 denied(r,'tampered JWT cannot execute RPC');
 for(const name of ['guardian','familyB','professional','outsider']){
  r=await list(name);
  ok(r.status===200&&Array.isArray(r.data)&&r.data.length===0,'direct REST table RLS blocks '+name);
 }
 const base={p_child_id:childA,p_category:'OBSERVATION',p_body:'SYNTH-PERSPECTIVE-PRIVATE',p_context:'synthetic home'};
 r=await call('outsider','pg06_lab_register',base);
 denied(r,'outsider cannot forge contribution');
 r=await call('familyB','pg06_lab_register',base);
 denied(r,'different family cannot create in child A');
 r=await call('guardian','pg06_lab_register',base);
 ok(r.status===200&&typeof r.data==='string','guardian verified author can create synthetic perspective');
 const sourceId=r.data;
 r=await call('familyB','pg06_lab_register',{...base,p_child_id:childB,p_body:'SYNTH-OTHER-CHILD'});
 ok(r.status===200,'family B can contribute independently to child B');
 const bId=r.data;
 r=await call('guardian','pg06_lab_grant',{p_id:bId,p_version:1,p_recipient:users.professional.id,p_purpose:'care'});
 denied(r,'guardian of child A cannot grant child B');
 r=await call('professional','pg06_lab_grant',{p_id:sourceId,p_version:1,p_recipient:users.professional.id,p_purpose:'care'});
 denied(r,'professional cannot self-grant');
 r=await call('guardian','pg06_lab_grant',{p_id:sourceId,p_version:1,p_recipient:users.professional.id,p_purpose:'publicity'});
 denied(r,'authority for care cannot grant publicity');
 r=await call('guardian','pg06_lab_grant',{p_id:sourceId,p_version:1,p_recipient:users.professional.id,p_purpose:'care'});
 ok(r.status===200&&typeof r.data==='string','verified scoped guardian grants source/version/purpose to professional');
 const grantId=r.data;
 r=await call('professional','pg06_lab_read',{p_id:sourceId,p_version:1,p_purpose:'care'});
 ok(r.status===200&&r.data?.[0]?.body==='SYNTH-PERSPECTIVE-PRIVATE','professional reads exact granted version via signed JWT');
 r=await call('professional','pg06_lab_read',{p_id:sourceId,p_version:1,p_purpose:'publicity'});
 denied(r,'professional cannot reuse grant for new purpose');
 r=await call('familyB','pg06_lab_read',{p_id:sourceId,p_version:1,p_purpose:'care'});
 denied(r,'other family cannot read child A source');
 r=await call('outsider','pg06_lab_read',{p_id:sourceId,p_version:1,p_purpose:'care'});
 denied(r,'outsider cannot read source');
 r=await call('professional','pg06_lab_read',{p_id:sourceId,p_version:2,p_purpose:'care'});
 denied(r,'newer version not automatically disclosed');
 r=await call('professional','pg06_lab_revoke',{p_grant:grantId});
 denied(r,'professional cannot revoke guardian grant');
 r=await api('/rest/v1/pg06_lab_perspectives?id=eq.'+sourceId,{body:'FORGED'},users.professional.token,'PATCH');
 ok(r.status===401||r.status===403||r.status===404,'direct UPDATE denied by RLS');
 r=await api('/rest/v1/pg06_lab_grants?select=*',undefined,users.professional.token,'GET');
 ok(r.status===401||r.status===403||r.status===404,'private grant metadata not queryable via API');
 r=await api('/rest/v1/pg06_lab_report?select=*',undefined,users.professional.token,'GET');
 ok(r.status===401||r.status===403||r.status===404,'no report endpoint exposed');
 r=await api('/rest/v1/pg06_lab_export?select=*',undefined,users.professional.token,'GET');
 ok(r.status===401||r.status===403||r.status===404,'no export endpoint exposed');
 r=await call('guardian','pg06_lab_revoke',{p_grant:grantId});
 ok(r.status===200&&r.data===true,'verified revoker revokes grant in server transaction');
 r=await call('professional','pg06_lab_read',{p_id:sourceId,p_version:1,p_purpose:'care'});
 denied(r,'previous valid JWT immediately loses access after revocation');
 console.log('PG06-N06: '+passed+' API assertions passed using signed Supabase Auth JWTs.');
}
await (stage==='setup'?setup():verify());
