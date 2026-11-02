import React, { useState, useEffect, useCallback } from 'react';
import { StudioSettings, ServiceItem, PortfolioItem, BeforeAfterDemo, TestimonialItem } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { PortfolioGallery } from './components/PortfolioGallery';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { AdminDashboard } from './components/AdminDashboard';
import { GoogleDriveManager } from './components/GoogleDriveManager';
import { AestheticProvider, useAesthetic } from './context/AestheticContext';
import { AestheticLookSwitcher } from './components/AestheticLookSwitcher';

// Fallback initial data in case of initial network resolution
const defaultSettings: StudioSettings = {
  brandName: "SAI GRAPHICS",
  businessType: "PHOTOGRAPHY, POST PRODUCTION & EDITING LAB",
  tagline: "Transforming Moments Into Masterpieces.",
  subTagline: "Your Vision, Our Creativity, Perfectly Crafted.",
  aboutDescription: "SAIGRAPHICS is a post production studio in Bhagalpur, Bihar, focused on professional photo editing, video post production, creative graphics and visual finishing.",
  mobileNumber: "8809216991",
  whatsappNumber: "8809216991",
  email: "saigraphicsbgp@gmail.com",
  address: "Sai Graphics, 1st Floor, Sah Market, Picture Place, Bhagalpur, Bihar, India.",
  shortAddress: "1st Floor, Sah Market, Picture Place, Bhagalpur, Bihar.",
  instagram: "https://www.instagram.com/sai_graphics_editing_lab?stkn=dHIwNnM3bDk5ODB3&utm_source=qr",
  facebook: "https://www.facebook.com/share/1FEZeuXgsa/",
  googleMapsUrl: "https://maps.app.goo.gl/XHmTYuWcsr7nB44e8?g_st=iwb",
  openingHours: "Mon - Sat: 9:30 AM - 8:30 PM | Sunday: By Appointment"
};

