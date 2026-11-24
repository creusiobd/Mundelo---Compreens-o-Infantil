# Contrato conceitual — natureza, atribuição e coexistência

[Estado e bases](README.md) · [Operações/versões](operacoes-versoes.md) · [Casos](aceitacao-decisoes.md)

## 1. Natureza do que se registra

| Conceito | Representação proposta | Inferência vedada |
|---|---|---|
| Manifestação | Expressão/participação da pessoa, verbal, gestual ou outra, com modo/contexto informado e fonte que a tornou registrável | Um gesto descrito pelo adulto não é uma afirmação literal ou consentimento da criança; ausência de expressão não é concordância |
| Observação | Descrição atribuída do que alguém declara ter observado, com evento/contexto e limites | Texto registrado como fato observável não se transforma em fato absoluto, diagnóstico ou experiência interna comprovada |
| Relato | Comunicação de informação por uma fonte, distinguindo quem comunica, quem registra e quem teria observado | Nome textual, citação ou papel declarado não identifica conta autenticada nem observador verificado |
| Percepção/interpretação | Leitura, hipótese ou sentido atribuído por uma pessoa a algo, com contexto e fontes | A interpretação do adulto não é automaticamente da criança; primeira pessoa e profissão não identificam autor ou garantem verdade |
| Avaliação/orientação profissional compartilhada | Contribuição atribuída, dentro da competência/finalidade pertinente e deliberadamente compartilhada | Credencial/vínculo não dá precedência narrativa universal nem importa registros clínicos reservados |
| Contribuição | Unidade autoral/contextual identificável e relacionável, contendo a natureza do conteúdo e atribuições disponíveis | Registro único por criança, lista global ou evento comum não funde todas as perspectivas |
| Relação | Complemento, divergência, resposta, contestação, referência ou derivação explicitamente contextualizados | Relacionar não significa copiar autoria, conceder acesso, verificar evento ou obrigar consenso |
| Perfil curado/síntese | Representação selecionada/derivada para finalidade e destinatário, com limites e fontes/versões quando disponíveis e legitimamente acessíveis | Seleção não substitui fontes nem define identidade total da criança |

Uma unidade pode reunir descrição e reflexão se cada natureza/autoria for identificável ou sua lacuna for explicitada. A granularidade futura é T03: não se exige dividir retroativamente cada campo legado nem inventar um autor para viabilizar a divisão. Se outra pessoa oferece sua interpretação, isso constitui contribuição própria relacionada, sem substituição silenciosa da anterior.

## 2. Quem fez o quê

| Papel/dimensão | O que identifica | Prova e limite |
|---|---|---|
| Registrador | Agente que efetivamente inseriu o registro, quando conhecido | Conta atual pode provar o agente da nova operação, não o autor das palavras/experiência de terceiros nem o editor de versões passadas |
| Autor da contribuição/expressão | Pessoa a quem a unidade ou manifestação é atribuída, conforme natureza/fonte | Atribuição pode ser declarada, verificada em escopo definido, lacunar ou contestada; não se fabrica identidade para fechar o registro |
| Observador | Pessoa informada como tendo presenciado o acontecimento | Papel “mãe/profissional” não identifica pessoa; presenciar não prova interpretação correta |
| Relator/fonte | Pessoa/documento/canal informado de onde veio o conteúdo | Transcrição por A de relato de B mantém a cadeia conhecida e seus elos ausentes; B não vira conta autenticada por ser citado |
| Autor da interpretação | Pessoa responsável pela leitura/hipótese específica | Pode coincidir com observador/registrador se isso estiver informado; não se deduz de vínculo, credencial, estilo do texto ou pronome |
| Agente/autor da alteração | Pessoa/agente que executa a correção com autoridade para o ato | Distinguir agente que pede, quem decide e quem executa; não transferir autoria original nem preencher editores passados por revision/updatedAt |
| Representante | Pessoa cuja legitimidade para determinado ato foi demonstrada | Manifestação da criança, decisão representativa e concessão operacional permanecem distintas; alcance jurídico em J01 |
| Curador/método | Quem seleciona/organiza e como um derivado foi produzido | Curador ou sistema não se tornam autores humanos das fontes; registrar método/versão/limites sem atribuir subjetividade à automação |

