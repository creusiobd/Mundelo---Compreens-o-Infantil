# GOV-003 — Critérios de entrega e casos propostos

**Estado:** conferência documental. Nenhum caso abaixo, medida real ou cenário de retenção foi executado por esta entrega. A publicação da PR reexecuta automaticamente a suíte preexistente; seus checks não comprovam V2 aplicada a um caso real.

## Critérios da tarefa #30

- [x] Controle adicional compatível com a equipe atual: V1 com Creusio Kizua, dez verificações técnicas, provas/limites e simulação sintética explicitados.
- [x] Quando é necessária outra competência: nove gatilhos, fase da revisão, requisitos de elegibilidade/acesso e regra de indisponibilidade; V2 antes de irreversibilidade de dados pessoais reais como proposta interna.
- [x] Conferência do executor não é revisão humana independente: campos e texto distinguem pessoa, método e prova; nenhum revisor adicional foi nomeado.

A lista atesta conteúdo presente na entrega, não capacidade operacional demonstrada. GOV-003 pode encerrar documentalmente após revisão/incorporação; enquadramentos, disponibilidade de pessoas, controles e gates reais conservam seus próprios critérios.

## Casos de aceite propostos

Todos **NÃO EXECUTADOS**. Os IDs G30 não substituem nem acrescentam resultado a R01–R16.

| Caso | Situação | Resultado esperado | Referência |
|---|---|---|---|
| G30-A01 | Rotina reversível legitimada, uma pessoa e método distinto | V1 pode produzir prova técnica delimitada; registrar que não há revisão humana independente | V1/K01-K10 |
| G30-A02 | Eliminação irreversível de dado pessoal real sem outro revisor | V2 indispensável antes do efeito; operação protegida pendente, com encaminhamento e prazo preservados | V01 |
| G30-A03 | Mesmo roteiro executado apenas em dados sintéticos | Pode verificar método por V1, sem liberar dados reais ou suprir V2 de caso real | V01 |
| G30-A04 | Executor usa outra conta, outro dia ou relatório de IA | Não demonstrar pessoa distinta; V2 permanece não satisfeita | V03 |
| G30-A05 | Correção alheia chega por importação de revisão maior | Verificar legitimidade/escopo com V2 antes da decisão; papel/revisão não dispensam revisão | V04 |
| G30-A06 | Candidato competente tem conflito na dimensão analisada | Registrar impedimento, buscar competência adequada; não escolher parecer conveniente | V03 |
| G30-A07 | Revisor pede cópia integral ou credencial do executor | Revisão não concede acesso; delimitar mínimo e autorização/canal próprios | V2/V3 |
| G30-A08 | Urgência exige contenção reversível e solicita acesso excepcional | Separar contenção já legitimada da decisão excepcional V2/V3; não inventar base ou suspender dever exigível | V07 |
| G30-A09 | Versão/destinatário muda após parecer favorável | Reabrir fase afetada, revalidar e não reutilizar aprovação fora do escopo | V09 |
| G30-A10 | Necessidade de revisão prévia é conhecida, mas só se pede depois | Prova posterior não supre requisito anterior nem legitima decisão sem autoridade | V01/V08 |
| G30-A11 | Restauração tem dependências sem reconciliação demonstrada | Revisar cobertura antes de reabrir acesso; declarar parcialidade e falha em vez de sucesso integral | V06 |
| G30-A12 | Prazo exigível se aproxima sem revisor/capacidade disponível | Encaminhar tempestivamente à competência/meio apropriado, responder limitações e manter prazo original; não autorizar retenção indefinida | V07/V08 |

Na futura execução, identificar ambiente/versão, dados sintéticos, atores, método, resultado esperado/observado, prova minimizada e limitações. Não classificar ausência de revisor obrigatório como PASS por ter havido simulação.

## Conferência de consistência

- V1/V2/V3 distintos, cumulativos quando pertinentes; V1 não substitui V2 e não é pessoalmente independente.
- V01–V09 únicos, com fase e limites; medidas irreversíveis reais exigem V2 antes do efeito, e insuficiência conhecida não é adiada para depois.
- Matriz OP-01–OP-14 completa, sem alegação de implementação.
- K01–K10 completos, incluindo revalidação, dependências, prova e destinação.
- Ficha vazia pendente, sem efetivação, resultado ou independência comprovados; sem dados pessoais de casos reais.
- Parâmetros C01–C10, fontes INF-ID, documentos de código e testes existentes não são alterados.
- Base: GOV-002/PR #39 incorporada no commit `f1ffbc13dae489651d145f1d916b38a09bab31d8`. Fontes técnicas consultadas em 20/11/2026; não estabelecem certificação ou obrigação legal universal.

Conferir vínculos relativos e igualdade dos textos legíveis/estruturados antes da publicação. Os artefatos anteriores mantêm seus estados históricos de autoria; o acompanhamento corrente registra incorporações e pendências.
