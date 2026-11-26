# ONB-001 — Critérios verificáveis e gates v1.0

Data: 25/11/2026. [Arquitetura](arquitetura-v1.md) e [jornadas](jornadas-v1.md). Esta matriz especifica testes futuros; todas as linhas funcionais estão **NOT_EXECUTED** por #84. Revisão estática da cobertura é evidência documental e não converte esses testes em PASS.

Responsável atual por execução e produto: Creusio Kizua. Verificação independente, quando requerida: a designar; não atribuída ao autor por omissão. Evidência futura deve conter cenário sintético, ambiente/versões, SHA, comando/protocolo, resultado, limites e link de CI quando aplicável. Não publicar senha, token, e-mail real ou URL de recuperação.

## Matriz de cenários

| ID | Dado / Quando | Então verificável | Ameaça / dono da execução |
|---|---|---|---|
| ONB-C01 | Visitante chega pela primeira vez | Vê finalidade/limites, escolha e demo explícita; nenhuma conta, criança ou espaço criado | T-06 / #86 |
| ONB-C02 | Adulto envia cadastro sintético válido | Vai a confirmação pendente; não recebe área privada sem verificação confiável | T-03 / #87 |
| ONB-C03 | Campo obrigatório inválido ou aceite necessário ausente | Envio não prossegue; erro associado e foco no resumo; opcional recusado não bloqueia | T-07 / #86/#87 |
| ONB-C04 | Callback válido, inválido, expirado, repetido e sem verifier | Somente contexto válido avança; demais orientam reinício; URL/log não expõem segredo | T-03/T-09 / #87 |
| ONB-C05 | Login com credencial válida, inválida e conta não confirmada | Estados distinguíveis internamente; mensagem externa minimiza enumeração; sem acesso indevido | T-03/T-04 / #87 |
| ONB-C06 | Solicitar recuperação para conta existente e inexistente | Mesma mensagem pública; avaliar códigos/tempo de resposta e limites do provedor, não só UI | T-04/T-05 / #87/#88 |
| ONB-C07 | Redefinir com link válido, expirado ou reutilizado | Só fluxo validado altera senha; repetição negada; escopo de sessões conforme #85 | T-03 / #87 |
| ONB-C08 | Sessão expira/revoga durante leitura ou escrita | UI bloqueia, descarta resposta atrasada e servidor nega efeito conforme contrato; novo login necessário | T-03 / #87 |
| ONB-C09 | Conta A sai e B entra; resposta de A chega depois | Nenhum dado, nome, contador, rascunho ou etapa privada A aparece em B | T-01/T-03 / #86/#87 |
| ONB-C10 | Bootstrap com retry, duplo clique, concorrência e falha parcial | Uma inicialização por sujeito; atomicidade; recurso próprio estável; sem sucesso parcial | T-01 / #87 |
| ONB-C11 | A/anon/não confirmado tenta CRUD em perfil/espaço/membership B | SELECT/INSERT/UPDATE/DELETE não produzem efeito nem dado B; provas SQL/API por identidade | T-01 / #87 |
| ONB-C12 | Cliente altera owner, user_id, role ou user_metadata | Escalada/transferência negada; autorização não deriva de papel autodeclarado | T-01/T-10 / #87 |
| ONB-C13 | Escolha profissional e tentativa direta de buscar família/criança | Apenas acolhimento informativo; sem membership familiar implícita, privilégios ou diretório | T-06/T-10 / #86/#87 |
| ONB-C14 | Adulto confirmado chega à área familiar | Conteúdo vazio/próprio; sem migração da demo, formulário infantil, convites ou compartilhamento | T-06 / #86/#88 |
| ONB-C15 | Abandono/reload/voltar/reentrada por deep link | Sem senha persistida, open redirect ou envio automático; retoma só etapa própria após checagem | T-03/T-09 / #86/#87 |
| ONB-C16 | Reenvios e logins automatizados no laboratório controlado | Limites configurados, retry informado, sem revelar conta nem saturar e-mail; produção depende de revisão | T-04/T-05 / #87/#88 |
| ONB-C17 | Documento legal muda e opcional é recusado | Aceite necessário explícito/versionado, append-only sob política; opcional separado, sem caixa pré-marcada | T-07 / #85/#87 |
| ONB-C18 | Inspecionar bundle, tráfego e eventos de ensaio | Sem segredo privilegiado, conteúdo de formulário, IDs pessoais ou query de callback em logs/eventos | T-02/T-06/09 / #87/#88 |
| ONB-C19 | Usar teclado, zoom/reflow, contraste e leitor de tela | Foco visível, ordem e erros anunciados, sem bloqueio; automatic/manual separados no relatório | T-06 / #86/#88 |
| ONB-C20 | Pedido de exclusão da conta adulta | Protocolo/estado claros, reautorização própria; sem promessa de apagamento em backup ou dados de terceiros | T-08 / #85/#88; #27/#29 |
| ONB-C21 | Tentar exibir dado infantil ou converter cuidador sintético em identidade Auth | Nenhum dado da demonstração torna-se cadastro/vínculo/autoridade real | T-06/T-10 / #86/#87 |
| ONB-C22 | Membership retirada e JWT antigo ainda válido | Operação protegida é negada pela autorização atual; expiração de JWT não é a única barreira | T-01/T-03 / #85/#87 |
| ONB-C23 | Entrar com dados Auth/incerteza de rede manipulados no cliente | A UI não concede acesso; banco/serviço verifica identidade, confirmação e autorização | T-01/T-10 / #87 |
| ONB-C24 | Sair com falha de rede ou outra aba aberta | Bloqueio local imediato e estado entre abas reavaliado; alcance da revogação comprovado sem promessas genéricas | T-03/T-09 / #85/#87 |

