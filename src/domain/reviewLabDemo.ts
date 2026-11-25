/**
 * PG06-N13: Synthetic-only, ephemeral review UI model.
 * This client-side model is NOT authority, Supabase persistence or a grant.
 * Actual protected READ/SHARE/EXPORT remains impossible here.
 */
export type ReviewDecision = 'APPROVE' | 'REQUEST_COMPLEMENT' | 'KEEP_BLOCKED';

export type ReviewPerspective = Readonly<{
 id:string;
 author:string;
 role:string;
 provenance:'OBSERVACAO_DIRETA'|'INTERPRETACAO';
 statement:string;
}>;

export type ReviewCase = Readonly<{
 id:string;
 title:string;
 childAlias:string;
 sourceVersions:readonly Readonly<{id:string;version:number}>[];
 perspectives:readonly ReviewPerspective[];
 blockedRevision:number;
}>;

export type ReviewEntry = Readonly<{
 id:string;
 outcome:ReviewDecision;
 author:string;
 reason:string;
 requestedInformation:string|null;
 revision:number;
 perspectives:readonly string[];
 recordedAt:string;
}>;

export type ReviewState = Readonly<{
 revision:number;
 status:'BLOCKED'|'COMPLEMENT_REQUESTED'|'SIMULATED_REVIEW';
 history:readonly ReviewEntry[];
}>;

export type ReviewCommand = Readonly<{
 outcome:ReviewDecision;
 expectedRevision:number;
 reason:string;
 requestedInformation:string;
 perspectiveIds:readonly string[];
 actor:string;
 decisionId:string;
 recordedAt:string;
}>;

export type ReviewResult =
 | Readonly<{ok:true;state:ReviewState}>
 | Readonly<{ok:false;reason:'INVALID_REVIEW'|'STALE_REVISION'|'UNKNOWN_PERSPECTIVE'|'DUPLICATE_DECISION'}>;

export const SYNTHETIC_CASE:ReviewCase={
 id:'synthetic-derivative-001',
 title:'Síntese de interações em diferentes ambientes',
 childAlias:'Criança fictícia A',
 blockedRevision:6,
 sourceVersions:[{id:'fonte-lab-01',version:2},{id:'fonte-lab-02',version:1}],
 perspectives:[
  {
   id:'perspectiva-familia',author:'Responsável fictício A',role:'Família',
   provenance:'OBSERVACAO_DIRETA',
   statement:'Durante uma brincadeira simulada, a criança pediu que os objetos permanecessem na mesma ordem.'
  },
  {
   id:'perspectiva-profissional',author:'Profissional fictício B',role:'Acompanhamento',
   provenance:'INTERPRETACAO',
   statement:'A preferência descrita pode ter diferentes significados; o ambiente e o momento precisam ser considerados.'
  },
  {
   id:'perspectiva-escola',author:'Educadora fictícia C',role:'Escola',
   provenance:'OBSERVACAO_DIRETA',
   statement:'Em outra atividade simulada, a criança reorganizou os materiais e participou após uma explicação.'
  }
 ]
};

export const INITIAL_REVIEW_STATE:ReviewState={
 revision:SYNTHETIC_CASE.blockedRevision,
 status:'BLOCKED',
 history:[]
};

/** Deterministic reducer. No browser identity, status or selection is real authorization. */
export function applySyntheticReview(
 current:ReviewState,caseFile:ReviewCase,command:ReviewCommand
):ReviewResult {
 const prior=current.history.find(entry=>entry.id===command.decisionId);
 if(prior)return {ok:false,reason:'DUPLICATE_DECISION'};
 if(command.expectedRevision!==current.revision)return {ok:false,reason:'STALE_REVISION'};
 const reason=command.reason.trim();
 const request=command.requestedInformation.trim();
 if(!command.actor.trim()||!command.decisionId.trim()||
   !Number.isInteger(command.expectedRevision)||
   !Number.isFinite(Date.parse(command.recordedAt))||
   reason.length<20||reason.length>500||
   (command.outcome!=='APPROVE'&&command.outcome!=='REQUEST_COMPLEMENT'&&command.outcome!=='KEEP_BLOCKED')||
   (command.outcome==='REQUEST_COMPLEMENT'?(request.length<15||request.length>500):request.length!==0)){
  return {ok:false,reason:'INVALID_REVIEW'};
 }
 const selected=[...command.perspectiveIds];
 const allowed=new Set(caseFile.perspectives.map(p=>p.id));
 if(selected.length!==allowed.size||new Set(selected).size!==selected.length||
    selected.some(id=>!allowed.has(id))){
  return {ok:false,reason:'UNKNOWN_PERSPECTIVE'};
 }
 const entry:ReviewEntry={
  id:command.decisionId,outcome:command.outcome,author:command.actor,
  reason,requestedInformation:command.outcome==='REQUEST_COMPLEMENT'?request:null,
  revision:current.revision+1,perspectives:selected,
  recordedAt:command.recordedAt
 };
 return {ok:true,state:{
  revision:entry.revision,
  status:command.outcome==='APPROVE'?'SIMULATED_REVIEW':
         command.outcome==='REQUEST_COMPLEMENT'?'COMPLEMENT_REQUESTED':'BLOCKED',
  history:[...current.history,entry]
 }};
}

/** New change always blocks the synthetic visualization, including after approval. */
export function simulateNewSourceChange(current:ReviewState):ReviewState {
 return {...current,revision:current.revision+1,status:'BLOCKED'};
}
