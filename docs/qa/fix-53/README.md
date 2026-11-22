# #53 — Leitura e gestão de perfil no ponto do efeito

Data: 22/11/2026. Base: `04713b6ec5173b080eea4ab93a6548dc66b30954` (PR #56 incorporada, #52 encerrada por integração).

## Problema e correção

Meu Mundo apresentava atributos a cuidadores sem leitura; os comandos de listas não revalidavam vínculo/status, e o núcleo do perfil verificava apenas papel. Criar observação era usado como permissão de editar o perfil global sem autoria por contribuição.

A [política por operação](politica-perfil.md) separa leitura, gestão global, importação de perfil e observações. Gestão global exige responsável legal ACTIVE e vinculado no protótipo; os demais cuidadores ativos vinculados mantêm leitura demonstrativa e a política independente de observações. Isso não dá maior validade à perspectiva do responsável e não autoriza sobrescrever contribuição alheia.

- Meu Mundo e configuração deixam de apresentar atributos/entradas sem acesso; o relatório mantém a guarda anterior.
- Treze mutadores diretos compartilham avaliação central de contexto atual, status/vínculo/papel, identidade imutável e validação de perfil.
- Aplicar perfil por cofre, inclusive merge, e zerar a amostra demonstrativa também verificam gestão/contexto. Nenhum desvio via comando capturado contorna os controles de UI.
- Callbacks capturados são invalidados por troca de criança/cuidador ou avanço do estado, mesmo após retornar ao contexto anterior. Escrita válida invalida preparações antigas de exportação conforme o gerenciador existente.
- Rascunhos de Meu Mundo/configuração são descartados na mudança de contexto. Comando recusado não exibe sucesso de gravação; núcleo inválido não é aplicado.

## Compatibilidade e limites

A regra de papel já existente para o núcleo agora cobre todos os atributos desse objeto global e status/vínculo. A UI de familiares não gestores/educadores/profissionais vinculados passa a leitura; não se concede escrita em perfil global apenas por poder criar observações. Importação de cofre aplica perfil, portanto também exige gestão, mesmo em merge. Cuidadores gestores ativos vinculados mantêm seus caminhos, sujeitos a identidade/schema/contexto válidos.

Não há revisão de autoria de interpretação, histórico de contribuições, concessões profissionais por finalidade ou autorização de servidor. Contexto/seletores de fixtures continuam disponíveis no cliente de demonstração; este trabalho não remove dados da memória do navegador nem certifica isolamento de produção. Outros usos de identidade demonstrativa não foram declarados seguros por esta correção. #54, PG-06 integral, R01–R16 e dados infantis reais conservam seus gates. Supabase/#29 permanece pausado.

## Verificação

TypeScript/build e 142 testes de domínio/segurança PASS local (27 novos casos de política, incluindo papel/status/vínculo ausentes). O aviso de bundle grande é preexistente.

Oito cenários E2E novos incluem leitura negada/impressão/retorno; leitura sem gestão versus criação de observações; descarte de rascunhos; chamadas diretas de todos os mutadores, importação e limpeza; callbacks capturados e troca/retorno; caminhos autorizados e isolamento do outro perfil; configuração restrita e ausência do cenário de teste no build; axe-core desktop/mobile.

As chamadas diretas usam um entry de teste Vite separado, em tests/harness/profile-context. O entry monta o AppProvider real, executa seus comandos reais e confere estado após flushSync, sem substituir o avaliador. Somente fixtures sintéticas de guardiões sem vínculo/ACTIVE/SUSPENDED/INVITED são preparadas antes da montagem. Nenhuma rota/hook de testes foi adicionada à aplicação de produção; a suíte verifica que o entry de desenvolvimento não é servido pelo preview do build. O teste de UI principal continua usando o build de produção na porta 4173; o cenário de comandos usa Vite dev em loopback 4174.

A execução do navegador é feita no CI, devido à restrição de socket do executor local já observada. Resultado final por commit é registrado na PR e issue #53 antes da entrega; não afirmar testes dinâmicos concluídos a partir apenas deste documento. Não houve controle negativo dinâmico desta correção nesta etapa.
