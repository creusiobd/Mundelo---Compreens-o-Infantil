import {test, expect, type Page} from '@playwright/test';
import {openCleanSession, selectCaregiver, selectChildProfile} from './fixtures/test-session';
import {navigateToInternalScreen} from './helpers/navigation';
import {expectZeroAxeViolations} from './helpers/accessibility';

const main = (page: Page) => page.locator('main#main-content');
async function noIdentity(page: Page) {
  // textContent includes native select options and off-screen DOM, not only visible text.
  await expect(page.locator('body')).not.toContainText('Tomás');
  await expect(page.locator('body')).not.toContainText('Lia');
  await expect(page.locator('body')).not.toContainText('2 anos e 8 meses');
  await expect(page.locator('body')).not.toContainText('4 anos e 1 mês');
}
test.beforeEach(async ({page}) => {
  await page.route('**/*', route => ['127.0.0.1','localhost'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
});
for (const actor of ['cg-ana-unlinked','cg-pedro-suspended']) {
  test('N01: superfícies restritas retiram identidade, contagens e falso vazio — '+actor, async ({page}) => {
    await openCleanSession(page);
    await selectCaregiver(page,actor);
    await noIdentity(page);
    await page.getByRole('button',{name:'Opções do Protótipo',exact:true}).click();
    const menu=page.getByRole('menu');
    await expect(menu).toContainText('leitura indisponível');
    await expect(menu).not.toContainText('reg.)');
    await expect(menu.getByRole('menuitem',{name:/Ajustar Perfil/})).toBeDisabled();
    await noIdentity(page);
    await menu.getByRole('menuitem',{name:'Manifesto & Limites Éticos',exact:false}).click();
    await expect(main(page).getByRole('button',{name:'Explorar Início',exact:true})).toBeVisible();
    await noIdentity(page);
    for (const screen of ['journal','discoveries','understand','privacy'] as const) {
      await navigateToInternalScreen(page,screen);
      await noIdentity(page);
      if (screen==='journal') {
        await expect(main(page)).toContainText('Isso não informa se o acervo está vazio');
        await expect(main(page)).not.toContainText('Nenhuma observação encontrada');
      }
      if (screen==='understand') {
        await expect(main(page)).toContainText('As contagens não podem ser consultadas');
        await expect(main(page)).not.toContainText('0 registros');
      }
      if (screen==='privacy') {
        await expect(main(page)).toContainText('contagem indisponíveis');
        await expect(main(page).getByRole('button',{name:'Zerar Memória',exact:true})).toBeDisabled();
      }
      await page.emulateMedia({media:'print'});
      await noIdentity(page);
      await page.emulateMedia({media:'screen'});
    }
    await page.setViewportSize({width:360,height:800});
    await page.getByRole('button',{name:'Abrir menu de navegação',exact:true}).click();
    await noIdentity(page);
    await expect(page.getByRole('button',{name:'Ajustar Perfil Configurar',exact:true})).toBeDisabled();
  });
  test('N01: exportador aberto retira resumo imediatamente após perda de leitura — '+actor, async ({page}) => {
    await openCleanSession(page);
    await navigateToInternalScreen(page,'privacy');
    await main(page).getByRole('button',{name:'Exportar Cofre (.mundelo-vault)',exact:true}).click();
    const dialog=page.getByRole('dialog');
    await expect(dialog).toContainText('Tomás');
    await expect(dialog).toContainText('5 registros sintéticos');
    await selectCaregiver(page,actor);
    await expect(dialog).toContainText('Leitura do perfil indisponível');
    await expect(dialog).toContainText('Contagem indisponível');
    await expect(dialog).not.toContainText('0 registros');
    await expect(dialog.getByRole('button',{name:'Cifrar e Baixar Cofre',exact:true})).toBeDisabled();
    await noIdentity(page);
    await page.emulateMedia({media:'print'});
    await noIdentity(page);
    await page.emulateMedia({media:'screen'});
    await selectCaregiver(page,'cg-helena');
    await expect(dialog).toContainText('Tomás');
    await expect(dialog).toContainText('5 registros sintéticos');
  });
}
test('N01: opções usam a leitura de cada perfil e preservam troca e retorno legítimos', async ({page}) => {
  await openCleanSession(page);
  await expect(page.locator('#profile-select option[value="lia"]')).toContainText('Lia');
  await selectCaregiver(page,'cg-marina');
  await expect(page.locator('#profile-select option[value="tomas"]')).toContainText('Tomás');
  await expect(page.locator('#profile-select option[value="lia"]')).toHaveText('Perfil 2 — acesso restrito');
  await selectChildProfile(page,'lia');
  await expect(page.locator('aside[aria-live="polite"]')).toContainText('Acesso restrito');
  await expect(page.locator('aside[aria-live="polite"]')).not.toContainText('Lia');
  await navigateToInternalScreen(page,'journal');
  await expect(main(page)).not.toContainText('Lia');
  await expect(main(page)).toContainText('Isso não informa se o acervo está vazio');
  await selectChildProfile(page,'tomas');
  await expect(main(page).getByRole('heading',{level:1})).toHaveText('Diário de Observações: Tomás');
  await expect(main(page)).toContainText('5 observações de Tomás');
  await expect(main(page).getByRole('button',{name:'Nova Observação',exact:true})).toBeEnabled();
});
test('N01: suspensão com vínculo não revela identidade ao trocar perfil', async ({page}) => {
  await openCleanSession(page);
  await selectCaregiver(page,'cg-pedro-suspended');
  for (const child of ['lia','tomas'] as const) {
    await selectChildProfile(page,child);
    await expect(page.locator('aside[aria-live="polite"]')).toContainText('Acesso restrito');
    await noIdentity(page);
  }
  await selectCaregiver(page,'cg-helena');
  await expect(page.locator('#profile-select option[value="tomas"]')).toContainText('Tomás');
  await expect(main(page)).toContainText('Tomás');
});
test('N01: formulário e busca são descartados na troca de contexto', async ({page}) => {
  await openCleanSession(page);
  await page.locator('header').getByRole('button',{name:'Nova Observação',exact:true}).click();
  const dialog=page.getByRole('dialog');
  await dialog.locator('#obs-desc').fill('RASCUNHO-N01-CONTEXTO');
  await selectCaregiver(page,'cg-ana-unlinked');
  await expect(dialog).toHaveCount(0);
  await noIdentity(page);
  await selectCaregiver(page,'cg-helena');
  await expect(dialog).toHaveCount(0);
  await page.locator('header').getByRole('button',{name:'Nova Observação',exact:true}).click();
  await expect(dialog.locator('#obs-desc')).toHaveValue('');
  await selectChildProfile(page,'lia');
  await expect(dialog).toHaveCount(0);
  await navigateToInternalScreen(page,'journal');
  await main(page).getByRole('textbox',{name:'Buscar observações por palavras-chave',exact:true}).fill('Lia RASCUNHO-N01');
  await selectCaregiver(page,'cg-ana-unlinked');
  await expect(main(page).getByRole('textbox')).toHaveCount(0);
  await selectCaregiver(page,'cg-helena');
  await expect(main(page).getByRole('textbox',{name:'Buscar observações por palavras-chave',exact:true})).toHaveValue('');
});
test('N01: estados restritos e exportador preservam acessibilidade desktop e mobile', async ({page}) => {
  await openCleanSession(page);
  await selectCaregiver(page,'cg-ana-unlinked');
  for (const width of [1280,360]) {
    await page.setViewportSize({width,height:800});
    for (const screen of ['journal','understand','privacy'] as const) {
      await navigateToInternalScreen(page,screen);
      await expectZeroAxeViolations(page,'N01 '+screen+' '+width);
    }
    await main(page).getByRole('button',{name:'Exportar Cofre (.mundelo-vault)',exact:true}).click();
    await expectZeroAxeViolations(page,'N01 exportador '+width);
    await noIdentity(page);
    await page.getByRole('button',{name:'Fechar exportador de cofre',exact:true}).click();
  }
});
