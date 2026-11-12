# MUNDELO — Documentação do Redesign da Home e Header Global (v1.0)

**Data:** 12 de Novembro de 2026  
**Escopo:** Evolução visual e estrutural de `BrandLogo.tsx`, `Header.tsx`, `BottomNav.tsx`, `HomeScreen.tsx` e `index.css`.

---

## 1. Resumo das Alterações por Componente

### 1.1. `src/components/BrandLogo.tsx` (Novo)
- Substituiu o ícone genérico de coração por um símbolo vetorial exclusivo inspirado em **elos, mundos e acolhimento**.
- Suporta as variantes `complete`, `compact` e `symbol` e os layouts `horizontal`, `stacked` e `responsive`.
- Garante que a frase de produto *"Compreender é o primeiro cuidado."* seja sempre exibida em linha única (`whitespace-nowrap`), com separador `·` no lockup horizontal e posicionada abaixo do nome em telas móveis compactas sem jamais truncar.

### 1.2. `src/components/Header.tsx` (Refatorado)
- **Camada 1 — Barra Institucional:** Reduzida e silenciosa, mantendo o aviso *"Protótipo ético em memória. Nenhum dado infantil real é solicitado ou armazenado."* alinhado com ícone `ShieldCheck` e transferindo as ações secundárias (*Simular Estado Vazio / Restaurar Dados*, *Ajustar Perfil*, *Manifesto & Limites*) para o menu utilitário acessível **"Opções do Protótipo"** (`aria-expanded`, `role="menu"`, fechamento via `Escape` e clique externo).
- **Camada 2 — Cabeçalho Principal:**
  - Faixa superior dedicada à assinatura completa da marca (`BrandLogo`), Seletor de Cuidador (`#caregiver-select`), Seletor de Criança (`#profile-select`) e CTA primário **"Nova Observação"** (`min-h-[44px]`).
  - Faixa de navegação principal dedicada para tablets e desktops (`md:flex`), eliminando qualquer possibilidade de colisão ou compressão entre os 7 links de navegação e os seletores de contexto.

### 1.3. `src/screens/HomeScreen.tsx` (Refatorado)
- **Hero Principal (65% / 35%):** Estruturado em grid de 12 colunas (`lg:col-span-7 xl:col-span-8` para a mensagem editorial e `lg:col-span-5 xl:col-span-4` para o painel discreto *"Perfil em foco"*). Removido o truncamento (`truncate`) do interesse da criança e incluída a expressão frequente do perfil.
- **Ações Rápidas:** 4 cards com alturas iguais (`h-full min-h-[104px]`), padding de `20px` (`p-5`), raio de `18px`, containers de ícone padronizados em `40×40px` (`w-10 h-10`) com ícones de `20px` (`w-5 h-5`). O card primário *"Nova Observação"* respeita `disabled={!canCreate}` em sincronia com a política de permissões.
- **Cards de Indicadores:** *Diário em Memória*, *Estratégias Catalogadas* e *Lembrete Afetivo* com mesma altura (`h-full`), `p-6`, `rounded-[20px]` e numerais tabulares (`tabular-nums`).
- **Observações Recentes:** Cards `<article>` com altura uniforme (`h-full`), metadados sem pílulas (*Tipo · Ambiente*), resumo com `line-clamp-3`, metadados de origem/proveniência (*Observação direta* vs. *Relatado por terceiro* e data formatada `DD/MM/AAAA`) e botão explícito **"Consultar detalhes"** (`min-h-[44px]`).

---

## 2. Comparativo Objetivo Antes vs. Depois

| Dimensão | Antes (Foundation v0.4A.1) | Depois (Home Redesign v1.0) |
| :--- | :--- | :--- |
| **Logotipo e Frase** | Ícone `<Heart />` genérico; frase `11px` sem ponto final sujeita a compressão. | SVG autoral `BrandLogo` (elos e núcleo acolhido); lockup horizontal `Mundelo · Compreender é o primeiro cuidado.` sem quebra interna. |
| **Barra Institucional** | Botões de *Simular Estado Vazio* e *Manifesto* expostos diretamente na barra + ponto decorativo. | Aviso ético limpo + menu utilitário acessível **"Opções do Protótipo"** (`role="menu"`). |
| **Colisão no Header (`1024px–1280px`)** | Marca + 7 links + 2 selects longos + CTA na mesma linha `h-16`, gerando aperto horizontal. | Faixa de identidade/contexto separada da faixa de navegação principal; zero sobreposição em qualquer largura. |
| **Hero Principal** | Flex simples; *Perfil em Foco* com `truncate` cortando interesses da criança. | Grid 65%/35% (`lg:grid-cols-12`); *Perfil em foco* integrado exibindo interesse e expressão completos. |
| **Ações Rápidas** | `min-h-[72px]`; card *Nova Observação* na Home não desabilitava quando `!canCreate`. | `min-h-[104px]`, `h-full`, ícones `20px` em boxes `40px`; estado `disabled={!canCreate}` sincronizado. |
| **Observações Recentes** | Card clicável genérico sem exibir proveniência (`DIRECT` vs `REPORTED_BY_OTHER`). | `<article>` estruturado com tipo, ambiente, resumo, proveniência explícita, data `DD/MM/AAAA` e botão *"Consultar detalhes"*. |
