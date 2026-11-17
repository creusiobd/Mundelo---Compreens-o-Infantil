# MUNDELO | Princípio de Pluralidade das Perspectivas v0.1

- **Status:** princípio de produto aceito pelo fundador em 17/11/2026; aguardando revisão técnica e merge da PR #16
- **Escopo:** produto, domínio, dados, APIs, autorização, interface, conteúdo, IA e colaboração profissional
- **Regra:** nenhuma funcionalidade pode exigir, induzir ou fabricar uma interpretação única da criança a partir de perspectivas distintas.

## 1. Declaração institucional

O MUNDELO não deve tentar fazer com que todos os adultos enxerguem a criança da mesma maneira. Deve permitir que diferentes pessoas compreendam aspectos diferentes dela, sem apagar as particularidades de cada relação.

A plataforma conecta perspectivas sem uniformizá-las. Permite diálogo sem exigir concordância. Organiza informações sem transformar diferenças em inconsistências a eliminar.

A criança é maior do que qualquer registro, interpretação, avaliação, profissão ou relação. Nenhuma perspectiva isolada representa a totalidade de quem ela é.

## 2. Consequências obrigatórias para o produto

- Não produzir um perfil totalizante, uma narrativa oficial única ou uma síntese que substitua as perspectivas de origem.
- Não exigir consenso entre familiares e profissionais para salvar, manter ou consultar contribuições legítimas.
- Não tratar divergência como erro, conflito a resolver automaticamente, falta de colaboração ou evidência de que alguém está errado.
- Não fundir observações, interpretações familiares, avaliações profissionais e orientações em um único campo sem autoria e natureza explícitas.
- Permitir que cada pessoa registre o que observou a partir de seu contexto e relação, com limites de acesso apropriados.
- Tornar explícito quando uma síntese é composição editorial ou computacional, quem a produziu, quais fontes considerou, quais omitiu e quais incertezas permanecem.
- Não usar quantidade de concordâncias, frequência de uma opinião ou hierarquia profissional como mecanismo automático para declarar uma perspectiva verdadeira.
- Preservar correção, contextualização, contestação e resposta, sem apagar silenciosamente o registro original ou sua autoria.
- Considerar a expressão, preferência, recusa e participação da própria criança de acordo com idade, contexto e possibilidades, sem presumir que adultos a interpretam integralmente.

## 3. Modelo conceitual: contribuições, não uma verdade agregada

Cada contribuição deverá preservar, quando aplicável: autor e papel/contexto no momento do registro; tipo (observação, interpretação, avaliação profissional, orientação, pergunta ou relato); relação e contexto; data do acontecimento e data do registro; conteúdo original e histórico de alterações; finalidade e base de acesso; grau de certeza declarado pelo autor, sem conversão automática em probabilidade clínica; referências a outras contribuições como diálogo, nunca como sobrescrita.

Uma síntese, se futuramente existir, será uma visão derivada e não canônica. Deve manter proveniência, explicitar método e limites, permitir consultar as contribuições de origem e jamais substituir ou alterar registros originais.

## 4. Requisitos de arquitetura e engenharia

### Domínio e persistência
- Modelar contribuições independentes com autoria, tipo, contexto e proveniência.
- Não criar campo global de verdade, consenso ou avaliação canônica que consolide a identidade da criança.
- Não sobrescrever contribuição familiar com contribuição profissional ou vice-versa.
- Representar divergência como relação explícita entre contribuições, sem classificá-la automaticamente como falha.
- Versionar correções e preservar trilha de autoria; correções não devem reescrever a história silenciosamente.

### Autorização e isolamento
- A autorização determina quem pode acessar uma contribuição, não qual perspectiva é considerada verdadeira.
- O acesso profissional é específico por criança, finalidade, categoria, operação e prazo, após autorização legítima.
- Leitura não implica edição, exportação, compartilhamento ou exclusão.
- Não ampliar acesso porque duas pessoas concordam nem restringi-lo porque discordam.
- Revogação bloqueia novos acessos conforme política definida, sem apagar automaticamente autoria e histórico que devam ser preservados.

### Interface e experiência
- Identificar autoria, papel, contexto, tipo de contribuição e data.
- Não ordenar perspectivas por hierarquia universal de autoridade nem destacar uma como versão oficial da criança.
- Não usar linguagem como visão correta, normal, consenso sobre a criança ou perfil definitivo.
- Exibir divergências com linguagem neutra e sem exigir resolução.
- Permitir consultar contribuição original e contexto antes de qualquer síntese.

### IA e automação
- Não inferir identidade unificada da criança pela agregação de relatos.
- Não converter padrões, frequência ou concordância em diagnóstico, verdade ou hierarquia de credibilidade.
- Não resolver divergências automaticamente nem reescrever contribuições.
- Toda síntese automatizada deverá ser identificada como derivada, apresentar fontes e incertezas e permanecer subordinada às contribuições originais.
- Na ausência de evidência suficiente, preservar a incerteza em vez de preencher lacunas.

## 5. Invariantes testáveis

