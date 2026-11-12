# Relatório Técnico de Homologação — MUNDELO Gate UX-REAL-01

**Data:** 12 de Novembro de 2026  
**Papéis:** Principal Frontend Engineer, UI/UX Specialist, QA Automation, Accessibility Engineer & React/TypeScript Architect  
**Escopo:** Homologação visual, responsiva, funcional e de acessibilidade em navegador real (Chromium Headless Shell via Playwright + axe-core) da Home v1.0 e Header Global do MUNDELO.  
**Decisão do Gate:** **CONDITIONAL** *(Todas as 18 verificações E2E/A11y em navegador real e os 92 testes de domínio/segurança foram aprovados com 0 defeitos P0/P1 abertos; classificado como CONDITIONAL em respeito estrito ao critério de que testes assistivos manuais com leitores de tela nativos VoiceOver/NVDA/TalkBack em hardware físico permanecem pendentes fora do container Linux headless).*

---

## 1. Identificação do Repositório e Ambiente

| Item | Valor Verificado no Ambiente |
| :--- | :--- |
| **Diretório de Trabalho** | `/app/applet` (Workspace AI Studio) |
| **Controle de Versão / Branch** | Workspace local sem repositório `.git` inicializado (`NO_GIT` / `NO_BRANCH`) — nenhuma operação de merge, push ou PR executada |
| **Node.js / npm** | Node `v22.23.2` / npm `10.9.8` |
| **Framework & Bundler** | React `19.0.1`, TypeScript `7.0.2`, Vite `8.3.0`, Tailwind CSS `4.3.3` |
| **Runner E2E & A11y** | `@playwright/test` `^1.65.0` + `@axe-core/playwright` `^4.14.0` |
| **Binário do Navegador** | `/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell` |
| **Servidor de Homologação** | `vite preview --port 4173 --host 127.0.0.1 --strictPort` (`NODE_ENV=test`, isolado da porta 3000 de desenvolvimento) |

---

## 2. Matriz de Viewports Inspecionados (Fase B)

| Viewport | Cenário | Overflow Horizontal (`scrollWidth <= clientWidth`) | `BrandLogo` & Slogan | Colisão entre Controles | Navegação & Cards | Artefato de Evidência | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :---: |
| **360 × 800** | Mobile pequeno | `360 <= 360` (`0px`) | Visível e sem corte (empilhado abaixo do nome) | Zero colisão | `BottomNav` visível; 1 coluna | `artifacts/ux-real-01/screenshots/360x800-mobile-small.png` | **PASS** |
| **390 × 844** | Mobile médio | `390 <= 390` (`0px`) | Visível e sem corte | Zero colisão | `BottomNav` visível; 1 coluna | `artifacts/ux-real-01/screenshots/390x844-mobile-medium.png` | **PASS** |
| **768 × 1024** | Tablet retrato | `768 <= 768` (`0px`) | Lockup horizontal íntegro | Zero colisão | 7 abas alinhadas em 1 linha; Ações `2×2` | `artifacts/ux-real-01/screenshots/768x1024-tablet-portrait.png` | **PASS** |
| **1024 × 768** | Tablet paisagem | `1024 <= 1024` (`0px`) | Lockup horizontal em linha única com seletores e CTA | Zero colisão | Hero `65%/35%`; Ações em 4 colunas de mesma altura | `artifacts/ux-real-01/screenshots/1024x768-tablet-landscape.png` | **PASS** |
| **1280 × 800** | Desktop padrão | `1280 <= 1280` (`0px`) | Lockup horizontal em linha única | Zero colisão | 7 abas + resumo de vínculo ativo na mesma linha | `artifacts/ux-real-01/screenshots/1280x800-desktop-standard.png` | **PASS** |
| **1536 × 864** | Desktop amplo | `1536 <= 1536` (`0px`) | Lockup horizontal em linha única | Zero colisão | Container `max-w-7xl` centralizado | `artifacts/ux-real-01/screenshots/1536x864-desktop-wide.png` | **PASS** |
| **640 × 400** | Reflow Zoom 200% | `640 <= 640` (`0px`) | Sem corte | Zero colisão | Reflow responsivo íntegro | `artifacts/ux-real-01/screenshots/zoom-200-reflow-640x400.png` | **PASS** |
| **320 × 640** | Reflow Zoom 400% + Texto Longo | `320 <= 320` (`0px`) | Quebra semântica limpa sem estourar largura | Zero colisão | Reflow em 1 coluna sem perda de informação | `artifacts/ux-real-01/screenshots/zoom-400-reflow-320x640.png` | **PASS** |
| **360 × 800** | Estado Vazio | `360 <= 360` (`0px`) | Visível e sem corte | Zero colisão | Card de Estado Vazio + Restauração funcional | `artifacts/ux-real-01/screenshots/state-empty-360x800.png` | **PASS** |

