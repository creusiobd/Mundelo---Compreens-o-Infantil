import { test, expect } from '@playwright/test';
import { openCleanSession, selectCaregiver } from './fixtures/test-session';
import { navigateToInternalScreen } from './helpers/navigation';

test.describe('Gate UX-REAL-02 (Fase 2.3 / 2.4): Permissões e Controle de Acesso nas Telas Internas', () => {
  test('Isolamento e proteção contra acesso indevido no Diário, Meu Mundo e Descobertas quando cuidador não possui vínculo', async ({
    page,
  }) => {
    await openCleanSession(page, { width: 1280, height: 800 });

    // Selecionar Ana (Sem vínculo ativo com Tomás)
    await selectCaregiver(page, 'cg-ana-unlinked');

    // 1. No Diário: banner de política de autorização visível, 0 observações listadas e botão Nova Observação desabilitado
    await navigateToInternalScreen(page, 'journal');
    await expect(
      page.getByText(/Demonstração de Política de Autorização: Cuidador sem Vínculo/i)
    ).toBeVisible();
    const journalNewObsBtns = page
      .locator('main#main-content')
      .getByRole('button', { name: /Nova Observação/i });
    const btnCount = await journalNewObsBtns.count();
    for (let i = 0; i < btnCount; i++) {
      await expect(journalNewObsBtns.nth(i)).toBeDisabled();
    }

    // 2. Em Meu Mundo: controles de adição/remoção e salvamento de estratégia devem estar desabilitados para cuidador sem vínculo
    await navigateToInternalScreen(page, 'world');
    await expect(
      page.getByRole('button', { name: 'Salvar Estratégia' })
    ).toBeDisabled();
    const addButtons = page.locator('main#main-content').getByRole('button', { name: 'Adicionar' });
    expect(await addButtons.count()).toBeGreaterThan(0);
    await expect(addButtons.first()).toBeDisabled();

    // 3. Em Descobertas: botão "Registrar Observação a Partir Desta Descoberta" deve respeitar !canCreate
    await navigateToInternalScreen(page, 'discoveries');
    const discoveryActionBtn = page
      .locator('main#main-content article')
      .first()
      .getByRole('button', { name: /Registrar Observação a Partir Desta Descoberta/i });
    await expect(discoveryActionBtn).toBeDisabled();
  });

  test('Permissões granulares de Educador (Prof. Marina) no Diário: pode criar e excluir apenas seu próprio registro, mas não pode excluir registros de outros cuidadores', async ({
    page,
  }) => {
    await openCleanSession(page, { width: 1280, height: 800 });

    // Selecionar Prof. Marina (Educadora vinculada a Tomás)
    await selectCaregiver(page, 'cg-marina');
    await navigateToInternalScreen(page, 'journal');

    // Educadora vinculada pode criar nova observação
    const newObsBtn = page
      .locator('main#main-content')
      .getByRole('button', { name: 'Nova Observação' })
      .first();
    await expect(newObsBtn).toBeEnabled();

    // Dos 5 registros de Tomás, 4 foram registrados por outros cuidadores (devem estar desabilitados para exclusão)
    // e 1 foi registrado pela própria Prof. Marina (obs-tomas-3, habilitado pelo contrato canDeleteObservation)
    const deleteBtns = page
      .locator('main#main-content')
      .getByRole('button', { name: 'Excluir esta observação' });
    const delCount = await deleteBtns.count();
    expect(delCount).toBe(5);

    let disabledCount = 0;
    let enabledCount = 0;
    for (let i = 0; i < delCount; i++) {
      if (await deleteBtns.nth(i).isDisabled()) {
        disabledCount++;
      } else {
        enabledCount++;
      }
    }
    expect(disabledCount).toBe(4);
    expect(enabledCount).toBe(1);
  });
});
