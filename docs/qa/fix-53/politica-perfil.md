# Política demonstrativa por operação de perfil — #53

Data: 22/11/2026. Base: `04713b6ec5173b080eea4ab93a6548dc66b30954` (PR #56 incorporada). Esta é uma restrição do protótipo sintético; não constitui autoridade de produção.

| Operação | Regra do protótipo |
| --- | --- |
| Apresentar atributos de Meu Mundo / configuração | Cuidador ACTIVE com vínculo à criança selecionada |
| Atualizar núcleo do perfil | LEGAL_GUARDIAN, ACTIVE e vinculado; identidade do perfil imutável; schema válido |
| Adicionar/remover interesses, conforto, sensibilidades, comunicação, conquistas e estratégias globais | Mesma regra de gestão do perfil; os itens não possuem autoria por contribuição |
| Aplicar perfil de cofre | Mesma regra de gestão, inclusive no modo merge; schema/cifra não concedem autoridade |
| Zerar registros na ferramenta de demonstração | LEGAL_GUARDIAN, ACTIVE e vinculado, com contexto vigente |
| Criar/ler observações | Política demonstrativa já existente, independente das operações acima |

A regra de núcleo já exigia responsável legal; a correção aplica status/vínculo e a mesma fronteira aos demais comandos que escrevem esse mesmo objeto global. A permissão de criar observação não autoriza modificar esse perfil. Não se cria poder profissional ou familiar para sobrescrever atributos globais sem origem. Cuidadores não gestores vinculados mantêm leitura demonstrativa e suas operações de observação já existentes.

O papel não torna uma perspectiva mais verdadeira, não valida interpretação e não autoriza correção de contribuição alheia. Como o perfil global não representa contribuições independentes, sua edição fica restrita no protótipo até existir modelo apropriado. Uma futura colaboração profissional exige finalidade, categoria, validade, legitimidade, restrições e permissões por operação; estes controles continuam pendentes.

Cada comando síncrono confere o contexto vigente e rejeita callbacks capturados antes de troca de criança/cuidador ou alteração do estado. A UI também restringe os controles e descarta rascunhos na troca de contexto. Bloquear apresentação não remove dados sintéticos do cliente nem equivale a RLS/segregação de servidor.

Limites de leitura: este recorte cobre Meu Mundo e a configuração, e mantém a guarda existente do relatório. Seletores globais de fixtures e outras telas ainda usam identidade demonstrativa. Não se declara isolamento de produção ou conclusão de PG-06/R01–R16. Reset explícito de fixtures continua sendo ferramenta de demonstração, não concessão de acesso real. Dados infantis reais bloqueados; #29 pausada.
