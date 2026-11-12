# Relatório de Auditoria Técnica e de Privacidade — Foundation v0.2
**Projeto:** MUNDELO — Compreensão Infantil  
**Auditor:** Principal Software Engineer & Privacy Architect  
**Data:** 12 de Novembro de 2026  
**Status do Baseline Auditado:** Foundation v0.1

---

## 1. Sumário Executivo

A auditoria inspecionou a totalidade dos componentes, modelos de tipos, gerenciamento de estado e fluxos de navegação da versão Foundation v0.1. A aplicação cumpre com rigor os requisitos de ausência de backend, ausência de APIs de IA ativas, ausência de cookies e ausência de banco de dados.

Contudo, foram identificadas **vulnerabilidades de isolamento lógico de dados** e **fragilidades de integridade relacional** entre os perfis fictícios de demonstração (*Tomás* e *Lia*). Adicionalmente, identificou-se ausência de validação canônica de schemas em tempo de execução e pequenas incongruências em declarações textuais na interface sobre conformidade regulatória.

---

## 2. Mapa Arquitetural da Aplicação

- **Framework:** React 19.0.1 (SPA montada via Vite 8.3.0).
- **Tipagem:** TypeScript 7.0.2 com verificação estrita (`noEmit: true`).
- **Estilização:** Tailwind CSS v4 (`@tailwindcss/vite` com tokens semânticos e CSS nativo).
- **Componentes Principais:**
  - `Header.tsx`: Top bar contract, seletor de criança, botão de ação e simulação de estado vazio.
  - `BottomNav.tsx`: Navegação inferior ergonômica para polegar (mobile).
  - `ObservationModal.tsx`: Formulário estruturado de registro e edição.
  - `ObservationDetailModal.tsx`: Detalhamento reflexivo e seleção para relatório.
  - `DeleteConfirmModal.tsx`: Diálogo modal de confirmação acessível.
  - `NotificationToast.tsx`: Região viva (`aria-live="polite"`) de anúncios do sistema.
- **Telas (9):**
  - `WelcomeScreen`: Manifesto e limites éticos.
  - `OnboardingScreen`: Configuração e alternância de perfil fictício.
  - `HomeScreen`: Dashboard acolhedor, ações rápidas e observações recentes.
  - `JournalScreen`: Linha temporal, filtros e gerenciamento de registros.
  - `MyWorldScreen`: Mapeamento de interesses, conforto, comunicação e estratégias.
  - `DiscoveriesScreen`: Catálogo de atividades offline (0 a 5 anos).
  - `UnderstandScreen`: Padrões e hipóteses observacionais descritivas.
  - `ReportScreen`: Síntese estruturada para impressão e diálogo profissional.
  - `PrivacyScreen`: Manifesto de privacidade e garantias éticas.

---

## 3. Matriz de Achados e Severidade