1. Duas contribuições divergentes podem coexistir sem que uma apague a outra.
2. Uma contribuição mantém autoria, contexto e tipo após a inclusão de outra perspectiva.
3. Não existe rotina automática de consenso, votação ou prevalência profissional que reescreva registros.
4. Uma síntese pode ser rastreada até suas fontes e não substitui as fontes.
5. Usuários sem autorização não acessam contribuições, mesmo que conheçam seus identificadores.
6. Revogar acesso não transfere autoria nem altera conteúdo histórico.
7. A interface não rotula divergência como erro ou desvio.
8. Testes automatizados cobrem coexistência, proveniência, autorização, edição e revogação.

## 6. Critério de bloqueio

Qualquer requisito, modelo de dados, endpoint, job, componente, prompt, relatório ou fluxo que consolide perspectivas em interpretação única obrigatória, apague autoria/contexto, imponha consenso ou apresente síntese como identidade definitiva da criança deve ser BLOCKED até revisão institucional e alteração explícita deste princípio.

Não são exceções aceitáveis: conveniência de UX, simplificação do schema, otimização de analytics, ranking de opiniões ou autoridade presumida de uma especialidade.

## 7. Relação com segurança e cuidado

Pluralidade não significa acesso irrestrito. Cada pessoa só acessa o que foi legitimamente autorizado e necessário à finalidade. Preservar perspectivas exige proteger confidencialidade, integridade, autoria e contexto.

Este princípio não impede profissionais de oferecer avaliações ou orientações dentro de suas competências. Impede que a plataforma transforme uma avaliação particular em definição total da criança ou use hierarquia técnica para apagar outras experiências.

## 8. Estado de implementação

Este documento estabelece requisitos para decisões futuras. Não declara que o código atual já os atende. Antes de implementar colaboração profissional, registros compartilhados ou sínteses, realizar mapeamento do domínio, revisão de privacidade e segurança, desenho de autorização e testes específicos. Dados infantis reais permanecem bloqueados até aprovação dos gates correspondentes.

## 9. Compreender para ampliar a interação da criança com o mundo

A pluralidade das perspectivas não é um fim em si mesma, nem um convite a manter relatos isolados. O MUNDELO existe para aprofundar a compreensão de como a criança experimenta e participa do mundo: como se comunica, aprende, ensina, sente, explora, estabelece vínculos, expressa preferências e recusas e responde às condições ao seu redor.

O propósito não é uniformizar a leitura dos adultos sobre esses aspectos. É criar condições para que experiências diferentes possam se iluminar mutuamente, sem perder sua origem, contexto ou particularidade. A compreensão construída deve ajudar adultos a fazer perguntas melhores, ajustar ambientes, descobrir formas de comunicação, reconhecer possibilidades e melhorar a qualidade das interações da criança com o mundo.

### 9.1. Da experiência à interação mais consciente

O ciclo de valor do MUNDELO deve apoiar, sem automatizar, este movimento:

1. **Experimentar:** reconhecer que a criança vive situações em contextos concretos, com sentidos e respostas que não podem ser presumidos.
2. **Perceber e comunicar:** acolher diferentes formas de expressão, inclusive gestos, movimentos, brincadeiras, aproximações, afastamentos, silêncios, escolhas e recusas.
3. **Registrar e contextualizar:** preservar o que foi percebido, por quem, em qual relação, ambiente e momento, distinguindo observação de interpretação.
4. **Aprender e ensinar:** permitir que adultos aprendam com a criança e entre si; reconhecer que ensinar também é ajustar a própria comunicação, o ambiente e a forma de oferecer oportunidades.
5. **Refletir e experimentar possibilidades:** apoiar perguntas e pequenas mudanças responsáveis na interação, sem prescrever condutas clínicas nem tratar a criança como objeto de testes.
6. **Revisitar:** observar como a interação aconteceu, o que pareceu acolhedor, o que não funcionou e o que continua desconhecido, sem converter um episódio em identidade permanente.

Esse ciclo é uma orientação de produto, não um algoritmo para classificar, prever ou normalizar crianças.

### 9.2. O que a compreensão deve produzir

- Mais qualidade na comunicação e na escuta, não apenas mais registros.
- Mais possibilidades de participação, exploração, aprendizagem e vínculo.
- Ambientes e interações mais atentos às necessidades, interesses, limites e formas de expressão da criança.
- Perguntas melhores e hipóteses mais cuidadosas, não conclusões precipitadas.
- Continuidade de cuidado quando útil e autorizada, sem apagar a singularidade de cada relação.
- Reconhecimento de que adultos também aprendem, revisam expectativas e podem mudar a própria maneira de interagir.

### 9.3. Limites que protegem a missão

- O MUNDELO não define uma forma ideal ou universal de comunicar, aprender, sentir ou interagir.
- Não transforma diferenças de contexto em déficits, sintomas ou falhas da criança.
- Não prescreve intervenções clínicas, não substitui profissionais e não promete resultados de desenvolvimento.
- Não mede o valor da criança pela quantidade de habilidades, marcos, respostas ou comportamentos registrados.
- Não confunde melhorar a interação com modificar a criança para torná-la mais conveniente aos adultos.
- Não presume que toda experiência precisa ser registrada, compartilhada ou convertida em ação.

**Critério de produto:** uma funcionalidade só fortalece a missão quando amplia a capacidade de compreender e melhorar a interação respeitando a criança, seu contexto, sua participação e a pluralidade das relações. Se apenas aumenta coleta, vigilância, classificação ou padronização, não está alinhada ao MUNDELO.
