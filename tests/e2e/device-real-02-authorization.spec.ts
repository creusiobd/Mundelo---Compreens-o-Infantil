import { test, expect } from '@playwright/test';
import { openCleanSession, selectCaregiver } from './fixtures/test-session';

test.describe('DEVICE-REAL-02 | DR02-TB-01B authorization regression', () => {
  test('unlinked caregiver cannot open or create an observation from Header, Home or Journal', async ({ page }) => {
    await openCleanSession(page, { width: 1280, height: 800 });
    await selectCaregiver(page, 'cg-ana-unlinked');

    await expect(page.locator('aside[aria-live="polite"]')).toContainText(/Sem vínculo com Tomás/i);
    const headerButton = page.locator('header').getByRole('button', { name: 'Nova Observação' });
    await expect(headerButton).toBeDisabled();
    await expect(page.locator('main').getByRole('button', { name: /Nova Observação/i }).first()).toBeDisabled();

    await page.locator('main').getByRole('button', { name: /Diário de Observações|Ir para o Diário|Diário/i }).first().click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    // Observe the real result from an authorized caregiver to detect a cross-role write.
    await selectCaregiver(page, 'cg-helena');
    await expect(page.locator('main')).not.toContainText('TESTE-ANA-001');
  });

  test('caregiver status blocks Header action in a tablet-sized viewport', async ({ page }) => {
    await openCleanSession(page, { width: 1280, height: 800 });
    await selectCaregiver(page, 'cg-ana-unlinked');

    await expect(page.locator('header').getByRole('button', { name: 'Nova Observação' })).toBeDisabled();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator('header').getByRole('button', { name: 'Nova Observação' })).toBeDisabled();
  });

  test('authorized observation still succeeds and is visible in journal', async ({ page }) => {
    await openCleanSession(page, { width: 1280, height: 800 });
    await page.locator('header').getByRole('button', { name: 'Nova Observação' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.locator('#obs-desc').fill('TESTE-HELENA-REGRESSION');
    await dialog.getByRole('button', { name: /Salvar no Diário/i }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('aside[aria-live="polite"]')).toContainText(/Observação canônica registrada/i);
  });
});
