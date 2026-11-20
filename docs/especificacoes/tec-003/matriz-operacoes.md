# Matriz por operação

[Escopo e requisitos](README.md) · [Cenários](aceitacao-decisoes.md)

Cada linha liga ator, objeto/versão, finalidade e efeito. Autoridade, contexto histórico, categoria e destinatário são conferidos no ato; uma operação permitida não autoriza as demais. Os critérios originais são vinculados à base auditada para manter rastreabilidade.

## OP-01 — Preservar

| Campo | Critério lógico |
|---|---|
| Ator | Agente de custódia autorizado |
| Objeto/versão | Conteúdo, versão, metadado ou prova de categoria identificada |
| Finalidade | Finalidade de conservação demonstrada e política aplicável |
| Condições | Condições de categoria/fundamento/limite e exceção concretamente verificados |
| Efeito permitido | Conservar apenas escopo legítimo, com apresentação/uso independentes |
| Propagação/revisão | Fim de finalidade, revisão, ordem, pedido ou origem alterada reabre destinação |
| Governança | C01–C10, EX01/EX02/EX06/EX09/EX10 |
| Requisitos | REQ-03, REQ-07, REQ-08 |
| Aceitação proposta | A03, A12, A24 |
| Lacunas TEC-001 | G01, G09 |

[Critério de domínio de origem](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L27).

## OP-02 — Registrar (create)

| Campo | Critério lógico |
|---|---|
| Ator | Participante com identidade/autoridade verificadas para criação |
| Objeto/versão | Nova contribuição e contexto da criança/recurso legitimado |
| Finalidade | Finalidade de registro admitida no contexto |
| Condições | Autoria/natureza conhecidas identificadas, lacunas explícitas e permissão de criar própria |
| Efeito permitido | Criar versão inicial sem publicar, selecionar para relatório, conceder ou sintetizar automaticamente |
| Propagação/revisão | Criação não amplia permissões; futuras correções geram evento de versão |
| Governança | EX03/EX04/EX10 |
| Requisitos | REQ-01, REQ-03, REQ-10 |
| Aceitação proposta | A02, A25 |
| Lacunas TEC-001 | G01, G02, G10 |

[Critério de domínio de origem](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L28).

## OP-03 — Preparar para compartilhamento

| Campo | Critério lógico |
|---|---|
| Ator | Participante autorizado a preparar e utilizar as fontes |
| Objeto/versão | Representação provisória ligada às versões de origem |
| Finalidade | Preparação para destinatário/finalidade declarados |
| Condições | Fonte e contexto legitimamente utilizáveis; não tratar leitura como autorização de uso |
| Efeito permitido | Produzir preparação privada e provisória, sem ativar concessão ou entregar |
| Propagação/revisão | Mudança de fonte/destinatário/permissão invalida preparação no escopo |
| Governança | EX05/EX07 |
| Requisitos | REQ-03, REQ-04, REQ-05 |
| Aceitação proposta | A04, A08 |
| Lacunas TEC-001 | G02, G04 |

[Critério de domínio de origem](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L29).

## OP-04 — Consultar (read)

| Campo | Critério lógico |
|---|---|
| Ator | Destinatário identificado |
| Objeto/versão | Contribuição/perfil/versão e cada metadado apresentado |
| Finalidade | Consulta no escopo de política/concessão vigente |
| Condições | Verificar conteúdo, metadados, intervalo histórico, restrições e contexto do destinatário |
| Efeito permitido | Apresentar somente escopo permitido; negar exposição indireta por perfil, erro, cabeçalho ou linhagem |
| Propagação/revisão | Perda de acesso impede próximas apresentações; tela/caches recebem tratamento, sem prometer apagar bytes já entregues |
| Governança | EX03/EX05/EX07 |
| Requisitos | REQ-01, REQ-03, REQ-12 |
| Aceitação proposta | A05, A14, A21 |
| Lacunas TEC-001 | G01, G02, G06 |

[Critério de domínio de origem](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L30).

## OP-05 — Utilizar em síntese/interpretação

| Campo | Critério lógico |
|---|---|
| Ator | Pessoa ou agente automatizado com autoridade própria para a finalidade |
| Objeto/versão | Fontes e versões específicas, unidade derivada e audiência |
| Finalidade | Síntese/interpretação admitida e explícita |
| Condições | Usar apenas fontes/terceiros/contexto autorizados; não inferir dado restrito ou inexistente |
| Efeito permitido | Resultado derivado, com lacunas/divergências e proveniência apresentável ao destinatário |
| Propagação/revisão | Fonte ou escopo mudou: quatro dimensões de reavaliação; recálculo não libera uso |
| Governança | EX04/EX05/EX09 |
| Requisitos | REQ-03, REQ-05, REQ-06, REQ-10 |
| Aceitação proposta | A06, A15, A24 |
| Lacunas TEC-001 | G02, G04, G07 |

