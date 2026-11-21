import { test, expect, Page } from '@playwright/test';
import { openCleanSession, selectCaregiver, selectChildProfile } from './fixtures/test-session';
import { navigateToInternalScreen } from './helpers/navigation';

async function openExporter(page: Page) {
  await page.getByTitle('Exportar cofre criptografado (.mundelo-vault)', { exact: true }).click();
}
async function fillAndSubmit(page: Page) {
  await page.locator('#vault-password').fill('synthetic-regression-only');
  await page.locator('#vault-password-confirm').fill('synthetic-regression-only');
  await page.getByRole('button', { name: 'Cifrar e Baixar Cofre', exact: true }).click();
}
async function pauseAfterCrypto(page: Page) {
  await page.evaluate(() => {
    const state = window as any;
    const original = SubtleCrypto.prototype.encrypt;
    state.__exportCryptoReached = false;
    SubtleCrypto.prototype.encrypt = async function (...args: Parameters<SubtleCrypto['encrypt']>) {
      const encrypted = await original.apply(this, args);
      state.__exportCryptoReached = true;
      await new Promise<void>(resolve => { state.__releaseExportCrypto = resolve; });
      return encrypted;
    };
  });
  await openExporter(page);
  await fillAndSubmit(page);
  await page.waitForFunction(() => (window as any).__exportCryptoReached === true);
}
async function releaseAndExpectCancellation(page: Page, downloads: () => number) {
  await page.evaluate(() => (window as any).__releaseExportCrypto());
  await expect(page.getByText('Exportação cancelada: o contexto ou os dados mudaram, ou a operação expirou. Inicie novamente.', { exact: true })).toBeVisible();
  expect(downloads()).toBe(0);
  await expect(page.locator('#vault-password')).toHaveValue('');
  await expect(page.locator('#vault-password-confirm')).toHaveValue('');
}
test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => ['127.0.0.1', 'localhost'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  await openCleanSession(page);
  await navigateToInternalScreen(page, 'journal');
});
test('exporta normalmente se o contexto e os dados continuam vigentes', async ({ page }) => {
  await openExporter(page);
  const pending = page.waitForEvent('download');
  await fillAndSubmit(page);
  const download = await pending;
  expect(download.suggestedFilename()).toMatch(/^mundelo-[0-9a-f-]{36}\.mundelo-vault$/);
  await expect(page.getByRole('dialog', { name: 'Exportar Cofre Criptografado' })).toHaveCount(0);
  await download.delete();
});
test('cancela após troca para cuidador sem vínculo durante a cifra', async ({ page }) => {
  let count = 0; page.on('download', () => { count++; });
  await pauseAfterCrypto(page);
  await selectCaregiver(page, 'cg-ana-unlinked');
  await expect(page.getByText('Acesso Negado: Cuidador Não Autorizado', { exact: true })).toBeVisible();
  await releaseAndExpectCancellation(page, () => count);
});
test('cancela também quando outro cuidador autorizado assume o contexto', async ({ page }) => {
  let count = 0; page.on('download', () => { count++; });
  await pauseAfterCrypto(page);
  await selectCaregiver(page, 'cg-carlos');
  await releaseAndExpectCancellation(page, () => count);
});
test('cancela após troca do perfil ativo durante a cifra', async ({ page }) => {
  let count = 0; page.on('download', () => { count++; });
  await pauseAfterCrypto(page);
  await selectChildProfile(page, 'lia');
  await releaseAndExpectCancellation(page, () => count);
});
test('trocar de cuidador e voltar não revalida a preparação antiga', async ({ page }) => {
  let count = 0; page.on('download', () => { count++; });
  await pauseAfterCrypto(page);
  await selectCaregiver(page, 'cg-ana-unlinked');
  await selectCaregiver(page, 'cg-helena');
  await releaseAndExpectCancellation(page, () => count);
});
test('mudança dos registros invalida o pacote mesmo mantendo perfil e cuidador', async ({ page }) => {
  let count = 0; page.on('download', () => { count++; });
  await pauseAfterCrypto(page);
  // Exercita os handlers reais da UI enquanto a cifra aguarda, sem escrever no store.
  await page.getByRole('button', { name: 'Opções do Protótipo' }).dispatchEvent('click');
  await page.getByRole('menuitem', { name: 'Simular Estado Vazio' }).dispatchEvent('click');
  await expect(page.locator('main article')).toHaveCount(0);
  await releaseAndExpectCancellation(page, () => count);
});
test('uma preparação expirada não pode liberar o arquivo', async ({ page }) => {
  let count = 0; page.on('download', () => { count++; });
  await pauseAfterCrypto(page);
  await page.evaluate(() => {
    const originalNow = Date.now.bind(Date);
    Date.now = () => originalNow() + 31000;
  });
  await releaseAndExpectCancellation(page, () => count);
});
test('falha na cifra limpa as senhas e libera a trava para nova tentativa', async ({ page }) => {
  await page.evaluate(() => {
    const original = SubtleCrypto.prototype.encrypt;
    let fail = true;
    SubtleCrypto.prototype.encrypt = async function (...args: Parameters<SubtleCrypto['encrypt']>) {
      if (fail) { fail = false; throw new Error('Falha sintética de cifra para regressão'); }
      return original.apply(this, args);
    };
  });
  await openExporter(page);
  await fillAndSubmit(page);
  await expect(page.getByText('Falha sintética de cifra para regressão', { exact: true })).toBeVisible();
  await expect(page.locator('#vault-password')).toHaveValue('');
  await expect(page.locator('#vault-password-confirm')).toHaveValue('');
  const pending = page.waitForEvent('download');
  await fillAndSubmit(page);
  const download = await pending;
  await download.delete();
});
