/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Observation } from '../types';
import {
  Heart,
  Plus,
  Compass,
  Sparkles,
  FileText,
  Calendar,
  MapPin,
  ArrowRight,
  BookHeart,
  Eye,
  Smile,
  Shield,
  Layers,
  UserCheck,
  SlidersHorizontal,
} from 'lucide-react';

interface HomeScreenProps {
  onOpenNewObservation: () => void;
  onSelectObservation: (obs: Observation) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenNewObservation,
  onSelectObservation,
}) => {
  const {
    activeProfile,
    activeChildObservations,
    setScreen,
    restoreDemoData,
    isAllEmpty,
    canCreate,
    activeCaregiver,
  } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const recentObservations = activeChildObservations.slice(0, 3);

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
    outro: 'Observador',
  };

  const typeLabels: Record<string, { label: string; textClass: string }> = {
    conquista: { label: 'Conquista', textClass: 'text-[#133E43] font-bold' },
    desconforto: { label: 'Desconforto', textClass: 'text-[#8C4F48] font-bold' },
    rotina: { label: 'Rotina', textClass: 'text-[#265358] font-bold' },
    descoberta: { label: 'Descoberta', textClass: 'text-[#133E43] font-bold' },
  };

  const formatShortDate = (isoString: string) => {
    const raw = isoString.slice(0, 10);
    const parts = raw.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return raw;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9 space-y-8 sm:space-y-10 animate-in fade-in duration-150">
      {/* =====================================================================
          FASE 4: HERO PRINCIPAL (Proporção Editorial 65% / 35% no Desktop)
         ===================================================================== */}
      <section
        aria-labelledby="home-hero-heading"
        className="bg-white rounded-[24px] p-6 sm:p-8 lg:p-9 border border-[#133E43]/12 shadow-xs"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Bloco Editorial à Esquerda (~65% -> 8 de 12 colunas no desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
            <div className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-[#265358]">
              <Smile className="w-4 h-4 text-[#80C5B5] shrink-0" aria-hidden="true" />
              <span>
                {getGreeting()}, responsável por{' '}
                <strong className="text-[#133E43] font-bold">{activeProfile.name}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>Cada criança, um mundo</span>
            </div>

            <h1
              id="home-hero-heading"
              className="text-2xl sm:text-3xl lg:text-[40px] font-extrabold text-[#133E43] font-display tracking-tight leading-[1.15] text-balance"
            >
              O que podemos compreender hoje?
            </h1>

            <p className="text-sm sm:text-base text-[#265358] max-w-2xl leading-relaxed">
              Cada observação é uma janela para o universo particular de{' '}
              <strong className="font-semibold text-[#133E43]">{activeProfile.name}</strong> (
              {activeProfile.ageLabel}). Registre fatos do cotidiano com calma, acolhendo antes de
              interpretar e sem comparações.
            </p>
          </div>

          {/* Painel Discreto e Integrado "Perfil em foco" à Direita (~35% -> 4 de 12 colunas) */}
          <div className="lg:col-span-5 xl:col-span-4 w-full">
            <div className="p-5 rounded-[20px] bg-[#F8F5EF] border border-[#133E43]/12 space-y-3.5">
              <div className="flex items-center justify-between gap-2 border-b border-[#133E43]/10 pb-2.5">
                <span className="text-xs font-bold text-[#265358]">
                  Perfil em foco
                </span>
                <button
                  type="button"
                  onClick={() => setScreen('onboarding')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#133E43] hover:text-[#194F55] underline underline-offset-2 min-h-[44px] px-1.5 rounded-lg"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#265358]" aria-hidden="true" />
                  <span>Ajustar Perfil</span>
                </button>
              </div>

              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-2xl bg-[#133E43] flex items-center justify-center text-lg font-extrabold text-[#F8F5EF] font-display shrink-0 shadow-2xs"
                  aria-hidden="true"
                >
                  {activeProfile.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-extrabold text-[#133E43] font-display leading-snug">
                    {activeProfile.name}
                  </div>
                  <div className="text-xs sm:text-[13px] font-medium text-[#265358]">
                    {activeProfile.ageLabel}
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#133E43]/10 space-y-1.5 text-xs sm:text-[13px] text-[#265358] leading-snug">
                <div>
                  <strong className="font-semibold text-[#133E43]">Interesse atual: </strong>
                  <span>{activeProfile.interests[0] || 'Exploração livre'}</span>
                </div>
                {activeProfile.communicationModes?.[0] && (
                  <div>
                    <strong className="font-semibold text-[#133E43]">Expressão frequente: </strong>
                    <span>{activeProfile.communicationModes[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          FASE 5: AÇÕES RÁPIDAS (4 Cards Uniformizados, Mesma Altura e Padrão)
         ===================================================================== */}
      <section aria-labelledby="quick-actions-heading" className="space-y-3.5">
        <div className="flex items-baseline justify-between px-0.5">
          <h2
            id="quick-actions-heading"
            className="text-lg sm:text-xl font-bold text-[#133E43] font-display tracking-tight"
          >
            Ações Rápidas de Acolhimento
          </h2>
          <span className="text-xs text-[#265358] hidden sm:inline">
            Acesso direto às práticas principais
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Card 1: Ação Primária (Nova Observação) */}
          <button
            type="button"
            onClick={onOpenNewObservation}
            disabled={!canCreate}
            title={
              canCreate
                ? 'Registrar nova observação no diário'
                : `Ação desabilitada: ${activeCaregiver.displayName} não possui permissão de escrita ativa para ${activeProfile.name}`
            }
            className={`h-full min-h-[104px] p-5 rounded-[18px] text-left transition-all flex items-start justify-between gap-3.5 group ${
              canCreate
                ? 'bg-[#133E43] text-[#F8F5EF] hover:bg-[#194F55] shadow-xs active:scale-[0.99]'
                : 'bg-[#133E43]/35 text-[#F8F5EF]/75 cursor-not-allowed'
            }`}
          >
            <div className="space-y-1 flex-1 min-w-0">
              <div className="font-bold text-base font-display leading-snug">
                Nova Observação
              </div>
              <div
                className={`text-xs leading-relaxed ${
                  canCreate ? 'text-[#80C5B5]' : 'text-[#F8F5EF]/80'
                }`}
              >
                {canCreate
                  ? 'Registrar fato ou momento vivido'
                  : 'Requer cuidador vinculado ativo'}
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-xl bg-white/12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
              aria-hidden="true"
            >
              <Plus className="w-5 h-5 text-[#80C5B5]" />
            </div>
          </button>

          {/* Card 2: Consultar Meu Mundo */}
          <button
            type="button"
            onClick={() => setScreen('world')}
            className="h-full min-h-[104px] p-5 rounded-[18px] bg-white text-[#133E43] hover:bg-[#F8F5EF]/60 hover:border-[#133E43]/35 border border-[#133E43]/14 text-left transition-all shadow-xs flex items-start justify-between gap-3.5 group active:scale-[0.99]"
          >
            <div className="space-y-1 flex-1 min-w-0">
              <div className="font-bold text-base font-display leading-snug text-[#133E43]">
                Consultar Meu Mundo
              </div>
              <div className="text-xs text-[#265358] leading-relaxed">
                Confortos, sinais e sensibilidades
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-xl bg-[#80C5B5]/22 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
              aria-hidden="true"
            >
              <Compass className="w-5 h-5 text-[#133E43]" />
            </div>
          </button>

          {/* Card 3: Descobertas Offline */}
          <button
            type="button"
            onClick={() => setScreen('discoveries')}
            className="h-full min-h-[104px] p-5 rounded-[18px] bg-white text-[#133E43] hover:bg-[#F8F5EF]/60 hover:border-[#133E43]/35 border border-[#133E43]/14 text-left transition-all shadow-xs flex items-start justify-between gap-3.5 group active:scale-[0.99]"
          >
            <div className="space-y-1 flex-1 min-w-0">
              <div className="font-bold text-base font-display leading-snug text-[#133E43]">
                Descobertas Offline
              </div>
              <div className="text-xs text-[#265358] leading-relaxed">
                Atividades lúdicas e presença sem tela
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-xl bg-[#F1CA91]/35 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
              aria-hidden="true"
            >
              <Sparkles className="w-5 h-5 text-[#133E43]" />
            </div>
          </button>

          {/* Card 4: Preparar Síntese */}
          <button
            type="button"
            onClick={() => setScreen('report')}
            className="h-full min-h-[104px] p-5 rounded-[18px] bg-white text-[#133E43] hover:bg-[#F8F5EF]/60 hover:border-[#133E43]/35 border border-[#133E43]/14 text-left transition-all shadow-xs flex items-start justify-between gap-3.5 group active:scale-[0.99]"
          >
            <div className="space-y-1 flex-1 min-w-0">
              <div className="font-bold text-base font-display leading-snug text-[#133E43]">
                Preparar Síntese
              </div>
              <div className="text-xs text-[#265358] leading-relaxed">
                Organizar relatos para escola ou consulta
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-xl bg-[#CFA5A0]/28 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
              aria-hidden="true"
            >
              <FileText className="w-5 h-5 text-[#133E43]" />
            </div>
          </button>
        </div>
      </section>

      {/* =====================================================================
          FASE 6: CARDS DE INDICADORES E LEMBRETE AFETIVO
         ===================================================================== */}
      <section
        aria-label="Indicadores do perfil e lembrete afetivo"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch"
      >
        {/* Indicador 1: Diário em Memória */}
        <div className="h-full bg-white p-6 rounded-[20px] border border-[#133E43]/12 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#265358]">
                Diário em Memória
              </span>
              <div
                className="w-9 h-9 rounded-xl bg-[#80C5B5]/20 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <BookHeart className="w-[18px] h-[18px] text-[#133E43]" />
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#133E43] font-display tabular-nums leading-none">
                {activeChildObservations.length}
              </div>
              <p className="text-xs sm:text-sm text-[#265358] mt-2 leading-relaxed">
                observações contextuais registradas para{' '}
                <strong className="font-semibold text-[#133E43]">{activeProfile.name}</strong>
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#133E43]/10">
            <button
              type="button"
              onClick={() => setScreen('journal')}
              className="text-xs font-bold text-[#133E43] hover:text-[#194F55] hover:underline inline-flex items-center gap-1.5 min-h-[44px]"
            >
              <span>Ver linha temporal</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Indicador 2: Estratégias Catalogadas */}
        <div className="h-full bg-white p-6 rounded-[20px] border border-[#133E43]/12 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#265358]">
                Estratégias Catalogadas
              </span>
              <div
                className="w-9 h-9 rounded-xl bg-[#F1CA91]/35 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <Layers className="w-[18px] h-[18px] text-[#133E43]" />
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#133E43] font-display tabular-nums leading-none">
                {activeProfile.supportStrategies.length}
              </div>
              <p className="text-xs sm:text-sm text-[#265358] mt-2 leading-relaxed">
                formas de apoio e acolhimento com resposta observada
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#133E43]/10">
            <button
              type="button"
              onClick={() => setScreen('world')}
              className="text-xs font-bold text-[#133E43] hover:text-[#194F55] hover:underline inline-flex items-center gap-1.5 min-h-[44px]"
            >
              <span>Explorar estratégias</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Card 3: Lembrete Afetivo (Tratamento Editorial Próprio) */}
        <div className="h-full bg-[#80C5B5]/16 p-6 rounded-[20px] border border-[#80C5B5]/40 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#133E43]">
              Lembrete Afetivo
            </span>
            <div
              className="w-9 h-9 rounded-xl bg-[#133E43] flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <Heart className="w-[18px] h-[18px] text-[#80C5B5]" />
            </div>
          </div>

          <blockquote className="text-xs sm:text-sm text-[#133E43] italic leading-relaxed">
            &ldquo;A criança não se desregula para nos desafiar; ela expressa que o ambiente ou o
            momento ultrapassou sua capacidade atual de processar.&rdquo;
          </blockquote>

          <div className="pt-3 border-t border-[#133E43]/12 flex items-center justify-between text-xs text-[#265358] font-medium">
            <span>Compreender é o primeiro cuidado.</span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          FASE 7: OBSERVAÇÕES RECENTES
         ===================================================================== */}
      <section aria-labelledby="recent-observations-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
          <div>
            <h2
              id="recent-observations-heading"
              className="text-lg sm:text-xl font-bold text-[#133E43] font-display tracking-tight"
            >
              Observações Recentes
            </h2>
            <p className="text-xs sm:text-[13px] text-[#265358]">
              Registros contextuais mais recentes de {activeProfile.name}
            </p>
          </div>
          {activeChildObservations.length > 0 && (
            <button
              type="button"
              onClick={() => setScreen('journal')}
              className="text-xs sm:text-sm font-bold text-[#133E43] hover:text-[#194F55] hover:underline min-h-[44px] px-2 rounded-xl flex items-center gap-1.5"
            >
              <span>Ver todas ({activeChildObservations.length})</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {isAllEmpty ? (
          <div className="bg-white rounded-[24px] p-8 sm:p-10 border border-dashed border-[#133E43]/25 text-center space-y-3.5">
            <div
              className="w-12 h-12 rounded-2xl bg-[#F8F5EF] text-[#133E43] flex items-center justify-center mx-auto border border-[#133E43]/10"
              aria-hidden="true"
            >
              <Eye className="w-6 h-6 text-[#265358]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#133E43] font-display">
              Nenhuma observação registrada no momento
            </h3>
            <p className="text-xs sm:text-sm text-[#265358] max-w-md mx-auto leading-relaxed">
              O estado vazio está ativo para {activeProfile.name}. Você pode registrar uma nova
              observação ou restaurar os dados sintéticos de demonstração.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenNewObservation}
                disabled={!canCreate}
                className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl min-h-[44px] flex items-center gap-2 ${
                  canCreate
                    ? 'bg-[#133E43] text-[#F8F5EF] hover:bg-[#194F55]'
                    : 'bg-[#133E43]/35 text-[#F8F5EF]/75 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4 text-[#80C5B5]" aria-hidden="true" />
                <span>Registrar Primeira Observação</span>
              </button>
              <button
                type="button"
                onClick={restoreDemoData}
                className="px-4 py-2.5 border border-[#133E43]/25 text-[#133E43] text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#133E43]/5 min-h-[44px]"
              >
                Restaurar Dados de Exemplo
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {recentObservations.map((obs) => {
              const typeInfo = typeLabels[obs.eventType] || {
                label: obs.eventType,
                textClass: 'text-[#133E43] font-bold',
              };
              const provenanceText =
                obs.provenance === 'REPORTED_BY_OTHER'
                  ? obs.reportedByLabel
                    ? `Relatado por ${obs.reportedByLabel}`
                    : 'Relato de terceiro'
                  : `Observação direta (${roleLabels[obs.observerRole] || obs.observerRole})`;

              return (
                <article
                  key={obs.id}
                  className="h-full bg-white p-5 sm:p-6 rounded-[20px] border border-[#133E43]/14 shadow-xs hover:border-[#133E43]/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Metadados Limpos (Tipo de Observação · Ambiente) */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#265358]">
                      <span className={typeInfo.textClass}>{typeInfo.label}</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#133E43]/70" aria-hidden="true" />
                        {envLabels[obs.environment] || obs.environment}
                      </span>
                    </div>

                    {/* Resumo Objetivo com Limite Acessível */}
                    <p className="text-sm font-medium text-[#133E43] line-clamp-3 leading-relaxed">
                      {obs.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#133E43]/10">
                    {/* Informações de Origem / Proveniência e Data */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#265358]">
                      <span className="inline-flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-[#133E43]/70" aria-hidden="true" />
                        <span>{provenanceText}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Calendar className="w-3.5 h-3.5 text-[#133E43]/70" aria-hidden="true" />
                        <span>{formatShortDate(obs.occurredAt)}</span>
                      </span>
                    </div>

                    {/* Ação Clara para Consultar Detalhes */}
                    <button
                      type="button"
                      onClick={() => onSelectObservation(obs)}
                      aria-label={`Consultar detalhes da observação de ${typeInfo.label} em ${
                        envLabels[obs.environment] || obs.environment
                      }`}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F8F5EF] hover:bg-[#133E43] text-[#133E43] hover:text-[#F8F5EF] border border-[#133E43]/12 text-xs font-bold transition-colors min-h-[44px] flex items-center justify-between group"
                    >
                      <span>Consultar detalhes</span>
                      <ArrowRight
                        className="w-4 h-4 text-[#133E43] group-hover:text-[#80C5B5] transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Banner de Garantia Ética e Volatilidade */}
      <section
        aria-label="Garantia de privacidade em memória volátil"
        className="p-4 sm:p-5 rounded-[20px] bg-white/80 border border-[#133E43]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-[13px] text-[#265358]"
      >
        <div className="flex items-start sm:items-center gap-2.5">
          <Shield className="w-4 h-4 text-[#133E43] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <span>
            <strong className="text-[#133E43]">Ambiente 100% Volátil:</strong> Os registros de
            demonstração residem exclusivamente na memória desta aba. Nenhuma informação é enviada a
            servidores.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setScreen('privacy')}
          className="underline font-bold text-[#133E43] hover:text-[#194F55] shrink-0 min-h-[44px] self-start sm:self-center flex items-center px-1 rounded-lg"
        >
          Política e Cofre Local
        </button>
      </section>
    </div>
  );
};
