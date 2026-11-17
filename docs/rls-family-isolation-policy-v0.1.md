# Política de Isolamento e Autorização RLS — MUNDELO v0.1

- **Status:** PROPOSTA PARA REVISÃO, NÃO IMPLEMENTADA
- **Data:** 17 de novembro de 2026
- **Escopo:** identidade adulta e espaço familiar inicial
- **Ambiente-alvo:** desenvolvimento Supabase com usuários sintéticos
- **Fora de escopo:** dados infantis, produção, convites externos, compartilhamento de observações e administração operacional

## 1. Objetivo e regra de segurança

Definir uma fronteira de autorização verificável no PostgreSQL, sem depender de guards React, estado local, IDs ocultos ou validações feitas somente no navegador.

**Regra central:** uma identidade autenticada só pode consultar dados próprios e espaços familiares nos quais possui membership ativa. Nenhum usuário pode criar, elevar, transferir ou revogar privilégios por escrita direta na API.

A identidade do usuário é sempre obtida do contexto autenticado por `auth.uid()`. Qualquer `user_id`, `created_by`, `role`, `status` ou `family_id` recebido do cliente é dado não confiável e deve ser validado ou derivado no banco.

RLS é uma camada necessária, não suficiente isoladamente. Grants, constraints, funções privilegiadas, views, storage, endpoints e console administrativo fazem parte da mesma fronteira.

## 2. Entidades e invariantes

### `profiles`

- Uma linha por adulto, com PK/FK `user_id -> auth.users.id`.
- O titular pode ler a própria linha.
- O titular pode inserir somente uma linha cujo `user_id = auth.uid()`.
- O titular pode alterar apenas campos de perfil explicitamente permitidos, por exemplo `display_name`.
- `user_id`, papel, estado de conta e campos administrativos não são editáveis pelo cliente.
- Nenhuma leitura pública ou entre usuários.

### `family_spaces`

- Um espaço representa um contexto familiar, não uma criança.
- Somente membership ativa permite leitura.
- Criação direta pela API é negada; a criação ocorre por operação transacional controlada.
- `created_by` é definido pelo banco a partir de `auth.uid()` e imutável.
- Não há update/delete direto pelo cliente nesta fase.

### `family_memberships`

- Uma linha representa o vínculo de um adulto com um espaço.
- Cada linha possui `family_id`, `user_id`, `role` e `status`.
- O MVP começa com um único membro: o criador, papel `owner`, estado `active`.
- Usuário autenticado pode consultar apenas suas próprias linhas de membership.
- Nenhum usuário pode inserir, alterar papel, trocar `user_id`, alterar `family_id` ou revogar memberships diretamente.
- Convites, entrada de outros adultos, transferência de titularidade e gestão de papéis ficam fora de escopo e exigem RPC/fluxo próprio, com revisão de ameaça.

### `legal_acceptances`

- Registro append-only de aceite feito por um adulto.
- O titular pode consultar apenas os próprios registros.
- Registro de aceite deve derivar `user_id` de `auth.uid()` e `accepted_at` do relógio do banco.
- Documento, versão, finalidade e texto/artefato referenciado devem ser identificáveis e versionados.
- Cliente não pode alterar ou excluir aceites. A política de retenção e exclusão legal deve ser decidida em G4 antes da migration definitiva.

### `privacy_preferences`

- Não criar por antecipação. Só incluir quando existir finalidade, campos e ciclo de vida definidos.
- Se aprovada, cada preferência será isolada por titular e não será tratada como substituta de aceite legal.

## 3. Matriz de autorização

Legenda: **A** = permitido; **N** = negado; **RPC** = somente operação transacional controlada; **condicional** = exige membership ativa.

| Recurso / operação | Anônimo | Titular autenticado | Outro membro ativo da mesma família | Usuário sem vínculo |
|---|---:|---:|---:|---:|
| profiles: SELECT | N | A, própria linha | N | N |
| profiles: INSERT | N | A, somente `auth.uid()` | N | N |
| profiles: UPDATE | N | A, colunas permitidas da própria linha | N | N |
| profiles: DELETE | N | N nesta fase | N | N |
| family_spaces: SELECT | N | Condicional | Condicional | N |
| family_spaces: INSERT | N | RPC | RPC | N |
| family_spaces: UPDATE | N | N nesta fase | N | N |
| family_spaces: DELETE | N | N nesta fase | N | N |
| family_memberships: SELECT | N | A, linhas próprias | A, somente as próprias linhas | N |
| family_memberships: INSERT | N | RPC | RPC, somente convite futuro aprovado | N |
| family_memberships: UPDATE | N | N | N | N |
| family_memberships: DELETE | N | N | N | N |
| legal_acceptances: SELECT | N | A, próprios registros | N | N |
| legal_acceptances: INSERT | N | RPC/registro controlado | N | N |
| legal_acceptances: UPDATE | N | N | N | N |
| legal_acceptances: DELETE | N | N nesta fase | N | N |

