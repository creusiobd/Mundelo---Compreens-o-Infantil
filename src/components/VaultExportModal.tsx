/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { encryptVault } from '../crypto/vault';
import {
  Lock,
  X,
  ShieldAlert,
  Download,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  KeyRound,
  FileText,
} from 'lucide-react';

interface VaultExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VaultExportModal: React.FC<VaultExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    activeProfile,
    activeCaregiver,
    activeChildObservations,
    exportVaultData,
    showNotification,
  } = useApp();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canExport =
    activeCaregiver.status === 'ACTIVE' &&
    activeCaregiver.linkedChildIds.includes(activeProfile.id);

  if (!isOpen) return null;

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('A senha do cofre deve possuir no mínimo 8 caracteres para garantir resistência a ataques offline.');
      return;
    }

    if (password !== confirmPassword) {
      setError('A confirmação da senha não confere com a senha digitada.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Gera o payload canônico em memória
      const payload = exportVaultData(activeProfile.id);

      // 2. Cifra o cofre usando a Web Crypto API (AES-GCM-256 + PBKDF2 600.000 iterações)
      // Executa de forma assíncrona dando tempo ao render do spinner
      await new Promise((resolve) => setTimeout(resolve, 50));
      const envelope = await encryptVault(payload, password, 600000);

      // 3. Serializa em JSON formatado e cria download seguro em memória
      const jsonString = JSON.stringify(envelope, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const timestamp = new Date().toISOString().slice(0, 10);
      const safeChildName = activeProfile.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `mundelo-${safeChildName}-${timestamp}.mundelo-vault`;

      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      // 4. Limpeza estrita de senhas da memória do componente
      setPassword('');
      setConfirmPassword('');
      showNotification(`Cofre criptografado de ${activeProfile.name} baixado com sucesso!`, 'success');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao cifrar o cofre.';
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div className="relative bg-[#F8F5EF] rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#133E43]/15 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#133E43]/10 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#80C5B5]/20 flex items-center justify-center text-[#133E43]">
              <Lock className="w-4 h-4 text-[#133E43]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#80C5B5] bg-[#133E43] px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-[#F1CA91]" />
                Recurso Experimental
              </div>
              <h2 id="export-modal-title" className="text-base sm:text-lg font-bold text-[#133E43] font-display">
                Exportar Cofre Criptografado
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 text-[#133E43]/60 hover:text-[#133E43] hover:bg-[#133E43]/5 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar exportador de cofre"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleExport} className="overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {/* Summary Box */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#133E43]/10 space-y-1.5 text-xs text-[#133E43]">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Perfil Selecionado:</span>
              <strong className="text-sm font-display">{activeProfile.name} ({activeProfile.ageLabel})</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Observações no Pacote:</span>
              <span><strong>{activeChildObservations.length}</strong> registros sintéticos</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#133E43]/70 pt-1 border-t border-[#133E43]/10">
              <span>Formato & Algoritmo:</span>
              <span className="font-mono">AES-GCM-256 + PBKDF2 (600k iterações)</span>
            </div>
          </div>

          {!canExport && (
            <div className="p-3.5 bg-red-50 border border-red-300 rounded-2xl text-xs text-red-800 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold text-red-900 block">
                  Acesso Negado: Cuidador Não Autorizado
                </strong>
                <p>
                  O cuidador ativo simulado é <strong>{activeCaregiver.displayName}</strong> ({activeCaregiver.relationshipLabel || activeCaregiver.role}), que não possui vínculo ativo com {activeProfile.name}. A exportação de cofre está bloqueada para preservar o modelo de menor privilégio.
                </p>
              </div>
            </div>
          )}

          {/* Warning Banner */}
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <strong className="font-bold text-amber-900 block">
                Sem Recuperação em Nuvem (Zero-Knowledge Local)
              </strong>
              <p>
                A cifra é executada diretamente no seu navegador através da Web Crypto API. Não há servidores centrais, tokens nem recuperação de senha. Se você esquecer a senha definida abaixo, o arquivo baixado <strong>não poderá ser recuperado</strong>.
              </p>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="vault-password" className="block text-xs font-bold text-[#133E43] uppercase tracking-wider">
              Senha de Proteção do Cofre <span className="text-[#CFA5A0]">*</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#133E43]/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="vault-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 8 caracteres (letras, números, símbolos)"
                disabled={isProcessing}
                className="w-full bg-white border border-[#133E43]/20 rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#133E43]/60 hover:text-[#133E43] p-1"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="vault-password-confirm" className="block text-xs font-bold text-[#133E43] uppercase tracking-wider">
              Confirme a Senha <span className="text-[#CFA5A0]">*</span>
            </label>
            <input
              id="vault-password-confirm"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite a mesma senha novamente"
              disabled={isProcessing}
              className="w-full bg-white border border-[#133E43]/20 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#133E43] focus:outline-none min-h-[44px]"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#133E43]/10 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-medium text-[#133E43] hover:bg-[#133E43]/5 rounded-xl border border-[#133E43]/15 min-h-[44px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing || !password || !confirmPassword || !canExport}
              className={`w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all min-h-[44px] flex items-center justify-center gap-2 ${
                isProcessing || !password || !confirmPassword || !canExport
                  ? 'bg-[#133E43]/40 text-white/70 cursor-not-allowed'
                  : 'bg-[#133E43] hover:bg-[#133E43]/90 text-white active:scale-[0.98]'
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Derivando Chave (600k iterações)...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#80C5B5]" />
                  <span>Cifrar e Baixar Cofre</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
