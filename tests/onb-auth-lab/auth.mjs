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
 return {token:login.data.access_token,id:login.data.user.id};
}
const a=await account('A'),b=await account('B'),p=await account('P');
const input={p_alias:'Adulto Teste A',p_journey:'FAMILY'};
ok(denied(await rpc('bootstrap',input)),'anonymous cannot bootstrap');
ok(denied(await rpc('bootstrap',input,a.token)),'acceptance mandatory');
ok((await rpc('accept',{p_version:0,p_terms:true,p_privacy:true},a.token)).status===400,'outdated acceptance rejected');
for(const user of [a,b,p]){
 const args={p_version:1,p_terms:true,p_privacy:true};
 for(let i=0;i<2;i++){const r=await rpc('accept',args,user.token);ok(r.status===200&&r.data===true,'idempotent explicit acceptance');}
}
const [x,y]=await Promise.all([rpc('bootstrap',input,a.token),rpc('bootstrap',input,a.token)]);
ok(x.status===200&&y.status===200&&!!x.data?.space_id&&x.data.space_id===y.data.space_id,'concurrent bootstrap same space');
const z=await rpc('bootstrap',{p_alias:'Adulto Teste B',p_journey:'FAMILY'},b.token);
ok(z.status===200&&z.data?.space_id!==x.data.space_id,'B independent space');
const pr=await rpc('bootstrap',{p_alias:'Adulto Teste P',p_journey:'PRO_INFO'},p.token);
ok(pr.status===200&&pr.data?.space_id===null,'professional preference grants no space');
ok(denied(await rpc('read_space',{p_space:x.data.space_id},b.token)),'B cannot read A space');
ok(denied(await rpc('read_space',{p_space:x.data.space_id},p.token)),'professional cannot read A space');
const own=await rpc('read_space',{p_space:x.data.space_id},a.token);
ok(own.status===200&&own.data?.empty===true,'A reads own empty space');
ok(denied(await rpc('bootstrap',{p_alias:'Adulto Teste P',p_journey:'FAMILY'},p.token)),'no implicit journey privilege transition');
for(const method of ['GET','PATCH','DELETE','POST']){
 const body=method==='GET'||method==='DELETE'?undefined:{creator_subject_id:b.id};
 ok(denied(await req('/rest/v1/onb_lab_spaces?id=eq.'+x.data.space_id,body,b.token,method)),'direct table '+method+' denied');
}
ok((await rpc('read_space',{p_space:x.data.space_id},a.token)).data?.empty===true,'A remains readable after denied mutations');
const out=await req('/auth/v1/logout?scope=local',undefined,a.token);
ok(out.status>=200&&out.status<300,'provider logout');
ok(denied(await rpc('read_space',{p_space:x.data.space_id},a.token)),'previous JWT denied after provider logout');
ok((await rpc('read_space',{p_space:z.data.space_id},b.token)).status===200,'B unaffected by A logout');
console.log('ONB-004 first slice: '+checks+' assertions; no credentials emitted.');
