# Relatório de Homologação Assistiva — Gate UX-REAL-01B

**Data de Execução:** 2026-11-12  
**Versão Avaliada:** MUNDELO v1.1 (Home v1.0 + Cabeçalho Global + Modal de Observação)  
**Ambiente de Automação:** Playwright `1.58.2` + `@axe-core/playwright` `4.11.2` + Chromium Headless (`1247`) em Linux (`x64`)

---

## 1. Resumo Executivo e Decisão do Gate

- **Status do Gate UX-REAL-01B:** **`CONDITIONAL`**
- **Justificativa Objetiva:**
  - **Camada Automatizada de Prontidão Assistiva (`tests/e2e/home-assistive-readiness.spec.ts`):** **100% APROVADA (PASS)** em navegador real Chromium. Foram validados programaticamente: ordem de foco, correspondência entre nome acessível e texto visível (WCAG 2.5.3), papéis e estados ARIA (`role="dialog"`, `role="tablist"`, `role="tab"`, `role="tabpanel"`, `role="menu"`, `aria-expanded`, `aria-selected`, `aria-current="page"`, `disabled`), navegação integral por teclado (`Tab`, `Shift+Tab`, `Enter`, `Escape`, `ArrowRight`, `ArrowLeft`, `Home`, `End`), funcionamento do Skip Link (`Pular para o conteúdo principal`), restauração de foco ao fechar menus (`Opções do Protótipo` e `Abrir menu de navegação`) com `Escape`, anúncios em regiões `aria-live="polite"` e resiliência sob ampliação real de fonte (`150%`), zoom de página e `deviceScaleFactor: 2`.
  - **Camada Assistiva Humana (`docs/ux-real-01b-assistive-manual.md`):** **`NOT_EXECUTED`**. Conforme as regras estritas de engenharia do projeto, a execução presencial com leitores de tela reais (**TalkBack + Chrome no Android**, **NVDA + navegador no Windows** e **VoiceOver + Safari no macOS/iOS**) não pode ser simulada em ambiente headless Linux. Os roteiros passo a passo foram documentados e permanecem pendentes de validação humana presencial antes da promoção de `CONDITIONAL` para `PASS`.

---

## 2. Distinção Metodológica: Viewport vs Ampliação de Fonte vs Zoom vs `deviceScaleFactor`

Na suíte `tests/e2e/home-assistive-readiness.spec.ts`, cada dimensão de escala visual foi testada e documentada separadamente para evitar falsos equivalentes:

| Mecanismo | O que altera tecnicamente | Critério WCAG Relacionado | Verificação Executada em `home-assistive-readiness.spec.ts` | Resultado |
|---|---|---|---|---|
| **Viewport Reduzida (`320×640`)** | Reduz a largura CSS disponível (`window.innerWidth = 320px`), acionando *media queries* mobile (`< sm` / `< md`) e empilhamento em coluna única. | WCAG 1.4.10 (*Reflow*) | Verificado em `home-responsive.spec.ts` e `internal-responsive.spec.ts` (`scrollWidth <= 320`). | **PASS** |
| **Ampliação de Fonte Raiz (`150%` / `24px`)** | Altera `document.documentElement.style.fontSize = '150%'`, escalando todas as unidades `rem` (`text-xs`, `text-sm`, `p-4`, `max-w-7xl`) sem alterar a largura da viewport em pixels (`1280×800`). | WCAG 1.4.4 (*Resize Text*) | Teste dedicado validando `computedFontSize === 24px`, ausência de `overflow` horizontal (`scrollWidth <= 1280`) e preservação de visibilidade dos CTAs. | **PASS** *(após correção `UX-REAL-02-DEF-05`)* |
| **Zoom de Navegador (`zoom: 1.5`)** | Escala proporcionalmente o layout completo renderizado pelo motor Blink. | WCAG 1.4.4 / 1.4.10 | Teste dedicado em `1280×800` verificando integridade dos marcos (`header`, `main`, `footer`) e ausência de sobreposição de controles. | **PASS** |
| **`deviceScaleFactor` (`DPR = 2`)** | Altera a razão entre pixels físicos do dispositivo e pixels CSS (`window.devicePixelRatio = 2`), aumentando a nitidez de rasterização sem alterar o fluxo de layout CSS. | Renderização HiDPI / Retina | Contexto dedicado criado com `browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })`, confirmando `window.devicePixelRatio === 2` e zero overflow horizontal. | **PASS** |

