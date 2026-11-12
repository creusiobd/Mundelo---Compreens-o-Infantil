# Evidências de Testes Automatizados — Foundation v0.2
**Projeto:** MUNDELO — Compreensão Infantil  
**Data da Execução:** 12 de Novembro de 2026  
**Ambiente de Execução:** Node.js v22.14.0 / TSX v4.21.0 / Node Test Runner  
**Arquivo de Testes:** `tests/foundation-v0.2.test.ts`  
**Comando Executado:** `npx tsx --test tests/foundation-v0.2.test.ts`  

---

## 1. Resumo Executivo dos Testes

- **Total de Suítes Executadas:** 10
- **Total de Asserções / Testes:** 21
- **Aprovações:** 21 (100%)
- **Falhas:** 0
- **Cancelados / Pulados:** 0
- **Tempo Total de Execução:** ~723ms

---

## 2. Matriz de Cobertura e Resultados

| Suíte de Teste | Quantidade de Cenários | Status | Evidência Chave |
|---|---|---|---|
| **1. Isolamento Lógico entre Perfis Fictícios** | 2 testes | **APROVADO** | Tomás (5 obs) e Lia (3 obs) rigorosamente segregados por `childId`; zero vazamento cruzado. |
| **2. Validação Canônica com Zod** | 5 testes | **APROVADO** | Rejeição de `childId` ausente, descrição < 3 chars, tipo clínico inventado (`diagnostico_tea`). Validação de proveniências `DIRECT` e `REPORTED_BY_OTHER`. |
| **3. Separação de Fatos e Hipóteses** | 1 teste | **APROVADO** | `description` abriga fatos observáveis e `notes` abriga hipóteses reflexivas com fallback não clínico. |
| **4. CRUD em Memória e Imutabilidade** | 3 testes | **APROVADO** | Inclusão com `childId` imutável, edição protegida contra troca de perfil e exclusão isolada sem afetar outros perfis. |
| **5. Filtros e Ordenação** | 3 testes | **APROVADO** | Filtros por `eventType`, busca textual em múltiplos campos e ordenação cronológica ascendente/descendente. |
| **6. Integridade de Relatório** | 2 testes | **APROVADO** | Relatório de Lia contém 0% de observações de Tomás. Rejeição de IDs de outra criança na lista de selecionados. |
| **7. Acessibilidade (WCAG AA & Touch)** | 2 testes | **APROVADO** | Alvos de toque $\ge 44\text{px}$ confirmados; razão de contraste `#133E43` sobre `#F8F5EF` de $\approx 10.77:1$ ($\ge 4.5:1$). |
| **8. Ausência de Persistência em Disco** | 1 teste | **APROVADO** | Confirmação de que `localStorage`, `sessionStorage` e `IndexedDB` não contêm dados da aplicação. |
| **9. Resiliência a Entradas Longas e Acentos** | 2 testes | **APROVADO** | Processamento íntegro de string de 2.160 caracteres e preservação de aspas, emojis e acentuação da língua portuguesa. |

---

## 3. Registro Bruto do Test Runner (Log de Execução)