---

## 3. Inventário dos Testes Automatizados Executados

### 3.1. Suíte de Domínio, Autorização e Criptografia (`npm test`)
- **Comando:** `tsx --test tests/*.test.ts`
- **Arquivos:**
  - `tests/foundation-v0.2.test.ts`
  - `tests/foundation-v0.3.test.ts`
  - `tests/foundation-v0.4a.test.ts`
  - `tests/vault-adversarial-v0.4a.test.ts`
  - `tests/foundation-v0.4a1.test.ts`
- **Resultado:** **92 testes aprovados em 31 suítes (`0` falhas)**.

### 3.2. Suíte E2E e Acessibilidade em Navegador Real (`npm run test:e2e` & `npm run test:a11y`)
- **Arquivos:**
  - `tests/e2e/home-responsive.spec.ts` (8 testes: 6 viewports obrigatórios + Reflow Zoom 200%/400% e estresse de texto longo no `BrandLogo` + Estado Vazio/Restauração)
  - `tests/e2e/home-accessibility.spec.ts` (5 testes: varreduras `axe-core` WCAG 2.2 AA em Desktop/Mobile, Menu Utilitário aberto e Estado Vazio; landmarks, headings e labels; navegação por teclado, `Escape` e retorno de foco; alvos de toque e `prefers-reduced-motion`)
  - `tests/e2e/home-navigation.spec.ts` (5 testes: Home/Header e isolamento entre Tomás e Lia; proveniência `Observação direta` vs `Relatado por` e modal de detalhes; permissões `canCreate === true` vs `false`; transição pelas Ações Rápidas; `BottomNav` mobile sem sobreposição)
- **Resultado:** **18 testes aprovados (`0` falhas)**.

---

## 4. Defeitos Identificados na Fase Inicial e Correções Controladas (Fase E)

| Código | Severidade | Viewport / Estado | Comportamento Esperado vs. Observado | Causa Raiz | Correção Mínima Aplicada | Teste de Regressão | Status |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **UX-REAL-DEF-01** | **P1 (Alta)** | `320×640` (Reflow 400% / texto ampliado ou traduzido no `BrandLogo`) | **Esperado:** `headerScrollWidth <= 320px`.<br>**Observado:** `headerScrollWidth = 468px` (overflow horizontal). | Uso rígido de `whitespace-nowrap` no `<span>` do slogan em `src/components/BrandLogo.tsx` e ausência de `min-w-0` no botão da marca em `src/components/Header.tsx`. | Mantido `whitespace-nowrap` apenas no nome `"Mundelo"`, aplicado `min-w-0 max-w-full` e `break-words text-pretty` no slogan para permitir reorganização responsiva sem overflow em `<=320px`. | `tests/e2e/home-responsive.spec.ts` (`Reflow WCAG 1.4.10: Zoom 200% e Zoom 400%`) | **CORRIGIDO (`PASS`)** |
| **UX-REAL-DEF-02** | **P1 (Alta)** | `360×800` (Mobile pequeno — Home inicial) | **Esperado:** `0` violações `axe-core`.<br>**Observado:** 1 violação `serious` (`label-content-name-mismatch` — WCAG 2.5.3). | O `<button>` do logotipo em `Header.tsx` possuía `aria-label="Mundelo — Compreender..."` com travessão `—`, divergindo do texto visível contíguo em mobile (`"Mundelo Compreender..."`). | Removido o `aria-label` conflitante e adicionado `<span className="sr-only"> — Ir para Início</span>` dentro do botão, preservando 100% de correspondência com o texto visível. | `tests/e2e/home-accessibility.spec.ts` (`Varredura axe-core WCAG 2.2 AA na Home`) | **CORRIGIDO (`PASS`)** |
| **UX-REAL-DEF-03** | **P2 (Média)** | Todos os viewports (Menu `"Opções do Protótipo"` aberto via teclado) | **Esperado:** Pressionar `Escape` fecha o menu e devolve o foco ao botão acionador.<br>**Observado:** Menu fechava, mas o foco caía em `document.body` (`inactive`). | O listener de `keydown` (`Escape`) em `src/components/Header.tsx` chamava `setUtilityMenuOpen(false)` sem acionar `.focus()` na referência do botão acionador. | Adicionado `utilityTriggerRef` ao botão `"Opções do Protótipo"` e chamada `utilityTriggerRef.current?.focus()` ao tratar `Escape`. | `tests/e2e/home-accessibility.spec.ts` (`Navegação por teclado... Escape e retorno de foco`) | **CORRIGIDO (`PASS`)** |
| **UX-REAL-DEF-04** | **P2 (Média)** | `768×1024`, `1024×768`, `1280×800`, `1536×864` (Inspeção visual de screenshots) | **Esperado:** Em `>=1024px`, Marca + Seletores + CTA na mesma linha; em `>=768px`, todas as 7 abas de navegação na mesma linha.<br>**Observado:** Seletores quebravam para 2ª linha e a aba `"Privacidade"` quebrava sozinha para baixo. | Largura intrínseca excessiva dos `<select>` (devido às opções longas) + breakpoint `md:w-auto` em vez de `lg:w-auto lg:flex-nowrap` e padding largo nas abas de navegação. | Adicionado `max-w-[175px] xl:max-w-[235px] truncate` nos `<select>`, `lg:flex-nowrap` na faixa superior e `flex-nowrap` compacto na faixa de navegação (`md:flex`). | `tests/e2e/home-responsive.spec.ts` (asserções de `y` das 7 abas e alinhamento `logoBox.y` vs `ctaBox.y`) | **CORRIGIDO (`PASS`)** |
| **UX-REAL-DEF-05** | **P3 (Baixa)** | Todos os viewports (Botões secundários na Home) | **Esperado:** Alvos de toque com `min-h-[44px]`.<br>**Observado:** Botões `Ajustar Perfil` (`36px`) e `Política e Cofre Local` (`40px`). | Classes `min-h-[36px]` e `min-h-[40px]` em `src/screens/HomeScreen.tsx`. | Elevados para `min-h-[44px]` em `src/screens/HomeScreen.tsx`. | `tests/e2e/home-accessibility.spec.ts` | **CORRIGIDO (`PASS`)** |

