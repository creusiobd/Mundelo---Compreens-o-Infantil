# PG06-N10 | Eventos persistentes, revisão e barreira transacional (laboratório Supabase)

**Estado:** artefatos experimentais e testes HTTP contra Supabase local descartável. Sem migração de produção, sem projeto hospedado, sem dados infantis reais, sem interface pública de exportação.

## Contrato físico demonstrativo

- `pg06_events.nodes` guarda somente fontes e derivados fictícios, com quatro estados independentes: validade, apresentação, utilização e revisão de retenção.
- `pg06_events.edges` representa ligações fonte → síntese → relatório e viabiliza o fechamento transitivo.
- `pg06_events.child_state` contém a revisão monotônica por criança; `pg06_events.events` registra `event_id` único, `actor_id` obtido de `auth.uid()` validado no Supabase, alvo, tipo, versão de política e timestamp do banco.
- `pg06_events.authorities` é um **oráculo de fixture plantado pelo administrador do CI**, não comprovação jurídica da legitimidade de responsável ou profissional.
- `pg06_events.grants` permite separar READ, SHARE e EXPORT. Nenhum grant é criado a partir de identificador/cargo informado pelo browser.
- Todas as tabelas são privadas, fora dos schemas de API e com RLS ativo, sem privilégios para `anon` nem `authenticated`. Apenas duas RPCs experimentais, com `EXECUTE` explicitamente negado a `PUBLIC` e `anon`, estão visíveis. `SECURITY DEFINER` aqui é limitado ao laboratório descartável e exige revisão adicional antes de qualquer desenho hospedado.

## Operação transacional

`pg06_n10_record_event` recebe identificador estável de evento, tipo, alvo, criança e revisão esperada. Sob lock da criança: valida a identidade e autoridade verificada para aquele ato; confirma o alvo pertencente à criança; compara revisão; grava evento; avança revisão; bloqueia os derivados diretos e indiretos; revoga concessões correspondentes em eventos do tipo ACCESS_REVOKED. **Todos esses efeitos são uma única transação.**

Eventos repetidos com o mesmo identificador e payload retornam a revisão original, sem reexecutar efeitos. Reutilizar um ID com conteúdo divergente ou enviar revisão obsoleta gera erro. Uma contestação apenas registra o conflito e bloqueia os derivados, sem reescrever a interpretação do adulto.

`pg06_n10_deliver` permite, somente em CI, simular três operações no backend: READ, SHARE e EXPORT. Não produz arquivos nem entrega a terceiros. Após adquirir o mesmo lock, **reconsulta** a unidade e a concessão vigente antes de devolver qualquer texto fictício. Uma corrida com uma mudança permite concluir uma entrega que entrou antes da revogação, mas nenhuma nova entrega após o commit de bloqueio. Bytes legitimamente entregues antes não são recuperáveis retroativamente.

A função dispõe de `p_hold_ms` como gancho de concorrência apenas para teste, **não pode existir em produção**. A revisão de origem sinalizada pelo evento é sintética e não cria uma nova versão de contribuição: o gate testa propagação e persistência, não a implementação completa do editor.

## Cenários adversariais automatizados

- JWT adulterado, profissional sem autoridade, família cruzada e acesso externo.
- READ/SHARE/EXPORT antes do evento; rejeição após correção na fonte e no relatório descendente.
- Contestação, revogação efetiva com o mesmo JWT, finalidade/concessão válida e isolamento da criança B.
- Replay idempotente, replay adulterado, revisão stale, rejeição de evento sem autoridade.
- Corrida entre EXPORT sintético já iniciado e atualização da fonte; acesso posterior ao commit de atualização bloqueado para READ/SHARE/EXPORT.
- Ausência de API pública das tabelas privadas e de vazamento de dados nos erros.

## Lacunas relevantes

Este protótipo usa `auth.uid()` e uma credencial Auth fictícia real. **Não** comprova competência jurídica ou o controle do Supabase hospedado. Não valida todos os casos de sessão revogada, toda a diversidade de agentes/profissionais, concorrência em servidores distribuídos, retentativas em filas, cascatas com múltiplos eventos no mesmo lote, disponibilização de arquivos externos nem TTL/destinação das cópias.

**Gates abertos:** #27 autoridade jurídica, #29 backup/retenção no fornecedor, #35 prontidão, homologação do banco hospedado. O conjunto não libera dados infantis reais. Não executar `supabase link`, `db push` nem alterar credenciais, infraestrutura ou plano do projeto remoto.
