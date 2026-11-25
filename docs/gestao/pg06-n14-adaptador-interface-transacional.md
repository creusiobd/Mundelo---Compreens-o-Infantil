# PG06-N14 | Integração da experiência de revisão humana ao checkpoint transacional

**Escopo estrito:** servidor Supabase local descartável, identidades e textos sintéticos, sem acesso a projeto hospedado. O sistema continua **NO-GO** para dados de crianças reais.

## Arquitetura da fatia

1. O navegador de testes injeta somente um `anonKey` local e um JWT real da conta **sintética** `guardian` no escopo de desenvolvimento, apenas em memória. A tela `/review-lab` de produção permanece indisponível. Não há `service_role` no browser.
2. `localReviewTransactionAdapter.ts` rejeita qualquer destino que não seja `http://127.0.0.1:porta` ou `http://localhost:porta`, e qualquer criança/derivado diferente das fixtures canônicas, sem fallback para host remoto.
3. A RPC `pg06_n14_review_state` faz a validação de `auth.uid()`, autoridade do revisor para criança × derivado × finalidade e consulta, sob o **mesmo advisory lock por criança**, a revisão do banco, as versões ancestrais, a geração do bloqueio, a evidência vigente, as perspectivas com autoria e o histórico. A função não expõe nenhuma tabela privada diretamente.
4. A tela mostra as perspectivas independentes recebidas do servidor, justificativa, complementação, histórico e estado real retornado. Antes de enviar a decisão, associa o pedido à exata revisão e evidência exibidas.
5. A RPC `pg06_n12_decide` decide transacionalmente com JWT, revisão CAS e comprovação da fonte. O novo gatilho `pg06_n14_all_perspectives` exige que **todas** as perspectivas pertencentes à síntese estejam presentes, impedindo ocultar uma contribuição divergente.
6. Após a resposta, o adaptador requisita **nova fotografia autorizada** ao banco. A interface não altera o estado para aprovado por conta própria, não confia no corpo do clique e bloqueia visualmente o estado anterior enquanto uma operação aguarda confirmação.
7. Correções posteriores invalidam o checkpoint via PG06-N10/N11. O revisor precisa carregar novamente o status atual. Uma evidência vinculada à geração antiga não autoriza aprovação.

## Segurança e limites

- Apenas `anon` + JWT autenticado fictício, sem segredo de projeto, `localStorage`, exportação, storage remoto ou privilégio autodeclarado.
- Funções de leitura e decisão são `SECURITY DEFINER` *apenas no laboratório*, com validações internas e `EXECUTE` negado para `anon`/público. Antes de produção, o padrão deve ser reavaliado em favor de limites de API/schema dedicado e auditoria de privilégios.
- A interface só lê perspectivas quando a revisão autoriza explicitamente **aquele revisor**. Sem autorização, o estado continua indisponível e os textos não são renderizados.
- READ/SHARE/EXPORT continuam sob o gate próprio N10 e os grants persistentes. Uma decisão de revisão não é uma concessão de acesso nem decisão de retenção.
- Falha da rede, resposta inválida ou 403/409 não cria aprovação otimista. Se a resposta de decisão for perdida após o commit, a tela exige nova fotografia do servidor.
- A revalidação de uma interpretação não torna a experiência subjetiva da criança conhecida, nem apaga, uniformiza ou reatribui as vozes de observadores distintos.
- O estado inicial continua bloqueado até a carga autenticada. A injeção da sessão é exclusiva da CI de desenvolvimento, sem login público nem cadastro infantil.

## Testes

- Unitários: URL local, fixture única, credencial JWT enviada apenas ao host local, refetch após commit, recusa de revisão stale e erro de rede/resposta malformada sem atualização otimista.
- Playwright conectado: exibição de perspectivas autorizadas, REQUEST_COMPLEMENT, APPROVE, histórico confirmado e persistente após reload, correção da fonte já aprovada, bloqueio novamente e rejeição de revisor sem autoridade.
- SQL: a revisão exige todas as perspectivas; dados mantêm RLS forçado, schema não exposto e nenhuma mudança hospedada.
- CI separada inicia Supabase local, semeia contas fictícias e executa o teste ponta a ponta real de navegador contra PostgREST autenticado.

## Bloqueios

Sem autorização para dados infantis reais. Pendem #27 (jurídico), #29 (retenção/backup hospedados) e #35 (prontidão), além de validação de autoridades e assinaturas humanas verdadeiras, editor de versões e release/segurança de infraestrutura. Não executar `supabase link`, `db push` ou migrations no projeto remoto.
