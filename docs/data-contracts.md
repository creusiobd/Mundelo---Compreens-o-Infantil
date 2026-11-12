# Especificação de Contratos de Dados Canônicos — Foundation v0.2
**Projeto:** MUNDELO — Compreensão Infantil  
**Versão dos Contratos:** 0.2.0  
**Motor de Validação:** Zod 3.x com TypeScript 7.x  

---

## 1. Princípios de Modelagem

1. **Separação Epistemológica:**
   - **Fato Observável (`description`):** Registro de condutas, gestos e acontecimentos verificáveis.
   - **Contexto Prévio (`antecedents`):** Estímulos ambientais imediatamente anteriores.
   - **Hipótese Reflexiva (`notes`):** Interpretações subjetivas do cuidador, estritamente rotuladas como hipóteses não clínicas.
2. **Isolamento de Entidade:** Todo registro de observação possui obrigatoriamente um identificador canônico `childId`.
3. **Fidelidade Temporal:** Separação entre o instante do fenômeno no mundo real (`occurredAt`) e o instante de inserção no sistema (`recordedAt`).
4. **Proveniência:** Rastreio explícito se a observação foi direta (`DIRECT`) pelo adulto que registrou ou relatada por outro cuidador (`REPORTED_BY_OTHER`).
5. **Compatibilidade Retroativa:** Preserva todos os campos existentes na Foundation v0.1.

---

## 2. Contratos Canônicos

### 2.1. `Observation` (Observação Contextual)

```typescript
interface Observation {
  id: string;                    // UUID ou identificador único do registro
  childId: string;               // Referência obrigatória ao ChildProfile ativo
  occurredAt: string;            // Timestamp do evento (YYYY-MM-DDTHH:mm)
  recordedAt: string;            // Timestamp do registro no sistema (ISO 8601)
  provenance: 'DIRECT' | 'REPORTED_BY_OTHER'; // Fonte da informação
  caregiverId?: string;          // Referência opcional à entidade Caregiver
  environment: EnvironmentType;  // 'casa' | 'parque' | 'escola' | 'transporte_consulta' | 'reuniao_familia' | 'outro'
  observerRole: ObserverRole;    // 'mae' | 'pai' | 'avo' | 'cuidador' | 'educador' | 'terapeuta' | 'outro'
  eventType: EventType;          // 'conquista' | 'desconforto' | 'rotina' | 'descoberta'
  description: string;           // Fatos objetivos (mínimo de 3 caracteres)
  antecedents: string;           // Contexto antecedente (luz, som, rotina)
  communicationSignals: string;  // Pistas corporais e gestuais
  supportOffered: string;        // Estratégia de mediação ofertada
  observedOutcome: string;       // Resposta visível da criança
  positiveAspects: string;       // Potências e recursos observados
  notes: string;                 // Hipótese reflexiva do cuidador
  contextDetails?: ObservationContext;
  evidenceDetails?: EvidenceRecord;
}
```

### 2.2. `ChildProfile` (Perfil da Criança)

```typescript
interface ChildProfile {
  id: string;
  name: string;
  ageLabel: string;
  ageMonths: number;
  preferredPronoun: 'ele' | 'ela' | 'eles';
  interests: string[];
  comfortAnchors: string[];
  sensitivities: string[];
  communicationModes: string[];
  celebratedMilestones: string[];
  supportStrategies: SupportStrategy[];
}
```

### 2.3. `Caregiver` (Cuidador Observador)

```typescript
interface Caregiver {
  id: string;
  name: string;
  role: ObserverRole;
  relationship: string;
  isPrimary?: boolean;
}
```

### 2.4. `SupportStrategy` (Estratégia de Regulação)

```typescript
interface SupportStrategy {
  id: string;
  strategy: string;
  context: string;
  observedResponse: string;
}
```

---

## 3. Regras de Validação em Tempo de Execução (Runtime Zod)

- **`childId`:** Rejeita string vazia. Operações de CRUD só persistem se o `childId` corresponder ao perfil selecionado.
- **`eventType`:** Rejeita qualquer valor fora do conjunto fechado `['conquista', 'desconforto', 'rotina', 'descoberta']`.
- **`provenance`:** Rejeita valores que não sejam `DIRECT` ou `REPORTED_BY_OTHER`.
- **`description`:** Rejeita valores em branco ou menores que 3 caracteres.
- **Campos Opcionais/Não Observados:** Normalizados para `"Não observado"` caso não fornecidos, impedindo `undefined` e `null` no estado em memória.
