import React, { useState } from 'react';
import { useAesthetic, AESTHETIC_THEMES, GalleryViewMode } from '../context/AestheticContext';
import { Palette, Sparkles, X, Check, Film, LayoutGrid, Eye, Sliders, LucideIcon } from 'lucide-react';

interface AestheticLookSwitcherProps {
  variant?: 'nav' | 'floating' | 'inline' | 'compact';
}

export const AestheticLookSwitcher: React.FC<AestheticLookSwitcherProps> = ({ variant = 'nav' }) => {
  const { theme, setTheme, config, filmGrain, setFilmGrain, galleryViewMode, setGalleryViewMode } = useAesthetic();
  const [isOpen, setIsOpen] = useState(false);

  const themeList = Object.values(AESTHETIC_THEMES);

  const viewModes: { id: GalleryViewMode; label: string; desc: string; icon: LucideIcon }[] = [
    { id: 'editorial', label: 'Editorial Magazine', desc: 'Asymmetric heights & bespoke typography', icon: LayoutGrid },
    { id: 'cinematic', label: '21:9 Cinema Strip', desc: 'Ultra-wide anamorphic letterbox cards', icon: Film },
    { id: 'spotlight', label: 'Spotlight Walkthrough', desc: 'Large focal master canvas & reel preview', icon: Eye },
  ];

  const renderTrigger = () => {
    // 1. Floating pill: positioned on the bottom-LEFT to avoid overlapping WhatsApp/Call icons on bottom-right
    if (variant === 'floating') {
      return (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 sm:bottom-5 left-4 sm:left-5 z-40 flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[var(--brand-bg)]/95 border border-primary hover:border-[#d4af37]/60 text-xs font-semibold text-primary shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all active:scale-95 cursor-pointer group hover:brightness-110 pointer-events-auto select-none"
          title="Change Aesthetic Look & View"
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: config.primaryColor, boxShadow: `0 0 10px ${config.primaryColor}` }}
          />
          <Palette className="w-3.5 h-3.5 shrink-0 text-secondary group-hover:text-primary transition-colors" />
          <span className="whitespace-nowrap font-medium text-xs">
            Aesthetic: <strong className="font-bold ml-0.5" style={{ color: config.secondaryColor }}>{config.name.split(' ')[0]}</strong>
          </span>
        </button>
      );
    }

    // 2. Compact variant for mobile top-nav (avoids header clutter)
    if (variant === 'compact') {
      return (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg border border-primary bg-soft hover:bg-soft text-primary transition-all flex items-center justify-center cursor-pointer shrink-0"
          title={`Aesthetic: ${config.name}`}
          aria-label="Change studio look"
        >
          <span
            className="w-2 h-2 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: config.primaryColor, boxShadow: `0 0 6px ${config.primaryColor}` }}
          />
          <Palette className="w-4 h-4 shrink-0 ml-1" style={{ color: config.primaryColor }} />
        </button>
      );
    }

    // 3. Full-width inline variant for drawers or dedicated sidebars
    if (variant === 'inline') {
      return (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between text-left text-sm py-2.5 px-3 rounded-lg border border-primary bg-soft hover:bg-soft text-primary transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: config.primaryColor, boxShadow: `0 0 8px ${config.primaryColor}` }}
            />
            <Palette className="w-4 h-4 shrink-0" style={{ color: config.primaryColor }} />
            <span className="font-medium text-xs sm:text-sm">
              Studio Aesthetic: <strong style={{ color: config.secondaryColor }}>{config.name}</strong>
            </span>
          </div>
          <span className="text-xs text-muted font-medium">Change</span>
        </button>
      );
    }

    // 4. Default 'nav' variant
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="whitespace-nowrap shrink-0 flex items-center gap-2 text-xs font-medium py-1.5 px-3 rounded-lg border border-primary hover:border-white/30 text-primary hover:text-primary transition-all bg-soft hover:bg-soft cursor-pointer"
        title="Customize Studio Aesthetic Look & Visual Tone"
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
          style={{ backgroundColor: config.primaryColor, boxShadow: `0 0 8px ${config.primaryColor}` }}
        />
        <Palette className="w-3.5 h-3.5 shrink-0" style={{ color: config.primaryColor }} />
        <span className="whitespace-nowrap">Look: <strong style={{ color: config.secondaryColor }}>{config.name.split(' ')[0]}</strong></span>
      </button>
    );
  };

  return (
    <>
      {renderTrigger()}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[var(--brand-bg)] border border-primary p-6 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-primary pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: config.primaryColor }} />
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-primary tracking-wide">
                    STUDIO AESTHETIC & VIEW
                  </h3>
                </div>
                <p className="text-xs text-muted mt-1">
                  Transform the visual atmosphere, color grading tone, and portfolio layout.
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-muted hover:text-primary rounded-lg hover:bg-soft transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Color Grading Themes */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" style={{ color: config.primaryColor }} />
                <span>1. Visual Grading Tone</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {themeList.map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-soft border-white/40 shadow-lg'
                          : 'bg-muted border-primary hover:border-primary hover:bg-soft'
                      }`}
                      style={{
                        borderColor: isSelected ? t.primaryColor : undefined,
                        boxShadow: isSelected ? `0 0 20px ${t.glowColor}` : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full"
                            style={{
                              backgroundColor: t.primaryColor,
                              boxShadow: `0 0 8px ${t.primaryColor}`,
                            }}
                          />
                          <span className="text-xs font-bold text-primary tracking-wide">
                            {t.name}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-muted leading-tight">
                        {t.tagline}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Portfolio Gallery View Mode */}
            <div className="space-y-3 pt-2 border-t border-primary">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5" style={{ color: config.primaryColor }} />
                <span>2. Portfolio Layout View</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {viewModes.map((m) => {
                  const Icon = m.icon;
                  const isSelected = galleryViewMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setGalleryViewMode(m.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'bg-white/[0.1] text-primary border-white/40'
                          : 'bg-muted text-muted hover:text-primary border-primary hover:border-primary'
                      }`}
                      style={{
                        borderColor: isSelected ? config.primaryColor : undefined,
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: isSelected ? config.primaryColor : undefined }} />
                      <span className="text-[11px] font-semibold">{m.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Analog Film Grain Toggle */}
            <div className="pt-2 border-t border-primary flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Film className="w-4 h-4 text-muted" />
                <div>
                  <span className="text-xs font-semibold text-primary">35mm Analog Film Grain</span>
                  <p className="text-[11px] text-muted">Adds authentic subtle cinematic texture</p>
                </div>
              </div>

              <button
                onClick={() => setFilmGrain(!filmGrain)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  filmGrain ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    filmGrain ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-primary">
              <button
                onClick={() => {
                  setTheme('gold');
                  setFilmGrain(false);
                  setGalleryViewMode('editorial');
                }}
                className="text-xs text-muted hover:text-primary transition-colors cursor-pointer"
              >
                Reset Default Look
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-white hover:bg-slate-100 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                Apply & Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
