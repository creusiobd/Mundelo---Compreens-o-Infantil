# MUNDELO — Critérios por operação

Status: proposta documental para revisão, vinculada à revisão localizada do Contrato de Domínio v0.1. Não são novos princípios INF-ID nem aprovação de implementação.

## Regras de decisão comuns

Cada avaliação identifica ator e papel vigente, criança/recurso, versão, finalidade, operação, destinatário quando existir, intervalo histórico e concessão/política aplicável. Vínculo, acesso familiar, credencial profissional ou permissão de leitura não substituem as condições da operação solicitada.

As condições são verificadas no momento da efetivação. A preparação de uma operação e uma avaliação anterior não garantem autorização futura. Se o escopo ou a versão mudar entre avaliação e efetivação, a operação deve ser reavaliada antes de disponibilizar o resultado.

Resultado distinguível:

- **Permitido:** condições necessárias verificadas no escopo indicado.
- **Negado:** condição conhecida impede a operação; não há efeito protegido.
- **Pendente de verificação:** condição necessária não foi demonstrada; a operação protegida não é executada enquanto estiver pendente.
- **Concluído:** efeito da operação comprovado no escopo, distinto de solicitação recebida, agendamento ou mera avaliação favorável.
- **Concluído parcialmente:** somente para pedidos compostos; informa o escopo efetivamente atendido e o que permanece pendente/restrito, sem apresentar o todo como concluído.

Desconhecido, não observado, não informado e não aplicável permanecem distintos. Uma lacuna pode limitar apresentação, compartilhamento ou síntese sem impedir um registro legítimo. A justificativa apresentada ao usuário não pode revelar conteúdo, identidade ou metadados que ele não esteja autorizado a conhecer.

A evidência de decisão registra de forma proporcional: operação, ator, objeto/versão permitidos, instante, política/escopo considerado, resultado e motivo acessível. Registrar evidência não autoriza copiar conteúdo pessoal para logs. Falha na trilha exigida impede declarar concluída a operação correspondente. Mecanismo físico, prazos e retenção dessa trilha continuam sujeitos a decisões específicas.

## Matriz de condições e efeitos

