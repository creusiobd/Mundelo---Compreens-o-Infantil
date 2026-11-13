# MUNDELO — Compreensão Infantil

> **Referência institucional:** [Manifesto de Princípios v1.0](docs/manifesto-principios-mundelo-v1.md) · [Principles Gate v1.0](docs/principles-gate-v1.md). Os princípios orientam produto, engenharia, acessibilidade, segurança e linguagem, sem implicar certificação de conformidade ou validação humana concluída.

> **Atualização de engenharia (12/11/2026):** o projeto evoluiu além da Etapa 1 descrita abaixo. O baseline v1.1 inclui cofre local criptografado experimental, autorização/RBAC demonstrativo e testes Playwright de UI, E2E e acessibilidade. Estes controles não constituem homologação clínica nem certificação integral WCAG 2.2 AA. Veja [continuidade](docs/continuidade.md), [relatório UX-REAL-02](docs/ux-real-02-report.md) e [roteiro assistivo](docs/ux-real-01b-assistive-manual.md). Validações manuais com leitores de tela e teste físico SEC-23 permanecem pendentes.\n\n> **Slogan:** Cada criança, um mundo. Cada vínculo, uma descoberta.  
> **Frase de Produto:** Compreender é o primeiro cuidado.  
> **Público-alvo:** Responsáveis e cuidadores de crianças de 0 a 5 anos.

---

## 1. Visão Geral & Missão

O **Mundelo** é uma plataforma acolhedora criada para ajudar famílias e cuidadores de crianças na primeira infância (0 a 5 anos) a:
1. **Registrar observações contextuais** do cotidiano (fatos objetivos, antecedentes e acolhimento).
2. **Reconhecer preferências, sensibilidades e necessidades singulares** (fontes de conforto, fascínios, modos de comunicação e estratégias experimentadas).
3. **Celebrar conquistas no tempo próprio de cada infância**, sem rankings punitivos ou cronômetros de comparação.
4. **Preparar informações qualificadas para conversas presenciais** com pediatras, educadores, terapeutas ocupacionais e fonoaudiólogos.

### Compromisso Ético e Limites Inegociáveis
- **Não Diagnóstico:** O Mundelo **não** emite diagnósticos, **não** prevê transtornos ou síndromes e **não** substitui o acompanhamento médico, psicológico ou terapêutico.
- **Não Rotulação:** Crianças nunca são classificadas por &quot;capacidade&quot;, &quot;risco&quot; ou &quot;normalidade&quot;.
- **Foco no Ambiente e no Vínculo:** O sofrimento ou a desregulação são compreendidos como respostas ao contexto (luz, ruído, cansaço, transição brusca), e não como &quot;defeitos&quot; da criança.

---

## 2. Escopo Desta Etapa (Etapa 1)

Nesta primeira entrega, foi desenvolvido **exclusivamente um protótipo web/PWA responsivo e navegável com dados 100% fictícios em memória**:
- **Zero armazenamento de dados reais:** Nenhum dado de criança real é solicitado, transmitido ou gravado.
- **Sem persistência no `localStorage`:** Informações infantis não persistem no disco rígido local, prevenindo vazamentos em computadores compartilhados. Ao fechar ou recarregar a aba, a sessão volta ao estado seguro inicial.
- **Zero chamadas para serviços externos ou LLMs:** Todas as visualizações de padrões e hipóteses no painel *Compreender* são puramente descritivas e locais.
- **Alternância de Estados:** Permite transitar livremente entre o perfil pré-carregado ("Tomás", 2 anos e 8 meses), perfil de bebê ("Lia", 1 ano e 4 meses) e o **Modo Estado Vazio** para testar fluxos de onboarding do zero.

---

## 3. Design System & Acessibilidade (WCAG AA)

