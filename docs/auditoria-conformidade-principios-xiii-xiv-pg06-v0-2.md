# MUNDELO — Reavaliação da auditoria XIII/XIV e PG-06 v0.2

**Data:** 21/11/2026 · **PR:** [#17](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/17) · **Base examinada:** `3208aa0d3b067d30bd940c7b12e59b0b14f508d8`.
**Resultado:** PG-06 continua **NÃO ATENDIDO integralmente**. Este parecer é estático e documental; não implementa correções nem declara defeitos reproduzidos em execução. Dados infantis reais permanecem bloqueados.

## 1. Escopo e rastreabilidade

Reavaliados os dez achados da [v0.1 histórica](auditoria-conformidade-principios-xiii-xiv-pg06-v0-1.md), preservada sem alteração de bytes, e identificados dois recortes adicionais no código atual. O [registro estruturado](auditoria/pg06-2026-11-21/evidencias.json) fixa SHA dos arquivos, intervalos de linhas, resultado e tarefas decorrentes. Os identificadores AUD são achados de auditoria, não novos princípios INF-ID.

A reavaliação usa o código de uma revisão fixa, o [PG-06](principles-gate-v1.md), a [norma de pluralidade](principio-pluralidade-perspectivas-v0-1.md), o [contrato incorporado](contrato-dominio-mundelo-v0-1.md), a [especificação TEC-003](especificacoes/tec-003/README.md) e a [política de retenção](politica-operacional-retencao-destinacao-v0-1.md). Incorporação documental não implica implementação, aprovação de schema, validação jurídica ou consolidação dos 73/219 INF-ID. O acervo ausente do Codex não foi reconstruído.

## 2. O que mudou desde a v0.1

| Frente | Estado atual observado | Consequência para a auditoria |
|---|---|---|
| Contrato e regras por operação | PRs #18–#21 e #39–#42 trouxeram documentação de contribuições, operações, retenção, autoridade e verificação | “Desenhar primeiro o contrato” deixou de ser uma descrição suficiente do próximo passo; ainda é necessário avaliar cada incremento contra esses documentos |
| Detalhe após perda de acesso | PR #49 resolve a observação na coleção autorizada, limpa a seleção no contexto e reavalia leitura no modal | Reconhecer a correção #43; ela não cria histórico ou autoria da interpretação |
| Perfil no relatório | PR #49 bloqueia apresentação/cópia/impressão sem leitura do perfil; selecionados passam por inclusão autorizada | Reconhecer #46, sem confundir acesso ao perfil com proveniência dos itens ou validade da síntese |
| Pacote do cofre | #44/PR #48 revalida liberação; #45/PR #49 exporta envelope v2 mínimo e mantém importação v1 | Não repetir as quatro falhas QA como se continuassem abertas; não extrapolar para todas as telas, retenção ou servidor |
| Fluxos de pedidos e prontidão | PR #50 incorpora proposta UX e parecer NO-GO para dados infantis reais | Especificação disponível; fluxo persistente, prova externa e execução humana continuam pendentes |

As provas de correção da PR #49 estão em [seu relatório](qa/fix-43-45-46/README.md) e [evidência](qa/fix-43-45-46/validacao.json). Seus resultados não são testes novos desta auditoria. Não reabrir #43/#45/#46 para problemas distintos.

## 3. Matriz de reavaliação dos dez achados

| ID | Disposição atual | Síntese |
|---|---|---|
| AUD-01 | Mantido, ALTA | Listas globais do perfil continuam sem proveniência por item |
| AUD-02 | Mantido/precisado, ALTA | Guardas de UI e mutadores do perfil continuam inconsistentes; papel sozinho também não demonstra status/vínculo |
| AUD-03 | Mantido, ALTA | Contador de revisão substitui objeto sem autor da alteração ou acervo governado de versões |
| AUD-04 | Parcial; documentação avançou | Exclusão de sessão continua sem execução de ciclo de vida, mas política e especificação já existem |
| AUD-05 | Mantido, ALTA | Textos fixos ainda são apresentados como padrões da amostra |
| AUD-06 | Mantido; recorte de acesso corrigido | Atribuição “Hipótese Familiar” e atributos sem fonte permanecem após #49 |
| AUD-07 | Parcial/precisado | Há campo opcional de observador; fonte livre não é autenticada e intérprete não está separado |
| AUD-08 | Mantido, bloqueador de dados reais | Autorização segue demonstrativa no cliente |
| AUD-09 | Qualificado, BAIXA | Vocabulário merece revisão; termo técnico “canônico” sozinho não prova imposição de consenso |
| AUD-10 | Localização original corrigida na auditoria | Comentário do helper está alinhado; divergência correlata está no wrapper/mensagem do contexto |

### AUD-01 — Perfil global sem autoria e contexto por item

**Evidências:** [src/types/index.ts:84–105](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/types/index.ts#L84-L105); [src/validation/schemas.ts:45–64](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/validation/schemas.ts#L45-L64); [src/screens/MyWorldScreen.tsx:130–180](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/screens/MyWorldScreen.tsx#L130-L180).

Interesses, conforto, sensibilidades, comunicação e conquistas são strings de listas centrais. Estratégias têm contexto/resposta, mas não autoria, origem e temporalidade próprias. Isso não prova que a UI execute consenso automático; demonstra que o modelo não consegue atribuir cada item a uma experiência independente. Uma visão curada futura precisa explicitar fontes/versões, seleção, contexto e limites, sem converter conjunto de relatos em identidade definitiva.

### AUD-02 — Autorização dos comandos de perfil

**Evidências:** [src/context/AppContext.tsx:433–583](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/context/AppContext.tsx#L433-L583); [src/screens/MyWorldScreen.tsx:140–178](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/screens/MyWorldScreen.tsx#L140-L178); [src/security/authorization.ts:52–58](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/security/authorization.ts#L52-L58).

A UI usa permissão de criar observação para add/remove de atributos. Os mutadores das listas não revalidam a autorização no comando; `updateProfile` verifica papel LEGAL_GUARDIAN, sem checar ali status e vínculo ativo. A distinção de guardas está no código; nenhum bypass dinâmico foi ensaiado nesta revisão. Definir/reutilizar política por operação e avaliar no efeito, mantendo a diferença entre autorização de acesso e validade de uma perspectiva. Seguimento https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/53.

### AUD-03 — Versões e autoria de alteração

**Evidências:** [src/context/AppContext.tsx:322–370](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/context/AppContext.tsx#L322-L370); [src/types/index.ts:114–136](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/types/index.ts#L114-L136); [src/security/authorization.ts:61–83](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/security/authorization.ts#L61-L83); [src/security/conflictResolver.ts:175–227](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/security/conflictResolver.ts#L175-L227).

O objeto atualizado substitui o anterior; `recordedByCaregiverId` permanece original, sem `updatedBy` ou autoria própria da interpretação. O helper permite ao responsável legal editar contribuições alheias segundo a simulação, enquanto TEC-003/REQ-11 exige distinguir correção própria de autoridade administrativa específica. O resolvedor protege certos campos e rejeita determinados conflitos; não constitui arquivo de versões, autorização confiável ou evidência independente de quem modificou.

A solução futura deve preservar apenas versões legitimamente conserváveis, conforme finalidade/restrições/destinação. Não adotar retenção irrestrita ou append-only perpétuo para “resolver” proveniência.

### AUD-04 — Exclusão de sessão e ciclo de vida

**Evidências:** [src/context/AppContext.tsx:373–398](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/context/AppContext.tsx#L373-L398); [docs/politica-operacional-retencao-destinacao-v0-1.md:48–61](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/docs/politica-operacional-retencao-destinacao-v0-1.md#L48-L61); [docs/especificacoes/tec-003/README.md:85–107](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/docs/especificacoes/tec-003/README.md#L85-L107).

A função remove o item do array e da seleção. O diagnóstico de falta de ciclo de vida efetivo continua; a afirmação antiga de política não documentada ficou desatualizada. Política, categorias e procedimentos já foram incorporados. O código não demonstra execução governada de restrição, prova minimizada, destinação de versões/derivados/cópias ou restauração reconciliada. Não declarar eliminação de produção, nem conservar conteúdo indevido para gerar prova.

### AUD-05 — Padrões fixos e agregação

**Evidências:** [src/screens/UnderstandScreen.tsx:23–45](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/screens/UnderstandScreen.tsx#L23-L45); [src/screens/UnderstandScreen.tsx:70–74](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/screens/UnderstandScreen.tsx#L70-L74); [src/screens/UnderstandScreen.tsx:159–211](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/screens/UnderstandScreen.tsx#L159-L211).

Contagens por ambiente/tipo usam registros autorizados, mas não oferecem recorte por autoria/perspectiva. Já as três descrições de correlação, reação a sons e aumento de atenção são literais fixos, independentes dessas contagens. O aviso geral de simulação convive com a afirmação de que as leituras vêm dos campos da sessão e com o título de padrões identificados. Não basta chamar tudo de “não diagnóstico”: a origem dos enunciados continua enganosa. Retirar a atribuição de achado ou separar exemplos de forma inequívoca. Seguimento https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/51.

### AUD-06 — Relatório e autoria das hipóteses

**Evidências:** [src/screens/ReportScreen.tsx:61–97](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/screens/ReportScreen.tsx#L61-L97); [src/screens/ReportScreen.tsx:111–123](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/screens/ReportScreen.tsx#L111-L123); [src/screens/ReportScreen.tsx:272–295](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/screens/ReportScreen.tsx#L272-L295); [src/screens/ReportScreen.tsx:340–373](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/screens/ReportScreen.tsx#L340-L373).

A guarda de #49 limita o acesso, mas os itens globais ainda aparecem como repertório da criança e toda nota é chamada de “Hipótese Familiar” em prévia/cópia/impressão, independentemente do registrador. Exibir “registrado por” não identifica necessariamente quem interpretou nem quem alterou o texto. Não substituir automaticamente “familiar” por nome do registrador ou papel profissional: quando a autoria própria não existe no modelo, declarar a lacuna. Finalidade escolhida no select não cria concessão. Seguimento https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/54.

### AUD-07 — Registrador, observador, relator e intérprete

**Evidências:** [src/types/index.ts:114–126](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/types/index.ts#L114-L126); [src/validation/schemas.ts:78–87](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/validation/schemas.ts#L78-L87); [src/components/ObservationDetailModal.tsx:55–58](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/components/ObservationDetailModal.tsx#L55-L58); [src/screens/ReportScreen.tsx:81–97](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/screens/ReportScreen.tsx#L81-L97).

O modelo já possui `observedByCaregiverId` opcional; não é correto dizer que nenhum observador pode ser representado. `reportedByLabel` continua livre e não autenticado; intérprete e autor da alteração não têm campos próprios. Schema permite defaults de registrador/proveniência, e apresentação contém fallback de pessoa quando faltam dados. Conta autenticada não é obrigatória para toda fonte mencionada; identificação e grau de verificação precisam ser explícitos, sem inventar pessoa/papel/origem. Essa revisão depende de compatibilidade e requisitos de lacunas, não de trocar todos os campos em lote.

### AUD-08 — Fronteira de autorização

**Evidências:** [src/security/authorization.ts:8–17](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/security/authorization.ts#L8-L17); [src/context/AppContext.tsx:140–164](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/context/AppContext.tsx#L140-L164).

Papéis/vínculos são simulados em memória, e o próprio módulo adverte que não é autorização de produção. #49 não implementa servidor/RLS, legitimidade ou concessão persistente. Manter os gates. #29 continua pausada a pedido do responsável; a aprovação desta auditoria não autoriza retomada de login, provisionamento ou dados reais.

### AUD-09 — Qualificação do vocabulário

**Evidências:** [src/types/index.ts:108–116](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/types/index.ts#L108-L116); [src/context/AppContext.tsx:316–318](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/context/AppContext.tsx#L316-L318).

A expressão aparece no comentário técnico do modelo e na mensagem visível “Observação canônica registrada”. Uma representação técnica canônica pode organizar transporte/validação sem estabelecer verdade sobre a criança. Portanto, o termo sozinho não prova violação funcional da pluralidade. Recomenda-se clarear a mensagem ao usuário, preservando a distinção entre formato padronizado e experiência/interpretação situada. Severidade de linguagem reduzida; não usar este item para contar uma falha de consenso comprovada.

### AUD-10 — Retificação da localização da inconsistência

**Evidências:** [src/security/authorization.ts:86–105](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/security/authorization.ts#L86-L105); [src/context/AppContext.tsx:386–397](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/context/AppContext.tsx#L386-L397).

Na base atual, comentário e implementação do helper `canDeleteObservation` incluem responsável legal e autor vinculado. O enunciado da v0.1 que localizava a divergência nesse comentário **não é sustentado pela fonte atual**. Não atribuir uma correção a commit desconhecido: trata-se de retificação da auditoria, sem conclusão sobre quando/por que teria mudado.

A inconsistência correlata existe no comentário “Only LEGAL_GUARDIAN” e na mensagem do wrapper `deleteObservation`, que usa o helper mais amplo. Alinhar comunicação, testes e política pertinente sem ampliar poder de exclusão por conveniência; não concluir autorização de produção ou correção administrativa a partir do helper demonstrativo.

## 4. Recortes adicionais observados

### AUD-11 — Preenchimento automático de experiências não relatadas

**Evidências:** [src/App.tsx:120–143](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/App.tsx#L120-L143); [src/screens/MyWorldScreen.tsx:56–63](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/screens/MyWorldScreen.tsx#L56-L63); [src/validation/schemas.ts:45–49](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/validation/schemas.ts#L45-L49).

Ao abrir registro por atividade, são preenchidos clima, sinais, satisfação, efeito positivo, casa, papel mãe, proveniência DIRECT e tempos, sem evidência de observação naquele callback. O usuário ainda pode editar o formulário; não se afirma que um registro foi salvo automaticamente. Mesmo assim, sugestões de atividade e fatos vividos não estão separados na preparação. Em Meu Mundo, resposta vazia vira “Resposta calma observada”; o schema também tem defaults descritivos.

É necessário preservar ausência de relato e separar plano/experiência. Não impor explicação ou estado subjetivo da criança para completar campos. Nenhuma atividade genérica comprova efeito ou resultado percebido. Seguimento https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/52.

### AUD-12 — Guarda de leitura de perfil não cobre Meu Mundo

**Evidências:** [src/screens/MyWorldScreen.tsx:22–38](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/screens/MyWorldScreen.tsx#L22-L38); [src/screens/MyWorldScreen.tsx:69–81](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/screens/MyWorldScreen.tsx#L69-L81); [src/screens/MyWorldScreen.tsx:130–150](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/screens/MyWorldScreen.tsx#L130-L150); [src/context/AppContext.tsx:156–191](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/3208aa0d3b067d30bd940c7b12e59b0b14f508d8/src/context/AppContext.tsx#L156-L191).

`activeProfile` é exposto pelo contexto independentemente da guarda, e Meu Mundo renderiza atributos enquanto usa `canCreate` apenas nos controles de escrita. A guarda de ReportScreen não se aplica automaticamente às outras telas. Trata-se de um recorte estático ainda não reproduzido em navegador nesta auditoria; não reclassifica como falha a correção específica do relatório #46. O inventário de superfícies deve avaliar todas as apresentações antes de afirmar cobertura global. Seguimento https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/53.

## 5. Próximos incrementos e aceitação

| Ordem recomendada | Recorte | Evidência de aceite esperada |
|---|---|---|
| 1 | [Padrões fixos — #51](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/51) | Vazio, troca de criança e amostras diferentes não conservam conclusões inventadas; contagens autorizadas permanecem corretas |
| 2 | [Pré-preenchimento — #52](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/52) | Abrir atividade não afirma vivência/sinais/resposta; ausência de resposta não vira calma observada; autoria/proveniência não ganham fatos por default |
| 3 | [Perfil — #53](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/53) | Sem vínculo/suspenso, leitura e comandos de perfil negados no ponto do efeito; caminhos legítimos preservados e política por operação explícita |
| 4 | [Atribuição — #54](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/54) | Prévia/cópia/impressão mantêm autores/contextos conhecidos e lacunas desconhecidas, sem classificar toda hipótese como familiar |

Esses quatro itens foram registrados com aceites, base fixa e limites. **Não foram implementados por esta entrega.** Mudanças no modelo de contribuições, versões, autoridade administrativa e concessões devem seguir os documentos incorporados e decisões específicas ainda necessárias; a PR documental não dá permissão para reescrever o domínio inteiro.

Cenário transversal de PG-06: relatos de casa/escola distintos podem coexistir com suas fontes/contextos; divergência não é erro; síntese voluntária mantém diferenças e cita versões permitidas; nenhuma frequência, concordância ou papel decide a verdade da experiência. A experiência subjetiva da criança não é acessível automaticamente por interpretação adulta.

## 6. Verificação e limites

- Conferência estática de código/documentos fixados; integridade dos blobs e referências conferidas conforme [registro](auditoria/pg06-2026-11-21/evidencias.json).
- V0.1 preservada, com retificações explicitadas nesta versão; código de produção, schema, migration, RLS, credenciais e dados não foram alterados.
- Testes novos de comportamento, leitor de tela, segurança dinâmica e cenários integrais de retenção: **NÃO EXECUTADOS nesta auditoria**.
- A suíte preexistente, se executada pelo CI da PR, informa regressão naquela revisão; não transforma os achados em corrigidos nem certifica PG-06.
- Revisão humana independente: não realizada nesta etapa. A criança continua origem da manifestação; autoria de registrar/observar/relatar/interpretar não deve ser fundida.

## 7. Parecer

PG-06 permanece não atendido de ponta a ponta em perfil, histórico, compreensão e atribuição das sínteses. As melhorias de acesso e do cofre são reconhecidas dentro de seus recortes, sem extrapolação. O próximo trabalho concreto independente do Supabase é #51, seguido dos demais incrementos acima.

A aprovação desta PR pode incorporar **esta auditoria e seus encaminhamentos**. Não declara aplicação conforme, melhoria de interação comprovada, competência jurídica validada, dados reais habilitados ou fontes INF-ID recuperadas.
