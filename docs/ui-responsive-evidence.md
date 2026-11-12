# Evidências de Responsividade Real — MUNDELO v1.1 (Gates UX-REAL-01 + UX-REAL-02)

**Data:** 12 de Novembro de 2026  
**Ferramenta de Homologação:** `@playwright/test` (`Chromium Headless Shell 1247`) sobre servidor dedicado de teste (`http://127.0.0.1:4173`)  
**Suítes Executadas:** `tests/e2e/home-responsive.spec.ts` (**8/8 PASS**) + `tests/e2e/internal-responsive.spec.ts` (**6/6 PASS — 42 cenários**)  
**Diretórios de Artefatos:** `artifacts/ux-real-01/screenshots/` (9 capturas da Home) e `artifacts/ux-real-02/screenshots/` (42 capturas das 6 telas internas)

---

## 1. Matriz de Viewports Obrigatórios — Home (`Gate UX-REAL-01`)

| Viewport | Cenário | `docScrollWidth` vs `docClientWidth` | `headerScrollWidth` vs `headerClientWidth` | `BrandLogo` & Slogan | Navegação Ativa | Colisão de Controles | Screenshot de Página Completa | Status |
| :--- | :--- | :---: | :---: | :--- | :--- | :---: | :--- | :---: |
| **360 × 800** | Mobile pequeno | `360px / 360px` | `360px / 360px` | Símbolo `40×40px` + `Mundelo` + frase empilhada abaixo sem corte | `BottomNav` inferior + Drawer mobile | `false` (0 colisões) | `artifacts/ux-real-01/screenshots/360x800-mobile-small.png` | **PASS** |
| **390 × 844** | Mobile médio | `390px / 390px` | `390px / 390px` | Símbolo `40×40px` + `Mundelo` + frase empilhada abaixo sem corte | `BottomNav` inferior + Drawer mobile | `false` (0 colisões) | `artifacts/ux-real-01/screenshots/390x844-mobile-medium.png` | **PASS** |
| **768 × 1024** | Tablet retrato | `768px / 768px` | `768px / 768px` | Lockup horizontal `[SÍMBOLO] Mundelo · Compreender é o primeiro cuidado.` | Faixa de navegação com 7 abas na mesma linha (`Δy <= 4px`) | `false` (0 colisões) | `artifacts/ux-real-01/screenshots/768x1024-tablet-portrait.png` | **PASS** |
| **1024 × 768** | Tablet paisagem | `1024px / 1024px` | `1024px / 1024px` | Lockup horizontal na mesma linha dos seletores e CTA (`Δy <= 16px`) | Faixa de navegação com 7 abas na mesma linha (`Δy <= 4px`) | `false` (0 colisões) | `artifacts/ux-real-01/screenshots/1024x768-tablet-landscape.png` | **PASS** |
| **1280 × 800** | Desktop padrão | `1280px / 1280px` | `1280px / 1280px` | Lockup horizontal na mesma linha dos seletores e CTA | 7 abas + indicador de vínculo ativo na mesma linha | `false` (0 colisões) | `artifacts/ux-real-01/screenshots/1280x800-desktop-standard.png` | **PASS** |
| **1536 × 864** | Desktop amplo | `1536px / 1536px` | `1536px / 1536px` | Lockup horizontal na mesma linha dos seletores e CTA | 7 abas + indicador de vínculo ativo em `max-w-7xl` | `false` (0 colisões) | `artifacts/ux-real-01/screenshots/1536x864-desktop-wide.png` | **PASS** |
| **640 × 400** | Reflow Zoom 200% (WCAG 1.4.10) | `640px / 640px` | `640px / 640px` | Lockup horizontal com reorganização limpa | Layout reflow sem corte horizontal | `false` (0 colisões) | `artifacts/ux-real-01/screenshots/zoom-200-reflow-640x400.png` | **PASS** |
| **320 × 640** | Reflow Zoom 400% + Texto Longo Traduzido | `320px / 320px` | `320px / 320px` | Reorganização semântica do slogan em múltiplas linhas sem overflow | `BottomNav` inferior; cards em 1 coluna | `false` (0 colisões) | `artifacts/ux-real-01/screenshots/zoom-400-reflow-320x640.png` | **PASS** |
| **360 × 800** | Estado Vazio Ativo | `360px / 360px` | `360px / 360px` | Visível e íntegro | Estado vazio renderizado com CTAs acessíveis | `false` (0 colisões) | `artifacts/ux-real-01/screenshots/state-empty-360x800.png` | **PASS** |

