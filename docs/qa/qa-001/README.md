# QA-001 — Roteiro executável de retenção

Responsável atual: Creusio Kizua · [Tarefa #32](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/32) · Marco M03 · Sprint SP03.

**Entrega de preparação, sem execução de R01–R16 e sem autorização de dados reais.** A [PR #41](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/41) foi incorporada em `59efcd56b006768540863fbc1e2fcbb144ae3007`, base examinada. GOV-002/PR #39 e GOV-003/PR #40 já estão incorporadas documentalmente. Isso não demonstra implementação dos controles nem designa revisor independente.

## Material de execução

- [Ambiente, pré-condições e sequência operacional](ambiente-e-execucao.md).
- [Procedimentos dos 16 cenários](roteiro.md), mantendo as condições e expectativas dos [casos originais](../../politica-operacional-retencao-cenarios-v0-1.md).
- [Roteiro estruturado e rastreabilidade](roteiro.json).
- [Dados exclusivamente sintéticos](dados-sinteticos.json), modelo lógico que exige adaptador futuro; não importar no cofre ou produção.
- [Preparador de fichas](preparar_execucao.py), executável com Python 3 sem dependências externas. Ele gera fichas vazias; não chama o produto e não atesta controles.
- [Andamento](../../gestao/andamentos/2026-11-20-qa-001.md).

## Prontidão e conclusão

O ambiente demonstrativo existente está identificado em `playwright.config.ts`: preview local, Chromium, `VITE_APP_ENV=test` e fixtures de exemplo. Foi conferido código de preparação/criptografia do cofre, contexto e trava de domínio. A janela entre preparar e baixar continua exigindo aceitação integrada, não apenas teste da classe isolada. TEC-001 continua sendo o diagnóstico de lacunas; nenhum controle foi implementado por QA-001.

A dependência documental de TEC-003 foi resolvida. **Preparar o roteiro está desbloqueado; a aceitação integral dos 16 casos permanece condicionada às capacidades específicas de cada ficha.** Não há interface de pedido, fila, backup governado ou política de retenção comprovada por esta preparação. O roteiro informa ações de teste; uma ação sem caminho real correspondente é BLOQUEADO, sem inventar endpoint ou simular a própria regra e chamá-la de implementação.

Critérios de entrega: cada caso tem pré-condições, variante sintética, procedimento, resultado esperado, observação distinta do disparo, evidência minimizada e separação da decisão de governança. Os IDs R01–R16 são preservados; A01–A25/REQ/OP/D remetem à [TEC-003](../../especificacoes/tec-003/README.md), G01–G11 à [TEC-001](../../auditoria/tec-001/README.md), V01–V09 à [GOV-003](../../governanca/gov-003/README.md).

## Resultado e responsabilidades

Todos os casos estão inicialmente **NAO_EXECUTADO**, com prontidão **BLOQUEADO_PARA_ACEITACAO_INTEGRAL**. Resultados não são inferidos de CI verde, revisão documental, fixtures ou retorno de comandos. Os estados e o critério de PASS estão no guia de execução.

Creusio é o executor e responsável atual por produto/governança; V1 pode ser sua conferência por método distinto. V2 exige outra pessoa competente, não designada. Em ensaio integralmente sintético admite-se V1 conforme GOV-003; isso não atende V2 para atos irreversíveis sobre dados pessoais reais. V02–V08 continuam aplicáveis conforme o caso; decisões jurídicas, conflitos e competência especializada não são resolvidos pela simulação.

Os parâmetros C01–C10 permanecem candidatos/condicionais nos [parâmetros existentes](../../parametros-retencao-categorias-v0-1.json). Dois ticks e a data de laboratório não são novos prazos de retenção. Não se cria princípio INF-ID, migration ou liberação operacional.
