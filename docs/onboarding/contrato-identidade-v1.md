# ONB-002 — Contrato de identidade, sessão, vínculos e autorização v1.0

26/11/2026 | #85 | M05 | SP02 | P0 | Proposta para revisão, somente laboratório sintético.
Base: a7ab01e49dcb043e03788b2f405e279c71d3809c. Não implementa Auth, SQL, migrations ou UI; não valida juridicamente nem libera produção.

## 1. Fontes e invariantes
- [ONB-001 arquitetura](arquitetura-v1.md), blob 13e3fd996b6750061c84d53ae30d5507f8c0afa8; [jornadas](jornadas-v1.md), b6886119d45326e96f3f2a361c7ebe32fb82e0c4; [critérios](criterios-v1.md), 90956c892b2f77037a55261f1bc9f23e266f860e. #84 aceita; ONB-D01–08 preservadas.
- [ADR-005](../adr/005-identidade-e-persistencia-supabase.md), 91a8d90ea8755e0522c43281034b1f1c1deea90a: SPA/SDK/PKCE apenas desenvolvimento; hospedagem e sessão de produção pendentes.
- [Contrato persistente](../../src/domain/persistentAccessContract.ts), 8542534b98f9bb1395d5b14293e89c42df97ab1a: Grant requer autoridade verificada, propósito, fonte, versão, vigência e reavaliação. Não instanciar Grant infantil neste escopo.
- [Ameaças T-01–10](../threat-model-public-family-onboarding-v0.1.md); [retenção](../parametros-retencao-categorias-v0-1.md), 5118c29e8fdc68c275d13e4c9dab784d3a51fa1e.
- Identidade autenticada não prova maioridade, guarda, competência profissional nem verdade de contribuição. Papel declarado é preferência, não claim. Vínculo técnico com espaço vazio não é vínculo com criança. Pluralidade, autoria e indeterminação permanecem independentes. Não criar princípio INF-ID.

## 2. Estados independentes
| Eixo | Estados | Transições e guarda |
|---|---|---|
| Conta | ABSENT, EMAIL_PENDING, CONFIRMED, RESTRICTED, DELETION_PENDING, CLOSED | cadastro explícito -> pendente; confirmação pelo provedor -> confirmado; restrição por decisão confiável; encerramento somente após destinação verificada |
| Sessão | NONE, CHECKING, ACTIVE, RECOVERY_ONLY, EXPIRED, REVOKED, UNCERTAIN | login/refresh -> CHECKING; assinatura, emissor, audiência, prazo, sujeito, sessão vigente e conta confirmada -> ACTIVE; recuperação válida -> RECOVERY_ONLY; falha de rede -> UNCERTAIN; logout/revogação -> REVOKED; nenhum estado incerto concede acesso |
| Aceites | MISSING, CURRENT, OUTDATED | versão publicada pelo servidor + ato afirmativo -> CURRENT; mudança de versão necessária -> OUTDATED; recusa não cria espaço |
| Onboarding | NOT_STARTED, BOOTSTRAP_PENDING, FAMILY_WELCOME, PRO_INFO | sessão ACTIVE e aceites CURRENT; escolha explícita; bootstrap atômico; falha retorna pendente; profissional sem membership implícita |
| Membership | ABSENT, ACTIVE, REVOKED | somente operação confiável cria vínculo inicial; revogação impede efeitos; não reativar automaticamente em novo login |

Estados UI de jornadas-v1.md são projeções, jamais fonte de autoridade. Confirmação exige consulta confiável; callback não concede sessão por si. Recuperação não permite operações de perfil/espaço, termina em novo login, invalida sessões anteriores conforme contrato abaixo. Ao cancelar, trocar identidade ou expirar, limpar cache/formulários, abortar requisições e incrementar geração local; descartar respostas antigas. Reload anônimo não restaura credenciais. Deep link exige nova checagem.

## 3. Entidades lógicas (não DDL)
| Entidade | Campos mínimos e restrições |
|---|---|
| auth.users | sujeito UUID, e-mail, confirmação e credencial sob provedor; não duplicar senha/e-mail |
| profiles | subject_id PK/FK, apelido, etapa enum, versão do fluxo, created_at imutável; status confiável separado da preferência |
| family_spaces | id PK, creator_subject_id FK UNIQUE para espaço inicial, created_at; proprietário técnico imutável |
| family_memberships | space_id + subject_id UNIQUE, technical_role=INITIAL_CREATOR, state, revision; nenhuma criação pelo cliente |
| legal_documents | tipo, versão, digest, publicação e exigibilidade; catálogo confiável, conteúdo versionado |
| legal_acceptances | subject_id + tipo + versão UNIQUE, timestamp servidor, digest, decisão afirmativa; append-only sob política de retenção |
| privacy_preferences | subject_id PK, preferências opcionais permitidas, revision; não equivalem a aceite |
| session_control | session_id + subject_id, estado, prazo/revision, geração de segurança; somente escrita confiável, vincular à sessão do provedor |
| deletion_requests | id, subject_id, estado, timestamps e protocolo mínimo; sem texto livre/anexos no MVP |