---

## 2. Matriz das 6 Telas Internas × 7 Viewports (`Gate UX-REAL-02`)

Executado via `tests/e2e/internal-responsive.spec.ts` (**42 combinações reais** com verificação de `docScrollWidth <= docClientWidth`, `headerScrollWidth <= headerClientWidth`, `mainScrollWidth <= mainClientWidth` e ausência de colisão geométrica):

| Tela Interna (`ScreenId`) | `360×800` | `390×844` | `768×1024` | `1024×768` | `1280×800` | `1536×864` | `320×640` (Reflow) | Artefatos Gerados | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :---: |
| **Diário (`journal`)** | `360/360` | `390/390` | `768/768` | `1024/1024` | `1280/1280` | `1536/1536` | `320/320` | `artifacts/ux-real-02/screenshots/journal-*.png` (7 arq.) | **PASS** |
| **Meu Mundo (`world`)** | `360/360` | `390/390` | `768/768` | `1024/1024` | `1280/1280` | `1536/1536` | `320/320` *(corrigido `UX-REAL-02-DEF-07`)* | `artifacts/ux-real-02/screenshots/world-*.png` (7 arq.) | **PASS** |
| **Descobertas (`discoveries`)** | `360/360` | `390/390` | `768/768` | `1024/1024` | `1280/1280` | `1536/1536` | `320/320` | `artifacts/ux-real-02/screenshots/discoveries-*.png` (7 arq.) | **PASS** |
| **Compreender (`understand`)** | `360/360` | `390/390` | `768/768` | `1024/1024` | `1280/1280` | `1536/1536` | `320/320` | `artifacts/ux-real-02/screenshots/understand-*.png` (7 arq.) | **PASS** |
| **Relatório (`report`)** | `360/360` | `390/390` | `768/768` | `1024/1024` | `1280/1280` | `1536/1536` | `320/320` | `artifacts/ux-real-02/screenshots/report-*.png` (7 arq.) | **PASS** |
| **Privacidade (`privacy`)** | `360/360` | `390/390` | `768/768` | `1024/1024` | `1280/1280` | `1536/1536` | `320/320` | `artifacts/ux-real-02/screenshots/privacy-*.png` (7 arq.) | **PASS** |

---

## 3. Verificações Geométricas Comprovadas

1. **Ausência de Overflow Horizontal em 51 Cenários (9 na Home + 42 nas Telas Internas):**
   - Comprovado programaticamente via `document.documentElement.scrollWidth <= document.documentElement.clientWidth`, `header.scrollWidth <= header.clientWidth` e `main.scrollWidth <= main.clientWidth`.
2. **Correção de Reflow Extremo em `Meu Mundo` (`320×640` — `UX-REAL-02-DEF-07`):**
   - Os 5 campos `<input type="text">` das seções de singularidades possuíam `flex-1` sem `min-w-0`, retendo a largura mínima intrínseca do HTML (`size="20"`, gerando `344px > 320px`). A adição de `min-w-0` eliminou o overflow em `320×640`.
3. **Resiliência sob Ampliação Real de Fonte Raiz (`150%` / `24px` — `UX-REAL-02-DEF-05`):**
   - Quando `document.documentElement.style.fontSize = '150%'` é aplicado em `1280×800`, os breakpoints `rem` do Tailwind CSS e os textos escalam em `1.5×`; o ajuste de `flex-wrap` e espaçamento adaptativo em `Header.tsx` garante `scrollWidth === 1280px` em `150%` sem sacrificar o alinhamento em linha única em `768×1024` (`100%` / `16px`).
