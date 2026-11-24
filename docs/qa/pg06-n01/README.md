# PG06-N01 — identidade nas superfícies restantes

Issue [#65](https://github.com/creusiobd/Mundelo---Compreens-o-Infantil/issues/65). Responsável: Creusio Kizua. Base: `e8bc3495422f5470f8f20c7d0ce58b948aeaa4a9`. Execução iniciada em 23/11/2026.

## Mudanças

- Header: identidade de cada opção avaliada por canReadChildProfile; opções restritas mostram rótulos neutros. Sem leitura, menu não apresenta identidade/contagem nem simulação de estado vazio; gestão de perfil indisponível.
- Journal: título e aviso neutros sem leitura; estado restrito distinto de filtro vazio ou acervo vazio. Filtros ocultos sem leitura e busca/seleções locais limpas na troca de contexto, impedindo que texto digitado num perfil permaneça no seguinte.
- Discoveries/Welcome: catálogo e navegação gerais preservados, sem nome no título/ação sem leitura.
- Understand: sem leitura não apresenta identidade, distribuição nem zero presumido; leitura autorizada conserva as contagens anteriores.
- Privacy: resumos/contagens condicionados à leitura; limpeza respeita disponibilidade de gestão já existente.
- VaultExportModal: resumo/número de registros condicionados à leitura vigente; negativa e sucesso sem nome da criança. Formato criptográfico, guardas de preparação/liberação e política de autorização preservados.
- AppContext: mensagens de troca não revelam nome/idade de destino restrito ou vínculo suspenso. Alteração restrita à escolha da mensagem; não muda concessões ou operações.
- App: formulários de observação fechados/descartados na troca de contexto; identidade recebida por modal condicionada à leitura, abertura condicionada à capacidade vigente.

## Critérios e cenários novos

Oito testes em [profile-identity-surfaces.spec.ts](../../../tests/e2e/profile-identity-surfaces.spec.ts) usam AppProvider e controles reais, sem mock de autorização:

1. Sem vínculo: nomes/idades ausentes nas opções DOM, menus, Welcome, Journal, Discoveries, Understand, Privacy e impressão desses estados; não apresentar falso vazio.
2. Suspenso: mesmo recorte, inclusive menu mobile.
3. Exportador aberto perde resumo/contagem para cuidador sem vínculo e recupera dados no retorno legítimo.
4. Mesmo cenário com cuidador suspenso.
5. Leitura de cada opção, educador em perfil sem vínculo e retorno ao perfil legível com cinco observações e criação habilitada.
6. Suspenso troca entre perfis sem revelar identidade nas notificações; retorno autorizado preservado.
7. Formulário aberto e rascunho descartados ao trocar cuidador/perfil; busca do Diário ocultada e limpa na troca.
8. Axe nos estados restritos de Journal/Understand/Privacy e exportador, desktop/mobile, incluindo retorno imediato a cuidador autorizado.

O CTA do Header conserva animação de escala, sem interpolar cores ao mudar de bloqueado para habilitado: evita contraste intermediário insuficiente no instante em que o botão já é operável.

Ajustes históricos são específicos: toast da DEVICE-REAL-02 não exige mais nome vedado; restrição em Understand exige indisponibilidade e ausência das regiões, mantendo a prova do retorno às cinco observações. Descritores de navegação aceitam título neutro e autorizado; asserções de conteúdo autorizado permanecem.

## Validação e limites

- TypeScript local: PASS.
- Build local da primeira revisão (9092d46): PASS; revisão posterior do Diário validada pela CI do commit publicado.
- Domínio/segurança local: 150 PASS, 0 FAIL.
- Tentativas locais de navegador: bloqueadas na inicialização do servidor, antes das asserções, inclusive fallback estático; não são execução funcional aprovada.
- CI 45316980421 (2f571e8): os oito novos casos passaram; total 108 PASS e dois FAIL. Uma expectativa histórica de anúncio ainda exigia nome restrito; outro caso capturou contraste intermediário do CTA em transição. Expectativa corrigida com ausência de nome explícita; transição de cores removida no produto, sem desabilitar regra axe ou relaxar teste.
- A revisão posterior é conferida pela CI da PR; resultado identificado por commit na issue/PR.
- Não foi executado controle negativo de navegador contra a versão antiga; não atribuir tal evidência.
- Helper src/security/authorization.ts e formatos/cifra não alterados.

Este recorte não implementa o modelo de perspectivas/versões da #60 nem resolve a terminologia geral de autoria. Não reabre #53/#54/#59/#61, mas completa superfícies adicionais do inventário #59. Não elimina dados de perfil da memória/JavaScript, IDs ou enumeração do catálogo sintético; o seletor conserva opções neutras para testar troca de contexto. Não demonstra autorização de servidor, invisibilidade da existência de perfis em produção ou cobertura integral de todos os diálogos/cópias.

PR #17 v0.4 permanece uma proposta documental separada, ainda não incorporada. Fontes INF, #27, #35 e investigação humana TalkBack mantêm dependências; #29 segue pausada. Dados reais, PG-06 integral e R01–R16 não são aprovados por esta correção.
