# MUNDELO | Contrato de Domínio v0.1 — revisão localizada de preservação e operações
## Núcleo compartilhado de compreensão da criança

- **Status:** proposta conceitual para revisão e aprovação; não é especificação de implementação aprovada.
- **Versão:** 0.1-r1 (proposta de conciliação; não substitui aprovação pendente)
- **Base documental:** arquivo v0.1 incorporado pela PR #18; esta revisão não equivale à consolidação integral dos princípios INF-ID ou à versão 0.2.
- **Escopo:** responsáveis legais, vínculos profissionais de saúde, contribuições, compartilhamento, autorização, histórico e pluralidade de perspectivas.
- **Dependências normativas:** Principles Gate v1.0 (PG-01 a PG-06) e Princípio de Pluralidade das Perspectivas v0.1.
- **Persistência e infraestrutura:** nenhuma decisão de schema, migration, RLS, API ou hospedagem é aprovada por este documento.

> O MUNDELO compartilha condições para compreender melhor a criança. Não compartilha indiscriminadamente todos os registros, não uniformiza perspectivas e não transfere autoridade legal ou profissional.

---

## 1. Propósito e limite do domínio

O domínio deve permitir que pessoas legitimamente responsáveis pela criança e profissionais de saúde formalmente vinculados, quando autorizados, contribuam para uma compreensão contextual, plural e continuamente revisável da experiência da criança.

A finalidade é melhorar a qualidade das interações: comunicação, aprendizagem, ensino, expressão, regulação, exploração, vínculos e participação no mundo. O sistema deve ajudar adultos a aprender com a criança e ajustar a própria comunicação, os ambientes e as oportunidades oferecidas.

O MUNDELO não:
- define uma identidade total ou definitiva da criança;
- substitui responsáveis legais, profissionais, serviços de saúde ou decisões judiciais;
- emite diagnóstico, laudo, prognóstico ou prescrição clínica;
- transforma frequência, concordância ou hierarquia profissional em verdade;
- presume que todo registro deve ser compartilhado;
- considera que melhorar a interação significa modificar a criança para atender expectativas adultas.

A criança permanece maior do que qualquer registro, síntese, interpretação, avaliação ou vínculo.

## 2. Linguagem e conceitos do domínio

| Conceito | Definição |
|---|---|
| **Criança (Child)** | Pessoa a quem o contexto de compreensão se refere. Não é um objeto pertencente a uma conta ou profissional. |
| **Contexto familiar** | Espaço de gestão e contribuição das pessoas cuja responsabilidade legal ou legitimidade de cuidado foi verificada conforme a política aplicável. |
| **Responsabilidade legal (ChildResponsibility)** | Relação de responsabilidade reconhecida e verificada, com escopo, origem da verificação, vigência e eventuais restrições. Não é inferida apenas por autodeclaração ou parentesco. |
| **Vínculo profissional (ProfessionalRelationship)** | Relação de acompanhamento entre profissional identificado e criança específica, com finalidade, especialidade declarada/verificada, instituição quando aplicável e período. O vínculo não concede acesso por si só. |
| **Concessão de acesso (AccessGrant)** | Autorização explícita, verificável, específica, limitada e revogável para um destinatário acessar operações e categorias determinadas. |
| **Contribuição (Contribution)** | Registro autoral de uma experiência, observação, interpretação, avaliação, orientação, pergunta ou relato. Mantém sua origem e seu contexto. |
| **Experiência de interação (InteractionExperience)** | Descrição contextual de uma interação da criança com pessoas, objetos, atividades ou ambientes, incluindo o que foi percebido e como os adultos responderam. |
| **Relação entre contribuições (ContributionRelation)** | Ligação explícita entre contribuições, como complemento, pergunta, divergência, resposta ou contextualização. Não implica sobrescrita nem consenso. |
| **Síntese derivada** | Visão produzida a partir de contribuições identificáveis. É não canônica, limitada, rastreável e nunca substitui as fontes. |

