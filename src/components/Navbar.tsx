import React, { useState, useEffect } from 'react';
import { SGLogo } from './SGLogo';
import { Phone, Menu, X, Shield, MessageSquare, HardDrive } from 'lucide-react';
import { StudioSettings } from '../types';
import { AestheticLookSwitcher } from './AestheticLookSwitcher';
import { useAesthetic } from '../context/AestheticContext';

interface NavbarProps {
  settings: StudioSettings;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenDrive?: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeSection,
  onNavigate,
  onOpenAdmin,
  onOpenDrive,
  isAdminLoggedIn
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { config } = useAesthetic();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Reviews', id: 'testimonials' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#08090d]/85 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar 3-Zone Contract */}
          <div className="flex items-center justify-between gap-8">
            {/* Zone 1: Brand Wordmark & Monogram */}
            <button
              onClick={() => handleLinkClick('home')}
              className="text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] rounded-lg"
            >
              <SGLogo size="sm" showSubtext={false} />
            </button>

            {/* Zone 2: Single-line Nav Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium tracking-wide">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                      isActive
                        ? 'text-[#d4af37] font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4af37] shadow-[0_0_8px_#d4af37]" />
                    )}
                  </button>
                );
              })}

              {/* Google Drive Portal */}
              {onOpenDrive && (
                <button
                  onClick={onOpenDrive}
                  className="whitespace-nowrap shrink-0 flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#d4af37] transition-colors py-1 px-2.5 rounded border border-white/10 hover:border-[#d4af37]/40 cursor-pointer"
                  title="Studio Google Drive Deliverables"
                >
                  <HardDrive className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Google Drive</span>
                </button>
              )}

              {/* Admin Portal Gateway */}
              <button
                onClick={onOpenAdmin}
                className="whitespace-nowrap shrink-0 flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#38bdf8] transition-colors py-1 px-2.5 rounded border border-white/5 hover:border-[#38bdf8]/30 cursor-pointer"
                title="Studio Management Console"
              >
                <Shield className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>{isAdminLoggedIn ? 'Dashboard' : 'Admin'}</span>
              </button>
            </nav>

            {/* Zone 3: Aesthetic Look & 1 Primary Highlighted Action */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <AestheticLookSwitcher variant="nav" />

              <a
                href={`tel:${settings.mobileNumber}`}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-950 rounded-lg shadow-lg hover:brightness-105 active:scale-95 transition-all whitespace-nowrap shrink-0"
                style={{
                  backgroundColor: config.primaryColor,
                  boxShadow: `0 0 20px ${config.glowColor}`,
                }}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call: {settings.mobileNumber}</span>
              </a>
            </div>

            {/* Mobile Actions: Aesthetic Switcher + Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <AestheticLookSwitcher variant="nav" />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-200 hover:text-white hover:bg-white/5 rounded-lg border border-white/10 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/80 backdrop-blur-xl animate-fade-in flex flex-col justify-between pt-24 pb-8 px-6">
          <div className="flex flex-col gap-4">
            <div className="border-b border-white/10 pb-4 mb-2">
              <SGLogo size="md" />
            </div>

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left text-lg font-medium py-2.5 px-3 rounded-lg transition-colors ${
                  activeSection === link.id
                    ? 'text-[#d4af37] bg-[#d4af37]/10 border-l-2 border-[#d4af37]'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}

            {onOpenDrive && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDrive();
                }}
                className="flex items-center gap-2 text-left text-sm text-[#f3e5ab] py-2.5 px-3 rounded-lg hover:bg-white/5"
              >
                <HardDrive className="w-4 h-4 text-[#d4af37]" />
                <span>Google Drive Studio Hub</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-2 text-left text-sm text-[#38bdf8] py-2.5 px-3 rounded-lg hover:bg-white/5"
            >
              <Shield className="w-4 h-4" />
              <span>Studio Admin Console</span>
            </button>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
            <a
              href={`tel:${settings.mobileNumber}`}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-black bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now: {settings.mobileNumber}</span>
            </a>

            <a
              href={`https://wa.me/91${settings.whatsappNumber}?text=Hello%20Sai%20Graphics,%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};
