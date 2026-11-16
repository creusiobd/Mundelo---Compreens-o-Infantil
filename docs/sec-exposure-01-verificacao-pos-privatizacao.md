# MUNDELO | SEC-EXPOSURE-01 — Verificação após privatização (16/11/2026)

**Escopo:** visibilidade, integração GitHub, publicações, branches, histórico disponível e mecanismos preventivos. **Não é laudo de ausência de vazamentos.**

## 1. Evidências observadas nesta rodada

| Item | Evidência | Situação |
| --- | --- | --- |
| Visibilidade do repositório | GitHub `get_repo`: `visibility=private` | **CONFIRMADO** |
| Acesso pela integração conectada | Leitura de arquivos na `main` e em branch privada; PR #10 `merged=true` | **CONFIRMADO** |
| Inventário de refs | `search_branches`: 11 branches disponíveis | **CONFIRMADO** |
| Proteção da `main` | GitHub REST `branches/main`: `protected=false` | **PENDENTE DE CONFIGURAÇÃO** |
| Publicação anterior GitHub Pages | Run `43483130809`, `workflow_dispatch`, 13/11/2026, `conclusion=success` | **PUBLICAÇÃO ANTERIOR CONFIRMADA** |
| Página ainda acessível externamente | Endpoint da configuração Pages não acessível por este conector; teste externo de URL inconclusivo | **NÃO CONFIRMADO** |
| Segredos em código atual | Pesquisas de padrões `ghp_`, `sk-proj-`, `AIza`, `PRIVATE KEY` e `GEMINI_API_KEY`. Correspondências de alguns padrões ocorreram na implementação do próprio scanner e no `.env.example` com placeholder | **NENHUM SEGREDO REAL CONFIRMADO; NÃO EXAUSTIVO** |
| Documentos familiares na branch histórica | `docs/mundelo-dossie-maturidade-v0-1` possui arquivo editorial expandido sujeito à revisão de privacidade. Não reproduzir detalhes em relatórios | **REVISÃO PENDENTE** |
| Digitalização completa de todos os commits/branches | Nenhuma execução local completa de `--history` foi validada | **NÃO EXECUTADA** |

A simples ausência de resultados na busca textual não comprova ausência de dados sensíveis, sobretudo em commits excluídos, anexos, logs, artefatos, forks e caches externos.

## 2. Mudança preventiva proposta nesta rodada

O workflow `.github/workflows/device-real-01-pages.yml` passa a exigir:
1. Na execução manual, informar `confirm_publication=PUBLIC_SYNTHETIC_ONLY`.
2. Variável de repositório `MUNDELO_DEMO_PUBLICATION_APPROVED=true` (exatamente), configurada **somente após revisão de segurança e autorização explícita do responsável**.
3. Sem as duas condições, o job `publication-approval` falha e bloqueia o build e o deploy.

**Estado:** código proposto na branch `security/sec-exposure-01-closure-hardening`. Não afirmar gate efetivo antes de merge e CI. **A mudança NÃO despublica a página já implantada.** A aprovação não constitui controle de acesso à demo.

## 3. Ações administrativas ainda necessárias

**A. Pages:** abrir `Settings > Pages`. Verificar URL efetiva e situação atual de publicação. Se a demo externa não for necessária agora, despublicar o site no menu Pages, conferindo se a opção de despublicação está disponível, e verificar pelo navegador sem login. Se desejar manter uma demo de teste, registrar decisão e garantir apenas dados sintéticos. A privatização do repositório não permite inferir automaticamente a acessibilidade do site.

**B. Proteção da main:** em `Settings > Branches` ou `Rules > Rulesets`, configurar revisão de PR, aprovação de checks aplicáveis e bloqueio de force-push e exclusões, verificando disponibilidade para o plano. O REST informa `protected=false`, sem atestar a ausência de toda e qualquer regra externa.

**C. Histórico e privacidade:** preservar backup privado antes de decidir excluir branches com manuscritos pessoais. Revisar a adequação da publicação anterior e lembrar que eliminar arquivos/branches não apaga cópias já obtidas. Limpeza de histórico, caso necessária, requer planejamento, verificação de referências de PR e eventual suporte GitHub.

**D. Scanner de credenciais:** após checkout seguro local e `git fetch --all`, executar `node scripts/check-exposed-credentials.mjs --history`; complementar com uma ferramenta especializada e GitHub Secret Scanning, quando disponível. Não colar segredos encontrados no PR ou chat; revogar imediatamente credenciais ativas expostas.

## 4. Critérios de conclusão

**SEC-EXPOSURE-01 não pode receber CLOSED enquanto**: acesso público do Pages estiver sem decisão/checagem, avaliação da documentação pessoal e histórico não tiver evidência, e as configurações administrativas de repositório não forem verificadas.

**Estado atual:** `MITIGATED_PARTIALLY / OPEN`. O repositório está privado, mas a privacidade histórica e o acesso à demo ainda precisam de confirmação.

## 5. Linha de continuidade

- **Problema:** exposição pública anterior do projeto e incertezas sobre Pages, branches e histórico.
- **Testes:** API do GitHub para visibilidade, branches, `main`, workflow runs, busca focal por padrões e leitura de arquivos.
- **Resultado:** privatização confirmada; deploy histórico Pages confirmado; `main.protected=false`; busca sem segredo verdadeiro identificado; acesso atual ao Pages não comprovado.
- **Próxima hipótese:** despublicar/confirmar Pages via UI; aprovar e integrar gate preventivo; validar branch rules; executar scan histórico local antes de eventual limpeza de refs.
