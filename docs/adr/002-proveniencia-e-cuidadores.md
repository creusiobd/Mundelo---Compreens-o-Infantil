# ADR 002: Proveniência Canônica e Modelo de Cuidadores Simulados

**Data:** 12 de Novembro de 2026  
**Status:** Aprovado  
**Contexto:** MUNDELO Foundation v0.3  
**Decisores:** Principal Software Engineer, Security Architect, UX Engineer, Quality Auditor  

---

## 1. Contexto e Problema

Na Foundation v0.2, estabelecemos o isolamento lógico estrito entre perfis de crianças (`childId`) e introduzimos a diferenciação básica de proveniência (`DIRECT` vs `REPORTED_BY_OTHER`). Contudo, duas lacunas fundamentais persistiam:
1. **Ausência de Sujeito do Registro:** As observações eram gravadas no sistema sem identificação estruturada de qual cuidador ou ator realizou a inserção (`recordedByCaregiverId`) e de quem efetivamente presenciou o fato (`observedByCaregiverId`).
2. **Ambiguidade em Relatos de Terceiros:** Quando um evento era relatado por terceiros (ex: educadora da creche ou avó), não havia campo explícito para registrar a fonte não autenticada (`reportedByLabel`), arriscando que declarações indiretas fossem tratadas com a mesma autoridade epistêmica de observações diretas dos pais.
3. **Ausência de Rastreabilidade de Revisões:** Atualizações sobrescreviam o registro sem controle numérico de versão (`revision`) ou registro de timestamp de alteração (`updatedAt`).
4. **Falta de Políticas de Autorização Simuladas:** Não existiam barreiras conceituais de controle de acesso (RBAC/ABAC) demonstrando o princípio do menor privilégio para diferentes figuras da rede de apoio (pais, avós, educadores, terapeutas).

---

## 2. Decisão Arquitetural

### 2.1 Modelo Canônico de Cuidadores (`Caregiver`)
Criamos a entidade `Caregiver` com:
- `id`: identificador canônico estável (ex: `cg-helena`, `cg-carlos`).
- `displayName`: nome de exibição amigável.
- `role`: papel canônico restrito (`LEGAL_GUARDIAN`, `FAMILY_CAREGIVER`, `EDUCATOR`, `PROFESSIONAL`).
- `linkedChildIds`: array explícito de IDs de crianças para as quais o cuidador tem vínculo ativo.
- `status`: ciclo de vida (`ACTIVE`, `INVITED`, `SUSPENDED`).
- `relationshipLabel`: descrição textual do vínculo afetivo/institucional.

**Regra Absoluta:** O papel do cuidador NÃO concede poderes universais. Toda autorização depende conjuntamente de:
1. `status === 'ACTIVE'`
2. Vínculo explícito com a criança (`linkedChildIds.includes(childId)`)
3. Escopo específico da ação pretendida.

### 2.2 Estrutura Canônica de Proveniência na Observação
Evoluímos o schema de `Observation` para conter:
- `recordedByCaregiverId`: string obrigatória vinculada ao cuidador autenticado na sessão.
- `observedByCaregiverId`: string opcional para o cuidador que presenciou o fato.
- `reportedByLabel`: string opcional que armazena a fonte declarada de observações indiretas (ex: `"Professora Mariana (Creche)"`), sem criar credenciais ou contas para terceiros.
- `provenance`: enum `DIRECT` | `REPORTED_BY_OTHER`.
- `revision`: inteiro positivo estrito $\ge 1$, incrementado a cada edição.
- `occurredAt`: momento do fato no mundo real.
- `recordedAt`: momento do registro no sistema (imutável).
- `updatedAt`: momento da última edição (opcional, registrado a partir da revisão #2).

### 2.3 Simulação de Políticas de Autorização (Client-Side Least Privilege)
Implementamos funções puras e testáveis:
- `canReadObservation(caregiver, childId, observation)`
- `canCreateObservation(caregiver, childId)`
- `canEditObservation(caregiver, childId, observation)`
- `canDeleteObservation(caregiver, childId, observation)`
- `canIncludeInReport(caregiver, childId, observation)`

**Diretriz Inegociável:** Estas políticas são client-side e destinadas estritamente a fins educacionais, de validação de fluxo e simulação de UX. Em nenhuma circunstância o produto alega que verificações no cliente substituem autorização criptográfica e controle de acesso no servidor.

---

## 3. Consequências e Trade-offs

### Positivas
- **Auditabilidade e Proveniência Confiável:** Cada registro agora possui autoria inequívoca, permitindo diferenciar o que foi visto diretamente pelos pais daquilo que foi comunicado por terceiros.
- **Transparência em Relatórios Profissionais:** Sínteses para pediatras ou fonoaudiólogos indicam claramente quem observou e quem relatou cada evento.
- **Prevenção de Corrupção Acidental:** Edições incrementam `revision` e preservam `childId`, `recordedAt` e `recordedByCaregiverId`.
- **Demonstração de Menor Privilégio:** Cuidadores sem vínculo ou suspensos têm botões e ações bloqueados com avisos didáticos imediatos.

### Restrições e Limitações
- **Memória Volátil:** A persistência permanece 100% em memória; recarregar o navegador restaura os estados simulados.
- **Não há Assinatura Criptográfica:** As revisões e proveniências são rastreadas estruturalmente no modelo de dados, mas ainda não possuem assinaturas digitais ou hashes encadeados (planejamento para etapas futuras com Web Crypto API).
