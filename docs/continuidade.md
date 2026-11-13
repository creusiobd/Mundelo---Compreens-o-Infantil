# Documento de Continuidade — MUNDELO (Execução Controlada v1.1: Gates UX-REAL-01B + UX-REAL-02)

**Data:** 12 de Novembro de 2026  
**Papéis:** Principal Software Engineer, Accessibility Engineer, QA Automation Architect & Product UX Auditor  
**Versão Atual:** Execução Controlada v1.1 (Gates UX-REAL-01B + UX-REAL-02) sobre UI/UX Redesign Home v1.0 e Baseline Foundation v0.4A.1  
**Status do repositório remoto (atualização de 12/11/2026):** código v1.1 disponível no GitHub em `creusiobd/Mundelo---Compreens-o-Infantil`, branch `main`. O status `NO_GIT` registrado no relatório v1.1 descreve o workspace headless original, não o repositório remoto. O snapshot local anterior não foi publicado.  
**Status dos Testes de Domínio e Segurança (`npm test`):** **92 / 92 aprovados (100% PASS em 31 suítes)**  
**Status dos Testes E2E Completos (`npm run test:e2e`):** **42 / 42 aprovados (100% PASS em 8 suítes Playwright)**  
**Status dos Testes Assistivos e Acessibilidade (`npm run test:a11y`):** **17 / 17 aprovados (100% PASS em 3 suítes A11y/Assistivas)**  
**Status do Gate UX-REAL-01B:** **CONDITIONAL** (100% da prontidão assistiva automatizada aprovada — árvore de acessibilidade, ordem de foco, WCAG 2.5.3, ARIA roles/states, teclado puro, restauração de foco, `aria-live="polite"`, e separação entre viewport reduzido, `font-size: 150%`, zoom `1.5x` e `deviceScaleFactor: 2`; aguardando apenas execução humana com leitores de tela nativos TalkBack/NVDA/VoiceOver documentados em `docs/ux-real-01b-assistive-manual.md` — `NOT_EXECUTED`)  
**Status do Gate UX-REAL-02:** **PASS** (todas as 6 telas internas homologadas em 7 viewports com 42 screenshots reais em `artifacts/ux-real-02/screenshots/`, zero violações `critical`/`serious` no `axe-core` WCAG 2.2 AA, fluxos completos de navegação/RBAC/isolamento validados e 7 defeitos reais corrigidos)  
**Status do Gate de Segurança (v0.4A.1):** **CONDITIONAL** (aguardando execução em aparelho físico Android para o protocolo empírico SEC-23 — `NOT_EXECUTED`)

---

## 1. Histórico Evolutivo Consolidado

| Etapa | Escopo Principal | Testes Automatizados | Status |
| :--- | :--- | :---: | :---: |
| **Foundation v0.1** | Protótipo inicial em memória volátil, Design System acolhedor, 0–5 anos | — | Concluído |
| **Foundation v0.2** | Isolamento estrito entre crianças (`tomas` vs `lia`), zero vazamento, acessibilidade WCAG AA | 21 | Concluído |
| **Foundation v0.3** | Modelo de cuidadores, RBAC demonstrativo, proveniência e histórico de revisão | 36 (acumulado) | Concluído |
| **Foundation v0.4A** | Cofre Local Criptografado experimental (`.mundelo-vault` v1) via Web Crypto API | 49 (acumulado) | Concluído |
| **Gate Adversarial v0.4A** | Auditoria adversarial de 24 cenários (SEC-01 a SEC-24), correção de 3 P1 e 3 P2 | 75 (acumulado) | Concluído |
| **Foundation v0.4A.1** | Fechamento de SEC-14 (merge determinístico), SEC-17/18 (concorrência/locks no domínio) e SEC-23 (Security Lab Android DEV-only) | 92 (acumulado) | Concluído (`CONDITIONAL`) |
| **UI/UX Redesign Home v1.0** | Refinamento de identidade visual (`BrandLogo`), reestruturação em 2 camadas do `Header`, redesign do Hero (65%/35%), Ações Rápidas, Indicadores e Observações Recentes | 92 (domínio) | Concluído |
| **Gate UX-REAL-01** | Homologação real da Home com Playwright + `@axe-core/playwright` em 6 viewports + Zoom 200%/400%, correção de 5 defeitos (`UX-REAL-DEF-01` a `05`) | 92 (domínio) + 18 (E2E/A11y) | Concluído (`CONDITIONAL`) |
| **Execução Controlada v1.1 (UX-REAL-01B + UX-REAL-02)** | Prontidão assistiva automatizada + protocolo manual assistivo (`UX-REAL-01B`), homologação responsiva/acessível/funcional das 6 telas internas em 7 viewports (`UX-REAL-02`), auditoria cognitiva v1.0 e correção de 7 defeitos (`UX-REAL-02-DEF-01` a `07`) | **92 (domínio) + 42 (E2E) / 17 (A11y)** | **UX-REAL-01B: `CONDITIONAL` / UX-REAL-02: `PASS`** |

