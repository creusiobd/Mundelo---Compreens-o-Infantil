import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Fase C: Acessibilidade Automatizada e Interativa (WCAG 2.2 AA)', () => {
  test('Varredura axe-core WCAG 2.2 AA na Home (Desktop 1280×800 e Mobile 360×800)', async ({
    page,
  }) => {
    for (const vp of [
      { width: 1280, height: 800 },
      { width: 360, height: 800 },
    ]) {
      await page.setViewportSize(vp);
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      expect(
        results.violations,
        `Violações axe-core em ${vp.width}x${vp.height}: ${JSON.stringify(
          results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }))
        )}`
      ).toEqual([]);
    }
  });

  test('Varredura axe-core com Menu Opções do Protótipo aberto e Estado Vazio ativo', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    // Abrir menu Opções do Protótipo
    const trigger = page.getByRole('button', { name: /Opções do protótipo/i });
    await trigger.click();
    await expect(page.getByRole('menu', { name: /Ações secundárias do protótipo/i })).toBeVisible();

    const menuResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(menuResults.violations).toEqual([]);

    // Simular estado vazio e rodar axe-core novamente
    await page.getByRole('menuitem', { name: /Simular Estado Vazio/i }).click();
    const emptyResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(emptyResults.violations).toEqual([]);
  });

  test('Estrutura de headings, landmarks, labels associados e estados desabilitados', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // Landmarks principais
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible();

    // Hierarquia de headings (1 único H1 seguido por H2 das seções)
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    await expect(page.locator('h1')).toHaveText('O que podemos compreender hoje?');

    const h2Texts = await page.locator('h2').allTextContents();
    expect(h2Texts).toContain('Ações Rápidas de Acolhimento');
    expect(h2Texts).toContain('Observações Recentes');

    // Associação explícita entre labels e selects
    const caregiverLabel = page.locator('label[for="caregiver-select"]');
    await expect(caregiverLabel).toHaveCount(1);
    const profileLabel = page.locator('label[for="profile-select"]');
    await expect(profileLabel).toHaveCount(1);

    // Verificar estado desabilitado quando cuidador suspenso ou sem vínculo é selecionado
    await page.locator('#caregiver-select').selectOption('cg-pedro-suspended'); // Suspenso
    const headerCta = page.locator('header').getByRole('button', { name: 'Nova Observação' });
    const quickActionCta = page
      .locator('section[aria-labelledby="quick-actions-heading"]')
      .getByRole('button', { name: /Nova Observação/i });

    await expect(headerCta).toBeDisabled();
    await expect(quickActionCta).toBeDisabled();
  });

  test('Navegação por teclado, foco visível, menu Opções do Protótipo, Escape e retorno de foco', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // 1. Pressionar Tab deve focar o Skip Link "Pular para o conteúdo principal"
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo principal' });
    await expect(skipLink).toBeFocused();

    // 2. Próximo Tab foca o botão Opções do Protótipo
    await page.keyboard.press('Tab');
    const utilityTrigger = page.getByRole('button', { name: /Opções do protótipo/i });
    await expect(utilityTrigger).toBeFocused();

    // Verificar indicador de foco visível (outline ou boxShadow/ring)
    const focusStyle = await utilityTrigger.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { outlineStyle: style.outlineStyle, boxShadow: style.boxShadow };
    });
    expect(
      focusStyle.outlineStyle !== 'none' || focusStyle.boxShadow !== 'none'
    ).toBe(true);

    // 3. Abrir menu pelo teclado (Enter), navegar internamente e fechar com Escape
    await page.keyboard.press('Enter');
    const menu = page.getByRole('menu', { name: /Ações secundárias do protótipo/i });
    await expect(menu).toBeVisible();
    await expect(utilityTrigger).toHaveAttribute('aria-expanded', 'true');

    // Tab para entrar no primeiro item do menu
    await page.keyboard.press('Tab');
    const firstMenuItem = menu.getByRole('menuitem').first();
    await expect(firstMenuItem).toBeFocused();

    // Pressionar Escape deve fechar o menu e retornar o foco para o botão acionador
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(utilityTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(utilityTrigger).toBeFocused();
  });

  test('Alvos de toque e preferência por movimento reduzido (prefers-reduced-motion)', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Verificar que prefers-reduced-motion reduz transitionDuration para ~0s
    const transitionDuration = await page
      .locator('section[aria-labelledby="quick-actions-heading"] button')
      .first()
      .evaluate((el) => window.getComputedStyle(el).transitionDuration);
    expect(['0s', '0.00001s', '1e-05s']).toContain(transitionDuration);

    // Verificar altura mínima de toque (>= 24px pelo WCAG 2.5.8 AA e >= 44px nos controles principais)
    const primaryControls = [
      page.locator('#profile-select'),
      page.locator('header').getByRole('button', { name: 'Nova Observação' }),
      page.getByRole('button', { name: /Abrir menu de navegação/i }),
      page.locator('section[aria-labelledby="quick-actions-heading"] button').first(),
    ];

    for (const ctrl of primaryControls) {
      const box = await ctrl.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.width).toBeGreaterThanOrEqual(44);
    }
  });
});
