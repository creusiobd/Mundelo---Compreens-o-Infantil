# Procedimentos R01–R16

[Preparação e critérios de resultado](ambiente-e-execucao.md) · [Modelo JSON](roteiro.json)

Repetir preparação limpa por caso; aplicar somente a variante indicada. Os passos abaixo são procedimentos de aceitação manual/integrada: exigem caminho real e observabilidade definidos antes de rodar. Falta de interface, capacidade, decisão ou método de injeção mantém o caso bloqueado. Relógio e falhas controladas pertencem ao laboratório; o avaliador de autorização e o efeito protegido devem continuar reais na implementação examinada.

## R01 — Categoria não possui período nem regra verificável de revisão/destino

**Resultado de origem:** Categoria não é considerada habilitada para retenção pessoal real; pendência e custódia da política identificadas.

**Variante:** `P01_SEM_REGRA`. **Pré-condições:** Política sintética sem duração e sem gatilho/destinação verificáveis; em controle positivo, regra de laboratório explícita.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Validar habilitação da categoria e tentar preservar objeto sintético sob ambas as políticas.
4. Conferir o efeito por caminho distinto: Verificar decisão e persistência/impedimento na fronteira efetiva; a política não pode ganhar prazo por default.
5. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Gate fica pendente no caso incompleto; regra de laboratório permite somente o ensaio sintético delimitado, sem habilitar retenção pessoal real. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Comparação das duas políticas, motivo do gate e escopo observado.

**Decisão de governança separada:** Definir e aprovar fundamento, prazo/gatilho e destino da categoria antes de uso real.

**Rastreabilidade:** categorias C01, C02; lacunas G09; decisões D03, D06; gatilhos a classificar V01; critérios A02, A03, A25; operações OP-02, OP-01, OP-08; requisitos REQ-01, REQ-03, REQ-10, REQ-07, REQ-13, REQ-15.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G09 e decisões D03, D06. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R02 — Pedido recebido de pessoa cuja autoridade ainda precisa ser verificada

**Resultado de origem:** Pedido é protocolado/acompanhado sem executar operação protegida ou conceder acesso adicional.

**Variante:** `PEDIDO_AUTORIDADE_PENDENTE`. **Pré-condições:** Ator ACT-PEND não tem prova de autoridade; ACT-A tem autoridade sintética explícita em controle separado.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Protocolar pedido.
4. tentar leitura, correção e eliminação com ACT-PEND.
5. depois conferir decisão com ACT-A no seu escopo.
6. Conferir o efeito por caminho distinto: Consultar registro de pedido e tentativas protegidas por caminho distinto; conferir resposta sem conteúdo ou existência restritos.
7. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Protocolo minimizado e acompanhamento acessível; nenhuma permissão adicional por protocolar. Controle autorizado não herda autoridade sobre outro objeto. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Protocolo, versões da autoridade, decisões e comunicação minimizada.

**Decisão de governança separada:** Autoridade disputada exige encaminhamento competente; papel familiar/importado não resolve disputa.

**Rastreabilidade:** categorias C05, C06; lacunas G01, G07, G08; decisões D01, D03, D07; gatilhos a classificar V02; critérios A01, A02, A10, A13, A20, A22, A25; operações OP-02, OP-04, OP-09, OP-06, OP-12, OP-08, OP-10, OP-11; requisitos REQ-01, REQ-02, REQ-03, REQ-10, REQ-11, REQ-13, REQ-14, REQ-15.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G01, G07, G08 e decisões D01, D03, D07. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R03 — Autor corrige contribuição com unidade compartilhada e síntese

**Resultado de origem:** Versão e temporalidade distinguíveis; derivados conhecidos reavaliados; versão antiga não aparece indevidamente como atual.

**Variante:** `ORIGEM_COM_DERIVADOS`. **Pré-condições:** OBS-1/v1 gera SYN-1/v1 e unidade compartilhada UNIT-1; ACT-A é autor; caso administrativo alheio é variante separada.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Corrigir para OBS-1/v2.
4. observar origem e derivados.
5. tentar exibir v1 como atual e repetir correção com versão obsoleta.
6. Conferir o efeito por caminho distinto: Inspecionar versão persistida, índice de dependências e apresentação; rerender do relatório não basta.
7. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Versões/autoria distinguíveis; derivados conhecidos reavaliados nas quatro dimensões; conflito obsoleto não sobrescreve v2; correção não declara automaticamente falsidade. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Identidades de versão, relação de origem, estado por dependência e limites de cobertura.

