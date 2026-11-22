# Documento de Continuidade — MUNDELO (Execução Controlada v1.1: Gates UX-REAL-01B + UX-REAL-02)

**Data:** 12 de Novembro de 2026  
**Papéis:** Principal Software Engineer, Accessibility Engineer, QA Automation Architect & Product UX Auditor  
**Versão Atual:** Execução Controlada v1.1 (Gates UX-REAL-01B + UX-REAL-02) sobre UI/UX Redesign Home v1.0 e Baseline Foundation v0.4A.1  
**Status do repositório remoto (atualização de 12/11/2026):** código v1.1 disponível no GitHub em `creusiobd/Mundelo---Compreens-o-Infantil`, branch `main`. O status `NO_GIT` registrado no relatório v1.1 descreve o workspace headless original, não o repositório remoto. O snapshot local anterior não foi publicado.  
**Status dos Testes de Domínio e Segurança (`npm test`):** **92 / 92 aprovados (100% PASS em 31 suítes)**  
**Status dos Testes E2E Completos (`npm run test:e2e`):** **42 / 42 aprovados (100% PASS em 8 suítes Playwright)**  
**Status dos Testes Assistivos e Acessibilidade (`npm run test:a11y`):** **17 / 17 aprovados (100% PASS em 3 suítes A11y/Assistivas)**  
**Status do Gate UX-REAL-01B:** **CONDITIONAL** (100% da prontidão assistiva automatizada aprovada — árvore de acessibilidade, ordem de foco, WCAG 2.5.3, ARIA roles/states, teclado puro, restauração de foco, `aria-live="polite"`, e separação entre viewport reduzido, `font-size: 150%`, zoom `1.5x` e `deviceScaleFactor: 2`; aguardando apenas execução humana com leitores de tela nativos TalkBack/NVDA/VoiceOver documentados em `docs/ux-real-01b-assistive-manual.md` — `NOT_EXECUTED`)  
**Status do Gate UX-REAL-02:** **PASS** (todas as 6 telas internas homologadas em 7 viewports com 42 screenshots reais em `artifacts/ux-real-02/screenshots/`, zero violações `critical`/`serious` no `axe-core` WCAG 2.2 AA, fluxos completos de navegação/RBAC/isolamento validados e 7 defeitos reais corrigidos)  
**Status do Gate de Segurança (v0.4A.1):** **CONDITIONAL** (aguardando execução em aparelho físico Android para o protocolo empírico SEC-23 — `NOT_EXECUTED`)

---

## 1. Histórico Evolutivo Consolidado

| Etapa | Escopo Principal | Testes Automatizados | Status |
| :--- | :--- | :---: | :---: |
| **Foundation v0.1** | Protótipo inicial em memória volátil, Design System acolhedor, 0–5 anos | — | Concluído |
| **Foundation v0.2** | Isolamento estrito entre crianças (`tomas` vs `lia`), zero vazamento, acessibilidade WCAG AA | 21 | Concluído |
| **Foundation v0.3** | Modelo de cuidadores, RBAC demonstrativo, proveniência e histórico de revisão | 36 (acumulado) | Concluído |
| **Foundation v0.4A** | Cofre Local Criptografado experimental (`.mundelo-vault` v1) via Web Crypto API | 49 (acumulado) | Concluído |
| **Gate Adversarial v0.4A** | Auditoria adversarial de 24 cenários (SEC-01 a SEC-24), correção de 3 P1 e 3 P2 | 75 (acumulado) | Concluído |
| **Foundation v0.4A.1** | Fechamento de SEC-14 (merge determinístico), SEC-17/18 (concorrência/locks no domínio) e SEC-23 (Security Lab Android DEV-only) | 92 (acumulado) | Concluído (`CONDITIONAL`) |
| **UI/UX Redesign Home v1.0** | Refinamento de identidade visual (`BrandLogo`), reestruturação em 2 camadas do `Header`, redesign do Hero (65%/35%), Ações Rápidas, Indicadores e Observações Recentes | 92 (domínio) | Concluído |
| **Gate UX-REAL-01** | Homologação real da Home com Playwright + `@axe-core/playwright` em 6 viewports + Zoom 200%/400%, correção de 5 defeitos (`UX-REAL-DEF-01` a `05`) | 92 (domínio) + 18 (E2E/A11y) | Concluído (`CONDITIONAL`) |
| **Execução Controlada v1.1 (UX-REAL-01B + UX-REAL-02)** | Prontidão assistiva automatizada + protocolo manual assistivo (`UX-REAL-01B`), homologação responsiva/acessível/funcional das 6 telas internas em 7 viewports (`UX-REAL-02`), auditoria cognitiva v1.0 e correção de 7 defeitos (`UX-REAL-02-DEF-01` a `07`) | **92 (domínio) + 42 (E2E) / 17 (A11y)** | **UX-REAL-01B: `CONDITIONAL` / UX-REAL-02: `PASS`** |

---

## 2. Registro da Intervenção Gate UX-REAL-01 (Baseline Anterior)

1. **Problema Investigado:**
   - Homologação automatizada da Home v1.0 em navegador Chromium real (`@playwright/test` + `@axe-core/playwright`) em 6 viewports (`360×800` a `1536×864`) e reflow `200%`/`400%`.
2. **Resultado e Defeitos Corrigidos:**
   - Corrigidos 5 defeitos (`UX-REAL-DEF-01` a `UX-REAL-DEF-05`) em `BrandLogo.tsx`, `Header.tsx` e `HomeScreen.tsx`, gerando 9 screenshots em `artifacts/ux-real-01/screenshots/`.

---

## 3. Registro da Intervenção Execução Controlada v1.1 (Gates UX-REAL-01B + UX-REAL-02)

