/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useMemo, useRef, useLayoutEffect, useCallback } from 'react';
import {
  ChildProfile,
  Observation,
  ScreenId,
  SupportStrategy,
  Caregiver,
} from '../types';
import {
  MOCK_PROFILE_TOMAS,
  MOCK_PROFILE_LIA,
  MOCK_OBSERVATIONS,
  MOCK_CAREGIVERS,
} from '../data/mockData';
import { ChildProfileSchema, safeValidateObservation } from '../validation/schemas';
import { VaultPayload } from '../crypto/types';
import { VaultPayloadSchema } from '../crypto/schemas';
import {
  canReadObservation,
  canReadChildProfile,
  canManageChildProfile,
  canCreateObservation,
  canEditObservation,
  canDeleteObservation,
  canIncludeInReport,
} from '../security/authorization';
import { resolveObservationBatch } from '../security/conflictResolver';
import { DomainConcurrencyManager } from '../security/domainLock';
import type { Perspective } from '../domain/perspectives';
import {
  emptyPerspectiveLedger, readPerspectiveCurrent, runPerspectiveCommand,
  type PerspectiveLedger, type PerspectiveCommand, type CommandResult,
} from '../domain/perspectiveCommands';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentScreen: ScreenId;
  setScreen: (screen: ScreenId) => void;
  activeProfile: ChildProfile;
  availableProfiles: ChildProfile[];
  switchProfile: (profileId: string) => void;
  // Caregivers & active role simulation
  caregivers: Caregiver[];
  activeCaregiver: Caregiver;
  switchCaregiver: (caregiverId: string) => void;
  // Permissions & access indicators
  isLinkedToActiveChild: boolean;
  canReadProfile: boolean;
  canManageProfile: boolean;
  canRead: (obs: Observation) => boolean;
  canCreate: boolean;
  canEdit: (obs: Observation) => boolean;
  canDelete: (obs: Observation) => boolean;
  canReport: (obs: Observation) => boolean;
  canIncludeInReport: (obs: Observation) => boolean;
  // Isolated synthetic perspective-command ledger; legacy observations are NOT silently migrated.
  activeChildPerspectives: Perspective[];
  executePerspectiveCommand: (command: PerspectiveCommand) => CommandResult;
  // All in-memory observations
  allObservations: Observation[];
  // Observations strictly isolated for the active child profile & authorized for the active caregiver
  activeChildObservations: Observation[];
  selectedObservationIds: string[];
  filterEventType: string;
  setFilterEventType: (filter: string) => void;
  filterEnvironment: string;
  setFilterEnvironment: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // CRUD with demonstrative authorization
  addObservation: (
    obs: Omit<
      Observation,
      'id' | 'childId' | 'recordedAt' | 'recordedByCaregiverId' | 'revision' | 'updatedAt'
    > & {
      provenance?: 'DIRECT' | 'REPORTED_BY_OTHER';
      reportedByLabel?: string;
    }
  ) => boolean;
  updateObservation: (id: string, obs: Partial<Observation>) => boolean;
  deleteObservation: (id: string) => boolean;
  toggleSelectObservation: (id: string) => void;
  selectAllObservations: (select: boolean) => void;
  // Profile editing
  updateProfile: (profile: Partial<ChildProfile>) => boolean;
  addInterest: (interest: string) => boolean;
  removeInterest: (interest: string) => boolean;
  addComfortAnchor: (anchor: string) => boolean;
  removeComfortAnchor: (anchor: string) => boolean;
  addSensitivity: (sensitivity: string) => boolean;
  removeSensitivity: (sensitivity: string) => boolean;
  addCommunicationMode: (mode: string) => boolean;
  removeCommunicationMode: (mode: string) => boolean;
  addCelebratedMilestone: (milestone: string) => boolean;
  removeCelebratedMilestone: (milestone: string) => boolean;
  addSupportStrategy: (strategy: Omit<SupportStrategy, 'id'>) => boolean;
  removeSupportStrategy: (strategyId: string) => boolean;
  // Demo State Switchers
  clearActiveChildObservationsToEmpty: () => void;
  restoreDemoData: () => void;
  isAllEmpty: boolean;
  // Toast notifications
  notification: ToastNotification | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
  clearNotification: () => void;
  // Encrypted Vault (Experimental Prototype)
  exportVault: <T>(
    prepare: (payload: VaultPayload) => Promise<T>,
    release: (prepared: T, payload: VaultPayload) => void
  ) => Promise<void>;
  importVaultPayload: (
    payload: VaultPayload,
    mode: 'merge' | 'replace'
  ) => { success: boolean; importedCount: number; message: string };
  // Domain Concurrency Manager (SEC-17 / SEC-18)
  domainConcurrencyManager: DomainConcurrencyManager;
}

