// ONB-004.5: provider boundary, no runtime SDK dependency in this increment.
export type Journey = 'FAMILY' | 'PRO_INFO';
export type Space = {journey:Journey;space_id:string|null};
export interface AdultIdentityPort {
  login(email:string,password:string):Promise<void>;
  accept():Promise<void>;
  bootstrap(alias:string,journey:Journey):Promise<Space>;
  readSpace(id:string):Promise<void>;
  revoke():Promise<void>;
  signOut():Promise<void>;
}
export function localLabAllowed(dev:boolean,pageOrigin:string,apiOrigin:string):boolean {
  return dev && pageOrigin==='http://127.0.0.1:3000' && apiOrigin==='http://127.0.0.1:54321';
}
export function callbackCode(raw:string):string|null {
  try {
    const u=new URL(raw);
    if(u.origin!=='http://127.0.0.1:3000'||u.pathname!=='/onb-callback'||u.username||u.password||u.hash) return null;
    if(u.searchParams.getAll('code').length!==1||[...u.searchParams.keys()].some(k=>k!=='code'))return null;
    return u.searchParams.get('code')||null;
  } catch {return null;}
}
export type AdultState = {kind:'SIGNED_OUT'|'BUSY'|'ACCEPTANCE'|'BLOCKED'|'UNCERTAIN'} | {kind:'FAMILY'|'PRO_INFO';space:Space};
// Single-flight controller. No new login while an earlier provider mutation is in flight.
// Invalidated operations cannot publish stale state. Provider revocation remains authoritative.
export class AdultSessionController {
  private epoch=0;
  private busy=false;
  private state:AdultState={kind:'SIGNED_OUT'};
  constructor(private readonly port:AdultIdentityPort,private readonly publish:(s:AdultState)=>void){}
  private set(s:AdultState){this.state=s;this.publish(s);}
  async login(email:string,password:string){
    if(this.busy||this.state.kind!=='SIGNED_OUT')return;
    if(!/^adulto-[abp]@example\.invalid$/.test(email)||password!=='exemplo-sintetico-123'){this.set({kind:'BLOCKED'});return;}
    this.busy=true;const e=++this.epoch;this.set({kind:'BUSY'});
    try{await this.port.login(email,password);if(e===this.epoch)this.set({kind:'ACCEPTANCE'});}
    catch{if(e===this.epoch)this.set({kind:'UNCERTAIN'});}
    finally{this.busy=false;}
  }
  async enter(alias:string,journey:Journey,terms:boolean,privacy:boolean){
    if(this.busy||this.state.kind!=='ACCEPTANCE'||!terms||!privacy)return;
    if(!['Adulto Teste A','Adulto Teste B','Adulto Teste P'].includes(alias))return;
    this.busy=true;const e=++this.epoch;this.set({kind:'BUSY'});
    try{
      await this.port.accept();if(e!==this.epoch)return;
      const space=await this.port.bootstrap(alias,journey);if(e!==this.epoch)return;
      if(space.journey!==journey|| (journey==='FAMILY'?!space.space_id:space.space_id!==null))throw Error('Unexpected scope');
      if(journey==='FAMILY')await this.port.readSpace(space.space_id!);
      if(e===this.epoch)this.set({kind:journey,space});
    }catch{if(e===this.epoch)this.set({kind:'UNCERTAIN'});}
    finally{this.busy=false;}
  }
  async logout(){
    // Do not race SDK mutation with another login; invalidate UI immediately.
    ++this.epoch;this.set({kind:'UNCERTAIN'});
    if(this.busy)return; // caller must retry after pending operation settles
    this.busy=true;
    let revoked=false,signedOut=false;
    try{await this.port.revoke();revoked=true;}catch{}
    try{await this.port.signOut();signedOut=true;}catch{}
    finally{this.busy=false;this.set({kind:revoked&&signedOut?'SIGNED_OUT':'UNCERTAIN'});}
  }
}
