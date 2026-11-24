# Correção #59 — Perfil da Home e linguagem sem inferências

[Tarefa #59](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/59) · Responsável: Creusio Kizua · Data: 23/11/2026 · Base: `88a7eb84a3beae187cb880990d2b465ef00f378c`.

## Resultado

A Home aplica `canReadProfile` antes de obter a representação do perfil para apresentação. Sem leitura, não renderiza nome/idade, inicial, interesses, comunicação, contagens do perfil ou ação de ajuste. Mostra indicação neutra de indisponibilidade e mantém navegação e regras existentes de criação. O estado sem leitura deixa de afirmar que o acervo está vazio. Troca/retorno de criança ou cuidador recalcula a apresentação; a mesma condição é aplicada em impressão.

Com leitura, os dados globais aparecem como informações do perfil. O primeiro interesse não é chamado de atual e a primeira forma de comunicação não é chamada de frequente. Campos vazios informam ausência de preenchimento, sem criar o interesse “Exploração livre”. O resumo informa que origem/data não estão indicadas e que a ordem não representa frequência, preferência ou atualidade. A contagem de estratégias não afirma resposta/eficácia observada.

`canManageProfile` controla a ação de ajuste; leitura de cuidador vinculado sem gestão continua disponível e não cria permissão de edição. Não foi alterado o avaliador, o modelo de dados, o registro de contribuições, a autorização do servidor ou os parâmetros de retenção. #53/#54 permanecem concluídas em seus recortes anteriores.

## Esperado e observado

Na base, três testes de UI real falharam: rótulos sem evidência no perfil autorizado; atributos ainda visíveis ao cuidador sem vínculo; atributos ainda visíveis ao suspenso. Após a correção, os sete testes específicos passaram. O conjunto final com os cinco testes históricos de navegação da Home totalizou **12 PASS**.

Os sete casos específicos cobrem:

1. Resumo autorizado, delimitação da origem e ação legítima de nova observação.
2. Cuidador sem vínculo: atributos/contagens ausentes, inclusive impressão.
3. Cuidador suspenso: mesmas negativas.
4. Troca/retorno de criança e cuidador, com recomposição somente quando a leitura volta a ser permitida.
5. Educador vinculado: leitura, observações e detalhe legítimos preservados.
6. Campos vazios por comando real autorizado de contexto: ausência explícita, sem fallback inventado; entrada de teste fora do build de produção.
7. Acessibilidade da Home autorizada/restrita em 1280 e 360 pixels.

[Testes de UI](../../../tests/e2e/home-profile-access.spec.ts), [Home](../../../src/screens/HomeScreen.tsx), [evidência minimizada antes/depois](validacao.json). As observações publicadas são booleanos/estados sintéticos, sem cópia de dados pessoais reais. A política não foi mockada. A entrada [home-profile](../../../tests/harness/home-profile/entry.tsx) existe apenas no servidor de desenvolvimento de teste; não é importada pela aplicação de produção e sua ausência foi conferida via resposta do preview.

Tipos, build e suíte de domínio/segurança local passaram: **150 testes, zero falhas**. Esses resultados são separados do aceite de PG-06 integral e dos cenários de retenção.

## Reprodução

Em checkout preparado com dependências fixadas, Node compatível e Chromium instalado:

```text
npm test
npm run lint
npm run build
npm run test:e2e -- home-profile-access.spec.ts home-navigation.spec.ts
```

A configuração existente inicia preview 4173 e servidor de desenvolvimento 4174 para entradas de teste. A execução local usou os mesmos servidores com Node 22 explícito; chamadas externas do navegador foram bloqueadas. Novos testes integram a suíte E2E da CI, sem skip ou expected failure.

## Cobertura e pendências

O [inventário de 14 consumidores](inventario.md) distingue proteção da Home, guardas anteriores e identidades de fixtures ainda mostradas por outras superfícies. A impressão verificada é a apresentação da Home em main; o cabeçalho/seletor da página inteira continua um limite documentado.

A entrega não conclui PG-06 integral, RLS, R01–R16 ou autorização de produção. Não cria princípios INF-ID nem atribuições de contribuições. A #29 permanece pausada, e dados infantis reais continuam bloqueados. Próximos recortes já registrados: contrato de contribuições/autoria/versões na #60 e linguagem de registro/exclusão na #61, considerando também as pendências de identidade inventariadas.