### Paleta de Cores
- **Verde Profundo (`#133E43`):** Cor primária institucional, autoridade serena e acolhedora.
- **Verde Elo (`#80C5B5`):** Conexão, afeto e acentos de destaque positivos.
- **Areia Solar (`#F1CA91`):** Calor orgânico e elementos de reflexão/atenção.
- **Marfim (`#F8F5EF`):** Fundo neutro acolhedor e descansado para os olhos.
- **Rosa Argila (`#CFA5A0`):** Sensibilidade humana, pontos de desconforto e ações de cuidado.

### Tipografia
- **Títulos e Destaques:** *Nunito Sans* (amigável, geométrica, com cantos suavemente acolhedores).
- **Textos Correntes e Dados:** *Inter* com algarismos tabulares (`tabular-nums`) para legibilidade e clareza.

### Acessibilidade & Ergonomia Touch-First
- **Áreas de Toque:** Todos os botões, abas e seletores possuem área interativa de pelo menos **44x44 px** (48px nas ações primárias).
- **Contraste WCAG AA:** Relações de contraste superiores a 4.5:1 para texto normal e 3:1 para elementos de interface.
- **Foco Visível:** Anéis de foco nítidos (`:focus-visible`) para navegação integral via teclado.
- **Redução de Movimento:** Respeito automático à diretiva de acessibilidade `prefers-reduced-motion`.
- **Feedback Auditivo/Visual:** Live regions `aria-live="polite"` para confirmação e erros em tempo real.
- **Anti-Slop Visual:** Sem pílulas empilhadas desnecessárias (*zero-pill metadata*), sem selos artificiais de pontuação e sem botões decorativos inoperantes.

---

## 4. Arquitetura do Código

```
src/
├── components/
│   ├── BottomNav.tsx               # Navegação inferior ergonômica para polegar (mobile)
│   ├── DeleteConfirmModal.tsx      # Modal acessível de confirmação de exclusão
│   ├── Header.tsx                  # Top Bar Contract, troca de perfis e modo vazio
│   ├── NotificationToast.tsx       # Alertas acessíveis aria-live
│   ├── ObservationDetailModal.tsx  # Pré-visualização completa com distinção de fatos e hipóteses
│   └── ObservationModal.tsx        # Formulário estruturado de criação e edição
├── context/
│   └── AppContext.tsx              # Estado global unificado 100% em memória
├── data/
│   └── mockData.ts                 # Perfis fictícios (Tomás, Lia) e atividades de descoberta
├── screens/
│   ├── WelcomeScreen.tsx           # Tela 1: Boas-vindas, manifesto e limites éticos
│   ├── OnboardingScreen.tsx        # Tela 2: Onboarding de perfil (sem perguntas diagnósticas)
│   ├── HomeScreen.tsx              # Tela 3: Início, saudação, resumo e observações recentes
│   ├── JournalScreen.tsx           # Tela 4: Diário temporal, filtros, busca e CRUD
│   ├── MyWorldScreen.tsx           # Tela 5: Mapa de interesses, confortos e estratégias
│   ├── DiscoveriesScreen.tsx       # Tela 6: Catálogo de atividades offline (0 a 5 anos)
│   ├── UnderstandScreen.tsx        # Tela 7: Painel descritivo de padrões e hipóteses
│   ├── ReportScreen.tsx            # Tela 8: Síntese estruturada para reuniões/consultas
│   └── PrivacyScreen.tsx           # Tela 9: Manifesto de privacidade e roadmap seguro
├── types/
│   └── index.ts                    # Interfaces de TypeScript estritas
├── App.tsx                         # Roteamento de telas e orquestração de modais
├── main.tsx                        # Ponto de entrada React 19
└── index.css                       # Design tokens, tipografia e regras de foco
```

---

## 5. Modelo de Observação Estruturado

