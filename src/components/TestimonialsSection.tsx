import React, { useState, useEffect, useRef } from 'react';
import { TestimonialItem } from '../types';
import { useAesthetic } from '../context/AestheticContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  Sparkles,
  MessageSquarePlus,
  X,
  Send,
  Heart,
  CheckCircle2
} from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
  onReviewSubmitted?: (newReview: TestimonialItem) => void;
}

const defaultTestimonialsData: TestimonialItem[] = [
  {
    id: "rev-1",
    name: "Rajiv & Priya Sharma",
    location: "Sah Market, Bhagalpur",
    role: "Wedding Couple",
    serviceUsed: "4K Cinematic Wedding Film & Teaser",
    rating: 5,
    quote: "Sai Graphics turned our wedding footage into pure Bollywood-grade cinema! The color grade on our Haldi ceremony brought out the golden marigold tones so beautifully without blowing out our skin tones. Our relatives couldn't stop replaying the 4-minute teaser. Unbelievable turnaround in just 4 days!",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    turnaround: "Delivered in 4 Days",
    date: "October 2026",
    verified: true
  },
  {
    id: "rev-2",
    name: "Vikramaditya Roy",
    location: "Kolkata & Patna",
    role: "Senior Wedding Cinematographer",
    serviceUsed: "Multi-Cam Video Post-Production & Color Grading",
    rating: 5,
    quote: "As a traveling photographer covering luxury destination weddings across Bihar and Bengal, I outsource all my RAW FCP and DaVinci post-production exclusively to Sai Graphics. Their timeline speed, seamless multi-cam audio synchronization, and tone curves are superior to any studio in Eastern India.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    turnaround: "B2B Studio Partner",
    date: "September 2026",
    verified: true
  },
  {
    id: "rev-3",
    name: "Ananya & Manish Verma",
    location: "Patna, Bihar",
    role: "Newlywed Couple",
    serviceUsed: "Luxury Lay-Flat Wedding Album Designing",
    rating: 5,
    quote: "The 12x36 metallic photobook designed by Sai Graphics is a true heirloom masterpiece. The velvet texture, emboss finish, and narrative storytelling from the Jaimala to Bidaai made my parents cry happy tears. Highly recommend their Sah Market studio for any couple!",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80",
    turnaround: "Delivered in 3 Days",
    date: "August 2026",
    verified: true
  },
  {
    id: "rev-4",
    name: "Amit & Shweta Singh",
    location: "Bhagalpur, Bihar",
    role: "Pre-Wedding Couple",
    serviceUsed: "DJI 360° Drone Aerial Cinematography",
    rating: 5,
    quote: "The 360° drone shots taken over the Vikramshila Setu and Ganges riverbanks looked like a grand international film production! Their drone pilot and post-grading editor worked magic with the sunset golden hour tones. Best editing studio in Bhagalpur hands down.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    turnaround: "Delivered in 48 Hours",
    date: "September 2026",
    verified: true
  },
  {
    id: "rev-5",
    name: "Rakesh Kumar",
    location: "Sah Market, Bhagalpur",
    role: "Commercial Studio Owner (LensCraft)",
    serviceUsed: "Batch RAW Retouching & Color Lab Finishing",
    rating: 5,
    quote: "During peak wedding seasons, our studio gets 10,000+ RAW captures. Sai Graphics handles all frequency separation, clothing wrinkle correction, and album exports with surgical accuracy. Never missed a delivery deadline in 3 years of collaboration.",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=250&q=80",
    turnaround: "Ongoing Enterprise Partner",
    date: "October 2026",
    verified: true
  },
  {
    id: "rev-6",
    name: "Dr. Sneha & Kunal Sen",
    location: "Kahalgaon, Bihar",
    role: "Wedding Couple",
    serviceUsed: "Traditional Wedding Film & Instagram Reels",
    rating: 5,
    quote: "They understood the cultural significance of every small Maithil ritual and edited the background flute score with pinpoint emotional timing. The Instagram reels they crafted went viral in our family circles. Truly passionate artists!",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80",
    turnaround: "Delivered in 5 Days",
    date: "July 2026",
    verified: true
  }
];

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials = defaultTestimonialsData,
  onReviewSubmitted
}) => {
  const { config } = useAesthetic();
  const [items, setItems] = useState<TestimonialItem[]>(testimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isPaused, setIsPaused] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // New Review Form State
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('Wedding Couple');
  const [formLocation, setFormLocation] = useState('Bhagalpur, Bihar');
  const [formService, setFormService] = useState('Cinematic Video Editing');
  const [formRating, setFormRating] = useState(5);
  const [formQuote, setFormQuote] = useState('');

  // Update items if prop changes
  useEffect(() => {
    if (testimonials && testimonials.length > 0) {
      setItems(testimonials);
    }
  }, [testimonials]);

  // Categories for filter
  const filterCategories = [
    'All',
    'Wedding Film',
    'Album Designing',
    'Color Grading',
    'Drone',
    'Studio Partner'
  ];

  const filteredItems = items.filter((item) => {
    if (selectedFilter === 'All') return true;
    const s = (item.serviceUsed + ' ' + item.role).toLowerCase();
    return s.includes(selectedFilter.toLowerCase());
  });

  const totalSlides = filteredItems.length;

  // Keep index within bounds when filter changes
  useEffect(() => {
    if (currentIndex >= totalSlides && totalSlides > 0) {
      setCurrentIndex(0);
    }
  }, [selectedFilter, totalSlides, currentIndex]);

  // Auto-advance carousel every 6 seconds unless paused
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  // Submit review handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formQuote.trim()) return;

    setIsSubmitting(true);
    try {
      const id = `rev-${Date.now()}`;
      const newRev: TestimonialItem = {
        id,
        name: formName.trim(),
        role: (formRole || 'Verified Client').trim(),
        serviceUsed: (formService || 'Post Production Service').trim(),
        location: (formLocation || 'Bhagalpur, Bihar').trim(),
        rating: Number(formRating) || 5,
        quote: formQuote.trim(),
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        turnaround: 'Recent Project',
        verified: true
      };

      await setDoc(doc(db, 'testimonials', id), newRev);

      setItems((prev) => [newRev, ...prev]);
      if (onReviewSubmitted) onReviewSubmitted(newRev);
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowReviewModal(false);
        setSubmitSuccess(false);
        setFormName('');
        setFormQuote('');
      }, 1800);
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="testimonials"
      className="relative py-24 bg-[var(--brand-bg)] border-t border-secondary overflow-hidden transition-colors duration-500"
    >
      {/* Ambient Backlight Aura */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[25rem] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{ backgroundColor: config.primaryColor }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft border"
              style={{ borderColor: `${config.primaryColor}55` }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: config.primaryColor }} />
              <span
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: config.secondaryColor }}
              >
                Client Trust & Accolades
              </span>
            </div>

            <h2 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
              VOICES OF <span className="text-gold-gradient">SATISFACTION</span>
            </h2>

            <p className="text-secondary text-sm sm:text-base leading-relaxed">
              Real testimonials from brides, grooms, regional cinematographers, and commercial studios who trust Sai Graphics for their most precious milestones.
            </p>
          </div>

          {/* Trust Metrics Pill & Write Review Action */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-soft border border-primary backdrop-blur-md">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-current"
                    style={{ color: config.primaryColor }}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-primary">4.98 / 5.0</span>
              <span className="text-xs text-muted">· 850+ Projects</span>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-950 shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              style={{
                backgroundColor: config.primaryColor,
                boxShadow: `0 0 16px ${config.glowColor}`,
              }}
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Share Experience</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {filterCategories.map((cat) => {
            const isSelected = selectedFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedFilter(cat);
                  setCurrentIndex(0);
                }}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'text-slate-950 font-bold shadow-md'
                    : 'bg-muted text-secondary hover:text-primary hover:bg-soft border border-primary'
                }`}
                style={{
                  backgroundColor: isSelected ? config.primaryColor : undefined,
                  boxShadow: isSelected ? `0 0 12px ${config.glowColor}` : undefined,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* CAROUSEL CONTAINER */}
        {/* ========================================================================= */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {totalSlides === 0 ? (
            <div className="text-center py-16 text-muted">
              No reviews found in this category.
            </div>
          ) : (
            <div className="overflow-hidden py-2">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="w-full shrink-0 px-2 sm:px-4"
                  >
                    <div
                      className="relative rounded-3xl p-6 sm:p-10 bg-[var(--brand-bg)]/80 backdrop-blur-xl border border-primary shadow-2xl transition-all duration-500 hover:border-primary"
                      style={{
                        boxShadow: `0 10px 40px rgba(0,0,0,0.4)`,
                      }}
                    >
                      {/* Decorative Watermark Quote Icon */}
                      <div className="absolute top-6 right-8 opacity-10 pointer-events-none">
                        <Quote className="w-24 h-24 sm:w-32 sm:h-32 text-primary" />
                      </div>

                      <div className="relative z-10 flex flex-col justify-between gap-6">
                        
                        {/* Top Metadata: Rating, Service Used, and Verification */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary pb-4">
                          <div className="flex items-center gap-1.5">
                            {[...Array(item.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-current drop-shadow-sm"
                                style={{ color: config.primaryColor }}
                              />
                            ))}
                            <span className="text-xs font-bold text-primary ml-2">
                              5.0 Excellence
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <span
                              className="font-mono px-2.5 py-1 rounded-md bg-soft border border-primary"
                              style={{ color: config.secondaryColor }}
                            >
                              {item.serviceUsed}
                            </span>
                            {item.turnaround && (
                              <span className="flex items-center gap-1 text-muted font-mono hidden sm:flex">
                                <Clock className="w-3.5 h-3.5 text-muted" />
                                {item.turnaround}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Middle: Emotional Client Review Quote */}
                        <p className="font-outfit text-base sm:text-xl lg:text-2xl text-slate-100 font-normal leading-relaxed italic" style={{ textWrap: 'balance' }}>
                          "{item.quote}"
                        </p>

                        {/* Bottom: Client Profile & Credentials */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2"
                              style={{ borderColor: config.primaryColor }}
                            >
                              <img
                                src={item.avatarUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-cinzel text-base sm:text-lg font-bold text-primary">
                                  {item.name}
                                </h4>
                                {item.verified && (
                                  <span title="Verified Client of Sai Graphics">
                                    <ShieldCheck
                                      className="w-4 h-4"
                                      style={{ color: config.primaryColor }}
                                    />
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted mt-0.5">
                                {item.role} · <span className="text-secondary">{item.location}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right hidden sm:block text-xs text-muted font-mono">
                            <span>Project Finished: {item.date}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Carousel Controls: Previous / Next & Pagination Dots */}
          {totalSlides > 1 && (
            <div className="flex items-center justify-between pt-8 px-2">
              
              {/* Slide Counter */}
              <div className="text-xs font-mono text-muted">
                <span className="font-bold text-primary">
                  0{currentIndex + 1}
                </span>
                <span className="mx-1">/</span>
                <span>0{totalSlides}</span>
                {isPaused && (
                  <span className="ml-3 text-[11px] text-amber-400">
                    (Paused on hover)
                  </span>
                )}
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {filteredItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className="h-2 rounded-full transition-all cursor-pointer"
                    style={{
                      width: currentIndex === idx ? '28px' : '8px',
                      backgroundColor: currentIndex === idx ? config.primaryColor : 'rgba(255, 255, 255, 0.2)',
                    }}
                    aria-label={`Jump to review slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-soft hover:bg-soft text-primary border border-primary transition-all cursor-pointer active:scale-95"
                  aria-label="Previous client review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-soft hover:bg-soft text-primary border border-primary transition-all cursor-pointer active:scale-95"
                  aria-label="Next client review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* WRITE A REVIEW MODAL */}
      {/* ========================================================================= */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[var(--brand-bg)] border border-primary p-6 shadow-2xl space-y-5">
            
            <div className="flex items-start justify-between border-b border-primary pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-current" />
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-primary tracking-wide">
                    SHARE YOUR EXPERIENCE
                  </h3>
                </div>
                <p className="text-xs text-muted mt-1">
                  How was your post-production or album finishing journey with Sai Graphics?
                </p>
              </div>

              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1.5 text-muted hover:text-primary rounded-lg hover:bg-soft transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-cinzel text-lg font-bold text-primary">Thank You So Much!</h4>
                <p className="text-xs text-secondary">
                  Your review has been successfully submitted and added to our testimonials gallery.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-secondary font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Your Full Name / Couple Names *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Abhishek & Sneha Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-soft border border-primary text-primary placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-secondary font-semibold mb-1 uppercase tracking-wider text-[11px]">
                      Your Role
                    </label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#141822] border border-primary text-primary focus:outline-none focus:border-[#d4af37]"
                    >
                      <option value="Wedding Couple">Wedding Couple</option>
                      <option value="Bride / Groom">Bride / Groom</option>
                      <option value="Cinematographer">Cinematographer</option>
                      <option value="Studio Owner">Studio Owner</option>
                      <option value="Pre-Wedding Client">Pre-Wedding Client</option>
                      <option value="Corporate Client">Corporate Client</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-secondary font-semibold mb-1 uppercase tracking-wider text-[11px]">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Bhagalpur, Bihar"
                      className="w-full px-3 py-2.5 rounded-xl bg-soft border border-primary text-primary placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-secondary font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Service Delivered
                  </label>
                  <input
                    type="text"
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    placeholder="e.g. 4K Cinematic Wedding Film or Lay-Flat Album"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-soft border border-primary text-primary placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Rating Stars Picker */}
                <div>
                  <label className="block text-secondary font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                    Rating ({formRating} Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-secondary font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Your Feedback / Experience *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formQuote}
                    onChange={(e) => setFormQuote(e.target.value)}
                    placeholder="Share how Sai Graphics helped with your wedding film, photo retouching, or album designing..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-soft border border-primary text-primary placeholder-slate-500 focus:outline-none focus:border-[#d4af37] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-primary">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 rounded-xl text-muted hover:text-primary transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-slate-950 flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-105 active:scale-95 disabled:opacity-50"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Posting...' : 'Post Review'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
