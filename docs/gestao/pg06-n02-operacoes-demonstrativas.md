# PG06-N02 | Comandos de domínio demonstrativos v0.2

**Base:** PR #68 já incorporada; `src/domain/perspectives.ts` preservado. Este incremento incorpora um serviço de operações efetivas em estado imutável de sessão (`perspectiveCommands.ts`) e permite acoplamento restrito no `AppContext`.

## Comandos
- CREATE: contribuição independente validada, sempre com id e ator coerentes; nenhuma relação implícita.
- REVISE: nova versão append-only com comparação da revisão alvo; apenas registrador original ativo/vinculado na presente demonstração. Não é regra jurídica universal.
- CONTEST: nova contribuição de outra pessoa, referenciando a versão alvo; não modifica nem declara inválido o relato original.
- READ: somente versões atuais autorizadas e da criança ativa. Sem `USE`, exportação, relatórios, cofre ou compartilhamento.

## Alcance e riscos
- Só fixtures `tomas`/`lia` em memória, sem Supabase, contas, acesso autenticado, persistência ou integração com registro legado. A guarda por IDs de fixture **não é controle de segurança de produção**.
- O livro de versões mantém conteúdo anterior na memória; portanto **não pode ser usado para destinação de dados reais**, enquanto T02/T05/#29 e respectivas políticas e revisões não estiverem concluídas.
- `requestId` evita duplicação durante a sessão, mas não demonstra idempotência transacional de backend, nem autenticação ou recuperação de falhas.
- O suporte a contestação é operacional sintético, não decisão sobre legitimidade, autoridade, revisão independente ou prazo.
- Os 24 CP/R completos continuam sem aceite. Testes unitários novos não provam resistência a mudanças de contexto React, acessibilidade, integridade de backups, RLS ou revogação entre dispositivos.
- J01/J02, PG-06 integral e #35 permanecem pendentes. Dados reais **NO-GO**.

## Evidência exigida para próxima fatia
Teste E2E com mudança de contexto no AppContext, revisão humana, e uma decisão explícita antes de tocar apresentação, perfis globais, importação de cofre ou banco.