Vínculo/papel no acontecimento, vínculo no registro e autoridade atual para uma operação podem diferir. Uma alteração do cadastro de pessoa ou profissão não reescreve silenciosamente a condição histórica. Quando essa condição não foi registrada, permanece lacuna; não se preenche pelo papel atual.

Uma manifestação da criança pode chegar ao registro por mediação acessível. O registro precisa distinguir expressão informada, descrição do adulto e significado interpretado. A ausência de fala, formato textual, identificação completa ou explicação não é um impedimento universal ao registro legítimo, embora uma operação posterior possa depender de informação/verificação que falta.

## 3. Origem, lacuna e verificação por dimensão

| Estado descritivo | Uso | Não fazer |
|---|---|---|
| Desconhecido | O conhecimento pertinente não está disponível | Inventar pessoa, acontecimento ou justificativa |
| Não informado | A fonte/registro não forneceu aquela dimensão | Transformar ausência em negativa factual |
| Não observado | Há informação de que aquela dimensão não foi observada pela fonte pertinente | Inferir “não ocorreu” ou marcar assim só porque o campo veio vazio |
| Não aplicável | A dimensão não se aplica naquele contexto, com justificativa pertinente | Usar como atalho para omitir prova necessária |
| Não registrado separadamente | O formato legado não distingue uma atribuição, como intérprete/editor | Preencher com o registrador ou criar histórico fictício |
| Não apresentado no escopo | A política não permite disponibilizar aquela informação | Concluir que a fonte não existe ou revelar seu teor/existência pela mensagem |

Verificação é especificada por alegação e escopo: o que foi declarado, por qual fonte, quem/quando conferiu, método/limite e estado. Identidade verificada não prova a veracidade de todo conteúdo, legitimidade de representação, credencial ou autoridade de alteração. Certeza/confiança declaradas não são probabilidades clínicas. Uma atribuição contestada pode coexistir com outros metadados conhecidos; não vira automaticamente falsa ou verificada.

Esses estados são vocabulário conceitual, não enums aprovados. Fonte, prova e identidade também podem ser dados pessoais; sua visibilidade e destinação são próprias. Não inserir a prova integral em logs ou compartilhá-la por ser “metadado”.

## 4. Unidade independente e contexto

Cada contribuição identifica conceitualmente: criança/contexto de referência; natureza do conteúdo; pessoa(s) e papel(is) efetivamente atribuídos com lacunas; relação contextual; finalidade; fonte e estado de verificação; temporalidade; identidade/versão; relações conhecidas; condições de acesso/uso/destinação. Não são campos de banco aprovados nem uma exigência de preenchimento universal de fatos desconhecidos.

Uma pessoa pode contribuir várias vezes em diferentes relações/contextos/momentos. Pessoas diferentes podem oferecer unidades sobre o mesmo evento sem compartilhar autoria. A associação a um mesmo evento deve ter sua fonte/limites; proximidade de horário ou palavras semelhantes não prova que foi o mesmo acontecimento. Coautoria só é representada quando informada e verificável no escopo; não é padrão por família/equipe. Relação coletiva não transforma instituição em autor presumido de toda contribuição.

O registro deve distinguir acontecimento, relato quando informado, registro, alteração, ingestão/migração e revisão. Preservar intervalo, fuso e precisão conhecidos; campos faltantes não recebem o horário atual como data histórica. Reavaliação temporal não transforma o primeiro item de uma lista em preferência atual/frequente. Se uma alegação de frequência for futuramente utilizada, depende de fontes, período, método e autorização pertinentes — decisão T03, sem prometer medição já disponível.

## 5. Pluralidade sem uniformização

Diferenças podem ser complementares, contextuais, temporais, interpretativas ou divergências sobre o próprio acontecimento. Representar essa natureza quando informada; se não for possível concluir, indicar limite. Coexistir não significa validar todas as afirmações como equivalentes, nem impedir exame da evidência; significa não resolver a diferença por profissão, maioria, vínculo, antiguidade ou sobrescrita silenciosa.

