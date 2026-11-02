import React from 'react';
import { StudioSettings } from '../types';
import { SGLogo } from './SGLogo';
import { Phone, MapPin, Instagram, Facebook, ArrowUp, Mail, Shield } from 'lucide-react';

interface FooterProps {
  settings: StudioSettings;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenAdmin
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#050608] border-t border-white/10 text-slate-400 text-xs">
      {/* Top Footer Callout Ribbon */}
      <div className="border-b border-white/5 py-8 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h4 className="font-cinzel text-lg font-bold text-white">
              Ready to Craft Your Masterpiece?
            </h4>
            <p className="text-slate-400 text-xs mt-0.5">
              Visit our Bhagalpur post-production studio or connect with our lead colorist today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${settings.mobileNumber}`}
              className="px-4 py-2 rounded-lg font-bold text-slate-950 bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] hover:brightness-105 transition-all text-xs"
            >
              Call Studio: {settings.mobileNumber}
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="px-4 py-2 rounded-lg font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Bio (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <SGLogo size="md" />
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm mt-3">
              {settings.aboutDescription}
            </p>
            <p className="text-[#f3e5ab] text-xs font-serif italic">
              "{settings.tagline}"
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-pink-600/20 hover:text-pink-400 border border-white/10 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-600/20 hover:text-blue-400 border border-white/10 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`tel:${settings.mobileNumber}`}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#d4af37]/20 hover:text-[#d4af37] border border-white/10 flex items-center justify-center transition-colors"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h5 className="font-outfit font-bold text-xs uppercase tracking-wider text-white">
              Studio Navigation
            </h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#d4af37] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#d4af37] transition-colors">
                  About Sai Graphics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#d4af37] transition-colors">
                  Editing Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-[#d4af37] transition-colors">
                  Portfolio Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('testimonials')} className="hover:text-[#d4af37] transition-colors">
                  Client Reviews & Accolades
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#d4af37] transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Specialized Lab Services */}
          <div className="space-y-3">
            <h5 className="font-outfit font-bold text-xs uppercase tracking-wider text-white">
              Core Capabilities
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>Wedding Photo Editing</li>
              <li>Cinematic Wedding Films</li>
              <li>Color Grading (DaVinci)</li>
              <li>Skin Tone Retouching</li>
              <li>Wedding Album Designing</li>
              <li>Creative Graphics & VFX</li>
            </ul>
          </div>

          {/* Column 4: Contact & Studio Info */}
          <div className="space-y-3">
            <h5 className="font-outfit font-bold text-xs uppercase tracking-wider text-white">
              Studio Location
            </h5>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{settings.shortAddress}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                <a href={`tel:${settings.mobileNumber}`} className="hover:underline">
                  +91 {settings.mobileNumber}
                </a>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-[#38bdf8] transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {settings.brandName} – {settings.businessType}. All Rights Reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#d4af37]">Bhagalpur, Bihar, India</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