1. **Problema Investigado:**
   - Concluir os requisitos assistivos do Gate UX-REAL-01 (`Gate UX-REAL-01B`: separar com rigor a validação automatizada da árvore de acessibilidade, ordem de foco, nomes acessíveis vs texto visível, restauração de foco, `aria-live="polite"`, e ampliação textual real `font-size: 150%` vs zoom `1.5x` vs `deviceScaleFactor: 2` dos testes humanos com leitores de tela nativos) e expandir a homologação E2E, responsiva, cognitiva e acessível para todas as **6 telas internas** (`Diário`, `Meu Mundo`, `Descobertas`, `Compreender`, `Relatório`, `Privacidade`) sob o **Gate UX-REAL-02**.
2. **Preservação e Baseline (Fase 0):**
   - Verificado que o workspace permanece `NO_GIT` e sem repositório remoto oficial configurado. Criado snapshot local reversível em `artifacts/snapshots/pre-v1.1-backup.tar.gz` antes de qualquer alteração.
   - Baseline executado com sucesso: `npm test` (92/92 PASS), `npm run lint` (PASS), `npm run build` (PASS), `npm run test:e2e` (18/18 PASS) e `npm run test:a11y` (5/5 PASS).
3. **Arquitetura E2E e Testes Executados (Fases 1, 2 e 6):**
   - Criada arquitetura reutilizável de fixtures e helpers em `tests/e2e/fixtures/` (`synthetic-data.ts`, `test-session.ts`) e `tests/e2e/helpers/` (`accessibility.ts`, `responsive.ts`, `navigation.ts`).
   - Implementadas 5 novas suítes Playwright:
     - `tests/e2e/home-assistive-readiness.spec.ts` (**4/4 PASS**)
     - `tests/e2e/internal-responsive.spec.ts` (**6/6 PASS** — gerou **42 screenshots** reais em `artifacts/ux-real-02/screenshots/` cobrindo 6 telas × 7 viewports)
     - `tests/e2e/internal-accessibility.spec.ts` (**8/8 PASS** — `axe-core` WCAG 2.2 AA nas 6 telas internas e nos modais `ObservationModal` e `ObservationDetailModal`, além de validação da separação visual entre Fato e Hipótese)
     - `tests/e2e/internal-navigation.spec.ts` (**4/4 PASS** — navegação desktop/mobile, criação/edição/exclusão no Diário, adição de item em Meu Mundo, cópia e impressão em Relatório, e isolamento de dados `Tomás` ↔ `Lia`)
     - `tests/e2e/internal-permissions.spec.ts` (**2/2 PASS** — matriz RBAC entre `Mãe (Clara)`, `Prof. Marina` e `Ana (Não vinculada)` e painel experimental do Cofre Local `.mundelo-vault`)
   - Total final de testes automatizados:
     - `npm test`: **92/92 PASS** (31 suítes de domínio e segurança)
     - `npm run test:e2e`: **42/42 PASS** (8 suítes E2E completas)
     - `npm run test:a11y`: **17/17 PASS** (`home-accessibility.spec.ts` + `home-assistive-readiness.spec.ts` + `internal-accessibility.spec.ts`)
4. **Defeitos Encontrados e Corrigidos (Fase 4):**
   - **`UX-REAL-02-DEF-01` (P1 — Contraste WCAG 1.4.3 AA insuficiente nas 6 telas internas e modais):** Substituídas classes com baixa opacidade (`text-[#133E43]/60`, `/70`, `/50`) e tons claros sobre fundo claro (`text-[#CFA5A0]`, `text-[#80C5B5]`) pelos tokens sólidos de alto contraste do Design System v1.0 (`text-[#265358]`, `text-[#8C4F48]`, `text-[#133E43]`) em `JournalScreen.tsx`, `MyWorldScreen.tsx`, `DiscoveriesScreen.tsx`, `UnderstandScreen.tsx`, `ReportScreen.tsx`, `PrivacyScreen.tsx`, `ObservationModal.tsx` e `ObservationDetailModal.tsx`.
   - **`UX-REAL-02-DEF-02` (P1 — Inputs sem `aria-label` programático em `MyWorldScreen.tsx` e `JournalScreen.tsx`):** Adicionados `aria-label` explícitos aos 8 campos de entrada rápida de *Meu Mundo* e ao campo de busca textual de *Diário*.
   - **`UX-REAL-02-DEF-03` (P1 — Controles de escrita habilitados na UI para cuidadora não vinculada em `JournalScreen`, `MyWorldScreen` e `DiscoveriesScreen`):** Adicionado `disabled={!canCreate}` e feedback visual de desabilitado ao botão de estado vazio em `JournalScreen.tsx`, aos botões/inputs de edição em `MyWorldScreen.tsx` e ao botão de registro em `DiscoveriesScreen.tsx`.
   - **`UX-REAL-02-DEF-04` (P2 — Gaveta mobile não fechava com `Escape` nem restaurava foco):** Adicionado `mobileMenuTriggerRef` e tratamento de `Escape` para `mobileMenuOpen` em `src/components/Header.tsx`.
   - **`UX-REAL-02-DEF-05` (P2 — Overflow horizontal no Header sob ampliação de fonte raiz `150%` em `1280×800`):** Ajustada a `nav` principal em `src/components/Header.tsx` para `flex-wrap gap-0.5 lg:gap-1.5` e `px-2 lg:px-3`, mantendo 1 linha em `768×1024` (`100%`) e permitindo quebra limpa sob `font-size: 150%`.
   - **`UX-REAL-02-DEF-06` (P2 — Região rolável sem foco de teclado em `ObservationDetailModal.tsx`):** Adicionados `tabIndex={0}`, `role="region"` e `aria-label="Conteúdo detalhado da observação"` ao container rolável do modal de detalhes.
   - **`UX-REAL-02-DEF-07` (P2 — Overflow horizontal `344px > 320px` em `MyWorldScreen.tsx` no viewport `320×640`):** Adicionado `min-w-0` aos 5 inputs `flex-1` de *Meu Mundo* para eliminar a largura intrínseca mínima padrão do `<input>`.