---

## 2. Registro da Intervenção Gate UX-REAL-01 (Baseline Anterior)

1. **Problema Investigado:**
   - Homologação automatizada da Home v1.0 em navegador Chromium real (`@playwright/test` + `@axe-core/playwright`) em 6 viewports (`360×800` a `1536×864`) e reflow `200%`/`400%`.
2. **Resultado e Defeitos Corrigidos:**
   - Corrigidos 5 defeitos (`UX-REAL-DEF-01` a `UX-REAL-DEF-05`) em `BrandLogo.tsx`, `Header.tsx` e `HomeScreen.tsx`, gerando 9 screenshots em `artifacts/ux-real-01/screenshots/`.

---

## 3. Registro da Intervenção Execução Controlada v1.1 (Gates UX-REAL-01B + UX-REAL-02)

1. **Problema Investigado:**
   - Concluir os requisitos assistivos do Gate UX-REAL-01 (`Gate UX-REAL-01B`: separar com rigor a validação automatizada da árvore de acessibilidade, ordem de foco, nomes acessíveis vs texto visível, restauração de foco, `aria-live="polite"`, e ampliação textual real `font-size: 150%` vs zoom `1.5x` vs `deviceScaleFactor: 2` dos testes humanos com leitores de tela nativos) e expandir a homologação E2E, responsiva, cognitiva e acessível para todas as **6 telas internas** (`Diário`, `Meu Mundo`, `Descobertas`, `Compreender`, `Relatório`, `Privacidade`) sob o **Gate UX-REAL-02**.
2. **Preservação e Baseline (Fase 0):**
   - Verificado que o workspace permanece `NO_GIT` e sem repositório remoto oficial configurado. Criado snapshot local reversível em `artifacts/snapshots/pre-v1.1-backup.tar.gz` antes de qualquer alteração.
   - Baseline executado com sucesso: `npm test` (92/92 PASS), `npm run lint` (PASS), `npm run build` (PASS), `npm run test:e2e` (18/18 PASS) e `npm run test:a11y` (5/5 PASS).
3. **Arquitetura E2E e Testes Executados (Fases 1, 2 e 6):**
   - Criada arquitetura reutilizável de fixtures e helpers em `tests/e2e/fixtures/` (`synthetic-data.ts`, `test-session.ts`) e `tests/e2e/helpers/` (`accessibility.ts`, `responsive.ts`, `navigation.ts`).
   - Implementadas 5 novas suítes Playwright:
     - `tests/e2e/home-assistive-readiness.spec.ts` (**4/4 PASS**)
     - `tests/e2e/internal-responsive.spec.ts` (**6/6 PASS** — gerou **42 screenshots** reais em `artifacts/ux-real-02/screenshots/` cobrindo 6 telas × 7 viewports)
     - `tests/e2e/internal-accessibility.spec.ts` (**8/8 PASS** — `axe-core` WCAG 2.2 AA nas 6 telas internas e nos modais `ObservationModal` e `ObservationDetailModal`, além de validação da separação visual entre Fato e Hipótese)
     - `tests/e2e/internal-navigation.spec.ts` (**4/4 PASS** — navegação desktop/mobile, criação/edição/exclusão no Diário, adição de item em Meu Mundo, cópia e impressão em Relatório, e isolamento de dados `Tomás` ↔ `Lia`)
     - `tests/e2e/internal-permissions.spec.ts` (**2/2 PASS** — matriz RBAC entre `Mãe (Clara)`, `Prof. Marina` e `Ana (Não vinculada)` e painel experimental do Cofre Local `.mundelo-vault`)
   - Total final de testes automatizados:
     - `npm test`: **92/92 PASS** (31 suítes de domínio e segurança)
     - `npm run test:e2e`: **42/42 PASS** (8 suítes E2E completas)
     - `npm run test:a11y`: **17/17 PASS** (`home-accessibility.spec.ts` + `home-assistive-readiness.spec.ts` + `internal-accessibility.spec.ts`)
