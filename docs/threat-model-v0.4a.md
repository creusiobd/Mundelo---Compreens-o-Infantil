# Modelo de Ameaças: Cofre Criptografado Local (Foundation v0.4A)

## 1. Escopo e Premissas

- **Contexto:** Plataforma Mundelo em ambiente de protótipo (React 19 SPA, em memória volátil).
- **Dados Processados:** Estritamente fictícios/sintéticos (demonstração de perfil infantil de 0 a 5 anos).
- **Ativo Criptográfico:** Arquivo local `.mundelo-vault` exportado/importado via Web Cryptography API (`crypto.subtle`).
- **Nenhum Serviço Remoto:** Zero tráfego de rede, zero servidores em nuvem, zero telemetria.

---

## 2. Análise Estruturada por Metodologia STRIDE

| Categoria STRIDE | Ameaça Identificada | Mitigação Implementada no Mundelo v0.4A | Eficácia / Limitações |
| :--- | :--- | :--- | :--- |
| **Spoofing** (Falsificação de Identidade) | Atacante cria um envelope forjado simulando ser do Mundelo. | O envelope requer validação estrita via Zod (`VaultEnvelopeSchema`) e payload autenticado via GMAC (`AES-GCM-256`) com AAD amarrado. | **Alta:** Sem a senha correta, não é possível gerar um ciphertext válido com tag coincidente. |
| **Tampering** (Adulteração de Conteúdo) | Modificação de bits no arquivo cifrado (ex: corromper notas ou injetar dados). | Tag de autenticação AES-GCM (128 bits). Qualquer alteração de 1 bit invalida a verificação e impede a decifragem. | **Máxima:** Criptografia autenticada nativa (AEAD). |
| **Tampering** (Metadados em Texto Claro) | Atacante altera o campo `childId` no cabeçalho não cifrado (ex: troca `tomas` por `lia`) para injetar dados no perfil errado. | Metadados críticos (`format:formatVersion:childId`) são vinculados como **AAD (Additional Authenticated Data)** no AES-GCM. | **Máxima:** Modificar `childId` no cabeçalho faz a decifragem falhar com erro de autenticação. |
| **Repudiation** (Repúdio) | Negação de autoria ou alteração de registros. | O payload preserva `recordedByCaregiverId`, `provenance`, timestamps (`occurredAt`, `recordedAt`) e número inteiro de revisão (`revision`). | **Média-Alta no Escopo Local:** O cofre não implementa assinatura digital assimétrica (PKI), portanto autentica posse da senha e integridade, não assinatura pessoal não repudiável. |
| **Information Disclosure** (Vazamento de Informação) | Leitura do conteúdo das observações por terceiros que obtenham o arquivo `.mundelo-vault`. | Cifra forte AES-GCM-256 derivada via PBKDF2-HMAC-SHA256 com 600.000 iterações e salt CSPRNG de 16 bytes. | **Alta contra Ataques Offline:** Resistente a ataques com GPU se a senha for suficientemente complexa. Sem a senha, o payload é indistinguível de ruído aleatório. |
| **Information Disclosure** (Resíduos em Memória/Disco) | Vazamento de senhas ou chaves em caches persistentes. | **Nenhum dado é salvo em localStorage, sessionStorage, cookies ou IndexedDB.** A senha e os buffers são descartados do estado do React imediatamente após o uso. | **Mitigado no Domínio Web:** A memória do processo do navegador é limpa pelo Garbage Collector; extensões maliciosas ou dump de memória do SO estão fora do modelo de ameaça do navegador. |
| **Denial of Service** (Negação de Serviço) | Upload de arquivos gigantes (Zip Bomb, JSON bomb de centenas de MB) travando o navegador. | Limite estrito de tamanho físico: o leitor rejeita arquivos maiores que 5 MB (`VAULT_MAX_FILE_BYTES`) antes do parsing e decifragem. | **Alta:** Previne exaustão de heap no V8/JSC. |
| **Elevation of Privilege** (Elevação de Privilégio) | Injeção de observações de outra criança ou sobrescrita silenciosa do acervo. | Validação relacional canônica (`childId === childProfile.id`) e fluxo de confirmação transacional com análise de conflitos na UI antes de efetivar o commit na memória. | **Alta:** Operação atômica em memória. |

---

## 3. Ataques Específicos e Contra-medidas

### 3.1. Ataques de Dicionário e Força Bruta Offline
- **Risco:** O arquivo `.mundelo-vault` pode ser submetido a ataques de força bruta offline em equipamentos de alta capacidade de cálculo (hashcat, rigs de GPUs).
- **Defesa:**
  1. Calibração do PBKDF2 em **600.000 iterações** (recomendação de topo da OWASP). Em GPUs modernas, calcular uma tentativa custa centenas de milhares de ciclos SHA-256.
  2. Validação na UI exigindo no mínimo 8 caracteres na criação da senha.
  3. Rejeição de parâmetros fracos durante a importação (qualquer arquivo indicando $< 100.000$ iterações é rejeitado imediatamente).

### 3.2. Ataques de Downgrade de Algoritmo
- **Risco:** Arquivo malicioso manipulado especificando algoritmos legados e vulneráveis (ex: AES-CBC, DES, MD5, SHA-1).
- **Defesa:** Whitelist estrita no schema Zod (`VaultEnvelopeSchema`):
  - Apenas `PBKDF2` com `SHA-256` é aceito.
  - Apenas `AES-GCM` de 256 bits é aceito.
  - Tentativas de passar outros algoritmos são rejeitadas na validação de entrada antes de invocar a Web Crypto API.

### 3.3. Limitações Conhecidas do Modelo Experimental
1. **Malware no Endpoint:** Se o dispositivo do usuário contiver keyloggers, malwares com acesso ao processo do navegador ou extensões de terceiros invasivas, a senha ou os dados em memória podem ser interceptados.
2. **Ausência de E2EE Multiusuário:** O cofre atual utiliza chave simétrica baseada em senha compartilhada. Não há suporte a chaves públicas assimétricas individuais (como RSA-OAEP ou ECDH com X25519) nesta etapa.
3. **Não Auditado por Terceiros:** Trata-se de implementação canônica baseada na Web Crypto API nativa do W3C, porém o software como um todo não passou por auditoria de segurança formal externa; a interface declara explicitamente seu caráter experimental.
