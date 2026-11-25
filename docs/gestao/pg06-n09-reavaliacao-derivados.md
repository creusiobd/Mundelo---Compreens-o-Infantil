# PG06-N09 | Reavaliação de derivados após mudanças de fontes e permissões

**Estado: incremento sintético, sem integração persistente ou IA.** Não altera Supabase hospedado, políticas de retenção em produção, conteúdo histórico, cadastro infantil nem o bloqueio de dados reais.

## Contrato de comportamento

O mecanismo `src/domain/derivativeReassessment.ts` recebe uma fotografia confiável das unidades e concessões, além dos eventos de alteração. Ele percorre as dependências transitivas de cada unidade derivada C04 e calcula quatro dimensões **independentes**:

| Dimensão | Resultado e limite |
|---|---|
| Validade interpretativa | `CURRENT` apenas conceitualmente; o motor retorna `REVIEW_REQUIRED` quando há mudança ou contestação e `UNVERIFIABLE` para fontes ausentes/restritas/destinadas |
| Apresentação | `BLOCK` para todo derivado afetado até revalidação, sem expor fonte ou título |
| Utilização | `BLOCK` para todo derivado afetado, inclusive síntese/exportação subsequente |
| Retenção/destinação | `REVIEW_REQUIRED`; não elimina automaticamente o histórico nem justifica conservação indefinida |

**Eventos suportados:** `SOURCE_REVISED` (versão anterior e substituta), `INTERPRETATION_CONTESTED` (contestação autônoma), `ACCESS_REVOKED` (destinatário/finalidade), `SOURCE_RESTRICTED` e `SOURCE_DISPOSED`.

O disparo de correção NÃO atualiza a fonte referida automaticamente. A contestação NÃO anula a interpretação original nem promove a versão da pessoa contestadora como fato. A revogação NÃO apaga conteúdo, mas impede novos usos protegidos nas etapas de entrega. O modelo conserva a distinção entre manifestação da criança, observação, relato e interpretação por adultos.

### Matriz de casos de teste

| Alteração | Efeito nos derivados dependentes | Outros filhos/derivados |
|---|---|---|
| Correção de observação | revisão de validade; apresentação/uso bloqueados | inalterados |
| Contestação de interpretação | revisão contextual, sem escolher narrativa vencedora | inalterados |
| Revogação de autorização | uso e apresentação bloqueados para destinatário/finalidade pertinentes | outras finalidades sem evento não recebem suspensão por inferência |
| Restrição ou destinação | estado `UNVERIFIABLE`; uso bloqueado; retenção sujeita a revisão | isolados |
| Replay de evento | avaliação idempotente, sem novas unidades | inalterados |
| Falta de ancestral | invalidação conservadora e bloqueio | não revelar ancestral |

O cálculo interno contém IDs de contribuições e motivos, mas `redactReassessment` devolve apenas `BLOCKED` a chamadores sem autorização. Esta projeção **não autentica chamadores**: a verificação de acesso real deve acontecer no servidor e suas respostas precisam passar por auditoria contra vazamentos.

## Aceite técnico e dependências

Os testes puramente sintéticos estão em `tests/pg06-n09-derivative-reassessment.test.ts`, executados via `npm test` e Quality Gates. Esta etapa mede coerência do domínio, **não** transações serializadas com o banco.

Para tornar o contrato operacional é necessário implementar:

1. Registo transacional dos eventos com `event_id`, revisão, ator autenticado, proveniência e checkpoint, com ordem e deduplicação.
2. Algoritmo transacional/assíncrono de propagação com reprocessamento idempotente, barreira antes de READ/USE/SHARE/EXPORT e revalidação na fronteira de efeito.
3. Auditoria da autorização por fonte, versão, finalidade, tipo de operação e relação entre participantes. O modelo demonstrativo de `ScopedGrant` ainda não representa toda a autoridade jurídica.
4. Estado `REVIEW_REQUIRED` preservado até revisão legitimada, nunca reabilitado automaticamente apenas por restauração ou regrant.
5. Testes concorrentes: REVOKE x PREPARE x EXPORT, mudança de política durante a avaliação, cache e read replicas; verificações de arquivos, metadados e derivados.
6. Validação jurídica da tarefa #27 e retenção/backup do provedor #29; decisão de prontidão #35 e homologação hospedada com identidades sintéticas.

**Nenhum dado infantil real está autorizado.** Os gates de segurança e governança permanecem abertos.
