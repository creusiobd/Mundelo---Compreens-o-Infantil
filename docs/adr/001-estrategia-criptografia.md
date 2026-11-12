# ADR 001: Estratégia de Criptografia e Proteção de Dados em Repouso
**Status:** PENDENTE / EM AVALIAÇÃO ARQUITETURAL  
**Data:** 12 de Novembro de 2026  
**Decisores:** Principal Software Engineer, Arquiteto de Segurança, Especialista em Privacidade  
**Contexto:** Projeto MUNDELO — Foundation v0.2  

---

## 1. Contexto e Problema

O Mundelo lida com anotações íntimas sobre o desenvolvimento, sensibilidades sensoriais e rotinas de crianças na primeira infância (0 a 5 anos). Quando a plataforma evoluir para além da fase de protótipo em memória (Foundation v0.2), será mandatório proteger os dados em repouso e em trânsito contra acessos indevidos, vazamentos de banco de dados e até contra administradores de infraestrutura em nuvem.

### Regra Absoluta da Fase Atual:
- **NÃO implementar criptografia caseira (Rule 7):** Algoritmos de cifra próprios, funções de hash improvisadas ou implementações manuais de AES/RSA em JavaScript sem auditoria formal são expressamente vedados por constituírem alto risco de segurança.

---

## 2. Opções em Avaliação Arquitetural

### Opção A: Criptografia Ponta-a-Ponta (E2EE — Zero-Knowledge)
- **Mecanismo:** A chave de decodificação das anotações é gerada e mantida exclusivamente nos dispositivos dos responsáveis legais (via Web Crypto API ou libsodium). O servidor armazena apenas payloads cifrados opacos.
- **Vantagens:**
  - Máxima garantia de privacidade: nem a equipe do Mundelo nem invasores de infraestrutura conseguem ler as observações infantis.
  - Imunidade legal a requisições de acesso a dados em texto puro que o provedor não possui.
- **Desvantagens / Trade-offs:**
  - Perda de chave: se os pais perderem a frase semente ou chave de recuperação, os dados tornam-se matematicamente irrecuperáveis.
  - Sincronização multi-dispositivo complexa: requer protocolo de troca de chaves cifradas entre mãe, pai e educadores convidados.
  - Impossibilidade de indexação ou busca full-text no lado do servidor (toda busca precisaria ocorrer na memória local do cliente).

### Opção B: Criptografia por Envelope com Chaves por Família (KMS / HSM)
- **Mecanismo:** Cada família possui uma Data Encryption Key (DEK) segregada, envelopada por uma Key Encryption Key (KEK) em serviço gerenciado de gerenciamento de chaves (Cloud KMS ou Vault). Os dados são cifrados em repouso com AES-GCM-256 antes da persistência.
- **Vantagens:**
  - Recuperação de conta amigável viável via validação de identidade dos responsáveis legais.
  - Compartilhamento granular delegado e revogação de acessos simplificada no controle de acesso baseado em papéis (RBAC).
- **Desvantagens:**
  - Acesso teórico pelo administrador de infraestrutura ou por ordem judicial válida.

---

## 3. Decisão da Foundation v0.2

1. **Manter a Foundation v0.2 estritamente em memória volátil:** Nenhuma rotina de cifra é inserida prematuramente nesta etapa de prototipagem demonstrativa.
2. **Não utilizar algoritmos manuais:** A decisão entre E2EE estrito ou Criptografia por Envelope segregada será formalizada antes da criação da primeira tabela de banco de dados na Etapa 2.
3. **Padrões Técnicos Obrigatórios para a Etapa 2:**
   - Apenas primitivas padronizadas do W3C (`window.crypto.subtle`) ou bibliotecas formalmente auditadas (`libsodium-wrappers`).
   - Algoritmos autorizados: AES-GCM com vetores de inicialização de 96 bits únicos por registro, ou XChaCha20-Poly1305.
   - Derivação de chaves via Argon2id ou PBKDF2 com alto fator de custo computacional.

---

## 4. Consequências

- **Positivas:** Ausência de falso sentimento de segurança gerado por implementações criptográficas frágeis ou caseiras; clareza documental sobre os limites da versão atual.
- **Negativas:** Requer etapa de testes e auditoria de segurança dedicada quando a persistência for iniciada.