const defaultServices: ServiceItem[] = [
  {
    id: "srv-1",
    number: "01",
    title: "Professional Photo Editing",
    category: "Photography",
    shortDesc: "High-end studio retouching, dynamic range recovery, composition refinement, and precision exposure correction.",
    fullDesc: "From commercial catalogs to personal portraits, our studio utilizes advanced skin tone separation, micro-contrast enhancement, and background cleanup to achieve pristine publication-grade standards.",
    icon: "Image",
    imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    turnaround: "24-48 Hours"
  },
  {
    id: "srv-2",
    number: "02",
    title: "Wedding Photo Editing",
    category: "Weddings",
    shortDesc: "Bespoke ceremony and reception photo finishing honoring traditional emotions and royal Indian color palettes.",
    fullDesc: "Specialized in Indian wedding rituals (Haldi, Mehendi, Sangeet, Jaimala, and Bidaai). We balance rich maroons, gold tones, and warm skin complexions while retaining crisp details in heavy embroidery.",
    icon: "Camera",
    imageUrl: "/src/assets/images/regenerated_image_1793371038824.jpg",
    featured: true,
    turnaround: "3-5 Business Days"
  },
  {
    id: "srv-3",
    number: "03",
    title: "Cinematic Video Editing",
    category: "Cinema & Film",
    shortDesc: "Rhythmic narrative pacing, seamless scene transitions, multi-cam synchronization, and emotive score alignment.",
    fullDesc: "Crafting captivating wedding teasers, highlights, and full-length cinematic films. We craft dramatic storytelling arcs using slow-motion ramps, sound design, and master-level scene pacing.",
    icon: "Film",
    imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    turnaround: "5-7 Days"
  },
  {
    id: "srv-4",
    number: "04",
    title: "Video Post Production",
    category: "Post Production",
    shortDesc: "End-to-end mastering including audio mastering, dialogue cleanup, noise suppression, and subtitle formatting.",
    fullDesc: "Comprehensive studio visual finishing for commercial ads, YouTube creators, corporate films, and documentaries. Multi-track audio sweetening, high-fidelity render outputs up to 8K HDR.",
    icon: "Sliders",
    imageUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    turnaround: "4-6 Days"
  },
  {
    id: "srv-5",
    number: "05",
    title: "Creative Graphic Design",
    category: "Graphics",
    shortDesc: "Distinctive brand identities, promotional banners, custom wedding invitations, posters, and digital creatives.",
    fullDesc: "High-impact visual collateral blending modern typography with rich Indian royal embellishments. Vector artwork, social media marketing kits, event backdrops, and printed collateral.",
    icon: "PenTool",
    imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    turnaround: "24-48 Hours"
  },
  {
    id: "srv-6",
    number: "06",
    title: "Video Graphy & Candid Photography",
    category: "Production",
    shortDesc: "Cinematic 4K on-location recording, authentic DJI drone 360° aerial views, and candid moment capture by seasoned cinematographers.",
    fullDesc: "On-field crew available across Bhagalpur and Bihar for weddings, pre-weddings, corporate celebrations, and cultural festivals with high-speed lenses, gimbals, and wireless audio setups.",
    icon: "Video",
    imageUrl: "/assets/aistudio/DJI_0105_____d7ea3f0c.jpg",
    featured: true,
    turnaround: "Event Dependent"
  },
  {
    id: "srv-7",
    number: "07",
    title: "Wedding Album Designing",
    category: "Albums & Print",
    shortDesc: "Luxury lay-flat photobook layouts with metallic embossing, panoramic spreads, and archival photo preservation.",
    fullDesc: "Artfully designed page-by-page album spreads that narrate your love story in chronological poetry. Printed on premium velvet matte, non-tear, and metallic-lustre photographic papers.",
    icon: "BookOpen",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    turnaround: "3-5 Days"
  },
  {
    id: "srv-8",
    number: "08",
    title: "Photo Retouching",
    category: "Retouching",
    shortDesc: "Frequency separation skin refinement, stray hair removal, eye brightening, and body contour perfection.",
    fullDesc: "Editorial-grade magazine retouching preserving authentic skin texture without artificial plastic looks. Ideal for bridal portraits, beauty shoots, modeling folios, and executive headshots.",
    icon: "Sparkles",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    turnaround: "24 Hours"
  },
  {
    id: "srv-9",
    number: "09",
    title: "Color Grading",
    category: "Color Lab",
    shortDesc: "DaVinci Resolve color science, custom cinematic LUT development, tone matching, and HDR mastering.",
    fullDesc: "Transform flat log footage into deep cinematic magic with film emulation, customized warm gold highlights, rich teal-shadow balance, and broadcast legal gamuts (Rec.709 & DCI-P3).",
    icon: "Palette",
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    turnaround: "48-72 Hours"
  },
  {
    id: "srv-10",
    number: "10",
    title: "Visual Effects (VFX)",
    category: "VFX & Motion",
    shortDesc: "Dynamic title animations, screen replacements, sky replacements, slow-motion stabilization, and 3D particles.",
    fullDesc: "Elevate promotional clips and wedding teasers with sparkling light particle effects, dreamy smoke aesthetics, smooth speed ramps, object tracking, and seamless rotoscoping.",
    icon: "Wand2",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    turnaround: "3-5 Days"
  }
];

