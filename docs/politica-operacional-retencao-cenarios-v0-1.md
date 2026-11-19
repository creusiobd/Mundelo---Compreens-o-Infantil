# MUNDELO — Cenários da política de retenção e destinação v0.1

Status: casos propostos para revisão e futura execução com dados sintéticos. Base: [política operacional](politica-operacional-retencao-destinacao-v0-1.md), contrato e critérios incorporados pela PR #19. Nenhum resultado de execução é atribuído nesta entrega.

| Caso | Condição ou evento | Resultado verificável esperado | Prova e responsável funcional |
|---|---|---|---|
| R01 | Categoria não possui período nem regra verificável de revisão/destino | Categoria não é considerada habilitada para retenção pessoal real; pendência e custódia da política identificadas | Registro da política e estado do gate; custódia e verificação |
| R02 | Pedido recebido de pessoa cuja autoridade ainda precisa ser verificada | Pedido é protocolado/acompanhado sem executar operação protegida ou conceder acesso adicional | Protocolo minimizado e estado em verificação; recepção e revisão de autoridade |
| R03 | Autor corrige contribuição com unidade compartilhada e síntese | Versão e temporalidade distinguíveis; derivados conhecidos reavaliados; versão antiga não aparece indevidamente como atual | Origem/versão e resultado por dependência; análise, execução e verificação |
| R04 | Eliminação cabível alcança conteúdo de versão anterior | Histórico da correção não mantém cópia indevida do conteúdo; somente evidência permitida permanece | Escopo e verificação de versão/logs/derivados; execução e verificação |
| R05 | Medida atinge dados próprios e de terceiros numa contribuição | Decisão separa os escopos, protege os envolvidos e não produz recorte enganoso para compartilhamento | Decisão por objeto/operação e teste de apresentação; análise e verificação |
| R06 | Concessão é revogada durante preparação de síntese/exportação | Condições reavaliadas na efetivação; preparação não contorna a revogação | Versão/instante da autorização e resultado da operação; execução e verificação |
| R07 | Pedido exige eliminação de cópias e uma tarefa falha | Estado parcial/falha permanece visível ao acompanhamento; pedido não é declarado integralmente executado | Medida por tarefa, falha e ação de acompanhamento; execução, segurança quando aplicável e verificação |
| R08 | Backup tem retenção residual admitida, com limite e acesso definidos | Retenção é explicitamente delimitada; resposta não afirma eliminação integral; expurgo/revisão acompanhados | Política da cópia, limite e próxima ação; custódia e acompanhamento |
| R09 | Backup anterior a uma eliminação é restaurado | Reconciliação ocorre antes de disponibilizar dados; conteúdo eliminado/restrito não retorna automaticamente ao uso | Evidência da restauração e verificação da reaplicação; execução e verificação |
| R10 | Nova tentativa repete uma operação já executada parcialmente | Estado e condições atuais são reavaliados; não há efeito duplicado indevido nem falsa conclusão | Identificação de tentativas e efeitos por escopo; execução e verificação |
| R11 | Pedido não pode ser integralmente atendido por decisão fundamentada | Medida cabível, retenção/negativa e revisão são comunicadas sem revelar informação restrita | Decisão e comunicação minimizadas; análise e acompanhamento |
| R12 | Derivado foi recalculado após alteração de origem, mas uso não está autorizado | Recalcular não libera apresentação/utilização; restrição aplicável permanece | Política de uso e verificação de apresentação; execução e verificação |
| R13 | Cópia foi entregue a destinatário externo | Registra-se o alcance real da entrega/medidas cabíveis, sem alegar apagamento fora da governança | Destino/escopo permitido e comunicação; acompanhamento e análise |
| R14 | Conteúdo pessoal eliminável aparece em log ou evidência de execução | Cópia é tratada conforme política; prova minimizada não reconstitui conteúdo eliminado | Campos inspecionados e medida verificada; execução, segurança e verificação |
| R15 | Nome é substituído por código e alguém solicita marcar o conjunto como anônimo | Anonimização não é declarada sem verificação técnica apropriada; informação vinculável continua protegida | Método/avaliação ou estado pendente; análise e verificação técnica competente |
| R16 | Instituição corrige falha e conserva material de aprendizagem | Correção não é apresentada como prova de aprendizagem ou eliminação da causa; conteúdo pessoal tem política própria | Separação entre medida técnica, conhecimento metodológico e dados; custódia e análise |

## Ficha de execução futura

Para cada caso executado, registrar: identificador do caso, política/versão aplicada, ambiente e versão examinados, dados sintéticos utilizados, executor e verificador, resultado esperado e observado, evidência minimizada, falha ou exceção, escopo de conclusão e próxima ação. Sem execução, o resultado permanece **não executado**.

## Critério de revisão documental

Verificar se cada caso possui uma operação identificável, uma condição de entrada, um efeito observável, uma prova que não replique conteúdo indevido e uma responsabilidade funcional. Divergências de autoridade, prazo ou retenção não são resolvidas pela simulação técnica: retornam à decisão da política correspondente.

## Pendências a decidir antes da execução aplicável

- Preencher os parâmetros por categoria e aprovar o modelo de responsabilidades, respeitando os procedimentos de autoridade e revisão.
- Definir cobertura de cópias/dependências e método de verificação para o sistema real.
- Definir o tratamento de expurgo residual de backups, reabertura de casos e atrasos sem prometer conclusão inexistente.
- Implementar os controles necessários apenas após as decisões e gates aplicáveis. Estes cenários não aprovam um desenho de banco, API ou fila de tarefas.
