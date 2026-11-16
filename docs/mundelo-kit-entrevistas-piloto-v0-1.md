# MUNDELO | Kit de execução da descoberta — Ciclo 0

**Responsável:** fundador/entrevistador. **Status:** pronto para uso após revisão de consentimento e privacidade. Nenhuma entrevista concluída.  
**Objetivo imediato:** executar duas entrevistas-piloto com cuidadores adultos, usando o [protocolo completo](mundelo-pesquisa-cuidadores-protocolo-v0-1.md). Não são testes clínicos ou com crianças.

## Preparação da rodada

1. Usar o formulário/roteiro do protocolo, sem apresentar a demo antes da descoberta espontânea.
2. Convidar **dois adultos** de perfis distintos, deixando claro que a participação é voluntária.
3. Não pedir nomes, escolas, diagnósticos, datas de nascimento, registros, fotografias ou descrições identificáveis de crianças.
4. Não gravar áudio/vídeo por padrão. Guardar notas individuais em local de acesso restrito fora do repositório.
5. Para cada participante, gerar identificador fictício `R001`, `R002`, sem tabela de identificação no GitHub.
6. Entrevista de 20–30 minutos; respeitar a possibilidade de pular perguntas e desistir.

## Convite curto pronto para adaptar

> Estou construindo o MUNDELO, um projeto que investiga maneiras de melhorar a compreensão do cotidiano infantil e o diálogo entre cuidadores. Antes de apresentar qualquer solução, quero ouvir como pessoas adultas lembram acontecimentos e compartilham informações sobre os cuidados. Você teria disponibilidade para uma conversa voluntária de 20–30 minutos? Não preciso de dados, nomes ou histórias identificáveis de crianças; também não farei avaliação clínica. A participação pode ser interrompida a qualquer momento.

## Abertura verbal de consentimento

> Obrigado por conversar comigo. Quero compreender experiências dos adultos em situações de cuidado, não avaliar uma criança ou uma família. Vou tomar notas resumidas sem identificação. Você pode recusar qualquer pergunta ou encerrar a conversa. Não gravarei áudio nem vídeo. Peço que não cite nomes, locais, escolas, diagnósticos ou detalhes que identifiquem uma criança. Posso começar?

Registrar `consent_obtained: true/false`. Sem concordância: encerrar e não guardar respostas.

## Guia rápido do entrevistador

**Primeiros 5 minutos**: “Como os adultos que cuidam da criança conversam sobre o dia a dia?” e “Quando precisam recordar algo de semanas atrás, como fazem?”

**Minutos 5–15**: “Conte a última situação em que foi difícil explicar ou lembrar um acontecimento, sem identificar a criança. O que aconteceu? O que você fez? Houve impacto concreto? A situação já havia acontecido antes?”

**Minutos 15–23**: “O que você usa hoje: conversa, mensagens, notas, caderno ou outra estratégia? O que funciona? O que dá trabalho? O que jamais desejaria registrar ou compartilhar?”

**Últimos minutos**: sintetizar o que ouviu e solicitar correção: “Entendi que [resumo]. Isso está certo?” Perguntar se deseja participar de um teste posterior com personagens fictícios.

**Não apresentar como premissas** “você perde informação”, “precisa do MUNDELO”, “precisa reduzir sua ansiedade” ou “deveria registrar o comportamento”.

## Modelo de nota individual (manter fora do GitHub)

```yaml
research_id: R001
date: YYYY-MM-DD
script_version: "discovery-v0.1"
consent_obtained: false
interview_duration_minutes:
relationship_to_founder: "known|unknown|not_recorded"
recent_episode_recounted: "yes|no|unclear"
frequency: "frequent|occasional|rare|unknown"
current_method: []
concrete_problem: ""
consequence_of_problem: ""
privacy_boundary: ""
reason_not_to_use_product: ""
unexpected_findings: ""
contradictory_evidence: ""
follow_up_allowed: false
recorded_audio_or_video: false
```

**Atenção:** mesmo pseudônimos e relatos contextualizados podem reidentificar pessoas. Excluir detalhes identificáveis antes de preencher e definir armazenamento restrito e prazo de eliminação.

## Registro agregado após as duas entrevistas

| Indicador | R001 | R002 |
| --- | --- | --- |
| Consentimento para pesquisa | NOT_EXECUTED | NOT_EXECUTED |
| Episódio concreto relatado espontaneamente | NOT_EXECUTED | NOT_EXECUTED |
| Alternativa atual identificada | NOT_EXECUTED | NOT_EXECUTED |
| Consequência descrita | NOT_EXECUTED | NOT_EXECUTED |
| Limites de privacidade declarados | NOT_EXECUTED | NOT_EXECUTED |
| Interesse em teste sintético futuro | NOT_EXECUTED | NOT_EXECUTED |

**Decisão da fase piloto:** revisar se o roteiro induziu respostas, se perguntas foram compreendidas, se o tempo foi suficiente e se houve riscos de privacidade. Não concluir que o mercado foi validado com duas entrevistas.

## Critério de segurança e qualidade

- Interromper e reorientar se forem mencionados nomes de criança ou relatos médicos identificáveis.
- Não utilizar ChatGPT, GitHub ou ferramentas de transcrição para receber detalhes infantis reais.
- Registrar discordâncias e indícios contra a hipótese, não apenas respostas favoráveis.
- Evitar interpretar relatos de cansaço ou medo como dados clínicos.
- A pesquisa com adultos não autoriza piloto operacional do produto com dados infantis.

## Acompanhamento de continuidade

- **Problema:** a pesquisa preliminar com cuidadores ainda não foi executada.
- **Teste:** duas entrevistas-piloto voluntárias.
- **Resultado:** `NOT_EXECUTED`.
- **Próxima hipótese:** roteiro compreensível, neutro e suficientemente respeitoso para evoluir para estudo qualitativo maior.
