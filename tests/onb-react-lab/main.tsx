import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {SupabaseAdultIdentityAdapter} from '../../src/infrastructure/supabaseAdultIdentityAdapter';
import {AdultSessionController,type AdultState,type Journey} from '../../src/domain/adultIdentityPort';
import './style.css';
const key=import.meta.env.VITE_ONB_LAB_PUBLIC_KEY;
const origin='http://127.0.0.1:3000';
type Stage='entry'|'confirm'|'recover'|'reset'|'accept'|'welcome'|'error';
function Lab(){
 const [stage,setStage]=useState<Stage>('entry'),[busy,setBusy]=useState(false),[email,setEmail]=useState('adulto-a@example.invalid'),[password,setPassword]=useState('exemplo-sintetico-123'),[callback,setCallback]=useState(''),[terms,setTerms]=useState(false),[privacy,setPrivacy]=useState(false),[journey,setJourney]=useState<Journey>('FAMILY'),[state,setState]=useState<AdultState>({kind:'SIGNED_OUT'});
 const port=useRef<SupabaseAdultIdentityAdapter|null>(null),controller=useRef<AdultSessionController|null>(null),lock=useRef(false);
 function get(){if(!port.current){port.current=new SupabaseAdultIdentityAdapter({dev:import.meta.env.DEV,pageOrigin:location.origin,apiOrigin:'http://127.0.0.1:54321',publicKey:key});controller.current=new AdultSessionController(port.current,s=>{setState(s);if(s.kind==='ACCEPTANCE')setStage('accept');else if(s.kind==='FAMILY'||s.kind==='PRO_INFO')setStage('welcome');else if(s.kind==='UNCERTAIN'||s.kind==='BLOCKED')setStage('error');else if(s.kind==='SIGNED_OUT'){setStage('entry');setTerms(false);setPrivacy(false);}});}return port.current;}
 async function run(action:()=>Promise<void>){if(lock.current)return;lock.current=true;setBusy(true);try{get();await action();}catch{setState({kind:'UNCERTAIN'});setStage('error');}finally{lock.current=false;setBusy(false);}}
 useEffect(()=>{
  if(stage!=='accept'&&stage!=='welcome')return;
  const check=()=>{const deadline=port.current?.sessionDeadline();if(!deadline||Date.now()>=deadline){setState({kind:'UNCERTAIN'});setStage('error');}};
  check();const timer=window.setInterval(check,500);window.addEventListener('focus',check);return()=>{clearInterval(timer);window.removeEventListener('focus',check);};
 },[stage]);
 const act=(f:()=>Promise<void>)=>()=>{void run(f);};
 const alias=email.includes('-a@')?'Adulto Teste A':email.includes('-b@')?'Adulto Teste B':'Adulto Teste P';
 return <main><h1>MUNDELO | Laboratório adulto</h1><p>Somente desenvolvimento local. Não informe dados reais. Cadastro infantil indisponível.</p><p role="status">{busy?'Processando…':({entry:'Identidade sintética',confirm:'Confirmação pendente',recover:'Recuperação pendente',reset:'Redefinir senha',accept:'Aceites necessários',welcome:'Acolhimento adulto',error:'Estado não confirmado'})[stage]}</p>
 <fieldset disabled={busy}><legend>Jornada de ensaio</legend>
 {stage==='entry'&&<><label>Identidade<select value={email} onChange={e=>setEmail(e.target.value)}>{['a','b','p'].map(a=><option key={a}>adulto-{a}@example.invalid</option>)}</select></label><label>Senha sintética<select value={password} onChange={e=>setPassword(e.target.value)}><option>exemplo-sintetico-123</option><option>exemplo-sintetico-456</option></select></label><button onClick={act(async()=>{await get().signup(email,password);setStage('confirm');})}>Cadastrar</button><button onClick={act(async()=>{await controller.current!.login(email,password);})}>Entrar</button><button onClick={act(async()=>{await get().requestRecovery(email);setStage('recover');})}>Recuperar senha</button></>}
 {(stage==='confirm'||stage==='recover')&&<><p>Abra o e-mail no Mailpit local, copie a URL de retorno e mantenha esta aba aberta. Recarregar cancela o fluxo. Se isso acontecer, reinicie a operação; não reutilize o retorno anterior.</p><label>URL de retorno<input autoComplete="off" value={callback} onChange={e=>setCallback(e.target.value)}/></label><button disabled={!callback} onClick={act(async()=>{const mode=stage;try{await get().completeCallback(callback);setStage(mode==='recover'?'reset':'entry');}finally{setCallback('');}})}>Confirmar retorno</button></>}
 {stage==='reset'&&<button onClick={act(async()=>{await get().resetPassword('exemplo-sintetico-456');setPassword('exemplo-sintetico-456');setStage('entry');})}>Redefinir senha sintética</button>}
 {stage==='accept'&&<><label><input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)}/> Aceito os termos de ensaio</label><label><input type="checkbox" checked={privacy} onChange={e=>setPrivacy(e.target.checked)}/> Aceito a privacidade de ensaio</label><label>Jornada<select value={journey} onChange={e=>setJourney(e.target.value as Journey)}><option value="FAMILY">Familiar</option><option value="PRO_INFO">Profissional</option></select></label><button disabled={!terms||!privacy} onClick={act(()=>controller.current!.enter(alias,journey,terms,privacy))}>Continuar</button></>}
 {stage==='welcome'&&<><h2>{state.kind==='FAMILY'?'Espaço familiar vazio':'Informações profissionais'}</h2><p>Nenhum perfil infantil disponível.</p>{state.kind==='FAMILY'&&<button onClick={act(()=>get().readSpace(state.space.space_id!))}>Revalidar espaço</button>}</>}
 {stage==='error'&&<p role="alert">Sessão expirada ou operação indisponível. Nenhum acesso pode ser presumido. Encerre a sessão; se a revogação não puder ser confirmada, o acesso continua bloqueado.</p>}
 {stage!=='entry'&&<button onClick={act(async()=>{if(stage==='accept'||stage==='welcome'||stage==='error'){await controller.current!.logout();}else{await get().signOut();port.current=null;controller.current=null;setCallback('');setState({kind:'SIGNED_OUT'});setStage('entry');setTerms(false);setPrivacy(false);}})}>Encerrar sessão</button>}
 </fieldset></main>;
}
const root=createRoot(document.getElementById('root')!);
if(import.meta.env.DEV&&location.origin===origin&&key){root.render(<Lab/>);}else{root.render(<main><h1>Laboratório indisponível</h1></main>);}