---

## 5. Limitações de Teste e Riscos Residuais

1. **Testes Manuais com Leitores de Tela Nativos (`PENDING_MANUAL_VERIFICATION`):**
   - A execução automatizada com `@axe-core/playwright` e os testes de navegação por teclado cobrem a árvore DOM/ARIA e interações de foco no Chromium, mas **não substituem** a homologação assistiva manual com leitores de tela reais (**NVDA / JAWS** no Windows, **VoiceOver** no macOS/iOS e **TalkBack** no Android).
2. **Zoom Nativo de Página vs. Reflow CSS:**
   - O reflow de `200%` e `400%` foi comprovado conforme a diretriz técnica da WCAG 1.4.10 (redução proporcional do viewport CSS para `640×400` e `320×640` + injeção de string longa no `BrandLogo`), sem depender de `deviceScaleFactor`.
3. **Isolamento de Dados e Privacidade:**
   - Todas as capturas de tela em `artifacts/ux-real-01/screenshots/` contêm exclusivamente os perfis fictícios sintéticos (`Tomás` e `Lia`), sem qualquer dado real ou segredo criptográfico. O diretório `artifacts/` está listado no `.gitignore`.

---

## 6. Decisão Formal do Gate UX-REAL-01

- **Status:** **`CONDITIONAL`**
- **Justificativa Objetiva:**
  - **Critérios técnicos integralmente comprovados (`PASS`):** Todos os 6 viewports obrigatórios + cenários de reflow `200%`/`400%` e estado vazio foram executados em navegador Chromium real com screenshots salvos; todos os 5 defeitos identificados (`UX-REAL-DEF-01` a `05`) foram corrigidos e cobertos por testes de regressão; `0` violações `axe-core` abertas; `92/92` testes unitários/integração, `18/18` testes E2E/A11y, `npm run lint` e `npm run build` aprovados.
  - **Motivo do status `CONDITIONAL` (e não `APPROVED` incondicional):** Conforme a Restrição 6 (*"Não declarar conformidade WCAG 2.2 AA apenas com base em execução automatizada"*) e a Seção 10 (*"Se alguma condição não puder ser comprovada, utilizar CONDITIONAL ou BLOCKED, com justificativa explícita"*), a verificação manual com tecnologias assistivas de leitura de tela (VoiceOver/NVDA/TalkBack) em dispositivo físico humano não pode ser executada dentro do container Linux headless e permanece registrada como pendente em `docs/accessibility-evidence.md`.
