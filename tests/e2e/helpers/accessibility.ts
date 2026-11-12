import { Page, Locator, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export const WCAG_22_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/**
 * Executa varredura automatizada axe-core com tags WCAG 2.2 AA e falha com relatório detalhado se houver violações.
 */
export async function expectZeroAxeViolations(
  page: Page,
  contextDescription: string
): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_22_AA_TAGS).analyze();

  const summary = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.map((n) => ({
      html: n.html.slice(0, 140),
      target: n.target,
      failureSummary: n.failureSummary,
    })),
  }));

  expect(
    results.violations,
    `Violações axe-core detectadas em [${contextDescription}]: ${JSON.stringify(summary, null, 2)}`
  ).toEqual([]);
}

/**
 * Verifica que o elemento focado possui indicador visual perceptível (outline ou boxShadow).
 */
export async function expectVisibleFocusIndicator(locator: Locator): Promise<void> {
  await expect(locator).toBeFocused();
  const focusMetrics = await locator.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      outlineStyle: s.outlineStyle,
      outlineWidth: s.outlineWidth,
      boxShadow: s.boxShadow,
    };
  });

  const hasOutline =
    focusMetrics.outlineStyle !== 'none' && parseFloat(focusMetrics.outlineWidth) > 0;
  const hasRing = focusMetrics.boxShadow !== 'none' && focusMetrics.boxShadow !== '';

  expect(
    hasOutline || hasRing,
    `Elemento focado sem indicador visual perceptível: ${JSON.stringify(focusMetrics)}`
  ).toBe(true);
}
