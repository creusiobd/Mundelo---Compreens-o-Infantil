# MUNDELO | Auditoria de conformidade dos princípios XIII, XIV e PG-06 v0.1

- **Data:** 17/11/2026
- **Base examinada:** branch `main`, código consultado no GitHub durante revisão estática
- **Natureza:** auditoria estática de domínio, estado, autorização demonstrativa, UI e relatórios
- **Status geral:** **PG-06 NÃO ATENDE integralmente no modelo atual**
- **Limitação:** nenhum teste foi executado nesta auditoria; não houve execução local, teste manual da aplicação, análise dinâmica ou revisão independente. As conclusões abaixo se limitam ao código-fonte inspecionado.
- **Dados reais:** nenhum dado infantil real foi utilizado ou autorizado. A autorização atual permanece demonstrativa no cliente.

## 1. Objetivo

Verificar se o código atual preserva perspectivas distintas sobre a criança e se a compreensão construída a partir delas pode apoiar interações melhores sem criar uma visão única, descontextualizada ou totalizante.

A auditoria aplica:
- Princípio XIII: pluralidade das perspectivas.
- Princípio XIV: compreender para ampliar possibilidades de interação.
- PG-06: integridade, autoria, contexto e coexistência das perspectivas.

## 2. Resumo executivo

O projeto já contém bons mecanismos de integridade: `childId` obrigatório em observações, identificação de quem registrou, proveniência direta/relatada, separação de campos factuais e hipótese, revisão numérica, filtros por criança e um resolvedor de conflitos que rejeita determinados casos de sobrescrita silenciosa.

Entretanto, esses mecanismos ainda não constituem um modelo de perspectivas. A estrutura atual privilegia um acervo de observações ligado à criança e um perfil central com atributos agregados. Em pontos importantes, autoria e contexto não acompanham os dados até a interface e o relatório. O painel Compreender também apresenta afirmações estáticas como padrões identificados na amostra.

**Conclusão:** a pluralidade está parcialmente representada no registro individual, mas não está preservada de ponta a ponta no perfil, nas alterações, no painel de compreensão e na síntese compartilhável.

## 3. Achados

### AUD-01 — Perfil infantil contém atributos globais sem proveniência
- **Severidade:** ALTA
- **Status:** NÃO ATENDE
- **Evidência:** `src/types/index.ts`, interface `ChildProfile`; `src/validation/schemas.ts`, `ChildProfileSchema`; `src/screens/MyWorldScreen.tsx`; `src/context/AppContext.tsx`.
- **Observação:** interesses, fontes de conforto, sensibilidades, modos de comunicação, conquistas e estratégias são armazenados como listas do perfil central. Esses itens não guardam autor, relação, contexto, data, fonte, finalidade ou histórico próprio.
- **Risco:** percepções de contextos diferentes podem ser reunidas como características universais da criança. Uma informação observada em casa pode parecer válida em todos os ambientes; uma mudança contextual pode apagar uma percepção anterior.
- **Direção corretiva:** não tratar esses campos como verdade global. Modelar contribuições contextualizadas e manter qualquer visão consolidada como derivada, identificada e rastreável. Se houver curadoria familiar de um resumo, registrar quem o selecionou, quando e com base em quais contribuições.

### AUD-02 — Operações de perfil não aplicam autorização de forma consistente
- **Severidade:** ALTA
- **Status:** NÃO ATENDE
- **Evidência:** `src/security/authorization.ts`, `canCreateObservation`; `src/context/AppContext.tsx`, métodos `addInterest`, `removeInterest`, `addComfortAnchor`, `removeComfortAnchor`, `addSensitivity`, `removeSensitivity`, `addCommunicationMode`, `removeCommunicationMode`; `src/screens/MyWorldScreen.tsx`.
- **Observação:** `canCreateObservation` permite criação a qualquer cuidador ativo vinculado, independentemente de papel. A UI usa esse indicador para habilitar operações de Meu Mundo. Os métodos de adicionar/remover os itens acima não fazem uma checagem de papel ou autorização própria no contexto. `updateProfile`, por outro lado, exige `LEGAL_GUARDIAN`.
- **Risco:** o mesmo perfil central pode ser alterado por papéis diferentes sem política explícita e consistente; além disso, as alterações não carregam autoria ou contexto.
- **Direção corretiva:** definir operações e permissões separadas por recurso. A camada de domínio deve validar cada comando, sem depender de botão desabilitado. A autorização de acesso nunca deve determinar a validade de uma perspectiva.

