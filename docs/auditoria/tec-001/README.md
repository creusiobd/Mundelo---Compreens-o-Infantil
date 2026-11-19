# TEC-001 — Mapa técnico contra o contrato de domínio

Tarefa [#23](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/23). Responsável: Creusio Kizua. Data: 19/11/2026.

**Base analisada:** [main no commit 512d95dd2c6f026e602a5a722fb6f03f08902321](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/tree/512d95dd2c6f026e602a5a722fb6f03f08902321). Esta é uma auditoria de aderência do código versionado, sem mudança funcional, migrations, configuração de provedor ou uso de dados reais.

Após o levantamento, main avançou para `0e0f990d5e0ceb064a3148cf83d752fc9ddafa59` com a incorporação da PR #37. A comparação entre commits mostrou somente sete arquivos novos em `docs/gestao/`; aplicação, testes e contrato permaneceram idênticos. O inventário de 120 arquivos refere-se ao snapshot técnico acima; a base de publicação já inclui os sete documentos de gestão.

## Resultado

| Alcance | Resultado |
|---|---:|
| Arquivos na árvore completa, sem truncamento | 120 |
| Arquivos com conteúdo obtido e blob conferido | 86 |
| Arquivos de aplicação / testes no inventário | 34 / 19 |
| Operações com mecanismo parcial demonstrativo | 8 |
| Operações sem fluxo correspondente ao contrato | 6 |
| Operações integralmente implementadas contra os critérios atuais | 0 |
| Lacunas rastreadas | 11 |

O resultado não descarta os controles existentes. Há mecanismos locais codificados e cobertos pela suíte histórica: validação de schemas, cifra/decifra de cofre, resolução de conflitos e gerenciador de concorrência. Eles não implementam, por si só, uma operação de domínio completa com autoridade, finalidade, destinatário, restrições, ciclo de vida e comprovação.

## Entregáveis

- [Matriz das 14 operações](matriz-operacoes.md): código existente, lacuna, evidências e vínculo ao requisito.
- [Lacunas e próximos encaminhamentos](lacunas.md): 11 achados, prioridades e tarefas já existentes.
- [Inventário completo](inventario.md) e [inventário estruturado](inventario.json): caminho, blob SHA, categoria e modo de conferência de cada arquivo.
- [Verificação e limites](verificacao.md): origem dos resultados, CI histórico, escopo não verificado e critérios da tarefa.
- [Análise estruturada](analise.json): operações, evidências com linhas, lacunas e referências de acompanhamento.

## Critério de classificação

**Implementado:** mecanismo concreto encontrado no código, descrito com alcance e evidência de verificação. Só uma operação que satisfaça todas as suas condições pode ser considerada integralmente implementada.

**Demonstrativo:** há comportamento executável no protótipo local, mas falta parte essencial do contrato. A autorização client-side é declaradamente demonstrativa no próprio código e no contrato.

**Ausente:** o fluxo requerido não foi localizado na árvore e nos módulos pertinentes deste commit. Uma decisão, documento, dependência instalada ou nome de status não equivale a implementação.

**Não verificado:** a afirmação exigiria configuração externa, ambiente, execução ou prova não inspecionada. É um eixo separado: as 14 operações puderam ser classificadas pelo código; infraestrutura implantada e aceitação integral permanecem não verificadas. Não se atribuiu ausência de infraestrutura externa apenas por não haver arquivo correspondente.

## O que já foi comprovado

O GitHub registrou [execução bem-sucedida da suíte existente](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/actions/runs/44543224727) neste mesmo commit em 19/11/2026. Os passos de domínio/segurança, TypeScript, build, E2E e acessibilidade terminaram com sucesso. Essa execução foi consultada, não disparada novamente por esta tarefa; não é prova de que os critérios novos ou os 16 cenários de retenção tenham sido executados.

Exemplo concreto: [tests/foundation-v0.3.test.ts:118–140](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/tests/foundation-v0.3.test.ts#L118-L140) testa como permitido que um guardião edite contribuição de outro autor. O contrato atual exige correção própria ou procedimento administrativo legitimado. O teste passar confirma a regra antiga; não resolve a divergência G03.

## Próximo trabalho

1. Revisar e incorporar este diagnóstico, preservando as aprovações documentais anteriores.
2. Usar G03/G07/G08/G09 em [GOV-002 #28](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/28), agora com inventário disponível, para detalhar exceções e procedimentos.
3. Usar a matriz e G01–G10 em [TEC-003 #31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/31), ainda dependente de GOV-002, para especificar autorização, versões e propagação. Definir tarefas de implementação separadas após delimitar o escopo.
4. Confrontar o ambiente em [TEC-002 #29](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/29) e preparar cobertura real em [QA-001 #32](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/32). Não antecipar execução de testes nem liberação de produção.

As 73 ocorrências INF-ID documentadas e as 219 lacunas de transcrição continuam com seus limites originais. Esta auditoria não cria princípios novos, valida hipóteses jurídicas ou habilita dados reais de crianças.
