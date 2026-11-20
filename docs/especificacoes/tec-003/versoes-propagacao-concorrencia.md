# Versões, propagação e concorrência

[Escopo](README.md) · [Matriz](matriz-operacoes.md) · [Aceitação](aceitacao-decisoes.md)

## 1. Identidade de versão e linhagem

Cada objeto tem identidade estável e versões distinguíveis. A versão referencia a origem concreta usada, seu contexto e as condições relevantes; incrementar apenas um contador não fornece linhagem. Separar momento do acontecimento, registro e alteração. Informação desconhecida permanece desconhecida; migração não inventa autoria, datas, relação ou legitimidade por valores de demonstração.

Correção produz relação entre versões, com autoria e justificativa autorizadas, sem apagar a história por conveniência. A identidade histórica não autoriza conservar integralmente conteúdo pessoal para sempre: conteúdo e prova seguem suas próprias categorias, fundamento e destinação. Referência minimizada também requer proteção; não se estabelece marcador eterno.

Uma síntese/derivação referencia versões específicas de suas fontes. Diferenciar dependência computacional de referência interpretativa. O vínculo registra finalidade e contexto de uso, sem expor conteúdo ou metadados a quem não pode acessá-los. Acesso à fonte é necessário no escopo pertinente, mas não basta para autorizar síntese. Condições de todas as fontes pertinentes se combinam por restrição; não se unem permissões para ampliar acesso.

O índice deve reconhecer cobertura incompleta, referência ausente, ciclos e relações inválidas. Conter o escopo afetado e declarar pendência/limite, sem afirmar propagação integral, reconstruir dados eliminados ou bloquear indiscriminadamente todo o acervo. D05 define a implementação desse índice.

## 2. Quatro dimensões independentes

| Dimensão | Pergunta após mudança na origem |
|---|---|
| Validade | A conclusão ainda se sustenta? Há contestação ou versão corrigida? |
| Apresentação | Quem pode ver qual versão, ressalva e metadado? |
| Utilização | Pode alimentar nova síntese, decisão, compartilhamento ou exportação nesta finalidade? |
| Retenção | O que ainda pode/deve permanecer, até quando e sob qual destinação? |

Correção ou contestação não implica falsidade automática. Restrição de uso não significa eliminação de toda a linhagem; preservação não significa autorização de exposição. Exclusão da origem exige avaliação das derivações conhecidas: não autoriza manter reproduções pessoais por chamá-las síntese, nem apagar fatos independentes indiscriminadamente. Conhecimento institucional C10 deve ser separado dos dados pessoais; chamar algo de aprendizado não prova anonimização.

## 3. Protocolo lógico do efeito protegido

1. Receber intenção identificável: ator, ato, objeto/versão esperada, finalidade, destinatário e escopo. Parâmetros do cliente são alegações, não prova.
2. Resolver identidade/autoridade e observar versões atuais de política, concessão, restrição, origem e checkpoints aplicáveis.
3. Avaliar a operação e registrar contexto mínimo da decisão. Preparação fica privada; ainda não existe autorização permanente para entrega.
4. Preparar conteúdo/efeito. Se houver espera, criptografia ou trabalho em fila, não presumir que o contexto continua vigente.
5. Revalidar o contexto e aplicar/liberar o efeito mediante mecanismo que ordene consistentemente alteração de autorização e efeito protegido. Comparação de versões e aplicação condicional devem ser inseparáveis na fronteira pertinente, ou obter garantia equivalente documentada em D02.
6. Registrar efeito observado, escopo e estado de comprovação. Só declarar concluído o que foi verificado; a resposta não pode vazar conteúdo que já perdeu autorização.

Uma leitura seguida de espera e escrita/liberação sem guarda final falha no requisito. Relógio do cliente, trava React ou token de sessão ainda válido não estabelecem essa ordem. A guarda vale para concessões, perfis, cuidadores, restrições, importação/substituição e restauração, além de exportação e síntese.

Se revogação foi efetivada antes da liberação, o contexto antigo não pode liberar novo conteúdo protegido. Se a entrega foi ordenada antes da revogação, bytes já entregues e cópias externas não são recuperados por uma declaração do sistema; as operações seguintes observam a revogação. A prova distingue ordem lógica, envio e leitura pelo destinatário. Transmissão longa exige política explícita de checkpoints/cancelamento em D04 antes de habilitar esse caminho; não há promessa genérica de recolher bytes já enviados.

