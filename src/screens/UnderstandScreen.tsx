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
  Heart,
  Eye,
  Layers,
  Sparkles,
  HelpCircle,
  Volume2,
  Clock,
  Compass,
} from 'lucide-react';

export const UnderstandScreen: React.FC = () => {
  const { activeProfile, activeChildObservations } = useApp();

  // Calculate descriptive frequencies safely strictly for the active child
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

  const totalObs = activeChildObservations.length || 1;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#80C5B5]/20 text-[#133E43] text-xs font-semibold mb-2">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Painel Descritivo de Padrões</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#133E43] font-display">
          Compreender {activeProfile.name}: Padrões & Hipóteses
        </h1>
        <p className="text-xs sm:text-sm text-[#265358] mt-1 max-w-2xl leading-relaxed">
          Compreender é ler o ambiente e o momento para apoiar a co-regulação. Este painel resume tendências observadas sem aplicar fórmulas diagnósticas.
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
              As leituras apresentadas são geradas localmente a partir dos campos descritivos preenchidos nesta sessão. O Mundelo não utiliza modelos generativos de IA para rotular comportamentos, nem estabelece percentis médicos.
            </p>
          </div>
        </div>
      </div>

      {/* Observational Distribution Charts (Clean Bar Representations) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Environment Distribution */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#133E43]/15 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#133E43] uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#80C5B5]" />
              Ambientes mais Observados
            </h3>
            <span className="text-xs text-[#265358]">{activeChildObservations.length} registros</span>
          </div>

          <div className="space-y-3 pt-1">
            {Object.keys(envCounts).length === 0 ? (
              <p className="text-xs text-[#265358] italic">Nenhum registro para mapear ambientes.</p>
            ) : (
              Object.entries(envCounts).map(([env, count]) => {
                const pct = Math.round((count / totalObs) * 100);
                return (
                  <div key={env} className="space-y-1">
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
        </div>

        {/* Event Type Distribution */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#133E43]/15 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#133E43] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F1CA91]" />
              Distribuição por Foco do Registro
            </h3>
            <span className="text-xs text-[#265358]">Equilíbrio da escuta</span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { id: 'conquista', label: 'Conquistas & Autonomia', color: 'bg-[#133E43]' },
              { id: 'descoberta', label: 'Descobertas & Exploração', color: 'bg-[#80C5B5]' },
              { id: 'rotina', label: 'Rotinas & Transições', color: 'bg-[#F1CA91]' },
              { id: 'desconforto', label: 'Sensibilidades / Desconforto', color: 'bg-[#CFA5A0]' },
            ].map((item) => {
              const count = eventCounts[item.id] || 0;
              const pct = Math.round((count / totalObs) * 100);
              return (
                <div key={item.id} className="space-y-1">
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
        </div>
      </div>

      {/* Simulated Contextual Patterns (Descriptive, not diagnostic) */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#133E43]/15 shadow-xs space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#133E43] font-display">
            Padrões Descritivos Identificados na Amostra
          </h2>
          <p className="text-xs text-[#265358]">
            Síntese do que os dados contextuais sugerem para apoiar a rotina diária
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Pattern 1 */}
          <div className="p-4 rounded-2xl bg-[#F8F5EF] border border-[#133E43]/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#133E43]">
              <Clock className="w-4 h-4 text-[#80C5B5]" />
              <span>Transições e Previsibilidade</span>
            </div>
            <p className="text-xs text-[#133E43] leading-relaxed">
              Em momentos de troca de atividade (ex: saída do parque ou fim de brincadeiras), o aviso com 5 minutos de antecedência correlacionou-se com transições calmas e voluntárias.
            </p>
            <div className="text-[11px] text-[#265358] italic pt-1">
              Hipótese: O tempo para assimilar o término de uma ação preserva o senso de agência da criança.
            </div>
          </div>

          {/* Pattern 2 */}
          <div className="p-4 rounded-2xl bg-[#F8F5EF] border border-[#133E43]/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#133E43]">
              <Volume2 className="w-4 h-4 text-[#8C4F48]" />
              <span>Sobrecarga Sonora Súbita</span>
            </div>
            <p className="text-xs text-[#133E43] leading-relaxed">
              Ruídos mecânicos e repentinos (liquidificador, aspirador) eliciam reflexo de proteção auditiva e recuo para espaços seguros com busca pelo objeto de conforto.
            </p>
            <div className="text-[11px] text-[#265358] italic pt-1">
              Hipótese: A participação visual prévia no acionamento do ruído diminui o impacto de sobressalto.
            </div>
          </div>

          {/* Pattern 3 */}
          <div className="p-4 rounded-2xl bg-[#F8F5EF] border border-[#133E43]/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#133E43]">
              <Eye className="w-4 h-4 text-[#133E43]" />
              <span>Conexão no Mesmo Plano Visual</span>
            </div>
            <p className="text-xs text-[#133E43] leading-relaxed">
              Abaixar-se na altura dos olhos e manter tom de voz cadenciado aumentou substancialmente a sustentação da atenção compartilhada e o contato com o olhar.
            </p>
            <div className="text-[11px] text-[#265358] italic pt-1">
              Hipótese: A proximidade física calma reduz a sensação de imposição e gera ancoragem afetiva.
            </div>
          </div>
        </div>
      </section>

      {/* Reflective Questions for Dialogue with Professionals */}
      <section className="bg-[#80C5B5]/15 rounded-3xl p-5 sm:p-6 border border-[#80C5B5]/30 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#133E43]">
          <HelpCircle className="w-4 h-4 text-[#133E43]" />
          Perguntas para Refletir em Família ou Levar à Consulta
        </div>
        <p className="text-xs sm:text-sm text-[#133E43] leading-relaxed">
          Use estes pontos para enriquecer conversas com a pediatra, fonoaudióloga, terapeuta ocupacional ou coordenação da creche:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-[#133E43]/90">
          <div className="bg-white/80 p-3.5 rounded-xl border border-[#80C5B5]/30">
            &quot;Em quais momentos do dia notamos a criança mais disponível para interações ricas e espontâneas?&quot;
          </div>
          <div className="bg-white/80 p-3.5 rounded-xl border border-[#80C5B5]/30">
            &quot;Como a iluminação e os ruídos da sala de aula / casa estão influenciando seu tempo de descanso?&quot;
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
