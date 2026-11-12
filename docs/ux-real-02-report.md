# Relatório de Homologação Funcional, Responsiva e Acessível — Gate UX-REAL-02

**Data de Execução:** 2026-11-12  
**Versão Avaliada:** MUNDELO v1.1 — Telas Internas (`Diário`, `Meu Mundo`, `Descobertas`, `Compreender`, `Relatório`, `Privacidade`) e Modais (`ObservationModal`, `ObservationDetailModal`)  
**Ambiente de Automação:** Playwright `1.58.2` + `@axe-core/playwright` `4.11.2` + Chromium Headless (`1247`) em Linux (`x64`)

---

## 1. Resumo Executivo e Decisão do Gate

- **Status do Gate UX-REAL-02:** **`PASS`** *(Homologação Funcional, Responsiva, Cognitiva e de Acessibilidade Automatizada das 6 Telas Internas)*
- **Evidências Objetivas:**
  - **6 Telas Internas × 7 Viewports (`360×800`, `390×844`, `768×1024`, `1024×768`, `1280×800`, `1536×864` e `320×640`):** **42 capturas reais** geradas em `artifacts/ux-real-02/screenshots/` com zero overflow horizontal (`scrollWidth <= clientWidth`), zero sobreposição destrutiva e preservação completa da navegação contextual.
  - **Acessibilidade Automatizada (`axe-core` WCAG 2.0/2.1/2.2 A e AA):** **0 violações** (`critical: 0`, `serious: 0`, `moderate: 0`, `minor: 0`) nas 6 telas internas e nos modais de criação e detalhamento de observações.
  - **Fluxos Funcionais Reais (`internal-navigation.spec.ts`):** Criação, busca, filtro, detalhamento e edição de observações com incremento de revisão (`Rev #1` → `Rev #2`), adição e remoção de singularidades/estratégias em `Meu Mundo`, filtragem de `Descobertas` com pré-preenchimento de observação, seleção/desmarcação no `Relatório` e isolamento estrito entre crianças (`Tomás` vs `Sofia` vs `Mateus`).
  - **Políticas de Autorização e Menor Privilégio (`internal-permissions.spec.ts`):** Bloqueio consistente de controles de escrita quando o cuidador ativo não possui vínculo com a criança (`Ana`) e aplicação granular da regra `canDeleteObservation` para o papel `EDUCATOR` (`Prof. Marina`).

---

## 2. Arquitetura de Testes E2E Criada (Fase 2.1)

| Arquivo | Responsabilidade |
|---|---|
| `tests/e2e/fixtures/synthetic-data.ts` | Constantes e metadados das 6 telas internas (`INTERNAL_SCREENS`), perfis infantis sintéticos (`Tomás`, `Sofia`, `Mateus`) e cuidadores simulados (`Helena`, `Prof. Marina`, `Ana`). |
| `tests/e2e/fixtures/test-session.ts` | Inicialização de sessão limpa em memória volátil (`openCleanSession`), troca determinística de criança (`selectChildProfile`) e troca de cuidador (`selectCaregiver`). |
| `tests/e2e/helpers/accessibility.ts` | Varredura `axe-core` com tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` e verificação programática de nomes acessíveis vs texto visível (WCAG 2.5.3). |
| `tests/e2e/helpers/responsive.ts` | Matriz dos 7 viewports (`VIEWPORTS_INTERNAL`), verificação de ausência de overflow horizontal em `documentElement`, `body` e `main#main-content`, e geometria sem colisão de botões. |
| `tests/e2e/helpers/navigation.ts` | Navegação determinística para qualquer tela interna adaptada ao breakpoint (`nav[aria-label="Navegação principal"]` em `>= 768px`, `BottomNav` para `journal`/`world`/`discoveries`/`understand` em `< 768px` e menu drawer móvel para `report`/`privacy` em `< 768px`). |

---

## 3. Matriz de Responsividade nas 6 Telas Internas × 7 Viewports (`tests/e2e/internal-responsive.spec.ts`)

