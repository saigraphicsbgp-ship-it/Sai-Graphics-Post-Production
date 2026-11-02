import React from 'react';

interface SGLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtext?: boolean;
  variant?: 'emblem' | 'full';
}

export const SGLogo: React.FC<SGLogoProps> = ({
  className = '',
  size = 'md',
  showSubtext = true,
  variant = 'emblem'
}) => {
  const logoSrc = "/assets/aistudio/SAI_46ad54be.png";

  if (variant === 'full') {
    const fullHeight = size === 'sm' ? 'h-10' : size === 'lg' ? 'h-24' : size === 'xl' ? 'h-36' : 'h-16';
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src={logoSrc}
          alt="Sai Graphics Photography & Editing Lab"
          className={`${fullHeight} w-auto object-contain drop-shadow-[0_4px_20px_rgba(212,175,55,0.35)]`}
          loading="eager"
        />
      </div>
    );
  }

  const iconSize = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-16 h-16' : 'w-11 h-11';
  const titleSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Sai Graphics Photography Emblem Badge */}
      <div className={`relative ${iconSize} shrink-0 group`}>
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#d4af37]/45 via-[#38bdf8]/35 to-[#f3e5ab]/25 blur-md group-hover:blur-lg transition-all duration-300" />
        
        {/* Emblem Body housing official logo */}
        <div className="relative h-full w-full rounded-full bg-[#0a0c12] border border-[#d4af37]/50 flex items-center justify-center p-0.5 shadow-xl overflow-hidden group-hover:border-[#d4af37] transition-colors">
          <img
            src={logoSrc}
            alt="Sai Graphics Photography"
            className="w-full h-full object-cover scale-125"
            loading="eager"
          />
        </div>
      </div>

      {/* Typography Brand Lockup */}
      <div className="flex flex-col">
        <span className={`font-cinzel font-bold tracking-wider leading-none text-white ${titleSize}`}>
          SAI <span className="text-gold-gradient">GRAPHICS</span>
        </span>
        {showSubtext && (
          <span className="text-[10px] font-outfit uppercase tracking-[0.2em] text-[#38bdf8] font-semibold mt-1">
            Photography & Editing Lab
          </span>
        )}
      </div>
    </div>
  );
};
