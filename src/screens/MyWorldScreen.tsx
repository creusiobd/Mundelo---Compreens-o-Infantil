/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Heart,
  Sparkles,
  VolumeX,
  MessageSquare,
  Trophy,
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const MyWorldScreen: React.FC = () => {
  const {activeProfile, activeCaregiver, canReadProfile, canManageProfile} = useApp();
  if (!canReadProfile) return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-3">
      <h1 className="text-2xl font-bold text-[#133E43]">Meu Mundo indisponível</h1>
      <p className="text-sm text-[#265358]">O cuidador ativo não possui acesso de leitura ao perfil neste contexto demonstrativo.</p>
    </div>
  );
  // Remount on context changes: drafts from one child/person cannot follow another.
  return <MyWorldContent key={`${activeProfile.id}:${activeCaregiver.id}:${activeCaregiver.status}:${canManageProfile}`} />;
};

const MyWorldContent: React.FC = () => {
  const {
    activeProfile,
    canManageProfile,
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
  } = useApp();

  // Modal / Inputs state for adding items
  const [activeTab, setActiveTab] = useState<
    'todos' | 'interesses' | 'conforto' | 'sensibilidades' | 'comunicacao' | 'conquistas' | 'estrategias'
  >('todos');

  const [inputInterest, setInputInterest] = useState('');
  const [inputComfort, setInputComfort] = useState('');
  const [inputSensitivity, setInputSensitivity] = useState('');
  const [inputComm, setInputComm] = useState('');
  const [inputMilestone, setInputMilestone] = useState('');

  // Strategy form
  const [stratName, setStratName] = useState('');
  const [stratContext, setStratContext] = useState('');
  const [stratResponse, setStratResponse] = useState('');

  const handleAddStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageProfile || !stratName.trim()) return;
    const accepted = addSupportStrategy({
      strategy: stratName.trim(),
      context: stratContext.trim(),
      observedResponse: stratResponse.trim(),
    });
    if (!accepted) return;
    setStratName('');
    setStratContext('');
    setStratResponse('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Title & Introduction */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#80C5B5]/20 text-[#133E43] text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Mapeamento de Singularidades</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#133E43] font-display">
          Meu Mundo: {activeProfile.name}
        </h1>
        <p className="text-xs sm:text-sm text-[#265358] mt-1 max-w-2xl leading-relaxed">
          O repertório vivo do que encanta, acalma, desafia e apoia {activeProfile.name} ({activeProfile.ageLabel}). Um guia prático de referência para pais, educadores e cuidadores.
        </p>
      </div>

      {!canManageProfile && <p role="status" className="text-sm text-[#265358]">Leitura disponível. A gestão dos atributos globais deste perfil demonstrativo exige responsável legal ativo e vinculado; registrar uma observação é uma operação independente.</p>}
      {/* Tabs Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'todos', label: 'Visão Completa' },
          { id: 'interesses', label: 'Interesses' },
          { id: 'conforto', label: 'Conforto & Âncoras' },
          { id: 'sensibilidades', label: 'Sensibilidades' },
          { id: 'comunicacao', label: 'Comunicação' },
          { id: 'conquistas', label: 'Conquistas' },
          { id: 'estrategias', label: 'Estratégias' },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors min-h-[40px] ${
                isSelected
                  ? 'bg-[#133E43] text-white shadow-xs'
                  : 'bg-white text-[#265358] border border-[#133E43]/15 hover:text-[#133E43]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Interesses & Fascínios */}
        {(activeTab === 'todos' || activeTab === 'interesses') && (
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#133E43]/15 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F1CA91]/30 flex items-center justify-center text-[#133E43]">
                  <Sparkles className="w-4 h-4 text-[#133E43]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#133E43] uppercase tracking-wider font-display">
                    Interesses & Fascínios
                  </h2>
                  <p className="text-[11px] text-[#265358]">O que desperta brilho nos olhos e foco sereno</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#265358]">{activeProfile.interests.length}</span>
            </div>

            <ul className="space-y-2">
              {activeProfile.interests.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F8F5EF] text-xs text-[#133E43]"
                >
                  <span className="font-medium">{item}</span>
                  <button
                    onClick={() => canManageProfile && removeInterest(item)}
                    disabled={!canManageProfile}
                    className={`p-1 rounded min-h-[32px] min-w-[32px] flex items-center justify-center ${
                      canManageProfile
                        ? 'text-[#265358] hover:text-red-700'
                        : 'text-[#265358]/40 cursor-not-allowed'
                    }`}
                    aria-label={`Remover interesse ${item}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 pt-1 border-t border-[#133E43]/10">
              <input
                type="text"
                aria-label="Novo interesse ou fascínio"
                disabled={!canManageProfile}
                value={inputInterest}
                onChange={(e) => setInputInterest(e.target.value)}
                placeholder="Novo interesse (ex: trenzinhos, água)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canManageProfile) {
                    e.preventDefault();
                    if (addInterest(inputInterest)) setInputInterest('');
                  }
                }}
                className="flex-1 min-w-0 bg-[#F8F5EF] border border-[#133E43]/15 rounded-xl px-3 py-1.5 text-xs text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px] disabled:opacity-50"
              />
              <button
                type="button"
                disabled={!canManageProfile}
                onClick={() => {
                  if (!canManageProfile) return;
                  if (addInterest(inputInterest)) setInputInterest('');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl min-h-[44px] flex items-center gap-1 ${
                  canManageProfile
                    ? 'bg-[#133E43] text-white hover:bg-[#133E43]/90'
                    : 'bg-[#133E43]/30 text-white/70 cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-[#80C5B5]" />
                Adicionar
              </button>
            </div>
          </section>
        )}

        {/* 2. Fontes de Conforto & Ancoragem */}
        {(activeTab === 'todos' || activeTab === 'conforto') && (
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#133E43]/15 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#80C5B5]/25 flex items-center justify-center text-[#133E43]">
                  <Heart className="w-4 h-4 text-[#133E43]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#133E43] uppercase tracking-wider font-display">
                    Fontes de Conforto
                  </h2>
                  <p className="text-[11px] text-[#265358]">Objetos e rotinas que ajudam a regular e acalmar</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#265358]">{activeProfile.comfortAnchors.length}</span>
            </div>

            <ul className="space-y-2">
              {activeProfile.comfortAnchors.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F8F5EF] text-xs text-[#133E43]"
                >
                  <span className="font-medium">{item}</span>
                  <button
                    onClick={() => canManageProfile && removeComfortAnchor(item)}
                    disabled={!canManageProfile}
                    className={`p-1 rounded min-h-[32px] min-w-[32px] flex items-center justify-center ${
                      canManageProfile
                        ? 'text-[#265358] hover:text-red-700'
                        : 'text-[#265358]/40 cursor-not-allowed'
                    }`}
                    aria-label={`Remover conforto ${item}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 pt-1 border-t border-[#133E43]/10">
              <input
                type="text"
                aria-label="Nova fonte de conforto"
                disabled={!canManageProfile}
                value={inputComfort}
                onChange={(e) => setInputComfort(e.target.value)}
                placeholder="Novo conforto (ex: naninha azul)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canManageProfile) {
                    e.preventDefault();
                    if (addComfortAnchor(inputComfort)) setInputComfort('');
                  }
                }}
                className="flex-1 min-w-0 bg-[#F8F5EF] border border-[#133E43]/15 rounded-xl px-3 py-1.5 text-xs text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px] disabled:opacity-50"
              />
              <button
                type="button"
                disabled={!canManageProfile}
                onClick={() => {
                  if (!canManageProfile) return;
                  if (addComfortAnchor(inputComfort)) setInputComfort('');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl min-h-[44px] flex items-center gap-1 ${
                  canManageProfile
                    ? 'bg-[#133E43] text-white hover:bg-[#133E43]/90'
                    : 'bg-[#133E43]/30 text-white/70 cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-[#80C5B5]" />
                Adicionar
              </button>
            </div>
          </section>
        )}

        {/* 3. Sensibilidades Relatadas */}
        {(activeTab === 'todos' || activeTab === 'sensibilidades') && (
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#133E43]/15 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#CFA5A0]/25 flex items-center justify-center text-[#133E43]">
                  <VolumeX className="w-4 h-4 text-[#133E43]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#133E43] uppercase tracking-wider font-display">
                    Sensibilidades Relatadas
                  </h2>
                  <p className="text-[11px] text-[#265358]">Estímulos que pedem acolhimento ou preparação</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#265358]">{activeProfile.sensitivities.length}</span>
            </div>

            <ul className="space-y-2">
              {activeProfile.sensitivities.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F8F5EF] text-xs text-[#133E43]"
                >
                  <span className="font-medium">{item}</span>
                  <button
                    onClick={() => canManageProfile && removeSensitivity(item)}
                    disabled={!canManageProfile}
                    className={`p-1 rounded min-h-[32px] min-w-[32px] flex items-center justify-center ${
                      canManageProfile
                        ? 'text-[#265358] hover:text-red-700'
                        : 'text-[#265358]/40 cursor-not-allowed'
                    }`}
                    aria-label={`Remover sensibilidade ${item}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 pt-1 border-t border-[#133E43]/10">
              <input
                type="text"
                aria-label="Nova sensibilidade relatada"
                disabled={!canManageProfile}
                value={inputSensitivity}
                onChange={(e) => setInputSensitivity(e.target.value)}
                placeholder="Nova sensibilidade (ex: etiquetas, som alto)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canManageProfile) {
                    e.preventDefault();
                    if (addSensitivity(inputSensitivity)) setInputSensitivity('');
                  }
                }}
                className="flex-1 min-w-0 bg-[#F8F5EF] border border-[#133E43]/15 rounded-xl px-3 py-1.5 text-xs text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px] disabled:opacity-50"
              />
              <button
                type="button"
                disabled={!canManageProfile}
                onClick={() => {
                  if (!canManageProfile) return;
                  if (addSensitivity(inputSensitivity)) setInputSensitivity('');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl min-h-[44px] flex items-center gap-1 ${
                  canManageProfile
                    ? 'bg-[#133E43] text-white hover:bg-[#133E43]/90'
                    : 'bg-[#133E43]/30 text-white/70 cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-[#80C5B5]" />
                Adicionar
              </button>
            </div>
          </section>
        )}

        {/* 4. Formas de Comunicação */}
        {(activeTab === 'todos' || activeTab === 'comunicacao') && (
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#133E43]/15 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#80C5B5]/25 flex items-center justify-center text-[#133E43]">
                  <MessageSquare className="w-4 h-4 text-[#133E43]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#133E43] uppercase tracking-wider font-display">
                    Comunicação & Linguagem
                  </h2>
                  <p className="text-[11px] text-[#265358]">Sinais expressivos e como demonstra desejos</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#265358]">{activeProfile.communicationModes.length}</span>
            </div>

            <ul className="space-y-2">
              {activeProfile.communicationModes.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F8F5EF] text-xs text-[#133E43]"
                >
                  <span className="font-medium">{item}</span>
                  <button
                    onClick={() => canManageProfile && removeCommunicationMode(item)}
                    disabled={!canManageProfile}
                    className={`p-1 rounded min-h-[32px] min-w-[32px] flex items-center justify-center ${
                      canManageProfile
                        ? 'text-[#265358] hover:text-red-700'
                        : 'text-[#265358]/40 cursor-not-allowed'
                    }`}
                    aria-label={`Remover modo de comunicação ${item}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 pt-1 border-t border-[#133E43]/10">
              <input
                type="text"
                aria-label="Nova forma de comunicação"
                disabled={!canManageProfile}
                value={inputComm}
                onChange={(e) => setInputComm(e.target.value)}
                placeholder="Nova forma de comunicação..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canManageProfile) {
                    e.preventDefault();
                    if (addCommunicationMode(inputComm)) setInputComm('');
                  }
                }}
                className="flex-1 min-w-0 bg-[#F8F5EF] border border-[#133E43]/15 rounded-xl px-3 py-1.5 text-xs text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px] disabled:opacity-50"
              />
              <button
                type="button"
                disabled={!canManageProfile}
                onClick={() => {
                  if (!canManageProfile) return;
                  if (addCommunicationMode(inputComm)) setInputComm('');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl min-h-[44px] flex items-center gap-1 ${
                  canManageProfile
                    ? 'bg-[#133E43] text-white hover:bg-[#133E43]/90'
                    : 'bg-[#133E43]/30 text-white/70 cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-[#80C5B5]" />
                Adicionar
              </button>
            </div>
          </section>
        )}

        {/* 5. Conquistas Celebradas */}
        {(activeTab === 'todos' || activeTab === 'conquistas') && (
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#133E43]/15 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F1CA91]/30 flex items-center justify-center text-[#133E43]">
                  <Trophy className="w-4 h-4 text-[#133E43]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#133E43] uppercase tracking-wider font-display">
                    Conquistas Afetivas & Autonomia
                  </h2>
                  <p className="text-[11px] text-[#265358]">Marcos celebrados no ritmo singular da criança</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#265358]">{activeProfile.celebratedMilestones.length}</span>
            </div>

            <ul className="space-y-2">
              {activeProfile.celebratedMilestones.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F8F5EF] text-xs text-[#133E43]"
                >
                  <span className="font-medium">{item}</span>
                  <button
                    onClick={() => canManageProfile && removeCelebratedMilestone(item)}
                    disabled={!canManageProfile}
                    className={`p-1 rounded min-h-[32px] min-w-[32px] flex items-center justify-center ${
                      canManageProfile
                        ? 'text-[#265358] hover:text-red-700'
                        : 'text-[#265358]/40 cursor-not-allowed'
                    }`}
                    aria-label={`Remover conquista ${item}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 pt-1 border-t border-[#133E43]/10">
              <input
                type="text"
                aria-label="Celebrar nova conquista"
                disabled={!canManageProfile}
                value={inputMilestone}
                onChange={(e) => setInputMilestone(e.target.value)}
                placeholder="Celebrar nova conquista..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canManageProfile) {
                    e.preventDefault();
                    if (addCelebratedMilestone(inputMilestone)) setInputMilestone('');
                  }
                }}
                className="flex-1 min-w-0 bg-[#F8F5EF] border border-[#133E43]/15 rounded-xl px-3 py-1.5 text-xs text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px] disabled:opacity-50"
              />
              <button
                type="button"
                disabled={!canManageProfile}
                onClick={() => {
                  if (!canManageProfile) return;
                  if (addCelebratedMilestone(inputMilestone)) setInputMilestone('');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl min-h-[44px] flex items-center gap-1 ${
                  canManageProfile
                    ? 'bg-[#133E43] text-white hover:bg-[#133E43]/90'
                    : 'bg-[#133E43]/30 text-white/70 cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-[#80C5B5]" />
                Celebrar
              </button>
            </div>
          </section>
        )}

        {/* 6. Estratégias Experimentadas */}
        {(activeTab === 'todos' || activeTab === 'estrategias') && (
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#133E43]/15 shadow-xs space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#80C5B5]/25 flex items-center justify-center text-[#133E43]">
                  <Layers className="w-4 h-4 text-[#133E43]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#133E43] uppercase tracking-wider font-display">
                    Estratégias de Acolhimento
                  </h2>
                  <p className="text-[11px] text-[#265358]">Propostas e experiências relatadas; campos ausentes permanecem não informados</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#265358]">
                {activeProfile.supportStrategies.length} estratégias
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeProfile.supportStrategies.map((strat) => (
                <div
                  key={strat.id}
                  className="bg-[#F8F5EF] p-4 rounded-2xl border border-[#133E43]/10 flex flex-col justify-between space-y-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-[#133E43] leading-snug">{strat.strategy}</span>
                      <button
                        onClick={() => canManageProfile && removeSupportStrategy(strat.id)}
                        disabled={!canManageProfile}
                        className={`p-1 rounded shrink-0 min-h-[28px] min-w-[28px] flex items-center justify-center ${
                          canManageProfile
                            ? 'text-[#265358] hover:text-red-700'
                            : 'text-[#265358]/40 cursor-not-allowed'
                        }`}
                        aria-label={`Remover estratégia ${strat.strategy}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-[#265358]">
                      <strong>Contexto:</strong> {strat.context || 'Não informado'}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#133E43]/10 text-[#133E43]">
                    <strong>Resposta observada:</strong> {strat.observedResponse || 'Não informada'}
                  </div>
                </div>
              ))}
            </div>

            {/* Form to add strategy */}
            <form onSubmit={handleAddStrategy} className="bg-[#F8F5EF]/60 p-4 rounded-2xl border border-[#133E43]/15 space-y-3">
              <span className="text-xs font-bold text-[#133E43] uppercase tracking-wider block">
                Catalogar Nova Estratégia
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  aria-label="Nome da estratégia de acolhimento"
                  disabled={!canManageProfile}
                  value={stratName}
                  onChange={(e) => setStratName(e.target.value)}
                  placeholder="Nome da estratégia (ex: aviso sonoro 5 min antes)..."
                  required
                  className="bg-white border border-[#133E43]/15 rounded-xl px-3 py-2 text-xs text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px] disabled:opacity-50"
                />
                <input
                  type="text"
                  aria-label="Contexto de aplicação da estratégia"
                  disabled={!canManageProfile}
                  value={stratContext}
                  onChange={(e) => setStratContext(e.target.value)}
                  placeholder="Contexto de aplicação (ex: saída do banho)..."
                  className="bg-white border border-[#133E43]/15 rounded-xl px-3 py-2 text-xs text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px] disabled:opacity-50"
                />
                <input
                  type="text"
                  aria-label="Resposta observada da criança"
                  disabled={!canManageProfile}
                  value={stratResponse}
                  onChange={(e) => setStratResponse(e.target.value)}
                  placeholder="Como a criança respondeu..."
                  className="bg-white border border-[#133E43]/15 rounded-xl px-3 py-2 text-xs text-[#133E43] placeholder:text-[#265358] focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px] disabled:opacity-50"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!canManageProfile}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl min-h-[44px] flex items-center gap-1.5 shadow-xs ${
                    canManageProfile
                      ? 'bg-[#133E43] text-white hover:bg-[#133E43]/90'
                      : 'bg-[#133E43]/30 text-white/70 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4 text-[#80C5B5]" />
                  Salvar Estratégia
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};
