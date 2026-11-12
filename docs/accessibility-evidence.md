# Evidências de Acessibilidade (WCAG 2.2 AA) — MUNDELO v1.1 (Gates UX-REAL-01, UX-REAL-01B e UX-REAL-02)

**Data:** 12 de Novembro de 2026  
**Suítes Automatizadas (`npm run test:a11y`):**
- `tests/e2e/home-accessibility.spec.ts` (**5/5 PASS**)
- `tests/e2e/home-assistive-readiness.spec.ts` (**4/4 PASS**)
- `tests/e2e/internal-accessibility.spec.ts` (**8/8 PASS**)  
**Total de Testes de Acessibilidade Automatizados:** **17 / 17 PASS (`0` violações `axe-core` em todas as telas e modais)**  
**Nota de Governança:** Em conformidade com as restrições do projeto, a ausência de violações no `axe-core` e nos testes de prontidão assistiva comprova os critérios passíveis de inspeção automatizada/DOM, permanecendo a validação humana com leitores de tela nativos documentada em `docs/ux-real-01b-assistive-manual.md` com status `NOT_EXECUTED`.

---

## 1. Verificações Automatizadas Concluídas — Home & Cabeçalho (`UX-REAL-01` + `UX-REAL-01B`)

| Categoria WCAG 2.2 | Regra / Teste Executado | Viewports / Estados Testados | Resultado Inicial | Resultado Pós-Correção |
| :--- | :--- | :--- | :---: | :---: |
| **Varredura Global `axe-core`** (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`) | `new AxeBuilder({ page }).withTags(...).analyze()` | `1280×800` (Desktop) e `360×800` (Mobile) — Estado padrão | **FAIL** em `360×800` (`label-content-name-mismatch`, *serious*) | **PASS (`0` violações)** |
| **Varredura `axe-core` em Overlays e Estados Dinâmicos** | `AxeBuilder` com menu `"Opções do Protótipo"`, drawer mobile, Estado Vazio, `ObservationModal` e `ObservationDetailModal` | `1280×800` e `390×844` | **FAIL** em `ObservationDetailModal` (`scrollable-region-focusable` — `UX-REAL-02-DEF-06`) | **PASS (`0` violações)** |
| **2.4.1, 2.4.3 & 2.5.3 Ordem de Foco, Skip Link e Label in Name** | `home-assistive-readiness.spec.ts`: `Tab` inicial foca `"Pular para o conteúdo principal"`, `Enter` move foco para `main#main-content`, e todos os botões visíveis contêm seu texto visível no nome acessível | `1280×800` | **PASS** | **PASS** |
| **2.1.1 & 2.4.3 Restauração de Foco ao Fechar Menus (`Escape`)** | Fechar `"Opções do Protótipo"` (Desktop) e `"Abrir menu de navegação"` (Mobile `390×844`) com `Escape` restaura `document.activeElement` ao botão acionador | `1280×800` e `390×844` | **FAIL** no menu mobile (`UX-REAL-02-DEF-04`) | **PASS** (ambos restauram foco) |
| **4.1.3 Mensagens de Status (`aria-live="polite"`)** | Verificação de `role="status"` + `aria-live="polite"` ao alternar criança/cuidador (`NotificationToast`) e ao alternar entre Fatos e Hipóteses (`ObservationModal`) | `1280×800` | **PASS** | **PASS** |
| **1.4.4, 1.4.10 & HiDPI (Viewport vs Fonte 150% vs Zoom vs `deviceScaleFactor: 2`)** | Verificação separada de reflow em `320×640`, ampliação de fonte raiz (`150%` / `24px`), zoom CSS (`1.5x`) e `deviceScaleFactor: 2` | `1280×800`, `390×844`, `320×640` | **FAIL** em fonte `150%` (`UX-REAL-02-DEF-05`) | **PASS (`0` overflow)** |

---

## 2. Verificações Automatizadas Concluídas — 6 Telas Internas (`UX-REAL-02` — `internal-accessibility.spec.ts`)

| Tela Interna / Modal | Viewports Auditados (`axe-core` WCAG 2.2 AA) | Achado Inicial no Diagnóstico | Correção Aplicada (Fase 4) | Status Final |
| :--- | :--- | :--- | :--- | :---: |
| **Diário (`journal`)** | `1280×800` e `360×800` | Contraste insuficiente em `text-[#CFA5A0]`, `text-[#80C5B5]` e `text-[#133E43]/70` (`UX-REAL-02-DEF-01`); input de busca sem `aria-label` (`UX-REAL-02-DEF-02`) | Tokens sólidos `text-[#8C4F48]`, `text-[#133E43]`, `text-[#265358]` + `aria-label="Buscar observações por palavras-chave"` | **PASS (`0` violações)** |
| **Meu Mundo (`world`)** | `1280×800` e `360×800` | Contraste insuficiente em subtítulos (`UX-REAL-02-DEF-01`); 8 inputs sem `aria-label` (`UX-REAL-02-DEF-02`) | Tokens `text-[#265358]` + `aria-label` explícito nos 8 campos de entrada | **PASS (`0` violações)** |
| **Descobertas (`discoveries`)** | `1280×800` e `360×800` | Contraste insuficiente na numeração de passos `text-[#80C5B5]` (`2.09:1`) e metadados (`UX-REAL-02-DEF-01`) | Numeração em `text-[#133E43] font-bold` e metadados em `text-[#265358]` | **PASS (`0` violações)** |
| **Compreender (`understand`)** | `1280×800` e `360×800` | Contraste insuficiente em notas de hipótese `text-[#133E43]/60` (`UX-REAL-02-DEF-01`) | Substituído por `text-[#265358]` (`6.9:1`) | **PASS (`0` violações)** |
| **Relatório (`report`)** | `1280×800` e `360×800` | Contraste insuficiente em metadados de revisão (`UX-REAL-02-DEF-01`) | Substituído por `text-[#265358]` e `text-[#133E43]` | **PASS (`0` violações)** |
| **Privacidade (`privacy`)** | `1280×800` e `360×800` | Contraste insuficiente em contadores secundários (`UX-REAL-02-DEF-01`) | Substituído por `text-[#265358]` | **PASS (`0` violações)** |
| **Modais (`ObservationModal` + `ObservationDetailModal`)** | `1280×800` e `390×844` | Contraste em textos auxiliares + região rolável sem `tabIndex={0}` em `390×844` (`UX-REAL-02-DEF-06`) | Contraste corrigido + `tabIndex={0}` e `role="region"` em `ObservationDetailModal` | **PASS (`0` violações)** |

---

## 3. Verificações Manuais Assistivas Pendentes (`NOT_EXECUTED`)

Os roteiros completos passo a passo encontram-se em `docs/ux-real-01b-assistive-manual.md`:

| Protocolo Manual | Ambiente Alvo | Referência | Status |
| :--- | :--- | :--- | :---: |
| **Protocolo 1 — TalkBack + Chrome** | Android 13+ (`360×800` / `390×844`) | `docs/ux-real-01b-assistive-manual.md` (Seção 2) | **`NOT_EXECUTED`** |
| **Protocolo 2 — NVDA + Navegador** | Windows 10/11 + Chrome/Firefox (`1280×800`) | `docs/ux-real-01b-assistive-manual.md` (Seção 3) | **`NOT_EXECUTED`** |
| **Protocolo 3 — VoiceOver + Safari** | macOS Sonoma+ / iOS 17+ (`1280×800` / `390×844`) | `docs/ux-real-01b-assistive-manual.md` (Seção 4) | **`NOT_EXECUTED`** |
