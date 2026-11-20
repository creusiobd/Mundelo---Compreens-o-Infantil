# Correção #44 — Revalidação antes de liberar o cofre

[Issue #44](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/44) · Responsável pelo encaminhamento: Creusio Kizua · Base: `f7d95cf827b8d6e71737a7ae30227b76ba0c6de7`.

## Comportamento corrigido

Antes, a trava era liberada ao retornar o payload síncrono. O modal cifrava depois e baixava o arquivo usando o contexto inicial, mesmo após trocar para cuidador sem acesso. A [QA-002](../qa-002/README.md) reproduziu um download nessas condições.

Agora o contexto executa uma operação de exportação que mantém a trava desde a preparação até a liberação. Depois da cifra, verifica contexto vigente, vínculo/status, geração, snapshot de dados e validade da trava. A entrega síncrona ocorre logo após essa guarda, sem outro await. Se houver alteração pertinente ou expiração, o arquivo não é liberado e a interface informa cancelamento/reinício.

Os setters dos dados/perfis/cuidadores e dos identificadores ativos invalidam preparações de forma síncrona, antes do commit React. Isso cobre mudanças aceitas durante a espera e a troca de cuidador com retorno ao original. Uma referência ao último contexto comprometido evita usar a closure inicial; comparação de snapshots também rejeita dados de renderização anterior. A invalidação é conservadora: uma escrita aceita no domínio pode exigir nova exportação mesmo se outro perfil tiver mudado.

A trava é liberada em finally; senhas são limpas em sucesso, erro e cancelamento. Link e URL temporários são removidos em finally quando criados. Operação expirada não pode confirmar nem liberar uma trava posterior. O formato do cofre e seus parâmetros criptográficos não foram alterados.

## Arquivos e regressões

- [Contexto](../../../src/context/AppContext.tsx): operação assíncrona protegida e invalidação de preparações.
- [Modal](../../../src/components/VaultExportModal.tsx): cifra dentro da operação e download na entrega validada.
- [Trava](../../../src/security/domainLock.ts): expiração verificada no commit.
- [Oito regressões em navegador](../../../tests/e2e/vault-export-revalidation.spec.ts): autorização preservada; cuidador sem vínculo; outro cuidador autorizado; troca de perfil; troca com retorno; alteração de registros; expiração; falha de cifra seguida de nova tentativa.
- [Dois testes de expiração](../../../tests/vault-export-expiration.test.ts).
- [Evidências estruturadas](validacao.json).

Os oito testes novos entram na suíte E2E existente; os dois testes de expiração entram na suíte de domínio. As expectativas refletem o comportamento correto, sem skip ou expected failure. No ensaio de alteração dos registros, eventos do DOM acionam handlers reais de UI durante a espera, sem substituir o store ou o avaliador. A barreira da cifra executa a Web Crypto original e segura apenas o retorno.

## Validação observada

Dez testes de navegador passaram na versão final: oito novos mais CTRL-01 e P02 originais. P02 passou de FAIL para PASS; CTRL-01 continuou PASS. Suíte de domínio/segurança: 94 PASS, incluindo dois novos testes. Conferência de tipos e build locais aprovados. Dados exclusivamente sintéticos, em Windows 11/Node 22.23.5/Playwright 1.65.0. Detalhes e duração no JSON.

Em ambiente preparado, Node compatível e dependências do lockfile:

```text
npm test
npm run lint
npm run build
npm run test:e2e -- vault-export-revalidation.spec.ts
npx playwright test --config docs/qa/qa-002/playwright.probes.config.ts --grep "P02:|CTRL-01:"
```

## Limites e acompanhamento

Esta correção protege a entrega do cofre no protótipo local. Não implementa autorização no servidor, concessão persistente revogável, fila, backup governado ou retenção por categoria. R06 integral e os demais cenários mantêm suas pré-condições, sem aprovação automática por estes testes.

#43 (detalhe), #45 (metadados públicos do envelope) e #46 (perfil no relatório) permanecem abertas. Seus diagnósticos não foram reclassificados como aprovados; a evidência histórica da QA-002 foi preservada. Nenhuma migration, novo prazo ou liberação de dados reais acompanha esta alteração. A revisão/incorporação da correção é distinta da verificação humana independente aplicável a atos com dados reais.
