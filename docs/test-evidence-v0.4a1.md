# Evidências de Testes — Foundation v0.4A.1

**Data da Execução:** 2025-05-12  
**Ambiente Automatizado:** Node.js / Vitest + Web Crypto API nativa (`crypto.subtle`)  
**Total de Suítes:** 5 suítes (`v0.2`, `v0.3`, `v0.4a`, `vault-adversarial-v0.4a`, `foundation-v0.4a1`)  
**Total de Testes Automatizados:** **92 testes executados / 92 aprovados (100% PASS)**

---

## 1. Resumo das Suítes Executadas

| Arquivo de Teste | Escopo | Testes | Resultado |
| :--- | :--- | :---: | :---: |
| `tests/foundation-v0.2.test.ts` | Isolamento de perfis, zero vazamento entre crianças, zero persistência local | 21 | **PASS** |
| `tests/foundation-v0.3.test.ts` | Cuidadores, RBAC demonstrativo, proveniência, histórico de revisões | 15 | **PASS** |
| `tests/foundation-v0.4a.test.ts` | Criptografia Web Crypto API, PBKDF2 600k, AES-GCM-256, AAD, Zod schemas | 13 | **PASS** |
| `tests/vault-adversarial-v0.4a.test.ts` | Testes adversariais SEC-01 a SEC-24 (tampering de bytes, IV, salt, AAD, DoS, RBAC) | 26 | **PASS** |
| `tests/foundation-v0.4a1.test.ts` | Fechamento SEC-14 (merge determinístico), SEC-17/18 (concorrência/locks), SEC-23 (motor de benchmark e exclusão de bundle prod) | 17 | **PASS** |
| **TOTAL** | **Todas as suítes combinadas** | **92** | **92 PASS** |

---

## 2. Detalhamento dos Novos Testes da Foundation v0.4A.1 (`tests/foundation-v0.4a1.test.ts`)

| # | Caso de Teste | Requisito | Status |
| :---: | :--- | :---: | :---: |
| 1 | Registro ausente localmente retorna `INSERT` | SEC-14 | **PASS** |
| 2 | Revisão recebida menor que a local retorna `KEEP` e preserva registro local | SEC-14 | **PASS** |
| 3 | Revisão igual e conteúdo canônico idêntico (mesmo com chaves em ordem inversa) retorna `NOOP` | SEC-14 | **PASS** |
| 4 | Revisão igual e conteúdo divergente retorna `CONFLICT` (proibido *last-write-wins*) | SEC-14 | **PASS** |
| 5 | Revisão maior com mudanças válidas e campos imutáveis preservados retorna `UPDATE` | SEC-14 | **PASS** |
| 6 | Revisão maior tentando adulterar campos imutáveis (`recordedByCaregiverId` ou `recordedAt`) retorna `CONFLICT` | SEC-14 | **PASS** |
| 7 | ID conflitante pertencente a outra criança retorna `CONFLICT` | SEC-14 | **PASS** |
| 8 | Lote de merge com 1 conflito após registros válidos aborta o lote inteiro (zero mutação parcial) | SEC-14 | **PASS** |
| 9 | Importação repetida do mesmo cofre é 100% idempotente (todos `NOOP`) | SEC-14 | **PASS** |
| 10 | Duas operações concorrentes reais com Promises/barreiras rejeitam a segunda e preservam o lock da primeira | SEC-17 | **PASS** |
| 11 | Troca de criança durante operação assíncrona cancela logicamente o commit (`stateGeneration`) | SEC-18 | **PASS** |
| 12 | Troca de cuidador durante pré-visualização rejeita o commit | SEC-18 | **PASS** |
| 13 | Revogação simulada de vínculo ou suspensão do cuidador (`SUSPENDED`) antes do commit rejeita a operação | SEC-18 | **PASS** |
| 14 | `computeStatistics` calcula corretamente Min, Mediana, Média, P90, P95 e Max | SEC-23 | **PASS** |
| 15 | `generateSyntheticScenarioPayload('NEAR_5MB_LIMIT')` gera 1.500 observações (~4,5 MB no envelope Base64, abaixo do limite de 5 MB) | SEC-23 | **PASS** |
| 16 | `runScenarioBenchmark('SMALL')` executa warm-up + amostras medidas e não vaza senhas nem textos sintéticos no relatório | SEC-23 | **PASS** |
| 17 | Rota `/security-lab` está estritamente protegida por `import.meta.env.DEV` e ausente dos artefatos de produção (`dist/assets/*.js`) | SEC-23 | **PASS** |

---

## 3. Testes Não Executados em Dispositivo Físico

| ID | Descrição | Ambiente Necessário | Status |
| :--- | :--- | :--- | :---: |
| **SEC-23 (Hardware Android Real)** | Execução da suíte completa (1 warm-up + 10 amostras em `SMALL`, `MEDIUM`, `NEAR_5MB_LIMIT` com 600.000 iterações PBKDF2) em aparelho Android físico intermediário | Smartphone Android físico conectado via `adb reverse` ou HTTPS local | **`NOT_EXECUTED`** |
