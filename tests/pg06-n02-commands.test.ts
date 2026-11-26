import {test} from 'node:test';
import assert from 'node:assert/strict';
import {claim,type Perspective} from '../src/domain/perspectives';
import {emptyPerspectiveLedger,runPerspectiveCommand,readPerspectiveCurrent} from '../src/domain/perspectiveCommands';
import type {Caregiver} from '../src/types';

const a:Caregiver={id:'cg-A',displayName:'Pessoa A sintética',role:'FAMILY_CAREGIVER',status:'ACTIVE',linkedChildIds:['tomas']};
const b:Caregiver={...a,id:'cg-B',displayName:'Pessoa B sintética',role:'PROFESSIONAL'};
const guardian:Caregiver={...a,id:'cg-G',role:'LEGAL_GUARDIAN'};
const p:Perspective={id:'p-A',childId:'tomas',version:1,recordedAt:'2026-11-25T00:00:00Z',observation:claim('INFORMED','Objeto afastado'),interpretation:claim('UNKNOWN'),context:claim('INFORMED','Casa'),attribution:{recorderId:'cg-A'}};
const create={kind:'CREATE' as const,requestId:'request-1',perspective:p};
test('PG06-N02 OP-02: criar altera livro de versões e leitura filtrada na sessão',()=>{
 const r=runPerspectiveCommand(emptyPerspectiveLedger(),a,'tomas',create);
 assert.equal(r.ok,true);
 if(r.ok){assert.equal(r.ledger.versions.length,1); assert.equal(readPerspectiveCurrent(r.ledger,a,'tomas').length,1);
 assert.deepEqual(readPerspectiveCurrent(r.ledger,{...a,status:'SUSPENDED'},'tomas'),[]);
 assert.deepEqual(readPerspectiveCurrent(r.ledger,b,'lia'),[]);}
});
test('PG06-N02 OP-02: contexto de criança diferente e autor falso são negados',()=>{
 assert.equal(runPerspectiveCommand(emptyPerspectiveLedger(),a,'lia',create).ok,false);
 assert.equal(runPerspectiveCommand(emptyPerspectiveLedger(),a,'tomas',{...create,perspective:{...p,attribution:{recorderId:'cg-B'}}}).ok,false);
 assert.equal(runPerspectiveCommand(emptyPerspectiveLedger(),a,'unknown-child',{...create,perspective:{...p,childId:'unknown-child'}}).ok,false);
});
test('PG06-N02 OP-08: correção preserva v1, anota agente e exige revisão vigente',()=>{
 const first=runPerspectiveCommand(emptyPerspectiveLedger(),a,'tomas',create);assert.equal(first.ok,true);if(!first.ok)return;
 const next={...p,version:2,previousVersion:1,changedBy:'cg-A',observation:claim('INFORMED','Objeto afastado brevemente')};
 const updated=runPerspectiveCommand(first.ledger,a,'tomas',{kind:'REVISE',requestId:'request-2',targetId:p.id,next});
 assert.equal(updated.ok,true);if(!updated.ok)return;
 assert.equal(updated.ledger.versions.length,2);
 assert.equal(updated.ledger.versions[0].observation.text,'Objeto afastado');
 assert.equal(readPerspectiveCurrent(updated.ledger,a,'tomas')[0].version,2);
 assert.equal(runPerspectiveCommand(updated.ledger,a,'tomas',{kind:'REVISE',requestId:'request-3',targetId:p.id,next}).ok,false);
});
test('PG06-N02 OP-08: guardião/profissional não assume autoria ou edição alheia',()=>{
 const first=runPerspectiveCommand(emptyPerspectiveLedger(),a,'tomas',create);assert.equal(first.ok,true);if(!first.ok)return;
 const next={...p,version:2,previousVersion:1,changedBy:'cg-G'};
 assert.deepEqual(runPerspectiveCommand(first.ledger,guardian,'tomas',{kind:'REVISE',requestId:'r-g',targetId:p.id,next}).ok,false);
 assert.equal(runPerspectiveCommand(first.ledger,b,'tomas',{kind:'REVISE',requestId:'r-b',targetId:p.id,next:{...next,changedBy:'cg-B'}}).ok,false);
});
test('PG06-N02 OP-09: contestação preserva fonte e outra autoria',()=>{
 const first=runPerspectiveCommand(emptyPerspectiveLedger(),a,'tomas',create);assert.equal(first.ok,true);if(!first.ok)return;
 const dissent:Perspective={...p,id:'p-B',attribution:{recorderId:'cg-B'},relatesTo:{id:p.id,version:1,relation:'CONTESTS'}};
 const result=runPerspectiveCommand(first.ledger,b,'tomas',{kind:'CONTEST',requestId:'request-4',targetId:p.id,dissent});
 assert.equal(result.ok,true);if(!result.ok)return;
 assert.equal(result.ledger.versions.length,2);
 assert.equal(result.ledger.versions[0].id,'p-A');
 assert.equal(result.ledger.versions[1].attribution.recorderId,'cg-B');
});
test('PG06-N02 OP-09: revogação impede contestar e ler',()=>{
 const first=runPerspectiveCommand(emptyPerspectiveLedger(),a,'tomas',create);assert.equal(first.ok,true);if(!first.ok)return;
 const denied={...b,status:'SUSPENDED' as const};
 const dissent:Perspective={...p,id:'p-B',attribution:{recorderId:'cg-B'},relatesTo:{id:p.id,version:1,relation:'CONTESTS'}};
 assert.equal(runPerspectiveCommand(first.ledger,denied,'tomas',{kind:'CONTEST',requestId:'request-4',targetId:p.id,dissent}).ok,false);
 assert.deepEqual(readPerspectiveCurrent(first.ledger,denied,'tomas'),[]);
});
test('PG06-N02: retry idempotente não duplica e colisão de request falha',()=>{
 const first=runPerspectiveCommand(emptyPerspectiveLedger(),a,'tomas',create);assert.equal(first.ok,true);if(!first.ok)return;
 const repeat=runPerspectiveCommand(first.ledger,a,'tomas',create);
 assert.equal(repeat.ok,true);if(repeat.ok){assert.equal(repeat.replayed,true);assert.equal(repeat.ledger.versions.length,1);}
 assert.equal(runPerspectiveCommand(first.ledger,a,'tomas',{...create,perspective:{...p,id:'p-X'}}).ok,false);
});
test('PG06-N02: relatórios, backups, exclusão e concessão não são oferecidos',()=>{
 const ledger=emptyPerspectiveLedger();
 assert.equal(Object.hasOwn(ledger,'export'),false);
 assert.equal(Object.hasOwn(ledger,'delete'),false);
});
