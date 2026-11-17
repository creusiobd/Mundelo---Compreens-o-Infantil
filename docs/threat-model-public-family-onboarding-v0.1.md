# Modelo de Ameaças: Cadastro Público e Espaço Familiar v0.1

- **Status:** BASELINE DE PROJETO, NÃO AUDITORIA
- **Data:** 17 de novembro de 2026
- **Sistema:** MUNDELO, cadastro público de adultos responsáveis
- **Tecnologia escolhida:** Supabase Auth + PostgreSQL + RLS
- **Hospedagem web:** ainda não decidida
- **Dados infantis reais:** FORA DE ESCOPO E BLOQUEADOS

## 1. Objetivo e limite

Identificar ameaças introduzidas ao sair de uma SPA demonstrativa em memória para uma experiência pública com contas de adultos e persistência remota mínima.

Este documento não declara o sistema seguro, não substitui pentest, revisão jurídica, DPIA/RIPD ou auditoria independente. O modelo deverá ser atualizado quando hospedagem, sessão, migrations e integrações forem definidas.

## 2. Ativos e classificação

| Ativo | Sensibilidade | Escopo G1-G3 |
|---|---|---|
| E-mail e nome de exibição do responsável | Dado pessoal | Sim, minimização |
| Credenciais e tokens de sessão | Segredo de autenticação | Sim, nunca registrar em logs |
| Identificador Supabase Auth | Identificador pessoal | Sim |
| Aceites legais versionados | Evidência de decisão | Sim |
| Espaço familiar e membership | Metadado de relacionamento | Sim |
| Preferências opcionais | Dado pessoal | Somente se necessário |
| Perfil, observações e anexos infantis | Potencialmente sensível e de alto risco | **Não permitido** |
| Segredos administrativos e service role | Segredo crítico | Nunca no cliente |

## 3. Fronteiras de confiança

1. Navegador e dispositivo do responsável: ambiente não confiável.
2. Frontend público: código observável e modificável pelo usuário.
3. Supabase Auth: provedor de identidade externo.
4. PostgREST/API e PostgreSQL: fronteira de autorização e persistência.
5. Operadores do projeto e console administrativo: acesso privilegiado, sujeito a MFA e menor privilégio.
6. Provedor de hospedagem web: ainda não selecionado; deve ser incluído na revisão final.

O frontend nunca é autoridade para decidir propriedade de registros. O banco e serviços confiáveis devem validar identidade e autorização.

## 4. STRIDE

| Categoria | Cenário de ameaça | Controles exigidos | Evidência de saída |
|---|---|---|---|
| Spoofing | Uso de conta alheia, phishing ou tomada de sessão | Verificação de e-mail, recuperação segura, MFA administrativo, proteção de sessão e orientação anti-phishing | Testes de autenticação e sessão |
| Tampering | Alterar user_id, family_id ou role via API/cliente | RLS, constraints, grants mínimos, campos de ownership não editáveis pelo cliente | Testes negativos de CRUD |
| Repudiation | Disputa sobre aceite ou ação administrativa | Aceite versionado com timestamp e referência documental; logs administrativos mínimos e protegidos | Testes de trilha e integridade |
| Information Disclosure | Conta A lê dados da conta B; tokens ou PII em logs | RLS em todas as tabelas expostas, isolamento por membership, logs redigidos e revisão de tráfego | Testes cross-tenant e inspeção de logs |
| Denial of Service | Cadastro automatizado, abuso de e-mail, força bruta ou saturação | Rate limits, CAPTCHA/anti-bot adaptativo quando necessário, limites do provedor e monitoramento | Testes de abuso e alertas |
| Elevation of Privilege | Usuário se promove a administrador ou cria membership privilegiada | Papéis definidos no servidor, nenhuma confiança em metadata mutável pelo cliente, grants mínimos | Testes de escalada e revisão SQL |

## 5. Riscos prioritários e critérios

### T-01: Falha de isolamento entre famílias — CRÍTICO

- **Ataque:** usuário autenticado altera UUID e consulta ou modifica espaço de outra família.
- **Mitigação:** RLS habilitada em cada tabela exposta; policies baseadas em `auth.uid()` e membership consultada com função segura; constraints de integridade; testes com duas contas.
- **Bloqueio:** nenhuma tabela de aplicação será considerada pronta sem testes positivos e negativos de RLS.

### T-02: Exposição de segredo administrativo — CRÍTICO

- **Ataque:** service role, senha de banco ou token privilegiado incluído em variável `VITE_*`, bundle, log ou commit.
- **Mitigação:** segredo apenas em ambiente confiável; scanner de segredos; rotação em caso de exposição; PR e revisão de configuração.
- **Bloqueio:** qualquer segredo privilegiado no cliente impede release.

### T-03: Tomada de conta e sessão — ALTO

- **Ataque:** phishing, senha reutilizada, dispositivo compartilhado, XSS ou sessão persistente indevida.
- **Mitigação:** verificação de e-mail, política de recuperação, expiração/revogação, proteção de origem e CSP compatível com a arquitetura; sessão escolhida após decisão de hospedagem.
- **Bloqueio:** fluxos de recuperação e logout precisam invalidar ou encerrar a sessão conforme o desenho aprovado.

### T-04: Enumeração de contas — MÉDIO