| Operação | Ator e objeto | Condições para efetivar | Efeito e limite verificáveis |
|---|---|---|---|
| Preservar | Agente de custódia autorizado; conteúdo, versão, contexto ou evidência de operação | Política aplicável define finalidade, fundamento, categoria, período/revisão, acesso e destino. A ausência dessa política não autoriza retenção pessoal indefinida | Conservar somente o escopo legitimamente permitido; preservar não autoriza apresentar ou utilizar. Eventual retenção obrigatória possui restrições próprias |
| Registrar (`create`) | Participante autorizado; nova contribuição | Permissão de criação no contexto pertinente e finalidade admissível. Dados desconhecidos não são completados nem usados como requisito universal de preenchimento | Criar contribuição com autoria/natureza conhecidas e lacunas explícitas; sem publicar, compartilhar ou sintetizar automaticamente |
| Preparar para compartilhamento | Autor ou participante com operação de preparação autorizada; representação derivada | Acesso e utilização das fontes para essa finalidade autorizados; unidade mantém linhagem e contexto suficiente | Produzir representação restrita à preparação; nenhuma concessão ou entrega ao destinatário decorre desse ato |
| Consultar (`read`) | Destinatário identificado; contribuição, versão e metadados | Identidade, legitimidade e concessão/política aplicáveis à consulta, ao conteúdo, ao período histórico e aos metadados; sem restrição impeditiva vigente | Apresentar somente o escopo autorizado. Dados de origem restritos não são expostos pela linhagem. Leitura não concede uso em síntese, exportação ou compartilhamento |
| Utilizar em síntese/interpretação | Agente humano ou automatizado autorizado para a finalidade; fontes e versões | Autorização específica de utilização e destinatário; contexto e direitos de fontes/terceiros; política de ciclo de vida. Visibilidade das fontes, isoladamente, é insuficiente | Resultado identificado como derivado, com fontes/versões, lacunas e divergências; sem inferir diagnóstico, identidade ou significado definitivo. Fonte insuficiente ou restrita não é contornada por inferência |
| Compartilhar (`share`) | Pessoa com autoridade específica para conceder acesso; destinatário, conteúdo e operação | Autoridade pertinente ao ato, finalidade, destinatário, categorias, operações, prazo e período histórico verificados. Contexto indispensável é legítimo e acessível no escopo da entrega | Conceder/disponibilizar somente o escopo explícito. Se privacidade e contexto suficiente não puderem coexistir, não compartilhar aquela representação; preparar outra não amplia permissões |
| Exportar (`export`) | Solicitante autorizado; pacote e destinatário/destino | Política de exportação e autoridade do solicitante; permissão de exportação, finalidade, escopo histórico e proteção de terceiros; informações exportáveis e restrições definidas | Exportar somente escopo permitido, com proveniência legitimamente exportável e registro minimizado da entrega. Não prometer apagar ou controlar cópias externas após revogação |
| Corrigir (`edit_own` ou revisão administrativa autorizada) | Autor no escopo próprio ou agente revisor legitimado; versão identificada | Autoridade de correção, versão alvo e escopo da mudança identificados. Outra pessoa solicita correção, sem sobrescrever a autoria alheia | Produzir correção rastreável; distinguir data do acontecimento, do registro e da correção; preservar versões anteriores somente na extensão legítima. Acionar reavaliação dos derivados conhecidos |
| Contestar/solicitar correção (`request_correction`) | Participante legitimado, inclusive manifestação da pessoa por meio acessível; contribuição ou decisão | Canal e legitimidade adequados; referência ao objeto contestado quando possível. Não exigir concordância com a narrativa anterior ou explicação verbal universal | Registrar contestação com autoria própria, encaminhar à revisão aplicável e manter o estado do pedido. Contestar não apaga, invalida ou suspende automaticamente todo o conteúdo/acesso |
| Restringir | Agente autorizado pelo procedimento aplicável; operação, conteúdo e destinatários afetados | Fundamento, escopo e vigência da restrição identificados; autoridade e necessidade de revisão verificadas | Impedir somente operações abrangidas e reavaliar derivados/usos afetados. Restrição de leitura, de utilização e de retenção são distintas; não declarar eliminação apenas porque houve bloqueio |
| Eliminar/anonimizar | Agente autorizado para executar pedido/dever verificado; conteúdo e derivados conhecidos | Pedido ou dever legitimado e política específica: retenção aplicável, terceiros, cópias, backups e derivados. Anonimização exige critério técnico próprio; substituição de nome por código não basta | Executar a medida cabível e verificar seu escopo antes de declarar conclusão; minimizar evidência da operação. Se só puder restringir ou atender parte, informar o estado real. Não preservar cópia indevida em versões, logs ou sínteses |
| Conceder/ampliar acesso | Pessoa com autoridade específica; concessão a destinatário | Identidade, legitimidade, vínculo quando aplicável, finalidade, categorias, operações, prazo e histórico verificados; conflito/incerteza relevante tratado por procedimento apropriado | Registrar escopo e vigência; não herdar acesso de profissional anterior, equipe ou instituição. Acesso familiar não equivale a poder irrestrito de conceder |
| Revogar, expirar ou suspender concessão | Autoridade legitimada, prazo ou procedimento competente; concessão e escopo | Evento verificado e escopo afetado identificado. Diferenciar revogação, expiração e suspensão, sem inferir eliminação do conteúdo | Bloquear novas operações protegidas no escopo a partir da efetivação, inclusive caminhos técnicos aplicáveis; reavaliar usos e derivados. Preservar somente histórico permitido; não prometer remoção de cópias externas |
| Reavaliar derivados | Agente responsável autorizado; unidades, sínteses, relações e usos conhecidos | Evento de origem, versão, restrição ou autorização identificado; dependências conhecidas e responsabilidade de tratamento atribuídas | Avaliar separadamente validade, apresentação, utilização e retenção. Recalcular, sinalizar, restringir, invalidar ou eliminar conforme o caso e a autorização. Recalcular não concede novas permissões e não substitui dever de eliminação |

Os nomes de operação além dos já presentes em v0.1 são rótulos de análise. Não definem enums, endpoints, papéis técnicos ou novos poderes jurídicos. A manifestação da criança permanece distinguível da decisão representativa e da autorização operacional; urgência ou divergência exigem o procedimento aplicável, sem precedência universal de uma das partes.

## Cenários de aceitação propostos

Os cenários abaixo ainda não foram executados. O par positivo/negativo verifica o mesmo limite por caminhos diferentes; não constitui aprovação da política de retenção, de representação ou de produção.

