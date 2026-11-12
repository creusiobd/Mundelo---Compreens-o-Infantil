/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  Eye,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BookHeart,
  Compass,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { setScreen, activeProfile } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
      {/* Brand Hero */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#80C5B5]/20 text-[#133E43] text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-[#133E43]" />
          <span>Plataforma de Compreensão Infantil (0 a 5 anos)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#133E43] font-display tracking-tight leading-tight">
          Cada criança, um mundo. <br className="hidden sm:inline" />
          Cada vínculo, uma descoberta.
        </h1>

        <p className="text-base sm:text-lg text-[#133E43]/80 leading-relaxed max-w-2xl mx-auto">
          <span className="font-semibold text-[#133E43]">Compreender é o primeiro cuidado.</span> Apoie sua família no registro de observações contextuais, reconheça preferências e necessidades singulares, e prepare conversas qualificadas com educadores e profissionais de saúde.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setScreen('home')}
            className="px-6 py-3 rounded-2xl bg-[#133E43] hover:bg-[#133E43]/90 text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98] min-h-[48px] flex items-center gap-2"
          >
            <span>Explorar Início com {activeProfile.name}</span>
            <ArrowRight className="w-4 h-4 text-[#80C5B5]" />
          </button>
          <button
            onClick={() => setScreen('onboarding')}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-white/80 border border-[#133E43]/20 text-[#133E43] font-medium text-sm transition-all min-h-[48px] flex items-center gap-1.5"
          >
            <span>Configurar Perfil Demonstrativo</span>
          </button>
        </div>
      </section>

      {/* Product Boundaries / Non-diagnostic Ethical Commitment */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-[#133E43]/15 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F1CA91]/30 flex items-center justify-center shrink-0 text-[#133E43]">
            <AlertTriangle className="w-5 h-5 text-[#133E43]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#133E43] font-display leading-tight">
              Limites do Mundelo: O que somos e o que não somos
            </h2>
            <p className="text-xs sm:text-sm text-[#133E43]/75 mt-1 leading-relaxed">
              Para garantir uma relação de respeito profundo com o desenvolvimento infantil, o Mundelo adota compromissos éticos inegociáveis:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#80C5B5]/10 border border-[#80C5B5]/30 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#133E43] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#133E43]" />
              O que o Mundelo é
            </h3>
            <ul className="text-xs sm:text-sm space-y-2 text-[#133E43]/85">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#133E43] mt-2 shrink-0" />
                <span><strong>Caderno vivo de observação afetuosa:</strong> registro sistemático de rotinas, preferências e momentos marcantes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#133E43] mt-2 shrink-0" />
                <span><strong>Mapeador de contexto:</strong> ajuda a notar como a iluminação, sons, sono e transições influenciam o bem-estar infantil.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#133E43] mt-2 shrink-0" />
                <span><strong>Ponte de escuta qualificada:</strong> organiza fatos e antecedentes para levar ao pediatra, terapeuta ou escola.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#CFA5A0]/15 border border-[#CFA5A0]/30 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#133E43] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#133E43]" />
              O que o Mundelo NÃO é
            </h3>
            <ul className="text-xs sm:text-sm space-y-2 text-[#133E43]/85">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CFA5A0] mt-2 shrink-0" />
                <span><strong>Não é ferramenta diagnóstica:</strong> nunca rotula, prevê síndromes ou classifica a criança por &quot;risco&quot;.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CFA5A0] mt-2 shrink-0" />
                <span><strong>Não substitui consultas médicas:</strong> avaliações clínicas e terapêuticas são exclusivas de profissionais habilitados.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CFA5A0] mt-2 shrink-0" />
                <span><strong>Não faz rankings ou comparações:</strong> nenhuma criança é colocada em réguas de normalidade punitiva.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#133E43] font-display">
            Três Pilares do Cuidado Observacional
          </h2>
          <p className="text-xs sm:text-sm text-[#133E43]/70">
            Princípios desenhados com base em boas práticas da primeira infância
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-[#133E43]/10 space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#80C5B5]/20 flex items-center justify-center text-[#133E43]">
              <Eye className="w-5 h-5 text-[#133E43]" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#133E43] font-display">
              1. Fatos antes das suposições
            </h3>
            <p className="text-xs sm:text-sm text-[#133E43]/75 leading-relaxed">
              Anotamos o que a criança fez, disse ou expressou, e o que o ambiente oferecia no instante. Separamos fatos objetivos de hipóteses afetivas.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#133E43]/10 space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F1CA91]/30 flex items-center justify-center text-[#133E43]">
              <Compass className="w-5 h-5 text-[#133E43]" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#133E43] font-display">
              2. Singularidade & Regulação
            </h3>
            <p className="text-xs sm:text-sm text-[#133E43]/75 leading-relaxed">
              Mapeamos os objetos de conforto, as sensibilidades sensoriais relatadas e as estratégias que realmente acalmam e devolvem o equilíbrio.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#133E43]/10 space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#CFA5A0]/20 flex items-center justify-center text-[#133E43]">
              <BookHeart className="w-5 h-5 text-[#133E43]" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#133E43] font-display">
              3. Vínculo que Fortalece
            </h3>
            <p className="text-xs sm:text-sm text-[#133E43]/75 leading-relaxed">
              A criança não precisa ser &quot;consertada&quot;. O adulto cuidador se torna um leitor sensível das necessidades e um porto seguro de conexão.
            </p>
          </div>
        </div>
      </section>

      {/* Guided Tour Destinations */}
      <section className="bg-white/80 rounded-3xl p-5 sm:p-6 border border-[#133E43]/10">
        <h2 className="text-base font-bold text-[#133E43] font-display mb-3">
          Explore as Áreas da Plataforma
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setScreen('journal')}
            className="p-3.5 rounded-2xl bg-[#F8F5EF] hover:bg-[#80C5B5]/20 border border-[#133E43]/10 text-left transition-colors min-h-[80px]"
          >
            <BookHeart className="w-5 h-5 text-[#133E43] mb-1.5" />
            <div className="font-bold text-xs text-[#133E43]">Diário</div>
            <div className="text-[11px] text-[#133E43]/60">Linha temporal e registros</div>
          </button>

          <button
            onClick={() => setScreen('world')}
            className="p-3.5 rounded-2xl bg-[#F8F5EF] hover:bg-[#80C5B5]/20 border border-[#133E43]/10 text-left transition-colors min-h-[80px]"
          >
            <Compass className="w-5 h-5 text-[#133E43] mb-1.5" />
            <div className="font-bold text-xs text-[#133E43]">Meu Mundo</div>
            <div className="text-[11px] text-[#133E43]/60">Interesses & Conforto</div>
          </button>

          <button
            onClick={() => setScreen('discoveries')}
            className="p-3.5 rounded-2xl bg-[#F8F5EF] hover:bg-[#80C5B5]/20 border border-[#133E43]/10 text-left transition-colors min-h-[80px]"
          >
            <Sparkles className="w-5 h-5 text-[#133E43] mb-1.5" />
            <div className="font-bold text-xs text-[#133E43]">Descobertas</div>
            <div className="text-[11px] text-[#133E43]/60">Atividades offline</div>
          </button>

          <button
            onClick={() => setScreen('report')}
            className="p-3.5 rounded-2xl bg-[#F8F5EF] hover:bg-[#80C5B5]/20 border border-[#133E43]/10 text-left transition-colors min-h-[80px]"
          >
            <FileText className="w-5 h-5 text-[#133E43] mb-1.5" />
            <div className="font-bold text-xs text-[#133E43]">Relatório</div>
            <div className="text-[11px] text-[#133E43]/60">Síntese para consultas</div>
          </button>
        </div>
      </section>
    </div>
  );
};
