import {test, expect, type Page} from '@playwright/test';
import {openCleanSession, selectCaregiver, selectChildProfile} from './fixtures/test-session';
import {navigateToInternalScreen} from './helpers/navigation';
import {expectZeroAxeViolations} from './helpers/accessibility';

const harnessUrl = 'http://127.0.0.1:4174/tests/harness/profile-context/index.html';
const marker = 'Naninha de malha macia azul claro';
const fields = [
  ['Interest','interests'],['ComfortAnchor','comfortAnchors'],['Sensitivity','sensitivities'],
  ['CommunicationMode','communicationModes'],['CelebratedMilestone','celebratedMilestones'],
] as const;
async function harness(page: Page) {
  await page.goto(harnessUrl);
  await expect(page.getByTestId('state')).toBeVisible();
}
async function state(page: Page) {
  return page.getByTestId('state').innerText();
}
async function invoke(page: Page, name: string, args: any[], captured = false) {
  return page.evaluate(({name,args,captured}) => (window as any).__invokeProfileCommand(name,args,captured),{name,args,captured});
}
async function denyAllCommands(page: Page, captured = false) {
  const before = await state(page);
  const results = await page.evaluate((captured) => {
    const w = window as any;
    const source = captured ? w.__capturedProfileContext : w.__profileContext;
    const p = source.activeProfile;
    const recipes: [string, any[]][] = [
      ['updateProfile',[{name:'DENIED-53 core'}]],
      ['addSupportStrategy',[{strategy:'DENIED-53 strategy',context:'synthetic',observedResponse:''}]],
      ['removeSupportStrategy',[p.supportStrategies[0].id]],
    ];
    for (const [suffix,field] of [
      ['Interest','interests'],['ComfortAnchor','comfortAnchors'],['Sensitivity','sensitivities'],
      ['CommunicationMode','communicationModes'],['CelebratedMilestone','celebratedMilestones'],
    ]) {
      recipes.push(['add'+suffix,['DENIED-53 '+field]],['remove'+suffix,[p[field][0]]]);
    }
    const output = recipes.map(([name,args])=>w.__invokeProfileCommand(name,args,captured));
    output.push(w.__invokeProfileCommand('importVaultPayload',[{
      version:1,exportedAt:'2026-11-22T01:00:00.000Z',
      childProfile:{...p,name:'DENIED-53 import'},observations:[],linkedCaregivers:source.caregivers,
      metadata:{origin:'synthetic',description:'Synthetic profile permission test',isSyntheticData:true},
    },'merge'],captured).success);
    w.__invokeProfileCommand('clearActiveChildObservationsToEmpty',[],captured);
    return output;
  },captured);
  // flushSync in the harness commits the real provider before this assertion.
  expect(await state(page)).toBe(before);
  expect(results).toHaveLength(14);
  expect(results.every(result=>result===false)).toBe(true);
}

test.beforeEach(async ({page}) => {
  await page.route('**/*', route=>['127.0.0.1','localhost'].includes(new URL(route.request().url()).hostname)?route.continue():route.abort());
});

test('PG06-53: Meu Mundo retira atributos na perda de leitura, inclusive impressão e retorno', async ({page}) => {
  await openCleanSession(page);
  await navigateToInternalScreen(page,'world');
  await expect(page.locator('main')).toContainText(marker);
  for (const actor of ['cg-ana-unlinked','cg-pedro-suspended']) {
    await selectCaregiver(page,actor);
    await expect(page.getByRole('heading',{name:'Meu Mundo indisponível',exact:true})).toBeVisible();
    await expect(page.locator('main')).not.toContainText(marker);
    await expect(page.locator('main').getByRole('textbox')).toHaveCount(0);
    await page.emulateMedia({media:'print'});
    await expect(page.locator('main')).not.toContainText(marker);
    await page.emulateMedia({media:'screen'});
    await selectCaregiver(page,'cg-helena');
    await expect(page.locator('main')).toContainText(marker);
  }
});

test('PG06-53: cuidadores vinculados sem gestão leem sem editar e mantêm criação de observação', async ({page}) => {
  await openCleanSession(page);
  for (const [actor,child] of [['cg-clara','tomas'],['cg-marina','tomas'],['cg-leonardo','lia']] as const) {
    await selectChildProfile(page,child);
    await selectCaregiver(page,actor);
    await navigateToInternalScreen(page,'world');
    await expect(page.getByRole('heading',{level:1})).toContainText('Meu Mundo:');
    await expect(page.getByRole('button',{name:'Salvar Estratégia',exact:true})).toBeDisabled();
    const inputs = page.locator('main').getByRole('textbox');
    expect(await inputs.count()).toBeGreaterThan(0);
    for (const input of await inputs.all()) await expect(input).toBeDisabled();
    await navigateToInternalScreen(page,'journal');
    await expect(page.locator('main').getByRole('button',{name:'Nova Observação',exact:true}).first()).toBeEnabled();
  }
});

