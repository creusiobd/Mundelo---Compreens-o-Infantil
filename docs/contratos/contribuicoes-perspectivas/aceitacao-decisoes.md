# Cenários futuros e decisões abertas

[Estado/aceite documental](README.md) · [Modelo estruturado](modelo.json)

## Regra de evidência

**Todos os 24 casos estão NAO_EXECUTADO.** São critérios para implementação/revisão futura; não testes passados nem autorização de dados reais. Pré-condições comuns: versão/ambiente fixados, dados inteiramente sintéticos, caminhos reais e atores/escopos de laboratório definidos, decisões pertinentes resolvidas e observação por método distinto do disparo. Se faltar controle, manter bloqueio; não implementá-lo dentro do teste e chamar a simulação de sistema real.

A futura ficha identifica política/versões de fonte/autoridade, esperado e observado por critério, cobertura/limite, prova minimizada, executor e conferência aplicável. Casos com decisões jurídicas pendentes não recebem validação jurídica por um teste sintético. V1 não substitui V2/V3 quando exigidos. CI desta entrega verifica documentação/regressão existente, sem executar CP-01–CP-24 ou R01–R16.

## CP-01 — Manifestação, observação e interpretação separadas

- **Dado:** Uma criança fictícia afasta um objeto; adulto A registra o gesto e acrescenta que acredita ser desconforto.
- **Quando:** Registrar a descrição e a interpretação com suas atribuições/contextos informados.
- **Esperado:** Gesto relatado é distinguível da interpretação de A; experiência interna, intenção e consentimento da criança não são preenchidos.
- **Controle negativo:** Não atribuir à criança a frase ou significado interpretado pelo adulto.
- **Vínculos:** PC-01, PC-02, PC-07; OP-02, OP-05; retenção R02; decisões J01, J02.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-02 — Cadeia de relato sem conta presumida

- **Dado:** Registrador A recebe de B um relato cuja pessoa observadora não foi identificada.
- **Quando:** Registrar a fonte textual e consultar a proveniência no escopo permitido.
- **Esperado:** A é registrador, B é fonte declarada; observador/autor original desconhecidos continuam lacuna; fonte textual não vira conta autenticada.
- **Controle negativo:** Nome citado ou papel 'mãe' não resolve identidade, verificação ou autoria de interpretação.
- **Vínculos:** PC-01, PC-03; OP-02, OP-04; retenção R02; decisões J01, T01.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-03 — Lacunas limitam operação pertinente

- **Dado:** Contribuição sintética tem contexto não informado e trecho não observado; há pedido de síntese que depende desse contexto.
- **Quando:** Registrar legitimamente e depois avaliar o uso específico.
- **Esperado:** Registro mantém estados distintos; uso dependente fica pendente ou explicitamente limitado, sem inventar o contexto.
- **Controle negativo:** Não bloquear todo registro só pela falta de explicação verbal; não preencher ausência por IA.
- **Vínculos:** PC-01, PC-03; OP-02, OP-05; retenção R01, R02; decisões T01, J01.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-04 — Autoria de interpretação não inferida de registrador

- **Dado:** Legado contém recordedByCaregiverId, notes em primeira pessoa e revision=4, sem autor de interpretação/alteração.
- **Quando:** Apresentar o legado e preparar futura reconciliação.
- **Esperado:** Conserva o texto e sua proveniência permitida; intérprete/editor permanecem 'Não registrados separadamente' enquanto sem prova.
- **Controle negativo:** Não atribuir ao registrador, responsável legal ou último usuário autenticado a autoria faltante.
- **Vínculos:** PC-02, PC-14; OP-04, OP-08; retenção R03; decisões T01.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-05 — Contribuições independentes sobre o mesmo evento

- **Dado:** A e B descrevem de modo incompatível um encontro sintético no mesmo período/contexto informado.
- **Quando:** Registrar ambas e relacionar a divergência.
- **Esperado:** Cada unidade mantém autoria/fonte/versão; divergência é visível no escopo autorizado e não escolhe vencedor automaticamente.
- **Controle negativo:** Profissão, quantidade de relatos, ordem de cadastro ou recência não apagam a outra contribuição.
- **Vínculos:** PC-04, PC-10; OP-02, OP-05, OP-09; retenção R03; decisões T02, J01.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-06 — Contextos distintos não viram contradição total

