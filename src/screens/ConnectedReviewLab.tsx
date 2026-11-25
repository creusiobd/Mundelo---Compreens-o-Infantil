import React,{useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {
 createLocalReviewAdapter,
 ReviewServerUnavailable,
 type LocalReviewCredentials,
 type ServerReviewSnapshot
} from '../domain/localReviewTransactionAdapter';
import type {ReviewDecision} from '../domain/reviewLabDemo';

type Props={credentials:LocalReviewCredentials;onBackToApp?:()=>void};
const options:ReadonlyArray<{id:ReviewDecision;label:string}>=[
 {id:'APPROVE',label:'Aprovar revisão humana'},
 {id:'REQUEST_COMPLEMENT',label:'Solicitar complementação'},
 {id:'KEEP_BLOCKED',label:'Manter bloqueado'}
];
const label:Record<string,string>={
 APPROVE:'Aprovado para uso delimitado',
 REQUEST_COMPLEMENT:'Complementação solicitada',
 KEEP_BLOCKED:'Bloqueio mantido'
};
const help:Record<ReviewServerUnavailable['code'],string>={
 DENIED:'A operação não foi autorizada pelo servidor. Nenhum desbloqueio foi presumido.',
 STALE:'O caso foi atualizado por outra operação. Recarregue a revisão antes de decidir.',
 NETWORK:'Não foi possível confirmar a decisão no servidor. O conteúdo permanece bloqueado nesta tela até a atualização.',
 MALFORMED:'A resposta do servidor não pôde ser validada. O conteúdo permanece bloqueado.'
};
const button='min-h-11 rounded-xl border border-[#133E43]/20 px-4 py-2 text-sm font-semibold';
export const ConnectedReviewLab:React.FC<Props>=({credentials,onBackToApp})=>{
 const adapter=useMemo(()=>createLocalReviewAdapter(credentials),[credentials]);
 const [state,setState]=useState<ServerReviewSnapshot|null>(null);
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 const [outcome,setOutcome]=useState<ReviewDecision>('REQUEST_COMPLEMENT');
 const [reason,setReason]=useState('');
 const [request,setRequest]=useState('');
 const [ack,setAck]=useState(false);
 const guard=useRef(false);
 const mounted=useRef(true);
 const refresh=useCallback(async()=>{
  setLoading(true);
  setState(null); // fail closed before any network request
  setNotice('');
  try{
   const response=await adapter.load();
   if(mounted.current){setState(response);setError('');}
  }catch(e){
   if(mounted.current)setError(e instanceof ReviewServerUnavailable?
    help[e.code]:'Não foi possível validar a revisão neste laboratório.');
  }finally{
   if(mounted.current)setLoading(false);
  }
 },[adapter]);
 useEffect(()=>{
  mounted.current=true;
  void refresh();
  return ()=>{mounted.current=false;};
 },[refresh]);
 const submit=async(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  if(guard.current || !state || state.status==='REVIEWED')return;
  if(!ack){setError('Confirme que analisou cada perspectiva com a respectiva autoria.');return;}
  if(!state.evidenceId){setError('Não existe evidência válida para esta geração. Não é possível registrar a decisão.');return;}
  guard.current=true;
  setBusy(true);
  setError('');
  setNotice('');
  const before=state;
  setState(null); // pessimistic UI: never show old approval during transaction
  try{
   const after=await adapter.decide({
    outcome,
    reason,
    requestedInformation:outcome==='REQUEST_COMPLEMENT'?request:'',
    expectedRevision:before.revision,
    perspectiveIds:before.perspectives.map(p=>p.id),
    decisionId:crypto.randomUUID()
   },before);
   if(mounted.current){
    setState(after);
    setNotice(after.revision>before.revision?
     'O servidor confirmou uma decisão e a revisão vigente foi atualizada.':
     'Estado atualizado pelo servidor.');
    setReason('');setRequest('');setAck(false);
   }
  }catch(e){
   if(mounted.current)setError(e instanceof ReviewServerUnavailable?
    help[e.code]:'O registro não foi confirmado. Atualize o estado no servidor.');
  }finally{
   guard.current=false;
   if(mounted.current)setBusy(false);
  }
 };
 const blocked=!state || state.status!=='REVIEWED';
 return <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:py-10 text-[#133E43]" data-testid="pg06-n14-connected-review">
  <header className="rounded-3xl bg-[#133E43] p-6 text-white space-y-3">
   <div className="flex flex-wrap items-center justify-between gap-3">
    <span className="rounded-xl bg-white/15 px-3 py-2 text-xs font-bold">LAB LOCAL · JWT SINTÉTICO · SEM DADOS REAIS</span>
    {onBackToApp&&<button type="button" className="min-h-11 rounded-xl bg-white/15 px-4 text-sm" onClick={onBackToApp}>Voltar ao MUNDELO</button>}
   </div>
   <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Revisão humana de perspectivas</h1>
   <p className="text-sm text-white/85">Nesta execução de laboratório as decisões são submetidas a um checkpoint transacional autenticado. Nenhuma credencial de serviço ou informação infantil real é utilizada.</p>
  </header>
  <section className="rounded-3xl border border-[#133E43]/15 bg-white p-5 space-y-3" aria-labelledby="connected-case-heading">
   <h2 id="connected-case-heading" className="font-display text-xl font-bold">Síntese fictícia · criança sintética A</h2>
   <div role="status" aria-live="polite" data-testid="connected-review-status"
    className={'rounded-xl border p-4 text-sm font-bold '+(blocked?'border-amber-300 bg-amber-50 text-amber-950':'border-[#408873] bg-[#E5F5EE] text-[#194F40]')}>
    {loading?'Validando estado no servidor…':
     !state?'Estado indisponível. Síntese bloqueada por segurança.':
     state.status==='REVIEWED'?'Checkpoint humano confirmado pelo servidor':
     state.status==='COMPLEMENT_REQUESTED'?'Complementação pendente. Síntese bloqueada.':
     'Síntese bloqueada. Aguardando revisão.'}
   </div>
   <p className="text-xs text-[#265358]">Revisão confirmada: {state?.revision??'indisponível'} · Retenção: {state?.retentionPending?'exige avaliação própria':'sem decisão nesta interface'}</p>
   <p className="rounded-xl bg-[#F8F5EF] p-3 text-sm">A confirmação de uma revisão não concede por si só acesso, compartilhamento ou exportação. Todas essas operações dependem de permissões verificadas no servidor.</p>
  </section>
  {error&&<p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-900">{error}</p>}
  {notice&&<p role="status" className="rounded-xl bg-[#E5F5EE] p-4 text-sm font-semibold">{notice}</p>}
  <button type="button" disabled={busy||loading} onClick={()=>void refresh()} className={button}>Recarregar estado confirmado</button>
  {state&&<section className="space-y-3" aria-labelledby="connected-perspectives">
   <h2 id="connected-perspectives" className="font-display text-xl font-bold">Perspectivas independentes</h2>
   <p className="text-sm">As contribuições pertencem a seus respectivos autores. Nenhuma interpretação substitui a experiência subjetiva da criança.</p>
   <div className="grid gap-4 md:grid-cols-3" data-testid="connected-perspectives">
    {state.perspectives.map(p=><article key={p.id} className="rounded-2xl border border-[#133E43]/15 bg-white p-4 space-y-2">
     <h3 className="text-sm font-bold">Autor fictício · {p.authorId.slice(0,8)}</h3>
     <p className="text-xs font-semibold text-[#265358]">{p.provenance==='INTERPRETATION'?'Interpretação adulta':p.provenance==='REPORTED'?'Relato atribuído':'Observação direta'}</p>
     <p className="text-sm leading-relaxed">{p.statement}</p>
    </article>)}
   </div>
  </section>}
  {state&&state.status!=='REVIEWED'&&<section className="rounded-3xl border border-[#133E43]/15 bg-white p-5 space-y-4">
   <h2 className="font-display text-xl font-bold">Decisão autenticada</h2>
   <form onSubmit={e=>void submit(e)} className="space-y-4" data-testid="connected-review-form">
    <fieldset><legend className="mb-2 text-sm font-semibold">Decisão</legend>
     <div className="grid gap-2 sm:grid-cols-3">{options.map(option=><label key={option.id}
      className="flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border border-[#133E43]/20 p-3 text-sm">
      <input type="radio" name="server-decision" value={option.id} checked={outcome===option.id} disabled={busy}
       onChange={()=>setOutcome(option.id)}/>{option.label}
     </label>)}</div>
    </fieldset>
    <label className="block space-y-2 text-sm font-semibold" htmlFor="connected-reason">
     Justificativa (20 a 500 caracteres)
     <textarea id="connected-reason" className="block w-full rounded-xl border border-[#133E43]/30 p-3 text-sm"
      minLength={20} maxLength={500} rows={3} required disabled={busy}
      value={reason} onChange={e=>setReason(e.target.value)}/>
    </label>
    {outcome==='REQUEST_COMPLEMENT'&&<label htmlFor="connected-complement" className="block space-y-2 text-sm font-semibold">
      Informação complementar necessária
      <textarea id="connected-complement" className="block w-full rounded-xl border border-[#133E43]/30 p-3 text-sm"
       minLength={15} maxLength={500} rows={2} required disabled={busy}
       value={request} onChange={e=>setRequest(e.target.value)}/>
    </label>}
    <label className="flex items-start gap-2 rounded-xl bg-[#F8F5EF] p-3 text-sm">
     <input type="checkbox" checked={ack} disabled={busy} onChange={e=>setAck(e.target.checked)} className="mt-1"/>
     <span>Considerei todas as perspectivas atribuídas. Esta avaliação não define a identidade ou o significado definitivo da manifestação da criança.</span>
    </label>
    <button type="submit" disabled={busy||!state.evidenceId}
      className="min-h-11 rounded-xl bg-[#133E43] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">
     {busy?'Aguardando confirmação do servidor…':'Registrar no laboratório: '+options.find(o=>o.id===outcome)?.label}
    </button>
   </form>
  </section>}
  {state&&<section className="rounded-3xl border border-[#133E43]/15 bg-white p-5 space-y-3">
   <h2 className="font-display text-xl font-bold">Histórico confirmado pelo servidor</h2>
   {state.history.length===0?<p className="text-sm">Nenhuma decisão persistida nesta síntese sintética.</p>:
    <ol data-testid="connected-review-history" className="space-y-3">
     {state.history.map(e=><li key={e.id} className="rounded-xl bg-[#F8F5EF] p-3 text-sm space-y-1">
      <p className="font-bold">{label[e.outcome]} · revisão #{e.revision}</p>
      <p>Revisor autenticado: {e.authorId.slice(0,8)} · perspectivas referenciadas: {e.perspectives.length}</p>
      <p>{e.reason}</p>
      {e.request&&<p>Complementação: {e.request}</p>}
     </li>)}</ol>}
  </section>}
  <p className="text-sm font-semibold text-[#75432F]">Ambiente controlado exclusivamente sintético. Gates jurídicos, retenção hospedada e prontidão continuam NO-GO.</p>
 </div>;
};
