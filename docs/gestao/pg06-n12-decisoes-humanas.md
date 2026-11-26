# PG06-N12 | Decisão humana: aprovar, solicitar complementação ou manter bloqueado

**Escopo:** laboratório Supabase local e descartável, com contas e textos fictícios. Sem dados infantis reais, sem parecer jurídico, sem alterações no projeto hospedado, sem migrações de produção e sem exportações reais.

## Invariante central

Uma avaliação não determina a identidade, a experiência subjetiva ou a verdade definitiva da criança. O MUNDELO permite a coexistência de manifestações, observações, relatos, interpretações e contestações de autores distintos, preservando a origem e a autoria de cada contribuição.

A avaliação humana opera sobre a **aptidão de uma síntese derivada para um uso delimitado**, e não sobre quem a criança é.

## Máquina de decisões humanas

| Resultado | Persistência | Efeito sobre leitura, compartilhamento e exportação simulados |
|---|---|---|
| `APPROVE` | Decisão com revisor JWT, motivo, evidência, versões ancestrais exatas e perspectivas | Só chama o checkpoint PG06-N11 se autoridade, origem e versão forem válidas; mesmo assim NÃO recupera concessões revogadas |
| `REQUEST_COMPLEMENT` | Pedido de complemento textual e justificativa atribuída | Mantém bloqueio; nenhuma reabertura implícita |
| `KEEP_BLOCKED` | Motivo documentado, com proveniência | Mantém bloqueio; nenhuma reabertura implícita |

Todas as decisões são imutáveis, recebem `decision_id` único, `expected_revision` e `committed_revision`, além de `recorded_at` gerado pelo servidor. A reutilização exata de uma decisão é idempotente. Alterar o sentido do payload para o mesmo ID é negado.

**Importante:** a rota experimental anterior `pg06_n11_revalidate` teve o privilégio EXECUTE removido de `authenticated`; o único caminho de reabilitação neste laboratório é `pg06_n12_decide(APPROVE,...)` com checkpoint completo. Não há mecanismo de aprovação automático nem inferência a partir de cargos fornecidos pelo navegador.

## Autoria e diversidade de perspectivas

A fixture possui duas perspectivas distintas para cada síntese em avaliação, uma atribuída ao observador e outra atribuída ao profissional fictício. O registro de decisão conserva exatamente `id`, `author` e `provenance` para cada uma; não combina as declarações, não apaga dissensos e não gera consenso artificial.

O mecanismo exige referências válidas para a mesma criança e síntese, sem duplicação. Ele não reproduz o texto de nenhuma perspectiva nas respostas de decisão, nem cria significado definitivo. Evidências são administrativamente verificadas **apenas na fixture do CI**, não por atestação jurídica ou assinatura humana.

## Segurança transacional

- Auth via JWT validado pelo Supabase local e `auth.uid()` na fronteira da RPC, nunca identidade informada pelo cliente.
- Autoridade específica para `criança × síntese × finalidade × decisão`, independente da autoria do material e da permissão de leitura.
- Mesmo lock transacional por criança compartilhado com correção, contestação, revogação, entrega e checkpoint PG06-N11.
- Comparação obrigatória da revisão atual, geração do bloqueio, evidência vinculada e todas as versões ancestrais atuais.
- Duas decisões diferentes, iniciadas com a mesma revisão, não podem ambas confirmar. Uma decisão posterior deve partir da revisão nova e de uma análise novamente válida.
- Uma nova mudança da fonte após aprovação bloqueia novamente derivados diretos e indiretos. Replay de decisão antiga jamais remove esse novo bloqueio.
- Retenção e destinação NÃO são autorizadas pela decisão de reabrir leitura. O campo de retenção permanece sob revisão própria.
- RLS forçado nas tabelas privadas do experimento; sem `SELECT`/mutação direta por `authenticated` e `anon`. As decisões são realizadas por função experimental `SECURITY DEFINER` com checks internos.

## Matriz de teste

São testados: autorização por ato; JWT adulterado; profissional e outra família tentando decidir sem autoridade; omissão/deduplicação de perspectivas; versão antiga; evidência vinculada a outra síntese; justificativa insuficiente; complementação vazia; idempotência e mutação de decisão; bloqueio de relatório dependente; conservação de concessões revogadas; competição `APPROVE` × `KEEP_BLOCKED`; correção posterior; bloqueio de READ/SHARE/EXPORT; metadados privados; auditoria SQL independente de autoria, revisão e perspectivas.

## Limitações e próximos gates

É um experimento de contrato e concorrência, não fluxo clínico real ou de validação jurídica. Falta definir como evidências de revisão humana são assinadas e verificadas, a autoridade real por ato e relação, gestão de interesses conflitantes, notificações, tratamento de pedidos de complemento, política de apresentação UX, réplicas e fila de processamento, arquivos externos, retenção e restauração hospedados.

**NO-GO para dados infantis reais** até #27 (fundamento jurídico), #29 (backup, retenção e restauração hospedados) e #35 (prontidão). O projeto Supabase hospedado não foi acessado nem modificado.
