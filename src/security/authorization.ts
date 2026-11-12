/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Caregiver, Observation } from '../types';

/**
 * POLÍTICA DE AUTORIZAÇÃO DEMONSTRATIVA — MUNDELO Foundation v0.3
 *
 * AVISO ARQUITETURAL CRÍTICO:
 * Estas funções representam regras de autorização no cliente para fins de
 * simulação e integridade demonstrativa. Elas NÃO substituem e NÃO constituem
 * autorização no servidor (que deverá ser implementada com tokens criptografados
 * em etapas futuras quando houver infraestrutura remota).
 *
 * Princípio Reitor: DENY BY DEFAULT (Negar por padrão).
 */

/**
 * Extrai de forma segura o childId e o objeto observation dos argumentos
 */
function resolveArgs(
  childIdOrObs: string | Observation,
  obsArg?: Observation
): { childId: string; observation?: Observation } {
  if (typeof childIdOrObs === 'string') {
    return { childId: childIdOrObs, observation: obsArg };
  }
  return { childId: childIdOrObs?.childId, observation: childIdOrObs };
}

/**
 * Verifica se o cuidador tem permissão para ler observações da criança indicada.
 */
export function canReadObservation(
  caregiver: Caregiver | null | undefined,
  childIdOrObs: string | Observation,
  obsArg?: Observation
): boolean {
  if (!caregiver || caregiver.status !== 'ACTIVE') return false;
  const { childId, observation } = resolveArgs(childIdOrObs, obsArg);

  if (!childId || !caregiver.linkedChildIds.includes(childId)) return false;
  if (observation && observation.childId !== childId) return false;
  return true;
}

/**
 * Verifica se o cuidador pode registrar novas observações para a criança.
 */
export function canCreateObservation(
  caregiver: Caregiver | null | undefined,
  childId: string
): boolean {
  if (!caregiver || caregiver.status !== 'ACTIVE') return false;
  if (!childId || !caregiver.linkedChildIds.includes(childId)) return false;
  return true;
}

/**
 * Verifica se o cuidador pode editar uma observação existente.
 * - Responsável Legal (LEGAL_GUARDIAN) vinculado pode editar observações da criança.
 * - O autor original que registrou (recordedByCaregiverId === caregiver.id) pode editar seu registro se mantiver vínculo ativo.
 * - Outros papéis não podem editar registros de terceiros.
 */
export function canEditObservation(
  caregiver: Caregiver | null | undefined,
  childIdOrObs: string | Observation,
  obsArg?: Observation
): boolean {
  const { childId, observation } = resolveArgs(childIdOrObs, obsArg);
  if (!observation) return false;
  if (!canReadObservation(caregiver, childId, observation)) return false;
  if (!caregiver) return false;

  // Responsável legal tem permissão de edição para cuidar do acervo da criança vinculada
  if (caregiver.role === 'LEGAL_GUARDIAN') return true;

  // Autor que registrou pode editar sua própria observação
  if (observation.recordedByCaregiverId === caregiver.id) return true;

  return false;
}

/**
 * Verifica se o cuidador pode excluir uma observação.
 * - Responsáveis Legais (LEGAL_GUARDIAN) vinculados têm poder de exclusão no acervo infantil.
 * - O autor original vinculado pode excluir sua própria observação.
 * - Usuários sem vínculo ou suspensos têm exclusão bloqueada.
 */
export function canDeleteObservation(
  caregiver: Caregiver | null | undefined,
  childIdOrObs: string | Observation,
  obsArg?: Observation
): boolean {
  const { childId, observation } = resolveArgs(childIdOrObs, obsArg);
  if (!observation) return false;
  if (!canReadObservation(caregiver, childId, observation)) return false;
  if (!caregiver) return false;

  if (caregiver.role === 'LEGAL_GUARDIAN') return true;
  if (observation.recordedByCaregiverId === caregiver.id) return true;

  return false;
}

/**
 * Verifica se o cuidador pode incluir ou remover uma observação do relatório para profissionais/escola.
 * - Cuidadores ativos vinculados à criança podem curar a síntese de compartilhamento.
 */
export function canIncludeInReport(
  caregiver: Caregiver | null | undefined,
  childIdOrObs: string | Observation,
  obsArg?: Observation
): boolean {
  const { childId, observation } = resolveArgs(childIdOrObs, obsArg);
  if (!observation) return false;
  if (!canReadObservation(caregiver, childId, observation)) return false;
  if (!caregiver) return false;

  // Qualquer cuidador ativo vinculado à criança pode selecionar observações para o diálogo
  return true;
}