**Decisão de governança separada:** Definir cobertura e legitimidade da correção administrativa; revisão V04 se aplicável antes da decisão.

**Rastreabilidade:** categorias C01, C02, C03, C04; lacunas G03, G04, G10; decisões D02, D05, D07; gatilhos a classificar V04, V09; critérios A09, A15, A20, A25; operações OP-08, OP-05, OP-14, OP-12, OP-02; requisitos REQ-04, REQ-11, REQ-13, REQ-05, REQ-06, REQ-10, REQ-15.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G03, G04, G10 e decisões D02, D05, D07. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R04 — Eliminação cabível alcança conteúdo de versão anterior

**Resultado de origem:** Histórico da correção não mantém cópia indevida do conteúdo; somente evidência permitida permanece.

**Variante:** `ELIMINACAO_VERSAO_ANTIGA`. **Pré-condições:** OBS-1/v1 contém marcador QA_RETENCAO_V1; v2 corrigida; decisão sintética admite eliminar o conteúdo antigo e limita prova remanescente.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Executar eliminação delimitada.
4. buscar marcador nos repositórios de versões, histórico, logs e derivados cobertos.
5. conferir v2 preservada quando cabível.
6. Conferir o efeito por caminho distinto: Leitura independente de todas as superfícies declaradas; coberturas desconhecidas impedem conclusão integral.
7. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Conteúdo eliminável não sobrevive como histórico/prova; referência mínima só permanece se legitimada por sua própria política. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Inventário antes/depois, resultado de buscas por escopo, restrições e política da evidência.

**Decisão de governança separada:** V2 antes de irreversibilidade em dados reais; simulação sintética V1 não satisfaz esse requisito real.

**Rastreabilidade:** categorias C01, C02, C03, C06, C09; lacunas G04, G08, G09; decisões D05, D06, D07; gatilhos a classificar V01, V08; critérios A09, A12; operações OP-08, OP-11; requisitos REQ-04, REQ-11, REQ-13, REQ-06, REQ-07, REQ-08.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G04, G08, G09 e decisões D05, D06, D07. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R05 — Medida atinge dados próprios e de terceiros numa contribuição

**Resultado de origem:** Decisão separa os escopos, protege os envolvidos e não produz recorte enganoso para compartilhamento.

**Variante:** `CONTRIBUICAO_MISTA`. **Pré-condições:** OBS-MIX contém escopos S-A e S-B de sujeitos sintéticos distintos; ACT-A não pode conceder por S-B; destinatário REC-EXT não tem permissão para S-B.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Solicitar restrição/compartilhamento de S-A.
4. preparar representação.
5. conferir perfil, detalhe, relatório, metadados e exportação.
6. Conferir o efeito por caminho distinto: Inspecionar payload/cabeçalho e apresentação com destinatário sem escopo; não confiar só em botão oculto.
7. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Decisão separa escopos; não amplia autoridade nem entrega S-B; se recorte deturpa contexto, entrega fica pendente ou usa alternativa legitimada. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Matriz de escopos, decisão sobre unidade íntegra e ausência de marcadores restritos.

**Decisão de governança separada:** Unidade interpretativa/apresentação incerta aciona V05 antes da entrega.

**Rastreabilidade:** categorias C01, C03, C04, C05, C07; lacunas G02, G06, G07, G08; decisões D03, D04, D07; gatilhos a classificar V05; critérios A05, A07, A13, A21; operações OP-04, OP-06, OP-12, OP-07; requisitos REQ-03, REQ-12, REQ-11, REQ-01.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G02, G06, G07, G08 e decisões D03, D04, D07. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R06 — Concessão é revogada durante preparação de síntese/exportação

**Resultado de origem:** Condições reavaliadas na efetivação; preparação não contorna a revogação.

