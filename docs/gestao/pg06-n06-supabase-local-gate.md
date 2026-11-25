# PG06-N06 | Supabase local: identidade autenticada e RLS de operações

**Gate técnico em laboratório isolado.** Não conectar à organização/projeto Supabase hospedado, não aceitar crianças reais, não abrir cadastro infantil, não fazer `supabase link`, `db push` nem migrations no ambiente remoto.

## Entregas executáveis

- `tests/supabase-lab/schema.sql` é um **schema experimental aplicado via psql exclusivamente em container local**. Não está em `supabase/migrations`.
- Quatro contas fictícias são criadas via **Supabase Auth / GoTrue local**. Cada conta recebe JWT assinado e validado pela API PostgREST. Teste de token adulterado exige rejeição.
- Tabelas e grants têm RLS ativo e todas as políticas diretas de SELECT/INSERT/UPDATE/DELETE negam; comandos protegidos são RPCs `SECURITY DEFINER` com `auth.uid()`, `search_path` fixado e `EXECUTE` negado a `anon`.
- Autoridades são plantadas **apenas pelo administrador efêmero da CI** com escopo de criança, ato, categoria e finalidade, sem dedução pelo nome, profissão, família ou metadados controlados pelo usuário.
- Operações: REGISTRAR, CONCEDER, REVOGAR e LER versão+finalidade específica. `SHARE` e `EXPORT` não estão implementados, e isso é deliberado: a resposta deve ser indisponível, não um endpoint parcialmente protegido.
- As RPCs `GRANT`, `REVOKE` e `READ` usam o mesmo advisory lock por criança em transação. Não há concessão de leitura por sinalização de UI, token antigo ou simples propriedade de registro.
- Testes HTTP negativos: anônimo, JWT adulterado, tentativa de outra criança, leitura fora do escopo, autoconcessão por profissional, concessão para finalidade não verificada, UPDATE REST direto, ausência de acesso a grants/relatórios/exportações, leitura depois da revogação utilizando o **mesmo JWT**.

## Gate de produção permanece fechado

1. Trata-se de **uma prova local de integração autenticada**, não autorização da instalação Supabase hospedada ou política jurídica pronta.
2. A autoridade `verified` é fixture administrativa, não representa prova de identidade legal, competência profissional ou consentimento. A política operacional para concessões e revisões J01/J02 segue pendente.
3. Este laboratório demonstra efeitos seriais em transações e checagem após revogação, mas **não comprova linearizabilidade de uma leitura que já começou**. A concorrência distribuída entre GRANT/REVOKE/READ e a durabilidade de efeitos e retries deve ser testada adicionalmente no modelo persistente definitivo.
4. Não há ainda versionamento operacional completo (REVISE com CAS), participação/autonomia narrativa, exportação, relatório, derivado, trilha de auditoria, restauração/backup ou retenção. Negar endpoints não demonstra que futuros endpoints serão seguros.
5. A passagem para hospedagem exige revisão independente do DDL, schema de produção novo e adaptado, isolamento multiusuário autenticado, inventário do projeto, auditoria de privacidade, legitimidade por categoria, mecanismos de exclusão e evidências de gates #27, #29, #35.
6. Não reutilizar este SQL em produção: privilégios, schema, migrações e regras de segurança precisam ser reavaliados antes da integração real. **Dados infantis reais continuam NO-GO.**

## Como verificar

O workflow `.github/workflows/pg06-n06-supabase-local.yml` inicia a stack local efêmera do Supabase, cria as contas de teste, executa SQL exclusivamente local, realiza requisições HTTP autenticadas reais e destrói a stack ao final. A suíte geral da aplicação permanece independente.

A base técnica segue as orientações oficiais do Supabase para RLS, `auth.uid()`, funções seguras e testes de integração de aplicação. A CI é evidência somente dos caminhos que realmente executou, não de todo o PG06.
