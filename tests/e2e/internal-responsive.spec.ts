import { test, expect } from '@playwright/test';
import {
  INTERNAL_SCREENS,
  REQUIRED_VIEWPORTS,
} from './fixtures/synthetic-data';
import { openCleanSession } from './fixtures/test-session';
import { navigateToInternalScreen } from './helpers/navigation';
import {
  captureFullPageArtifact,
  ensureScreenshotDir,
  expectNoHorizontalOverflow,
} from './helpers/responsive';

test.beforeAll(() => {
  ensureScreenshotDir();
});

test.describe('Gate UX-REAL-02 (Fase 2.2): Matriz de Responsividade nas 6 Telas Internas × 7 Viewports', () => {
  for (const screen of INTERNAL_SCREENS) {
    test(`Tela [${screen.navLabel}] (${screen.id}) — responsividade, sem overflow e integridade nos 7 viewports (360×800 a 1536×864 + 320×640)`, async ({
      page,
    }) => {
      await openCleanSession(page, { width: 1280, height: 800 });
      await navigateToInternalScreen(page, screen.id);

      for (const vp of REQUIRED_VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.evaluate(() => document.fonts.ready);

        const h1 = page.locator('main#main-content h1').first();
        await expect(h1).toBeVisible();
        await expect(h1).toHaveText(screen.expectedHeadingRegex);

        // 1. Verificar ausência de overflow horizontal no documento, header e main
        await expectNoHorizontalOverflow(
          page,
          `Tela ${screen.navLabel} em ${vp.width}×${vp.height} (${vp.scenario})`
        );

        // 2. Verificar que o título H1 está inteiramente contido dentro da largura do viewport
        const h1Box = await h1.boundingBox();
        expect(h1Box).not.toBeNull();
        expect(h1Box!.x).toBeGreaterThanOrEqual(0);
        expect(h1Box!.x + h1Box!.width).toBeLessThanOrEqual(vp.width + 1);

        // 3. Verificar visibilidade correta de Navegação Principal vs BottomNav
        const bottomNav = page.getByRole('navigation', { name: 'Navegação móvel inferior' });
        const desktopNav = page.getByRole('navigation', { name: 'Navegação principal' });
        if (vp.width < 768) {
          await expect(bottomNav).toBeVisible();
          await expect(desktopNav).toBeHidden();
        } else {
          await expect(desktopNav).toBeVisible();
          await expect(bottomNav).toBeHidden();
        }

        // 4. Capturar screenshot reproduzível em artifacts/ux-real-02/screenshots/
        await captureFullPageArtifact(page, `${screen.id}-${vp.name}.png`);
      }
    });
  }
});