**Variante:** `REVOGACAO_EM_PREPARACAO`. **Pré-condições:** Concessão GRANT-1 vigente permite preparação de síntese/pacote PKG-1; barreira de laboratório controlável antes da liberação final.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Pausar após preparação e antes do efeito, revogar concessão, aguardar confirmação da revogação e liberar barreira. Repetir com mudança de origem e controle de entrega anterior à revogação.
4. Conferir o efeito por caminho distinto: Observar eventos/versões e fronteira de download/resultado, inclusive nova tentativa de obter pacote e detalhe já aberto. Teste de classe isolada não basta.
5. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Revogação ordenada antes da entrega impede novo efeito com contexto antigo; mudança de origem exige avaliação nova. Bytes entregues antes não são declarados recolhidos. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Ordem comprovada, versões e presença/ausência da entrega, sem exportar conteúdo real.

**Decisão de governança separada:** Definir mecanismo atômico e política de transmissão longa; pausa não pode substituir autorização por um mock.

**Rastreabilidade:** categorias C04, C05, C07; lacunas G01, G02, G05, G06, G07; decisões D02, D04; gatilhos a classificar V09; critérios A04, A05, A08, A14, A16; operações OP-03, OP-04, OP-07, OP-13, OP-10, OP-08, OP-12; requisitos REQ-03, REQ-04, REQ-05, REQ-12.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G01, G02, G05, G06, G07 e decisões D02, D04. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R07 — Pedido exige eliminação de cópias e uma tarefa falha

**Resultado de origem:** Estado parcial/falha permanece visível ao acompanhamento; pedido não é declarado integralmente executado.

**Variante:** `FALHA_COPIA_CONTROLADA`. **Pré-condições:** Manifesto inclui cópia primária COPY-1 e cópia governada COPY-2; falha determinística só em COPY-2.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Executar decisão sintética de eliminação.
4. injetar falha no adaptador da cópia.
5. consultar acompanhamento por caminho distinto.
6. retomar apenas pendência.
7. Conferir o efeito por caminho distinto: Inspecionar ambas as cópias, estado da tarefa e comunicação; desligar injeção e verificar recuperação idempotente.
8. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Estado parcial/falha com escopo/ação/responsável explícitos; não declarar eliminação integral nem repetir indevidamente efeito já aplicado. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Resultados por cópia, falha controlada, estado e nova ação.

**Decisão de governança separada:** Capacidade e cobertura de cópias precisam ser demonstradas; prova insuficiente aciona V08 antes de concluir.

**Rastreabilidade:** categorias C01, C02, C04, C06, C08, C09; lacunas G08, G09; decisões D05, D06, D07; gatilhos a classificar V01, V08; critérios A12, A17, A23; operações OP-11, OP-14, OP-09; requisitos REQ-06, REQ-07, REQ-08, REQ-04, REQ-09, REQ-02, REQ-15.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G08, G09 e decisões D05, D06, D07. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R08 — Backup tem retenção residual admitida, com limite e acesso definidos

**Resultado de origem:** Retenção é explicitamente delimitada; resposta não afirma eliminação integral; expurgo/revisão acompanhados.

**Variante:** `BACKUP_RESIDUAL`. **Pré-condições:** Backup BAK-1 possui residual de laboratório de 2 ticks, acesso restrito e expurgo ao fim; prazo é apenas variável de ensaio, não política real.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Eliminar fonte.
4. consultar estado e tentar acesso não autorizado ao backup.
5. avançar relógio de laboratório até limite e conferir expurgo/revisão.
6. Conferir o efeito por caminho distinto: Ler metadados/limite e acesso; verificar ausência ou pendência explícita no fim, inclusive falha de expurgo.
7. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Residual delimitado e comunicado; não afirma eliminação integral enquanto existe; limite vencido gera ação comprovada, não renovação tácita. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Regra residual de ensaio, origem do relógio, controles de acesso e efeito ao limite.

**Decisão de governança separada:** Prazo real, base e capacidade do provedor dependem de aprovação/evidência; não derivar prazo dos ticks.

**Rastreabilidade:** categorias C06, C08; lacunas G08, G09; decisões D05, D06; gatilhos a classificar V08; critérios A03, A12, A19; operações OP-01, OP-11, OP-14; requisitos REQ-03, REQ-07, REQ-06, REQ-08, REQ-09.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G08, G09 e decisões D05, D06. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R09 — Backup anterior a uma eliminação é restaurado

