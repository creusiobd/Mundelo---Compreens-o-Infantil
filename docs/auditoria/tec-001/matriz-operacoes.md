# Matriz de aderência das 14 operações

Base: commit `512d95dd2c6f026e602a5a722fb6f03f08902321`. Verificação desta tarefa: inspeção estática dirigida. As evidências de CI histórico e suas limitações estão em [verificacao.md](verificacao.md). Os identificadores OP-01–OP-14 são índices deste mapa, não enums de API nem novos princípios.

| ID | Operação | Estado no código | Cobertura do contrato |
|---|---|---|---|
| OP-01 | Preservar | Demonstrativo | Parcial, em protótipo local |
| OP-02 | Registrar (create) | Demonstrativo | Parcial, em protótipo local |
| OP-03 | Preparar para compartilhamento | Demonstrativo | Parcial, em protótipo local |
| OP-04 | Consultar (read) | Demonstrativo | Parcial, em protótipo local |
| OP-05 | Utilizar em síntese/interpretação | Demonstrativo | Parcial, em protótipo local |
| OP-06 | Compartilhar (share) | Ausente | Ausente no código versionado |
| OP-07 | Exportar (export) | Demonstrativo | Parcial, em protótipo local |
| OP-08 | Corrigir (edit_own / revisão administrativa) | Demonstrativo | Parcial, em protótipo local |
| OP-09 | Contestar / solicitar correção | Ausente | Ausente no código versionado |
| OP-10 | Restringir | Ausente | Ausente no código versionado |
| OP-11 | Eliminar / anonimizar | Demonstrativo | Parcial, em protótipo local |
| OP-12 | Conceder / ampliar acesso | Ausente | Ausente no código versionado |
| OP-13 | Revogar / expirar / suspender concessão | Ausente | Ausente no código versionado |
| OP-14 | Reavaliar derivados | Ausente | Ausente no código versionado |

## OP-01 — Preservar

**Estado:** Demonstrativo. **Critério:** [docs/contrato-dominio-criterios-operacoes-v0-1.md:27](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L27).

**Encontrado:** Estado React em memória e exportação opcional para cofre cifrado.

**Falta ou diverge:** Não há aplicação das durações, revisão de necessidade, exceções ou destinação por categoria.

**Evidências:**

