# Aceitação e decisões abertas

[Escopo](README.md) · [Modelo estruturado](modelo.json)

## Evidência exigida

Todos os casos abaixo estão **NÃO EXECUTADOS**. A futura execução deve registrar versão, ambiente, autoridade dos atores de teste, esperado/observado, contexto vigente, escopo e prova minimizada. Usar dados sintéticos enquanto os gates de dados reais estiverem fechados. Caso sintético não substitui revisão humana independente aplicável ao caso real. Teste documental ou CI verde não encerra QA-001/QA-002 nem comprova R01–R16.

### A01

- Dado: Identidade/condição ainda não demonstrada, ou restrição conhecida.
- Quando: Solicitar operação protegida.
- Esperado: Pendente quando falta prova; negado quando impedimento conhecido; nenhum efeito protegido em ambos.
- Verificação negativa: Não confirmar existência/conteúdo restrito na resposta.
- Rastreabilidade: REQ-01, REQ-02; OP-02, OP-04; retenção R02.
- Estado: **NAO_EXECUTADO**.

### A02

- Dado: Autoridade de criar e contexto legitimados, com lacunas explícitas.
- Quando: Registrar contribuição.
- Esperado: Criar versão inicial com autoria real e lacunas; sem selecionar para relatório/sintetizar automaticamente.
- Verificação negativa: Sem permissão de criar, não registrar em contexto alheio.
- Rastreabilidade: REQ-01, REQ-03, REQ-10; OP-02; retenção R01, R02.
- Estado: **NAO_EXECUTADO**.

### A03

- Dado: Finalidade/categoria/período verificados.
- Quando: Conservar contribuição.
- Esperado: Manter somente escopo legitimado com apresentação/uso separados.
- Verificação negativa: Sem fundamento aplicável, revisão vencida não cria conservação indefinida nem eliminação cega.
- Rastreabilidade: REQ-03, REQ-07; OP-01; retenção R01, R08.
- Estado: **NAO_EXECUTADO**.

### A04

- Dado: Fontes e uso autorizados para preparação.
- Quando: Preparar uma unidade.
- Esperado: Gerar representação provisória com fontes/versões, sem conceder/entregar.
- Verificação negativa: Mudar destinatário/escopo exige nova avaliação antes de disponibilizar.
- Rastreabilidade: REQ-03, REQ-04, REQ-05; OP-03; retenção R06.
- Estado: **NAO_EXECUTADO**.

### A05

- Dado: Usuário consulta objeto/perfil/detalhe e depois perde acesso.
- Quando: Apresentar novamente a informação.
- Esperado: Novas apresentações não expõem conteúdo, metadados ou perfil fora do escopo.
- Verificação negativa: Listagem vazia e botão oculto não bastam se o detalhe/perfil continuam expondo dados.
- Rastreabilidade: REQ-03, REQ-12; OP-04; retenção R05, R06.
- Estado: **NAO_EXECUTADO**.

### A06

- Dado: Leitura permitida, mas uso em síntese não autorizado.
- Quando: Gerar/apresentar síntese.
- Esperado: Impedir uso indevido; permitir somente se finalidade/fontes/audiência forem legitimadas.
- Verificação negativa: Visibilidade da fonte ou texto anonimizado apenas por código não supre autorização.
- Rastreabilidade: REQ-03, REQ-05; OP-05; retenção R12, R15.
- Estado: **NAO_EXECUTADO**.

### A07

- Dado: Compartilhamento tem terceiros e contexto indispensável.
- Quando: Disponibilizar unidade ao destinatário.
- Esperado: Entregar só escopo explícito com contexto íntegro e permitido.
- Verificação negativa: Se o recorte permitido distorce a unidade, não entregar como completa; decisão parcial/alternativa cabível.
- Rastreabilidade: REQ-03, REQ-11, REQ-12; OP-06; retenção R05, R11, R13.
- Estado: **NAO_EXECUTADO**.

### A08

- Dado: Pacote é preparado/cifrado e concessão é revogada antes da liberação.
- Quando: Tentar resgate/download.
- Esperado: Se revogação efetiva precede a fronteira de liberação, negar o novo efeito e tratar pacote C07.
- Verificação negativa: Trava encerrada antes da cifra, link estático ou avaliação anterior não contornam o evento.
- Rastreabilidade: REQ-04, REQ-12; OP-07, OP-13; retenção R06.
- Estado: **NAO_EXECUTADO**.

