# #54 — Atribuição consistente sem autoria presumida

Data: 23/11/2026. Base: `a6144039f08fbd6f3a563ab0fef02ec57b5f8f5f`, após PR #57 incorporada/#53 concluída por integração.

## Problema e resultado

Toda nota do relatório era rotulada “Hipótese Familiar”; o detalhe atribuía a hipótese ao observador. Registrador, observador e fonte textual eram apresentados de forma incompleta ou fundida. O modelo não representa autoria própria de interpretação ou alteração.

A apresentação agora usa um componente/função compartilhados entre detalhe, prévia e documento textual, preservando as mesmas dimensões e lacunas também na impressão. Autoria de interpretação/alteração não é inferida. A fonte textual é explicitamente não verificada; proveniência é declarada. Datas e revisão permanecem valores informados, sem prova de autoridade ou histórico. O texto reflexivo original é preservado como texto, sem impor autoria familiar/profissional ou traduzir experiência subjetiva da criança.

Preferências, conforto, sensibilidades e comunicação globais sem fonte individual foram excluídos do relatório/cópia/impressão, com aviso de escopo. As contribuições selecionadas continuam separadas com seu contexto e texto, sem agregação de consenso. Identificação do perfil permanece sintética. Os dados originais do perfil não foram alterados; cofre e leitura de Meu Mundo conservam seus controles.

A [decisão de domínio pendente](decisao-dominio-pendente.md) explicita o contrato necessário para autores/versões futuros. Esta entrega não introduz schema, inventa autores em legados ou transforma contador de revisão em poder de sobrescrita. Dados reais/PG-06 integral/R01–R16 mantêm gates; #29 pausada.

## Verificação

- 150 testes de domínio/segurança PASS local, incluindo oito novos: dimensões independentes; três papéis sem inferência de autoria; desconhecidos; exclusão de atributos sem fonte; divergência/contexto/ordem; preservação de lacunas/textos.
- TypeScript/build PASS local, com aviso preexistente de bundle grande.
- Cinco E2E novos para CI: duas contribuições (educadora/profissional) com equivalência detalhe/prévia/cópia/impressão; relatos divergentes e exclusão de atributos sem fonte; observador/fonte desconhecidos e revisão alta; axe-core desktop/mobile. Fixtures são inseridas pelo fluxo real de cofre, sob controles vigentes, sem mock de autorização.
- QA-F04 foi adaptado para conferir um relato autorizado e identificação do perfil, porque o atributo global antes usado como marcador foi excluído desta síntese por decisão de escopo. A perda de acesso continua retirando documento/botões e impede nova cópia/impressão; não se afrouxam as guardas da PR #49.

Resultado efetivo do CI por commit será registrado na PR e issue #54 antes da entrega para revisão. Navegador local permanece limitado por restrição de socket; não se alega reprodução/controle negativo dinâmico contra a versão antiga. Nenhum dado infantil real utilizado.
