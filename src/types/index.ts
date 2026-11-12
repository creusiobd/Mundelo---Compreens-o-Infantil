/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenId =
  | 'welcome'
  | 'onboarding'
  | 'home'
  | 'journal'
  | 'world'
  | 'discoveries'
  | 'understand'
  | 'report'
  | 'privacy';

export type EventType = 'conquista' | 'desconforto' | 'rotina' | 'descoberta';

export type EnvironmentType =
  | 'casa'
  | 'parque'
  | 'escola'
  | 'transporte_consulta'
  | 'reuniao_familia'
  | 'outro';

export type ObserverRole =
  | 'mae'
  | 'pai'
  | 'avo'
  | 'cuidador'
  | 'educador'
  | 'terapeuta'
  | 'outro';

export type ProvenanceType = 'DIRECT' | 'REPORTED_BY_OTHER';

/**
 * Papéis demonstrativos de cuidadores no modelo de autorização
 */
export type CaregiverRole =
  | 'LEGAL_GUARDIAN'
  | 'FAMILY_CAREGIVER'
  | 'EDUCATOR'
  | 'PROFESSIONAL';

export type CaregiverStatus = 'ACTIVE' | 'INVITED' | 'SUSPENDED';

/**
 * Entidade que representa o cuidador no sistema com vínculos explícitos
 */
export interface Caregiver {
  id: string;
  displayName: string;
  role: CaregiverRole;
  linkedChildIds: string[]; // Vínculos explícitos com as crianças que pode acessar
  status: CaregiverStatus;
  relationshipLabel?: string; // e.g. "Mãe (Responsável Legal)", "Avó materna"
}

/**
 * Contexto e condições ambientais da observação
 */
export interface ObservationContext {
  environment: EnvironmentType;
  locationDetail?: string;
  antecedents: string;
  peoplePresent?: string[];
}

/**
 * Registro de evidências comportamentais e respostas de mediação
 */
export interface EvidenceRecord {
  communicationSignals: string;
  supportOffered: string;
  observedOutcome: string;
  positiveAspects: string;
}

/**
 * Estratégia de apoio e regulação testada pela família
 */
export interface SupportStrategy {
  id: string;
  strategy: string;
  context: string;
  observedResponse: string;
}

/**
 * Perfil da criança em acompanhamento
 */
export interface ChildProfile {
  id: string;
  name: string;
  ageLabel: string;
  ageMonths: number;
  preferredPronoun: 'ele' | 'ela' | 'eles';
  interests: string[];
  comfortAnchors: string[];
  sensitivities: string[];
  communicationModes: string[];
  celebratedMilestones: string[];
  supportStrategies: SupportStrategy[];
}

/**
 * Modelo canônico de observação infantil — Foundation v0.3
 * Inclui rastreabilidade rigorosa de proveniência, identificação de quem
 * inseriu no sistema, quem presenciou, rótulo de relato de terceiros,
 * e controle positivo de revisões.
 */
export interface Observation {
  id: string;
  childId: string; // Vínculo canônico obrigatório com o perfil da criança
  recordedByCaregiverId: string; // OBRIGATÓRIO: Identificador do cuidador que realizou o registro
  observedByCaregiverId?: string; // Opcional: cuidador que presenciou o fato (quando DIRECT)
  reportedByLabel?: string; // Opcional e não-autenticado: rótulo de terceiro que relatou (quando REPORTED_BY_OTHER)
  provenance: ProvenanceType; // DIRECT (presenciado) ou REPORTED_BY_OTHER (relato de terceiros)
  occurredAt: string; // Momento do fato observado no mundo real (ISO: YYYY-MM-DDTHH:mm)
  recordedAt: string; // Momento original de registro no sistema (ISO 8601)
  updatedAt?: string; // Momento da última edição registrada (ISO 8601)
  revision: number; // Inteiro positivo >= 1 (incrementa a cada edição)
  environment: EnvironmentType;
  observerRole: ObserverRole; // Mantido para compatibilidade retroativa
  eventType: EventType;
  description: string; // FATOS OBJETIVOS: o que aconteceu sem julgamento
  antecedents: string; // CONTEXTO PRÉVIO: o que vinha ocorrendo antes
  communicationSignals: string; // SINAIS CORPORAIS E EXPRESSIVOS
  supportOffered: string; // ACOLHIMENTO E MEDIAÇÃO DO ADULTO
  observedOutcome: string; // RESPOSTA OBSERVADA DA CRIANÇA
  positiveAspects: string; // FORÇAS E RECURSOS PERCEBIDOS
  notes: string; // HIPÓTESES REFLEXIVAS DO CUIDADOR (claramente separadas dos fatos)
  contextDetails?: ObservationContext;
  evidenceDetails?: EvidenceRecord;
}

export type AgeGroupFilter = 'todos' | '0-1' | '1-2' | '2-3' | '3-5';
export type DiscoveryCategory =
  | 'todos'
  | 'calmante'
  | 'motor'
  | 'conexao'
  | 'linguagem'
  | 'natureza';

export interface OfflineDiscovery {
  id: string;
  title: string;
  ageGroup: '0-1' | '1-2' | '2-3' | '3-5';
  category: 'calmante' | 'motor' | 'conexao' | 'linguagem' | 'natureza';
  duration: string;
  materials: string[];
  purpose: string;
  steps: string[];
  whatToObserve: string;
}
