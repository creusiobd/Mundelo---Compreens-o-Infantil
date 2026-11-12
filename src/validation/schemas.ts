/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';
import { Observation, ChildProfile, Caregiver } from '../types';

export const ProvenanceSchema = z.enum(['DIRECT', 'REPORTED_BY_OTHER'], {
  message: 'Proveniência deve ser DIRECT ou REPORTED_BY_OTHER.',
});

export const EventTypeSchema = z.enum(
  ['conquista', 'desconforto', 'rotina', 'descoberta'],
  {
    message: 'Tipo de evento inválido ou desconhecido.',
  }
);

export const EnvironmentTypeSchema = z.enum(
  ['casa', 'parque', 'escola', 'transporte_consulta', 'reuniao_familia', 'outro'],
  {
    message: 'Ambiente de observação inválido.',
  }
);

export const ObserverRoleSchema = z.enum(
  ['mae', 'pai', 'avo', 'cuidador', 'educador', 'terapeuta', 'outro'],
  {
    message: 'Papel do observador inválido.',
  }
);

export const CaregiverRoleSchema = z.enum(
  ['LEGAL_GUARDIAN', 'FAMILY_CAREGIVER', 'EDUCATOR', 'PROFESSIONAL'],
  {
    message: 'Papel de cuidador inválido.',
  }
);

export const CaregiverStatusSchema = z.enum(['ACTIVE', 'INVITED', 'SUSPENDED'], {
  message: 'Status de cuidador inválido.',
});

export const SupportStrategySchema = z.object({
  id: z.string().min(1, 'ID da estratégia é obrigatório.'),
  strategy: z.string().min(2, 'Descrição da estratégia é obrigatória.'),
  context: z.string().default('Cotidiano geral'),
  observedResponse: z.string().default('Resposta observada'),
});

export const ChildProfileSchema = z.object({
  id: z.string().min(1, 'ID da criança é obrigatório.'),
  name: z.string().min(1, 'Nome fictício da criança é obrigatório.'),
  ageLabel: z.string().min(1, 'Idade é obrigatória.'),
  ageMonths: z.number().int().nonnegative(),
  preferredPronoun: z.enum(['ele', 'ela', 'eles']),
  interests: z.array(z.string()),
  comfortAnchors: z.array(z.string()),
  sensitivities: z.array(z.string()),
  communicationModes: z.array(z.string()),
  celebratedMilestones: z.array(z.string()),
  supportStrategies: z.array(SupportStrategySchema),
});

export const CaregiverSchema = z.object({
  id: z.string().min(1, 'ID do cuidador é obrigatório.'),
  displayName: z.string().min(1, 'Nome do cuidador é obrigatório.'),
  role: CaregiverRoleSchema,
  linkedChildIds: z.array(z.string()),
  status: CaregiverStatusSchema,
  relationshipLabel: z.string().optional(),
});

/**
 * Schema canônico para criação e validação de observações — Foundation v0.3
 */
export const ObservationSchema = z.object({
  id: z.string().min(1, 'Identificador da observação é obrigatório.'),
  childId: z.string().min(1, 'Identificador da criança (childId) é obrigatório para garantir isolamento lógico.'),
  recordedByCaregiverId: z
    .string()
    .min(1, 'Identificador do cuidador que registrou (recordedByCaregiverId) é obrigatório.')
    .default('cg-helena'),
  observedByCaregiverId: z.string().optional(),
  reportedByLabel: z.string().optional(),
  provenance: ProvenanceSchema.default('DIRECT'),
  occurredAt: z.string().min(1, 'Data e horário do fato observado são obrigatórios.'),
  recordedAt: z.string().min(1, 'Data e horário de registro no sistema são obrigatórios.'),
  updatedAt: z.string().optional(),
  revision: z.number().int().min(1, 'A revisão deve ser um inteiro positivo >= 1.').default(1),
  environment: EnvironmentTypeSchema,
  observerRole: ObserverRoleSchema,
  eventType: EventTypeSchema,
  description: z
    .string()
    .trim()
    .min(3, 'A descrição dos fatos objetivos deve conter ao menos 3 caracteres.'),
  antecedents: z.string().default('Não observado'),
  communicationSignals: z.string().default('Não observado'),
  supportOffered: z.string().default('Apenas observação atenta'),
  observedOutcome: z.string().default('Não observado'),
  positiveAspects: z.string().default('Não observado'),
  notes: z.string().default('Registro sem hipóteses adicionais.'),
  contextDetails: z
    .object({
      environment: EnvironmentTypeSchema,
      locationDetail: z.string().optional(),
      antecedents: z.string(),
      peoplePresent: z.array(z.string()).optional(),
    })
    .optional(),
  evidenceDetails: z
    .object({
      communicationSignals: z.string(),
      supportOffered: z.string(),
      observedOutcome: z.string(),
      positiveAspects: z.string(),
    })
    .optional(),
});

/**
 * Validador estrito que lança erro detalhado caso a observação seja inválida
 */
export function validateObservation(data: unknown): Observation {
  return ObservationSchema.parse(data) as Observation;
}

/**
 * Validador seguro que retorna resultado com array de erros amigáveis
 */
export function safeValidateObservation(data: unknown):
  | { success: true; data: Observation }
  | { success: false; errors: string[] } {
  const result = ObservationSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data as Observation };
  }
  const issues = result.error.issues || [];
  const errors = issues.map((err) => `${err.path.join('.')}: ${err.message}`);
  return { success: false, errors };
}

/**
 * Validador seguro para perfis infantis
 */
export function validateChildProfile(data: unknown): ChildProfile {
  return ChildProfileSchema.parse(data) as ChildProfile;
}

/**
 * Validador seguro para cuidadores
 */
export function validateCaregiver(data: unknown): Caregiver {
  return CaregiverSchema.parse(data) as Caregiver;
}
