import React, { useState } from 'react';
import { StudioSettings } from '../types';
import { Monitor, Cpu, Sparkles, Award, MapPin, CheckCircle, ShieldCheck, Video, Camera } from 'lucide-react';

interface AboutSectionProps {
  settings: StudioSettings;
  onContactClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  settings,
  onContactClick
}) => {
  const [activeVisualTab, setActiveVisualTab] = useState<'drone' | 'suite' | 'identity'>('drone');

  return (
    <section id="about" className="relative py-24 bg-[#090b10] border-t border-white/5 overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 right-0 w-[30rem] h-[30rem] bg-[#d4af37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[24rem] h-[24rem] bg-[#38bdf8]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#d4af37]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f3e5ab]">
              Studio Heritage & Philosophy
            </span>
          </div>

          <h2 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            ABOUT <span className="text-gold-gradient">SAI GRAPHICS</span>
          </h2>
          <p className="text-sm font-outfit uppercase tracking-[0.2em] text-[#38bdf8]">
            Post Production Studio & Editing Lab · Bhagalpur, Bihar
          </p>
        </div>

        {/* Core Exact Description Callout Box (per user brief) */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative p-8 sm:p-10 rounded-2xl glass-panel-gold border border-[#d4af37]/35 shadow-2xl overflow-hidden">
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24 rounded-2xl bg-[#0a0c12] border border-[#d4af37]/50 p-1 shadow-2xl flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/aistudio/SAI_46ad54be.png"
                  alt="Sai Graphics Photography Official Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <p className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-white text-center leading-relaxed">
              "{settings.aboutDescription}"
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#f3e5ab] text-center">
              <span>ESTABLISHED IN BHAGALPUR</span>
              <span aria-hidden="true">·</span>
              <span>1ST FLOOR, SAH MARKET, PICTURE PLACE</span>
              <span aria-hidden="true">·</span>
              <span>SERVICING BIHAR & PAN-INDIA</span>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Studio Story & Studio Hardware/Lab Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Story & Studio Suite / Drone Gallery */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative rounded-2xl overflow-hidden glass-panel p-2 shadow-2xl">
              {/* Visual Mode Selector Tabs */}
              <div className="flex items-center gap-2 mb-2 px-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveVisualTab('drone')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeVisualTab === 'drone'
                      ? 'bg-[#d4af37] text-slate-950 shadow-md shadow-[#d4af37]/20'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>DJI Drone Fleet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVisualTab('identity')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeVisualTab === 'identity'
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-slate-950 shadow-md shadow-[#d4af37]/30 font-bold'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Studio Monogram</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVisualTab('suite')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeVisualTab === 'suite'
                      ? 'bg-[#38bdf8] text-slate-950 shadow-md shadow-[#38bdf8]/20'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Editing Suite</span>
                </button>
              </div>

              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-950">
                {activeVisualTab === 'identity' ? (
                  <div className="relative w-full h-full bg-[#07080c] flex items-center justify-center p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)]" />
                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                      <div className="relative w-32 h-32 rounded-2xl bg-[#0a0c12]/90 border border-[#d4af37]/50 p-2 shadow-2xl backdrop-blur-md mb-3 flex items-center justify-center">
                        <img
                          src="/assets/aistudio/SAI_46ad54be.png"
                          alt="Sai Graphics Official Identity Monogram"
                          className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(212,175,55,0.3)]"
                        />
                      </div>
                      <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#d4af37] font-bold">
                        SAI GRAPHICS · POST PRODUCTION &amp; EDITING LAB
                      </div>
                      <p className="text-sm font-serif italic text-slate-300 mt-1 max-w-sm">
                        "Transforming Moments Into Masterpieces."
                      </p>
                    </div>
                    <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#38bdf8] bg-black/70 px-2 py-0.5 rounded border border-[#38bdf8]/30">
                      OFFICIAL STUDIO MARK
                    </div>
                  </div>
                ) : activeVisualTab === 'drone' ? (
                  <>
                    <img
                      src="/assets/aistudio/DJI_0105_____d7ea3f0c.jpg"
                      alt="Sai Graphics Production - 360° DJI Aerial Drone Cinematography"
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] mb-1">
                        <Video className="w-3.5 h-3.5" />
                        <span>SAI GRAPHICS PRODUCTION · 360° AERIAL FLEET</span>
                      </div>
                      <h4 className="text-base font-bold text-white">
                        Panoramic Aerial Cinematography Across Bihar
                      </h4>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80"
                      alt="Sai Graphics Post Production Studio Bhagalpur"
                      className="w-full h-full object-cover transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] mb-1">
                        <Monitor className="w-3.5 h-3.5" />
                        <span>CALIBRATED WORKSTATION SUITE</span>
                      </div>
                      <h4 className="text-base font-bold text-white">
                        Where Raw Footage Meets High-Precision Artistry
                      </h4>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Studio Pillars Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl glass-panel border border-white/5 space-y-1">
                <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 flex items-center justify-center mb-2">
                  <Award className="w-4 h-4 text-[#d4af37]" />
                </div>
                <h5 className="font-outfit font-bold text-sm text-white">Master Artistry</h5>
                <p className="text-xs text-slate-400">10+ years polishing wedding cinema & fashion catalogs.</p>
              </div>

              <div className="p-4 rounded-xl glass-panel border border-white/5 space-y-1">
                <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/15 flex items-center justify-center mb-2">
                  <Cpu className="w-4 h-4 text-[#38bdf8]" />
                </div>
                <h5 className="font-outfit font-bold text-sm text-white">8K Render Farm</h5>
                <p className="text-xs text-slate-400">High-throughput GPU nodes for lightning turnaround.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Studio Capabilities & Standards */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              The Art of Visual Finishing
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              At Sai Graphics, post-production is not merely cutting clips or running auto-presets. It is an exacting craft where every frame receives meticulous color balance, shadow recovery, and emotional resonance.
            </p>

            {/* Checklist of Lab Standards */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <CheckCircle className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-white">Color-Accurate Master Grading</h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Calibrated D65 white point monitors ensuring colors look identical on smartphones, televisions, and cinema screens.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <CheckCircle className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-white">Preserving Real Emotion in Indian Weddings</h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Deep expertise honoring traditional rituals like Jaimala, Kanyadaan, and Sangeet with rich reds, golds, and authentic skin complexions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-white">Heirloom Quality Wedding Albums</h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Custom lay-flat photobook layouts printed on archival non-tear, velvet-touch materials built to last generations.
                  </p>
                </div>
              </div>
            </div>

            {/* Location & Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                <span>Sah Market, Picture Place, Bhagalpur</span>
              </div>

              <button
                onClick={onContactClick}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] hover:brightness-105 transition-all cursor-pointer"
              >
                Connect With Our Team
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
