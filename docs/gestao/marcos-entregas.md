# Marcos e entregas

Checkpoint em 23/11/2026; responsável: Creusio Kizua. Metas originais preservadas, sem alteração dos vencimentos nativos do GitHub.

| Marco | Estado vigente | Pendência determinante |
|---|---|---|
| M00 | Concluído documentalmente | Não equivale a implementação ou habilitação de dados reais |
| M01 | Em andamento | #24–#26: fontes e conciliação; #36 recorrente |
| M02 | Entregas documentais parciais concluídas | #27 validação; #29 capacidade pausada; aplicação de GOV-003 conforme caso |
| M03 | Diagnósticos/correções e revisão documental entregues | R01–R16 integrais e experiência humana ainda sem aceite demonstrado |
| M04 | Bloqueado | #35 exige evidências e decisão explícita do escopo |

## Entregas incorporadas nesta consolidação

- #43–#46: correções demonstrativas incorporadas; não repetir FAIL históricos como falhas abertas.
- #51–#54: linguagem, perfil e atribuição corrigidos nos recortes documentados.
- #59/PR #62: Home com leitura condicionada e linguagem delimitada.
- #60/PR #63: contrato documental; 24 cenários CP não executados e sete decisões abertas.
- #61/PR #64: mensagens de registro/remoção alinhadas à memória demonstrativa.
- [CI da base examinada](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/actions/runs/45247961227) SUCCESS. [Checkpoint](andamentos/2026-11-23-consolidacao-pg06.md).

A PR #17 recebe reavaliação v0.4 para revisão; não está incorporada nesta rodada.

## Histórico preservado — metas e entregas anteriores

A lista “Próximas entregas” abaixo é histórica; a disposição atual está no backlog vigente.

Responsável: Creusio Kizua. Metas iniciais de planejamento, não compromissos de liberação. As metas constam nas descrições dos marcos; o campo nativo de vencimento permanece sem data nesta versão.

| Marco | Meta | Estado inicial | Condição de aceite |
|---|---|---|---|
| [M00 — Base documental incorporada](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/milestone/1) | Sem data | Concluído documentalmente | Marco retrospectivo: contrato/criterios PR19, política PR20 e parâmetros propostos PR21 incorporados. Entrega documental; não testes executados nem habilitação de dados reais. |
| [M01 — Gestão e baseline rastreável](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/milestone/2) | 2026-11-28 | Em andamento | Gestão operacional, mapa técnico e conciliação dos textos acessíveis. Recuperação integral permanece rastreada à parte se faltar exportação. Meta de planejamento, não garantia. |
| [M02 — Governança e especificação verificáveis](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/milestone/3) | 2026-12-12 | Planejado com bloqueios | Enquadramentos, exceções, verificação adicional, capacidades do ambiente e especificação de operações com evidências. Data-alvo depende dos bloqueios. |
| [M03 — Verificação sintética e experiência](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/milestone/4) | 2026-12-26 | Planejado com bloqueios | Cenários executados onde houver controles reais disponíveis, falhas registradas e experiência revisada. Não equivale a liberação de produção. |
| [M04 — Decisão de prontidão para próximo avanço](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/milestone/5) | Sem data | Bloqueado | Conferir gates e deliberar o escopo do avanço permitido. Sem data até dependências críticas comprovadas; não promete piloto infantil real. |

## Evidências já incorporadas

| Entrega | Evidência | Alcance comprovado |
|---|---|---|
| Revisão localizada do contrato e critérios de 14 operações | [PR #19](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/19) | Documento incorporado |
| Política operacional de retenção e 16 cenários propostos | [PR #20](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/20) | Documento incorporado; cenários não executados |
| Parâmetros de 10 categorias e responsáveis | [PR #21](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/21), merge `512d95dd2c6f026e602a5a722fb6f03f08902321` | Documento incorporado; capacidades e hipóteses candidatas continuam sujeitas a comprovação |

As três PRs estão vinculadas ao marco nativo M00. A conclusão documental desse marco não encerra os marcos de governança ou verificação. M01 pode estabelecer uma base rastreável das fontes acessíveis sem declarar recuperação integral; INF-001 e INF-003 continuam abertas até satisfazer seus próprios critérios.

## Próximas entregas verificáveis

- [PM-001 #22](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/22): Estrutura de gestão e ponto de retomada operacional.
- [TEC-001 #23](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/23): Mapa de aderência técnica atual; não implementação.
- [INF-002 #24](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/24): Matriz de recuperação revisada sem renumeração ou princípios novos.
- [INF-001 #25](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/25): Acervo de fontes integrais indexado.
- [INF-003 #26](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/26): Recuperação incremental dos textos faltantes.
- [GOV-001 #27](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/27): Enquadramentos validados por competência apropriada.
- [GOV-002 #28](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/28): Procedimento de exceções ligado aos critérios existentes.
- [TEC-002 #29](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/29): Matriz de capacidade do ambiente e bloqueios técnicos.
- [GOV-003 #30](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/30): Modelo de verificação e responsabilidades.
- [TEC-003 #31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/31): Especificação lógica revisável sem migrations.
- [QA-001 #32](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/32): Plano de execução R01–R16.
- [QA-002 #33](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/33): Relatório de testes executados; não liberação de produção.
- [UX-001 #34](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/34): Fluxos e critérios de experiência para revisão.
- [REL-001 #35](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/35): Parecer de prontidão e decisão de próximo avanço.
- [PM-002 #36](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/36): Rotina de acompanhamento; não automação agendada.

Qualquer implementação adicional revelada pelo inventário deverá virar tarefa própria com escopo, critérios e dependências antes da execução. A data de M03 depende da disponibilidade real dos controles necessários; especificação não substitui implementação.



## Marco candidato acrescentado ao planejamento em 25/11/2026

**M05 — Onboarding adulto e jornada de acolhimento** está **planejada, NÃO criada como milestone GitHub nativa**. Critérios e questões de sincronização em [ONB-ROADMAP](onboarding-roadmap-2026-11.md) e [PM-003 #89](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/89). M00–M04 permanecem separados; não tratar planejamento documental como milestone configurada.


## Conciliação — 26/11/2026

O checkpoint de 23/11 e as propostas de 25/11 acima são históricos. A [PM-003 #89](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/89) foi concluída: M05 nativa e SP04/SP05 confirmadas, SP01–SP03 preservadas. A [#84](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/84) foi aceita documentalmente e incorporada pela PR #91; #85 permanece aberta. O roadmap ONB não representa liberação de Auth ou dados infantis. A main de referência contém incrementos PG06-N01–N14; a auditoria v0.4 e seus números permanecem evidência histórica, não avaliação da conformidade atual. #29 teve inventário parcial em 24/11, sem comprovação operacional; #27/#29/#35 e o bloqueio de dados reais permanecem. Sem alteração de calendário, escopo ou campos nativos nesta conciliação.
