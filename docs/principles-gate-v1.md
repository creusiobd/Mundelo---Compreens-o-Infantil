# MUNDELO | Principles Gate v1.0

**Status:** norma operacional institucional vigente para revisão de mudanças, com adoção progressiva e pendências explícitas.  
**Referência:** [Manifesto v1.0](manifesto-principios-mundelo-v1.md).

## Objetivo

Traduzir princípios institucionais em critérios verificáveis para novas funcionalidades, alterações de linguagem, acessibilidade, dados e interface. O gate não substitui QA, segurança nem pesquisa com usuários. A criança também é sujeito da experiência: suas expressões e formas de participação devem ser consideradas, sem pressupor interpretação perfeita por adultos.

## Cinco perguntas obrigatórias

| ID | Pergunta | Evidência |
| --- | --- | --- |
| PG-01 | Respeita a singularidade da criança e de quem cuida, sem rotular? | Conteúdo, estados e pesquisa |
| PG-02 | Distingue fatos, hipóteses e conclusões? | Proveniência e testes |
| PG-03 | Oferece acesso por diferentes modalidades? | Teclado, axe-core e testes assistivos humanos |
| PG-04 | Usa e retém apenas os dados necessários? | Inventário, finalidade e revisão de segurança |
| PG-05 | Fortalece autonomia sem produzir culpa ou esforço indevido? | Testes de tarefa e linguagem com cuidadores |

**Resultados possíveis:** ATENDE, PARCIAL, NÃO ATENDE, NÃO AVALIADO. Não confundir ausência de teste com aprovação. Registrar evidência, responsável, ambiente, risco residual e decisão.

## Autoridade, responsabilidades e bloqueios

- **Responsável pela proposta (owner):** descreve finalidade, dados usados, pessoas afetadas e preenche PG-01 a PG-05 com evidências reproduzíveis.
- **Revisor de produto/UX:** examina linguagem, participação da criança, autonomia, compreensão e pesquisas com cuidadores; distingue avaliação heurística de teste humano.
- **Revisor técnico:** verifica autorização, minimização de dados, segurança, acessibilidade implementada, testes e riscos de regressão.
- **Aprovador institucional:** decide conflitos éticos e aceita apenas riscos residuais não críticos, com justificativa e prazo para reavaliação. Em equipe pequena, uma pessoa pode exercer vários papéis, mas isso deve ser declarado; quando viável, exigir revisão independente para decisões sensíveis.
- **Quem pode bloquear:** qualquer revisor registra bloqueio fundamentado; o responsável pela integração não deve fazer merge enquanto houver P0/P1 não resolvido ou requisito obrigatório sem evidência.

**Regras de decisão:**

1. **APPROVED:** cinco perguntas avaliadas, evidências exigidas satisfatórias, sem P0/P1 abertos, CI aplicável aprovado e responsáveis identificados.
2. **CONDITIONAL:** evidência parcial ou atividade manual pendente; permite continuar a pesquisa ou a implementação isolada, mas não autoriza alegação pública de conformidade nem integração de mudança que dependa daquela evidência para ser segura.
3. **BLOCKED:** risco crítico, autorização indevida, exposição de dados, rotulação danosa, inacessibilidade de fluxo essencial ou P0/P1 sem solução.
4. **NOT_EVALUATED:** revisão não iniciada; jamais tratar como aprovação.

**Exceções:** somente para questões não críticas, com justificativa escrita, autoridade que aceita o risco, medida compensatória, responsável, prazo e reavaliação. Não admitir exceção para risco P0/P1 não resolvido de segurança infantil, privacidade ou autorização. A proteção técnica da branch e os controles de CI devem permanecer independentes desta revisão documental.

## Relação com os princípios

| Princípio | Controle |
| --- | --- |
| I. Singularidade | Evitar ranking normativo infantil |
| II. Observar | Separar fato, hipótese e origem |
| III. Vínculos | Revisar linguagem de culpa ou domínio |
| IV. Inclusão | Testar fluxos com TalkBack, NVDA e VoiceOver |
| V. Discernimento | Impedir inferências diagnósticas indevidas |
| VI. Não competição | Indicadores contextualizados |
| VII. Privacidade | Minimização, RBAC, isolamento e retenção |
| VIII. Cuidado do cuidador | Avaliar fricção e sobrecarga |
| IX. Contexto | Associar circunstâncias aos registros |
| X. Revisão | Permitir correções e histórico contextual |
| XI. Evidências | Alegações proporcionais às verificações |
| XII. Futuro aberto | Evitar linguagem determinista |

## Avaliação preliminar do MUNDELO v1.1

| Controle | Estado | Justificativa |
| --- | --- | --- |
| PG-01 | PARCIAL | Avaliação heurística, sem pesquisa com público-alvo |
| PG-02 | ATENDE no escopo automatizado | Proveniência e distinção fato/hipótese testadas |
| PG-03 | PARCIAL | Automação aprovada; leitores de tela nativos NOT_EXECUTED |
| PG-04 | PARCIAL | Controles e cofre experimental testados; SEC-23 físico pendente |
| PG-05 | NÃO AVALIADO com usuários | Heurística não comprova compreensão em uso real |

**Decisão:** CONDITIONAL para alegações abrangentes de acessibilidade e inclusão.

## Retomada do TalkBack: DEVICE-REAL-01

**Dispositivo inicial:** Galaxy Tab S10 Ultra, com Chrome + TalkBack. Registrar modelo, versões reais, orientação e data. Utilizar URL HTTPS acessível com dados exclusivamente sintéticos.

Roteiro mínimo:
1. Ativar TalkBack e percorrer Home por gestos; registrar a ordem e os anúncios.
2. Verificar identificação de logo, títulos, navegação e skip link.
3. Trocar perfil/cuidador e observar anúncios de estado.
4. Navegar até Diário, abrir e fechar um modal, verificar retorno de foco.
5. Registrar observação sintética e testar erros acessíveis.
6. Verificar ações desabilitadas, estados vazios e leitura da proveniência.

Registrar PASS, FAIL, BLOCKED ou NOT_EXECUTED por cenário. Não declarar testes executados antes de realizá-los. O teste no tablet não substitui NVDA/VoiceOver nativos nem o benchmark SEC-23 em Android intermediário.

Roteiro de referência: [UX-REAL-01B assistivo](ux-real-01b-assistive-manual.md).

## Modelo de registro

```md
- Princípio e funcionalidade:
- Problema observado:
- Hipótese:
- Teste, dispositivo e versão:
- Resultado real:
- Evidência:
- Risco residual:
- Responsável:
- Próxima ação:
- Status: ATENDE | PARCIAL | NÃO ATENDE | NÃO AVALIADO
```

## Governança e trilha de auditoria

Não relaxar testes para forçar aprovação; não usar dados infantis reais; falhas críticas devem bloquear integração. Registrar em cada PR o identificador de revisão do Principles Gate, os nomes/funções de quem avaliou, decisões, evidências, data, versão e riscos aceitos. Atualizar `docs/continuidade.md` com problema, testes, resultados e próxima hipótese.

A aprovação deste documento como norma institucional não significa que o MUNDELO inteiro esteja certificado ou que todos os gates estejam concluídos. O teste físico TalkBack, NVDA, VoiceOver e SEC-23 continuam pendentes até evidência real.