5. **Próxima Hipótese ou Ação Recomendada:**
   - Executar os roteiros manuais assistivos documentados em `docs/ux-real-01b-assistive-manual.md` (TalkBack + Chrome no Android, NVDA no Windows e VoiceOver no macOS/iOS) e o benchmark empírico `SEC-23` em aparelho físico Android intermediário para promover os gates `UX-REAL-01B` e `Security v0.4A.1` de `CONDITIONAL` para `PASS`.


---

## Proposta documental: Manifesto e Principles Gate v1.0 (13/11/2026)

- **Problema:** conectar a filosofia de cuidado e inclusão a critérios verificáveis do produto.
- **Intervenção:** elaborados `docs/manifesto-principios-mundelo-v1.md` e `docs/principles-gate-v1.md` na branch `docs/manifesto-principios-v1`.
- **Testes:** alteração exclusivamente documental; nenhuma execução assistiva física foi realizada nesta etapa.
- **Resultado:** proposta de 12 princípios, cinco perguntas operacionais e avaliação preliminar; status institucional EM REVISÃO.
- **Próxima hipótese/ação:** revisar e aprovar os textos no PR; depois disponibilizar ambiente HTTPS com dados sintéticos e executar TalkBack no Galaxy Tab S10 Ultra, registrando evidências em `docs/ux-real-01b-assistive-manual.md`. NVDA, VoiceOver e SEC-23 continuam pendentes.


## Institucionalização do Manifesto v1.0 (13/11/2026)

- **Problema:** a proposta filosófica anterior precisava de autoridade formal, participação explícita da criança, honestidade na distinção entre inclusão pretendida e inclusão comprovada, e responsáveis definidos na governança.
- **Intervenção:** revisados `docs/manifesto-principios-mundelo-v1.md` e `docs/principles-gate-v1.md`; README vincula os dois como referência institucional. Mantidos os 12 princípios, com regras de aprovação, bloqueios e exceções não críticas.
- **Testes:** revisão documental e integração com CI existente; nenhuma execução física de leitores de tela nesta alteração.
- **Resultado:** documentos institucionalizados após aprovação do PR; compromissos técnicos e limites da evidência continuam separados.
- **Próxima hipótese:** preparar uma URL de homologação segura com dados sintéticos e executar TalkBack no Galaxy Tab S10 Ultra; registrar observações, defeitos e próxima ação no roteiro UX-REAL-01B. NVDA, VoiceOver e SEC-23 permanecem NOT_EXECUTED.


---

## DEVICE-REAL-01: preparação de ambiente HTTPS para TalkBack (13/11/2026)

- **Problema:** ainda não havia demonstração HTTPS acessível pelo Galaxy Tab S10 Ultra para homologação TalkBack.
- **Hipótese:** publicação estática controlada no GitHub Pages, com dados sintéticos e build de produção, permite testes auditivos/gestuais em dispositivo real.
- **Intervenção:** workflow manual `.github/workflows/device-real-01-pages.yml` e roteiro `docs/device-real-01-talkback-staging.md`.
- **Testes executados:** nenhuma execução de deployment ou TalkBack nesta intervenção; CI do PR deverá ser verificado.
- **Resultado:** infraestrutura de publicação proposta, **NOT_EXECUTED**, sem publicação automática e sem alterações em contratos de domínio/criptografia.
- **Próxima ação:** revisar PR, autorizar caráter público da demo, configurar GitHub Pages como GitHub Actions, disparar workflow manual, validar HTTPS e executar TalkBack com evidências humanas. NVDA/VoiceOver/SEC-23 seguem pendentes.


---

## DEVICE-REAL-01 — Primeira execução humana TalkBack (13/11/2026)

- **Problema testado:** confirmar se a experiência do MUNDELO pode ser navegada e compreendida com leitor de tela nativo em dispositivo Android real, além das verificações automatizadas.
- **Ambiente relatado:** Samsung Galaxy Tab S10 Ultra, Google Chrome para Android, TalkBack ativado; demonstração HTTPS acessada. Versões exatas, URL do deploy e evidência audiovisual não anexadas ao registro.
- **Teste DR01-TB-01 — Navegação Início → Diário → Meu Mundo:** **PASS**, conforme relato do executor.
- **Teste DR01-TB-02 — Nova Observação (título, campos, abas Fatos e Hipóteses):** **PASS**, conforme relato do executor.
- **Teste DR01-TB-03 — Fechamento do formulário e retorno à navegação:** **PASS**, conforme relato do executor.
- **Resultado:** 3/3 PASS dentre os cenários efetivamente relatados; nenhum defeito reportado nesses cenários. Trata-se de evidência humana inicial, **não** certificação WCAG nem aprovação dos demais critérios do roteiro.
- **Status atualizado:** TalkBack e UX-REAL-01B **PARTIALLY_EXECUTED / CONDITIONAL**; NVDA, VoiceOver e SEC-23 físico **NOT_EXECUTED**.
- **Próxima hipótese/ação:** aprofundar estados anunciados, ordem de leitura, mensagens `aria-live`, alternância para cuidador sem vínculo, títulos, orientação retrato/paisagem, retorno real do foco; registrar versões do navegador e TalkBack e evidências sintéticas no roteiro antes de reavaliar o gate.


---

## DEVICE-REAL-02 / DR02-TB-01B — Relato de gravação por Ana, correção defensiva (14/11/2026)

