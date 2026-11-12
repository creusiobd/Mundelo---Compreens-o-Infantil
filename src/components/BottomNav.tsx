/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../types';
import { Heart, BookHeart, Compass, Sparkles, Lightbulb } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, setScreen } = useApp();

  const tabs: { id: ScreenId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Início', icon: <Heart className="w-5 h-5" /> },
    { id: 'journal', label: 'Diário', icon: <BookHeart className="w-5 h-5" /> },
    { id: 'world', label: 'Meu Mundo', icon: <Compass className="w-5 h-5" /> },
    { id: 'discoveries', label: 'Descobertas', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'understand', label: 'Compreender', icon: <Lightbulb className="w-5 h-5" /> },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F8F5EF]/95 backdrop-blur-md border-t border-[#133E43]/15 pb-[env(safe-area-inset-bottom)]"
      aria-label="Navegação móvel inferior"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setScreen(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133E43] ${
                isActive ? 'text-[#133E43]' : 'text-[#265358] hover:text-[#133E43]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`p-1 rounded-xl transition-transform ${
                  isActive
                    ? 'bg-[#133E43] text-[#80C5B5] shadow-2xs'
                    : 'text-[#265358]'
                }`}
                aria-hidden="true"
              >
                {tab.icon}
              </div>
              <span
                className={`text-[11px] leading-tight tracking-tight mt-0.5 whitespace-nowrap ${
                  isActive ? 'font-bold text-[#133E43]' : 'font-medium text-[#265358]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
