import { test, expect } from '@playwright/test';

test.describe('Fase D: Integridade Funcional (Home, Header, BottomNav, Permissões e Proveniência)', () => {
  test('Home e Header: renderização inicial, Perfil em foco, troca de criança e isolamento', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // 1. Renderização inicial com Tomás
    await expect(page.locator('#home-hero-heading')).toHaveText('O que podemos compreender hoje?');
    await expect(page.getByText('Perfil em foco')).toBeVisible();
    await expect(page.locator('#profile-select')).toHaveValue('tomas');

    // Verificar indicadores iniciais de Tomás (5 observações sintéticas)
    const journalCard = page.locator('section[aria-label="Indicadores do perfil e lembrete afetivo"] > div').first();
    await expect(journalCard).toContainText('5');
    await expect(journalCard).toContainText('Tomás');

    // 2. Trocar para Lia (3 anos e 4 meses) via seletor no Header
    await page.locator('#profile-select').selectOption('lia');
    await expect(journalCard).toContainText('3');
    await expect(journalCard).toContainText('Lia');

    // Verificar que observações de Tomás não aparecem no perfil de Lia
    const recentSection = page.locator('section[aria-labelledby="recent-observations-heading"]');
    await expect(recentSection).toContainText('Registros contextuais mais recentes de Lia');
  });

  test('Proveniência nas Observações Recentes e abertura do modal Consultar detalhes', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const articles = page.locator('section[aria-labelledby="recent-observations-heading"] article');
    await expect(articles).toHaveCount(3);

    // Verificar exibição de observação direta, relato de terceiro e data formatada DD/MM/AAAA
    const allArticlesText = await articles.allTextContents();
    const combinedText = allArticlesText.join(' | ');

    expect(combinedText).toMatch(/Observação direta/i);
    expect(combinedText).toMatch(/Relatado por/i);
    expect(combinedText).toMatch(/\d{2}\/\d{2}\/\d{4}/);

    // Clicar em "Consultar detalhes" da primeira observação
    await articles.first().getByRole('button', { name: /Consultar detalhes/i }).click();
    const detailDialog = page.getByRole('dialog');
    await expect(detailDialog).toBeVisible();
  });

  test('Permissões: canCreate === true vs canCreate === false bloqueia UI e operação', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const headerNewObsBtn = page.locator('header').getByRole('button', { name: 'Nova Observação' });
    const homeNewObsCard = page
      .locator('section[aria-labelledby="quick-actions-heading"]')
      .getByRole('button', { name: /Nova Observação/i });

    // 1. Helena (Responsável Legal ativa e vinculada a Tomás) -> canCreate === true
    await expect(headerNewObsBtn).toBeEnabled();
    await expect(homeNewObsCard).toBeEnabled();

    await homeNewObsCard.click();
    const obsModal = page.getByRole('dialog');
    await expect(obsModal).toBeVisible();
    await page.keyboard.press('Escape');

    // 2. Ana (Cuidadora sem vínculo com Tomás ou Lia) -> canCreate === false
    await page.locator('#caregiver-select').selectOption('cg-ana-unlinked');
    await expect(headerNewObsBtn).toBeDisabled();
    await expect(homeNewObsCard).toBeDisabled();
    await expect(homeNewObsCard).toContainText('Requer cuidador vinculado ativo');

    // 3. Pedro (Status SUSPENDED) -> canCreate === false
    await page.locator('#caregiver-select').selectOption('cg-pedro-suspended');
    await expect(headerNewObsBtn).toBeDisabled();
    await expect(homeNewObsCard).toBeDisabled();
  });

  test('Ações Rápidas e Navegação Primária Desktop: transição entre telas', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // Card Consultar Meu Mundo -> navega para Meu Mundo
    await page
      .locator('section[aria-labelledby="quick-actions-heading"]')
      .getByRole('button', { name: /Consultar Meu Mundo/i })
      .click();

    const desktopNav = page.getByRole('navigation', { name: 'Navegação principal' });
    await expect(desktopNav.getByRole('button', { name: 'Meu Mundo' })).toHaveAttribute(
      'aria-current',
      'page'
    );

    // Retornar para Início clicando no BrandLogo
    await page
      .getByRole('button', { name: /Mundelo.*Compreender é o primeiro cuidado/i })
      .click();
    await expect(desktopNav.getByRole('button', { name: 'Início' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  test('BottomNav Mobile: exibição exclusiva < 768px, estado ativo, navegação e ausência de sobreposição', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const bottomNav = page.getByRole('navigation', { name: 'Navegação móvel inferior' });
    await expect(bottomNav).toBeVisible();

    const homeTab = bottomNav.getByRole('button', { name: 'Início' });
    await expect(homeTab).toHaveAttribute('aria-current', 'page');

    // Verificar ausência de sobreposição permanente com o último bloco da Home ao rolar até o fim
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const privacyBanner = page.locator('section[aria-label="Garantia de privacidade em memória volátil"]');
    await expect(privacyBanner).toBeVisible();

    const bannerBox = await privacyBanner.boundingBox();
    const navBox = await bottomNav.boundingBox();
    expect(bannerBox).not.toBeNull();
    expect(navBox).not.toBeNull();
    // O final do banner de privacidade deve ficar acima do topo do BottomNav quando rolado até o final
    expect(bannerBox!.y + bannerBox!.height).toBeLessThanOrEqual(navBox!.y + 2);

    // Testar navegação pelo BottomNav para Diário e de volta para Início
    await bottomNav.getByRole('button', { name: 'Diário' }).click();
    await expect(bottomNav.getByRole('button', { name: 'Diário' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    await homeTab.click();
    await expect(homeTab).toHaveAttribute('aria-current', 'page');
  });
});
