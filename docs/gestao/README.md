# MUNDELO — Gestão e Entregas

Atualizado em 20/11/2026. Responsável atual: **Creusio Kizua**, idealizador e desenvolvedor, responsável por produto, governança e execução técnica conforme sua declaração.

**[Abrir o GitHub Project](https://github.com/users/creusiobd/projects/4)** · [Tarefas](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues) · [Marcos](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/milestones)

## Ponto de retomada

PM-001/#22 está concluída pela PR #37. TEC-001/#23 está concluída pela [PR #38](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/38), incorporada no commit `1b491b198df651d9e32b67c6328ceae384948f3e`, com verificações automáticas aprovadas. Seu [diagnóstico](../auditoria/tec-001/README.md) é a base técnica, sem promessa de aderência integral.

GOV-002/#28 está concluída pela [PR #39](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/39), incorporada no commit `f1ffbc13dae489651d145f1d916b38a09bab31d8`. GOV-003/#30 tem [modelo de verificação adicional entregue para revisão](../governanca/gov-003/README.md): conferência técnica, gatilhos/fases para outra pessoa competente e tratamento da indisponibilidade. Nenhum revisor adicional foi nomeado.

TEC-003/#31 está pronta para especificar autorização, versões e propagação, usando TEC-001 e GOV-002 incorporadas e as decisões em revisão de GOV-003 explicitamente como propostas. INF-002/#24 permanece pronta para conciliação das fontes acessíveis. Implementação, validação jurídica/capacidade e dados reais continuam com seus próprios gates.

## Organização

- [Backlog e critérios de conclusão](backlog.md): 15 tarefas com prioridades, dependências e entregas.
- [Sprints](sprints.md): três ciclos de duas semanas, uma execução por vez.
- [Marcos e entregas](marcos-entregas.md): cinco marcos e evidências documentais já incorporadas.
- [Bloqueios](bloqueios.md): cinco causas acompanhadas, responsáveis e condições de desbloqueio.
- [Processo e atualização](processo.md): estados, prontidão, conclusão e rotina de revisão.
- [Plano estruturado](plano.json): índice para conferência e futuras atualizações.

## Estado de acompanhamento — 20/11/2026

| Estado de planejamento | Quantidade |
|---|---:|
| Concluído | 3 |
| Em revisão | 1 |
| Pronto | 2 |
| Planejado | 3 |
| Bloqueado | 6 |

Os números refletem esta atualização documental, sem acompanhamento automático. A issue e o campo Status do Project devem ser atualizados quando houver mudança. Prioridades e dependências detalhadas estão nas issues; a visualização do Project é um apoio ao acompanhamento.

## Limites das evidências

Há 73 identificadores INF-ID com algum texto normativo documentado e 219 sem transcrição; isso não significa 73 princípios canônicos integralmente conferidos. A exportação integral ainda é uma dependência. Os 16 cenários de retenção foram descritos, sem execução comprovada. Aprovação de documentos não comprova implementação, validação jurídica ou liberação de dados reais de crianças.

Nenhum princípio novo deve ser acrescentado durante a recuperação. Fontes sincronizadas em `sources/` são somente leitura.


## Atualização — TEC-003 / 20/11/2026

Consultar o [registro de andamento TEC-003](andamentos/2026-11-20-tec-003.md) e sua [especificação lógica](../especificacoes/tec-003/README.md). Este registro sucede os retratos anteriores para esta frente: GOV-002 já foi incorporada pela PR #39; GOV-003/PR #40 foi incorporada durante a preparação no commit `65f369b53b182b6094b00658b7a741a0f2e877ad`, com aplicação e revisor independente ainda pendentes. TEC-003 é entregue para revisão, sem implementação ou execução dos cenários propostos. Os campos do Project não foram sincronizados automaticamente.


## Atualização — QA-001 / 20/11/2026

TEC-003/#31 incorporada pela PR #41 (`59efcd56b006768540863fbc1e2fcbb144ae3007`). [QA-001/#32](andamentos/2026-11-20-qa-001.md) entrega para revisão o [roteiro dos 16 cenários](../qa/qa-001/README.md), com preparação sintética e fichas de execução. Ambiente demonstrativo identificado; capacidades ausentes bloqueiam a aceitação específica, sem impedir esta preparação. Nenhum cenário de retenção foi executado por esta entrega. GOV-003/PR #40 já incorporada; aplicação/revisor continuam pendentes. Sem sincronização automática do Project.


## Atualização — QA-002 / 20/11/2026

QA-001/#32 incorporada pela PR #42. [QA-002/#33](andamentos/2026-11-20-qa-002.md) entrega [execução sintética e relatório](../qa/qa-002/README.md): um controle positivo PASS e quatro diagnósticos FAIL, com #43–#46 abertas. R01–R16 integrais permanecem BLOCKED por pré-condições não demonstradas; não há liberação do produto. CI histórica e diagnóstico são resultados separados. Sem sincronização automática dos campos do Project.


## Atualização — Correção #44 / 20/11/2026

[Correção de liberação do cofre](andamentos/2026-11-20-fix-44.md) entregue para revisão: contexto/estado conferidos depois da cifra e antes do download. Dez verificações de navegador aprovadas, incluindo P02 original; domínio 94 PASS. #43/#45/#46 e as pré-condições dos cenários integrais permanecem pendentes. A evidência histórica da QA-002 foi preservada; esta entrega registra o novo resultado de P02.

## Retomada — 21/11/2026

O [checkpoint atual](andamentos/2026-11-21-retomada.md) sucede os retratos anteriores para acompanhamento. PR #48/#44 incorporada; 11 issues abertas, com prioridade imediata para #43/#45/#46. [Correções preparadas e limites de validação](../qa/fix-43-45-46/README.md). Campos privados do Project não foram sincronizados; as fontes consultadas foram as issues vinculadas e a main. #24, #29 e #34 seguem como trabalho disponível; #25/#26/#27/#35 conservam seus impedimentos. Sem liberação de dados infantis reais.


## Integração confirmada — 21/11/2026

PRs [#49](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/49) e [#50](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/50) aprovadas pelo responsável e incorporadas à main, respectivamente em `da66b9a4961233c43c6f16da0bded58fd636f6bf` e `6552f784d8fa369d3b95f36b6378cf81f9585be4`. [CI da integração](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/actions/runs/44946599881) aprovado. Este registro sucede as indicações anteriores de revisão pendente dessas duas PRs.

#34/#43/#45/#46 encerradas: **12 issues concluídas e sete abertas** entre as 19 acompanhadas. Restam #24/#25/#26 (fontes), #27 (validação competente), #29 (capacidade externa), #35 (deliberação por gates) e #36 (rotina recorrente). Próxima frente técnica: [TEC-002/#29](../auditoria/tec-002/README.md). Cadastro/dados infantis reais e cenários integrais continuam bloqueados conforme suas pré-condições. Sem sincronização dos campos privados do Project.


## Atualização — #59 / 23/11/2026

[Correção da Home AUD-13](andamentos/2026-11-23-task-59.md) entregue para revisão: perfil/contagens condicionados à leitura e linguagem sem atualidade/frequência presumidas. Validação local: 12 testes de navegador e 150 de domínio aprovados; inventário de 14 consumidores registra coberturas e pendências. #29 continua pausada, #53/#54 não reabertas e dados reais bloqueados. Não há conclusão de PG-06 integral nem sincronização automática dos campos do Project.


## Atualização — #60 / 23/11/2026

[Consolidação de contribuições/autoria/versões](andamentos/2026-11-23-task-60.md) entregue para revisão após incorporação da PR #62/#59: 16 requisitos, 14 operações, 24 cenários futuros e sete decisões abertas. Legados mantêm lacunas e retenção permanece proporcional; nenhuma implantação/schema/migration foi autorizada. #27 segue pendente, #29 pausada e dados reais bloqueados. #61 mantém o recorte seguinte de linguagem demonstrativa. Sem sincronização automática dos campos do Project.


## Atualização — #61 / 23/11/2026

[Alinhamento da linguagem demonstrativa](andamentos/2026-11-23-task-61.md) entregue para revisão após incorporação da PR #63/#60. Oito testes E2E aprovados e matriz de cinco atores preservada antes/depois; helper de autorização, modelos e formatos não mudaram. Remoção está delimitada à memória da sessão, sem comprovação de eliminação governada. #29 continua pausada e dados reais bloqueados. Sem sincronização automática dos campos do Project.
