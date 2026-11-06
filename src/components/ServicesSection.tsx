import React, { useState } from 'react';
import { ServiceItem } from '../types';
import {
  Image as ImageIcon,
  Camera,
  Film,
  Sliders,
  PenTool,
  Video,
  BookOpen,
  Sparkles,
  Palette,
  Wand2,
  Clock,
  ArrowRight,
  CheckCircle,
  X,
  MessageSquare
} from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForBooking: (serviceName: string) => void;
  whatsappNumber: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForBooking,
  whatsappNumber
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  // Icon mapping helper
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Image':
        return <ImageIcon className="w-5 h-5 text-[#d4af37]" />;
      case 'Camera':
        return <Camera className="w-5 h-5 text-[#d4af37]" />;
      case 'Film':
        return <Film className="w-5 h-5 text-[#38bdf8]" />;
      case 'Sliders':
        return <Sliders className="w-5 h-5 text-[#38bdf8]" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5 text-[#d4af37]" />;
      case 'Video':
        return <Video className="w-5 h-5 text-[#38bdf8]" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-[#d4af37]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#d4af37]" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-[#38bdf8]" />;
      case 'Wand2':
        return <Wand2 className="w-5 h-5 text-[#38bdf8]" />;
      default:
        return <Camera className="w-5 h-5 text-[#d4af37]" />;
    }
  };

  const categories = ['All', 'Weddings', 'Cinema & Film', 'Retouching', 'Color Lab', 'Albums & Print'];

  const filteredServices = services.filter((srv) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Weddings') {
      return srv.title.toLowerCase().includes('wedding') || srv.category === 'Weddings';
    }
    if (selectedCategory === 'Cinema & Film') {
      return srv.category.includes('Film') || srv.category.includes('Post Production') || srv.category.includes('Production');
    }
    if (selectedCategory === 'Retouching') {
      return srv.category.includes('Retouching') || srv.title.includes('Retouching') || srv.title.includes('Photo Editing');
    }
    if (selectedCategory === 'Color Lab') {
      return srv.category.includes('Color') || srv.category.includes('VFX');
    }
    if (selectedCategory === 'Albums & Print') {
      return srv.category.includes('Albums') || srv.category.includes('Graphics');
    }
    return true;
  });

  return (
    <section id="services" className="relative py-24 bg-[var(--brand-bg)] border-t border-secondary overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-[#d4af37]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f3e5ab]">
              Creative Post Production Suite
            </span>
          </div>

          <h2 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
            OUR <span className="text-gold-gradient">SERVICES</span>
          </h2>

          <p className="text-secondary text-base sm:text-lg leading-relaxed" style={{ textWrap: 'balance' }}>
            Comprehensive post-production excellence tailored for photographers, cinematographers, wedding couples, and creative enterprises across Bihar and beyond.
          </p>

          {/* Interactive Filter Tabs (Buttons with click handlers per constitution) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-slate-950 font-semibold shadow-md shadow-[#d4af37]/20'
                    : 'bg-soft text-secondary hover:text-primary hover:bg-soft border border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 10 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative rounded-2xl glass-panel p-6 flex flex-col justify-between hover:border-[#d4af37]/50 hover:shadow-[0_10px_35px_rgba(212,175,55,0.15)] transition-all duration-300"
            >
              <div>
                {/* Service Image Frame */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-6 bg-slate-950">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1017] via-transparent to-black/30" />

                  {/* Clean unboxed number & Icon in top zone */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-[var(--brand-bg)]/85 backdrop-blur-md border border-primary flex items-center justify-center">
                      {renderIcon(service.icon)}
                    </div>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="font-cinzel text-lg font-bold text-[#f3e5ab]/90 drop-shadow">
                      {service.number}
                    </span>
                  </div>

                  {/* Turnaround Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-mono text-secondary bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-primary">
                    <Clock className="w-3 h-3 text-[#38bdf8]" />
                    <span>{service.turnaround}</span>
                  </div>
                </div>

                {/* Title & Prose */}
                <h3 className="font-outfit text-xl font-bold text-primary group-hover:text-[#f3e5ab] transition-colors leading-snug">
                  {service.title}
                </h3>

                <p className="text-secondary text-sm mt-2 leading-relaxed">
                  {service.shortDesc}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 mt-6 border-t border-primary flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveModalService(service)}
                  className="text-xs font-semibold text-[#38bdf8] hover:text-primary flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectServiceForBooking(service.title)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-[#d4af37] hover:bg-[#f3e5ab] rounded-lg transition-colors cursor-pointer"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Service Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[var(--brand-bg)] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Close button */}
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-5 right-5 p-2 text-muted hover:text-primary rounded-lg hover:bg-soft transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              {/* Modal Header */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#d4af37]/20 to-[#38bdf8]/20 border border-[#d4af37]/40 flex items-center justify-center shrink-0">
                  {renderIcon(activeModalService.icon)}
                </div>
                <div>
                  <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-wider">
                    Service {activeModalService.number} · {activeModalService.category}
                  </span>
                  <h3 className="font-cinzel text-2xl font-bold text-primary mt-0.5">
                    {activeModalService.title}
                  </h3>
                </div>
              </div>

              {/* Service Hero Image */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-950">
                <img
                  src={activeModalService.imageUrl}
                  alt={activeModalService.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#d4af37]">
                  Studio Workflow & Finishing Details
                </h4>
                <p className="text-secondary text-sm leading-relaxed">
                  {activeModalService.fullDesc}
                </p>
              </div>

              {/* Specs & Timeline Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted border border-secondary">
                <div>
                  <span className="text-xs text-muted">Typical Turnaround</span>
                  <p className="text-sm font-semibold text-primary mt-0.5">{activeModalService.turnaround}</p>
                </div>
                <div>
                  <span className="text-xs text-muted">Mastered Lab Tools</span>
                  <p className="text-sm font-semibold text-[#38bdf8] mt-0.5">FCP (Final Cut Pro) / DaVinci Resolve / Photoshop CC</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-primary">
                <button
                  onClick={() => {
                    const title = activeModalService.title;
                    setActiveModalService(null);
                    onSelectServiceForBooking(title);
                  }}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59b27] hover:brightness-105 transition-all text-center"
                >
                  Request Estimate For This Service
                </button>

                <a
                  href={`https://wa.me/91${whatsappNumber}?text=Hello%20Sai%20Graphics,%20I%20am%20interested%20in%20your%20service:%20${encodeURIComponent(
                    activeModalService.title
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3 px-5 rounded-xl font-semibold text-sm text-primary bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  );
};
