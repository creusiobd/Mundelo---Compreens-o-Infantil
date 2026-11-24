# TEC-002 — capacidade do ambiente: diagnóstico e bloqueios

Data: 21/11/2026. Issue [#29](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/29). Base estática: main `b6921b3b5100ace9c6bee46c8445b4e00c34dbb8`. Responsável pelo encaminhamento: Creusio Kizua. **Diagnóstico documental entregue; comprovação de ambiente externo BLOQUEADA.** Não foi criada infraestrutura.

## Ambiente identificado e alcance da inspeção

O [ADR-005](../../adr/005-identidade-e-persistencia-supabase.md) aceita Supabase para identidade/persistência, limitado à implementação controlada; hospedagem web continua adiada. A escolha não comprova projeto provisionado, plano, região, contrato, configuração ou capacidades de ciclo de vida. Não foram acessados console Supabase, banco, serviço de backup, conta de hospedagem ou configurações administrativas do provedor.

Fontes conferidas: ADR-005; [diagnóstico TEC-001](../tec-001/README.md); [parâmetros PR21](../../parametros-retencao-categorias-v0-1.md); [política](../../politica-operacional-retencao-destinacao-v0-1.md); [especificação TEC-003](../../especificacoes/tec-003/README.md); [prontidão QA-002](../../qa/qa-002/prontidao.md); `package.json`, `.env.example`, `vite.config.ts`, `src/context/AppContext.tsx`, `src/components/VaultExportModal.tsx` e `.github/workflows/ci.yml` na base.

Achados verificáveis no snapshot: SPA com estado React em memória; cofre local baixado pelo navegador; ausência de cliente Supabase, migrations, configuração de banco remoto, fila de expurgo ou restauração governada na árvore. `.env.example` é um template de AI Studio/APP_URL, sem configurar Supabase. Comentários de Cloud Run no template não comprovam implantação. CI usa GitHub Actions para build/testes, sem provar que produção está hospedada lá. Ausência no repositório não demonstra inexistência de serviços externos.

## Capacidade versus exigência proposta

Os prazos abaixo reproduzem parâmetros internos propostos em PR21; não são garantias do provedor nem validação jurídica. Não se presume que um plano do Supabase satisfaça cada requisito.

| Superfície | Exigência de PR21/contrato | Evidência observada | Disposição e lacuna |
|---|---|---|---|
| Dados ativos C01–C05 | Finalidade, versões, revisão e destinação por categoria | CRUD demonstrativo; revisão numérica sem arquivo governado de versões | PARCIAL demonstrativo; G01/G03/G04/G09 |
| Pedidos/provas C06 | Estado, autoridade, execução/verificação e prova minimizada | Procedimentos GOV-002/GOV-003; sem serviço persistente implementado | NÃO DEMONSTRADO; G08/G09 |
| Pacotes C07 sob controle | Disponibilidade até 24h; expurgo em até 24h após expiração/cancelamento; limite proposto 48h | Exportação local usa Blob/URL temporária e revoga URL ao fim; download vai ao dispositivo | PARCIAL local. Não comprova prazo, expurgo de temporários do navegador/SO, nem controle de cópia já entregue; G05/G06/G09 |
| Backups C08 | Até 30 dias por snapshot; replicação não reinicia relógio; revisão mensal/antes de restaurar | Nenhum projeto/plano/configuração de backup acessível nesta inspeção | NÃO VERIFICADO externamente; G09 |
| Réplicas C08 | Mesma política/destino; conhecer regiões, atraso e cobertura | Sem inventário/topologia/prova | NÃO VERIFICADO; G09 |
| Restauração | Isolar e reconciliar eliminações/restrições/concessões antes da leitura | `restoreDemoData` restaura exemplos; não é recuperação de backup nem reconciliação | AUSENTE no código examinado; G04/G07/G09 |
| Logs/telemetria C09 | 7 dias diagnóstico; 30 dias segurança; acesso segundo enquadramento confirmado | Sem inventário de logs de infraestrutura ou configuração de retenção disponível | NÃO VERIFICADO; G09. Não afirmar ausência total de logs pela falta de SDK |
| Artefatos de CI | Separar evidências sintéticas e conteúdo pessoal | Workflow prevê upload de falhas por 7 dias | COMPROVADO como configuração de CI; não comprova C09, expurgo efetivo nem produção |
| Temporários/caches | Inventário e destinação por superfície | Objetos/estado em memória e Blob; sem política comprovada do SO/browser/provedor | PARCIAL local, externo NÃO VERIFICADO; G06/G09 |
| Conhecimento C10 | Só método comprovadamente não pessoal; revisão de utilidade | Documentação com exemplos sintéticos | Não comprova anonimização nem autorização de fonte pessoal; G09 |

Eliminar objeto React, revogar object URL, remover linha do banco, expirar link e expurgar backup são efeitos diferentes. Nenhum pode servir como prova automática dos demais. Os limiares PR21 devem ser confrontados com configuração e teste do ambiente efetivamente escolhido, sem adaptar silenciosamente os critérios ao plano disponível.

## Evidência necessária para desbloqueio externo

Creusio deve disponibilizar inventário técnico sem segredos: identificador não sensível do ambiente, provedor/plano/região, configuração versionada ou capturas minimizadas com data, políticas de backup/réplica/logs, janelas reais, permissões e limites de expurgo. Não incluir chaves, tokens, URLs de resgate, dados infantis ou dumps pessoais.

Com ambiente de desenvolvimento sintético disponível, executar e registrar:

1. Inventariar cópias e responsáveis, incluindo temporários, jobs, logs e artefatos externos; distinguir sob governança e cópias entregues.
2. Criar marca sintética, copiar/replicar e solicitar a medida aplicável; conferir todas as superfícies conhecidas com tempos reais e escopo.
3. Injetar falha em uma superfície: manter resultado parcial e pendência explícita, sem concluir eliminação integral.
4. Restaurar backup antigo em ambiente isolado; reconciliar eliminações/restrições/concessões e verificar ausência de reapresentação indevida antes de liberar leitura.
5. Conferir rotação/expiração de snapshots e réplicas; comprovar limite real ou registrar incompatibilidade com PR21 para decisão específica.

Todos os cinco procedimentos estão **NÃO EXECUTADOS** nesta entrega. Documentação do fornecedor, quando consultada na etapa concreta, deve ser oficial e datada; não basta para provar configuração ou execução do projeto. A disposição de R07–R09/R14 permanece BLOCKED e não substitui os demais R01–R16. GOV-001/validação competente e GOV-003/verificação aplicável continuam independentes.

## Resultado dos critérios de #29

Identificação da arquitetura escolhida e evidência disponível: realizada. Confronto com PR21: realizado nesta matriz. Capacidades locais e diferenças: registradas. **Provedor efetivamente configurado e capacidades externas não comprovados**: manter #29 aberta para complemento externo; não encerrar pelo diagnóstico. Nenhuma infraestrutura, prazo, política do provedor ou dado real foi modificado.


## Complemento de inspeção autenticada — 24/11/2026

O [relatório do ambiente](ambiente-2026-11-24.md) e o [registro estruturado](ambiente-2026-11-24.json) identificam o projeto Supabase informado por Creusio, com acesso autenticado pelo navegador. Creusio confirmou uso exclusivo de desenvolvimento e dados sintéticos. O painel mostra Nano/Oregon, schema public sem tabelas, ausência de réplicas de leitura e indisponibilidade de backups gerenciados/PITR/log drains no plano apresentado. Retenção/expurgo de logs não comprovados.

Esta observação supera a falta de identificação/acesso descrita no retrato histórico acima; não representa testes de backup, restauração, eliminação ou rotação executados. P1 recebeu inventário parcial, P2–P5 permanecem não executados. #29 continua aberta para decisão de estratégia e comprovação; sem mudança de plano/configuração, infraestrutura ou habilitação de dados reais.
