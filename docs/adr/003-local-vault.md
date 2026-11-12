# ADR 003: Cofre Local Criptografado Experimental (`MundeloVaultEnvelope` v1)

**Data:** 12 de Novembro de 2026  
**Status:** Proposto e Implementado (Experimental)  
**Contexto:** MUNDELO Foundation v0.4A  
**Decisores:** Principal Security Engineer, Cryptography Reviewer, TypeScript Engineer, Quality Auditor  

---

## 1. Contexto e Problema

Nas versões Foundation v0.1 a v0.3, estabelecemos a premissa fundamental de dados 100% voláteis em memória, sem persistência em disco ou envio para servidores na nuvem. Contudo, essa premissa introduz um desafio de continuidade: ao fechar ou recarregar a aba, as famílias perdem qualquer anotação ou contextualização acumulada durante a sessão.

Para mitigar a perda involuntária de dados sem violar a soberania e a privacidade da família — e sem depender de infraestruturas centrais de terceiros —, é necessário um mecanismo de **exportação e importação manual de cofres cifrados**.

### Restrições Inegociáveis
1. **Dados Exclusivamente Sintéticos:** O protótipo opera exclusivamente sobre perfis e observações demonstrativas de crianças fictícias (*Tomás* e *Lia*). Nenhum dado real deve ser solicitado ou processado.
2. **Criptografia Padronizada via Web Crypto API:** Proibição absoluta de algoritmos próprios ou bibliotecas experimentais. Uso restrito de primitivas padronizadas W3C Web Cryptography API (`crypto.subtle`).
3. **Ausência de Chaves em Armazenamento Local:** Senhas, chaves derivadas e textos claros jamais devem ser gravados em `localStorage`, `sessionStorage`, `IndexedDB` ou cookies.
4. **Isenção de Alegações Falsas:** O recurso deve ser explicitamente categorizado como **"Funcionalidade Experimental"**, sem rotulações de "E2EE auditado", "grau bancário" ou "à prova de qualquer invasão".
5. **Autenticação de Dados Associados (AAD):** Metadados críticos da exportação (versão do envelope, escopo e ID da criança) devem ser amarrados criptograficamente ao texto cifrado para prevenir ataques de troca de contexto (*context switching*).

---

## 2. Modelo de Ameaças do Cofre Local

### 2.1 O que o Cofre Protege (Objetivos de Segurança)
- **Confidencialidade em Repouso no Arquivo:** O arquivo `.mundelo-vault` salvo no dispositivo do usuário não pode ser lido por pessoas que não conheçam a senha de decifragem.
- **Detecção de Adulteração (Integridade Autenticada):** O uso de AES-GCM com tag de autenticação de 128 bits garante que qualquer modificação no texto cifrado ou no IV resulte em falha imediata na decifragem (`OperationError`).
- **Prevenção de Substituição de Metadados:** Os metadados de cabeçalho (`formatVersion`, `childId`, `exportedAt`) são passados como Dados Autenticados Adicionais (AAD) no AES-GCM. Qualquer tentativa de alterar a versão ou atribuir o arquivo a outra criança sem alterar o ciphertext corrompe a verificação da tag e bloqueia a abertura.
- **Resistência a Ataques de Força Bruta Offline:** Derivação por PBKDF2-HMAC-SHA256 com salt aleatório de 16 bytes e 600.000 iterações (alinhado com as recomendações do OWASP Password Storage Cheat Sheet).

### 2.2 O que o Cofre NÃO Protege (Limitações Explícitas)
- **Dispositivo Comprometido (Malware / Keylogger):** Se o dispositivo hospedeiro estiver infectado por malware com permissão de leitura de memória ou captura de teclado, a senha e os dados em memória podem ser capturados.
- **Senhas Fracas Fornecidas pelo Usuário:** Senhas muito curtas ou comuns continuam vulneráveis a dicionários offline. O sistema impõe um piso mínimo de 8 caracteres e recomenda frases secretas.
- **Perda Definitiva de Senha (Zero-Knowledge):** Como não há servidor, backdoors nem recuperação de conta, **a perda da senha implica a perda irrecuperável do arquivo exportado**.
- **Ataques de Engenharia Social:** Um invasor pode induzir o usuário a compartilhar o arquivo e a respectiva senha.

