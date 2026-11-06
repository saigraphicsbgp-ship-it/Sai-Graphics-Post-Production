import React, { useState, useEffect } from 'react';
import { StudioSettings, ServiceItem } from '../types';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Mail
} from 'lucide-react';

interface ContactSectionProps {
  settings: StudioSettings;
  services: ServiceItem[];
  prefilledService?: string;
  onEnquirySubmitted?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  services,
  prefilledService = '',
  onEnquirySubmitted
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: prefilledService || 'Wedding Photo & Video Editing',
    eventDate: '',
    budget: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (prefilledService) {
      setFormData((prev) => ({ ...prev, service: prefilledService }));
    }
  }, [prefilledService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your Name and Mobile Number.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const id = `enq-${Date.now()}`;
      const newEnquiry = {
        id,
        createdAt: new Date().toISOString(),
        ...formData,
        status: 'New'
      };

      await setDoc(doc(db, 'enquiries', id), newEnquiry);

      setStatusMessage({
        type: 'success',
        text: 'Thank you! Your project enquiry has been submitted. Our studio will call you shortly.'
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: 'Wedding Photo & Video Editing',
        eventDate: '',
        budget: '',
        message: ''
      });
      if (onEnquirySubmitted) {
        onEnquirySubmitted();
      }
    } catch (err) {
      console.error('Error submitting enquiry', err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to submit enquiry. Please call our lab directly at 8809216991 or message on WhatsApp.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-[var(--brand-bg)] border-t border-primary overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft border border-[var(--brand-accent)]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f3e5ab]">
              Get In Touch With The Studio
            </span>
          </div>

          <h2 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
            CONTACT <span className="text-gold-gradient">SAI GRAPHICS</span>
          </h2>

          <p className="text-secondary text-base sm:text-lg leading-relaxed" style={{ textWrap: 'balance' }}>
            Book your post-production consultation, request wedding package quotes, or visit our editing lab in Bhagalpur.
          </p>
        </div>

        {/* 2-Column Split: Studio Contact Dossier + Interactive Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Official Business Details, Quick Calls, Map & Socials */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Studio Identity Card */}
            <div className="glass-panel-gold rounded-2xl p-6 sm:p-8 space-y-6 border border-[#d4af37]/30 shadow-2xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#38bdf8]">
                  Official Editing Lab
                </span>
                <h3 className="font-cinzel text-2xl font-bold text-primary mt-1">
                  {settings.brandName}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                  {settings.businessType}
                </p>
              </div>

              {/* Direct Instant Action Buttons (Call Now & WhatsApp) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Clickable Call Now button */}
                <a
                  href={`tel:${settings.mobileNumber}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59b27] shadow-lg hover:brightness-105 active:scale-95 transition-all text-center"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>Call Now</span>
                </a>

                {/* WhatsApp Chat button */}
                <a
                  href={`https://wa.me/91${settings.whatsappNumber}?text=Hello%20Sai%20Graphics,%20I%20would%20like%20to%20discuss%20a%20post%20production%20project.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-primary bg-emerald-600 hover:bg-emerald-500 shadow-lg active:scale-95 transition-all text-center"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Detailed Location & Contact Breakdown */}
              <div className="space-y-4 pt-3 border-t border-primary text-sm">
                
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <div>
                    <span className="text-xs text-muted">Direct Studio Line</span>
                    <p className="font-mono text-base font-semibold text-primary mt-0.5">
                      <a href={`tel:${settings.mobileNumber}`} className="hover:text-[#d4af37] transition-colors">
                        +91 {settings.mobileNumber}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#38bdf8]" />
                  </div>
                  <div>
                    <span className="text-xs text-muted">Lab & Studio Address</span>
                    <p className="text-primary text-sm font-medium leading-relaxed mt-0.5">
                      {settings.address}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-soft flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <span className="text-xs text-muted">Direct Email</span>
                    <p className="font-mono text-xs text-primary mt-0.5">
                      <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">
                        {settings.email}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-soft flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <span className="text-xs text-muted">Working Hours</span>
                    <p className="text-xs text-primary mt-0.5">
                      {settings.openingHours}
                    </p>
                  </div>
                </div>

              </div>

              {/* Social Channels (Instagram & Facebook links per user brief) */}
               <div className="pt-4 border-t border-primary space-y-3">
                <span className="text-xs uppercase tracking-wider text-muted font-semibold block">
                  Connect on Social Media
                </span>
                
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 text-primary hover:border-pink-500 hover:brightness-110 text-xs font-semibold transition-all"
                  >
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3 text-muted" />
                  </a>

                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-primary hover:border-blue-500 hover:brightness-110 text-xs font-semibold transition-all"
                  >
                    <Facebook className="w-4 h-4 text-blue-400" />
                    <span>Facebook</span>
                    <ExternalLink className="w-3 h-3 text-muted" />
                  </a>
                </div>
              </div>

            </div>

            {/* Google Maps Card */}
            <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-primary space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    Google Maps Studio Location
                  </span>
                </div>
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#38bdf8] hover:text-primary flex items-center gap-1 font-mono transition-colors"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Map Viewport Frame */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-primary group">
                <iframe
                  title="Sai Graphics Google Maps Location"
                  src="https://maps.google.com/maps?q=Sai+Graphics+Sah+Market+Picture+Place+Bhagalpur+Bihar&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 filter invert-[90%] hue-rotate-[180deg] contrast-[105%]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/80 hover:bg-[#d4af37] text-primary hover:text-slate-950 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-primary transition-all flex items-center gap-1 shadow-lg"
                >
                  <span>Get Directions</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <p className="text-[11px] text-muted">
                Located at Picture Place, 1st Floor, Sah Market — heart of Bhagalpur commercial photography hub.
              </p>
            </div>

          </div>

          {/* Right Column: High-End Contact Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-primary shadow-2xl relative">
              
              <div className="mb-6 space-y-1">
                <h3 className="font-cinzel text-2xl font-bold text-primary">
                  Send a Project Enquiry
                </h3>
                <p className="text-xs sm:text-sm text-secondary">
                  Fill in your details below for a prompt studio callback and estimate.
                </p>
              </div>

              {/* Submission Feedback Toast / Alert */}
              {statusMessage && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs sm:text-sm leading-relaxed">{statusMessage.text}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      Your Full Name <span className="text-[#d4af37]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-soft border border-primary focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-primary text-sm outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      Mobile Number <span className="text-[#d4af37]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 8809216991"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-soft border border-primary focus:border-[var(--brand-accent)] focus:ring-1 focus:ring-[var(--brand-accent)] text-primary text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Email & Service Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. client@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-soft border border-primary focus:border-[var(--brand-accent)] focus:ring-1 focus:ring-[var(--brand-accent)] text-primary text-sm outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      Select Required Service
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--brand-bg)] border border-primary focus:border-[var(--brand-accent)] focus:ring-1 focus:ring-[var(--brand-accent)] text-primary text-sm outline-none transition-colors cursor-pointer"
                    >
                      {services.map((srv) => (
                        <option key={srv.id} value={srv.title} className="bg-[var(--brand-bg)] text-primary">
                          {srv.number}. {srv.title}
                        </option>
                      ))}
                      <option value="Complete Wedding Package" className="bg-[var(--brand-bg)] text-primary">
                        Complete Wedding Package (Photo + Video + Album)
                      </option>
                      <option value="Other Post Production" className="bg-[var(--brand-bg)] text-primary">
                        Custom Commercial / Other Work
                      </option>
                    </select>
                  </div>
                </div>

                {/* Event Date & Budget Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      Event / Delivery Date
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-soft border border-primary focus:border-[var(--brand-accent)] focus:ring-1 focus:ring-[var(--brand-accent)] text-primary text-sm outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      Approximate Budget
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹15,000 - ₹35,000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-soft border border-primary focus:border-[var(--brand-accent)] focus:ring-1 focus:ring-[var(--brand-accent)] text-primary text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Message Details */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Project Vision & Details
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your footage, ceremony dates, number of images, or editing vision..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl bg-muted border border-primary focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/20 text-primary text-sm outline-none transition-all resize-none shadow-inner"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-[0.16em] text-slate-950 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c59b27] shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting To Studio...' : 'Submit Project Enquiry'}</span>
                </button>

                <div className="pt-4 border-t border-primary mt-2">
                  <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5 italic">
                    <span className="w-1 h-1 rounded-full bg-[#d4af37]/40" />
                    <span>🔒 We respect your privacy. Inquiries are stored securely on our studio server for swift follow-up.</span>
                    <span className="w-1 h-1 rounded-full bg-[#d4af37]/40" />
                  </p>
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
