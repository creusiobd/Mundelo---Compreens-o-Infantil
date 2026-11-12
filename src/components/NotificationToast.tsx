/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification, clearNotification } = useApp();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#133E43]" />,
    error: <AlertCircle className="w-5 h-5 text-[#CFA5A0]" />,
    info: <Info className="w-5 h-5 text-[#80C5B5]" />,
  };

  const bgStyles = {
    success: 'bg-[#80C5B5]/20 border-[#80C5B5] text-[#133E43]',
    error: 'bg-[#CFA5A0]/20 border-[#CFA5A0] text-[#133E43]',
    info: 'bg-[#F1CA91]/25 border-[#F1CA91] text-[#133E43]',
  };

  return (
    <aside
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-20 lg:bottom-6 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl border shadow-lg backdrop-blur-md bg-white/95 ${bgStyles[notification.type]}`}
      >
        <div className="shrink-0 mt-0.5">{icons[notification.type]}</div>
        <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
          {notification.message}
        </div>
        <button
          onClick={clearNotification}
          className="shrink-0 p-1 rounded-lg text-[#133E43]/60 hover:text-[#133E43] hover:bg-[#133E43]/5 min-h-[32px] min-w-[32px] flex items-center justify-center"
          aria-label="Fechar notificação"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
