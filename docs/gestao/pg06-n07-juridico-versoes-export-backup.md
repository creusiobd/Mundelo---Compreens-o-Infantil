# PG06-N07 | Revisão jurídica, linhagem, exportação, retenção e recuperação

**Estado:** fundamentos e controles estruturados; **NÃO é parecer jurídico**, validação de competência, autorização operacional, homologação Supabase hospedada ou liberação de dados reais.

## 1. Parecer de autoridade jurídica de concessão: PENDENTE (#27)

A leitura de fontes oficiais não substitui apreciação jurídica aplicável ao caso concreto. A LGPD (Lei 13.709/2018, especialmente arts. 7º, 11, 14 e 18) e o Enunciado CD/ANPD nº 1/2023 indicam que crianças/adolescentes não dependem necessariamente de base única, mas exigem prevalência do melhor interesse, com avaliação concreta da finalidade, natureza do dado e contexto. Também devem ser verificados território aplicável (Brasil/Angola/outros), poder de representação, dados de saúde e comunicação a profissionais.

Fontes oficiais conferidas para instrução, **sem validar o caso**:
- https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm
- https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-de-criancas-e-adolescentes
- https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_legitimo_interesse.pdf/@@download/file

### Matriz obrigatória por ato, não por título familiar

| Ator / cenário | Evidência necessária | Decisão atual |
|---|---|---|
| Responsável legal solicita compartilhar perspectiva | identidade, representação vigente para esta criança, categoria, finalidade, destinatário, alcance histórico, melhor interesse, restrições, eventual oposição do outro responsável e base aplicável | **PENDENTE** |
| Segundo responsável com interpretação distinta | verificar autoridade independente; divergência não implica veto nem consentimento automático sem exame | **PENDENTE** |
| Profissional acompanha criança | identidade, competência, vínculo/legitimidade no ato, finalidade, sigilo e condições de compartilhamento; credencial não equivale a poder de conceder | **PENDENTE** |
| Compartilhamento de dado sensível/saúde | base adequada do art. 11, transparência, melhor interesse, finalidade e minimização concretos, além da representação pertinente | **PENDENTE** |
| Exportação a terceiro ou sistema externo | destinatário, controle sobre cópias, operações EXPORT distintas de READ, base/finalidade e política de armazenamento | **PENDENTE** |
| Criança cresce e exerce autonomia | protocolos de participação apropriados à capacidade e revisão da narrativa, sem cristalizar interpretações adultas | **PENDENTE** |

**Não adotar** por padrão “um dos pais sempre basta”, “exigir ambos sempre” ou “o profissional prevalece”; cada situação exige regime jurídico e avaliação específicos. O cargo de responsável, titular da conta ou profissional não é fonte autossuficiente de autoridade.

### Ficha de decisão que falta preencher em caso real

`act_id`, `child_id`, identidade verificada e origem da verificação, vínculo/representação validado, categoria C01–C10, operação, versão/histórico, destinatário, finalidade, hipótese jurídica **aprovada**, análise do melhor interesse, oposição/conflito, revisão de competência, limites/vigência, fonte normativa, revisor competente e data, política vigente, decisão, revisão exigida, evidência minimizada, condições de revogação e destino.

O contrato `canAuthorizeGrant` bloqueia na falta de qualquer um dos pontos necessários, mas recebe sinalizações de avaliação já realizada e **não verifica juridicamente os documentos por si**. Nenhum `true` sintético desse teste comprova a autoridade real.

## 2. Versões, derivações e narrativas

- Uma revisão cria unidade imutável com `priorVersion` exata e autor/editor explícito; concorrência desatualizada conflita.
- Registrar, observar, relatar, interpretar e experienciar são dimensões distintas; interpretação adulta não se torna identidade, diagnóstico ou experiência subjetiva da criança.
- Contestar produz contribuição própria, sem reescrever o outro; fontes/versões legítimas são representadas como referência exata.
- Derivado C04 exige todas as origens necessárias acessíveis, mesma criança, integridade de referência, atribuição de curador/intérprete e ausência de referência circular imediata ou duplicidade. O novo contrato puro `resolveDependencyClosure` percorre também ancestrais indiretos, bloqueia ciclos, chaves duplicadas e fontes ausentes, restritas ou destinadas. A implementação **persistente e transacional** desse fechamento, inclusive reavaliação em lote após mudança de política, continua pendente para o grafo de produção.
- Propagação após mudança de fonte, autorização ou restrição deve reavaliar separadamente validade, apresentação, utilização e retenção; não se confunde `retained` com autorização de leitura.
- Histórico tem destino próprio C02; append-only técnico não autoriza preservação perpétua.

## 3. Exportações seletivas

