# Protocolo de Benchmark Criptográfico em Dispositivos Android Reais (SEC-23)

**Versão:** Foundation v0.4A.1  
**Rota de Laboratório (Somente DEV):** `/security-lab` (`src/screens/SecurityLabScreen.tsx` + `src/crypto/benchmark.ts`)  
**Status Atual da Execução em Hardware Físico Android:** `NOT_EXECUTED` (Pendente de execução em aparelho físico Android intermediário; o ambiente de verificação automatizada opera em container Linux x86_64 headless).

---

## 1. Objetivo do Protocolo

Avaliar empiricamente o impacto de desempenho e responsividade de interface (frame gap / bloqueio de thread principal) das operações criptográficas do Cofre Local (`.mundelo-vault` v1):
- **KDF:** `PBKDF2-HMAC-SHA256` com **600.000 iterações** e salt de 16 bytes.
- **Cifra Autenticada:** `AES-GCM-256` com IV de 12 bytes e AAD canônico.
- **Validação Estrutural:** `JSON.parse` + validação completa com schemas Zod (`VaultEnvelopeSchema` e `VaultPayloadSchema`).

---

## 2. Isolamento de Produção

O laboratório `/security-lab` é carregado exclusivamente via `import.meta.env.DEV ? React.lazy(...) : null` em `src/App.tsx`.
- Em builds de produção (`npm run build` / `vite build`), o Rollup realiza *dead-code elimination* completa.
- Nenhuma string ou função de `SecurityLabScreen.tsx` ou `benchmark.ts` é incluída nos artefatos de `dist/assets/`.

---

## 3. Cenários Padronizados de Carga Sintética

| Cenário (`ScenarioId`) | Observações Sintéticas | Tamanho Aprox. Payload JSON | Tamanho Aprox. Envelope `.mundelo-vault` | Objetivo |
| :--- | :---: | :---: | :---: | :--- |
| **`SMALL`** | 10 registros | ~15 KB | ~21 KB | Uso típico inicial de um perfil infantil. |
| **`MEDIUM`** | 250 registros | ~400 KB | ~540 KB | Histórico acumulado de vários meses de uso contínuo. |
| **`NEAR_5MB_LIMIT`** | 1.500 registros | ~3,3 MB | ~4,5 MB | Teste de estresse próximo ao teto máximo de 5 MB (`VAULT_MAX_FILE_BYTES`), considerando o overhead de ~33% da codificação Base64. |

---

## 4. Metodologia Estatística por Cenário

1. **Amostra de Aquecimento (*Warm-up*):**
   - 1 execução completa (exportação + importação) descartada das estatísticas principais para estabilizar compilação JIT do motor JavaScript (V8) e caches internos da Web Crypto API.
2. **Amostras Medidas:**
   - Mínimo de **10 amostras consecutivas** (`sampleCount >= 10`) por cenário.
3. **Métricas Coletadas por Amostra (em milissegundos):**
   - `exportTimeMs`: Serialização JSON + PBKDF2 (600.000 iterações) + AES-GCM-256 encrypt + codificação Base64.
   - `importTimeMs`: Decodificação Base64 + PBKDF2 (600.000 iterações) + AES-GCM-256 decrypt.
   - `validationTimeMs`: `JSON.parse` + validação estrita `VaultPayloadSchema.parse`.
   - `totalRoundtripMs`: Tempo total de ponta a ponta (`exportTimeMs + importTimeMs`).
   - `maxFrameGapMs`: Maior intervalo entre quadros (`requestAnimationFrame`) observado durante a operação para medir jank/travamento da thread de UI.
4. **Agregações Estatísticas Calculadas:**
   - `minMs`, `medianMs` (P50), `meanMs`, `p90Ms`, `p95Ms` e `maxMs`.

---

## 5. Critérios Objetivos de Aceitação em Hardware Android Intermediário

Dispositivo de referência alvo: Smartphone Android intermediário (ex.: SoC Snapdragon série 6xx/7xx ou Dimensity equivalente, 4 GB a 6 GB de RAM, Chrome Mobile atualizado).

| Critério | Métrica | Limiar de Aprovação (`PASS`) | Limiar de Alerta (`CONDITIONAL`) | Limiar de Rejeição (`FAIL`) |
| :--- | :--- | :--- | :--- | :--- |
| **Latência de Exportação/Importação (`SMALL` / `MEDIUM`)** | `p95Ms` (por operação) | $\le 2.500\text{ ms}$ | $2.501\text{ ms} - 4.500\text{ ms}$ | $> 4.500\text{ ms}$ |
| **Roundtrip Completo (`NEAR_5MB_LIMIT`)** | `p95Ms` (`totalRoundtrip`) | $\le 6.500\text{ ms}$ | $6.501\text{ ms} - 10.000\text{ ms}$ | $> 10.000\text{ ms}$ |
| **Responsividade da UI (Frame Gap)** | `maxFrameGapMs` | Sem ANR (*Application Not Responding*) do navegador | Travamento visual $> 1.000\text{ ms}$ na main thread | Crash de aba (*Out of Memory*) ou ANR |
| **Estabilidade de Memória** | 10 amostras `NEAR_5MB_LIMIT` | 10/10 concluídas sem erro | — | Qualquer falha de alocação |

---

## 6. Procedimento Passo a Passo para o Testador em Dispositivo Físico

1. Iniciar o servidor de desenvolvimento (`npm run dev`) acessível na rede local ou via túnel seguro (`https://` ou `localhost` via `adb reverse tcp:3000 tcp:3000` para garantir `window.isSecureContext === true`, exigido pela `crypto.subtle`).
2. No Chrome do dispositivo Android físico, abrir a aplicação, navegar até **Privacidade** e tocar no botão **Security Lab (SEC-23 Dev)**.
3. Preencher os campos de metadados manuais:
   - Identificação do Testador
   - Modelo comercial do dispositivo (ex.: `Samsung Galaxy A54 5G`)
   - Versão do Android (ex.: `Android 14 / One UI 6.1`)
4. Configurar **Amostras Medidas = 10** e selecionar a suíte completa (**Todos os 3 Cenários em Sequência**).
5. Aguardar a conclusão das 33 execuções totais (3 warm-ups + 30 amostras medidas).
6. Tocar em **Exportar Relatório JSON Sanitizado** e anexar o arquivo `.json` às evidências de auditoria do repositório.
