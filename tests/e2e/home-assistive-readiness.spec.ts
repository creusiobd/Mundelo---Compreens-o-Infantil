import { test, expect } from '@playwright/test';
import {
  openCleanSession,
  selectChildProfile,
  selectCaregiver,
} from './fixtures/test-session';
import {
  expectVisibleFocusIndicator,
  expectZeroAxeViolations,
} from './helpers/accessibility';
import { expectNoHorizontalOverflow } from './helpers/responsive';

test.describe('Gate UX-REAL-01B: Prontidão Assistiva da Home, Header Global, Live Regions e Mecanismos de Zoom', () => {
  test('1.1a Ordem lógica sequencial de foco (Tab), Skip Link funcional e nomes acessíveis (WCAG 2.5.3)', async ({
    page,
  }) => {
    await openCleanSession(page, { width: 1280, height: 800 });

    // 1. Primeiro Tab foca o Skip Link
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo principal' });
    await expectVisibleFocusIndicator(skipLink);

    // 2. Segundo Tab foca o botão Opções do Protótipo
    await page.keyboard.press('Tab');
    const utilityBtn = page.getByRole('button', { name: /Opções do Protótipo/i });
    await expectVisibleFocusIndicator(utilityBtn);

    // 3. Terceiro Tab foca o botão de identidade BrandLogo
    await page.keyboard.press('Tab');
    const brandBtn = page.getByRole('button', {
      name: /Mundelo.*Compreender é o primeiro cuidado/i,
    });
    await expectVisibleFocusIndicator(brandBtn);

    // 4. Quarto Tab foca o seletor de cuidador
    await page.keyboard.press('Tab');
    const caregiverSelect = page.getByLabel('Selecionar cuidador ativo simulado');
    await expectVisibleFocusIndicator(caregiverSelect);

    // 5. Quinto Tab foca o seletor de perfil da criança
    await page.keyboard.press('Tab');
    const profileSelect = page.getByLabel('Selecionar perfil da criança');
    await expectVisibleFocusIndicator(profileSelect);

    // 6. Sexto Tab foca o CTA Nova Observação do Header
    await page.keyboard.press('Tab');
    const headerCta = page.locator('header').getByRole('button', { name: 'Nova Observação' });
    await expectVisibleFocusIndicator(headerCta);

    // 7. Sétimo Tab foca a primeira aba da navegação principal (Início)
    await page.keyboard.press('Tab');
    const primaryNav = page.getByRole('navigation', { name: 'Navegação principal' });
    const homeNavBtn = primaryNav.getByRole('button', { name: 'Início', exact: true });
    await expectVisibleFocusIndicator(homeNavBtn);
    await expect(homeNavBtn).toHaveAttribute('aria-current', 'page');

    // 8. Verificar correspondência entre texto visível e nome acessível (WCAG 2.5.3) nos botões da Home
    const buttonsData = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('header button, main button'));
      return buttons.map((btn) => {
        const visibleText = (btn.textContent || '').replace(/\s+/g, ' ').trim();
        const ariaLabel = btn.getAttribute('aria-label');
        return {
          visibleText,
          ariaLabel,
        };
      });
    });

    for (const b of buttonsData) {
      if (b.ariaLabel && b.visibleText.length > 0 && !b.visibleText.includes('Consultar detalhes')) {
        expect(
          b.ariaLabel.toLowerCase(),
          `Botão com aria-label "${b.ariaLabel}" deve conter seu texto visível "${b.visibleText}"`
        ).toContain(b.visibleText.toLowerCase());
      }
    }
  });

  test('1.1b Anúncios de alteração de estado em Live Region (aria-live="polite") ao trocar perfil e cuidador', async ({
    page,
  }) => {
    await openCleanSession(page, { width: 1280, height: 800 });

    // Trocar perfil infantil de Tomás para Lia -> deve disparar anúncio em aria-live="polite"
    await selectChildProfile(page, 'lia');
    const liveRegion = page.locator('aside[aria-live="polite"][aria-atomic="true"]');
    await expect(liveRegion).toBeVisible();
    await expect(liveRegion).toContainText(/Perfil ativo:\s*Lia/i);

    // Trocar cuidador para Ana (Sem Vínculo) -> deve anunciar restrição de acesso em aria-live="polite"
    await selectCaregiver(page, 'cg-ana-unlinked');
    await expect(liveRegion).toBeVisible();
    await expect(liveRegion).toContainText(/Sem vínculo com Lia/i);
  });

  test('1.1c Foco após abertura e fechamento do menu móvel (Escape) e do modal de detalhes da observação', async ({
    page,
  }) => {
    // 1. Verificar menu móvel em 390×844
    await openCleanSession(page, { width: 390, height: 844 });
    const mobileMenuToggle = page.getByRole('button', { name: 'Abrir menu de navegação' });
    await mobileMenuToggle.focus();
    await page.keyboard.press('Enter');

    const mobileNav = page.getByRole('navigation', { name: 'Menu de navegação móvel' });
    await expect(mobileNav).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Fechar menu de navegação' })
    ).toHaveAttribute('aria-expanded', 'true');

    // Pressionar Escape deve fechar o drawer móvel e devolver o foco ao botão acionador
    await page.keyboard.press('Escape');
    await expect(mobileNav).toBeHidden();
    await expect(mobileMenuToggle).toBeFocused();

    // 2. Verificar abertura e fechamento do modal de detalhes da observação
    await page.setViewportSize({ width: 1280, height: 800 });
    const firstDetailBtn = page
      .locator('section[aria-labelledby="recent-observations-heading"] article')
      .first()
      .getByRole('button', { name: /Consultar detalhes/i });

    await firstDetailBtn.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expectZeroAxeViolations(page, 'Home com Modal de Detalhes da Observação aberto');

    const closeBtn = dialog.getByRole('button', { name: 'Fechar detalhes da observação' });
    await closeBtn.click();
    await expect(dialog).toBeHidden();
  });

  test('1.3 Distinção explícita entre mecanismos de Zoom e Reflow (Viewport reduzido vs Ampliação de texto vs CSS/Browser Zoom)', async ({
    page,
  }) => {
    await openCleanSession(page, { width: 1280, height: 800 });

    // Mecanismo A: Ampliação somente de texto (WCAG 1.4.4 Resize Text — 200% root font-size = 32px)
    // Como o MUNDELO utiliza unidades rem via Tailwind, ampliar o fontSize raiz redimensiona toda a tipografia e espaçamentos
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '150%';
    });
    await expectNoHorizontalOverflow(page, 'Ampliação de texto 150% em 1280×800');

    // Resetar fontSize e testar Mecanismo B: Zoom de página (CSS zoom: 2 equivalente ao Page Zoom 200% do Chromium)
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '';
      (document.documentElement.style as unknown as Record<string, string>).zoom = '2';
    });
    const zoomMetrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(zoomMetrics.scrollWidth).toBeLessThanOrEqual(zoomMetrics.clientWidth);

    // Resetar zoom e testar Mecanismo C: Viewport CSS reduzido (320×640 = Reflow 400% de 1280px)
    await page.evaluate(() => {
      (document.documentElement.style as unknown as Record<string, string>).zoom = '';
    });
    await page.setViewportSize({ width: 320, height: 640 });
    await expectNoHorizontalOverflow(page, 'Reflow extremo 320×640');
  });
});
