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
async function request(path,body,token){
 const r=await fetch(api+path,{method:'POST',redirect:'error',headers:{apikey:key,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});
 const data=await r.json().catch(()=>null);return {status:r.status,data};
}
const rejected=r=>r.status>=400&&r.status<500&&!r.data?.access_token;
const verifier=()=>crypto.randomBytes(48).toString('base64url');
async function emailLink(email){
 for(let i=0;i<40;i++){
  const r=await fetch(mail+'/api/v1/messages',{redirect:'error'});
  if(r.ok){
   const list=await r.json();
   const hit=list.messages?.find(m=>m.To?.some(t=>t.Address===email));
   if(hit){
    const msg=await (await fetch(mail+'/api/v1/message/'+encodeURIComponent(hit.ID),{redirect:'error'})).json();
    const source=(msg.Text||'')+' '+(msg.HTML||'');
    const links=source.match(/https?:\/\/[^\s<>"']+/g)||[];
    for(const raw of links){
     const u=new URL(raw.replaceAll('&amp;','&').replace(/\)\.?$/,''));
     if(u.origin===api&&u.pathname==='/auth/v1/verify'&&u.searchParams.has('token'))return u;
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
const a=await signup();
ok(rejected(await login(a)),'unconfirmed password login rejected');
ok(rejected(await rpc('bootstrap',{p_alias:'Adulto Teste A',p_journey:'FAMILY'})),'no anonymous bootstrap');
const link=await emailLink(a.email);
const destination=await openLink(link);
ok(destination.origin+destination.pathname===callback,'exact allowlisted callback');
const code=destination.searchParams.get('code');
ok(!!code&&!destination.hash.includes('access_token'),'authorization code, no access token in fragment');
ok(strictCallback(destination),'callback guard before code exchange');
const session=await exchange(code,a.v);
ok(session.status===200&&!!session.data?.access_token,'valid PKCE exchange');
ok(rejected(await exchange(code,a.v)),'authorization code replay rejected');
const token=session.data.access_token;
ok(rejected(await rpc('bootstrap',{p_alias:'Adulto Teste A',p_journey:'FAMILY'},token)),'confirmed identity still needs acceptance');
ok((await rpc('accept',{p_version:1,p_terms:true,p_privacy:true},token)).data===true,'explicit acceptance');
const space=await rpc('bootstrap',{p_alias:'Adulto Teste A',p_journey:'FAMILY'},token);
ok(space.status===200&&!!space.data?.space_id,'confirmed accepted identity bootstraps empty space');
ok((await login(a)).status===200,'password login after confirmation');
const b=await signup();
const bDest=await openLink(await emailLink(b.email));
const bCode=bDest.searchParams.get('code');
ok(!!bCode,'separate PKCE code');
ok(rejected(await exchange(bCode,verifier())),'wrong verifier rejected');
const c=await signup();
const cDest=await openLink(await emailLink(c.email));
ok(rejected(await request('/auth/v1/token?grant_type=pkce',{auth_code:cDest.searchParams.get('code')})),'missing verifier rejected');
// GoTrue may permit additional loopback ports/paths on SITE_URL's hostname.
// A different reserved hostname tests the provider boundary without following it.
const d=await signup('http://redirect-denied.invalid/unapproved');
const dDest=await openLink(await emailLink(d.email));
ok(dDest.origin==='http://127.0.0.1:3000'&&dDest.pathname==='/','foreign hostname falls back to configured site');
// Application boundary is stricter than provider redirect policy. Never exchange
// codes delivered to a different origin/path, including same-host local ports.
function strictCallback(u){
 return u.origin+u.pathname===callback&&!u.username&&!u.password&&!u.hash&&
 u.searchParams.getAll('code').length===1&&!!u.searchParams.get('code')&&
 [...u.searchParams.keys()].every(k=>k==='code');
}
ok(strictCallback(destination),'exact application callback accepted');
ok(!strictCallback(dDest),'fallback is not an application callback');
const e=await signup('http://127.0.0.1:3999/unapproved');
const eDest=await openLink(await emailLink(e.email));
ok(!strictCallback(eDest),'alternate loopback port or fallback rejected by application boundary');
console.log('Provider loopback redirect classification: '+(eDest.origin==='http://127.0.0.1:3999'?'alternate-port':'other'));
for(const candidate of [
 'http://127.0.0.1:3000/unapproved?code=synthetic',
 'http://127.0.0.1:3999/onb-callback?code=synthetic',
 callback+'?code=one&code=two',
 callback+'?code=synthetic&next=http://redirect-denied.invalid',
 callback+'?code=synthetic#access_token=synthetic'
])ok(!strictCallback(new URL(candidate)),'noncanonical application callback denied');
console.log('ONB-004.2: '+checks+' assertions; no tokens or email contents emitted.');
