import assert from 'node:assert/strict';
import fs from 'node:fs';
import {SupabaseAdultIdentityAdapter,localFetch} from '../../src/infrastructure/supabaseAdultIdentityAdapter';
const env=Object.fromEntries(fs.readFileSync(process.argv[2],'utf8').split(/\r?\n/).filter(l=>/^[A-Z_]+=/.test(l)).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1).replace(/^["']|["']$/g,'')]}));
const config={dev:true,pageOrigin:'http://127.0.0.1:3000',apiOrigin:env.API_URL,publicKey:env.ANON_KEY||env.PUBLISHABLE_KEY};
const pass='exemplo-sintetico-123',next='exemplo-sintetico-456';
const a='adulto-a@example.invalid',b='adulto-b@example.invalid';
let checks=0;const ok=(label:string)=>{checks++;console.log('PASS: '+label);};
async function link(email:string,type:string){
 for(let i=0;i<40;i++){
  const response=await fetch('http://127.0.0.1:54324/api/v1/messages',{redirect:'error'});
  const list=await response.json();
  for(const hit of list.messages?.filter((m:any)=>m.To?.some((t:any)=>t.Address===email))||[]){
   const msg=await (await fetch('http://127.0.0.1:54324/api/v1/message/'+encodeURIComponent(hit.ID),{redirect:'error'})).json();
   for(const raw of ((msg.Text||'')+' '+(msg.HTML||'')).match(/https?:\/\/[^\s<>"']+/g)||[]){
    const u=new URL(raw.replaceAll('&amp;','&').replace(/\)\.?$/,''));
    if(u.origin===config.apiOrigin&&u.pathname==='/auth/v1/verify'&&u.searchParams.get('type')===type&&u.searchParams.has('token')){
     const r=await fetch(u,{redirect:'manual'});const loc=r.headers.get('location');
     assert.ok(r.status>=300&&r.status<400&&loc,'verification redirect');
     return new URL(loc!,config.apiOrigin).href;
    }
   }
  }
  await new Promise(r=>setTimeout(r,500));
 }
 throw Error('Synthetic message missing');
}
assert.throws(()=>new SupabaseAdultIdentityAdapter({...config,dev:false}));ok('production config denied');
assert.throws(()=>new SupabaseAdultIdentityAdapter({...config,apiOrigin:'https://external.invalid'}));ok('external API denied');
assert.throws(()=>new SupabaseAdultIdentityAdapter({...config,publicKey:'sb_secret_synthetic'}));ok('privileged key denied');
await assert.rejects(localFetch('https://external.invalid/auth/v1/token'));ok('transport external denied');
const A=new SupabaseAdultIdentityAdapter(config),B=new SupabaseAdultIdentityAdapter(config);
await assert.rejects(A.signup('real@example.invalid',pass));ok('nonfixture identity denied');
await A.signup(a,pass);await assert.rejects(A.accept());ok('unconfirmed cannot accept');
await assert.rejects(A.completeCallback('http://127.0.0.1:3999/onb-callback?code=synthetic'));ok('wrong callback denied');
const callback=await link(a,'signup');await A.completeCallback(callback);await assert.rejects(A.completeCallback(callback));ok('confirmation and replay denied');
await A.login(a,pass);await assert.rejects(A.bootstrap('Adulto Teste A','FAMILY'));ok('server requires acceptance');
await A.accept();const space=await A.bootstrap('Adulto Teste A','FAMILY');assert.ok(space.space_id);await A.readSpace(space.space_id!);ok('family bootstrap and read through SDK');
await B.signup(b,pass);await B.completeCallback(await link(b,'signup'));await B.login(b,pass);await B.accept();const other=await B.bootstrap('Adulto Teste B','FAMILY');assert.ok(other.space_id);
await assert.rejects(B.readSpace(space.space_id!));ok('cross family denied by server');
await A.revoke();await assert.rejects(A.readSpace(space.space_id!));await A.signOut();ok('application revocation and signout');
await A.requestRecovery(a);await A.completeCallback(await link(a,'recovery'));await assert.rejects(A.accept());await assert.rejects(A.readSpace(space.space_id!));ok('recovery phase blocks protected operations');
await A.resetPassword(next);const old=new SupabaseAdultIdentityAdapter(config);await assert.rejects(old.login(a,pass));ok('old password denied');
await A.login(a,next);await A.readSpace(space.space_id!);await B.readSpace(other.space_id!);ok('new login and unaffected family');
await A.revoke();await A.signOut();await B.revoke();await B.signOut();ok('cleanup');
console.log('ONB SDK adapter: '+checks+' scenarios');