Exemplo exclusivamente sintético: A descreve aceitação de um objeto em casa; B relata recusa em outro ambiente. O perfil não deve reduzir ambos a “sempre gosta” ou escolher o relato do profissional como definitivo. Se A e B divergem sobre o mesmo encontro, suas unidades e referências permanecem distintas no escopo autorizado; uma decisão posterior de correção/restrição precisa de procedimento próprio.

Ninguém ganha acesso a uma perspectiva só porque outra pessoa a relacionou. Um leitor pode não conhecer fontes restritas; quantidade, identidade e razão específica da ausência também são protegidas quando revelarem indevidamente conteúdo. Se contexto suficiente e privacidade não coexistirem na representação, ela não é entregue como se estivesse completa.

## 6. Perfil curado e síntese

Distinguir dados administrativos de identidade/cadastro e afirmações contextuais de interesses, conforto, sensibilidades, comunicação ou estratégias. Mesmo dados administrativos precisam de fonte, legitimidade e correção pertinentes; não são uma definição total da criança. Afirmações contextuais curadas apontam unidades/versões e escopo de aplicação quando houver suporte legítimo, sem apagar fontes divergentes.

Curadoria registra responsável/método, finalidade, período, seleção, limites e versão do resultado. Não transfere autoria das fontes ao curador, guardião ou algoritmo. Ausência de contribuição de uma pessoa não é sua concordância. Síntese automatizada, se futuramente proposta, exige revisão de método/risco e operação de uso autorizada própria; este contrato não autoriza um serviço de IA.

Os atributos globais legados continuam sendo globais com fonte/atribuição não separadas. A apresentação de #54 e a delimitação de #59 permanecem até que um modelo revisado e implementado forneça informação melhor. Não convertê-los retroativamente em contribuições assinadas por quem criou a conta.

## 7. Requisitos de consolidação

### PC-01 — Natureza do conteúdo

Manifestação, descrição observacional, relato e interpretação são distinguíveis; descrição registrada não vira fato independente do relato e ausência de expressão não vira consentimento.

Base TEC-003: REQ-10. Cenários futuros: CP-01, CP-02, CP-03.

### PC-02 — Autorias e papéis distintos

Separar registrador, autor da expressão/contribuição, observador, relator, intérprete e agente da alteração. Mesmo participante pode exercer mais de um papel somente com atribuição informada e fonte pertinente.

Base TEC-003: REQ-01, REQ-10, REQ-11. Cenários futuros: CP-01, CP-04, CP-14.

### PC-03 — Lacunas e verificação por dimensão

Distinguir desconhecido, não informado, não observado e não aplicável; identificar declaração/fonte/verificação e sua extensão sem elevar identidade verificada a veracidade do conteúdo.

Base TEC-003: REQ-01, REQ-10. Cenários futuros: CP-02, CP-03, CP-14, CP-15.

### PC-04 — Independência de perspectivas

Cada contribuição mantém pessoa/relação/contexto/finalidade/tipo próprios; uma pessoa pode ter várias contribuições, e evento compartilhado não funde autores. Identidade do evento e relação entre relatos são alegações contextualizadas.

Base TEC-003: REQ-03, REQ-05. Cenários futuros: CP-05, CP-06, CP-22.

### PC-05 — Temporalidade sem inferência

Distinguir acontecimento, registro, alteração e revisão; preservar intervalo/fuso/precisão/lacuna quando informados. Primeiro item, recência do cadastro e repetição de texto não comprovam atualidade ou frequência.

Base TEC-003: REQ-04, REQ-10. Cenários futuros: CP-07, CP-15, CP-22.

### PC-06 — Operações de correção distintas

Correção própria, complemento, pedido de correção, contestação e medida administrativa possuem atores/efeitos próprios. Corrigir não concede acesso atual nem preservação indefinida.

Base TEC-003: REQ-03, REQ-11. Cenários futuros: CP-08, CP-09, CP-10, CP-16.

### PC-07 — Manifestação e representação

