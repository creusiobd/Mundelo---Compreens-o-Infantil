# Correções QA-F01 / QA-F03 / QA-F04 — 21/11/2026

Base examinada: `b6921b3b5100ace9c6bee46c8445b4e00c34dbb8` (main com PR #48 incorporada). Issues: [#43](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/43), [#45](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/45), [#46](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/46). Entrega para revisão; não autoriza dados reais.

## Problemas e correções

| Falha | Comportamento anterior | Correção proposta |
|---|---|---|
| QA-F01 | Detalhe guardava cópia de observação após a lista perder acesso | Guardar somente ID, resolver registro atual na coleção autorizada, revalidar leitura no modal e limpar seleção em mudança de contexto |
| QA-F04 | Relatório mantinha perfil ao negar observações | Guarda de leitura do perfil no contexto; negar apresentação integral e ações copiar/imprimir; registros selecionados passam também pelo avaliador de inclusão |
| QA-F03 | Nome/ID/contagem no JSON público; ID também no AAD Base64 e nome no arquivo | Exportar envelope v2 mínimo; identidade e contagem somente no payload cifrado; AAD público sem identidade; nome do arquivo aleatório |

`canReadProfile` reutiliza a condição demonstrativa vigente de cuidador ACTIVE e vinculado; não cria concessão profissional nem substitui o compartilhamento por finalidade/categoria previsto no contrato futuro. Escopo desta correção é a apresentação demonstrativa afetada, não uma auditoria de todas as telas.

## D04 — representação mínima do cofre para revisão

Alternativas examinadas: apenas remover o nome (insuficiente: ID/AAD permanecem), substituir por hash estável (mantém correlação), reutilizar v1 com campos ausentes (quebra contrato silenciosamente) ou versionar envelope mínimo. Escolha técnica proposta: **v2**, preservando importação v1 e sem criar novas permissões.

| Informação | v2 público | Dentro da cifra |
|---|---|---|
| Formato e versão | Sim, seleção do parser | — |
| Algoritmo, IV, KDF, hash, iterações, salt, AAD | Sim, necessários à autenticação/decifragem | — |
| Ciphertext e tag GCM | Sim | Conteúdo autenticado |
| Identificador/nome da criança, perfil, autores, registros e quantidade | Não | Sim |
| Data da exportação e descrição/origem | Não | Sim |
| Versão da aplicação | Omitida | Não adicionada |

AAD v2 canônico: `MUNDELO_VAULT:2`, sem identificador nem codificação de dado pessoal. A identidade do perfil e o childId de cada observação são verificados depois da autenticação AES-GCM, dentro do payload. Algoritmo/tamanho de chave/hash são fixados pelo schema; IV/salt/iterações permanecem sujeitos aos limites e à autenticação/derivação. Schema v2 estrito recusa extensões não previstas. PBKDF2 padrão continua 600.000; testes de unidade usam o mínimo permitido de 100.000. O limite de arquivo de 5 MB e de observações permanece.

O nome baixado é `mundelo-<UUID aleatório>.mundelo-vault`. Não reutilizar nome, ID, data ou hash estável da criança. O tamanho do ciphertext e os metadados do sistema de arquivos ainda são observáveis: v2 não promete ocultação de tamanho nem anonimato. Não foi adicionado padding.

### Compatibilidade e limites

- Importação aceita v1 e v2. Arquivos v1 continuam contendo seus metadados públicos originais; a atualização não altera cópias existentes nem apaga arquivos externos.
- A aplicação anterior aceita somente v1 e não abre novos arquivos v2. Não existe exportação com downgrade; usar leitor atualizado.
- Antes da senha, nenhum metadado v1 é apresentado como identidade autenticada. A prévia é liberada após cifra verificada e vínculo/status/contexto vigentes conferidos. Alteração de contexto oculta a prévia.
- Fixture `tests/fixtures/vault-v1-synthetic.json` foi gerada pelo código da base antes da alteração, com dados exclusivamente sintéticos e senha pública de teste `Legacy-Synthetic-2026`. Não é segredo nem exemplo para uso real.
- A leitura v1 preserva suas verificações originais de AAD/identidade/contagem. Seu timestamp externo não ganha autenticação retroativa.

## Verificações

- Unidade/domínio/segurança: **102 PASS**, 32 suítes, via `node --import tsx --test tests/*.test.ts`. O comando usa o mesmo runner Node e loader, sem o IPC do CLI tsx, bloqueado neste executor.
- TypeScript, build de produção, scanner de indicadores de credenciais e `git diff --check`: PASS.
- Navegador local: **BLOCKED pelo ambiente**. Chromium do Playwright não pôde ser obtido; Chromium de sistema abortou por `socket() failed: Operation not permitted`. Isso não é resultado de asserção das probes e não comprova correção funcional.
- Sete novos testes de navegador em `tests/e2e/qa-privacy.spec.ts`: perda de acesso sem vínculo/suspenso, retorno autorizado, troca de criança, cópia/print e round-trip/compatibilidade do cofre. **Execução a comprovar em CI.**
- Cinco probes originais de QA-002 entram na suíte normal por `tests/e2e/qa-retention-probes.spec.ts`. O relatório/evidência histórica QA-002 não foi reescrito.

As 16 verificações integrais R01–R16 continuam sujeitas às pré-condições anteriores. Não se substituem por estes 12 testes. Acesso no servidor, concessões persistentes, retenção/backups reais, validação jurídica, acessibilidade humana e Android físico continuam com seus gates próprios. Não houve implantação nem merge nesta entrega.


## Validação final observada — 21/11/2026

[CI 44945589494](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/actions/runs/44945589494) concluído com sucesso no código `1fd517db64c23d049f28b2d84f2d1b1c8f1a7e21`: **102 testes de domínio/segurança, 65 testes de navegador e 17 verificações na etapa dedicada de acessibilidade PASS**. As 17 também pertencem à suíte de navegador; não representam cobertura adicional independente. CTRL-01 e P01–P04 originais passaram, incluindo as três probes afetadas por esta entrega. O bloqueio do navegador local permanece documentado e não impediu esta validação no runner do GitHub.

A primeira execução detectou a atribuição da senha pública sintética como possível credencial; o teste agora usa nome explícito da fixture, sem alterar o scanner. A rodada seguinte revelou três expectativas de teste a ajustar: título do relatório negado e comparação entre innerText/textContent. Foram corrigidas mantendo asserções de acesso e comparação exata do conteúdo autorizado. Nenhum teste foi pulado ou marcado como falha esperada.

[Evidência estruturada](validacao.json). [PR #49](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/49) para revisão; issues permanecem abertas até incorporação. [PR #50](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/pull/50) complementa capacidades, experiência e parecer de prontidão. Os gates e limites acima continuam, mesmo com CI aprovado.