const defaultPortfolio: PortfolioItem[] = [
  {
    id: "port-dji-aerial",
    title: "DJI 360° Aerial Drone Cinema & Heritage Panorama",
    category: "Cinematic Wedding Films",
    description: "Ultra-wide 360° aerial cinematography and architectural panorama captured with DJI cinema drone by Sai Graphics Production.",
    imageUrl: "/assets/aistudio/DJI_0105_____d7ea3f0c.jpg",
    client: "Sai Graphics Production",
    year: "2026",
    featured: true
  },
  {
    id: "port-1",
    title: "Royal Maithili Royal Wedding",
    category: "Wedding Photography",
    description: "Complete ceremonial coverage featuring royal maroons, traditional gold jewelry detailing, and emotional moments.",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    client: "Aman & Sneha",
    year: "2026",
    featured: true
  },
  {
    id: "port-2",
    title: "The Eternal Vow – 4K Film",
    category: "Cinematic Wedding Films",
    description: "5-minute cinematic highlight reel featuring high-speed 120fps drone sweeps, slow motion sindoor ceremony, and custom score.",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    client: "Vikram & Pooja",
    year: "2026",
    featured: true
  },
  {
    id: "port-3",
    title: "Sunset Symphony by the Ganges",
    category: "Pre-Wedding Shoots",
    description: "Sunset pre-wedding shoot captured across Vikramshila ruins and Ganges riverbank with soft golden backlight.",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    client: "Rahul & Tanya",
    year: "2026",
    featured: true
  },
  {
    id: "port-4",
    title: "Editorial Bridal Skin Retouching",
    category: "Professional Photo Editing",
    description: "Micro-texture skin finishing preserving authentic skin pores while eliminating blemishes, matched to high-fashion print standards.",
    imageUrl: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=80",
    client: "Kavya Sharma",
    year: "2026",
    featured: true
  },
  {
    id: "port-5",
    title: "Silk City Royal Brand Identity",
    category: "Creative Graphic Design",
    description: "Luxury Bhagalpur silk brand logo, golden embossed catalogue layout, and social media showcase deck.",
    imageUrl: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80",
    client: "Bhagalpur Silk Heritage",
    year: "2026",
    featured: false
  },
  {
    id: "port-6",
    title: "The Regal Velvet Photobook",
    category: "Album Design",
    description: "Panoramic 18x24 lay-flat photo book with gold leaf edge gilding and velvet hardcover presentation.",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    client: "Rajesh & Priya",
    year: "2026",
    featured: true
  }
];

const defaultBeforeAfter: BeforeAfterDemo[] = [
  {
    id: "ba-1",
    title: "Bridal Portrait Color Grade & Retouch",
    service: "Wedding Photo Editing & Retouching",
    beforeLabel: "RAW Camera Capture",
    afterLabel: "Sai Graphics Studio Finish",
    beforeImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=50&sat=-60",
    afterImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=90",
    description: "Skin luminance balancing, jewelry micro-contrast enhancement, and royal warm color grading."
  },
  {
    id: "ba-2",
    title: "Cinematic Sunset Golden Hour Match",
    service: "Cinematic Color Grading",
    beforeLabel: "Flat Log Profile",
    afterLabel: "Graded Film Emulation",
    beforeImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=50&sat=-40&con=-20",
    afterImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=95",
    description: "Highlights roll-off management, skin-tone preservation, and Kodak 2383 cinematic print feel."
  }
];