| Operação | Cenário que deve poder concluir no escopo autorizado | Cenário que deve ser negado ou permanecer pendente |
|---|---|---|
| Preservar | Conteúdo dentro da política de finalidade/período permanece sob suas restrições | Sem fundamento ou período/revisão definidos, “manter para rastreabilidade” não basta para conservar indefinidamente conteúdo pessoal |
| Registrar | Autor autorizado registra manifestação com contexto desconhecido explicitamente marcado | Conta sem permissão de criação não registra no contexto de outra criança; falta de explicação não é preenchida por IA |
| Preparar | Derivação autorizada fica em preparação, ligada à versão de origem | Preparar não torna o conteúdo legível ao destinatário nem ativa concessão |
| Consultar | Destinatário consulta conteúdo e período incluídos no escopo vigente | Permissão para contribuições futuras não expõe histórico anterior, terceiros ou metadados restritos |
| Utilizar | Síntese com fontes/uso/destinatário autorizados preserva divergências | Leitura permitida e utilização não autorizada não permitem sintetizar; contexto insuficiente não vira conclusão |
| Compartilhar | Unidade semanticamente íntegra é entregue ao destinatário autorizado | Se retirar o contexto protegido distorce a unidade, ela não é entregue como se estivesse completa |
| Exportar | Pacote contém apenas conteúdo e proveniência autorizados | Permissão de consulta, sem exportação e destino legitimados, não permite gerar pacote; revogação não é apresentada como apagamento externo |
| Corrigir | Autor corrige versão própria; derivados conhecidos recebem reavaliação | Usuário não sobrescreve contribuição alheia; versão corrigida não mantém indevidamente dado que deva ser eliminado |
| Contestar | Pessoa registra divergência sem apagar a contribuição contestada | Contestação isolada não é tratada como prova de falsidade, incapacidade ou autorização para penalização |
| Restringir | Uso em síntese é bloqueado no escopo determinado, preservando outras operações legítimas | Restringir apresentação não é rotulado como eliminação, nem é usado para ampliar acesso de quem avalia o pedido |
| Eliminar/anonimizar | Medida e alcance são verificados, incluindo derivados/cópias sob governança aplicável | Pedido recebido ou exclusão apenas da tela não é declarado como eliminação completa; pseudonimização não é declarada anonimização |
| Conceder/ampliar | Pessoa legitimada concede finalidade, destinatário e operações específicos | Credencial profissional, vínculo anterior ou incerteza relevante de autoridade não ativam nova concessão |
| Revogar/expirar/suspender | Operação posterior ao evento é impedida no escopo afetado | Sessão, token ou exportação em preparação não contornam a restrição; conteúdo fora do escopo não é apagado automaticamente |
| Reavaliar derivados | Origem corrigida/restrita aciona avaliação e tratamento documentado das dependências conhecidas | Solicitação agendada não é declarada execução concluída; síntese antiga não permanece acessível indevidamente como atual |

## Pendências para tornar os critérios executáveis

1. Validar as políticas de retenção, eliminação, exportação, contestação e urgência por categoria/operação, com papéis, fundamentos, prazos e revisão apropriados.
2. Definir como localizar e acompanhar dependências, cópias e usos; como comprovar conclusão; e como tratar falha, atendimento parcial e pendências de restauração de backups.
3. Definir a política de proteção de versões, metadados e evidências de auditoria, inclusive quando o próprio histórico revelar informação restrita.
4. Conferir os refinamentos e aprovações ainda ausentes nas fontes integrais, sem promover propostas por mera referência.
5. Traduzir as condições em mecanismos de autorização, concorrência, sessões e testes do servidor. Nenhum resultado de teste é atribuído por esta especificação.

## Rastreabilidade

- Preservação, correção, eliminação e derivados: INF-ID-017/169/206/227/249; DEC-DAT-004; AUD-GLOBAL-015; AUD-BIO-CROSS-005. Os textos e aprovações têm os limites registrados na recuperação.
- Distinção de operações e contexto: DEC-HUM-004/005; REQ-BIO-016; AUD-DOM-002/004; DEC-ECO-002.
- Manifestação e autoridade: DEC-INF-013; DEC-HUM-007; AUD-GLOBAL-016; REQ-BIO-013; AUD-BIO-CROSS-006.
- Pluralidade e utilização: REQ-BIO-017; DEC-HUM-008; AUD-BIO-CROSS-004.
- Exportação e encerramento: DOM-04/05 e seções 5.4/5.5 do contrato v0.1. A formulação final de AUD-GLOBAL-017 não é presumida aprovada.

A localização das mensagens e o estado de cada uma estão preservados no cruzamento documental local. Para o contrato e os documentos do repositório, estes critérios permanecem uma proposta de conciliação sujeita à revisão de alcance e redação.


## Continuidade operacional — proposta de política

A revisão localizada deste contrato e seus critérios foram validados pelo responsável pelo produto e incorporados pela PR #19. Essa validação documental não é reaberta pela continuação abaixo e não comprova execução dos cenários.

A [política operacional de retenção, revisão e destinação](politica-operacional-retencao-destinacao-v0-1.md) e seus [cenários operacionais](politica-operacional-retencao-cenarios-v0-1.md) desenvolvem as pendências desta seção. São novas propostas para revisão: parâmetros por categoria, responsabilidades nomeadas e execução de cenários permanecem pendentes. Os documentos não estabelecem prazos legais nem autorizam dados reais.