- **Dado:** A registra aceitação de um objeto em casa; B registra recusa em outro ambiente e momento.
- **Quando:** Preparar perfil curado/síntese para finalidade autorizada.
- **Esperado:** Contextos/períodos e limites permanecem; perfil não vira 'sempre gosta/nunca gosta' nem apaga as fontes.
- **Controle negativo:** Não fundir por criança ou autor, nem tratar diferença contextual como falsidade.
- **Vínculos:** PC-04, PC-10, PC-12; OP-03, OP-05, OP-14; retenção R03, R12; decisões T02, T03.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-07 — Ordenação e atualidade

- **Dado:** Lista global legada apresenta um interesse primeiro e outro foi cadastrado mais recentemente; sem medida de frequência.
- **Quando:** Montar resumo ou perfil curado.
- **Esperado:** Apresentar como informação de perfil com fonte/tempo não indicados, ou limitar uso conforme a finalidade; nenhuma frequência/atualidade é inferida.
- **Controle negativo:** Não criar preferência por fallback, idade, ordem do array ou timestamp de importação.
- **Vínculos:** PC-05, PC-12; OP-04, OP-05; retenção R01; decisões T01, T03.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-08 — Correção própria condicionada ao acesso vigente

- **Dado:** Autor A pode corrigir sua unidade v1, com origem/atribuição verificáveis no contexto sintético.
- **Quando:** Corrigir para v2; repetir depois de perder a permissão pertinente.
- **Esperado:** Correção autorizada mantém agente/versão e reavalia dependências; repetição sem permissão é negada/pendente, sem efeito protegido.
- **Controle negativo:** Ser autor não contorna revogação/restrição ou dá direito de apagar dados de terceiros.
- **Vínculos:** PC-06, PC-09, PC-15; OP-08, OP-13, OP-14; retenção R03, R06; decisões T04, J01.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-09 — Contestação de outra perspectiva

- **Dado:** B discorda de contribuição de A e tem legitimidade para manifestar contestação.
- **Quando:** Registrar contestação e pedir revisão.
- **Esperado:** B assina sua manifestação relacionada a A/v1; decisão/estado do pedido são distintos; A/v1 não é sobrescrita nem declarada falsa por essa ocorrência.
- **Controle negativo:** Não exigir concordância com A ou capacidade universal de explicação verbal.
- **Vínculos:** PC-06, PC-08, PC-10; OP-09, OP-10; retenção R02, R11; decisões J01, J02.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-10 — Administração não toma autoria alheia

- **Dado:** Uma medida administrativa sobre versão de A tem fundamento/escopo identificado; exige revisão adicional na fase aplicável.
- **Quando:** Propor alteração com e sem revisão/fundamento suficientes.
- **Esperado:** Só medida legitimada e revisada pode produzir efeito; agente administrativo é agente da alteração, não autor retroativo de A.
- **Controle negativo:** Não usar cargo, papel de guardião ou revisão de PR como checkpoint humano do caso.
- **Vínculos:** PC-06, PC-08, PC-16; OP-08, OP-10, OP-11; retenção R03, R11; decisões J01, J02, T05.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-11 — Representação, profissão e concessão independentes

- **Dado:** Pessoa com vínculo/credencial declarados pretende representar criança ou conceder histórico a outro destinatário.
- **Quando:** Avaliar cada ato, sua autoridade e escopo.
- **Esperado:** Representação/concessão seguem verificação por ato; vínculo e competência declarados não criam acesso, verdade ou autoridade universal.
- **Controle negativo:** Não decidir por regra universal de um/todos responsáveis nem herdar concessão por equipe.
- **Vínculos:** PC-07, PC-08, PC-15; OP-06, OP-12; retenção R02, R05; decisões J01, J02.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-12 — Edições concorrentes da mesma versão

- **Dado:** Duas alterações autorizadas partem de C-A/v1 com decisões/contextos próprios.
- **Quando:** Efetivar uma e tentar a outra com alvo superado.
- **Esperado:** Conflito é explícito e exige nova avaliação; não perder silenciosamente a alteração efetivada nem misturar autores.
- **Controle negativo:** Não resolver por último relógio do cliente, maior revision isolada ou sobrescrita automática.
- **Vínculos:** PC-09; OP-08; retenção R10; decisões T02, T04.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-13 — Retry e evento fora de ordem

