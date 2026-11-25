import {test} from 'node:test';
import assert from 'node:assert/strict';
import {claim, registerPerspective, revisePerspective, contestPerspective, canUseForSummary, describeLegacy, type Perspective, type Permission} from '../src/domain/perspectives';

const A: Permission={current:true,actorId:'adult-A',allowedOperations:['CREATE','REVISE','CONTEST','READ','USE'],childIds:['synthetic-child']};
const B: Permission={...A,actorId:'adult-B'};
const base: Perspective={
  id:'perspective-A',childId:'synthetic-child',version:1,recordedAt:'2026-11-24T12:00:00Z',
  observation:claim('INFORMED','Afastou o objeto'),
  interpretation:claim('INFORMED','Adulto A acredita ser desconforto'),
  context:claim('INFORMED','Casa'),
  attribution:{recorderId:'adult-A',interpreterId:'adult-A'},
};
test('CP-01: manifestação observada não vira experiência subjetiva da criança',()=>{
  const r=registerPerspective(base,A);
  assert.equal(r.ok,true);
  if(r.ok){assert.equal(r.value.observation.text,'Afastou o objeto');assert.match(r.value.interpretation.text!,/Adulto A/);assert.equal(Object.hasOwn(r.value,'childConsent'),false);}
});
test('CP-02: fonte textual não vira observador autenticado',()=>{
  const x={...base,attribution:{recorderId:'adult-A',reportedByLabel:'Pessoa B'}};
  const r=registerPerspective({...x,interpretation:claim('UNKNOWN')},A);
  assert.equal(r.ok,true);
  if(r.ok){assert.equal(r.value.attribution.observerId,undefined);assert.equal(r.value.attribution.interpreterId,undefined);}
});
test('CP-03: lacunas desconhecida, não observada e não aplicável são distintas',()=>{
  assert.notDeepEqual(claim('UNKNOWN'),claim('NOT_OBSERVED'));
  assert.notDeepEqual(claim('NOT_OBSERVED'),claim('NOT_APPLICABLE'));
  assert.throws(()=>claim('UNKNOWN','inventado'));
  assert.equal(canUseForSummary([{...base,context:claim('UNKNOWN')}],A),false);
});
test('CP-04: registrador não vira intérprete automaticamente',()=>{
  const r=registerPerspective({...base,attribution:{recorderId:'adult-A'}},A);
  assert.deepEqual(r,{ok:false,reason:'INVALID'});
  assert.equal(describeLegacy({id:'old',childId:'synthetic-child',recordedByCaregiverId:'adult-A',notes:'eu suponho',revision:4,importedAt:'2026-11-24'}).interpretationAuthor,null);
});
test('CP-05: contribuições discordantes coexistem sem vencedor automático',()=>{
  const second={...base,id:'perspective-B',observation:claim('INFORMED','Aceitou o objeto'),attribution:{recorderId:'adult-B',interpreterId:'adult-B'}};
  const x=registerPerspective(base,A), y=registerPerspective(second,B);
  assert.equal(x.ok,true);assert.equal(y.ok,true);assert.notDeepEqual(x,y);
});
test('CP-06: contextos diferentes continuam distintos',()=>{
  const second={...base,id:'perspective-B',context:claim('INFORMED','Escola'),attribution:{recorderId:'adult-B',interpreterId:'adult-B'}};
  const a=registerPerspective(base,A),b=registerPerspective(second,B);
  assert.equal(a.ok,true);assert.equal(b.ok,true);
  if(a.ok&&b.ok)assert.notEqual(a.value.context.text,b.value.context.text);
});
test('CP-07: versão/ordem não são frequência nem preferência',()=>{
  const legacy=describeLegacy({id:'old',childId:'synthetic-child',revision:5,importedAt:'2026-11-24'});
  assert.equal(legacy.historicalVersionsVerified,false);assert.equal(Object.hasOwn(legacy,'frequency'),false);
});
test('CP-08: correção exige autorização atual e alvo de versão',()=>{
  const next={...base,version:2,previousVersion:1,changedBy:'adult-A',observation:claim('INFORMED','Afastou brevemente o objeto')};
  assert.equal(revisePerspective(base,next,A).ok,true);
  assert.deepEqual(revisePerspective(base,next,{...A,current:false}),{ok:false,reason:'DENIED'});
});
test('CP-09: contestação é outra unidade, sem sobrescrever origem',()=>{
  const dissent={...base,id:'dissent-B',attribution:{recorderId:'adult-B',interpreterId:'adult-B'},relatesTo:{id:base.id,version:1,relation:'CONTESTS' as const}};
  const before=structuredClone(base);
  assert.equal(contestPerspective(base,dissent,B).ok,true);
  assert.deepEqual(base,before);
});
test('CP-12: concorrência com versão superada é conflito explícito',()=>{
  const next={...base,version:2,previousVersion:1,changedBy:'adult-A'};
  assert.deepEqual(revisePerspective({...base,version:2},next,A),{ok:false,reason:'CONFLICT'});
});
test('CP-14: revisão legada não cria versões ausentes ou editor',()=>{
  const legacy=describeLegacy({id:'old',childId:'synthetic-child',revision:5,updatedAt:'2025-01-01',importedAt:'2026-11-24'});
  assert.equal(legacy.historicalVersionsVerified,false);assert.equal(legacy.editor,null);
});
test('CP-15: tempo de importação não vira tempo do acontecimento',()=>{
  assert.equal(describeLegacy({id:'old',childId:'synthetic-child',importedAt:'2026-11-24'}).occurredAt,null);
});
test('CP-17: leitura sem autorização de uso não autoriza resumo',()=>{
  assert.equal(canUseForSummary([base],{...A,allowedOperations:['READ']}),false);
  assert.equal(canUseForSummary([base],A),true);
});
test('CP-18: importação não concede autoridade',()=>{
  const legacy=describeLegacy({id:'old',childId:'synthetic-child',recordedByCaregiverId:'adult-A',revision:99,importedAt:'2026-11-24'});
  assert.equal(Object.hasOwn(legacy,'permissions'),false);
  assert.equal(registerPerspective(base,{...A,current:false}).ok,false);
});
for (const id of ['CP-10','CP-11','CP-13','CP-16','CP-19','CP-20','CP-21','CP-22','CP-23','CP-24']) {
 test.todo(id+': cenário sistêmico pendente de controles operacionais, revisão e/ou capacidade externa');
}
