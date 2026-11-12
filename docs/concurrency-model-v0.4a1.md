# Modelo de Concorrência no Domínio e Cancelamento Lógico (Foundation v0.4A.1)

**Módulos Principais:**
- `src/security/domainLock.ts` (`DomainConcurrencyManager`)
- `src/context/AppContext.tsx` (`exportVaultData`, `importVaultPayload`)
- `src/components/VaultImportModal.tsx` / `src/components/VaultExportModal.tsx`

---

## 1. Objetivo (SEC-17 e SEC-18)

Nas versões anteriores, o bloqueio contra cliques duplos ou trocas de perfil durante operações assíncronas (como derivação PBKDF2 de 600.000 iterações ou pré-visualização de importação) dependia primariamente de flags locais de componente React (`isExporting`, `isProcessing`). Se duas operações fossem disparadas programaticamente ou se o usuário alternasse o perfil da criança/cuidador enquanto uma operação aguardava confirmação, havia risco de condição de corrida (*race condition*) ou commit em contexto trocado (*Time-of-Check to Time-of-Use* — TOCTOU).

---

## 2. Arquitetura do `DomainConcurrencyManager`

O `DomainConcurrencyManager` implementa um mutex determinístico no nível de domínio, independente do ciclo de vida visual dos modais:

### 2.1. Snapshot de Contexto (`OperationSnapshot`)
Ao adquirir o lock via `acquireLock(type, childId, caregiverId)`, o gerenciador registra:
- `operationId`: Identificador único monotônico (`op-<counter>-<timestamp>`).
- `type`: `'VAULT_EXPORT' | 'VAULT_IMPORT'`.
- `childId`: ID da criança alvo no início da operação.
- `caregiverId`: ID do cuidador ativo no início da operação.
- `stateGeneration`: Contador monotônico global de geração de estado do domínio.
- `startedAt`: Timestamp em milissegundos.

### 2.2. Exclusão Mútua (SEC-17)
- Enquanto `activeOperation !== null`, qualquer chamada concorrente a `acquireLock` retorna imediatamente `{ acquired: false, reason: 'Operação concorrente bloqueada...' }`.
- O lock é sempre liberado em bloco `finally` via `releaseLock(operationId)` após o commit ou falha.

### 2.3. Contador de Geração e Cancelamento Lógico (SEC-18)
- Como a Web Crypto API (`crypto.subtle.deriveKey` / `encrypt` / `decrypt`) não aceita `AbortSignal`, uma operação criptográfica já submetida à thread nativa do navegador continuará até resolver a Promise.
- Para impedir que seu resultado afete um contexto que mudou, toda alteração de perfil ativo (`setActiveChildId`), troca de cuidador (`setActiveCaregiverId`), limpeza de memória ou restauração de dados incrementa `stateGeneration` (`incrementGeneration()`).
- Antes de aplicar qualquer commit em memória, `validateCommit(operationId, targetChildId, currentCaregiver)` verifica:
  1. Se `operationId` corresponde exatamente à operação detentora do lock.
  2. Se `stateGeneration === snapshot.stateGeneration` (nenhuma troca de contexto ocorreu desde o início da operação).
  3. Se `currentCaregiver.id === snapshot.caregiverId`.
  4. Se `currentCaregiver.status === 'ACTIVE'`.
  5. Se `currentCaregiver.linkedChildIds.includes(targetChildId)`.

Se qualquer uma dessas 5 condições falhar, o resultado é descartado e o commit é abortado com status `CANCELLED`, preservando o estado anterior intacto.