**Resultado de origem:** Reconciliação ocorre antes de disponibilizar dados; conteúdo eliminado/restrito não retorna automaticamente ao uso.

**Variante:** `RESTAURACAO_ANTERIOR`. **Pré-condições:** BAK-1 precede eliminação de OBS-1 e revogação de GRANT-1; registro mínimo legitimado dessas medidas fora da cópia antiga.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Restaurar em área isolada.
4. tentar acesso antes da reconciliação.
5. reaplicar medidas e só então avaliar reabertura. Repetir com reconciliação falhando.
6. Conferir o efeito por caminho distinto: Consultar armazenamento restaurado e fronteira de apresentação com atores distintos; restauração visual de exemplos não equivale a backup governado.
7. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Conteúdo eliminado/permissão revogada não voltam; área fica isolada se falhar; relógio não reinicia pela restauração. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Estado de isolamento, medidas reaplicadas e comparação de acesso/relógio.

**Decisão de governança separada:** Revisão V06 antes de reabrir quando cobertura/resultado não demonstrados; marcadores também têm política própria.

**Rastreabilidade:** categorias C01, C04, C05, C08; lacunas G04, G07, G09; decisões D01, D05, D06, D07; gatilhos a classificar V06; critérios A19; operações OP-11, OP-14; requisitos REQ-06, REQ-07, REQ-09.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G04, G07, G09 e decisões D01, D05, D06, D07. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R10 — Nova tentativa repete uma operação já executada parcialmente

**Resultado de origem:** Estado e condições atuais são reavaliados; não há efeito duplicado indevido nem falsa conclusão.

**Variante:** `RETRY_IDEMPOTENTE`. **Pré-condições:** Intenção INT-1 executou COPY-1 e deixou COPY-2 pendente; chave KEY-1 vinculada ao escopo e ator.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Repetir KEY-1.
4. tentar mesma chave com escopo alterado.
5. revogar autoridade antes de recuperar resultado.
6. entregar evento antigo fora de ordem.
7. Conferir o efeito por caminho distinto: Comparar efeitos por destino e versões atuais; observar fronteira de resultado e relógio original.
8. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Sem duplicação indevida; chave para outra intenção produz conflito; obter resultado exige autorização atual; evento antigo não ressuscita estado nem reinicia prazo. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Chave opaca, referências da intenção, contagem de efeitos e decisões atualizadas.

**Decisão de governança separada:** Escolher mecanismo de idempotência/ordenação, sem tratar token de sessão como concessão atual.

**Rastreabilidade:** categorias C05, C06, C08; lacunas G05, G08, G09; decisões D02, D05; gatilhos a classificar V09; critérios A16, A17, A18, A23; operações OP-08, OP-12, OP-13, OP-14, OP-09, OP-11; requisitos REQ-04, REQ-08, REQ-09, REQ-06, REQ-02, REQ-15.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G05, G08, G09 e decisões D02, D05. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R11 — Pedido não pode ser integralmente atendido por decisão fundamentada

**Resultado de origem:** Medida cabível, retenção/negativa e revisão são comunicadas sem revelar informação restrita.

**Variante:** `DECISAO_PARCIAL`. **Pré-condições:** Pedido CASE-1 contém dois escopos; decisão de laboratório admite um e mantém outro pendente/negado com fundamento sintético identificado.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Registrar decisão por escopo.
4. comunicar ao solicitante.
5. tentar recuperar detalhes restritos e solicitar revisão.
6. Conferir o efeito por caminho distinto: Conferir ficha de decisão e comunicação com solicitante sem acesso ao segundo escopo.
7. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Medida cabível e limites comunicados; nenhuma informação restrita; negativa não impede acompanhamento/revisão apropriados; fundamento não é inventado. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Referências minimizadas do fundamento, estado por medida e encaminhamento de revisão.

**Decisão de governança separada:** Fundamento/competência real e conflito de interesse exigem revisão aplicável; ensaio não valida juridicamente a decisão.

