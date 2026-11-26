import React, { useState } from 'react';
import { getLocalReviewCredentials } from '../domain/localReviewTransactionAdapter';
import { ConnectedReviewLab } from './ConnectedReviewLab';
import {
  applySyntheticReview,
  INITIAL_REVIEW_STATE,
  simulateNewSourceChange,
  SYNTHETIC_CASE,
  type ReviewDecision,
  type ReviewState
} from '../domain/reviewLabDemo';
import { AlertTriangle, ArrowLeft, CheckCircle2, CircleHelp, LockKeyhole, RotateCcw, ShieldCheck } from 'lucide-react';

const outcomeLabels:Record<ReviewDecision,string>={
 APPROVE:'Aprovar avaliação sintética',
 REQUEST_COMPLEMENT:'Solicitar complementação',
 KEEP_BLOCKED:'Manter bloqueado'
};
const outcomeNames:Record<ReviewDecision,string>={
 APPROVE:'Avaliação aprovada na demonstração',
 REQUEST_COMPLEMENT:'Complementação solicitada',
 KEEP_BLOCKED:'Bloqueio mantido'
};
const errorText={
 INVALID_REVIEW:'Preencha a justificativa e os detalhes exigidos para esta decisão.',
 STALE_REVISION:'O caso mudou. Atualize a revisão antes de tomar outra decisão.',
 UNKNOWN_PERSPECTIVE:'É necessário considerar todas as perspectivas atribuídas desta síntese.',
 DUPLICATE_DECISION:'Esta decisão já foi registrada nesta sessão.'
};

interface Props { onBackToApp?:()=>void }
const inputClass='w-full rounded-xl border border-[#133E43]/25 bg-white px-3 py-3 text-sm text-[#133E43] focus-visible:outline-2 focus-visible:outline-[#133E43]';

