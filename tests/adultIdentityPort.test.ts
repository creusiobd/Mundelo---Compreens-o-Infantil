import {test} from 'node:test';
import assert from 'node:assert/strict';
import {AdultSessionController,callbackCode,localLabAllowed,type AdultIdentityPort,type AdultState} from '../src/domain/adultIdentityPort';
test('strict callback and loopback only',()=>{
 assert.equal(callbackCode('http://127.0.0.1:3000/onb-callback?code=test'),'test');
 for(const url of ['http://127.0.0.1:3999/onb-callback?code=test','http://127.0.0.1:3000/wrong?code=test','http://127.0.0.1:3000/onb-callback?code=a&code=b','http://127.0.0.1:3000/onb-callback?code=a#token','https://external.invalid/onb-callback?code=a'])assert.equal(callbackCode(url),null);
 assert.equal(localLabAllowed(true,'http://127.0.0.1:3000','http://127.0.0.1:54321'),true);
 assert.equal(localLabAllowed(false,'http://127.0.0.1:3000','http://127.0.0.1:54321'),false);
 assert.equal(localLabAllowed(true,'http://127.0.0.1:3000','https://external.invalid'),false);
});
function fixture(){const calls:string[]=[];const states:AdultState[]=[];const port:AdultIdentityPort={async login(){calls.push('login')},async accept(){calls.push('accept')},async bootstrap(_,journey){calls.push('bootstrap');return {journey,space_id:journey==='FAMILY'?'fixture-space':null}},async readSpace(){calls.push('read')},async revoke(){calls.push('revoke')},async signOut(){calls.push('logout')}};return {calls,states,port};}
test('family requires explicit acceptance and server read',async()=>{
 const f=fixture(),c=new AdultSessionController(f.port,s=>f.states.push(s));
 await c.login('adulto-a@example.invalid','exemplo-sintetico-123');
 await c.enter('Adulto Teste A','FAMILY',true,false);assert.deepEqual(f.calls,['login']);
 await c.enter('Adulto Teste A','FAMILY',true,true);assert.deepEqual(f.calls,['login','accept','bootstrap','read']);assert.equal(f.states.at(-1)?.kind,'FAMILY');
 await c.logout();assert.equal(f.states.at(-1)?.kind,'SIGNED_OUT');
});
test('professional gets no family read; failed logout remains uncertain',async()=>{
 const f=fixture();f.port.revoke=async()=>{throw Error('fixture')};const c=new AdultSessionController(f.port,s=>f.states.push(s));
 await c.login('adulto-p@example.invalid','exemplo-sintetico-123');await c.enter('Adulto Teste P','PRO_INFO',true,true);assert.equal(f.states.at(-1)?.kind,'PRO_INFO');assert.ok(!f.calls.includes('read'));
 await c.logout();assert.equal(f.states.at(-1)?.kind,'UNCERTAIN');assert.ok(f.calls.includes('logout'));
});
test('late login cannot restore access after invalidation',async()=>{
 const f=fixture();let release!:()=>void;f.port.login=()=>new Promise<void>(r=>{release=r});const c=new AdultSessionController(f.port,s=>f.states.push(s));
 const pending=c.login('adulto-a@example.invalid','exemplo-sintetico-123');await c.logout();release();await pending;assert.equal(f.states.at(-1)?.kind,'UNCERTAIN');assert.ok(!f.states.some(s=>s.kind==='ACCEPTANCE'));await c.logout();assert.equal(f.states.at(-1)?.kind,'SIGNED_OUT');
});
