// Disposable identity lab. Not imported by the application.
import {PkceLabStorage,SDK_KEY,type PendingFlow} from './pkceLabStorage';
import {createClient, type SupabaseClient} from '@supabase/supabase-js';
import {callbackCode,localLabAllowed,type AdultIdentityPort,type Journey,type Space} from '../domain/adultIdentityPort';
const API='http://127.0.0.1:54321', CALLBACK='http://127.0.0.1:3000/onb-callback';
const unavailable=()=>new Error('Identidade de ensaio indisponível');
const fixtureEmail=(email:string)=>/^adulto-[abp]@example\.invalid$/.test(email);
const fixturePassword=(password:string)=>['exemplo-sintetico-123','exemplo-sintetico-456'].includes(password);
const uuid=(id:unknown):id is string=>typeof id==='string'&&/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id);
function anonKey(key:string){
 if(/^sb_publishable_[A-Za-z0-9_-]+$/.test(key))return true;
 try{return key.split('.').length===3&&JSON.parse(atob(key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role==='anon';}catch{return false;}
}
export async function localFetch(input:RequestInfo|URL,init?:RequestInit):Promise<Response>{
 const url=new URL(input instanceof Request?input.url:String(input));
 if(url.origin!==API||url.username||url.password||!(/^\/(?:auth|rest)\/v1(?:\/|$)/.test(url.pathname)))throw unavailable();
 return fetch(input,{...init,redirect:'error',credentials:'omit'});
}
type Phase='OUT'|'CONFIRM_PENDING'|'RECOVERY_PENDING'|'RECOVERY_ONLY'|'PASSWORD'|'UNCERTAIN';
export class SupabaseAdultIdentityAdapter implements AdultIdentityPort {
 private readonly client:SupabaseClient;
 private phase:Phase='OUT';
 private busy=false;
 private expires=0;
 private readonly continuity:PkceLabStorage|null;
 private pendingEmail:string|null=null;
 constructor(config:{dev:boolean;pageOrigin:string;apiOrigin:string;publicKey:string;continuity?:boolean}){
  if(!localLabAllowed(config.dev,config.pageOrigin,config.apiOrigin)||!anonKey(config.publicKey))throw unavailable();
  if(typeof window!=='undefined'&&(window.location.origin!==config.pageOrigin||!import.meta.env.DEV))throw unavailable();
  this.continuity=config.continuity&&typeof window!=='undefined'?new PkceLabStorage(window.sessionStorage):null;
  const pending=this.continuity?.pending();if(pending){this.phase=pending.mode;this.pendingEmail=pending.email;}
  this.client=createClient(API,config.publicKey,{auth:{persistSession:!!this.continuity,autoRefreshToken:false,detectSessionInUrl:false,flowType:'pkce',...(this.continuity?{storageKey:SDK_KEY,storage:this.continuity}:{})},global:{fetch:localFetch}});
 }
 private async run<T>(action:()=>Promise<T>):Promise<T>{
  if(this.busy)throw unavailable();
  this.busy=true;
  try{return await action();}catch{throw unavailable();}finally{this.busy=false;}
 }
 pendingFlow():PendingFlow|null{return this.continuity?.pending()??null;}
 private require(p:Phase){if(this.phase!==p)throw unavailable();}
 sessionDeadline():number|null{return this.phase==='PASSWORD'?this.expires:null;}
 private protected(){this.require('PASSWORD');if(Date.now()>=this.expires)throw unavailable();}
 private credentials(email:string,password:string){if(!fixtureEmail(email)||!fixturePassword(password))throw unavailable();}
 async signup(email:string,password:string){return this.run(async()=>{
  this.require('OUT');this.credentials(email,password);this.phase='UNCERTAIN';
  this.pendingEmail=email;this.continuity?.begin('CONFIRM_PENDING',email);
  const {data,error}=await this.client.auth.signUp({email,password,options:{emailRedirectTo:CALLBACK}});
  if(error||data.session){this.continuity?.clear();throw unavailable();}
  this.phase='CONFIRM_PENDING';
 });}
 async requestRecovery(email:string){return this.run(async()=>{
  this.require('OUT');if(!fixtureEmail(email))throw unavailable();this.phase='UNCERTAIN';
  this.pendingEmail=email;this.continuity?.begin('RECOVERY_PENDING',email);
  const {error}=await this.client.auth.resetPasswordForEmail(email,{redirectTo:CALLBACK});
  if(error){this.continuity?.clear();throw unavailable();}this.phase='RECOVERY_PENDING';
 });}
 async completeCallback(raw:string){return this.run(async()=>{
  const pending=this.phase;
  if(pending!=='CONFIRM_PENDING'&&pending!=='RECOVERY_PENDING')throw unavailable();
  const code=callbackCode(raw);if(!code)throw unavailable();
  this.phase='UNCERTAIN';
  if(this.continuity&&!this.continuity.pending())throw unavailable();
  let result:Awaited<ReturnType<typeof this.client.auth.exchangeCodeForSession>>;
  try{result=await this.client.auth.exchangeCodeForSession(code);}finally{this.continuity?.clear();}
  const {data,error}=result;
  if(error||!data.session||data.user?.email!==this.pendingEmail){if(data.session)await this.client.auth.signOut({scope:'local'});throw unavailable();}
  this.pendingEmail=null;
  if(pending==='RECOVERY_PENDING'){this.phase='RECOVERY_ONLY';return;}
  // Confirmation is not password authentication; require a fresh login.
  const out=await this.client.auth.signOut({scope:'local'});
  if(out.error)throw unavailable();this.phase='OUT';
 });}
 async resetPassword(password:string){return this.run(async()=>{
  this.require('RECOVERY_ONLY');if(!fixturePassword(password))throw unavailable();
  this.phase='UNCERTAIN';
  const {error}=await this.client.auth.updateUser({password});
  if(error)throw unavailable();
  const out=await this.client.auth.signOut({scope:'global'});
  if(out.error)throw unavailable();this.phase='OUT';
 });}
 async login(email:string,password:string){return this.run(async()=>{
  this.require('OUT');this.credentials(email,password);this.phase='UNCERTAIN';
  const {data,error}=await this.client.auth.signInWithPassword({email,password});
  if(error||!data.session||!data.user.email_confirmed_at||!data.session.expires_at)throw unavailable();
  this.expires=data.session.expires_at*1000;this.phase='PASSWORD';
 });}
 async accept(){return this.run(async()=>{
  this.protected();const {data,error}=await this.client.rpc('onb_lab_accept',{p_version:1,p_terms:true,p_privacy:true});
  if(error||data!==true)throw unavailable();this.protected();
 });}
 async bootstrap(alias:string,journey:Journey):Promise<Space>{return this.run(async()=>{
  this.protected();if(!['Adulto Teste A','Adulto Teste B','Adulto Teste P'].includes(alias)||!['FAMILY','PRO_INFO'].includes(journey))throw unavailable();
  const {data,error}=await this.client.rpc('onb_lab_bootstrap',{p_alias:alias,p_journey:journey});
  if(error||!data||data.journey!==journey||(journey==='FAMILY'?!uuid(data.space_id):data.space_id!==null))throw unavailable();
  this.protected();return {journey,space_id:data.space_id};
 });}
 async readSpace(id:string){return this.run(async()=>{
  this.protected();if(!uuid(id))throw unavailable();
  const {data,error}=await this.client.rpc('onb_lab_read_space',{p_space:id});
  if(error||data?.space_id!==id||data?.empty!==true)throw unavailable();this.protected();
 });}
 async revoke(){return this.run(async()=>{
  this.protected();this.phase='UNCERTAIN';
  const {data,error}=await this.client.rpc('onb_lab_revoke_current');
  if(error||data!==true)throw unavailable();
 });}
 async signOut(){return this.run(async()=>{
  this.phase='UNCERTAIN';this.expires=0;this.continuity?.clear();this.pendingEmail=null;
  const {error}=await this.client.auth.signOut({scope:'local'});
  if(error)throw unavailable();this.phase='OUT';
 });}
}
