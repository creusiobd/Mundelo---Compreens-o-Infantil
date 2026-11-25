/**
 * PG06-N02: operações de domínio em memória, exclusivamente para fixtures sintéticas.
 * Sem persistência, RLS, concessão, revisão independente ou expurgo governado.
 */
import {
  type Perspective, type Permission, type Result,
  registerPerspective, revisePerspective, contestPerspective, permitted,
} from './perspectives';
import type {Caregiver} from '../types';

export type PerspectiveCommand =
  | Readonly<{kind:'CREATE'; requestId:string; perspective:Perspective}>
  | Readonly<{kind:'REVISE'; requestId:string; targetId:string; next:Perspective}>
  | Readonly<{kind:'CONTEST'; requestId:string; targetId:string; dissent:Perspective}>;

export type PerspectiveLedger = Readonly<{
  versions: readonly Perspective[];
  receipts: Readonly<Record<string, Readonly<{fingerprint:string; perspectiveId:string; version:number}>>>;
}>;

export const emptyPerspectiveLedger = (): PerspectiveLedger => ({versions:[],receipts:{}});

export type CommandResult =
  | {ok:true; ledger:PerspectiveLedger; perspective:Perspective; replayed:boolean}
  | {ok:false; ledger:PerspectiveLedger; reason:'DENIED'|'CONFLICT'|'INVALID'|'UNVERIFIED'};

const syntheticChildIds = new Set(['tomas','lia']);
const allowedKinds = new Set(['CREATE','REVISE','CONTEST']);
const last = (ledger:PerspectiveLedger, id:string) =>
  [...ledger.versions].reverse().find(p=>p.id===id);

function policy(caregiver:Caregiver | null | undefined, childId:string, kind:PerspectiveCommand['kind']):Permission {
  const eligible=Boolean(caregiver && caregiver.status==='ACTIVE' && caregiver.linkedChildIds.includes(childId) && syntheticChildIds.has(childId));
  return {
    current: eligible, actorId: caregiver?.id ?? '',
    childIds: eligible ? [childId] : [],
    // The original recorder alone may revise; legal-guardian status grants no retroactive authorship.
    allowedOperations: eligible ? (kind==='CREATE' ? ['CREATE'] : kind==='CONTEST' ? ['CONTEST'] : ['REVISE']) : [],
  };
}
function wellFormed(p:Perspective):boolean {
  const states=['INFORMED','UNKNOWN','NOT_OBSERVED','NOT_APPLICABLE'];
  const validClaim=(c:Perspective['observation']|undefined)=>
    Boolean(c && states.includes(c.state) &&
      (c.state==='INFORMED' ? typeof c.text==='string' && c.text.trim().length>0 : c.text===undefined));
  return Boolean(p.id?.trim() && p.childId?.trim() && Number.isSafeInteger(p.version) &&
    p.version>=1 && p.recordedAt?.trim() && p.attribution?.recorderId?.trim() &&
    validClaim(p.observation) && validClaim(p.interpretation) && validClaim(p.context) &&
    (p.interpretation.state!=='INFORMED' || p.attribution.interpreterId?.trim()));
}
function denial(ledger:PerspectiveLedger, reason:'DENIED'|'CONFLICT'|'INVALID'|'UNVERIFIED'):CommandResult {
  return {ok:false,ledger,reason};
}
export function runPerspectiveCommand(
  ledger:PerspectiveLedger,
  caregiver:Caregiver | null | undefined,
  activeChildId:string,
  command:PerspectiveCommand,
):CommandResult {
  if (!command || !allowedKinds.has(command.kind) || !command.requestId?.trim()) return denial(ledger,'INVALID');
  const incoming = command.kind==='CREATE' ? command.perspective : command.kind==='REVISE' ? command.next : command.dissent;
  if (!incoming || incoming.childId!==activeChildId || !syntheticChildIds.has(activeChildId)) return denial(ledger,'DENIED');
  const permission=policy(caregiver,activeChildId,command.kind);
  if (!permitted(permission,activeChildId,command.kind)) return denial(ledger,'DENIED');
  if (!wellFormed(incoming)) return denial(ledger,'INVALID');

  // Receipts are scoped to this ephemeral session only, and cannot authorize a later retry.
  const fingerprint=JSON.stringify(command);
  if (Object.hasOwn(ledger.receipts,command.requestId)) {
    const receipt=ledger.receipts[command.requestId];
    if (receipt.fingerprint!==fingerprint) return denial(ledger,'CONFLICT');
    const existing=ledger.versions.find(p=>p.id===receipt.perspectiveId && p.version===receipt.version);
    return existing ? {ok:true,ledger,perspective:structuredClone(existing),replayed:true} : denial(ledger,'CONFLICT');
  }

  let outcome:Result<Perspective>;
  if (command.kind==='CREATE') {
    if (last(ledger,incoming.id)) return denial(ledger,'CONFLICT');
    // Prevent unrelated references and "unverified yet accepted" relation targets.
    if (incoming.relatesTo) return denial(ledger,'INVALID');
    outcome=registerPerspective(command.perspective,permission);
  } else {
    const current=last(ledger,command.targetId);
    if (!current || current.childId!==activeChildId) return denial(ledger,'DENIED');
    if (command.kind==='REVISE') {
      // No guardian/professional override without future J01/J02 policy.
      if (current.attribution.recorderId!==caregiver?.id) return denial(ledger,'DENIED');
      outcome=revisePerspective(current,command.next,permission);
    } else {
      if (last(ledger,command.dissent.id)) return denial(ledger,'CONFLICT');
      outcome=contestPerspective(current,command.dissent,permission);
    }
  }
  if (!outcome.ok) return denial(ledger,outcome.reason);
  const result=structuredClone(outcome.value);
  return {
    ok:true, perspective:result, replayed:false,
    ledger:{
      versions:[...ledger.versions,result],
      receipts:{...ledger.receipts,[command.requestId]:{fingerprint,perspectiveId:result.id,version:result.version}},
    },
  };
}
/** Only current versions for the active child, filtered before returning any metadata. */
export function readPerspectiveCurrent(ledger:PerspectiveLedger,caregiver:Caregiver|null|undefined,childId:string):Perspective[] {
  if (!syntheticChildIds.has(childId) || !caregiver || caregiver.status!=='ACTIVE' || !caregiver.linkedChildIds.includes(childId)) return [];
  const unique=new Map<string,Perspective>();
  for(const item of ledger.versions) if(item.childId===childId) unique.set(item.id,item);
  return [...unique.values()].map(item=>structuredClone(item));
}
