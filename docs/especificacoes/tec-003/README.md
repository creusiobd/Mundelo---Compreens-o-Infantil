# TEC-003 — Autorização, versões e propagação

Data: 20/11/2026 · Responsável atual: Creusio Kizua · [Tarefa #31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/31)

**Especificação lógica proposta para revisão. Sem implementação, migrations, esquema físico aprovado ou liberação de dados reais.** Os identificadores REQ, OP, A e D organizam este documento; não acrescentam princípios INF-ID nem fixam uma API.

## Base e limites

Base de código/documentos: `f1ffbc13dae489651d145f1d916b38a09bab31d8`. [TEC-001](../../auditoria/tec-001/README.md) identifica os controles demonstrativos e as lacunas; [GOV-002](../../governanca/gov-002/README.md) foi incorporada pela PR #39. A [PR #40 / GOV-003](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/40), aberta na conferência inicial, foi incorporada durante a preparação no commit `65f369b53b182b6094b00658b7a741a0f2e877ad`. Seus checkpoints passam a integrar esta especificação, incluindo V2 antes de eliminação/anonimização irreversível de dados reais. A aplicação por caso e a designação do revisor continuam pendentes (D07).

Preserva-se a [ADR-005](../../adr/005-identidade-e-persistencia-supabase.md): Supabase para identidade adulta e implementação controlada do espaço inicial; PKCE no desenvolvimento. Esta especificação não autoriza tabelas ou dados reais infantis. Não reabre a escolha de provedor. Categorias C01–C10, bases e durações continuam nos [parâmetros existentes](../../parametros-retencao-categorias-v0-1.json); não são criados novos prazos.

## Documentos

- [Matriz das 14 operações](matriz-operacoes.md).
- [Versões, propagação e concorrência](versoes-propagacao-concorrencia.md).
- [25 cenários propostos e oito decisões abertas](aceitacao-decisoes.md).
- [Modelo estruturado](modelo.json).
- [Registro de andamento](../../gestao/andamentos/2026-11-20-tec-003.md).

## Fronteira de confiança e contexto

A identidade autenticada, a legitimidade para o ato e o escopo concedido são verificações distintas. O avaliador confiável deve atuar onde o efeito protegido ocorre. Estado React, papel de cuidador demonstrativo, identificador recebido do cliente e vínculo familiar não comprovam autoridade. Uma indicação de modo demonstrativo vinda do cliente não contorna gates de dados reais.

Cada avaliação observa, conforme o ato, os seguintes elementos:

- `actor_identity_ref`
- `authority_scope_revision`
- `object_id`
- `expected_object_version`
- `purpose`
- `operation`
- `recipient_or_destination`
- `historical_interval`
- `category_scope`
- `policy_revision`
- `grant_revision`
- `restriction_revision`
- `origin_version_refs`
- `review_checkpoint_ref`
- `evaluation_time_and_effect_order`

O resultado permitido vale apenas para esse contexto e deve ser reavaliado na fronteira do efeito. Impedimento conhecido produz negativa; prova insuficiente produz pendência. Ambos impedem o efeito protegido e evitam revelar existência ou metadados restritos.

## Registros lógicos necessários

- Ator e identidade verificada
- Referência de autoridade/escopo
- Revisão de concessão
- Objeto e versão
- Unidade derivada e relação de fonte/versão
- Pedido/decisão por escopo
- Intenção de operação e contexto observado
- Evento de mudança e tarefa de tratamento
- Evidência minimizada de efeito/verificação

São responsabilidades conceituais, não tabelas aprovadas. Identificadores e prova minimizada podem continuar pessoais e exigem finalidade, proteção e destinação próprias.

## Requisitos rastreáveis

### REQ-01 — Identidade e autoridade na fronteira efetiva

Ator autenticado e autoridade pertinente ao ato vêm de fonte confiável; estado React, rótulo de papel e parâmetros do cliente não são prova.

Lacunas TEC-001: G01, G02.

### REQ-02 — Decisão e conclusão separadas

Negado, pendente e permitido não são resultado executado; falha/parcialidade e motivo comunicável preservam o escopo real.

Lacunas TEC-001: G08, G11.

### REQ-03 — Operações independentes e escopo mínimo

Avaliar separadamente conservar, apresentar, utilizar, compartilhar e exportar, incluindo metadados, perfil, destinatário e intervalo histórico.

Lacunas TEC-001: G02, G06, G07.

### REQ-04 — Concorrência e revalidação no efeito

Comparar versão de objeto, política, concessão e restrição na efetivação, com ordenação verificável frente à mudança; não usar só relógio ou decisão antiga.

Lacunas TEC-001: G04, G05, G07.

### REQ-05 — Versões e linhagem proporcionais

Identificar origem/versão e derivações conhecidas; contador revision não substitui o acervo legítimo de versões e relações.

Lacunas TEC-001: G04.

### REQ-06 — Propagação e quatro dimensões

Origem/autorização/restrição/destinação alteradas reavaliam validade, apresentação, utilização e retenção; não inferir falsa narrativa ou apagar todo derivado automaticamente.

Lacunas TEC-001: G04, G08, G09.

### REQ-07 — Ciclo de vida sem prorrogação tácita

Aplicar políticas C01–C10 e exceções concretas GOV-002; recálculo, réplica, nova tentativa ou reabertura não reiniciam duração por si.

Lacunas TEC-001: G09.

### REQ-08 — Evidência minimizada e estado observado

Prova protege identificadores, distingue tentativa/efeito/verificação e tem política própria, inclusive regime especial aplicável de incidente.

Lacunas TEC-001: G08, G09.

### REQ-09 — Trabalhos idempotentes e atuais

Tarefa possui intento e versão identificáveis; repetição/reordenação não duplica efeito nem contorna restrição atual.

Lacunas TEC-001: G05, G08, G09.

### REQ-10 — Lacunas e temporalidades explícitas

Desconhecido, não informado, não observado e não aplicável não são preenchidos como fatos/autoria/identidade na migração ou síntese.

Lacunas TEC-001: G10.

### REQ-11 — Correção, representação e concessão próprias

Vínculo não é autoridade irrestrita; revisão administrativa e contestação autônoma são distintas de correção própria.

Lacunas TEC-001: G03, G07, G08.

### REQ-12 — Todos os caminhos e apresentações

Aplicar regra a consulta, detalhe aberto, perfil, relatório, cópia/impressão, pacote/cabeçalho, resgate, job, metadados e restauração.

Lacunas TEC-001: G02, G05, G06.

### REQ-13 — Importação é entrada não confiável

Cifra válida/schema/versão maior não conferem identidade, autoridade para corrigir outro autor ou ativar papel/concessão.

Lacunas TEC-001: G03, G07, G10.

### REQ-14 — Revisão e gates como condições

Representar revisões exigidas por GOV-002/GOV-003 incorporadas, fase, competência e escopo; aprovação documental não comprova execução nem designa revisor.

Lacunas TEC-001: G03, G08.

### REQ-15 — Aceitação vinculada ao fluxo real

Casos testáveis apontam requisito, caminho e evidência; checks/documentos não são execução de cenários da política.

Lacunas TEC-001: G11.


## Conclusão e evidência

Decisão, comando aceito, efeito aplicado, conclusão verificada e entrega ao destinatário são fatos distintos. A interface não declara conclusão só porque recebeu uma resposta de sucesso. Escopo parcial é explicitado; falha de comprovação mantém o resultado sob verificação, sem recompor dados legitimamente eliminados apenas para produzir prova.

As conferências desta entrega verificam consistência documental, vínculos e cobertura. **Nenhum dos 25 cenários novos nem dos R01–R16 é declarado executado por esta entrega.** A CI existente não comprova os controles futuros. Aprovação desta especificação não encerra os bloqueios jurídicos, de recuperação de fontes ou de dados reais.
