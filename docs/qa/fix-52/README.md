# #52 — Ausência de relato não é experiência observada

Data: 21/11/2026. Base: `eca2025b918ca3fdee8c09e7ded27170617599b5`, após incorporação aprovada da PR #55. Origem: AUD-11 da PR #17.

## Comportamento entregue

- Atividades abrem proposta separada, identificada como sugestão; título/materiais não são copiados para fatos, hipóteses ou resultado. Abrir/cancelar não grava experiência.
- Novo registro começa sem data do fato, ambiente, papel do observador, tipo ou proveniência. O adulto informa esses campos e uma descrição para salvar; o modelo atual não admite desconhecido nesses campos obrigatórios. Não criar enum de desconhecido ou presumir uma resposta para contornar a lacuna.
- Campos descritivos opcionais permanecem vazios. A UI do detalhe distingue não informado de não observado. Atalhos escolhidos explicitamente pelo adulto continuam possíveis; a simples passagem por um validador não os seleciona.
- Registrador e hora de registro vêm do comando aceito no contexto demonstrativo; não são hora do acontecimento nem autoria da interpretação. Não inferir observador a partir do registrador. Mudança de proveniência na edição não transporta o observador de outra origem.
- Estratégia sem contexto/resposta preserva os campos vazios e mostra não informado/a. Não se afirma calma, experimentação ou eficácia por ausência de relato.
- Schema/cofre exigem registrador e proveniência explícitos; faltas não viram Helena/DIRECT. A migração legada valida os dados originais sem padrões de criança, pessoa, casa, mãe, data atual, descrição ou resposta.

## Compatibilidade e limites

Registros completos continuam aceitos. Cofre v1 de teste e envelope v2 continuam cobertos pela regressão; nenhum formato criptográfico foi alterado. Registros legados incompletos deixam de receber fatos inventados: devem ser conciliados com a fonte antes da importação/migração, com falha explícita onde falta campo obrigatório. Não executar migração automática ou alterar fontes antigas. Dados previamente preenchidos não são apagados nem classificados retroativamente como falsos; somente os novos caminhos são corrigidos.

Não se implementou autoria própria da interpretação, histórico de versões, novos papéis/permissões, RLS ou banco remoto. Esses aspectos permanecem em #53/#54 e nas decisões pertinentes. Aceite #52 não conclui PG-06 integral ou R01–R16. Dados infantis reais bloqueados; #29 pausada.

## Evidência

[Registro estruturado](validacao.json): 13 testes novos falham com os validadores/migrador antigos (controle negativo), e a suíte corrigida passa 115 testes de domínio/segurança. TypeScript/build locais PASS. Aviso preexistente de bundle grande. O launcher npm/tsx exige IPC indisponível no executor; o comando Node usa o mesmo importador/testes em processo.

Cinco testes E2E novos verificam: proposta vazia/cancelamento; criação por Carlos com metadados explícitos e campos opcionais vazios; edição com origem alterada; estratégia vazia e estratégia explicitamente relatada; axe-core desktop/mobile. Criação, edição e estratégia são conferidas no payload exportado/cifrado pela UI real e decifrado no teste, sem substituir o contexto/avaliador. Fixture antiga de criação foi atualizada para informar os metadados agora obrigatórios, mantendo as asserções de sucesso/autorização.

Resultados efetivos do CI no commit publicado são registrados na PR vinculada à #52 antes da entrega para revisão; testes e acessibilidade de produção não são presumidos a partir deste relatório. Nenhum dado real ou credencial foi utilizado.
