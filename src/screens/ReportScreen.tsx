/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Calendar,
  MapPin,
  User,
  Heart,
  Eye,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const ReportScreen: React.FC = () => {
  const {
    activeProfile,
    activeChildObservations,
    selectedObservationIds,
    toggleSelectObservation,
    selectAllObservations,
    showNotification,
    caregivers,
  } = useApp();

  const [recipient, setRecipient] = useState<
    'pediatria' | 'escola' | 'terapia' | 'fono' | 'familia'
  >('pediatria');
  const [copied, setCopied] = useState(false);

  const selectedObservations = activeChildObservations.filter((o) =>
    selectedObservationIds.includes(o.id)
  );

  const recipientLabels: Record<string, string> = {
    pediatria: 'Consulta com Pediatra',
    escola: 'Diálogo Pedagógico com Escola / Creche',
    terapia: 'Sessão com Terapia Ocupacional',
    fono: 'Avaliação com Fonoaudiologia',
    familia: 'Alinhamento com Rede de Apoio Familiar',
  };

  const envLabels: Record<string, string> = {
    casa: 'Casa',
    parque: 'Parque / Ar Livre',
    escola: 'Escola / Creche',
    transporte_consulta: 'Transporte / Consulta',
    reuniao_familia: 'Reunião Familiar',
    outro: 'Outro Ambiente',
  };

  const handleCopyReportText = () => {
    const textLines = [
      `MUNDELO - SÍNTESE CONTEXTUAL DE OBSERVAÇÃO INFANTIL`,
      `"Compreender é o primeiro cuidado"`,
      `----------------------------------------------------`,
      `Criança (Dados Fictícios): ${activeProfile.name} (${activeProfile.ageLabel})`,
      `Finalidade: ${recipientLabels[recipient]}`,
      `Data da Síntese: ${new Date().toLocaleDateString('pt-BR')}`,
      `Total de Observações Selecionadas: ${selectedObservations.length}`,
      ``,
      `1. REPERTÓRIO DE REGULAÇÃO & INTERESSES CENTRAIS`,
      `- Interesses: ${activeProfile.interests.join(', ')}`,
      `- Fontes de Conforto: ${activeProfile.comfortAnchors.join(', ')}`,
      `- Sensibilidades Relatadas: ${activeProfile.sensitivities.join(', ')}`,
      `- Comunicação Expressiva: ${activeProfile.communicationModes.join(', ')}`,
      ``,
      `2. REGISTROS CONTEXTUAIS SELECIONADOS:`,
    ];

    selectedObservations.forEach((obs, index) => {
      const recorder = caregivers.find((c) => c.id === obs.recordedByCaregiverId);
      const recorderName = recorder ? `${recorder.displayName} (${recorder.relationshipLabel || recorder.role})` : (obs.recordedByCaregiverId || 'Helena');
      const provText = obs.provenance === 'REPORTED_BY_OTHER' ? `Relatada (${obs.reportedByLabel || 'Terceiro'})` : 'Observação Direta (DIRECT)';

      textLines.push(
        `\n[Registro ${index + 1}] - ${obs.occurredAt.replace('T', ' ')} | ${envLabels[obs.environment] || obs.environment} | Rev #${obs.revision || 1}`
      );
      textLines.push(`- Registrado por: ${recorderName}`);
      textLines.push(`- Proveniência: ${provText}`);
      textLines.push(`- Fatos Observados: ${obs.description}`);
      textLines.push(`- Antecedentes: ${obs.antecedents}`);
      textLines.push(`- Sinais Expressivos: ${obs.communicationSignals}`);
      textLines.push(`- Acolhimento do Adulto: ${obs.supportOffered}`);
      textLines.push(`- Resposta Observada: ${obs.observedOutcome}`);
      textLines.push(`- Forças / Potências: ${obs.positiveAspects}`);
      textLines.push(`- Hipótese Familiar (Não Diagnóstica): ${obs.notes}`);
    });

    textLines.push(`\n----------------------------------------------------`);
    textLines.push(
      `AVISO ÉTICO: Este documento destina-se a apoiar a conversa presencial entre família e profissionais. Não constitui diagnóstico, laudo clínico ou previsão diagnóstica.`
    );

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    showNotification('Texto da síntese copiado para a área de transferência!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Title */}
      <div className="print:hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#80C5B5]/20 text-[#133E43] text-xs font-semibold mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>Preparação de Conversas Qualificadas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#133E43] font-display">
          Síntese de Observações para Diálogo
        </h1>
        <p className="text-xs sm:text-sm text-[#265358] mt-1 max-w-2xl leading-relaxed">
          Selecione os registros que melhor contextualizam a rotina de {activeProfile.name} para compartilhar presencialmente com profissionais ou a escola.
        </p>
      </div>

      {/* Control Panel (Hidden when printing) */}
      <div className="bg-white p-5 rounded-3xl border border-[#133E43]/15 shadow-xs space-y-4 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label htmlFor="recipient-select" className="block text-xs font-bold text-[#133E43] uppercase tracking-wider mb-1.5">
              Objetivo Principal da Conversa:
            </label>
            <select
              id="recipient-select"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value as typeof recipient)}
              className="w-full bg-[#F8F5EF] border border-[#133E43]/15 text-[#133E43] text-xs sm:text-sm font-medium rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px]"
            >
              <option value="pediatria">Consulta com Pediatra</option>
              <option value="escola">Reunião Pedagógica com a Escola / Creche</option>
              <option value="terapia">Acompanhamento com Terapia Ocupacional</option>
              <option value="fono">Avaliação com Fonoaudiologia</option>
              <option value="familia">Alinhamento com Rede de Cuidado Familiar</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 sm:pt-0">
            <button
              onClick={handleCopyReportText}
              className="px-4 py-2.5 bg-white border border-[#133E43]/20 hover:bg-[#F8F5EF] text-[#133E43] text-xs font-semibold rounded-xl transition-colors min-h-[44px] flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#80C5B5]" />
                  <span>Copiar Síntese</span>
                </>
              )}
            </button>

            <button
              onClick={handleTriggerPrint}
              className="px-4 py-2.5 bg-[#133E43] hover:bg-[#133E43]/90 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors min-h-[44px] flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-[#80C5B5]" />
              <span>Imprimir / Gerar PDF</span>
            </button>
          </div>
        </div>

        {/* Selection summary */}
        <div className="pt-3 border-t border-[#133E43]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-[#133E43]">
            <strong>{selectedObservations.length}</strong> de {activeChildObservations.length} observações de {activeProfile.name} selecionadas para este documento
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => selectAllObservations(true)}
              className="text-[#133E43] underline font-semibold hover:text-[#265358] p-1"
            >
              Selecionar todas
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => selectAllObservations(false)}
              className="text-[#265358] underline hover:text-[#133E43] p-1"
            >
              Desmarcar todas
            </button>
          </div>
        </div>

        {/* Observation Selector Checklist */}
        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 pt-1">
          {activeChildObservations.map((obs) => {
            const isChecked = selectedObservationIds.includes(obs.id);
            return (
              <label
                key={obs.id}
                className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-[#80C5B5]/10 border-[#80C5B5]/40'
                    : 'bg-[#F8F5EF] border-transparent hover:border-[#133E43]/15'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSelectObservation(obs.id)}
                  className="mt-0.5 w-4 h-4 rounded text-[#133E43] focus:ring-[#133E43] accent-[#133E43]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-[#265358] mb-0.5">
                    <span className="font-bold text-[#133E43] uppercase">{obs.eventType}</span>
                    <span>·</span>
                    <span>{obs.occurredAt.slice(0, 10)}</span>
                    <span>·</span>
                    <span>{envLabels[obs.environment] || obs.environment}</span>
                    <span>·</span>
                    <span>{obs.provenance === 'REPORTED_BY_OTHER' ? 'Relatada' : 'Direta'}</span>
                  </div>
                  <p className="text-[#133E43] truncate font-medium">{obs.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Structured Document Preview Sheet */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#133E43]/15 shadow-sm space-y-6 print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-[#133E43] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#133E43] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#80C5B5]" />
              Mundelo · Compreensão Infantil
            </div>
            <h2 className="text-2xl font-extrabold text-[#133E43] font-display">
              Síntese Contextual de Observação
            </h2>
            <p className="text-xs text-[#265358] mt-0.5">
              Compreender é o primeiro cuidado · Documento de diálogo com {recipientLabels[recipient]}
            </p>
          </div>
          <div className="text-right text-xs text-[#265358]">
            <div><strong>Criança:</strong> {activeProfile.name} (Dados Fictícios)</div>
            <div><strong>Idade:</strong> {activeProfile.ageLabel}</div>
            <div><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</div>
          </div>
        </div>

        {/* Section: Child Regulation Anchors */}
        <section className="space-y-3 bg-[#F8F5EF] p-4 sm:p-5 rounded-2xl border border-[#133E43]/10">
          <h3 className="text-xs font-bold text-[#133E43] uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#8C4F48]" />
            1. Perfil de Regulação & Preferências Centrais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-bold text-[#133E43] block mb-0.5">Fascínios & Interesses:</span>
              <p className="text-[#133E43]">{activeProfile.interests.join('; ')}</p>
            </div>
            <div>
              <span className="font-bold text-[#133E43] block mb-0.5">Fontes de Conforto:</span>
              <p className="text-[#133E43]">{activeProfile.comfortAnchors.join('; ')}</p>
            </div>
            <div>
              <span className="font-bold text-[#133E43] block mb-0.5">Sensibilidades Relatadas:</span>
              <p className="text-[#133E43]">{activeProfile.sensitivities.join('; ')}</p>
            </div>
            <div>
              <span className="font-bold text-[#133E43] block mb-0.5">Modos de Comunicação:</span>
              <p className="text-[#133E43]">{activeProfile.communicationModes.join('; ')}</p>
            </div>
          </div>
        </section>

        {/* Section: Selected Observations */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#133E43] uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#133E43]" />
              2. Registros Contextuais Selecionados ({selectedObservations.length})
            </h3>
            <span className="text-[11px] text-[#265358]">Diferenciação rigorosa de fatos e hipóteses</span>
          </div>

          {selectedObservations.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#265358] italic bg-[#F8F5EF] rounded-2xl">
              Nenhuma observação selecionada para esta prévia. Marque ao menos um registro no painel acima.
            </div>
          ) : (
            <div className="space-y-4">
              {selectedObservations.map((obs, idx) => {
                const recorder = caregivers.find((c) => c.id === obs.recordedByCaregiverId);
                const recorderName = recorder
                  ? `${recorder.displayName} (${recorder.relationshipLabel || recorder.role})`
                  : obs.recordedByCaregiverId || 'Helena';
                const provText =
                  obs.provenance === 'REPORTED_BY_OTHER'
                    ? `Relatada (${obs.reportedByLabel || 'Terceiro'})`
                    : 'Observação Direta (DIRECT)';

                return (
                  <div
                    key={obs.id}
                    className="p-4 rounded-2xl border border-[#133E43]/15 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#133E43]/10 pb-2">
                      <span className="font-bold text-[#133E43]">
                        Registro #{idx + 1} — {obs.eventType.toUpperCase()} · Rev #{obs.revision || 1}
                      </span>
                      <span className="text-[#265358]">
                        {obs.occurredAt.replace('T', ' ')} · {envLabels[obs.environment] || obs.environment}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#265358] bg-[#F8F5EF] p-2 rounded-xl">
                      <span><strong>Registrado por:</strong> {recorderName}</span>
                      <span>·</span>
                      <span><strong>Proveniência:</strong> {provText}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div>
                        <strong className="text-[#133E43]">Fatos Objetivos:</strong>{' '}
                        <span className="text-[#133E43]">{obs.description}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#265358] pt-1">
                        <div>
                          <strong>Antecedentes:</strong> {obs.antecedents}
                        </div>
                        <div>
                          <strong>Sinais Corporais:</strong> {obs.communicationSignals}
                        </div>
                        <div>
                          <strong>Acolhimento:</strong> {obs.supportOffered}
                        </div>
                        <div>
                          <strong>Resposta da Criança:</strong> {obs.observedOutcome}
                        </div>
                      </div>

                      {obs.positiveAspects && (
                        <div className="text-[#133E43] pt-1">
                          <strong>Forças Notadas:</strong> {obs.positiveAspects}
                        </div>
                      )}

                      <div className="bg-[#F1CA91]/20 p-2.5 rounded-xl border border-[#F1CA91]/40 text-[#133E43] italic">
                        <strong>Hipótese Familiar (Não Diagnóstica):</strong> &quot;{obs.notes}&quot;
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Ethical Footer Notice */}
        <footer className="pt-4 border-t border-[#133E43]/15 text-[11px] text-[#265358] leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#133E43]">
            <ShieldCheck className="w-4 h-4 text-[#80C5B5]" />
            Nota Ética de Escuta e Limites:
          </div>
          <p>
            Este relatório foi gerado em modo de demonstração com dados exclusivamente em memória. O Mundelo não emite diagnósticos médicos, psicológicos ou pedagógicos. As informações destinam-se a qualificar o diálogo presencial entre cuidadores e profissionais que acompanham o desenvolvimento integral da criança.
          </p>
        </footer>
      </div>
    </div>
  );
};
