# Correção #61 — Linguagem de registro e remoção demonstrativa

[Tarefa #61](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/61) · PG-06 / AUD-09 qualificado / AUD-10 retificado · 23/11/2026 · Responsável: Creusio Kizua · Base `76d2b161343043c282a1bb279ad73fd68e9173ab`.

## Resultado

A notificação de criação passa de “Observação canônica registrada com proveniência e autoria” para **“Observação registrada na memória desta sessão de demonstração.”** O registro continua recebendo os mesmos campos e identificadores. O termo técnico de schema, isoladamente, não era prova de consenso automático; a troca torna a mensagem visível mais clara sem renomear modelos/formatos ou reescrever legados.

O comentário e a negativa de remoção agora refletem o [helper existente](../../../src/security/authorization.ts): cuidador ACTIVE e vinculado ao perfil, que seja responsável legal ou a pessoa indicada por recordedByCaregiverId. O segundo caso se refere a quem registrou o item na demonstração; não prova autoria da interpretação, observação de terceiro ou experiência da criança, nem implanta o [contrato de perspectivas #60](../../contratos/contribuicoes-perspectivas/README.md).

A confirmação e o retorno de sucesso delimitam a ação à memória desta sessão. A confirmação explicita que isso não comprova eliminação de cópias/backups. Não houve operação de retenção, eliminação governada, anonimização ou comprovação externa. A exclusão/remoção continua sujeita ao mesmo helper; o texto não cria poderes de produção.

## Textos e caminhos

| Caminho | Ajuste |
|---|---|
| [AppContext](../../../src/context/AppContext.tsx) | Mensagem de criação, comentário/erro de remoção e retorno de sucesso |
| [Confirmação no App](../../../src/App.tsx) | Alcance da remoção e limite de cópias/backups |
| [Diário](../../../src/screens/JournalScreen.tsx) | Tooltip de negativa inclui atividade/vínculo e registrador |
| [Detalhe](../../../src/components/ObservationDetailModal.tsx) | Mesmo limite no tooltip de remoção |

O helper `src/security/authorization.ts` permaneceu byte a byte igual à base (SHA de blob no JSON). Os quatro arquivos de aplicação mudaram apenas texto/comentário. Um teste histórico foi atualizado para esperar a nova redação e conferir a presença do registro no Diário; suas negativas foram preservadas. Modelos, schema, migração, formato de cofre, fixtures e identificadores foram preservados.

## Antes e depois: política preservada

A matriz foi exercitada antes e depois por comandos reais do AppProvider na entrada de teste existente, sem mock do avaliador. Casos positivos retiraram somente o alvo; casos negativos preservaram integralmente as observações. A contagem no ensaio de provider inclui os dois perfis sintéticos, não só os registros visíveis do perfil ativo.

| Ator/condição | Antes | Depois | Efeito esperado |
|---|---|---|---|
| Responsável legal ativo vinculado, registro de outra pessoa | true | true | Retira o alvo da memória |
| Registrador ativo vinculado, registro próprio | true | true | Retira o alvo da memória |
| Pessoa vinculada que não é responsável legal nem registradora do alvo | false | false | Não altera registros |
| Cuidador sem vínculo | false | false | Não altera registros |
| Cuidador suspenso | false | false | Não altera registros |

Não se tratava de uma ausência de permissão para o registrador: a divergência era do comentário/erro antigo com o helper. A correção não altera esse helper para caber no texto.

## Testes observados

O [novo teste E2E](../../../tests/e2e/record-language.spec.ts) contém oito casos, todos PASS:

1. Criação pela UI com mensagem demonstrativa, conteúdo fornecido e registrador preservados.
2. Remoção por responsável legal de registro alheio, com confirmação e efeito em memória.
3. Registro próprio criado/removido por educador ativo vinculado.
4. Negativa após mudar para não autor durante confirmação já iniciada.
5. Negativa após mudar para cuidador sem vínculo.
6. Negativa após mudar para cuidador suspenso.
7. Matriz dos cinco retornos reais do provider e igualdade dos registros remanescentes.
8. Confirmação/negativa e acessibilidade pertinente em desktop e mobile.

A confirmação iniciada em contexto autorizado não contorna a negativa após troca do cuidador. Os ensaios de UI acionam controles reais; a matriz usa o harness de contexto já existente, apenas em desenvolvimento, sem hooks novos na aplicação de produção. [Evidências minimizadas](validacao.json) registram estados/resultados/duração, sem conteúdo de pessoas reais.

Além dos oito casos novos, os três testes [DEVICE-REAL-02](../../../tests/e2e/device-real-02-authorization.spec.ts) passaram após atualizar a expectativa da notificação antiga e conferir o registro no Diário. São **11 verificações locais de navegador aprovadas** em duas execuções, com resultados separados no JSON. A primeira CI apontou apenas a expectativa histórica de mensagem, que foi corrigida sem afrouxar permissões.

Tipos e build locais aprovados. Para reproduzir em checkout preparado com Node compatível e dependências do lockfile:

```text
npm run lint
npm run build
npm run test:e2e -- record-language.spec.ts
```

Os novos testes integram a suíte E2E existente. A CI completa é acompanhamento separado, sem equivalência a testes de retenção R01–R16 ou ao contrato CP-01–CP-24.

## Limites e continuidade

PR #63/#60 já incorporada na base; seu contrato não foi implementado por esta mudança de linguagem. #53/#54 não reabertas. Não houve nova concessão, infraestrutura, dados reais, mudança de formato/modelo ou retomada de #29 pausada. Permissões client-side continuam demonstrativas, sem declaração de autoridade de produção ou PG-06 integral concluído.