- **Dado:** Uma correção foi aplicada, mas a confirmação falhou; há retentativa e evento mais antigo.
- **Quando:** Repetir a mesma intenção e processar o evento atrasado.
- **Esperado:** Prova distingue tentativa/efeito e evita duplicação; evento antigo não reativa conteúdo ou permissão; acesso ao resultado requer avaliação atual.
- **Controle negativo:** Não reiniciar retenção/prazo por retry nem gerar novo autor por execução em job.
- **Vínculos:** PC-09; OP-08, OP-14; retenção R07, R10; decisões T04, T05.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-14 — revision/updatedAt não reconstituem acervo

- **Dado:** Legado tem revision=5 e updatedAt, sem versões anteriores nem editor informado.
- **Quando:** Converter representação conceitual e apresentar o histórico disponível.
- **Esperado:** Preservar valores como metadados declarados, com cobertura histórica não demonstrada; nova operação futura tem seu agente sem inventar os anteriores.
- **Controle negativo:** Não criar cinco versões, autor antigo ou data do acontecimento a partir da importação.
- **Vínculos:** PC-02, PC-03, PC-09, PC-14; OP-04, OP-08; retenção R03; decisões T01, T02.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-15 — Tempo do acontecimento desconhecido

- **Dado:** Arquivo legado tem data de importação atual e occurredAt ausente/incerto; relação/papel histórico também não comprovados.
- **Quando:** Conciliar ou receber em área apropriada segundo política futura.
- **Esperado:** Tempo de ingestão fica separado; acontecimento/relação histórica mantêm lacuna ou verificação pendente; operação dependente é limitada.
- **Controle negativo:** Não usar 'agora', papel atual, fixture padrão ou data de edição como fato histórico.
- **Vínculos:** PC-03, PC-05, PC-14; OP-02, OP-04; retenção R01, R03; decisões T01, J01.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-16 — Correção e eliminação de versão anterior

- **Dado:** C-A/v1 alimentou síntese S/v1; v2 corrige a fonte e a decisão cabível manda destinar conteúdo de v1.
- **Quando:** Aplicar medida e reavaliar versões, perfil curado, síntese, logs e referências conhecidos.
- **Esperado:** Conteúdo legitimamente eliminável não fica em diff/prova; quatro dimensões do derivado são decididas separadamente; nenhum restauro para produzir histórico.
- **Controle negativo:** Não guardar cópia integral/hash identificável indefinidamente por rastreabilidade nem apagar fatos independentes automaticamente.
- **Vínculos:** PC-06, PC-11, PC-13, PC-15; OP-08, OP-11, OP-14; retenção R03, R04, R14; decisões T02, T03, T05.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-17 — Leitura não concede uso nem revela fonte restrita

- **Dado:** Leitor pode consultar fonte A, não pode usá-la na finalidade de síntese e não pode consultar fonte B.
- **Quando:** Preparar/apresentar/exportar perfil ou síntese que referencie A e B.
- **Esperado:** Uso sem condição é impedido; linhagem/citações/contagens não revelam B; se contexto íntegro não puder ser entregue legitimamente, representação não é disponibilizada.
- **Controle negativo:** Não expor identidade, existência ou metadados de B pela justificativa ou por um resumo inferencial.
- **Vínculos:** PC-08, PC-11, PC-12, PC-15; OP-03, OP-04, OP-05, OP-06, OP-07; retenção R05, R12, R13; decisões T03, J01.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-18 — Importação v1/v2 não cria autoridade

- **Dado:** Cofre sintético íntegro contém papel de guardião, registrador e revisão maiores que o estado atual.
- **Quando:** Importar/conferir legado e decidir autoria/acesso/alteração por operação.
- **Esperado:** Integridade e compatibilidade preservam apenas alegações demonstráveis; perfil/papel/ID importado não concede poder, não preenche autoria e não substitui verificação atual.
- **Controle negativo:** Senha correta, schema válido e maior revisão não permitem alterar contribuição alheia ou ampliar acesso.
- **Vínculos:** PC-08, PC-14, PC-15; OP-02, OP-08, OP-12; retenção R02, R03; decisões T01, T04, J01.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-19 — Retenção necessária sem exposição irrestrita

