/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Heart,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const {
    activeProfile,
    updateProfile,
    switchProfile,
    availableProfiles,
    setScreen,
    showNotification,
  } = useApp();

  const [name, setName] = useState(activeProfile.name);
  const [ageLabel, setAgeLabel] = useState(activeProfile.ageLabel);
  const [preferredPronoun, setPreferredPronoun] = useState(activeProfile.preferredPronoun);

  // New item inputs
  const [newInterest, setNewInterest] = useState('');
  const [newComfort, setNewComfort] = useState('');
  const [newCommunication, setNewCommunication] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateProfile({
      name: name.trim(),
      ageLabel: ageLabel.trim() || '2 anos',
      preferredPronoun,
    });
    showNotification('Perfil demonstrativo atualizado com sucesso!', 'success');
    setScreen('home');
  };

  const addInterestDirect = () => {
    if (!newInterest.trim()) return;
    updateProfile({
      interests: [...activeProfile.interests, newInterest.trim()],
    });
    setNewInterest('');
  };

  const removeInterestDirect = (index: number) => {
    const updated = activeProfile.interests.filter((_, i) => i !== index);
    updateProfile({ interests: updated });
  };

  const addComfortDirect = () => {
    if (!newComfort.trim()) return;
    updateProfile({
      comfortAnchors: [...activeProfile.comfortAnchors, newComfort.trim()],
    });
    setNewComfort('');
  };

  const removeComfortDirect = (index: number) => {
    const updated = activeProfile.comfortAnchors.filter((_, i) => i !== index);
    updateProfile({ comfortAnchors: updated });
  };

  const addCommunicationDirect = () => {
    if (!newCommunication.trim()) return;
    updateProfile({
      communicationModes: [...activeProfile.communicationModes, newCommunication.trim()],
    });
    setNewCommunication('');
  };

  const removeCommunicationDirect = (index: number) => {
    const updated = activeProfile.communicationModes.filter((_, i) => i !== index);
    updateProfile({ communicationModes: updated });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#80C5B5]/20 text-[#133E43] text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Configuração Acolhedora</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#133E43] font-display">
          Perfil Demonstrativo da Criança
        </h1>
        <p className="text-xs sm:text-sm text-[#133E43]/75 mt-1 leading-relaxed">
          Configure as características singulares de observação. Lembre-se: o Mundelo <strong>nunca pergunta diagnósticos médicos</strong> nem classifica a criança.
        </p>
      </div>

      {/* Switch Between Pre-loaded Mock Profiles */}
      <div className="p-4 bg-white rounded-2xl border border-[#133E43]/15 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-[#133E43] uppercase tracking-wider">
          Escolha um modelo de demonstração pré-carregado:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableProfiles.map((p) => {
            const isSelected = p.id === activeProfile.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  switchProfile(p.id);
                  setName(p.name);
                  setAgeLabel(p.ageLabel);
                  setPreferredPronoun(p.preferredPronoun);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all min-h-[64px] flex items-center justify-between ${
                  isSelected
                    ? 'border-[#133E43] bg-[#133E43]/5 ring-2 ring-[#133E43]'
                    : 'border-[#133E43]/15 bg-white hover:border-[#133E43]/30'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-[#133E43]">{p.name}</div>
                  <div className="text-xs text-[#133E43]/70">{p.ageLabel} · {p.interests.length} interesses mapeados</div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-[#133E43] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-5 rounded-3xl border border-[#133E43]/15 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#133E43] uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[#80C5B5]" />
            Identificação Fictícia
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="child-name" className="block text-xs font-semibold text-[#133E43] mb-1">
                Nome (Fictício)
              </label>
              <input
                id="child-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#F8F5EF] border border-[#133E43]/20 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="child-age" className="block text-xs font-semibold text-[#133E43] mb-1">
                Idade / Tempo de Vida
              </label>
              <input
                id="child-age"
                type="text"
                value={ageLabel}
                onChange={(e) => setAgeLabel(e.target.value)}
                placeholder="Ex: 2 anos e 8 meses"
                className="w-full bg-[#F8F5EF] border border-[#133E43]/20 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="child-pronoun" className="block text-xs font-semibold text-[#133E43] mb-1">
                Como nos referimos?
              </label>
              <select
                id="child-pronoun"
                value={preferredPronoun}
                onChange={(e) => setPreferredPronoun(e.target.value as 'ele' | 'ela' | 'eles')}
                className="w-full bg-[#F8F5EF] border border-[#133E43]/20 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px]"
              >
                <option value="ele">Ele</option>
                <option value="ela">Ela</option>
                <option value="eles">Elas / Eles</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interesses & Fascínios */}
        <div className="bg-white p-5 rounded-3xl border border-[#133E43]/15 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#133E43] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F1CA91]" />
              Interesses & O que Brilha nos Olhos
            </h2>
            <span className="text-xs text-[#133E43]/60">{activeProfile.interests.length} itens</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {activeProfile.interests.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F5EF] border border-[#133E43]/15 text-xs text-[#133E43]"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeInterestDirect(idx)}
                  className="text-[#133E43]/50 hover:text-red-600 p-0.5 rounded-md min-h-[24px] min-w-[24px] flex items-center justify-center"
                  aria-label={`Remover interesse ${item}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Adicionar novo interesse (ex: blocos de montar, música de violão)..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addInterestDirect();
                }
              }}
              className="flex-1 bg-[#F8F5EF] border border-[#133E43]/20 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px]"
            />
            <button
              type="button"
              onClick={addInterestDirect}
              className="px-4 py-2 bg-[#133E43] text-white text-xs font-semibold rounded-xl hover:bg-[#133E43]/90 transition-colors min-h-[44px] flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4 text-[#80C5B5]" />
              Adicionar
            </button>
          </div>
        </div>

        {/* Objetos de Conforto & Ancoragem */}
        <div className="bg-white p-5 rounded-3xl border border-[#133E43]/15 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#133E43] uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#CFA5A0]" />
              Objetos e Rotinas de Conforto
            </h2>
            <span className="text-xs text-[#133E43]/60">{activeProfile.comfortAnchors.length} itens</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {activeProfile.comfortAnchors.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F5EF] border border-[#133E43]/15 text-xs text-[#133E43]"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeComfortDirect(idx)}
                  className="text-[#133E43]/50 hover:text-red-600 p-0.5 rounded-md min-h-[24px] min-w-[24px] flex items-center justify-center"
                  aria-label={`Remover conforto ${item}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newComfort}
              onChange={(e) => setNewComfort(e.target.value)}
              placeholder="Adicionar âncora de conforto (ex: naninha macia, colo nas costas)..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addComfortDirect();
                }
              }}
              className="flex-1 bg-[#F8F5EF] border border-[#133E43]/20 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px]"
            />
            <button
              type="button"
              onClick={addComfortDirect}
              className="px-4 py-2 bg-[#133E43] text-white text-xs font-semibold rounded-xl hover:bg-[#133E43]/90 transition-colors min-h-[44px] flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4 text-[#80C5B5]" />
              Adicionar
            </button>
          </div>
        </div>

        {/* Modos de Comunicação Expressiva */}
        <div className="bg-white p-5 rounded-3xl border border-[#133E43]/15 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#133E43] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#80C5B5]" />
              Formas de Comunicação Expressiva
            </h2>
            <span className="text-xs text-[#133E43]/60">{activeProfile.communicationModes.length} itens</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {activeProfile.communicationModes.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F5EF] border border-[#133E43]/15 text-xs text-[#133E43]"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeCommunicationDirect(idx)}
                  className="text-[#133E43]/50 hover:text-red-600 p-0.5 rounded-md min-h-[24px] min-w-[24px] flex items-center justify-center"
                  aria-label={`Remover forma de comunicação ${item}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newCommunication}
              onChange={(e) => setNewCommunication(e.target.value)}
              placeholder="Ex: aponta com olhar compartilhado, puxa pela mão, emite sons agudos..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCommunicationDirect();
                }
              }}
              className="flex-1 bg-[#F8F5EF] border border-[#133E43]/20 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px]"
            />
            <button
              type="button"
              onClick={addCommunicationDirect}
              className="px-4 py-2 bg-[#133E43] text-white text-xs font-semibold rounded-xl hover:bg-[#133E43]/90 transition-colors min-h-[44px] flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4 text-[#80C5B5]" />
              Adicionar
            </button>
          </div>
        </div>

        {/* Ethical Box Reminder */}
        <div className="p-4 bg-[#F1CA91]/20 border border-[#F1CA91]/40 rounded-2xl flex items-start gap-3 text-xs text-[#133E43]">
          <ShieldAlert className="w-4 h-4 text-[#133E43] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Proteção da Infância:</strong> Este cadastro é mantido exclusivamente em memória nesta sessão de demonstração. Não coletamos dados biométricos, fotos, históricos clínicos ou informações reais de crianças.
          </div>
        </div>

        {/* Save & Continue */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setScreen('home')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#133E43]/20 text-[#133E43] text-xs sm:text-sm font-semibold hover:bg-white min-h-[44px]"
          >
            Voltar ao Início
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#133E43] hover:bg-[#133E43]/90 text-white text-xs sm:text-sm font-semibold min-h-[44px] flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Salvar Perfil e Ir para o Início</span>
            <ArrowRight className="w-4 h-4 text-[#80C5B5]" />
          </button>
        </div>
      </form>
    </div>
  );
};
