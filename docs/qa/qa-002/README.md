# QA-002 — Execução sintética e resultados

Responsável pelo encaminhamento: Creusio Kizua · [Tarefa #33](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/33).

**Resultado: cinco verificações parciais em navegador real, um controle positivo PASS e quatro FAIL. Nenhum R01–R16 integral aprovado: os 16 permanecem BLOCKED por pré-condições não demonstradas.** A tarefa entrega o relatório e falhas rastreáveis; não corrige nem libera o produto.

Base examinada: `50e68136dd8ce8a0a5c282c5b6a85f6092b5bbb2`, com [PR #42](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/42) incorporada. Windows 11, Node 22.23.5, Playwright 1.65.0/Chromium, Vite 8.3.8, React 19.3.1. Conferidos 64 arquivos pelos hashes de blob Git antes e depois dos testes; fontes do aplicativo e lockfile preservados. A versão gerada pelo build foi usada no preview local.

## Resultados observados

| Verificação | Resultado | Observado / encaminhamento |
|---|---|---|
| CTRL-01 — exportação autorizada | PASS | Arquivo de exemplo baixado, formato MUNDELO_VAULT, ciphertext presente, AES-GCM e cinco observações sintéticas; não certifica segurança criptográfica ou conformidade |
| P01 | FAIL | Lista ficou vazia, mas região detalhada permaneceu visível com conteúdo idêntico. [Falha #43](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/43) |
| P02 | FAIL | Após cifra real pausada, troca para cg-ana-unlinked e mensagem de acesso negado, a liberação produziu um download. [Falha #44](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/44) |
| P03 | FAIL | Envelope lido sem senha contém childName, childId e recordCount em claro; a cifra do payload não protege esses campos. [Falha #45](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/45) |
| P04 | FAIL | Depois de selecionar cg-ana-unlinked, o relatório ainda exibe o marcador sintético de fonte de conforto do perfil. [Falha #46](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/46) |

O comando de diagnóstico terminou com **código 1**, coerente com quatro asserções de comportamento esperado não atendidas. Não foram usados `test.fail`, `skip` ou inversão de expectativa para transformar falhas em PASS. A CI histórica é separada; seu sucesso não anula estas quatro falhas.

## Material de avaliação

- [Resultados estruturados dos 16 casos e falhas](resultados.json).
- [Evidências minimizadas e integridade das fontes](evidencias.json).
- [Prontidão por cenário](prontidao.md).
- [Reprodução e limites](reproducao.md).
- [Configuração específica](playwright.probes.config.ts) e [cinco verificações](probes/retention.spec.ts).
- [Roteiro original QA-001](../qa-001/README.md) e [andamento](../../gestao/andamentos/2026-11-20-qa-002.md).

## Escopo e limite da conclusão

As verificações exercitaram UI, contexto e Web Crypto reais da demonstração. Usaram apenas exemplos sintéticos. Trocar cuidador simulado não equivale a revogar uma concessão persistente: esta última capacidade não foi demonstrada. Por isso P02 informa uma faceta relevante de R06/A08, sem declarar execução integral de R06. P03 lê campos públicos sem senha e não testa anonimização ou eliminação de logs. P04 verifica apresentação, sem afirmar execução de cópia/impressão.

As quatro falhas confirmam no ambiente examinado caminhos antes apontados por inspeção em TEC-001; não constituem incidente com dados reais. Outros gaps não viraram falhas de execução por presunção. Funcionalidade sem pré-condição ficou BLOCKED, sem teste que a implemente dentro do próprio ensaio. Nenhum controle de retenção, migration ou parâmetro de categoria foi alterado.

Creusio continua responsável por produto/governança/execução. O agente executou as verificações automatizadas e registrou a evidência; isso não equivale a revisão humana V2 nem atesta que Creusio executou pessoalmente os comandos. Revisor independente permanece a designar. Gates de dados reais e validação jurídica continuam pendentes.

## Encaminhamento

Priorizar #44 (liberação do cofre) e #43/#46 (apresentação após perda de acesso), resolver proteção/compatibilidade do envelope em #45 e demonstrar capacidade de ambiente em TEC-002/#29. Reexecutar as verificações afetadas após correção; depois habilitar apenas os cenários integrais cujas pré-condições forem demonstradas. REL-001/#35 deve considerar falhas e bloqueios antes do próximo avanço.
