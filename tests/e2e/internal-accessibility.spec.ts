import { test, expect } from '@playwright/test';
import { INTERNAL_SCREENS } from './fixtures/synthetic-data';
import {
  openCleanSession,
  selectCaregiver,
  triggerEmptyStateViaHeader,
  restoreSyntheticDataViaHeader,
} from './fixtures/test-session';
import { navigateToInternalScreen } from './helpers/navigation';
import { expectZeroAxeViolations } from './helpers/accessibility';

test.describe('Gate UX-REAL-02 (Fase 2.4): Acessibilidade Automatizada e Teclado nas 6 Telas Internas', () => {
  for (const screen of INTERNAL_SCREENS) {
    test(`Varredura axe-core WCAG 2.2 AA na tela [${screen.navLabel}] (Desktop 1280×800 e Mobile 360×800 — Estado Padrão)`, async ({
      page,
    }) => {
      await openCleanSession(page, { width: 1280, height: 800 });
      await navigateToInternalScreen(page, screen.id);
      await expectZeroAxeViolations(page, `${screen.navLabel} Desktop 1280×800`);

      await page.setViewportSize({ width: 360, height: 800 });
      await expectZeroAxeViolations(page, `${screen.navLabel} Mobile 360×800`);
    });
  }

  test('Varredura axe-core nas 6 telas internas sob Estado Vazio e sob Controles Desabilitados (Cuidador sem vínculo)', async ({
    page,
  }) => {
    await openCleanSession(page, { width: 1280, height: 800 });

    // 1. Ativar Estado Vazio e verificar Diário, Compreender e Relatório
    await triggerEmptyStateViaHeader(page);
    for (const screenId of ['journal', 'understand', 'report'] as const) {
      await navigateToInternalScreen(page, screenId);
      await expectZeroAxeViolations(page, `Tela ${screenId} em Estado Vazio`);
    }

    // Restaurar dados e selecionar cuidador sem vínculo (controles desabilitados)
    await restoreSyntheticDataViaHeader(page);
    await selectCaregiver(page, 'cg-ana-unlinked');

    for (const screenId of ['journal', 'world', 'discoveries', 'report', 'privacy'] as const) {
      await navigateToInternalScreen(page, screenId);
      await expectZeroAxeViolations(page, `Tela ${screenId} com Cuidador Sem Vínculo`);
    }
  });

  test('Varredura axe-core em Modais e Formulários (Modal Nova Observação com erro de validação e Modal Cofre Local)', async ({
    page,
  }) => {
    await openCleanSession(page, { width: 1280, height: 800 });
    await navigateToInternalScreen(page, 'journal');

    // 1. Abrir modal de Nova Observação e submeter vazio para acionar mensagem de validação
    await page
      .locator('main#main-content')
      .getByRole('button', { name: 'Nova Observação' })
      .click();
    const obsDialog = page.getByRole('dialog');
    await expect(obsDialog).toBeVisible();
    await expectZeroAxeViolations(page, 'Modal Nova Observação — Aba Fatos');

    // Alternar para aba Hipóteses via teclado (ArrowRight) e verificar axe-core
    const tabFatos = obsDialog.getByRole('tab', { name: /Fatos/i });
    await tabFatos.focus();
    await page.keyboard.press('ArrowRight');
    const tabHipoteses = obsDialog.getByRole('tab', { name: /Hipóteses/i });
    await expect(tabHipoteses).toHaveAttribute('aria-selected', 'true');
    await expectZeroAxeViolations(page, 'Modal Nova Observação — Aba Hipóteses');

    // Fechar modal Nova Observação e testar Modal de Exportação do Cofre na tela Privacidade
    await obsDialog.getByRole('button', { name: 'Cancelar' }).click();
    await navigateToInternalScreen(page, 'privacy');

    await page.getByRole('button', { name: /Exportar Cofre/i }).click();
    const vaultDialog = page.getByRole('dialog');
    await expect(vaultDialog).toBeVisible();
    await expectZeroAxeViolations(page, 'Modal Exportar Cofre Local (.mundelo-vault)');
  });
});
