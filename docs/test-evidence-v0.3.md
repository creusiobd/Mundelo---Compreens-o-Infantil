# Evidências e Relatório de Testes Automatizados — MUNDELO Foundation v0.3

**Data:** 12 de Novembro de 2026  
**Ambiente:** Node.js v22.14.0 / TSX v4.21.0 / Node Test Runner (TAP 13)  
**Auditor de Qualidade:** Principal Software Engineer & Security Auditor  

---

## 1. Resumo Executivo da Execução de Testes

| Suíte de Testes | Arquivo | Testes Executados | Aprovados | Falhas | Tempo de Execução |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Foundation v0.2 (Baseline)** | `tests/foundation-v0.2.test.ts` | 21 | 21 (100%) | 0 | ~20 ms |
| **Foundation v0.3 (Novos Requisitos)** | `tests/foundation-v0.3.test.ts` | 15 | 15 (100%) | 0 | ~22 ms |
| **TOTAL CONSOLIDADO** | **2 suítes / 16 blocos** | **36** | **36 (100%)** | **0** | **~1.2 s total** |

---

## 2. Detalhamento dos Testes da Foundation v0.3

### 2.1 Modelo Canônico de Cuidadores e Integridade Referencial
- `deve validar todos os cuidadores simulados com papéis e status válidos`: **OK**
- `deve assegurar que todas as observações apontam para um cuidador existente`: **OK**
- `deve confirmar que os vínculos com crianças são explícitos`: **OK**

### 2.2 Políticas Demonstrativas de Autorização (Deny-by-Default)
- `canReadObservation: deve permitir leitura apenas a cuidadores ativos com vínculo à criança`: **OK**
- `canCreateObservation: deve autorizar criação apenas para cuidador ativo e vinculado`: **OK**
- `canEditObservation: guardião legal edita tudo da criança vinculada; outros apenas suas próprias`: **OK**
- `canDeleteObservation: apenas guardião legal ou o próprio autor podem excluir`: **OK**
- `canIncludeInReport: deve permitir inclusão apenas a cuidadores ativos vinculados à criança`: **OK**

### 2.3 Proveniência Canônica e Atribuição de Autoria
- `deve aceitar proveniência DIRECT com observedByCaregiverId opcional`: **OK**
- `deve aceitar proveniência REPORTED_BY_OTHER com reportedByLabel não autenticado`: **OK**

### 2.4 Rastreabilidade de Alterações e Controle de Revisões
- `deve rejeitar revisão menor que 1 ou não inteira`: **OK**
- `deve incrementar revision em +1 e preservar childId, recordedAt e recordedByCaregiverId na edição`: **OK**

### 2.5 Migração Canônica e Compatibilidade Reversa (v0.2 -> v0.3)
- `deve migrar registro v0.2 sem campos v0.3 atribuindo valores canônicos seguros`: **OK**
- `deve migrar registro v0.2 REPORTED_BY_OTHER com label padrão seguro`: **OK**
- `deve migrar lote de observações legadas mantendo integridade e contagem`: **OK**

---

## 3. Log Bruto TAP 13 (Comando: `npm test`)

