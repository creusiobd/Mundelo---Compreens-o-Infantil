# Evidências de Teste Adversarial: MUNDELO Foundation v0.4A

## 1. Sumário de Execução

- **Executor:** Node Test Runner nativo + `tsx` (`npm test`)
- **Data/Hora:** 12 de Novembro de 2026
- **Ambiente:** Linux x86_64 / Node.js v22.14.0 / V8 12.4.254.21
- **Suítes Executadas:** 4 suítes
  1. `tests/foundation-v0.2.test.ts` (Contratos canônicos e schemas Zod)
  2. `tests/foundation-v0.3.test.ts` (Cuidadores, proveniência e menor privilégio)
  3. `tests/foundation-v0.4a.test.ts` (Cofre Criptografado baseline)
  4. `tests/vault-adversarial-v0.4a.test.ts` (Gate Adversarial SEC-01 a SEC-24)
- **Contagem Total de Casos de Teste:** **75 testes**
- **Testes Aprovados:** **75 / 75 (100% de sucesso)**
- **Testes Falhos:** **0**
- **Tempo Total de Execução:** ~4.6 segundos

---

## 2. Detalhamento dos Testes Adversariais por Fase

### Fase 2: Testes Criptográficos (SEC-01 a SEC-10)
- `ok 1 - SEC-01: Senha incorreta — deve rejeitar decifragem sem vazar dados ou chave` (155 ms)
- `ok 2 - SEC-02: Alteração de bytes do ciphertext — deve falhar via integridade AES-GCM` (120 ms)
- `ok 3 - SEC-03: Alteração da tag GCM (últimos 16 bytes) — deve falhar na autenticação GMAC` (118 ms)
- `ok 4 - SEC-04: Alteração de AAD e metadados autenticados (childId) — deve detectar divergência` (120 ms)
- `ok 5 - SEC-05: Substituição de algoritmo por AES-CBC ou DES — deve rejeitar no schema` (63 ms)
- `ok 6 - SEC-06: Redução de iterações PBKDF2 (< 100.000) — deve rejeitar downgrade fraco` (61 ms)
- `ok 7 - SEC-07: Salt e IV vazios, inválidos ou de tamanho incorreto — deve rejeitar` (61 ms)
- `ok 8 - SEC-08: Versões de formato desconhecidas (formatVersion !== 1) — deve rejeitar` (68 ms)
- `ok 9 - SEC-09: Arquivo maior que 5 MB — deve ser rejeitado antes da derivação de chave` (22 ms)
- `ok 10 - SEC-10: Arquivo malformado, truncado ou com JSON inválido — deve tratar com erro seguro` (0.8 ms)

### Fase 3: Autorização, Isolamento e Transacionalidade (SEC-11 a SEC-18)
- `ok 1 - SEC-11: Importação cruzada entre crianças Tomás e Lia — deve rejeitar discrepâncias internas` (137 ms)
- `ok 2 - SEC-12: Exportação por cuidador não autorizado — deve barrar cuidador sem vínculo ou suspenso` (0.5 ms)
- `ok 3 - SEC-13: Importação por cuidador não autorizado — deve barrar commit não autorizado` (0.5 ms)
- `ok 4 - SEC-14: Merge com IDs coincidentes e conflitos de revisão — resolução determinística` (0.3 ms)
- `ok 5 - SEC-15: Replace contendo referências inválidas — deve rejeitar cuidadores inexistentes` (0.5 ms)
- `ok 6 - SEC-16: Rollback em erro de importação — zero mutações de estado quando houver falha` (0.3 ms)
- `ok 7 - SEC-17: Duplo submit e operações concorrentes — flag de guarda previne concorrência` (0.2 ms)
- `ok 8 - SEC-18: Troca de cuidador durante importação assíncrona — revalidação no commit` (0.4 ms)

### Fase 4: Resiliência, Robustez e UX de Segurança (SEC-19 a SEC-24)
- `ok 1 - SEC-19: Duas exportações consecutivas produzem Salt e IV distintos (CSPRNG)` (137 ms)
- `ok 2 - SEC-20: Ausência de segredos ou chaves em strings de erro e representações públicas` (59 ms)
- `ok 3 - SEC-21: XSS Resilience — payload contendo scripts HTML é tratado com integridade pura` (138 ms)
- `ok 4 - SEC-22: Rejeição estrita de versões não suportadas` (1.2 ms)
- `ok 5 - SEC-23: Medição de benchmark de derivação PBKDF2 e decifragem AES-GCM` (147 ms)
- `ok 6 - SEC-24: Regressão e limites adicionais — payload com dados semanticamente inválidos` (2.1 ms)
- `ok 7 - SEC-Extra: Payload com excesso de observações (> 2000) deve ser barrado por DoS protection` (2.5 ms)
- `ok 8 - SEC-Extra: Envelope com adulteração de contagem de registros deve ser barrado` (123 ms)

---

## 3. Log de Execução Sintetizado (TAP v13)

```text
TAP version 13
# Subtest: Suite de Testes Automatizados — MUNDELO Foundation v0.2
    1..21
ok 1 - Suite de Testes Automatizados — MUNDELO Foundation v0.2
# Subtest: Suite de Testes Automatizados — MUNDELO Foundation v0.3
    1..15
ok 2 - Suite de Testes Automatizados — MUNDELO Foundation v0.3
# Subtest: Suite de Testes Automatizados — MUNDELO Foundation v0.4A (Cofre Criptografado)
    1..13
ok 3 - Suite de Testes Automatizados — MUNDELO Foundation v0.4A (Cofre Criptografado)
# Subtest: GATE ADVERSARIAL — MUNDELO Foundation v0.4A (.mundelo-vault)
    # Subtest: Fase 2: Testes Criptográficos Adversariais (SEC-01 a SEC-10)
        1..10
    ok 1 - Fase 2: Testes Criptográficos Adversariais (SEC-01 a SEC-10)
    # Subtest: Fase 3: Autorização, Isolamento e Transacionalidade (SEC-11 a SEC-18)
        1..8
    ok 2 - Fase 3: Autorização, Isolamento e Transacionalidade (SEC-11 a SEC-18)
    # Subtest: Fase 4: Resiliência, Robustez e UX de Segurança (SEC-19 a SEC-24)
        1..8
    ok 3 - Fase 4: Resiliência, Robustez e UX de Segurança (SEC-19 a SEC-24)
    1..3
ok 4 - GATE ADVERSARIAL — MUNDELO Foundation v0.4A (.mundelo-vault)
1..4
# tests 75
# suites 27
# pass 75
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 4683.956621
```
