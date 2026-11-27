import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PkceLabStorage,SDK_KEY} from '../src/infrastructure/pkceLabStorage';
const verifier=SDK_KEY+'-code-verifier',value=JSON.stringify('a'.repeat(64));
function fixture(){const map=new Map<string,string>();const tab={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v)},removeItem:(k:string)=>{map.delete(k)}};return {map,tab};}
test('only verifier and context cross reload; session remains volatile',()=>{
 const {map,tab}=fixture(),a=new PkceLabStorage(tab);
 a.begin('CONFIRM_PENDING','adulto-a@example.invalid');a.setItem(verifier,value);a.setItem(SDK_KEY,'synthetic-session');
 const b=new PkceLabStorage(tab);assert.equal(b.getItem(SDK_KEY),null);assert.equal(b.getItem(verifier),value);assert.equal(b.pending()?.email,'adulto-a@example.invalid');assert.equal(map.size,1);
 b.removeItem(verifier);assert.equal(map.size,0);assert.equal(b.pending(),null);
});
test('invalid, expired or wrong-mode verifier rejected',()=>{
 const {map,tab}=fixture(),a=new PkceLabStorage(tab);
 assert.throws(()=>a.setItem(verifier,value));
 a.begin('RECOVERY_PENDING','adulto-p@example.invalid');a.setItem(verifier,value);assert.equal(a.pending(),null);
 a.begin('CONFIRM_PENDING','adulto-a@example.invalid');a.setItem(verifier,value);
 const key=[...map.keys()][0],r=JSON.parse(map.get(key)!);r.expires=Date.now()-1;map.set(key,JSON.stringify(r));assert.equal(a.pending(),null);assert.equal(map.size,0);
 assert.throws(()=>a.begin('CONFIRM_PENDING','real@example.com'));
});