Os nomes entre parênteses são identificadores conceituais candidatos, não nomes de tabelas ou classes aprovados.

## 3. Participantes e responsabilidades

### 3.1. Responsáveis legais

Pessoas cuja legitimidade e poderes relativos à criança foram verificados de acordo com a política jurídica e operacional aplicável.

Podem, dentro de seus poderes e das restrições existentes:
- participar do contexto familiar compartilhado;
- registrar contribuições e experiências;
- consultar contribuições que integram esse contexto;
- administrar concessões de acesso profissional quando legitimadas para isso;
- solicitar correções, contextualizações, exportação ou exercício de direitos aplicáveis.

A plataforma não deve presumir que qualquer adulto que se declare pai, mãe ou responsável possui automaticamente todos os poderes de gestão. Também não deve presumir que todos os responsáveis possuem poderes idênticos em qualquer situação. Guarda, decisões judiciais, medidas protetivas, restrições e conflitos precisam ser considerados.

### 3.2. Profissionais de saúde

Profissionais podem incluir, entre outras especialidades pertinentes, fonoaudiólogos, psicólogos, terapeutas, pediatras e psiquiatras.

A identidade profissional, a qualificação e o vínculo de acompanhamento devem ser verificados por mecanismos adequados antes da concessão de acesso sensível. A plataforma deve distinguir:
- identidade declarada;
- identidade verificada;
- credencial ou registro profissional verificado, quando aplicável;
- vínculo profissional com a criança;
- autorização concedida para operações e categorias específicas.

O profissional:
- contribui dentro de sua competência e da finalidade autorizada;
- mantém autoria e natureza profissional de suas contribuições;
- não adquire responsabilidade legal sobre a criança pelo simples acompanhamento;
- não recebe acesso por pertencer a uma clínica, equipe ou instituição;
- não ganha precedência automática sobre a perspectiva familiar;
- não pode ampliar o próprio escopo de acesso.

### 3.3. Criança

A criança é sujeito da experiência e da proteção. Sua expressão, participação, preferências, recusas e formas de comunicação devem ser consideradas de acordo com idade, contexto, capacidade de compreensão e requisitos legais aplicáveis. A ausência de registro ou de expressão interpretável não equivale a consentimento, concordância ou ausência de preferência.

## 4. Modelo de compartilhamento: núcleo comum com espaços delimitados

O domínio separa três espaços lógicos:

1. **Núcleo familiar compartilhado:** contribuições que integram o contexto comum dos responsáveis legais legitimados. A visibilidade entre responsáveis deve respeitar a legitimidade verificada, restrições legais e medidas de proteção. Não se presume que todo responsável tenha acesso irrestrito em qualquer circunstância.
2. **Núcleo compartilhado com profissional:** subconjunto do contexto da criança ao qual um profissional específico recebeu acesso explícito, para finalidade, categorias, operações e prazo determinados. Não é um espelho integral do núcleo familiar.
3. **Registros profissionais reservados:** anotações internas ou documentação clínica que pertençam ao ambiente de trabalho do profissional e não tenham sido deliberadamente oferecidas ao núcleo compartilhado. Não são importadas automaticamente para o MUNDELO nem ficam visíveis à família apenas por existir vínculo profissional.

Uma contribuição só integra o núcleo compartilhado quando sua natureza, finalidade e visibilidade forem explicitadas no momento do registro. O sistema não deve transformar, silenciosamente, uma anotação privada em contribuição compartilhada.

## 5. Acesso profissional: concessão granular e explícita

### 5.1. Regra padrão

**Novo vínculo profissional não concede acesso automático ao histórico.**

A família ou a pessoa legitimada deve conceder acesso explicitamente. A concessão deve identificar, no mínimo:

- criança específica;
- profissional destinatário, com identidade verificada;
- vínculo profissional e finalidade declarada;
- categorias de contribuições autorizadas;
- operações autorizadas;
- data de início e expiração;
- responsável pela concessão e evidência de sua legitimidade;
- versão dos termos e da política aceitos;
- estado da concessão: pendente, ativa, expirada, revogada ou suspensa.

Não há concessão genérica por clínica, equipe, especialidade ou organização.

### 5.2. Categorias de acesso

As categorias devem ser compreensíveis para pessoas não técnicas. A taxonomia inicial proposta:

- experiências e observações do cotidiano;
- comunicação e formas de expressão;
- aprendizagem, brincadeiras e exploração;
- sentimentos, conforto e regulação;
- sensibilidades, preferências e recusas;
- estratégias e ajustes de interação;
- orientações compartilhadas;
- contribuições profissionais compartilhadas;
- histórico de alterações e relações entre contribuições.

A seleção deve permitir conceder apenas o necessário à finalidade. Categorias sensíveis ou que revelem informações de terceiros podem exigir proteção adicional e não devem ser agrupadas em permissões amplas por conveniência.

### 5.3. Operações independentes

Leitura não implica criação, edição, exclusão, exportação, compartilhamento ou utilização em sínteses/interpretações. Preservação, apresentação e utilização são operações independentes, sujeitas às condições próprias de finalidade, autorização, contexto e direitos aplicáveis.

Registrar uma contribuição e preparar uma representação para compartilhamento não concedem acesso nem autorizam sua entrega. As condições devem ser verificadas na efetivação de cada operação; mudança de versão, escopo ou restrição exige reavaliação antes da disponibilização do resultado.

A [matriz de critérios por operação](contrato-dominio-criterios-operacoes-v0-1.md) detalha condições, efeitos e cenários desta revisão. Seus rótulos adicionais são analíticos, não novos poderes, enums ou APIs aprovados.

As operações devem ser concedidas separadamente:
- **read:** consultar contribuições autorizadas;
- **create:** registrar nova contribuição no escopo autorizado;
- **edit_own:** corrigir ou complementar contribuições próprias, preservando o histórico legitimamente permitido;
- **request_correction:** solicitar correção de contribuição alheia, sem alterá-la;
- **export:** exportar categorias autorizadas, quando permitido;
- **share:** conceder acesso a terceiros, somente se houver política e legitimidade explícitas.

A exclusão de contribuição alheia não é concedida por padrão. A administração do vínculo não confere poder para editar ou apagar contribuições de outra pessoa.

### 5.4. Histórico anterior e contribuições futuras

O acesso ao histórico anterior deve ser uma escolha explícita por categoria. Não se presume que conceder acesso a uma categoria permita visualizar todo o seu passado.

A concessão deve declarar:
- se inclui contribuições anteriores à data de início;
- quais categorias e qual intervalo histórico estão incluídos;
- se inclui relações, respostas e histórico de alterações;
- quais tipos de contribuição permanecem excluídos.

Para contribuições futuras, a regra é: o profissional pode consultar ou criar apenas dentro das categorias e operações ativas da concessão. Uma nova categoria ou operação exige nova autorização. O sistema deve registrar a versão do escopo vigente em cada operação relevante.

### 5.5. Revogação, expiração e suspensão

A revogação ou expiração:
- bloqueia novas leituras e operações protegidas a partir da efetivação, inclusive em sessões e tokens conforme política técnica;
- não transfere autoria;
- não altera silenciosamente contribuições existentes;
- não apaga automaticamente histórico que tenha obrigação legítima de retenção;
- deve registrar quem revogou, quando, qual concessão foi afetada e o motivo, quando fornecido;
- exige revisão de cópias, exportações e dados derivados já produzidos, segundo política de retenção, contratos e legislação aplicável.

A interface deve explicar que revogar acesso futuro não garante apagar cópias legitimamente obtidas anteriormente. O MUNDELO deve minimizar exportações e evitar cópias locais desnecessárias.