// Invalidate prepared exports synchronously when a relevant write is accepted,
// even if React has not committed it yet or a later write restores the old value.
function useDomainState<T>(initial: T, manager: DomainConcurrencyManager) {
  const [value, setValue] = useState<T>(initial);
  const update = useCallback((next: React.SetStateAction<T>) => {
    manager.incrementGeneration();
    setValue(next);
  }, [manager]);
  return [value, update] as const;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Instância singleton estável do gerenciador de concorrência no domínio
  const domainConcurrencyManager = useMemo(() => new DomainConcurrencyManager(), []);

  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [profiles, setProfiles] = useDomainState<ChildProfile[]>([
    MOCK_PROFILE_TOMAS,
    MOCK_PROFILE_LIA,
  ], domainConcurrencyManager);
  const [activeProfileId, setActiveProfileId] = useDomainState<string>('tomas', domainConcurrencyManager);
  const [caregivers, setCaregivers] = useDomainState<Caregiver[]>(MOCK_CAREGIVERS, domainConcurrencyManager);
  const [activeCaregiverId, setActiveCaregiverId] = useDomainState<string>('cg-helena', domainConcurrencyManager);
  const [observations, setObservations] = useDomainState<Observation[]>(MOCK_OBSERVATIONS, domainConcurrencyManager);
  // Separate from vault/profile/legacy observations. Session-only experimental commands.
  const [perspectiveLedger, setPerspectiveLedger] = useDomainState<PerspectiveLedger>(
    emptyPerspectiveLedger(), domainConcurrencyManager
  );
  const perspectiveLedgerRef = useRef<PerspectiveLedger>(perspectiveLedger);


  // Default selection for reports: initially active profile's observations
  const [selectedObservationIds, setSelectedObservationIds] = useState<string[]>(
    MOCK_OBSERVATIONS.filter((o) => o.childId === 'tomas').map((o) => o.id)
  );

  const [filterEventType, setFilterEventType] = useState<string>('all');
  const [filterEnvironment, setFilterEnvironment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<ToastNotification | null>(null);

  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || profiles[0];
  }, [profiles, activeProfileId]);

  const activeCaregiver = useMemo(() => {
    return (
      caregivers.find((c) => c.id === activeCaregiverId) || caregivers[0]
    );
  }, [caregivers, activeCaregiverId]);

  // Async work must read the last committed context, not its starting closure.
  // Pending relevant writes already invalidate the generation via useDomainState.
  const exportContextRef = useRef({ childId: activeProfileId, caregiver: activeCaregiver, profiles, observations, caregivers });
  useLayoutEffect(() => {
    exportContextRef.current = { childId: activeProfileId, caregiver: activeCaregiver, profiles, observations, caregivers };
  }, [activeProfileId, activeCaregiver, profiles, observations, caregivers]);

  const isLinkedToActiveChild = useMemo(() => {
    return (
      activeCaregiver.status === 'ACTIVE' &&
      activeCaregiver.linkedChildIds.includes(activeProfileId)
    );
  }, [activeCaregiver, activeProfileId]);

  // ISOLATION & AUTHORIZATION:
  // If caregiver is unlinked or suspended, access is denied (empty list returned)
  const activeChildObservations = useMemo(() => {
    if (!canReadObservation(activeCaregiver, activeProfileId)) {
      return [];
    }
    return observations.filter((o) => o.childId === activeProfileId);
  }, [observations, activeProfileId, activeCaregiver]);

  const activeChildPerspectives = useMemo(
    () => readPerspectiveCurrent(perspectiveLedger, activeCaregiver, activeProfileId),
    [perspectiveLedger, activeCaregiver, activeProfileId]
  );
  // A command binds to the current render and its domain generation. Old closures fail closed.
  const perspectiveCommandGeneration = domainConcurrencyManager.getGeneration();
  const executePerspectiveCommand = (command: PerspectiveCommand): CommandResult => {
    const current = exportContextRef.current;
    const oldLedger = perspectiveLedgerRef.current;
    if (domainConcurrencyManager.getGeneration() !== perspectiveCommandGeneration ||
        current.childId !== activeProfileId || current.caregiver.id !== activeCaregiver.id) {
      return {ok:false,ledger:oldLedger,reason:'DENIED'};
    }
    const outcome = runPerspectiveCommand(oldLedger,current.caregiver,current.childId,command);
    if (outcome.ok && !outcome.replayed) {
      // Synchronous ref update avoids duplicate acceptance before React renders.
      perspectiveLedgerRef.current = outcome.ledger;
      setPerspectiveLedger(outcome.ledger);
    }
    return outcome;
  };
  const canReadProfile = canReadChildProfile(activeCaregiver, activeProfileId);
  const canManageProfile = canManageChildProfile(activeCaregiver, activeProfileId);
  const canRead = (obs: Observation) =>
    canReadObservation(activeCaregiver, activeProfileId, obs);

  const canCreate = useMemo(() => {
    return canCreateObservation(activeCaregiver, activeProfileId);
  }, [activeCaregiver, activeProfileId]);

  const canEdit = (obs: Observation) => {
    return canEditObservation(activeCaregiver, activeProfileId, obs);
  };

  const canDelete = (obs: Observation) => {
    return canDeleteObservation(activeCaregiver, activeProfileId, obs);
  };

  const canReport = (obs: Observation) => {
    return canIncludeInReport(activeCaregiver, activeProfileId, obs);
  };

  const showNotification = (
    message: string,
    type: 'success' | 'info' | 'error' = 'success'
  ) => {
    const id = Date.now().toString();
    setNotification({ id, message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.id === id ? null : curr));
    }, 4500);
  };

  const clearNotification = () => setNotification(null);

  const switchProfile = (profileId: string) => {
    const target = profiles.find((p) => p.id === profileId);
    if (!target) {
      showNotification('Perfil não encontrado.', 'error');
      return;
    }
    setActiveProfileId(profileId);
    // Isolate report selection: only select observations belonging to the newly active profile
    const childObs = observations.filter((o) => o.childId === profileId);
    setSelectedObservationIds(childObs.map((o) => o.id));

    if (!canReadChildProfile(activeCaregiver, profileId)) {
      showNotification(
        `Aviso de Autorização: leitura do perfil selecionado indisponível para ${activeCaregiver.displayName}. Acesso restrito.`,
        'error'
      );
    } else {
      showNotification(
        `Perfil ativo: ${target.name} (${target.ageLabel}). Registros isolados.`,
        'info'
      );
    }
  };

  const switchCaregiver = (caregiverId: string) => {
    const target = caregivers.find((c) => c.id === caregiverId);
    if (!target) {
      showNotification('Cuidador não encontrado.', 'error');
      return;
    }
    setActiveCaregiverId(caregiverId);

    const isLinked = target.linkedChildIds.includes(activeProfileId);
    if (target.status !== 'ACTIVE') {
      showNotification(
        `Simulação de Cuidador: ${target.displayName} (Status: ${target.status}). Acesso negado por padrão.`,
        'error'
      );
    } else if (!isLinked) {
      showNotification(
        `Simulação de Cuidador: ${target.displayName} (${target.role}). Sem vínculo com o perfil selecionado.`,
        'error'
      );
    } else {
      showNotification(
        `Cuidador simulado ativo: ${target.displayName} (${target.role}).`,
        'success'
      );
    }
  };

  const addObservation = (
    newObs: Omit<
      Observation,
      'id' | 'childId' | 'recordedAt' | 'recordedByCaregiverId' | 'revision' | 'updatedAt'
    > & {
      provenance?: 'DIRECT' | 'REPORTED_BY_OTHER';
      reportedByLabel?: string;
    }
  ): boolean => {
    // 1. Authorization Gate (Deny by default)
    if (!canCreateObservation(activeCaregiver, activeProfileId)) {
      showNotification(
        'Acesso Negado: O cuidador ativo não possui permissão para registrar observações para esta criança.',
        'error'
      );
      return false;
    }

    const id = `obs-${Date.now()}`;
    const recordedAt = new Date().toISOString();
    const candidate: Observation = {
      ...newObs,
      id,
      childId: activeProfileId,
      recordedByCaregiverId: activeCaregiver.id,
      observedByCaregiverId:
        newObs.observedByCaregiverId,
      reportedByLabel:
        newObs.provenance === 'REPORTED_BY_OTHER'
          ? newObs.reportedByLabel
          : undefined,
      provenance: newObs.provenance,
      recordedAt,
      revision: 1,
    };

    // 2. Schema Validation Gate
    const validation = safeValidateObservation(candidate);
    if (!validation.success) {
      showNotification(`Erro de validação: ${validation.errors[0]}`, 'error');
      return false;
    }

    setObservations((prev) => [validation.data, ...prev]);
    setSelectedObservationIds((prev) => [...prev, id]);
    showNotification('Observação registrada na memória desta sessão de demonstração.', 'success');
    return true;
  };

  const updateObservation = (id: string, updatedFields: Partial<Observation>): boolean => {
    const target = observations.find((item) => item.id === id);
    if (!target) {
      showNotification('Observação não encontrada para atualização.', 'error');
      return false;
    }

    // 1. Cross-Child Protection
    if (target.childId !== activeProfileId) {
      showNotification('Acesso negado: violação de integridade entre perfis.', 'error');
      return false;
    }

    // 2. Authorization Gate (Deny by default)
    if (!canEditObservation(activeCaregiver, activeProfileId, target)) {
      showNotification(
        'Acesso Negado: Apenas o Responsável Legal ou o autor original que registrou podem editar esta observação.',
        'error'
      );
      return false;
    }

    const updatedAt = new Date().toISOString();
    const nextRevision = (target.revision || 1) + 1;

    // Preserva childId, recordedAt e recordedByCaregiverId imutáveis
    const candidate: Observation = {
      ...target,
      ...updatedFields,
      id: target.id,
      childId: target.childId,
      recordedByCaregiverId: target.recordedByCaregiverId,
      recordedAt: target.recordedAt,
      updatedAt,
      // Changing origin must not carry forward an inferred observer.
      observedByCaregiverId: updatedFields.provenance && updatedFields.provenance !== target.provenance
        ? updatedFields.observedByCaregiverId
        : updatedFields.observedByCaregiverId ?? target.observedByCaregiverId,
      revision: nextRevision,
    };

    // 3. Schema Validation Gate
    const validation = safeValidateObservation(candidate);
    if (!validation.success) {
      showNotification(`Erro de validação: ${validation.errors[0]}`, 'error');
      return false;
    }

    setObservations((prev) =>
      prev.map((item) => (item.id === id ? validation.data : item))
    );
    showNotification(`Observação atualizada (Revisão #${nextRevision}).`, 'success');
    return true;
  };

  const deleteObservation = (id: string): boolean => {
    const target = observations.find((item) => item.id === id);
    if (!target) {
      showNotification('Registro não encontrado.', 'error');
      return false;
    }

    // 1. Cross-Child Protection
    if (target.childId !== activeProfileId) {
      showNotification('Acesso negado: não é permitido excluir dados de outro perfil.', 'error');
      return false;
    }

    // Demonstrative gate: ACTIVE + child link, and LEGAL_GUARDIAN or original recorder.
    // Removing from session memory is not governed erasure of copies/backups.
    if (!canDeleteObservation(activeCaregiver, activeProfileId, target)) {
      showNotification(
        'Acesso negado: remover um registro desta memória de demonstração exige cuidador ativo, vinculado ao perfil e responsável legal ou a pessoa que registrou a observação.',
        'error'
      );
      return false;
    }

    setObservations((prev) => prev.filter((item) => item.id !== id));
    setSelectedObservationIds((prev) => prev.filter((item) => item !== id));
    showNotification('Registro retirado da memória desta sessão de demonstração.', 'info');
    return true;
  };

  const toggleSelectObservation = (id: string) => {
    const obs = observations.find((o) => o.id === id);
    if (!obs || obs.childId !== activeProfileId) return;

    // Authorization Gate
    if (!canIncludeInReport(activeCaregiver, activeProfileId, obs)) {
      showNotification(
        'Acesso Negado: O cuidador ativo não tem permissão para incluir observações no relatório da família.',
        'error'
      );
      return;
    }

    setSelectedObservationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllObservations = (select: boolean) => {
    if (!select) {
      setSelectedObservationIds([]);
      return;
    }

    // Only allow selecting observations that pass canIncludeInReport
    const authorizedIds = activeChildObservations
      .filter((obs) => canIncludeInReport(activeCaregiver, activeProfileId, obs))
      .map((o) => o.id);

    setSelectedObservationIds(authorizedIds);
  };

  // Bind profile commands to this render. A later context/write invalidates old callbacks.
  const profileCommandGeneration = domainConcurrencyManager.getGeneration();
  const guardProfileWrite = (): boolean => {
    const current = exportContextRef.current;
    if (domainConcurrencyManager.getGeneration() !== profileCommandGeneration ||
        current.childId !== activeProfileId || current.caregiver.id !== activeCaregiver.id ||
        !canManageChildProfile(current.caregiver, current.childId)) {
      showNotification('Acesso negado: gestão de perfil exige responsável legal ativo, vínculo e contexto vigente.', 'error');
      return false;
    }
    return true;
  };

  const commitProfileChange = (change: (profile: ChildProfile) => ChildProfile): boolean => {
    if (!guardProfileWrite()) return false;
    const target = exportContextRef.current.profiles.find(p => p.id === activeProfileId);
    if (!target) return false;
    const result = ChildProfileSchema.safeParse(change(target));
    if (!result.success || result.data.id !== target.id) {
      showNotification('Alteração de perfil inválida; identidade e estrutura devem ser preservadas.', 'error');
      return false;
    }
    // No asynchronous gap between final policy check and the state write.
    setProfiles(prev => prev.map(p => p.id === target.id ? result.data : p));
    return true;
  };

  const updateProfile = (updatedFields: Partial<ChildProfile>): boolean => {
    const accepted = commitProfileChange(p => ({...p, ...updatedFields}));
    if (accepted) showNotification('Perfil demonstrativo atualizado.', 'success');
    return accepted;
  };

  const addInterest = (interest: string): boolean => {
    if (!interest.trim()) return false;
    const accepted = commitProfileChange(p => ({...p, interests: [...p.interests, interest.trim()]}));
    if (accepted) showNotification('Interesse adicionado com sucesso.', 'success');
    return accepted;
  };
  const removeInterest = (interest: string): boolean =>
    commitProfileChange(p => ({...p, interests: p.interests.filter(item => item !== interest)}));

  const addComfortAnchor = (anchor: string): boolean => {
    if (!anchor.trim()) return false;
    const accepted = commitProfileChange(p => ({...p, comfortAnchors: [...p.comfortAnchors, anchor.trim()]}));
    if (accepted) showNotification('Fonte de conforto registrada.', 'success');
    return accepted;
  };
  const removeComfortAnchor = (anchor: string): boolean =>
    commitProfileChange(p => ({...p, comfortAnchors: p.comfortAnchors.filter(item => item !== anchor)}));

  const addSensitivity = (sensitivity: string): boolean => {
    if (!sensitivity.trim()) return false;
    const accepted = commitProfileChange(p => ({...p, sensitivities: [...p.sensitivities, sensitivity.trim()]}));
    if (accepted) showNotification('Sensibilidade contextual anotada.', 'success');
    return accepted;
  };
  const removeSensitivity = (sensitivity: string): boolean =>
    commitProfileChange(p => ({...p, sensitivities: p.sensitivities.filter(item => item !== sensitivity)}));

  const addCommunicationMode = (mode: string): boolean => {
    if (!mode.trim()) return false;
    const accepted = commitProfileChange(p => ({...p, communicationModes: [...p.communicationModes, mode.trim()]}));
    if (accepted) showNotification('Forma de comunicação adicionada.', 'success');
    return accepted;
  };
  const removeCommunicationMode = (mode: string): boolean =>
    commitProfileChange(p => ({...p, communicationModes: p.communicationModes.filter(item => item !== mode)}));

  const addCelebratedMilestone = (milestone: string): boolean => {
    if (!milestone.trim()) return false;
    const accepted = commitProfileChange(p => ({...p, celebratedMilestones: [...p.celebratedMilestones, milestone.trim()]}));
    if (accepted) showNotification('Conquista afetiva celebrada e salva.', 'success');
    return accepted;
  };
  const removeCelebratedMilestone = (milestone: string): boolean =>
    commitProfileChange(p => ({...p, celebratedMilestones: p.celebratedMilestones.filter(item => item !== milestone)}));

  const addSupportStrategy = (strategy: Omit<SupportStrategy, 'id'>): boolean => {
    const accepted = commitProfileChange(p => ({...p, supportStrategies: [...p.supportStrategies, {...strategy, id: `strat-${Date.now()}`}]}));
    if (accepted) showNotification('Estratégia de acolhimento registrada.', 'success');
    return accepted;
  };
  const removeSupportStrategy = (strategyId: string): boolean =>
    commitProfileChange(p => ({...p, supportStrategies: p.supportStrategies.filter(s => s.id !== strategyId)}));

  // Clears observations of the active child (requires LEGAL_GUARDIAN permission)
  const clearActiveChildObservationsToEmpty = () => {
    if (!guardProfileWrite()) return;
    setObservations((prev) => prev.filter((o) => o.childId !== activeProfileId));
    setSelectedObservationIds([]);
    showNotification(`Diário de ${activeProfile.name} zerado: modo de estado vazio ativo.`, 'info');
  };

  const restoreDemoData = () => {
    setProfiles([MOCK_PROFILE_TOMAS, MOCK_PROFILE_LIA]);
    setActiveProfileId('tomas');
    setCaregivers(MOCK_CAREGIVERS);
    setActiveCaregiverId('cg-helena');
    setObservations(MOCK_OBSERVATIONS);
    setSelectedObservationIds(
      MOCK_OBSERVATIONS.filter((o) => o.childId === 'tomas').map((o) => o.id)
    );
    showNotification('Dados de demonstração originais e cuidadores restaurados na memória.', 'success');
  };

  const exportVault = async <T,>(
    prepare: (payload: VaultPayload) => Promise<T>,
    release: (prepared: T, payload: VaultPayload) => void
  ): Promise<void> => {
    const targetChild = profiles.find((p) => p.id === activeProfileId);
    if (!targetChild) throw new Error('Perfil não encontrado para exportação.');

    const lock = domainConcurrencyManager.acquireLock(
      'VAULT_EXPORT', targetChild.id, activeCaregiver.id
    );
    if (!lock.acquired || !lock.snapshot) {
      throw new Error(lock.error || 'Operação concorrente bloqueada no domínio.');
    }
    const operationId = lock.snapshot.operationId;
    try {
      if (
        activeCaregiver.status !== 'ACTIVE' ||
        !activeCaregiver.linkedChildIds.includes(targetChild.id)
      ) {
        throw new Error('Acesso negado: o cuidador não pode exportar este perfil.');
      }
      const payload: VaultPayload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        childProfile: targetChild,
        observations: observations.filter((o) => o.childId === targetChild.id),
        linkedCaregivers: caregivers.filter((cg) => cg.linkedChildIds.includes(targetChild.id)),
        metadata: {
          origin: 'Mundelo Foundation v0.4A.1 Prototype',
          description: `Cofre experimental de dados sintéticos da criança ${targetChild.name}`,
          isSyntheticData: true,
        },
      };
      const prepared = await prepare(payload);
      const current = exportContextRef.current;
      const validation = domainConcurrencyManager.validateCommit(
        operationId, current.childId, current.caregiver.id, current.caregiver.status,
        current.caregiver.linkedChildIds.includes(current.childId)
      );
      if (
        !validation.canCommit || current.profiles !== profiles ||
        current.observations !== observations || current.caregivers !== caregivers
      ) {
        throw new Error('Exportação cancelada: o contexto ou os dados mudaram, ou a operação expirou. Inicie novamente.');
      }
      // No await between the final guard and the synchronous download handoff.
      release(prepared, payload);
    } finally {
      domainConcurrencyManager.releaseLock(operationId);
    }
  };

  const importVaultPayload = (
    payload: VaultPayload,
    mode: 'merge' | 'replace' = 'merge'
  ): { success: boolean; importedCount: number; message: string } => {
    if (!guardProfileWrite()) return {
      success: false, importedCount: 0,
      message: 'Acesso negado: aplicar perfil de cofre exige responsável legal ativo, vínculo e contexto vigente.',
    };
    const incomingChildId = payload?.childProfile?.id || activeProfileId;

    // 0. Pré-aquisição da trava de domínio (SEC-17 / SEC-18)
    const lockResult = domainConcurrencyManager.acquireLock(
      'VAULT_IMPORT',
      incomingChildId,
      activeCaregiver.id
    );

    if (!lockResult.acquired || !lockResult.snapshot) {
      const errMsg = lockResult.error || 'Operação concorrente bloqueada no domínio.';
      showNotification(errMsg, 'error');
      return { success: false, importedCount: 0, message: errMsg };
    }

    const operationId = lockResult.snapshot.operationId;

    try {
      // 1. Revalidação da identidade ativa no momento do commit (SEC-13 & SEC-18)
      const currentCaregiver = activeCaregiver;
      if (currentCaregiver.status !== 'ACTIVE') {
        throw new Error(
          `Acesso Negado: O cuidador ativo (${currentCaregiver.displayName}) está com status ${currentCaregiver.status} e não pode importar dados.`
        );
      }

      // 2. Validação estrita do payload com Zod
      const validated = VaultPayloadSchema.parse(payload);
      const incomingChild = validated.childProfile;

      // 3. Validação do Lock de Domínio no instante do commit (SEC-18)
      const lockValidation = domainConcurrencyManager.validateCommit(
        operationId,
        incomingChild.id,
        currentCaregiver.id,
        currentCaregiver.status,
        currentCaregiver.linkedChildIds.includes(incomingChild.id)
      );

      if (!lockValidation.canCommit) {
        throw new Error(
          `Transação cancelada pelo gerenciador de concorrência: ${lockValidation.reason}`
        );
      }

      // 4. Authorization Gate (SEC-11, SEC-13, SEC-18):
      // O cuidador ativo DEVE estar vinculado à criança do cofre importado!
      if (!currentCaregiver.linkedChildIds.includes(incomingChild.id)) {
        throw new Error(
          `Acesso Negado: O cuidador ativo (${currentCaregiver.displayName}) não possui vínculo com a criança do cofre (${incomingChild.name}).`
        );
      }

      // Se for modo 'replace', exige privilégio de LEGAL_GUARDIAN
      if (mode === 'replace' && currentCaregiver.role !== 'LEGAL_GUARDIAN') {
        throw new Error(
          `Acesso Negado: Apenas Responsáveis Legais (LEGAL_GUARDIAN) podem substituir completamente o acervo de observações.`
        );
      }

      if (!canManageChildProfile(currentCaregiver, incomingChild.id)) {
        throw new Error('Acesso negado: aplicar perfil de cofre exige responsável legal ativo e vinculado.');
      }

      // 5. Validação relacional das observações (SEC-11)
      for (const obs of validated.observations) {
        if (obs.childId !== incomingChild.id) {
          throw new Error(
            `Inconsistência relacional: observação ${obs.id} possui childId divergente (${obs.childId}).`
          );
        }
      }

      // 6. Validação de referências (SEC-15):
      // Todo recordedByCaregiverId deve corresponder a um cuidador conhecido (existente ou declarado no cofre)
      const allKnownCaregiverIds = new Set([
        ...caregivers.map((c) => c.id),
        ...(validated.linkedCaregivers || []).map((c) => c.id),
      ]);
      for (const obs of validated.observations) {
        if (!allKnownCaregiverIds.has(obs.recordedByCaregiverId)) {
          throw new Error(
            `Referência inválida: observação ${obs.id} referencia cuidador desconhecido (${obs.recordedByCaregiverId}).`
          );
        }
        if (obs.observedByCaregiverId && !allKnownCaregiverIds.has(obs.observedByCaregiverId)) {
          throw new Error(
            `Referência inválida: observação ${obs.id} referencia observador desconhecido (${obs.observedByCaregiverId}).`
          );
        }
      }

      // 7. Resolução Canônica de Conflitos e Ordenação Determinística (SEC-14)
      let nextObservations: Observation[];
      if (mode === 'replace') {
        const withoutChild = observations.filter((o) => o.childId !== incomingChild.id);
        nextObservations = [...validated.observations, ...withoutChild];
      } else {
        // SEC-14: Resolução determinística e pura sem last-write-wins
        const batchResult = resolveObservationBatch(
          observations,
          validated.observations,
          incomingChild.id
        );

        if (!batchResult.success) {
          const firstConflict = batchResult.conflicts[0];
          throw new Error(
            `Conflito de mesclagem não resolvido (${firstConflict.incomingId}): ${firstConflict.reason}`
          );
        }

        nextObservations = batchResult.resolvedObservations;
      }

      // 8. Prevenção de elevação de privilégios de cuidadores importados
      let nextCaregivers = caregivers;
      if (validated.linkedCaregivers && validated.linkedCaregivers.length > 0) {
        const existingCgMap = new Map(caregivers.map((c) => [c.id, c]));
        validated.linkedCaregivers.forEach((cg) => {
          if (!existingCgMap.has(cg.id)) {
            existingCgMap.set(cg.id, cg);
          }
        });
        nextCaregivers = Array.from(existingCgMap.values());
      }

      // 9. Preparação do novo perfil da criança
      const nextProfiles = profiles.some((p) => p.id === incomingChild.id)
        ? profiles.map((p) => (p.id === incomingChild.id ? incomingChild : p))
        : [...profiles, incomingChild];

      // 10. Commit Atômico em Memória (Zero mutação em caso de qualquer exceção prévia) (SEC-16)
      setProfiles(nextProfiles);
      setObservations(nextObservations);
      setCaregivers(nextCaregivers);
      setActiveProfileId(incomingChild.id);
      setSelectedObservationIds(
        nextObservations.filter((o) => o.childId === incomingChild.id).map((o) => o.id)
      );

      // Os setters do domínio invalidam preparações anteriores antes do commit React.

      const msg = `Cofre de ${incomingChild.name} importado com sucesso (${validated.observations.length} observações processadas).`;
      showNotification(msg, 'success');
      return { success: true, importedCount: validated.observations.length, message: msg };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Erro ao processar dados do cofre.';
      showNotification(`Falha na importação: ${errMsg}`, 'error');
      return { success: false, importedCount: 0, message: errMsg };
    } finally {
      domainConcurrencyManager.releaseLock(operationId);
    }
  };

  const isAllEmpty = activeChildObservations.length === 0;

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setScreen: setCurrentScreen,
        activeProfile,
        availableProfiles: profiles,
        caregivers,
        activeCaregiver,
        switchCaregiver,
        isLinkedToActiveChild,
        canReadProfile,
        canManageProfile,
        canRead,
        canCreate,
        canEdit,
        canDelete,
        canReport,
        canIncludeInReport: canReport,
        switchProfile,
        activeChildPerspectives,
        executePerspectiveCommand,
        allObservations: observations,
        activeChildObservations,
        selectedObservationIds,
        filterEventType,
        setFilterEventType,
        filterEnvironment,
        setFilterEnvironment,
        searchQuery,
        setSearchQuery,
        addObservation,
        updateObservation,
        deleteObservation,
        toggleSelectObservation,
        selectAllObservations,
        updateProfile,
        addInterest,
        removeInterest,
        addComfortAnchor,
        removeComfortAnchor,
        addSensitivity,
        removeSensitivity,
        addCommunicationMode,
        removeCommunicationMode,
        addCelebratedMilestone,
        removeCelebratedMilestone,
        addSupportStrategy,
        removeSupportStrategy,
        clearActiveChildObservationsToEmpty,
        restoreDemoData,
        isAllEmpty,
        notification,
        showNotification,
        clearNotification,
        exportVault,
        importVaultPayload,
        domainConcurrencyManager,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
