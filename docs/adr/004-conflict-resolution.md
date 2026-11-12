# ADR 004: Política Determinística de Resolução de Conflitos e Merge Transacional (SEC-14)

- **Status:** Aceito (Foundation v0.4A.1)
- **Data:** 2025-05-12
- **Contexto:** Fechamento do Risco Residual SEC-14 identificado no Gate Adversarial da Foundation v0.4A.

---

## 1. Contexto e Problema

Na Foundation v0.4A inicial, a importação de um arquivo `.mundelo-vault` em modo `merge` comparava apenas o número inteiro `revision`:
- Quando `incoming.revision > existing.revision`, o registro recebido substituía o local.
- Quando `incoming.revision <= existing.revision`, o registro local era mantido silenciosamente sem inspecionar se um registro de **mesma revisão** (`incoming.revision === existing.revision`) possuía conteúdo divergente ou se uma revisão superior tentava adulterar campos imutáveis de proveniência (`recordedByCaregiverId`, `recordedAt`, `childId`).

Em sistemas de observação infantil compartilhados entre múltiplos cuidadores (mãe, pai, avó), aceitar silenciosamente ou ignorar divergências na mesma revisão (ou aplicar *last-write-wins* por relógio local) pode resultar em perda silenciosa de relatos relevantes ou falsificação de autoria inicial.

---

## 2. Decisão Arquitetural

Implementamos um resolvedor puro, determinístico e atômico em `src/security/conflictResolver.ts` (`resolveObservationConflict` e `resolveObservationBatch`), baseado em 5 estados explícitos de decisão por registro:

| Ação (`ConflictAction`) | Condição | Comportamento |
| :--- | :--- | :--- |
| **`INSERT`** | `existing === undefined` e `incoming.childId === targetChildId` | Insere o registro inédito no acervo em memória da criança. |
| **`KEEP`** | `incoming.revision < existing.revision` e campos imutáveis íntegros | Preserva o registro local mais recente; ignora a versão antiga do arquivo. |
| **`NOOP`** | `incoming.revision === existing.revision` e conteúdo canônico 100% idêntico | Operação idempotente; nenhuma mutação necessária. |
| **`UPDATE`** | `incoming.revision > existing.revision` e campos imutáveis preservados | Atualiza o registro local para a revisão superior validada. |
| **`CONFLICT`** | Qualquer violação de invariante (ver seção 3) | Bloqueia o registro e **aborta transacionalmente o lote inteiro**. |

---

## 3. Invariantes que Disparam `CONFLICT` (Sem *Last-Write-Wins*)

1. **Violação de Escopo de Criança (`childId`):**
   - `incoming.childId !== targetChildId` ou `existing.childId !== incoming.childId`.
2. **Adulteração de Campos Imutáveis de Proveniência:**
   - Mesmo quando `incoming.revision > existing.revision`, os campos originais de criação (`id`, `childId`, `recordedByCaregiverId`, `recordedAt`) são **imutáveis** ao longo de toda a vida da observação. Qualquer divergência nesses campos dispara `CONFLICT`.
3. **Divergência na Mesma Revisão (`incoming.revision === existing.revision`):**
   - Se dois registros possuem o mesmo `id` e o mesmo número de `revision`, mas diferem em qualquer campo de conteúdo (`title`, `description`, `childResponse`, `whatHelped`, `domain`, `context`, `date`, `tags`, `contextDetails`, `evidenceDetails`, `visibilityPolicy`, `shareWithSchool`, `shareWithProfessional`), o sistema **não escolhe um vencedor arbitrário** nem usa timestamps de relógio local. Retorna `CONFLICT` listando os campos divergentes (`divergentFields`).

---

## 4. Comparação Estrutural Canônica (Independência de Ordem de Chaves)

Para evitar falsos positivos causados por serialização JSON com chaves em ordens distintas (`JSON.stringify`), `compareObservationContent(existing, incoming)` executa comparação estrutural explícita campo a campo:
- Primitivos comparados com igualdade estrita (`===`).
- Vetor `tags` comparado elemento a elemento em ordem preservada.
- Sub-objetos opcionais (`contextDetails`, `evidenceDetails`) comparados propriedade por propriedade.
- Histórico `revisionHistory` comparado entrada por entrada (`revision`, `editedAt`, `editedByCaregiverId`, `editedByRole`, `changeSummary`).

---

## 5. Atomicidade de Lote (`resolveObservationBatch`)

- A função `resolveObservationBatch` avalia todas as observações recebidas antes de produzir o próximo estado.
- Se `conflicts.length > 0`, `canCommit` é `false` e o array retornado é a referência exata do estado anterior, garantindo **zero mutação parcial** em memória.
- Importar o mesmo arquivo `.mundelo-vault` múltiplas vezes seguidas resulta em `NOOP` para 100% dos registros (idempotência comprovada).

---

## 6. Limitações Declaradas

- O campo `revisionHistory` e os identificadores de cuidadores (`recordedByCaregiverId`, `updatedByCaregiverId`) são metadados de auditoria de domínio protegidos contra adulteração acidental pela tag AEAD (`AES-GCM-256`) do cofre, mas **não constituem assinatura digital criptográfica por cuidador** (já que a chave simétrica do cofre é derivada de uma senha compartilhada via PBKDF2).