**Rastreabilidade:** categorias C05, C06; lacunas G01, G06, G08; decisões D03, D06, D07; gatilhos a classificar V02, V03, V08; critérios A07, A10, A22, A23; operações OP-06, OP-09, OP-10, OP-11, OP-14; requisitos REQ-03, REQ-11, REQ-12, REQ-02, REQ-10, REQ-14, REQ-08, REQ-15.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G01, G06, G08 e decisões D03, D06, D07. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R12 — Derivado foi recalculado após alteração de origem, mas uso não está autorizado

**Resultado de origem:** Recalcular não libera apresentação/utilização; restrição aplicável permanece.

**Variante:** `DERIVADO_RECALCULADO_RESTRITO`. **Pré-condições:** SYN-1 é recalculável a partir de OBS-1/v2, mas finalidade F-USO está restrita na concessão.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Recalcular em contexto autorizado de manutenção.
4. tentar exibir, usar em nova síntese, compartilhar e exportar com finalidade restrita.
5. Conferir o efeito por caminho distinto: Verificar versão derivada e tentar caminhos de consumo com ator restrito, inclusive cache e relatório.
6. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Recalcular não libera apresentação/uso; as quatro dimensões ficam distintas e cada caminho aplica restrição vigente. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Estado por dimensão, finalidade e decisões nas fronteiras.

**Decisão de governança separada:** Finalidade/permissão de manutenção precisa ser explícita; recomputação não cria base independente.

**Rastreabilidade:** categorias C04, C05; lacunas G02, G04, G07; decisões D02, D05; gatilhos a classificar V09; critérios A06, A11, A15, A18; operações OP-05, OP-10, OP-08, OP-14; requisitos REQ-03, REQ-05, REQ-06, REQ-14, REQ-04, REQ-09.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G02, G04, G07 e decisões D02, D05. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R13 — Cópia foi entregue a destinatário externo

**Resultado de origem:** Registra-se o alcance real da entrega/medidas cabíveis, sem alegar apagamento fora da governança.

**Variante:** `COPIA_EXTERNA`. **Pré-condições:** PKG-1 foi entregue legitimamente a REC-EXT antes da revogação; cópia EXT-1 está fora da governança técnica do sistema.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Revogar futuras entregas e solicitar medidas cabíveis à cópia externa pelo procedimento de laboratório.
4. consultar resposta ao pedido.
5. Conferir o efeito por caminho distinto: Conferir registro de entrega anterior, negativa posterior e comunicação de limite; não usar simulação de confirmação como prova externa.
6. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Registra alcance/destino e medidas/limites; não afirma apagar remotamente cópia fora de controle; novas entregas exigem autorização atual. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Ordem/escopo da entrega, natureza externa da cópia e próxima medida.

**Decisão de governança separada:** Definir medidas cabíveis e destinatário legítimo, sem envio real nesta tarefa.

**Rastreabilidade:** categorias C05, C06, C07; lacunas G07, G08, G09; decisões D04, D06; gatilhos a classificar V05; critérios A07, A14; operações OP-06, OP-04, OP-07, OP-10, OP-13; requisitos REQ-03, REQ-11, REQ-12, REQ-04.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G07, G08, G09 e decisões D04, D06. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R14 — Conteúdo pessoal eliminável aparece em log ou evidência de execução

**Resultado de origem:** Cópia é tratada conforme política; prova minimizada não reconstitui conteúdo eliminado.

**Variante:** `LOG_COM_CONTEUDO`. **Pré-condições:** LOG-1 e EVID-1 contêm marcador sintético QA_RETENCAO_V1 indevidamente copiado; política admite prova mínima sem o teor.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Executar tratamento delimitado.
4. inspecionar logs, erros, anexos e evidência resultante.
5. provocar falha de gravação da prova após efeito.
6. Conferir o efeito por caminho distinto: Busca independente nos campos e destinos declarados; conferir política própria da prova e reconciliação.
7. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Prova não reconstitui conteúdo eliminado; se efeito ocorreu e comprovação falhou, manter sob verificação sem restaurar dados por conveniência. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Inventário de campos, buscas negativas e estado do efeito/comprovação.

**Decisão de governança separada:** Regime de registro de incidente é condicional em GOV-002; não aplica conservação genérica a qualquer log.

