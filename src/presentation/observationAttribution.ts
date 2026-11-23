import type {Caregiver, ChildProfile, Observation} from '../types';

export const INTERPRETATION_TEXT_LABEL = 'Texto reflexivo registrado (não diagnóstico)';
export const ATTRIBUTION_LIMIT = 'Registrador, observador e fonte do relato não identificam, por si, quem interpretou ou alterou o texto. O contador de revisão não comprova autoria, histórico verificado ou autoridade para sobrescrever contribuições. Identificações são demonstrativas; o texto não representa automaticamente a experiência subjetiva da criança.';
export const PROFILE_OMISSION_NOTICE = 'Atributos globais de preferências, conforto, sensibilidades e comunicação não foram incluídos nesta síntese porque não possuem fonte individual identificada. Não representam consenso validado.';

const roleLabels: Record<string,string> = {
  mae:'Mãe',pai:'Pai',avo:'Avó / Avô',cuidador:'Cuidador(a)',educador:'Educador(a)',terapeuta:'Terapeuta',outro:'Outro observador',
};
export const environmentLabels: Record<string,string> = {
  casa:'Casa',parque:'Parque / Ar Livre',escola:'Escola / Creche',transporte_consulta:'Transporte / Consulta',reuniao_familia:'Reunião Familiar',outro:'Outro Ambiente',
};

export function informedText(value: string | undefined): string {
  return typeof value === 'string' && value.trim() ? value : 'Não informado';
}
function identifiedPerson(id: string | undefined, caregivers: Caregiver[]): string {
  const person = id ? caregivers.find(c=>c.id===id) : undefined;
  return person ? `${person.displayName} (${person.relationshipLabel || person.role})` : 'Pessoa não identificada';
}
export function declaredProvenance(obs: Observation): string {
  return obs.provenance === 'DIRECT' ? 'Observação direta' :
    obs.provenance === 'REPORTED_BY_OTHER' ? 'Relatada por outra pessoa' : 'Não informada';
}

/** Presentation only: never infer interpretation/edit authorship from another role. */
export function observationAttribution(obs: Observation, caregivers: Caregiver[]) {
  return [
    {label:'Registrado por',value:identifiedPerson(obs.recordedByCaregiverId,caregivers)},
    {label:'Observador identificado',value:identifiedPerson(obs.observedByCaregiverId,caregivers)},
    {label:'Papel informado do observador',value:roleLabels[obs.observerRole] || 'Não informado'},
    {label:'Fonte do relato (texto não verificado)',value:informedText(obs.reportedByLabel)},
    {label:'Proveniência declarada',value:declaredProvenance(obs)},
    {label:'Autoria da interpretação',value:'Não registrada separadamente'},
    {label:'Autoria da alteração',value:'Não registrada separadamente'},
    {label:'Registro no sistema (data informada)',value:informedText(obs.recordedAt)},
    {label:'Última alteração (data informada)',value:informedText(obs.updatedAt)},
    {label:'Revisão informada',value:Number.isInteger(obs.revision) && obs.revision>0 ? String(obs.revision) : 'Não informada'},
  ];
}

export function buildObservationReport(input: {
  profile: Pick<ChildProfile,'name'|'ageLabel'>;
  recipientLabel: string;
  dateLabel: string;
  observations: Observation[];
  caregivers: Caregiver[];
}): string {
  const {profile,recipientLabel,dateLabel,observations,caregivers} = input;
  const lines = [
    'MUNDELO - SÍNTESE CONTEXTUAL DE OBSERVAÇÃO INFANTIL',
    '"Compreender é o primeiro cuidado"',
    `Criança (Dados Fictícios): ${profile.name} (${profile.ageLabel})`,
    `Finalidade: ${recipientLabel}`,
    `Data da Síntese: ${dateLabel}`,
    `Total de Observações Selecionadas: ${observations.length}`,
    '',
    PROFILE_OMISSION_NOTICE,
    ATTRIBUTION_LIMIT,
    'A finalidade escolhida organiza a conversa; não cria autorização de compartilhamento.',
    '',
    'REGISTROS CONTEXTUAIS SELECIONADOS:',
  ];
  observations.forEach((obs,index)=>{
    lines.push(
      `\n[Registro ${index+1}] - ${obs.occurredAt.replace('T',' ')} | ${environmentLabels[obs.environment] || obs.environment} | ${obs.eventType}`,
      ...observationAttribution(obs,caregivers).map(({label,value})=>`- ${label}: ${value}`),
      `- Fatos registrados (relato): ${obs.description}`,
      `- Antecedentes: ${informedText(obs.antecedents)}`,
      `- Sinais expressivos: ${informedText(obs.communicationSignals)}`,
      `- Acolhimento do adulto: ${informedText(obs.supportOffered)}`,
      `- Resposta registrada: ${informedText(obs.observedOutcome)}`,
      `- Forças percebidas: ${informedText(obs.positiveAspects)}`,
      `- ${INTERPRETATION_TEXT_LABEL}: ${informedText(obs.notes)}`,
    );
  });
  lines.push('\nAVISO ÉTICO: Documento demonstrativo de diálogo. Não constitui diagnóstico, laudo clínico ou previsão diagnóstica.');
  return lines.join('\n');
}
