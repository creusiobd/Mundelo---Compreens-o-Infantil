# MUNDELO | Protocolo de Redução de Exposição v1.0

**Classificação:** uso operacional, sem dados pessoais no documento.  
**Status:** mitigação em andamento. A exposição não está encerrada enquanto `visibility=public` e histórico/branches não forem revisados.  
**Escopo:** repositório e demo sintética; nenhuma funcionalidade de produto alterada.

## Diagnóstico verificado

- `creusiobd/Mundelo---Compreens-o-Infantil` está **public** (GitHub repository metadata).
- A integração GitHub atualmente conectada permite ler/escrever código e PRs, mas **não oferece operação de alterar a visibilidade** nem de modificar GitHub Pages, segredos, segurança avançada ou configurações de branches.
- A demonstração GitHub Pages é publicada por `workflow_dispatch` e, quando ativa, torna os arquivos compilados acessíveis publicamente. A opção `noindex` não controla acesso.
- `.gitignore` impede novos commits acidentais de `.env*` (exceto `.env.example`), mas não remove dados já versionados.
- `.env.example` contém marcadores de exemplo, não credenciais ativas verificadas.
- Há material de narrativa familiar em branches documentais anteriores; sua disponibilidade é incompatível com a premissa de que apenas `main` importa. **Não reproduzir esses relatos neste relatório.**
- A inspeção de arquivos centrais e pesquisa textual por indicadores conhecidos não mostrou chave de API real confirmada. **Não corresponde a auditoria exaustiva de histórico, todas as branches, releases, logs ou forks.**
- O controle de autorização no frontend e o cofre local experimental **não autorizam armazenamento de dados infantis reais**.

## Ação urgente do proprietário: visibilidade privada

1. Abrir `Settings > General > Danger Zone > Change repository visibility`.
2. Selecionar **Make private**, confirmar nome do repositório e as consequências exibidas pelo GitHub.
3. Validar novamente em `Settings` e na página inicial se a visibilidade é **Private**.
4. Verificar impactos em GitHub Pages, Actions, usuários colaboradores e eventual demo já publicada.
5. **Não assumir** que privatizar revoga acesso a clones, forks, arquivos compilados, URLs cacheadas, commits antigos ou screenshots.

**Importante:** alterar visibilidade é uma ação administrativa que precisa ser feita pelo proprietário na interface GitHub neste ambiente.

## Plano de resposta para conteúdo pessoal em branches

- Preservar cópia de uso privado do manuscrito, fora do repositório público, antes de qualquer edição.
- Classificar texto de autoria própria, relatos autobiográficos e referências a terceiros quanto ao consentimento e necessidade de publicação.
- Não criar novo PR público que reproduza conteúdo íntimo para “corrigir” o problema.
- Depois de privatizar e fazer backup, revisar branches históricas e PRs. Excluir um arquivo na ponta da branch ou apagar uma branch **não garante** remoção dos commits públicos anteriores.
- Se o objetivo for reduzir vestígios históricos, seguir procedimento oficial de remoção de dados sensíveis e suporte GitHub quando aplicável. Avaliar referências de PR, forks, caches e GitHub Pages.
- Em caso de relato apenas íntimo, priorizar despublicação e prevenção de novas exposições. **Não fazer force-push destrutivo em branches sem verificar e preservar referências**.

## Segredos: auditoria, resposta e CI

- Nova verificação de indicadores em arquivos rastreados: `node scripts/check-exposed-credentials.mjs`.
- Inspeção local de histórico e refs disponíveis após `git fetch --all --prune`: `node scripts/check-exposed-credentials.mjs --history`.
- Complementar com GitHub Secret Scanning / Push Protection (quando disponível no plano/repositório) e ferramenta de auditoria especializada (p.ex. gitleaks), incluindo logs e artifacts.
- A verificação automatizada é **heurística**: ausência de correspondência não comprova ausência de segredos.
- Se qualquer credencial verdadeira esteve exposta: **revogar/rotacionar imediatamente no provedor**, revisar acessos, tokens e logs, depois avaliar limpeza de histórico. Não basta apagar o arquivo.
- Nunca colar valores secretos em issue, pull request, chat ou relatório público.

## GitHub Pages

- Confirmar `Settings > Pages`: modo de publicação, URL atual, origem e histórico de deploys.
- Se a demo pública não for mais necessária para o laboratório, **despublicar/desabilitar GitHub Pages nas configurações**, após checar o impacto no teste DEVICE-REAL-01.
- Se mantida para teste assistivo, publicar exclusivamente build revisado com perfis e cenários fictícios; evitar coletar dados reais e verificar que a UI não dá falsa impressão de controle de acesso.

## Matriz de aceitação

| Controle | Responsável | Critério | Estado |
| --- | --- | --- | --- |
| Repositório privado | Proprietário | GitHub mostra `Private`; novo fetch confirma | PENDENTE |
| Conteúdo pessoal | Proprietário + revisor de privacidade | Backup privado; branches/PRs/histórico avaliados | PENDENTE |
| Segredos históricos | Segurança | Scan de todas as refs, revisão de achados e rotação se necessário | PENDENTE |
| Guard CI | Engenharia | Scanner rodando em PR e sem vazamento de valores no log | IMPLEMENTADO NA BRANCH, CI PENDENTE |
| Demo Pages | Proprietário | Decisão registrada: offline ou demo sintética publicada | PENDENTE |
| Dados reais de crianças | Produto | Permanecem proibidos no protótipo | BLOQUEADO |

## Registro operacional

- **Problema:** exposição de código e possível narrativa familiar em repositório público.
- **Hipótese:** privatização + revisão de histórico + scanning preventivo podem reduzir superfície de exposição sem alterar funcionalidades.
- **Testes já realizados:** leitura de metadados GitHub, inventário de arquivos, inspeção de fluxos/workflows, busca focal por indicadores de credencial.
- **Resultado:** repo público confirmado; risco de privacidade documental verificado; nenhuma credencial real confirmada nos itens inspecionados; auditoria histórica completa não concluída.
- **Próxima hipótese:** após mudança para Private, validar visibilidade, controlar Pages, auditar refs/PRs e decidir limpeza histórica; testar guard CI antes de merge.