## 6. Legitimidade, autorização e conflitos entre responsáveis

Estes conceitos não podem ser confundidos:

- **Legitimidade:** fundamento para agir em relação à criança.
- **Verificação:** evidência e processo pelos quais a plataforma confirma a legitimidade ou credencial.
- **Vínculo:** relação familiar ou profissional com a criança.
- **Autorização:** decisão válida que permite uma finalidade ou concessão de acesso.
- **Permissão:** operação concreta liberada pelo sistema para um sujeito e recurso.

O produto não deve codificar como regra universal que sempre basta a autorização de um responsável ou que sempre é necessária a concordância de todos. A regra depende da jurisdição, da natureza do ato, da guarda, de decisões judiciais, de restrições e de outros elementos legalmente relevantes.

**Regra conservadora de produto:** quando a legitimidade, o poder de autorizar ou a existência de restrição relevante estiverem incertos ou em conflito, não ativar nova concessão profissional até que a situação seja verificada por procedimento apropriado. Não resolver disputas familiares por votação, ordem de cadastro, antiguidade da conta ou preferência do profissional.

A plataforma deve oferecer um estado de revisão/suspensão e um processo de suporte seguro, sem expor dados adicionais a qualquer parte durante a análise. A política jurídica e operacional deverá ser validada por assessoria especializada antes do uso com dados reais.

## 7. Contribuições e proveniência

Toda contribuição compartilhada deve preservar, conforme aplicável:

- identificador estável;
- criança a que se refere;
- autor e papel no momento da criação;
- pessoa que vivenciou ou observou o evento, se diferente do autor;
- relação com a criança;
- tipo de contribuição;
- conteúdo original e versões cuja preservação permaneça legítima, com acesso e utilização sujeitos às respectivas restrições;
- contexto, ambiente e atividade;
- data/hora do acontecimento, quando conhecida;
- data/hora do registro;
- finalidade e classificação de visibilidade;
- origem da informação: experiência direta, relato de terceiro, documento ou outra fonte;
- grau de certeza declarado pelo autor, sem conversão automática em probabilidade clínica;
- versão, correções, complementos e relações com outras contribuições.

Proveniência, contexto e histórico também podem conter informações protegidas. Preservar um vínculo não autoriza expor seus detalhes a todo destinatário. Informação desconhecida, não observada, não informada e não aplicável deve permanecer distinguível, sem preenchimento inferencial ou bloqueio universal de registro legítimo. A falta de contexto pode limitar uma operação posterior específica.

Tipos iniciais:
- observação direta;
- relato de experiência;
- interpretação ou hipótese;
- avaliação profissional compartilhada;
- orientação profissional compartilhada;
- pergunta ou ponto a investigar;
- resposta ou contextualização;
- experiência de interação e reflexão sobre o que foi tentado.

Uma avaliação profissional deve ser identificada como avaliação profissional, com autor, especialidade/credencial pertinente e contexto. Não deve ser convertida em definição total da criança.

## 8. Correção, contestação e divergência

- O autor pode corrigir sua contribuição, com autoria e temporalidade da correção e motivo opcional ou exigido conforme risco. Versões anteriores e seus conteúdos só permanecem preservados na extensão e pelo período legitimamente aplicáveis; corrigir não impõe retenção pessoal indefinida.
- Outra pessoa pode acrescentar contexto, resposta ou contestação, sem editar o conteúdo original.
- A divergência é representada como relação entre contribuições, não como erro automático.
- A discordância, isoladamente, não autoriza apagar contribuição legítima de outra pessoa. Isso não impede restrição, eliminação ou anonimização cabíveis por procedimento próprio.
- Correções administrativas devem registrar agente, fundamento, data e escopo.
- Remoção, anonimização ou restrição por obrigação legal, segurança ou exercício de direitos deve seguir política específica, preservando apenas o histórico estritamente permitido.
- Não existe mecanismo de consenso obrigatório, votação de verdade ou precedência automática por profissão.