export const HumanReviewLabScreen:React.FC<Props>=({onBackToApp})=>{
 const [record,setRecord]=useState<ReviewState>(INITIAL_REVIEW_STATE);
 const [outcome,setOutcome]=useState<ReviewDecision>('REQUEST_COMPLEMENT');
 const [reason,setReason]=useState('');
 const [request,setRequest]=useState('');
 const [acknowledged,setAcknowledged]=useState(false);
 const [notice,setNotice]=useState('');
 const [error,setError]=useState('');
 const [sequence,setSequence]=useState(0);

 const localCredentials=getLocalReviewCredentials();
 if(localCredentials)return <ConnectedReviewLab credentials={localCredentials} onBackToApp={onBackToApp}/>;

 const submit=(event:React.FormEvent<HTMLFormElement>)=>{
  event.preventDefault();
  setError('');
  setNotice('');
  if(!acknowledged){setError('Confirme que analisou as três perspectivas sem escolher uma como verdade definitiva.');return;}
  const command={
   outcome,
   expectedRevision:record.revision,
   reason,
   requestedInformation:outcome==='REQUEST_COMPLEMENT'?request:'',
   perspectiveIds:SYNTHETIC_CASE.perspectives.map(p=>p.id),
   actor:'Revisor fictício D',
   decisionId:'review-lab-'+sequence,
   recordedAt:new Date().toISOString()
  };
  const result=applySyntheticReview(record,SYNTHETIC_CASE,command);
  if(!result.ok){setError(errorText[result.reason]);return;}
  setRecord(result.state);
  setSequence(sequence+1);
  setReason('');
  setRequest('');
  setAcknowledged(false);
  setNotice('Decisão registrada apenas na memória desta demonstração. Nenhuma concessão ou exportação foi efetuada.');
 };
 const blocked=record.status!=='SIMULATED_REVIEW';

 return <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10 space-y-6 text-[#133E43]" data-testid="human-review-lab">
  <header className="rounded-3xl bg-[#133E43] p-6 text-white space-y-3">
   <div className="flex flex-wrap items-center justify-between gap-3">
    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
     <ShieldCheck size={16} aria-hidden="true"/> LABORATÓRIO DEV · DADOS FICTÍCIOS
    </span>
    {onBackToApp&&<button type="button" onClick={onBackToApp} className="min-h-11 rounded-xl bg-white/15 px-4 text-sm font-semibold hover:bg-white/25">
     <ArrowLeft size={16} className="mr-2 inline" aria-hidden="true"/>Voltar ao MUNDELO
    </button>}
   </div>
   <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Revisão humana de perspectivas</h1>
   <p className="max-w-3xl text-sm leading-relaxed text-white/90">
    Protótipo de interface, 100% sintético e em memória. Nenhuma decisão aqui comprova autoridade jurídica,
    conecta-se ao Supabase ou libera dados infantis reais.
   </p>
  </header>

  <section className="rounded-3xl border border-[#133E43]/15 bg-white p-5 sm:p-6 space-y-4" aria-labelledby="review-case-title">
   <div className="flex flex-wrap items-start justify-between gap-4">
    <div>
     <p className="text-xs font-semibold uppercase tracking-wider text-[#265358]">{SYNTHETIC_CASE.childAlias}</p>
     <h2 id="review-case-title" className="font-display text-xl font-extrabold">{SYNTHETIC_CASE.title}</h2>
     <p className="mt-1 text-xs text-[#265358]">Revisão ilustrativa #{record.revision} · Fontes fictícias nas versões {SYNTHETIC_CASE.sourceVersions.map(s=>s.version).join(' e ')}</p>
    </div>
    <div role="status" aria-live="polite" data-testid="review-status"
      className={'inline-flex min-h-11 items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-bold '+
       (blocked?'border-[#9B5C45]/35 bg-[#FFF0E8] text-[#75432F]':'border-[#276655]/30 bg-[#E5F5EE] text-[#194F40]')}>
     {blocked?<LockKeyhole size={18} aria-hidden="true"/>:<CheckCircle2 size={18} aria-hidden="true"/>}
     {record.status==='COMPLEMENT_REQUESTED'?'Complementação pendente':
      blocked?'Síntese bloqueada':'Avaliação simulada registrada'}
    </div>
   </div>
   <div className="rounded-2xl bg-[#F8F5EF] px-4 py-3 text-sm leading-relaxed">
    <strong>Estado de acesso:</strong> leitura, compartilhamento e exportação reais permanecem indisponíveis.
    {blocked?' A síntese não está habilitada para apresentação.':' A aprovação visual é apenas uma simulação, sem concessão de acesso.'}
   </div>
  </section>

  <section className="space-y-4" aria-labelledby="perspectives-title">
   <div>
    <h2 id="perspectives-title" className="font-display text-xl font-extrabold">Perspectivas preservadas</h2>
    <p className="mt-1 text-sm text-[#265358]">Cada contribuição tem autoria e origem próprias. A interpretação não substitui a observação.</p>
   </div>
   <div className="grid gap-4 md:grid-cols-3" data-testid="perspective-collection">
    {SYNTHETIC_CASE.perspectives.map(p=><article key={p.id}
      className="rounded-3xl border border-[#133E43]/15 bg-white p-5 space-y-3">
     <p className="text-xs font-bold uppercase tracking-wide text-[#265358]">{p.role}</p>
     <h3 className="text-base font-bold">{p.author}</h3>
     <p className="inline-block rounded-lg bg-[#80C5B5]/20 px-2 py-1 text-xs font-semibold">
      {p.provenance==='INTERPRETACAO'?'Interpretação adulta':'Observação direta'}
     </p>
     <p className="text-sm leading-relaxed">{p.statement}</p>
    </article>)}
   </div>
   <p className="rounded-xl border-l-4 border-[#80C5B5] bg-white px-4 py-3 text-sm">
    Nenhuma destas perspectivas é apresentada como sentimento, diagnóstico ou identidade definitiva da criança.
   </p>
  </section>

  <section className="rounded-3xl border border-[#133E43]/15 bg-white p-5 sm:p-6 space-y-5" aria-labelledby="decision-title">
   <div>
    <h2 id="decision-title" className="font-display text-xl font-extrabold">Registrar decisão de revisão</h2>
    <p className="mt-1 text-sm text-[#265358]">Revisor fictício D · Formulário demonstrativo sem envio a servidores.</p>
   </div>
   <form onSubmit={submit} className="space-y-5" data-testid="human-review-form">
    <fieldset className="space-y-3">
     <legend className="mb-2 text-sm font-bold">Qual é a decisão?</legend>
     <div className="grid gap-3 sm:grid-cols-3">
      {(['APPROVE','REQUEST_COMPLEMENT','KEEP_BLOCKED'] as const).map(choice=><label
       key={choice}
       className={'flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border p-3 text-sm font-semibold '+
        (outcome===choice?'border-[#133E43] bg-[#EAF4F0]':'border-[#133E43]/20 bg-white')}>
       <input type="radio" name="human-decision" value={choice} checked={outcome===choice}
        onChange={()=>{setOutcome(choice);setError('');}} className="h-4 w-4 accent-[#133E43]"/>
       {outcomeLabels[choice]}
      </label>)}
     </div>
    </fieldset>
    <div>
     <label htmlFor="review-reason" className="mb-2 block text-sm font-bold">Justificativa da decisão (20 a 500 caracteres)</label>
     <textarea id="review-reason" rows={4} minLength={20} maxLength={500} required
      className={inputClass} value={reason} onChange={e=>setReason(e.target.value)}
      placeholder="Descreva as evidências e os limites do que foi possível concluir."/>
     <p className="mt-1 text-right text-xs text-[#265358]">{reason.length}/500</p>
    </div>
    {outcome==='REQUEST_COMPLEMENT'&&<div>
     <label htmlFor="review-request" className="mb-2 block text-sm font-bold">Informações complementares necessárias</label>
     <textarea id="review-request" rows={3} minLength={15} maxLength={500} required
      className={inputClass} value={request} onChange={e=>setRequest(e.target.value)}
      placeholder="Que observação, contexto ou esclarecimento precisa ser acrescentado?"/>
    </div>}
    <label className="flex items-start gap-3 rounded-2xl bg-[#F8F5EF] p-4 text-sm leading-relaxed">
     <input type="checkbox" checked={acknowledged} onChange={e=>setAcknowledged(e.target.checked)}
       className="mt-1 h-4 w-4 accent-[#133E43]"/>
     <span>Considerei as três perspectivas com autoria distinta e compreendo que esta decisão não determina a experiência subjetiva da criança.</span>
    </label>
    {error&&<p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p>}
    {notice&&<p role="status" className="rounded-xl bg-[#E5F5EE] px-4 py-3 text-sm font-semibold text-[#194F40]">{notice}</p>}
    <div className="flex flex-wrap items-center gap-3">
     <button type="submit" className="min-h-11 rounded-xl bg-[#133E43] px-5 py-3 text-sm font-bold text-white hover:bg-[#194F55]">
      Registrar: {outcomeLabels[outcome]}
     </button>
     <button type="button" onClick={()=>{setRecord(simulateNewSourceChange(record));setError('');setNotice('Fonte sintética alterada. Qualquer avaliação visual anterior foi bloqueada novamente.');}}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#133E43]/30 px-4 py-3 text-sm font-semibold hover:bg-[#F8F5EF]">
      <RotateCcw size={16} aria-hidden="true"/>Simular alteração da fonte
     </button>
    </div>
   </form>
  </section>

  <section className="rounded-3xl border border-[#133E43]/15 bg-white p-5 sm:p-6 space-y-3" aria-labelledby="history-title">
   <h2 id="history-title" className="font-display text-xl font-extrabold">Histórico desta sessão fictícia</h2>
   {record.history.length===0?<p className="text-sm text-[#265358]">Ainda não há decisões registradas nesta sessão.</p>:
    <ol className="space-y-3" data-testid="review-history">{record.history.map(entry=><li key={entry.id}
      className="rounded-2xl border border-[#133E43]/15 bg-[#F8F5EF] p-4 space-y-2">
     <div className="flex flex-wrap items-center justify-between gap-2">
      <strong className="text-sm">{outcomeNames[entry.outcome]}</strong>
      <span className="text-xs text-[#265358]">Revisão #{entry.revision}</span>
     </div>
     <p className="text-xs text-[#265358]">Autor: {entry.author} · Perspectivas examinadas: {entry.perspectives.length}</p>
     <p className="text-sm">{entry.reason}</p>
     {entry.requestedInformation&&<p className="text-sm"><strong>Complementação:</strong> {entry.requestedInformation}</p>}
    </li>)}</ol>}
  </section>
  <p className="flex items-start gap-2 text-sm text-[#265358]"><CircleHelp size={18} className="shrink-0" aria-hidden="true"/>
   Ao atualizar a página, esta simulação é reiniciada. Revisões reais dependem do checkpoint transacional no servidor e dos gates jurídicos e de prontidão.
  </p>
  <p className="flex items-start gap-2 rounded-xl bg-[#FFF0E8] p-3 text-sm font-semibold text-[#75432F]">
   <AlertTriangle size={18} className="shrink-0" aria-hidden="true"/>Não introduza informações de crianças reais neste laboratório.
  </p>
 </div>;
};
