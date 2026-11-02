import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../types';
import { useAesthetic } from '../context/AestheticContext';
import {
  Film,
  Camera,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  User,
  Share2,
  MessageSquare,
  LayoutGrid,
  Tv,
  Sparkles,
  Sliders
} from 'lucide-react';

interface PortfolioGalleryProps {
  portfolio: PortfolioItem[];
  whatsappNumber: string;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  portfolio,
  whatsappNumber
}) => {
  const { config, galleryViewMode, setGalleryViewMode } = useAesthetic();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);

  const categories = [
    'All',
    'Wedding Photography',
    'Cinematic Wedding Films',
    'Pre-Wedding Shoots',
    'Professional Photo Editing',
    'Creative Graphic Design',
    'Album Design'
  ];

  const filteredItems = portfolio.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const activeItem = activeItemIndex !== null ? filteredItems[activeItemIndex] : null;
  const currentSpotlight = filteredItems[spotlightIndex] || filteredItems[0] || portfolio[0];

  // Keep spotlightIndex in bounds when category changes
  useEffect(() => {
    if (spotlightIndex >= filteredItems.length) {
      setSpotlightIndex(0);
    }
  }, [selectedCategory, filteredItems.length, spotlightIndex]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeItemIndex === null) return;
      if (e.key === 'Escape') setActiveItemIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveItemIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowLeft') {
        setActiveItemIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItemIndex, filteredItems.length]);

  return (
    <section id="portfolio" className="relative py-24 bg-[#08090d] border-t border-white/5 transition-colors duration-500">
      <div id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border"
            style={{ borderColor: `${config.primaryColor}55` }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: config.primaryColor }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: config.secondaryColor }}
            >
              Selected Visual Masterpieces
            </span>
          </div>

          <h2 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            PORTFOLIO & <span className="text-gold-gradient">GALLERY</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed" style={{ textWrap: 'balance' }}>
            A curated showcase of royal weddings, dramatic cinematography, fashion edits, and bespoke heirloom albums finished by Sai Graphics.
          </p>
        </div>

        {/* View Switcher & Category Toolbar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 p-3 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setActiveItemIndex(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'text-slate-950 font-bold shadow-md'
                      : 'bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/10'
                  }`}
                  style={{
                    backgroundColor: isSelected ? config.primaryColor : undefined,
                    boxShadow: isSelected ? `0 0 14px ${config.glowColor}` : undefined,
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Interactive Layout View Mode Switcher */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 shrink-0 self-end lg:self-auto">
            <span className="text-[11px] font-mono text-slate-400 px-2 uppercase hidden sm:inline">
              View Layout:
            </span>

            <button
              onClick={() => setGalleryViewMode('editorial')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                galleryViewMode === 'editorial'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{
                color: galleryViewMode === 'editorial' ? config.secondaryColor : undefined,
              }}
              title="Editorial Magazine Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Editorial</span>
            </button>

            <button
              onClick={() => setGalleryViewMode('cinematic')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                galleryViewMode === 'cinematic'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{
                color: galleryViewMode === 'cinematic' ? config.secondaryColor : undefined,
              }}
              title="21:9 Anamorphic Cinema Strip"
            >
              <Film className="w-3.5 h-3.5" />
              <span>21:9 Cinema</span>
            </button>

            <button
              onClick={() => setGalleryViewMode('spotlight')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                galleryViewMode === 'spotlight'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={{
                color: galleryViewMode === 'spotlight' ? config.secondaryColor : undefined,
              }}
              title="Spotlight Master Walkthrough"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Spotlight</span>
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* VIEW MODE 1: EDITORIAL MAGAZINE GRID */}
        {/* ========================================================================= */}
        {galleryViewMode === 'editorial' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredItems.map((item, idx) => {
              const isVideo = !!item.videoUrl || item.category.includes('Film');
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItemIndex(idx)}
                  className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer shadow-lg flex flex-col"
                  style={{
                    boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
                  }}
                >
                  {/* Media Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Top Category Tag */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        className="text-[11px] font-mono tracking-wider uppercase bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10"
                        style={{ color: config.primaryColor }}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Video Indicator */}
                    {isVideo && (
                      <div
                        className="absolute top-3 right-3 w-8 h-8 rounded-full text-black flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        <Film className="w-4 h-4" />
                      </div>
                    )}

                    {/* Hover Quick Action Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <div
                        className="px-4 py-2 rounded-full text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>View Project</span>
                      </div>
                    </div>

                    {/* Bottom Title Text Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3
                        className="font-outfit text-lg font-bold text-white transition-colors leading-snug"
                        style={{ color: 'white' }}
                      >
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                        {item.client && <span>{item.client}</span>}
                        {item.client && item.year && <span aria-hidden="true">·</span>}
                        {item.year && <span>{item.year}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Subtitle Card Description */}
                  <div className="p-4 bg-[#0d1017] border-t border-white/5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div
                      className="mt-3 flex items-center justify-between text-[11px] font-mono pt-2 border-t border-white/5"
                      style={{ color: config.secondaryColor }}
                    >
                      <span>SAI LAB FINISH</span>
                      <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                        Full Preview <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: 21:9 ANAMORPHIC CINEMA STRIP */}
        {/* ========================================================================= */}
        {galleryViewMode === 'cinematic' && (
          <div className="space-y-6 animate-fade-in">
            {filteredItems.map((item, idx) => {
              const isVideo = !!item.videoUrl || item.category.includes('Film');
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItemIndex(idx)}
                  className="group relative rounded-2xl overflow-hidden bg-black border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer shadow-2xl"
                  style={{
                    boxShadow: `0 10px 40px rgba(0,0,0,0.6)`,
                  }}
                >
                  {/* Ultra-wide 21:9 Cinema Frame */}
                  <div className="relative aspect-[21/9] sm:aspect-[2.35/1] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 brightness-90 group-hover:brightness-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />

                    {/* Cinematic Letterbox Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/40" />

                    {/* Camera Overlay HUD */}
                    <div className="absolute top-4 left-5 flex items-center gap-3">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-600/80 text-[10px] font-mono text-white tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> REC
                      </span>
                      <span className="text-[11px] font-mono text-slate-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                        4K DCI · 24.000 FPS · PRORES 422
                      </span>
                    </div>

                    <div className="absolute top-4 right-5 flex items-center gap-2">
                      <span
                        className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-1 rounded bg-black/70 border border-white/10"
                        style={{ color: config.primaryColor }}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Center Action Prompt */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div
                        className="px-5 py-2.5 rounded-full text-slate-950 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform shadow-2xl"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        <Film className="w-4 h-4" />
                        <span>Play / Inspect Master</span>
                      </div>
                    </div>

                    {/* Bottom Cinematic Typography */}
                    <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div className="max-w-2xl">
                        <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono shrink-0">
                        {item.client && <span>{item.client}</span>}
                        {item.year && <span>({item.year})</span>}
                        <span
                          className="px-2 py-0.5 rounded bg-white/10 text-[11px]"
                          style={{ color: config.secondaryColor }}
                        >
                          LUT: SAI CINEMA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 3: SPOTLIGHT MASTER WALKTHROUGH */}
        {/* ========================================================================= */}
        {galleryViewMode === 'spotlight' && currentSpotlight && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Giant Featured Master Stage */}
            <div className="relative rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl">
              <div className="relative aspect-[16/9] sm:aspect-[2/1] w-full max-h-[580px] overflow-hidden">
                <img
                  src={currentSpotlight.imageUrl}
                  alt={currentSpotlight.title}
                  className="w-full h-full object-cover transition-all duration-700 brightness-95"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />

                {/* Top Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-black/75 backdrop-blur-md border border-white/15"
                    style={{ color: config.primaryColor }}
                  >
                    ★ FEATURED MASTERPIECE
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs text-slate-300 bg-white/10">
                    {currentSpotlight.category}
                  </span>
                </div>

                {/* Inspect Button */}
                <div className="absolute top-6 right-6">
                  <button
                    onClick={() => setActiveItemIndex(spotlightIndex)}
                    className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-white hover:bg-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Fullscreen</span>
                  </button>
                </div>

                {/* Bottom Story & Metadata */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                  <div className="max-w-2xl">
                    <h3 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {currentSpotlight.title}
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                      {currentSpotlight.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-3 font-mono">
                      {currentSpotlight.client && <span>Client: {currentSpotlight.client}</span>}
                      {currentSpotlight.year && <span>Year: {currentSpotlight.year}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href={`https://wa.me/91${whatsappNumber}?text=Hello%20Sai%20Graphics,%20I%20love%20the%20${encodeURIComponent(
                        currentSpotlight.title
                      )}%20visual%20style!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 flex items-center gap-2 shadow-xl hover:brightness-105 transition-all"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Inquire Style</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal Filmstrip Navigation Strip */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 px-1">
                Select from {filteredItems.length} Masterpiece Reel Tracks:
              </span>

              <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none">
                {filteredItems.map((item, idx) => {
                  const isCurrent = spotlightIndex === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSpotlightIndex(idx)}
                      className={`relative w-44 h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer group text-left ${
                        isCurrent
                          ? 'border-white scale-105 shadow-2xl'
                          : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                      }`}
                      style={{
                        borderColor: isCurrent ? config.primaryColor : undefined,
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-1.5 left-2 right-2">
                        <p className="text-[11px] font-bold text-white truncate">
                          {item.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* Fullscreen Lightbox / Media Viewer */}
      {/* ========================================================================= */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in p-4 sm:p-6">
          
          {/* Top Controls Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-mono bg-black/60 px-3 py-1.5 rounded-lg border border-white/10"
                style={{ color: config.primaryColor }}
              >
                {activeItem.category}
              </span>
              <span className="text-sm font-semibold text-white hidden sm:inline">
                {activeItem.title}
              </span>
            </div>

            <button
              onClick={() => setActiveItemIndex(null)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close fullscreen preview"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            onClick={() =>
              setActiveItemIndex((prev) =>
                prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() =>
              setActiveItemIndex((prev) =>
                prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Content Modal */}
          <div className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center">
            
            {/* Media Area */}
            <div
              className="relative w-full max-h-[62vh] rounded-2xl overflow-hidden flex items-center justify-center bg-[#07080c] border shadow-2xl"
              style={{ borderColor: `${config.primaryColor}55` }}
            >
              {activeItem.videoUrl ? (
                activeItem.videoUrl.endsWith('.mp4') || activeItem.videoUrl.includes('/assets/') ? (
                  <video
                    src={activeItem.videoUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="max-h-[62vh] w-auto max-w-full rounded-xl object-contain bg-black"
                  />
                ) : (
                  <div className="w-full aspect-video">
                    <iframe
                      src={activeItem.videoUrl}
                      title={activeItem.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )
              ) : (
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  className="max-h-[62vh] w-auto max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Bottom Project Metadata Bar */}
            <div
              className="w-full mt-4 p-5 rounded-2xl bg-[#0e1118]/90 backdrop-blur-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ borderColor: `${config.primaryColor}55` }}
            >
              <div>
                <h4 className="font-cinzel text-xl font-bold text-white">
                  {activeItem.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {activeItem.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 font-mono">
                  {activeItem.client && <span>Client: {activeItem.client}</span>}
                  {activeItem.year && <span>Year: {activeItem.year}</span>}
                  <span style={{ color: config.primaryColor }}>Graded: DaVinci Resolve Studio & ACR</span>
                </div>
              </div>

              {/* Inquire CTA */}
              <div className="flex items-center gap-3 self-stretch sm:self-auto shrink-0">
                <a
                  href={`https://wa.me/91${whatsappNumber}?text=Hello%20Sai%20Graphics,%20I%20am%20inaugurating%20a%20project%20similar%20to:%20${encodeURIComponent(
                    activeItem.title
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-950 flex items-center justify-center gap-2 shadow-lg"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      )}
    </section>
  );
};
