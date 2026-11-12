import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = path.resolve(process.cwd(), 'artifacts/ux-real-01/screenshots');

const VIEWPORTS = [
  { name: '360x800-mobile-small', width: 360, height: 800, scenario: 'Mobile pequeno' },
  { name: '390x844-mobile-medium', width: 390, height: 844, scenario: 'Mobile médio' },
  { name: '768x1024-tablet-portrait', width: 768, height: 1024, scenario: 'Tablet retrato' },
  { name: '1024x768-tablet-landscape', width: 1024, height: 768, scenario: 'Tablet paisagem' },
  { name: '1280x800-desktop-standard', width: 1280, height: 800, scenario: 'Desktop padrão' },
  { name: '1536x864-desktop-wide', width: 1536, height: 864, scenario: 'Desktop amplo' },
] as const;

test.beforeAll(() => {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
});

test.describe('Fase B: Responsividade Real nos 6 Viewports Obrigatórios', () => {
  for (const vp of VIEWPORTS) {
    test(`Viewport ${vp.width}×${vp.height} (${vp.scenario}) — integridade visual, sem overflow e sem colisão`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Aguardar carregamento de fontes e estabilização visual
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('#home-hero-heading')).toBeVisible();

      // 1. Verificar ausência de overflow horizontal no documento e contêineres principais
      const overflowReport = await page.evaluate(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const header = document.querySelector('header');
        const main = document.querySelector('main');

        return {
          viewportWidth: window.innerWidth,
          docScrollWidth: docEl.scrollWidth,
          docClientWidth: docEl.clientWidth,
          bodyScrollWidth: body.scrollWidth,
          headerScrollWidth: header ? header.scrollWidth : 0,
          headerClientWidth: header ? header.clientWidth : 0,
          mainScrollWidth: main ? main.scrollWidth : 0,
          mainClientWidth: main ? main.clientWidth : 0,
        };
      });

      expect(
        overflowReport.docScrollWidth,
        `Overflow horizontal no documentElement em ${vp.width}x${vp.height}`
      ).toBeLessThanOrEqual(overflowReport.docClientWidth);
      expect(
        overflowReport.headerScrollWidth,
        `Overflow horizontal no <header> em ${vp.width}x${vp.height}`
      ).toBeLessThanOrEqual(overflowReport.headerClientWidth);
      expect(
        overflowReport.mainScrollWidth,
        `Overflow horizontal no <main> em ${vp.width}x${vp.height}`
      ).toBeLessThanOrEqual(overflowReport.mainClientWidth);

      // 2. Verificar integridade visual do BrandLogo e do slogan
      const logoButton = page.getByRole('button', {
        name: /Mundelo.*Compreender é o primeiro cuidado/i,
      });
      await expect(logoButton).toBeVisible();

      const logoSvg = logoButton.locator('svg');
      await expect(logoSvg).toBeVisible();
      const svgBox = await logoSvg.boundingBox();
      expect(svgBox).not.toBeNull();
      expect(svgBox!.width).toBeGreaterThanOrEqual(20);
      expect(svgBox!.height).toBeGreaterThanOrEqual(20);

      const sloganEl = logoButton.getByText('Compreender é o primeiro cuidado.');
      await expect(sloganEl).toBeVisible();
      const sloganBox = await sloganEl.boundingBox();
      expect(sloganBox).not.toBeNull();
      expect(sloganBox!.x).toBeGreaterThanOrEqual(0);
      expect(sloganBox!.x + sloganBox!.width).toBeLessThanOrEqual(vp.width);

      // 3. Verificar ausência de colisão geométrica entre BrandLogo, seletores e CTA
      const ctaButton = page.locator('header').getByRole('button', { name: 'Nova Observação' });
      await expect(ctaButton).toBeVisible();
      const profileSelect = page.locator('#profile-select');
      await expect(profileSelect).toBeVisible();

      const ctaBox = await ctaButton.boundingBox();
      const selectBox = await profileSelect.boundingBox();
      const logoBox = await logoButton.boundingBox();
      expect(ctaBox).not.toBeNull();
      expect(selectBox).not.toBeNull();
      expect(logoBox).not.toBeNull();

      const boxesOverlap = (
        a: { x: number; y: number; width: number; height: number },
        b: { x: number; y: number; width: number; height: number }
      ) => {
        return !(
          a.x + a.width <= b.x + 1 ||
          b.x + b.width <= a.x + 1 ||
          a.y + a.height <= b.y + 1 ||
          b.y + b.height <= a.y + 1
        );
      };

      expect(boxesOverlap(logoBox!, ctaBox!)).toBe(false);
      expect(boxesOverlap(selectBox!, ctaBox!)).toBe(false);

      // 4. Verificar layout dos cards de Ações Rápidas (4 cards) e Indicadores (3 cards)
      const quickActionsSection = page.locator('section[aria-labelledby="quick-actions-heading"]');
      const quickActionCards = quickActionsSection.locator('button');
      await expect(quickActionCards).toHaveCount(4);

      if (vp.width >= 1024) {
        // Em lg/xl, os 4 cards ficam na mesma linha e devem ter exatamente a mesma altura
        const boxes = await Promise.all([
          quickActionCards.nth(0).boundingBox(),
          quickActionCards.nth(1).boundingBox(),
          quickActionCards.nth(2).boundingBox(),
          quickActionCards.nth(3).boundingBox(),
        ]);
        for (const b of boxes) {
          expect(b).not.toBeNull();
          expect(Math.abs(b!.height - boxes[0]!.height)).toBeLessThanOrEqual(2);
          expect(Math.abs(b!.y - boxes[0]!.y)).toBeLessThanOrEqual(2);
        }
      }

      // 5. Verificar visibilidade correta de Navegação Desktop vs BottomNav Mobile
      const bottomNav = page.getByRole('navigation', { name: 'Navegação móvel inferior' });
      const desktopNav = page.getByRole('navigation', { name: 'Navegação principal' });

      if (vp.width < 768) {
        await expect(bottomNav).toBeVisible();
        await expect(desktopNav).toBeHidden();
      } else {
        await expect(desktopNav).toBeVisible();
        await expect(bottomNav).toBeHidden();

        // Todas as 7 abas de navegação principal devem estar alinhadas na mesma linha horizontal
        const navButtons = desktopNav.locator('button');
        await expect(navButtons).toHaveCount(7);
        const firstNavBox = await navButtons.first().boundingBox();
        const lastNavBox = await navButtons.last().boundingBox();
        expect(firstNavBox).not.toBeNull();
        expect(lastNavBox).not.toBeNull();
        expect(Math.abs(firstNavBox!.y - lastNavBox!.y)).toBeLessThanOrEqual(4);
      }

      if (vp.width >= 1024) {
        // A partir de 1024px, BrandLogo e o botão CTA "Nova Observação" ficam na mesma linha horizontal
        expect(Math.abs(logoBox!.y - ctaBox!.y)).toBeLessThanOrEqual(16);
      }

      // 6. Capturar screenshot de página completa (apenas dados sintéticos)
      const screenshotPath = path.join(ARTIFACT_DIR, `${vp.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      expect(fs.existsSync(screenshotPath)).toBe(true);
    });
  }

  test('Reflow WCAG 1.4.10: Zoom 200% (640×400) e Zoom 400% (320×200 / 320×640) + estresse de texto longo no BrandLogo', async ({
    page,
  }) => {
    // 1. Equivalente CSS de Zoom 200% sobre 1280×800 -> 640×400
    await page.setViewportSize({ width: 640, height: 400 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    const overflow200 = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow200.scrollWidth).toBeLessThanOrEqual(overflow200.clientWidth);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'zoom-200-reflow-640x400.png'),
      fullPage: true,
    });

    // 2. Equivalente CSS de Zoom 400% sobre 1280×800 -> 320px de largura CSS
    await page.setViewportSize({ width: 320, height: 640 });
    await page.evaluate(() => document.fonts.ready);

    const overflow400 = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(
      overflow400.scrollWidth,
      'Overflow horizontal detectado em largura de 320px (Reflow 400%)'
    ).toBeLessThanOrEqual(overflow400.clientWidth);

    // 3. Simular texto ampliado / tradução mais extensa no slogan do BrandLogo em 320px
    await page.evaluate(() => {
      const spans = Array.from(document.querySelectorAll('header span'));
      const sloganSpan = spans.find((s) =>
        s.textContent?.includes('Compreender é o primeiro cuidado.')
      );
      if (sloganSpan) {
        sloganSpan.textContent =
          'Compreender é o primeiro cuidado essencial em cada vínculo.';
      }
    });

    const overflowTranslated = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      headerScrollWidth: document.querySelector('header')?.scrollWidth ?? 0,
      headerClientWidth: document.querySelector('header')?.clientWidth ?? 0,
    }));

    expect(
      overflowTranslated.scrollWidth,
      'BrandLogo causou overflow horizontal com texto ampliado/traduzido em 320px'
    ).toBeLessThanOrEqual(overflowTranslated.clientWidth);
    expect(overflowTranslated.headerScrollWidth).toBeLessThanOrEqual(
      overflowTranslated.headerClientWidth
    );

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'zoom-400-reflow-320x640.png'),
      fullPage: true,
    });
  });

  test('Estado Vazio e Conteúdo Expandido: responsividade sem quebra de layout', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    // Abrir menu Opções do Protótipo e ativar Estado Vazio
    await page.getByRole('button', { name: /Opções do protótipo/i }).click();
    await page.getByRole('menuitem', { name: /Simular Estado Vazio/i }).click();

    await expect(
      page.getByRole('heading', { name: /Nenhuma observação registrada no momento/i })
    ).toBeVisible();

    const emptyOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(emptyOverflow.scrollWidth).toBeLessThanOrEqual(emptyOverflow.clientWidth);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'state-empty-360x800.png'),
      fullPage: true,
    });

    // Restaurar dados de exemplo
    await page.getByRole('button', { name: /Restaurar Dados de Exemplo/i }).click();
    await expect(page.locator('article').first()).toBeVisible();
  });
});