**O seletor sintético não cria arquivo nem habilita endpoint.** A operação EXPORT exige concessão própria por unidade/categoria/fonte/versão/finalidade/destinatário e estado vigente. Para um derivado, a prova sintética agora exige concessão EXPORT também para cada ancestral transitivo, sem acrescentar esses ancestrais automaticamente ao conteúdo retornado. Esta é uma política conservadora de laboratório, **não uma decisão jurídica de compartilhamento definitivo**. Não existe exportação parcial silenciosa se uma origem requisitada não puder ser disponibilizada. Revogação ou restrição conhecida impede nova preparação. Antes de exportar realmente, será necessário:

1. validar por conta autenticada, escopo, autorizações e concessões na **fronteira do efeito** (não por estado React);
2. gerar pacote com proveniência mínima permitida, versão exata, finalidade e destinatário;
3. fechar vazamentos em cabeçalhos, nomes de arquivo, contagens, metadados e mensagens de erro;
4. ter TTL, descarte de arquivo temporário, evidência minimizada, restrições de compartilhamento externo e testes de corrida REVOKE x EXPORT;
5. distinguir bytes já entregues legitimamente de novos acessos, sem declarar recolhimento retroativo.

## 4. Retenção, backup, restauração: evidência e limites (#29)

Reutilizar categorias já aprovadas **como proposta documental** C01–C10, sem inventar prazo, renovação tácita ou fundamento jurídico. A existência de versão ou backup não justifica conservar conteúdo destinado.

O workflow `pg06-n07-recovery.yml` cria bases PostgreSQL locais fictícias, produz um backup `pg_dump`, elimina uma contribuição **após** o snapshot, restaura em ambiente isolado e mostra que o snapshot reintroduz bytes eliminados. Depois aplica um registro externo de destinação e verifica que a contribuição não reaparece e outra permanece, removendo o arquivo temporário. **Essas etapas são smoke test local, não auditoria do provedor**.

Conforme o inventário registrado em #29 (24/11/2026), o projeto Supabase hospedado de desenvolvimento, plano Nano, não apresentou backups gerenciados/PITR/log drains disponíveis. P1 foi parcial; P2–P5 continuavam sem execução comprovada. A configuração atual não foi reexaminada nesta PR. A documentação oficial do fornecedor sobre backups e PITR deve ser lida para distinguir disponibilidade de plano de capacidade efetivamente habilitada: https://supabase.com/docs/guides/platform/backups .

### Aceite real de TEC-002 ainda exige

- inventário de bases, Storage, logs, funções, filas, caches, réplicas e cópias fora do banco;
- RPO/RTO definidos e medidos no **ambiente hospedado de teste**, orçamento/capacidade e responsabilidades;
- executar P2–P5 com marcadores sintéticos, backup/restore e evidência de isolamento;
- testar retenção/expurgo em todas as camadas, inclusive tombstones que sobrevivam ao período de restauração, sem reviver dados eliminados;
- observar plano, região, backups, restauração, retenção e destinação efetiva; não presumir que o simples backup do PostgreSQL cobre Storage e objetos externos;
- submeter incidentes, exceções e medidas irreversíveis ao GOV-002/GOV-003 e revisão V2 quando aplicável.

## 5. Homologação hospedada: roteiro, sem execução

O Supabase hospedado existente NÃO foi modificado. O roteiro exige ambiente isolado ou projeto exclusivo de desenvolvimento, quatro ou mais contas apenas sintéticas, JWTs reais verificados, RLS para READ/WRITE/GRANT/REVOKE, comparação de versão, revogação durante transação, metadados e derivados, verificações de exclusão/retenção e rollback. Nunca ligar dados infantis reais nem reaproveitar o SQL experimental sem revisão de permissões. Não expor `service_role` a clientes nem publicar uma rota pública para as tabelas.

### Decisão de prontidão

| Gate | Resultado |
|---|---|
| Domínio e testes sintéticos de linhagem/exportação, incluindo ancestrais transitivos | sujeito à CI da PR |
| Backup/restore em Postgres descartável | sujeito à CI da PR |
| Fundamento e competência jurídica real #27 | **BLOQUEADO** |
| Backup/retenção/restauração comprovados no fornecedor #29 | **BLOQUEADO** |
| Homologação JWT/RLS no Supabase hospedado | **NÃO EXECUTADA** |
| Revisão independente e decisão de release #35 | **BLOQUEADO** |
| Cadastro e dados infantis reais | **NO-GO** |

O MUNDELO deve permitir muitos olhares sem transformar qualquer um deles na identidade definitiva da criança. Nenhuma concessão, restauração ou interpretação pode retirar essa autonomia.
