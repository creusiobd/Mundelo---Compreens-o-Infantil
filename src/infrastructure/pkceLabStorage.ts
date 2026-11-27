export type PendingFlow={mode:'CONFIRM_PENDING'|'RECOVERY_PENDING';email:string;expires:number};
const KEY='mundelo-onb-pkce-v1';
export const SDK_KEY='mundelo-onb-sdk-v1';
const VERIFIER=SDK_KEY+'-code-verifier';
const TTL=5*60*1000;
type RecordValue=PendingFlow&{verifier:string};
const validEmail=(s:unknown):s is string=>typeof s==='string'&&/^adulto-[abp]@example\.invalid$/.test(s);
function validVerifier(s:unknown):s is string{
 if(typeof s!=='string')return false;
 try{const v=JSON.parse(s);return typeof v==='string'&&/^[A-Za-z0-9._~-]{43,128}(\/PASSWORD_RECOVERY)?$/.test(v);}catch{return false;}
}
export class PkceLabStorage{
 private memory=new Map<string,string>();
 private active:PendingFlow|null=null;
 constructor(private readonly tab:Pick<Storage,'getItem'|'setItem'|'removeItem'>){}
 private read():RecordValue|null{
  try{
   const raw=this.tab.getItem(KEY);if(!raw)return null;
   const r=JSON.parse(raw);
   if(!['CONFIRM_PENDING','RECOVERY_PENDING'].includes(r.mode)||!validEmail(r.email)||!Number.isSafeInteger(r.expires)||r.expires<=Date.now()||r.expires>Date.now()+TTL||!validVerifier(r.verifier)){this.clear();return null;}
   const v=JSON.parse(r.verifier);
   if(v.endsWith('/PASSWORD_RECOVERY')!==(r.mode==='RECOVERY_PENDING')){this.clear();return null;}
   return r;
  }catch{this.clear();return null;}
 }
 pending():PendingFlow|null{const r=this.read();return r?{mode:r.mode,email:r.email,expires:r.expires}:null;}
 begin(mode:PendingFlow['mode'],email:string){if(!validEmail(email))throw Error('Invalid fixture');this.clear();this.active={mode,email,expires:Date.now()+TTL};}
 clear(){this.active=null;this.tab.removeItem(KEY);}
 getItem(key:string){return key===VERIFIER?this.read()?.verifier??null:this.memory.get(key)??null;}
 setItem(key:string,value:string){
  if(key!==VERIFIER){this.memory.set(key,value);return;}
  if(!this.active||this.active.expires<=Date.now()||!validVerifier(value))throw Error('Invalid verifier');
  this.tab.setItem(KEY,JSON.stringify({...this.active,verifier:value}));
 }
 removeItem(key:string){if(key===VERIFIER)this.clear();else this.memory.delete(key);}
}