---

## 3. Decisão Arquitetural do Envelope v1 (`MundeloVaultEnvelope`)

### 3.1 Especificação dos Parâmetros Criptográficos
- **Algoritmo de Cifra:** `AES-GCM` com chave simétrica de 256 bits.
- **Vetor de Inicialização (IV):** 12 bytes (96 bits) gerados aleatoriamente via `crypto.getRandomValues()` por cada operação de exportação. **Nunca reutilizado**.
- **Função de Derivação de Chave (KDF):** `PBKDF2` com `HMAC-SHA-256`.
- **Salt:** 16 bytes (128 bits) aleatórios por exportação.
- **Iterações PBKDF2:** 600.000 iterações calibradas para ambiente web moderno (proibindo valores externos inferiores a 100.000 ou superiores a 1.000.000 para evitar negação de serviço).
- **Dados Autenticados Adicionais (AAD):** `formatVersion:childId:format`.

### 3.2 Estrutura do Envelope JSON

```json
{
  "format": "MUNDELO_VAULT",
  "formatVersion": 1,
  "exportedAt": "2026-11-12T10:00:00.000Z",
  "appVersion": "v0.4A",
  "childId": "tomas",
  "recordCount": 5,
  "crypto": {
    "algorithm": "AES-GCM",
    "keyLength": 256,
    "iv": "<base64 12 bytes>",
    "kdf": "PBKDF2",
    "kdfHash": "SHA-256",
    "kdfIterations": 600000,
    "kdfSalt": "<base64 16 bytes>",
    "aad": "<base64 do AAD canônico>"
  },
  "ciphertext": "<base64 do AES-GCM ciphertext + tag de 16 bytes>"
}
```

---

## 4. Política de Tratamento de Senhas e Memória

1. **Ciclo de Vida Efémero:** A senha inserida pelo cuidador é mantida unicamente em variáveis locais de função durante o tempo estrito da derivação da chave e da decifragem.
2. **Descarte Imediato:** Concluída a operação (seja sucesso ou falha), o formulário limpa o estado de senha.
3. **Proibição de Persistência:** Nenhuma chave simétrica `CryptoKey` ou representação de senha é armazenada em qualquer API de armazenamento do navegador.
4. **Sem Telemetria ou Envio Remoto:** Nenhuma chamada `fetch`, `XMLHttpRequest` ou `WebSocket` é efetuada no processo.

---

## 5. Política de Minimização de Dados e Integridade Relacional

- Na exportação, apenas a criança ativa e suas observações aprovadas/selecionadas são incluídas. Cuidadores associados têm apenas seus metadados de identificação pública fictícia exportados (`id`, `displayName`, `role`).
- Na importação, antes de alterar qualquer estado em memória:
  1. O envelope é autenticado e decifrado.
  2. O payload é validado contra o `VaultPayloadSchema` com Zod.
  3. A integridade relacional entre `childId`, `recordedByCaregiverId` e cuidadores é verificada.
  4. Um painel de prévia transacional exibe a contagem de registros e eventuais sobreposições.
  5. Somente com a confirmação expressa do usuário a transação é aplicada atomicamente. Em qualquer erro intermediário, a memória existente permanece 100% inalterada.

---

## 6. Consequências e Trade-offs

### Positivas
- As famílias podem arquivar suas anotações em arquivo local criptografado sem violar o isolamento de rede do protótipo.
- Conformidade estrita com os princípios de minimização e soberania familiar.
- Padrões criptográficos sólidos validados por suíte automatizada de testes.

### Negativas / Riscos Assumidos
- Como o PBKDF2 é computacionalmente intensivo no navegador (600.000 iterações), dispositivos móveis muito antigos podem apresentar um atraso de 1 a 2 segundos durante a derivação da chave. Uma indicação visual de "Derivando chave segura..." é exibida para garantir feedback responsivo.
- Sem servidor central, a perda de senha é irrecuperável. A interface deve reiterar essa condição antes do download do arquivo.