- **Dado:** Uma versão contestada precisa permanecer no escopo de política/exceção concretamente verificada.
- **Quando:** Avaliar conservação, leitura, uso e próxima revisão.
- **Esperado:** Conservar somente extensão/período aplicáveis, mantendo restrições; controvérsia/indisponibilidade de revisor não cria prazo indefinido.
- **Controle negativo:** Não mudar parâmetros candidatos C01–C10 nem confundir bloqueio de uso com eliminação.
- **Vínculos:** PC-11, PC-13, PC-16; OP-01, OP-10, OP-14; retenção R01, R08, R11; decisões J01, J02, T05.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-20 — Restauração e cobertura limitada

- **Dado:** Backup anterior contém conteúdo destinado e concessão revogada; índice de dependências tem cobertura incompleta.
- **Quando:** Restaurar em isolamento e conciliar antes de reabrir leitura/uso.
- **Esperado:** Reaplicar medidas atuais; cobertura insuficiente mantém escopo afetado pendente, sem remontar conteúdo eliminado para reconstruir o grafo.
- **Controle negativo:** Não reiniciar retenção, reativar acesso ou declarar propagação completa porque o backup abriu.
- **Vínculos:** PC-11, PC-13, PC-14, PC-15; OP-01, OP-04, OP-11, OP-14; retenção R08, R09; decisões T02, T05.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-21 — Prova falha depois de efeito parcial

- **Dado:** Parte de uma destinação foi aplicada e outra tarefa/prova falhou.
- **Quando:** Conferir efeito por escopo e comunicar estado.
- **Esperado:** Resultado é parcial/sob verificação com ação responsável; evidência minimizada tem política própria e não recompõe o conteúdo eliminado.
- **Controle negativo:** Não declarar conclusão integral por comando aceito, nem restaurar dado para provar que foi apagado.
- **Vínculos:** PC-13, PC-16; OP-11, OP-14; retenção R07, R10, R14; decisões T05, J02.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-22 — Curador/método não assume autoria

- **Dado:** Curador seleciona contribuições de A e B; um método automatizado auxilia a organização.
- **Quando:** Gerar perfil curado e revisar seleção.
- **Esperado:** Registrar curadoria/método e versões usadas; atribuições originais e divergências persistem no escopo permitido; campos sem suporte ficam lacuna, sem consenso fabricado.
- **Controle negativo:** Não dar ao curador, sistema ou profissional prioridade narrativa automática nem atribuir sua interpretação à criança.
- **Vínculos:** PC-04, PC-05, PC-10, PC-12; OP-03, OP-05, OP-14; retenção R12, R15; decisões T03, J01.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-23 — Cópias externas e aprendizagem institucional

- **Dado:** Resultado derivado foi legitimamente entregue fora do sistema; incidente gera nota metodológica sem necessidade do teor pessoal.
- **Quando:** Revogar futuro uso/entrega e avaliar destinação do material e da aprendizagem.
- **Esperado:** Registrar alcance real; método C10 é separado das fontes pessoais, que seguem suas políticas; código/pseudônimo não prova anonimato.
- **Controle negativo:** Não alegar apagar cópia fora da governança ou conservar dados pessoais para sempre como aprendizado.
- **Vínculos:** PC-11, PC-13, PC-16; OP-01, OP-07, OP-13, OP-14; retenção R13, R15, R16; decisões T05, J01.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.

## CP-24 — Aprovação documental não abre gate real

- **Dado:** Contrato foi incorporado, mas #27 está sem validação, #29 pausada e V2 não tem pessoa designada.
- **Quando:** Solicitar migração/medida real com fundamento apenas nesta entrega ou na CI.
- **Esperado:** Manter implementação dependente de revisão própria e dados reais bloqueados; nenhum controle ou competência é presumido existente.
- **Controle negativo:** Não retomar Supabase, criar infraestrutura ou marcar cenário funcional PASS a partir do contrato.
- **Vínculos:** PC-07, PC-16; OP-02, OP-11, OP-12; retenção R02, R11; decisões T01, T02, T03, T04, T05, J01, J02.
- **Estado:** NAO_EXECUTADO. Evidência exigida: No ensaio futuro: commit/ambiente/política, atores e escopos sintéticos, origem/versões, estímulo e efeito observado por caminho distinto, resultado por critério, evidência minimizada e limites; nenhum dado real enquanto gates fechados.


## Decisões que não foram tomadas pela entrega

