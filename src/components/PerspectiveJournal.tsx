import React, {useState, useEffect} from 'react';
import {useApp} from '../context/AppContext';
import {claim, type Claim, type Perspective} from '../domain/perspectives';

type Mode = 'CREATE' | 'REVISE' | 'CONTEST';
type Draft = {observation:string; interpretation:string; context:string};
const empty:Draft={observation:'',interpretation:'',context:''};
const shown=(value:Claim) => value.state==='INFORMED' ? value.text : ({
  UNKNOWN:'Não informado',NOT_OBSERVED:'Não observado',NOT_APPLICABLE:'Não aplicável',
} as Record<string,string>)[value.state] ?? 'Não informado';

const makeClaim=(text:string) => text.trim() ? claim('INFORMED',text.trim()) : claim('UNKNOWN');

export function PerspectiveJournal() {
  const {
    activeProfile, activeCaregiver, activeChildPerspectives, canReadProfile,
    executePerspectiveCommand, getPerspectiveHistory,
  }=useApp();
  const [mode,setMode]=useState<Mode|null>(null);
  const [selected,setSelected]=useState<Perspective|null>(null);
  const [draft,setDraft]=useState<Draft>(empty);
  const [notice,setNotice]=useState('');
  const [historyId,setHistoryId]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);

  // Component is keyed by child and caregiver in JournalScreen, so drafts cannot
  // survive a context switch. Keep this fallback for any other future mount.
  useEffect(()=>{
    setMode(null);setSelected(null);setDraft(empty);setNotice('');setHistoryId(null);
  },[activeProfile.id,activeCaregiver.id,activeCaregiver.status]);

  if (!canReadProfile) return null;
  const open=(kind:Mode,p?:Perspective)=>{
    setSelected(p ?? null);setMode(kind);setNotice('');
    setDraft(p && kind==='REVISE' ? {
      observation:p.observation.state==='INFORMED' ? p.observation.text ?? '' : '',
      interpretation:p.interpretation.state==='INFORMED' ? p.interpretation.text ?? '' : '',
      context:p.context.state==='INFORMED' ? p.context.text ?? '' : '',
    } : empty);
  };
  const submit=(event:React.FormEvent)=>{
    event.preventDefault();
    if(busy || !mode || !draft.observation.trim() || !draft.context.trim()) return;
    if(mode!=='CREATE' && !selected) return;
    setBusy(true);
    try {
      const timestamp=new Date().toISOString();
      const id=crypto.randomUUID();
      const base:Perspective={
        id,childId:activeProfile.id,version:1,
        recordedAt:timestamp,
        observation:makeClaim(draft.observation),
        interpretation:makeClaim(draft.interpretation),
        context:makeClaim(draft.context),
        attribution:{recorderId:activeCaregiver.id,...(draft.interpretation.trim()?{interpreterId:activeCaregiver.id}:{})},
      };
      const command= mode==='CREATE'
        ? {kind:'CREATE' as const,requestId:id,perspective:base}
        : mode==='CONTEST' && selected
          ? {kind:'CONTEST' as const,requestId:id,targetId:selected.id,
             dissent:{...base,relatesTo:{id:selected.id,version:selected.version,relation:'CONTESTS' as const}}}
          : selected
            ? {kind:'REVISE' as const,requestId:id,targetId:selected.id,
               next:{
                 ...selected,
                 version:selected.version+1,previousVersion:selected.version,
                 changedBy:activeCaregiver.id,
                 observation:makeClaim(draft.observation),
                 interpretation:makeClaim(draft.interpretation),
                 context:makeClaim(draft.context),
                 attribution:{
                   ...selected.attribution,
                   ...(draft.interpretation.trim() && selected.interpretation.state!=='INFORMED'
                     ? {interpreterId:activeCaregiver.id}:{}),
                 },
               }}
            : null;
      if(!command)return;
      const outcome=executePerspectiveCommand(command);
      if(!outcome.ok) {
        setNotice(outcome.reason==='CONFLICT'
          ? 'Conflito de versão. Feche e reabra para consultar o estado atual.'
          : 'Operação não autorizada ou registro inválido. Confira o contexto atual.');
        return;
      }
      setMode(null);setSelected(null);setDraft(empty);
      setHistoryId(null);
      setNotice(mode==='CREATE'?'Perspectiva sintética registrada.'
        :mode==='REVISE'?'Nova versão sintética registrada.'
        :'Contestação contextualizada registrada.');
    } finally {setBusy(false);}
  };

  return (
    <section aria-label="Perspectivas do Diário" data-testid="perspective-journal"
      className="bg-white border border-[#133E43]/20 rounded-3xl p-4 sm:p-6 space-y-4">
      <header className="flex flex-wrap gap-3 items-start justify-between">
        <div className="space-y-1">
          <h2 className="font-bold text-lg text-[#133E43]">Perspectivas e diálogos</h2>
          <p className="text-sm text-[#265358]">Cada relato conserva seu olhar e contexto. Não representa uma verdade definitiva sobre a criança.</p>
          <p className="text-xs font-semibold text-[#8C4F48]">Laboratório sintético, apenas nesta sessão. Não use dados reais.</p>
        </div>
        <button type="button" onClick={()=>open('CREATE')}
          className="min-h-[44px] rounded-xl bg-[#133E43] text-white px-4 py-2 font-semibold text-sm">
          Registrar perspectiva
        </button>
      </header>
      {notice && <p role="status" className="text-sm text-[#133E43]">{notice}</p>}
      {activeChildPerspectives.length===0 ?
        <p className="text-sm text-[#265358]">Nenhuma perspectiva registrada nesta sessão demonstrativa.</p> :
        <div className="space-y-3">
          {activeChildPerspectives.map(p=>{
            const mine=p.attribution.recorderId===activeCaregiver.id;
            const history=historyId===p.id ? getPerspectiveHistory(p.id) : [];
            return <article key={p.id} data-testid="perspective-card"
              className="border border-[#133E43]/15 rounded-xl p-4 space-y-2 text-sm text-[#133E43]">
              <p className="text-xs font-semibold">Registrador: {activeCaregiver.id===p.attribution.recorderId
                ? 'Você (contexto simulado)' : 'Outra pessoa vinculada'} · Versão {p.version}</p>
              <p><strong>Observação:</strong> {shown(p.observation)}</p>
              <p><strong>Interpretação declarada:</strong> {shown(p.interpretation)}</p>
              <p><strong>Contexto:</strong> {shown(p.context)}</p>
              {p.relatesTo && <p className="text-xs">Contribuição relacionada: {p.relatesTo.relation==='CONTESTS'?'Contestação':'Contextualização'} de versão {p.relatesTo.version}. A contribuição original permanece independente.</p>}
              <div className="flex flex-wrap gap-2">
                {mine && <button type="button" onClick={()=>open('REVISE',p)}
                  className="min-h-[44px] border rounded-xl px-3 font-semibold">Revisar perspectiva</button>}
                <button type="button" onClick={()=>open('CONTEST',p)}
                  className="min-h-[44px] border rounded-xl px-3 font-semibold">Apresentar contestação</button>
                <button type="button" aria-expanded={historyId===p.id}
                  onClick={()=>setHistoryId(historyId===p.id?null:p.id)}
                  className="min-h-[44px] border rounded-xl px-3 font-semibold">Consultar versões</button>
              </div>
              {historyId===p.id && <ol aria-label="Histórico de versões" className="space-y-2 border-t pt-2">
                {history.map(version=><li key={version.version}>
                  <strong>Versão {version.version}</strong>: {shown(version.observation)}.
                  {version.changedBy?' Alteração por pessoa vinculada.':''}
                </li>)}
              </ol>}
            </article>;
          })}
        </div>}
      {mode && <div role="dialog" aria-modal="true" aria-label="Formulário de perspectiva"
        className="rounded-xl border-2 border-[#133E43] p-4 space-y-3 bg-[#F8F5EF]">
        <h3 className="font-bold text-[#133E43]">{mode==='CREATE'?'Nova perspectiva':mode==='REVISE'?'Nova versão':'Nova contestação'}</h3>
        {selected && <p className="text-xs text-[#265358]">Referência: versão {selected.version}, contexto {shown(selected.context)}.</p>}
        <form onSubmit={submit} className="space-y-3">
          <label className="block text-sm font-semibold text-[#133E43]">O que foi observado?
            <textarea required minLength={3} value={draft.observation}
              onChange={e=>setDraft(x=>({...x,observation:e.target.value}))}
              className="block w-full border rounded-lg p-2 min-h-[80px] mt-1"/>
          </label>
          <label className="block text-sm font-semibold text-[#133E43]">Qual a sua interpretação? (opcional)
            <textarea value={draft.interpretation}
              onChange={e=>setDraft(x=>({...x,interpretation:e.target.value}))}
              className="block w-full border rounded-lg p-2 mt-1"/>
          </label>
          <label className="block text-sm font-semibold text-[#133E43]">Contexto informado
            <input required value={draft.context}
              onChange={e=>setDraft(x=>({...x,context:e.target.value}))}
              className="block w-full border rounded-lg p-2 mt-1"/>
          </label>
          <p className="text-xs text-[#265358]">A interpretação pertence a quem a declara. Não equivale à experiência subjetiva da criança.</p>
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busy}
              className="min-h-[44px] rounded-xl bg-[#133E43] text-white px-4 font-semibold">Salvar perspectiva</button>
            <button type="button" onClick={()=>{setMode(null);setDraft(empty);setNotice('');}}
              className="min-h-[44px] border rounded-xl px-4">Cancelar</button>
          </div>
          {notice && <p role="alert" className="text-[#8C4F48]">{notice}</p>}
        </form>
      </div>}
    </section>
  );
}
