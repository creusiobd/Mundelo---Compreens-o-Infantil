# MUNDELO | Dossiê de Maturidade Técnica, Institucional e de Produto v0.1

**Data de corte:** 16/11/2026.  
**Estado:** baseline documental para discussão e investigação de mercado, **não** laudo independente, certificação ou autorização para usar dados reais.  
**Fontes primárias:** repositório `creusiobd/Mundelo---Compreens-o-Infantil` e relatos de execução do responsável registrados em `docs/continuidade.md` e `docs/ux-real-01b-assistive-manual.md`.  
**Baseline técnico:** protótipo React/TypeScript/Vite MUNDELO v1.1, dados sintéticos, demonstração estática GitHub Pages.

## 1. Resumo executivo

O MUNDELO é um **protótipo demonstrativo de compreensão contextual da infância (0 a 5 anos)**. Auxilia cuidadores a registrar fatos cotidianos, distinguir observações de hipóteses, explorar interesses e fontes de conforto e preparar conversas com outros adultos e profissionais. **Não é ferramenta de diagnóstico, triagem clínica ou predição de transtornos.**

A tese de produto é relevante como **hipótese de valor**: adultos podem se beneficiar de um instrumento para preservar contexto e dialogar sobre o cuidado sem transformar comportamentos isolados em rótulos. **Esta hipótese ainda não foi validada comercialmente nem por estudo estruturado com famílias externas**.

**Situação resumida:** arquitetura e interface demonstrativas construídas; manifesto e gate institucional formalizados; testes automatizados registrados; acesso HTTPS e primeiros testes TalkBack relatados; inconsistência de autorização observada pelo testador, mitigada no PR #6 e reteste consolidado relatado como validado, sem evidência granular independente. Projeto **apto a apresentar uma demo sintética e conduzir descoberta de usuários supervisionada**, **não apto** a operar com dados reais de crianças nem a declarar conformidade WCAG total ou segurança de produção.

## 2. Razão de existir e problema a investigar

### Formulação editorial da origem

A motivação humana discutida nas conversas nasce de uma inquietação parental: **o que um adulto perde quando interpreta antes de observar?** Essa é uma *síntese narrativa do fundador*, não uma pesquisa biográfica independente, uma cronologia literal de eventos familiares, nem prova de que outras famílias tenham a mesma dificuldade.

### Hipótese de problema

Registros e impressões sobre a criança podem estar dispersos, descontextualizados ou misturados com interpretações. Um diário contextual pode ajudar a distinguir o que ocorreu, em que condições ocorreu, como o adulto respondeu e o que permanece incerto.

### Hipótese de benefício

Ao separar fatos, antecedentes, respostas observadas e hipóteses, o cuidador pode chegar a conversas mais específicas e respeitosas. **A melhoria da qualidade dessas conversas, da confiança ou do bem-estar infantil ainda precisa ser medida, sem atribuir causalidade antecipadamente.**

## 3. Proposta, produto e fronteiras

**Público pretendido:** familiares e cuidadores de crianças de 0 a 5 anos; profissionais/escolas como interlocutores de informação contextual, e não canais de compartilhamento real já habilitados.

**Funcionalidades encontradas no baseline:** boas-vindas e onboarding demonstrativos; Home; Diário de Observações; Meu Mundo (interesses e fontes de conforto); Descobertas (atividades supervisionadas sem tela); Compreender (síntese descritiva local); Relatório para conversa; Privacidade; seletores fictícios de criança e cuidador.

**Diferenciação proposta, não comprovada no mercado:** (1) separação explícita fato/hipótese; (2) linguagem sem rotulação; (3) incentivo à compreensão contextual e diálogo; (4) governança institucional explícita; (5) acessibilidade tratada desde a concepção.

**Proibições/limites:** nada de diagnóstico automático, escore de normalidade, vigilância infantil contínua, substituição de profissionais, inserção de dados reais na demo pública ou alegação de proteção de backend. No protótipo o controle RBAC é **simulado no cliente**. O cofre WebCrypto local é **experimental**, não homologado para produção.

## 4. Linha do tempo verificável