**Nota:** o cenário “outro membro ativo” é uma regra futura de domínio, não uma capacidade habilitada no MVP. Como o MVP só cria o proprietário, não haverá segundo membro até a aprovação do fluxo de convites e da política de papéis.

## 4. Regras RLS por tabela

### 4.1 Profiles

- Habilitar RLS.
- SELECT: `user_id = (select auth.uid())`.
- INSERT: `user_id = (select auth.uid())`, com validação equivalente em `WITH CHECK`.
- UPDATE: `USING (user_id = (select auth.uid()))` e `WITH CHECK (user_id = (select auth.uid()))`.
- Restringir UPDATE por grants em nível de coluna para campos de perfil aprovados; não conceder update amplo de `user_id` ou metadados privilegiados.
- Sem policy de DELETE no MVP.
- Não usar `raw_user_meta_data` como fonte de papéis ou autorização.

### 4.2 Family spaces

- Habilitar RLS.
- SELECT: somente se função de verificação confirmar membership ativa do usuário autenticado para o `family_id`.
- INSERT/UPDATE/DELETE diretos: sem policy e sem grants para o papel `authenticated`.
- Criação por RPC transacional dedicada. A RPC recebe somente atributos não privilegiados estritamente necessários; deriva `created_by` e o usuário da membership com `auth.uid()`, define papel inicial `owner` e estado `active`, e cria espaço + membership na mesma transação.
- A RPC não aceita `user_id`, `created_by`, `role` ou `status` fornecidos pelo cliente.
- Garantir unicidade/integridade para impedir membership duplicada e referência a espaço inexistente.

### 4.3 Family memberships

- Habilitar RLS.
- SELECT: `user_id = (select auth.uid())`. No MVP, isso significa que o titular vê o vínculo de owner criado para sua conta.
- Não expor lista completa de membros a qualquer membro por padrão. Se a UX futura exigir essa lista, criar policy separada que revele apenas os campos mínimos a membros ativos.
- Sem INSERT/UPDATE/DELETE direto por `authenticated`.
- Criação, convite, aceitação, alteração de papel e revogação só por funções específicas e auditáveis, introduzidas em fase posterior.
- Nunca permitir que o cliente atribua `owner`, `admin` ou qualquer papel privilegiado a si mesmo.

### 4.4 Legal acceptances

- Habilitar RLS.
- SELECT: `user_id = (select auth.uid())`.
- Sem UPDATE ou DELETE direto.
- Registro por RPC ou mecanismo de servidor que deriva `user_id` e timestamp; não aceitar `accepted_at` do cliente.
- Não confundir aceite necessário de termos com consentimento opcional para finalidade específica.
- Antes de implementar exclusão de conta, definir retenção mínima, base legal, anonimização e tratamento de backups; não escolher cascade automaticamente.

## 5. Verificação de membership sem recursão RLS

Policies de `family_spaces` precisam verificar `family_memberships`. Uma consulta direta pode gerar recursão se as policies das duas tabelas dependerem uma da outra.

Direção proposta: função pequena de verificação, por exemplo `private.is_active_family_member(target_family_id uuid)`, que:

1. Usa `auth.uid()` internamente; não recebe `user_id` do cliente.
2. Retorna somente booleano.
3. Consulta membership correspondente a `target_family_id`, usuário autenticado e `status = 'active'`.
4. Usa nomes de objetos totalmente qualificados e `search_path = ''`.
5. Não usa SQL dinâmico nem retorna linhas ou dados de membership.
6. Tem EXECUTE revogado de `PUBLIC` e concedido apenas aos papéis estritamente necessários.
7. É criada e revisada como função privilegiada, com proprietário de privilégio mínimo e sem capacidade de escrita.
8. Tem testes específicos para usuário anônimo, membro ativo, membro revogado e usuário sem vínculo.

A função poderá precisar de `SECURITY DEFINER` para consultar a tabela sem recursão. Isso amplia privilégios e exige revisão cuidadosa do owner, grants, search_path e corpo SQL. Não implementar a função por cópia automática de exemplo. Se não for possível restringir corretamente o owner e a superfície de execução, interromper e redesenhar a policy.

## 6. Grants, constraints e integridade