function StudioAppContent() {
  const { filmGrain } = useAesthetic();
  const [settings, setSettings] = useState<StudioSettings>(defaultSettings);
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(defaultPortfolio);
  const [beforeAfterDemos, setBeforeAfterDemos] = useState<BeforeAfterDemo[]>(defaultBeforeAfter);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('sai_graphics_admin_token');
  });
  const [bookingService, setBookingService] = useState<string>('');

  // Fetch live studio data from server API
  const loadStudioData = useCallback(async () => {
    try {
      // 1. Settings
      const contentRes = await fetch('/api/content');
      if (contentRes.ok) {
        const json = await contentRes.json();
        if (json.success && json.data) {
          setSettings(json.data);
        }
      }

      // 2. Services
      const servicesRes = await fetch('/api/services');
      if (servicesRes.ok) {
        const json = await servicesRes.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setServices(json.data);
        }
      }

      // 3. Portfolio & Before/After
      const portfolioRes = await fetch('/api/portfolio');
      if (portfolioRes.ok) {
        const json = await portfolioRes.json();
        if (json.success) {
          if (Array.isArray(json.data) && json.data.length > 0) {
            setPortfolio(json.data);
          }
          if (Array.isArray(json.beforeAfter) && json.beforeAfter.length > 0) {
            setBeforeAfterDemos(json.beforeAfter);
          }
        }
      }

      // 4. Testimonials & Client Feedback
      const testimonialsRes = await fetch('/api/testimonials');
      if (testimonialsRes.ok) {
        const json = await testimonialsRes.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setTestimonials(json.data);
        }
      }
    } catch (err) {
      console.warn('API fetch warning, using loaded state', err);
    }
  }, []);

  useEffect(() => {
    loadStudioData();
  }, [loadStudioData]);

  // Handle smooth navigation
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSelectServiceForBooking = (serviceName: string) => {
    setBookingService(serviceName);
    scrollToSection('contact');
  };

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
    localStorage.setItem('sai_graphics_admin_token', token);
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('sai_graphics_admin_token');
  };

  return (
    <div className="relative bg-[#08090d] text-slate-100 min-h-screen selection:bg-[#d4af37]/30 selection:text-[#f3e5ab]">
      {/* Navigation Top Bar */}
      <Navbar
        settings={settings}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenAdmin={() => setShowAdmin(true)}
        onOpenDrive={() => setShowDriveModal(true)}
        isAdminLoggedIn={!!authToken}
      />

      {/* Main Website Sections */}
      <main>
        {/* 1. Cinematic Hero Section with 3D Lens Animation */}
        <HeroSection
          settings={settings}
          onExplorePortfolio={() => scrollToSection('portfolio')}
          onExploreServices={() => scrollToSection('services')}
          onContactUs={() => scrollToSection('contact')}
        />

        {/* 2. About Sai Graphics Section */}
        <AboutSection
          settings={settings}
          onContactClick={() => scrollToSection('contact')}
        />

        {/* 3. 10 Animated Services Section */}
        <ServicesSection
          services={services}
          onSelectServiceForBooking={handleSelectServiceForBooking}
          whatsappNumber={settings.whatsappNumber}
        />

        {/* 4. Interactive Before & After Editing Slider */}
        <BeforeAfterSlider demos={beforeAfterDemos} />

        {/* 5. Portfolio & Gallery Section */}
        <PortfolioGallery
          portfolio={portfolio}
          whatsappNumber={settings.whatsappNumber}
        />

        {/* 6. Testimonials & Client Reviews Carousel */}
        <TestimonialsSection
          testimonials={testimonials}
          onReviewSubmitted={(newRev) => setTestimonials((prev) => [newRev, ...prev])}
        />

        {/* 7. Contact Us Section with Backend Form & Maps */}
        <ContactSection
          settings={settings}
          services={services}
          prefilledService={bookingService}
        />
      </main>

      {/* Global Footer */}
      <Footer
        settings={settings}
        onNavigate={scrollToSection}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      {/* Floating Action Buttons (WhatsApp & Quick Call) */}
      <FloatingActions
        mobileNumber={settings.mobileNumber}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Google Drive Studio Hub Modal */}
      <GoogleDriveManager
        isOpen={showDriveModal}
        onClose={() => setShowDriveModal(false)}
      />

      {/* Dedicated Studio Admin Dashboard Modal */}
      {showAdmin && (
        <AdminDashboard
          settings={settings}
          services={services}
          portfolio={portfolio}
          onClose={() => setShowAdmin(false)}
          onRefreshData={loadStudioData}
          authToken={authToken}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          onOpenDrive={() => setShowDriveModal(true)}
        />
      )}

      {/* Floating Aesthetic Look & View Switcher */}
      <AestheticLookSwitcher variant="floating" />

      {/* Optional 35mm Analog Film Grain Texture */}
      {filmGrain && <div className="film-grain-layer" />}
    </div>
  );
}

export default function App() {
  return (
    <AestheticProvider>
      <StudioAppContent />
    </AestheticProvider>
  );
}
