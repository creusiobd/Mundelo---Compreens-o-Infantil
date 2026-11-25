# PG06-N13 | Interface de revisão humana sintética

**Ambiente exclusivo:** modo desenvolvimento, rota `/review-lab` ou `#/review-lab`; entrada pela tela de Privacidade somente em DEV. O módulo é carregado via importação lazy protegida por `import.meta.env.DEV` e não integra o fluxo de homologação/produção.

## Experiência

A página mostra três perspectivas sintéticas separadas, cada uma com a própria autoria, proveniência e declaração. Apresenta o estado de bloqueio em linguagem clara, a revisão demonstrativa e o aviso permanente de que READ/SHARE/EXPORT reais não estão disponíveis.

A ficha permite três decisões independentes:

- **Aprovar avaliação sintética**: marca a revisão visual como simulada; não libera acesso nem sincroniza com Supabase.
- **Solicitar complementação**: exige a descrição do complemento e mantém a síntese bloqueada.
- **Manter bloqueado**: documenta a justificativa e mantém o bloqueio.

Cada decisão exige justificativa (20–500 caracteres) e confirmação de que as três perspectivas atribuídas foram examinadas. Histórico em memória guarda revisor fictício, escolha, justificativa, referências às perspectivas e número da revisão, sem reescrever a contribuição dos autores. Botão de mudança sintética reativa o bloqueio até depois de aprovação ilustrativa.

## Contrato e garantias

`src/domain/reviewLabDemo.ts` é um redutor puro apenas demonstrativo: valida referências às perspectivas, justificativas, complementações, revisão sequencial e impede reutilização do mesmo identificador de decisão. **Este redutor não é controle de autorização** e não verifica identidades reais, assinatura, competência jurídica, concessões vigentes, estados hospedados ou a evidência PG06-N12.

É intencionalmente impossível usar a tela para submeter uma decisão à RPC `pg06_n12_decide` sem implementação adicional e revisão de segurança. Neste incremento não há requisições ao banco, `localStorage`, exportações ou armazenamento de decisões. A UI mantém sempre o texto que esclarece a indisponibilidade das operações reais.

A aprovação real exigirá, em uma fase posterior, um adaptador autenticado que reconfira autorização, versões de fonte, idempotência, revisão transacional, validade da prova externa e situação dos gates de segurança na **fronteira do efeito**. Nunca aceitar o estado React como suficiente.

## Critérios de teste

- Unitários: as três decisões, autoria, conservação das perspectivas, justificativas e complementos obrigatórios, versão obsoleta, reuso de ID, novo bloqueio após aprovação.
- Browser em DEV: três cartões de perspectivas, proveniência, visualização bloqueada, escolha das três decisões, histórico, reset ao recarregar, rebloqueio, campo acessível e responsividade a 390px.
- Browser em produção: a rota `/review-lab` não apresenta o laboratório.

## Bloqueios preservados

#27 (autoridade jurídica), #29 (backup, retenção e restauração hospedados) e #35 (prontidão). Não há decisão sobre dados reais, exportação de informações infantis ou atualização do projeto hospedado.