Correção, contestação, restrição, invalidação e eliminação têm efeitos distintos e não se substituem automaticamente. A alteração da origem ou das autorizações exige avaliar as derivações e utilizações conhecidas, identificando o evento, a versão, o escopo afetado e o tratamento realizado. Agendamento ou pedido recebido não comprovam execução concluída.

A versão histórica registra o que foi declarado e quando; não garante que o conteúdo continue correto ou aplicável. Contexto corrigido e interpretação posterior devem ser distinguíveis, sem reescrita silenciosa do passado e observados os limites de preservação legítima.

## 9. Sínteses e compreensão derivada

Uma síntese futura só poderá existir se:
- for claramente identificada como derivada e não canônica;
- declarar objetivo, método, período e categorias consideradas;
- identificar as contribuições e versões de origem legitimamente utilizadas, apresentando ao leitor apenas os elementos de proveniência que ele possa acessar;
- indicar fontes ausentes, limites e incertezas relevantes;
- preservar divergências sem forçar resolução;
- permitir abrir as contribuições originais no escopo de consulta autorizado; a indicação de linhagem não pode expor fontes ou metadados restritos;
- não alterar nem substituir as fontes;
- não inferir diagnóstico ou identidade unificada, nem impor superioridade narrativa automática por profissão, quantidade ou antiguidade; distinguir avaliação factual da evidência de autoridade sobre a experiência e a identidade da pessoa.

A autorização do leitor também se aplica às fontes: uma síntese não pode revelar indiretamente informação que o leitor não poderia consultar diretamente. A permissão de consulta das fontes é necessária no escopo da apresentação, mas não concede, por si só, autorização para utilizá-las em uma síntese ou em outra finalidade.

Quando uma fonte, versão, autorização ou restrição mudar, o sistema deve reavaliar as sínteses e unidades derivadas conhecidas quanto à validade, apresentação, utilização e retenção. O tratamento pode exigir sinalização, restrição, recálculo autorizado, invalidação ou eliminação, conforme a situação e a política aplicável. Recalcular não amplia permissões nem substitui um dever de eliminação. Um resultado antigo não pode continuar disponível indevidamente ou ser apresentado silenciosamente como atual.

## 10. Segurança, privacidade e ciclo de vida

Requisitos obrigatórios antes de persistir dados reais:
- isolamento por criança e por concessão, validado no servidor;
- autorização aplicada no banco/API, nunca apenas na interface;
- negação por padrão e verificação em cada operação;
- proteção contra acesso por identificadores conhecidos ou manipulados;
- minimização de dados, finalidade explícita e retenção definida;
- trilha de auditoria para concessões, revogações, acessos sensíveis e alterações;
- gestão de sessões e tokens após revogação;
- proteção de exportações, backups, logs, analytics e dados derivados;
- processo de incidente e resposta a exposição;
- avaliação jurídica e de privacidade adequada à jurisdição e ao público infantil.

### 10.1. Preservação legítima, retenção e eliminação

A integridade da origem, das versões e da linhagem se aplica ao conteúdo cuja preservação permaneça legítima. Nenhuma expressão de preservação deste contrato autoriza conservar indefinidamente conteúdo pessoal apenas para manter rastreabilidade.

A política aplicável deve distinguir conteúdo pessoal, metadados, evidência da operação e derivados identificáveis, definindo finalidade, fundamento, categoria, período ou condição de revisão, acesso, utilização e destinação. Essa política deve tratar também cópias e backups sob a governança pertinente e não pode ser suprida por um prazo universal presumido neste documento.

Solicitações de correção, restrição, eliminação ou anonimização devem receber avaliação e execução no escopo cabível, considerando os direitos de terceiros e as obrigações de retenção aplicáveis. Havendo retenção necessária, ela não libera apresentação ou utilização irrestrita. A evidência de execução deve ser minimizada e não pode reconstruir indevidamente o conteúdo eliminado. Anonimização não se confunde com remoção de nome ou substituição por código.

