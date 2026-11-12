# Roteiro de Validação Assistiva Humana — Gate UX-REAL-01B

**Data de Elaboração:** 2026-11-12  
**Escopo:** Home v1.0, Cabeçalho Global (`Header`), Barra Móvel (`BottomNav`), Modal de Observação (`ObservationModal`) e Regiões Dinâmicas (`NotificationToast`).  
**Status Global de Execução Humana:** `NOT_EXECUTED`

---

## 1. Declaração de Rigor Metodológico e Fronteira de Automação

Conforme a diretriz de engenharia do MUNDELO v1.1:
- **Testes automatizados em Chromium (`home-assistive-readiness.spec.ts`)** validam a **prontidão técnica da árvore de acessibilidade (Accessibility Tree)**, ordem de tabulação, nomes acessíveis (WCAG 2.5.3), papéis ARIA (`role="dialog"`, `role="tablist"`, `role="tab"`, `role="tabpanel"`, `role="menu"`, `aria-current="page"`), restauração de foco ao fechar menus/modais com `Escape` e regiões `aria-live="polite"`.
- **Testes automatizados NÃO substituem nem simulam leitores de tela reais.** A vocalização prosódica, a navegação por gestos de toque (*swipe* linear, *explore by touch*), o rotor de cabeçalhos/regiões e os modos de navegação virtual (*Browse Mode* vs *Focus Mode*) dependem da interação entre o sistema operacional, a API nativa de acessibilidade (`AccessibilityNodeInfo` no Android, `UIA/IAccessible2` no Windows, `NSAccessibility` no macOS/iOS) e o sintetizador de voz.
- Nenhum roteiro abaixo deve ter seu status alterado para `PASS` sem execução humana presencial nos respectivos ambientes físicos ou emuladores oficiais com áudio ativo.

---

## 2. Protocolo 1 — TalkBack + Google Chrome (Android)

- **Ambiente Alvo:** Android 13+ com Google TalkBack ativo + Google Chrome estável
- **Viewport de Referência:** `360×800` / `390×844` (retrato)
- **Status:** `NOT_EXECUTED`

### Passos de Execução
1. Com o TalkBack ativado, abrir a URL da aplicação no Chrome Android e aguardar o anúncio inicial do título da página (`MUNDELO — Compreender é o primeiro cuidado`).
2. Realizar gestos de deslize para a direita (*swipe right* com um dedo) sequencialmente a partir do topo da página:
   - Verificar o anúncio do aviso ético institucional (`Protótipo ético em memória. Nenhum dado infantil real é solicitado ou armazenado.`).
   - Verificar o botão `Opções do Protótipo` (`botão, recolhido, menu pop-up`).
   - Verificar o botão da marca `MUNDELO — Ir para Início`.
   - Verificar o botão `Abrir menu de navegação` (`botão, recolhido`).
   - Verificar o seletor `Selecionar perfil da criança` (`Criança: Tomás (3 anos), caixa de combinação`).
   - Verificar o botão `Nova Observação`.
3. Ativar com duplo toque (`double-tap`) o botão `Abrir menu de navegação`:
   - Confirmar anúncio de estado expandido (`Fechar menu de navegação, botão, expandido`).
   - Navegar pelos itens do menu móvel (`Início`, `Diário`, `Meu Mundo`, `Descobertas`, `Compreender`, `Relatório`, `Privacidade`) e verificar que `Início` é anunciado como `página atual`.
4. Na região principal (`main`), usar o seletor de leitura do TalkBack (deslizar para baixo e depois para cima) configurado para **Títulos (Headings)**:
   - Confirmar salto direto entre `h1` (`Compreender é o primeiro cuidado.`), `h2` (`Tomás`), `h2` (`Acesso Rápido às Ferramentas de Escuta`), `h2` (`Últimos Registros no Diário`) e `h2` (`Descoberta Sem Tela Sugerida`).
5. Navegar até a barra inferior fixa (`Navegação móvel principal`) e confirmar que os 5 itens (`Início`, `Diário`, `Meu Mundo`, `Descobertas`, `Compreender`) são anunciados com seu papel de botão e estado `página atual` no item ativo.
6. Ativar com duplo toque o botão `Nova Observação`:
   - Confirmar que o foco do TalkBack entra no diálogo modal (`Nova Observação no Diário, diálogo`).
   - Deslizar até a lista de abas (`1. Fatos (Objetivo), guia, selecionado, 1 de 3`, `2. Hipóteses (Subjetivo), guia, 2 de 3`, `Visão Integrada, guia, 3 de 3`).
   - Ativar `2. Hipóteses (Subjetivo)` com duplo toque e verificar o anúncio da região `aria-live="polite"`: `Foco Ativo · Hipótese: Impressão subjetiva do cuidador`.
   - Realizar o gesto "Voltar" do Android (ou tocar em `Fechar formulário de observação`) e confirmar que o foco não se perde no fundo oculto.

### Critérios de Aceitação (TalkBack)
- [ ] Ordem de navegação por *swipe* corresponde 100% à ordem visual.
- [ ] Nenhum ícone SVG decorativo (`aria-hidden="true"`) é anunciado isoladamente como "imagem sem marcador".
- [ ] Estados `expandido/recolhido`, `selecionado` e `desativado` (quando cuidador sem vínculo está ativo) são vocalizados em português.
- [ ] Região `aria-live="polite"` anuncia a troca entre Fatos e Hipóteses e os toasts de confirmação.

---

## 3. Protocolo 2 — NVDA + Navegador (Windows)

- **Ambiente Alvo:** Windows 10/11 + NVDA 2024.1+ + Google Chrome ou Mozilla Firefox
- **Viewport de Referência:** `1280×800` / `1536×864`
- **Status:** `NOT_EXECUTED`