### AUD-03 — Edição altera o registro sem histórico de versões e sem autoria da alteração
- **Severidade:** ALTA
- **Status:** NÃO ATENDE
- **Evidência:** `src/context/AppContext.tsx`, `updateObservation`; `src/types/index.ts`, interface `Observation`; `src/security/conflictResolver.ts`.
- **Observação:** `updateObservation` substitui o objeto anterior no array, incrementa `revision` e atualiza `updatedAt`. Não mantém snapshots ou eventos de versão no modelo. `recordedByCaregiverId` permanece imutável, mas não há `updatedBy` para identificar quem alterou o conteúdo. Como responsáveis legais podem editar registros de outros autores segundo a autorização demonstrativa, a autoria original pode parecer autoria do conteúdo atual.
- **Risco:** perda de proveniência histórica e atribuição enganosa após edição.
- **Direção corretiva:** separar autoria original, autoria da alteração e histórico versionado/append-only. Definir política de correção, contestação e eliminação compatível com privacidade. Um contador de revisão não substitui histórico.

### AUD-04 — Exclusão remove o registro do estado sem ciclo de vida auditável
- **Severidade:** MÉDIA/ALTA
- **Status:** PARCIAL
- **Evidência:** `src/context/AppContext.tsx`, `deleteObservation`.
- **Observação:** a função filtra o registro para fora do array em memória. Isso é explicitamente uma demonstração de sessão, não persistência de produção. Não há estado de exclusão, evento de auditoria ou política documentada no domínio.
- **Risco:** uma futura implementação pode confundir correção, retirada de compartilhamento, arquivamento e eliminação definitiva.
- **Direção corretiva:** especificar separadamente correção, retirada de acesso, retenção e eliminação. Não preservar dados indefinidamente sob o argumento de histórico; direitos de privacidade e finalidade legítima devem orientar retenção.

### AUD-05 — Painel Compreender mistura agregação transversal e afirmações estáticas
- **Severidade:** ALTA
- **Status:** NÃO ATENDE
- **Evidência:** `src/screens/UnderstandScreen.tsx`.
- **Observação:** as distribuições de ambiente e tipo de evento agregam todas as observações autorizadas da criança ativa, sem oferecer recorte por autor, papel, relação ou contexto de experiência. Além disso, os três cartões sob “Padrões Descritivos Identificados na Amostra” contêm textos fixos no componente, incluindo afirmações como correlação com transições calmas e aumento de atenção compartilhada. Essas afirmações não são calculadas a partir dos registros exibidos.
- **Risco:** o produto pode atribuir à criança padrões que não foram extraídos dos dados e transformar experiências diferentes em uma narrativa geral. Linguagem de correlação/efeito pode sugerir evidência inexistente.
- **Direção corretiva:** retirar afirmações estáticas ou identificá-las inequivocamente como exemplos fictícios, sem apresentá-las como descobertas. Oferecer leitura por perspectiva/contexto; qualquer síntese agregada deve mostrar universo, fontes, critérios, limitações e incerteza. Não inferir causalidade ou eficácia a partir de contagem simples.

### AUD-06 — Relatório transforma atributos globais em síntese e classifica toda hipótese como familiar
- **Severidade:** ALTA
- **Status:** NÃO ATENDE
- **Evidência:** `src/screens/ReportScreen.tsx`.
- **Observação:** o relatório inclui listas de `activeProfile` como repertório da criança, sem proveniência por item. Para cada observação, identifica quem registrou e a proveniência, mas imprime `notes` como “Hipótese Familiar” independentemente do autor real. A seleção de observações não é, por si, uma síntese com método explícito; a finalidade escolhida não constitui autorização de compartilhamento.
- **Risco:** uma contribuição de educador ou profissional pode ser apresentada como hipótese familiar; atributos globais podem parecer fatos acordados; a composição pode apagar a particularidade das relações.
- **Direção corretiva:** relatório deve ser uma coleção curada de contribuições com autoria, papel, relação, contexto, tipo e data. Não incluir atributos globais sem fonte. Diferenciar observação, interpretação, avaliação e orientação. A exportação/compartilhamento exige autorização própria, finalidade, destinatário e escopo.

