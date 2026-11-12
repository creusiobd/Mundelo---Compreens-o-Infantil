/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DomainOperationType =
  | 'VAULT_EXPORT'
  | 'VAULT_IMPORT'
  | 'RESTORE_DEMO'
  | 'CLEAR_RECORDS';

export interface DomainOperationSnapshot {
  operationId: string;
  type: DomainOperationType;
  targetChildId: string;
  caregiverId: string;
  startedAt: number;
  expectedStateGeneration: number;
}

export interface LockAcquisitionResult {
  acquired: boolean;
  snapshot?: DomainOperationSnapshot;
  error?: string;
}

export interface CommitValidationResult {
  canCommit: boolean;
  reason?: string;
}

/**
 * Gerenciador de concorrência e atomicidade em nível de domínio (SEC-17 / SEC-18).
 * Impede operações assíncronas concorrentes, monitora geração de estado e
 * garante cancelamento lógico caso o contexto (criança ou cuidador) mude antes do commit.
 */
export class DomainConcurrencyManager {
  private activeLock: DomainOperationSnapshot | null = null;
  private stateGeneration: number = 1;
  private readonly lockTimeoutMs: number;

  constructor(lockTimeoutMs: number = 30000) {
    this.lockTimeoutMs = lockTimeoutMs;
  }

  /**
   * Retorna o número de geração atual do estado
   */
  public getGeneration(): number {
    return this.stateGeneration;
  }

  /**
   * Incrementa o contador de geração atômica após uma transação bem-sucedida
   */
  public incrementGeneration(): number {
    this.stateGeneration++;
    return this.stateGeneration;
  }

  /**
   * Verifica se há alguma operação em andamento (respeitando timeout de segurança)
   */
  public isLocked(): boolean {
    if (!this.activeLock) return false;
    const now = Date.now();
    if (now - this.activeLock.startedAt > this.lockTimeoutMs) {
      // Timeout de segurança: libera trava órfã
      this.activeLock = null;
      return false;
    }
    return true;
  }

  /**
   * Tenta adquirir a trava de operação de domínio. Rejeita se já houver operação ativa.
   */
  public acquireLock(
    type: DomainOperationType,
    targetChildId: string,
    caregiverId: string
  ): LockAcquisitionResult {
    if (this.isLocked() && this.activeLock) {
      return {
        acquired: false,
        error: `Operação concorrente bloqueada: já existe uma transação em andamento (${this.activeLock.type}, ID: ${this.activeLock.operationId}).`,
      };
    }

    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const operationId = `op-${type.toLowerCase()}-${Date.now()}-${randomSuffix}`;

    const snapshot: DomainOperationSnapshot = {
      operationId,
      type,
      targetChildId,
      caregiverId,
      startedAt: Date.now(),
      expectedStateGeneration: this.stateGeneration,
    };

    this.activeLock = snapshot;

    return {
      acquired: true,
      snapshot,
    };
  }

  /**
   * Valida estritamente se o commit pode ser executado no instante final.
   * Verifica:
   * 1. Correspondência do operationId com a trava ativa.
   * 2. Se a criança ativa mudou durante a operação assíncrona (cancelamento lógico).
   * 3. Se o cuidador ativo mudou ou perdeu o status ACTIVE.
   */
  public validateCommit(
    operationId: string,
    currentChildId: string,
    currentCaregiverId: string,
    currentCaregiverStatus: string,
    isCaregiverLinkedToChild: boolean
  ): CommitValidationResult {
    if (!this.activeLock) {
      return {
        canCommit: false,
        reason: 'Nenhuma trava ativa encontrada no domínio para autorizar o commit.',
      };
    }

    if (this.activeLock.operationId !== operationId) {
      return {
        canCommit: false,
        reason: `Conflito de identificador de operação: esperado ${this.activeLock.operationId}, recebido ${operationId}.`,
      };
    }

    // Cancelamento lógico por alteração de geração de estado global
    if (this.stateGeneration !== this.activeLock.expectedStateGeneration) {
      return {
        canCommit: false,
        reason: `Cancelamento lógico: a geração de estado do domínio avançou de ${this.activeLock.expectedStateGeneration} para ${this.stateGeneration} durante a operação assíncrona.`,
      };
    }

    // Cancelamento lógico por mudança de perfil
    if (currentChildId !== this.activeLock.targetChildId) {
      return {
        canCommit: false,
        reason: `Operação cancelada: a criança ativa foi alterada de '${this.activeLock.targetChildId}' para '${currentChildId}' durante o processamento assíncrono.`,
      };
    }

    // Cancelamento lógico por troca ou suspensão de cuidador
    if (currentCaregiverId !== this.activeLock.caregiverId) {
      return {
        canCommit: false,
        reason: `Operação cancelada: o cuidador ativo foi alterado de '${this.activeLock.caregiverId}' para '${currentCaregiverId}' antes da confirmação.`,
      };
    }

    if (currentCaregiverStatus !== 'ACTIVE') {
      return {
        canCommit: false,
        reason: `Operação cancelada: o cuidador ativo '${currentCaregiverId}' não possui status ACTIVE (${currentCaregiverStatus}).`,
      };
    }

    if (!isCaregiverLinkedToChild) {
      return {
        canCommit: false,
        reason: `Operação cancelada: o vínculo do cuidador '${currentCaregiverId}' com a criança '${currentChildId}' foi revogado antes do commit.`,
      };
    }

    return {
      canCommit: true,
    };
  }

  /**
   * Libera a trava ativa para o operationId correspondente
   */
  public releaseLock(operationId: string): boolean {
    if (this.activeLock && this.activeLock.operationId === operationId) {
      this.activeLock = null;
      return true;
    }
    return false;
  }

  /**
   * Força liberação (utilizado em reset de testes ou restauração)
   */
  public forceReset(): void {
    this.activeLock = null;
    this.stateGeneration = 1;
  }
}