Cada observação registrada no diário atende rigorosamente aos seguintes campos:
```typescript
interface Observation {
  id: string;
  occurredAt: string;            // Data e horário da ocorrência
  environment: EnvironmentType;  // 'casa' | 'parque' | 'escola' | 'transporte_consulta' | 'reuniao_familia' | 'outro'
  observerRole: ObserverRole;    // 'mae' | 'pai' | 'avo' | 'cuidador' | 'educador' | 'terapeuta' | 'outro'
  eventType: EventType;          // 'conquista' | 'desconforto' | 'rotina' | 'descoberta'
  description: string;           // FATOS OBSERVÁVEIS: o que ocorreu objetivamente, sem julgar
  antecedents: string;           // CONTEXTO: sons, luz, transição, fome ou "Não observado"
  communicationSignals: string;  // SINAIS CORPORAIS: gestos, contato visual, choro, apontar
  supportOffered: string;        // ACOLHIMENTO: intervenção do adulto (colo, abaixar na altura dos olhos)
  observedOutcome: string;       // RESPOSTA OBSERVADA: como a criança respondeu ao suporte
  positiveAspects: string;       // FORÇAS: potências demonstradas na situação
  notes: string;                 // HIPÓTESE: reflexão pessoal do cuidador, nunca diagnóstico
}
```

---

## 6. Telas da Aplicação

1. **Boas-vindas & Manifesto:** Apresenta a visão de mundo do Mundelo, o slogan, os 3 pilares do cuidado observacional e os limites sobre o que o produto é e o que **não** é.
2. **Onboarding Demonstrativo:** Permite personalizar o perfil ativo ou alternar entre os modelos pré-definidos, definindo interesses, âncoras de conforto e modos de comunicação sem jamais solicitar diagnósticos clínicos.
3. **Início (Dashboard):** Saudação calorosa de acordo com a hora do dia, card de identificação da criança, botões de ação rápida (48px+), métricas da sessão e observações recentes com acesso direto aos detalhes.
4. **Diário:** Linha temporal completa com filtros por tipo de evento (`conquista`, `desconforto`, `rotina`, `descoberta`), ambiente, busca textual livre, ordenação, botões para incluir em relatório, editar e excluir com diálogo de confirmação.
5. **Meu Mundo:** Matriz das singularidades infantis contendo abas interativas para *Interesses*, *Fontes de Conforto*, *Sensibilidades Relatadas*, *Formas de Comunicação*, *Conquistas Celebradas* e *Estratégias Experimentadas*, com formulário em linha para adicionar novos itens.
6. **Descobertas:** Catálogo de atividades sem tela supervisionadas, categorizadas por faixa etária (0-1, 1-2, 2-3, 3-5 anos) e foco vincular, com botão que preenche automaticamente um novo registro no diário.
7. **Compreender:** Painel descritivo demonstrativo que mapeia a distribuição de ambientes e tipos de registro, além de apresentar hipóteses contextuais de co-regulação (transições avisadas, ruídos súbitos, presença no mesmo plano de visão) e perguntas reflexivas para diálogos profissionais.
8. **Relatório:** Ferramenta para selecionar registros pontuais e gerar uma síntese estruturada pronta para impressão (`window.print`) ou cópia direta em texto para reuniões escolares e consultas médicas.
9. **Privacidade & Princípios:** Explicação didática da arquitetura em memória, garantias contra comercialização de dados infantis e compromisso com o esquecimento seguro.

---

## 7. Backlog para a Etapa 2 (Próximos Passos)

1. **Persistência Segura & Criptografia Ponta-a-Ponta (E2EE):**
   - Configuração de banco de dados relacional com chaves derivadas da senha familiar.
   - Nenhuma leitura de notas ou descrições em texto puro no servidor.
2. **Autenticação Parental Multi-Usuário:**
   - Convite seguro entre responsáveis (mãe, pai, avós) com papéis granulares de leitura/escrita.
3. **PWA Completo com Armazenamento Local Criptografado:**
   - Manifesto PWA, ícones adaptativos e Service Worker para funcionamento 100% offline em dispositivos móveis.
4. **Exportação & Portabilidade:**
   - Exportação em arquivos abertos JSON criptografados e PDF assinado digitalmente para transferência segura de prontuários.
5. **Links Temporários com Expiração:**
   - Criação de links de leitura temporários (ex: válidos por 48 horas) para consulta do relatório por pediatras sem necessidade de login.
