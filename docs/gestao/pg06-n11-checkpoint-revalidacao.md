# PG06-N11 | Checkpoint explícito e transacional de revalidação

**Ambiente:** Supabase Auth/PostgREST local descartável, PostgreSQL sintético. Não é migração de produção, parecer jurídico, revisão de pessoa efetiva ou autorização de dados infantis reais.

## Regra central

Um derivado com `validity=REVIEW_REQUIRED`, `presentation=BLOCK` e `use_status=BLOCK` **não volta a circular pela simples concessão, pelo login, por recarregamento da página ou pelo reaproveitamento de uma revisão antiga**. Só a RPC experimental `pg06_n11_revalidate`, executada com identidade do JWT validado pelo Supabase, pode renovar os estados de apresentação e uso, se TODAS as condições forem verificadas pelo banco, dentro da mesma transação:

1. Ator autenticado identificado por `auth.uid()` e autoridade de revisão verificada pelo servidor para **esta criança, este derivado e esta finalidade**. Não se usa papel/função autodeclarado pelo navegador.
2. Justificativa obrigatória de 20 a 500 caracteres, ID de revisão inédito e evidência previamente aprovada por entidade administrativa independente do chamador no laboratório. Uma string enviada pelo navegador **não certifica** evidência.
3. Checkpoint vinculado à **geração exata do bloqueio**. Uma nova mudança de fonte/contestação/revogação invalida o checkpoint anterior.
4. Conjunto completo e exato de versões de **todas as fontes ancestrais** obtido no banco, confrontado tanto com o pedido quanto com a fotografia fixada pela evidência.
5. Comparação da revisão vigente da criança (CAS) e bloqueio transacional compartilhado com as operações READ/SHARE/EXPORT e com os eventos que suspendem derivações.
6. Todas as derivações intermediárias ancestrais devem estar previamente revalidadas, para que uma síntese de segunda camada não contorne o bloqueio da primeira.
7. Registro imutável da revalidação com `review_id`, revisor, evidência, versão de bloqueio, fontes/versões, justificativa, timestamp e nova revisão.

**Retenção continua `REVIEW_REQUIRED`**: revalidar o uso nunca define legitimidade, prazo de retenção, consentimento ou destinação. Uma concessão explicitamente revogada **não é recriada**; a síntese pode ter validade reavaliada enquanto a antiga pessoa destinatária permanece sem acesso.

## Modelo do laboratório

- `pg06_n11.source_versions`: marcadores de versão append-only de fontes sintéticas. A edição integral do conteúdo não está implementada. Um evento `SOURCE_REVISED` acrescenta um marcador, não reescreve a manifestação.
- `pg06_n11.holds`: geração do bloqueio transacional, checkpoint vigente ou invalidado.
- `pg06_n11.review_authorities` e `verified_evidence`: credenciamento e evidências **administrativas sintéticas**, privados. Não validam identidades legais nem competência de profissionais reais.
- `pg06_n11.reviews`: trilha transacional de checkpoints, proibida para clientes diretos.
- `pg06_n11.source_snapshot`: função privada que percorre todo o grafo até as fontes, com versões atuais, sem disponibilizar esses metadados no HTTP.
- `public.pg06_n11_revalidate`: única RPC experimental de retorno ao estado de apresentação/uso. Função privilegiada com `search_path` fixo, `auth.uid()`, verificações de autoridade, evidência e dependências, e `EXECUTE` negado a `PUBLIC` e `anon`.

Nenhum schema PG06-N11 está na exposição pública de tabelas PostgREST, e as tabelas mantêm RLS forçado sem políticas para os clientes.

## Testes adversariais exigidos

- Profissional destinatário, outra família, não autorizado e JWT adulterado não podem executar revisão.
- Ausência de justificativa, versão errada, referência omitida, evidência de outro derivado, ID inexistente e CAS stale não reabilitam o conteúdo.
- Derivação de segundo nível não pode reabrir enquanto a primeira estiver bloqueada.
- Repetir mesmo `review_id` com mesmo payload é idempotente; trocar justificativa/evidência falha.
- Nova correção após revalidação bloqueia novamente todo descendente e invalida prova antiga, mesmo que o ator reproduza a chamada legítima.
- REVOGAÇÃO prévia continua a impedir READ/SHARE/EXPORT apesar de uma revisão posterior válida.
- Corrida REVIEW x SOURCE_REVISED sob revisão idêntica permite apenas um commit; evento posterior ao checkpoint suspende nova entrega.
- Corrida READ x nova alteração após revisão mantém bloqueio em todas as novas requisições depois do commit.
- Consulta HTTP a tabelas e provas privadas não revela nomes, fontes, versões nem evidências.
- Auditoria SQL independente confere autoria JWT, revisões, histórico, isolamento entre crianças, bloqueios e ausência de concessões restauradas.

## Limites e próximos gates

Há uma diferença deliberada entre **evidência sintética de teste** e validação real por profissional competente. Não há provas jurídicas reais, nem assinatura de revisão, fluxo de contestações humano, integração hospedada, storage/exportação real, recuperação de conteúdo distribuído, gestão de sessão revogada, resolução de conflitos entre responsáveis ou teste de relógio confiável externo.

As funções `SECURITY DEFINER` em `public` servem exclusivamente ao laboratório RPC. Sua adaptação para produção requer análise de privilégios por função/schema, revisão de política RLS, integração de assinatura/atestado e verificação de sessões. Supabase hospedado não é alterado.

#27 autoridade jurídica, #29 retenção/backup hospedado e #35 prontidão **continuam bloqueados**. Dados infantis reais: **NO-GO**.
