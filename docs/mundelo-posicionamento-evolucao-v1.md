# MUNDELO | Posicionamento e evolução do produto v1.0

**Decisão de produto:** aprovada pelo fundador em conversa, registrada em 16/11/2026.  
**Escopo:** identidade institucional, priorização e hipótese de funcionalidade complementar.  
**Estado da mudança:** documentação proposta para revisão. Não equivale a lançamento de funcionalidade.

## 1. Declaração institucional

**MUNDELO é uma plataforma de compreensão infantil** concebida para ajudar responsáveis e cuidadores a observar acontecimentos do cotidiano, preservar contexto, distinguir fatos de hipóteses e reconhecer singularidades das crianças.

**Continuidade e Consciência do Cuidado Familiar** é a direção de uma **capacidade complementar futura**: apoiar a rememoração voluntária dos cuidadores, a articulação de perspectivas autorizadas e a continuidade das práticas de cuidado sem deslocar a criança do centro.

**Relação entre as frentes:** compreensão infantil = razão de existir; consciência e continuidade familiar = mecanismo futuro de fortalecimento dessa compreensão.

**Slogan institucional vigente:** “Compreender é o primeiro cuidado.”  
**Complementar:** “Cada criança, um mundo. Cada vínculo, uma descoberta.”

## 2. Problema, visão e hipótese

**Problema a investigar:** acontecimentos infantis, contextos e percepções de cuidadores podem se dispersar ou confundir-se com interpretações; a informação fragmentada pode dificultar diálogo e continuidade.

**Visão:** tornar o cuidado mais consciente e contextual, preservando o direito da criança a não ser reduzida a registros e o direito do cuidador a não documentar tudo.

**Hipótese testável:** registrar somente o necessário e diferenciar acontecimento, reação do cuidador e hipótese pode ajudar adultos a conversar sobre situações concretas sem antecipar julgamentos.

**Não comprovado:** redução de ansiedade, melhora clínica, ganhos de desenvolvimento, retenção, intenção de pagamento, adequação para dados reais.

## 3. Escopo do produto por horizonte

| Horizonte | Entrega | Situação |
| --- | --- | --- |
| Agora: compreensão infantil | Diário, Meu Mundo, Descobertas, Compreender, Relatório, Privacidade com dados sintéticos | Demonstração construída; testes limitados |
| Descoberta | Entrevistas com cuidadores adultos e testes de tarefas em demo fictícia | Roteiro pronto, **NOT_EXECUTED** |
| Pesquisa de funcionalidade complementar | Investigar rememoração, contexto emocional e continuidade entre cuidadores | **HIPÓTESE**, sem especificação aprovada para implementação |
| Eventual MVP com dados reais | Contas, autenticação e autorização no servidor, segregação, consentimento, retenção e eliminação | **BLOCKED** até requisitos de segurança/privacidade e governança |

## 4. Contrato de experiência para a funcionalidade futura

A experiência deve ser **voluntária** e oferecer inclusive a opção “não registrar”. Não apresentar questionários emocionais obrigatórios nem indicar que um adulto que não registra ama ou cuida menos.

Distinguir claramente:

1. **Fato observado sobre a criança:** o que ocorreu, em que contexto e qual reação foi observável. Pode ser compartilhado apenas conforme autorização e finalidade.
2. **Experiência subjetiva do cuidador:** o que sentiu, pensou ou receou. Não define intenção, personalidade ou desenvolvimento da criança. **Privado por padrão**, inclusive diante de outros cuidadores autorizados a observações infantis.
3. **Hipótese:** possível interpretação, identificada como incerta, revisável e jamais apresentada como diagnóstico.
4. **Síntese de continuidade:** seleção voluntária de observações relevantes para um diálogo. A inclusão de reflexões privadas requer consentimento específico, e o padrão deve ser **não incluir**.

Não criar escore emocional, ranking de cuidadores, recomendação terapêutica ou mecanismo que deduza estados psicológicos. A plataforma não substitui acompanhamento profissional.

## 5. Regras arquiteturais a investigar antes da implementação