| Tela Interna (`ScreenId`) | `360×800` | `390×844` | `768×1024` | `1024×768` | `1280×800` | `1536×864` | `320×640` (Reflow) | Capturas em `artifacts/ux-real-02/screenshots/` |
|---|---|---|---|---|---|---|---|---|
| **Diário (`journal`)** | PASS | PASS | PASS | PASS | PASS | PASS | PASS | `journal-*.png` (7 arquivos) |
| **Meu Mundo (`world`)** | PASS | PASS | PASS | PASS | PASS | PASS | PASS | `world-*.png` (7 arquivos) |
| **Descobertas (`discoveries`)** | PASS | PASS | PASS | PASS | PASS | PASS | PASS | `discoveries-*.png` (7 arquivos) |
| **Compreender (`understand`)** | PASS | PASS | PASS | PASS | PASS | PASS | PASS | `understand-*.png` (7 arquivos) |
| **Relatório (`report`)** | PASS | PASS | PASS | PASS | PASS | PASS | PASS | `report-*.png` (7 arquivos) |
| **Privacidade (`privacy`)** | PASS | PASS | PASS | PASS | PASS | PASS | PASS | `privacy-*.png` (7 arquivos) |

---

## 4. Defeitos Identificados e Corrigidos na Fase 4

| ID | Severidade | Tela / Componente | Descrição do Defeito | Correção Aplicada | Status |
|---|---|---|---|---|---|
| `UX-REAL-02-DEF-01` | **P1 (Alta)** | `JournalScreen`, `MyWorldScreen`, `DiscoveriesScreen`, `UnderstandScreen`, `ReportScreen`, `PrivacyScreen`, `ObservationModal`, `ObservationDetailModal` | Violações `color-contrast` (`serious` no `axe-core`) em textos secundários com baixa opacidade (`text-[#133E43]/60`, `/70`, `/50`) e rótulos em tons pastéis (`text-[#CFA5A0]` e `text-[#80C5B5]`) sobre fundo claro (`1.98:1` a `3.62:1`, abaixo do mínimo `4.5:1` da WCAG 1.4.3 AA). | Substituídos por tokens sólidos do Design System v1.0: `text-[#265358]` (`6.9:1` a `7.8:1`), `text-[#8C4F48]` (`6.1:1`) e `text-[#133E43]` (`11.4:1`). | **CORRIGIDO E VERIFICADO** |
| `UX-REAL-02-DEF-02` | **P1 (Alta)** | `MyWorldScreen.tsx`, `JournalScreen.tsx` | 8 campos `<input type="text">` em `Meu Mundo` e 1 campo de busca no `Diário` dependiam exclusivamente de `placeholder`, sem `aria-label` programático (WCAG 1.3.1 / 4.1.2). | Adicionados atributos `aria-label` descritivos a todos os 9 campos de entrada de texto. | **CORRIGIDO E VERIFICADO** |
| `UX-REAL-02-DEF-03` | **P1 (Alta)** | `JournalScreen.tsx`, `MyWorldScreen.tsx`, `DiscoveriesScreen.tsx` | Quando um cuidador sem vínculo ativo (`Ana`) estava selecionado (`!canCreate`), o botão de estado vazio do `Diário`, os controles de adição/remoção em `Meu Mundo` e o botão de registro em `Descobertas` permaneciam habilitados na UI. | Aplicado `disabled={!canCreate}` e estilos visuais de bloqueio coerentes com o contrato de autorização em todos os controles de escrita das três telas. | **CORRIGIDO E VERIFICADO** |
| `UX-REAL-02-DEF-06` | **P2 (Média)** | `ObservationDetailModal.tsx` | Violação `scrollable-region-focusable` (`serious` no `axe-core`) no container de rolagem `.overflow-y-auto` em viewports compactos (`390×844`). | Adicionado `tabIndex={0}`, `role="region"` e `aria-label="Conteúdo detalhado da observação"` com anel de foco visível. | **CORRIGIDO E VERIFICADO** |
| `UX-REAL-02-DEF-07` | **P2 (Média)** | `MyWorldScreen.tsx` | Overflow horizontal de `24px` (`scrollWidth = 344 > 320`) no viewport de reflow extremo `320×640` causado pela largura mínima intrínseca (`size="20"`) dos 5 inputs `flex-1`. | Adicionada a classe `min-w-0` aos 5 inputs `flex-1` em `MyWorldScreen.tsx`, eliminando 100% do overflow em `320×640`. | **CORRIGIDO E VERIFICADO** |
