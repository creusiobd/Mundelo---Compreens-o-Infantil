# UX-001 — pedidos, restrições e acompanhamento

Data: 21/11/2026. Issue [#34](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/34). **Revisão documental e proposta de experiência para aprovação; sem telas funcionais novas ou teste humano.** Base: main `b6921b3b5100ace9c6bee46c8445b4e00c34dbb8`; GOV-002/PR #39, GOV-003/PR #40 e TEC-003/PR #41 incorporadas. Responsável pelo encaminhamento: Creusio Kizua.

## Avaliação da experiência atual

O aplicativo oferece CRUD, seleção para relatório, mensagens transitórias e cofre demonstrativos. Não oferece protocolo persistente de pedidos, decisão de legitimidade, acompanhamento de execução por cópia, contestação independente ou revisão verificável. O estado de um toast não comprova conclusão. A correção de aparência de sucesso tratada no histórico DEVICE-REAL-02 e as falhas QA-002 reforçam que autorização, ação aceita e apresentação devem ser conferidas separadamente.

A proposta se apoia nos procedimentos já incorporados: [GOV-002](../../governanca/gov-002/README.md), [GOV-003](../../governanca/gov-003/README.md), [TEC-003](../../especificacoes/tec-003/README.md), [pluralidade](../../principio-pluralidade-perspectivas-v0-1.md) e [contrato de domínio](../../contrato-dominio-mundelo-v0-1.md). Nenhuma mensagem cria poder administrativo, concessão profissional, base jurídica ou prazo novo.

## Fluxo simples proposto

1. **Escolher o que deseja fazer.** Opções distinguíveis: corrigir registro próprio, contestar interpretação, pedir revisão de acesso/uso, solicitar destinação de conteúdo, acompanhar pedido. Não exigir que a pessoa saiba o nome técnico de uma operação.
2. **Informar o mínimo necessário.** Contexto permitido, escopo, finalidade e canal acessível de resposta; categoria/operação/período quando conhecidos. Campos desconhecidos permanecem não informados; não inferir autoridade nem exigir relato íntimo para preencher um formulário.
3. **Rever o pedido.** Mostrar o que foi solicitado, o que ainda precisa ser verificado e o que o envio efetivamente faz. Contestação é uma contribuição própria e não altera automaticamente o registro contestado. Enviar pedido não libera dado nem concede acesso.
4. **Receber referência de acompanhamento.** Somente quando o serviço tiver persistido o pedido; data do recebimento, estado atual, próximo passo e responsável/canal. Repetir a tentativa não deve criar efeitos duplicados. Sem persistência comprovada, informar falha de recebimento, sem inventar número de protocolo.
5. **Acompanhar por escopo.** Distinguir recebido, verificação, decisão, execução, conferência e resultado. Se houver bloqueio, indicar ação necessária a quem pode conhecê-la; não confirmar existência de conteúdo restrito ao solicitante sem acesso.
6. **Revisar ou contestar resultado.** Caminho acessível a partir do acompanhamento; preservar autoria e histórico legítimo, sem exigir concordância com uma interpretação para receber suporte. Pedidos de revisão recebem sua própria avaliação de legitimidade e escopo.

Os passos são uma proposta de navegação; não são uma máquina de estados implementada. Não se somam automaticamente às permissões existentes. O papel profissional não confere histórico integral nem acesso a pedidos de outras pessoas.

## Linguagem por estado real

| Situação observada pelo serviço | Mensagem candidata | Condição e limite |
|---|---|---|
| Recebimento persistido | “Recebemos seu pedido. Você pode acompanhar por esta referência.” | Referência real; sem afirmar decisão ou execução |
| Autoridade não demonstrada | “Precisamos verificar as informações necessárias para avaliar seu pedido.” | Solicitar somente prova pertinente; nenhuma leitura adicional é liberada |
| Impedimento confirmado | “Este pedido não pode ser atendido neste contexto. Veja as opções de revisão disponíveis.” | Motivo detalhado somente a quem tem direito de recebê-lo; não revelar objeto restrito |
| Verificação adicional indisponível | “A análise aguarda a verificação necessária. A medida protegida continua pendente.” | Não designar revisor inexistente ou simular uma segunda pessoa |
| Decisão favorável, sem efeito aplicado | “O pedido foi aprovado para este escopo. A execução ainda não foi concluída.” | Mostrar escopo permitido; aprovação não equivale a exclusão ou entrega |
| Efeito parcial ou falha | “Parte do pedido foi executada. Há etapas pendentes de conferência.” | Indicar cobertura/pendências autorizadas, inclusive cópias residuais aplicáveis |
| Resultado sem prova suficiente | “Ainda estamos verificando o resultado.” | Não declarar conclusão com base em toast, remoção de tela ou resposta genérica |
| Conclusão verificada | “Concluímos as medidas descritas para este escopo.” | Data, escopo, limites e prova minimizada cabível; nunca “apagamos tudo” sem comprovação |
| Restrição de utilização | “O uso indicado está restrito.” | Não chamar de eliminação; não restringir automaticamente outras operações |
| Contestação recebida | “Seu ponto de vista foi registrado para avaliação.” | Não afirmar que a interpretação anterior é falsa, corrigida ou aceita como identidade |

O prazo só aparece quando definido e aplicável ao caso. Distinguir prazo esperado, evento de revisão e eventual prazo confirmado; não derivar data de uma duração genérica. Nunca prometer atendimento “em 24 horas” a partir da política de expiração de pacotes C07.

## Preservação da compreensão infantil

- A manifestação tem origem na criança; a autoria de observação, relato e interpretação permanece identificável quando permitida. A tela distingue essas dimensões sem apresentar inferência adulta como fala literal da criança.
- Uma contestação não exige uma interpretação substituta. “Não sabemos o que isso significa” é um resultado admissível, e silêncio/ausência de resposta não são concordância.
- Perspectivas podem divergir sem votação, ranqueamento, perfil único ou pressão por consenso. Uma visão profissional não substitui automaticamente a familiar ou a narrativa da pessoa.
- Revisão/correção preserva a história da contribuição somente dentro do que é legitimamente conservável; continuidade biográfica não autoriza retenção indefinida.
- Relevância contextual e proteção de terceiros podem exigir entrega parcial ou nenhuma entrega. O recorte permitido não deve distorcer a unidade como se fosse completa.

## Acesso, acessibilidade e provas propostas

| Caso de revisão | Critério verificável | Referência |
|---|---|---|
| UX01 — pessoa sem acesso pede revisão | Nenhuma resposta, referência enumerável, notificação ou prévia confirma objeto restrito; oferecer canal sem expor terceiros | A01/A10, REQ-02/12 |
| UX02 — contestação de interpretação | Permitir divergência e desconhecimento; separar manifestação/relato/interpretação e autoria; não sobrescrever fonte | A09/A10, REQ-10/11 |
| UX03 — aprovação sem execução | Acompanhamento mostra decisão e efeito separadamente; nenhuma mensagem de conclusão antecipada | A12/A17, REQ-08/09 |
| UX04 — cópia residual ou falha | Resultado parcial com limite/escopo e próximo passo, sem afirmar eliminação integral | R07–R09, REQ-06/08 |
| UX05 — perda de acesso com tela aberta | Suprimir conteúdo e metadados no detalhe, relatório, impressão, cópia e avisos subsequentes | A05/A14/A21, REQ-12 |
| UX06 — acesso profissional limitado | Somente categorias/finalidade/período/operações concedidos; pedido não amplia concessão | A06/A13, REQ-01/03 |
| UX07 — revisor adicional ausente | Medida protegida permanece pendente; interface não apresenta o executor como V2 | A22, GOV-003 |
| UX08 — falha e reenvio | Preservar texto digitado quando seguro, indicar falha real e evitar duplicação de efeitos; sem sucesso fictício | A16/A17, REQ-04/09 |
| UX09 — leitor de tela/teclado | Labels, foco previsível, erros associados a campos, anúncio adequado e caminho de revisão utilizável; sem depender só de cor ou gesto | Gate UX-REAL-01B |
| UX10 — tempo/desconhecimento | Sem data inventada, concordância presumida ou interpretação obrigatória para concluir o formulário | A10, REQ-10 |

**UX01–UX10: NÃO EXECUTADOS.** Conferência documental verifica que os critérios estão especificados; não comprova a experiência. Protótipo e pesquisa com adultos precisam de ambiente sintético e roteiro neutro. TalkBack/NVDA/VoiceOver exigem evidência humana própria; testes axe/CI não a substituem.

## Cobertura do aceite de #34

Linguagem e fluxos: avaliados e propostos nesta revisão. Indeterminação, manifestação e divergência: regras acima. Fluxo simples, estado real e caminho de revisão: passos 1–6 e tabela de linguagem. A entrega pode ser aprovada como **especificação de experiência**; implementação, pesquisa e prontidão de dados reais permanecem pendentes.
