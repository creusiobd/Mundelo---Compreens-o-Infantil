import {test, expect, type Page} from '@playwright/test';
import {openCleanSession, selectChildProfile, selectCaregiver, triggerEmptyStateViaHeader, restoreSyntheticDataViaHeader} from './fixtures/test-session';
import {expectZeroAxeViolations} from './helpers/accessibility';

async function expectNoInventedFindings(page: Page) {
  const main = page.locator('main');
  await expect(main).not.toContainText('Padrões Descritivos Identificados na Amostra');
  await expect(main).not.toContainText('correlacionou-se');
  await expect(main).not.toContainText('eliciam reflexo');
  await expect(main).not.toContainText('aumentou substancialmente');
  await expect(main).not.toContainText('Hipótese:');
  await expect(main).toContainText('Sugestões gerais de perguntas, iguais para todas as sessões');
  await expect(main).toContainText('Não representam todo o cotidiano da criança');
}

test.beforeEach(async ({page}) => {
  await page.route('**/*', route => ['127.0.0.1', 'localhost'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  await openCleanSession(page);
  await page.getByRole('navigation', {name:'Navegação principal',exact:true}).getByRole('button', {name:'Compreender',exact:true}).click();
  await expect(page.getByRole('heading', {level:1})).toContainText('Compreender');
});

test('PG06-51: troca de criança altera universo, ambientes e focos sem conclusões fixas', async ({page}) => {
  await expectNoInventedFindings(page);
  const env = page.getByRole('region', {name:'Registros por Ambiente', exact:true});
  const focus = page.getByRole('region', {name:'Registros por Foco', exact:true});
  await expect(page.getByRole('status').filter({hasText:'disponíveis para leitura'})).toContainText('5 registros');
  await expect(env.getByRole('group', {name:'Casa', exact:true})).toContainText('2 (40%)');
  await expect(env.getByRole('group', {name:'Parque / Ar Livre', exact:true})).toContainText('1 (20%)');
  await expect(focus.getByRole('group', {name:'Rotinas & Transições', exact:true})).toContainText('2 (40%)');
  await expectNoInventedFindings(page);
  await selectChildProfile(page, 'lia');
  await expect(page.getByRole('heading', {level:1})).toHaveText('Compreender Lia: Registros & Contextos');
  await expect(page.getByRole('status').filter({hasText:'disponíveis para leitura'})).toContainText('3 registros');
  await expect(env.getByRole('group', {name:'Casa', exact:true})).toContainText('2 (67%)');
  await expect(env.getByRole('group', {name:'Transporte / Consulta', exact:true})).toContainText('1 (33%)');
  await expect(env.getByRole('group')).toHaveCount(2);
  await expect(focus.getByRole('group', {name:'Rotinas & Transições', exact:true})).toContainText('0 (0%)');
  await expect(focus.getByRole('group', {name:'Descobertas & Exploração', exact:true})).toContainText('1 (33%)');
  await expectNoInventedFindings(page);
  await selectChildProfile(page, 'tomas');
  await expect(env.getByRole('group', {name:'Casa', exact:true})).toContainText('2 (40%)');
});

test('PG06-51: esvaziar e restaurar a amostra atualiza contagens sem fabricar achados', async ({page}) => {
  await triggerEmptyStateViaHeader(page);
  await expect(page.getByRole('status').filter({hasText:'disponíveis para leitura'})).toContainText('0 registros');
  await expect(page.getByText('Nenhum registro para mapear ambientes.', {exact:true})).toBeVisible();
  await expect(page.getByText('Nenhum registro para contar por foco.', {exact:true})).toBeVisible();
  await expect(page.getByRole('region', {name:'Registros por Foco', exact:true}).getByRole('group')).toHaveCount(0);
  await expectNoInventedFindings(page);
  await restoreSyntheticDataViaHeader(page);
  await expect(page.getByRole('status').filter({hasText:'disponíveis para leitura'})).toContainText('5 registros');
  await expect(page.getByRole('region', {name:'Registros por Ambiente', exact:true}).getByRole('group', {name:'Casa', exact:true})).toContainText('2 (40%)');
});

test('PG06-51: perda de vínculo ou suspensão retira registros das contagens', async ({page}) => {
  for (const actor of ['cg-ana-unlinked', 'cg-pedro-suspended']) {
    await selectCaregiver(page, actor);
    await expect(page.locator('main').getByRole('status')).toContainText('Leitura do perfil indisponível');
    await expect(page.getByRole('region', {name:'Registros por Ambiente', exact:true})).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText('0 registros');
    await expect(page.locator('main')).not.toContainText('Tomás');
    await selectCaregiver(page, 'cg-helena');
    await expect(page.getByRole('status').filter({hasText:'disponíveis para leitura'})).toContainText('5 registros');
  }
});

test('PG06-51: contagens e estado vazio preservam acessibilidade em desktop e mobile', async ({page}) => {
  for (const width of [1280, 360]) {
    await page.setViewportSize({width, height:800});
    await expectZeroAxeViolations(page, 'Compreender com registros ' + width);
    await triggerEmptyStateViaHeader(page);
    await expectZeroAxeViolations(page, 'Compreender vazio ' + width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await restoreSyntheticDataViaHeader(page);
  }
});
