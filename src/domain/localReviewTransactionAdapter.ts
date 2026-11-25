/**
 * PG06-N14: local-only, development-only authenticated review adapter.
 * Client status never grants data access; only the PostgreSQL checkpoint can.
 * No project URL, user token, service key or child details persisted to storage.
 */
import { z } from 'zod';
import type { ReviewDecision } from './reviewLabDemo';

const id=z.string().uuid();
const source=z.object({id,version:z.number().int().positive()});
const perspective=z.object({
 id,authorId:id,provenance:z.enum(['DIRECT_OBSERVATION','REPORTED','INTERPRETATION']),
 statement:z.string()
});
const entry=z.object({
 id,authorId:id,outcome:z.enum(['APPROVE','REQUEST_COMPLEMENT','KEEP_BLOCKED']),
 reason:z.string(),request:z.string().nullable(),revision:z.number().int().nonnegative(),
 perspectives:z.array(z.object({id:z.string(),author:z.string(),provenance:z.string()}))
});
const snapshotSchema=z.object({
 childId:id,derivedId:id,purpose:z.string(),
 revision:z.number().int().nonnegative(),
 sourceVersions:z.array(source).min(1),
 evidenceId:id.nullable(),
 perspectives:z.array(perspective).min(1),
 history:z.array(entry),
 status:z.enum(['REVIEWED','BLOCKED','COMPLEMENT_REQUESTED']),
 retentionPending:z.boolean()
});
export type ServerReviewSnapshot=z.infer<typeof snapshotSchema>;
export type ReviewSubmission=Readonly<{
 outcome:ReviewDecision;
 reason:string;
 requestedInformation:string;
 expectedRevision:number;
 perspectiveIds:readonly string[];
 decisionId:string;
}>;
export type LocalReviewCredentials=Readonly<{
 url:string;
 anonKey:string;
 accessToken:string;
 childId:string;
 derivedId:string;
 purpose:'care';
}>;
declare global {
 interface Window {
  __MUNDELO_N14_LOCAL_REVIEW__?:LocalReviewCredentials;
 }
}

/** Requires literal loopback and the dedicated synthetic child fixture. */
export function getLocalReviewCredentials():LocalReviewCredentials|null {
 if(!import.meta.env.DEV || typeof window==='undefined')return null;
 const value=window.__MUNDELO_N14_LOCAL_REVIEW__;
 if(!value || !/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(value.url) ||
  value.childId!=='11111111-1111-4111-8111-111111111111' ||
  value.derivedId!=='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1' ||
  value.purpose!=='care' ||
  !value.anonKey || !value.accessToken) return null;
 return value;
}

export class ReviewServerUnavailable extends Error {
 constructor(public readonly code:'DENIED'|'STALE'|'NETWORK'|'MALFORMED'){
  super(code);
 }
}

export function createLocalReviewAdapter(
 credentials:LocalReviewCredentials,
 transport:typeof fetch=fetch
){
 if(!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(credentials.url) ||
 credentials.childId!=='11111111-1111-4111-8111-111111111111' ||
 credentials.derivedId!=='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1' ||
 credentials.purpose!=='care')throw new ReviewServerUnavailable('DENIED');
 async function rpc(name:'pg06_n14_review_state'|'pg06_n12_decide',body:Record<string,unknown>):Promise<unknown>{
  let response:Response;
  try {
   response=await transport(credentials.url+'/rest/v1/rpc/'+name,{
    method:'POST',
    cache:'no-store',
    redirect:'error',
    headers:{
     apikey:credentials.anonKey,
     Authorization:'Bearer '+credentials.accessToken,
     'Content-Type':'application/json',
     Accept:'application/json'
    },
    body:JSON.stringify(body)
   });
  }catch{
   throw new ReviewServerUnavailable('NETWORK');
  }
  if(!response.ok){
   throw new ReviewServerUnavailable(response.status===409?'STALE':'DENIED');
  }
  try{return await response.json();}
  catch{throw new ReviewServerUnavailable('MALFORMED');}
 }
 async function load():Promise<ServerReviewSnapshot>{
  const value=await rpc('pg06_n14_review_state',{
   p_child:credentials.childId,p_derived:credentials.derivedId,p_purpose:credentials.purpose
  });
  const parsed=snapshotSchema.safeParse(value);
  if(!parsed.success || parsed.data.childId!==credentials.childId ||
    parsed.data.derivedId!==credentials.derivedId || parsed.data.purpose!==credentials.purpose){
   throw new ReviewServerUnavailable('MALFORMED');
  }
  return parsed.data;
 }
 async function decide(command:ReviewSubmission, prior:ServerReviewSnapshot):Promise<ServerReviewSnapshot>{
  if(prior.revision!==command.expectedRevision || prior.childId!==credentials.childId ||
    prior.derivedId!==credentials.derivedId || !prior.evidenceId){
   throw new ReviewServerUnavailable('STALE');
  }
  // No optimistic state update. An RPC response is not sufficient until we
  // have a fresh, authorized, server-confirmed state snapshot.
  const receipt=await rpc('pg06_n12_decide',{
   p_decision:command.decisionId,
   p_child:credentials.childId,
   p_derived:credentials.derivedId,
   p_outcome:command.outcome,
   p_expected_revision:command.expectedRevision,
   p_versions:prior.sourceVersions,
   p_reason:command.reason,
   p_evidence:prior.evidenceId,
   p_perspective_ids:command.perspectiveIds,
   p_request:command.outcome==='REQUEST_COMPLEMENT'?command.requestedInformation:null,
   p_purpose:credentials.purpose
  });
  if(!Number.isSafeInteger(receipt)||Number(receipt)!==command.expectedRevision+1)
   throw new ReviewServerUnavailable('MALFORMED');
  const current=await load();
  if(current.revision<receipt)throw new ReviewServerUnavailable('MALFORMED');
  // A racing corrective event may already have invalidated this decision.
  return current;
 }
 return {load,decide};
}