## Cobertura dos critérios da issue #84

| Aceite da issue | Onde revisar | Evidência desta entrega |
|---|---|---|
| Conciliar ADR, ameaças, plano e código | Arquitetura §2 e inventário de fontes | Comparação estática com blobs de base; não altera fontes históricas |
| Telas/estados de entrada, identidade, recuperação e retomada | Jornadas: diagramas e tabela de estados | Contrato de navegação proposto; C01–10/C15/C24 |
| Familiar/profissional, falhas e autoridade | Jornadas e arquitetura §§1/3/5 | C11–14/C21–23; ausência de privilégios implícitos |
| Dados, confiança, eventos, métricas, acessibilidade, testabilidade | Arquitetura §§3–7; C01–24 | Cobertura de T-01–T-10; testes de produto não executados |
| Decisões abertas, alternativas e gate de PR | Arquitetura §§8–9 | ONB-D01–08 propostas; aprovação conceitual e incorporação pendentes |

## Gates e condições de passagem

| Gate | Prova necessária | Estado nesta entrega |
|---|---|---|
| G0 arquitetura / #84 | Revisão da conciliação/jornadas, decisões registradas, PR aprovada/incorporada e CI documental/regressão | Entregue para revisão, não aprovado automaticamente |
| G1 identidade / #85–#87 | Cadastro, e-mail, login/logout, recuperação, sessão e abuso demonstrados | NOT_EXECUTED por #84 |
| G2 isolamento / #87 | Testes reais SQL/API A/B/anon e conta não confirmada; grants/RLS/constraints | NOT_EXECUTED por #84 |
| G3 acolhimento / #86/#88 | Jornada familiar e profissional sintéticas; acessibilidade e ausência de dados infantis | NOT_EXECUTED por #84 |
| G4 privacidade/operação | Retenção/exclusão, incidentes, hospedagem/sessão, revisão competente e gates #27/#29/#35 | Pendente; esta PR não libera produção |
| G5 infantil | Projeto e aprovação específica próprios | BLOQUEADO; não decorre de G0–G4 |

Em #88, reportar PASS/FAIL/BLOCKED/NOT_EXECUTED por cenário; FAIL ou pré-condição ausente não vira N/A para melhorar taxa. Aprovação do desenho não é prova de autenticação funcionando. Não encerrar #84 antes de revisão conceitual e incorporação; não iniciar #85 em paralelo sem respeitar a capacidade/WIP definido.