A resposta deve distinguir solicitação recebida, medida pendente, restrição aplicada, execução parcial e conclusão verificada. Não se deve declarar eliminação integral por exclusão apenas da interface ou prometer controle de cópias externas.

### 10.2. Condições da implementação

A autorização client-side existente no protótipo é demonstrativa e não constitui controle de segurança de produção. Este contrato não aprova arquitetura física, provedor, schema, RLS ou mecanismo de autenticação.

## 11. Modelo conceitual candidato

As seguintes entidades representam responsabilidades do domínio, não uma proposta final de tabelas:

- `Child`
- `ChildResponsibility`
- `ProfessionalIdentity`
- `ProfessionalRelationship`
- `AccessGrant`
- `AccessGrantScope`
- `Contribution`
- `ContributionVersion`
- `InteractionExperience`
- `ContributionRelation`
- `DerivedSynthesis`
- `AuditEvent`

A modelagem física deverá avaliar cardinalidade, integridade referencial, segregação de dados, retenção, concorrência, RLS e ameaças antes de qualquer migration.

## 12. Invariantes testáveis

1. Um profissional sem vínculo verificado e concessão ativa não acessa dados da criança.
2. Um vínculo profissional, isoladamente, não concede leitura.
3. Uma concessão para uma criança não autoriza acesso a outra.
4. Uma concessão não permite categorias ou operações fora do escopo registrado.
5. Histórico anterior só é acessível quando explicitamente incluído na concessão.
6. Novas contribuições só ficam acessíveis dentro das categorias e operações autorizadas.
7. Revogação impede novas operações protegidas e não altera autoria ou conteúdo histórico por sobrescrita.
8. Um profissional não pode conceder acesso a outro profissional por herança de equipe ou instituição.
9. Responsabilidade legal, vínculo profissional, autorização e permissão são conceitos distintos e testados separadamente.
10. A divergência, isoladamente, não autoriza sobrescrita, apagamento ou classificação automática de erro; contribuições permanecem distintas, observados os procedimentos legítimos de correção, restrição e eliminação.
11. Correções mantêm autoria, temporalidade e rastreabilidade; versões anteriores e conteúdo pessoal são preservados somente na extensão e pelo período legitimamente aplicáveis.
12. Sínteses não revelam fontes fora do escopo de acesso do leitor.
13. Registros profissionais reservados não são publicados automaticamente no núcleo familiar.
14. A interface distingue observação, relato, interpretação, avaliação e orientação.
15. Ausência de informação, silêncio ou falta de resposta não é interpretada como consentimento.
16. Estados de conflito ou incerteza de legitimidade bloqueiam concessões novas até revisão.
17. Nenhum teste de autorização depende exclusivamente de ocultar elementos na interface.
18. Preservação não concede apresentação ou utilização; leitura não concede utilização em síntese, exportação ou compartilhamento.
19. Registro legítimo admite lacunas explícitas; falta de contexto limita a operação que dele dependa, sem preenchimento inferencial.
20. Preparação não concede acesso e não efetiva compartilhamento.
21. Alterações de origem, versão, autorização ou restrição provocam reavaliação das dependências conhecidas antes de disponibilização indevida.
22. Trilha de auditoria, metadados e versões não conservam nem expõem indevidamente conteúdo restrito ou eliminado.
23. A conclusão de uma operação corresponde ao efeito verificado no escopo informado, não à mera recepção ou programação do pedido.

## 13. Critérios de aceitação do contrato

O contrato só estará pronto para orientar implementação quando a revisão confirmar:

