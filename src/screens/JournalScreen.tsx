/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Observation, EventType, EnvironmentType } from '../types';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  User,
  Heart,
  Eye,
  Trash2,
  Edit2,
  FileCheck,
  FilePlus,
  RefreshCw,
  Sparkles,
  ArrowUpDown,
  ShieldAlert,
  UserCheck,
  History,
  Lock,
  Download,
  Upload,
} from 'lucide-react';

interface JournalScreenProps {
  onOpenNewObservation: () => void;
  onSelectObservation: (obs: Observation) => void;
  onEditObservation: (obs: Observation) => void;
  onRequestDeleteObservation: (id: string) => void;
  onOpenExportVault?: () => void;
  onOpenImportVault?: () => void;
}

export const JournalScreen: React.FC<JournalScreenProps> = ({
  onOpenNewObservation,
  onSelectObservation,
  onEditObservation,
  onRequestDeleteObservation,
  onOpenExportVault,
  onOpenImportVault,
}) => {
  const {
    activeChildObservations,
    activeProfile,
    selectedObservationIds,
    toggleSelectObservation,
    restoreDemoData,
    activeCaregiver,
    caregivers,
    isLinkedToActiveChild,
    canCreate,
    canEdit,
    canDelete,
    canIncludeInReport,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterEnv, setFilterEnv] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredObservations = useMemo(() => {
    return activeChildObservations
      .filter((obs) => {
        if (filterType !== 'all' && obs.eventType !== filterType) return false;
        if (filterEnv !== 'all' && obs.environment !== filterEnv) return false;
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchDesc = obs.description.toLowerCase().includes(q);
          const matchAnte = obs.antecedents.toLowerCase().includes(q);
          const matchComm = obs.communicationSignals.toLowerCase().includes(q);
          const matchSupp = obs.supportOffered.toLowerCase().includes(q);
          const matchNotes = obs.notes.toLowerCase().includes(q);
          if (!matchDesc && !matchAnte && !matchComm && !matchSupp && !matchNotes) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.occurredAt).getTime();
        const timeB = new Date(b.occurredAt).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [activeChildObservations, filterType, filterEnv, searchTerm, sortOrder]);

  const envLabels: Record<string, string> = {
    casa: 'Casa',
    parque: 'Parque / Ar Livre',
    escola: 'Escola / Creche',
    transporte_consulta: 'Transporte / Consulta',
    reuniao_familia: 'Família',
    outro: 'Outro',
  };

  const roleLabels: Record<string, string> = {
    mae: 'Mãe',
    pai: 'Pai',
    avo: 'Avó / Avô',
    cuidador: 'Cuidador(a)',
    educador: 'Educador(a)',
    terapeuta: 'Terapeuta',
    outro: 'Observador',
  };

  const typeConfig: Record<
    EventType,
    { label: string; textClass: string; borderClass: string }
  > = {
    conquista: {
      label: 'Conquista',
      textClass: 'text-[#133E43] font-bold',
      borderClass: 'border-[#133E43]/20',
    },
    desconforto: {
      label: 'Desconforto',
      textClass: 'text-[#8C4F48] font-bold',
      borderClass: 'border-[#CFA5A0]/40',
    },
    rotina: {
      label: 'Rotina',
      textClass: 'text-[#133E43] font-bold',
      borderClass: 'border-[#133E43]/20',
    },
    descoberta: {
      label: 'Descoberta',
      textClass: 'text-[#133E43] font-bold',
      borderClass: 'border-[#80C5B5]/40',
    },
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-150">
      {/* Privilege Simulation Banner when Caregiver not linked */}
      {!isLinkedToActiveChild && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-3xl text-xs text-amber-950 flex items-start gap-3 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-semibold text-amber-900 text-sm">
              Demonstração de Política de Autorização: Cuidador sem Vínculo com {activeProfile.name}
            </strong>
            <p className="leading-relaxed">
              O cuidador simulado atual é <strong>{activeCaregiver.displayName}</strong> ({activeCaregiver.relationshipLabel || activeCaregiver.role}), que não possui vínculo com {activeProfile.name}.
              As operações de registro, edição e inclusão em relatório estão desabilitadas para simular o modelo de menor privilégio.
            </p>
          </div>
        </div>
      )}

      {/* Title & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#80C5B5]/20 text-[#133E43] text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Linha Temporal Contextual</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#133E43] font-display">
            Diário de Observações: {activeProfile.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#265358] mt-1">
            Registros descritivos de acontecimentos, sinais corporais e acolhimento
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenExportVault && (
            <button
              onClick={onOpenExportVault}
              className="px-3.5 py-2.5 rounded-2xl border border-[#133E43]/20 bg-white hover:bg-[#133E43]/5 text-[#133E43] text-xs sm:text-sm font-semibold transition-all min-h-[44px] flex items-center gap-1.5 shadow-2xs"
              title="Exportar cofre criptografado (.mundelo-vault)"
            >
              <Lock className="w-4 h-4 text-[#80C5B5]" />
              <span className="hidden sm:inline">Cofre</span>
              <Download className="w-3.5 h-3.5 text-[#265358]" />
            </button>
          )}

          {onOpenImportVault && (
            <button
              onClick={onOpenImportVault}
              className="px-3.5 py-2.5 rounded-2xl border border-[#133E43]/20 bg-white hover:bg-[#133E43]/5 text-[#133E43] text-xs sm:text-sm font-semibold transition-all min-h-[44px] flex items-center gap-1.5 shadow-2xs"
              title="Importar cofre criptografado (.mundelo-vault)"
            >
              <Upload className="w-3.5 h-3.5 text-[#265358]" />
              <span className="hidden sm:inline">Restaurar Cofre</span>
            </button>
          )}

          <button
            onClick={onOpenNewObservation}
            disabled={!canCreate}
            title={
              !canCreate
                ? 'Acesso negado: cuidador ativo não tem permissão para esta criança'
                : 'Registrar nova observação'
            }
            className={`font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-xs transition-transform min-h-[44px] flex items-center justify-center gap-2 shrink-0 ${
              canCreate
                ? 'bg-[#133E43] hover:bg-[#133E43]/90 text-white active:scale-[0.98]'
                : 'bg-[#133E43]/30 text-white/70 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4 text-[#80C5B5]" />
            <span>Nova Observação</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-[#133E43]/15 shadow-xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#265358] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            aria-label="Buscar observações por palavras-chave"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por palavras-chave (ex: água, gravetos, liquidificador, naninha)..."
            className="w-full bg-[#F8F5EF] border border-[#133E43]/15 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#265358] hover:text-[#133E43] p-1 font-medium"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Event Type Segmented Control */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F8F5EF] rounded-xl border border-[#133E43]/10">
            {[
              { id: 'all', label: 'Todos os tipos' },
              { id: 'conquista', label: 'Conquistas' },
              { id: 'desconforto', label: 'Desconfortos' },
              { id: 'rotina', label: 'Rotinas' },
              { id: 'descoberta', label: 'Descobertas' },
            ].map((t) => {
              const isSelected = filterType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setFilterType(t.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[36px] whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#133E43] text-white shadow-xs'
                      : 'text-[#265358] hover:text-[#133E43]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Environment & Sort Dropdowns */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-[#133E43]">
              <Filter className="w-3.5 h-3.5 text-[#265358]" />
              <label htmlFor="filter-env" className="sr-only">
                Filtrar por ambiente
              </label>
              <select
                id="filter-env"
                value={filterEnv}
                onChange={(e) => setFilterEnv(e.target.value)}
                className="bg-[#F8F5EF] border border-[#133E43]/15 text-[#133E43] text-xs font-medium rounded-xl px-2.5 py-1.5 min-h-[36px] focus:ring-2 focus:ring-[#133E43] focus:outline-none"
              >
                <option value="all">Todos os ambientes</option>
                <option value="casa">Casa</option>
                <option value="parque">Parque / Ar Livre</option>
                <option value="escola">Escola / Creche</option>
                <option value="transporte_consulta">Transporte / Consulta</option>
                <option value="reuniao_familia">Família</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-2 border border-[#133E43]/15 bg-[#F8F5EF] hover:bg-white text-xs font-medium rounded-xl text-[#133E43] min-h-[36px] flex items-center gap-1"
              title={sortOrder === 'desc' ? 'Mais recentes primeiro' : 'Mais antigas primeiro'}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {sortOrder === 'desc' ? 'Recentes' : 'Antigas'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Observations Timeline Feed */}
      {filteredObservations.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-dashed border-[#133E43]/20 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#80C5B5]/20 text-[#133E43] flex items-center justify-center mx-auto">
            <Eye className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-[#133E43] font-display">
              Nenhuma observação encontrada para os filtros atuais
            </h3>
            <p className="text-xs sm:text-sm text-[#265358] max-w-md mx-auto leading-relaxed">
              Tente redefinir os filtros de busca ou adicione uma nova observação contextual para {activeProfile.name}.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenNewObservation}
              disabled={!canCreate}
              className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl min-h-[44px] flex items-center gap-1.5 ${
                canCreate
                  ? 'bg-[#133E43] text-white hover:bg-[#133E43]/90'
                  : 'bg-[#133E43]/30 text-white/70 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4 text-[#80C5B5]" />
              Nova Observação
            </button>
            <button
              onClick={() => {
                setFilterType('all');
                setFilterEnv('all');
                setSearchTerm('');
              }}
              className="px-4 py-2.5 border border-[#133E43]/20 text-[#133E43] text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#133E43]/5 min-h-[44px]"
            >
              Limpar Filtros
            </button>
            {activeChildObservations.length === 0 && (
              <button
                onClick={restoreDemoData}
                className="px-4 py-2.5 bg-[#F1CA91]/30 text-[#133E43] text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#F1CA91]/50 min-h-[44px] flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                Restaurar Exemplos
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-[#265358] px-1 flex items-center justify-between">
            <span>
              Exibindo <strong>{filteredObservations.length}</strong> de {activeChildObservations.length} observações de {activeProfile.name}
            </span>
            <span className="text-[11px] hidden sm:inline">
              Clique em qualquer registro para ver o desdobramento completo
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {filteredObservations.map((obs) => {
              const typeDetails = typeConfig[obs.eventType] || {
                label: obs.eventType,
                textClass: 'text-[#133E43]',
                borderClass: 'border-[#133E43]/20',
              };
              const isSelected = selectedObservationIds.includes(obs.id);
              const recorder = caregivers.find((c) => c.id === obs.recordedByCaregiverId);
              const recorderName = recorder ? recorder.displayName : obs.recordedByCaregiverId || 'Helena';
              const canEditObs = canEdit(obs);
              const canDeleteObs = canDelete(obs);
              const canReportObs = canIncludeInReport(obs);

              return (
                <article
                  key={obs.id}
                  className="bg-white rounded-3xl p-5 border border-[#133E43]/15 shadow-xs hover:border-[#133E43]/35 transition-all space-y-4"
                >
                  {/* Card Header: Metadata unboxed with Caregiver & Revision */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#133E43]/10 pb-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#265358]">
                      <span className={typeDetails.textClass}>
                        {typeDetails.label}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#80C5B5]" />
                        {envLabels[obs.environment] || obs.environment}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-[#80C5B5]" />
                        <span>Por {recorderName}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[11px] text-[#133E43] font-medium">
                        {obs.provenance === 'REPORTED_BY_OTHER'
                          ? `Relatada (${obs.reportedByLabel || 'Terceiro'})`
                          : 'Direta'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono bg-[#80C5B5]/20 text-[#133E43] px-1.5 py-0.5 rounded text-[10px] font-bold">
                        Rev #{obs.revision || 1}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#80C5B5]" />
                        {formatDate(obs.occurredAt)}
                      </span>
                    </div>

                    {/* Report Selection Toggle */}
                    <button
                      type="button"
                      onClick={() => canReportObs && toggleSelectObservation(obs.id)}
                      disabled={!canReportObs}
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 min-h-[32px] ${
                        !canReportObs
                          ? 'opacity-40 cursor-not-allowed border-[#133E43]/10 text-[#265358]'
                          : isSelected
                          ? 'bg-[#80C5B5]/20 border-[#80C5B5] text-[#133E43]'
                          : 'border-[#133E43]/15 text-[#265358] hover:text-[#133E43]'
                      }`}
                      title={
                        !canReportObs
                          ? 'Acesso negado: cuidador ativo não tem permissão para incluir observação no relatório'
                          : isSelected
                          ? 'Incluído no relatório demonstrativo'
                          : 'Adicionar ao relatório'
                      }
                    >
                      {isSelected ? (
                        <>
                          <FileCheck className="w-3.5 h-3.5 text-[#133E43]" />
                          <span>No Relatório</span>
                        </>
                      ) : (
                        <>
                          <FilePlus className="w-3.5 h-3.5" />
                          <span>+ Relatório</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Fatos Objetivos: Destaque Principal */}
                  <div
                    onClick={() => onSelectObservation(obs)}
                    className="cursor-pointer space-y-2 group"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSelectObservation(obs);
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#133E43] uppercase tracking-wider">
                      <Eye className="w-3.5 h-3.5 text-[#133E43]" />
                      Fatos Observáveis
                    </div>
                    <p className="text-sm font-medium text-[#133E43] leading-relaxed group-hover:text-[#265358]">
                      {obs.description}
                    </p>
                  </div>

                  {/* Context Grid (Antecedents & Support) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F8F5EF]/60 p-3 rounded-2xl border border-[#133E43]/10">
                    <div>
                      <span className="font-bold text-[#133E43] block mb-0.5">
                        Contexto Prévio / Antecedentes:
                      </span>
                      <span className="text-[#265358] leading-relaxed">
                        {obs.antecedents}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-[#133E43] block mb-0.5 flex items-center gap-1">
                        <Heart className="w-3 h-3 text-[#8C4F48]" />
                        Acolhimento Oferecido:
                      </span>
                      <span className="text-[#265358] leading-relaxed">
                        {obs.supportOffered}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onSelectObservation(obs)}
                      className="text-xs font-semibold text-[#133E43] hover:underline flex items-center gap-1 min-h-[36px]"
                    >
                      <span>Ver análise completa</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => canEditObs && onEditObservation(obs)}
                        disabled={!canEditObs}
                        className={`p-2 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors ${
                          canEditObs
                            ? 'text-[#265358] hover:text-[#133E43] hover:bg-[#133E43]/5'
                            : 'text-[#265358]/50 cursor-not-allowed'
                        }`}
                        title={
                          canEditObs
                            ? 'Editar esta observação'
                            : 'Ação não permitida: cuidador ativo não tem permissão para editar'
                        }
                        aria-label="Editar esta observação"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => canDeleteObs && onRequestDeleteObservation(obs.id)}
                        disabled={!canDeleteObs}
                        className={`p-2 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors ${
                          canDeleteObs
                            ? 'text-[#8C4F48] hover:text-red-700 hover:bg-red-50'
                            : 'text-[#265358]/50 cursor-not-allowed'
                        }`}
                        title={
                          canDeleteObs
                            ? 'Excluir esta observação'
                            : 'Ação não permitida: apenas responsáveis legais ou o autor podem excluir'
                        }
                        aria-label="Excluir esta observação"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
