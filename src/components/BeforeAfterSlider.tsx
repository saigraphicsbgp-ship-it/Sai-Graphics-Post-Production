import React, { useState, useRef, useCallback } from 'react';
import { BeforeAfterDemo } from '../types';
import { Sparkles, Sliders } from 'lucide-react';

interface BeforeAfterSliderProps {
  demos: BeforeAfterDemo[];
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ demos }) => {
  const [activeDemoIndex, setActiveDemoIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0-100
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);

  const activeDemo = demos[activeDemoIndex] || demos[0];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  return (
    <div className="py-16 bg-[#07080d] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#d4af37]/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-xs uppercase tracking-widest text-[#f3e5ab] font-semibold">
                Visual Finishing Lab
              </span>
            </div>
            <h3 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              BEFORE & AFTER <span className="text-gold-gradient">MASTERY</span>
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Drag the interactive slider to examine real optical clarity, delicate skin-texture preservation, and cinematic color grading.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-[#0d1017] p-1.5 rounded-xl border border-white/10">
            {demos.map((d, idx) => (
              <button
                key={d.id}
                onClick={() => {
                  setActiveDemoIndex(idx);
                  setSliderPosition(50);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeDemoIndex === idx
                    ? 'bg-[#d4af37] text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d.title.split(' ')[0]} {d.title.split(' ')[1] || ''}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Split Comparison Card */}
        {activeDemo && (
          <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-[#d4af37]/25 shadow-2xl">
            
            {/* Titles & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 text-xs font-mono">
              <span className="text-[#38bdf8] font-medium tracking-wide">
                CATEGORY: {activeDemo.service.toUpperCase()}
              </span>
              <span className="text-slate-400">
                DRAG CENTER HANDLE TO COMPARE
              </span>
            </div>

            {/* Slider Viewport */}
            <div
              ref={containerRef}
              className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden cursor-ew-resize select-none border border-white/10 bg-slate-950"
              onMouseDown={(e) => {
                isDragging.current = true;
                handleMove(e.clientX);
              }}
              onMouseUp={() => (isDragging.current = false)}
              onMouseLeave={() => (isDragging.current = false)}
              onMouseMove={handleMouseMove}
              onTouchStart={(e) => {
                isDragging.current = true;
                handleMove(e.touches[0].clientX);
              }}
              onTouchEnd={() => (isDragging.current = false)}
              onTouchMove={handleTouchMove}
            >
              {/* AFTER Image (Full background layer) */}
              <img
                src={activeDemo.afterImage}
                alt="Sai Graphics After Grade"
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />

              {/* BEFORE Image (Clipped overlay) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden select-none pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <div
                  className="relative h-full"
                  style={{
                    width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                    maxWidth: 'none'
                  }}
                >
                  <img
                    src={activeDemo.beforeImage}
                    alt="Original RAW Capture"
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none filter brightness-95"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Vertical Divider Line */}
              <div
                className="absolute inset-y-0 w-1 bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.7)] z-20 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Center Handle Badge */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#0d1017] border-2 border-[#d4af37] flex items-center justify-center text-white shadow-xl">
                  <Sliders className="w-4 h-4 text-[#d4af37]" />
                </div>
              </div>

              {/* Floating Labels */}
              <div className="absolute bottom-4 left-4 z-10">
                <span className="px-3 py-1 rounded bg-black/75 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300">
                  {activeDemo.beforeLabel}
                </span>
              </div>

              <div className="absolute bottom-4 right-4 z-10">
                <span className="px-3 py-1 rounded bg-[#d4af37]/90 backdrop-blur-md text-xs font-bold text-slate-950 shadow-md">
                  {activeDemo.afterLabel}
                </span>
              </div>
            </div>

            {/* Description footnote */}
            <p className="text-xs text-slate-400 mt-4 text-center sm:text-left">
              {activeDemo.description}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
