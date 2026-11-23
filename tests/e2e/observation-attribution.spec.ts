import {test, expect, type Page, type Locator} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {encryptVault} from '../../src/crypto/vault';
import {MOCK_OBSERVATIONS, MOCK_PROFILE_TOMAS, MOCK_CAREGIVERS} from '../../src/data/mockData';
import {openCleanSession, selectChildProfile, selectCaregiver} from './fixtures/test-session';
import {navigateToInternalScreen} from './helpers/navigation';
import {expectZeroAxeViolations} from './helpers/accessibility';

const groupName='Autoria e proveniência do registro';
const previewName='Prévia da síntese';
async function pairs(group: Locator) {
  return group.locator('dl > div').evaluateAll(rows=>rows.map(row=>({
    label:row.querySelector('dt')!.textContent!,value:row.querySelector('dd')!.textContent!,
  })));
}
async function copyReport(page: Page) {
  await page.getByRole('button',{name:/^(Copiar Síntese|Copiado!)$/}).click();
  return page.evaluate(()=> (window as any).__copies.at(-1) as string);
}
async function assertCopiedPairs(text:string, expected:{label:string;value:string}[]) {
  for(const {label,value} of expected) expect(text).toContain(label+' '+value);
}
async function importDivergentFixture(page: Page) {
  const first={...MOCK_OBSERVATIONS[0],id:'synthetic-54-home',recordedByCaregiverId:'cg-helena',observedByCaregiverId:'cg-carlos',observerRole:'pai' as const,provenance:'REPORTED_BY_OTHER' as const,reportedByLabel:'Pai citado em relato textual',environment:'casa' as const,occurredAt:'2026-11-22T10:00',description:'SYN54-CASA: durante a saída permaneceu no tapete.',notes:'SYN54-INTERP-A: interpreto que antecipar a saída dificultou a transição.'};
  const second={...MOCK_OBSERVATIONS[0],id:'synthetic-54-school',recordedByCaregiverId:'cg-marina',observedByCaregiverId:'cg-marina',observerRole:'educador' as const,provenance:'DIRECT' as const,reportedByLabel:undefined,environment:'escola' as const,occurredAt:'2026-11-22T11:00',description:'SYN54-ESCOLA: durante a saída caminhou até a porta.',notes:'SYN54-INTERP-B: interpreto que antecipar a saída ajudou a transição.'};
  const unknown={...MOCK_OBSERVATIONS[0],id:'synthetic-54-unknown',recordedByCaregiverId:'cg-carlos',observedByCaregiverId:undefined,observerRole:'outro' as const,provenance:'REPORTED_BY_OTHER' as const,reportedByLabel:undefined,revision:9,updatedAt:'2026-11-22T15:00:00.000Z',description:'SYN54-LACUNA: houve um relato sem observador identificado.',notes:'SYN54-NOTA: autoria da interpretação não informada.'};
  const profile={...MOCK_PROFILE_TOMAS,interests:['UNSOURCED-54-INTEREST'],comfortAnchors:['UNSOURCED-54-COMFORT'],sensitivities:['UNSOURCED-54-SENSITIVITY'],communicationModes:['UNSOURCED-54-COMMUNICATION']};
  const payload={version:1 as const,exportedAt:'2026-11-22T16:00:00.000Z',childProfile:profile,observations:[first,second,unknown],linkedCaregivers:MOCK_CAREGIVERS,metadata:{origin:'Synthetic #54 tests',description:'Divergent synthetic reports',isSyntheticData:true as const}};
  const fixturePassword=randomUUID();
  const envelope=await encryptVault(payload,fixturePassword);
  await navigateToInternalScreen(page,'journal');
  await page.getByTitle('Importar cofre criptografado (.mundelo-vault)',{exact:true}).click();
  await page.locator('input[type=file]').setInputFiles({name:'synthetic-54.mundelo-vault',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(envelope))});
  await page.locator('#import-password').fill(fixturePassword);
  await page.getByRole('button',{name:'Desbloquear e Inspecionar',exact:true}).click();
  await page.getByRole('button',{name:/Confirmar e Aplicar na Memória/}).click();
  await expect(page.locator('#import-password')).toHaveCount(0);
  return {first,second,unknown};
}
test.beforeEach(async ({page})=>{
  await page.route('**/*',route=>['127.0.0.1','localhost'].includes(new URL(route.request().url()).hostname)?route.continue():route.abort());
  await openCleanSession(page);
  await page.evaluate(()=>{
    (window as any).__copies=[];(window as any).__prints=0;
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{(window as any).__copies.push(text);}}});
    window.print=()=>{(window as any).__prints++;};
  });
});
for(const item of [
  {child:'tomas' as const,actor:'cg-marina',snippet:'Na chegada à creche',name:'Prof. Marina'},
  {child:'lia' as const,actor:'cg-leonardo',snippet:'Na consulta de rotina',name:'Dr. Leonardo'},
]) {
  test('PG06-54: detalhe/prévia/cópia/impressão preservam distinções para '+item.name,async({page})=>{
    await selectChildProfile(page,item.child);
    await selectCaregiver(page,item.actor);
    await navigateToInternalScreen(page,'journal');
    await page.locator('main article').filter({hasText:item.snippet}).getByRole('button',{name:'Ver análise completa',exact:true}).click();
    const detail=page.getByRole('dialog');
    const detailGroup=detail.getByRole('group',{name:groupName,exact:true});
    await expect(detailGroup).toContainText(item.name);
    await expect(detailGroup).toContainText('Fonte do relato (texto não verificado)');
    expect((await pairs(detailGroup)).find(p=>p.label==='Autoria da interpretação:')?.value).toBe('Não registrada separadamente');
    await expect(detail).not.toContainText('Hipótese Familiar');
    await expect(detail).not.toContainText('Hipótese do Observador');
    const originalPairs=await pairs(detailGroup);
    await detail.getByRole('button',{name:'Concluído',exact:true}).click();
    await navigateToInternalScreen(page,'report');
    const preview=page.getByRole('region',{name:previewName,exact:true});
    const article=preview.getByRole('article').filter({hasText:item.snippet});
    const reportGroup=article.getByRole('group',{name:groupName,exact:true});
    expect(await pairs(reportGroup)).toEqual(originalPairs);
    const copied=await copyReport(page);
    await assertCopiedPairs(copied,originalPairs);
    expect(copied).not.toContain('Hipótese Familiar');
    await page.getByRole('button',{name:'Imprimir / Gerar PDF',exact:true}).click();
    expect(await page.evaluate(()=>(window as any).__prints)).toBe(1);
    await page.emulateMedia({media:'print'});
    await expect(reportGroup).toBeVisible();
    expect(await pairs(reportGroup)).toEqual(originalPairs);
  });
}
test('PG06-54: perspectivas divergentes mantêm texto/contexto e atributos globais não entram na síntese',async({page})=>{
  const {first,second}=await importDivergentFixture(page);
  await navigateToInternalScreen(page,'report');
  await page.getByRole('button',{name:'Desmarcar todas',exact:true}).click();
  for(const id of ['SYN54-CASA','SYN54-ESCOLA']) await page.getByRole('checkbox',{name:new RegExp(id)}).check();
  const preview=page.getByRole('region',{name:previewName,exact:true});
  await expect(preview.getByRole('article')).toHaveCount(2);
  for(const obs of [first,second]) {
    const article=preview.getByRole('article').filter({hasText:obs.description});
    await expect(article).toContainText(obs.notes);
  }
  await expect(preview).toContainText('Não representam consenso validado');
  await expect(preview).not.toContainText('UNSOURCED-54-');
  const copied=await copyReport(page);
  for(const obs of [first,second]){expect(copied).toContain(obs.description);expect(copied).toContain(obs.notes);}
  expect(copied).toContain('Casa');expect(copied).toContain('Escola / Creche');
  expect(copied).not.toContain('UNSOURCED-54-');
  expect(copied).not.toContain('SYN54-LACUNA');
  await page.emulateMedia({media:'print'});
  await expect(preview).not.toContainText('SYN54-LACUNA');
  await expect(preview).not.toContainText('UNSOURCED-54-');
  await expect(preview.getByRole('article')).toHaveCount(2);
});
test('PG06-54: observador/fonte desconhecidos e revisão alta não transferem autoria no detalhe/relatório',async({page})=>{
  await importDivergentFixture(page);
  await page.locator('main article').filter({hasText:'SYN54-LACUNA'}).getByRole('button',{name:'Ver análise completa',exact:true}).click();
  const group=page.getByRole('dialog').getByRole('group',{name:groupName,exact:true});
  const expected=await pairs(group);
  expect(expected.find(p=>p.label==='Registrado por:')!.value).toMatch(/^Carlos/);
  expect(expected.find(p=>p.label==='Observador identificado:')!.value).toBe('Pessoa não identificada');
  expect(expected.find(p=>p.label==='Fonte do relato (texto não verificado):')!.value).toBe('Não informado');
  expect(expected.find(p=>p.label==='Autoria da alteração:')!.value).toBe('Não registrada separadamente');
  expect(expected.find(p=>p.label==='Revisão informada:')!.value).toBe('9');
  await page.getByRole('dialog').getByRole('button',{name:'Concluído',exact:true}).click();
  await navigateToInternalScreen(page,'report');
  const article=page.getByRole('region',{name:previewName,exact:true}).getByRole('article').filter({hasText:'SYN54-LACUNA'});
  expect(await pairs(article.getByRole('group',{name:groupName,exact:true}))).toEqual(expected);
  await assertCopiedPairs(await copyReport(page),expected);
  await page.emulateMedia({media:'print'});
  expect(await pairs(article.getByRole('group',{name:groupName,exact:true}))).toEqual(expected);
});
test('PG06-54: relatório/detalhe com autoria explícita preservam a11y desktop/mobile',async({page})=>{
  for(const width of [1280,360]) {
    await page.setViewportSize({width,height:800});
    await navigateToInternalScreen(page,'journal');
    await page.getByRole('button',{name:'Ver análise completa',exact:true}).first().click();
    await expectZeroAxeViolations(page,'Detalhe atribuição '+width);
    await page.getByRole('dialog').getByRole('button',{name:'Concluído',exact:true}).click();
    await navigateToInternalScreen(page,'report');
    await expectZeroAxeViolations(page,'Relatório atribuição '+width);
  }
});
