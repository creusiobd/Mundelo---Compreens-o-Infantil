# Contrato de contribuições, autoria e versões por perspectiva — v0.1

[Tarefa #60](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/60) · PG-06 / AUD-01/03/06/07 · 23/11/2026 · Responsável atual: Creusio Kizua.

**PROPOSTA DOCUMENTAL PARA REVISÃO.** Não altera o protótipo, aprova schema/migration/API/RLS, cria princípios INF-ID ou libera dados reais. A incorporação futura registra uma versão revisável; implementação exige recorte e revisão próprios. Os 24 cenários abaixo permanecem NÃO EXECUTADOS.

## Entrega e organização

- [Contrato conceitual, linguagem e perspectivas](contrato.md).
- [Operações, versões e efeitos](operacoes-versoes.md).
- [Legados, retenção e destinação](legados-retencao.md).
- [24 cenários futuros e sete decisões abertas](aceitacao-decisoes.md).
- [Modelo estruturado e rastreabilidade](modelo.json).
- [Andamento](../../gestao/andamentos/2026-11-23-task-60.md).

São 16 requisitos PC-01–PC-16 ligados aos sete critérios AC-01–AC-07 desta tarefa, às 14 operações de TEC-003 e a casos de aceitação CP-01–CP-24. Esses códigos são índices documentais, não novos princípios, enums ou entidades físicas aprovadas. A referência a R01–R16 indica relação com os cenários de retenção existentes, sem declarar sua execução ou cobertura integral de implementação.

## Bases incorporadas e alcance de suas decisões

| Base | Uso nesta consolidação | Limite preservado |
|---|---|---|
| [Contrato v0.1-r1](../../contrato-dominio-mundelo-v0-1.md) e [critérios](../../contrato-dominio-criterios-operacoes-v0-1.md), conciliação PR #19 | Contribuição autoral, perspectivas, autoridade por operação, preservação legítima | Aprovação localizada não torna todo rascunho/schema ou texto INF definitivo |
| [Política operacional](../../politica-operacional-retencao-destinacao-v0-1.md), PR #20, e [parâmetros C01–C10](../../parametros-retencao-categorias-v0-1.json), PR #21 | Finalidade, limites, gatilhos, destinação e responsáveis | Durações/enquadramentos candidatos não são prazos legais universais nem capacidade configurada |
| [GOV-002](../../governanca/gov-002/README.md) e [GOV-003](../../governanca/gov-003/README.md), PRs #39/#40 | Casos/exceções, decisão por escopo, verificação adicional por fase | Incorporação documental não comprova aplicação real ou pessoa independente designada |
| [TEC-003](../../especificacoes/tec-003/README.md), PR #41 | Contexto de autorização, versões, derivação em quatro dimensões e concorrência | Decisões físicas permanecem próprias; correções locais não demonstram fronteira persistente |
| [Lacuna registrada em #54](../../qa/fix-54/decisao-dominio-pendente.md) | Autoria de interpretação/alteração não registrada separadamente | Não inferir esses autores nem afirmar que #54 implantou o novo modelo |
| [Home #59](../../qa/fix-59/README.md), PR #62 incorporada em `9f7f22c4ca68c3824c26ba206b54ec38e15019b3` | Limitação de atributos globais sem fonte/data individual | Proteção/linguagem de uma tela não cria proveniência ou modelo de contribuições |
| [ADR-005](../../adr/005-identidade-e-persistencia-supabase.md) | Escolha já aceita para identidade adulta controlada | Não reabrir escolha de provedor, criar ambiente, tabelas infantis ou retomar #29 |

Cabeçalhos históricos que ainda dizem “proposta” ou “pendente” devem ser lidos junto dos registros de incorporação/complementação. Esta entrega preserva as decisões documentais anteriores e explicita sua própria proposta; não promove parâmetros candidatos nem encerra as decisões abertas por mera referência.

## Estado atual versus proposta

O [tipo Observation](../../../src/types/index.ts) mantém campos descritivos e reflexivos no mesmo registro, registrador, observador opcional, fonte textual, datas e contador de revisão. Não há nesse tipo autoria separada de interpretação/alteração nem acervo governado de versões. O [apresentador de atribuições](../../../src/presentation/observationAttribution.ts) torna essa falta explícita. Os atributos do perfil continuam globais, e a [migração atual](../../../src/validation/migration.ts) valida sem inventar metadados faltantes.

O contrato proposto organiza unidades, atribuições, relações e operações para uma futura implementação incremental. Não renomeia nem migra campos/IDs/formatos existentes; não declara que novos conceitos já funcionam. O cofre v2 e seu leitor v1 preservam integridade/compatibilidade criptográfica no protótipo, sem provar identidade, autoria, verdade, concessão ou legitimidade de alteração do conteúdo importado.

## Aceite documental da tarefa

- **AC-01 — Natureza, papéis, lacunas e verificação:** PC-01, PC-02, PC-03; cenários CP-01, CP-02, CP-03, CP-04, CP-14, CP-15.
- **AC-02 — Contribuição independente, temporalidade, derivação e perfil:** PC-04, PC-05, PC-10, PC-11, PC-12; cenários CP-05, CP-06, CP-22, CP-07, CP-15, CP-09, CP-16, CP-17, CP-19, CP-20, CP-23.
- **AC-03 — Correção, representação, contestação, administração e concessão:** PC-06, PC-07, PC-08; cenários CP-08, CP-09, CP-10, CP-16, CP-01, CP-11, CP-24, CP-17, CP-18.
- **AC-04 — Linhagem e destinação legítimas:** PC-09, PC-11, PC-13; cenários CP-08, CP-12, CP-13, CP-14, CP-16, CP-17, CP-19, CP-20, CP-23, CP-21.
- **AC-05 — Legados, lacunas de autoria e operações:** PC-14, PC-15; cenários CP-04, CP-14, CP-15, CP-18, CP-20, CP-08, CP-11, CP-16, CP-17.
- **AC-06 — Cenários futuros e decisões técnicas/jurídicas:** PC-16; cenários CP-10, CP-19, CP-21, CP-23, CP-24; decisões T01, T02, T03, T04, T05, J01, J02.
- **AC-07 — Status e limites sem aprovação de schema/dados reais:** PC-16; cenários CP-10, CP-19, CP-21, CP-23, CP-24; decisões J01, J02, T04, T05.

A conferência da entrega verifica completude e rastreabilidade documental. Ela não executa os cenários funcionais. Uma futura revisão deve resolver o alcance desta proposta, e cada fatia de implementação precisa indicar requisitos/casos, decisões liberadas, ambiente sintético e prova do efeito. Não se atribui PASS a CP/R apenas por CI ou leitura do documento.

## Responsabilidade e bloqueios

Creusio Kizua responde atualmente por produto, governança e execução. Verificação V1 pelo executor não é V2 por outra pessoa; competência V2/V3 é a designar conforme o caso. #27 continua dependente de validação competente. **#29 permanece pausada**, sem conexão ao Supabase, criação de infraestrutura ou teste externo por esta tarefa.

A recuperação integral das fontes continua própria: 73 identificadores com algum texto normativo documentado e 219 sem transcrição não significam 73 princípios canônicos integralmente conferidos. Esta consolidação não inventa nem aprova formulações faltantes e não exige essa recuperação para explicitar as lacunas atuais. Dados infantis reais, PG-06 integral, RLS e R01–R16 permanecem fora da aprovação desta entrega.
