# MUNDELO | Founder Story expandida v0.2

**Estado:** versão literária e institucional de trabalho; requer validação autoral do fundador antes de publicação.  
**Data:** 16/11/2026.  
**Base factual:** [Dossiê de Maturidade](mundelo-dossie-maturidade-v0-1.md), [Manifesto de Princípios](manifesto-principios-mundelo-v1.md), [Histórico técnico](continuidade.md), relatos humanos do DEVICE-REAL-01/02.

## Prólogo — Aquilo que a pressa de compreender pode esconder

Antes de existir uma aplicação, existia uma pergunta que não cabia numa tela.

O que acontece quando um adulto, tomado pela vontade de cuidar, confunde aquilo que vê com aquilo que acredita que viu? Há gestos que se mostram por inteiro e, ainda assim, nos escapam. Há silêncios que não são ausência de comunicação. Há acontecimentos que o cansaço, o ambiente e a nossa própria história tornam mais difíceis de interpretar.

O cuidado pede presença, mas também pede discernimento. Amar alguém não significa possuir uma tradução definitiva da sua existência. Talvez uma das responsabilidades mais exigentes da parentalidade seja reconhecer que até a nossa melhor intenção pode chegar antes da compreensão.

Dessa inquietação nasceu a tese que passou a orientar o MUNDELO: **observar não é concluir**.

Não se trata de impedir a interpretação. Interpretar também faz parte de cuidar. Trata-se de aprender a dizer: isto aconteceu; estas eram as circunstâncias; foi assim que respondi; isto pareceu ajudar; e isto, apesar do meu desejo de explicar, ainda não sei.

Uma criança não deve carregar como identidade permanente uma hipótese passageira construída por um adulto.

## Capítulo I — O mundo antes da explicação

A proposta do MUNDELO nasce no território humano da parentalidade, onde cuidado e incerteza convivem. Os acontecimentos de uma infância são maiores que os relatos que conseguimos produzir sobre eles. Um gesto pode ter significado diferente diante de outra rotina, outro ambiente, outra presença.

A pergunta de produto apareceu nessa fronteira: **e se pudéssemos registrar o contexto antes de fixar uma interpretação?**

Não para tornar a vida familiar mais burocrática. Nem para produzir um arquivo total sobre uma criança, como se cada segundo precisasse ser medido. Ao contrário: para guardar somente o necessário, com propósito claro, e criar melhores condições para recordar, compreender e conversar.

A hipótese era que, em vez de uma coleção de rótulos, um cuidador pudesse construir uma narrativa responsável dos acontecimentos, distinguindo fatos, hipóteses e respostas observadas.

**Nota factual:** esta formulação é uma síntese da tese e das conversas sobre o MUNDELO. O episódio familiar específico que originou a ideia ainda não está documentado. Não preencher esse espaço com uma cena inventada.

## Capítulo II — O elo precisa de forma

Para transformar a tese em produto, a filosofia precisou enfrentar perguntas de interface.

Como ajudar uma pessoa a registrar o que ocorreu sem conduzi-la a diagnosticar? Como tornar visíveis interesses e fontes de conforto sem reduzir a criança a uma lista de atributos? Como permitir uma conversa com educadores e profissionais sem insinuar que uma síntese gerada por software substitui seu julgamento?

O protótipo tomou forma em caminhos complementares.

O **Diário de Observações** organiza o acontecimento, o ambiente, o antecedente, os sinais percebidos, o apoio oferecido e o resultado observado. **Meu Mundo** preserva interesses, sensibilidades relatadas e estratégias experimentadas. **Descobertas** aponta atividades supervisionadas fora da tela. **Compreender** oferece uma visão descritiva, sem proclamar causalidade. **Relatório** estrutura material para diálogo.

Nada disso garante, por si, que uma família se sentirá melhor compreendida. Essa é a hipótese que ainda precisa encontrar pessoas e evidências.

A concepção do produto precisou, desde o início, delimitar aquilo que não seria seu papel: diagnosticar, predizer transtornos, distribuir crianças em rankings ou decretar uma identidade a partir de comportamentos passageiros.

## Capítulo III — Quando princípios precisam de critérios

Boas intenções são frágeis quando não sobrevivem às decisões.

O MUNDELO ganhou um **Manifesto de 12 princípios** e um **Principles Gate**: uma forma de avaliar mudanças não apenas por entrega de funcionalidade, mas por singularidade, distinção entre fatos e hipóteses, acesso em diferentes modalidades, privacidade e autonomia do cuidador.

Isso trouxe uma exigência nova. Não bastava escrever “inclusão” na apresentação. Era necessário verificar se a experiência oferecia caminhos de acesso reais. Não bastava escrever “privacidade”; o desenho técnico precisava reconhecer o que protegia e o que ainda era apenas experimental.

A aplicação continuava demonstrativa, com dados sintéticos. A autorização no cliente não era autorização de servidor. O cofre local criptográfico era experimental. O manifesto passou a orientar o trabalho, não a certificar sua conclusão.

Esse reconhecimento talvez seja uma das formas mais concretas de respeito: **a promessa precisa saber o tamanho da evidência que a sustenta**.

