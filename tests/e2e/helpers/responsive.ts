import { Page, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

export const UX_REAL_02_SCREENSHOT_DIR = path.resolve(
  process.cwd(),
  'artifacts/ux-real-02/screenshots'
);

export function ensureScreenshotDir(dirPath: string = UX_REAL_02_SCREENSHOT_DIR): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

export interface OverflowCheckResult {
  viewportWidth: number;
  docScrollWidth: number;
  docClientWidth: number;
  headerScrollWidth: number;
  headerClientWidth: number;
  mainScrollWidth: number;
  mainClientWidth: number;
}

/**
 * Verifica ausência de overflow horizontal não intencional no documento, header e main.
 */
export async function expectNoHorizontalOverflow(
  page: Page,
  contextLabel: string
): Promise<OverflowCheckResult> {
  const metrics = await page.evaluate(() => {
    const docEl = document.documentElement;
    const header = document.querySelector('header');
    const main = document.querySelector('main');

    return {
      viewportWidth: window.innerWidth,
      docScrollWidth: docEl.scrollWidth,
      docClientWidth: docEl.clientWidth,
      headerScrollWidth: header ? header.scrollWidth : 0,
      headerClientWidth: header ? header.clientWidth : 0,
      mainScrollWidth: main ? main.scrollWidth : 0,
      mainClientWidth: main ? main.clientWidth : 0,
    };
  });

  expect(
    metrics.docScrollWidth,
    `Overflow horizontal em documentElement (${contextLabel}): scrollWidth=${metrics.docScrollWidth} > clientWidth=${metrics.docClientWidth}`
  ).toBeLessThanOrEqual(metrics.docClientWidth);

  expect(
    metrics.headerScrollWidth,
    `Overflow horizontal em <header> (${contextLabel}): scrollWidth=${metrics.headerScrollWidth} > clientWidth=${metrics.headerClientWidth}`
  ).toBeLessThanOrEqual(metrics.headerClientWidth);

  expect(
    metrics.mainScrollWidth,
    `Overflow horizontal em <main> (${contextLabel}): scrollWidth=${metrics.mainScrollWidth} > clientWidth=${metrics.mainClientWidth}`
  ).toBeLessThanOrEqual(metrics.mainClientWidth);

  return metrics;
}

export async function captureFullPageArtifact(
  page: Page,
  fileName: string,
  dirPath: string = UX_REAL_02_SCREENSHOT_DIR
): Promise<string> {
  ensureScreenshotDir(dirPath);
  const fullPath = path.join(dirPath, fileName);
  await page.screenshot({ path: fullPath, fullPage: true });
  expect(fs.existsSync(fullPath)).toBe(true);
  return fullPath;
}
