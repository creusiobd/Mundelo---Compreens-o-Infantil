# Compatibilidade, conservação e destinação

[Contrato e estado](README.md) · [Casos futuros](aceitacao-decisoes.md)

## 1. Legado é evidência de seu conteúdo disponível

A compatibilidade mantém IDs, valores e referências realmente existentes com seus limites de origem; não converte defaults históricos, rótulos de papel ou contadores em fatos verificados. A interface de #54 mantém “Não registrada separadamente” para autoria de interpretação/alteração enquanto o modelo não fornecer fonte adequada. #59 delimita atributos globais, sem lhes atribuir autores.

| Elemento atual | O que pode ser mantido como informação existente | O que não pode ser preenchido retroativamente |
|---|---|---|
| recordedByCaregiverId | Referência informada de registrador, com seu alcance demonstrativo e lacunas de identificação | Autor de notes/experiência ou editor de cada revisão |
| observedByCaregiverId / observerRole | Observador informado quando existir; papel declarado apresentado separadamente | Pessoa observadora inferida por “mãe”, profissão, vínculo ou registrador |
| reportedByLabel / provenance | Fonte textual/proveniência declarada e cadeia conhecida | Conta autenticada, credencial, certeza factual ou consentimento de pessoa citada |
| description / sinais / resposta / notes | Conteúdo existente, distinguindo descrição e reflexão registradas | Experiência interna/diagnóstico, fala literal ou interpretação da criança pelo texto do adulto |
| occurredAt / recordedAt / updatedAt | Datas informadas com sua dimensão/precisão e limites conhecidos | Data do acontecimento pela ingestão/edição; autor da alteração por uma data |
| revision | Contador estrutural informado | Acervo de N versões, legitimidade de sobrescrita, editor passado ou aprovação factual |
| Atributos globais ChildProfile | Informação global sem fonte/atribuição individual separada quando esse é o estado real | Contribuição assinada pelo criador da conta, consenso familiar ou preferência/frequência atual |
| Cofres v1/v2, senha e schema | Integridade criptográfica/compatibilidade avaliadas pelos leitores existentes | Veracidade, autoria, identidade/representação, concessão ou poder administrativo a partir do arquivo |

Origem presumida por um caminho legado conhecido deve permanecer reconhecida como limitação, não ser promovida silenciosamente a informação fornecida. Sem prova para distinguir uma afirmação original de preenchimento inferencial antigo, registrar incerteza e buscar reconciliação legítima; não escolher arbitrariamente uma versão dos fatos.

## 2. Transição proposta, sem executar migração

1. Inventariar campos/versão do formato, fonte disponível e medidas/restrições conhecidas, sem copiar teor pessoal para a auditoria.
2. Mapear fielmente informação existente e lacunas por dimensão; separar a data atual da ingestão de qualquer temporalidade histórica.
3. Conferir acesso, finalidade, legitimidade de conservação e cobertura de exclusões/restrições antes da disponibilização. Arquivo tecnicamente íntegro não contorna essas condições.
4. Quando faltam dados estruturais obrigatórios ao validador atual, usar reconciliação/procedimento futuro próprio e manter a operação dependente pendente. Não alterar o validador nem aceitar payload inválido por esta tarefa; uma área de ingresso restrita, se proposta, precisa de revisão T01/T04 e política própria.
5. Se surgirem evidências legítimas de atribuição, registrar quem informou/conferiu, quando, fonte e escopo da nova alegação/verificação. Não atribuir uma data retroativa fictícia nem fingir que esse fato constava no registro original.
6. Liberar somente a fatia/representação que tenha condições demonstradas; lacuna que limita síntese não impede automaticamente todo registro legítimo. Não adotar bloqueio universal por falta de explicação verbal.

A nova autoria da operação futura é registrada a partir de sua execução legitimada; ela não se propaga a autores de versões ausentes. Mudança de identidade/credencial atual tampouco reescreve o papel no acontecimento. Conciliação e migração não restauram conteúdo anteriormente destinado nem reativam concessões/restrições superadas.

## 3. Aplicação das categorias existentes

As categorias são as já documentadas nos parâmetros, sem novos prazos, bases jurídicas ou política de produção. A associação abaixo delimita responsabilidades e não constitui um schema ou uma classificação jurídica final.