| ID | Área | Descrição do Achado | Severidade | Evidência no Código | Correção Recomendada |
|---|---|---|---|---|---|
| **SEC-01** | Isolamento Lógico | Observações não vinculadas a `childId`; vazamento cruzado entre perfis de demonstração | **ALTA (SEV-1)** | `MOCK_OBSERVATIONS` era um vetor único em `AppContext.tsx`; ao alternar para *Lia*, os registros de *Tomás* permaneciam visíveis no Diário, Início, Compreender e Relatório. | Adicionar `childId` obrigatório em `Observation`, criar dados específicos para cada perfil e filtrar por perfil ativo. |
| **SEC-02** | Contrato Temporal | Falta de separação entre data do fato e data de registro (`occurredAt` vs `recordedAt`) e ausência de proveniência | **MÉDIA (SEV-2)** | `Observation` continha apenas `occurredAt`, sem rastrear quando o cuidador inseriu a nota ou se a observação foi direta ou relatada por terceiros. | Expandir contrato com `recordedAt` e enum `provenance: 'DIRECT' \| 'REPORTED_BY_OTHER'`. |
| **SEC-03** | Validação de Schema | Validação ad-hoc informal no formulário; sem schema canônico de runtime | **MÉDIA (SEV-2)** | Validação baseada apenas em `if (!description.trim())` no componente React, aceitando strings nulas ou campos corrompidos em caso de injeção programática. | Implementar schemas canônicos com Zod e rejeitar referências inválidas. |
| **SEC-04** | Integridade de Relatório | Possibilidade de incluir registros de crianças distintas em uma mesma síntese | **ALTA (SEV-1)** | `selectedObservationIds` em `ReportScreen.tsx` não validava se o ID pertencia à criança em foco, gerando relatórios com registros cruzados. | Filtrar a seleção estritamente por `childId === activeProfile.id`. |
| **SEC-05** | Declaração Regulatória | Menção a &quot;em conformidade com LGPD / COPPA / RGPD&quot; em texto explicativo | **BAIXA (SEV-4)** | Frase em `PrivacyScreen.tsx` e `README.md` sugeria certificação regulatória formal em vez de intenção de desenho arquitetural. | Ajustar redação para &quot;alinhado com as diretrizes e boas práticas de privacidade infantil&quot;, sem alegar certificação prévia à auditoria legal formal. |

---

## 4. Auditoria de Armazenamento e Telemetria

- **`localStorage`:** Inspecionado via grep `grep -rnE 'localStorage' src`. **Resultado: ZERO utilizações.**
- **`sessionStorage`:** Inspecionado. **Resultado: ZERO utilizações.**
- **`IndexedDB`:** Inspecionado. **Resultado: ZERO utilizações.**
- **Cookies:** Inspecionado. **Resultado: ZERO utilizações.**
- **Rede / Fetch / Telemetria:** Inspecionado via grep `grep -rnE 'fetch|XMLHttpRequest|navigator\.sendBeacon|gtag' src`. **Resultado: ZERO requisições externas.**
- **Conclusão:** A premissa de execução 100% volátil em memória e isolamento estrito está plenamente preservada.

---

## 5. Auditoria de Acessibilidade (WCAG AA)

- **Alvos de Toque:** Todos os botões e seletores da interface possuem dimensões mínimas de $44 \times 44\text{px}$ (ou $48 \times 48\text{px}$ para CTAs primárias).
- **Contraste de Cores:**
  - Verde Profundo (`#133E43`) sobre Marfim (`#F8F5EF`): Contraste $\approx 10.4:1$ (excede amplamente os 4.5:1 exigidos pela WCAG AA).
  - Verde Elo (`#80C5B5`) e Areia Solar (`#F1CA91`): Utilizados estritamente como acentos com texto escuro garantindo contraste adequado.
- **Navegação por Teclado:**
  - Anéis de foco nítidos com `:focus-visible { outline: 3px solid #133E43; }`.
  - Skip link acessível implementado no topo do DOM (`#main-content`).
  - Fechamento de diálogos com `Esc` e foco delimitado.
  - Ausência de animações agressivas e suporte integral a `prefers-reduced-motion`.

---

## 6. Plano de Ação para a Foundation v0.2

1. **Camada de Contratos Canônicos:** Criar `src/types/index.ts` e `src/validation/schemas.ts` com Zod para validação rigorosa em tempo de execução.
2. **Isolamento de Dados em Memória:** Associar cada registro a seu respectivo `childId` e prover amostras distintas para Tomás e Lia.
3. **Imutabilidade e Integridade de Operações:** Blindar funções do `AppContext` contra mutações cruzadas e seleções espúrias no relatório.
4. **Modelo de Ameaças:** Elaborar `docs/threat-model.md` e ADR de criptografia em `docs/adr/001-estrategia-criptografia.md`.
5. **Conjunto de Testes Automatizados:** Testar isolamento, validações, integridade do relatório e ausência de persistência.