| Data / fase | Marco | Natureza da evidência | Fonte |
| --- | --- | --- | --- |
| 12/11/2026 | Relatório UX-REAL-02: seis telas internas, matriz de sete viewports, 42 capturas automatizadas e varreduras de acessibilidade no escopo descrito | Relatório técnico no repositório, sem auditoria externa | [UX-REAL-02](ux-real-02-report.md) |
| 13/11/2026 | Manifesto institucional de 12 princípios e Principles Gate | Documentação e commits integrados | [Manifesto](manifesto-principios-mundelo-v1.md), [Gate](principles-gate-v1.md), PR #2 |
| 13/11/2026 | Workflow de demo HTTPS no GitHub Pages via disparo manual | Workflow integrado; acesso relatado pelo executor | [DEVICE-REAL-01](device-real-01-talkback-staging.md), PR #3 |
| 13/11/2026 | Três jornadas TalkBack no Galaxy Tab S10 Ultra (navegar; abrir observação; fechar modal) | **3/3 PASS declarados pelo executor**, sem transcrição de voz anexa | [UX-REAL-01B](ux-real-01b-assistive-manual.md), PR #4 |
| 14/11/2026 | Teste Ana (sem vínculo) indicou escrita aparentemente aceita e registro encontrado ao retornar para Helena | **Incidente relatado**, não reproduzido independentemente | [Continuidade](continuidade.md), PR #5 |
| 15–16/11/2026 | PR #6 integrou guardas de entrada/edição, propagação do resultado de escrita e E2E de regressão | Código presente na main, CI do PR #6 aprovado | PR #6, `src/App.tsx`, `src/components/ObservationModal.tsx`, `tests/e2e/device-real-02-authorization.spec.ts` |
| 15–16/11/2026 | Executor respondeu “validado” ao pedido de reteste no Galaxy Tab; PR #7 incorporou o registro | **PASS_REPORTED**, sem matriz discriminada Ana/Helena ou SHA de deploy registrado | PR #7, [Continuidade](continuidade.md) |

**Observação sobre datas:** algumas datas são de execução humana relatada e outras são de integração UTC no GitHub; não devem ser confundidas em material público.

## 5. Matriz de maturidade e afirmações permitidas

| Dimensão | Evidência atual | Nível de alegação permitido | O que falta |
| --- | --- | --- | --- |
| Visão/ética | Manifesto de 12 princípios e Principles Gate institucional | “Princípios definidos e adotados como referência” | Aplicação sistemática e revisão independente por mudança |
| UX/interface | Telas demonstrativas e testes E2E/responsivos no escopo documentado | “Protótipo responsivo e navegável testado automaticamente” | Pesquisa real de compreensão e usabilidade com público-alvo |
| Acessibilidade | Testes automatizados; três jornadas físicas TalkBack PASS relatadas | “Primeiros testes positivos com TalkBack em dispositivo Android” | Roteiro assistivo integral, NVDA/VoiceOver e pessoas diversas, inclusive externas |
| Segurança/autorização | RBAC no cliente, testes; regressão PR #6 e reteste relatado | “Regras demonstrativas reforçadas; regressões automatizadas” | Backend seguro, autenticação real, isolamento por usuário, teste de ameaça, auditoria |
| Privacidade | Memória volátil para observações demonstrativas, cofre local WebCrypto experimental | “Demo com dados fictícios e armazenamento local experimental” | Política operacional, governança de dados, SEC-23, revisão LGPD e retenção/eliminações efetivas |
| Engenharia | TypeScript, CI, E2E, relatórios e versionamento Git | “Pipeline e evidências técnicas reprodutíveis no repositório” | Observabilidade operacional, desempenho, segurança de produção e incident response |
| Validação de problema | Motivação do fundador e hipóteses de uso | “Problema proposto para investigação” | Entrevistas externas, frequência, alternativas atuais, evidências de gravidade |
| Mercado/receita | Nenhuma medição comercial anexada | “Modelo em hipótese” | Segmentação, concorrentes, preços testados, intenção real de pagamento, CAC/LTV |
| Impacto | Teoria de mudança proposta | “Intenção de melhorar o diálogo e registro contextual” | Estudos de tarefa/resultado; sem alegação clínica ou causal |

**Gates:** protótipo demonstrativo = avanço; estudos de descoberta com dados mínimos e ambiente controlado = próximos; produção com dados de crianças = **BLOCKED** até segurança real, política de privacidade e validações adequadas.

## 6. Reconciliação do incidente DR02-TB-01B

**Relato inicial:** testador selecionou Ana (sem vínculo), abriu Nova Observação, recebeu “Sucesso” e encontrou `TESTE-ANA-001` no Diário de Helena. **Isso justifica registrar risco P1 até investigação.**

**Código anterior:** o frontend deveria negar gravação sem vínculo; contudo, o modal fechava independentemente de `addObservation` retornar `false`. Esse defeito estático foi identificado. **Ele não prova nem explica sozinho a aparente persistência relatada.**

**Mitigação incorporada:** guardas de `canCreate/canEdit` nas entradas de fluxo; resposta booleana de criação/edição propagada ao formulário; modal só fecha após operação aceita; teste de regressão Playwright.

**Reteste:** testador respondeu “validado” após solicitação dirigida; resultado corretamente registrado como `VALIDATED_BY_REPORTER`. **Ainda faltam** prova do SHA publicado, valores individualizados dos casos Ana/Helena e eventual reprodução instrumental da causa raiz.

**Decisão:** não divulgar incidente como “causa raiz definitivamente eliminada”, nem dizer que a autenticação/autorização está pronta para dados reais. A demo permanece apenas sintética.

