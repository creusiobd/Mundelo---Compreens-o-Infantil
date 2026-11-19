# Lacunas e diferenças encontradas

Base: commit `512d95dd2c6f026e602a5a722fb6f03f08902321`. Responsável pelo encaminhamento: Creusio Kizua. P0 indica dependência crítica para atender ao contrato; P1 indica requisito ou cobertura a resolver no planejamento. Não representa incidente em produção ou certificação de risco.

São achados de inspeção estática; trajetórias completas no navegador e configurações externas permanecem não verificadas. Não foi alterada a política demonstrativa para fazer o código parecer aderente. As tarefas abaixo já existem e recebem o diagnóstico como insumo; isso não as torna concluídas nem autoriza implementação fora de seu escopo.

<a id="g01"></a>

## G01 — Identidade e fronteira de autorização no servidor

**Prioridade:** P0. **Requisito:** Contrato §10 / autorização no banco ou API.

A árvore completa não contém backend, SDK Supabase, migrations ou políticas SQL executáveis. ADR-005 aceita a arquitetura para implementação controlada, mas a dependência @supabase/supabase-js e sua integração não aparecem no código desta versão.

**Evidências:**

- [package.json:17–41](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/package.json#L17-L41)
- [src/context/AppContext.tsx:115–124](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L115-L124)
- [src/security/authorization.ts:8–17](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/security/authorization.ts#L8-L17)
- [docs/adr/005-identidade-e-persistencia-supabase.md:15–41](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/adr/005-identidade-e-persistencia-supabase.md#L15-L41)

**Encaminhamento:** Especificar e depois comprovar autenticação e autorização na fronteira efetiva; preservar o escopo aprovado de contas adultas, sem criar tabelas infantis por esta auditoria.

**Acompanhamento existente:** [#31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/31), [#35](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/35).

<a id="g02"></a>

## G02 — Permissões independentes e cobertura dos perfis

**Prioridade:** P0. **Requisito:** Contrato §§5.3–5.4; regras comuns e consultar/utilizar/exportar.

Leitura, criação e inclusão em relatório dependem de ACTIVE + linkedChildIds; não há finalidade, categorias, intervalo histórico ou concessão versionada. activeProfile não usa o filtro de leitura das observações. updateProfile verifica só papel; os mutadores add/remove do perfil não repetem autorização no domínio.

**Evidências:**

- [src/security/authorization.ts:36–58](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/security/authorization.ts#L36-L58)
- [src/security/authorization.ts:112–124](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/security/authorization.ts#L112-L124)
- [src/context/AppContext.tsx:139–163](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L139-L163)
- [src/context/AppContext.tsx:405–552](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L405-L552)
- [src/screens/ReportScreen.tsx:59–95](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/screens/ReportScreen.tsx#L59-L95)

**Encaminhamento:** Definir matriz ator/objeto/versão/finalidade/operação/destinatário e aplicar em todo caminho, incluindo campos do perfil, preparação, cópia e impressão.

**Acompanhamento existente:** [#31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/31), [#34](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/34).

<a id="g03"></a>

## G03 — Correção alheia e importação sem autoridade por contribuição

**Prioridade:** P0. **Requisito:** Contrato §8; critério Corrigir.

LEGAL_GUARDIAN pode editar/excluir contribuições de outros autores por papel. O merge verifica vínculo com a criança e revisão/imutabilidade, mas não invoca canEditObservation para cada contribuição recebida. Não existe fundamento/escopo de revisão administrativa específico.

**Evidências:**

- [src/security/authorization.ts:67–105](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/security/authorization.ts#L67-L105)
- [src/context/AppContext.tsx:294–342](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L294-L342)
- [src/context/AppContext.tsx:680–743](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L680-L743)

**Encaminhamento:** Separar correção própria, pedido de correção e medida administrativa legitimada; estender a mesma decisão a importações/replace. A mera passagem dos testes antigos não resolve a divergência.

**Acompanhamento existente:** [#28](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/28), [#31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/31).

<a id="g04"></a>

## G04 — Versões e linhagem das derivações

**Prioridade:** P0. **Requisito:** Contrato §§7–9; Corrigir e Reavaliar derivados.

Observation possui contador revision, sem repositório de versões, relações de derivação ou eventos de tratamento. updateObservation substitui o objeto. Relatório usa objetos atuais, sem unidade derivada com fontes/versões e estados de revisão.

**Evidências:**

- [src/types/index.ts:114–137](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/types/index.ts#L114-L137)
- [src/context/AppContext.tsx:316–340](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L316-L340)
- [src/screens/ReportScreen.tsx:38–95](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/screens/ReportScreen.tsx#L38-L95)

**Encaminhamento:** Especificar identidade de versão, relações e reação a eventos; conservar conteúdo anterior somente quando e enquanto legítimo; distinguir recomputação visual de reavaliação documentada.

**Acompanhamento existente:** [#31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/31), [#32](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/32).

<a id="g05"></a>

## G05 — Guarda termina antes da disponibilização assíncrona do cofre

**Prioridade:** P0. **Requisito:** Regras comuns linha 9; Exportar e Revogar.

exportVaultData adquire/libera trava dentro de função síncrona. O modal aguarda e cifra depois do retorno, baixando sem validateCommit. incrementGeneration só é chamado após importação, não nas demais mutações/trocas. A classe isolada tem controles, mas sua integração não cobre toda a janela da exportação.

**Evidências:**

- [src/context/AppContext.tsx:580–628](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L580-L628)
- [src/components/VaultExportModal.tsx:67–96](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/components/VaultExportModal.tsx#L67-L96)
- [src/context/AppContext.tsx:772–773](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L772-L773)
- [src/security/domainLock.ts:117–178](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/security/domainLock.ts#L117-L178)

**Encaminhamento:** Definir duração da operação, fonte de estado vigente e revalidação imediatamente antes de liberar resultado; testar troca/restrição/alteração entre preparação e download no fluxo real.

**Acompanhamento existente:** [#31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/31), [#32](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/32), [#33](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/33).

<a id="g06"></a>

## G06 — Apresentação residual e metadados fora do escopo

**Prioridade:** P0. **Requisito:** Consultar e Exportar; proteção de metadados.

detailObs guarda um objeto de contribuição; o modal verifica edição/exclusão/seleção, mas não uma guarda de leitura própria. O envelope público do cofre inclui childName, childId e contagem. Criptografar ciphertext não cifra esses metadados. A extensão de apresentação residual no navegador não foi reproduzida nesta tarefa.

**Evidências:**

- [src/App.tsx:60–65](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/App.tsx#L60-L65)
- [src/App.tsx:89–93](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/App.tsx#L89-L93)
- [src/components/ObservationDetailModal.tsx:47–58](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/components/ObservationDetailModal.tsx#L47-L58)
- [src/crypto/vault.ts:164–183](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/crypto/vault.ts#L164-L183)
- [src/crypto/schemas.ts:51–68](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/crypto/schemas.ts#L51-L68)

**Encaminhamento:** Especificar minimização/proteção do cabeçalho e revalidação de apresentações já abertas; conferir perda de acesso com detalhe/relatório em tela e ausência de exposição indireta por perfil/metadados.

**Acompanhamento existente:** [#31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/31), [#34](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/34), [#33](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/33).

<a id="g07"></a>

## G07 — Concessões, compartilhamento e confiança nos cuidadores importados

**Prioridade:** P0. **Requisito:** Contrato §5; Compartilhar, Conceder e Revogar.

Caregiver tem apenas papel, status e linkedChildIds. O rótulo de destinatário do relatório não identifica pessoa nem concessão. A importação não sobrescreve cuidadores existentes, mas aceita novos IDs com papel/status/vínculos fornecidos no arquivo. A cifra garante integridade do arquivo, não autoridade representativa de quem o produziu.

**Evidências:**

- [src/types/index.ts:41–59](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/types/index.ts#L41-L59)
- [src/screens/ReportScreen.tsx:33–48](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/screens/ReportScreen.tsx#L33-L48)
- [src/context/AppContext.tsx:746–766](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L746-L766)

**Encaminhamento:** Especificar concessão, origem de autoridade e eventos de ciclo de vida; impedir que arquivo/cópia/papel importado seja tratado como nova autorização por si só.

**Acompanhamento existente:** [#28](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/28), [#31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/31).

<a id="g08"></a>

## G08 — Pedidos, restrições e evidência de tratamento

**Prioridade:** P0. **Requisito:** Regras comuns e Contestar/Restringir/Eliminar.

Não há entidade de pedido/decisão, contestação própria, fila, evidência minimizada ou estados recebido/pendente/parcial/concluído. Booleans e notificações transitórias do contexto não constituem trilha governada.

**Evidências:**

- [src/context/AppContext.tsx:39–110](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L39-L110)
- [src/context/AppContext.tsx:181–189](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L181-L189)
- [src/types/index.ts:114–137](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/types/index.ts#L114-L137)

**Encaminhamento:** Definir procedimento, responsáveis, estado e prova proporcionais por operação; incluir manifestação acessível e caminho de revisão sem sobrescrever contribuição alheia.

**Acompanhamento existente:** [#28](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/28), [#30](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/30), [#31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/31), [#34](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/34).

<a id="g09"></a>

## G09 — Retenção, destinação, anonimização e restauração

**Prioridade:** P0. **Requisito:** Contrato §10.1; política/10 categorias e 16 cenários.

Não há motor de ciclo de vida nem aplicação dos parâmetros por categoria; excluir só filtra estado React. Um cofre anterior pode ser reimportado sem registro de medidas de eliminação/restrição anteriores. Não foi constatado serviço remoto de backups no repositório, nem conferida infraestrutura externa.

**Evidências:**

- [src/context/AppContext.tsx:345–370](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L345-L370)
- [src/context/AppContext.tsx:554–577](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L554-L577)
- [src/context/AppContext.tsx:723–770](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L723-L770)
- [src/crypto/types.ts:44–58](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/crypto/types.ts#L44-L58)

**Encaminhamento:** Confrontar capacidade real do ambiente e procedimentos com os parâmetros candidatos; separar cópia externa de cópia sob governança; planejar verificação de escopo e restauração sem reativação indevida.

**Acompanhamento existente:** [#28](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/28), [#29](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/29), [#30](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/30), [#31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/31), [#32](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/32), [#33](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/33).

<a id="g10"></a>

## G10 — Lacunas confundidas com valores preenchidos

**Prioridade:** P1. **Requisito:** Regras comuns; Registrar; proveniência e indeterminação.

Schemas e migração atribuem registrador padrão, proveniência DIRECT, criança tomas, ambiente casa, papel mae e horários atuais quando campos legados faltam. Isso pode promover ausência a afirmação sem evidência se reutilizado fora da demonstração. Alguns defaults textuais como 'Não observado' são úteis, mas não distinguem todos os estados documentais.

**Evidências:**

- [src/validation/schemas.ts:78–104](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/validation/schemas.ts#L78-L104)
- [src/validation/migration.ts:23–58](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/validation/migration.ts#L23-L58)
- [src/screens/MyWorldScreen.tsx:56–63](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/screens/MyWorldScreen.tsx#L56-L63)

**Encaminhamento:** Definir estados de desconhecido/não informado/não observado/não aplicável e migração que não atribua autoria, fato ou contexto por presunção; preservar compatibilidade apenas com origem explícita.

**Acompanhamento existente:** [#31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/31), [#34](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/34).

<a id="g11"></a>

## G11 — Cobertura de testes e integração com o contrato novo

**Prioridade:** P1. **Requisito:** Invariantes e cenários das 14 operações; QA-001.

A suíte histórica testa a política demonstrativa; foundation-v0.3 afirma que guardião edita tudo. Parte dos testes adversariais usa funções/flags simuladas no próprio teste. A v0.4A.1 exercita classes reais, mas isso não prova sua integração em todo o fluxo React. Os 16 cenários de retenção não foram executados por esta auditoria.

**Evidências:**

- [tests/foundation-v0.3.test.ts:118–166](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/tests/foundation-v0.3.test.ts#L118-L166)
- [tests/vault-adversarial-v0.4a.test.ts:318–358](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/tests/vault-adversarial-v0.4a.test.ts#L318-L358)
- [tests/vault-adversarial-v0.4a.test.ts:436–495](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/tests/vault-adversarial-v0.4a.test.ts#L436-L495)
- [tests/foundation-v0.4a1.test.ts:238–338](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/tests/foundation-v0.4a1.test.ts#L238-L338)
- [tests/e2e/internal-permissions.spec.ts:5–42](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/tests/e2e/internal-permissions.spec.ts#L5-L42)

**Encaminhamento:** Vincular cada cenário à implementação real disponível e aos limites novos; manter PASS histórico separado de aceitação atual; registrar resultados esperado/observado, versão e prova.

**Acompanhamento existente:** [#32](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/32), [#33](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/33).

## Sequência recomendada para não repetir etapas

O diagnóstico de TEC-001 não depende de reabrir a recuperação histórica ou de aprovar novamente as PRs 19–21. Os pontos de autoridade, revisão administrativa e destinação devem informar GOV-002. A especificação TEC-003 deve cobrir caminhos de aplicação, importação, relatórios, cofre, perfis e metadados; a classe de autorização isolada é insuficiente como fronteira.

Os cenários de QA devem atacar a integração real, incluindo mudança de contexto durante exportação, visualização já aberta, correção alheia via merge e restauração de cópia antiga. A execução depende dos controles disponíveis, e deve distinguir falha do produto, dependência ausente e decisão ainda pendente.
