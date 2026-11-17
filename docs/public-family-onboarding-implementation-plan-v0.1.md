# Plano Técnico: Cadastro Público e Área Familiar MUNDELO v0.1

- **Status:** PLANEJADO, NÃO IMPLEMENTADO
- **Data:** 17 de novembro de 2026
- **Decisão de identidade/persistência:** Supabase
- **Hospedagem web:** decisão adiada
- **Cadastro infantil:** BLOQUEADO

## 1. Objetivo

Permitir que qualquer adulto responsável interessado crie uma conta MUNDELO e encontre uma área familiar de boas-vindas. A primeira versão não permitirá cadastrar crianças nem armazenar informações infantis reais.

## 2. Princípios não negociáveis

1. O repositório GitHub permanece privado.
2. Cadastro público do produto não implica código-fonte público.
3. O frontend não é autoridade de autorização.
4. RLS e testes no banco são obrigatórios.
5. Coletar o mínimo necessário.
6. Nenhum dado infantil real na primeira versão.
7. Hospedagem só será decidida depois da arquitetura de sessão e serviços.
8. Nenhum segredo privilegiado no bundle do navegador.
9. Não migrar os perfis fictícios atuais para contas reais.
10. A experiência deve preservar acessibilidade WCAG 2.2 AA e a linguagem acolhedora do MUNDELO.

## 3. Escopo funcional

### Incluído

- Cadastro de adulto responsável com nome de exibição, e-mail e senha.
- Verificação de e-mail.
- Login e logout.
- Recuperação e redefinição de senha.
- Gestão de sessão e expiração.
- Aceite de termos e política por versão.
- Área familiar de boas-vindas.
- Preferências básicas de conta.
- Encerramento e solicitação de exclusão da conta.
- Instrumentação operacional mínima sem conteúdo pessoal.

### Explicitamente fora do escopo

- Cadastro ou perfil de criança.
- Observações, diário, descobertas ou relatório de criança.
- Fotos, anexos, dados de saúde, diagnóstico ou dados escolares.
- Compartilhamento com educadores, familiares ou profissionais.
- Convites e memberships multi-responsável em produção.
- IA aplicada a dados de famílias.
- Analytics comportamental ou publicidade.
- Publicação do repositório.

## 4. Sequência de execução

### Fase 0 — Preparação e arquitetura

- [ ] Aprovar ADR-005.
- [ ] Revisar modelo de ameaças.
- [ ] Confirmar inventário de dados e minimização.
- [ ] Definir ambientes Supabase dev/staging/prod.
- [ ] Definir fluxo de sessão após decidir se haverá camada server-side.
- [ ] Definir processo de migrations e revisão SQL.
- [ ] Definir política de segredos e rotação.
- [ ] Definir hospedagem web separadamente.
- [ ] Atualizar documentação de continuidade e README após decisões técnicas.

**Saída:** arquitetura aprovada, sem infraestrutura de produção exposta.

### Fase 1 — Fundação Supabase

- [ ] Criar projeto de desenvolvimento Supabase.
- [ ] Guardar URL e chave pública em configuração de ambiente apropriada.
- [ ] Guardar qualquer segredo administrativo apenas em ambiente confiável.
- [ ] Integrar Supabase CLI e migrations versionadas.
- [ ] Criar schema mínimo de perfil adulto, espaço familiar, membership e aceites.
- [ ] Habilitar RLS antes de expor as tabelas pela API.
- [ ] Definir grants mínimos e políticas deny-by-default.
- [ ] Configurar SMTP de produção somente após avaliar provedor, domínio, limites e custos.
- [ ] Configurar URLs de confirmação e recuperação para cada ambiente.

**Saída:** banco de desenvolvimento reproduzível e sem dados reais.

### Fase 2 — Identidade adulta

- [ ] Implementar cadastro.
- [ ] Implementar verificação de e-mail.
- [ ] Implementar login e logout.
- [ ] Implementar recuperação de senha.
- [ ] Implementar tratamento de sessão expirada e revogada.
- [ ] Mensagens que reduzam enumeração de contas.
- [ ] Rate limits e anti-abuso.
- [ ] Acessibilidade de formulários, erros e feedback.
- [ ] Testes unitários e E2E dos fluxos.

**Saída:** adulto consegue criar e acessar sua própria conta de forma verificável.

### Fase 3 — Espaço familiar e boas-vindas

- [ ] Criar espaço familiar associado ao usuário autenticado.
- [ ] Garantir criação idempotente para evitar duplicidade em retries.
- [ ] Área de boas-vindas com apresentação do propósito do MUNDELO.
- [ ] Explicar que o cadastro infantil ainda não está disponível.
- [ ] Configurações básicas e encerramento de sessão.
- [ ] Solicitação de exclusão de conta.
- [ ] Nenhum botão/rota de cadastro infantil funcional.

**Saída:** primeira experiência autenticada pronta, sem dados infantis.

### Fase 4 — Segurança, privacidade e operação

- [ ] Testar isolamento com duas ou mais contas.
- [ ] Testar tentativas de alteração de ownership e papel.
- [ ] Testar recuperação, expiração e revogação de sessão.
- [ ] Verificar bundle, source maps e logs por segredos.
- [ ] Verificar ausência de PII desnecessária em logs.
- [ ] Revisar CSP, CORS, redirect URLs e origens autorizadas.
- [ ] Definir backup, restauração, retenção e exclusão.
- [ ] Definir processo de incidentes e contato de privacidade.
- [ ] Revisar subprocessadores e transferências internacionais aplicáveis.
- [ ] Revisão jurídica da LGPD, ECA Digital e documentos legais.
- [ ] Executar testes de acessibilidade WCAG 2.2 AA.