test('PG06-53: rascunhos não atravessam mudança de criança/cuidador nem reaparecem no retorno', async ({page}) => {
  await openCleanSession(page);
  await navigateToInternalScreen(page,'world');
  const input = page.getByRole('textbox',{name:'Novo interesse ou fascínio',exact:true});
  await input.fill('SYNTHETIC-DRAFT-53');
  await selectChildProfile(page,'lia');
  await expect(input).toHaveValue('');
  await selectChildProfile(page,'tomas');
  await expect(input).toHaveValue('');
  await input.fill('SYNTHETIC-DRAFT-53');
  await selectCaregiver(page,'cg-ana-unlinked');
  await expect(page.locator('main')).not.toContainText('SYNTHETIC-DRAFT-53');
  await selectCaregiver(page,'cg-helena');
  await expect(input).toHaveValue('');
});

test('PG06-53: todos os comandos reais rejeitam papéis sem gestão e guardiões sem vínculo/status', async ({page}) => {
  await harness(page);
  for (const actor of ['cg-ana-unlinked','cg-pedro-suspended','test-guardian-unlinked','test-guardian-suspended','test-guardian-invited','cg-clara','cg-marina']) {
    await page.getByLabel('Harness cuidador',{exact:true}).selectOption(actor);
    await denyAllCommands(page);
  }
  await page.getByLabel('Harness criança',{exact:true}).selectOption('lia');
  await page.getByLabel('Harness cuidador',{exact:true}).selectOption('cg-leonardo');
  await denyAllCommands(page);
});

test('PG06-53: callbacks capturados não sobrevivem troca e retorno de pessoa ou criança', async ({page}) => {
  await harness(page);
  await page.evaluate(() => {(window as any).__capturedProfileContext=(window as any).__profileContext;});
  for (const actor of ['cg-ana-unlinked','cg-carlos','cg-helena']) {
    await page.getByLabel('Harness cuidador',{exact:true}).selectOption(actor);
    await denyAllCommands(page,true);
  }
  // Capture a fresh command, then move between children and back.
  await page.evaluate(() => {(window as any).__capturedProfileContext=(window as any).__profileContext;});
  for (const child of ['lia','tomas']) {
    await page.getByLabel('Harness criança',{exact:true}).selectOption(child);
    await denyAllCommands(page,true);
  }
  expect(await invoke(page,'updateProfile',[{name:'Authorized current context'}])).toBe(true);
});

test('PG06-53: cada caminho de gestão autorizado altera somente a criança alvo; id inválido é recusado', async ({page}) => {
  await harness(page);
  const before = JSON.parse(await state(page));
  expect(await invoke(page,'updateProfile',[{name:'SYNTHETIC-53 authorized'}])).toBe(true);
  for (const [suffix,field] of fields) {
    const value='SYNTHETIC-53 '+field;
    expect(await invoke(page,'add'+suffix,[value])).toBe(true);
    expect(JSON.parse(await state(page)).profiles[0][field]).toContain(value);
    expect(await invoke(page,'remove'+suffix,[value])).toBe(true);
    expect(JSON.parse(await state(page)).profiles[0][field]).toEqual(before.profiles[0][field]);
  }
  expect(await invoke(page,'addSupportStrategy',[{strategy:'SYNTHETIC-53 strategy',context:'',observedResponse:''}])).toBe(true);
  const strat = JSON.parse(await state(page)).profiles[0].supportStrategies.find((s:any)=>s.strategy==='SYNTHETIC-53 strategy');
  expect(await invoke(page,'removeSupportStrategy',[strat.id])).toBe(true);
  const accepted = JSON.parse(await state(page));
  expect(accepted.profiles[1]).toEqual(before.profiles[1]);
  expect(accepted.profiles[0].supportStrategies).toEqual(before.profiles[0].supportStrategies);
  expect(await invoke(page,'updateProfile',[{id:'lia'}])).toBe(false);
  expect(await invoke(page,'updateProfile',[{ageMonths:-1}])).toBe(false);
  expect(await state(page)).toBe(JSON.stringify(accepted));
});

test('PG06-53: configuração é escondida quando guardião perde status e cenário de teste não integra build', async ({page,request}) => {
  await harness(page);
  await expect(page.getByTestId('onboarding').getByRole('textbox',{name:'Nome (Fictício)',exact:true})).toBeVisible();
  await page.getByLabel('Harness cuidador',{exact:true}).selectOption('test-guardian-suspended');
  await expect(page.getByTestId('world')).not.toContainText(marker);
  await expect(page.getByTestId('onboarding').getByRole('textbox')).toHaveCount(0);
  const production = await request.get('/tests/harness/profile-context/entry.tsx');
  expect(await production.text()).not.toContain('__profileContext');
});

test('PG06-53: leitura negada e leitura sem gestão preservam a11y desktop/mobile', async ({page}) => {
  await openCleanSession(page);
  await navigateToInternalScreen(page,'world');
  for (const actor of ['cg-ana-unlinked','cg-clara']) {
    await selectCaregiver(page,actor);
    for (const width of [1280,360]) {
      await page.setViewportSize({width,height:800});
      await expectZeroAxeViolations(page,'Meu Mundo '+actor+' '+width);
    }
    await page.setViewportSize({width:1280,height:800});
  }
});
