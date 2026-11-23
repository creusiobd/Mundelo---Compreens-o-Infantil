# Reprodução das verificações parciais

[Resumo e resultados](README.md) · [Evidência minimizada](evidencias.json)

## Ambiente e comandos

No checkout da base examinada, acrescentar os arquivos de diagnóstico desta entrega. Usar Node 22.12 ou superior compatível com o lockfile (rodada: 22.23.5), dependências fixadas e Chromium do Playwright 1.65.0. Na raiz:

```text
npm ci --no-audit --no-fund
npx playwright install chromium
npm run build
npx playwright test --config docs/qa/qa-002/playwright.probes.config.ts
```

Não usar servidor de produção nem carregar dados reais. O servidor de preview é iniciado/encerrado pela configuração, em 127.0.0.1:4173, sem reutilizar outro servidor. Requisições do navegador a hosts externos são abortadas; carregamento remoto de fonte não é necessário à observação. Não houve envio a serviços de IA ou pessoas.

O último comando é **diagnóstico separado** e atualmente termina com código 1. O JSON completo é gerado em `docs/qa/qa-002/qa-probe-results/results.json`; anexos de observação ficam nos resultados. A [evidência publicada](evidencias.json) extrai somente observações sintéticas e asserções, sem caminhos locais, senhas ou carga de cofre. Não versionar arquivos baixados nem os artefatos locais de execução. `testDir` da CI histórica continua `tests/e2e`; estas verificações em `docs/qa/qa-002/probes` precisam do comando explícito acima. A CI verde não indica que elas passaram.

## Método

- CTRL-01 usa o caminho real de exportação autorizada. Observa arquivo/algoritmo/ciphertext, sem inferir robustez de todo o desenho criptográfico.
- P01 abre um detalhe real, muda o cuidador pelo seletor da UI, confirma lista vazia e compara a região que permaneceu aberta. Não altera store nem regra de autorização.
- P02 envolve temporariamente `SubtleCrypto.prototype.encrypt`: executa a cifra original e segura somente o retorno. Confirma a barreira, seleciona cuidador sem vínculo e mensagem de negativa; libera o retorno e observa o download. Isso controla a ordem da execução sem substituir a cifra ou o avaliador. A instrumentação desaparece ao encerrar o contexto de navegador. Não é simulação de concessão persistente nem garantia sobre todos os fluxos concorrentes.
- P03 exporta legitimamente o exemplo e analisa o envelope JSON sem descriptografá-lo. A existência de nome/ID em claro é observada, sem concluir falha do AES-GCM ou execução de anonimização.
- P04, na versão corrente após #54, confirma a identidade do documento e um relato sintético autorizado antes da troca de cuidador; depois verifica que ambos desaparecem e que não há prévia. O marcador de conforto global usado na avaliação histórica foi excluído da síntese por falta de fonte individual. As evidências históricas preservam o campo antigo; novas execuções usam reportContributionMarkerVisible/profileIdentityVisible. P04 não testa diretamente copiar/imprimir; QA-F04 cobre essas saídas.

Asserções representam o comportamento esperado; os valores divergentes ficam registrados como FAIL. Troca por seletor usa o contexto demonstrativo existente; não prova autorização no servidor. As superfícies testadas foram efetivas na aplicação compilada, sem criação de backend/fila fictícios.

## Preparação e tentativas descartadas

A instalação inicial encontrou Node local antigo e dependências nativas de Windows; o ambiente final foi reinstalado com Node 22 e `npm ci`, seguido de conferência de integridade. Versões finais estão em evidencias.json. Tentativas de configuração/acesso local e um seletor incorreto foram corrigidos antes da rodada concluída; erros de preparação não entram nas quatro falhas de produto. Não houve mudança nas fontes/lockfile para contornar o comportamento observado.

Foram desabilitadas capturas de tela/trace. Cada contexto de teste é encerrado pelo Playwright e os downloads temporários são descartados; CTRL-01/P03 também os removem explicitamente. O wrapper de cifra só existe no contexto do P02. A cópia local e os pacotes de dependências são artefatos de laboratório, sem dados reais; não se atribui eliminação governada de dados ao encerramento do teste.
