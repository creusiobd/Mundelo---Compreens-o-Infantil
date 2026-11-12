/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  ServerOff,
  Database,
  Heart,
  FileCheck2,
  Trash2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Download,
  Upload,
} from 'lucide-react';

interface PrivacyScreenProps {
  onOpenExportVault?: () => void;
  onOpenImportVault?: () => void;
  onOpenSecurityLab?: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({
  onOpenExportVault,
  onOpenImportVault,
  onOpenSecurityLab,
}) => {
  const { clearActiveChildObservationsToEmpty, restoreDemoData, activeChildObservations, activeProfile } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#80C5B5]/20 text-[#133E43] text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacidade & Princípios Éticos</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#133E43] font-display">
          Proteção de Dados & Limites Éticos
        </h1>
        <p className="text-xs sm:text-sm text-[#265358] mt-1 max-w-2xl leading-relaxed">
          A infância é sagrada. O Mundelo foi concebido sob o princípio da máxima proteção à privacidade e minimização absoluta de dados nos primeiros anos de vida.
        </p>
      </div>

      {/* Immediate Session Status Card */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#133E43]/15 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#80C5B5]/20 flex items-center justify-center shrink-0 text-[#133E43]">
            <ServerOff className="w-5 h-5 text-[#133E43]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#133E43] font-display">
              Arquitetura Atual: 100% em Memória Volátil
            </h2>
            <p className="text-xs sm:text-sm text-[#265358] leading-relaxed">
              Neste protótipo demonstrativo, nenhuma informação é salva em disco rígido, banco de dados remoto ou sequer no <code>localStorage</code> do seu navegador. Ao fechar esta aba, todos os registros criados se dissipam imediatamente.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#133E43]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#265358]">
            Registros temporários em memória ({activeProfile.name}): <strong>{activeChildObservations.length}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={clearActiveChildObservationsToEmpty}
              className="px-3 py-1.5 rounded-xl border border-[#CFA5A0] text-[#133E43] hover:bg-red-50 flex items-center gap-1.5 transition-colors min-h-[36px]"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#8C4F48]" />
              Zerar Memória de {activeProfile.name}
            </button>
            <button
              onClick={restoreDemoData}
              className="px-3 py-1.5 rounded-xl bg-[#80C5B5]/20 text-[#133E43] hover:bg-[#80C5B5]/30 flex items-center gap-1.5 transition-colors min-h-[36px]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#133E43]" />
              Restaurar Dados Exemplo
            </button>
          </div>
        </div>
      </section>

      {/* Experimental Encrypted Local Vault Card */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#133E43]/15 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#133E43] flex items-center justify-center shrink-0 text-[#80C5B5]">
              <Lock className="w-5 h-5 text-[#80C5B5]" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#133E43] bg-[#80C5B5]/30 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-[#133E43]" />
                Recurso Experimental · Web Crypto API
              </div>
              <h2 className="text-base font-bold text-[#133E43] font-display">
                Cofre Criptografado Local (.mundelo-vault)
              </h2>
              <p className="text-xs sm:text-sm text-[#265358] leading-relaxed max-w-xl">
                Exporte e importe observações sintéticas em um arquivo protegido por senha (AES-GCM-256 + PBKDF2 com 600.000 iterações), processado inteiramente no navegador sem tocar em servidores externos nem persistência desprotegida.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#133E43]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#265358] text-[11px]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>Perfil Ativo: <strong>{activeProfile.name}</strong> ({activeChildObservations.length} observações sintéticas)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {import.meta.env.DEV && onOpenSecurityLab && (
              <button
                onClick={onOpenSecurityLab}
                className="px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100 flex items-center gap-1.5 transition-all text-xs font-semibold min-h-[40px]"
              >
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Security Lab (SEC-23 Dev)</span>
              </button>
            )}
            <button
              onClick={onOpenExportVault}
              className="px-4 py-2 rounded-xl bg-[#133E43] text-white hover:bg-[#133E43]/90 flex items-center gap-1.5 transition-all text-xs font-semibold shadow-xs min-h-[40px] active:scale-[0.98]"
            >
              <Download className="w-4 h-4 text-[#80C5B5]" />
              <span>Exportar Cofre (.mundelo-vault)</span>
            </button>
            <button
              onClick={onOpenImportVault}
              className="px-4 py-2 rounded-xl border border-[#133E43]/20 bg-[#F8F5EF] text-[#133E43] hover:bg-white flex items-center gap-1.5 transition-all text-xs font-semibold min-h-[40px]"
            >
              <Upload className="w-4 h-4 text-[#133E43]" />
              <span>Importar Cofre</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Child Privacy */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#133E43] font-display">
          Quatro Compromissos Invioláveis do Mundelo
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-[#133E43]/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#133E43] uppercase tracking-wider">
              <EyeOff className="w-4 h-4 text-[#80C5B5]" />
              1. Zero Informações Reais na Demonstração
            </div>
            <p className="text-xs text-[#265358] leading-relaxed">
              Não solicite, insira ou compartilhe fotos, nomes completos, datas de nascimento reais ou endereços de crianças verdadeiras nesta etapa. Utilize apenas identidades ilustrativas.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#133E43]/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#133E43] uppercase tracking-wider">
              <Lock className="w-4 h-4 text-[#F1CA91]" />
              2. Sem Monetização de Dados Infantis
            </div>
            <p className="text-xs text-[#265358] leading-relaxed">
              O Mundelo nunca venderá dados, nunca criará perfis para publicidade comportamental e nunca alimentará modelos comerciais de terceiros com observações de crianças.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#133E43]/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#133E43] uppercase tracking-wider">
              <Database className="w-4 h-4 text-[#8C4F48]" />
              3. Controle Familiar Absoluto
            </div>
            <p className="text-xs text-[#265358] leading-relaxed">
              Os responsáveis legais são os únicos donos das anotações. Cada compartilhamento (com a escola ou terapeuta) será sempre explícito, granular e pontual.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#133E43]/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#133E43] uppercase tracking-wider">
              <FileCheck2 className="w-4 h-4 text-[#133E43]" />
              4. Não Rotulação e Não Diagnóstico
            </div>
            <p className="text-xs text-[#265358] leading-relaxed">
              Recusamos deliberadamente algoritmos de &quot;predição de risco&quot; ou pontuações de desvio padrão. O objetivo é compreender singularidades humanas, não etiquetar vidas.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap for Future Stage 2 Security Architecture */}
      <section className="bg-[#F8F5EF] p-5 sm:p-6 rounded-3xl border border-[#133E43]/15 space-y-3">
        <h2 className="text-base font-bold text-[#133E43] font-display">
          Diretrizes Arquiteturais Futuras de Segurança (Etapas Posteriores)
        </h2>
        <p className="text-xs sm:text-sm text-[#265358] leading-relaxed">
          Para fases futuras com backend e autenticação, o projeto será submetido a auditorias formais independentes e adotará os seguintes princípios técnicos de arquitetura segura:
        </p>

        <ul className="space-y-2 text-xs text-[#133E43] pt-1">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#133E43] mt-2 shrink-0" />
            <span><strong>Criptografia em Repouso e em Trânsito:</strong> Chaves individuais por família com criptografia nas notas contextuais.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#133E43] mt-2 shrink-0" />
            <span><strong>Consentimento Parental Duplamente Verificado:</strong> Validação explícita de responsabilidade legal para inclusão de novos cuidadores.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#133E43] mt-2 shrink-0" />
            <span><strong>Direito ao Esquecimento Imediato:</strong> Botão de exclusão total irreversível de todos os registros da família em um clique.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#133E43] mt-2 shrink-0" />
            <span><strong>Exportação Aberta (Portabilidade):</strong> Download de todos os dados familiares em formatos abertos (JSON e PDF estruturado) a qualquer momento.</span>
          </li>
        </ul>
      </section>

      {/* Ethical Quote */}
      <div className="p-4 bg-[#80C5B5]/15 border border-[#80C5B5]/30 rounded-2xl text-center text-xs text-[#133E43] italic">
        &quot;A tecnologia deve servir ao vínculo humano, nunca substituir a presença amorosa de quem cuida.&quot;
      </div>
    </div>
  );
};