- **Ataque:** respostas distintas revelam se um e-mail está cadastrado.
- **Mitigação:** mensagens genéricas, respostas e tempos consistentes sempre que possível, rate limits e monitoramento.
- **Evidência:** testes de respostas para e-mails existentes e inexistentes.

### T-05: Abuso de cadastro público — ALTO

- **Ataque:** bots criam contas em massa, disparam e-mails ou abusam de recursos.
- **Mitigação:** rate limits, proteção anti-bot adaptativa, limites de envio, alertas e procedimentos de bloqueio.
- **Evidência:** teste controlado e configuração revisada antes de abrir o cadastro.

### T-06: Coleta excessiva — ALTO

- **Ataque:** formulários pedem dados não necessários ou induzem compartilhamento de informações infantis antes da liberação.
- **Mitigação:** nome de exibição e e-mail apenas na primeira etapa; não solicitar nome, data de nascimento, diagnóstico, escola, foto ou observações de crianças.
- **Bloqueio:** qualquer campo de dados infantis no cadastro inicial exige revisão de escopo.

### T-07: Aceite legal ambíguo — ALTO

- **Ataque:** aceite genérico, pré-marcado, sem versão ou confundido com consentimento para tratamento opcional.
- **Mitigação:** documentos versionados, aceites separados por finalidade, ação afirmativa, timestamp e possibilidade de retirar consentimentos opcionais.
- **Bloqueio:** revisão jurídica e de privacidade antes de produção.

### T-08: Exclusão incompleta — ALTO

- **Ataque:** conta removida na autenticação, mas dados remanescentes em tabelas, logs, backups ou serviços terceiros.
- **Mitigação:** fluxo documentado de exclusão, inventário de subprocessadores, prazos de retenção e tratamento de backups.
- **Bloqueio:** direitos de titulares e exclusão devem ser operacionalmente demonstráveis antes de cadastro público em produção.

### T-09: XSS e roubo de sessão — ALTO

- **Ataque:** script injetado captura tokens ou age em nome do usuário.
- **Mitigação:** evitar HTML não confiável, sanitização contextual, CSP, dependências revisadas, cookies seguros se arquitetura server-mediated; não declarar localStorage seguro.
- **Bloqueio:** sessão e hospedagem precisam ser decididas antes da configuração final de produção.

### T-10: Privilégio administrativo indevido — ALTO

- **Ataque:** credencial administrativa comprometida ou acesso excessivo ao painel.
- **Mitigação:** MFA, menor privilégio, contas individuais, rotação de segredos, revisão de membros e logs administrativos.
- **Bloqueio:** nenhuma operação administrativa compartilhada por credenciais pessoais genéricas.

## 6. Regras de arquitetura e dados

- Negar por padrão.
- RLS em todas as tabelas expostas pela API.
- Nunca autorizar com base apenas em estado React, localStorage ou payload fornecido pelo cliente.
- Não expor service role no navegador.
- Não habilitar tabelas ou buckets públicos por conveniência.
- Não armazenar conteúdo de observações ou dados infantis em logs, analytics, ferramentas de suporte ou telemetria.
- Não instalar SDK de analytics/ads na primeira entrega sem análise de privacidade.
- Separar ambientes e projetos de desenvolvimento e produção.
- Usar dados sintéticos em testes, screenshots e demonstrações.
- Registrar migrations, policies e grants no Git.

## 7. Portões de risco

| Gate | Condição | Estado inicial |
|---|---|---|
| G0 Arquitetura | ADR, modelo e plano revisados | Em preparação |
| G1 Identidade adulta | Cadastro, verificação, login, logout, recuperação e abuso testados | Bloqueado |
| G2 Isolamento | RLS e testes cross-tenant aprovados | Bloqueado |
| G3 Boas-vindas | Sem dados infantis e com direitos da conta acessíveis | Bloqueado |
| G4 Privacidade operacional | Retenção, exclusão, incidentes, subprocessadores e revisão jurídica | Bloqueado |
| G5 Dados infantis | Gate independente, consentimento/base legal, melhor interesse e segurança aprovados | **BLOQUEADO** |

## 8. Critérios mínimos de teste

- Conta A não lê, altera ou exclui registros da conta B.
- Usuário não consegue alterar seu próprio papel para administrador.
- Sessão expirada não acessa área autenticada.
- Logout encerra a sessão e bloqueia rotas privadas.
- Fluxo de recuperação não revela existência de conta.
- Nenhum segredo privilegiado aparece em bundle, source maps, logs ou Git.
- RLS testada por SQL/API com usuários distintos, não apenas por componentes React.
- Formulários iniciais não solicitam dados infantis.
- Logs não contêm senha, token, conteúdo de observações ou dados infantis.
- Fluxo de exclusão possui inventário e evidência.

## 9. Risco residual e aprovação

Riscos residuais permanecem até que o projeto de Supabase seja configurado, as migrations e policies existam, os testes sejam executados e a hospedagem/sessão sejam decididas. Este documento é uma análise de desenho, não evidência de mitigação implementada.

**Regra de liberação:** o cadastro infantil continuará indisponível por feature flag e por ausência de rotas/tabelas funcionais. A simples ocultação de botão no frontend não será considerada controle suficiente para quando o backend infantil vier a existir.

## 10. Referências

- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Auth: https://supabase.com/docs/guides/auth
- LGPD: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- ANPD: https://www.gov.br/anpd/pt-br
