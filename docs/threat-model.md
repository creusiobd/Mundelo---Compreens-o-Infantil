# Modelo de Ameaças & Arquitetura de Privacidade Infantil — Foundation v0.2
**Projeto:** MUNDELO — Compreensão Infantil  
**Classificação:** Confidencial / Arquitetura Interna  
**Metodologia:** STRIDE adaptado para Proteção da Criança e Minimização de Dados  

---

## 1. Classificação e Sensibilidade de Dados

Embora o Mundelo na Foundation v0.2 opere exclusivamente com **dados fictícios em memória volátil**, o modelo de ameaças estabelece a proteção para o momento em que a plataforma vier a receber dados reais:

1. **Dados de Identificação Infantil (Altamente Sensíveis):** Nome, idade, pronomes, imagem e rotinas. Exigem minimização severa e proibição de identificadores governamentais (como CPF ou certidão de nascimento na aplicação).
2. **Dados de Observação Contextual e Regulação:** Notas sobre sensibilidades sensoriais, desconfortos, formas de comunicação e desfechos. Possuem alto potencial de estigmatização se expostos indevidamente ou utilizados para categorização discriminatória.
3. **Dados de Cuidadores e Rede de Apoio:** Nomes, papéis familiares ou pedagógicos e registros de proveniência (`DIRECT` vs `REPORTED_BY_OTHER`).

---

## 2. Atores e Papéis de Acesso

- **Responsável Legal Primário (Guardião Legal):** Detém custódia e poder deliberativo absoluto sobre o perfil da criança, podendo convidar outros cuidadores, revogar acessos ou solicitar exclusão irrevogável.
- **Cuidador Secundário (Pais, Avós, Babás):** Acesso delegado para registrar e consultar observações, sem permissão para transferir custódia ou alterar regras de compartilhamento.
- **Educadores e Profissionais de Saúde:** Recebedores de sínteses pontuais contextuais (por meio do Relatório de Diálogo), sem acesso persistente amplo à totalidade das notas íntimas da família.
- **Atores Hostis / Ameaças Externas:** Atacantes buscando exfiltração de dados para chantagem, publicidade comportamental direcionada, profiling infantil ou treinamento não autorizado de modelos de machine learning.

---

## 3. Análise de Vetores de Ameaça (STRIDE Adaptado)

### 3.1. Spoofing (Falsificação de Identidade)
- **Ameaça:** Terceiro se passar por responsável legal ou cuidador autorizado para visualizar diários infantis.
- **Mitigação Futura:** Autenticação forte sem senha (Passkeys / FIDO2 / WebAuthn) ou autenticação multifator (MFA). Proibição de credenciais compartilhadas entre pai e mãe.

### 3.2. Tampering (Adulteração de Dados)
- **Ameaça:** Modificação maliciosa de observações contextuais ou inserção de anotações pejorativas em nome de outro cuidador.
- **Mitigação Atual (v0.2):** Validação canônica estrita via Zod (`safeValidateObservation`), vinculação imutável com `childId` e preservação estrita de `recordedAt` original.
- **Mitigação Futura:** Assinatura criptográfica por chave de sessão do cuidador com trilha de auditoria append-only imutável.

### 3.3. Repudiation (Repúdio)
- **Ameaça:** Cuidador negar ter registrado determinada observação ou estratégia.
- **Mitigação Atual (v0.2):** Registro explícito do campo `provenance` (`DIRECT` vs `REPORTED_BY_OTHER`) e `observerRole`.

### 3.4. Information Disclosure (Vazamento de Informação / Compartilhamento Excessivo)
- **Ameaça:** Vazamento de notas familiares para escolas ou profissionais além do estritamente necessário para o cuidado.
- **Mitigação Atual (v0.2):** Relatório sob demanda onde o cuidador seleciona manualmente quais observações entram no documento, com isolamento estrito por `childId`.
- **Mitigação Futura:** Criptografia ponta-a-ponta (E2EE) ou chaves segregadas por família gerenciadas via envelope encryption (KMS).

### 3.5. Denial of Service (Negação de Serviço)
- **Ameaça:** Exaustão de memória da aplicação por injeção massiva de observações ou strings desproporcionais.
- **Mitigação Atual (v0.2):** Limite de tamanho de inputs e sanitização de dados no schema Zod.

### 3.6. Elevation of Privilege (Elevação de Privilégio)
- **Ameaça:** Cuidador com acesso delegado tentar alterar a titularidade da criança ou acessar observações de outra família.
- **Mitigação Atual (v0.2):** Isolamento lógico rigoroso no `AppContext` bloqueando alterações em `childId` distinto do perfil em foco.

---

## 4. Governança e Fronteiras com Inteligência Artificial

O Mundelo adota uma **política de barreira absoluta** em relação a IA comercial:
- **Proibição de Diagnóstico por IA:** Nenhum modelo de IA tem autorização arquitetural para calcular scores de risco clínico, probabilidades de TEA/TDAH, normalidade ou laudos preditivos.
- **Não Alimentação de Modelos de Terceiros:** Nenhuma observação registrada por famílias poderá ser enviada para APIs externas de LLMs para fine-tuning, indexação ou inferência não supervisionada.
- **Auditabilidade Explicável:** Toda síntese deve basear-se em regras determinísticas transparentes de agregação estatística simples (frequência de ambientes, contagem de registros, categorização descritiva).

---

## 5. Ciclo de Vida: Revogação, Portabilidade e Eliminação

1. **Direito ao Esquecimento Imediato:**
   - Na v0.2, a função `clearActiveChildObservationsToEmpty` descarrega instantaneamente todos os registros da criança da memória volátil.
   - Em fases futuras, a exclusão acionará a destruição criptográfica das chaves de criptografia da família (*crypto-shredding*), tornando quaisquer backups residuais ilegíveis.
2. **Portabilidade Integral:**
   - O cuidador tem direito de exportar o acervo completo em formato estruturado (JSON canônico validado e PDF de leitura limpa) a qualquer momento, sem retenção de reféns de dados (*no vendor lock-in*).
3. **Revogação Instantânea de Cuidadores Delegados:**
   - A revogação do acesso de um cuidador impede qualquer sessão futura e invalida tokens de acesso imediatamente.

---

## 6. Logs, Telemetria e Minimização

- **Zero Logs de Conteúdo:** Informações descritivas de observação infantil jamais devem ser escritas em stdout, stderr, logs de servidores, Datadog, Sentry ou Cloud Logging.
- **Telemetria Proibida:** Nenhuma ferramenta de rastreamento de comportamento (Google Analytics, Mixpanel, Hotjar, Facebook Pixel) é permitida no ambiente da criança.
