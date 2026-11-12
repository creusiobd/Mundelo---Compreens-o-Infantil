# Especificação Técnica do Formato: Mundelo Encrypted Vault v1 (.mundelo-vault)

## 1. Identificação do Formato e Metadados Públicos

O arquivo `.mundelo-vault` é um arquivo texto JSON UTF-8 contendo um envelope criptográfico padronizado para troca segura e arquivamento de observações e perfis sintéticos do projeto Mundelo.

```json
{
  "format": "MUNDELO_VAULT",
  "formatVersion": 1,
  "createdAt": "2026-11-12T18:00:00.000Z",
  "isSyntheticData": true,
  "childId": "tomas",
  "childName": "Tomás",
  "recordCount": 6,
  "crypto": {
    "kdf": "PBKDF2",
    "kdfHash": "SHA-256",
    "kdfSalt": "Base64(16 bytes)",
    "kdfIterations": 600000,
    "cipher": "AES-GCM",
    "cipherKeyLength": 256,
    "cipherIv": "Base64(12 bytes)",
    "cipherTagLength": 128
  },
  "ciphertext": "Base64(dados cifrados com tag de autenticação embutida)"
}
```

---

## 2. Parâmetros Criptográficos e Limites Canônicos

| Parâmetro | Valor Padrão | Intervalo Aceito | Justificativa / Norma |
| :--- | :--- | :--- | :--- |
| **`format`** | `"MUNDELO_VAULT"` | Estritamente literal | Identificação inequívoca de tipo MIME/formato. |
| **`formatVersion`** | `1` | Inteiro positivo ($= 1$) | Versionamento explícito de envelope; rejeita versões futuras desconhecidas. |
| **`kdf`** | `"PBKDF2"` | Estritamente `"PBKDF2"` | Padrão W3C Web Cryptography API nativo. |
| **`kdfHash`** | `"SHA-256"` | Estritamente `"SHA-256"` | Hash criptográfico seguro; resiste a colisões e extensões de comprimento. |
| **`kdfSalt`** | 16 bytes CSPRNG | 16 a 64 bytes (Base64) | Gerado via `crypto.getRandomValues()`; previne tabelas rainbow pré-computadas. |
| **`kdfIterations`** | `600000` | $100.000$ a $1.000.000$ | Alinhado à recomendação OWASP Password Storage Cheat Sheet (2023+). Cofres com menos de 100k iterações são rejeitados para mitigar downgrade. |
| **`cipher`** | `"AES-GCM"` | Estritamente `"AES-GCM"` | Criptografia autenticada com dados associados (AEAD); previne bit-flipping e padding oracle. |
| **`cipherKeyLength`** | `256` | Estritamente `256` bits | Nível máximo de segurança para cifras de bloco simétricas. |
| **`cipherIv`** | 12 bytes CSPRNG | Estritamente 12 bytes (96 bits) | Tamanho canônico de IV para GCM sem degradação de desempenho via GHASH. Nunca reutilizado. |
| **`cipherTagLength`**| `128` | Estritamente `128` bits | Tamanho máximo da tag GMAC para proteção contra forjamento. |
| **`ciphertext`** | Base64 | $\le 5$ MB decodificado | Contém o texto cifrado concatenado com a tag de autenticação de 16 bytes no padrão da Web Crypto API. |

---

## 3. Dados Associados Autenticados (AAD — Additional Authenticated Data)

Para impedir adulterações nos metadados que ficam em texto claro no envelope (por exemplo, um atacante alterando `"childId": "tomas"` para `"childId": "lia"` ou mudando o número de versão), o processo de cifragem vincula os metadados críticos como AAD:

### Formato Canônico do AAD:
```text
${format}:${formatVersion}:${childId}
```
Exemplo:
```text
MUNDELO_VAULT:1:tomas
```

Na decifragem, a mesma string canônica é alimentada no parâmetro `additionalData` do `crypto.subtle.decrypt`. Se qualquer um desses campos for alterado no arquivo JSON externo, a tag de integridade do AES-GCM falha imediatamente, impedindo a decifragem de qualquer bit do payload.

---

## 4. Estrutura do Payload Descriptografado (`VaultPayload`)

O texto claro cifrado é uma string JSON formatada validada pelo Zod Schema `VaultPayloadSchema`:

```typescript
interface VaultPayload {
  version: 1;
  exportedAt: string; // ISO 8601
  isSyntheticData: true;
  childProfile: ChildProfile; // Perfil canônico da criança (id, name, birthDate, ageLabel, etc.)
  caregivers: Caregiver[];    // Cuidadores vinculados à criança
  observations: Observation[]; // Observações da criança com proveniência e revisões
}
```

### Regras de Integridade Relacional:
1. **Isolamento de Perfil:** Todas as observações contidas no array `observations` devem ter obrigatoriamente `childId === childProfile.id`. Registros com identificadores de outras crianças são rejeitados preventivamente.
2. **Coerência de Identificador:** O `childProfile.id` do payload interno deve ser estritamente idêntico ao `childId` do cabeçalho público do envelope.

---

## 5. Fluxo de Importação Transacional e Modos de Mesclagem

Ao importar um arquivo `.mundelo-vault`:
1. **Verificação de Limite Físico:** Tamanho do arquivo validado em $\le 5$ MB antes de parsing.
2. **Validação de Sintaxe e Schema:** `VaultEnvelopeSchema.parse()` garante tipos e limites permitidos.
3. **Decifragem Autenticada:** Senha submetida a PBKDF2 + AES-GCM com AAD. Erro em qualquer bit aborta sem alterar estado.
4. **Validação de Schema Interno:** `VaultPayloadSchema.parse()` garante conformidade estrita dos modelos v0.3.
5. **Pré-visualização Transacional:** A interface exibe contagem de registros, perfil e registros coincidentes.
6. **Aplicação Atômica em Memória:**
   - **Modo `merge`:** Preserva observações não coincidentes, adiciona as novas e atualiza as coincidentes se a revisão for maior ou igual.
   - **Modo `replace`:** Substitui atomicamente todas as observações daquela criança em memória pelo conteúdo do cofre.
   - **Rollback Garantido:** Em caso de exceção durante a montagem do estado, o estado original anterior é preservado integralmente.
