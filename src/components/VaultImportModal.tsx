/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  parseVaultFileString,
  decryptVault,
} from '../crypto/vault';
import {
  MundeloVaultEnvelopeV1,
  VaultPayload,
  VAULT_MAX_FILE_BYTES,
} from '../crypto/types';
import { VaultEnvelopeSchema } from '../crypto/schemas';
import { resolveObservationBatch } from '../security/conflictResolver';
import {
  Upload,
  X,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
  FileCheck,
  Eye,
  EyeOff,
  Sparkles,
  AlertTriangle,
  Layers,
  RefreshCw,
} from 'lucide-react';

interface VaultImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ImportStep = 'SELECT_FILE' | 'ENTER_PASSWORD' | 'PREVIEW_CONFIRM';

export const VaultImportModal: React.FC<VaultImportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { importVaultPayload, allObservations, activeProfile, activeCaregiver } = useApp();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<ImportStep>('SELECT_FILE');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [rawEnvelope, setRawEnvelope] = useState<MundeloVaultEnvelopeV1 | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Decrypted preview state & context snapshot (SEC-17 / SEC-18)
  const [decryptedPayload, setDecryptedPayload] = useState<VaultPayload | null>(null);
  const [previewSnapshot, setPreviewSnapshot] = useState<{
    caregiverId: string;
    activeProfileId: string;
  } | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');

  if (!isOpen) return null;

  const handleReset = () => {
    setStep('SELECT_FILE');
    setSelectedFileName('');
    setRawEnvelope(null);
    setPassword('');
    setShowPassword(false);
    setIsProcessing(false);
    setIsCommitting(false);
    setError(null);
    setDecryptedPayload(null);
    setPreviewSnapshot(null);
    setImportMode('merge');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // 1. Process selected file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > VAULT_MAX_FILE_BYTES) {
      setError(`O arquivo selecionado (${(file.size / 1024 / 1024).toFixed(1)} MB) excede o limite máximo permitido de 5 MB.`);
      return;
    }

    setSelectedFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseVaultFileString(text);
        // Validação imediata do schema do envelope
        const envelope = VaultEnvelopeSchema.parse(parsed) as MundeloVaultEnvelopeV1;
        setRawEnvelope(envelope);
        setStep('ENTER_PASSWORD');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Arquivo de cofre inválido.';
        setError(msg);
      }
    };

    reader.onerror = () => {
      setError('Erro ao ler o arquivo selecionado no navegador.');
    };

    reader.readAsText(file);
  };

  // 2. Unlock and decrypt
  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawEnvelope) return;
    setError(null);

    if (!password) {
      setError('Por favor, digite a senha do cofre.');
      return;
    }

    const startCaregiverId = activeCaregiver.id;
    const startProfileId = activeProfile.id;

    setIsProcessing(true);

    try {
      // Pequeno atraso para o spinner renderizar
      await new Promise((resolve) => setTimeout(resolve, 50));
      const payload = await decryptVault(rawEnvelope, password);
      setDecryptedPayload(payload);
      setPreviewSnapshot({
        caregiverId: startCaregiverId,
        activeProfileId: startProfileId,
      });
      setStep('PREVIEW_CONFIRM');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha na decifragem.';
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Context shift detection between preview and commit (SEC-18)
  const hasContextShifted = Boolean(
    previewSnapshot &&
      (activeCaregiver.id !== previewSnapshot.caregiverId ||
        activeProfile.id !== previewSnapshot.activeProfileId)
  );

  // Deterministic conflict resolution preview (SEC-14)
  const batchPreview = decryptedPayload
    ? resolveObservationBatch(
        allObservations,
        decryptedPayload.observations,
        decryptedPayload.childProfile.id
      )
    : null;

  const hasMergeConflict = Boolean(
    importMode === 'merge' && batchPreview && !batchPreview.success
  );

  // 3. Confirm and apply atomically (SEC-14, SEC-16, SEC-17, SEC-18)
  const handleConfirmImport = () => {
    if (!decryptedPayload || isCommitting) return;

    if (hasContextShifted) {
      setError(
        'O contexto de cuidador ou criança foi alterado durante a pré-visualização. Por segurança, reinicie a importação.'
      );
      return;
    }

    setIsCommitting(true);
    try {
      const result = importVaultPayload(decryptedPayload, importMode);
      if (result.success) {
        handleClose();
      } else {
        setError(result.message);
      }
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div className="relative bg-[#F8F5EF] rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#133E43]/15 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#133E43]/10 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#80C5B5]/20 flex items-center justify-center text-[#133E43]">
              <Upload className="w-4 h-4 text-[#133E43]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#80C5B5] bg-[#133E43] px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-[#F1CA91]" />
                Recurso Experimental
              </div>
              <h2 id="import-modal-title" className="text-base sm:text-lg font-bold text-[#133E43] font-display">
                Importar Cofre Criptografado
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="p-2 text-[#133E43]/60 hover:text-[#133E43] hover:bg-[#133E43]/5 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar importador de cofre"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {/* Step 1: Select File */}
          {step === 'SELECT_FILE' && (
            <div className="space-y-4">
              <p className="text-[#133E43]/80 leading-relaxed text-xs">
                Selecione um arquivo <code>.mundelo-vault</code> ou JSON criptografado previamente exportado para inspecionar e restaurar dados sintéticos em memória.
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#133E43]/30 hover:border-[#133E43] rounded-3xl p-8 text-center cursor-pointer bg-white transition-colors space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#80C5B5]/20 text-[#133E43] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <strong className="text-sm font-semibold text-[#133E43] block">
                    Clique para selecionar o arquivo .mundelo-vault
                  </strong>
                  <span className="text-xs text-[#133E43]/60 block mt-1">
                    Formatos aceitos: .mundelo-vault, .json (limite de 5 MB)
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mundelo-vault,.json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Enter Password */}
          {step === 'ENTER_PASSWORD' && rawEnvelope && (
            <form onSubmit={handleDecrypt} className="space-y-4">
              {/* Envelope Public Card */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#133E43]/15 space-y-1.5 text-xs text-[#133E43]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Arquivo Carregado:</span>
                  <span className="font-mono truncate max-w-[220px]">{selectedFileName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Criança no Cofre:</span>
                  <strong className="font-display">{rawEnvelope.childName} (ID: {rawEnvelope.childId})</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Observações Declaradas:</span>
                  <span><strong>{rawEnvelope.recordCount}</strong> registros</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#133E43]/70 pt-1 border-t border-[#133E43]/10">
                  <span>Proteção Autenticada:</span>
                  <span className="font-mono">AES-GCM-256 (AAD verificado)</span>
                </div>
              </div>

              {/* Authorization check */}
              {activeCaregiver.status !== 'ACTIVE' || !activeCaregiver.linkedChildIds.includes(rawEnvelope.childId) ? (
                <div className="p-3.5 bg-red-50 border border-red-300 rounded-2xl text-xs text-red-800 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-bold text-red-900 block">
                      Acesso Negado: Cuidador Sem Vínculo com a Criança do Cofre
                    </strong>
                    <p>
                      O cuidador ativo simulado é <strong>{activeCaregiver.displayName}</strong> ({activeCaregiver.relationshipLabel || activeCaregiver.role}), que não possui vínculo ativo com {rawEnvelope.childName}. A operação está bloqueada pelo modelo de autorização.
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Cross-child notice */}
              {rawEnvelope.childId !== activeProfile.id && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong>Importação Entre Perfis:</strong>
                    <p>
                      O arquivo selecionado pertence a <strong>{rawEnvelope.childName}</strong>, enquanto a sessão atual está visualizando <strong>{activeProfile.name}</strong>. Ao confirmar, o contexto ativo será alternado para {rawEnvelope.childName}.
                    </p>
                  </div>
                </div>
              )}

              {/* Password prompt */}
              <div className="space-y-1.5">
                <label htmlFor="import-password" className="block text-xs font-bold text-[#133E43] uppercase tracking-wider">
                  Senha para Desbloquear o Cofre <span className="text-[#CFA5A0]">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#133E43]/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="import-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha definida na exportação"
                    disabled={isProcessing}
                    autoFocus
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

              {error && (
                <div className="p-3.5 bg-red-50 border border-red-300 rounded-2xl text-xs text-red-700 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <div className="space-y-0.5">
                    <strong className="font-semibold block">Falha de Autenticação / Decifragem:</strong>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 border-t border-[#133E43]/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-[#133E43]/70 hover:text-[#133E43] min-h-[40px]"
                >
                  Trocar de arquivo
                </button>
                <button
                  type="submit"
                  disabled={
                    isProcessing ||
                    !password ||
                    activeCaregiver.status !== 'ACTIVE' ||
                    !activeCaregiver.linkedChildIds.includes(rawEnvelope.childId)
                  }
                  className={`w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all min-h-[44px] flex items-center justify-center gap-2 ${
                    isProcessing ||
                    !password ||
                    activeCaregiver.status !== 'ACTIVE' ||
                    !activeCaregiver.linkedChildIds.includes(rawEnvelope.childId)
                      ? 'bg-[#133E43]/40 text-white/70 cursor-not-allowed'
                      : 'bg-[#133E43] hover:bg-[#133E43]/90 text-white active:scale-[0.98]'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Autenticando & Decifrando...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 text-[#80C5B5]" />
                      <span>Desbloquear e Inspecionar</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Preview & Confirm (Transactional Gate) */}
          {step === 'PREVIEW_CONFIRM' && decryptedPayload && batchPreview && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <strong>Autenticação bem-sucedida!</strong> A tag de integridade AES-GCM e o schema foram validados com sucesso.
                </span>
              </div>

              {/* Context Shift Alert (SEC-18) */}
              {hasContextShifted && (
                <div className="p-3.5 bg-red-50 border border-red-300 rounded-2xl text-xs text-red-900 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-bold block">
                      Contexto Alterado Durante a Pré-visualização (SEC-18)
                    </strong>
                    <p>
                      O perfil ativo ou cuidador simulado mudou após a decifragem do cofre. Por segurança transacional, reinicie a importação.
                    </p>
                  </div>
                </div>
              )}

              {/* Decrypted Metadata Summary */}
              <div className="bg-white p-4 rounded-2xl border border-[#133E43]/15 space-y-2 text-xs text-[#133E43]">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#133E43]/10">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-[#133E43]/70">
                    Conteúdo Inspecionado:
                  </span>
                  <span className="font-mono text-[11px] text-[#133E43]/60">
                    Exportado em: {new Date(decryptedPayload.exportedAt).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="font-semibold block text-[#133E43]/70">Criança:</span>
                    <strong className="text-sm font-display text-[#133E43]">
                      {decryptedPayload.childProfile.name} ({decryptedPayload.childProfile.ageLabel})
                    </strong>
                  </div>
                  <div>
                    <span className="font-semibold block text-[#133E43]/70">Total de Observações:</span>
                    <strong className="text-sm text-[#133E43]">
                      {decryptedPayload.observations.length} registros
                    </strong>
                  </div>
                </div>

                {/* Deterministic SEC-14 Resolution Summary */}
                <div className="pt-2 border-t border-[#133E43]/10 flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="text-emerald-700">
                    <strong>+{batchPreview.actionCounts.INSERT}</strong> inéditos (INSERT)
                  </span>
                  <span className="text-sky-800">
                    <strong>{batchPreview.actionCounts.UPDATE}</strong> atualizações (UPDATE)
                  </span>
                  <span className="text-[#133E43]/70">
                    <strong>{batchPreview.actionCounts.NOOP + batchPreview.actionCounts.KEEP}</strong> preservados (NOOP/KEEP)
                  </span>
                  {batchPreview.actionCounts.CONFLICT > 0 && (
                    <span className="text-red-700 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {batchPreview.actionCounts.CONFLICT} conflito(s) bloqueante(s)
                    </span>
                  )}
                </div>
              </div>

              {/* Conflict Details Alert (SEC-14) */}
              {hasMergeConflict && (
                <div className="p-3.5 bg-red-50 border border-red-300 rounded-2xl text-xs text-red-900 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Conflito de Integridade Detectado no Modo Mesclar (SEC-14)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    A política do Mundelo proíbe sobrescrita cega (sem <em>last-write-wins</em>). O lote inteiro será abortado no modo Mesclar:
                  </p>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 font-mono">
                    {batchPreview.conflicts.slice(0, 3).map((c) => (
                      <li key={c.incomingId}>
                        [{c.incomingId}]: {c.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Import Mode Selection */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-[#133E43] uppercase tracking-wider">
                  Como deseja aplicar os dados na memória?
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setImportMode('merge')}
                    className={`p-3 rounded-2xl border text-left text-xs transition-colors min-h-[56px] ${
                      importMode === 'merge'
                        ? 'border-[#133E43] bg-[#133E43] text-white shadow-xs'
                        : 'border-[#133E43]/15 bg-white text-[#133E43] hover:border-[#133E43]/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-0.5">
                      <Layers className="w-3.5 h-3.5 text-[#80C5B5]" />
                      <span>Mesclar (Recomendado)</span>
                    </div>
                    <span className={`text-[11px] leading-tight block ${importMode === 'merge' ? 'text-[#80C5B5]' : 'text-[#133E43]/60'}`}>
                      Preserva as existentes, atualiza revisões e aborta em caso de conflito.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImportMode('replace')}
                    className={`p-3 rounded-2xl border text-left text-xs transition-colors min-h-[56px] ${
                      importMode === 'replace'
                        ? 'border-[#133E43] bg-[#133E43] text-white shadow-xs'
                        : 'border-[#133E43]/15 bg-white text-[#133E43] hover:border-[#133E43]/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-0.5">
                      <RefreshCw className="w-3.5 h-3.5 text-[#F1CA91]" />
                      <span>Substituir Acervo</span>
                    </div>
                    <span className={`text-[11px] leading-tight block ${importMode === 'replace' ? 'text-[#80C5B5]' : 'text-[#133E43]/60'}`}>
                      Substitui integralmente o diário de {decryptedPayload.childProfile.name} pelo arquivo.
                    </span>
                  </button>
                </div>
              </div>

              {/* Permission & Replace Warning */}
              {importMode === 'replace' && activeCaregiver.role !== 'LEGAL_GUARDIAN' && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-800 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong>Ação Restrita a Responsáveis Legais:</strong>
                    <p>
                      A substituição completa do acervo é permitida apenas para o papel <code>LEGAL_GUARDIAN</code>. Seu papel atual é <strong>{activeCaregiver.displayName} ({activeCaregiver.role})</strong>. Selecione a opção <strong>&quot;Mesclar&quot;</strong> para continuar.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Scope Notice */}
              <p className="text-[11px] text-[#133E43]/70 leading-relaxed bg-[#F8F5EF] p-2.5 rounded-xl border border-[#133E43]/10">
                A aplicação ocorrerá estritamente em memória volátil. Nenhum dado de outros perfis (como Tomás ou Lia) será afetado ou exposto.
              </p>

              {/* Actions */}
              <div className="pt-2 border-t border-[#133E43]/10 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isCommitting}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-medium text-[#133E43] hover:bg-[#133E43]/5 rounded-xl border border-[#133E43]/15 min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  disabled={
                    isCommitting ||
                    hasContextShifted ||
                    hasMergeConflict ||
                    activeCaregiver.status !== 'ACTIVE' ||
                    !activeCaregiver.linkedChildIds.includes(decryptedPayload.childProfile.id) ||
                    (importMode === 'replace' && activeCaregiver.role !== 'LEGAL_GUARDIAN')
                  }
                  className={`w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-transform active:scale-[0.98] min-h-[44px] flex items-center justify-center gap-2 ${
                    isCommitting ||
                    hasContextShifted ||
                    hasMergeConflict ||
                    activeCaregiver.status !== 'ACTIVE' ||
                    !activeCaregiver.linkedChildIds.includes(decryptedPayload.childProfile.id) ||
                    (importMode === 'replace' && activeCaregiver.role !== 'LEGAL_GUARDIAN')
                      ? 'bg-[#133E43]/40 text-white/70 cursor-not-allowed'
                      : 'text-white bg-[#133E43] hover:bg-[#133E43]/90'
                  }`}
                >
                  {isCommitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Aplicando na Memória...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4 text-[#80C5B5]" />
                      <span>Confirmar e Aplicar na Memória</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
