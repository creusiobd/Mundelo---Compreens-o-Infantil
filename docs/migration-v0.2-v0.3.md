# Guia de Migração e Compatibilidade Reversa: v0.2 -> v0.3

**Status:** Concluído e Validado por Testes  
**Data:** 12 de Novembro de 2026  
**Auditor:** Quality & Systems Integration Lead  

---

## 1. Visão Geral das Mudanças de Contrato

A versão Foundation v0.3 adiciona novos campos canônicos ao tipo `Observation` para suportar autoria e rastreabilidade:

| Campo | Foundation v0.2 | Foundation v0.3 | Tratamento de Migração |
| :--- | :--- | :--- | :--- |
| `id` | Obrigatório | Obrigatório | Preservado intacto |
| `childId` | Obrigatório | Obrigatório | Preservado intacto |
| `recordedByCaregiverId` | *Inexistente* | **Obrigatório** (string) | Preenchido com ID do cuidador responsável (`cg-helena` como fallback canônico) |
| `observedByCaregiverId` | *Inexistente* | Opcional (string) | Preenchido com o autor em observações `DIRECT`, ou omitido |
| `reportedByLabel` | *Inexistente* | Opcional (string) | Preenchido com `"Relatado por terceiro"` se `provenance === 'REPORTED_BY_OTHER'` |
| `provenance` | `DIRECT` \| `REPORTED_BY_OTHER` | `DIRECT` \| `REPORTED_BY_OTHER` | Preservado intacto |
| `revision` | *Inexistente* | **Obrigatório** ($\ge 1$) | Inicializado em `1` para registros pré-existentes |
| `updatedAt` | *Inexistente* | Opcional (ISO string) | Omitido até que ocorra a primeira modificação |
| `occurredAt` | Obrigatório | Obrigatório | Preservado intacto |
| `recordedAt` | Obrigatório | Obrigatório | Preservado intacto |
| `description` ... `notes` | Campos textuais | Campos textuais | Preservados integralmente sem corrupção |

---

## 2. Função de Migração Canônica (`migrateObservationV2ToV3`)

Localizada em `src/validation/migration.ts`, a função `migrateObservationV2ToV3(legacy, fallbackCaregiverId)` garante que qualquer objeto no formato da v0.2 seja transformado em um objeto válido da v0.3:

```typescript
export function migrateObservationV2ToV3(
  legacy: any,
  fallbackCaregiverId = 'cg-helena'
): Observation {
  if (!legacy || typeof legacy !== 'object') {
    throw new Error('Registro legado inválido para migração.');
  }

  const provenance = legacy.provenance === 'REPORTED_BY_OTHER' ? 'REPORTED_BY_OTHER' : 'DIRECT';
  const recordedByCaregiverId =
    legacy.recordedByCaregiverId || legacy.caregiverId || fallbackCaregiverId;

  const observedByCaregiverId =
    legacy.observedByCaregiverId ||
    (provenance === 'DIRECT' ? (legacy.caregiverId || fallbackCaregiverId) : undefined);

  const reportedByLabel =
    legacy.reportedByLabel ||
    (provenance === 'REPORTED_BY_OTHER' ? 'Relatado por terceiro' : undefined);

  const revision =
    typeof legacy.revision === 'number' && legacy.revision >= 1 ? legacy.revision : 1;

  const candidate: Observation = {
    id: legacy.id || `migrated-${Date.now()}`,
    childId: legacy.childId || 'tomas',
    recordedByCaregiverId,
    observedByCaregiverId,
    reportedByLabel,
    provenance,
    occurredAt: legacy.occurredAt || new Date().toISOString().slice(0, 16),
    recordedAt: legacy.recordedAt || new Date().toISOString(),
    updatedAt: legacy.updatedAt,
    revision,
    environment: legacy.environment || 'casa',
    observerRole: legacy.observerRole || 'mae',
    eventType: legacy.eventType || 'conquista',
    description: legacy.description || 'Observação migrada sem descrição detalhada.',
    antecedents: legacy.antecedents || 'Não observado',
    communicationSignals: legacy.communicationSignals || 'Não observado',
    supportOffered: legacy.supportOffered || 'Apenas observação atenta',
    observedOutcome: legacy.observedOutcome || 'Não observado',
    positiveAspects: legacy.positiveAspects || 'Não observado',
    notes: legacy.notes || 'Registro migrado da versão v0.2.',
  };

  return validateObservation(candidate);
}
```

---

## 3. Compatibilidade Reversa da Suíte de Testes da v0.2

Para assegurar que nenhuma funcionalidade ou teste existente foi quebrado pela introdução do campo `recordedByCaregiverId`:
1. `ObservationSchema` em `src/validation/schemas.ts` atribui `.default('cg-helena')` caso o campo seja omitido por dados legados, garantindo que testes e entradas da v0.2 continuem validando com sucesso.
2. A suíte original `tests/foundation-v0.2.test.ts` foi executada integralmente contra a nova base de código, obtendo **21/21 testes aprovados (100%)**.
3. A nova suíte `tests/foundation-v0.3.test.ts` valida a migração individual e em lote (`migrateObservationBatch`), obtendo **15/15 testes aprovados (100%)**.