Identificadores são pessoais. Não coletar CPF, conselho, prova de guarda, data de nascimento, dados infantis ou terceiros. Maioridade declarada não é verificada; estratégia de aferição é decisão de produção pendente. Não importar demo/cofre. Não criar tabelas infantis, convites, diretórios ou grants profissionais.

## 4. Contrato de operações
Nomes lógicos, não endpoints implementados. Autenticação delegada ao SDK; nenhuma API artesanal de senha/token.
| Operação | Entrada permitida | Guarda e efeito |
|---|---|---|
| signup | e-mail, senha ao Auth, apelido temporário | confirmação obrigatória; sem espaço; resposta pública genérica |
| confirm / login | código PKCE ou credenciais ao Auth | validar origem/verifier e sessão; sem papel vindo do callback |
| recovery.request | e-mail ao Auth | resposta indistinguível; limites de abuso |
| recovery.complete | nova senha ao Auth, contexto válido de recuperação | uso único, nenhuma área privada; revogar sessões e exigir login |
| account.status | nenhuma identidade no payload | retornar somente estado próprio mínimo |
| acceptance.record | tipo, versão, digest exibido, decisão afirmativa | sessão confirmada; catálogo vigente; servidor deriva sujeito/hora; rejeitar versão desatualizada; retry não duplica |
| account.bootstrap | journey FAMILY ou PRO_INFO, apelido | sessão ACTIVE + aceites CURRENT; transação única; perfil próprio e, se FAMILY, espaço + membership inicial; PRO_INFO não cria espaço; retorno mínimo próprio |
| profile.update | apelido, etapa enum | sujeito próprio, revisão esperada; sem campos administrativos |
| preferences.update | enum permitido + revisão | próprio; recusa opcional não bloqueia |
| logout | escopo CURRENT por padrão, ALL explícito | bloquear UI imediatamente; revogar sessão(s) confiavelmente; falha remota não anunciar revogação |
| deletion.request | confirmação explícita e reautenticação recente | protocolo próprio idempotente; restrição de acesso e revogação após validação; destinação não automática |

Erros externos estáveis: INVALID_INPUT, AUTH_REQUIRED, ACTION_UNAVAILABLE, RETRY_LATER, STALE_VERSION, LINK_INVALID, TEMPORARY_FAILURE. Sem distinguir objeto alheio de inexistente. 401 sessão inválida; 403 ação indisponível; 409 conflito próprio; 429 limite; 503 indisponível. Não devolver erros brutos, SQL, identificador alheio, contagem ou existência de conta. Validar também códigos e tempo do provedor; UI genérica sozinha insuficiente.

## 5. Autorização e fronteira de efeito
Predicado lógico: allow = token validado pelo serviço AND sujeito não anônimo AND confirmação atual AND sessão vigente e não revogada AND conta não restrita AND operação permitida AND recurso próprio/membership atual AND aceites vigentes quando exigidos AND revisão atual. Exceções mínimas: status, aceite, logout, recuperação e pedido de direitos não dependem de aceite atual, mas exigem suas guardas próprias. Negar por padrão. JWT antigo não prova vigência. Para efeitos protegidos consultar estado confiável de sessão/provedor e registro de revogação atual; verificar session_id ligado ao sujeito, não confiar só em auth.uid() ou exp. Se não houver mecanismo demonstrável para bloquear acesso direto à Data API após revogação, #87 fica BLOCKED.
Proposta: revogação de aplicação e operações protegidas compartilham trava transacional por sujeito/sessão e membership relevante, ordem consistente; reavaliar no commit e antes de entrega de leitura. Revogação confirmada impede novos efeitos; transações linearizadas antes dela podem ter produzido efeitos, não prometer recuperar bytes já entregues. Mudança externa de sessão do provedor precisa ser consultada em cada efeito protegido; janela entre serviços deve ser medida e documentada, não alegar atomicidade distribuída. Se a garantia não for comprovada, manter gate fechado e considerar API mediada. Sem efeitos externos assíncronos nesta etapa.
Bootstrap serializa por sujeito, UNIQUE e FKs; conflito reconsulta o resultado próprio, sem sobrescrever owner; falha reverte tudo. Aceite concorrente com alteração de catálogo exige revisão na mesma transação. Não usar chave idempotente para escolher sujeito. Autorização infantil sempre DENY, mesmo para criador ou profissional. Futuro vínculo clínico exige verificação própria, finalidade, escopo, versão, prazo, revogação e autoridade competente; não implementado.