## Capítulo IV — O dia em que o MUNDELO foi ouvido

O projeto passou pelos testes automatizados da interface. Mas houve uma pergunta que nenhum relatório do navegador conseguiria responder completamente: o que experimenta uma pessoa quando utiliza um leitor de tela de verdade?

A aplicação foi disponibilizada em uma demonstração HTTPS e testada com o TalkBack no Galaxy Tab S10 Ultra. Seu executor relatou leitura correta dos elementos e aprovou três jornadas: navegação entre telas, abertura de Nova Observação e fechamento do formulário com retorno à navegação.

Era um marco humano real. A experiência havia atravessado a fronteira entre aquilo que o código declarava acessível e aquilo que um dispositivo podia anunciar.

Mas três testes positivos não são uma certificação universal. Não substituem avaliações com NVDA, VoiceOver nem diferentes pessoas que dependem de tecnologias assistivas todos os dias.

A conquista não eliminou o trabalho. Deu-lhe direção.

## Capítulo V — Quando a confiança encontra uma contradição

Num teste seguinte, o próprio executor relatou um comportamento inesperado: a cuidadora fictícia Ana, sem vínculo com a criança, aparentemente conseguiu criar uma observação, recebeu sucesso e encontrou o registro após alternar para Helena.

O código consultado continha regras que deveriam impedir essa gravação. A investigação identificou um defeito inequívoco na comunicação entre o formulário e a operação: o modal podia fechar mesmo quando a escrita não fosse aceita. Isso explicava uma aparência enganosa de êxito, mas não comprovava a origem da persistência relatada.

O produto precisou fazer o que seu próprio manifesto exigia: reconhecer o limite da interpretação, registrar a contradição e corrigir o que era verificável.

Uma atualização passou a exigir permissão também nas entradas de criação e edição, devolver ao formulário o resultado da escrita e manter o modal aberto quando a operação fosse negada. Os testes de regressão foram incorporados. O executor informou que o reteste havia sido validado. Permaneceram pendentes evidências detalhadas de versão e causa raiz.

Esse episódio não deve ser apresentado como crise heroicamente resolvida, mas como uma lição de governança. Na infância, a confiança não pode depender de um botão desativado ou de uma boa impressão: os limites da autorização precisam existir de forma efetiva, inclusive no servidor antes de qualquer uso real.

## Capítulo VI — O produto que ainda precisa escutar

Chegamos a uma fronteira diferente da engenharia. A pergunta já não é apenas se o MUNDELO consegue funcionar.

É **quem reconhece esse problema, com que frequência ele acontece, quais soluções já existem e que esforço faria sentido assumir para enfrentá-lo?**

A inquietação do fundador pode justificar iniciar uma investigação. Não pode substituir a voz de outras famílias. O próximo estágio não será proclamar tração. Será conversar com adultos, compreender rotinas e alternativas, observar tarefas com dados fictícios e reconhecer também quem não encontra valor na proposta.

Se o MUNDELO pretende ajudar cuidadores a escutar melhor, precisa começar escutando os próprios cuidadores antes de pedir-lhes confiança, tempo e dinheiro.

## Epílogo — O primeiro cuidado

O MUNDELO ainda não é o destino de uma ideia: é seu compromisso com o mundo.

A cada decisão, ele precisará responder a perguntas que nenhum gráfico encerra. Quem é beneficiado? Quem pode ser excluído? O que foi efetivamente observado? O que é apenas hipótese? Que registro precisa existir e qual deveria ser esquecido?

Talvez o valor mais profundo de uma tecnologia do cuidado não esteja em multiplicar informações, mas em ajudar a reduzir a distância entre ver e perceber.

**Compreender é o primeiro cuidado. E reconhecer o que ainda não compreendemos talvez seja o primeiro princípio da responsabilidade.**

---

## Apêndice A — Validação autoral antes de publicar

Preencher somente com memória confirmada, preservando privacidade familiar:

- **Marco da inquietação:** qual episódio ou sequência real despertou a pergunta? Pode ser contado sem identificar filhos ou terceiros?
- **Primeira decisão de construir:** quando uma reflexão se tornou intenção de produto?
- **O conflito mais difícil:** que princípio fez uma funcionalidade mudar ou deixar de existir?
- **A cena do TalkBack:** como foi, com suas próprias palavras, ver/ouvir o protótipo no tablet?
- **O aprendizado após o incidente:** o que mudou em sua maneira de compreender confiança técnica?
- **O que jamais será negociável:** qual escolha não faria nem para obter adoção rápida?

**Critério editorial:** nenhum diálogo, sentimento específico, episódio da infância ou detalhe biográfico deve ser apresentado como factual sem aprovação explícita do fundador.

## Apêndice B — Destinos editoriais

- **Capítulos da obra:** expandir os seis capítulos com cenas autenticamente relatadas, provas e decisões.
- **Página institucional:** condensar em 700–1.000 palavras, preservando os limites.
- **Vídeo Founder Story:** roteiro de 90–150 segundos, sem alegar mercado validado.
- **Pitch executivo:** derivar do documento [Founder Story e GTM v0.1](mundelo-founder-story-gtm-v0-1.md).