**Problema / evidência humana:** em Galaxy Tab S10 Ultra com TalkBack, após selecionar Ana (sem vínculo), testador informou ter aberto `Nova Observação` pelo cabeçalho, recebido mensagem de sucesso e encontrado `TESTE-ANA-001` no Diário após alternar para Helena. **Classificação operacional P1 alto / potencial violação de autorização, em investigação:** a persistência foi relatada em dispositivo físico, mas não reproduzida de forma independente no baseline atual.

**Inspeção do código em main:** `MOCK_CAREGIVERS` contém `cg-ana-unlinked` com `linkedChildIds: []`; `canCreateObservation` exige vínculo; o botão do Header tem `disabled={!canCreate}`; `addObservation` retorna `false` se negado. Esses controles entram em conflito com a execução relatada. Possíveis causas ainda não verificadas: identificação do cuidador ativo na sessão, deploy/versão diferente, caminhos alternativos ou discrepância de estados. Não afirmar causa raiz ou exploração comprovada a partir da inspeção.

**Defeito confirmado por análise estática:** `ObservationModal.handleSubmit` fechava o modal sem examinar o resultado da gravação; `App.handleFormSubmit` descartava o booleano retornado pela camada de estado. Isso poderia dar aparência de sucesso em tentativa rejeitada.

**Mitigação proposta na branch `fix/device-real-02-unauthorized-observation`:**
1. Guardas de `canCreate` em todos os callbacks de abertura da observação no `App.tsx`, incluindo atalhos de descobertas; `canEdit` na abertura de edição.
2. Propagação de `boolean` de `addObservation/updateObservation` até o modal.
3. `ObservationModal` não fecha automaticamente quando escrita foi negada ou inválida; recusa envio se `isAllowedToProceed` é falso.
4. E2E de regressão para papel sem vínculo e escrita válida por responsável vinculado.

**Verificação:** testes CI do PR de correção ainda por executar; teste físico de reteste ainda `NOT_EXECUTED`. **Não declarar incidente resolvido nem implantar para dados reais.**

**Próxima hipótese:** validar no HTTPS a versão/SHA servida; alternar para `Ana (Sem vínculo)`, confirmar estado e anúncio, tentar abrir via cabeçalho e outros caminhos; anotar mensagem e checar realmente se a observação foi escrita. Executar testes de domínio, TS, E2E, acessibilidade, publicar manualmente somente após CI verde, e retestar TalkBack. Manter o gate `BLOCKED` para expansão do uso real até evidência consistente.


---

## DEVICE-REAL-02 / DR02-TB-01B — confirmação de reteste pelo executor (15/11/2026)

- **Contexto:** correção do PR #6 incorporada à `main`; testes automatizados do PR aprovados.
- **Resultado humano informado:** após orientação para retestar na versão HTTPS com Galaxy Tab S10 Ultra, Chrome e TalkBack, o executor respondeu simplesmente **“validado”**.
- **Classificação da evidência:** `VALIDATED_BY_REPORTER` / `PASS_REPORTED` para o reteste solicitado. Esta confirmação é suficiente para registrar aprovação declarada pelo executor, mas NÃO fornece valores separados para bloqueio de Ana, criação por Helena, versão ou SHA da implantação e mensagem exata do leitor de tela.
- **Limites:** não atribuir resultados granulares inexistentes; não declarar causa raiz da falha anterior demonstrada; não afirmar autorização robusta de servidor em um protótipo com controle no cliente.
- **Próxima ação:** se for necessário encerrar formalmente o gate de autorização, anexar captura identificando versão/SHA e resultados individuais Ana (negado) / Helena (permitido) / ausência de TESTE-ANA-001 em novo cenário; manter NVDA, VoiceOver e SEC-23 pendentes. Sem dados reais até haver autenticação e autorização no servidor.


---

## Dossiê de Maturidade e Founder Story/GTM v0.1 (16/11/2026)

- **Problema:** narrativa de fundação e abordagem comercial precisavam de documentação conectada a provas e limites, sem tratar hipótese de mercado como validação.
- **Fontes revisadas:** README, manifesto v1.0, Principles Gate, relatório UX-REAL-02, roteiro UX-REAL-01B, documentação da demo e histórico DEVICE-REAL-01/02. Confirmado pelo histórico Git que PR #7 já foi integrado na `main` (commit `3d66952494376404f93f069d3dcf62fee1b6cff4`).
- **Intervenção:** criado [Dossiê de Maturidade v0.1](mundelo-dossie-maturidade-v0-1.md) e [Founder Story + Pitch + GTM v0.1](mundelo-founder-story-gtm-v0-1.md), com evidências, fronteiras de segurança, roadmap por gates, pitch não clínico, slides propostos e pesquisa exploratória de 90 dias.
- **Teste/resultado:** revisão documental e links internos; nenhuma nova rodada de entrevistas externas, certificação de acessibilidade, teste físico ou resultado comercial nesta entrega.
- **Próxima hipótese:** a clareza dos problemas vividos por famílias e o êxito em tarefas sintéticas orientarão a primeira priorização de produto; elaborar entrevistas e medir antes de iniciar piloto real.
- **Status:** DOCUMENTED / UNDER_REVIEW. O dossiê não desbloqueia produção infantil nem substitui o Principles Gate.


---

## Product Strategy Gate / Pesquisa de Cuidadores (16/11/2026)