### A09

- Dado: Autor corrige versão própria, ou outro ator pede alteração de contribuição alheia.
- Quando: Efetivar correção.
- Esperado: Nova versão/rastreabilidade para ato legitimado; autoridade administrativa específica quando aplicável.
- Verificação negativa: Papel LEGAL_GUARDIAN ou contador maior não autorizam sobrescrita alheia.
- Rastreabilidade: REQ-04, REQ-11, REQ-13; OP-08; retenção R03, R04.
- Estado: **NAO_EXECUTADO**.

### A10

- Dado: Pessoa apresenta contestação acessível.
- Quando: Protocolar e encaminhar revisão.
- Esperado: Pedido com autoria própria e estado explícito; sem invalidar a narrativa anterior automaticamente.
- Verificação negativa: Não exigir concordância/explicação verbal universal nem confirmar conteúdo a não autorizado.
- Rastreabilidade: REQ-02, REQ-10, REQ-11; OP-09; retenção R02, R11.
- Estado: **NAO_EXECUTADO**.

### A11

- Dado: Restrição legítima alcança só utilização em síntese.
- Quando: Efetivar restrição.
- Esperado: Bloquear o uso abrangido e reavaliar dependências sem chamar isso eliminação.
- Verificação negativa: Não ampliar acesso de quem analisa nem restringir indiscriminadamente operações fora do escopo.
- Rastreabilidade: REQ-03, REQ-06, REQ-14; OP-10; retenção R12.
- Estado: **NAO_EXECUTADO**.

### A12

- Dado: Eliminação cabível alcança versões/derivados e cópia residual admissível.
- Quando: Executar e verificar medidas.
- Esperado: Resultados por escopo, pendências e conservação residual explícitos.
- Verificação negativa: Não declarar eliminação integral por remover a tela ou se cópia sob governança aguarda medida exigida.
- Rastreabilidade: REQ-06, REQ-07, REQ-08; OP-11; retenção R04, R07, R08, R14.
- Estado: **NAO_EXECUTADO**.

### A13

- Dado: Concessão autoriza só categorias/operações futuras.
- Quando: Consultar histórico/ampliar escopo.
- Esperado: Negar histórico não incluído; nova concessão depende de autoridade e escopo próprios.
- Verificação negativa: Vínculo, profissão ou concessão de colega/instituição não herdam permissão.
- Rastreabilidade: REQ-01, REQ-03, REQ-11; OP-06, OP-12; retenção R02, R05.
- Estado: **NAO_EXECUTADO**.

### A14

- Dado: Sessão/cache/resultado preparado existe quando a autorização expira ou muda.
- Quando: Solicitar novo efeito protegido.
- Esperado: Reavaliar estado vigente; negar o escopo afetado sem promessa de apagar bytes/cópia já entregues.
- Verificação negativa: Token ainda válido ou cache existente não bastam como autorização.
- Rastreabilidade: REQ-03, REQ-04, REQ-12; OP-04, OP-07, OP-10, OP-13; retenção R06, R13.
- Estado: **NAO_EXECUTADO**.

### A15

- Dado: Origem é corrigida/restrita e há síntese de versão anterior.
- Quando: Reavaliar derivados conhecidos.
- Esperado: Tratar validade/apresentação/uso/retenção separadamente, com estado/versão e cobertura.
- Verificação negativa: Re-renderização/recalcular não supre registro do tratamento nem libera fonte restrita.
- Rastreabilidade: REQ-04, REQ-05, REQ-06; OP-05, OP-08, OP-14; retenção R03, R12.
- Estado: **NAO_EXECUTADO**.

### A16

- Dado: Duas operações observam a mesma versão/escopo, que depois muda.
- Quando: Tentar efetivar com condição antiga.
- Esperado: Conflito ou nova avaliação antes de efeito; ordem das efetivações verificável.
- Verificação negativa: Timestamp do cliente ou last-write-wins não resolvem disputa de versão/autoridade.
- Rastreabilidade: REQ-04; OP-08, OP-12, OP-13; retenção R06, R10.
- Estado: **NAO_EXECUTADO**.

