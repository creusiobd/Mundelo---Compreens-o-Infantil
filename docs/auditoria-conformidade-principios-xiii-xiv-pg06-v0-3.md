# MUNDELO — Reavaliação XIII/XIV e PG-06 v0.3

**Data:** 23/11/2026 · **PR:** [#17](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/17) · **Base examinada:** `88a7eb84a3beae187cb880990d2b465ef00f378c`.
**PG-06:** **NÃO ATENDE integralmente**, com correções parciais comprovadas no protótipo. **Dados infantis reais: BLOCKED / NO-GO.**

## 1. Escopo e continuidade

Esta reavaliação documental considera a main após integração das PRs #55–#58 e encerramento das issues #51–#54. Não modifica código, schema, permissões, infraestrutura ou dados. A [v0.1](auditoria-conformidade-principios-xiii-xiv-pg06-v0-1.md), a [v0.2](auditoria-conformidade-principios-xiii-xiv-pg06-v0-2.md) e sua [evidência original](auditoria/pg06-2026-11-21/evidencias.json) são preservadas byte a byte como história; a v0.3 é a referência atual da reavaliação, sem apagar as retificações anteriores.

O [registro estruturado](auditoria/pg06-2026-11-23/evidencias.json) fixa revisão, blobs, intervalos e encaminhamentos. AUD-13 é um novo achado de inspeção, não um princípio INF-ID e não uma reabertura dos recortes concluídos.

Referências normativas: [manifesto XIII/XIV](manifesto-principios-mundelo-v1.md), [PG-06](principles-gate-v1.md), [pluralidade](principio-pluralidade-perspectivas-v0-1.md), [contrato incorporado](contrato-dominio-mundelo-v0-1.md), [TEC-003](especificacoes/tec-003/README.md) e [retenção/destinação](politica-operacional-retencao-destinacao-v0-1.md). Incorporação documental não prova implementação nem validação jurídica. Fontes INF #24–#26 permanecem indisponíveis; contagens históricas 73/219 não foram reconfirmadas ou reconstruídas.

## 2. Correções reconhecidas

| Issue / PR incorporada | Resultado dentro do recorte | Limite que permanece |
| --- | --- | --- |
| #51 / [#55](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/55) | Remove padrões fixos apresentados como achados; contagens autorizadas e limites explícitos | Não cria domínio completo de contribuições ou filtros por perspectiva |
| #52 / [#56](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/56) | Separa proposta e experiência; preserva campos vazios; exige metadados sem inventar pessoas/origem/fatos | Legados incompletos precisam conciliação; novo modelo de indeterminação não foi implantado |
| #53 / [#57](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/57) | Restringe Meu Mundo/configuração; gestão revalidada nos comandos, inclusive callbacks capturados; rascunhos isolados | Política do protótipo não é legitimidade de produção nem cobertura automática de outras telas |
| #54 / [#58](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/58) | Atribuição consistente no detalhe/prévia/cópia/impressão; lacunas explícitas; atributos globais sem fonte omitidos da síntese | Autoria própria da interpretação/alteração e versões persistentes continuam pendentes |

As correções #43–#46 e do cofre previamente incorporadas permanecem reconhecidas nos limites de suas evidências. Não repetir essas falhas como abertas nem extrapolar resultados para todas as superfícies ou para produção.

## 3. Matriz dos achados

| ID | Estado na v0.3 | Encaminhamento |
| --- | --- | --- |
| AUD-01 | Mantido: atributos globais sem origem por item | #60 |
| AUD-02 | Corrigido no recorte #53: gestão/contexto no comando | Não reabrir #53; manter fronteira demonstrativa |
| AUD-03 | Mantido: substituição sem acervo governado de versões | #60 |
| AUD-04 | Mantido no código; política já documentada | #29 pausada; R01–R16 mantêm pré-condições |
| AUD-05 | Corrigido no recorte #51: achados fixos removidos | Perspectivas completas dependem do contrato |
| AUD-06 | Apresentação corrigida; modelo de autoria pendente | #60 |
| AUD-07 | Parcial, com lacunas explícitas e defaults retirados | #60 |
| AUD-08 | Mantido: autorização cliente e ambiente externo não comprovado | Gates técnicos/jurídicos mantidos |
| AUD-09 | Qualificado: linguagem, sem prova isolada de consenso | #61 |
| AUD-10 | Divergência de comentário/erro ainda presente no wrapper | #61 |
| AUD-11 | Corrigido no recorte #52: experiência não preenchida por ausência | Não estender aceite a todo o domínio |
| AUD-12 | Corrigido em Meu Mundo/configuração; cobertura global não alegada | Superfície adicional em AUD-13/#59 |
| AUD-13 | Novo: leitura e atribuições do resumo da Home | #59, prioridade de execução |

### AUD-01 — Perfil global e origem por item

[src/types/index.ts:84–105](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/types/index.ts#L84-L105); [src/validation/schemas.ts:45–64](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/validation/schemas.ts#L45-L64)

Listas de interesses, conforto, sensibilidades, comunicação e conquistas continuam strings centrais; estratégias não possuem autoria e temporalidade próprias por contribuição. Restringir edição e omitir o conjunto do relatório reduz riscos específicos, mas não o transforma em projeção rastreável de perspectivas independentes. #60 deve definir o contrato antes de schema/migration.

### AUD-02 — Gestão no ponto do efeito

[src/context/AppContext.tsx:441–529](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/context/AppContext.tsx#L441-L529); [src/context/AppContext.tsx:602–607](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/context/AppContext.tsx#L602-L607); [src/security/authorization.ts:126–134](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/security/authorization.ts#L126-L134)

A política de leitura/gestão está separada da criação de observações. Treze mutadores revalidam contexto/geração, status, vínculo, papel e estrutura; aplicação de perfil por cofre e limpeza demonstrativa também são guardadas. Os testes incorporados exercitam comandos no AppProvider real sem mock do avaliador. Gestão global restrita a responsável legal no protótipo não declara superioridade de perspectiva nem autoridade universal para alterar contribuições alheias. O recorte foi corrigido; autorização de servidor continua em AUD-08.

### AUD-03 — Edição e versões

[src/context/AppContext.tsx:326–378](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/context/AppContext.tsx#L326-L378); [src/security/authorization.ts:61–83](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/security/authorization.ts#L61-L83); [src/presentation/observationAttribution.ts:27–39](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/presentation/observationAttribution.ts#L27-L39)

A edição substitui o objeto anterior e incrementa revisão. Preserva o registrador original, mas não registra autor da alteração nem mantém acervo governado de versões. A apresentação agora explicita a falta de autoria; isso não constitui implementação do contrato. O helper ainda permite ao responsável legal vinculado editar registros alheios na simulação, sem modelar a autoridade administrativa específica exigida por TEC-003/REQ-11. Não aceitar append-only perpétuo como solução: somente versões legitimamente conserváveis, com destinação/restrição aplicáveis.

### AUD-04 — Exclusão e retenção

[src/context/AppContext.tsx:381–405](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/context/AppContext.tsx#L381-L405); [docs/especificacoes/tec-003/README.md:85–107](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/docs/especificacoes/tec-003/README.md#L85-L107)

Excluir retira o item da memória/seleção, não demonstra destinação de versões, derivados, réplicas ou backups. A política e a especificação existem e não devem ser descritas como ausentes. #29 está pausada pelo responsável; esta auditoria não retoma autenticação, cria infraestrutura ou comprova retenção externa. R01–R16 integrais não passam a executados pelo CI de regressão.

### AUD-05 — Contagens sem conclusões fixas

[src/screens/UnderstandScreen.tsx:17–37](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/screens/UnderstandScreen.tsx#L17-L37); [src/screens/UnderstandScreen.tsx:44–76](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/screens/UnderstandScreen.tsx#L44-L76)

Os três cartões estáticos foram retirados. As contagens usam a coleção autorizada e explicitam universo/arredondamento/limites, sem declarar frequência do comportamento ou correlação. Aceite #51 preservado. Ainda não há representação completa de contribuições/perspectivas para oferecer todos os recortes futuros; essa lacuna pertence ao contrato, não à reabertura do defeito dos cartões.

### AUD-06 — Atribuição da síntese

[src/presentation/observationAttribution.ts:3–5](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/presentation/observationAttribution.ts#L3-L5); [src/presentation/observationAttribution.ts:27–39](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/presentation/observationAttribution.ts#L27-L39); [src/presentation/observationAttribution.ts:42–78](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/presentation/observationAttribution.ts#L42-L78)

A síntese não chama toda nota de familiar, não presume intérprete a partir do registrador ou profissão e omite atributos globais sem fonte individual. Prévia/cópia/impressão usam a mesma lógica de atribuição, com verificação E2E incorporada. A lacuna de autor permanece explícita porque não há campo próprio no modelo; exibi-la corretamente não equivale a já possuí-la. Conteúdos adultos não são automaticamente experiência subjetiva da criança.

### AUD-07 — Pessoas, papéis e fontes

[src/validation/schemas.ts:78–103](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/validation/schemas.ts#L78-L103); [src/validation/migration.ts:1–22](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/validation/migration.ts#L1-L22); [src/presentation/observationAttribution.ts:17–39](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/presentation/observationAttribution.ts#L17-L39)

Registrador e proveniência são exigidos sem fallback Helena/DIRECT; observador identificado continua opcional, papel declarado não identifica pessoa e rótulo de relator não é autenticação. A migração não fabrica contexto, data ou autoria para suprir metadados obrigatórios. O modelo ainda não distingue integralmente autoria de registrar, observar, relatar, interpretar e alterar como contribuições independentes. Não preencher retrospectivamente lacunas pelo texto ou contador.

### AUD-08 — Fronteira demonstrativa

[src/security/authorization.ts:8–17](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/security/authorization.ts#L8-L17); [src/context/AppContext.tsx:134–158](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/context/AppContext.tsx#L134-L158)

Conta, status e vínculos simulados no cliente não comprovam legitimidade real, concessões por finalidade/categoria/histórico, RLS ou retenção de produção. A escolha de Supabase não comprova capacidade externa e a URL do projeto não é acesso autenticado. Manter #27/#29/#35 e os demais gates pertinentes. O estado inteiro da demonstração continua no navegador; uma guarda de apresentação não remove dados da memória do cliente.

### AUD-09 — Vocabulário

[src/context/AppContext.tsx:320–323](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/context/AppContext.tsx#L320-L323)

“Observação canônica registrada” continua como mensagem. Um formato técnico canônico, isoladamente, não prova imposição de narrativa única ou identidade definitiva. Há oportunidade de clarear a linguagem visível sem alterar nomes técnicos, formatos ou dados legados. Encaminhamento de baixa prioridade #61.

### AUD-10 — Mensagem de exclusão

[src/context/AppContext.tsx:394–400](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/context/AppContext.tsx#L394-L400); [src/security/authorization.ts:86–105](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/security/authorization.ts#L86-L105)

O helper inclui responsável legal e autor ativo vinculado, mas o comentário/erro do wrapper fala somente em responsável legal. A localização retificada na v0.2 permanece válida. Alinhar texto e teste à política vigente; não ampliar permissões para fazer a mensagem parecer correta. Isso não demonstra eliminação governada ou autorização de produção.

### AUD-11 — Proposta e relato

[src/App.tsx:123–130](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/App.tsx#L123-L130); [src/components/ObservationModal.tsx:83–118](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/components/ObservationModal.tsx#L83-L118); [src/validation/schemas.ts:45–49](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/validation/schemas.ts#L45-L49); [src/validation/migration.ts:1–22](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/validation/migration.ts#L1-L22)

A atividade chega ao formulário como proposta separada, sem fatos, resultado ou hipótese pré-preenchidos. Campos obrigatórios são informados explicitamente; opcionais ficam vazios. Estratégias vazias não viram calma observada. Os testes de criação/edição/estratégia e validação de cofre foram incorporados, com controle negativo dos validadores/migrador registrado na #52. A correção é reconhecida sem afirmar que toda superfície de linguagem foi auditada — a Home é um exemplo adicional.

### AUD-12 — Meu Mundo/configuração

[src/screens/MyWorldScreen.tsx:22–38](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/screens/MyWorldScreen.tsx#L22-L38); [src/screens/OnboardingScreen.tsx:20–28](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/screens/OnboardingScreen.tsx#L20-L28); [src/screens/ReportScreen.tsx:52–75](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/screens/ReportScreen.tsx#L52-L75)

As superfícies apontadas agora escondem atributos sem leitura/gestão pertinentes, descartam rascunhos na troca e mantêm a guarda do relatório. Os cenários de comandos e UI de #53 foram aprovados. O acesso ao perfil cru pelo contexto não foi eliminado; os limites do cliente estão documentados. Um caminho corrigido não torna outras telas automaticamente cobertas.

### AUD-13 — Home: nova superfície e atribuições não demonstradas

[src/screens/HomeScreen.tsx:144–170](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/screens/HomeScreen.tsx#L144-L170); [src/screens/HomeScreen.tsx:350–367](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/screens/HomeScreen.tsx#L350-L367); [src/context/AppContext.tsx:157–195](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/88a7eb84a3beae187cb880990d2b465ef00f378c/src/context/AppContext.tsx#L157-L195)

A Home ainda apresenta nome/idade, primeiro interesse, primeira forma de comunicação e quantidade de estratégias sem a guarda de leitura do perfil usada em Meu Mundo. “Interesse atual”, “Expressão frequente” e “Exploração livre” como fallback não possuem evidência de atualidade/frequência/relato nesses trechos.

É um achado estático novo, de prioridade alta antes de qualquer uso real. Não foi reproduzido em navegador nesta reavaliação e não constitui alegação de incidente com dados reais. #59 exige reprodução por controles reais, contenção de atributos/contagens sem acesso, revisão das atribuições e inventário das demais superfícies. Identidade de fixtures e limites do protótipo precisam permanecer explicitamente separados de autorização de produção. #53 não é reaberta: seu recorte documentado era Meu Mundo/configuração/comandos.

## 4. Princípios XIII e XIV

XIII avançou na retirada de inferências prontas e na apresentação de divergências, fontes e lacunas. Contudo, o perfil global e a substituição do objeto ao editar ainda impedem rastreabilidade plena por contribuição/versão. A autorização de gestão não pode ser confundida com validade da perspectiva.

XIV permanece **NÃO AVALIADO quanto a efeitos em uso humano**: testes de regressão e heurística não comprovam comunicação mais respeitosa, aprendizagem percebida, redução de fricção ou melhoria de interação. Não houve pesquisa de tarefa, validação clínica ou escuta direta nova nesta auditoria. Avanço técnico é necessário, sem ser prova de impacto.

## 5. Encaminhamentos concretos

| Ordem | Tarefa | Entrega e dependências |
| --- | --- | --- |
| 1 | [#59 — Home](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/59) | Reprodução/contenção de atributos e atribuições; executável com dados sintéticos sem Supabase |
| 2 | [#60 — Contrato de contribuições/autoria/versões](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/60) | Primeiro contrato documental e cenários revisáveis; sem reconstruir fontes INF ou antecipar schema |
| 3 | [#61 — Mensagens e terminologia](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/61) | Clareza de registro/exclusão sem alterar permissões |

Os três itens foram criados no backlog do repositório, com responsável e aceites; campos do GitHub Project **não foram sincronizados**. #27 requer competência jurídica; #29 continua pausada; #24–#26 aguardam fontes; #35 conserva decisão de prontidão. Não duplicar essas tarefas nem marcar gates como concluídos a partir de documentos.

## 6. Evidência e limites da reavaliação

A [CI da main integrada 45106790083](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/actions/runs/45106790083) foi conferida: **150 domínio/segurança, 87 E2E e 17 na etapa dedicada a11y (subconjunto), PASS** no commit examinado. As execuções das PRs são históricas; a contagem não é soma de testes independentes nem nova certificação. Os recortes e aceites estão em [#51](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/51), [#52](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/52), [#53](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/53), [#54](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/54) e docs/qa/fix-51 a fix-54.

- Esta etapa executa inspeção/documentação, integridade de blobs, intervalos e links; não implementa as novas tarefas.
- Novos testes funcionais desta auditoria, reprodução dinâmica de AUD-13, teste humano assistivo e revisão humana independente: **NÃO EXECUTADOS nesta etapa**.
- A eventual CI da atualização documental informa regressão da revisão publicada; não corrige AUD-13 nem representa testes integrais de retenção/impacto.
- Histórico v0.1/v0.2 preservado com seus limites; sem recontagem INF, schema novo ou credenciais.
- Não há percentagem global de maturidade: contagem de testes/achados não equivale a cobertura do domínio.

## 7. Parecer e próximo passo

As issues #51–#54 foram concluídas corretamente nos recortes demonstrativos documentados. **PG-06 integral permanece não atendido** por modelo de contribuições/versões, fronteira de produção e superfícies não cobertas. Dados infantis reais continuam bloqueados; trabalho sintético isolado pode seguir no escopo já autorizado.

O próximo incremento recomendado é **#59 — Home**. A aprovação desta PR incorpora a reavaliação e seus encaminhamentos; não aprova a aplicação para produção, não valida enquadramentos jurídicos e não comprova retenção/backups externos.
