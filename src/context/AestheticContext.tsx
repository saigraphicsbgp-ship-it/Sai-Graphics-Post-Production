import React, { createContext, useContext, useState, useEffect } from 'react';

export type AestheticTheme = 'gold' | 'sapphire' | 'kodak' | 'emerald';
export type GalleryViewMode = 'editorial' | 'cinematic' | 'spotlight';
export type ThemeMode = 'light' | 'dark';

export interface AestheticThemeConfig {
  id: AestheticTheme;
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentBg: string;
  badgeBg: string;
  badgeBorder: string;
  glowColor: string;
  lensGradient: [string, string];
}

export const AESTHETIC_THEMES: Record<AestheticTheme, AestheticThemeConfig> = {
  gold: {
    id: 'gold',
    name: '24K Obsidian Gold',
    tagline: 'Royal Indian Wedding & Masterpiece Finishing',
    primaryColor: '#d4af37',
    secondaryColor: '#f3e5ab',
    accentBg: 'from-[#d4af37] via-[#f3e5ab] to-[#c59b27]',
    badgeBg: 'bg-[#d4af37]/10',
    badgeBorder: 'border-[#d4af37]/40',
    glowColor: 'rgba(212, 175, 55, 0.25)',
    lensGradient: ['rgba(212, 175, 55, 0.8)', 'rgba(243, 229, 171, 0.4)'],
  },
  sapphire: {
    id: 'sapphire',
    name: 'Midnight Sapphire',
    tagline: 'Cyber Post-Production Bay & Anamorphic Flares',
    primaryColor: '#38bdf8',
    secondaryColor: '#bae6fd',
    accentBg: 'from-[#38bdf8] via-[#818cf8] to-[#0284c7]',
    badgeBg: 'bg-[#38bdf8]/10',
    badgeBorder: 'border-[#38bdf8]/40',
    glowColor: 'rgba(56, 189, 248, 0.28)',
    lensGradient: ['rgba(56, 189, 248, 0.85)', 'rgba(129, 140, 248, 0.5)'],
  },
  kodak: {
    id: 'kodak',
    name: 'Vintage Kodak 35mm',
    tagline: 'Analog Halation & Golden Hour Warmth',
    primaryColor: '#f59e0b',
    secondaryColor: '#fef3c7',
    accentBg: 'from-[#f59e0b] via-[#fbbf24] to-[#ea580c]',
    badgeBg: 'bg-[#f59e0b]/10',
    badgeBorder: 'border-[#f59e0b]/40',
    glowColor: 'rgba(245, 158, 11, 0.28)',
    lensGradient: ['rgba(245, 158, 11, 0.85)', 'rgba(251, 191, 36, 0.45)'],
  },
  emerald: {
    id: 'emerald',
    name: 'Imperial Emerald',
    tagline: 'Regal Heritage & Couture Color Palette',
    primaryColor: '#10b981',
    secondaryColor: '#a7f3d0',
    accentBg: 'from-[#10b981] via-[#34d399] to-[#047857]',
    badgeBg: 'bg-[#10b981]/10',
    badgeBorder: 'border-[#10b981]/40',
    glowColor: 'rgba(16, 185, 129, 0.28)',
    lensGradient: ['rgba(16, 185, 129, 0.85)', 'rgba(52, 211, 153, 0.45)'],
  },
};

interface AestheticContextType {
  theme: AestheticTheme;
  setTheme: (theme: AestheticTheme) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  config: AestheticThemeConfig;
  filmGrain: boolean;
  setFilmGrain: (val: boolean) => void;
  galleryViewMode: GalleryViewMode;
  setGalleryViewMode: (mode: GalleryViewMode) => void;
}

const AestheticContext = createContext<AestheticContextType | undefined>(undefined);

export const AestheticProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AestheticTheme>(() => {
    const saved = localStorage.getItem('sg_aesthetic_theme');
    return (saved as AestheticTheme) || 'gold';
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('sg_theme_mode');
    return (saved as ThemeMode) || 'dark';
  });

  const [filmGrain, setFilmGrainState] = useState<boolean>(() => {
    return localStorage.getItem('sg_film_grain') === 'true';
  });

  const [galleryViewMode, setGalleryViewModeState] = useState<GalleryViewMode>(() => {
    const saved = localStorage.getItem('sg_gallery_view');
    return (saved as GalleryViewMode) || 'editorial';
  });

  const setTheme = (newTheme: AestheticTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('sg_aesthetic_theme', newTheme);
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('sg_theme_mode', newMode);
  };

  const setFilmGrain = (val: boolean) => {
    setFilmGrainState(val);
    localStorage.setItem('sg_film_grain', val ? 'true' : 'false');
  };

  const setGalleryViewMode = (mode: GalleryViewMode) => {
    setGalleryViewModeState(mode);
    localStorage.setItem('sg_gallery_view', mode);
  };

  useEffect(() => {
    // Sync theme class
    document.body.classList.remove('theme-gold', 'theme-sapphire', 'theme-kodak', 'theme-emerald');
    document.body.classList.add(`theme-${theme}`);
    
    // Sync mode class
    if (mode === 'light') {
      document.body.classList.add('mode-light');
      document.documentElement.classList.remove('dark');
    } else {
      document.body.classList.remove('mode-light');
      document.documentElement.classList.add('dark');
    }
  }, [theme, mode]);

  const config = AESTHETIC_THEMES[theme];

  return (
    <AestheticContext.Provider
      value={{
        theme,
        setTheme,
        mode,
        setMode,
        config,
        filmGrain,
        setFilmGrain,
        galleryViewMode,
        setGalleryViewMode,
      }}
    >
      {children}
    </AestheticContext.Provider>
  );
};

export const useAesthetic = () => {
  const context = useContext(AestheticContext);
  if (!context) {
    throw new Error('useAesthetic must be used within an AestheticProvider');
  }
  return context;
};
