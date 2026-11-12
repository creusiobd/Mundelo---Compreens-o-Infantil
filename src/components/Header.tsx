/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../types';
import { BrandLogo } from './BrandLogo';
import {
  BookHeart,
  Plus,
  RefreshCw,
  Trash2,
  Menu,
  X,
  Compass,
  FileText,
  ShieldCheck,
  Lightbulb,
  Heart,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  UserCheck,
  Users,
} from 'lucide-react';

interface HeaderProps {
  onOpenNewObservation: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewObservation }) => {
  const {
    currentScreen,
    setScreen,
    activeProfile,
    availableProfiles,
    switchProfile,
    caregivers,
    activeCaregiver,
    switchCaregiver,
    isLinkedToActiveChild,
    canCreate,
    clearActiveChildObservationsToEmpty,
    restoreDemoData,
    isAllEmpty,
    activeChildObservations,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [utilityMenuOpen, setUtilityMenuOpen] = useState(false);
  const utilityMenuRef = useRef<HTMLDivElement | null>(null);
  const utilityTriggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuTriggerRef = useRef<HTMLButtonElement | null>(null);

  const navLinks: { id: ScreenId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Início', icon: <Heart className="w-4 h-4" /> },
    { id: 'journal', label: 'Diário', icon: <BookHeart className="w-4 h-4" /> },
    { id: 'world', label: 'Meu Mundo', icon: <Compass className="w-4 h-4" /> },
    { id: 'discoveries', label: 'Descobertas', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'understand', label: 'Compreender', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'report', label: 'Relatório', icon: <FileText className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacidade', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const handleNav = (screen: ScreenId) => {
    setScreen(screen);
    setMobileMenuOpen(false);
    setUtilityMenuOpen(false);
  };

  // Fechar menu utilitário ou drawer mobile ao clicar fora ou pressionar Escape (restaurando foco ao acionador)
  useEffect(() => {
    if (!utilityMenuOpen && !mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (utilityMenuOpen) {
          setUtilityMenuOpen(false);
          utilityTriggerRef.current?.focus();
        } else if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          mobileMenuTriggerRef.current?.focus();
        }
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        utilityMenuOpen &&
        utilityMenuRef.current &&
        !utilityMenuRef.current.contains(e.target as Node)
      ) {
        setUtilityMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [utilityMenuOpen, mobileMenuOpen]);

  const roleShortLabel = (role: string) => {
    if (role === 'LEGAL_GUARDIAN') return 'Resp. Legal';
    if (role === 'EDUCATOR') return 'Educador';
    if (role === 'PROFESSIONAL') return 'Profissional';
    return 'Familiar';
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F8F5EF]/95 backdrop-blur-md border-b border-[#133E43]/12">
      {/* =====================================================================
          CAMADA 1: BARRA INSTITUCIONAL DISCRETA
          Aviso ético + Menu utilitário acessível para ações secundárias
         ===================================================================== */}
      <div className="bg-[#133E43] text-[#F8F5EF] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck
              className="w-3.5 h-3.5 text-[#80C5B5] shrink-0"
              aria-hidden="true"
            />
            <p className="text-[11px] sm:text-xs text-[#F8F5EF]/95 leading-snug">
              Protótipo ético em memória. Nenhum dado infantil real é solicitado ou armazenado.
            </p>
          </div>

          {/* Menu Utilitário Acessível (Simulação de Estado Vazio / Manifesto / Perfil) */}
          <div className="relative shrink-0" ref={utilityMenuRef}>
            <button
              ref={utilityTriggerRef}
              type="button"
              onClick={() => setUtilityMenuOpen((prev) => !prev)}
              aria-expanded={utilityMenuOpen}
              aria-haspopup="menu"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium text-[#F8F5EF] bg-white/10 hover:bg-white/15 transition-colors min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1CA91]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#80C5B5]" aria-hidden="true" />
              <span className="whitespace-nowrap">Opções do Protótipo</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#80C5B5] transition-transform ${
                  utilityMenuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {utilityMenuOpen && (
              <div
                role="menu"
                aria-label="Ações secundárias do protótipo"
                className="absolute right-0 mt-1.5 w-72 rounded-2xl bg-white text-[#133E43] shadow-xl border border-[#133E43]/15 p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150"
              >
                <div
                  role="presentation"
                  className="px-3 py-1.5 border-b border-[#133E43]/10 text-[11px] text-[#265358]"
                >
                  Controles de demonstração ({activeProfile.name}:{' '}
                  <strong className="tabular-nums">{activeChildObservations.length}</strong> reg.)
                </div>

                {isAllEmpty ? (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      restoreDemoData();
                      setUtilityMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#133E43] hover:bg-[#F8F5EF] transition-colors min-h-[44px] text-left"
                  >
                    <RefreshCw className="w-4 h-4 text-[#133E43] shrink-0" />
                    <div>
                      <span className="block">Restaurar Dados de Exemplo</span>
                      <span className="text-[11px] font-normal text-[#265358]">
                        Recarrega observações sintéticas iniciais
                      </span>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      clearActiveChildObservationsToEmpty();
                      setUtilityMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#133E43] hover:bg-red-50/70 transition-colors min-h-[44px] text-left"
                  >
                    <Trash2 className="w-4 h-4 text-[#CFA5A0] shrink-0" />
                    <div>
                      <span className="block">
                        Simular Estado Vazio ({activeProfile.name})
                      </span>
                      <span className="text-[11px] font-normal text-[#265358]">
                        Limpa temporariamente os registros em memória
                      </span>
                    </div>
                  </button>
                )}

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleNav('onboarding')}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#133E43] hover:bg-[#F8F5EF] transition-colors min-h-[44px] text-left"
                >
                  <Users className="w-4 h-4 text-[#80C5B5] shrink-0" />
                  <div>
                    <span className="block">Ajustar Perfil de {activeProfile.name}</span>
                    <span className="text-[11px] font-normal text-[#265358]">
                      Interesses, sinais e rotina de referência
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleNav('welcome')}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#133E43] hover:bg-[#F8F5EF] transition-colors min-h-[44px] text-left border-t border-[#133E43]/10"
                >
                  <ShieldCheck className="w-4 h-4 text-[#133E43] shrink-0" />
                  <div>
                    <span className="block">Manifesto & Limites Éticos</span>
                    <span className="text-[11px] font-normal text-[#265358]">
                      Filosofia de cuidado e compromissos de privacidade
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          CAMADA 2: CABEÇALHO PRINCIPAL
          Regiões planejadas: Identidade + Seletores Contextuais + CTA + Navegação
         ===================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Faixa Principal: Marca (Esquerda) + Contexto/Seletores e CTA (Direita) */}
        <div className="py-2.5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-x-4 gap-y-2.5">
          {/* 1. Identidade Mundelo com área livre e reorganização responsiva sem overflow */}
          <div className="flex items-center justify-between gap-2 w-full lg:w-auto min-w-0">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="text-left group rounded-xl py-1 pr-2 min-h-[44px] flex items-center min-w-0 flex-1 lg:flex-initial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133E43]"
            >
              <BrandLogo variant="complete" layout="responsive" size="md" />
              <span className="sr-only"> — Ir para Início</span>
            </button>

            {/* Botão Menu Mobile (visível apenas abaixo de md) */}
            <button
              ref={mobileMenuTriggerRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-[#133E43] hover:bg-[#133E43]/10 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
              aria-label={
                mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* 3, 4 & 5. Seletores de Cuidador, Criança e Ação Principal "Nova Observação" */}
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-between sm:justify-end gap-2 w-full lg:w-auto shrink-0">
            {/* 3. Seletor de Cuidador */}
            <div className="relative hidden sm:block">
              <label htmlFor="caregiver-select" className="sr-only">
                Selecionar cuidador ativo simulado
              </label>
              <div className="relative flex items-center">
                <UserCheck
                  className="w-3.5 h-3.5 text-[#265358] absolute left-3 pointer-events-none"
                  aria-hidden="true"
                />
                <select
                  id="caregiver-select"
                  value={activeCaregiver.id}
                  onChange={(e) => switchCaregiver(e.target.value)}
                  className={`max-w-[175px] xl:max-w-[235px] truncate text-xs font-semibold rounded-xl pl-8 pr-6 py-2 border shadow-2xs min-h-[44px] cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133E43] ${
                    activeCaregiver.status !== 'ACTIVE'
                      ? 'bg-red-50 text-red-800 border-red-300'
                      : isLinkedToActiveChild
                      ? 'bg-white text-[#133E43] border-[#133E43]/20 hover:border-[#133E43]/40'
                      : 'bg-amber-50 text-amber-950 border-amber-300'
                  }`}
                  title="Simular papel e vínculo de cuidador"
                >
                  {caregivers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.displayName} · {roleShortLabel(c.role)}
                      {c.status !== 'ACTIVE'
                        ? ' (Suspenso)'
                        : !c.linkedChildIds.includes(activeProfile.id)
                        ? ' (Sem vínculo)'
                        : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Seletor de Criança */}
            <div className="relative flex-1 sm:flex-initial min-w-0">
              <label htmlFor="profile-select" className="sr-only">
                Selecionar perfil da criança
              </label>
              <select
                id="profile-select"
                value={activeProfile.id}
                onChange={(e) => switchProfile(e.target.value)}
                className="w-full sm:w-auto sm:max-w-[175px] xl:max-w-[225px] truncate bg-white border border-[#133E43]/20 hover:border-[#133E43]/40 text-[#133E43] text-xs font-semibold rounded-xl px-3 py-2 pr-7 shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133E43] min-h-[44px] cursor-pointer"
                title="Criança fictícia em observação"
              >
                {availableProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    Criança: {p.name} ({p.ageLabel})
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Ação Principal "Nova Observação" */}
            <button
              type="button"
              onClick={onOpenNewObservation}
              disabled={!canCreate}
              className={`text-xs sm:text-[13px] font-semibold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 min-h-[44px] whitespace-nowrap shrink-0 ${
                canCreate
                  ? 'bg-[#133E43] hover:bg-[#194F55] text-[#F8F5EF] active:scale-[0.98]'
                  : 'bg-[#133E43]/30 text-[#F8F5EF]/70 cursor-not-allowed'
              }`}
              title={
                canCreate
                  ? 'Registrar nova observação no diário'
                  : 'Acesso negado: cuidador ativo não possui permissão ativa para esta criança'
              }
            >
              <Plus className="w-4 h-4 text-[#80C5B5] shrink-0" aria-hidden="true" />
              <span>Nova Observação</span>
            </button>
          </div>
        </div>

        {/* 2. Faixa de Navegação Principal (Tablet e Desktop >= md) */}
        <div className="hidden md:flex flex-wrap items-center justify-between border-t border-[#133E43]/10 py-1.5 gap-3">
          <nav
            aria-label="Navegação principal"
            className="flex items-center flex-wrap gap-0.5 lg:gap-1.5"
          >
            {navLinks.map((link) => {
              const isActive = currentScreen === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNav(link.id)}
                  className={`px-2 lg:px-3 py-1.5 text-xs lg:text-[13px] font-semibold rounded-xl transition-all whitespace-nowrap min-h-[44px] flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#133E43] text-[#F8F5EF] shadow-2xs'
                      : 'text-[#265358] hover:text-[#133E43] hover:bg-[#133E43]/6'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={isActive ? 'text-[#80C5B5]' : 'text-[#265358]'}
                    aria-hidden="true"
                  >
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Resumo discreto de contexto ativo em telas amplas */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-[#265358] whitespace-nowrap shrink-0">
            <span>Vínculo ativo:</span>
            <strong className="font-semibold text-[#133E43]">
              {activeCaregiver.displayName}
            </strong>
            <span aria-hidden="true">·</span>
            <span
              className={
                canCreate ? 'text-[#133E43] font-medium' : 'text-red-700 font-semibold'
              }
            >
              {canCreate ? 'Leitura e registro autorizados' : 'Somente leitura / Bloqueado'}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MENU DRAWER MOBILE (< md)
         ===================================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#133E43]/15 bg-[#F8F5EF] px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-xs font-bold text-[#265358] mb-2 px-2">
            Seções do Mundelo
          </div>
          <nav aria-label="Menu de navegação móvel" className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const isActive = currentScreen === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNav(link.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-[#133E43] text-[#F8F5EF]'
                      : 'text-[#133E43] hover:bg-[#133E43]/6'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={isActive ? 'text-[#80C5B5]' : 'text-[#133E43]/75'}
                    aria-hidden="true"
                  >
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Seletor de Cuidador no Mobile */}
          <div className="mt-4 p-3.5 bg-white rounded-2xl border border-[#133E43]/15 space-y-1.5">
            <label
              htmlFor="mobile-caregiver-select"
              className="block text-xs font-bold text-[#133E43]"
            >
              Cuidador Ativo Simulado
            </label>
            <select
              id="mobile-caregiver-select"
              value={activeCaregiver.id}
              onChange={(e) => switchCaregiver(e.target.value)}
              className="w-full bg-[#F8F5EF] border border-[#133E43]/20 text-xs font-semibold text-[#133E43] rounded-xl p-2.5 min-h-[44px]"
            >
              {caregivers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.displayName} · {roleShortLabel(c.role)}
                  {c.status !== 'ACTIVE'
                    ? ' (Suspenso)'
                    : !c.linkedChildIds.includes(activeProfile.id)
                    ? ' (Sem vínculo)'
                    : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 pt-3 border-t border-[#133E43]/10 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => handleNav('onboarding')}
              className="flex items-center justify-between text-xs font-semibold text-[#133E43] px-3 py-2.5 hover:bg-[#133E43]/5 rounded-xl min-h-[44px]"
            >
              <span>Ajustar Perfil de {activeProfile.name}</span>
              <span className="text-[#265358] underline">Configurar</span>
            </button>
            <button
              type="button"
              onClick={() => handleNav('welcome')}
              className="flex items-center justify-between text-xs font-semibold text-[#133E43] px-3 py-2.5 hover:bg-[#133E43]/5 rounded-xl min-h-[44px]"
            >
              <span>Manifesto da Marca e Limites Éticos</span>
              <span className="text-[#265358] underline">Consultar</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