4. **Defeitos Encontrados e Corrigidos (Fase 4):**
   - **`UX-REAL-02-DEF-01` (P1 — Contraste WCAG 1.4.3 AA insuficiente nas 6 telas internas e modais):** Substituídas classes com baixa opacidade (`text-[#133E43]/60`, `/70`, `/50`) e tons claros sobre fundo claro (`text-[#CFA5A0]`, `text-[#80C5B5]`) pelos tokens sólidos de alto contraste do Design System v1.0 (`text-[#265358]`, `text-[#8C4F48]`, `text-[#133E43]`) em `JournalScreen.tsx`, `MyWorldScreen.tsx`, `DiscoveriesScreen.tsx`, `UnderstandScreen.tsx`, `ReportScreen.tsx`, `PrivacyScreen.tsx`, `ObservationModal.tsx` e `ObservationDetailModal.tsx`.
   - **`UX-REAL-02-DEF-02` (P1 — Inputs sem `aria-label` programático em `MyWorldScreen.tsx` e `JournalScreen.tsx`):** Adicionados `aria-label` explícitos aos 8 campos de entrada rápida de *Meu Mundo* e ao campo de busca textual de *Diário*.
   - **`UX-REAL-02-DEF-03` (P1 — Controles de escrita habilitados na UI para cuidadora não vinculada em `JournalScreen`, `MyWorldScreen` e `DiscoveriesScreen`):** Adicionado `disabled={!canCreate}` e feedback visual de desabilitado ao botão de estado vazio em `JournalScreen.tsx`, aos botões/inputs de edição em `MyWorldScreen.tsx` e ao botão de registro em `DiscoveriesScreen.tsx`.
   - **`UX-REAL-02-DEF-04` (P2 — Gaveta mobile não fechava com `Escape` nem restaurava foco):** Adicionado `mobileMenuTriggerRef` e tratamento de `Escape` para `mobileMenuOpen` em `src/components/Header.tsx`.
   - **`UX-REAL-02-DEF-05` (P2 — Overflow horizontal no Header sob ampliação de fonte raiz `150%` em `1280×800`):** Ajustada a `nav` principal em `src/components/Header.tsx` para `flex-wrap gap-0.5 lg:gap-1.5` e `px-2 lg:px-3`, mantendo 1 linha em `768×1024` (`100%`) e permitindo quebra limpa sob `font-size: 150%`.
   - **`UX-REAL-02-DEF-06` (P2 — Região rolável sem foco de teclado em `ObservationDetailModal.tsx`):** Adicionados `tabIndex={0}`, `role="region"` e `aria-label="Conteúdo detalhado da observação"` ao container rolável do modal de detalhes.
   - **`UX-REAL-02-DEF-07` (P2 — Overflow horizontal `344px > 320px` em `MyWorldScreen.tsx` no viewport `320×640`):** Adicionado `min-w-0` aos 5 inputs `flex-1` de *Meu Mundo* para eliminar a largura intrínseca mínima padrão do `<input>`.
5. **Próxima Hipótese ou Ação Recomendada:**
   - Executar os roteiros manuais assistivos documentados em `docs/ux-real-01b-assistive-manual.md` (TalkBack + Chrome no Android, NVDA no Windows e VoiceOver no macOS/iOS) e o benchmark empírico `SEC-23` em aparelho físico Android intermediário para promover os gates `UX-REAL-01B` e `Security v0.4A.1` de `CONDITIONAL` para `PASS`.


---

## Proposta documental: Manifesto e Principles Gate v1.0 (13/11/2026)

- **Problema:** conectar a filosofia de cuidado e inclusão a critérios verificáveis do produto.
- **Intervenção:** elaborados `docs/manifesto-principios-mundelo-v1.md` e `docs/principles-gate-v1.md` na branch `docs/manifesto-principios-v1`.
- **Testes:** alteração exclusivamente documental; nenhuma execução assistiva física foi realizada nesta etapa.
- **Resultado:** proposta de 12 princípios, cinco perguntas operacionais e avaliação preliminar; status institucional EM REVISÃO.
- **Próxima hipótese/ação:** revisar e aprovar os textos no PR; depois disponibilizar ambiente HTTPS com dados sintéticos e executar TalkBack no Galaxy Tab S10 Ultra, registrando evidências em `docs/ux-real-01b-assistive-manual.md`. NVDA, VoiceOver e SEC-23 continuam pendentes.


## Institucionalização do Manifesto v1.0 (13/11/2026)

- **Problema:** a proposta filosófica anterior precisava de autoridade formal, participação explícita da criança, honestidade na distinção entre inclusão pretendida e inclusão comprovada, e responsáveis definidos na governança.
- **Intervenção:** revisados `docs/manifesto-principios-mundelo-v1.md` e `docs/principles-gate-v1.md`; README vincula os dois como referência institucional. Mantidos os 12 princípios, com regras de aprovação, bloqueios e exceções não críticas.
- **Testes:** revisão documental e integração com CI existente; nenhuma execução física de leitores de tela nesta alteração.
- **Resultado:** documentos institucionalizados após aprovação do PR; compromissos técnicos e limites da evidência continuam separados.
- **Próxima hipótese:** preparar uma URL de homologação segura com dados sintéticos e executar TalkBack no Galaxy Tab S10 Ultra; registrar observações, defeitos e próxima ação no roteiro UX-REAL-01B. NVDA, VoiceOver e SEC-23 permanecem NOT_EXECUTED.
