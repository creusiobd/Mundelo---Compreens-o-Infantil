/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Observation } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  MapPin,
  User,
  Heart,
  Eye,
  Sparkles,
  Edit2,
  Trash2,
  FileCheck,
  FilePlus,
  ShieldAlert,
  UserCheck,
  History,
} from 'lucide-react';

interface ObservationDetailModalProps {
  observation: Observation | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (obs: Observation) => void;
  onDelete: (id: string) => void;
  isSelectedForReport: boolean;
  onToggleReportSelection: (id: string) => void;
  childName: string;
}

export const ObservationDetailModal: React.FC<ObservationDetailModalProps> = ({
  observation,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  isSelectedForReport,
  onToggleReportSelection,
  childName,
}) => {
  const { caregivers, canEdit, canDelete, canIncludeInReport } = useApp();

  if (!isOpen || !observation) return null;

  const isEditable = canEdit(observation);
  const isDeletable = canDelete(observation);
  const isReportable = canIncludeInReport(observation);

  const recordedByCaregiver = caregivers.find((c) => c.id === observation.recordedByCaregiverId);
  const recordedByText = recordedByCaregiver
    ? `${recordedByCaregiver.displayName} (${recordedByCaregiver.relationshipLabel || recordedByCaregiver.role})`
    : observation.recordedByCaregiverId || 'Helena (Mãe)';

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const envLabels: Record<string, string> = {
    casa: 'Casa',
    parque: 'Parque / Ar Livre',
    escola: 'Escola / Creche',
    transporte_consulta: 'Transporte / Consulta',
    reuniao_familia: 'Reunião Familiar',
    outro: 'Outro Ambiente',
  };

  const roleLabels: Record<string, string> = {
    mae: 'Mãe',
    pai: 'Pai',
    avo: 'Avó / Avô',
    cuidador: 'Cuidador(a)',
    educador: 'Educador(a)',
    terapeuta: 'Terapeuta',
    outro: 'Outro Observador',
  };

  const typeLabels: Record<string, { label: string; colorClass: string }> = {
    conquista: { label: 'Conquista Afetiva & Autonomia', colorClass: 'text-[#133E43]' },
    desconforto: { label: 'Desconforto & Sensibilidade', colorClass: 'text-[#8C4F48]' },
    rotina: { label: 'Momento de Rotina & Transição', colorClass: 'text-[#133E43]' },
    descoberta: { label: 'Descoberta Sensorial & Lúdica', colorClass: 'text-[#133E43]' },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div className="relative bg-[#F8F5EF] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#133E43]/15 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-[#133E43]/10 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#80C5B5]" aria-hidden="true" />
            <div>
              <h2 id="detail-title" className="text-base sm:text-lg font-bold text-[#133E43] font-display">
                Observação de {childName}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#265358]">
                <span>{typeLabels[observation.eventType]?.label || observation.eventType}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(observation.occurredAt)}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono bg-[#80C5B5]/20 text-[#133E43] px-2 py-0.5 rounded text-[11px] font-bold">
                  Rev #{observation.revision || 1}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#265358] hover:text-[#133E43] hover:bg-[#133E43]/5 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar detalhes da observação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Conteúdo detalhado da observação"
          className="overflow-y-auto p-5 sm:p-6 space-y-5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133E43]"
        >
          {/* Metadata Bar with Provenance & Caregiver Attribution */}
          <div className="flex flex-wrap items-center gap-3 text-xs bg-white/80 p-3.5 rounded-2xl border border-[#133E43]/10">
            <div className="flex items-center gap-1.5 text-[#133E43]">
              <MapPin className="w-4 h-4 text-[#80C5B5]" />
              <span className="font-semibold">Ambiente:</span>
              <span>{envLabels[observation.environment] || observation.environment}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#133E43]">
              <User className="w-4 h-4 text-[#80C5B5]" />
              <span className="font-semibold">Observador(a):</span>
              <span>{roleLabels[observation.observerRole] || observation.observerRole}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#133E43]">
              <UserCheck className="w-4 h-4 text-[#80C5B5]" />
              <span className="font-semibold">Registrado por:</span>
              <span>{recordedByText}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#133E43]">
              <Eye className="w-4 h-4 text-[#80C5B5]" />
              <span className="font-semibold">Proveniência:</span>
              <span>
                {observation.provenance === 'REPORTED_BY_OTHER'
                  ? `Relatada (${observation.reportedByLabel || 'Terceiro'})`
                  : 'Observação Direta (DIRECT)'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#133E43]">
              <History className="w-4 h-4 text-[#80C5B5]" />
              <span className="font-semibold">Revisão:</span>
              <span className="font-mono bg-[#80C5B5]/20 text-[#133E43] px-1.5 py-0.5 rounded font-bold">
                #{observation.revision || 1}
              </span>
            </div>
            {observation.recordedAt && (
              <div className="text-[11px] text-[#265358] w-full pt-1.5 border-t border-[#133E43]/10 flex flex-wrap gap-4">
                <span>Registrado no sistema: {new Date(observation.recordedAt).toLocaleString('pt-BR')}</span>
                {observation.updatedAt && (
                  <span>Última modificação: {new Date(observation.updatedAt).toLocaleString('pt-BR')}</span>
                )}
              </div>
            )}
          </div>

          {/* Section 1: Fatos Objetivos */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#133E43]/10 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#133E43] uppercase tracking-wider mb-2">
              <Eye className="w-4 h-4 text-[#133E43]" />
              Fatos Observáveis (O que ocorreu objetivamente)
            </div>
            <p className="text-sm leading-relaxed text-[#133E43]">
              {observation.description}
            </p>
          </div>

          {/* Two column layout for antecedents & signals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#133E43]/10">
              <h3 className="text-xs font-bold text-[#133E43] uppercase tracking-wider mb-1.5">
                Antecedentes / Contexto Prévio
              </h3>
              <p className="text-xs sm:text-sm text-[#133E43] leading-relaxed">
                {observation.antecedents || 'Não observado'}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#133E43]/10">
              <h3 className="text-xs font-bold text-[#133E43] uppercase tracking-wider mb-1.5">
                Sinais Expressivos & Corporais
              </h3>
              <p className="text-xs sm:text-sm text-[#133E43] leading-relaxed">
                {observation.communicationSignals || 'Não observado'}
              </p>
            </div>
          </div>

          {/* Adult support & outcome */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#133E43]/10">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#133E43] uppercase tracking-wider mb-1.5">
                <Heart className="w-3.5 h-3.5 text-[#8C4F48]" />
                Acolhimento / Mediação Oferecida
              </div>
              <p className="text-xs sm:text-sm text-[#133E43] leading-relaxed">
                {observation.supportOffered || 'Apenas observação atenta'}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#133E43]/10">
              <h3 className="text-xs font-bold text-[#133E43] uppercase tracking-wider mb-1.5">
                Resposta Observada da Criança
              </h3>
              <p className="text-xs sm:text-sm text-[#133E43] leading-relaxed">
                {observation.observedOutcome || 'Não observado'}
              </p>
            </div>
          </div>

          {/* Potências & Forças */}
          <div className="bg-[#80C5B5]/15 p-4 rounded-2xl border border-[#80C5B5]/30">
            <div className="flex items-center gap-2 text-xs font-bold text-[#133E43] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#133E43]" />
              Potências e Forças Percebidas
            </div>
            <p className="text-xs sm:text-sm text-[#133E43] leading-relaxed">
              {observation.positiveAspects || 'Não registrado'}
            </p>
          </div>

          {/* Hipóteses / Reflexões subjetivas */}
          <div className="bg-[#F1CA91]/20 p-4 rounded-2xl border border-[#F1CA91]/40">
            <div className="text-xs font-bold text-[#133E43] uppercase tracking-wider mb-1">
              Reflexão / Hipótese do Observador (Não diagnóstica)
            </div>
            <p className="text-xs sm:text-sm text-[#133E43] leading-relaxed italic">
              &quot;{observation.notes || 'Sem hipóteses adicionais registradas.'}&quot;
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-white border-t border-[#133E43]/10 flex flex-wrap items-center justify-between gap-2.5">
          <button
            onClick={() => isReportable && onToggleReportSelection(observation.id)}
            disabled={!isReportable}
            title={
              !isReportable
                ? 'Cuidador simulado atual não tem autorização para incluir este registro no relatório'
                : isSelectedForReport
                ? 'Remover do relatório'
                : 'Incluir no relatório'
            }
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border min-h-[44px] transition-colors ${
              !isReportable
                ? 'opacity-40 cursor-not-allowed border-[#133E43]/10 text-[#265358]'
                : isSelectedForReport
                ? 'bg-[#80C5B5]/20 border-[#80C5B5] text-[#133E43]'
                : 'border-[#133E43]/15 text-[#265358] hover:text-[#133E43]'
            }`}
          >
            {isSelectedForReport ? (
              <>
                <FileCheck className="w-4 h-4 text-[#133E43]" />
                Incluído no Relatório
              </>
            ) : (
              <>
                <FilePlus className="w-4 h-4" />
                Incluir no Relatório
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => isDeletable && onDelete(observation.id)}
              disabled={!isDeletable}
              title={
                !isDeletable
                  ? 'Ação não permitida: apenas responsáveis legais ou o autor vinculado podem excluir'
                  : 'Excluir esta observação'
              }
              className={`flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-xl transition-colors min-h-[44px] ${
                isDeletable
                  ? 'text-[#8C4F48] hover:text-red-700 hover:bg-red-50'
                  : 'text-[#265358]/50 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
            <button
              onClick={() => isEditable && onEdit(observation)}
              disabled={!isEditable}
              title={
                !isEditable
                  ? 'Ação não permitida: cuidador ativo não tem permissão de edição para este registro'
                  : 'Editar esta observação'
              }
              className={`flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl border transition-colors min-h-[44px] ${
                isEditable
                  ? 'text-[#133E43] hover:bg-[#133E43]/5 border-[#133E43]/20'
                  : 'text-[#265358]/50 border-gray-200 cursor-not-allowed'
              }`}
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#133E43] hover:bg-[#133E43]/90 rounded-xl transition-colors min-h-[44px]"
            >
              Concluído
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