- Revogar privilégios amplos desnecessários de `anon` e `authenticated`.
- Conceder apenas SELECT/INSERT/UPDATE e somente nas tabelas/colunas que realmente precisem.
- Não conceder INSERT/UPDATE/DELETE direto em `family_spaces` ou `family_memberships` no MVP.
- RLS não substitui constraints: usar PK, FK, UNIQUE, NOT NULL e CHECK para invariantes.
- Membership deve ter unicidade apropriada, no mínimo para o par `(family_id, user_id)`.
- Valores de `role` e `status` devem ser restringidos por CHECK/enum controlado.
- Campos de ownership e timestamps de auditoria devem ser definidos pelo banco.
- Não criar views, RPCs, buckets Storage ou Edge Functions que contornem as regras desta política.
- Toda função `SECURITY DEFINER` precisa de revisão dedicada, grants mínimos, search_path fixo e testes de abuso.

## 7. Criação transacional do espaço familiar

O primeiro acesso autenticado pode exigir criação de um espaço familiar. Não dividir essa operação em duas chamadas independentes do cliente.

A futura RPC `create_initial_family_space(...)` deverá:

1. Rejeitar chamada sem `auth.uid()`.
2. Derivar o titular exclusivamente de `auth.uid()`.
3. Criar o espaço com `created_by = auth.uid()`.
4. Criar membership do mesmo usuário, papel `owner`, estado `active`.
5. Executar ambas as inserções atomicamente.
6. Não aceitar usuário, papel, estado ou ownership no payload.
7. Tratar repetição/timeout de forma segura, com estratégia de idempotência definida antes da implementação.
8. Não permitir que a RPC se transforme em endpoint genérico de criação de memberships.

A RPC deverá ser executável somente por `authenticated`, com checagem interna de identidade, search_path fixo e revisão de privilégios. A implementação SQL e o contrato de idempotência serão submetidos a PR separado.

## 8. Testes de segurança obrigatórios

Executar contra PostgreSQL/Supabase de desenvolvimento com JWTs/identidades distintas e papel de banco equivalente ao uso real. Testes com mocks React não constituem evidência de RLS.

### Identidades de teste

- A: usuário autenticado que cria a família A.
- B: usuário autenticado que cria a família B.
- C: usuário autenticado sem membership na família A ou B.
- Anônimo: sem sessão autenticada.

### Matriz negativa e positiva

1. A lê seu perfil; B não lê perfil de A.
2. A altera apenas campos permitidos do próprio perfil.
3. A não altera `user_id`, papel ou campos administrativos do próprio perfil.
4. A lê família A; B e C não leem família A.
5. A não lê família B; B não lê família A.
6. Anônimo não lê perfil, família, membership ou aceite.
7. A vê somente suas linhas de membership, não memberships de B.
8. A não insere membership para B nem promove a si mesmo.
9. A não altera `family_id`, `user_id`, `role` ou `status` de membership.
10. A não atualiza nem exclui diretamente a família.
11. A cria espaço e membership por RPC, ambos ou nenhum.
12. Chamada da RPC com `user_id`/papel forjado não concede privilégios.
13. Usuário sem vínculo não obtém dados por UUID previsível ou conhecido.
14. Membership revogada perde acesso imediatamente conforme transação/estado definido.
15. Aceite de A não é visível nem editável por B.
16. Não há caminho alternativo por views, RPCs, funções ou Storage que exponha dados bloqueados.

Cada teste deve registrar: identidade usada, operação, resultado esperado, resultado observado e evidência reproduzível. Falha em qualquer teste de isolamento bloqueia G2.

## 9. Decisões ainda necessárias antes da migration

1. Definir os campos exatos e mínimos de `profiles`.
2. Definir metadados mínimos de `family_spaces` sem introduzir dados infantis.
3. Definir enumeração de `role` e `status` e estratégia de revogação.
4. Definir idempotência da RPC de criação do espaço.
5. Definir owner restrito para funções privilegiadas e mecanismo de deployment.
6. Definir retenção/exclusão de `legal_acceptances` e efeitos da exclusão de conta.
7. Revisar se `privacy_preferences` é realmente necessária na primeira versão.

Nenhuma migration deve ser escrita/aplicada até essas decisões serem revisadas e o projeto Supabase de desenvolvimento ser autorizado e criado.

## 10. Critérios de aprovação

A política pode ser aprovada para implementação quando:

- a matriz de acesso estiver aceita;
- grants e policies forem especificados por tabela e operação;
- RPCs privilegiadas tiverem contrato fechado;
- constraints e ownership estiverem definidos;
- testes cross-account cobrirem leitura, escrita, alteração, exclusão e escalada;
- não houver tabela ou caminho de acesso a dados infantis;
- a implementação estiver em migration versionada e PR revisável.

**Status atual:** proposta documental. Não há RLS criada, testada ou aplicada. G2 permanece BLOQUEADO.

## 11. Referências técnicas

- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Database Functions: https://supabase.com/docs/guides/database/functions
- PostgreSQL Row Security Policies: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- PostgreSQL Function Security: https://www.postgresql.org/docs/current/sql-createfunction.html
- Supabase Database Migrations: https://supabase.com/docs/guides/deployment/database-migrations


