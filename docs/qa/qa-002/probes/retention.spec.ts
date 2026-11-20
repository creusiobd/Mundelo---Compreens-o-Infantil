import { test, expect, Page, TestInfo } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { openCleanSession, selectCaregiver } from '../../../../tests/e2e/fixtures/test-session';
import { navigateToInternalScreen } from '../../../../tests/e2e/helpers/navigation';

async function evidence(info: TestInfo, data: object) {
  await info.attach('observacao-sintetica', { body: Buffer.from(JSON.stringify(data, null, 2)), contentType: 'application/json' });
}
test.beforeEach(async ({ page }) => {
  // Evita chamadas a serviços externos; o caminho local e a Web Crypto continuam reais.
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    return ['127.0.0.1', 'localhost'].includes(url.hostname) ? route.continue() : route.abort();
  });
  await openCleanSession(page);
  await navigateToInternalScreen(page, 'journal');
});
async function exportStart(page: Page) {
  await page.getByTitle('Exportar cofre criptografado (.mundelo-vault)', { exact: true }).click();
  await page.locator('#vault-password').fill('QA-only-2026-laboratorio');
  await page.locator('#vault-password-confirm').fill('QA-only-2026-laboratorio');
}
test('CTRL-01: exportação autorizada do exemplo usa cifra real', async ({ page }, info) => {
  await exportStart(page);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Cifrar e Baixar Cofre', exact: true }).click();
  const download = await pending;
  const path = await download.path();
  const envelope = JSON.parse(await readFile(path!, 'utf-8'));
  const observed = { format: envelope.format, hasCiphertext: typeof envelope.ciphertext === 'string' && envelope.ciphertext.length > 0,
    algorithm: envelope.crypto.algorithm, recordCount: envelope.recordCount, syntheticExampleOnly: true };
  await evidence(info, observed);
  expect(observed.format).toBe('MUNDELO_VAULT');
  expect(observed.hasCiphertext).toBe(true);
  expect(observed.algorithm).toBe('AES-GCM');
  await download.delete();
});
test('P01: detalhe aberto deixa de revelar observação após perda de acesso demonstrativa', async ({ page }, info) => {
  await page.getByRole('button', { name: 'Ver análise completa', exact: true }).first().click();
  const region = page.getByRole('region', { name: 'Conteúdo detalhado da observação' });
  const before = await region.textContent();
  await expect(region).toBeVisible();
  await selectCaregiver(page, 'cg-ana-unlinked');
  await expect(page.getByLabel('Selecionar cuidador ativo simulado')).toHaveValue('cg-ana-unlinked');
  await expect(page.locator('main article')).toHaveCount(0);
  const stillVisible = await region.isVisible();
  const contentPreserved = stillVisible && (await region.textContent()) === before;
  await evidence(info, { caregiver: 'cg-ana-unlinked', listCount: 0, detailStillVisible: stillVisible, sameDetailContent: contentPreserved });
  expect(contentPreserved, 'A lista foi restringida, mas o conteúdo do detalhe não pode permanecer visível').toBe(false);
});
test('P02: perda de acesso antes da liberação impede download preparado', async ({ page }, info) => {
  await page.evaluate(() => {
    const state = window as any;
    const original = SubtleCrypto.prototype.encrypt;
    state.__qaEncryptReached = false;
    SubtleCrypto.prototype.encrypt = async function (...args: Parameters<SubtleCrypto['encrypt']>) {
      const result = await original.apply(this, args);
      state.__qaEncryptReached = true;
      await new Promise<void>(resolve => { state.__qaReleaseEncrypt = resolve; });
      return result;
    };
  });
  await exportStart(page);
  let downloads = 0;
  page.on('download', () => { downloads += 1; });
  await page.getByRole('button', { name: 'Cifrar e Baixar Cofre', exact: true }).click();
  await page.waitForFunction(() => (window as any).__qaEncryptReached === true);
  // Altera o contexto pelo seletor real, sem modificar o store ou simular autorização.
  await selectCaregiver(page, 'cg-ana-unlinked');
  await expect(page.getByLabel('Selecionar cuidador ativo simulado')).toHaveValue('cg-ana-unlinked');
  await expect(page.getByText('Acesso Negado: Cuidador Não Autorizado', { exact: true })).toBeVisible();
  await page.evaluate(() => (window as any).__qaReleaseEncrypt());
  // Esperar a conclusão da UI, não um atraso arbitrário.
  await expect(page.getByRole('button', { name: 'Derivando Chave (600k iterações)...', exact: true })).toHaveCount(0);
  await evidence(info, { preparationReachedRealCrypto: true, actorChangedBeforeRelease: true, denialVisibleBeforeRelease: true, downloadsAfterRelease: downloads });
  expect(downloads, 'Contexto sem acesso antes da liberação não pode baixar pacote anterior').toBe(0);
});
test('P03: envelope acessível sem senha não expõe nome/id do perfil', async ({ page }, info) => {
  await exportStart(page);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Cifrar e Baixar Cofre', exact: true }).click();
  const download = await pending;
  const envelope = JSON.parse(await readFile((await download.path())!, 'utf-8'));
  const observed = { plaintextChildName: typeof envelope.childName === 'string' && envelope.childName.length > 0,
    plaintextChildId: typeof envelope.childId === 'string' && envelope.childId.length > 0,
    plaintextRecordCount: typeof envelope.recordCount === 'number', parsedWithoutPassword: true };
  await evidence(info, observed);
  await download.delete();
  expect(observed.plaintextChildName || observed.plaintextChildId, 'A cifra do payload não protege estes campos públicos do envelope').toBe(false);
});
test('P04: perfil não aparece no relatório após perda de acesso demonstrativa', async ({ page }, info) => {
  await navigateToInternalScreen(page, 'report');
  const marker = 'Naninha de malha macia azul claro';
  await expect(page.locator('main')).toContainText(marker);
  await selectCaregiver(page, 'cg-ana-unlinked');
  await expect(page.getByLabel('Selecionar cuidador ativo simulado')).toHaveValue('cg-ana-unlinked');
  const exposed = (await page.locator('main').innerText()).includes(marker);
  await evidence(info, { caregiver: 'cg-ana-unlinked', profileComfortMarkerVisible: exposed, syntheticMarkerOnly: true });
  expect(exposed, 'Restringir observações não pode deixar o perfil acessível no relatório').toBe(false);
});
