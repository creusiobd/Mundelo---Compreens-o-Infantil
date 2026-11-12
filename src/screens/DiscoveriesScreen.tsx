/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_DISCOVERIES } from '../data/mockData';
import { AgeGroupFilter, DiscoveryCategory, OfflineDiscovery } from '../types';
import {
  Sparkles,
  Clock,
  Layers,
  Heart,
  Eye,
  Plus,
  Compass,
  CheckCircle2,
} from 'lucide-react';

interface DiscoveriesScreenProps {
  onStartObservationFromDiscovery: (discovery: OfflineDiscovery) => void;
}

export const DiscoveriesScreen: React.FC<DiscoveriesScreenProps> = ({
  onStartObservationFromDiscovery,
}) => {
  const { activeProfile, canCreate } = useApp();

  const [selectedAge, setSelectedAge] = useState<AgeGroupFilter>('todos');
  const [selectedCategory, setSelectedCategory] = useState<DiscoveryCategory>('todos');

  const filteredDiscoveries = useMemo(() => {
    return MOCK_DISCOVERIES.filter((d) => {
      if (selectedAge !== 'todos' && d.ageGroup !== selectedAge) return false;
      if (selectedCategory !== 'todos' && d.category !== selectedCategory) return false;
      return true;
    });
  }, [selectedAge, selectedCategory]);

  const categoryLabels: Record<string, string> = {
    calmante: 'Regulação & Calma',
    motor: 'Motricidade & Movimento',
    conexao: 'Vínculo & Afeto',
    linguagem: 'Linguagem & Sons',
    natureza: 'Exploração Natural',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#80C5B5]/20 text-[#133E43] text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Atividades Offline & Vínculo</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#133E43] font-display">
          Descobertas Sem Tela para {activeProfile.name}
        </h1>
        <p className="text-xs sm:text-sm text-[#265358] mt-1 max-w-2xl leading-relaxed">
          Propostas simples, sensoriais e com materiais cotidianos para viver momentos presentes, observar reações sem julgamentos e fortalecer o apego seguro.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-[#133E43]/15 shadow-xs space-y-3">
        {/* Age group filter */}
        <div>
          <span className="text-[11px] font-bold text-[#133E43] uppercase tracking-wider block mb-1.5">
            Faixa Etária:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'todos', label: 'Todas as Idades (0 a 5 anos)' },
                { id: '0-1', label: '0 a 1 ano (Bebês)' },
                { id: '1-2', label: '1 a 2 anos' },
                { id: '2-3', label: '2 a 3 anos' },
                { id: '3-5', label: '3 a 5 anos' },
              ] as const
            ).map((age) => {
              const isSelected = selectedAge === age.id;
              return (
                <button
                  key={age.id}
                  onClick={() => setSelectedAge(age.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors min-h-[36px] ${
                    isSelected
                      ? 'bg-[#133E43] text-white shadow-xs'
                      : 'bg-[#F8F5EF] text-[#265358] hover:text-[#133E43]'
                  }`}
                >
                  {age.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category filter */}
        <div className="pt-2 border-t border-[#133E43]/10">
          <span className="text-[11px] font-bold text-[#133E43] uppercase tracking-wider block mb-1.5">
            Foco da Experiência:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'todos', label: 'Todos os Focos' },
                { id: 'natureza', label: 'Exploração Natural' },
                { id: 'calmante', label: 'Regulação & Calma' },
                { id: 'conexao', label: 'Vínculo & Afeto' },
                { id: 'motor', label: 'Motricidade' },
                { id: 'linguagem', label: 'Linguagem' },
              ] as const
            ).map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors min-h-[36px] ${
                    isSelected
                      ? 'bg-[#80C5B5] text-[#133E43] shadow-xs'
                      : 'bg-[#F8F5EF] text-[#265358] hover:text-[#133E43]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDiscoveries.map((discovery) => (
          <article
            key={discovery.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-[#133E43]/15 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-[#265358]">
                <span className="font-bold text-[#133E43]">
                  {categoryLabels[discovery.category] || discovery.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{discovery.ageGroup} anos</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#80C5B5]" />
                  {discovery.duration}
                </span>
              </div>

              <h2 className="text-lg font-bold text-[#133E43] font-display">
                {discovery.title}
              </h2>

              {/* Purpose */}
              <p className="text-xs sm:text-sm text-[#133E43] leading-relaxed">
                {discovery.purpose}
              </p>

              {/* Materials */}
              <div className="bg-[#F8F5EF] p-3.5 rounded-2xl border border-[#133E43]/10 text-xs space-y-1.5">
                <span className="font-bold text-[#133E43] uppercase tracking-wider block">
                  Materiais Simples:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-[#265358]">
                  {discovery.materials.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#133E43] uppercase tracking-wider block">
                  Como Conduzir Junto:
                </span>
                <ol className="space-y-1.5 text-xs text-[#133E43]">
                  {discovery.steps.map((st, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold text-[#133E43] shrink-0">{i + 1}.</span>
                      <span className="leading-relaxed">{st}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* What to observe note */}
              <div className="p-3 bg-[#F1CA91]/20 border border-[#F1CA91]/40 rounded-2xl text-xs text-[#133E43]">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Eye className="w-3.5 h-3.5 text-[#133E43]" />
                  O que Observar com Gentileza:
                </div>
                <p className="leading-relaxed text-[#133E43]">
                  {discovery.whatToObserve}
                </p>
              </div>
            </div>

            {/* Direct Action */}
            <div className="pt-3 border-t border-[#133E43]/10">
              <button
                onClick={() => canCreate && onStartObservationFromDiscovery(discovery)}
                disabled={!canCreate}
                title={
                  canCreate
                    ? 'Registrar observação a partir desta descoberta'
                    : 'Acesso negado: cuidador ativo não possui permissão ativa para esta criança'
                }
                className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[44px] flex items-center justify-center gap-2 shadow-xs ${
                  canCreate
                    ? 'bg-[#133E43] hover:bg-[#133E43]/90 text-white active:scale-[0.98]'
                    : 'bg-[#133E43]/30 text-white/70 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4 text-[#80C5B5]" />
                Registrar Observação a Partir Desta Descoberta
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
