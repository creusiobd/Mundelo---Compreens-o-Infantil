# GOV-003 — Verificação adicional de medidas destrutivas ou disputadas v0.1

Entrega da [tarefa #30](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/30). Data: 20/11/2026. Responsável atual: **Creusio Kizua**. Estado: **proposta de governança para revisão**, baseada em GOV-002 incorporada pela [PR #39](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/39), commit `f1ffbc13dae489651d145f1d916b38a09bab31d8`.

Este documento define controles, gatilhos, fase e evidência. Não executa medidas, designa outra pessoa, contrata serviço, concede acesso ou habilita dados reais. Os rótulos V/K/OP são índices documentais, não enums ou poderes aprovados. As escolhas abaixo são propostas internas, não exigência universal atribuída a lei ou norma técnica. Aprovações anteriores e os parâmetros de retenção permanecem preservados.

Artefatos: [modelo estruturado e matriz de 14 operações](modelo.json), [ficha de verificação em branco](registro-verificacao-template.json), [casos de aceite e conferência](verificacao.md). Bases: [GOV-002](../gov-002/README.md), [exceções](../gov-002/excecoes.md), [parâmetros](../../parametros-retencao-categorias-v0-1.md), [diagnóstico técnico](../../auditoria/tec-001/README.md).

## 1. Três controles distintos e cumulativos

| Controle | Quem | O que demonstra | O que não substitui |
|---|---|---|---|
| V1 — conferência técnica distinta do disparo | Creusio Kizua | Método de comprovação separado do comando; condições atuais, resultado observado, cobertura e limitações | Outra pessoa, autoridade jurídica ou execução integral não demonstrada |
| V2 — revisão humana adicional | Pessoa efetivamente distinta, competente para o escopo, a designar | Parecer sobre a fase/objeto, com conflito de interesse e independência pessoal avaliados | V1, permissão de execução ou concessão automática de acesso |
| V3 — competência especializada | Competência pertinente a prover quando necessária | Dimensão jurídica, técnica ou profissional que não pode ser resolvida pela decisão interna isolada | V1 ou V2 quando exigidas; não é licença geral de representação |

Creusio permanece responsável por produto, decisão interna, execução, conferência inicial e acompanhamento nos limites aplicáveis. Não há revisor adicional ou especialista jurídico nomeado. Uma mesma pessoa usando duas contas, outro horário ou outra ferramenta continua sendo a mesma pessoa. IA, teste automatizado, CI ou leitura posterior do próprio trabalho podem apoiar V1; não constituem V2.

V2 significa pessoa distinta e sem conflito no escopo analisado, não auditoria externa certificada. Pertencer a organização diferente, ter credencial profissional ou declarar-se independente não basta. Uma pessoa pode atender dimensões de V2/V3 se a competência e ausência de conflito pertinentes forem demonstradas; não se presume profissional capaz de validar qualquer assunto.

## 2. Quando exigir e em que fase

Todas as condições pertinentes se acumulam. Não escolher só o gatilho mais conveniente nem dividir um caso para ocultar a parte que exige revisão. Classificação, autoridade e acesso precisam ser verificados antes da operação protegida.

| Gatilho | Situação | Revisão/fase indispensável | Limite |
|---|---|---|---|
| V01 | Eliminação irreversível/anonimização de dados pessoais reais | V2 — ANTES_DA_EFETIVACAO | Demonstração integralmente sintética pode seguir V1, identificada como tal; não libera dados reais. |
| V02 | Autoridade, representação ou alcance jurídico disputados/incertos | V2 + V3 — ANTES_DA_DECISAO | Protocolo e contenção mínima já legitimada não dependem da decisão integral do conflito. |
| V03 | Conflito de interesse relevante ou participação como parte no objeto contestado | V2 — ANTES_DA_DECISAO | A declaração de ausência de conflito é conferida; autodeclaração ou outra conta do mesmo executor não demonstram independência. |
| V04 | Correção administrativa de contribuição alheia, inclusive importação | V2 — ANTES_DA_DECISAO | Importar revisão maior, cargo ou vínculo não dispensa revisão; correção própria legítima continua separada. |
| V05 | Terceiros, metadados ou contexto com decisão de apresentação incerta | V2 — ANTES_DA_EFETIVACAO | Preparar representação alternativa não amplia permissão nem permite recorte enganoso. |
| V06 | Restauração ou propagação com cobertura/resultado não demonstrados | V2 — ANTES_DA_EFETIVACAO | Sem cobertura, manter pendência das operações afetadas, sem afirmar eliminação integral. |
| V07 | Uso/divulgação excepcional em situação urgente com fundamento incerto | V2 + V3 — ANTES_DA_DECISAO | A revisão não adia automaticamente dever exigível nem substitui resposta emergencial competente; ausência de capacidade não cria base de retenção. |
| V08 | Prova técnica insuficiente ou resultado contestado depois da execução | V2 — ANTES_DA_CONCLUSAO | Se a insuficiência for conhecida antes de efeito irreversível, aplicar V01 antes do efeito, sem deslocar a revisão para depois. |
| V09 | Mudança relevante após uma revisão ou autorização | V1 — REABRIR_FASE_AFETADA | Não repetir efeito indevidamente, reiniciar prazo ou reutilizar aprovação para versão/destinatário diferentes. |

V03 trata de interesse concreto no resultado ou participação como parte na narrativa/ato contestado, como avaliar queixa sobre a própria alteração. A responsabilidade operacional ordinária de executar e conferir V1 não aciona V03 por si só e também não comprova independência pessoal. Registrar a avaliação do conflito, sem dispensá-la por conveniência.

**Escolha proposta para irreversibilidade:** eliminação irreversível de dado pessoal real ou anonimização que impeça recomposição exige V2 antes da efetivação e V1 para comprovar o resultado. Uma política aprovada, classificação de rotina, revisão maior, retorno de API ou operação agendada não dispensam essa exigência. Caso se pretenda outro modelo para futuras rotinas automatizadas, ele precisa de revisão explícita antes da habilitação; não existe dispensa tácita neste documento. A regra não se aplica como liberação de dados reais: esse gate permanece fechado até os requisitos próprios.

Simulação inteiramente sintética pode realizar V1 sem inventar um segundo revisor. Ela informa capacidade de método/controle naquele ambiente, não atende uma revisão humana obrigatória de caso real. Reversibilidade precisa ser demonstrada; renomear a operação, oferecer botão de desfazer ou manter uma cópia indevida não basta.

Revisão antes da **decisão** examina legitimidade/alcance da medida. Antes da **efetivação**, confere o que será alterado/entregue no estado atual. Depois do efeito, a **comprovação** examina resultado e limites. V2 anterior não prova resultado posterior. Se já se sabe que V2 é necessária antes do efeito, não executar primeiro para pedir concordância depois.

## 3. Aplicação às 14 operações

| Operação | Controle de referência | Fase / limite específico |
|---|---|---|
| OP-01 — Preservar | V1; V2/V3 se exceção/autoridade disputada | ANTES_DA_DECISAO. Política e limite próprios; revisão não prolonga retenção. |
| OP-02 — Registrar | V1; V2/V3 se ato protegido depender de autoridade disputada | ANTES_DA_DECISAO. Protocolar manifestação/pedido não exige concluir toda a disputa nem concede acesso. |
| OP-03 — Preparar para compartilhamento | V1; V2 se contexto/terceiros forem incertos | ANTES_DA_EFETIVACAO. Preparação não é entrega; reclassificar antes de disponibilizar. |
| OP-04 — Consultar | V1; V2/V3 para exceção/autoridade incertas | ANTES_DA_DECISAO. Verificar também tela aberta, perfil e metadados no escopo afetado. |
| OP-05 — Utilizar em síntese | V1; V2 se contexto ou origem estiverem em disputa | ANTES_DA_EFETIVACAO. Leitura não concede utilização; referências e permissões atuais. |
| OP-06 — Compartilhar | V1; V2/V3 se autoridade, terceiro ou escopo excepcional forem incertos | ANTES_DA_EFETIVACAO. Reavaliar antes da entrega ao destinatário legítimo. |
| OP-07 — Exportar | V1; V2 conforme autoridade/terceiros/exceção | ANTES_DA_EFETIVACAO. A revisão abrange a liberação final, não só a preparação do pacote. |
| OP-08 — Corrigir | V1 para correção própria legítima; V2 para revisão administrativa alheia | ANTES_DA_DECISAO. Mudança destrutiva real acrescenta V01; autoria e dependências permanecem distinguíveis. |
| OP-09 — Contestar/solicitar correção | V1 na recepção; V2/V3 na decisão disputada | ANTES_DA_DECISAO. Pedido autônomo não é prova de falsidade nem autorização para sobrescrita. |
| OP-10 — Restringir | V1 para contenção reversível legitimada; V2 na decisão disputada ou levantamento incerto | ANTES_DA_DECISAO. Não reabrir acesso automaticamente por prazo de revisão vencido. |
| OP-11 — Eliminar/anonimizar | V1 + V2 antes de efeito irreversível em dados pessoais reais | ANTES_DA_EFETIVACAO. Dados sintéticos identificados podem usar V1; pseudonimização não é anonimização comprovada. |
| OP-12 — Conceder/ampliar | V1; V2/V3 se autoridade/escopo excepcional forem incertos | ANTES_DA_DECISAO. Nomeação de revisor não concede acesso; destinatário/operacões explícitos. |
| OP-13 — Revogar/expirar/suspender | V1 em escopo legitimado; V2/V3 na controvérsia decisória | ANTES_DA_DECISAO. Bloquear operações futuras no escopo; revogar não significa eliminar. |
| OP-14 — Reavaliar derivados | V1 e controles herdados do efeito concreto | REABRIR_FASE_AFETADA. Recálculo não elimina exigências de autoridade, apresentação ou medida irreversível. |

A matriz identifica pontos de controle; não declara as operações implementadas. Permanecem os limites do diagnóstico TEC-001. Reavaliação de derivado herda as exigências de cada efeito: recalcular não autoriza apresentação, nova finalidade ou eliminação.

## 4. V1 com a equipe atual de uma pessoa

Antes de usar este roteiro em uma operação real, demonstrar capacidade e autorização do controle no ambiente apropriado. Nesta entrega ele é documental; nenhuma das etapas foi executada contra dados reais.

- **K01:** Autoridade, finalidade, política e limites vigentes conferidos antes da decisão protegida.
- **K02:** Plano/manifesto de objetos e versões, operações e dependências conhecidos, com referências protegidas e sem cópia adicional do teor pessoal.
- **K03:** Método de execução e de verificação distintos, com capacidade e limites previamente demonstrados; simulação sintética identificada.
- **K04:** Conferência adicional exigida concluída na fase correta; revisor elegível e sem conflito verificado.
- **K05:** Revalidar autoridade, versão, destinatário e restrições imediatamente antes do efeito; mudança reabre fase afetada.
- **K06:** Observar resultado real por leitura/teste da fronteira efetiva autorizada, não apenas toast, comando ou código de retorno.
- **K07:** Verificar dependências/cópias e reaplicação antes de restauração; cobertura desconhecida impede conclusão integral.
- **K08:** Prova minimizada com política própria, sem senhas/tokens ou reconstrução do conteúdo eliminado.
- **K09:** Falha/atraso mantém escopo real, responsável e próximo encaminhamento; não reinicia automaticamente prazo exigível.
- **K10:** Conclusão e comunicação cabíveis identificadas; reabertura preserva início e histórico mínimo legitimamente aplicável.

Exemplos de prova distinta do disparo: leitura autorizada do estado final na fronteira que efetivamente governa acesso; verificação de restrição em caminhos pertinentes; conferência de objetos/versões e dependências contra o plano; reconciliação antes de reabrir uma cópia restaurada. Usar metadados/provas mínimos e ambiente sintético quando aplicável. Um botão sumir da tela, uma notificação de sucesso, um log dizendo “executado” ou uma requisição aceita não provam o efeito global.

O método deve observar a decisão efetiva sem fabricar o resultado esperado ou repetir apenas a mesma variável usada no disparo. Registre o que foi coberto, o que não pôde ser observado e por quê. Não criar cópia extra do conteúdo para facilitar revisão; identificadores vinculáveis continuam protegidos. A prova não exige que o verificador tenha leitura integral do acervo, credenciais do executor ou poder de alterar o controle.

## 5. Seleção e acesso do revisor adicional

Quando V2/V3 forem necessárias, Creusio encaminha a designação por caso/escopo. Pode ser pessoa competente de equipe futura ou externa, sem contratação presumida. Registrar:

- Pessoa efetivamente distinta do executor quando V2 exigida.
- Competência demonstrável para a dimensão analisada.
- Conflito de interesse avaliado e afastado ou encaminhado.
- Autoridade e necessidade de acesso separadamente verificadas.
- Escopo, versão, fase, limites e validade da revisão registrados.
- Acesso mínimo por canal apropriado, prazo e retirada/restrição ao terminar.
- Parecer com resultado e limites; aprovação não é poder de executar ou conceder acesso.

Se o candidato for autor da medida, executor, parte interessada na narrativa contestada ou estiver em conflito relevante, não usá-lo para validar a dimensão comprometida. Definir outra competência ou manter pendência/encaminhamento. Declaração de conflito e evidência de competência são proporcionais ao escopo, sem coletar documentação excessiva.

**Revisão não concede acesso.** Primeiro delimitar a questão e preparar o mínimo de material permitido; verificar separadamente autoridade, finalidade, canal, escopo e validade. Encaminhar síntese/redação minimizada quando suficiente. Se até esse material não puder ser legitimamente apresentado, resolver a condição por meio competente; não compartilhar para “conseguir uma avaliação”. Não enviar senha, token, cópia integral ou link público por conveniência.

O parecer identifica agente, competência/limites, escopo e versão, fase, evidências consideradas, resultado (favorável no escopo, insuficiente, conflitante ou pendente) e condições. A revisão de uma dimensão não transforma o revisor em representante da criança, decisor de toda a narrativa ou executor. Ao concluir, retirar/restringir acesso conforme o fundamento aplicável e destinar a prova segundo sua política, sem mudar as janelas de C01–C10 por este modelo.

## 6. Indisponibilidade, urgência e prazos

Operação protegida aguarda a revisão indispensável à fase; contenção mínima já legitimada é separada. Encaminhar competência e capacidade preservando prazos e respondendo limitações; não criar conservação indefinida, dispensa fictícia ou suspensão automática de dever exigível.

Se V2/V3 forem indispensáveis à decisão ou ao efeito, eles não avançam por falta de pessoa disponível. O caso registra responsável pelo encaminhamento, fase pendente, medida reversível permitida, limite próprio, próxima revisão e resposta cabível. O mesmo executor não substitui a pessoa ausente por outro login, relatório de IA ou marcação manual de aprovado.

Contenção mínima já legitimada pode prosseguir sem esperar a análise integral da disputa. Divulgação excepcional, ampliação de acesso ou destruição são decisões separadas e não recebem autorização pelo rótulo urgente. Atos/deveres exigíveis devem ser encaminhados tempestivamente à competência adequada; indisponibilidade não é prorrogação legal nem fundamento de conservação. Se o projeto não conseguir satisfazer a obrigação por seus próprios meios, registrar e escalar a necessidade de meio competente, em vez de criar dispensa interna.

Aplicar os marcos/revisões de GOV-002, os limites próprios da categoria e os prazos/ordens verificados. Não há novo prazo de retenção, período de espera universal ou reinício por designação/troca de revisor. Vencimento não reabre acesso ou aciona eliminação cega. Atraso exige resposta, próxima ação e revisão, preservando o início original.

## 7. Mudanças, pareceres divergentes e conclusão

Mudança de objeto/versão, plano, finalidade, destinatário, autoridade, restrição, cobertura, método ou conflito invalida a utilização da avaliação anterior no escopo modificado. Reabrir a fase afetada e aplicar novamente os gatilhos, mantendo registro mínimo da alteração. Revisão válida para um pacote não vale automaticamente para outro.

Pareceres divergentes não são resolvidos por maioria, posição hierárquica, profissão ou escolha silenciosa da avaliação favorável. Registrar a divergência minimizada, a dimensão em disputa e o encaminhamento competente; a operação afetada permanece pendente quando faltar condição indispensável. Não apagar contribuições nem invalidar a experiência da pessoa para obter concordância.

Conclusão exige: autoridade e decisão no escopo; revisões exigidas na fase correta; efeito observado por V1; residuais/limitações declarados; comunicação cabível e próxima destinação/revisão. Prova insuficiente mantém parcial/falha/pendência, sem retroagir uma aprovação ou reduzir o escopo para declarar sucesso. Aprovação prévia não é prova de que a ação foi executada; prova técnica do efeito não corrige uma decisão sem autoridade.

## 8. Ficha e referências

A [ficha de verificação](registro-verificacao-template.json) começa pendente, sem revisor nomeado, sem independência comprovada e sem autorização de efetivação. É modelo documental, não schema de produção. Ela complementa a ficha de GOV-002 sem alterar um caso por mera existência do formulário.

Referências técnicas consultadas em 20/11/2026:

- [NIST SP 800-53 Rev.5, AC-5 e AC-6](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final): separação de funções e menor privilégio como referências de desenho. [Texto dos controles](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf). Não se presume adoção integral, obrigação jurídica ou certificação do MUNDELO.
- [Guia orientativo da ANPD sobre segurança da informação](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-vf.pdf/@@download/file), seção de controle de acesso: orientação de permissões proporcionais à necessidade. Não se presume enquadramento jurídico de pequeno porte ou conformidade por consultar o guia.

O método, os gatilhos e a exigência V2 para irreversibilidade são escolhas propostas desta entrega, articuladas à base interna GOV-002; não são atribuídos como regra textual universal a essas referências. Validação jurídica concreta permanece em GOV-001; capacidade do ambiente em TEC-002; implementação/especificação em TEC-003 e execução verificável em QA-001/QA-002. Os casos de aceite e R01–R16 não foram executados por esta entrega.