- **Problema:** era necessário transformar a decisão do fundador em especificação clara e instrumento prático de descoberta, sem transformar a experiência pessoal familiar em material público e sem apresentar continuidade familiar como funcionalidade já entregue.
- **Decisão aprovada:** compreensão infantil é o núcleo da marca; “Continuidade e Consciência do Cuidado Familiar” será capacidade complementar futura, condicionada a evidências de necessidade, esforço e privacidade.
- **Intervenções:** criado [Posicionamento v1](mundelo-posicionamento-evolucao-v1.md), recuperado [Protocolo de Pesquisa v0.1](mundelo-pesquisa-cuidadores-protocolo-v0-1.md) que estava apenas na branch antiga, criado [Kit de Entrevistas-Piloto v0.1](mundelo-kit-entrevistas-piloto-v0-1.md) com convite, consentimento verbal, roteiro, ficha de pesquisa e critérios de interpretação; README atualizado com links e limites.
- **Privacidade:** a Founder Story íntima do fundador e seus relatos familiares não foram copiados para este repositório público. A versão anterior de Founder Story expandida continua fora desta integração por incluir narrativa que demanda revisão autoral e análise de privacidade.
- **Teste realizado:** inspeção documental e integração de arquivos na branch, ainda sem entrevistas, dados reais, execução de CI ou validação externa.
- **Resultado:** DOCUMENTED / PREPARED. Pesquisa humana NOT_EXECUTED.
- **Próxima hipótese:** duas entrevistas-piloto com adultos poderão confirmar se roteiro é neutro e adequado; somente após revisão de notas anonimizadas iniciar ciclo de descoberta de problema. Não avançar a piloto de dados infantis reais sem autorização no servidor, governança, privacidade e revisão de riscos.


---

## SEC-EXPOSURE-01 | Proteção preventiva do repositório (16/11/2026)

- **Problema:** repo GitHub confirmado como `public`, demonstração por GitHub Pages publicável e necessidade de revisar material autobiográfico em branches documentais.
- **Teste/inspeção:** metadados GitHub, listagem de 105 arquivos na `main`, revisão da configuração de CI/Pages, `.gitignore`, `.env.example`, fluxos centrais e buscas focais de indicadores de segredos. Varredura **não exaustiva** do histórico; nenhuma credencial real confirmada na amostra.
- **Implementação em branch:** `scripts/check-exposed-credentials.mjs`, passo de scan preventivo em `.github/workflows/ci.yml` e [runbook de exposição](security-exposure-response-v1.md).
- **Resultado:** scanner e CI propostos; `Private` e estado do Pages ainda dependem de ação administrativa do proprietário; não afirmar exposição encerrada, nem segurança certificada.
- **Próxima hipótese:** proprietário altera visibilidade, revalida e decide despublicação do Pages; então executar scan histórico completo, revisar material autobiográfico e fechar achados.
- **Status:** MITIGATION_IN_PROGRESS / NOT_CLOSED. Nenhuma funcionalidade infantil alterada.


---

## SEC-EXPOSURE-01 | Pós-privatização e gate preventivo Pages (16/11/2026)

- **Problema:** confirmar proteção efetiva do repositório e delimitar exposições residuais de GitHub Pages, branches e commits.
- **Testes:** GitHub `get_repo` confirmou `private`; leitura de branch privada preservada; 11 branches inventariadas; REST `branches/main` registrou `protected=false`; run Pages `43483130809` concluída com sucesso em 13/11/2026; buscas focais por credenciais não confirmaram segredos reais.
- **Resultado:** visibilidade privada CONFIRMED; existência de publicação anterior CONFIRMED; acessibilidade externa atual da demo UNKNOWN; auditoria histórica completa NOT_EXECUTED. Não concluir incidente como CLOSED.
- **Intervenção proposta:** novo job `publication-approval` no workflow Pages, exigindo opt-in manual e variável de aprovação `MUNDELO_DEMO_PUBLICATION_APPROVED=true`. Documento [Verificação pós-privatização](sec-exposure-01-verificacao-pos-privatizacao.md) registra matriz de evidências e próximos gates.
- **Próxima hipótese:** conferir Pages e branch rules no painel GitHub; executar scanner histórico completo após `fetch --all` em ambiente seguro; tratar arquivos familiares em refs antigas sem publicar detalhes nem reescrever história destrutivamente.
- **Status:** MITIGATED_PARTIALLY / OPEN. Branch de segurança ainda precisa de CI e revisão.


---

## Identidade adulta e área familiar com Supabase (17/11/2026)

- **Problema:** após demonstração do MUNDELO a um grupo de mães, surgiu demanda explícita por cadastro. A aplicação ainda era uma SPA com estado em memória, dados demonstrativos e sem identidade/persistência multiusuário.
- **Decisão do responsável pelo produto:** Supabase para identidade e persistência; hospedagem web será decidida após fechar arquitetura. Cadastro público de adultos responsáveis, sem convite ou aprovação manual.
- **Limite de privacidade:** primeira experiência autenticada será uma área familiar de boas-vindas. Cadastro infantil, observações, anexos e quaisquer dados reais de crianças permanecem BLOQUEADOS.
- **Auditoria documental/técnica:** confirmado no repositório privado `creusiobd/Mundelo---Compreens-o-Infantil` que `AppContext` mantém dados demonstrativos em memória; `authorization.ts` é autorização client-side demonstrativa; o cofre local experimental não oferece identidade nem persistência remota multiusuário. O metadado GitHub consultado em 17/11/2026 informa visibilidade `private`.
- **Intervenção documental nesta branch:** criado ADR-005 em `docs/adr/005-identidade-e-persistencia-supabase.md`; modelo de ameaças em `docs/threat-model-public-family-onboarding-v0.1.md`; plano técnico em `docs/public-family-onboarding-implementation-plan-v0.1.md`.
- **Arquitetura escolhida:** Supabase Auth + PostgreSQL + RLS; migrations versionadas. Não foi criado projeto Supabase, não há credenciais configuradas, migrations aplicadas ou código de autenticação implementado.
- **Hospedagem:** ADIADA. Estratégia final de sessão (SPA com persistência no cliente versus camada server-side/cookies seguros), SMTP, domínio e limites/custos/região do Supabase continuam decisões pendentes.
- **Status:** DOCUMENTATION PROPOSED / AWAITING REVIEW. A criação desta documentação não libera cadastro público nem cadastro infantil.
- **Próxima ação:** revisar o PR documental; após aprovação, executar G0/G1 em ambiente de desenvolvimento com dados sintéticos, mantendo o gate infantil bloqueado.


