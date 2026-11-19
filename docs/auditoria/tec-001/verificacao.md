# Verificação, evidências e limites de TEC-001

## Base e método

1. Obtida árvore recursiva de main no commit `512d95dd2c6f026e602a5a722fb6f03f08902321`, sem truncamento: 120 arquivos, incluindo toda a aplicação, testes, configurações e documentação versionada.
2. Obtidos 86 conteúdos por referência imutável. Recalculado o Git blob SHA-1 usando cabeçalho `blob <tamanho-em-bytes>\0` e UTF-8; todos coincidiram com os blobs da árvore. Isso verifica identidade do conteúdo, não segurança da aplicação.
3. Lidos módulos de domínio/autorização, tipos/schemas, cofre/conflitos/concorrência e caminhos pertinentes de telas/componentes/testes. Inspeção dirigida; os 120 itens não são apresentados como 120 arquivos integralmente auditados.
4. Vinculada cada uma das 14 operações à linha correspondente do critério, aos arquivos que realizam parte da operação e às lacunas relacionadas. Conferidas as referências de linhas, IDs e dependências do relatório.
5. Consultados run e job de CI do mesmo commit. Não houve execução local de testes nem reprodução em navegador para os achados estáticos. A publicação da PR #38 aciona automaticamente a suíte preexistente, sem acrescentar testes funcionais; o resultado dessa reexecução consta nos checks da PR.

Após o levantamento, main avançou para `0e0f990d5e0ceb064a3148cf83d752fc9ddafa59` com a incorporação da PR #37. A comparação entre commits mostrou somente sete arquivos novos em `docs/gestao/`; aplicação, testes e contrato permaneceram idênticos. O inventário de 120 arquivos refere-se ao snapshot técnico acima; a base de publicação já inclui os sete documentos de gestão.

## CI existente no commit analisado

- Execução: [MUNDELO Quality Gates — run 44543224727](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/actions/runs/44543224727).
- Evento: push em main; commit `512d95dd2c6f026e602a5a722fb6f03f08902321`; execução em 19/11/2026, concluída com sucesso.
- Job: Domain, TypeScript, Build, E2E and A11y.

| Passo consultado | Conclusão |
|---|---|
| Domain and security regression | success |
| TypeScript checks | success |
| Production build | success |
| Browser E2E suite (includes accessibility) | success |
| Dedicated accessibility suite | success |

A referência ao CI comprova os resultados informados pelo GitHub para a suíte existente. O conteúdo dos testes foi examinado para delimitar essa cobertura. Não se extrai certificação, cobertura integral ou aprovação do contrato da simples conclusão success.

## Distinção entre componente e integração

- Os testes v0.3 cobrem as funções demonstrativas de autorização, inclusive permissões mais amplas que o contrato atual.
- Os testes adversariais v0.4A incluem cifra real e também casos que repetem regras em funções/flags simuladas. Nem todos chamam o AppContext ou os modais reais.
- Os testes v0.4A.1 exercitam a classe de concorrência e o resolvedor reais. Isso não demonstra que todas as operações mantenham a trava e revalidem o contexto até a disponibilização do resultado.
- Há testes E2E reais de criação, permissões e acessibilidade. Os testes de permissões de telas internas verificam lista/botões e criação/exclusão, sem demonstrar por si só minimização dos campos de perfil ou apresentação residual de detalhe aberto.
- Os 16 cenários da política de retenção permanecem sem execução comprovada nesta análise.

## Não verificado

- Configuração de ambiente Supabase, identidade e RLS efetivamente implantados fora do repositório.
- Provedor, retenção e restauração de backups reais.
- Fluxos completos no navegador para as divergências apontadas.
- 16 cenários de retenção, execução e prova.
- Validação jurídica e independência de revisão.

## Critérios da tarefa #23

- [x] Inventário por arquivo/versão do código e controles existentes: inventario.md / inventario.json.
- [x] Diferenciar demonstrativo, implementado, não verificado e ausente para 14 operações: matriz com classificação da operação, mecanismos locais implementados e limitações de verificação explícitas.
- [x] Lista de lacunas ligada ao contrato e a evidências: lacunas.md / analise.json, com 11 achados e encaminhamentos para issues existentes.

Execução do mapeamento concluída; incorporação do relatório e fechamento da issue dependem da revisão da entrega. Não foram alterados código funcional, testes existentes, decisões normativas, permissões de infraestrutura ou dados.
