/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Lightbulb,
  ShieldAlert,
  MapPin,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const UnderstandScreen: React.FC = () => {
  const { activeProfile, activeChildObservations } = useApp();

  // Count only the active child’s observations authorized by the context.
  const envCounts = activeChildObservations.reduce((acc, curr) => {
    acc[curr.environment] = (acc[curr.environment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const eventCounts = activeChildObservations.reduce((acc, curr) => {
    acc[curr.eventType] = (acc[curr.eventType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const envLabels: Record<string, string> = {
    casa: 'Casa',
    parque: 'Parque / Ar Livre',
    escola: 'Escola / Creche',
    transporte_consulta: 'Transporte / Consulta',
    reuniao_familia: 'Reunião Familiar',
    outro: 'Outro',
  };

  const totalObs = activeChildObservations.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#80C5B5]/20 text-[#133E43] text-xs font-semibold mb-2">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Contagens dos Registros</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#133E43] font-display">
          Compreender {activeProfile.name}: Registros & Contextos
        </h1>
        <p className="text-xs sm:text-sm text-[#265358] mt-1 max-w-2xl leading-relaxed">
          Este painel conta os registros disponíveis para leitura da criança selecionada, por ambiente e foco do registro.
        </p>
      </div>

      {/* Mandatory Non-Diagnostic / No-AI Banner */}
      <div className="p-4 sm:p-5 bg-white rounded-3xl border border-[#133E43]/15 shadow-xs space-y-2">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F1CA91]/30 flex items-center justify-center shrink-0 text-[#133E43]">
            <ShieldAlert className="w-5 h-5 text-[#133E43]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#133E43] font-display uppercase tracking-wider">
              Painel Demonstrativo Simulado — Sem IA Ativa e Sem Fins Diagnósticos
            </h2>
            <p className="text-xs text-[#265358] mt-1 leading-relaxed">
              As contagens usam apenas os registros da criança selecionada que o cuidador ativo pode ler nesta sessão em memória. Não representam todo o cotidiano da criança, frequência de comportamentos, consenso entre pessoas, relações de causa e efeito ou diagnóstico. O Mundelo não gera hipóteses nem utiliza IA neste painel.
            </p>
          </div>
        </div>
      </div>

      <p role="status" className="text-sm text-[#265358]">
        {totalObs} registros disponíveis para leitura. Percentuais calculados sobre esse total e arredondados; podem não somar 100%.
      </p>

      {/* Observational Distribution Charts (Clean Bar Representations) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Environment Distribution */}
        <section aria-labelledby="environment-counts-heading" className="bg-white p-5 sm:p-6 rounded-3xl border border-[#133E43]/15 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="environment-counts-heading" className="text-sm font-bold text-[#133E43] uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#80C5B5]" />
              Registros por Ambiente
            </h2>
            <span className="text-xs text-[#265358]">{activeChildObservations.length} registros</span>
          </div>

          <div className="space-y-3 pt-1">
            {Object.keys(envCounts).length === 0 ? (
              <p className="text-xs text-[#265358] italic">Nenhum registro para mapear ambientes.</p>
            ) : (
              Object.entries(envCounts).map(([env, count]) => {
                const pct = Math.round((count / totalObs) * 100);
                return (
                  <div key={env} role="group" aria-label={envLabels[env] || env} className="space-y-1">
                    <div className="flex justify-between text-xs text-[#133E43]">
                      <span className="font-medium">{envLabels[env] || env}</span>
                      <span className="tabular-nums font-semibold">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F8F5EF] overflow-hidden">
                      <div
                        className="h-full bg-[#133E43] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Event Type Distribution */}
        <section aria-labelledby="event-counts-heading" className="bg-white p-5 sm:p-6 rounded-3xl border border-[#133E43]/15 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="event-counts-heading" className="text-sm font-bold text-[#133E43] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F1CA91]" />
              Registros por Foco
            </h2>
            <span className="text-xs text-[#265358]">Categorias registradas</span>
          </div>

          <div className="space-y-3 pt-1">
            {totalObs === 0 ? (
              <p className="text-xs text-[#265358] italic">Nenhum registro para contar por foco.</p>
            ) : [
              { id: 'conquista', label: 'Conquistas & Autonomia', color: 'bg-[#133E43]' },
              { id: 'descoberta', label: 'Descobertas & Exploração', color: 'bg-[#80C5B5]' },
              { id: 'rotina', label: 'Rotinas & Transições', color: 'bg-[#F1CA91]' },
              { id: 'desconforto', label: 'Sensibilidades / Desconforto', color: 'bg-[#CFA5A0]' },
            ].map((item) => {
              const count = eventCounts[item.id] || 0;
              const pct = Math.round((count / totalObs) * 100);
              return (
                <div key={item.id} role="group" aria-label={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs text-[#133E43]">
                    <span className="font-medium">{item.label}</span>
                    <span className="tabular-nums font-semibold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F8F5EF] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Reflective Questions for Dialogue with Professionals */}
      <section className="bg-[#80C5B5]/15 rounded-3xl p-5 sm:p-6 border border-[#80C5B5]/30 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#133E43]">
          <HelpCircle className="w-4 h-4 text-[#133E43]" />
          Perguntas para Refletir em Família ou Levar à Consulta
        </div>
        <p className="text-xs sm:text-sm text-[#133E43] leading-relaxed">
          Sugestões gerais de perguntas, iguais para todas as sessões: não são geradas dos registros nem conclusões sobre a criança. Podem apoiar conversas com a família, profissionais de saúde ou escola, preservando diferenças entre experiências:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-[#133E43]/90">
          <div className="bg-white/80 p-3.5 rounded-xl border border-[#80C5B5]/30">
            &quot;Em quais momentos do dia notamos a criança mais disponível para interações ricas e espontâneas?&quot;
          </div>
          <div className="bg-white/80 p-3.5 rounded-xl border border-[#80C5B5]/30">
            &quot;O que percebemos sobre iluminação, ruídos e descanso em cada ambiente?&quot;
          </div>
          <div className="bg-white/80 p-3.5 rounded-xl border border-[#80C5B5]/30">
            &quot;Quais pistas corporais sutis a criança manifesta antes de atingir o ápice de um cansaço?&quot;
          </div>
          <div className="bg-white/80 p-3.5 rounded-xl border border-[#80C5B5]/30">
            &quot;Quais objetos ou rituais de acolhimento podemos alinhar entre a casa e a escola para manter continuidade afetiva?&quot;
          </div>
        </div>
      </section>
    </div>
  );
};
