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
import { safeValidateObservation } from '../validation/schemas';
import { VaultPayload } from '../crypto/types';
import { VaultPayloadSchema } from '../crypto/schemas';
import {
  canReadObservation,
  canCreateObservation,
  canEditObservation,
  canDeleteObservation,
  canIncludeInReport,
} from '../security/authorization';
import { resolveObservationBatch } from '../security/conflictResolver';
import { DomainConcurrencyManager } from '../security/domainLock';

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
  canCreate: boolean;
  canEdit: (obs: Observation) => boolean;
  canDelete: (obs: Observation) => boolean;
  canReport: (obs: Observation) => boolean;
  canIncludeInReport: (obs: Observation) => boolean;
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
  updateProfile: (profile: Partial<ChildProfile>) => void;
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;
  addComfortAnchor: (anchor: string) => void;
  removeComfortAnchor: (anchor: string) => void;
  addSensitivity: (sensitivity: string) => void;
  removeSensitivity: (sensitivity: string) => void;
  addCommunicationMode: (mode: string) => void;
  removeCommunicationMode: (mode: string) => void;
  addCelebratedMilestone: (milestone: string) => void;
  removeCelebratedMilestone: (milestone: string) => void;
  addSupportStrategy: (strategy: Omit<SupportStrategy, 'id'>) => void;
  removeSupportStrategy: (strategyId: string) => void;
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

    if (!activeCaregiver.linkedChildIds.includes(profileId)) {
      showNotification(
        `Aviso de Autorização: ${activeCaregiver.displayName} não possui vínculo ativo com ${target.name}. Acesso restrito.`,
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
        `Simulação de Cuidador: ${target.displayName} (${target.role}). Sem vínculo com ${activeProfile.name}.`,
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
        newObs.provenance === 'DIRECT' ? activeCaregiver.id : undefined,
      reportedByLabel:
        newObs.provenance === 'REPORTED_BY_OTHER'
          ? newObs.reportedByLabel || 'Relato de terceiro'
          : undefined,
      provenance: newObs.provenance || 'DIRECT',
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
    showNotification('Observação canônica registrada com proveniência e autoria.', 'success');
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

    // 2. Authorization Gate: Only LEGAL_GUARDIAN can delete
    if (!canDeleteObservation(activeCaregiver, activeProfileId, target)) {
      showNotification(
        'Acesso Negado: Apenas Responsáveis Legais (LEGAL_GUARDIAN) vinculados podem excluir observações.',
        'error'
      );
      return false;
    }

    setObservations((prev) => prev.filter((item) => item.id !== id));
    setSelectedObservationIds((prev) => prev.filter((item) => item !== id));
    showNotification('Observação excluída da memória da sessão.', 'info');
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

  const updateProfile = (updatedFields: Partial<ChildProfile>) => {
    if (activeCaregiver.role !== 'LEGAL_GUARDIAN') {
      showNotification(
        'Aviso: Apenas Responsáveis Legais têm permissão para editar dados centrais do perfil da criança.',
        'error'
      );
      return;
    }
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfileId ? { ...p, ...updatedFields } : p))
    );
    showNotification('Perfil demonstrativo atualizado.', 'success');
  };

  const addInterest = (interest: string) => {
    if (!interest.trim()) return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, interests: [...p.interests, interest.trim()] }
          : p
      )
    );
    showNotification('Interesse adicionado com sucesso.', 'success');
  };

  const removeInterest = (interest: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, interests: p.interests.filter((i) => i !== interest) }
          : p
      )
    );
  };

  const addComfortAnchor = (anchor: string) => {
    if (!anchor.trim()) return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, comfortAnchors: [...p.comfortAnchors, anchor.trim()] }
          : p
      )
    );
    showNotification('Fonte de conforto registrada.', 'success');
  };

  const removeComfortAnchor = (anchor: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, comfortAnchors: p.comfortAnchors.filter((a) => a !== anchor) }
          : p
      )
    );
  };

  const addSensitivity = (sensitivity: string) => {
    if (!sensitivity.trim()) return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, sensitivities: [...p.sensitivities, sensitivity.trim()] }
          : p
      )
    );
    showNotification('Sensibilidade contextual anotada.', 'success');
  };

  const removeSensitivity = (sensitivity: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, sensitivities: p.sensitivities.filter((s) => s !== sensitivity) }
          : p
      )
    );
  };

  const addCommunicationMode = (mode: string) => {
    if (!mode.trim()) return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, communicationModes: [...p.communicationModes, mode.trim()] }
          : p
      )
    );
    showNotification('Forma de comunicação adicionada.', 'success');
  };

  const removeCommunicationMode = (mode: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, communicationModes: p.communicationModes.filter((m) => m !== mode) }
          : p
      )
    );
  };

  const addCelebratedMilestone = (milestone: string) => {
    if (!milestone.trim()) return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, celebratedMilestones: [...p.celebratedMilestones, milestone.trim()] }
          : p
      )
    );
    showNotification('Conquista afetiva celebrada e salva.', 'success');
  };

  const removeCelebratedMilestone = (milestone: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, celebratedMilestones: p.celebratedMilestones.filter((m) => m !== milestone) }
          : p
      )
    );
  };

  const addSupportStrategy = (strategy: Omit<SupportStrategy, 'id'>) => {
    const newStrategy: SupportStrategy = {
      ...strategy,
      id: `strat-${Date.now()}`,
    };
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, supportStrategies: [...p.supportStrategies, newStrategy] }
          : p
      )
    );
    showNotification('Estratégia de acolhimento registrada.', 'success');
  };

  const removeSupportStrategy = (strategyId: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, supportStrategies: p.supportStrategies.filter((s) => s.id !== strategyId) }
          : p
      )
    );
  };

  // Clears observations of the active child (requires LEGAL_GUARDIAN permission)
  const clearActiveChildObservationsToEmpty = () => {
    if (activeCaregiver.role !== 'LEGAL_GUARDIAN') {
      showNotification(
        'Acesso Negado: Apenas Responsáveis Legais podem zerar o acervo de observações.',
        'error'
      );
      return;
    }
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
        canCreate,
        canEdit,
        canDelete,
        canReport,
        canIncludeInReport: canReport,
        switchProfile,
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
