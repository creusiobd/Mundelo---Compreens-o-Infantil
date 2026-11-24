import {test,expect,type Page,type TestInfo} from '@playwright/test';
import {openCleanSession,selectCaregiver} from './fixtures/test-session';
import {navigateToInternalScreen} from './helpers/navigation';
import {expectZeroAxeViolations} from './helpers/accessibility';
import {MOCK_OBSERVATIONS} from '../../src/data/mockData';

const saved = 'Observação registrada na memória desta sessão de demonstração.';
const removed = 'Registro retirado da memória desta sessão de demonstração.';
const denied = 'Acesso negado: remover um registro desta memória de demonstração exige cuidador ativo, vinculado ao perfil e responsável legal ou a pessoa que registrou a observação.';
const original = MOCK_OBSERVATIONS.find(o=>o.childId==='tomas' && o.recordedByCaregiverId==='cg-helena')!;
const toast = (page:Page)=>page.locator('aside[aria-live="polite"]');
async function createRecord(page:Page,marker:string) {
  await page.locator('main').getByRole('button',{name:'Nova Observação',exact:true}).first().click();
  const form=page.getByRole('dialog',{name:'Nova Observação no Diário',exact:true});
  await form.locator('#obs-desc').fill(marker);
  await form.locator('#obs-date').fill('2026-11-23T09:30');
  await form.locator('#obs-env').selectOption('escola');
  await form.locator('#obs-role').selectOption('educador');
  await form.getByRole('button',{name:/^Descoberta/}).click();
  await form.getByRole('button',{name:/^Observação Direta/}).click();
  await form.getByRole('button',{name:'Salvar no Diário',exact:true}).click();
  await expect(form).toHaveCount(0);
}
async function openDelete(page:Page,text=original.description) {
  const card=page.locator('main article').filter({hasText:text});
  await card.getByRole('button',{name:'Excluir esta observação',exact:true}).click();
  return page.getByRole('dialog',{name:'Excluir Observação',exact:true});
}
async function invoke(page:Page,name:string,args:unknown[]) {
  return page.evaluate(({name,args})=>(window as any).__invokeProfileCommand(name,args),{name,args});
}
test.beforeEach(async ({page})=>{
  await page.route('**/*',route=>['127.0.0.1','localhost'].includes(new URL(route.request().url()).hostname)?route.continue():route.abort());
});