**Rastreabilidade:** categorias C02, C06, C09; lacunas G06, G08, G09; decisões D05, D06, D07; gatilhos a classificar V01, V08; critérios A12, A21, A23; operações OP-11, OP-04, OP-07, OP-09, OP-14; requisitos REQ-06, REQ-07, REQ-08, REQ-03, REQ-12, REQ-02, REQ-15.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G06, G08, G09 e decisões D05, D06, D07. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R15 — Nome é substituído por código e alguém solicita marcar o conjunto como anônimo

**Resultado de origem:** Anonimização não é declarada sem verificação técnica apropriada; informação vinculável continua protegida.

**Variante:** `PSEUDONIMO_VINCULAVEL`. **Pré-condições:** SET-1 substitui nome por CODE-1, mas LOOKUP-1 e contexto permitem vínculo sintético.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Solicitar classificação como anônimo.
4. verificar vínculo pela tabela/contexto.
5. testar apresentação/exportação sem autoridade enquanto avaliação está pendente.
6. Conferir o efeito por caminho distinto: Reidentificação apenas no conjunto sintético por verificação distinta; conferir classificação e fronteira de acesso.
7. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Conjunto continua protegido e não é declarado anônimo só por trocar nome por código. Método futuro exige avaliação competente de seu escopo/limitações. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Método e limitações, resultado de vínculo e estado da avaliação, sem tabela real.

**Decisão de governança separada:** Definir método competente; ensaio não certifica anonimização de conjunto real nem dispensa V2 antes da irreversibilidade.

**Rastreabilidade:** categorias C01, C03, C04, C09, C10; lacunas G06, G09; decisões D06, D07; gatilhos a classificar V01, V08; critérios A06, A21, A24; operações OP-05, OP-04, OP-07, OP-01, OP-11; requisitos REQ-03, REQ-05, REQ-12, REQ-06, REQ-07, REQ-08.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G06, G09 e decisões D06, D07. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.

## R16 — Instituição corrige falha e conserva material de aprendizagem

**Resultado de origem:** Correção não é apresentada como prova de aprendizagem ou eliminação da causa; conteúdo pessoal tem política própria.

**Variante:** `APRENDIZAGEM_SEPARADA`. **Pré-condições:** INC-1 possui medida técnica FIX-1, nota metodológica METHOD-1 sem teor pessoal e material pessoal sintético RAW-1 com política separada.

### Procedimento

1. Confirmar ambiente isolado, política/versões, capacidade e método de observação descritos na ficha; registrar bloqueio antes de qualquer ação não disponível.
2. Preparar os objetos/atores da variante por adaptador de teste autorizado e registrar manifesto mínimo. Não promover fixtures a prova de identidade/autoridade do produto.
3. Registrar correção e nota.
4. tentar concluir eliminação da causa só pela correção.
5. tentar conservar RAW-1 por chamar de aprendizado.
6. avaliar destinação própria.
7. Conferir o efeito por caminho distinto: Conferir campos da nota, evidência da medida e política/destino do material pessoal; ausência de teste causal permanece limite.
8. Registrar observado e evidências, limpar somente os artefatos sintéticos criados e manter escopo/limites da conclusão.

**Esperado / critérios de falha:** Medida técnica não prova aprendizagem/eliminação da causa; método e dados separados; RAW-1 não ganha retenção indefinida. Divergência observada em qualquer condição aplicável gera FAIL; impossibilidade de observar impede PASS.

**Prova específica:** Referências da medida, nota metodológica, avaliação pendente e destinação dos dados.

**Decisão de governança separada:** Evidência de aprendizagem/causa e base de conservação são avaliações distintas; não inventar novos princípios.

**Rastreabilidade:** categorias C01, C06, C09, C10; lacunas G08, G09; decisões D06; gatilhos a classificar V08; critérios A24; operações OP-01, OP-05, OP-11; requisitos REQ-06, REQ-07, REQ-08.

**Prontidão atual:** BLOQUEADO_PARA_ACEITACAO_INTEGRAL. **Motivo:** Confirmar/implementar fronteira e capacidades necessárias; gaps G08, G09 e decisões D06. **Resultado:** NAO_EXECUTADO; observado e evidências ainda vazios.
