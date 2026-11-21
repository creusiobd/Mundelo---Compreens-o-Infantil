import {test, expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {openCleanSession, selectCaregiver, selectChildProfile} from './fixtures/test-session';
import {navigateToInternalScreen} from './helpers/navigation';

const regionName = 'Conteúdo detalhado da observação';
const comfortMarker = 'Naninha de malha macia azul claro';
test.beforeEach(async ({page}) => {
  await page.route('**/*', route => ['127.0.0.1','localhost'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  await openCleanSession(page);
});

for (const actor of ['cg-ana-unlinked', 'cg-pedro-suspended']) {
  test(`QA-F01: detalhe aberto perde conteúdo e não reaparece ao voltar de ${actor}`, async ({page}) => {
    await navigateToInternalScreen(page, 'journal');
    await page.getByRole('button', {name:'Ver análise completa',exact:true}).first().click();
    const region = page.getByRole('region', {name:regionName});
    await expect(region).toBeVisible();
    const content = await region.innerText();
    expect(content.length).toBeGreaterThan(50);
    await selectCaregiver(page, actor);
    await expect(region).toHaveCount(0);
    await selectCaregiver(page, 'cg-helena');
    await expect(region).toHaveCount(0);
    await page.getByRole('button', {name:'Ver análise completa',exact:true}).first().click();
    await expect(region).toContainText(content.slice(0,50));
  });

  test(`QA-F04: relatório, cópia e impressão são restringidos para ${actor}`, async ({page}) => {
    await navigateToInternalScreen(page, 'report');
    await expect(page.locator('main')).toContainText(comfortMarker);
    await page.evaluate(() => {
      (window as any).__copies = [];
      (window as any).__prints = 0;
      Object.defineProperty(navigator, 'clipboard', {configurable:true,value:{writeText:async (text:string) => {(window as any).__copies.push(text);}}});
      window.print = () => {(window as any).__prints++};
    });
    await page.getByRole('button', {name:'Copiar Síntese',exact:true}).click();
    await page.getByRole('button', {name:'Imprimir / Gerar PDF',exact:true}).click();
    expect(await page.evaluate(() => (window as any).__copies[0])).toContain(comfortMarker);
    expect(await page.evaluate(() => (window as any).__prints)).toBe(1);
    await selectCaregiver(page, actor);
    await expect(page.getByRole('heading', {name:'Relatório indisponível'})).toBeVisible();
    await expect(page.locator('main')).not.toContainText(comfortMarker);
    await expect(page.getByRole('button', {name:'Copiar Síntese',exact:true})).toHaveCount(0);
    await expect(page.getByRole('button', {name:'Imprimir / Gerar PDF',exact:true})).toHaveCount(0);
    await page.emulateMedia({media:'print'});
    await expect(page.locator('main')).not.toContainText(comfortMarker);
    expect(await page.evaluate(() => (window as any).__copies.length)).toBe(1);
    expect(await page.evaluate(() => (window as any).__prints)).toBe(1);
    await page.emulateMedia({media:'screen'});
    await selectCaregiver(page, 'cg-helena');
    await expect(page.locator('main')).toContainText(comfortMarker);
  });
}

test('QA-F01: mudar de criança remove detalhe e não revive a seleção anterior', async ({page}) => {
  await navigateToInternalScreen(page, 'journal');
  await page.getByRole('button', {name:'Ver análise completa',exact:true}).first().click();
  await expect(page.getByRole('region', {name:regionName})).toBeVisible();
  await selectChildProfile(page, 'lia');
  await expect(page.getByRole('region', {name:regionName})).toHaveCount(0);
  await selectChildProfile(page, 'tomas');
  await expect(page.getByRole('region', {name:regionName})).toHaveCount(0);
});

test('QA-F03: exporta v2 sem identidade no JSON/AAD/nome e reimporta legitimamente', async ({page}) => {
  await navigateToInternalScreen(page, 'journal');
  await page.getByTitle('Exportar cofre criptografado (.mundelo-vault)',{exact:true}).click();
  await page.locator('#vault-password').fill('QA-only-private-vault-2026');
  await page.locator('#vault-password-confirm').fill('QA-only-private-vault-2026');
  const pending = page.waitForEvent('download');
  await page.getByRole('button',{name:'Cifrar e Baixar Cofre',exact:true}).click();
  const download = await pending;
  const bytes = await readFile((await download.path())!);
  const envelope = JSON.parse(bytes.toString('utf8'));
  expect(envelope.formatVersion).toBe(2);
  expect(Object.keys(envelope).sort()).toEqual(['ciphertext','crypto','format','formatVersion']);
  expect(Buffer.from(envelope.crypto.aad,'base64').toString()).toBe('MUNDELO_VAULT:2');
  expect(download.suggestedFilename()).toMatch(/^mundelo-[0-9a-f-]{36}\.mundelo-vault$/);
  await page.getByTitle('Importar cofre criptografado (.mundelo-vault)',{exact:true}).click();
  await page.locator('input[type=file]').setInputFiles({name:download.suggestedFilename(),mimeType:'application/json',buffer:bytes});
  await expect(page.getByText('Conteúdo ainda não autenticado',{exact:false})).toBeVisible();
  await page.locator('#import-password').fill('QA-only-private-vault-2026');
  await page.getByRole('button',{name:'Desbloquear e Inspecionar',exact:true}).click();
  await expect(page.getByRole('button',{name:/Confirmar e Aplicar na Memória/})).toBeVisible();
  await page.getByRole('button',{name:/Confirmar e Aplicar na Memória/}).click();
  await expect(page.locator('#import-password')).toHaveCount(0);
  await download.delete();
});

test('QA-F03: cofre legado continua importável e prévia some na perda de acesso', async ({page}) => {
  await navigateToInternalScreen(page, 'journal');
  await page.getByTitle('Importar cofre criptografado (.mundelo-vault)',{exact:true}).click();
  await page.locator('input[type=file]').setInputFiles('tests/fixtures/vault-v1-synthetic.json');
  await page.locator('#import-password').fill('Legacy-Synthetic-2026');
  await page.getByRole('button',{name:'Desbloquear e Inspecionar',exact:true}).click();
  await expect(page.getByRole('button',{name:/Confirmar e Aplicar na Memória/})).toBeVisible();
  await selectCaregiver(page, 'cg-ana-unlinked');
  await expect(page.getByRole('button',{name:/Confirmar e Aplicar na Memória/})).toHaveCount(0);
  await expect(page.getByRole('alert')).toContainText('Acesso ao conteúdo indisponível');
});
