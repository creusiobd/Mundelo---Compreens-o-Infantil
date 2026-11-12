import React, { useState, useEffect, useRef } from 'react';
import {
  Observation,
  EnvironmentType,
  ObserverRole,
  EventType,
  ProvenanceType,
} from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  AlertCircle,
  Eye,
  Lightbulb,
  CheckCircle2,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Layers,
  FileText,
} from 'lucide-react';

interface ObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<
      Observation,
      'id' | 'childId' | 'recordedAt' | 'recordedByCaregiverId' | 'revision' | 'updatedAt'
    > & {
      provenance?: ProvenanceType;
      reportedByLabel?: string;
    }
  ) => void;
  initialData?: Observation | null;
  childName: string;
}

export type ObservationFocusMode = 'facts' | 'hypothesis' | 'split';

export const ObservationModal: React.FC<ObservationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  childName,
}) => {
  const { activeCaregiver, canCreate, canEdit } = useApp();

  const [occurredAt, setOccurredAt] = useState('');
  const [environment, setEnvironment] = useState<EnvironmentType>('casa');
  const [observerRole, setObserverRole] = useState<ObserverRole>('mae');
  const [eventType, setEventType] = useState<EventType>('descoberta');
  const [provenance, setProvenance] = useState<ProvenanceType>('DIRECT');
  const [reportedByLabel, setReportedByLabel] = useState('');
  const [description, setDescription] = useState('');
  const [antecedents, setAntecedents] = useState('');
  const [communicationSignals, setCommunicationSignals] = useState('');
  const [supportOffered, setSupportOffered] = useState('');
  const [observedOutcome, setObservedOutcome] = useState('');
  const [positiveAspects, setPositiveAspects] = useState('');
  const [notes, setNotes] = useState('');

  // Visual focus state: controls rapid switching & epistemological distinction between Facts vs Hypotheses
  const [focusMode, setFocusMode] = useState<ObservationFocusMode>('facts');
  const [activeInputZone, setActiveInputZone] = useState<'facts' | 'hypothesis'>('facts');

  const [errors, setErrors] = useState<{ description?: string }>({});

  const descriptionInputRef = useRef<HTMLTextAreaElement | null>(null);
  const hypothesisInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setOccurredAt(initialData.occurredAt);
      setEnvironment(initialData.environment);
      setObserverRole(initialData.observerRole);
      setEventType(initialData.eventType);
      setProvenance(initialData.provenance || 'DIRECT');
      setReportedByLabel(initialData.reportedByLabel || '');
      setDescription(initialData.description);
      setAntecedents(initialData.antecedents);
      setCommunicationSignals(initialData.communicationSignals);
      setSupportOffered(initialData.supportOffered);
      setObservedOutcome(initialData.observedOutcome);
      setPositiveAspects(initialData.positiveAspects);
      setNotes(initialData.notes);
      setFocusMode('split');
      setActiveInputZone('facts');
    } else {
      const now = new Date();
      const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setOccurredAt(localIso);
      setEnvironment('casa');
      setObserverRole(
        activeCaregiver.role === 'EDUCATOR'
          ? 'educador'
          : activeCaregiver.role === 'PROFESSIONAL'
          ? 'terapeuta'
          : activeCaregiver.displayName.toLowerCase().includes('pai')
          ? 'pai'
          : activeCaregiver.displayName.toLowerCase().includes('avó')
          ? 'avo'
          : 'mae'
      );
      setEventType('conquista');
      setProvenance('DIRECT');
      setReportedByLabel('');
      setDescription('');
      setAntecedents('');
      setCommunicationSignals('');
      setSupportOffered('');
      setObservedOutcome('');
      setPositiveAspects('');
      setNotes('');
      setFocusMode('facts');
      setActiveInputZone('facts');
    }
    setErrors({});
  }, [initialData, isOpen, activeCaregiver]);

  if (!isOpen) return null;

  const isEditing = Boolean(initialData && initialData.id);
  const isAllowedToProceed = isEditing
    ? initialData
      ? canEdit(initialData)
      : false
    : canCreate;

  const switchFocusMode = (targetMode: ObservationFocusMode, autoFocusInput = true) => {
    setFocusMode(targetMode);
    if (targetMode === 'facts') {
      setActiveInputZone('facts');
      if (autoFocusInput) {
        setTimeout(() => descriptionInputRef.current?.focus(), 40);
      }
    } else if (targetMode === 'hypothesis') {
      setActiveInputZone('hypothesis');
      if (autoFocusInput) {
        setTimeout(() => hypothesisInputRef.current?.focus(), 40);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.trim().length < 3) {
      setErrors({
        description:
          'Por favor, descreva o que foi observado objetivamente (mínimo de 3 caracteres).',
      });
      setFocusMode('facts');
      setActiveInputZone('facts');
      setTimeout(() => descriptionInputRef.current?.focus(), 40);
      return;
    }

    onSubmit({
      occurredAt: occurredAt || new Date().toISOString().slice(0, 16),
      environment,
      observerRole,
      eventType,
      provenance,
      reportedByLabel:
        provenance === 'REPORTED_BY_OTHER'
          ? reportedByLabel.trim() || 'Relato de terceiro'
          : undefined,
      description: description.trim(),
      antecedents: antecedents.trim() || 'Não observado',
      communicationSignals: communicationSignals.trim() || 'Não observado',
      supportOffered:
        supportOffered.trim() || 'Apenas observação atenta sem intervenção',
      observedOutcome: observedOutcome.trim() || 'Não observado',
      positiveAspects: positiveAspects.trim() || 'Não observado',
      notes: notes.trim() || 'Registro sem hipóteses adicionais.',
    });
    onClose();
  };

  const setHelperValue = (setter: (val: string) => void, val: string) => {
    setter(val);
  };

  const appendHypothesisPrompt = (prefix: string) => {
    setActiveInputZone('hypothesis');
    if (!notes.trim() || notes === 'Não sei / Apenas registrando os fatos') {
      setNotes(prefix);
    } else if (!notes.includes(prefix)) {
      setNotes(`${notes.trim()}\n${prefix}`);
    }
    setTimeout(() => hypothesisInputRef.current?.focus(), 30);
  };

  const hasFactsFilled = description.trim().length >= 3;
  const hasHypothesisFilled =
    notes.trim().length > 0 &&
    notes.trim() !== 'Não sei / Apenas registrando os fatos' &&
    notes.trim() !== 'Registro sem hipóteses adicionais.';

  const showFactsSection = focusMode === 'facts' || focusMode === 'split';
  const showHypothesisSection = focusMode === 'hypothesis' || focusMode === 'split';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div className="relative bg-[#F8F5EF] rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#133E43]/15 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#133E43]/10 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#80C5B5]/20 flex items-center justify-center text-[#133E43]">
              <Sparkles className="w-4 h-4 text-[#133E43]" />
            </div>
            <div>
              <h2
                id="modal-title"
                className="text-base sm:text-lg font-bold text-[#133E43] font-display"
              >
                {initialData ? 'Editar Observação' : 'Nova Observação no Diário'}
              </h2>
              <p className="text-xs text-[#265358]">
                Observando {childName} com olhar afetuoso e livre de rótulos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#265358] hover:text-[#133E43] hover:bg-[#133E43]/5 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar formulário de observação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sticky Epistemological Tabs Navigation (#observation-tabs-container): Fato vs Hipótese */}
        <div
          id="observation-tabs-container"
          className="px-5 py-3.5 bg-white border-b border-[#133E43]/15 space-y-2.5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div
              role="tablist"
              aria-label="Navegação entre entrada de Fatos e Hipóteses do cuidador"
              onKeyDown={(e) => {
                const modes: ObservationFocusMode[] = ['facts', 'hypothesis', 'split'];
                const currentIdx = modes.indexOf(focusMode);
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  const next = modes[(currentIdx + 1) % modes.length];
                  switchFocusMode(next, next !== 'split');
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  const prev = modes[(currentIdx - 1 + modes.length) % modes.length];
                  switchFocusMode(prev, prev !== 'split');
                } else if (e.key === 'Home') {
                  e.preventDefault();
                  switchFocusMode('facts', true);
                } else if (e.key === 'End') {
                  e.preventDefault();
                  switchFocusMode('split', false);
                }
              }}
              className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#F8F5EF] rounded-2xl border border-[#133E43]/15"
            >
              {/* Aba 1: Fato (Objetivo) */}
              <button
                id="tab-facts"
                type="button"
                role="tab"
                aria-selected={focusMode === 'facts'}
                aria-controls="tabpanel-facts"
                tabIndex={focusMode === 'facts' ? 0 : -1}
                onClick={() => switchFocusMode('facts')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133E43] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EF] ${
                  focusMode === 'facts'
                    ? 'bg-[#133E43] text-[#F8F5EF] border border-[#133E43] shadow-xs'
                    : 'bg-white/70 text-[#133E43] border border-transparent hover:bg-white hover:border-[#133E43]/25'
                }`}
              >
                <Eye
                  className={`w-4 h-4 shrink-0 ${
                    focusMode === 'facts' ? 'text-[#80C5B5]' : 'text-[#133E43]'
                  }`}
                />
                <span>1. Fatos (Objetivo)</span>
                {hasFactsFilled && (
                  <span
                    className={`text-[10px] font-semibold ${
                      focusMode === 'facts' ? 'text-[#80C5B5]' : 'text-[#265358]'
                    }`}
                  >
                    · Preenchido
                  </span>
                )}
              </button>

              {/* Aba 2: Hipótese (Subjetivo) */}
              <button
                id="tab-hypothesis"
                type="button"
                role="tab"
                aria-selected={focusMode === 'hypothesis'}
                aria-controls="tabpanel-hypothesis"
                tabIndex={focusMode === 'hypothesis' ? 0 : -1}
                onClick={() => switchFocusMode('hypothesis')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133E43] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EF] ${
                  focusMode === 'hypothesis'
                    ? 'bg-[#F1CA91] text-[#133E43] border border-[#133E43] shadow-xs'
                    : 'bg-white/70 text-[#133E43] border border-transparent hover:bg-white hover:border-[#133E43]/25'
                }`}
              >
                <Lightbulb className="w-4 h-4 shrink-0 text-[#133E43]" />
                <span>2. Hipóteses (Subjetivo)</span>
                {hasHypothesisFilled && (
                  <span className="text-[10px] font-semibold text-[#133E43]">
                    · Preenchido
                  </span>
                )}
              </button>

              {/* Aba 3: Visão Completa */}
              <button
                id="tab-split"
                type="button"
                role="tab"
                aria-selected={focusMode === 'split'}
                aria-controls="tabpanel-facts tabpanel-hypothesis"
                tabIndex={focusMode === 'split' ? 0 : -1}
                onClick={() => switchFocusMode('split', false)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133E43] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EF] ${
                  focusMode === 'split'
                    ? 'bg-[#133E43] text-[#F8F5EF] border border-[#133E43] shadow-xs'
                    : 'bg-white/70 text-[#133E43] border border-transparent hover:bg-white hover:border-[#133E43]/25'
                }`}
              >
                <Layers
                  className={`w-4 h-4 shrink-0 ${
                    focusMode === 'split' ? 'text-[#80C5B5]' : 'text-[#133E43]'
                  }`}
                />
                <span>Visão Integrada</span>
              </button>
            </div>

            {/* Active Epistemological State Indicator (WCAG AA Contrast) */}
            <div
              aria-live="polite"
              className={`px-3.5 py-2 rounded-xl border text-xs flex items-center gap-2 transition-colors min-h-[40px] ${
                activeInputZone === 'facts'
                  ? 'bg-[#80C5B5]/25 border-[#133E43]/30 text-[#133E43]'
                  : 'bg-[#F1CA91]/35 border-[#133E43]/35 text-[#133E43]'
              }`}
            >
              {activeInputZone === 'facts' ? (
                <>
                  <Eye className="w-4 h-4 text-[#133E43] shrink-0" />
                  <span>
                    <strong>Foco Ativo · Fatos:</strong> Registro concreto (sem interpretar)
                  </span>
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4 text-[#133E43] shrink-0" />
                  <span>
                    <strong>Foco Ativo · Hipótese:</strong> Impressão subjetiva do cuidador
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto p-5 sm:p-6 space-y-5 text-sm"
        >
          {/* Active Caregiver Banner */}
          <div
            className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
              isAllowedToProceed
                ? 'bg-white border-[#133E43]/15 text-[#133E43]'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#80C5B5] shrink-0" />
              <div>
                <span>Registrando como: </span>
                <strong className="font-semibold">{activeCaregiver.displayName}</strong>
                <span className="text-[#265358]">
                  {' '}
                  ({activeCaregiver.relationshipLabel || activeCaregiver.role})
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#133E43]">
              {activeCaregiver.status === 'ACTIVE' ? 'Status: Ativo' : 'Status: Suspenso'}
            </span>
          </div>

          {!isAllowedToProceed && (
            <div className="p-3.5 bg-red-50 border border-red-300 rounded-2xl text-xs text-red-800 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div>
                <strong className="font-semibold">
                  Ação Bloqueada pela Política Demonstrativa:
                </strong>
                <p className="mt-0.5 leading-relaxed">
                  {activeCaregiver.status !== 'ACTIVE'
                    ? `O cuidador ${activeCaregiver.displayName} está atualmente SUSPENSO e não tem permissão para registrar ou alterar observações.`
                    : `O cuidador ${activeCaregiver.displayName} não possui vínculo ativo com ${childName}. Pelo princípio do menor privilégio, apenas cuidadores vinculados à criança podem registrar ou editar.`}
                </p>
                <p className="mt-1 text-[11px] text-red-700/80">
                  Para simular com permissão, alterne o cuidador ativo no seletor do cabeçalho (ex: Helena ou Carlos).
                </p>
              </div>
            </div>
          )}

          {/* =====================================================================
              ZONA 1: FATOS OBSERVÁVEIS E CONTEXTO CONCRETO (OBJETIVO)
             ===================================================================== */}
          {showFactsSection && (
            <section
              id="tabpanel-facts"
              role="tabpanel"
              aria-labelledby="tab-facts"
              onFocusCapture={() => setActiveInputZone('facts')}
              className={`rounded-3xl p-4 sm:p-5 border transition-all space-y-5 ${
                activeInputZone === 'facts'
                  ? 'bg-white border-[#133E43] ring-2 ring-[#80C5B5]/45 shadow-sm'
                  : 'bg-white/75 border-[#133E43]/15 opacity-90'
              }`}
            >
              {/* Zone Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#133E43]/10">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#80C5B5]/25 flex items-center justify-center shrink-0 text-[#133E43] mt-0.5">
                    <Eye className="w-4 h-4 text-[#133E43]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#265358]">
                      <span className="font-semibold text-[#133E43]">Camada 1 · Registro Objetivo</span>
                      <span aria-hidden="true">·</span>
                      <span>Evidência Observacional</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#133E43] font-display">
                      Fatos Concretos e Contexto do Momento
                    </h3>
                    <p className="text-xs text-[#265358] mt-0.5">
                      Descreva apenas o que pôde ser visto ou ouvido diretamente, como uma câmera filmando a cena, sem interpretar intenções.
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 1: Tipo de Evento & Proveniência */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#133E43] mb-2">
                    Tipo de Observação <span className="text-[#8C4F48]">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(
                      [
                        { id: 'conquista', label: 'Conquista', desc: 'Passo ou descoberta celebrada' },
                        { id: 'desconforto', label: 'Desconforto', desc: 'Sensibilidade ou cansaço' },
                        { id: 'rotina', label: 'Rotina', desc: 'Sono, refeição, transição' },
                        { id: 'descoberta', label: 'Descoberta', desc: 'Exploração do ambiente' },
                      ] as const
                    ).map((t) => {
                      const isSelected = eventType === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setEventType(t.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all min-h-[52px] ${
                            isSelected
                              ? 'border-[#133E43] bg-[#133E43] text-white shadow-xs'
                              : 'border-[#133E43]/15 bg-[#F8F5EF]/60 text-[#133E43] hover:border-[#133E43]/40'
                          }`}
                        >
                          <div className="font-semibold text-xs leading-none">{t.label}</div>
                          <div
                            className={`text-[10px] mt-1 leading-tight ${
                              isSelected ? 'text-[#80C5B5]' : 'text-[#265358]'
                            }`}
                          >
                            {t.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Proveniência */}
                <div>
                  <span className="block text-xs font-semibold text-[#133E43] mb-1.5">
                    Proveniência da Observação
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setProvenance('DIRECT')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-colors min-h-[44px] ${
                        provenance === 'DIRECT'
                          ? 'bg-[#133E43] text-white border-[#133E43]'
                          : 'bg-[#F8F5EF]/60 text-[#133E43] border-[#133E43]/15 hover:border-[#133E43]/30'
                      }`}
                    >
                      <strong className="block">Observação Direta (DIRECT)</strong>
                      <span
                        className={`text-[10px] ${
                          provenance === 'DIRECT' ? 'text-[#80C5B5]' : 'text-[#265358]'
                        }`}
                      >
                        Presenciada pessoalmente pelo observador
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProvenance('REPORTED_BY_OTHER')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-colors min-h-[44px] ${
                        provenance === 'REPORTED_BY_OTHER'
                          ? 'bg-[#133E43] text-white border-[#133E43]'
                          : 'bg-[#F8F5EF]/60 text-[#133E43] border-[#133E43]/15 hover:border-[#133E43]/30'
                      }`}
                    >
                      <strong className="block">Relatada por Terceiros (REPORTED_BY_OTHER)</strong>
                      <span
                        className={`text-[10px] ${
                          provenance === 'REPORTED_BY_OTHER'
                            ? 'text-[#80C5B5]'
                            : 'text-[#265358]'
                        }`}
                      >
                        Contada por outro cuidador, educador ou familiar
                      </span>
                    </button>
                  </div>

                  {provenance === 'REPORTED_BY_OTHER' && (
                    <div className="mt-2.5 p-3 bg-[#F8F5EF] rounded-xl border border-[#133E43]/20 space-y-1.5 animate-in fade-in duration-100">
                      <label
                        htmlFor="obs-reported-by"
                        className="block text-xs font-semibold text-[#133E43]"
                      >
                        Quem relatou este evento? <span className="text-[#8C4F48]">*</span>
                      </label>
                      <input
                        id="obs-reported-by"
                        type="text"
                        value={reportedByLabel}
                        onChange={(e) => setReportedByLabel(e.target.value)}
                        placeholder="Ex: Professora Ana (Creche), Tia Luísa, Avô Pedro"
                        className="w-full bg-white border border-[#133E43]/20 rounded-lg px-3 py-2 text-xs text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[40px]"
                      />
                      <p className="text-[10px] text-[#265358]">
                        A fonte é registrada textualmente como relatada, mantendo rastreabilidade sem exigir autenticação do terceiro.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Data/Hora, Ambiente, Papel do Observador */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="obs-date"
                    className="block text-xs font-semibold text-[#133E43] mb-1"
                  >
                    Data e Horário
                  </label>
                  <input
                    id="obs-date"
                    type="datetime-local"
                    value={occurredAt}
                    onChange={(e) => setOccurredAt(e.target.value)}
                    className="w-full bg-[#F8F5EF]/60 border border-[#133E43]/20 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="obs-env"
                    className="block text-xs font-semibold text-[#133E43] mb-1"
                  >
                    Ambiente
                  </label>
                  <select
                    id="obs-env"
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value as EnvironmentType)}
                    className="w-full bg-[#F8F5EF]/60 border border-[#133E43]/20 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px]"
                  >
                    <option value="casa">Casa</option>
                    <option value="parque">Parque / Ar Livre</option>
                    <option value="escola">Escola / Creche</option>
                    <option value="transporte_consulta">Transporte / Consulta</option>
                    <option value="reuniao_familia">Reunião Familiar</option>
                    <option value="outro">Outro Ambiente</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="obs-role"
                    className="block text-xs font-semibold text-[#133E43] mb-1"
                  >
                    Quem Observou?
                  </label>
                  <select
                    id="obs-role"
                    value={observerRole}
                    onChange={(e) => setObserverRole(e.target.value as ObserverRole)}
                    className="w-full bg-[#F8F5EF]/60 border border-[#133E43]/20 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px]"
                  >
                    <option value="mae">Mãe</option>
                    <option value="pai">Pai</option>
                    <option value="avo">Avó / Avô</option>
                    <option value="cuidador">Cuidador(a)</option>
                    <option value="educador">Educador(a)</option>
                    <option value="terapeuta">Terapeuta</option>
                    <option value="outro">Outro Observador</option>
                  </select>
                </div>
              </div>

              {/* Fatos Observáveis: Descrição Objetiva */}
              <div className="p-3.5 rounded-2xl bg-[#80C5B5]/10 border border-[#80C5B5]/35 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="obs-desc" className="block text-xs font-bold text-[#133E43]">
                    1. Fatos Observáveis (O que aconteceu objetivamente?){' '}
                    <span className="text-[#8C4F48]">*</span>
                  </label>
                  <span className="text-[11px] text-[#265358]">
                    Fato concreto · Sem julgar ou rotular
                  </span>
                </div>
                <textarea
                  ref={descriptionInputRef}
                  id="obs-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({});
                  }}
                  placeholder={`Ex: ${childName} empilhou 4 blocos no tapete da sala, olhou sorrindo para a mãe e bateu palmas quando a torre equilibrou.`}
                  className={`w-full bg-white border rounded-xl p-3 text-xs sm:text-sm text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none ${
                    errors.description ? 'border-red-400 bg-red-50/20' : 'border-[#133E43]/25'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Antecedentes Contextuais */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="obs-ante" className="block text-xs font-semibold text-[#133E43]">
                    2. O que vinha acontecendo antes? (Contexto / Antecedentes)
                  </label>
                  <button
                    type="button"
                    onClick={() => setHelperValue(setAntecedents, 'Não observado')}
                    className="text-[11px] text-[#265358] hover:text-[#133E43] underline min-h-[28px]"
                  >
                    Não observado
                  </button>
                </div>
                <textarea
                  id="obs-ante"
                  rows={2}
                  value={antecedents}
                  onChange={(e) => setAntecedents(e.target.value)}
                  placeholder="Ex: Luz natural suave, logo após o lanche da tarde; silêncio tranquilo na sala."
                  className="w-full bg-[#F8F5EF]/50 border border-[#133E43]/20 rounded-xl p-2.5 text-xs sm:text-sm text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none"
                />
              </div>

              {/* Sinais Expressivos & Comunicação da Criança */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="obs-comm" className="block text-xs font-semibold text-[#133E43]">
                    3. Sinais Corporais e Expressivos da Criança
                  </label>
                  <button
                    type="button"
                    onClick={() => setHelperValue(setCommunicationSignals, 'Não observado')}
                    className="text-[11px] text-[#265358] hover:text-[#133E43] underline min-h-[28px]"
                  >
                    Não observado
                  </button>
                </div>
                <textarea
                  id="obs-comm"
                  rows={2}
                  value={communicationSignals}
                  onChange={(e) => setCommunicationSignals(e.target.value)}
                  placeholder="Ex: Sorriso amplo, contato visual sustentado, apontar com indicador, respiração ritmada."
                  className="w-full bg-[#F8F5EF]/50 border border-[#133E43]/20 rounded-xl p-2.5 text-xs sm:text-sm text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none"
                />
              </div>

              {/* Acolhimento / Mediação Oferecida */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="obs-supp" className="block text-xs font-semibold text-[#133E43]">
                    4. Acolhimento ou Suporte Oferecido pelo Adulto
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setHelperValue(
                        setSupportOffered,
                        'Apenas observação atenta sem intervenção'
                      )
                    }
                    className="text-[11px] text-[#265358] hover:text-[#133E43] underline min-h-[28px]"
                  >
                    Apenas observação atenta
                  </button>
                </div>
                <textarea
                  id="obs-supp"
                  rows={2}
                  value={supportOffered}
                  onChange={(e) => setSupportOffered(e.target.value)}
                  placeholder="Ex: Sentei no chão na mesma altura, celebrei em tom suave e perguntei se queria colocar mais um bloco."
                  className="w-full bg-[#F8F5EF]/50 border border-[#133E43]/20 rounded-xl p-2.5 text-xs sm:text-sm text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none"
                />
              </div>

              {/* Desfecho Observado */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="obs-outcome"
                    className="block text-xs font-semibold text-[#133E43]"
                  >
                    5. Como a Criança Respondeu ao Suporte?
                  </label>
                  <button
                    type="button"
                    onClick={() => setHelperValue(setObservedOutcome, 'Não observado')}
                    className="text-[11px] text-[#265358] hover:text-[#133E43] underline min-h-[28px]"
                  >
                    Não observado
                  </button>
                </div>
                <textarea
                  id="obs-outcome"
                  rows={2}
                  value={observedOutcome}
                  onChange={(e) => setObservedOutcome(e.target.value)}
                  placeholder="Ex: Permaneceu focada por mais 6 minutos, demonstrando contentamento e calma."
                  className="w-full bg-[#F8F5EF]/50 border border-[#133E43]/20 rounded-xl p-2.5 text-xs sm:text-sm text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none"
                />
              </div>

              {/* Potências & Forças Percebidas */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="obs-pos" className="block text-xs font-semibold text-[#133E43]">
                    6. Potências e Forças Percebidas na Criança
                  </label>
                  <button
                    type="button"
                    onClick={() => setHelperValue(setPositiveAspects, 'Não observado')}
                    className="text-[11px] text-[#265358] hover:text-[#133E43] underline min-h-[28px]"
                  >
                    Não observado
                  </button>
                </div>
                <input
                  id="obs-pos"
                  type="text"
                  value={positiveAspects}
                  onChange={(e) => setPositiveAspects(e.target.value)}
                  placeholder="Ex: Persistência motora, entusiasmo investigativo, busca de afeto seguro."
                  className="w-full bg-[#F8F5EF]/50 border border-[#133E43]/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px]"
                />
              </div>

              {/* Quick Transition Action to Caregiver Hypotheses */}
              {focusMode === 'facts' && (
                <div className="pt-2 border-t border-[#133E43]/10 flex items-center justify-between gap-3">
                  <span className="text-xs text-[#265358]">
                    Deseja acrescentar uma percepção ou pergunta sobre esses fatos?
                  </span>
                  <button
                    type="button"
                    onClick={() => switchFocusMode('hypothesis')}
                    className="px-4 py-2 rounded-xl bg-[#F1CA91]/45 hover:bg-[#F1CA91]/70 text-[#133E43] border border-[#133E43]/20 font-semibold text-xs flex items-center gap-1.5 transition-colors min-h-[44px] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133E43] focus-visible:ring-offset-2"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-[#133E43]" />
                    <span>Alternar para Hipóteses</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </section>
          )}

          {/* =====================================================================
              ZONA 2: HIPÓTESES E REFLEXÕES DO CUIDADOR (SUBJETIVO / INTERPRETATIVO)
             ===================================================================== */}
          {showHypothesisSection && (
            <section
              id="tabpanel-hypothesis"
              role="tabpanel"
              aria-labelledby="tab-hypothesis"
              onFocusCapture={() => setActiveInputZone('hypothesis')}
              className={`rounded-3xl p-4 sm:p-5 border transition-all space-y-4 ${
                activeInputZone === 'hypothesis'
                  ? 'bg-[#F1CA91]/25 border-[#133E43] ring-2 ring-[#F1CA91]/70 shadow-sm'
                  : 'bg-[#F1CA91]/15 border-[#F1CA91]/40 opacity-90'
              }`}
            >
              {/* Zone Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#133E43]/10">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#F1CA91]/50 flex items-center justify-center shrink-0 text-[#133E43] mt-0.5">
                    <Lightbulb className="w-4 h-4 text-[#133E43]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#265358]">
                      <span className="font-semibold text-[#133E43]">
                        Camada 2 · Interpretação Subjetiva
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Hipótese Provisória</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#133E43] font-display">
                      7. Reflexões e Hipóteses do Cuidador (Subjetivo)
                    </h3>
                    <p className="text-xs text-[#265358] mt-0.5">
                      Importante: Hipóteses são impressões familiares para apoiar o diálogo e testar acolhimentos futuros — nunca rótulos ou conclusões diagnósticas.
                    </p>
                  </div>
                </div>

                {focusMode === 'hypothesis' && (
                  <button
                    type="button"
                    onClick={() => switchFocusMode('facts')}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8F5EF] text-[#133E43] border border-[#133E43]/25 text-xs font-semibold flex items-center gap-1.5 transition-colors min-h-[44px] whitespace-nowrap shrink-0 self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133E43] focus-visible:ring-offset-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar aos Fatos</span>
                  </button>
                )}
              </div>

              {/* Grounded Facts Reference Card when in Hypothesis-only mode */}
              {focusMode === 'hypothesis' && (
                <div className="p-3.5 rounded-2xl bg-white/90 border border-[#133E43]/15 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#265358]">
                    <span className="font-semibold flex items-center gap-1.5 text-[#133E43]">
                      <FileText className="w-3.5 h-3.5 text-[#80C5B5]" />
                      Base Factual Registrada (Para ancorar sua hipótese):
                    </span>
                    <button
                      type="button"
                      onClick={() => switchFocusMode('facts')}
                      className="text-[11px] underline text-[#265358] hover:text-[#133E43]"
                    >
                      Editar fatos
                    </button>
                  </div>
                  {description.trim() ? (
                    <p className="text-[#133E43] leading-relaxed italic">
                      &ldquo;{description.trim()}&rdquo;
                    </p>
                  ) : (
                    <p className="text-red-700 font-medium">
                      Nenhum fato objetivo foi descrito ainda. Lembre-se de preencher o campo 1 antes de salvar.
                    </p>
                  )}
                </div>
              )}

              {/* Quick Starters to reinforce hypothesis framing */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="obs-notes" className="block text-xs font-bold text-[#133E43]">
                    Sua Hipótese ou Pergunta para Conversa
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setHelperValue(setNotes, 'Não sei / Apenas registrando os fatos')
                    }
                    className="text-[11px] text-[#265358] hover:text-[#133E43] underline min-h-[28px]"
                  >
                    Apenas registrando fatos
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pb-1">
                  <span className="text-[11px] text-[#265358] mr-1">Iniciar com:</span>
                  <button
                    type="button"
                    onClick={() =>
                      appendHypothesisPrompt('Hipótese: Pareceu-me que o ambiente ')
                    }
                    className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-[#133E43]/15 text-[11px] text-[#133E43] transition-colors min-h-[32px]"
                  >
                    + &ldquo;Hipótese: Pareceu-me que...&rdquo;
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      appendHypothesisPrompt('Para testar na próxima vez: ')
                    }
                    className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-[#133E43]/15 text-[11px] text-[#133E43] transition-colors min-h-[32px]"
                  >
                    + &ldquo;Para testar na próxima vez...&rdquo;
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      appendHypothesisPrompt('Pergunta para a escola/profissional: ')
                    }
                    className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-[#133E43]/15 text-[11px] text-[#133E43] transition-colors min-h-[32px]"
                  >
                    + &ldquo;Pergunta para diálogo...&rdquo;
                  </button>
                </div>

                <textarea
                  ref={hypothesisInputRef}
                  id="obs-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Hipótese: Ficar no mesmo plano de visão parece dar mais segurança do que falar de pé."
                  className="w-full bg-white border border-[#133E43]/25 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-[#133E43] focus:outline-none"
                />
              </div>
            </section>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#133E43]/10 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-medium text-[#133E43] hover:bg-[#133E43]/5 rounded-xl border border-[#133E43]/15 min-h-[44px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isAllowedToProceed}
              title={
                !isAllowedToProceed
                  ? 'Acesso negado: cuidador não autorizado'
                  : initialData
                  ? 'Salvar alterações'
                  : 'Salvar no Diário'
              }
              className={`w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-transform min-h-[44px] flex items-center justify-center gap-2 ${
                isAllowedToProceed
                  ? 'text-white bg-[#133E43] hover:bg-[#133E43]/90 active:scale-[0.98]'
                  : 'text-white/60 bg-[#133E43]/40 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-[#80C5B5]" />
              {initialData ? 'Atualizar Observação' : 'Salvar no Diário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
