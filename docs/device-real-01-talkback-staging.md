# MUNDELO | DEVICE-REAL-01: Demo HTTPS e Teste TalkBack

**Status:** implantação manual acionada em 13/11/2026; acesso pelo tablet e leitura TalkBack confirmados por relato humano. Evidência independente do resultado final de deploy/URL ainda não anexada a este registro.  
**Baseline:** Manifesto institucional v1.0 + MUNDELO v1.1, dados 100% sintéticos.

## Objetivo

Disponibilizar uma cópia estática de demonstração acessível por HTTPS para inspecionar a Home e os fluxos assistivos no Galaxy Tab S10 Ultra com TalkBack e Chrome.

## Modelo de publicação

O workflow `.github/workflows/device-real-01-pages.yml` é **somente manual** (`workflow_dispatch`) e instala dependências com `npm ci`, executa testes, cria o build de produção com base para o subcaminho do GitHub Pages e publica o diretório `dist/`.

**Importante:** GitHub Pages de repositório público entrega um site **publicamente acessível, sem login**. `noindex` é uma solicitação a buscadores, não um controle de acesso. Não colocar dados infantis reais, credenciais, fichas, segredos ou arquivos privados na aplicação.

O app é demonstrativo, com dados fictícios em memória; o recurso de exportação local, se usado, grava um arquivo no dispositivo escolhido. Evite exportar dados nos testes iniciais.

## Passos manuais necessários após merge e CI aprovado

1. Abrir **Settings → Pages** do repositório e selecionar **Build and deployment → Source: GitHub Actions**. Verificar se o recurso GitHub Pages está permitido para a conta e o repositório.
2. Abrir **Actions → MUNDELO | DEVICE-REAL-01 demo HTTPS → Run workflow**, escolhendo a branch `main`.
3. Verificar o resultado da execução e o link `page_url` fornecido pelo deploy. O endereço esperado normalmente é `https://creusiobd.github.io/Mundelo---Compreens-o-Infantil/`, mas **não declarar publicado até verificar a execução e abrir a URL**.
4. No Galaxy Tab S10 Ultra, abrir a URL HTTPS no Chrome e confirmar que a Home renderiza, fontes e scripts carregam e as ações usam somente dados sintéticos.
5. Ativar TalkBack em **Configurações → Acessibilidade → TalkBack**. A nomenclatura varia conforme One UI.
6. Percorrer títulos, botões, menus, seletores de criança/cuidador, abrir e fechar o modal de observação e confirmar leitura e retorno de foco.
7. Registrar evidências no arquivo `docs/ux-real-01b-assistive-manual.md`: modelo, versões, navegador, data, anúncio ouvido, comportamento esperado/observado e status por cenário.

## Checklist de autorização e segurança de publicação

- [ ] A versão é demonstrativa com dados sintéticos, confirmada por inspeção do código e testes.
- [ ] Nenhum segredo ou token de API será injetado no frontend ou workflow.
- [ ] Produção exclui a rota/componente Security Lab DEV-only.
- [ ] Build e E2E do PR estão aprovados.
- [ ] O responsável pelo produto aceita que a demonstração ficará publicamente acessível.
- [ ] GitHub Pages está configurado para GitHub Actions.
- [ ] A execução `workflow_dispatch` foi iniciada deliberadamente.
- [ ] URL real confirmada no navegador do tablet.
- [ ] Observações TalkBack registradas como PASS/FAIL/BLOCKED sem resultados inventados.

## Critérios de aceite

**Deploy:** URL HTTPS real funcionando, sem dados reais, testes e build aprovados.  
**TalkBack:** ordens de leitura e estados anunciados corretamente, navegação íntegra, foco restaurado, ausência de barreiras críticas, evidências observadas por humano.

A aprovação do TalkBack no tablet não substitui NVDA, VoiceOver nem o SEC-23 em Android de desempenho intermediário.

## Primeira execução humana relatada — 13/11/2026

O executor confirmou que a demonstração abriu no Galaxy Tab S10 Ultra e que o TalkBack leu corretamente os elementos. Em seguida classificou como PASS três cenários: (1) navegação Início/Diário/Meu Mundo, (2) abertura e exploração de Nova Observação, e (3) fechamento com retorno à navegação. Nenhum defeito foi reportado nesses cenários. Evidência: relato do executor; sem vídeo, log de voz, versão exata do navegador ou SHA do deploy anexados.

**Atualização do estado:** DEVICE-REAL-01 `PARTIALLY_EXECUTED`, três cenários `PASS (relato humano)`; checklist detalhado de TalkBack, outros dispositivos/leitores e SEC-23 permanecem pendentes. Os itens da lista de autorização acima são um checklist pré-publicação histórico, e não devem ser retroativamente assinalados sem comprovação própria.

Detalhes: [UX-REAL-01B](ux-real-01b-assistive-manual.md).

## Registro de continuidade

- **Problema:** ambiente anterior de homologação não era acessível externamente ao tablet.
- **Hipótese:** uma demonstração estática sobre HTTPS permitirá testes nativos de leitor de tela.
- **Teste previsto:** build Vite com base GitHub Pages, execução manual do workflow, smoke test Android, TalkBack.
- **Resultado atual:** NOT_EXECUTED.
- **Próxima ação:** revisão do PR, configuração GitHub Pages e disparo manual após autorização de publicação.
