// Real local GoTrue + Mailpit only. No production SDK or credentials.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const env=Object.fromEntries(fs.readFileSync(process.argv[2],'utf8').split(/\r?\n/).filter(l=>/^[A-Z_]+=/.test(l)).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1).replace(/^["']|["']$/g,'')]}));
const api=env.API_URL,key=env.ANON_KEY||env.PUBLISHABLE_KEY;
const mail='http://127.0.0.1:54324', callback='http://127.0.0.1:3000/onb-callback';
if(api!=='http://127.0.0.1:54321'||!key)throw Error('Nonlocal API forbidden');
let checks=0;
function ok(v,label){assert.ok(v,label);console.log('PASS: '+label);checks++;}
async function request(path,body,token,method='POST'){
 const r=await fetch(api+path,{method,redirect:'error',headers:{apikey:key,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});
 const data=await r.json().catch(()=>null);return {status:r.status,data};
}
const rejected=r=>r.status>=400&&r.status<500&&!r.data?.access_token;
const forbidden=r=>[401,403].includes(r.status);
function methods(token){
 const value=JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString('utf8')).amr;
 return Array.isArray(value)?value.map(x=>x.method):[];
}
function diagnostic(r,label){
 // Only status and validated SQLSTATE; never raw response, identifiers or tokens.
 console.log(label+': HTTP '+r.status+' SQLSTATE '+(/^[A-Z0-9]{5}$/.test(r.data?.code||'')?r.data.code:'none'));
}
const verifier=()=>crypto.randomBytes(48).toString('base64url');
async function emailLink(email,type='signup'){
 for(let i=0;i<40;i++){
  const r=await fetch(mail+'/api/v1/messages',{redirect:'error'});
  if(r.ok){
   const list=await r.json();
   const hits=list.messages?.filter(m=>m.To?.some(t=>t.Address===email))||[];
   for(const hit of hits){
    const msg=await (await fetch(mail+'/api/v1/message/'+encodeURIComponent(hit.ID),{redirect:'error'})).json();
    const source=(msg.Text||'')+' '+(msg.HTML||'');
    const links=source.match(/https?:\/\/[^\s<>"']+/g)||[];
    for(const raw of links){
     const u=new URL(raw.replaceAll('&amp;','&').replace(/\)\.?$/,''));
     if(u.origin===api&&u.pathname==='/auth/v1/verify'&&u.searchParams.has('token')&&u.searchParams.get('type')===type)return u;
    }
   }
  }
  await new Promise(r=>setTimeout(r,500));
 }
 throw Error('Confirmation message missing from local mailbox');
}
async function signup(redirect=callback){
 const email='onb-pkce-'+crypto.randomBytes(8).toString('hex')+'@example.invalid';
 const password=crypto.randomBytes(24).toString('hex'), v=verifier();
 const challenge=crypto.createHash('sha256').update(v).digest('base64url');
 const r=await request('/auth/v1/signup?redirect_to='+encodeURIComponent(redirect),{email,password,code_challenge:challenge,code_challenge_method:'s256'});
 ok(r.status>=200&&r.status<300&&!r.data?.access_token,'signup requires confirmation, no session');
 return {email,password,v};
}
async function openLink(link){
 const r=await fetch(link,{redirect:'manual'});
 const location=r.headers.get('location');
 ok(r.status>=300&&r.status<400&&!!location,'verification yields redirect');
 return new URL(location,api);
}
const exchange=(code,v)=>request('/auth/v1/token?grant_type=pkce',{auth_code:code,code_verifier:v});
const login=a=>request('/auth/v1/token?grant_type=password',{email:a.email,password:a.password});
const rpc=(name,args,token)=>request('/rest/v1/rpc/onb_lab_'+name,args,token);

function strictCallback(u){
 return u.origin+u.pathname===callback&&!u.username&&!u.password&&!u.hash&&u.searchParams.getAll('code').length===1&&!!u.searchParams.get('code')&&[...u.searchParams.keys()].every(k=>k==='code');
}
async function confirmedAccount(alias){
 const a=await signup();
 const dest=await openLink(await emailLink(a.email));
 ok(strictCallback(dest),'signup callback canonical');
 const s=await exchange(dest.searchParams.get('code'),a.v);
 ok(s.status===200&&!!s.data?.access_token,'confirmed account');
 const authenticated=await login(a);
 ok(authenticated.status===200&&!!authenticated.data?.access_token,'explicit password login after confirmation');
 const token=authenticated.data.access_token;
 ok(methods(token).includes('password')&&!methods(token).includes('recovery'),'password session signed AMR eligible');
 const acceptance=await rpc('accept',{p_version:1,p_terms:true,p_privacy:true},token);
 diagnostic(acceptance,'acceptance');
 ok(acceptance.status===200&&acceptance.data===true,'explicit acceptance');
 const space=await rpc('bootstrap',{p_alias:'Adulto Teste '+alias,p_journey:'FAMILY'},token);
 ok(space.status===200&&!!space.data?.space_id,'empty family space');
 return {...a,token,space:space.data.space_id};
}
const a=await confirmedAccount('A'),b=await confirmedAccount('B');
const v=verifier(),challenge=crypto.createHash('sha256').update(v).digest('base64url');
const recover=email=>request('/auth/v1/recover?redirect_to='+encodeURIComponent(callback),{email,code_challenge:challenge,code_challenge_method:'s256'});
const existing=await recover(a.email),missing=await recover('absent-'+crypto.randomBytes(8).toString('hex')+'@example.invalid');
ok(existing.status===missing.status&&existing.status===200&&JSON.stringify(existing.data)===JSON.stringify(missing.data),'recovery public response equivalent for existing and absent address');
const link=await emailLink(a.email,'recovery');
const dest=await openLink(link);
ok(strictCallback(dest),'recovery callback canonical');
const code=dest.searchParams.get('code');
const recovery=await exchange(code,v);
ok(recovery.status===200&&!!recovery.data?.access_token,'recovery exchange returns provider session');
ok(rejected(await exchange(code,v)),'recovery code replay denied');
const token=recovery.data.access_token;
ok(!methods(token).includes('password')||methods(token).includes('recovery'),'recovery AMR not eligible for protected effects');
const read=await rpc('read_space',{p_space:a.space},token);
diagnostic(read,'recovery read');
ok(forbidden(read),'recovery session cannot read own space');
ok(forbidden(await rpc('accept',{p_version:1,p_terms:true,p_privacy:true},token)),'recovery session cannot record acceptance');
ok(forbidden(await rpc('bootstrap',{p_alias:'Adulto Teste A',p_journey:'FAMILY'},token)),'recovery session cannot bootstrap');
const newPassword=crypto.randomBytes(24).toString('hex');
const change=await request('/auth/v1/user',{password:newPassword},token,'PUT');
ok(change.status===200,'provider accepts password change');
const logout=await request('/auth/v1/logout?scope=global',{},token);
ok(logout.status>=200&&logout.status<300,'global logout after recovery');
ok(forbidden(await rpc('read_space',{p_space:a.space},a.token)),'prior session denied after global logout');
ok(forbidden(await rpc('read_space',{p_space:a.space},token)),'recovery session denied after logout');
ok(rejected(await login(a)),'old password rejected');
const fresh=await login({...a,password:newPassword});
ok(fresh.status===200&&!!fresh.data?.access_token,'fresh password login required');
ok((await rpc('read_space',{p_space:a.space},fresh.data.access_token)).data?.empty===true,'fresh login restores own empty space');
ok((await rpc('read_space',{p_space:b.space},b.token)).data?.empty===true,'other family unaffected');
console.log('ONB-004.3: '+checks+' assertions; no credentials emitted.');
