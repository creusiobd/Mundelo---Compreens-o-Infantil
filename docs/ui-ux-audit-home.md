# Auditoria Visual e de UX — MUNDELO Home & Header Global (v1.0)

**Data:** 12 de Novembro de 2026  
**Papéis:** Principal Product Designer, Senior UI/UX Designer, Design Systems Architect & Accessibility Specialist (WCAG 2.2 AA)  
**Escopo:** Inspeção detalhada de `src/components/Header.tsx`, `src/components/BottomNav.tsx`, `src/screens/HomeScreen.tsx` e `src/index.css`.

---

## 1. Avaliação dos 10 Eixos de Inspeção

### 1.1. Hierarquia Visual e Distribuição de Elementos
- **Diagnóstico:** O cabeçalho tenta acomodar 5 grupos funcionais densos em uma única linha de `64px` (`h-16`): logotipo com slogan, 7 links de navegação, seletor de cuidador com emojis e status longos, seletor de perfil infantil e botão primário "Nova Observação". Na Home, a largura máxima (`max-w-6xl`) diverge da largura do Header (`max-w-7xl`), criando desalinhamento óptico nas margens laterais em telas desktop (`1280px` e `1536px`).

### 1.2. Proporções do Logotipo e Legibilidade do Slogan
- **Diagnóstico:** O símbolo atual usa um ícone genérico (`<Heart />` da biblioteca Lucide) dentro de um quadrado de `36×36px`, sem identidade vetorial própria. A frase de produto (*"Compreender é o primeiro cuidado"*) está em `11px` (`text-[11px]`), sem ponto final e sujeita a compressão ou quebra quando os seletores laterais crescem.

### 1.3. Densidade Horizontal do Header e Barra Institucional
- **Diagnóstico:** A barra superior institucional mistura o aviso ético com botões operacionais de teste (*"Simular Estado Vazio (Tomás: 5 reg.)"* e *"Manifesto & Limites"*), além de um ponto verde decorativo (`w-2 h-2 rounded-full bg-[#80C5B5]`). Isso gera ruído visual no topo da aplicação e compete com a assinatura da marca.

### 1.4. Alinhamentos entre Marca, Navegação e Seletores
- **Diagnóstico:** O seletor de cuidador renderiza strings extensas no `<select>` fechado (ex.: `👤 Mariana (Educadora) (Educador) [SEM VÍNCULO]`), consumindo até `280px` de largura horizontal e comprimindo os 7 itens de navegação em telas entre `1024px` e `1280px`.

### 1.5. Organização e Peso Visual do Hero
- **Diagnóstico:** O bloco Hero usa `flex-col lg:flex-row` sem proporção editorial definida (65% / 35%). O cartão lateral *"Perfil em Foco"* aplica `truncate` no interesse da criança (cortando texto relevante em telas médias) e apresenta baixa integração com as formas de comunicação e rotina do perfil ativo.

### 1.6. Consistência dos Cards e Ícones (Ações Rápidas)
- **Diagnóstico:** Os 4 cards de Ações Rápidas têm altura mínima baixa (`min-h-[72px]`), e o card primário *"Nova Observação"* na Home não reflete visualmente o estado desabilitado (`!canCreate`) quando o cuidador simulado está suspenso ou sem vínculo — diferentemente do botão no Header.

### 1.7. Espaçamento Horizontal e Vertical
- **Diagnóstico:** As seções da Home utilizam espaçamento `space-y-6` (`24px`) e gaps de `12px` (`gap-3`), resultando em densidade excessiva entre o Hero, Ações Rápidas, Indicadores e Observações Recentes.

### 1.8. Tipografia, Escalas e Contrastes
- **Diagnóstico:** Uso recorrente de micro-labels em caixa alta (`uppercase tracking-wider text-xs`) e textos secundários com opacidade reduzida (`text-[#133E43]/60`), que em fundo `#F8F5EF` aproxima-se do limite mínimo de contraste WCAG AA (4.5:1).

