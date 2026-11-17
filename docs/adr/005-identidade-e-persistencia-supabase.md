# ADR-005: Supabase para identidade e persistência do espaço familiar

- **Status:** ACEITA PARA IMPLEMENTAÇÃO CONTROLADA
- **Data:** 17 de novembro de 2026
- **Decisores:** responsável pelo produto MUNDELO
- **Escopo:** identidade de adultos responsáveis e espaço familiar inicial
- **Não autoriza:** coleta, criação, armazenamento ou migração de dados reais de crianças

## 1. Contexto

O MUNDELO passará de uma demonstração com dados sintéticos e estado em memória para uma experiência com cadastro público de adultos responsáveis. Qualquer família interessada poderá criar uma conta, sem convite ou aprovação manual.

A primeira experiência autenticada será uma área familiar de boas-vindas. O cadastro infantil permanecerá bloqueado até a aprovação explícita de gates de privacidade, segurança, consentimento, governança e conformidade.

A aplicação atual é React 19 + TypeScript + Vite. O contexto principal mantém perfis e cuidadores demonstrativos em memória. O modelo de autorização existente é explicitamente client-side e não constitui controle de acesso no servidor. O cofre `.mundelo-vault` é um protótipo criptográfico local e não é sistema de identidade ou persistência multiusuário.

## 2. Decisão de plataforma

Adotar **Supabase** como plataforma inicial para:

- Supabase Auth: identidade de adultos responsáveis;
- PostgreSQL: persistência de dados mínimos de conta e espaço familiar;
- Row Level Security (RLS): autorização de acesso aos registros;
- Supabase CLI e migrations versionadas: evolução reproduzível do esquema e das políticas.

A escolha de hospedagem da aplicação web fica **adiada**. A arquitetura deverá manter o frontend desacoplado do provedor de hospedagem e não pressupor GitHub Pages, Cloud Run ou outro destino.

## 3. Decisão de sessão para desenvolvimento

Para o primeiro ambiente de desenvolvimento, adotar uma SPA React/Vite integrada diretamente ao Supabase Auth SDK, usando o fluxo **Authorization Code com PKCE**.

Diretrizes:

- Usar a chave pública/publishable do projeto no cliente, nunca uma chave privilegiada.
- Configurar URLs de confirmação e recuperação para o ambiente de desenvolvimento.
- Manter o tratamento de sessão no SDK oficial, sem implementar armazenamento artesanal de tokens.
- Não registrar access tokens, refresh tokens, senhas, links de recuperação ou conteúdo de formulários em logs.
- Tratar confirmação de e-mail, expiração, renovação, logout e recuperação como estados explícitos da aplicação.
- Aplicar CSP restritiva e minimizar scripts de terceiros; revisar dependências e superfícies de HTML dinâmico.
- Não usar estado React, guards de rota ou dados recebidos do navegador como autoridade de autorização. O banco e as políticas RLS são a fronteira de acesso aos dados.
- Não habilitar funcionalidades de criança, nem criar tabelas infantis nesta etapa.

PKCE protege a troca do código de autorização, mas **não protege uma sessão já estabelecida contra XSS**. O armazenamento e a renovação de sessão no navegador ampliam o impacto potencial de uma execução de script não autorizada. A escolha para desenvolvimento não constitui aprovação automática para produção.

## 4. Condição para produção

Antes de liberar cadastro público em produção, reavaliar formalmente:

1. Modelo de ameaça atualizado para XSS, roubo de sessão, recuperação de conta e abuso de cadastro.
2. CSP, dependências, scripts de terceiros, sanitização e prevenção de injeção.
3. Configuração de sessão, persistência, renovação, expiração e logout.
4. Domínio, HTTPS, redirect URLs e proteção de origens.
5. Hospedagem, observabilidade, limites, custos e região do Supabase.
6. Necessidade de camada server-side com cookies seguros HttpOnly, Secure e SameSite, incluindo proteção CSRF, se a análise de risco exigir.
7. Testes com contas distintas e revisão independente proporcional ao risco.

A hospedagem continua sendo uma decisão separada. Se a revisão indicar que a SPA com sessão no navegador não atende ao risco aceitável, a arquitetura deverá migrar para uma camada server-side antes da publicação, sem tratar essa mudança como detalhe posterior.

## 5. Escopo da primeira entrega

Entidades candidatas:

- `profiles`: metadados mínimos do usuário autenticado, com chave vinculada a `auth.users.id`;
- `family_spaces`: espaço familiar pertencente ao responsável que o criou;
- `family_memberships`: vínculo e papel de adultos no espaço familiar, inicialmente apenas o criador;
- `legal_acceptances`: registro de versão de termos e política aceitos, horário e identificador do usuário;
- `privacy_preferences`: preferências opcionais, separadas de aceites necessários.

