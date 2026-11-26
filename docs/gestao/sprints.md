# Sprints

Checkpoint histórico: 23/11/2026. Responsável: Creusio Kizua. As datas originais abaixo são preservadas; nenhuma entrega foi atribuída retroativamente a um período.

## Replanejamento do ciclo corrente SP01

Período original: 15–28/11/2026; mobilização em 19/11. Gestão e mapa técnico concluídos; conciliação INF-002/#24 bloqueada por fontes. As entregas de governança/especificação/testes que estavam previstas para SP02/SP03 foram antecipadas em seus recortes documentais ou demonstrativos; não representam conclusão integral desses objetivos.

Seleção imediata: #36 e PR #17 — checkpoint e reavaliação após #59–#61. Fila posterior, ainda não executada: PG06-N01 (identidade das superfícies restantes), depois PG06-N02 (decisões e primeiro recorte do contrato). Escopos/aceites em [backlog](backlog.md) e [plano](plano.json).

Capacidade: uma execução por vez, no máximo três itens selecionados. #24–#27 dependem de fontes/validação; #29 continua pausada. Nenhuma data de produção ou conclusão externa foi prometida. Revisar SP02/SP03 no encerramento de SP01 com evidências, sem recolocar como pendentes documentos já incorporados.

## Histórico preservado — planejamento inicial

Responsável: Creusio Kizua. Planejamento inicial em 19/11/2026. Datas futuras são metas condicionais e devem ser revistas ao término de cada ciclo.

## SP01 — Organização e baseline

Período: 2026-11-15 a 2026-11-28. Estado inicial: Corrente.

Objetivo: Implantar gestão e estabelecer mapa técnico e documental do que existe.

Capacidade: No máximo três tarefas ativas selecionadas; uma execução por vez. O ciclo pré-existente do Project começa em 15/11; esta organização foi mobilizada em 19/11, sem atribuir trabalho retroativo.

Candidatas ao ciclo:

- [PM-001 #22](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/22) — Implantar a estrutura de gestão do MUNDELO (Em andamento).
- [TEC-001 #23](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/23) — Mapear o código atual contra contrato e critérios por operação (Pronto).
- [INF-002 #24](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/24) — Conciliar versões e aprovação dos 73 INF-ID documentados (Pronto).

## SP02 — Governança e especificação

Período: 2026-11-29 a 2026-12-12. Estado inicial: Planejada.

Objetivo: Resolver/registrar decisões e preparar especificação das operações.

Capacidade: Replanejar ao fim de SP01; dependências externas não são compromisso de entrega.

Candidatas ao ciclo:

- [GOV-001 #27](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/27) — Validar os enquadramentos jurídicos por categoria e operação (Bloqueado).
- [GOV-002 #28](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/28) — Detalhar exceções de retenção, contestação e medidas urgentes (Planejado).
- [TEC-002 #29](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/29) — Comprovar capacidade do ambiente para retenção e backups (Planejado).
- [GOV-003 #30](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/30) — Definir verificação adicional para medidas destrutivas ou disputadas (Planejado).
- [TEC-003 #31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/31) — Especificar autorização, versões e propagação aos derivados (Bloqueado).

## SP03 — Verificação sintética

Período: 2026-12-13 a 2026-12-26. Estado inicial: Planejada.

Objetivo: Preparar/executar verificação disponível e revisar experiência.

Capacidade: Execução depende de implementação disponível e ambiente sintético apropriado.

Candidatas ao ciclo:

- [QA-001 #32](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/32) — Preparar roteiro executável dos 16 cenários de retenção (Bloqueado).
- [QA-002 #33](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/33) — Executar cenários aplicáveis com dados sintéticos e registrar resultados (Bloqueado).

## Rotina do ciclo

1. Confirmar objetivo, dependências e capacidade real antes de puxar a próxima tarefa.
2. Manter no máximo uma tarefa em execução. Itens bloqueados não contam como execução, mas continuam visíveis.
3. Atualizar evidência e bloqueios a cada mudança; fazer um checkpoint semanal manual.
4. Encerrar com entregas efetivas, pendências e decisões de replanejamento. Não mover trabalho incompleto para concluído para fechar o ciclo.

A SP01 usa o ciclo já existente do Project, iniciado em 15/11. Esta organização foi mobilizada em 19/11; não se atribui trabalho retroativo. A rotina recorrente é acompanhada em [PM-002 #36](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/36); não foi criada automação de lembrete.



## Extensão planejada em 25/11/2026 — onboarding adulto

O plano [ONB-ROADMAP](onboarding-roadmap-2026-11.md) propõe ONB-001/#84 e ONB-002/#85 para SP02 e ONB-003/#86 para SP03. SP04 (27/12/2026–09/01/2027) e SP05 (10/01–23/01/2027) são **novas propostas**, ainda não confirmadas como iterations nativas no Project #4. O plano não altera estados históricos nem o limite WIP de uma tarefa.


## Conciliação — 26/11/2026

O checkpoint de 23/11 e as propostas de 25/11 acima são históricos. A [PM-003 #89](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/89) foi concluída: M05 nativa e SP04/SP05 confirmadas, SP01–SP03 preservadas. A [#84](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/84) foi aceita documentalmente e incorporada pela PR #91; #85 permanece aberta. O roadmap ONB não representa liberação de Auth ou dados infantis. A main de referência contém incrementos PG06-N01–N14; a auditoria v0.4 e seus números permanecem evidência histórica, não avaliação da conformidade atual. #29 teve inventário parcial em 24/11, sem comprovação operacional; #27/#29/#35 e o bloqueio de dados reais permanecem. Sem alteração de calendário, escopo ou campos nativos nesta conciliação.
