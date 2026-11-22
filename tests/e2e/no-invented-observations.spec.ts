import {test, expect, type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {decryptVault} from '../../src/crypto/vault';
import {openCleanSession, selectCaregiver} from './fixtures/test-session';
import {navigateToInternalScreen} from './helpers/navigation';
import {expectZeroAxeViolations} from './helpers/accessibility';

const optionalFields = ['obs-ante','obs-comm','obs-supp','obs-outcome','obs-pos','obs-notes'];
async function openActivity(page: Page) {
  await navigateToInternalScreen(page, 'discoveries');
  await page.getByRole('button', {name:/Registrar Observação a Partir Desta Descoberta/}).first().click();
  await expect(page.getByRole('dialog', {name:'Nova Observação no Diário'})).toBeVisible();
}
async function exportActualPayload(page: Page) {
  await navigateToInternalScreen(page, 'privacy');
  await page.getByRole('button', {name:'Exportar Cofre (.mundelo-vault)',exact:true}).click();
  // Ephemeral, test-only value: no fixed credential in source control.
  const password = randomUUID();
  await page.locator('#vault-password').fill(password);
  await page.locator('#vault-password-confirm').fill(password);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', {name:'Cifrar e Baixar Cofre',exact:true}).click();
  const download = await downloadPromise;
  try {
    return await decryptVault(JSON.parse(await readFile((await download.path())!, 'utf8')), password);
  } finally {
    await download.delete();
  }
}
test.beforeEach(async ({page}) => {
  await page.route('**/*', route => ['127.0.0.1','localhost'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  await openCleanSession(page);
});

test('PG06-52: abrir proposta não preenche fatos, origem, pessoa, data nem hipótese; cancelar não grava', async ({page}) => {
  await openActivity(page);
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('complementary', {name:'Proposta de atividade'})).toContainText('não um relato de algo que aconteceu');
  await dialog.getByRole('tab', {name:'Visão Integrada',exact:true}).click();
  for (const id of ['obs-date','obs-env','obs-role','obs-desc',...optionalFields]) {
    await expect(dialog.locator('#'+id)).toHaveValue('');
  }
  for (const name of [/^Observação Direta/, /^Relatada por Terceiros/, /^Conquista/, /^Desconforto/, /^Rotina/, /^Descoberta/]) {
    await expect(dialog.getByRole('button', {name})).toHaveAttribute('aria-pressed','false');
  }
  await dialog.getByRole('button', {name:'Cancelar',exact:true}).click();
  await navigateToInternalScreen(page, 'journal');
  await expect(page.locator('main article')).toHaveCount(5);
});

test('PG06-52: criar relato por Carlos exige contexto explícito e preserva campos não informados no cofre', async ({page}) => {
  await selectCaregiver(page, 'cg-carlos');
  await openActivity(page);
  const dialog = page.getByRole('dialog');
  await dialog.locator('#obs-desc').fill('SYNTHETIC-52: a educadora relatou que colocou dois blocos na mesa.');
  await dialog.getByRole('button', {name:'Salvar no Diário',exact:true}).click();
  await expect(dialog.getByRole('alert')).toContainText('Não presumimos esses dados');
  await dialog.locator('#obs-date').fill('2026-11-20T09:30');
  await dialog.locator('#obs-env').selectOption('escola');
  await dialog.locator('#obs-role').selectOption('educador');
  await dialog.getByRole('button', {name:/^Descoberta/}).click();
  await dialog.getByRole('button', {name:/^Relatada por Terceiros/}).click();
  await dialog.locator('#obs-reported-by').fill('Educadora sintética');
  await dialog.getByRole('button', {name:'Salvar no Diário',exact:true}).click();
  await expect(dialog).toHaveCount(0);
  const payload = await exportActualPayload(page);
  const obs = payload.observations.find(o=>o.description.startsWith('SYNTHETIC-52:'))!;
  expect(obs).toBeTruthy();
  expect(obs.recordedByCaregiverId).toBe('cg-carlos');
  expect(obs.observedByCaregiverId).toBeUndefined();
  expect(obs.provenance).toBe('REPORTED_BY_OTHER');
  expect(obs.reportedByLabel).toBe('Educadora sintética');
  expect(obs.occurredAt).toBe('2026-11-20T09:30');
  expect(obs.environment).toBe('escola');
  expect(obs.observerRole).toBe('educador');
  for (const key of ['antecedents','communicationSignals','supportOffered','observedOutcome','positiveAspects','notes'] as const) expect(obs[key]).toBe('');
  expect(obs.recordedAt).toBeTruthy();
});

test('PG06-52: editar relato mantém fatos fornecidos e não leva observador presumido a outra origem', async ({page}) => {
  await navigateToInternalScreen(page, 'journal');
  await page.getByRole('button', {name:'Ver análise completa',exact:true}).first().click();
  await page.getByRole('dialog').getByRole('button', {name:'Editar',exact:true}).click();
  const dialog = page.getByRole('dialog', {name:'Editar Observação',exact:true});
  const occurredAt = await dialog.locator('#obs-date').inputValue();
  const description = await dialog.locator('#obs-desc').inputValue();
  expect(description.length).toBeGreaterThan(3);
  await dialog.getByRole('button', {name:/^Relatada por Terceiros/}).click();
  await dialog.locator('#obs-reported-by').fill('');
  await dialog.locator('#obs-outcome').fill('');
  await dialog.locator('#obs-notes').fill('');
  await dialog.getByRole('button', {name:'Atualizar Observação',exact:true}).click();
  await expect(dialog).toHaveCount(0);
  const payload = await exportActualPayload(page);
  const obs = payload.observations.find(o=>o.description===description)!;
  expect(obs.occurredAt).toBe(occurredAt);
  expect(obs.revision).toBe(2);
  expect(obs.updatedAt).toBeTruthy();
  expect(obs.provenance).toBe('REPORTED_BY_OTHER');
  expect(obs.observedByCaregiverId).toBeUndefined();
  expect(obs.reportedByLabel).toBeUndefined();
  expect(obs.observedOutcome).toBe('');
  expect(obs.notes).toBe('');
});

test('PG06-52: estratégia sem contexto/resposta não fabrica calma e entrada explícita é preservada', async ({page}) => {
  await navigateToInternalScreen(page, 'world');
  const name = page.getByRole('textbox', {name:'Nome da estratégia de acolhimento',exact:true});
  await name.fill('SYNTHETIC-52 estratégia sem resposta');
  await page.getByRole('button', {name:'Salvar Estratégia',exact:true}).click();
  const card = page.locator('div').filter({has:page.getByRole('button', {name:'Remover estratégia SYNTHETIC-52 estratégia sem resposta',exact:true})}).filter({hasText:'Resposta observada:'}).last();
  await expect(card).toContainText('Não informada');
  await expect(page.locator('main')).not.toContainText('Resposta calma observada');
  await name.fill('SYNTHETIC-52 estratégia com relato');
  await page.getByRole('textbox', {name:'Contexto de aplicação da estratégia',exact:true}).fill('Mesa da escola');
  await page.getByRole('textbox', {name:'Resposta observada da criança',exact:true}).fill('Colocou os blocos na caixa');
  await page.getByRole('button', {name:'Salvar Estratégia',exact:true}).click();
  const payload = await exportActualPayload(page);
  const blank = payload.childProfile.supportStrategies.find(s=>s.strategy==='SYNTHETIC-52 estratégia sem resposta')!;
  expect(blank.context).toBe('');
  expect(blank.observedResponse).toBe('');
  const explicit = payload.childProfile.supportStrategies.find(s=>s.strategy==='SYNTHETIC-52 estratégia com relato')!;
  expect(explicit.context).toBe('Mesa da escola');
  expect(explicit.observedResponse).toBe('Colocou os blocos na caixa');
});

test('PG06-52: formulário vazio e erro de contexto preservam acessibilidade desktop/mobile', async ({page}) => {
  await openActivity(page);
  for (const width of [1280,360]) {
    await page.setViewportSize({width,height:800});
    await expectZeroAxeViolations(page, 'Proposta sem relato '+width);
    await page.locator('#obs-desc').fill('SYNTHETIC-52: dois blocos na mesa.');
    await page.getByRole('button', {name:'Salvar no Diário',exact:true}).click();
    await expect(page.getByRole('dialog').getByRole('alert')).toBeVisible();
    await expectZeroAxeViolations(page, 'Contexto não informado '+width);
  }
});
