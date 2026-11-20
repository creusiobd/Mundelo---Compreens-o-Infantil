# Ambiente e execução

[Índice](README.md) · [Procedimentos](roteiro.md)

## 1. Fixar a versão e preparar o ambiente sintético

Usar checkout isolado da versão sob teste, inicialmente `59efcd56b006768540863fbc1e2fcbb144ae3007`, Node 22 conforme CI e dependências do lockfile. Não apontar o ensaio para serviço produtivo nem carregar exportações de pessoas reais. Conferir configurações locais de integração sem registrar segredos. A execução pode exercitar recursos de IA somente quando substituídos no laboratório por saída sintética determinística; essa substituição não pode implementar o controle sob teste.

A [configuração Playwright](../../../playwright.config.ts) inicia `npm run build && npx vite preview --port 4173 --host 127.0.0.1 --strictPort` com `NODE_ENV=test` e `VITE_APP_ENV=test`. Não reutiliza servidor existente. As [fixtures existentes](../../../tests/e2e/fixtures/synthetic-data.ts) e [sessão de teste](../../../tests/e2e/fixtures/test-session.ts) usam exemplos demonstrativos; selecionar cuidador simulado não demonstra autenticação/autoridade no servidor.

Regressão existente, em checkout preparado:

```text
npm ci
npx playwright install chromium
npm test
npm run lint
npm run build
npm run test:e2e
npm run test:a11y
```

A instalação do navegador pode exigir dependências do sistema no ambiente escolhido. Esses comandos são do repositório examinado, não testes novos de R01–R16. Registrar seus resultados separadamente. Neste trabalho a CI da PR é a evidência de regressão existente; o roteiro não declara uma execução local desses comandos.

## 2. Gerar fichas sem inventar resultados

Na raiz do checkout, com Python 3 disponível:

```text
python docs/qa/qa-001/preparar_execucao.py --saida qa-runs/rodada-001
```

A pasta de saída deve ser nova; o preparador não sobrescreve resultados. Ele verifica estrutura do roteiro e marcação do conjunto sintético, copia o manifesto e cria 16 fichas com observado nulo, evidências vazias e resultado NAO_EXECUTADO. É verificação de preparação; não prova semanticamente ausência de dados reais e nem executa a aplicação. O responsável deve conferir o conteúdo e isolamento antes do uso.

## 3. Pré-condições comuns para aceitação

Antes de cada caso, o executor preenche na ficha:

- Commit/ambiente efetivamente examinados, política e versões de concessão/origem/restrição, início do relógio de laboratório, executor e método de conferência.
- Caminho real da operação na UI/API/armazenamento implementados; indicar arquivo/commit ou procedimento do provedor. Campos ficam nulos enquanto não existem, sem criar endpoints fictícios.
- Adaptador de carga/limpeza do conjunto lógico e manifesto dos objetos por escopo. Nenhuma importação implícita de papel/cuidadores como autoridade. O conjunto JSON é modelo lógico de laboratório e não formato de produto.
- Fronteira em que o efeito é observado, permissões para observá-la e cobertura de versões, cópias, caches, cabeçalhos, relatórios e logs. Ausência de evidência em uma tela não prova ausência em todo o sistema.
- Pontos de barreira, relógio controlável e falha determinística quando requeridos. Para R06, pausar antes da liberação final, confirmar revogação e só então liberar; guardar ordem de eventos, não depender de velocidade do clique ou de sleeps arbitrários. Testar também ordem inversa sem prometer recolher bytes entregues.
- Decisões pendentes D01–D08 pertinentes e gatilhos V01–V09 classificados por objeto/fase. Checkpoint obrigatório ausente impede o efeito protegido. Simulação não valida base jurídica nem resolve representação/conflito.

A falta de uma pré-condição impede execução daquele caso: registrar BLOQUEADO, motivo e próxima ação. Não criar teste que define localmente a regra esperada e depois a verifica como se fosse a aplicação. Instrumentação pode controlar tempo/erro, mas precisa exercitar o caminho real protegido. Não inserir fixtures pela alteração manual do estado React e usar esse resultado como prova de autorização persistente.

