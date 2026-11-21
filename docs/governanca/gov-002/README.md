# GOV-002 — Exceções de retenção, contestação e medidas urgentes v0.1

Entrega da [tarefa #28](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/28). Data: 19/11/2026. Responsável: **Creusio Kizua**. Estado: proposta documental para revisão. Base: PRs #19–#21 e diagnóstico #38 incorporados, commit `1b491b198df651d9e32b67c6328ceae384948f3e`. Aprovações anteriores preservadas.

Este procedimento define decisões e evidências; não executa retenção, exclusão, comunicação externa ou acesso excepcional. Parâmetros e enquadramentos concretos continuam sujeitos à validação; controles e dados reais dependem dos gates existentes. Os rótulos EX/P/L organizam esta entrega, sem criar princípios INF-ID, enums ou APIs aprovados.

- [Matriz das dez exceções](excecoes.md).
- [Modelo estruturado e fontes oficiais](modelo.json).
- [Ficha de caso em branco](registro-caso-template.json).
- [Casos de aceite e verificação](verificacao.md).
- Bases: [política](../../politica-operacional-retencao-destinacao-v0-1.md), [parâmetros C01–C10](../../parametros-retencao-categorias-v0-1.md), [critérios por operação](../../contrato-dominio-criterios-operacoes-v0-1.md) e [diagnóstico técnico](../../auditoria/tec-001/lacunas.md).

## 1. Responsáveis atuais

| Função | Responsável | Entrega e limite |
|---|---|---|
| Recepção e acompanhamento | Creusio Kizua | Protocolo, canal acessível, prazos e próxima ação; receber não comprova autoridade |
| Revisão interna de autoridade e decisão | Creusio Kizua, nos limites da competência aplicável | Verificar solicitante, ato e escopo; enquadramento jurídico vai a GOV-001 quando necessário |
| Custódia da política | Creusio Kizua | Categoria, versão, finalidade, limite e regra; não criar fundamento por conveniência |
| Execução técnica | Creusio Kizua | Medida legitimada no ambiente autorizado; registrar tentativa e efeito |
| Conferência técnica inicial | Creusio Kizua | Caminho de verificação distinto do disparo; não é revisão humana independente |
| Verificação adicional | Competência a designar quando necessária; Creusio encaminha | Escalonar disputa de autoridade, conflito de interesse ou prova insuficiente de medida irreversível; modelo em GOV-003 |
| Validação jurídica | Competência a prover; Creusio encaminha | Não presumir contratação, controlador pessoa jurídica ou encarregado formal |

A concentração de funções foi informada pelo usuário e registrada na PR #21. Funções distintas não simulam pessoas diferentes. Se a verificação adicional necessária estiver indisponível, registrar e encaminhar a pendência; não declarar conclusão com o mesmo ato de decidir/disparar. Capacidade insuficiente não cria autorização para conservação indefinida ou suspensão automática de prazo exigível. Atos vinculantes devem ser encaminhados pelo meio competente, com alcance e prazo pertinentes.

Quando uma verificação adicional for indispensável à própria decisão ou efetivação, a operação protegida permanece pendente até satisfazê-la; só pode prosseguir contenção mínima já legitimada. Registrar em que fase a verificação é exigida, sem confundir prova pós-efeito com autorização prévia.

## 2. Admissão da exceção

Antes da operação protegida, identificar: objetos/versões, categorias, finalidade, solicitante/autoridade, motivo classificado, fonte e aplicação concreta, operações/destinatários, limite por data ou evento verificável, próxima revisão, destinação, dependências/cópias, executor/verificador e prova mínima.

Separar três classes:

- **Regra conferida na fonte:** norma localizada e teor pertinente conferido; aplicação ao agente/dado/ato/caso ainda exige verificação.
- **Hipótese candidata:** possibilidade a avaliar; não amplia acesso, bloqueia expurgo ou legitima retenção por mera alegação.
- **Proposta interna:** fluxo/meta de acompanhamento sujeito à revisão; não é exigência legal.

Para obrigação/ordem, conferir autenticidade, emissor, competência, destinatário obrigado, escopo, início/fim/evento e sigilo. Guardar referência protegida suficiente, sem difundir o processo inteiro. Conservar não concede leitura, síntese, compartilhamento ou exportação irrestritos.

Litígio abstrato, necessidade de aprender, dificuldade técnica, existência de backup ou papel familiar não bastam. Não criar cópia do conteúdo para provar que ele foi eliminado.

## 3. Fluxo do pedido ou evento

1. **Receber:** registrar instante/fuso, retorno e escopo mínimo. Acolher manifestação acessível sem exigir explicação verbal ou narrativa integral. Autoridade ainda não demonstrada não impede protocolo nem autoriza confirmar conteúdo restrito.
2. **Triar:** distinguir direitos, contestação, restrição, falha, incidente e urgência. Avaliar contenção reversível sem esperar toda a análise.
3. **Verificar autoridade:** conferir poder para a operação e alcance histórico. Manifestação da criança, representação e autorização são distintas. Divergência não se resolve por regra universal de maioria, profissão ou prevalência familiar.
4. **Mapear impacto:** localizar versões, contexto, concessões, derivados, pacotes, evidências, logs e cópias conhecidos; registrar cobertura e limites da busca.
5. **Decidir por escopo:** correção própria, revisão administrativa legitimada, contestação autônoma, restrição, eliminação, anonimização comprovável ou conservação restrita legitimada. Distinguir parte atendida de pendências.
6. **Efetivar:** conferir versão, autoridade, finalidade e restrições novamente antes de liberar o efeito. Preparar pacote/síntese não congela autorização. Falta de mecanismo técnico fica pendente em TEC-003, sem alegar execução.
7. **Verificar:** comparar decisão e efeito real nos objetos/dependências/cópias por caminho distinto do comando. Registrar falha, parcialidade, prova ausente ou necessidade de revisor.
8. **Comunicar e acompanhar:** resposta acessível com alcance, motivo comunicável, próxima ação e revisão; proteger terceiros e metadados restritos. Encerrar apenas o escopo verificado, mantendo acompanhamento residual quando necessário.

## 4. Contestação, correção e representação

Registrar contestação com autoria própria e referência ao objeto quando possível. Ela não prova falsidade, incapacidade ou infração, nem autoriza penalização. Não exigir concordância com interpretação institucional para receber a manifestação.

Correção própria registra versão alvo, agente e temporalidade. Alteração de contribuição alheia exige procedimento administrativo legitimado, fundamento e escopo expressos. Preservar o nome do registrador não torna legítima uma sobrescrita sem autoridade. A mesma regra vale para importação, merge e replace; vínculo, papel LEGAL_GUARDIAN ou revisão maior não substituem a análise.

O resultado pode corrigir, manter divergência ou aplicar outra medida cabível. Versões anteriores só ficam na extensão legitimamente permitida. Nova evidência ou pedido de revisão pode reabrir a análise sem apagar o histórico mínimo cabível ou reiniciar automaticamente prazos. Restringir uso, restringir leitura e eliminar têm efeitos diferentes.

## 5. Urgência e contenção

**EX07 — exposição/incidente:** priorizar contenção proporcional das operações indevidas, por autoridade técnica pertinente. Exemplo: interromper entrega ainda não legitimada ou indisponibilizar apresentação afetada. Evitar nova coleta desnecessária e registrar efeito/limitações. Investigar incidente e comunicação regulatória em trilha própria, paralela ao pedido do titular. O rótulo urgente não cria concessão nem dispensa revalidação antes da entrega.

**EX08 — vida/integridade:** encaminhar situação concreta à competência pertinente; não inferir diagnóstico ou risco apenas por narrativa divergente. Contenção já autorizada e divulgação excepcional são decisões distintas. Eventual tratamento excepcional exige necessidade, fundamento, autoridade, destinatário, escopo e duração compatíveis com o caso. A hipótese candidata não é permissão geral. Este procedimento não substitui resposta profissional/emergencial competente.

Após conter, reavaliar em P02. Restabelecer operação só com condições atuais e efeitos em derivados conferidos. Vencimento não reabre acesso nem legitima retenção sem limite. Impossibilidade/falha permanece explícita e escalonada; tentativa não é solução comprovada.

## 6. Prazos, duração e revisão

### P01 — PROPOSTA_INTERNA

Triagem inicial em até 1 dia útil contado do recebimento; protocolo ao receber. Registrar fuso, calendário e instante; prazo legal/ordem ou parâmetro mais curto prevalece.

Meta de acompanhamento; não é prazo universal para decidir, concluir ou conservar dados.

### P02 — PROPOSTA_INTERNA

Contenção urgente priorizada ao identificar risco; reavaliar necessidade/alcance em até 24 horas corridas após a aplicação e antes de liberar novamente a operação.

Não esperar a revisão para conter exposição quando houver autoridade e capacidade; vencimento exige escalonamento, não prorrogação tácita ou reabertura automática.

### P03 — PROPOSTA_INTERNA

Revisar exceção ativa no máximo a cada 7 dias corridos, além de eventos de mudança e do limite próprio mais curto.

Frequência de acompanhamento, nunca prazo adicional de retenção. Encerrar ao cessar o fundamento/evento, mesmo antes da revisão.

### P04 — CONDICIONAL_A_VERIFICAR

Definir marco de decisão e limite de cada medida no caso, com fonte: norma aplicável, ordem verificada ou meta interna expressa. Conservar início original e histórico de alterações.

Pedido de documento, reabertura ou nova tentativa não reinicia prazo legal automaticamente; impossibilidade/atraso exigem resposta e encaminhamento.


P03 complementa o acompanhamento semanal de C06 e admite revisão mais frequente que limites máximos anteriores, sem ampliar duração. Limite próprio mais curto prevalece: revisão do caso não estende pacote C07, backup C08 ou prazo da origem. Mudança de finalidade, destinatário, versão, origem, autorização, ordem, capacidade, falha ou evidência antecipa a revisão.

A medida precisa de marco decisório e término por data ou evento verificável com monitoramento atribuído. Se a fonte não trouxer data, explicitar evento e próxima checagem; “até resolver”, sem responsável/ação, é insuficiente. Fonte desconfirmada ou revisão vencida exige decisão de destinação, sem eliminação cega ou renovação silenciosa. Atraso não é apagado por reiniciar protocolo ou mudar início original.

## 7. Fontes oficiais e aplicação condicionada

Brasil é jurisdição de trabalho, a confirmar em [GOV-001 #27](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/27). Consulta em 19/11/2026; não é parecer de enquadramento completo.

- **[L01 — LGPD — texto atualizado da Câmara dos Deputados](https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html)**, Arts. 6, 7, 11, 14–19, 21, 46 e 48. Término/conservação, direitos e resposta, hipóteses de tratamento, proteção e melhor interesse. Confirmação/acesso têm regra específica do art. 19; não converter quinze dias em prazo geral de todos os pedidos. **Aplicação:** Jurisdição e enquadramentos concretos em GOV-001; regra identificada não equivale a hipótese aplicável.

- **[L02 — ANPD — enunciado sobre dados de crianças e adolescentes](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes)**, Enunciado CD/ANPD nº 1/2023, interpretação do art. 14. Melhor interesse deve orientar a avaliação concreta; não presumir consentimento como única base nem que vínculo familiar legitime toda operação. **Aplicação:** Verificar dado, finalidade e hipótese pertinente, inclusive sensibilidade; não libera dados reais.

- **[L03 — Resolução CD/ANPD nº 15/2024 — texto oficial no Ministério da Justiça](https://bibliotecadigital.mj.gov.br/bitstream/1/12879/2/RES_ANPD_2024_15.html)**, Arts. 4–6, 9 e 10 do anexo. Comunicação de incidente relevante: regra de três dias úteis nos arts. 6 e 9, contados do conhecimento pelo controlador de afetação de dados pessoais; verificar regras específicas e regime diferenciado, sem assumir pequeno porte. Registro de incidente, inclusive não comunicado: mínimo de cinco anos da data do registro no art. 10, observadas suas exceções. **Aplicação:** Registro especial de incidente não segue automaticamente 24 meses de C06; distinguir registro de logs brutos/conteúdo pessoal. Classificar caso e validar agente, prazo e escopo.

- **[L04 — ANPD — canal e orientações de comunicação de incidente](https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis)**, Orientação de comunicação e comprovação de representação. Comunicação formal pelo controlador via representante competente; definição de responsabilidade e poderes não decorre do cadastro de usuário do produto. **Aplicação:** Nenhuma comunicação externa é efetuada por este procedimento documental.

- **[L05 — Lei nº 15.211/2025 — Estatuto Digital da Criança e do Adolescente](https://www2.camara.leg.br/legin/fed/lei/2025/lei-15211-17-setembro-2025-797997-normaatualizada-pl.html)**, Arts. 1 e 41-A. Abrange produtos/serviços direcionados a crianças/adolescentes ou de acesso provável por eles; texto atualizado indica vigência em 17/03/2026. **Aplicação:** GOV-001 deve registrar análise de incidência no produto e regulamentação pertinente. Público adulto declarado não resolve sozinho o acesso provável; não é avaliação integral desta lei.

**Ressalva de C06/C09:** quando aplicável L03, registro especial de incidente não é descartado pela janela candidata geral de 24 meses. A guarda mínima de cinco anos do registro não migra para todos os logs, anexos ou conteúdo afetado. Registrar início, escopo e política própria, mantendo minimização e deveres adicionais. Verificar enquadramento e regime de prazo; equipe de uma pessoa não demonstra condição jurídica de pequeno porte.

O prazo específico de confirmação/acesso não vira prazo geral de eliminação/contestação. P01 não adia providência legal exigível. L05 gera pendência de análise de incidência/regulamentação em GOV-001, não certificação de conformidade.

## 8. Registro minimizado e conclusão

A [ficha em branco](registro-caso-template.json) é modelo documental, não schema de banco ou caso executado. Preencher campos pertinentes antes do efeito e justificar não aplicáveis. Separar regra na fonte, aplicação concreta, decisão, execução e verificação; referência normativa ou checkbox não comprova resultado.

Registrar protocolo, agentes, objeto/versão permitido, motivo, política, decisão por operação, datas/eventos, tentativas, resultado observado, dependências, comunicação cabível, revisão e destinação. Preferir referências protegidas a conteúdo integral. IDs/hashes vinculáveis continuam protegidos e têm política própria. Verificador não recebe acesso irrestrito por exercer essa função.

Usar os estados da política: recebido; em verificação/análise; decidido; em execução; parcial/pendente; falha de execução/verificação; concluído no escopo informado; encerrado com medida limitada ou negativa fundamentada. São estados documentais, sem novos enums aprovados.

Conclusão exige decisão/alcance claros, efeito verificado, residuais declarados e resposta/caminho de revisão registrados. Conservação residual permitida é medida limitada com acompanhamento próprio, nunca eliminação integral. Ausência de verificação exigida mantém pendência; não reduzir escopo retroativamente para declarar sucesso.

## 9. Próximas responsabilidades

- GOV-001/#27: aplicação jurídica, papéis, jurisdição, regras setoriais e incidência de L05.
- TEC-002/#29: capacidade real de cópias, expurgo e restauração.
- GOV-003/#30: modelo/disponibilidade da verificação adicional.
- TEC-003/#31: autorização, versões, propagação e efetivação em importação, relatórios, cofre e metadados.
- QA-001/#32 e QA-002/#33: roteiro executável e execução contra controles realmente disponíveis.

A entrega documental pode ser concluída sem resolver essas tarefas. Aprovação não prova implementação ou cenário executado. Os 16 cenários R01–R16 permanecem intactos; a matriz detalha seus pontos de decisão. Recuperação INF-ID não é alterada.


## Continuidade — incorporação e verificação adicional

GOV-002 foi incorporada pela [PR #39](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/39), commit `f1ffbc13dae489651d145f1d916b38a09bab31d8`; tarefa #28 concluída documentalmente. Isso não executa os casos ou habilita dados reais. O [modelo GOV-003](../gov-003/README.md), em proposta para revisão, detalha V1/V2/V3, gatilhos, fase e indisponibilidade da verificação. A designação de outro revisor e os controles reais não são presumidos.