test('AUD-09: registro real usa mensagem demonstrativa e mantém o conteúdo fornecido',async({page})=>{
  await openCleanSession(page,{caregiverId:'cg-marina'});
  await navigateToInternalScreen(page,'journal');
  await createRecord(page,'SYNTHETIC-61: a educadora colocou dois blocos na mesa.');
  await expect(toast(page)).toContainText(saved);
  await expect(toast(page)).not.toContainText('canônica');
  const card=page.locator('main article').filter({hasText:'SYNTHETIC-61:'});
  await expect(card).toContainText('SYNTHETIC-61: a educadora colocou dois blocos na mesa.');
  await card.getByRole('button',{name:'Ver análise completa',exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText('Prof. Marina');
});

test('AUD-10: responsável legal vinculado remove registro de outra pessoa somente da memória',async({page})=>{
  await openCleanSession(page,{caregiverId:'cg-carlos'});
  await navigateToInternalScreen(page,'journal');
  await expect(page.locator('main article')).toHaveCount(5);
  const dialog=await openDelete(page);
  await expect(dialog).toContainText('não comprova eliminação em cópias ou backups');
  await dialog.getByRole('button',{name:'Sim, Excluir',exact:true}).click();
  await expect(toast(page)).toContainText(removed);
  await expect(page.locator('main article')).toHaveCount(4);
  await expect(page.locator('main article').filter({hasText:original.description})).toHaveCount(0);
});

test('AUD-10: pessoa ativa vinculada que registrou pode remover o próprio registro',async({page})=>{
  await openCleanSession(page,{caregiverId:'cg-marina'});
  await navigateToInternalScreen(page,'journal');
  const marker='SYNTHETIC-61: registro próprio da educadora.';
  await createRecord(page,marker);
  const dialog=await openDelete(page,marker);
  await dialog.getByRole('button',{name:'Sim, Excluir',exact:true}).click();
  await expect(toast(page)).toContainText(removed);
  await expect(page.locator('main article').filter({hasText:marker})).toHaveCount(0);
  await expect(page.locator('main article')).toHaveCount(5);
});

for(const actor of ['cg-marina','cg-ana-unlinked','cg-pedro-suspended']) {
  test('AUD-10: confirmação iniciada não contorna negativa para '+actor,async({page})=>{
    await openCleanSession(page);
    await navigateToInternalScreen(page,'journal');
    const dialog=await openDelete(page);
    await selectCaregiver(page,actor);
    await dialog.getByRole('button',{name:'Sim, Excluir',exact:true}).click();
    await expect(toast(page)).toContainText(denied);
    await expect(toast(page)).not.toContainText('Apenas Responsáveis Legais');
    await selectCaregiver(page,'cg-helena');
    await expect(page.locator('main article')).toHaveCount(5);
    await expect(page.locator('main article').filter({hasText:original.description})).toHaveCount(1);
  });
}

test('AUD-10: retornos e efeitos reais do provider preservam a matriz de cinco atores',async({page},info:TestInfo)=>{
  const observed:object[]=[];
  for(const row of [
    {actor:'cg-carlos',own:false,allowed:true},
    {actor:'cg-marina',own:true,allowed:true},
    {actor:'cg-marina',own:false,allowed:false},
    {actor:'cg-ana-unlinked',own:false,allowed:false},
    {actor:'cg-pedro-suspended',own:false,allowed:false},
  ]) {
    await page.goto('http://127.0.0.1:4174/tests/harness/profile-context/index.html');
    await expect(page.getByTestId('state')).toBeVisible();
    await page.getByLabel('Harness cuidador',{exact:true}).selectOption(row.actor);
    let targetId=original.id;
    if(row.own) {
      expect(await invoke(page,'addObservation',[{
        occurredAt:'2026-11-23T09:30',provenance:'DIRECT',environment:'escola',observerRole:'educador',
        eventType:'descoberta',description:'SYNTHETIC-61 provider own',antecedents:'',communicationSignals:'',
        supportOffered:'',observedOutcome:'',positiveAspects:'',notes:'',
      }])).toBe(true);
      targetId=await page.evaluate(()=>(window as any).__profileContext.allObservations.find((o:any)=>o.description==='SYNTHETIC-61 provider own').id);
    }
    const before=JSON.parse(await page.getByTestId('state').innerText()).observations;
    const result=await invoke(page,'deleteObservation',[targetId]);
    const after=JSON.parse(await page.getByTestId('state').innerText()).observations;
    expect(result).toBe(row.allowed);
    expect(after).toEqual(row.allowed?before.filter((o:any)=>o.id!==targetId):before);
    observed.push({...row,result,countBefore:before.length,countAfter:after.length});
  }
  await info.attach('matriz-real',{body:Buffer.from(JSON.stringify(observed)),contentType:'application/json'});
});

test('AUD-09/10: confirmação e negativa mantêm acessibilidade desktop/mobile',async({page})=>{
  for(const width of [1280,360]) {
    await openCleanSession(page);
    await navigateToInternalScreen(page,'journal');
    const dialog=await openDelete(page);
    await page.setViewportSize({width,height:800});
    await expect(dialog).toContainText('memória desta sessão de demonstração');
    await expectZeroAxeViolations(page,'Confirmação demonstrativa '+width);
    await page.setViewportSize({width:1280,height:800});
    await selectCaregiver(page,'cg-marina');
    await page.setViewportSize({width,height:800});
    await dialog.getByRole('button',{name:'Sim, Excluir',exact:true}).click();
    await expect(toast(page)).toContainText(denied);
    await expectZeroAxeViolations(page,'Negativa demonstrativa '+width);
  }
});
