import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const env=Object.fromEntries(fs.readFileSync(process.argv[2],'utf8').split(/\r?\n/).filter(l=>/^[A-Z_]+=/.test(l)).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1).replace(/^["']|["']$/g,'')]}));
const url=env.API_URL, key=env.ANON_KEY||env.PUBLISHABLE_KEY;
if(!/^http:\/\/127\.0\.0\.1:54321$/.test(url)||!key) throw Error('Only disposable local API allowed');
let checks=0;
function ok(condition,label){assert.ok(condition,label);checks++;console.log('PASS: '+label);}
async function req(path,body,token,method='POST'){
 const res=await fetch(url+path,{method,redirect:'error',headers:{apikey:key,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const raw=await res.text();let data;try{data=JSON.parse(raw)}catch{data=null}return {status:res.status,data};
}
const rpc=(name,args,token)=>req('/rest/v1/rpc/onb_lab_'+name,args,token);
const denied=r=>[401,403,404].includes(r.status);
async function account(alias){
 const email='onb-'+alias.toLowerCase()+'-'+crypto.randomBytes(6).toString('hex')+'@example.invalid', password=crypto.randomBytes(24).toString('hex');
 const signup=await req('/auth/v1/signup',{email,password,data:{role:'admin'}});
 ok(signup.status>=200&&signup.status<300,'synthetic signup '+alias);
 const login=await req('/auth/v1/token?grant_type=password',{email,password});
 ok(login.status===200&&!!login.data?.access_token,'signed password login '+alias);
 return {token:login.data.access_token,refresh:login.data.refresh_token,id:login.data.user.id,email,password};
}

import {execFileSync} from 'node:child_process';
const db=env.DB_URL;
if(!/^postgresql:\/\/[^@]+@127\.0\.0\.1:54322\/postgres$/.test(db||''))throw Error('Nonlocal DB forbidden');
function query(sql){return execFileSync('psql',[db,'-X','-v','ON_ERROR_STOP=1','-At','-c',sql],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();}
function claims(token){return JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString('utf8'));}
function uuid(value){if(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(value))throw Error('Invalid fixture UUID');return "'"+value+"'";}
const forbid=r=>[401,403].includes(r.status);
const login=async a=>{const r=await req('/auth/v1/token?grant_type=password',{email:a.email,password:a.password});ok(r.status===200&&!!r.data?.access_token,'fresh login');return {...a,token:r.data.access_token,refresh:r.data.refresh_token};};
async function bootstrap(a,alias){ok((await rpc('accept',{p_version:1,p_terms:true,p_privacy:true},a.token)).data===true,'acceptance');const r=await rpc('bootstrap',{p_alias:'Adulto Teste '+alias,p_journey:'FAMILY'},a.token);ok(r.status===200&&!!r.data?.space_id,'empty space');return r.data.space_id;}
const a=await account('A'),b=await account('B');
const sa=await bootstrap(a,'A'),sb=await bootstrap(b,'B');
const read=(a,s)=>rpc('read_space',{p_space:s},a.token);
ok((await read(a,sa)).status===200,'active session allowed');
const sid=claims(a.token).session_id;
query("update onb_lab.session_state set last_activity=clock_timestamp()-interval '31 minutes' where sid="+uuid(sid));
ok(forbid(await read(a,sa)),'inactivity denied with live JWT');
let fresh=await login(a);
ok((await read(fresh,sa)).status===200,'fresh session allowed after inactivity');
query("update auth.sessions set created_at=clock_timestamp()-interval '9 hours' where id="+uuid(claims(fresh.token).session_id));
ok(forbid(await read(fresh,sa)),'absolute duration denied with live JWT');
fresh=await login(a);
const before=crypto.randomUUID(),race=crypto.randomUUID(),after=crypto.randomUUID();
ok((await rpc('write_effect',{p_id:before},fresh.token)).data===true,'pre-revocation write allowed');
const results=await Promise.all([rpc('write_effect',{p_id:race},fresh.token),read(fresh,sa),rpc('revoke_current',{},fresh.token)]);
ok(results[2].status===200&&results[2].data===true,'application revocation commits');
ok((results[0].status===200&&results[0].data===true)||forbid(results[0]),'racing write allowed or denied');
ok(results[1].status===200||forbid(results[1]),'racing read allowed or denied');
ok(query("select count(*) from onb_lab.effects where id="+uuid(race))===(results[0].status===200?'1':'0'),'racing write HTTP result matches database effect');
ok(forbid(await rpc('write_effect',{p_id:after},fresh.token)),'post-revocation write denied');
ok(query("select count(*) from onb_lab.effects where id="+uuid(after))==='0','no post-revocation database effect');
ok(forbid(await read(fresh,sa)),'post-revocation read denied');
const refreshed=await req('/auth/v1/token?grant_type=refresh_token',{refresh_token:fresh.refresh});
if(refreshed.status===200){ok(claims(refreshed.data.access_token).session_id===claims(fresh.token).session_id,'refresh retains session identity');ok(forbid(await read({...fresh,token:refreshed.data.access_token},sa)),'refreshed token cannot bypass application revocation');}else ok(refreshed.status>=400&&refreshed.status<500,'refresh rejected by provider');
const provider=await login(a);
ok((await read(provider,sa)).status===200,'independent new session allowed');
const out=await req('/auth/v1/logout?scope=local',undefined,provider.token);
ok(out.status>=200&&out.status<300,'provider logout success');
ok(forbid(await read(provider,sa)),'provider revoked session denied');
const refreshOut=await req('/auth/v1/token?grant_type=refresh_token',{refresh_token:provider.refresh});
ok(refreshOut.status>=400&&refreshOut.status<500&&!refreshOut.data?.access_token,'provider revoked refresh denied');
ok((await read(b,sb)).status===200,'other family unaffected');
// Real provider-issued JWT expiration; wait until exp plus bounded clock-skew margin.
const expiry=await login(a),exp=claims(expiry.token).exp;
ok((await read(expiry,sa)).status===200,'expiry positive control');
const wait=exp*1000-Date.now()+65000;
ok(wait>0&&wait<370000,'bounded lab JWT lifetime');
await new Promise(r=>setTimeout(r,wait));
ok(forbid(await read(expiry,sa)),'expired provider JWT denied');
console.log('ONB-004.4: '+checks+' assertions; no credentials emitted.');