### A17

- Dado: Trabalho já causou efeito parcial e a mesma tentativa é repetida.
- Quando: Executar nova tentativa com o mesmo intento.
- Esperado: Reconhecer efeitos já feitos, revalidar contexto e tratar só restante cabível.
- Verificação negativa: Mesma chave com outro intento é conflito; deduplicação não libera conteúdo sem acesso atual.
- Rastreabilidade: REQ-04, REQ-08, REQ-09; OP-14; retenção R07, R10.
- Estado: **NAO_EXECUTADO**.

### A18

- Dado: Eventos de restrição/correção chegam fora de ordem.
- Quando: Aplicar evento antigo a derivado.
- Esperado: Comparar estado vigente, não ressuscitar acesso/conteúdo ou sobrepor medida atual.
- Verificação negativa: A ordem de chegada da fila não decide autoridade ou versão mais recente.
- Rastreabilidade: REQ-04, REQ-06, REQ-09; OP-14; retenção R10, R12.
- Estado: **NAO_EXECUTADO**.

### A19

- Dado: Backup anterior a medidas é restaurado.
- Quando: Tentar reabrir dados restaurados.
- Esperado: Conciliar medidas atuais antes da disponibilidade; falha mantém operações não legitimadas pendentes.
- Verificação negativa: Réplica/restore não reinicia prazo nem torna conteúdo autorizado.
- Rastreabilidade: REQ-06, REQ-07, REQ-09; OP-11, OP-14; retenção R08, R09.
- Estado: **NAO_EXECUTADO**.

### A20

- Dado: Cofre cifrado válido inclui cuidador novo/papel ou revisão alheia maior.
- Quando: Importar/merge/replace.
- Esperado: Validar cada intenção protegida; referências podem ser recebidas sem virar identidade/concessão.
- Verificação negativa: Arquivo e senha não constituem autoridade para ativar cuidador ou corrigir narrativa alheia.
- Rastreabilidade: REQ-11, REQ-13; OP-08, OP-12; retenção R02, R03.
- Estado: **NAO_EXECUTADO**.

### A21

- Dado: Cabeçalho, erro, linhagem ou perfil contém identificadores restritos.
- Quando: Montar resposta/pacote.
- Esperado: Apresentar/exportar só metadados legitimados; projeto do formato permanece decisão D04.
- Verificação negativa: Cifrar ciphertext não protege campos públicos; não inferir anonimização.
- Rastreabilidade: REQ-03, REQ-12; OP-04, OP-07; retenção R05, R14, R15.
- Estado: **NAO_EXECUTADO**.

### A22

- Dado: Falta revisão indispensável na fase exigida pela política aplicável.
- Quando: Solicitar medida protegida.
- Esperado: Permanecer pendente e encaminhar; conter apenas mínimo já legitimado.
- Verificação negativa: Proposta GOV-003 não incorporada, CI ou segunda conta do executor não satisfazem revisão humana requerida.
- Rastreabilidade: REQ-02, REQ-14; OP-10, OP-11; retenção R02, R11.
- Estado: **NAO_EXECUTADO**.

### A23

- Dado: Comando foi enviado ou efeito ocorreu, mas prova exigida falhou.
- Quando: Concluir pedido.
- Esperado: Manter estado real de tentativa/efeito e pendência de verificação, com prova minimizada a recompor legitimamente.
- Verificação negativa: Não declarar concluído, recriar conteúdo eliminado ou expor dados em log para corrigir a prova.
- Rastreabilidade: REQ-02, REQ-08, REQ-15; OP-09, OP-11, OP-14; retenção R07, R10, R11, R14.
- Estado: **NAO_EXECUTADO**.

### A24

- Dado: Falha foi corrigida e instituição pretende conservar aprendizado.
- Quando: Separar método de fontes pessoais.
- Esperado: Rever C10 e identificabilidade; fontes pessoais seguem seus limites e exceções concretas.
- Verificação negativa: Correção não prova eliminação da causa, aprendizagem ou licença de reter todo o material.
- Rastreabilidade: REQ-06, REQ-07, REQ-08; OP-01, OP-05, OP-11; retenção R15, R16.
- Estado: **NAO_EXECUTADO**.

