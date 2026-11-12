# Análise de Riscos Residuais: Cofre Criptografado Local (Atualizado Foundation v0.4A.1)

**Data:** 2025-05-12  
**Papéis:** Principal Application Security Engineer, Concurrency Specialist & Cryptography Reviewer  
**Status do Módulo:** Protótipo Experimental de Cofre Local (v0.4A.1)  

---

## 1. Riscos Fechados na Foundation v0.4A.1

| ID | Risco Residual Anterior (v0.4A) | Solução Implementada em v0.4A.1 | Status Atual |
| :--- | :--- | :--- | :---: |
| **SEC-14** | Ambiguidade de merge quando registros possuem mesma revisão mas conteúdos divergentes, ou tentativa de sobrescrever campos imutáveis em revisões superiores. | Criado `src/security/conflictResolver.ts` com comparação estrutural canônica (`compareObservationContent`), estados explícitos (`INSERT`, `KEEP`, `NOOP`, `UPDATE`, `CONFLICT`), proibição de *last-write-wins* e aborto transacional do lote inteiro (`resolveObservationBatch`). | **FECHADO (PASS)** |
| **SEC-17** | Proteção contra concorrência restrita a estado local de botão na UI (`isCommitting`). | Criado `DomainConcurrencyManager` (`src/security/domainLock.ts`) garantindo exclusão mútua no nível de domínio com `operationId` único e liberação garantida em `finally`. | **FECHADO (PASS)** |
| **SEC-18** | Possibilidade de troca de criança ativa ou cuidador simulado durante operação assíncrona ou entre preview e commit. | Snapshot de `childId`, `caregiverId` e `stateGeneration` no início da operação; cancelamento lógico automático se qualquer dimensão do contexto mudar antes do commit. | **FECHADO (PASS)** |

---

## 2. Riscos Residuais Estruturais e de Ambiente (Mantidos sob Controle)

### 2.1. Execução Empírica do Benchmark em Aparelho Físico Android (SEC-23)
- **Estado:** O laboratório `/security-lab` (`src/screens/SecurityLabScreen.tsx` e `src/crypto/benchmark.ts`) e o protocolo (`docs/android-benchmark-protocol.md`) estão 100% implementados e testados no ambiente automatizado, mas a execução em um smartphone Android físico real permanece **`NOT_EXECUTED`**.
- **Ação Necessária para Fechamento Final:** Executar a rota `/security-lab` em modo DEV em um dispositivo Android intermediário real, exportar o JSON sanitizado e anexá-lo às evidências.

### 2.2. Ausência de Assinatura Digital Assimétrica por Cuidador (Não Repúdio)
- **Cenário:** O cofre autentica a posse da senha simétrica e a integridade do envelope (`AES-GCM-256` com AAD), mas o histórico de revisão (`revisionHistory`, `recordedByCaregiverId`) não possui assinatura criptográfica individual por cuidador (ECDSA/Ed25519).
- **Mitigação:** Documentado no ADR 004; campos originais de criação são protegidos contra mutação acidental em merges subsequentes, mas não servem como prova criptográfica forense de autoria contra quem detém a senha do cofre.

### 2.3. Higiene de Memória no V8/JavaScript (Ausência de `memset_s`)
- **Cenário:** Strings de senha em JavaScript são imutáveis e dependem do Garbage Collector do motor JS para desalocação física da RAM.
- **Mitigação:** Senhas nunca entram no `AppContext`, nunca vão para `localStorage`/`sessionStorage`/`IndexedDB`, nunca aparecem em logs ou relatórios de benchmark e têm suas referências locais limpas imediatamente após a chamada à Web Crypto API.

### 2.4. Ataques de Força Bruta Offline e Perda de Senha (Zero-Knowledge)
- **Cenário:** A resistência contra força bruta offline depende da entropia da senha escolhida pelo usuário somada às 600.000 iterações de PBKDF2-HMAC-SHA256. Caso a senha seja esquecida, não há backdoor ou recuperação em servidor.