```tap
TAP version 13
# Subtest: Suite de Testes Automatizados — MUNDELO Foundation v0.2
    # Subtest: 1. Isolamento Lógico entre Perfis Fictícios
        # Subtest: deve garantir que todas as observações pré-carregadas possuem childId válido
        ok 1 - deve garantir que todas as observações pré-carregadas possuem childId válido
        # Subtest: deve segregar estritamente as observações de Tomás e Lia
        ok 2 - deve segregar estritamente as observações de Tomás e Lia
        1..2
    ok 1 - 1. Isolamento Lógico entre Perfis Fictícios
    # Subtest: 2. Validação de Observações e Schemas Canônicos
        # Subtest: deve validar com sucesso uma observação válida e completa
        ok 1 - deve validar com sucesso uma observação válida e completa
        # Subtest: deve rejeitar observação sem childId
        ok 2 - deve rejeitar observação sem childId
        # Subtest: deve rejeitar descrição curta demais (< 3 caracteres)
        ok 3 - deve rejeitar descrição curta demais (< 3 caracteres)
        # Subtest: deve rejeitar tipo de evento clínico ou não autorizado
        ok 4 - deve rejeitar tipo de evento clínico ou não autorizado
        # Subtest: deve aceitar e normalizar proveniências DIRECT e REPORTED_BY_OTHER
        ok 5 - deve aceitar e normalizar proveniências DIRECT e REPORTED_BY_OTHER
        1..5
    ok 2 - 2. Validação de Observações e Schemas Canônicos
    # Subtest: 3. Separação de Fatos Observados e Hipóteses do Cuidador
        # Subtest: deve conter fatos em description e hipóteses em notes com fallback não clínico
        ok 1 - deve conter fatos em description e hipóteses em notes com fallback não clínico
        1..1
    ok 3 - 3. Separação de Fatos Observados e Hipóteses do Cuidador
    # Subtest: 4. Operações CRUD em Memória e Prevenção de Mutações Cruzadas
        # Subtest: deve criar nova observação vinculada obrigatoriamente à criança ativa
        ok 1 - deve criar nova observação vinculada obrigatoriamente à criança ativa
        # Subtest: não deve permitir alteração de childId em uma observação existente
        ok 2 - não deve permitir alteração de childId em uma observação existente
        # Subtest: deve excluir observação sem afetar outros perfis
        ok 3 - deve excluir observação sem afetar outros perfis
        1..3
    ok 4 - 4. Operações CRUD em Memória e Prevenção de Mutações Cruzadas
    # Subtest: 5. Filtros de Busca e Ordenação
        # Subtest: deve filtrar observações por tipo de evento corretamente
        ok 1 - deve filtrar observações por tipo de evento corretamente
        # Subtest: deve filtrar por termo de busca no texto da descrição ou antecedentes
        ok 2 - deve filtrar por termo de busca no texto da descrição ou antecedentes
        # Subtest: deve ordenar observações cronologicamente de forma consistente
        ok 3 - deve ordenar observações cronologicamente de forma consistente
        1..3
    ok 5 - 5. Filtros de Busca e Ordenação
    # Subtest: 6. Integridade do Relatório — Ausência de Dados de Outro Perfil
        # Subtest: deve gerar relatório estritamente com as observações da criança selecionada
        ok 1 - deve gerar relatório estritamente com as observações da criança selecionada
        # Subtest: deve rejeitar inclusão de ID de outra criança na lista de selecionados do relatório
        ok 2 - deve rejeitar inclusão de ID de outra criança na lista de selecionados do relatório
        1..2
    ok 6 - 6. Integridade do Relatório — Ausência de Dados de Outro Perfil
    # Subtest: 7. Conformidade com Acessibilidade (WCAG AA & Touch Targets)
        # Subtest: deve garantir alvos de toque mínimos de 44x44px
        ok 1 - deve garantir alvos de toque mínimos de 44x44px
        # Subtest: deve verificar paleta com contraste WCAG AA superior a 4.5:1
        ok 2 - deve verificar paleta com contraste WCAG AA superior a 4.5:1
        1..2
    ok 7 - 7. Conformidade com Acessibilidade (WCAG AA & Touch Targets)
    # Subtest: 8. Ausência de Persistência em Disco / Armazenamento Local
        # Subtest: deve confirmar que os dados da sessão residem 100% em estruturas de memória
        ok 1 - deve confirmar que os dados da sessão residem 100% em estruturas de memória
        1..1
    ok 8 - 8. Ausência de Persistência em Disco / Armazenamento Local
    # Subtest: 9. Resiliência com Entradas Longas e Caracteres Especiais
        # Subtest: deve validar e processar entrada longa (2000 caracteres) sem corrupção
        ok 1 - deve validar e processar entrada longa (2000 caracteres) sem corrupção
        # Subtest: deve preservar caracteres acentuados, pontuações e aspas
        ok 2 - deve preservar caracteres acentuados, pontuações e aspas
        1..2
    ok 9 - 9. Resiliência com Entradas Longas e Caracteres Especiais
    1..9
ok 1 - Suite de Testes Automatizados — MUNDELO Foundation v0.2
1..1
# tests 21
# suites 10
# pass 21
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 723.176072
```
