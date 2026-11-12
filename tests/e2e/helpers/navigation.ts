import { Page, expect } from '@playwright/test';
import { INTERNAL_SCREENS, InternalScreenId } from '../fixtures/synthetic-data';

/**
 * Navega para uma das 6 telas internas do MUNDELO usando controles reais de UI
 * (barra de navegação principal em >= 768px; BottomNav ou menu móvel em < 768px)
 * e confirma o carregamento pelo heading principal (H1) e estado aria-current="page".
 */
export async function navigateToInternalScreen(
  page: Page,
  screenId: InternalScreenId
): Promise<void> {
  const descriptor = INTERNAL_SCREENS.find((s) => s.id === screenId);
  if (!descriptor) {
    throw new Error(`Tela interna desconhecida: ${screenId}`);
  }

  const vp = page.viewportSize() ?? { width: 1280, height: 800 };

  if (vp.width >= 768) {
    const primaryNav = page.getByRole('navigation', { name: 'Navegação principal' });
    const navBtn = primaryNav.getByRole('button', { name: descriptor.navLabel, exact: true });
    await navBtn.click();
    await expect(navBtn).toHaveAttribute('aria-current', 'page');
  } else if (descriptor.inBottomNav) {
    const bottomNav = page.getByRole('navigation', { name: 'Navegação móvel inferior' });
    const tabBtn = bottomNav.getByRole('button', { name: descriptor.navLabel, exact: true });
    await tabBtn.click();
    await expect(tabBtn).toHaveAttribute('aria-current', 'page');
  } else {
    // Telas 'report' (Relatório) e 'privacy' (Privacidade) em viewports < 768px são acessadas pelo drawer móvel
    const menuToggle = page.getByRole('button', {
      name: /Abrir menu de navegação|Fechar menu de navegação/i,
    });
    await menuToggle.click();
    const mobileNav = page.getByRole('navigation', { name: 'Menu de navegação móvel' });
    const mobileBtn = mobileNav.getByRole('button', { name: descriptor.navLabel, exact: true });
    await mobileBtn.click();
  }

  const h1 = page.locator('main#main-content h1').first();
  await expect(h1).toBeVisible();
  await expect(h1).toHaveText(descriptor.expectedHeadingRegex);
}
