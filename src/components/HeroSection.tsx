import React from 'react';
import { CameraLensCanvas } from './CameraLensCanvas';
import { StudioSettings } from '../types';
import { ArrowRight, Film, Sparkles, SlidersHorizontal, Award, CheckCircle2 } from 'lucide-react';
import { useAesthetic } from '../context/AestheticContext';

interface HeroSectionProps {
  settings: StudioSettings;
  onExplorePortfolio: () => void;
  onExploreServices: () => void;
  onContactUs: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onExplorePortfolio,
  onExploreServices,
  onContactUs,
}) => {
  const { config } = useAesthetic();
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-[var(--brand-bg)]">
      {/* 3D Animated Camera Lens & Cinematic Particles Background */}
      <CameraLensCanvas brandName={settings.brandName} />

      {/* Atmospheric Vignette & Radial Glows */}
      <div className="absolute inset-0 bg-radial from-transparent via-[var(--brand-bg)]/60 to-[var(--brand-bg)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[32rem] h-[32rem] bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Typographic & Story Arc */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Official Logo Brand Ribbon & Studio Identity Kicker */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-soft border border-[#d4af37]/35 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                <span className="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#f3e5ab]">
                  Bhagalpur, Bihar · Professional Photography & Editing Lab
                </span>
              </div>
            </div>

            {/* Official Logo Display Lockup */}
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[var(--brand-bg)] border border-[#d4af37]/45 p-1 shadow-2xl flex items-center justify-center overflow-hidden shrink-0 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/20 to-[#38bdf8]/15" />
                <img
                  src="/assets/aistudio/SAI_46ad54be.png"
                  alt="Sai Graphics Photography Official Logo"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Main Heading: SAI GRAPHICS */}
              <div className="space-y-1">
                <h1 className="font-cinzel text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] text-primary">
                  SAI <span className="text-gold-gradient drop-shadow-[0_4px_25px_rgba(212,175,55,0.35)]">GRAPHICS</span>
                </h1>
                <p className="font-outfit text-base sm:text-xl font-semibold tracking-[0.16em] uppercase text-silver-gradient">
                  PHOTOGRAPHY, POST PRODUCTION & EDITING LAB
                </p>
              </div>
            </div>

            {/* Tagline */}
            <div className="border-l-2 border-[#d4af37]/70 pl-4 py-1">
              <p className="text-xl sm:text-2xl font-serif italic text-[#f3e5ab] tracking-wide">
                "{settings.tagline}"
              </p>
              <p className="text-sm text-[#38bdf8] font-medium tracking-wider uppercase mt-1">
                {settings.subTagline}
              </p>
            </div>

            {/* Narrative Prose */}
            <p className="text-secondary text-base sm:text-lg max-w-xl leading-relaxed" style={{ textWrap: 'balance' }}>
              We transform raw footage and cherished wedding captures into eternal, cinematic masterpieces. Powered by calibrated color grading, bespoke album styling, and high-precision visual finishing.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-3 w-full sm:w-auto">
              {/* Button 1: EXPLORE PORTFOLIO */}
              <button
                onClick={onExplorePortfolio}
                className="group relative px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-slate-950 transition-all flex items-center gap-2 cursor-pointer active:scale-95 hover:brightness-105"
                style={{
                  backgroundColor: config.primaryColor,
                  boxShadow: `0 0 25px ${config.glowColor}`,
                }}
              >
                <span>EXPLORE PORTFOLIO</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Button 2: OUR SERVICES */}
              <button
                onClick={onExploreServices}
                className="px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-primary bg-soft hover:bg-soft/20 border border-primary hover:border-[var(--brand-accent)]/40 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md active:scale-95"
              >
                <SlidersHorizontal className="w-4 h-4" style={{ color: config.secondaryColor }} />
                <span>OUR SERVICES</span>
              </button>

              {/* Button 3: CONTACT US */}
              <button
                onClick={onContactUs}
                className="px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider bg-transparent hover:bg-soft border transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                style={{
                  color: config.primaryColor,
                  borderColor: `${config.primaryColor}60`,
                }}
              >
                <span>CONTACT US</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                <span>4K & 8K Mastering</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
                <span className="font-medium text-primary">FCP & DaVinci Resolve Lab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sah Market, Bhagalpur</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card / Reel Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden glass-panel-gold p-2 shadow-2xl group">
              {/* Image Frame */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"
                  alt="Sai Graphics Post Production Studio Suite"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Finishing Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Corner Cinematic Label */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-md bg-black/60 backdrop-blur-md border border-primary text-[11px] font-mono text-[#38bdf8]">
                  <Film className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>COLOR LAB · DAVINCI 8K</span>
                </div>

                {/* Reel Card Details */}
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
                    Signature Wedding Cinema
                  </span>
                  <h3 className="text-lg font-bold text-primary leading-snug">
                    Royal Indian Wedding Cinema & Color Master
                  </h3>
                  <p className="text-xs text-secondary mt-1 line-clamp-2">
                    Handcrafted pacing, rich film emulation LUTs, and bespoke sound design finished at Sai Graphics Lab.
                  </p>
                </div>
              </div>

              {/* Decorative Studio Calibration Indicator */}
              <div className="mt-3 px-3 py-2 flex items-center justify-between text-xs text-muted border-t border-secondary">
                <span className="font-mono text-[#d4af37]">REC.709 / DCI-P3 CALIBRATED</span>
                <span className="text-muted">BHAGALPUR, BIHAR</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Full-width Studio Metrics Strip Below Hero Split */}
      <div className="relative z-10 w-full mt-12 border-y border-primary bg-[var(--brand-bg)]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="space-y-1">
              <div className="font-cinzel text-3xl sm:text-4xl font-extrabold text-gold-gradient tabular-nums">
                10+
              </div>
              <p className="text-xs uppercase tracking-wider text-muted font-medium">
                Years of Studio Excellence
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-cinzel text-3xl sm:text-4xl font-extrabold text-primary tabular-nums">
                1,850+
              </div>
              <p className="text-xs uppercase tracking-wider text-muted font-medium">
                Weddings & Films Edited
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#38bdf8] tabular-nums">
                100%
              </div>
              <p className="text-xs uppercase tracking-wider text-muted font-medium">
                In-House Color Grading
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#f3e5ab] tabular-nums">
                4K & 8K
              </div>
              <p className="text-xs uppercase tracking-wider text-muted font-medium">
                Ultra HD Studio Delivery
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