---

## G0 — Decisão de sessão SPA com PKCE para desenvolvimento (17/11/2026)

- **Decisão do responsável pelo produto:** seguir recomendação de Supabase Auth SDK com Authorization Code + PKCE para a SPA React/Vite no ambiente de desenvolvimento.
- **Limite da decisão:** não equivale a aprovação da arquitetura de sessão para produção. Hospedagem permanece em aberto; produção exige revisão explícita de XSS, CSP, dependências, persistência/renovação de sessão, HTTPS, redirects e necessidade de camada server-side com cookies seguros.
- **Intervenção documental nesta branch:** atualização do ADR-005 e criação de `docs/supabase-auth-spa-pkce-dev-v0.1.md`, com pré-requisitos, fluxos, variáveis ilustrativas, segurança e testes.
- **Escopo preservado:** nenhuma alteração funcional na aplicação; nenhum projeto Supabase criado; nenhuma credencial configurada; nenhuma migration criada/aplicada; nenhum dado infantil real autorizado.
- **Próxima ação:** revisar esta documentação e, mediante autorização explícita, criar projeto Supabase de desenvolvimento, preparar CLI e migrations versionadas após revisão do schema mínimo.
- **Status:** DECISION_RECORDED / IMPLEMENTATION_NOT_STARTED.


---

## Política de isolamento familiar e RLS v0.1 (17/11/2026)

- **Problema:** antes de migrations, autenticação conectada ou persistência, definir como impedir que um adulto leia, altere ou assuma vínculo com espaço familiar de outra conta.
- **Decisão proposta:** isolamento por `auth.uid()` e membership ativa; perfis e aceites isolados por titular; leitura de espaço somente para membership ativa; nenhuma escrita direta de memberships ou papéis pelo cliente; criação inicial do espaço e membership por RPC transacional restrita.
- **Intervenção documental:** criado `docs/rls-family-isolation-policy-v0.1.md` com matriz CRUD por entidade, grants, constraints, cuidados com funções privilegiadas, contrato de RPC e testes negativos/positivos com identidades A/B/C/anônima.
- **Limites:** proposta não implementada; nenhuma policy, função, grant ou migration criada/aplicada; nenhum projeto Supabase criado; nenhum dado infantil autorizado.
- **Decisões pendentes:** campos mínimos, enums de papel/status, idempotência da RPC, owner restrito para função SECURITY DEFINER, retenção/exclusão de aceites e necessidade de preferences.
- **Próxima ação:** revisão da política pelo responsável pelo produto; após aprovação, fechar contrato de dados e escrever migration versionada para Supabase local/de desenvolvimento.
- **Status:** POLICY_PROPOSED / G2_BLOCKED.


---

## Extensão futura: colaboração com profissionais (17/11/2026)

- **Solicitação de produto:** contemplar fonoaudiólogos, psicólogos, terapeutas, pediatras e psiquiatras no acompanhamento infantil.
- **Diretriz:** identidade profissional não equivale a papel familiar nem concede acesso automático. Uma pessoa poderá ter perfil familiar e profissional simultaneamente.
- **Modelo candidato:** perfis e credenciais profissionais, vínculos de cuidado, concessões granulares por criança/finalidade/categoria/prazo e trilha de auditoria.
- **Taxonomia:** “terapeuta” exige identificação de disciplina, qualificação e registro aplicável, sem presumir regime único.
- **Limites:** visão futura apenas. Não criar tabelas, credenciais, vínculos profissionais ou permissões nesta etapa. Nenhum dado infantil real autorizado.
- **Intervenção:** adicionado adendo à política de isolamento e este registro de continuidade.
- **Próxima ação:** revisar fronteiras da colaboração profissional; manter G2 limitado ao isolamento de contas adultas e espaços familiares até a aprovação do contrato de dados do MVP.
- **Status:** FUTURE_CAPABILITY_DOCUMENTED / NOT_IMPLEMENTED.


---

## Princípio normativo de pluralidade das perspectivas (17/11/2026)

- **Decisão do responsável pelo produto:** o MUNDELO não deve tentar fazer com que todos os adultos enxerguem a criança da mesma maneira. Deve permitir que diferentes pessoas compreendam aspectos diferentes dela, sem apagar as particularidades de cada relação.
- **Intervenção documental:** criada especificação normativa docs/principio-pluralidade-perspectivas-v0-1.md; manifesto ampliado com princípio XIII; Principles Gate ampliado com PG-06; ADR-005 e política de isolamento receberam requisitos arquiteturais e de autorização.
- **Consequência de domínio:** contribuições independentes, autoria/contexto/tipo/proveniência preservados; divergência não é erro; sem consenso obrigatório, hierarquia automática ou perfil canônico; sínteses futuras serão derivadas e não substituirão fontes.
- **Limites:** alteração documental apenas. Nenhum código de aplicação, schema, migration, policy SQL ou dado infantil foi alterado/criado. A aderência do código atual ainda precisa ser avaliada antes de funcionalidades de colaboração ou registros compartilhados.
- **Próxima ação:** revisão do PR; após aprovação, mapear modelos e componentes existentes contra PG-06 e criar testes de domínio antes de implementar colaboração profissional.
- **Status:** PRINCIPLE_DOCUMENTED / CODE_CONFORMANCE_NOT_YET_ASSESSED.