### 1.9. Comportamento em Dispositivos Móveis e Tablets
- **Diagnóstico:** Entre `768px` e `1024px` (tablets em retrato/paisagem), a navegação principal desaparece abruptamente ou comprime os seletores. Em `360×800`, o cabeçalho precisa preservar símbolo, nome e frase de produto sem truncamento e sem gerar scroll horizontal.

### 1.10. Interações, Hover, Focus e Estados Desabilitados
- **Diagnóstico:** Os cards de *Observações Recentes* utilizam `<div role="button" tabIndex={0}>` sem anel de foco dedicado (`focus-visible:ring-2`) e sem exibir os metadados de proveniência (`Observação Direta` vs. `Relato de Terceiro`) e papel do observador.

---

## 2. Matriz Objetiva de Problemas, Severidades e Soluções

| ID | Componente | Problema Identificado | Severidade | Solução Arquitetural / UI (v1.0) |
| :--- | :--- | :--- | :---: | :--- |
| **UX-01** | `BrandLogo` / `Header` | Ícone genérico e frase de produto sujeita a quebra ou ilegibilidade (`11px`). | **Alta (P1)** | Criar componente vetorial `BrandLogo` (`complete`, `compact`, `symbol`) com símbolo orgânico de elos/acolhimento e frase `Compreender é o primeiro cuidado.` protegida por `whitespace-nowrap`. |
| **UX-02** | `Header` (Barra Institucional) | Botões de simulação expostos diretamente na barra institucional criam poluição visual. | **Média (P2)** | Manter apenas o aviso ético discreto à esquerda e consolidar ações secundárias (*Simular Estado Vazio*, *Restaurar Dados*, *Manifesto*, *Ajustar Perfil*) em um menu utilitário acessível via teclado. |
| **UX-03** | `Header` (Layout Principal) | Colisão horizontal entre marca, 7 links de navegação, 2 seletores e CTA entre `1024px` e `1280px`. | **Alta (P1)** | Estruturar o cabeçalho principal em regiões planejadas (Identidade + Contexto/Seletores/CTA na faixa principal e barra de navegação dedicada/adaptativa), garantindo zero sobreposição e zero overflow de `360px` a `1536px+`. |
| **UX-04** | `HomeScreen` (Container) | Desalinhamento de grid entre Header (`max-w-7xl`) e Home (`max-w-6xl`). | **Média (P2)** | Unificar container em `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` com ritmo vertical de `32px–40px`. |
| **UX-05** | `HomeScreen` (Hero) | Falta de proporção 65%/35% e truncamento (`truncate`) do interesse no *Perfil em Foco*. | **Média (P2)** | Aplicar CSS Grid de 12 colunas (`lg:col-span-8` editorial / `lg:col-span-4` Perfil em Foco integrado), removendo truncamento e exibindo interesses e comunicação de forma legível. |
| **UX-06** | `HomeScreen` (Ações Rápidas) | Card *Nova Observação* na Home não respeita visualmente `!canCreate`; alturas e ícones pouco uniformes. | **Alta (P1)** | Sincronizar `disabled={!canCreate}` no card primário, padronizar containers de ícone em `40×40px` (`w-10 h-10`) com ícones de `20px` (`w-5 h-5`), alturas iguais (`h-full`) e raio consistente (`rounded-[18px]`). |
| **UX-07** | `HomeScreen` (Indicadores) | Falta de alinhamento numérico tabular e hierarquia entre cards operacionais e *Lembrete Afetivo*. | **Baixa (P3)** | Aplicar `tabular-nums`, mesma altura (`h-full`), `p-6`, `rounded-[20px]` e tratamento editorial acolhedor no *Lembrete Afetivo*. |
| **UX-08** | `HomeScreen` (Observações Recentes) | Ausência de metadados de proveniência/origem nos cards e falta de `focus-visible` explícito. | **Média (P2)** | Exibir tipo, ambiente, resumo (`line-clamp-3`), proveniência/observador e CTA *"Consultar detalhes"*, com foco visível WCAG 2.2 AA. |
