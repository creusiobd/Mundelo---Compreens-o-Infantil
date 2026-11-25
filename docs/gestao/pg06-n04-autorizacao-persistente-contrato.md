# PG06-N04 | Contrato de autorização persistente e compartilhamento seletivo (v0.1)

**Estado:** contrato candidato e testes unitários isolados; sem schema de produção, RLS implantada, migrations, integração ao Supabase ou liberação de dados reais. A PR #70 foi incorporada à `main` e a CI foi aprovada. Este contrato deve ser revisado antes da implementação física.

## Delimitação do escopo

A persistência futura usará a ADR-005 (Supabase), mas neste incremento não criamos banco nem credenciais. O módulo `src/domain/persistentAccessContract.ts` é uma referência pura que **recebe** um snapshot supostamente confiável; ele não fornece a confiança. Nenhum estado React, vínculo declarado pelo cliente, rótulo de família, profissão ou objeto importado pode constituir esse snapshot.

### Fronteiras futuras (candidatas; não schema aprovado)

1. **Identidade:** `auth.uid()` ou equivalente validado no backend é separado de autoridade de conceder, de autoria de contribuição e de relação familiar.
2. **Fonte/versionamento:** cada unidade e versão possui `child_id`, natureza, restrições, categoria e seu próprio ciclo de vida. Alterar um registro não transforma a autoria de outra pessoa.
3. **Concessão específica:** identificador, decisor e evidência de legitimidade, pessoa destinatária, criança, finalidade, operações, categorias, fontes, versões/intervalo histórico, início/fim, estado e revisão.
4. **Revisões:** política, concessão e restrição têm revisões que devem ser rechecadas junto com a versão de cada fonte. Revogar não apaga a origem e não recolhe cópias já legitimamente entregues.
5. **Fronteira do efeito:** preparar não é entregar; leitura não é uso; uso não é compartilhar; compartilhar não é exportar. A avaliação e a leitura protegida devem acontecer numa operação de servidor consistente, sem TOCTOU.
6. **Resultado:** `ALLOW` ou `BLOCK` sem revelar fontes, contagens, existência, autoria ou metadados proibidos. O motivo interno não deve ser exposto indiscriminadamente ao destinatário.
7. **Derivados:** um perfil ou síntese exige autorização da finalidade, de todas as fontes/versões e da apresentação íntegra. Se faltar qualquer fonte indispensável, bloquear o derivado, sem resumo parcial revelador.
8. **Destinação:** mesmo uma versão/índice/prova de auditoria tem política e destinação específicas. Não prometer eliminação de backup até comprovação da capacidade externa #29.

## Matriz mínima proposta

| Ator e estado | READ | USE | PREPARE | SHARE | EXPORT |
|---|---|---|---|---|---|
| Destinatário autenticado com concessão explícita vigente no escopo | Só fontes/versões concedidas | Exige concessão de USE | Exige concessão de PREPARE | Exige concessão de SHARE | Exige concessão de EXPORT |
| Destinatário sem concessão, fora do prazo, criança diferente ou revogado | BLOCK | BLOCK | BLOCK | BLOCK | BLOCK |
| Registrador, responsável ou profissional apenas declarado | Não presume | Não presume | Não presume | Não presume | Não presume |
| Leitor com READ, mas sem USE | READ limitado | BLOCK | BLOCK | BLOCK | BLOCK |

**IMPORTANTE:** `SHARE` no contrato puro representa uma decisão de acesso já concedida ao destinatário, **não** um comando que atribui poderes de concessão. O ato OP-12 (criar/revogar concessão) exigirá autoridade independente e validação J01/J02; nenhuma regra "todo responsável autoriza" está adotada.

## Portas de aceitação

- Testes em `tests/pg06-n04-persistent-access.test.ts`: vínculo cruzado, sujeito, finalidade, categorias, versões, operação, tempo, expiração, revogação, fonte restrita, revisão de política e concessão, bloqueio de lote integral e redaction.
- Exigir testes adversariais com dois tenants, dois destinatários, múltiplas concessões conflitantes, metadados indiretos, retry e revogação concorrente à resposta antes da execução em banco.
- Antes de qualquer persistência: definir DDL candidato, fronteiras transacionais, índices e RLS (inclusive políticas de gravação) testadas **com identidades autenticadas isoladas**, não como cliente service-role.
- Revisão técnica independente de identidade e acesso, tratamento por categoria e ato em #27; validar políticas de retenção e restauração em #29; revisão de prontidão #35.
- Continuam sem evidência: autorização real no banco, recuperação/restauração, efeitos entre sessões, base jurídica e autorização para dados reais.

## Achado da auditoria da PR #70

A interface da PR #70 passou CI e foi incorporada. Entretanto, sua edição de interpretação utiliza o registrador para modificar o texto e pode conservar atribuição anterior de intérprete. Isso não está conforme ao princípio de não assumir a perspectiva de outro. **Regra de correção proposta:** na mesma unidade, só o intérprete explicitamente identificado pode alterar a interpretação existente; se outra pessoa discorda, deve registrar contribuição própria por `CONTEST`, não reescrever a autoria anterior. O teste do núcleo de domínio acompanha esse contrato. A correção funcional deve ser revisada separadamente do aceite jurídico.

## Relação com documentação vigente

Respeitar: [TEC-003](../especificacoes/tec-003/README.md), [Contrato de perspectivas](../contratos/contribuicoes-perspectivas/README.md), [ADR-005](../adr/005-identidade-e-persistencia-supabase.md), [política de isolamento familiar](../rls-family-isolation-policy-v0.1.md). Este documento não resolve T02/T04/T05 nem J01/J02 para produção; não altera as 24 CP nem R01–R16 para PASS.