[Critério de domínio de origem](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L31).

## OP-06 — Compartilhar (share)

| Campo | Critério lógico |
|---|---|
| Ator | Agente com autoridade específica para conceder/disponibilizar |
| Objeto/versão | Unidade, contexto indispensável, destinatário e operações |
| Finalidade | Finalidade de compartilhamento validada no caso |
| Condições | Verificar destinatário, categorias, operações, vigência e histórico; não distorcer contexto |
| Efeito permitido | Conceder/disponibilizar apenas o escopo explícito com prova minimizada |
| Propagação/revisão | Revalidar na disponibilização e a cada nova operação protegida; cópia externa tem alcance declarado |
| Governança | EX03/EX05/EX07 |
| Requisitos | REQ-03, REQ-04, REQ-11, REQ-12 |
| Aceitação proposta | A07, A13, A14 |
| Lacunas TEC-001 | G01, G02, G07 |

[Critério de domínio de origem](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L32).

## OP-07 — Exportar (export)

| Campo | Critério lógico |
|---|---|
| Ator | Solicitante identificado com permissão independente de exportar |
| Objeto/versão | Pacote, fontes/versões, metadados exportáveis e destino |
| Finalidade | Portabilidade/entrega de escopo legitimado |
| Condições | Política de exportação, destino e proteção de terceiros; ticket de preparação não é autorização de resgate |
| Efeito permitido | Disponibilizar no escopo atual com limite C07; distinguir geração/liberação de recebimento externo |
| Propagação/revisão | Revalidar após cifra e antes da liberação/resgate; revogação anterior impede entrega; expirar/expurgar conforme limite próprio |
| Governança | EX05/EX06/EX07 |
| Requisitos | REQ-03, REQ-04, REQ-07, REQ-12 |
| Aceitação proposta | A08, A14, A21 |
| Lacunas TEC-001 | G02, G05, G06, G07 |

[Critério de domínio de origem](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L33).

## OP-08 — Corrigir (edit_own / revisão administrativa)

| Campo | Critério lógico |
|---|---|
| Ator | Autor no escopo próprio ou agente de revisão administrativa legitimada |
| Objeto/versão | Versão alvo identificada, contribuição própria/alheia e dependências |
| Finalidade | Correção delimitada, com agente e fundamento pertinentes |
| Condições | Condição de versão esperada e autoridade por contribuição; papel/arquivo importado não autorizam sobrescrita alheia |
| Efeito permitido | Nova versão/relação de correção rastreável, com temporalidades distintas; preservar anterior só se legítimo |
| Propagação/revisão | Publicar evento da alteração e impedir disponibilização indevida de derivados; tratamento de versões conforme decisão |
| Governança | EX03/EX04 |
| Requisitos | REQ-04, REQ-05, REQ-06, REQ-11, REQ-13 |
| Aceitação proposta | A09, A15, A20 |
| Lacunas TEC-001 | G03, G04, G11 |

[Critério de domínio de origem](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L34).

## OP-09 — Contestar / solicitar correção

| Campo | Critério lógico |
|---|---|
| Ator | Participante legitimado para manifestação/pedido |
| Objeto/versão | Pedido autônomo e referência ao objeto/decisão quando possível |
| Finalidade | Contestar/solicitar revisão, sem exigir concordância com narrativa |
| Condições | Recepção acessível e verificação proporcional; não confirmar conteúdo restrito a não autorizado |
| Efeito permitido | Registro com autoria própria e estado do pedido; sem invalidar/apagar automaticamente a contribuição contestada |
| Propagação/revisão | Nova evidência reabre análise mantendo início original dos prazos e histórico mínimo cabível |
| Governança | EX03/EX04/EX10 |
| Requisitos | REQ-02, REQ-08, REQ-10, REQ-11 |
| Aceitação proposta | A10, A23 |
| Lacunas TEC-001 | G08 |

[Critério de domínio de origem](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L35).

## OP-10 — Restringir

