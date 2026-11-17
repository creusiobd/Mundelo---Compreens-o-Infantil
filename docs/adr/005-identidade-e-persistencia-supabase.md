# ADR-005: Supabase para identidade e persistência do espaço familiar

- **Status:** ACEITA PARA IMPLEMENTAÇÃO
- **Data:** 17 de novembro de 2026
- **Decisores:** responsável pelo produto MUNDELO
- **Escopo:** identidade de adultos responsáveis e espaço familiar inicial
- **Não autoriza:** coleta, criação, armazenamento ou migração de dados reais de crianças

## 1. Contexto

O MUNDELO passará de uma demonstração com dados sintéticos e estado em memória para uma experiência com cadastro público de adultos responsáveis. Qualquer família interessada poderá criar uma conta, sem convite ou aprovação manual.

A primeira experiência autenticada será uma área familiar de boas-vindas. O cadastro infantil permanecerá bloqueado até a aprovação explícita de gates de privacidade, segurança, consentimento, governança e conformidade.

A aplicação atual é React 19 + TypeScript + Vite. O contexto principal mantém perfis e cuidadores demonstrativos em memória. O modelo de autorização existente é explicitamente client-side e não constitui controle de acesso no servidor. O cofre `.mundelo-vault` é um protótipo criptográfico local e não é sistema de identidade ou persistência multiusuário.

## 2. Decisão

Adotar **Supabase** como plataforma inicial para:

- Supabase Auth: identidade de adultos responsáveis;
- PostgreSQL: persistência de dados mínimos de conta e espaço familiar;
- Row Level Security (RLS): autorização de acesso aos registros;
- Supabase CLI e migrations versionadas: evolução reproduzível do esquema e das políticas.

A escolha de hospedagem da aplicação web fica **adiada**. A arquitetura deverá manter o frontend desacoplado do provedor de hospedagem e não pressupor GitHub Pages, Cloud Run ou outro destino.

## 3. Escopo da primeira entrega

Entidades candidatas:

- `profiles`: metadados mínimos do usuário autenticado, com chave vinculada a `auth.users.id`;
- `family_spaces`: espaço familiar pertencente ao responsável que o criou;
- `family_memberships`: vínculo e papel de adultos no espaço familiar, inicialmente apenas o criador;
- `legal_acceptances`: registro de versão de termos e política aceitos, horário e identificador do usuário;
- `privacy_preferences`: preferências opcionais, separadas de aceites necessários.

O esquema final será revisado antes da primeira migration. Não criar tabela de crianças, observações, anexos, diagnósticos, dados de saúde, escola ou desenvolvimento nesta etapa.

## 4. Fluxos de identidade

1. Cadastro público de adulto com nome de exibição, e-mail e senha.
2. Verificação de e-mail antes de considerar a conta apta a acessar a área autenticada.
3. Login e logout.
4. Recuperação e redefinição de senha.
5. Gestão de sessão e tratamento de sessão expirada.
6. Aceite versionado dos documentos legais necessários, sem caixas pré-marcadas.
7. Área familiar de boas-vindas sem formulário infantil ou conteúdo infantil real.

Mensagens de erro e respostas de cadastro devem reduzir enumeração de e-mails. Aplicar proteção contra abuso e automação conforme risco e capacidades disponíveis.

## 5. Segurança obrigatória

- RLS habilitada em toda tabela exposta pela API.
- Políticas explícitas de negação por padrão e isolamento por `auth.uid()` e membership validada.
- Testes negativos entre duas contas independentes, inclusive tentativa de leitura, inserção, atualização e exclusão cruzadas.
- Nunca colocar `service_role`, segredo de banco, chave privada ou credencial administrativa no bundle do navegador.
- A chave pública/anon do projeto não é segredo e só poderá ser usada com RLS e grants mínimos corretamente configurados.
- Não confiar em IDs, papéis, flags ou permissões fornecidos pelo cliente.
- Nenhum endpoint privilegiado pode aceitar autorização baseada apenas em estado React.
- Segredos de desenvolvimento e produção separados; nenhuma credencial real no Git.
- Logs sem senhas, tokens, conteúdo de formulário ou dados infantis.
- Dependências, migrations e políticas revisadas por PR.

A escolha entre sessão persistida pelo SDK no navegador e sessão mediada por servidor/cookies seguros depende da arquitetura de hospedagem e deverá ser documentada antes da implementação de produção. Não assumir que armazenamento no navegador protege contra XSS.

## 6. Alternativas consideradas

### Firebase Auth + Firestore

Alternativa tecnicamente válida e familiar ao histórico do responsável pelo projeto. Não escolhida porque o domínio familiar e os vínculos relacionais se beneficiam do modelo relacional e das políticas SQL/RLS do PostgreSQL.

### Backend próprio + PostgreSQL

Oferece controle, mas aumenta a superfície operacional, o custo de manutenção e a responsabilidade de implementar identidade, recuperação, sessão e proteção contra abuso. Não é a opção inicial mais enxuta.

### Persistência apenas local

Incompatível com cadastro público multi-dispositivo, recuperação de conta e espaço familiar persistente.

## 7. Consequências

**Benefícios**
- Identidade e persistência com serviços integrados.
- Modelo relacional para famílias e papéis.
- Políticas de autorização próximas aos dados.
- Migrations auditáveis e versionadas.

**Custos e riscos**
- Dependência operacional do Supabase.
- RLS exige desenho e testes rigorosos; uma política incorreta pode expor dados.
- Custos, limites do plano e disponibilidade deverão ser reavaliados antes da publicação.
- O provedor de identidade não resolve, por si só, consentimento legal, verificação de responsável, governança ou conformidade.

## 8. Gates e condições de liberação

- **G0 Arquitetura:** ADR, modelo de ameaças e plano técnico revisados.
- **G1 Identidade adulta:** cadastro, verificação, login, logout e recuperação testados.
- **G2 Espaço familiar:** isolamento RLS validado com duas ou mais contas de teste.
- **G3 Boas-vindas:** primeira experiência sem dados infantis.
- **G4 Privacidade:** direitos do titular, retenção, exclusão, incidentes, registros de consentimento e revisão jurídica definidos.
- **G5 Cadastro infantil:** bloqueado até aprovação documentada de todos os critérios específicos.

Nenhum gate documental equivale a auditoria externa ou certificação legal.

## 9. Referências

- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase API keys: https://supabase.com/docs/guides/api/api-keys
- Supabase database migrations: https://supabase.com/docs/guides/deployment/database-migrations
- LGPD, Lei nº 13.709/2018, art. 14: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- ANPD: https://www.gov.br/anpd/pt-br

## 10. Registro de revisão

A decisão tecnológica foi explicitamente confirmada pelo responsável pelo produto em 17/11/2026. A hospedagem da aplicação web permanece em aberto. A decisão deverá ser revisitada se requisitos de sessão, residência de dados, custos, disponibilidade ou controles regulatórios não puderem ser atendidos.
