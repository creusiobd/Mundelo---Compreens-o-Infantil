# ONB-002 — Matriz de verificação v1.0

Todos os cenários abaixo: **NOT_EXECUTED**. Especificação documental, não relatório de testes. Usar somente laboratório isolado e sujeitos sintéticos. Cxx refere-se a ONB-Cxx em [critérios ONB-001](criterios-v1.md). Contrato: [identidade](contrato-identidade-v1.md).

| ID | Dado | Quando | Então | Rastreio |
|---|---|---|---|---|
| ID01 | anon ou usuário anônimo Auth | GET/POST perfil | nenhum dado/efeito | C02,C11,C23 |
| ID02 | conta não confirmada | bootstrap direto | nega, zero espaços | C02,C11 |
| ID03 | callback expirado/replay/verifier ausente | troca PKCE | nega; URL limpa | C04 |
| ID04 | A e B confirmados | A lê/insere/atualiza/exclui objetos B via REST/RPC/SQL | zero dados/efeitos B | C11 |
| ID05 | A altera owner/role/user_metadata | requisição adulterada | nega escalada | C12 |
| ID06 | preferência profissional | bootstrap e busca de família | somente conta própria; zero membership | C13 |
| ID07 | FAMILY explícito | dois bootstraps simultâneos | um espaço e vínculo; mesmo ID | C10 |
| ID08 | falha após criar espaço | bootstrap com fault injection | rollback integral | C10 |
| ID09 | aceite antigo ou digest errado | record/bootstrap | nega versão; sem espaço | C03,C17 |
| ID10 | aceite opcional recusado | bootstrap apto | sucesso sem preferência | C17 |
| ID11 | token expirado | leitura/escrita | nega; UI limpa | C08 |
| ID12 | JWT ainda válido, sessão revogada | REST/RPC/SQL | nega efeitos novos | C08,C22 |
| ID13 | membership revogada durante escrita | interleaving com barreiras | linearização demonstrada; após revogação nenhum efeito | C22 |
| ID14 | logout A e login B | resposta A atrasada | nenhum dado A em B | C09 |
| ID15 | recuperação válida, inválida e replay | reset e acesso privado | só reset autorizado; novo login; sessões antigas negadas | C07 |
| ID16 | e-mail existente/inexistente | signup/recovery/login inválido | comparar corpo/status/distribuição temporal e limites; não assumir equivalência | C05,C06 |
| ID17 | tentativas excessivas sintéticas | login/reenvio | limites e recuperação; sem saturar terceiros | C16 |
| ID18 | redirect arbitrário e callback cruzado | deep link | nega destino; sem segredo | C04,C15 |
| ID19 | rede falha durante logout | outra aba e API | bloqueio local; sem promessa remota; testar revogação | C24 |
| ID20 | inspeção de bundle/log/tráfego | busca de segredos e PII sintética | sem chave privilegiada ou credenciais em evidências | C18 |
| ID21 | conta apta | rota infantil/convite/demo import | nega; sem tabelas reais | C14,C21 |
| ID22 | pedido de exclusão repetido | reauth recente e protocolo | um pedido próprio; não declarar backup apagado | C20 |
| ID23 | versão necessária muda entre check/commit | bootstrap concorrente | reavalia ou nega | C17 |
| ID24 | falha de rede durante verificação | acesso privado | fail closed; sem cache anterior | C23 |
| ID25 | sessão de recuperação | CRUD perfil e espaço | nega mesmo com JWT válido | C07,C11 |
| ID26 | sessão A usada com subject B | adulteração de identificadores | nega associação | C12,C23 |
| ID27 | restauração sintética | sessão anteriormente revogada | nega; não reativa privilégios | C20,C22 |
| ID28 | visitante e teclado | entrada, erros, retorno, reflow | foco e mensagens acessíveis; sem coleta infantil | C01,C03,C19 |

## Protocolo
Registrar SHA, versões SDK/CLI/DB, configuração sem segredos, identidade sintética, pre/post estado, código/status e resultado. Para concorrência usar barreiras determinísticas, comprovar ordem e repetir. Para isolamento testar A/B/anon/não confirmado e usuário anônimo autenticado, operações diretas e funções; comparar efeitos persistidos por caminho administrativo de teste isolado. Para enumeração comparar amostras e distribuição, sem declarar ausência absoluta. Para acessibilidade separar axe de leitura assistiva humana. #86 executa UI sintética; #87 executa integração e #88 homologa. Se faltar capacidade, BLOCKED, não PASS.

## Cobertura documental #85
1. Estados e recuperação: contrato §2/4/7, ID02/03/11/15/19/25.
2. Identidade, vínculo, autoridade: §1/3/5, ID04–08/26.
3. Papéis e ausência de acesso infantil: §1/5/6, ID06/21.
4. Enumeração, abuso, logs, segredos, CSRF/PKCE: §4/7, ID03/16–20.
5. RLS/fronteira de efeito: §5/6, ID01/04/08/12/13/23/24/27.

Nenhum teste funcional executado nesta PR. Parâmetros e mecanismo de revogação são propostas sujeitas a revisão. #27/#29/#35 preservados. Não sincronizar estado nativo por suposição.