O esquema final será revisado antes da primeira migration. Não criar tabela de crianças, observações, anexos, diagnósticos, dados de saúde, escola ou desenvolvimento nesta etapa.

## 6. Fluxos de identidade

1. Cadastro público de adulto com nome de exibição, e-mail e senha.
2. Verificação de e-mail antes de considerar a conta apta a acessar a área autenticada.
3. Login e logout.
4. Recuperação e redefinição de senha.
5. Gestão de sessão e tratamento de sessão expirada.
6. Aceite versionado dos documentos legais necessários, sem caixas pré-marcadas.
7. Área familiar de boas-vindas sem formulário infantil ou conteúdo infantil real.

Mensagens de erro e respostas de cadastro devem reduzir enumeração de e-mails. Aplicar proteção contra abuso e automação conforme risco e capacidades disponíveis.

## 7. Segurança obrigatória

- RLS habilitada em toda tabela exposta pela API.
- Políticas explícitas de negação por padrão e isolamento por `auth.uid()` e membership validada.
- Testes negativos entre duas contas independentes, inclusive tentativa de leitura, inserção, atualização e exclusão cruzadas.
- Nunca colocar `service_role`, segredo de banco, chave privada ou credencial administrativa no bundle do navegador.
- A chave pública/publishable do projeto não é segredo e só poderá ser usada com RLS e grants mínimos corretamente configurados.
- Não confiar em IDs, papéis, flags ou permissões fornecidos pelo cliente.
- Nenhum endpoint privilegiado pode aceitar autorização baseada apenas em estado React.
- Segredos de desenvolvimento e produção separados; nenhuma credencial real no Git.
- Logs sem senhas, tokens, conteúdo de formulário ou dados infantis.
- Dependências, migrations e políticas revisadas por PR.

## 8. Alternativas consideradas

### Firebase Auth + Firestore

Alternativa tecnicamente válida e familiar ao histórico do responsável pelo projeto. Não escolhida porque o domínio familiar e os vínculos relacionais se beneficiam do modelo relacional e das políticas SQL/RLS do PostgreSQL.

### Backend próprio + PostgreSQL

Oferece controle, mas aumenta a superfície operacional, o custo de manutenção e a responsabilidade de implementar identidade, recuperação, sessão e proteção contra abuso. Não é a opção inicial mais enxuta.

### Persistência apenas local

Incompatível com cadastro público multi-dispositivo, recuperação de conta e espaço familiar persistente.

## 9. Consequências

**Benefícios**
- Identidade e persistência com serviços integrados.
- Modelo relacional para famílias e papéis.
- Políticas de autorização próximas aos dados.
- Migrations auditáveis e versionadas.
- Caminho de desenvolvimento inicial sem exigir backend próprio.

**Custos e riscos**
- Dependência operacional do Supabase.
- RLS exige desenho e testes rigorosos; uma política incorreta pode expor dados.
- XSS pode comprometer sessões mantidas no navegador.
- Custos, limites do plano e disponibilidade deverão ser reavaliados antes da publicação.
- O provedor de identidade não resolve, por si só, consentimento legal, verificação de responsável, governança ou conformidade.

## 10. Gates e condições de liberação

- **G0 Arquitetura:** ADR, modelo de ameaças, plano técnico e estratégia de sessão de desenvolvimento revisados.
- **G1 Identidade adulta:** cadastro, verificação, login, logout e recuperação testados.
- **G2 Espaço familiar:** isolamento RLS validado com duas ou mais contas de teste.
- **G3 Boas-vindas:** primeira experiência sem dados infantis.
- **G4 Privacidade:** direitos do titular, retenção, exclusão, incidentes, registros de consentimento e revisão jurídica definidos.
- **G5 Cadastro infantil:** bloqueado até aprovação documentada de todos os critérios específicos.

Nenhum gate documental equivale a auditoria externa ou certificação legal.

## 11. Referências

- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase PKCE flow: https://supabase.com/docs/guides/auth/sessions/pkce-flow
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase API keys: https://supabase.com/docs/guides/api/api-keys
- Supabase database migrations: https://supabase.com/docs/guides/deployment/database-migrations
- LGPD, Lei nº 13.709/2018, art. 14: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- ANPD: https://www.gov.br/anpd/pt-br

## 12. Registro de revisão

A decisão tecnológica Supabase foi explicitamente confirmada pelo responsável pelo produto em 17/11/2026. Em seguida, foi aprovada a estratégia SPA com Supabase Auth SDK e PKCE **para desenvolvimento**, mantendo a hospedagem em aberto e a sessão de produção condicionada à revisão de segurança. Nenhum projeto Supabase foi criado por esta decisão. Nenhuma credencial foi configurada. A decisão deverá ser revisitada se requisitos de sessão, residência de dados, custos, disponibilidade ou controles regulatórios não puderem ser atendidos.