### AUD-07 — Proveniência de relato de terceiros é texto livre, não identidade verificável
- **Severidade:** MÉDIA
- **Status:** PARCIAL
- **Evidência:** `src/types/index.ts`, `Observation`; `src/components/ObservationModal.tsx`; `src/context/AppContext.tsx`.
- **Observação:** `recordedByCaregiverId` identifica quem inseriu o registro; `reportedByLabel` é um rótulo textual não autenticado. O sistema distingue relato de terceiro, mas não representa necessariamente a pessoa que originou a observação como participante/autor identificável.
- **Risco:** confundir quem registrou com quem observou ou relatou; atribuição imprecisa em relatórios.
- **Direção corretiva:** separar autor do registro, fonte original, pessoa que presenciou, papel e relação no contexto. Não exigir conta de toda pessoa mencionada, mas declarar claramente quando a fonte é anônima ou não verificada.

### AUD-08 — Autorização atual é demonstrativa no cliente
- **Severidade:** BLOQUEADOR PARA DADOS REAIS
- **Status:** NÃO É AUTORIZAÇÃO DE PRODUÇÃO
- **Evidência:** `src/security/authorization.ts`, aviso arquitetural explícito; `src/context/AppContext.tsx`.
- **Observação:** as regras são executadas no cliente e dependem de estado local/simulado. Não substituem autenticação, autorização server-side ou RLS.
- **Risco:** qualquer interpretação dessas funções como controle suficiente para dados reais produziria falsa garantia.
- **Direção corretiva:** manter dados infantis reais e colaboração profissional bloqueados até Supabase Auth, schema, RLS, grants, testes cross-account, ciclo de revogação e revisão de segurança estarem implementados e verificados.

### AUD-09 — Vocabulário “canônico” conflita com a pluralidade
- **Severidade:** MÉDIA
- **Status:** NÃO ALINHADO
- **Evidência:** comentário da interface `Observation` em `src/types/index.ts` e mensagem de sucesso em `src/context/AppContext.tsx`: “Observação canônica”.
- **Risco:** reforçar a ideia de registro oficial/definitivo, mesmo que o código não faça consenso automático.
- **Direção corretiva:** substituir por “contribuição registrada” ou “observação registrada”, sem sugerir que o registro é a versão canônica da criança.

### AUD-10 — Política de exclusão tem comentário divergente da implementação
- **Severidade:** MÉDIA
- **Status:** INCONSISTÊNCIA
- **Evidência:** `src/security/authorization.ts`, comentário de `canDeleteObservation` diz que apenas responsáveis legais excluem; implementação também permite ao autor original excluir.
- **Risco:** documentação e comportamento divergem, dificultando revisão de permissões.
- **Direção corretiva:** decidir a política e alinhar comentário, testes e implementação. Não ampliar exclusão por conveniência.

## 4. Matriz de conformidade

| Área | Estado | Observação |
| --- | --- | --- |
| Observações individuais: autoria e origem | PARCIAL | Quem registra e proveniência são representados |
| Contexto e relação | PARCIAL | Ambiente e papel existem; vínculo/experiência ainda incompletos |
| Perfil/Meu Mundo | NÃO ATENDE | Atributos globais sem proveniência |
| Coexistência de perspectivas | PARCIAL | Registros podem coexistir, mas o modelo não tipa relações/contribuições suficientemente |
| Edição e histórico | NÃO ATENDE | Revisão numérica sem versões nem updatedBy |
| Painel Compreender | NÃO ATENDE | Agregação sem recorte e textos estáticos como padrões |
| Relatórios | NÃO ATENDE | Atributos sem fonte e rotulagem genérica de hipótese familiar |
| Autorização de produção | NÃO IMPLEMENTADA | Controles client-side demonstrativos |
| Princípio XIV: melhorar interação | NÃO AVALIADO | Não há evidência de pesquisa/uso que comprove melhoria de interação |

## 5. Prioridade recomendada

### P0 — Bloqueios de produto e segurança
1. Não habilitar dados infantis reais, contas de profissionais ou compartilhamento remoto com as regras client-side atuais.
2. Não apresentar os cartões estáticos do painel como padrões identificados na amostra.
3. Não usar relatórios atuais como documento clínico, avaliação ou síntese validada.

