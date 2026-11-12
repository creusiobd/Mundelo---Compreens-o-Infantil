/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar Exclusão',
  message = 'Tem certeza de que deseja remover este registro da memória de demonstração?',
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-[#F8F5EF] rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#133E43]/15 text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-2xl bg-[#CFA5A0]/20 text-[#133E43] flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6 text-[#133E43]" />
        </div>
        <h3 id="confirm-title" className="text-base font-bold text-[#133E43] font-display mb-1.5">
          {title}
        </h3>
        <p className="text-xs text-[#133E43]/70 mb-5 leading-relaxed">
          {message}
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-3 rounded-xl border border-[#133E43]/20 text-xs font-semibold text-[#133E43] hover:bg-white min-h-[44px]"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#CFA5A0] hover:bg-[#b98d87] text-[#133E43] text-xs font-bold min-h-[44px] flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  );
};
