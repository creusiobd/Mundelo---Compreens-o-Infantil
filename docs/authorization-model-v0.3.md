# Modelo de Autorização Demonstrativa — MUNDELO Foundation v0.3

**Status:** Implementado (Simulação Client-Side)  
**Data:** 12 de Novembro de 2026  
**Auditor:** Principal Security Architect & Privacy Engineer  

---

## 1. Princípio Arquitetural Reitor: Deny-by-Default (Negação por Padrão)

No Mundelo Foundation v0.3, qualquer ação solicitada por um cuidador simulado é **negada por padrão**, a menos que uma regra afirmativa explícita conceda acesso.

### Aviso de Limite Técnico
> **Aviso Ético e Técnico:** As regras descritas neste documento são executadas no contexto da interface do usuário (React/TypeScript em memória). Elas servem para modelar a experiência do usuário, validar a separação de papéis e impedir ações indevidas no fluxo demonstrativo. Elas **NÃO** constituem segurança de infraestrutura nem autorização autenticada no servidor. Em etapas futuras com backend, estas mesmas regras serão executadas em ambiente seguro com tokens criptografados e avaliação de permissões autoritativa no servidor.

---

## 2. Matriz de Autorização por Papel e Vínculo

A matriz abaixo resume a política demonstrativa implementada:

| Papel (`CaregiverRole`) | Vínculo com a Criança | Status do Cuidador | Leitura (`canRead`) | Criação (`canCreate`) | Edição de Registros Próprios (`canEdit`) | Edição de Registros de Outros (`canEdit`) | Exclusão de Registros Próprios (`canDelete`) | Exclusão de Registros de Outros (`canDelete`) | Inclusão em Relatório (`canIncludeInReport`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **LEGAL_GUARDIAN** (Guardião Legal) | Sim | Ativo | **Sim** | **Sim** | **Sim** | **Sim** | **Sim** | **Sim** | **Sim** |
| **LEGAL_GUARDIAN** | Não | Ativo | Não | Não | Não | Não | Não | Não | Não |
| **LEGAL_GUARDIAN** | Sim | Suspenso | Não | Não | Não | Não | Não | Não | Não |
| **FAMILY_CAREGIVER** (Cuidador Familiar) | Sim | Ativo | **Sim** | **Sim** | **Sim** | Não | **Sim** | Não | **Sim** |
| **EDUCATOR** (Educador Escolar) | Sim | Ativo | **Sim** | **Sim** | **Sim** | Não | **Sim** | Não | **Sim** |
| **PROFESSIONAL** (Terapeuta / Saúde) | Sim | Ativo | **Sim** | **Sim** | **Sim** | Não | **Sim** | Não | **Sim** |
| **Qualquer Papel** | Não | Ativo | Não | Não | Não | Não | Não | Não | Não |
| **Qualquer Papel** | Sim/Não | Suspenso | Não | Não | Não | Não | Não | Não | Não |

---

## 3. Especificação das Políticas Puras

### 3.1 `canReadObservation(caregiver, childId, observation?)`
1. Rejeita se `caregiver == null` ou `caregiver.status !== 'ACTIVE'`.
2. Rejeita se `childId` não estiver presente em `caregiver.linkedChildIds`.
3. Rejeita se `observation` for informado e `observation.childId !== childId`.
4. Concede leitura se todas as condições acima forem satisfeitas.

### 3.2 `canCreateObservation(caregiver, childId)`
1. Rejeita se `caregiver == null` ou `caregiver.status !== 'ACTIVE'`.
2. Rejeita se `childId` não estiver em `caregiver.linkedChildIds`.
3. Concede criação apenas se o cuidador mantiver vínculo ativo com a criança indicada.

### 3.3 `canEditObservation(caregiver, childId, observation)`
1. Executa previamente `canReadObservation(caregiver, childId, observation)`; se falso, rejeita.
2. Se `caregiver.role === 'LEGAL_GUARDIAN'`, autoriza a edição para curadoria do acervo da criança.
3. Se `observation.recordedByCaregiverId === caregiver.id`, autoriza a edição (o autor original pode retificar suas notas).
4. Em qualquer outro caso, rejeita (ex: educador tentando alterar registro de um familiar).

### 3.4 `canDeleteObservation(caregiver, childId, observation)`
1. Executa previamente `canReadObservation(caregiver, childId, observation)`; se falso, rejeita.
2. Se `caregiver.role === 'LEGAL_GUARDIAN'`, autoriza a exclusão da observação.
3. Se `observation.recordedByCaregiverId === caregiver.id`, autoriza a exclusão do próprio registro.
4. Nega exclusão se o cuidador não for guardião nem o autor original.

### 3.5 `canIncludeInReport(caregiver, childId, observation)`
1. Executa previamente `canReadObservation(caregiver, childId, observation)`; se falso, rejeita.
2. Permite a qualquer cuidador ativo e vinculado selecionar registros contextuais para compor o diálogo com profissionais.

---

## 4. Feedback Visual e Ergonomia de Acesso na Interface

Para garantir clareza cognitiva e conformidade com WCAG AA:
- **Banner de Menor Privilégio:** Quando o usuário seleciona no cabeçalho um cuidador sem vínculo (ex: `Ana (Sem Vínculo)` ou `Pedro (Suspenso)`), um alerta visual contextual âmbar/vermelho é renderizado informando os motivos do bloqueio.
- **Botões Desabilitados com Tooltip Semântico:** Botões de "Nova Observação", "Editar", "Excluir" e "+ Relatório" recebem `disabled={!isAllowed}` com o atributo `title` explicativo, informando a regra violada.
- **Formulário de Observação Protegido:** Se aberto em estado não permitido, o formulário exibe banner de aviso em vermelho e mantém o botão de submissão desabilitado.