### A25

- Dado: Legado não informa autoria/criança/proveniência/tempo.
- Quando: Migrar/interpretar campos ausentes.
- Esperado: Preservar lacunas explícitas e encaminhar o que não puder ser legitimado; não inventar fatos.
- Verificação negativa: Fallback para cuidador padrão, criança padrão, DIRECT, data atual ou fato por conveniência não vira evidência.
- Rastreabilidade: REQ-10, REQ-13, REQ-15; OP-02, OP-08; retenção R01, R02, R03.
- Estado: **NAO_EXECUTADO**.


## Decisões que a implementação deverá resolver

### D01 — Fronteira física e integração com a arquitetura aceita

ADR-005 preserva Supabase para identidade/persistência adulta e PKCE em desenvolvimento. Schema/RLS e eventual orquestração para operações futuras exigem desenho e revisão próprios; não há autorização para tabelas infantis.

Responsabilidade de encaminhamento: TEC-003/implementação futura; GOV-001/TEC-002 quando aplicável. Estado: Aberta; arquitetura de identidade já aceita não é reaberta.

### D02 — Mecanismo de versão e efetivação concorrente

Definir representação e comparação atômica das revisões de objeto/política/concessão/restrição e forma de registrar ordenação. ETag/If-Match é apenas candidato HTTP para conteúdo, não prova de autorização.

Responsabilidade de encaminhamento: Implementação futura e testes de concorrência. Estado: Aberta.

### D03 — Identidade, autoridade e taxonomia operacional

Confirmar quem decide o tratamento, representação/competência e categorias/finalidades concretas; papéis e vínculos do protótipo não viram poderes por migração.

Responsabilidade de encaminhamento: GOV-001 e procedimentos de autoridade. Estado: Aberta; condiciona operação concreta.

### D04 — Liberação de pacotes, streams e metadados

Escolher resgate com verificação vigente e proteção do cabeçalho; definir cancelamento/limite de stream e fronteira observável. Sem decisão e prova, não habilitar caminho de entrega longa que contorne revogação.

Responsabilidade de encaminhamento: Especificação complementar/implementação/QA. Estado: Aberta; não altera formato de cofre nesta entrega.

### D05 — Índice de dependências, cobertura e prova contra restauração

Definir armazenamento/busca, tratamento de relações ausentes/cíclicas, cobertura limitada e marcadores minimizados com política própria. Não perpetuar dados para manter o índice.

Responsabilidade de encaminhamento: Implementação, TEC-002 e QA-001. Estado: Aberta.

### D06 — Evidência, anonimização e capacidade de ciclo de vida

Definir método/provedor/configuração e prova proporcionais, inclusive cobertura de cópias, regime especial de incidente e anonimização; sem números de retenção novos.

Responsabilidade de encaminhamento: GOV-001/TEC-002/QA-001. Estado: Aberta.

### D07 — Modelo de verificação adicional da PR #40

PR #40 estava aberta na base desta especificação. Exigência geral de V2 antes de irreversibilidade real e demais escolhas de GOV-003 permanecem propostas, não regras incorporadas. Representar checkpoint aplicável e não permitir efeito cuja revisão/fundamento não estiver demonstrado.

Responsabilidade de encaminhamento: Revisão de GOV-003/PR #40; sem pessoa presumida. Estado: PR #40 em revisão na conferência inicial.

### D08 — Fatiamento da implementação e preparação dos testes

Definir entregas técnicas separadas e pré-requisitos de cada caso. QA-001 pode usar a matriz para roteiro, mas controles não existentes não são simulados como implementação aprovada; dados reais continuam bloqueados.

Responsabilidade de encaminhamento: Planejamento técnico/QA-001/QA-002/REL-001. Estado: Aberta.


Resolver decisões de implementação não permite mudar silenciosamente finalidade, fundamento, prazo ou autoridade. Alterações de governança voltam à decisão competente e ficam rastreadas. Creusio responde atualmente por produto, governança e execução; verificador independente permanece a designar, sem atribuição fictícia.