- [ ] distinção entre responsabilidade legal, vínculo, autorização e permissão;
- [ ] regra de acesso profissional granular por criança, finalidade, categoria, operação e prazo;
- [ ] escolha explícita sobre histórico anterior e contribuições futuras;
- [ ] separação entre núcleo familiar, núcleo compartilhado com profissional e registros profissionais reservados;
- [ ] tratamento de guarda, restrições, conflitos e legitimidade incerta;
- [ ] preservação de autoria, proveniência, versões e divergências;
- [ ] limites de sínteses e dados derivados;
- [ ] requisitos de segurança, privacidade, retenção e revogação;
- [ ] validação jurídica e de privacidade antes de dados reais;
- [ ] matriz de testes derivada dos invariantes;
- [ ] conciliação entre preservação de origem, correção, restrição, eliminação e retenção proporcional;
- [ ] condições por operação, incluindo utilização em sínteses, definidas e verificáveis;
- [ ] efeitos sobre derivados, versões, metadados, cópias e evidências de execução definidos.

## 14. Decisões deliberadamente não tomadas

Este contrato não decide:
- schema PostgreSQL, migrations ou políticas RLS;
- provedor de hospedagem, arquitetura de deploy ou desenho final de sessões;
- mecanismo e evidências exatas para verificação de identidade, responsabilidade legal ou credencial profissional;
- regra jurídica universal de autorização entre múltiplos responsáveis;
- política final de retenção, eliminação, anonimização, exportação e resposta a requisições legais, incluindo fundamento, prazos, responsáveis e tratamento de cópias/backups;
- procedimentos finais de contestação, revisão, proteção/urgência e comprovação de conclusão de cada operação;
- quais categorias serão lançadas no primeiro MVP;
- se haverá síntese automatizada e sob quais salvaguardas;
- integração com prontuários, clínicas ou sistemas externos.

Essas decisões exigem ADRs e revisões específicas. Não devem ser inferidas deste documento.

## 15. Próxima sequência recomendada

1. Revisar e aprovar este contrato conceitual.
2. Resolver pendências de legitimidade, governança e política jurídica com especialista.
3. Atualizar o modelo de ameaças para os fluxos de responsáveis e profissionais.
4. Desenhar matriz de autorização e casos de abuso.
5. Derivar modelo lógico e ADRs de persistência.
6. Especificar RLS e testes negativos antes de implementar operações.
7. Executar PG-06 sobre o desenho e sobre a implementação.
8. Somente após os gates aplicáveis, considerar dados reais de crianças.

**Regra de bloqueio:** nenhuma migration, integração de profissional ou persistência de dados infantis reais deve ser iniciada com base apenas neste rascunho.

---

## Registro de revisão

- **Proposta:** Contrato de Domínio MUNDELO v0.1-r1 — conciliação localizada de preservação e operações
- **Decisão:** PENDENTE DE REVISÃO
- **Aprovador:** pendente
- **Revisores:** pendentes
- **Data de aprovação:** pendente
- **Riscos residuais aceitos:** nenhum registrado


## Registro da conciliação localizada

Esta revisão qualifica os deveres de preservação pela legitimidade da retenção e explicita as condições de operação. Mantém as demais decisões do contrato como base histórica, sem atestar a consolidação de todas as famílias de princípios ou a conclusão da v0.2.

Rastreabilidade documental: DEC-DAT-004; AUD-GLOBAL-015; AUD-BIO-CROSS-005; DEC-HUM-004/005/007/008; REQ-BIO-013/016/017; DEC-INF-013; AUD-GLOBAL-016 e DOM-04/05, nos limites dos registros recuperados. AUD-DOM-002/004 são salvaguardas de revisão; não se presume aprovação de todas as propostas relacionadas. INF-ID-017/169/206/227/249 permanecem sujeitos às pendências da recuperação original.

A incorporação de um documento ao repositório não equivale, por si só, à aprovação de todas as formulações nele contidas. Esta revisão e seus cenários por operação permanecem pendentes de revisão de redação e alcance. Nenhum prazo legal, novo poder de representação ou autorização para dados reais é estabelecido por esta alteração.
