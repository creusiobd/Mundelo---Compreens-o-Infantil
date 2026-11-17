# Supabase Auth SPA + PKCE | Guia de desenvolvimento MUNDELO v0.1

- **Status:** GUIA DE PREPARAÇÃO, NÃO EXECUTADO
- **Data:** 17 de novembro de 2026
- **Escopo:** ambiente local de desenvolvimento com contas adultas sintéticas
- **Fora de escopo:** produção, hospedagem definitiva, dados infantis, migração dos mocks e publicação pública

## 1. Objetivo

Preparar a futura integração da aplicação React/Vite com Supabase Auth usando Authorization Code com PKCE. Este documento não cria projeto, não configura credenciais e não prova que autenticação ou segurança estejam funcionando.

## 2. Arquitetura de desenvolvimento

```text
Browser (React + Vite)
  ├── telas públicas: apresentação / cadastro / login / recuperação
  ├── Supabase Auth SDK (PKCE)
  └── chave pública do projeto
          |
          v
Supabase Auth
  ├── cadastro e confirmação de e-mail
  ├── login / logout
  ├── recuperação e redefinição
  └── sessão e renovação
          |
          v
PostgreSQL + RLS
  └── somente dados mínimos de adultos e espaço familiar
```

O navegador não recebe segredo administrativo. O frontend não decide quem pode ler ou alterar registros: essa decisão pertence às políticas RLS e aos grants do banco.

## 3. Pré-requisitos antes de conectar

- Revisar e aprovar o inventário mínimo de dados e o schema conceitual.
- Criar um projeto Supabase exclusivamente de desenvolvimento, por ação explícita do responsável.
- Confirmar região, limites e política de custo antes de inserir dados.
- Configurar URLs locais de confirmação e recuperação.
- Não importar dados de famílias, crianças ou perfis demonstrativos.
- Usar exclusivamente contas de teste adultas e dados sintéticos.
- Guardar a URL e a chave pública em variáveis locais não versionadas.

## 4. Configuração de Auth esperada

No projeto de desenvolvimento, configurar:

- confirmação de e-mail habilitada;
- redirect URLs limitadas ao ambiente local autorizado;
- URLs de recuperação limitadas ao ambiente local autorizado;
- política de senha e proteção contra abuso compatíveis com as capacidades do projeto;
- mensagens e comportamento que reduzam enumeração de contas;
- provedor de e-mail disponível para desenvolvimento, avaliando limites antes de depender do serviço padrão.

A confirmação de e-mail deve retornar para uma rota explícita da aplicação, que valida a sessão e apresenta feedback acessível. Não confiar em parâmetros de URL como prova de autorização.

## 5. Variáveis locais

Modelo ilustrativo de nomes, sem valores reais:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

O arquivo local de ambiente deve estar ignorado pelo Git. Um `.env.example` pode conter apenas nomes e valores vazios ou placeholders. Nunca adicionar `service_role`, senha de banco, access token, refresh token ou segredo administrativo a variáveis `VITE_*`: variáveis com esse prefixo podem ser incluídas no bundle do navegador.

A nomenclatura exata da chave deve acompanhar o tipo de chave pública disponibilizada pelo projeto Supabase e a versão do SDK adotada.

## 6. Fluxos a implementar depois da aprovação do schema

1. Cadastro de adulto com nome de exibição, e-mail e senha.
2. Confirmação de e-mail e retorno à aplicação.
3. Login e logout.
4. Recuperação e redefinição de senha.
5. Estados de carregamento, erro, sessão expirada e sessão renovada.
6. Proteção de rotas apenas como UX, nunca como autorização de dados.
7. Área familiar de boas-vindas sem qualquer cadastro infantil.

O SDK deve ser configurado explicitamente para o fluxo PKCE. Não implementar manualmente geração, armazenamento ou troca de tokens quando o SDK oficial já oferece o fluxo.

## 7. Segurança de sessão e navegador

- PKCE protege o código de autorização durante a troca por tokens; não neutraliza XSS.
- Evitar scripts de terceiros e dependências desnecessárias.
- Definir CSP adequada ao build e aos endpoints realmente usados.
- Evitar `dangerouslySetInnerHTML` e validar/sanitizar qualquer conteúdo HTML inevitável.
- Não expor tokens em logs, telemetria, URLs persistentes ou mensagens de erro.
- Não copiar tokens para stores globais ou mecanismos de persistência próprios.
- Implementar logout e tratar falhas de renovação e revogação de sessão.
- Usar HTTPS em qualquer ambiente compartilhado ou remoto.
- Revisar source maps e política de publicação antes de qualquer demo externa.
- Nunca considerar guards React, variáveis de ambiente públicas ou IDs ocultos como controles de autorização.

A estratégia padrão do SDK pode persistir sessão no armazenamento do navegador. Isso deve ser confirmado na versão instalada e explicitamente documentado. A decisão de produção deve considerar o risco de XSS e a alternativa de sessão mediada por servidor com cookies HttpOnly/Secure/SameSite e proteção CSRF.

## 8. Testes mínimos antes de avançar

### Auth
- Cadastro com e-mail válido.
- Confirmação de e-mail.
- Login com credenciais corretas e incorretas.
- Logout e retorno a estado não autenticado.
- Recuperação e redefinição de senha.
- Sessão expirada/renovada e refresh inválido.
- Mensagens sem revelar desnecessariamente se um e-mail existe.

### Isolamento de dados
- Conta A não lê, altera ou exclui registros de B.
- Conta B não lê, altera ou exclui registros de A.
- Usuário anônimo não acessa tabelas protegidas.
- Cliente não consegue atribuir a si mesmo papel privilegiado nem alterar ownership.
- Testes executados contra Supabase local/de teste com identidades distintas; mocks de frontend não contam como evidência de RLS.

### Privacidade e superfície
- Nenhum dado infantil real em banco, logs, analytics ou fixtures de autenticação.
- Nenhuma chave privilegiada no bundle ou histórico Git.
- Nenhum token em logs, URLs ou relatórios de teste.
- Verificação de CSP, redirects e origens permitidas.

## 9. Critérios de bloqueio

Não avançar para cadastro público real se:

- RLS ou grants estiverem incompletos;
- testes cruzados entre contas não forem aprovados;
- existir segredo privilegiado no cliente;
- recuperação ou logout não forem confiáveis;
- logs ou telemetria coletarem dados excessivos;
- a revisão de sessão/XSS e a decisão de hospedagem estiverem pendentes para produção;
- o fluxo permitir qualquer entrada funcional para dados de crianças.

## 10. Próxima etapa

Após revisão deste guia, a próxima intervenção é preparar o projeto Supabase de desenvolvimento e a CLI/migrations, mas somente depois de o responsável autorizar a criação do projeto e revisar o schema mínimo. Não executar migrations em produção nem configurar serviços pagos sem aprovação explícita.

## 11. Referências

- Supabase Auth: https://supabase.com/docs/guides/auth
- PKCE flow: https://supabase.com/docs/guides/auth/sessions/pkce-flow
- Supabase JS Auth: https://supabase.com/docs/reference/javascript/auth
- Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Database migrations: https://supabase.com/docs/guides/deployment/database-migrations