## 7. Evidências e links internos

- [README e arquitetura demonstrativa](../README.md)
- [Manifesto v1.0](manifesto-principios-mundelo-v1.md)
- [Principles Gate](principles-gate-v1.md)
- [Relatório UX-REAL-02](ux-real-02-report.md)
- [Roteiro UX-REAL-01B](ux-real-01b-assistive-manual.md)
- [Ambiente e teste DEVICE-REAL-01](device-real-01-talkback-staging.md)
- [Histórico técnico](continuidade.md)
- PR #2: https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/2
- PR #3: https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/3
- PR #4: https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/4
- PR #6: https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/6
- PR #7: https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/7

## 8. Roadmap com gates verificáveis

### Gate A — Encerramento documental do laboratório (prioridade imediata)

- Identificar URL HTTPS efetiva, commit/SHA da demo, data e versões Android/Chrome/TalkBack.
- Repetir com dados sintéticos e registrar *separadamente*: Ana não cria; Helena cria; alternância não revela dados fora de vínculo.
- Registrar comandos, mensagens de confirmação/negação e evidências não sensíveis.
- Completar TalkBack (ordem, estados, aria-live, foco, paisagem/retrato), executar NVDA e VoiceOver em seus ambientes, SEC-23 em hardware adequado.
- Resultado exigido: matriz PASS/FAIL/BLOCKED assinada pelo executor e riscos residuais.

### Gate B — Pesquisa de problema com responsáveis (antes de preços)

- Preparar roteiro de entrevistas não sugestivas e consentimento; usar apenas experiências dos adultos, **sem nomes, detalhes identificadores ou registros de crianças**.
- Meta exploratória proposta: 12–15 entrevistas com responsáveis variados. É um **alvo de pesquisa**, não amostra representativa.
- Perguntas: como se recordam de acontecimentos? onde anotam? em que situações perdem contexto? o que já usam? o que rejeitariam registrar? com quem compartilham? qual esforço aceitam?
- Critério de continuação a definir *antes* das entrevistas: sinais concretos de problema frequente, alternativas insatisfatórias e vontade de experimentar.

### Gate C — Teste de valor com demo sintética

- Executar 5–8 testes de tarefas por ciclo com participantes adultos e roteiros replicáveis; números são **metas de execução**, não resultados.
- Tarefas: registrar fato vs hipótese, recuperar evento, preparar relato, compreender permissão negada, navegar com recursos assistivos.
- Medir taxa de conclusão, tempo, erros, compreensão, esforço declarado e preocupações de privacidade, sem coletar notas infantis reais.
- Revisar mensagens e produto antes de qualquer sistema de contas.

### Gate D — Pré-piloto real (bloqueado por arquitetura e conformidade)

- Especificar backend autenticado, autorização por vínculo validada no servidor, segregação de famílias/crianças, observabilidade sem PII, controles LGPD apropriados e avaliação de segurança independente.
- Definir finalidade, base legal, minimização, retenção, eliminação, consentimento/responsabilidades, incidentes e acesso por profissionais com revisão especializada.
- Não iniciar coleta de dados infantis reais apenas porque o protótipo é acessível ou possui criptografia experimental.

## 9. Critérios de avanço e riscos

| Risco | Consequência | Resposta |
| --- | --- | --- |
| Confundir demo com produto seguro | Exposição de dados reais | Dados somente sintéticos; backend seguro como pré-requisito |
| Inferir diagnóstico de padrões | Dano ético e clínico | Linguagem observacional e revisão de conteúdo |
| Generalizar 3 PASS TalkBack | Alegação de inclusão infundada | Teste assistivo abrangente e com participantes diversos |
| Concluir mercado sem pesquisa | Construção sem demanda | Entrevistas, tarefas e evidência de adoção |
| Publicar números de mercado não verificados | Perda de credibilidade | Distinguir estimativas, hipóteses e dados com fonte |
| Sobrecarga de registro para cuidadores | Baixa adoção | Medir esforço e frequência de uso voluntário |
| Incentivos comerciais voltados a dados sensíveis | Violação de confiança | Modelo sem venda/perfilamento de dados infantis |

## 10. Decisão executiva recomendada

**GO** para apresentação pública do **problema, princípios, protótipo sintético e trajetória de engenharia**, usando linguagem factual.  
**GO CONDICIONAL** para entrevistas externas e testes de tarefas com adultos, mediante escopo de privacidade minimizado.  
**NO-GO** para produção com dados reais, alegações clínicas, conformidade integral ou monetização como produto já validado.

**Próximo artefato:** [Narrativa de fundação, pitch e hipóteses de go-to-market v0.1](mundelo-founder-story-gtm-v0-1.md).  

> “Compreender é o primeiro cuidado.” É uma tese institucional. Transformá-la em valor comprovado exige escuta, testes e responsabilidade, não apenas um bom pitch.