## 4. Sequência por caso

1. Gerar rodada nova e escolher a ficha Rxx. Conferir pré-condições e registrar prontidão; se faltar capacidade, parar esse caso e informar bloqueio.
2. Carregar somente a variante sintética por adaptador autorizado; capturar manifesto inicial com identidades/versões e escopos, sem criar cópias desnecessárias do conteúdo.
3. Marcar EM_EXECUCAO apenas ao iniciar passos reais. Executar os estímulos do roteiro e controles positivos/negativos previstos, registrando ordem e injeções utilizadas.
4. Ler efeito por caminho distinto do disparo, comparando estado antes/depois e caminhos indiretos. Separar efeito aplicado, entrega, comprovação e conclusão comunicada.
5. Preencher observado, esperado/observado por critério, escopo, evidências, limites e próxima ação. Conferência técnica V1 pode ser feita por Creusio, mas não constitui V2.
6. Limpar exclusivamente artefatos sintéticos da rodada no ambiente isolado, removendo pacotes/downloads e revertendo injeções/barreiras. A limpeza é separada do efeito sob teste; registrar seu resultado. Preservar só prova sintética mínima na política da rodada. Não apagar artefatos alheios nem repetir efeito irreversível por falha de log.

## 5. Resultado de caso e resultado de rodada

| Estado | Quando registrar |
|---|---|
| NAO_EXECUTADO | Preparado, mas nenhum passo de aceitação foi iniciado |
| BLOQUEADO | Pré-condição ausente, com motivo/encaminhamento, sem fingir execução |
| EM_EXECUCAO | Caminho real em exame, ainda sem conclusão |
| PASS | Todos os critérios aplicáveis observados, controles positivos/negativos concluídos, prova suficiente e revisão aplicável registrada |
| FAIL | Divergência real observada frente ao esperado; registrar mesmo se houver outros bloqueios |
| INCONCLUSIVO | Execução iniciada, mas falta observação suficiente ou houve interrupção; sem PASS |

Prontidão e resultado são campos separados: o roteiro pode ter prontidão bloqueada e ainda estar NAO_EXECUTADO. PASS em parte de um cenário não promove o caso inteiro; registrar subcritérios e cobertura parcial. Nenhum NAO_EXECUTADO/BLOQUEADO/INCONCLUSIVO entra como PASS no denominador da rodada. Relatar contagens em todos os estados; impedir encerramento integral se algum critério não foi verificado. CI e validação do preparador têm resultados próprios.

## 6. Prova mínima e encaminhamento

Ficha inclui referência opaca a evidência, versão/ambiente, ator sintético, política, operação/objeto/versão, ordem, critério observado, escopo, limites, executor, conferente e próxima ação. Não registrar senha, token, carga real ou prova que reconstrua dado eliminado. Mesmo evidência de laboratório não deve ser misturada à produção. Campos de caminhos/evidências são preenchidos só após existir observação.

Para R04/R07/R14, efeito confirmado sem prova final suficiente fica sob verificação; não restaurar conteúdo eliminado para recuperar log. Para R08/R09, capacidade e residual do provedor são pré-condições explícitas, não pressupostos. Para R13, simular comunicação/alcance sem envio a terceiros reais. Para R15/R16, ensaio técnico não certifica anonimização, aprendizagem ou eliminação de causa.

Governança segue [GOV-002](../../governanca/gov-002/README.md), [GOV-003](../../governanca/gov-003/README.md) e parâmetros vigentes. Sem pessoa distinta designada, não afirmar revisão independente. Decisão real de base, duração e autoridade volta ao responsável/competência pertinente. QA-002/#33 receberá a execução e o registro de falhas conforme os controles disponíveis; preparar QA-001 não encerra QA-002 nem libera dados reais.