```text
> react-example@0.0.0 test
> tsx --test tests/*.test.ts

TAP version 13
# Subtest: Suite de Testes Automatizados — MUNDELO Foundation v0.2
    # Subtest: 1. Isolamento Lógico entre Perfis Fictícios
        ok 1 - deve garantir que todas as observações pré-carregadas possuem childId válido
        ok 2 - deve segregar estritamente as observações de Tomás e Lia
    ok 1 - 1. Isolamento Lógico entre Perfis Fictícios
    # Subtest: 2. Validação de Observações e Schemas Canônicos
        ok 1 - deve validar com sucesso uma observação válida e completa
        ok 2 - deve rejeitar observação sem childId
        ok 3 - deve rejeitar descrição curta demais (< 3 caracteres)
        ok 4 - deve rejeitar tipo de evento clínico ou não autorizado
        ok 5 - deve aceitar e normalizar proveniências DIRECT e REPORTED_BY_OTHER
    ok 2 - 2. Validação de Observações e Schemas Canônicos
    # Subtest: 3. Separação de Fatos Observados e Hipóteses do Cuidador
        ok 1 - deve conter fatos em description e hipóteses em notes com fallback não clínico
    ok 3 - 3. Separação de Fatos Observados e Hipóteses do Cuidador
    # Subtest: 4. Operações CRUD em Memória e Prevenção de Mutações Cruzadas
        ok 1 - deve criar nova observação vinculada obrigatoriamente à criança ativa
        ok 2 - não deve permitir alteração de childId em uma observação existente
        ok 3 - deve excluir observação sem afetar outros perfis
    ok 4 - 4. Operações CRUD em Memória e Prevenção de Mutações Cruzadas
    # Subtest: 5. Filtros de Busca e Ordenação
        ok 1 - deve filtrar observações por tipo de evento corretamente
        ok 2 - deve filtrar por termo de busca no texto da descrição ou antecedentes
        ok 3 - deve ordenar observações cronologicamente de forma consistente
    ok 5 - 5. Filtros de Busca e Ordenação
    # Subtest: 6. Integridade do Relatório — Ausência de Dados de Outro Perfil
        ok 1 - deve gerar relatório estritamente com as observações da criança selecionada
        ok 2 - deve rejeitar inclusão de ID de outra criança na lista de selecionados do relatório
    ok 6 - 6. Integridade do Relatório — Ausência de Dados de Outro Perfil
    # Subtest: 7. Conformidade com Acessibilidade (WCAG AA & Touch Targets)
        ok 1 - deve garantir alvos de toque mínimos de 44x44px
        ok 2 - deve verificar paleta com contraste WCAG AA superior a 4.5:1
    ok 7 - 7. Conformidade com Acessibilidade (WCAG AA & Touch Targets)
    # Subtest: 8. Ausência de Persistência em Disco / Armazenamento Local
        ok 1 - deve confirmar que os dados da sessão residem 100% em estruturas de memória
    ok 8 - 8. Ausência de Persistência em Disco / Armazenamento Local
    # Subtest: 9. Resiliência com Entradas Longas e Caracteres Especiais
        ok 1 - deve validar e processar entrada longa (2000 caracteres) sem corrupção
        ok 2 - deve preservar caracteres acentuados, pontuações e aspas
    ok 9 - 9. Resiliência com Entradas Longas e Caracteres Especiais
ok 1 - Suite de Testes Automatizados — MUNDELO Foundation v0.2

# Subtest: Suite de Testes Automatizados — MUNDELO Foundation v0.3
    # Subtest: 1. Modelo Canônico de Cuidadores e Integridade Referencial
        ok 1 - deve validar todos os cuidadores simulados com papéis e status válidos
        ok 2 - deve assegurar que todas as observações apontam para um cuidador existente
        ok 3 - deve confirmar que os vínculos com crianças são explícitos
    ok 1 - 1. Modelo Canônico de Cuidadores e Integridade Referencial
    # Subtest: 2. Políticas Demonstrativas de Autorização (Deny-by-Default)
        ok 1 - canReadObservation: deve permitir leitura apenas a cuidadores ativos com vínculo à criança
        ok 2 - canCreateObservation: deve autorizar criação apenas para cuidador ativo e vinculado
        ok 3 - canEditObservation: guardião legal edita tudo da criança vinculada; outros apenas suas próprias
        ok 4 - canDeleteObservation: apenas guardião legal ou o próprio autor podem excluir
        ok 5 - canIncludeInReport: deve permitir inclusão apenas a cuidadores ativos vinculados à criança
    ok 2 - 2. Políticas Demonstrativas de Autorização (Deny-by-Default)
    # Subtest: 3. Proveniência Canônica e Atribuição de Autoria
        ok 1 - deve aceitar proveniência DIRECT com observedByCaregiverId opcional
        ok 2 - deve aceitar proveniência REPORTED_BY_OTHER com reportedByLabel não autenticado
    ok 3 - 3. Proveniência Canônica e Atribuição de Autoria
    # Subtest: 4. Rastreabilidade de Alterações e Controle de Revisões
        ok 1 - deve rejeitar revisão menor que 1 ou não inteira
        ok 2 - deve incrementar revision em +1 e preservar childId, recordedAt e recordedByCaregiverId na edição
    ok 4 - 4. Rastreabilidade de Alterações e Controle de Revisões
    # Subtest: 5. Migração Canônica e Compatibilidade Reversa (v0.2 -> v0.3)
        ok 1 - deve migrar registro v0.2 sem campos v0.3 atribuindo valores canônicos seguros
        ok 2 - deve migrar registro v0.2 REPORTED_BY_OTHER com label padrão seguro
        ok 3 - deve migrar lote de observações legadas mantendo integridade e contagem
    ok 5 - 5. Migração Canônica e Compatibilidade Reversa (v0.2 -> v0.3)
ok 2 - Suite de Testes Automatizados — MUNDELO Foundation v0.3

1..2
# tests 36
# suites 16
# pass 36
# fail 0
# cancelled 0
# skipped 0
# todo 0
```
