# PG06-N02 — Primeiro incremento sintético de integridade de perspectivas

**Escopo:** modelo puro de domínio em `src/domain/perspectives.ts` e critérios executáveis em `tests/pg06-n02-perspectives.test.ts`. Sem integração com telas, cofre, banco, IA, APIs, Supabase ou dados reais. **Não é aprovação integral PG-06.**

## Disposição das sete decisões do contrato

| ID | Deliberação restrita desta fatia | Estado global |
|---|---|---|
| T01 | Adotar alegações explícitas e estados INFORMED / UNKNOWN / NOT_OBSERVED / NOT_APPLICABLE; identidade textual não é verificada; legados conservam lacunas | PARCIAL; representação física e migração pendentes |
| T02 | Versões monotônicas e relação por ID/versão; conflito quando revisão-alvo não corresponde. Sem promessa de retenção/destinação física | PARCIAL; #29 e armazenamento pendentes |
| T03 | Unidades independentes de observação, interpretação e contexto; síntese apenas elegível quando leitura/uso/contexto declarados | PARCIAL; curadoria, síntese real e seleção ainda pendentes |
| T04 | Operações puras exigem escopo atual explícito e checam actor/child/version; não constituem fronteira confiável de autorização | PARCIAL; transações, idempotência, API/RLS pendentes |
| T05 | Sem prova persistente nem destinação nesta fatia; evidência externa deve ser minimizada e verificada futuramente | ABERTA; depende #27/#29 |
| J01 | Não inferir representação, identidade, autoridade, profissão nem consentimento a partir de papel declarado | PENDENTE de validação jurídica #27 |
| J02 | Medidas administrativas irreversíveis e revisões V2/V3 não implementadas sem competência independente | PENDENTE de revisão aplicável por caso |

**Deliberação:** as sete receberam encaminhamento explícito; nenhuma foi falsamente encerrada em escopo de produção. Os métodos `Permission` recebem decisão do chamador de laboratório; **não verificam autenticação nem persistem direitos**. Não empregar em produção sem fronteira confiável.

## Rastreio de critérios CP-01–CP-24

- Ensaios do núcleo puro: **CP-01–09, CP-12, CP-14, CP-15, CP-17, CP-18** (14 verificações de contrato, limitadas à função isolada).
- Marcados explicitamente como **TODO** no runner: **CP-10, CP-11, CP-13, CP-16, CP-19–24** (10 verificações sistêmicas, não executadas).
- Ainda que o núcleo passe, os 24 cenários originais de aceitação ponta a ponta em `aceitacao-decisoes.md` permanecem **NAO_EXECUTADO**, pois não foram executados por caminhos reais e verificação independente.
- CP-08/12 aqui demonstram apenas a lógica isolada; não provam corrida real, revogação em backend, idempotência nem efeito protegido.
- CP-17 comprova apenas elegibilidade booleana; não comprova não vazamento em API, logs, exportação, índices e metadados.

## Evidências e gates

Executar `npm test` e `npm run lint` no CI. Exigir revisão de segurança, do domínio e da modelagem antes de integrar ao fluxo real. **PG-06 integral: NÃO ATENDE. #35: NO-GO para dados infantis reais.** Nenhuma mudança em políticas de retenção, infraestrutura ou autorização de publicação.
