import { Page, expect } from '@playwright/test';

export interface SessionInitOptions {
  width?: number;
  height?: number;
  childId?: 'tomas' | 'lia';
  caregiverId?: string;
}

/**
 * Inicializa uma sessão limpa e determinística no navegador real,
 * aguardando o carregamento das fontes e a renderização inicial.
 */
export async function openCleanSession(
  page: Page,
  options: SessionInitOptions = {}
): Promise<void> {
  const width = options.width ?? 1280;
  const height = options.height ?? 800;

  await page.setViewportSize({ width, height });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('main#main-content')).toBeVisible();

  if (options.childId && options.childId !== 'tomas') {
    await selectChildProfile(page, options.childId);
  }

  if (options.caregiverId && options.caregiverId !== 'cg-helena') {
    await selectCaregiver(page, options.caregiverId);
  }
}

export async function selectChildProfile(page: Page, childId: 'tomas' | 'lia'): Promise<void> {
  const select = page.getByLabel('Selecionar perfil da criança');
  await select.selectOption(childId);
}

export async function selectCaregiver(page: Page, caregiverId: string): Promise<void> {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 640) {
    // Em viewports < 640px (sm), o seletor de cuidador reside no drawer mobile
    const menuBtn = page.getByRole('button', {
      name: /Abrir menu de navegação|Fechar menu de navegação/i,
    });
    const isExpanded = await menuBtn.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await menuBtn.click();
    }
    const mobileCaregiverSelect = page.getByLabel('Cuidador Ativo Simulado');
    await mobileCaregiverSelect.selectOption(caregiverId);
    await menuBtn.click();
  } else {
    const desktopCaregiverSelect = page.getByLabel('Selecionar cuidador ativo simulado');
    await desktopCaregiverSelect.selectOption(caregiverId);
  }
}

export async function triggerEmptyStateViaHeader(page: Page): Promise<void> {
  const utilityBtn = page.getByRole('button', { name: /Opções do Protótipo/i });
  await utilityBtn.click();
  const emptyItem = page.getByRole('menuitem', { name: /Simular Estado Vazio/i });
  await emptyItem.click();
}

export async function restoreSyntheticDataViaHeader(page: Page): Promise<void> {
  const utilityBtn = page.getByRole('button', { name: /Opções do Protótipo/i });
  await utilityBtn.click();
  const restoreItem = page.getByRole('menuitem', { name: /Restaurar Dados de Exemplo/i });
  await restoreItem.click();
}