- [src/context/AppContext.tsx:115–132](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L115-L132)
- [src/crypto/vault.ts:123–187](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/crypto/vault.ts#L123-L187)

**Lacunas relacionadas:** [G01](lacunas.md#g01), [G09](lacunas.md#g09).

**Verificação:** Inspeção estática; não executada aceitação integral desta operação nesta tarefa.

## OP-02 — Registrar (create)

**Estado:** Demonstrativo. **Critério:** [docs/contrato-dominio-criterios-operacoes-v0-1.md:28](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L28).

**Encontrado:** addObservation verifica vínculo/status, atribui autoria e tempos, valida schema e cria revisão 1.

**Falta ou diverge:** Permissão não distingue finalidade/categoria; novo registro é selecionado automaticamente para relatório. Lacunas têm defaults e a migração pode preencher fatos não conhecidos.

**Evidências:**

- [src/context/AppContext.tsx:245–291](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L245-L291)
- [src/validation/schemas.ts:78–120](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/validation/schemas.ts#L78-L120)
- [src/validation/migration.ts:23–58](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/validation/migration.ts#L23-L58)

**Lacunas relacionadas:** [G01](lacunas.md#g01), [G02](lacunas.md#g02), [G10](lacunas.md#g10).

**Verificação:** Inspeção estática; não executada aceitação integral desta operação nesta tarefa.

## OP-03 — Preparar para compartilhamento

**Estado:** Demonstrativo. **Critério:** [docs/contrato-dominio-criterios-operacoes-v0-1.md:29](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L29).

**Encontrado:** Seleção de registros e montagem de síntese contextual em tela.

**Falta ou diverge:** Não há unidade derivada versionada nem autorização própria de preparação/uso; seleção automática não representa decisão de finalidade.

**Evidências:**

- [src/context/AppContext.tsx:129–132](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L129-L132)
- [src/context/AppContext.tsx:373–403](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L373-L403)
- [src/screens/ReportScreen.tsx:33–95](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/screens/ReportScreen.tsx#L33-L95)

**Lacunas relacionadas:** [G02](lacunas.md#g02), [G04](lacunas.md#g04).

**Verificação:** Inspeção estática; não executada aceitação integral desta operação nesta tarefa.

## OP-04 — Consultar (read)

**Estado:** Demonstrativo. **Critério:** [docs/contrato-dominio-criterios-operacoes-v0-1.md:30](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L30).

**Encontrado:** Lista de observações filtrada por criança e cuidador ativo vinculado.

**Falta ou diverge:** Não há destinatário autenticado, concessão granular ou filtro histórico. Perfis são retornados separadamente e o detalhe mantém objeto em estado local sem guarda própria de leitura.

**Evidências:**

- [src/security/authorization.ts:36–47](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/security/authorization.ts#L36-L47)
- [src/context/AppContext.tsx:139–163](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L139-L163)
- [src/App.tsx:60–65](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/App.tsx#L60-L65)
- [src/components/ObservationDetailModal.tsx:37–58](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/components/ObservationDetailModal.tsx#L37-L58)

**Lacunas relacionadas:** [G01](lacunas.md#g01), [G02](lacunas.md#g02), [G06](lacunas.md#g06).

**Verificação:** Inspeção estática; não executada aceitação integral desta operação nesta tarefa.

## OP-05 — Utilizar em síntese/interpretação

**Estado:** Demonstrativo. **Critério:** [docs/contrato-dominio-criterios-operacoes-v0-1.md:31](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L31).

**Encontrado:** Relatório descritivo e contagens locais por ambiente/evento; tela declara ausência de IA ativa.

**Falta ou diverge:** Uso deriva da leitura/vínculo, sem autorização específica, destinatário individual, linhagem persistida ou gestão do ciclo da síntese.

**Evidências:**

- [src/security/authorization.ts:112–124](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/security/authorization.ts#L112-L124)
- [src/screens/ReportScreen.tsx:38–104](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/screens/ReportScreen.tsx#L38-L104)
- [src/screens/UnderstandScreen.tsx:22–34](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/screens/UnderstandScreen.tsx#L22-L34)
- [src/screens/UnderstandScreen.tsx:63–75](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/screens/UnderstandScreen.tsx#L63-L75)

**Lacunas relacionadas:** [G02](lacunas.md#g02), [G04](lacunas.md#g04), [G07](lacunas.md#g07).

**Verificação:** Inspeção estática; não executada aceitação integral desta operação nesta tarefa.

## OP-06 — Compartilhar (share)

**Estado:** Ausente. **Critério:** [docs/contrato-dominio-criterios-operacoes-v0-1.md:32](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L32).

**Encontrado:** Há texto de relatório para cópia/impressão, sem serviço de entrega/concessão.

**Falta ou diverge:** Copiar ou imprimir não implementa compartilhamento governado: destinatário, autoridade, categorias, operações, vigência e contexto acessível não são avaliados.

**Evidências:**

- [src/screens/ReportScreen.tsx:33–48](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/screens/ReportScreen.tsx#L33-L48)
- [src/screens/ReportScreen.tsx:59–110](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/screens/ReportScreen.tsx#L59-L110)
- [src/types/index.ts:52–59](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/types/index.ts#L52-L59)

**Lacunas relacionadas:** [G01](lacunas.md#g01), [G02](lacunas.md#g02), [G07](lacunas.md#g07).

**Verificação:** Inspeção estática; não executada aceitação integral desta operação nesta tarefa.

## OP-07 — Exportar (export)

**Estado:** Demonstrativo. **Critério:** [docs/contrato-dominio-criterios-operacoes-v0-1.md:33](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L33).

**Encontrado:** Geração de cofre local com validação, AES-GCM e senha; relatório permite cópia e impressão.

**Falta ou diverge:** Vínculo ativo basta para exportar todo o perfil/acervo/cuidadores ligados à criança. Faltam direito independente, escopo histórico, proteção de terceiros e revalidação ao disponibilizar o download.

**Evidências:**

- [src/context/AppContext.tsx:580–628](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L580-L628)
- [src/components/VaultExportModal.tsx:45–104](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/components/VaultExportModal.tsx#L45-L104)
- [src/crypto/vault.ts:164–187](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/crypto/vault.ts#L164-L187)
- [src/screens/ReportScreen.tsx:59–110](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/screens/ReportScreen.tsx#L59-L110)

**Lacunas relacionadas:** [G02](lacunas.md#g02), [G05](lacunas.md#g05), [G06](lacunas.md#g06), [G07](lacunas.md#g07).

**Verificação:** Inspeção estática; não executada aceitação integral desta operação nesta tarefa.

## OP-08 — Corrigir (edit_own / revisão administrativa)

**Estado:** Demonstrativo. **Critério:** [docs/contrato-dominio-criterios-operacoes-v0-1.md:34](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L34).

**Encontrado:** Atualiza revisão e updatedAt, preservando childId, autoria registradora e recordedAt; merge rejeita alguns conflitos.

**Falta ou diverge:** Substitui o objeto anterior; não conserva histórico legítimo de versões nem aciona dependências. Papel LEGAL_GUARDIAN permite editar contribuição alheia sem procedimento administrativo específico; importação não aplica canEdit por registro.

**Evidências:**

- [src/security/authorization.ts:67–83](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/security/authorization.ts#L67-L83)
- [src/context/AppContext.tsx:294–342](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L294-L342)
- [src/context/AppContext.tsx:680–743](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L680-L743)
- [src/security/conflictResolver.ts:208–227](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/security/conflictResolver.ts#L208-L227)

**Lacunas relacionadas:** [G03](lacunas.md#g03), [G04](lacunas.md#g04), [G11](lacunas.md#g11).

**Verificação:** Inspeção estática; não executada aceitação integral desta operação nesta tarefa.

## OP-09 — Contestar / solicitar correção

**Estado:** Ausente. **Critério:** [docs/contrato-dominio-criterios-operacoes-v0-1.md:35](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L35).

**Encontrado:** Campos de notas/hipótese são parte do registro; não representam um pedido autônomo.

**Falta ou diverge:** Ausentes entidade/canal de contestação com autoria própria, encaminhamento, revisão e estados do pedido.

**Evidências:**

- [src/types/index.ts:114–137](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/types/index.ts#L114-L137)
- [src/context/AppContext.tsx:39–110](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L39-L110)

**Lacunas relacionadas:** [G08](lacunas.md#g08).

**Verificação:** Inspeção estática; não executada aceitação integral desta operação nesta tarefa.

## OP-10 — Restringir

**Estado:** Ausente. **Critério:** [docs/contrato-dominio-criterios-operacoes-v0-1.md:36](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L36).

**Encontrado:** SUSPENDED é estado global de cuidador e bloqueia funções demonstrativas.

**Falta ou diverge:** Não representa restrição por conteúdo, operação, finalidade, período, destinatário e fundamento, nem revisão dos derivados.

**Evidências:**

- [src/types/index.ts:47–59](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/types/index.ts#L47-L59)
- [src/security/authorization.ts:36–58](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/security/authorization.ts#L36-L58)

**Lacunas relacionadas:** [G02](lacunas.md#g02), [G07](lacunas.md#g07), [G08](lacunas.md#g08).

**Verificação:** Inspeção estática; não executada aceitação integral desta operação nesta tarefa.

## OP-11 — Eliminar / anonimizar

**Estado:** Demonstrativo. **Critério:** [docs/contrato-dominio-criterios-operacoes-v0-1.md:37](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L37).

**Encontrado:** deleteObservation e limpeza do acervo removem objetos da sessão.

**Falta ou diverge:** Não avalia pedido/dever, retenção, terceiros, cópias ou derivados; não há mecanismo de anonimização nem comprovação de eliminação fora da memória. A mensagem de exclusão individual delimita corretamente a sessão.

**Evidências:**

- [src/context/AppContext.tsx:345–370](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L345-L370)
- [src/context/AppContext.tsx:554–577](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L554-L577)
- [src/components/DeleteConfirmModal.tsx:17–61](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/components/DeleteConfirmModal.tsx#L17-L61)

**Lacunas relacionadas:** [G03](lacunas.md#g03), [G08](lacunas.md#g08), [G09](lacunas.md#g09).

**Verificação:** Inspeção estática; não executada aceitação integral desta operação nesta tarefa.

## OP-12 — Conceder / ampliar acesso

**Estado:** Ausente. **Critério:** [docs/contrato-dominio-criterios-operacoes-v0-1.md:38](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L38).

**Encontrado:** Lista de cuidadores/vínculos sintéticos; importação pode inserir cuidadores de IDs novos.

**Falta ou diverge:** Sem AccessGrant ou procedimento de autoridade/finalidade/vigência. Preservar papéis de IDs existentes na importação não valida novos papéis/vínculos recebidos no arquivo.

**Evidências:**

- [src/types/index.ts:41–59](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/types/index.ts#L41-L59)
- [src/context/AppContext.tsx:746–766](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L746-L766)
- [src/crypto/schemas.ts:78–86](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/crypto/schemas.ts#L78-L86)

**Lacunas relacionadas:** [G01](lacunas.md#g01), [G02](lacunas.md#g02), [G07](lacunas.md#g07).

**Verificação:** Inspeção estática; não executada aceitação integral desta operação nesta tarefa.

## OP-13 — Revogar / expirar / suspender concessão

**Estado:** Ausente. **Critério:** [docs/contrato-dominio-criterios-operacoes-v0-1.md:39](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L39).

**Encontrado:** Funções negam cuidador SUSPENDED; gerenciador aceita checar vínculo/status fornecidos pelo chamador.

**Falta ou diverge:** Não há concessão com ciclo de vida, prazos/eventos ou propagação. Simular outro cuidador não revoga uma concessão; a guarda de exportação termina antes da operação assíncrona.

**Evidências:**

- [src/security/authorization.ts:36–58](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/security/authorization.ts#L36-L58)
- [src/security/domainLock.ts:117–178](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/security/domainLock.ts#L117-L178)
- [src/context/AppContext.tsx:218–243](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L218-L243)
- [src/context/AppContext.tsx:626–628](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/context/AppContext.tsx#L626-L628)

**Lacunas relacionadas:** [G02](lacunas.md#g02), [G05](lacunas.md#g05), [G07](lacunas.md#g07).

**Verificação:** Inspeção estática; não executada aceitação integral desta operação nesta tarefa.

## OP-14 — Reavaliar derivados

**Estado:** Ausente. **Critério:** [docs/contrato-dominio-criterios-operacoes-v0-1.md:40](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/docs/contrato-dominio-criterios-operacoes-v0-1.md#L40).

**Encontrado:** Filtros e contagens são recalculados na renderização com o estado disponível.

**Falta ou diverge:** Não há cadastro de dependências/versões/eventos, tratamento por validade/apresentação/uso/retenção nem prova de execução. Re-renderizar contagens não implementa esse fluxo.

**Evidências:**

- [src/screens/UnderstandScreen.tsx:22–34](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/screens/UnderstandScreen.tsx#L22-L34)
- [src/screens/ReportScreen.tsx:38–40](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/screens/ReportScreen.tsx#L38-L40)
- [src/types/index.ts:114–137](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/blob/512d95dd2c6f026e602a5a722fb6f03f08902321/src/types/index.ts#L114-L137)

**Lacunas relacionadas:** [G04](lacunas.md#g04), [G08](lacunas.md#g08), [G09](lacunas.md#g09).

**Verificação:** Inspeção estática; não executada aceitação integral desta operação nesta tarefa.