| Categoria | Aplicação ao contrato de perspectivas | Limite |
|---|---|---|
| C01 — contribuições/anexos | Conteúdo autoral, descrição, relato e interpretação | Finalidade/contexto/legitimidade próprios; não conservar por mera importância narrativa |
| C02 — versões | Conteúdo de versões anteriores e diffs que permitam reconstruí-lo | Só extensão/período legítimos; versionar não impõe append-only perpétuo |
| C03 — contexto/autoria/linhagem | Atribuições, fontes, relações, índices e marcadores | Podem identificar/revelar; têm acesso e destinação próprios |
| C04 — unidades derivadas/sínteses | Perfil curado, recortes, seleções e resultados derivados | Não são abrigo para conteúdo que deveria ser destinado; quatro dimensões separadas |
| C05 — autorizações/verificação | Evidência/escopo da autoridade, concessão e restrições | Autoria/identidade não implicam acesso universal; metadados de verificação também protegidos |
| C06 — pedidos/decisões/provas | Contestação, correção, revisão e evidência do efeito | Prova minimizada, sem refazer a carga pessoal; regimes específicos dependem do caso |
| C07 — exportações/temporários | Pacotes, preparação e cópias temporárias | Preparar/cifrar não autoriza liberar; cópia externa tem limite de governança distinto |
| C08 — backups/réplicas | Cópias de versões/contexto/derivados | Residual e reconciliação precisam de capacidade comprovada; #29 continua pausada |
| C09 — logs/telemetria | Eventos técnicos e falhas | Logs não armazenam teor pessoal para sempre nem recebem automaticamente regime de qualquer registro de incidente |
| C10 — conhecimento institucional | Método e aprendizagem separados da carga pessoal | Correção não prova aprendizagem/eliminação de causa; retirar nome não prova anonimato |

As durações/enquadramentos candidatos e as exceções GOV-002 continuam nos documentos de origem. A leitura desta tabela não confere validade jurídica ou capacidade de expurgo/backups. #27 permanece pendente; #29 pausada não foi retomada.

## 4. Linhagem sem conservação indevida

Preservar a integridade da atribuição e da história aplica-se ao que ainda pode ser legitimamente conservado. Se conteúdo precisa ser destinado, não escondê-lo em versões, patches, relações, índices, anexos de prova, relatórios ou caches. Marcador mínimo pode permanecer somente quando fundamento/finalidade/limite permitirem; não se estabelece tombstone eterno.

Hash, código ou identificador opaco não comprovam anonimato e podem permitir associação/reconstrução. Evidência não deve reproduzir o conteúdo para provar que ele foi removido. Uma cadeia de referências pode ter conteúdo indisponível por destinação legítima; não recuperá-lo apenas para tornar a cadeia completa. O que o leitor pode conhecer dessa indisponibilidade também depende do escopo de acesso.

Eliminação de uma origem não impõe apagar indiscriminadamente todas as afirmações independentes nem autoriza conservar reproduções do dado em derivados. Avaliar por unidade/versão e pelas dimensões de validade, apresentação, utilização e retenção. Não marcar toda uma pessoa/perspectiva como falsa por um pedido, mudança de vínculo ou revisão.

## 5. Cópias, falhas e encerramento

Retenção residual de backup, se cabível, precisa ser delimitada e comunicada; não declarar eliminação integral enquanto uma medida exigida permanece pendente. Restauração fica isolada das operações protegidas até reconciliar correções, restrições, eliminações e concessões atuais. Réplica/ingestão/reabertura não reinicia automaticamente o relógio aplicável.

Dependência desconhecida, falha ou prova insuficiente mantêm limite/pendência no escopo afetado. Retentativa opera sobre o restante legítimo, sem duplicar efeito nem apagar histórico de decisão permitido. Não restaurar teor já eliminado para fabricar um resultado verificável.

Entrega externa já efetuada tem alcance real registrado, sem promessa de apagamento remoto fora da governança. A comunicação de medidas deve evitar revelar fontes restritas ou dados de terceiros. Decisão fundamentada, execução e conclusão comunicada permanecem estados diferentes.