Expressão da criança e interpretação/decisão representativa permanecem distinguíveis; registrador adulto não se torna autor da experiência da criança. Legitimidade de representar depende do ato, sem regra universal de consentimento entre responsáveis.

Base TEC-003: REQ-01, REQ-11, REQ-14. Cenários futuros: CP-01, CP-11, CP-24.

### PC-08 — Competência, vínculo e concessão

Profissão, guarda, parentesco e vínculo não conferem verdade, acesso universal ou poder de sobrescrever/compartilhar; identidade, competência pertinente, autoridade para o ato e concessão são avaliações separadas.

Base TEC-003: REQ-01, REQ-03, REQ-11, REQ-13. Cenários futuros: CP-09, CP-10, CP-11, CP-17, CP-18.

### PC-09 — Versões e concorrência rastreáveis

Correção identifica versão alvo, agente/escopo/temporalidade e relação entre versões legitimamente conserváveis; conflitos não se resolvem silenciosamente pela última gravação. Contador e updatedAt não substituem história nem provam autor.

Base TEC-003: REQ-04, REQ-05, REQ-09, REQ-10. Cenários futuros: CP-08, CP-12, CP-13, CP-14.

### PC-10 — Coexistência e divergência

Representar complemento/divergência/contestação sem votação, precedência profissional ou perfil de identidade unificado. Evidência pode ser examinada sem invalidar automaticamente a interpretação da pessoa sobre sua experiência.

Base TEC-003: REQ-06, REQ-11. Cenários futuros: CP-05, CP-06, CP-09, CP-22.

### PC-11 — Derivação e reavaliação

Derivado aponta versões efetivamente utilizadas e método/finalidade; fonte ou autorização alterada reabre validade, apresentação, utilização e retenção separadamente. Conter uso indevido antes de depender do recálculo assíncrono.

Base TEC-003: REQ-03, REQ-05, REQ-06, REQ-09. Cenários futuros: CP-16, CP-17, CP-19, CP-20, CP-23.

### PC-12 — Perfil curado não substitui fontes

Separar dados administrativos de identidade e afirmações contextuais curadas. Curador/método/seleção não assumem autoria das fontes; perfil e síntese não apagam perspectivas nem mostram consenso, preferência atual ou frequência sem suporte autorizado.

Base TEC-003: REQ-03, REQ-05, REQ-06, REQ-10, REQ-12. Cenários futuros: CP-06, CP-07, CP-17, CP-22.

### PC-13 — Ciclo de vida proporcional

Conteúdo, versões/diffs, metadados, provas e derivados seguem políticas próprias C01–C10. Não impor append-only perpétuo, hash como anonimato ou reconstrução de conteúdo legitimamente destinado para manter rastreabilidade.

Base TEC-003: REQ-07, REQ-08, REQ-14. Cenários futuros: CP-16, CP-19, CP-20, CP-21, CP-23.

### PC-14 — Legados sem autoria retroativa

Compatibilidade preserva valores efetivamente existentes e sua origem; não atribui intérprete/editor por registrador, papel, primeira pessoa, revision, updatedAt ou senha de cofre. Reconciliar preserva lacunas e medidas de acesso/destinação.

Base TEC-003: REQ-10, REQ-13. Cenários futuros: CP-04, CP-14, CP-15, CP-18, CP-20.

### PC-15 — Acesso por operação e por versão

Consultar conteúdo/metadados, usar, preparar, compartilhar, exportar, corrigir e destinar exigem avaliação atual independente; histórico/linhagem/índices/caches não contornam o escopo. Autoria original não garante acesso atual.

Base TEC-003: REQ-01, REQ-03, REQ-04, REQ-12, REQ-13. Cenários futuros: CP-08, CP-11, CP-16, CP-17, CP-18, CP-20.

### PC-16 — Decisão, prova e gates

Protocolo, decisão, efeito e conclusão são distintos; evidência minimizada e revisão aplicável não são substituídas por CI. Decisões físicas/jurídicas continuam abertas, casos propostos não executados e dados reais bloqueados.

Base TEC-003: REQ-02, REQ-08, REQ-14, REQ-15. Cenários futuros: CP-10, CP-19, CP-21, CP-23, CP-24.

