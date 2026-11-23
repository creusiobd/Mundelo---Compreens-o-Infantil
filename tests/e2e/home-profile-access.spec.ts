import {test, expect, type Page, type TestInfo} from '@playwright/test';
import {openCleanSession, selectCaregiver, selectChildProfile} from './fixtures/test-session';
import {expectZeroAxeViolations} from './helpers/accessibility';

const interest = 'Movimento de rodas e veículos de madeira';
const communication = 'Aponta com o dedo indicador e aguarda confirmação com o olhar';
const home = (page: Page) => page.locator('main#main-content');
async function record(page: Page, info: TestInfo, state: string) {
  const text = await home(page).innerText();
  await info.attach(state, {body:Buffer.from(JSON.stringify({
    state, interestVisible:text.includes(interest), communicationVisible:text.includes(communication),
    unsupportedInterestLabel:text.includes('Interesse atual'), unsupportedCommunicationLabel:text.includes('Expressão frequente'),
    strategiesCardVisible:text.includes('Estratégias Catalogadas') || text.includes('Estratégias no perfil'),
  })),contentType:'application/json'});
}
test.beforeEach(async ({page}) => {
  await page.route('**/*', route=>['127.0.0.1','localhost'].includes(new URL(route.request().url()).hostname)?route.continue():route.abort());
});
test('AUD-13: resumo autorizado delimita dados globais sem inferir atualidade ou frequência', async ({page},info) => {
  await openCleanSession(page);
  await record(page,info,'authorized');
  await expect(home(page)).toContainText(interest);
  await expect(home(page)).toContainText(communication);
  await expect(home(page)).not.toContainText('Interesse atual');
  await expect(home(page)).not.toContainText('Expressão frequente');
  await expect(home(page)).toContainText('A origem e a data não estão indicadas');
  await expect(home(page).getByRole('button',{name:'Nova Observação',exact:false})).toBeEnabled();
  await home(page).getByRole('button',{name:'Nova Observação',exact:false}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});
for (const actor of ['cg-ana-unlinked','cg-pedro-suspended']) {
  test('AUD-13: Home não apresenta atributos/contagens sem leitura — '+actor, async ({page},info) => {
    await openCleanSession(page);
    await expect(home(page)).toContainText(interest);
    await selectCaregiver(page,actor);
    await record(page,info,actor);
    await expect(home(page)).not.toContainText(interest);
    await expect(home(page)).not.toContainText(communication);
    await expect(home(page)).not.toContainText('Tomás');
    await expect(home(page)).not.toContainText('2 anos e 8 meses');
    await expect(home(page)).not.toContainText('Estratégias Catalogadas');
    await expect(home(page)).not.toContainText('Estratégias no perfil');
    await expect(home(page).locator('[data-profile-count]')).toHaveCount(0);
    await expect(home(page).getByRole('button',{name:'Ajustar Perfil',exact:true})).toHaveCount(0);
    await expect(home(page).getByRole('button',{name:'Nova Observação',exact:false})).toBeDisabled();
    await page.emulateMedia({media:'print'});
    await expect(home(page)).not.toContainText(interest);
    await expect(home(page)).not.toContainText('Tomás');
    await expect(home(page).locator('[data-profile-count]')).toHaveCount(0);
  });
}
test('AUD-13: troca/retorno de criança e cuidador recalcula a leitura na Home', async ({page}) => {
  await openCleanSession(page);
  await selectCaregiver(page,'cg-marina');
  await expect(home(page)).toContainText(interest);
  await selectChildProfile(page,'lia');
  await expect(home(page)).not.toContainText(interest);
  await expect(home(page)).not.toContainText('Lia');
  await expect(home(page).locator('[data-profile-count]')).toHaveCount(0);
  await selectChildProfile(page,'tomas');
  await expect(home(page)).toContainText(interest);
  await selectCaregiver(page,'cg-ana-unlinked');
  await selectChildProfile(page,'lia');
  await selectChildProfile(page,'tomas');
  await expect(home(page)).not.toContainText(interest);
  await expect(home(page)).not.toContainText('Tomás');
  await selectCaregiver(page,'cg-helena');
  await expect(home(page)).toContainText(interest);
  await expect(home(page).locator('[data-profile-count]')).toHaveCount(2);
  await page.emulateMedia({media:'print'});
  await expect(home(page)).toContainText(interest);
});
test('AUD-13: leitura legítima de educador conserva observações e acesso aos detalhes', async ({page}) => {
  await openCleanSession(page,{caregiverId:'cg-marina'});
  await expect(home(page)).toContainText(interest);
  const recent = home(page).locator('section[aria-labelledby="recent-observations-heading"]');
  await expect(recent.locator('article')).toHaveCount(3);
  await recent.getByRole('button',{name:/Consultar detalhes/}).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
});
test('AUD-13: campo vazio é ausência de informação, sem interesse ou frequência inventados', async ({page,request}) => {
  await page.goto('http://127.0.0.1:4174/tests/harness/home-profile/index.html');
  await expect(home(page)).toContainText(interest);
  await page.getByRole('button',{name:'Limpar campos sintéticos do resumo',exact:true}).click();
  await expect(home(page)).not.toContainText(interest);
  await expect(home(page)).not.toContainText('Exploração livre');
  await expect(home(page)).toContainText('Nenhum interesse informado no perfil');
  await expect(home(page)).toContainText('Nenhuma forma de comunicação informada no perfil');
  await expect(home(page).locator('[data-profile-count="strategies"]')).toHaveText('0');
  const productionEntry = await request.get('/tests/harness/home-profile/entry.tsx');
  expect(await productionEntry.text()).not.toContain('Limpar campos sintéticos do resumo');
});
test('AUD-13: Home autorizada/restrita preserva acessibilidade em desktop e mobile', async ({page}) => {
  await openCleanSession(page);
  for (const actor of ['cg-helena','cg-ana-unlinked','cg-pedro-suspended']) {
    await page.setViewportSize({width:1280,height:800});
    await selectCaregiver(page,actor);
    for (const width of [1280,360]) {
      await page.setViewportSize({width,height:800});
      await expectZeroAxeViolations(page,'Home '+actor+' '+width);
    }
  }
});