| Campo | Critério lógico |
|---|---|
| Ator | Agente competente segundo procedimento aplicável |
| Objeto/versão | Operações/objetos/destinatários e vigência da restrição |
| Finalidade | Proteção e medida delimitada e legitimada |
| Condições | Fundamento, autoridade e escopo atual; revisão adicional quando indispensável à fase |
| Efeito permitido | Impedir só operações abrangidas; leitura, uso, retenção e eliminação são distintos |
| Propagação/revisão | Efetivar restrição e cerca de autorização antes de liberar novo resultado; propagar a usos/derivados |
| Governança | EX03/EX07/EX10 |
| Requisitos | REQ-03, REQ-04, REQ-06, REQ-14 |
| Aceitação proposta | A11, A14, A22 |
| Lacunas TEC-001 | G02, G07, G08 |

[Critério de domínio de origem](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L36).

## OP-11 — Eliminar / anonimizar

| Campo | Critério lógico |
|---|---|
| Ator | Executor de pedido/dever validado e autorizado |
| Objeto/versão | Conteúdo, versões, derivados/cópias conhecidos e prova permitida |
| Finalidade | Destinação cabível com política e verificação próprias |
| Condições | Verificar fundamento, retenção, terceiros, capacidade e revisões indispensáveis; método de anonimização não se resume a pseudônimo |
| Efeito permitido | Executar medida delimitada e registrar resultado por escopo; residual não vira eliminação integral |
| Propagação/revisão | Evento de destinação e reconciliação antes de restaurar; marcadores mínimos têm política própria |
| Governança | EX01/EX02/EX06/EX09/EX10 |
| Requisitos | REQ-06, REQ-07, REQ-08, REQ-14 |
| Aceitação proposta | A12, A19, A22, A24 |
| Lacunas TEC-001 | G03, G08, G09 |

[Critério de domínio de origem](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L37).

## OP-12 — Conceder / ampliar acesso

| Campo | Critério lógico |
|---|---|
| Ator | Pessoa legitimada para conceder, separada do mero vínculo/credencial |
| Objeto/versão | Concessão para destinatário, categorias, operações e período histórico |
| Finalidade | Finalidade e necessidade da nova concessão demonstradas |
| Condições | Identidade/autoridade verificadas; intervalo histórico explícito, vigência e revisão; incerteza permanece pendente |
| Efeito permitido | Nova revisão de concessão com escopo explícito; importação de cuidador não cria concessão |
| Propagação/revisão | Mudar concessão avança revisão de autorização e invalida avaliações anteriores no escopo |
| Governança | EX03/EX05 |
| Requisitos | REQ-01, REQ-03, REQ-04, REQ-11, REQ-13 |
| Aceitação proposta | A13, A16, A20 |
| Lacunas TEC-001 | G01, G02, G07 |

[Critério de domínio de origem](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L38).

## OP-13 — Revogar / expirar / suspender concessão

| Campo | Critério lógico |
|---|---|
| Ator | Autoridade legitimada ou evento de vigência/procedimento competente |
| Objeto/versão | Concessão e escopo revogado/expirado/suspenso |
| Finalidade | Encerrar ou limitar operações segundo evento verificado |
| Condições | Distinguir revogação/expiração/suspensão; não depender de validade de sessão para reconhecer o evento |
| Efeito permitido | Bloquear novas operações protegidas no escopo, sem apagar conteúdo automaticamente |
| Propagação/revisão | Avançar revisão/cerca de autorização, tratar preparações/caches/derivados; não prometer apagar cópia externa |
| Governança | EX03/EX07 |
| Requisitos | REQ-03, REQ-04, REQ-06, REQ-09 |
| Aceitação proposta | A08, A14, A16 |
| Lacunas TEC-001 | G02, G05, G07 |

[Critério de domínio de origem](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L39).

## OP-14 — Reavaliar derivados

| Campo | Critério lógico |
|---|---|
| Ator | Agente responsável pela reavaliação, com autoridade para cada medida |
| Objeto/versão | Dependências conhecidas vinculadas a fontes/versões e usos |
| Finalidade | Tratar evento de origem, autorização, restrição ou destinação |
| Condições | Cobertura e limites da busca explícitos; trabalhador não herda autorização permanente do emissor |
| Efeito permitido | Decisão separada sobre validade, apresentação, utilização e retenção por dependência |
| Propagação/revisão | Tarefas idempotentes/versionadas; evento antigo não ressuscita conteúdo ou sobrepõe estado mais restrito vigente |
| Governança | EX04/EX06/EX09/EX10 |
| Requisitos | REQ-04, REQ-05, REQ-06, REQ-09, REQ-15 |
| Aceitação proposta | A15, A17, A18, A19 |
| Lacunas TEC-001 | G04, G08, G09 |

[Critério de domínio de origem](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L40).