### P1 — Antes de implementar colaboração e persistência real
1. Definir modelo de domínio de contribuições independentes, com tipo, autoria, relação, contexto, fonte, temporalidade e proveniência.
2. Separar atributos observados/relatados de resumos curados e visões derivadas.
3. Definir histórico de versões, correção, contestação, exclusão e trilha de auditoria.
4. Rever a matriz de permissões por recurso e operação, incluindo edição de atributos do Meu Mundo.
5. Refazer o painel Compreender para permitir leitura contextual e por perspectiva, sem inferências indevidas.
6. Refazer o relatório para preservar fontes e distinguir observação, interpretação, avaliação e orientação.

### P2 — Depois do contrato de domínio
1. Criar testes de domínio para coexistência de relatos divergentes.
2. Criar testes de autoria original, updatedBy, versionamento e correção.
3. Criar testes de autorização por papel, vínculo, finalidade, categoria, operação e revogação.
4. Criar testes de UI para leitura por perspectiva e apresentação de divergências.
5. Criar testes para provar que sínteses são derivadas, transparentes e rastreáveis.

## 6. Contrato de domínio a desenhar antes de migrations

Não implementar ainda, mas avaliar conceitualmente a separação entre:

- **Contribuição:** unidade independente criada por uma pessoa em determinada relação e contexto.
- **Observação:** descrição do que a pessoa percebeu, distinguindo acontecimento, fonte e expressão observável.
- **Interpretação:** sentido atribuído pelo autor, ligado à contribuição de origem e explicitamente revisável.
- **Avaliação profissional:** contribuição de natureza profissional, escopo e autoria identificados, sem se tornar definição total da criança.
- **Orientação:** recomendação atribuída ao profissional, com finalidade e contexto.
- **Experiência de interação:** contexto, forma de comunicação/apoio oferecida e resposta percebida, sem prometer causalidade.
- **Síntese:** composição derivada, com fontes, autor/editor, critérios, omissões e limitações visíveis.

Os nomes são conceitos candidatos, não schema aprovado. Não criar tabelas ou migrations com base apenas nesta lista.

## 7. Cenário mínimo de aceitação PG-06

Duas pessoas relatam experiências diferentes da mesma criança em casa e na escola. O sistema deve:
- preservar ambas como contribuições distintas;
- mostrar autoria, relação, contexto e origem;
- não declarar uma versão correta ou mais verdadeira;
- permitir diálogo/resposta sem exigir concordância;
- permitir uma síntese voluntária que cite ambas as fontes e mantenha as diferenças;
- respeitar permissões independentes de leitura, edição, exportação e revogação;
- não converter frequência ou concordância em diagnóstico, causalidade ou hierarquia de credibilidade.

## 8. Evidência e limites da auditoria

Arquivos inspecionados diretamente no `main`:
- `src/types/index.ts`
- `src/context/AppContext.tsx`
- `src/security/authorization.ts`
- `src/security/conflictResolver.ts`
- `src/validation/schemas.ts`
- `src/components/ObservationModal.tsx`
- `src/components/ObservationDetailModal.tsx`
- `src/screens/MyWorldScreen.tsx`
- `src/screens/UnderstandScreen.tsx`
- `src/screens/ReportScreen.tsx`
- `src/screens/OnboardingScreen.tsx`
- `src/App.tsx`
- `docs/data-contracts.md`

Não foram executados `npm test`, `npm run lint`, `npm run build`, E2E ou testes manuais nesta auditoria. A existência de scripts ou relatórios anteriores não equivale a execução nesta revisão.

## 9. Decisão

**PG-06: NÃO ATENDE no estado atual para perfil global, painel Compreender, relatório e histórico de alterações. PARCIAL para autoria/proveniência em observações individuais.**

A decisão não invalida a base técnica existente nem autoriza uma reescrita imediata. Recomenda-se primeiro aprovar o contrato de domínio e os critérios de aceitação; depois implementar em incrementos pequenos, com testes que provem coexistência e proveniência.

**Nenhuma migration, alteração de schema, regra RLS ou funcionalidade foi implementada por esta auditoria.**
