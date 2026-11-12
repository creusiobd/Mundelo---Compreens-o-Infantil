# Evidências de Teste Automatizado: MUNDELO Foundation v0.4A

## 1. Resumo Executivo da Execução de Testes

- **Ambiente:** Node.js v22.14.0 (Linux x86_64)
- **Executor:** Node Test Runner nativo (`tsx --test tests/*.test.ts`)
- **Total de Suítes Executadas:** 3 suítes completas
  - `tests/foundation-v0.2.test.ts` (Contratos canônicos, Zod, isolamento entre perfis demonstrativos)
  - `tests/foundation-v0.3.test.ts` (Cuidadores, proveniência, controle de revisões, deny-by-default)
  - `tests/foundation-v0.4a.test.ts` (Cofre criptografado, Web Crypto API, AES-GCM-256, PBKDF2, AAD, downgrade, limites)
- **Total de Casos de Teste:** **49 testes**
- **Testes Aprovados:** **49 / 49 (100% de sucesso)**
- **Testes Falhos / Cancelados / Ignorados:** **0**
- **Tempo de Execução:** ~2.5 segundos

---

## 2. Detalhamento dos Testes da Suíte Foundation v0.4A

### Suíte 1: Cifra e Decifragem Autenticada (AES-GCM-256 + PBKDF2)
- `ok 1 - deve realizar ciclo completo de cifra e decifragem com fidelidade absoluta`:
  - Valida criptografia de payload sintético com dados de Tomás, cuidadores e observações.
  - Decifra usando a mesma senha e valida igualdade estrutural profunda e schema Zod.
- `ok 2 - deve gerar Salt e IV distintos em cada exportação consecutiva (CSPRNG)`:
  - Exporta o mesmo payload duas vezes consecutivas com a mesma senha.
  - Comprova que `kdfSalt` e `cipherIv` diferem em 100% dos bytes devido ao uso de `crypto.getRandomValues()`.

### Suíte 2: Falha Controlada na Autenticação por Senha
- `ok 1 - deve rejeitar decifragem com senha incorreta sem vazar dados`:
  - Tenta decifrar o envelope com senha incorreta.
  - Verifica que a Web Crypto API lança erro de autenticação (`OperationError` ou falha de tag GMAC) e nenhuma parte do texto é retornada.
- `ok 2 - deve rejeitar senha vazia ou inferior a 8 caracteres`:
  - Valida a política de senha mínima recomendada pela OWASP para derivação simétrica.

### Suíte 3: Detecção de Adulteração de Texto Cifrado e Metadados (AAD)
- `ok 1 - deve detectar adulteração de bits no ciphertext (AES-GCM Auth Tag)`:
  - Altera 1 caractere no Base64 do ciphertext.
  - Confirma que a tag de autenticação AES-GCM falha imediatamente com erro de decifragem.
- `ok 2 - deve detectar adulteração de IV`:
  - Altera o vetor de inicialização do envelope.
  - Confirma a falha de integridade.
- `ok 3 - deve detectar adulteração de metadados críticos amarrados ao AAD (ex: troca de childId no cabeçalho)`:
  - Altera o `childId` no cabeçalho público não cifrado de `"tomas"` para `"lia"`.
  - Confirma que o AAD canônico (`MUNDELO_VAULT:1:lia`) diverge do gerado na cifragem (`MUNDELO_VAULT:1:tomas`), provocando rejeição imediata da autenticação AES-GCM.

### Suíte 4: Proteção contra Downgrade de Algoritmo e Parâmetros Inseguros
- `ok 1 - deve rejeitar cofre com iterações PBKDF2 excessivamente baixas (< 100.000)`:
  - Fornece envelope forjado com 1.000 iterações.
  - Rejeita na validação de schema antes de executar a KDF.
- `ok 2 - deve rejeitar cofre com algoritmo não autenticado (ex: AES-CBC)`:
  - Fornece envelope forjado com `cipher: "AES-CBC"`.
  - Rejeita imediatamente por não constar na lista canônica autorizada.
- `ok 3 - deve rejeitar formato ou versão desconhecida`:
  - Fornece envelope forjado com `formatVersion: 99`.
  - Rejeita por incompatibilidade de versão.

### Suíte 5: Integridade Relacional e Isolamento na Decifragem
- `ok 1 - deve rejeitar cofre cujo conteúdo interno declare criança diferente do cabeçalho`:
  - Valida que caso um payload interno decifrado declare perfil discrepante do cabeçalho, a importação é abortada com erro de consistência relacional.

### Suíte 6: Limites de Tamanho e Robustez de Entrada de Arquivo
- `ok 1 - deve rejeitar arquivo que exceda 5 MB`:
  - Gera string simulada com mais de 5.242.880 bytes.
  - Confirma que `parseVaultFileString` bloqueia o processamento por limite de tamanho de arquivo.
- `ok 2 - deve rejeitar string que não seja JSON válido`:
  - Confirma tratamento gracioso de erros de sintaxe.

---

## 3. Log de Execução (TAP Output Sintetizado)

```text
# Subtest: Suite de Testes Automatizados — MUNDELO Foundation v0.2
...
ok 1 - Suite de Testes Automatizados — MUNDELO Foundation v0.2
# Subtest: Suite de Testes Automatizados — MUNDELO Foundation v0.3
...
ok 2 - Suite de Testes Automatizados — MUNDELO Foundation v0.3
# Subtest: Suite de Testes Automatizados — MUNDELO Foundation v0.4A (Cofre Criptografado)
    # Subtest: 1. Cifra e Decifragem Autenticada (AES-GCM-256 + PBKDF2)
    ok 1 - deve realizar ciclo completo de cifra e decifragem com fidelidade absoluta
    ok 2 - deve gerar Salt e IV distintos em cada exportação consecutiva (CSPRNG)
    # Subtest: 2. Falha Controlada na Autenticação por Senha
    ok 1 - deve rejeitar decifragem com senha incorreta sem vazar dados
    ok 2 - deve rejeitar senha vazia ou inferior a 8 caracteres
    # Subtest: 3. Detecção de Adulteração de Texto Cifrado e Metadados (AAD)
    ok 1 - deve detectar adulteração de bits no ciphertext (AES-GCM Auth Tag)
    ok 2 - deve detectar adulteração de IV
    ok 3 - deve detectar adulteração de metadados críticos amarrados ao AAD (ex: troca de childId no cabeçalho)
    # Subtest: 4. Proteção contra Downgrade de Algoritmo e Parâmetros Inseguros
    ok 1 - deve rejeitar cofre com iterações PBKDF2 excessivamente baixas (< 100.000)
    ok 2 - deve rejeitar cofre com algoritmo não autenticado (ex: AES-CBC)
    ok 3 - deve rejeitar formato ou versão desconhecida
    # Subtest: 5. Integridade Relacional e Isolamento na Decifragem
    ok 1 - deve rejeitar cofre cujo conteúdo interno declare criança diferente do cabeçalho
    # Subtest: 6. Limites de Tamanho e Robustez de Entrada de Arquivo
    ok 1 - deve rejeitar arquivo que exceda 5 MB
    ok 2 - deve rejeitar string que não seja JSON válido
ok 3 - Suite de Testes Automatizados — MUNDELO Foundation v0.4A (Cofre Criptografado)
1..3
# tests 49
# suites 23
# pass 49
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 2591.211499
```
