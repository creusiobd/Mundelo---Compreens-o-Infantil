import {test} from 'node:test';
import assert from 'node:assert/strict';
import {observationAttribution, buildObservationReport, informedText, PROFILE_OMISSION_NOTICE, ATTRIBUTION_LIMIT} from '../src/presentation/observationAttribution';
import {MOCK_CAREGIVERS, MOCK_OBSERVATIONS, MOCK_PROFILE_TOMAS} from '../src/data/mockData';

const base = MOCK_OBSERVATIONS[0];
const attrs = (obs: typeof base) => Object.fromEntries(observationAttribution(obs,MOCK_CAREGIVERS).map(x=>[x.label,x.value]));
test('PG06-54: registrador, observador e fonte textual são dimensões independentes', () => {
  const a = attrs({...base,recordedByCaregiverId:'cg-carlos',observedByCaregiverId:'cg-marina',observerRole:'educador',provenance:'REPORTED_BY_OTHER',reportedByLabel:'Pessoa citada sem autenticação'});
  assert.match(a['Registrado por'],/^Carlos/);
  assert.match(a['Observador identificado'],/^Prof. Marina/);
  assert.equal(a['Papel informado do observador'],'Educador(a)');
  assert.equal(a['Fonte do relato (texto não verificado)'],'Pessoa citada sem autenticação');
  assert.equal(a['Autoria da interpretação'],'Não registrada separadamente');
});
for (const role of ['cg-helena','cg-marina','cg-leonardo']) {
  test('PG06-54: papel e conteúdo não atribuem autoria da interpretação: '+role, () => {
    const a=attrs({...base,recordedByCaregiverId:role,observedByCaregiverId:role,notes:'Eu, Helena, interpreto que…',revision:999,updatedAt:'2026-11-22T12:00:00.000Z'});
    assert.equal(a['Autoria da interpretação'],'Não registrada separadamente');
    assert.equal(a['Autoria da alteração'],'Não registrada separadamente');
    assert.equal(a['Revisão informada'],'999');
  });
}
test('PG06-54: identidade/origem ausentes permanecem desconhecidas sem Helena ou DIRECT', () => {
  const a=attrs({...base,recordedByCaregiverId:'unknown',observedByCaregiverId:undefined,reportedByLabel:undefined,provenance:undefined,observerRole:undefined,revision:undefined} as any);
  assert.equal(a['Registrado por'],'Pessoa não identificada');
  assert.equal(a['Observador identificado'],'Pessoa não identificada');
  assert.equal(a['Proveniência declarada'],'Não informada');
  assert.equal(a['Papel informado do observador'],'Não informado');
  assert.equal(a['Revisão informada'],'Não informada');
  assert.equal(a['Fonte do relato (texto não verificado)'],'Não informado');
});
test('PG06-54: relatório omite atributos globais sem fonte, incluindo conforto conhecido', () => {
  const profile={...MOCK_PROFILE_TOMAS,interests:['UNSOURCED-54-INTEREST'],comfortAnchors:['UNSOURCED-54-COMFORT'],sensitivities:['UNSOURCED-54-SENSITIVITY'],communicationModes:['UNSOURCED-54-COMMUNICATION']};
  const text=buildObservationReport({profile,recipientLabel:'Conversa',dateLabel:'23/11/2026',observations:[base],caregivers:MOCK_CAREGIVERS});
  assert.ok(!text.includes('UNSOURCED-54-'));
  assert.ok(text.includes(PROFILE_OMISSION_NOTICE));
  assert.ok(text.includes(ATTRIBUTION_LIMIT));
  assert.ok(!text.includes('Hipótese Familiar'));
});
test('PG06-54: relatos divergentes retêm texto, contexto, fontes e ordem, sem síntese de consenso', () => {
  const observations=[
    {...base,id:'synthetic-A',recordedByCaregiverId:'cg-carlos',environment:'casa' as const,description:'RELATO-A em casa',notes:'HIPOTESE-A: prefiro aguardar'},
    {...base,id:'synthetic-B',recordedByCaregiverId:'cg-marina',environment:'escola' as const,description:'RELATO-B na escola',notes:'HIPOTESE-B: prefiro antecipar'},
  ];
  const original=structuredClone(observations);
  const text=buildObservationReport({profile:MOCK_PROFILE_TOMAS,recipientLabel:'Conversa',dateLabel:'23/11/2026',observations,caregivers:MOCK_CAREGIVERS});
  assert.ok(text.indexOf('RELATO-A')<text.indexOf('RELATO-B'));
  for(const obs of observations){assert.ok(text.includes(obs.description));assert.ok(text.includes(obs.notes));for(const {label,value} of observationAttribution(obs,MOCK_CAREGIVERS)) assert.ok(text.includes(label+': '+value));}
  assert.ok(text.includes('Casa'));assert.ok(text.includes('Escola / Creche'));
  assert.deepEqual(observations,original);
});
test('PG06-54: campo vazio não é convertido em ausência de manifestação; texto fornecido é preservado', () => {
  assert.equal(informedText('  '),'Não informado');
  assert.equal(informedText('Não observado'),'Não observado');
  assert.equal(informedText('  relato textual  '),'  relato textual  ');
  const text=buildObservationReport({profile:MOCK_PROFILE_TOMAS,recipientLabel:'Conversa',dateLabel:'23/11/2026',observations:[],caregivers:MOCK_CAREGIVERS});
  assert.ok(text.includes('Total de Observações Selecionadas: 0'));
  assert.ok(!text.includes('[Registro 1]'));
});