## 4. Exportação, cópia e caminhos indiretos

A exportação prepara pacote privado apenas de fontes autorizadas e guarda o contexto observado. Após criptografar, revalida versões e autorização antes de permitir download. Mudança pertinente na origem ou no destinatário torna a preparação inadequada para aquele contexto; recomputar exige nova avaliação.

Referência/ticket temporário identifica uma preparação; não é autorização autônoma. Recuperar resultado exige acesso atual. URL estática que conserva acesso após revogação não satisfaz este desenho. Não se cria novo prazo para C07 nem se muda o formato do cofre nesta especificação.

A mesma disciplina inclui detalhes já abertos, alteração de perfil, relatório, impressão, copiar, cabeçalho e metadados do cofre, mensagens de erro, jobs e restauração. Proteger apenas o botão principal deixa caminhos sem controle. A importação é entrada não confiável: esquema reconhecido, ciphertext válido, nova revisão ou papel de cuidador importado não comprovam autoridade para substituir estado.

## 5. Mudança de origem e processamento assíncrono

Mudança relevante gera evento lógico relacionado à versão e aos impactos conhecidos. Tornar indisponível o uso/apresentação incompatível antes de depender de recomputação assíncrona; enfileirar evento e manter cache restrito acessível não basta. Contenção mínima legítima não dispensa avaliação das demais dimensões e nem suspende deveres/prazos.

O processamento observa estado atual, não apenas o retrato antigo do evento. Job tem identidade e privilégio mínimos próprios e não herda indefinidamente a autorização de quem o iniciou. Evento duplicado, atrasado ou fora de ordem não restaura permissão, conteúdo eliminado ou versão superada. Reprocessamento compara versões pertinentes e não sobrescreve uma restrição posterior.

Acompanhamento informa origens e derivações conhecidas, cobertura e pendências. Recalcular não equivale a conceder acesso nem a cumprir eliminação. Cópias externas fora de controle ficam identificadas como limite de atuação, sem declaração falsa de eliminação integral.

## 6. Idempotência, falhas e comprovação

Chave de repetição vincula intenção imutável: ator, objeto, operação e escopo esperado. Mesma chave para intenção diferente é conflito. Repetir após êxito evita efeito duplicado, mas obter novamente o conteúdo do resultado exige autorização atual. Retentativa parcial atua apenas no restante legítimo e não reinicia prazos originais de categoria/caso.

Quando a prova é pré-condição do efeito, preparar seu registro mínimo antes da liberação e garantir seu vínculo ao efeito. Falha entre efeito e comprovação gera estado sob verificação, com reconciliação idempotente; não se marca conclusão só pelo envio do comando. Eliminação já legítima não é desfeita para recriar evidência. Evidência minimizada não copia narrativa/carga pessoal sem necessidade e tem finalidade e destinação próprias. O regime específico de incidentes previsto em GOV-002 é condicional; não se estende a todos os logs.

## 7. Retenção, restauração e revisão adicional

Restauração permanece isolada de apresentação/uso até reconciliar correções, concessões atuais, revogações, restrições e eliminações. Réplica, importação ou reabertura não reinicia relógio de retenção. Marcadores mínimos para evitar reintrodução também exigem fundamento, proteção e destinação; D05/D06 não autorizam conservação indefinida. Falha de reconciliação mantém o escopo afetado pendente.

Checkpoints de revisão vêm da governança aplicável e da fase do ato, sem substituição por aprovação genérica de PR ou CI. A proposta V2 antes de eliminação/anonimização irreversível da PR #40 continua pendente de incorporação em D07; especificá-la como possível checkpoint não a aprova nem inventa pessoa independente. Ausência de prova de requisito efetivamente aplicável impede o efeito protegido, sem interromper contenção mínima legítima ou deveres temporais.

## Referências técnicas e limite de aplicação

A [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) fundamenta a orientação de negar por padrão e conferir autorização em cada requisição. É referência de desenho, sem certificação do MUNDELO.

A [RFC 9110, seção 13.1.1](https://www.rfc-editor.org/rfc/rfc9110.html#section-13.1.1) define a pré-condição If-Match para representações. É candidata para evitar atualização de representação superada; sozinha não resolve versão de concessão, autorização entre recursos ou atomicidade. D02 mantém a escolha concreta aberta.