**Saída:** cadastro público adulto liberável somente após evidência e aprovação do gate.

### Fase 5 — Decisão de hospedagem e lançamento

- [ ] Comparar opções gratuitas e seus limites reais.
- [ ] Validar HTTPS, domínio, redirects e callbacks de Auth.
- [ ] Separar configuração de preview/staging/produção.
- [ ] Configurar observabilidade mínima sem dados pessoais em excesso.
- [ ] Executar checklist de release e rollback.
- [ ] Publicar somente após G1-G4 aprovados.

**Saída:** produto público com cadastro adulto e área familiar.

### Fase 6 — Gate futuro de cadastro infantil

Esta fase é um projeto separado. Não será iniciada automaticamente após G1-G4.

- [ ] Definir finalidade e necessidade de cada categoria de dado infantil.
- [ ] Determinar base legal aplicável e mecanismo de consentimento, quando exigido.
- [ ] Avaliar melhor interesse da criança e direitos de titulares.
- [ ] Definir verificação razoável de responsável legal.
- [ ] Definir modelo de autorização familiar e revogação de vínculos.
- [ ] Definir minimização, retenção, exportação e exclusão por criança.
- [ ] Definir segurança de anexos, logs, backups e compartilhamentos.
- [ ] Atualizar modelo de ameaças e contratos de dados.
- [ ] Executar testes adversariais e revisão independente proporcional ao risco.
- [ ] Aprovação formal no Principles Gate e decisão do responsável pelo produto.

**Saída:** decisão explícita de liberar ou continuar bloqueando cadastro infantil.

## 5. Modelo inicial de dados

Modelo conceitual sujeito à revisão antes das migrations:

### profiles

- `id UUID PRIMARY KEY REFERENCES auth.users(id)`
- `display_name TEXT NOT NULL`
- `created_at TIMESTAMPTZ NOT NULL`
- `updated_at TIMESTAMPTZ NOT NULL`

### family_spaces

- `id UUID PRIMARY KEY`
- `created_by UUID NOT NULL REFERENCES auth.users(id)`
- `name TEXT` opcional, sem exigir nome familiar
- `created_at TIMESTAMPTZ NOT NULL`

### family_memberships

- `family_space_id UUID NOT NULL`
- `user_id UUID NOT NULL REFERENCES auth.users(id)`
- `role TEXT NOT NULL` com enum restrito no servidor
- `status TEXT NOT NULL`
- `created_at TIMESTAMPTZ NOT NULL`

### legal_acceptances

- `id UUID PRIMARY KEY`
- `user_id UUID NOT NULL REFERENCES auth.users(id)`
- `document_type TEXT NOT NULL`
- `document_version TEXT NOT NULL`
- `accepted_at TIMESTAMPTZ NOT NULL`
- `withdrawn_at TIMESTAMPTZ` quando aplicável

Não guardar cópia de senha, token de confirmação, conteúdo de formulário ou dados infantis nessas tabelas. Não armazenar IP completo como padrão sem finalidade e avaliação específica.

## 6. Regras RLS esperadas

- Usuário só lê seu próprio perfil.
- Usuário só atualiza campos de perfil permitidos; não altera `id`, papéis ou ownership.
- Usuário só acessa espaços em que possui membership ativa.
- Membership não pode ser criada com papel privilegiado pelo próprio cliente.
- Criação inicial de espaço deve ocorrer por operação segura e idempotente.
- Aceites são append-only para o cliente; correções administrativas devem deixar trilha.
- Testar cada regra com usuário autenticado, usuário anônimo e segundo usuário sem vínculo.
- Funções `SECURITY DEFINER`, se necessárias, devem ter `search_path` fixo, grants restritos e revisão específica.

## 7. Estratégia de testes

| Camada | Cobertura |
|---|---|
| Unitário | Validação, estados de sessão, formulários e mensagens |
| Integração | Auth, criação idempotente de espaço, aceites |
| RLS | Acesso próprio, acesso cruzado negado, escalada negada |
| E2E | Cadastro, confirmação, login, logout, recuperação e boas-vindas |
| Segurança | Enumeração, abuso, secrets scan, XSS e sessão |
| Acessibilidade | Teclado, foco, leitor de tela, contraste, WCAG 2.2 AA |
| Operação | Backup/restore, exclusão, monitoramento e rollback |

Não contar testes de componentes como evidência de RLS. Testes de autorização devem executar contra banco/API de teste com identidades distintas.

## 8. Critérios de aceite do primeiro release

- Adulto consegue cadastrar e verificar e-mail.
- Login, logout e recuperação funcionam.
- Conta não verificada não acessa a área autenticada, conforme política definida.
- Conta A não acessa nenhum registro de conta B.
- Área familiar exibe boas-vindas sem dados infantis.
- Nenhuma tabela, rota ou formulário funcional de criança está disponível.
- Nenhum segredo privilegiado está no cliente.
- Exclusão e direitos do titular têm processo operacional definido.
- Revisão de privacidade e segurança concluída.
- Hospedagem e sessão foram decididas e testadas antes de produção.
- Repositório continua privado.

## 9. Riscos e decisões em aberto

- Hospedagem da aplicação web.
- Estratégia final de sessão (SPA com persistência no cliente versus camada server-side/cookies).
- SMTP e domínio de e-mail transacional.
- Limites, custos e região do projeto Supabase.
- Retenção e exclusão de dados de conta.
- Documentos legais e revisão profissional.
- Processo de verificação de responsável legal para a futura fase infantil.

## 10. Registro de execução

Até a aprovação deste plano, nenhum projeto Supabase foi criado, nenhuma migration foi aplicada e nenhum fluxo de autenticação foi implementado. Os itens acima são plano, não evidência de execução.