### Passos de Execução
1. Com o NVDA aberto (e o Visualizador de Fala / *Speech Viewer* habilitado para registro de log), carregar a Home e pressionar `Tab` uma vez a partir da barra de endereço:
   - Verificar que o link `Pular para o conteúdo principal` torna-se visível e é anunciado pelo NVDA.
   - Pressionar `Enter` e verificar que o foco salta para a região `main#main-content`.
2. Pressionar `Insert + F7` para abrir a **Lista de Elementos (Elements List)** do NVDA:
   - **Aba Marcos (Landmarks):** Confirmar a presença de `banner` (header), `Navegação principal; navegação`, `principal` (main) e `contentinfo` (footer).
   - **Aba Títulos (Headings):** Confirmar hierarquia sem saltos (`H1: Compreender é o primeiro cuidado.` → `H2: Tomás` → `H2: Acesso Rápido...` → `H3: Diário de Observações`, etc.).
   - **Aba Campos de Formulário:** Confirmar que os seletores possuem rótulo explícito (`Selecionar cuidador ativo simulado; caixa de combinação` e `Selecionar perfil da criança; caixa de combinação`).
3. No cabeçalho, focar o botão `Opções do Protótipo` e pressionar `Enter` ou `Espaço`:
   - Confirmar anúncio do menu (`Ações secundárias do protótipo; menu`).
   - Pressionar `Escape` e confirmar que o menu fecha e o foco retorna imediatamente ao botão `Opções do Protótipo`.
4. No seletor `Selecionar cuidador ativo simulado`, alternar para `Ana · Familiar (Sem vínculo)`:
   - Verificar em modo de navegação (*Browse Mode*, seta para baixo) a leitura do alerta de bloqueio (`Política Demonstrativa de Menor Privilégio`).
   - Verificar que o botão `Nova Observação` é anunciado como `Nova Observação; botão; indisponível`.
5. Restaurar o cuidador para `Helena (Mãe)` e acionar `Nova Observação`:
   - Confirmar anúncio de `Nova Observação no Diário; diálogo`.
   - Navegar até a `lista de guias` (`1. Fatos (Objetivo); guia selecionado; 1 de 3`).
   - Pressionar `Seta para a Direita` (em modo de foco / *Focus Mode*) para alternar para `2. Hipóteses (Subjetivo)` e verificar que:
     1. A guia `2. Hipóteses (Subjetivo)` passa a ser anunciada como `selecionado`.
     2. O foco é movido para o campo `Sua Hipótese ou Pergunta para Conversa; edição multilinha`.
     3. O indicador `aria-live="polite"` anuncia `Foco Ativo · Hipótese: Impressão subjetiva do cuidador`.
   - Pressionar `Escape` ou acionar `Cancelar` e verificar fechamento limpo do modal.

### Critérios de Aceitação (NVDA)
- [ ] Lista de Elementos (`Insert + F7`) exibe marcos, títulos e botões sem entradas vazias ou "botão sem rótulo".
- [ ] Transição automática entre *Browse Mode* e *Focus Mode* nos campos e nas abas `role="tablist"` funciona com setas direcionais (`ArrowRight` / `ArrowLeft`).
- [ ] Fechamento via `Escape` restaura o foco no botão acionador sem perda para `document.body`.

---

## 4. Protocolo 3 — VoiceOver + Safari (Apple macOS / iOS)

- **Ambiente Alvo:** macOS Sonoma+ com Safari 17+ (`Cmd + F5`) e/ou iOS 17+ com Safari Mobile
- **Viewport de Referência:** `1280×800` (macOS) e `390×844` (iOS)
- **Status:** `NOT_EXECUTED`

### Passos de Execução
1. Ativar o VoiceOver (`Cmd + F5` no macOS) e abrir a aplicação no Safari.
2. Abrir o **Rotor Web** (`VO + U` no macOS ou giro com dois dedos na tela no iOS):
   - Verificar a coluna **Marcos (Landmarks)**: `banner`, `Navegação principal navegação`, `principal`, `contentinfo`.
   - Verificar a coluna **Títulos (Headings)**: estrutura hierárquica `Nível 1` (`Compreender é o primeiro cuidado.`) e `Nível 2`/`Nível 3`.
   - Verificar a coluna **Controles de Formulário**: presença dos seletores nomeados e botões com nomes acessíveis iniciados pelo texto visível (WCAG 2.5.3).
3. Navegar com `VO + Seta Direita` pelo bloco de contexto da criança (`Tomás · 3 anos`):
   - Verificar que a lista de `Interesses & Fascínios` e `Fontes de Conforto` é lida com contexto claro de seção.
4. Acionar o botão `Nova Observação` (`VO + Espaço` ou duplo toque no iOS):
   - Verificar que o VoiceOver anuncia `Nova Observação no Diário, diálogo web`.
   - Navegar entre as abas `1. Fatos (Objetivo)`, `2. Hipóteses (Subjetivo)` e `Visão Integrada`, confirmando o anúncio `guia, 1 de 3, selecionado`.
   - Preencher uma observação de teste e clicar em `Salvar no Diário`:
     - Confirmar que o toast `Observação registrada no diário com sucesso!` (`role="status"`, `aria-live="polite"`) é vocalizado pelo VoiceOver sem interromper abruptamente a leitura em curso.

### Critérios de Aceitação (VoiceOver)
- [ ] Rotor Web (`VO + U`) lista corretamente Landmarks, Headings e Form Controls sem itens órfãos.
- [ ] Diálogo modal (`aria-modal="true"`) restringe a navegação virtual do VoiceOver ao interior do modal enquanto aberto (no Safari 16+).
- [ ] Anúncios educados (`aria-live="polite"`) são vocalizados ao alternar foco Fato/Hipótese e ao exibir notificações.