- Especificar entidades distintas `ChildObservation`, `CaregiverPrivateReflection` e `CareSummary`, com finalidades, ciclos de vida e autorizações próprios.
- **Não reutilizar** permissões de observações infantis para autorizar leitura de reflexões privadas.
- Proteção não apenas visual: exigir controle de acesso no servidor, autenticação e segregação entre famílias e crianças.
- Mapear risco de exposição em exportação, backup, cache, relatório, busca, logs e compartilhamento.
- Desenhar retenção, exportação e exclusão diferenciadas. Nenhuma coleta infantil real nesta demo.
- Revisar LGPD e melhores interesses da criança com especialista antes de qualquer piloto real.

## 6. Perguntas a investigar na pesquisa (sem indução)

- Quando outros adultos precisam compreender acontecimentos do cotidiano, que contexto costuma faltar?
- Em que situações diferentes cuidadores interpretam o mesmo episódio de maneira distinta?
- Que detalhes um cuidador prefere manter consigo e o que consideraria útil compartilhar?
- Quando registrar ajuda e quando se torna mais uma obrigação?
- Que informação tornaria uma conversa mais clara sem aumentar preocupação?

**Critério de priorização:** só propor funcionalidade após evidência de necessidade concreta, aceitação de esforço e viabilidade de privacidade. Se a experiência de rememoração elevar culpa ou sobrecarga, revisitar a hipótese.

## 7. Posicionamento no go-to-market

**Apresentação principal:** “MUNDELO: plataforma de compreensão infantil.”  
**Demonstração principal:** fluxo de observação contextual com dados fictícios.  
**Roadmap explicado, sem prometer disponibilização:** “Estamos investigando uma capacidade complementar de continuidade e consciência do cuidado familiar.”

Não realizar pesquisa comercial misturando os dois conceitos desde a primeira pergunta: entrevistar sobre o problema real antes de mostrar a solução ou pedir reação ao nome da funcionalidade.

## 8. Gate de decisão

- **GO:** manter a identidade institucional e entrevistar adultos sobre contexto, observação e diálogo.
- **CONDITIONAL:** prototipar uma experiência de rememoração somente com personagens fictícios e consentimento para pesquisa de tarefas.
- **NO-GO:** disponibilizar reflexões emocionais identificáveis para outros cuidadores por padrão, coletar dados infantis reais, diagnosticar, ou afirmar resultados psicológicos sem comprovação.

**Referências:** [Dossiê de Maturidade](mundelo-dossie-maturidade-v0-1.md), [Protocolo de Pesquisa](mundelo-pesquisa-cuidadores-protocolo-v0-1.md), [Manifesto de Princípios](manifesto-principios-mundelo-v1.md), [Principles Gate](principles-gate-v1.md).


## 10. Aprofundamento da missão: compreender a experiência e melhorar a interação

A compreensão infantil no MUNDELO não se limita a reunir descrições sobre a criança. É uma investigação cuidadosa sobre como ela experimenta e participa do mundo: como se comunica, aprende, ensina, sente, explora, cria vínculos e responde aos diferentes ambientes.

A plataforma deve ajudar a aproximar experiências sem uniformizá-las. Família, escola e profissionais podem perceber aspectos distintos porque ocupam relações, responsabilidades e contextos diferentes. O valor está em preservar essas diferenças e permitir que elas contribuam para perguntas melhores e interações mais conscientes.

**Direção de impacto pretendida:** melhorar a qualidade das interações da criança com o mundo, apoiando adultos a escutar melhor, comunicar-se de outras formas, ajustar contextos e reconhecer possibilidades. Isso é uma intenção de produto a ser pesquisada e validada, não um resultado clínico ou de desenvolvimento já comprovado.

### 10.1. Ciclo de compreensão e interação

1. Experiência da criança em contexto.
2. Percepção e comunicação, reconhecendo múltiplas formas de expressão.
3. Registro contextualizado, com autoria e distinção entre observação e interpretação.
4. Aprendizagem recíproca: adultos aprendem com a criança e revisam suas próprias práticas.
5. Experimentação cuidadosa de possibilidades de interação, sem prescrição clínica.
6. Revisão do que foi percebido, preservando incertezas e diferenças entre contextos.

### 10.2. Pergunta orientadora de cada funcionalidade

"Esta funcionalidade ajuda alguém a compreender melhor como esta criança experimenta o mundo e a melhorar a interação com ela, sem padronizá-la, rotulá-la ou apagar a particularidade de cada vínculo?"

Se a resposta for não, a funcionalidade precisa ser revista, mesmo que aumente engajamento, volume de dados ou eficiência operacional.
