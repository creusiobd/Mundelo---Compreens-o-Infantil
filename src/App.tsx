/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Observation, OfflineDiscovery, ProvenanceType } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { NotificationToast } from './components/NotificationToast';
import { ObservationModal } from './components/ObservationModal';
import { ObservationDetailModal } from './components/ObservationDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { VaultExportModal } from './components/VaultExportModal';
import { VaultImportModal } from './components/VaultImportModal';

import { WelcomeScreen } from './screens/WelcomeScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { JournalScreen } from './screens/JournalScreen';
import { MyWorldScreen } from './screens/MyWorldScreen';
import { DiscoveriesScreen } from './screens/DiscoveriesScreen';
import { UnderstandScreen } from './screens/UnderstandScreen';
import { ReportScreen } from './screens/ReportScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';

// Rota exclusiva de desenvolvimento/auditoria (/security-lab) — ausente no build de produção
const LazySecurityLab = import.meta.env.DEV
  ? /* @__PURE__ */ React.lazy(() =>
      import('./screens/SecurityLabScreen').then((m) => ({
        default: m.SecurityLabScreen,
      }))
    )
  : null;

const MainAppContent: React.FC = () => {
  const {
    currentScreen,
    activeProfile,
    activeCaregiver,
    addObservation,
    updateObservation,
    deleteObservation,
    selectedObservationIds,
    toggleSelectObservation,
  } = useApp();

  // Estado para rota /security-lab exclusivamente em DEV
  const [isSecurityLabOpen, setIsSecurityLabOpen] = useState<boolean>(() => {
    if (!import.meta.env.DEV || typeof window === 'undefined') return false;
    return (
      window.location.pathname === '/security-lab' ||
      window.location.hash === '#/security-lab'
    );
  });

  // Modal States
  const [isObsModalOpen, setIsObsModalOpen] = useState(false);
  const [editingObs, setEditingObs] = useState<Observation | null>(null);

  const [detailObs, setDetailObs] = useState<Observation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Vault Modals (Foundation v0.4A Web Crypto)
  const [isExportVaultOpen, setIsExportVaultOpen] = useState(false);
  const [isImportVaultOpen, setIsImportVaultOpen] = useState(false);

  // Open New Observation
  const handleOpenNewObservation = () => {
    setEditingObs(null);
    setIsObsModalOpen(true);
  };

  // Open Edit Observation
  const handleEditObservation = (obs: Observation) => {
    setEditingObs(obs);
    setIsObsModalOpen(true);
    setIsDetailModalOpen(false);
  };

  // Open Details Modal
  const handleSelectObservation = (obs: Observation) => {
    setDetailObs(obs);
    setIsDetailModalOpen(true);
  };

  // Trigger Delete Confirmation
  const handleRequestDelete = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteObservation(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  // Handle Discovery Activity to Observation Form pre-fill
  const handleStartObservationFromDiscovery = (discovery: OfflineDiscovery) => {
    const prefill: Observation = {
      id: '',
      childId: activeProfile.id,
      recordedByCaregiverId: activeCaregiver.id,
      revision: 1,
      occurredAt: new Date().toISOString().slice(0, 16),
      recordedAt: new Date().toISOString(),
      provenance: 'DIRECT',
      environment: 'casa',
      observerRole: 'mae',
      eventType: 'descoberta',
      description: `Vivenciamos a atividade offline "${discovery.title}". `,
      antecedents: `Materiais utilizados: ${discovery.materials.join(', ')}. Clima tranquilo.`,
      communicationSignals: 'Atenção visual, curiosidade com os materiais e gestos espontâneos.',
      supportOffered: `Acompanhamento calmo: ${discovery.steps[0] || 'Mediação atenta'}`,
      observedOutcome: 'Explorou a proposta com satisfação e interesse.',
      positiveAspects: `Engajamento sensorial, exploração no foco de ${discovery.category}.`,
      notes: `Hipótese observacional: Propostas lúdicas estruturadas com materiais simples favorecem o foco e a conexão.`,
    };
    setEditingObs(prefill);
    setIsObsModalOpen(true);
  };

  const handleFormSubmit = (
    data: Omit<
      Observation,
      'id' | 'childId' | 'recordedAt' | 'recordedByCaregiverId' | 'revision' | 'updatedAt'
    > & {
      provenance?: ProvenanceType;
      reportedByLabel?: string;
    }
  ) => {
    if (editingObs && editingObs.id) {
      updateObservation(editingObs.id, data);
    } else {
      addObservation(data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#133E43]">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-[#133E43] focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:shadow-lg focus:outline-none"
      >
        Pular para o conteúdo principal
      </a>

      {/* Top Bar Header */}
      <Header onOpenNewObservation={handleOpenNewObservation} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 pb-20 lg:pb-12 focus:outline-none">
        {import.meta.env.DEV && isSecurityLabOpen && LazySecurityLab ? (
          <React.Suspense
            fallback={
              <div className="p-12 text-center text-sm text-[#133E43]">
                Carregando Laboratório de Benchmark SEC-23...
              </div>
            }
          >
            <LazySecurityLab
              onBackToApp={() => {
                setIsSecurityLabOpen(false);
                if (typeof window !== 'undefined' && window.location.pathname === '/security-lab') {
                  window.history.pushState({}, '', '/');
                }
              }}
            />
          </React.Suspense>
        ) : (
          <>
            {currentScreen === 'welcome' && <WelcomeScreen />}
            {currentScreen === 'onboarding' && <OnboardingScreen />}
            {currentScreen === 'home' && (
              <HomeScreen
                onOpenNewObservation={handleOpenNewObservation}
                onSelectObservation={handleSelectObservation}
              />
            )}
            {currentScreen === 'journal' && (
              <JournalScreen
                onOpenNewObservation={handleOpenNewObservation}
                onSelectObservation={handleSelectObservation}
                onEditObservation={handleEditObservation}
                onRequestDeleteObservation={handleRequestDelete}
                onOpenExportVault={() => setIsExportVaultOpen(true)}
                onOpenImportVault={() => setIsImportVaultOpen(true)}
              />
            )}
            {currentScreen === 'world' && <MyWorldScreen />}
            {currentScreen === 'discoveries' && (
              <DiscoveriesScreen
                onStartObservationFromDiscovery={handleStartObservationFromDiscovery}
              />
            )}
            {currentScreen === 'understand' && <UnderstandScreen />}
            {currentScreen === 'report' && <ReportScreen />}
            {currentScreen === 'privacy' && (
              <PrivacyScreen
                onOpenExportVault={() => setIsExportVaultOpen(true)}
                onOpenImportVault={() => setIsImportVaultOpen(true)}
                onOpenSecurityLab={
                  import.meta.env.DEV
                    ? () => {
                        setIsSecurityLabOpen(true);
                        if (typeof window !== 'undefined') {
                          window.history.pushState({}, '', '/security-lab');
                        }
                      }
                    : undefined
                }
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Thumb Navigation for Mobile */}
      <BottomNav />

      {/* Global Modals */}
      <ObservationModal
        isOpen={isObsModalOpen}
        onClose={() => setIsObsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingObs}
        childName={activeProfile.name}
      />

      <ObservationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        observation={detailObs}
        onEdit={handleEditObservation}
        onDelete={handleRequestDelete}
        isSelectedForReport={
          detailObs ? selectedObservationIds.includes(detailObs.id) : false
        }
        onToggleReportSelection={(id) => toggleSelectObservation(id)}
        childName={activeProfile.name}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Observação"
        message="Deseja realmente remover esta anotação da memória de demonstração da sessão?"
      />

      {/* Experimental Vault Modals */}
      <VaultExportModal
        isOpen={isExportVaultOpen}
        onClose={() => setIsExportVaultOpen(false)}
      />

      <VaultImportModal
        isOpen={isImportVaultOpen}
        onClose={() => setIsImportVaultOpen(false)}
      />

      {/* Polite Live Region Toast */}
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
