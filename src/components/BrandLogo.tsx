/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type BrandLogoVariant = 'complete' | 'compact' | 'symbol';
export type BrandLogoLayout = 'horizontal' | 'stacked' | 'responsive';

export interface BrandLogoProps {
  variant?: BrandLogoVariant;
  layout?: BrandLogoLayout;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Componente vetorial reutilizável de Identidade Visual MUNDELO (v1.0).
 *
 * Símbolo abstrato inspirado em elos (vínculo), mundos (singularidade) e acolhimento:
 * - Duas órbitas orgânicas entrelaçadas em Verde Elo (#80C5B5) e Areia Solar (#F1CA91)
 * - Núcleo acolhido ao centro sobre base Verde Profundo (#133E43)
 * - Traços uniformes de 1.8px para máxima nitidez desde 28px até grandes formatos
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'complete',
  layout = 'responsive',
  size = 'md',
  className = '',
}) => {
  const symbolSizeClasses = {
    sm: 'w-8 h-8 rounded-[10px]',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  }[size];

  const svgDimensions = {
    sm: 20,
    md: 24,
    lg: 28,
  }[size];

  const wordmarkSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl sm:text-[22px]',
    lg: 'text-2xl sm:text-3xl',
  }[size];

  const symbolElement = (
    <div
      className={`${symbolSizeClasses} bg-[#133E43] flex items-center justify-center shrink-0 shadow-xs ring-1 ring-[#133E43]/10 group-hover:bg-[#194F55] transition-colors`}
      aria-hidden="true"
    >
      <svg
        width={svgDimensions}
        height={svgDimensions}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Arco de Acolhimento Externo (Mundo / Abraço Protetor) */}
        <path
          d="M5.5 15.2C5.5 9.8 9.4 5.5 14 5.5C18.6 5.5 22.5 9.8 22.5 15.2"
          stroke="#80C5B5"
          strokeWidth="1.85"
          strokeLinecap="round"
        />
        {/* Elo Esquerdo (Vínculo Familiar / Presença) */}
        <path
          d="M6.8 16.5C6.8 19.9 9.7 22.5 13.3 22.5C16.2 22.5 18.6 20.6 19.4 17.8"
          stroke="#80C5B5"
          strokeWidth="1.85"
          strokeLinecap="round"
        />
        {/* Elo Direito Entrelaçado (Descoberta / Singularidade) */}
        <path
          d="M21.2 14.5C21.2 18.4 18.2 21.5 14.4 21.5C11.5 21.5 9.1 19.7 8.4 17.1"
          stroke="#F1CA91"
          strokeWidth="1.85"
          strokeLinecap="round"
        />
        {/* Núcleo Central Acolhido (Cada Criança, Um Mundo) */}
        <circle cx="14" cy="13.2" r="2.6" fill="#F1CA91" />
      </svg>
    </div>
  );

  if (variant === 'symbol') {
    return (
      <div className={`inline-flex items-center ${className}`} aria-label="Mundelo">
        {symbolElement}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        {symbolElement}
        <span
          className={`${wordmarkSizeClasses} font-extrabold tracking-tight text-[#133E43] font-display leading-none whitespace-nowrap`}
        >
          Mundelo
        </span>
      </div>
    );
  }

  // Variant === 'complete'
  if (layout === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 min-w-0 max-w-full ${className}`}>
        {symbolElement}
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 min-w-0">
          <span
            className={`${wordmarkSizeClasses} font-extrabold tracking-tight text-[#133E43] font-display leading-none whitespace-nowrap shrink-0`}
          >
            Mundelo
          </span>
          <span
            className="text-[#133E43]/40 font-normal text-sm select-none shrink-0"
            aria-hidden="true"
          >
            ·
          </span>
          <span className="text-xs sm:text-[13px] font-medium text-[#265358] tracking-normal leading-snug break-words text-pretty">
            Compreender é o primeiro cuidado.
          </span>
        </div>
      </div>
    );
  }

  if (layout === 'stacked') {
    return (
      <div className={`inline-flex items-center gap-2.5 min-w-0 max-w-full ${className}`}>
        {symbolElement}
        <div className="flex flex-col justify-center min-w-0">
          <span
            className={`${wordmarkSizeClasses} font-extrabold tracking-tight text-[#133E43] font-display leading-none whitespace-nowrap`}
          >
            Mundelo
          </span>
          <span className="text-xs font-medium text-[#265358] tracking-normal leading-snug mt-0.5 break-words text-pretty">
            Compreender é o primeiro cuidado.
          </span>
        </div>
      </div>
    );
  }

  // layout === 'responsive':
  // - Em mobile (< sm): empilha a frase de produto imediatamente abaixo do nome, permitindo quebra semântica se o viewport for <= 320px ou com texto ampliado.
  // - Em tablet/desktop (>= sm): apresenta o lockup horizontal [SÍMBOLO] Mundelo · Compreender é o primeiro cuidado., reorganizando com flex-wrap se o texto for ampliado.
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 min-w-0 max-w-full ${className}`}>
      {symbolElement}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2.5 sm:gap-y-0.5 min-w-0">
        <span
          className={`${wordmarkSizeClasses} font-extrabold tracking-tight text-[#133E43] font-display leading-none whitespace-nowrap shrink-0`}
        >
          Mundelo
        </span>
        <span
          className="hidden sm:inline text-[#133E43]/40 font-normal text-sm select-none shrink-0"
          aria-hidden="true"
        >
          ·
        </span>
        <span className="text-xs sm:text-[13px] font-medium text-[#265358] tracking-normal leading-snug sm:leading-none mt-0.5 sm:mt-0 break-words text-pretty">
          Compreender é o primeiro cuidado.
        </span>
      </div>
    </div>
  );
};
