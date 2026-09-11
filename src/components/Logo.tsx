import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'full' | 'mark' | 'card';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  // Dimension mappings
  const markDimensions = {
    xs: { width: 24, height: 24 },
    sm: { width: 32, height: 32 },
    md: { width: 44, height: 44 },
    lg: { width: 64, height: 64 },
    xl: { width: 96, height: 96 },
  }[size];

  // The SVG Gold Emblem Icon representing the geometric beveled "F"
  const Emblem = ({ width = markDimensions.width, height = markDimensions.height }: { width?: number; height?: number }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-[0_4px_12px_rgba(212,175,55,0.35)]"
    >
      <defs>
        {/* Highlight Champagne Gold */}
        <linearGradient id="emblem-gold-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF9E5" />
          <stop offset="35%" stopColor="#F8DE95" />
          <stop offset="70%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA8220" />
        </linearGradient>

        {/* Midtone Burnished Gold */}
        <linearGradient id="emblem-gold-mid" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#F9E2A2" />
          <stop offset="50%" stopColor="#C99E33" />
          <stop offset="100%" stopColor="#8C6615" />
        </linearGradient>

        {/* Deep Shaded Bronze Gold */}
        <linearGradient id="emblem-gold-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B38622" />
          <stop offset="50%" stopColor="#7E580D" />
          <stop offset="100%" stopColor="#4A3105" />
        </linearGradient>

        {/* Diagonal Bevel Highlight */}
        <linearGradient id="emblem-edge-glint" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FAD87F" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8C6615" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Top Main Dynamic Chevron Wing */}
      <g>
        {/* Main face */}
        <path
          d="M 88 38 L 138 38 L 102 78 L 52 78 Z"
          fill="url(#emblem-gold-light)"
        />
        {/* Right beveled facet */}
        <path
          d="M 138 38 L 148 46 L 112 86 L 102 78 Z"
          fill="url(#emblem-gold-dark)"
        />
        {/* Top edge glint */}
        <path
          d="M 88 38 L 138 38"
          stroke="url(#emblem-edge-glint)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Middle Dynamic Chevron Wing */}
      <g>
        {/* Main face */}
        <path
          d="M 76 90 L 118 90 L 88 124 L 46 124 Z"
          fill="url(#emblem-gold-mid)"
        />
        {/* Right beveled facet */}
        <path
          d="M 118 90 L 126 97 L 96 131 L 88 124 Z"
          fill="url(#emblem-gold-dark)"
        />
      </g>

      {/* Structural Slanted Spine (Left Leg) */}
      <g>
        {/* Upper connecting facet */}
        <path
          d="M 52 78 L 76 90 L 46 124 L 28 106 Z"
          fill="url(#emblem-gold-dark)"
        />
        {/* Lower vertical stem extending down */}
        <path
          d="M 46 124 L 68 124 L 48 162 L 26 162 Z"
          fill="url(#emblem-gold-mid)"
        />
        {/* Angled foot */}
        <path
          d="M 48 162 L 68 124 L 76 131 L 56 169 Z"
          fill="url(#emblem-gold-dark)"
        />
        {/* Highlight seam */}
        <path
          d="M 52 78 L 28 106 L 26 162"
          stroke="url(#emblem-edge-glint)"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );

  // Typography component
  const Wordmark = ({ layout = 'horizontal' }: { layout?: 'horizontal' | 'stacked' }) => (
    <div className={`flex flex-col ${layout === 'stacked' ? 'items-center text-center' : 'items-start'}`}>
      {/* Primary Brand Name: FINSTANT with stylized 'A' */}
      <div className="flex items-center tracking-[0.22em] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D0] via-[#E2BA55] to-[#B88924] select-none uppercase">
        <span className={size === 'xs' ? 'text-sm' : size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : size === 'xl' ? 'text-3xl' : 'text-lg'}>
          FINST
        </span>
        {/* Stylized Lambda / Chevron 'A' matching the emblem style */}
        <span className={`${size === 'xs' ? 'text-sm' : size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : size === 'xl' ? 'text-3xl' : 'text-lg'} inline-block -mx-[0.03em]`}>
          Λ
        </span>
        <span className={size === 'xs' ? 'text-sm' : size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : size === 'xl' ? 'text-3xl' : 'text-lg'}>
          NT
        </span>
      </div>

      {/* Sub-Brand: — CAPITAL — */}
      <div className="flex items-center justify-center gap-2 w-full mt-0.5">
        <span className="h-[1px] w-3 sm:w-4 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
        <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.35em] text-[#D4AF37] uppercase select-none">
          CAPITAL
        </span>
        <span className="h-[1px] w-3 sm:w-4 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
      </div>

      {/* Tagline: TRUST | GROWTH | PROSPERITY */}
      {showTagline && (
        <div className="mt-1 text-[7px] sm:text-[8px] font-medium tracking-[0.25em] text-[#A68A48] uppercase select-none opacity-90">
          TRUST &nbsp;|&nbsp; GROWTH &nbsp;|&nbsp; PROSPERITY
        </div>
      )}
    </div>
  );

  // Variant 1: Card variant (matches the exact uploaded image with dark matte background, border, and shadows)
  if (variant === 'card') {
    return (
      <div
        className={`relative p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#14171E] via-[#0E1015] to-[#090A0D] border border-[#D4AF37]/25 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.08)] flex flex-col items-center justify-center text-center overflow-hidden ${className}`}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Large Emblem */}
        <Emblem width={96} height={96} />

        {/* Wordmark Stacked */}
        <div className="mt-4">
          <Wordmark layout="stacked" />
        </div>
      </div>
    );
  }

  // Variant 2: Full vertical stacked lockup
  if (variant === 'full' || variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center gap-3 ${className}`}>
        <Emblem />
        <Wordmark layout="stacked" />
      </div>
    );
  }

  // Variant 3: Mark only
  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Emblem />
      </div>
    );
  }

  // Variant 4 (Default): Horizontal Lockup (ideal for headers and footers)
  return (
    <div className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
      <Emblem />
      <Wordmark layout="horizontal" />
    </div>
  );
};
