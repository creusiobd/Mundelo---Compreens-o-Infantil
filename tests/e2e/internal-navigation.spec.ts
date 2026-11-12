import { test, expect } from '@playwright/test';
import { openCleanSession } from './fixtures/test-session';
import { navigateToInternalScreen } from './helpers/navigation';

test.describe('Gate UX-REAL-02 (Fase 2.3): Matriz Funcional das 6 Telas Internas', () => {
  test('1. Diário: apresentação de registros, busca, filtro por tipo/ambiente, ordenação e estado vazio de busca', async ({
    page,
  }) => {
    await openCleanSession(page, { width: 1280, height: 800 });
    await navigateToInternalScreen(page, 'journal');

    const articles = page.locator('main#main-content article');
    await expect(articles).toHaveCount(5);

    // Filtrar por tipo "Conquistas"
    await page.getByRole('button', { name: 'Conquistas', exact: true }).click();
    const conquistaCount = await articles.count();
    expect(conquistaCount).toBeGreaterThan(0);
    expect(conquistaCount).toBeLessThan(5);

    // Voltar para "Todos os tipos" e testar busca sem resultados (estado vazio orientativo)
    await page.getByRole('button', { name: 'Todos os tipos', exact: true }).click();
    const searchInput = page.getByPlaceholder(/Buscar por palavras-chave/i);
    await searchInput.fill('termo-inexistente-xyz');
    await expect(
      page.getByRole('heading', { name: /Nenhuma observação encontrada para os filtros atuais/i })
    ).toBeVisible();

    // Clicar em "Limpar Filtros" restaura os 5 registros
    await page.getByRole('button', { name: 'Limpar Filtros' }).click();
    await expect(articles).toHaveCount(5);

    // Testar alternância de ordenação (Recentes <-> Antigas)
    const sortBtn = page.getByRole('button', { name: /Recentes|Antigas/i });
    const firstBefore = await articles.first().textContent();
    await sortBtn.click();
    const firstAfter = await articles.first().textContent();
    expect(firstAfter).not.toEqual(firstBefore);
  });

  test('2. Meu Mundo: exibição de perfil, abas temáticas e adição/remoção autorizada de interesses e estratégias', async ({
    page,
  }) => {
    await openCleanSession(page, { width: 1280, height: 800 });
    await navigateToInternalScreen(page, 'world');

    await expect(page.getByRole('heading', { name: 'Interesses & Fascínios' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Estratégias de Acolhimento Experimentadas' })
    ).toBeVisible();

    // Adicionar novo interesse sintético como Responsável Legal (Helena)
    const interestInput = page.getByPlaceholder(/Novo interesse/i);
    await interestInput.fill('Observar sombras na parede');
    await interestInput.press('Enter');
    await expect(page.getByText('Observar sombras na parede')).toBeVisible();

    // Remover o interesse recém-adicionado
    await page
      .getByRole('button', { name: 'Remover interesse Observar sombras na parede' })
      .click();
    await expect(page.getByText('Observar sombras na parede')).toBeHidden();
  });

  test('3. Descobertas & 4. Compreender: filtros de descobertas, pré-preenchimento de observação e painel não-diagnóstico', async ({
    page,
  }) => {
    await openCleanSession(page, { width: 1280, height: 800 });

    // Descobertas
    await navigateToInternalScreen(page, 'discoveries');
    const discoveryCards = page.locator('main#main-content article');
    const initialCount = await discoveryCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Verificar distinção explícita "O que Observar com Gentileza" e botão de iniciar observação
    await expect(page.getByText('O que Observar com Gentileza:').first()).toBeVisible();
    await discoveryCards
      .first()
      .getByRole('button', { name: /Registrar Observação a Partir Desta Descoberta/i })
      .click();

    const obsDialog = page.getByRole('dialog');
    await expect(obsDialog).toBeVisible();
    await obsDialog.getByRole('button', { name: 'Cancelar' }).click();

    // Compreender
    await navigateToInternalScreen(page, 'understand');
    await expect(
      page.getByRole('heading', {
        name: /Painel Demonstrativo Simulado — Sem IA Ativa e Sem Fins Diagnósticos/i,
      })
    ).toBeVisible();
    await expect(page.getByText('Ambientes mais Observados')).toBeVisible();
    await expect(page.getByText('Distribuição por Foco do Registro')).toBeVisible();
    await expect(
      page.getByText('Perguntas para Refletir em Família ou Levar à Consulta')
    ).toBeVisible();
  });

  test('5. Relatório & 6. Privacidade: seleção de registros, destinatário, avisos de volatilidade e cofre local', async ({
    page,
  }) => {
    await openCleanSession(page, { width: 1280, height: 800 });

    // Relatório
    await navigateToInternalScreen(page, 'report');
    await expect(page.getByText(/5 de 5 observações de Tomás selecionadas/i)).toBeVisible();

    // Alterar destinatário para Escola / Creche
    await page.locator('#recipient-select').selectOption('escola');
    await expect(
      page.getByText(/Documento de diálogo com Diálogo Pedagógico com Escola \/ Creche/i)
    ).toBeVisible();

    // Desmarcar todas -> estado vazio da prévia do relatório
    await page.getByRole('button', { name: 'Desmarcar todas' }).click();
    await expect(
      page.getByText(/Nenhuma observação selecionada para esta prévia/i)
    ).toBeVisible();

    // Selecionar todas novamente
    await page.getByRole('button', { name: 'Selecionar todas' }).click();
    await expect(page.getByText(/5 de 5 observações de Tomás selecionadas/i)).toBeVisible();

    // Privacidade
    await navigateToInternalScreen(page, 'privacy');
    await expect(
      page.getByRole('heading', { name: 'Arquitetura Atual: 100% em Memória Volátil' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Cofre Criptografado Local (.mundelo-vault)' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Quatro Compromissos Invioláveis do Mundelo' })
    ).toBeVisible();
  });
});