---

## Aprofundamento da missão: compreensão, experiência e interação (17/11/2026)

- **Contribuição do responsável pelo produto:** a missão não é buscar uma visão uniformizada dos aspectos da criança. É mergulhar em como experimentamos comunicação, aprendizagem, ensino, sentimentos e o que fazemos para melhorar a interação da criança com o mundo.
- **Decisão de interpretação:** pluralidade não significa manter perspectivas isoladas. O MUNDELO deve conectá-las para gerar perguntas melhores e possibilidades de interação mais conscientes, preservando autoria, contexto e particularidade de cada vínculo.
- **Intervenção documental na PR #16:** acrescentada a seção 9 à especificação normativa, princípio XIV ao Manifesto, aprofundamento de missão ao Posicionamento e referência no README.
- **Critério de produto:** a criança não deve ser modificada para se adaptar às expectativas dos adultos; a ferramenta deve ajudar adultos a escutar, comunicar, ensinar e ajustar ambientes. Não prescrever intervenções clínicas nem prometer resultados não validados.
- **Limites:** documentação apenas; nenhuma funcionalidade, schema, migration ou comportamento de código foi alterado. A missão ampliada ainda precisa ser traduzida em requisitos e validada com pesquisa com adultos, profissionais e, de forma apropriada e ética, considerando a participação da criança.
- **Próxima ação:** revisar a PR #16 como um todo e, após merge, realizar auditoria do domínio, fluxos e interface existentes contra os princípios XIII, XIV e PG-06.
- **Status:** PRODUCT_DIRECTION_DOCUMENTED / IMPLEMENTATION_NOT_STARTED.


---

## Contrato de domínio: núcleo compartilhado de compreensão da criança v0.1 (17/11/2026)

- **Problema:** formalizar como responsáveis legais e profissionais de saúde podem contribuir para a compreensão da criança sem confundir legitimidade, vínculo, autorização, permissão ou apagar a pluralidade das perspectivas.
- **Diretriz central:** compartilhar compreensão não significa compartilhar indiscriminadamente todos os registros. O núcleo familiar e o acesso profissional são espaços distintos; o profissional recebe apenas escopo explicitamente autorizado.
- **Regra de acesso profissional:** vínculo não concede acesso automático. A concessão é específica por criança, profissional, finalidade, categorias, operações e prazo. O acesso ao histórico anterior é uma escolha explícita por categoria; contribuições futuras permanecem limitadas ao escopo ativo.
- **Modelo conceitual:** Child, ChildResponsibility, ProfessionalIdentity, ProfessionalRelationship, AccessGrant, AccessGrantScope, Contribution, ContributionVersion, InteractionExperience, ContributionRelation, DerivedSynthesis e AuditEvent. Identificadores são candidatos conceituais, não schema aprovado.
- **Governança:** legitimidade e poderes dos responsáveis não serão reduzidos a uma regra universal de consentimento único ou unanimidade. Situações incertas, restrições ou conflitos bloqueiam novas concessões até verificação apropriada. Requer validação jurídica e de privacidade antes de dados reais.
- **Intervenção documental:** criado `docs/contrato-dominio-mundelo-v0-1.md` na branch `docs/domain-contract-shared-child-understanding-v0.1`, com espaços de compartilhamento, categorias, operações, histórico, revogação, proveniência, divergência, sínteses, segurança, invariantes e critérios de aceitação.
- **Limites:** proposta conceitual pendente de revisão. Nenhum código funcional, schema, migration, policy RLS, projeto Supabase, credencial ou dado infantil real foi criado/modificado.
- **Próxima ação:** revisar o contrato e resolver pendências de legitimidade, governança, retenção e validação jurídica; somente após aprovação derivar modelo lógico, ADRs, RLS e testes.
- **Status:** DOMAIN_CONTRACT_PROPOSED / IMPLEMENTATION_BLOCKED_PENDING_APPROVAL.

---

## Retomada e correções de privacidade — 21/11/2026

- **Problema:** conexão direta do Codex/Git indisponível; recuperar estado atual e executar pendências do Project.
- **Fonte:** integração autorizada GitHub; main `b6921b3b5100ace9c6bee46c8445b4e00c34dbb8`, issues vinculadas ao Project 4. Quadro visual privado não acessível nesta sessão; sem sincronização de seus campos.
- **Resultado:** [checkpoint de 11 tarefas abertas](gestao/andamentos/2026-11-21-retomada.md); #44 já incorporada pela PR #48. Preparadas correções #43 (detalhe), #46 (relatório) e #45 (envelope v2 mínimo com importação v1).
- **Validação:** 102 testes de unidade/domínio/segurança, tipos, build, scan e diff aprovados. Navegador local BLOCKED pelo ambiente; [CI 44945589494](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/actions/runs/44945589494) PASS: 65 testes de navegador e 17 na etapa dedicada a11y (subconjunto da suíte), incluindo CTRL-01 e P01–P04 originais. [Evidência](qa/fix-43-45-46/validacao.json).
- **Decisão/limites:** [D04 e compatibilidade](qa/fix-43-45-46/README.md). Arquivos v1 existentes não são reescritos; leitor anterior não abre v2. Autorização continua demonstrativa no cliente. R01–R16 e gates jurídicos/técnicos conservados. Nenhuma implantação ou dado real autorizado.
- **Próxima ação:** revisar/incorporar PR #49. PR #50 entrega diagnóstico #29, proposta de experiência #34 e parecer técnico #35; comprovação externa, validação competente e fontes para #24–#26 continuam pendentes. Nenhuma issue é encerrada automaticamente antes da incorporação.


