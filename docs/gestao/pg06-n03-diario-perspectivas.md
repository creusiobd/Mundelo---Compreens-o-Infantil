# PG06-N03 | Diário de perspectivas e contestações

**Status:** implementação de interface em branch/PR; aceitação depende de CI, revisão e prova do navegador. **Somente dados sintéticos**. Dados infantis reais continuam NO-GO.

## Entrega
- Superfície `Perspectivas e diálogos` no Diário, separada das observações legadas, relatórios, perfis globais e cofre.
- Formulário para observação descritiva, interpretação opcional explicitamente adulta e contexto informado.
- Contribuições independentes por cuidador demonstrativo, revisão append-only pelo registrador e contestação vinculada a uma versão específica.
- Histórico de versões consultável sob vínculo e status vigentes; sem apresentar divergência como erro ou consenso presumido.
- Remontagem por identidade/estado ao trocar criança/cuidador; rascunhos e detalhes antigos não persistem na interface.
- O `AppContext` disponibiliza histórico filtrado por criança, com negação por padrão para cuidador suspenso ou sem vínculo.

## Evidências exigidas
`npm test`, `npm run lint`, `npm run build`, `npm run test:e2e`, `npm run test:a11y`.
Casos `tests/e2e/journal-perspectives.spec.ts`: autoria distinta, contestação sem sobrescrita, versões, troca de criança, troca de cuidador, suspensão/ausência de vínculo, rascunho descartado e cliques concorrentes.

## Limitações intencionais
- Não há credenciais reais, persistência externa, autenticação de servidor, RLS, sincronização entre abas/dispositivos, exportação das perspectivas nem destinação física.
- O teste de dois cliques cobre concorrência intra-sessão, **não** corridas distribuídas: exigem armazenamento transacional e testes próprios.
- O histórico em memória não é compromisso de retenção ou direito de acesso futuro. Concessão, contestação legal e eliminação demandam J01/J02/T02/T05 e #27/#29.
- Presença de contribuição de terceiros não confere poder profissional ou autoridade representativa.
- Os 24 cenários CP originais e os R01–R16 continuam não homologados ponta a ponta.
- Esta etapa não modifica as mensagens de política de publicação, Pages, Supabase, backup, relatórios ou cofre.

## Requisitos de revisão
Especial atenção a vazamento por seletor, histórico após troca de contexto, dupla submissão, foco/teclado no formulário e versão concorrente. Não considerar PG-06 integral aprovado pela CI automatizada.