## 6. Matriz RLS/grants proposta
Todas as tabelas expostas: RLS + grants mínimos explícitos, negar anon; authenticated anônimo também negado. Sem grants de escrita genérica; operações confiáveis específicas. Roles administrativos não acessíveis ao browser.
| Recurso | SELECT | INSERT/UPDATE | DELETE |
|---|---|---|---|
| profiles | próprio, sessão apta | bootstrap/update por operação restrita; ownership imutável | negado direto |
| family_spaces | membership ativa própria e sessão/aceites aptos | bootstrap confiável somente | negado direto |
| family_memberships | próprio vínculo ativo; sem listagem de terceiros | operação confiável, nunca autoatribuição | negado direto |
| legal_documents | somente versões publicadas necessárias | operador confiável | negado cliente |
| legal_acceptances | próprio | record confiável; sem UPDATE | somente procedimento de retenção |
| privacy_preferences | próprio | operação própria com revisão | procedimento próprio |
| session_control | sem acesso direto | somente fronteira confiável | procedimento de sessão |
| deletion_requests | próprio por serviço | pedido próprio; mudança de estado por operador confiável | negado direto |

USING + WITH CHECK para UPDATE, SELECT correspondente, grants por coluna/operação, constraints e FKs; não confiar em user_metadata/app_metadata desatualizado. Views invoker ou privadas; funções privilegiadas excepcionais em schema não exposto, search_path fixo, EXECUTE revogado de PUBLIC, identidade conferida e revisão. Não expor service_role. Testar REST, RPC, SQL com papéis reais, não só UI; validar zero efeitos e ausência de dados, não apenas status HTTP. Sem migration nesta PR.

## 7. Parâmetros candidatos de laboratório (não produção)
JWT 5 min, inatividade 30 min, duração absoluta 8h, reautenticação para pedido de exclusão até 5 min; confirmação/recuperação 30 min; senha 12+ caracteres, aceitar colagem/gerenciador, sem regras arbitrárias de composição, verificar limites e capacidade do provedor; limites iniciais de ensaio: 5 tentativas login/15 min por combinação de conta e origem, 3 reenvios/15 min por destino, limites globais e resposta genérica, sem bloquear indefinidamente vítima. Números propostos para revisão e experimentação, não afirmar suporte nativo; se configuração indisponível, controle confiável equivalente ou BLOCKED. SDK/CLI pinados e capacidade verificada em #87, sem upgrade nesta entrega.
PKCE com verifier do contexto original, allowlist exata origem/caminho, sem wildcard/open redirect; limpar query após troca; recuperação em navegador diferente reinicia; HTTPS em produção, localhost isolado em lab. Sem tokens em URL/log/cache artesanal. CSP restritiva, dependências revisadas, sem HTML não confiável ou scripts terceiros. SPA sem cookie ambiental para API bearer; se BFF/cookies futuro, HttpOnly/Secure/SameSite e token anti-CSRF + validação de origem; PKCE não resolve XSS. Logs somente enum resultado/etapa, duração agregada, versão/cenário sintético; nunca senha, token, URL, e-mail ou identificador pessoal em telemetria. Auditoria de segurança minimizada tem finalidade e retenção próprias. Segredos separados, MFA administrativo; publishable key não substitui RLS.

## 8. Retenção e direitos
| Dados | Categoria de referência / gatilho |
|---|---|
| Identidade/perfil/espaço/etapa | lacuna específica de conta adulta na matriz; revisar finalidade, encerramento, abandono e necessidade antes de produção; não herdar prazo infantil C01 |
| Membership/aceite | C05/C06 por analogia de evidência, não prazo aprovado; revogação/mudança de versão/fim da finalidade; prova mínima separada |
| Preferência opcional | retirada/fim de finalidade; excluir quando desnecessária, sem condicionar serviço |
| Pedido de exclusão | C06: acompanhamento semanal, prova residual candidata até 24 meses, validar #27 |
| Sessão/credencial | expiração/revogação/fim de finalidade; configuração Auth e destinação demonstradas #29 |
| Backups/logs | C08/C09 candidatos, capacidade e expurgo #29; não prometer apagamento imediato |

Responsável de produto e execução: responsável atual do projeto; competência jurídica/revisão independente a designar. Estados de pedido REQUESTED -> REVIEWING -> ACCESS_RESTRICTED -> DISPOSITION_VERIFIED; contestação ou retenção excepcional documentada por escopo. Revogar antes de eliminar conta; inventariar Auth, DB, logs, cópias; restauração não ressuscita acesso revogado. Não aprovar prazos de produção por analogia.

## 9. Gate de revisão
#85: revisão documental, rastreabilidade ONB-D01–08 e C01–24, PR e CI; testes funcionais NOT_EXECUTED. #86 consome estados e erros com simulador explícito, sem credenciais reais; #87 comprova SDK/RLS, transações e revogação; #88 homologa. Decisões novas propostas: parâmetros §7, mecanismo de sessão/serialização §5, catálogo de aceites e retenção adulta §8. Revisar antes de implementar; hospedagem, SMTP, capacidade, sessão produção, textos legais e maioridade em aberto. #27/#29/#35 e G5 continuam NO-GO. Nenhuma validação jurídica ou independente presumida.