---

## Integração aprovada das PRs #49 e #50 — 21/11/2026

- **Confirmação do responsável:** as duas PRs foram validadas e aprovadas; integração conferida no GitHub.
- **PR #50:** incorporada em `6552f784d8fa369d3b95f36b6378cf81f9585be4`, entrega documental de UX-001/#34, diagnóstico parcial TEC-002/#29 e parecer técnico REL-001/#35.
- **PR #49:** incorporada em `da66b9a4961233c43c6f16da0bded58fd636f6bf`, correções #43/#45/#46 e evidências de validação. A main inclui ambas; [CI da integração](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/actions/runs/44946599881) concluído com sucesso.
- **Tarefas encerradas nesta integração:** #34, #43, #45 e #46. São 12 encerradas e sete abertas entre as 19 issues de execução acompanhadas, sem incluir PRs antigas ou cartões avulsos não consultados.
- **Pendências:** #24 precisa localizar o acervo dos 73 IDs; #25/#26 dependem de fontes integrais; #27 aguarda validação competente; #29 aguarda configuração/inventário/provas do ambiente externo; #35 depende dos gates para deliberar avanço; #36 permanece como acompanhamento recorrente.
- **Próxima frente técnica:** TEC-002/#29, comprovar ambiente de desenvolvimento escolhido e capacidades de retenção, cópias, expurgo e restauração com dados sintéticos. Não criar infraestrutura por essa tarefa nem presumir projeto Supabase configurado.
- **Limites mantidos:** aprovação e merge não habilitam dados infantis reais, não comprovam R01–R16 integrais nem substituem revisão humana/jurídica aplicável. Campos do Project não foram sincronizados nesta sessão.


---

## Replanejamento solicitado — pausa TEC-002 e fontes INF-002 / 21/11/2026

- **Decisão do responsável:** manter #29 pendente diante das limitações de conexão ao Supabase e seguir à próxima frente. Tentativas de autenticação interrompidas; nenhum teste de backup, restauração ou expurgo externo executado. Retomada condicionada ao acesso e evidências do ambiente de desenvolvimento.
- **Próxima frente selecionada:** INF-002/#24, conciliar versões/aprovações dos 73 identificadores anteriormente documentados.
- **Resultado da localização:** o acervo não foi localizado nas branches de gestão/contrato conferidas nem nas buscas de fontes acessíveis. A tarefa #24 permanece bloqueada até receber os textos/matriz ou sua localização concreta. Não declarar 73 textos auditados nem transformar lembranças/resumos em fontes originais.
- **Insumo para retomar #24:** arquivo ou pasta com os textos existentes e referências de origem/aprovação, preservando versões e lacunas. A exportação integral de #25 e os 219 IDs sem transcrição de #26 mantêm escopos próprios.
- **Estado de segurança:** dados infantis reais e R01–R16 integrais continuam sujeitos aos gates anteriores. A pausa não altera sua disposição.


## 21/11/2026 — Correção #51: contagens sem conclusões fixas

Removidos os três padrões fixos de Compreender. A tela apresenta apenas contagens da amostra autorizada, com universo, limites e perguntas gerais explicitamente separadas. Amostra vazia não recebe percentuais fictícios. Quatro cenários E2E adicionados; expectativas de navegação atualizadas. Evidência e limites em [fix-51](qa/fix-51/README.md); execução de CI acompanhada na PR vinculada à issue #51.

TypeScript e 102 testes de domínio/segurança PASS local; navegador local bloqueado antes das asserções. Não tratar a tentativa como teste de comportamento concluído. #52–#54 continuam pendentes; PG-06 integral e dados infantis reais seguem bloqueados. #29 permanece pausada por acesso ao Supabase.


## 21/11/2026 — Continuação após PR #55: correção #52

PR #55 já incorporada na main em `eca2025b918ca3fdee8c09e7ded27170617599b5`, conforme revisão/aprovação do responsável; #51 encerrada por integração. Próximo recorte #52 separa proposta de atividade de relato, remove padrões factuais dos formulários/validadores/migrador e conserva lacunas em estratégias. Campos obrigatórios sem informação bloqueiam o registro, sem inventar autoria/origem/data. Compatibilidade de registros completos e limites de legados incompletos explícitos em [fix-52](qa/fix-52/README.md).

Controle negativo: 13 testes falham com fontes antigas; suíte corrigida 115 PASS local; TypeScript/build PASS. Cinco cenários E2E novos para execução CI na PR vinculada à #52, com criação/edição/estratégia verificadas pelo cofre exportado real. Resultados finais de CI registrados na PR/issue. #53/#54 pendentes, PG-06 integral e dados infantis reais bloqueados. #29 continua pausada, sem nova tentativa de conexão.


## 22/11/2026 — Continuação após PR #56: correção #53

PR #56 incorporada na main `04713b6ec5173b080eea4ab93a6548dc66b30954`; #52 concluída por integração. #53 separa leitura/gestão de perfil de criação de observações, aplica status/vínculo/contexto nos comandos reais e impede apresentação de Meu Mundo/configuração sem acesso. Gestão de atributos globais restrita ao responsável legal ACTIVE vinculado no protótipo; papel não valida perspectiva nem concede correção de contribuição alheia. Política e limites em [fix-53](qa/fix-53/README.md).

142 testes de domínio/segurança e TypeScript/build PASS local. Oito cenários E2E novos, incluindo comandos no AppProvider real sem mock do avaliador; teste isolado de desenvolvimento fora do bundle de produção. Resultado de CI por commit registrado na PR/issue #53. #54, PG-06 integral/dados infantis reais continuam pendentes; #29 pausada, sem tentativas de conexão.
