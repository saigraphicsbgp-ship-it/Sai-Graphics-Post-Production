import React, { useState } from 'react';
import { StudioSettings } from '../types';
import { SGLogo } from './SGLogo';
import { db } from '../firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import {
  Phone,
  MapPin,
  Instagram,
  Facebook,
  ArrowUp,
  Mail,
  Shield,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Camera,
  Tag
} from 'lucide-react';

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
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setStatus('loading');
    setResponseMessage('');

    try {
      // Check if already registered
      const q = query(collection(db, 'newsletter'), where('email', '==', cleanEmail));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        setStatus('success');
        setResponseMessage("You're already subscribed to our photography workshop updates and seasonal offers!");
        setEmail('');
        return;
      }

      const id = `sub-${Date.now()}`;
      await setDoc(doc(db, 'newsletter', id), {
        id,
        email: cleanEmail,
        subscribedAt: new Date().toISOString(),
        source: 'Footer Newsletter Form',
        status: 'Active'
      });

      setStatus('success');
      setResponseMessage('Thank you for subscribing! You are on the VIP workshop & offers list.');
      setEmail('');
    } catch (err) {
      console.error('Newsletter error', err);
      setStatus('error');
      setResponseMessage('Failed to subscribe. Please try again or call our studio.');
    }
  };

  return (
    <footer className="relative bg-[var(--brand-bg)] border-t border-primary text-muted text-xs transition-colors duration-300">
      {/* Top Footer Callout Ribbon */}
      <div className="border-b border-secondary py-8 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h4 className="font-cinzel text-lg font-bold text-primary">
              Ready to Craft Your Masterpiece?
            </h4>
            <p className="text-muted text-xs mt-0.5">
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
              className="px-4 py-2 rounded-lg font-semibold text-primary bg-soft hover:bg-soft border border-primary transition-all text-xs"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Subscription Section: Seasonal Photography Workshops & Offers */}
      <div className="border-b border-secondary py-10 bg-gradient-to-b from-[var(--bg-muted)] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#0d1017] via-[#121622] to-[#0d1017] dark:from-[#0d1017] dark:via-[#121622] dark:to-[#0d1017] mode-light:from-white mode-light:via-slate-50 mode-light:to-white border border-[#d4af37]/25 shadow-xl overflow-hidden">
            {/* Background ambient accents */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 -mb-10 w-64 h-64 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Text & Value Proposition */}
              <div className="max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#f3e5ab] text-[11px] font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Workshop Alerts & Exclusive Lab Deals</span>
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-primary tracking-wide">
                  Seasonal Photography Workshops & Offers
                </h3>
                <p className="text-secondary text-xs sm:text-sm mt-2 leading-relaxed">
                  Be the first to know when registrations open for our seasonal photography bootcamps, wedding cinematography masterclasses, and limited-time festive color grading offers.
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5 text-secondary">
                    <Camera className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Quarterly Hands-On Bootcamps</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-secondary">
                    <Tag className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Early-Bird Workshop Discounts</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-secondary">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>No Spam · Unsubscribe Anytime</span>
                  </span>
                </div>
              </div>

              {/* Newsletter Form */}
              <div className="w-full lg:max-w-md">
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status !== 'idle') setStatus('idle');
                        }}
                        placeholder="Enter your email for workshop updates..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 dark:bg-black/60 mode-light:bg-slate-100 border border-primary mode-light:border-slate-300 text-primary mode-light:text-slate-900 placeholder-slate-500 text-xs focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] hover:brightness-105 active:scale-95 transition-all shadow-md hover:shadow-[#d4af37]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shrink-0"
                    >
                      {status === 'loading' ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                          <span>Subscribing...</span>
                        </>
                      ) : (
                        <>
                          <span>Subscribe</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Feedback Message Banner */}
                  {status === 'success' && (
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2 animate-fade-in shadow-inner">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{responseMessage}</span>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2 animate-fade-in shadow-inner">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{responseMessage}</span>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-500 text-center lg:text-left">
                    We keep your email private. You will only receive curated updates on seasonal workshops, masterclasses, and studio discounts.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Bio (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <SGLogo size="md" />
            <p className="text-secondary text-xs sm:text-sm leading-relaxed max-w-sm mt-3">
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
                className="w-8 h-8 rounded-lg bg-soft hover:bg-pink-600/20 hover:text-pink-400 border border-primary flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-soft hover:bg-blue-600/20 hover:text-blue-400 border border-primary flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`tel:${settings.mobileNumber}`}
                className="w-8 h-8 rounded-lg bg-soft hover:bg-[#d4af37]/20 hover:text-[#d4af37] border border-primary flex items-center justify-center transition-colors"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h5 className="font-outfit font-bold text-xs uppercase tracking-wider text-primary">
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
            <h5 className="font-outfit font-bold text-xs uppercase tracking-wider text-primary">
              Core Capabilities
            </h5>
            <ul className="space-y-2 text-muted">
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
            <h5 className="font-outfit font-bold text-xs uppercase tracking-wider text-primary">
              Studio Location
            </h5>
            <div className="space-y-2 text-secondary">
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
                <Mail className="w-3.5 h-3.5 text-muted shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 text-[11px] text-muted hover:text-[#38bdf8] transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-14 pt-6 border-t border-secondary flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {settings.brandName} – {settings.businessType}. All Rights Reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#d4af37]">Bhagalpur, Bihar, India</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-muted hover:text-primary transition-colors"
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
