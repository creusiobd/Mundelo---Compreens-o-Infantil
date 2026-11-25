# PG06-N05 | Gate real de PostgreSQL 16: identidade, RLS e revogação sintéticas

**Estado:** laboratório descartável em CI, separado do Supabase; **não é migration para produção**. Somente strings fictícias. Nenhum dado infantil real, credencial pessoal, endpoint Supabase ou configuração operacional é acessado.

## O que esta entrega realmente comprova quando o workflow estiver verde

1. PostgreSQL aplica RLS a `contribution` de acordo com identidade de login autenticado de banco e grant autorizado por fonte, versão, finalidade e operação READ.
2. Famílias A/B, profissional A e outro grupo têm conjuntos distintos; uma sessão não lista conteúdo, ID ou versões fora do seu conjunto permitido.
3. O papel leitor não possui permissão de SELECT/INSERT/UPDATE em `access_grant` nem UPDATE em `contribution`.
4. Após revogação pelo administrador da fixture, uma nova instrução SQL perde acesso, mantendo os demais grants independentes.
5. Revisões de política e restrição invalidam concessões antigas, sem atualização automática silenciosa.
6. A função `SECURITY DEFINER` acessa tabelas privadas, com `search_path` fixado; privilégios no schema e na função são explicitamente limitados.

## Fronteira de identidade do laboratório

O teste autentica **quatro contas PostgreSQL independentes** por login/senha **exclusivamente sintéticos e efêmeros da CI**. A função usa `session_user` para vincular a sessão ao principal autenticado no banco, sem aceitar identificador de cliente. Há teste negativo de tentativa de `SET ROLE` para outro usuário. **Isto comprova autenticação PostgreSQL no laboratório, não autenticação de usuário Supabase.**

No Supabase, todos os usuários finais normalmente chegam com o papel `authenticated`; portanto **é proibido reutilizar a função `can_read` e esta tabela `principal` diretamente como RLS de produção**. A integração futura deverá usar `auth.uid()` derivado de JWT **validado pelo PostgREST/Supabase**, nunca um UID arbitrário enviado no payload, e testar JWTs assinados e vínculos realmente verificados.

A fixture `approved_authority=true` é plantada pelo administrador de laboratório, não comprovada por fluxo de verificação jurídica. **Não existe neste incremento operação de concessão real.**

## Consistência e revogação

Os testes verificam revogação **após commit**, em outra instrução e outra conexão, usando semântica de snapshots de leitura normal. Não demonstram revogação linearizável durante SELECT já iniciado, nem prevenção de `REPEATABLE READ` mantendo um snapshot antigo. Para entrega e exports futuros exigimos RPC transacional com ordenação/locks, versões das fontes/grants/política e guarda na fronteira do efeito, sem confiar em validação do React.

O conjunto não autoriza WRITE/SHARE/EXPORT, transferência a terceiros, V2/V3, retenção, backups ou prontidão de dados reais. Não há integração com Diário ou cofre.

## Execução e evidência

CI isolada: `.github/workflows/pg06-n05-postgres-rls.yml`, Postgres 16 via service container e `bash tests/postgres/run-pg06-n05.sh`. Executável também num Postgres 16 descartável com permissões suficientes de criação de roles.

## Próximos bloqueios para Supabase

- Projetar tabelas/versionamento e concessões com identidade confiável, RPC para grant/revoke por autoridade efetivamente verificada e RLS para **todas** as operações; negar service-role no caminho de clientes.
- Testar duas contas autenticadas reais **apenas sintéticas**, tentativas de mutação de grant, replay/concorrência transacional, revogação durante preparação, isolamento de API, metadados/logs e exportações.
- Resolver legitimidade por ato/categoria (#27), capacidade de recuperação e destinação (#29), revisão independente e prontidão (#35). Nenhum desses gates é encerrado pela CI do laboratório.

**Resultado de segurança vigente: NO-GO para dados infantis reais.**