---

## 3. Cobertura de Testes Executados (`tests/e2e/home-assistive-readiness.spec.ts`)

1. **Ordem de foco, Skip Link e correspondência Nome Acessível vs Texto Visível (WCAG 2.4.1, 2.4.3, 2.5.3):**
   - Pressionar `Tab` no carregamento foca o link `Pular para o conteúdo principal`; pressionar `Enter` move o foco para `main#main-content`.
   - Todos os botões visíveis na Home e no Header possuem nome acessível que contém seu texto visível (zero violações de *Label in Name*).
2. **Restauração de foco ao fechar menus com `Escape` (Desktop e Mobile):**
   - Abrir `Opções do Protótipo` (`aria-expanded="true"`) e pressionar `Escape` fecha o menu (`aria-expanded="false"`) e devolve `document.activeElement` ao botão `Opções do Protótipo`.
   - Em `390×844`, abrir `Abrir menu de navegação` (`aria-expanded="true"`) e pressionar `Escape` fecha o drawer móvel e restaura o foco ao botão acionador (`UX-REAL-02-DEF-04` corrigido).
3. **Modal de Observação (`ObservationModal`) e Regiões `aria-live="polite"`:**
   - Diálogo expõe `role="dialog"`, `aria-modal="true"` e `aria-labelledby="modal-title"`.
   - Navegação por teclado nas abas (`#observation-tabs-container`) com `ArrowRight`, `ArrowLeft`, `Home` e `End` atualiza `aria-selected`, move o foco para o campo correspondente e atualiza o anúncio `aria-live="polite"` (*"Foco Ativo · Fatos"* vs *"Foco Ativo · Hipótese"*).
   - Ao salvar uma nova observação, o componente `NotificationToast` emite confirmação em região `role="status"` com `aria-live="polite"`.
4. **Distinção entre Viewport Reduzida, Ampliação de Fonte (`150%`), Zoom (`1.5x`) e `deviceScaleFactor: 2`:**
   - Validados sem truncamento destrutivo e sem `scrollWidth > clientWidth`.

---

## 4. Defeitos Encontrados e Corrigidos no Escopo Assistivo

| ID | Severidade | Descrição | Causa Raiz | Correção Aplicada | Status |
|---|---|---|---|---|---|
| `UX-REAL-02-DEF-04` | **P2** | Menu drawer móvel (`< 768px`) não fechava com a tecla `Escape` nem restaurava o foco ao botão acionador. | O `useEffect` de teclado em `src/components/Header.tsx` monitorava apenas `utilityMenuOpen`, ignorando `mobileMenuOpen`. | Adicionado `mobileMenuTriggerRef` ao botão do menu mobile e tratamento de `Escape` para fechar `mobileMenuOpen` e executar `mobileMenuTriggerRef.current?.focus()`. | **CORRIGIDO E VERIFICADO** |
| `UX-REAL-02-DEF-05` | **P2** | Overflow horizontal (`1431px > 1280px`) no cabeçalho ao aplicar ampliação de fonte raiz de `150%` (`24px`) em `1280×800`. | A classe `lg:flex-nowrap` impedia a quebra de linha dos seletores e botões de navegação quando a fonte base crescia 50%. | Substituído `lg:flex-nowrap` / `flex-nowrap` por `flex-wrap` nas faixas do `Header.tsx`, mantendo 1 linha em `100%` (`16px`) e permitindo quebra limpa sem corte em `150%`. | **CORRIGIDO E VERIFICADO** |
