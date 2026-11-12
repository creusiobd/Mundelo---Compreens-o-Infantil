# MUNDELO — Design System v1.0 (Especificação Semântica)

**Versão:** v1.0 (UI/UX Redesign Home)  
**Arquivos de Referência:** `src/index.css`, `src/components/BrandLogo.tsx`, `src/components/Header.tsx`, `src/screens/HomeScreen.tsx`  
**Conformidade de Acessibilidade Alvo:** WCAG 2.2 Nível AA

---

## 1. Identidade da Marca e Lockup Vetorial (`BrandLogo`)

- **Nome:** MUNDELO
- **Slogan Institucional:** *Cada criança, um mundo. Cada vínculo, uma descoberta.*
- **Frase de Produto:** *Compreender é o primeiro cuidado.*
- **Símbolo Vetorial (SVG):**
  - Composto por três arcos orgânicos entrelaçados com espessura uniforme (`1.85px`, `strokeLinecap="round"`) representando o mundo/acolhimento (`#80C5B5`), o vínculo familiar (`#80C5B5`) e a descoberta singular (`#F1CA91`), abrigando um núcleo central (`#F1CA91`) sobre superfície Verde Profundo (`#133E43`).
- **Variantes do Componente `BrandLogo`:**
  - `complete`: Símbolo + Nome (`Mundelo`) + Frase de produto (`Compreender é o primeiro cuidado.`).
  - `compact`: Símbolo + Nome (`Mundelo`).
  - `symbol`: Apenas o símbolo vetorial.
- **Regras de Lockup:**
  - Desktop e Tablet (`>= 640px`): `[SÍMBOLO] Mundelo · Compreender é o primeiro cuidado.` em linha única (`whitespace-nowrap`), nunca quebrando internamente nem truncando a frase.
  - Mobile (`< 640px`): Símbolo à esquerda, nome `Mundelo` acima e frase `Compreender é o primeiro cuidado.` posicionada imediatamente abaixo em linha única (`whitespace-nowrap`), preservando legibilidade integral (`12px`).

---

## 2. Paleta Cromática e Tokens Semânticos

| Token CSS | Valor Hex / RGBA | Papel Semântico | Contraste WCAG 2.2 AA |
| :--- | :--- | :--- | :--- |
| `--color-deep` | `#133E43` | Superfície primária de marca, CTAs principais, títulos e texto primário | **11.4:1** sobre `#F8F5EF` / **12.8:1** sobre `#FFFFFF` (AAA) |
| `--color-deep-hover` | `#194F55` | Estado hover/active de superfícies `#133E43` | **9.6:1** sobre `#FFFFFF` (AAA) |
| `--color-elo` | `#80C5B5` | Destaque de vínculo, ícones sobre fundo escuro, superfícies editoriais suaves | Usado como ícone/acento sobre `#133E43` (**6.1:1**) ou fundo suave `16%–22%` |
| `--color-solar` | `#F1CA91` | Destaque de descoberta, hipóteses e acentos calorosos | Texto sobre `#F1CA91` sempre em `#133E43` (**8.2:1**) |
| `--color-ivory` | `#F8F5EF` | Canvas neutro dominante (60% da distribuição visual) | Base acolhedora de baixo cansaço visual |
| `--color-surface` | `#FFFFFF` | Superfície estrutural de cards e painéis (30% da distribuição) | Delimitada por borda sutil `--border-subtle` |
| `--color-clay` | `#CFA5A0` | Acento secundário orgânico para sínteses e alertas suaves | Texto sobre fundo suave sempre em `#133E43` ou `#8C4F48` |
| `--text-secondary` | `#265358` | Subtítulos, descrições, metadados e labels | **7.8:1** sobre `#FFFFFF` / **6.9:1** sobre `#F8F5EF` (AA/AAA) |

---

## 3. Tipografia e Escala Hierárquica

- **Família Display (`font-display`):** `'Nunito Sans'`, sans-serif orgânica e acolhedora para títulos, marca e indicadores numéricos.
- **Família de Corpo e Dados (`body`):** `'Inter'`, sans-serif neutra de alta legibilidade para textos longos, labels, seletores e controles.
- **Disciplina Numérica:** `tabular-nums` obrigatório em contadores, datas e métricas.

| Nível | Escala Desktop | Escala Mobile | Peso / Entrelinha | Uso |
| :--- | :---: | :---: | :---: | :--- |
| **H1 (Hero)** | `40px` (`lg:text-[40px]`) | `24px–30px` (`text-2xl sm:text-3xl`) | `800` (ExtraBold) / `1.15` | Título principal do Hero (`text-balance`) |
| **H2 (Seções)** | `20px–22px` (`sm:text-xl`) | `18px` (`text-lg`) | `700` (Bold) / `1.25` | Cabeçalhos de seção da Home |
| **Título de Card** | `16px–18px` (`text-base sm:text-lg`) | `16px` (`text-base`) | `700` (Bold) / `1.35` | Títulos das Ações Rápidas e Perfil |
| **Valor Indicador** | `36px` (`sm:text-4xl`) | `30px` (`text-3xl`) | `800` (`tabular-nums`) / `1.0` | Contadores de Diário e Estratégias |
| **Corpo Principal** | `15px–16px` (`sm:text-base`) | `14px` (`text-sm`) | `400–500` / `1.6` | Descrições e relatos de observações |
| **Labels & Metadados**| `12px–13px` (`text-xs sm:text-[13px]`) | `12px` (`text-xs`) | `600` (SemiBold) / `1.4` | Metadados sem caixas (*zero-pill*), datas e origens |

---

## 4. Espaçamento, Raios, Bordas e Estados Interativos

- **Escala Espacial Base:** Múltiplos de `4px` e `8px`.
  - Separação entre seções da Home: `32px` mobile (`space-y-8`) a `40px` desktop (`sm:space-y-10`).
  - Grid gap entre cards: `16px` (`gap-4`).
  - Padding interno de cards: `20px` (`p-5`) em Ações Rápidas; `24px` (`p-6`) em Indicadores e Observações Recentes; `24px–36px` (`p-6 sm:p-8 lg:p-9`) no Hero.
- **Raios de Borda Hierárquicos:**
  - Hero Container: `24px` (`rounded-[24px]`).
  - Cards de Indicadores, Observações Recentes e Painel Perfil em Foco: `20px` (`rounded-[20px]`).
  - Cards de Ações Rápidas: `18px` (`rounded-[18px]`).
  - Botões, Seletores e Containers de Ícone (`40×40px`): `12px` (`rounded-xl`).
- **Estados de Interação e Acessibilidade:**
  - Áreas mínimas de toque: `44 × 44 px` (`min-h-[44px]`).
  - Anel de foco visível: `:focus-visible { outline: 2.5px solid #133E43; outline-offset: 2px; }`.
  - Microinterações: `150ms cubic-bezier(0.16, 1, 0.3, 1)`, desativadas automaticamente sob `@media (prefers-reduced-motion: reduce)`.