## 12. Extensão futura: profissionais de acompanhamento

A visão futura poderá contemplar fonoaudiólogos, psicólogos, terapeutas, pediatras e psiquiatras. Esta taxonomia é inicial: “terapeuta” é uma designação ampla e exigirá identificação da disciplina, qualificação e registro aplicável, quando houver.

### 12.1 Identidade não é autorização

- A identidade base continua sendo `profiles`; uma pessoa poderá ser responsável familiar e profissional simultaneamente.
- Não transformar o papel de `family_memberships` em profissão.
- Não conceder acesso a crianças porque alguém declarou uma profissão.
- Distinguir profissão autodeclarada, credencial submetida e credencial verificada.
- Não exibir selo de verificação sem processo documentado.
- Credencial pendente, rejeitada ou expirada não concede acesso a dados infantis.

### 12.2 Entidades candidatas para gate futuro

- `professional_profiles`: apresentação profissional mínima vinculada à identidade adulta.
- `professional_credentials`: profissão, conselho/órgão, identificador e estado de verificação. Documentos comprobatórios, se indispensáveis, exigirão Storage privado, retenção definida e acesso administrativo restrito.
- `care_relationships`: vínculo entre profissional, família e criança, finalidade, validade, responsável que autorizou e estado/revogação.
- `care_access_grants`: concessões granulares por recurso/categoria de informação e período.
- `audit_events`: trilha mínima de acessos e ações relevantes, com proteção e retenção definidas.

São nomes candidatos, não schema aprovado. Nenhuma dessas tabelas será criada agora; não criar tabela infantil nem vínculo profissional-criança antes de gate específico.

### 12.3 Autorização contextual e granular

A autorização futura deverá ser vinculada a:
1. Criança específica, nunca automaticamente a todas as crianças do espaço.
2. Profissional autenticado e identificado.
3. Finalidade explícita do acompanhamento.
4. Categorias de informação estritamente necessárias.
5. Prazo e revisão periódica.
6. Responsável que concedeu a autorização e evidência de sua autoridade.
7. Revogação acessível à família, com efeito definido.
8. Registro auditável de concessões, consultas relevantes, alterações e revogações.

O vínculo não autoriza automaticamente exportação, download, compartilhamento ou acesso ao histórico completo. Cada capacidade exige avaliação própria. Autorização familiar não substitui análise de base legal, melhor interesse da criança, deveres profissionais e demais requisitos aplicáveis.

### 12.4 Regras de segurança futuras

- Nenhum profissional cria ou amplia o próprio vínculo com uma família.
- A família não pode marcar uma credencial como verificada.
- Verificação ocorre por processo confiável, com estados como `pending`, `verified`, `rejected` e `expired`.
- Acesso é específico por profissional; não é herdado por colegas, clínicas ou instituições.
- Contas de clínicas/equipes exigem modelo próprio de organização, delegação e responsabilidade.
- Documentos de credenciais não são públicos por padrão.
- Toda leitura de dado infantil deve ser autorizada no servidor e testada entre famílias, profissionais, vínculos ativos, expirados e revogados.

### 12.5 Gate independente

Antes de qualquer piloto com dados reais, exigir pesquisa com famílias e profissionais, análise jurídica/privacidade, processo verificável de credenciais, autorização granular, RLS e testes cross-role, auditoria, retenção, exclusão, resposta a abuso e revisão independente proporcional ao risco.

**Estado atual:** visão futura registrada. Perfis profissionais, credenciais, vínculos de cuidado e acesso a crianças não fazem parte do MVP de identidade adulta e espaço familiar. Nenhum dado infantil real está autorizado.


## 13. Invariante transversal: preservar perspectivas distintas

Quando a colaboração profissional for desenhada, as políticas de autorização deverão proteger cada contribuição sem estabelecer hierarquia de verdade. RLS e grants decidem quem pode ler ou escrever cada recurso; não podem inferir que uma perspectiva é superior por ser profissional, majoritária ou mais recente.

O futuro modelo deverá preservar autoria, contexto, tipo e proveniência das contribuições. Não permitir sobrescrita entre observações familiares, interpretações, avaliações profissionais e orientações. Divergências podem coexistir; não criar RPC, trigger, view, job ou função que consolide opiniões em consenso obrigatório ou perfil canônico da criança. Sínteses derivadas deverão manter referências às fontes e não substituir registros originais.

Adicionar aos testes futuros: duas perspectivas divergentes permanecem acessíveis segundo permissões independentes; nenhuma sobrescreve a outra; revogação altera acesso sem adulterar autoria/histórico; sínteses não ocultam fontes. Aplicar PG-06 e o documento docs/principio-pluralidade-perspectivas-v0-1.md antes de qualquer implementação profissional.
