# #51 — Contagens de registros sem padrões fixos

Data: 21/11/2026. Base: `3208aa0d3b067d30bd940c7b12e59b0b14f508d8`.
Origem: AUD-05 da reavaliação da PR #17.

## Problema e alteração

Compreender exibia três textos fixos como padrões identificados, independentemente da criança e da amostra, incluindo amostra vazia. Os cartões foram removidos. A tela agora apresenta “Registros & Contextos” e contagens por ambiente/foco dos registros autorizados pelo contexto demonstrativo.

O total e o denominador são explícitos; percentuais arredondados podem não somar 100%. Amostra vazia não exibe percentuais de focos, apenas ausência de registros. Contar registros não demonstra frequência de comportamentos no cotidiano, causalidade, consenso ou diagnóstico. As perguntas restantes são identificadas como sugestões gerais, iguais para todas as sessões e não derivadas da amostra.

## Verificação

- TypeScript: PASS local.
- Domínio/segurança: 102 PASS local por `node --import tsx --test tests/*.test.ts` (mesmos testes da suíte npm; evita o IPC do launcher indisponível neste executor).
- Build: produzido durante a tentativa local de Playwright; aviso preexistente de bundle grande.
- Playwright local: BLOCKED antes de abrir página, por `socket() failed: Operation not permitted`. A tentativa com a tela antiga não executou as asserções; não é evidência de reprodução nem controle negativo aprovado.
- Testes novos: quatro cenários em [understand-counts.spec.ts](../../../tests/e2e/understand-counts.spec.ts), para execução no CI da PR: troca Tomás/Lia e percentuais esperados; esvaziar/restaurar; perda de vínculo/suspensão; axe-core e reflow desktop/mobile, com/sem registros. Navegação por controles reais; nenhuma substituição do contexto/avaliador ou skip.
- Expectativas compartilhadas de navegação atualizadas para os novos títulos. Resultados efetivos do CI são registrados na PR e na issue #51.

## Limites

A alteração trata AUD-05 no recorte de textos fixos e transparência das contagens. Não implementa filtros por perspectiva, interpretação automática, servidor/RLS ou solução das issues #52–#54. A identidade de perfil em outras superfícies continua no escopo de #53. Não conclui PG-06 integral, retenção R01–R16 ou competência jurídica. Dados exclusivamente sintéticos; #29 permanece pausada e dados infantis reais continuam bloqueados.