### T01 — Representação de lacunas, identidades e reconciliação de legados

Escolher representação lógica/física de atribuições por unidade, identidade declarada versus verificada, fonte, granularidade e ingresso seguro de legados incompletos. Não alterar o validador atual nem preencher defaults por esta proposta.

**Responsável por encaminhar:** Creusio Kizua; revisão técnica posterior. **Estado:** ABERTA.

### T02 — Versões, dependências e capacidade de retenção

Definir mecanismo físico de versões/relações, comparações de revisão, cobertura/ciclos e destinação verificável de conteúdo/diffs/índices/cópias. Planejar sem conexão ou retomada de #29.

**Responsável por encaminhar:** Revisão técnica; dependência externa #29 PAUSADA. **Estado:** ABERTA_COM_DEPENDENCIA_PAUSADA.

### T03 — Perfil curado, unidades de interpretação e método de síntese

Revisar granularidade e fronteiras das unidades autorais, seleção autorizada, explicação de cobertura/divergência e métodos admissíveis; automação não é autorizada por esta descrição.

**Responsável por encaminhar:** Creusio Kizua; revisão de produto/domínio. **Estado:** ABERTA.

### T04 — Fronteira efetiva e concorrência por operação

Derivar posteriormente API/schema/RLS, idempotência, concessões e guarda de efeito para o modelo. Preservar ADR-005 aceita para identidade adulta; não reabrir escolha de provedor nem criar infraestrutura. Correções client-side/cofre v2 não demonstram autorização persistente.

**Responsável por encaminhar:** Revisão técnica própria; TEC-003 D01–D04/D08. **Estado:** ABERTA.

### T05 — Prova, anonimização e destinação em todos os suportes

Definir evidência minimizada, critérios de identificabilidade, método de verificação e capacidade de eliminar/reconciliar versões, logs, pacotes e backups; sem novos números de retenção ou marcadores perpétuos.

**Responsável por encaminhar:** Revisão técnica/governança; #27 e #29 PAUSADA quando pertinentes. **Estado:** ABERTA.

### J01 — Legitimidade de autoria, representação e tratamento por categoria/ato

Conferir enquadramentos e alcance territorial, participação/representação, dados de terceiros, histórico e poderes por operação. Não estabelecer consenso familiar universal, hierarquia profissional ou direitos finais nesta proposta.

**Responsável por encaminhar:** GOV-001/#27; competência apropriada a comprovar. **Estado:** PENDENTE_VALIDACAO_JURIDICA.

### J02 — Revisão adicional, conflitos e medidas irreversíveis

Aplicar fases/gatilhos GOV-002/GOV-003 e comprovar competência/ausência de conflito/acesso mínimo. O próprio executor e a CI não substituem pessoa distinta; falta de capacidade não autoriza efeito ou retenção irrestritos.

**Responsável por encaminhar:** Creusio Kizua; V2/V3 competentes a designar conforme GOV-003. **Estado:** PENDENTE_APLICACAO_POR_CASO.


## Próximas fatias, depois da revisão apropriada

| Fatia candidata | Antes de autorizar sua implementação | Casos de partida |
|---|---|---|
| Representação de lacunas e unidades independentes em ambiente sintético | Revisar T01/T03, granularidade/autorias e limites de compatibilidade; sem alterar valores históricos por default | CP-01–CP-07, CP-14/15 |
| Correção própria e relações entre versões/perspectivas | Revisar T02/T04 e procedimento de autoridade; teste negativo por pessoa/versão/operação | CP-08–CP-13/18 |
| Curadoria e propagação autorizada | Revisar T03/T04, cobertura/proteção de relações e método; não habilitar síntese automatizada por esta tabela | CP-05/06/16/17/22 |
| Destinação e comprovação proporcionais | T05, J01/J02 e capacidade do ambiente demonstradas; respeitar pausa #29 até pedido explícito de retomada | CP-16/19–CP-24 |

A sequência é proposta de fatiamento, não novo backlog técnico automaticamente autorizado. Aprovar/incorporar o contrato não aprova suas migrations nem encerra gates. A tarefa #61 pode alinhar linguagem demonstrativa no seu próprio recorte, sem depender da implantação deste modelo e sem ampliar permissões. As questões de identidade das demais telas inventariadas em #59 continuam próprias, sem declaração de solução por este contrato.
