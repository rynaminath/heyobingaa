import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HeroSlide, NavigationTab } from '../types';
import { INITIAL_HERO_SLIDES } from '../data/initialData';
import { 
  ArrowLeft, 
  Users, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  Sparkles, 
  Camera, 
  HeartHandshake 
} from 'lucide-react';
import HeroSlidesModal from './HeroSlidesModal';

interface HeroSlideshowBannerProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenDonateModal: () => void;
}

const STORAGE_KEY = 'heyobingaa_hero_slides';
const SLIDE_INTERVAL_MS = 8000; // 8 seconds interval
const TRANSITION_DURATION_MS = 3000; // 3 seconds transition time

// Distinct Ken Burns zoom & pan transform styles for each slide
const KEN_BURNS_STYLES = [
  {
    initial: 'scale-100 translate-x-0 translate-y-0',
    active: 'scale-112 translate-x-4 -translate-y-2'
  },
  {
    initial: 'scale-105 -translate-x-2 translate-y-1',
    active: 'scale-115 translate-x-3 -translate-y-2'
  },
  {
    initial: 'scale-100 translate-x-2',
    active: 'scale-112 -translate-x-3 translate-y-2'
  },
  {
    initial: 'scale-108 translate-y-2',
    active: 'scale-100 -translate-x-2 -translate-y-1'
  },
  {
    initial: 'scale-102 -translate-x-1',
    active: 'scale-114 translate-x-4 translate-y-1'
  }
];

export default function HeroSlideshowBanner({
  onNavigate,
  onOpenDonateModal
}: HeroSlideshowBannerProps) {
  // Load slides from localStorage or fallback to default 5 slides
  const [slides, setSlides] = useState<HeroSlide[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load hero slides from localStorage', e);
    }
    return INITIAL_HERO_SLIDES;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeKenBurnsIdx, setActiveKenBurnsIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Trigger Ken Burns zoom & pan effect smoothly on active slide
  useEffect(() => {
    const t = setTimeout(() => {
      setActiveKenBurnsIdx(currentIndex);
    }, 60);
    return () => clearTimeout(t);
  }, [currentIndex]);

  const goToSlide = useCallback((nextIdx: number) => {
    if (nextIdx === currentIndex) return;
    setCurrentIndex(nextIdx);
    setProgress(0);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % slides.length;
    goToSlide(nextIdx);
  }, [currentIndex, slides.length, goToSlide]);

  const handlePrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIdx);
  }, [currentIndex, slides.length, goToSlide]);

  // Slideshow timer: 8 seconds interval
  useEffect(() => {
    if (!isPlaying || isHovered || isModalOpen || slides.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const startTime = Date.now();
    setProgress(0);

    // Update smooth progress bar
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / SLIDE_INTERVAL_MS) * 100);
      setProgress(pct);
    }, 80);
    progressTimerRef.current = progressInterval as unknown as number;

    timerRef.current = setInterval(() => {
      handleNext();
    }, SLIDE_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, isHovered, isModalOpen, currentIndex, slides.length, handleNext]);

  // Save slides
  const handleSaveSlides = (newSlides: HeroSlide[]) => {
    setSlides(newSlides);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSlides));
    } catch (e) {
      console.warn('Failed to save slides to localStorage', e);
    }
  };

  const activeSlide = slides[currentIndex] || slides[0];

  const handleCtaClick = (link?: NavigationTab) => {
    if (link === 'donate') {
      onOpenDonateModal();
    } else if (link) {
      onNavigate(link);
    } else {
      onNavigate('programs');
    }
  };

  const handleSecondaryCtaClick = (link?: NavigationTab) => {
    if (link === 'donate') {
      onOpenDonateModal();
    } else if (link) {
      onNavigate(link);
    } else {
      onNavigate('volunteer');
    }
  };

  return (
    <>
      <section
        id="hero-banner"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="hero-section group relative overflow-hidden text-white w-full h-[310px] sm:h-[340px] lg:h-[360px] border-b border-[#286352] shadow-xl transition-all duration-500 ease-out hover:shadow-2xl select-none"
        style={{
          backgroundColor: '#1E5243',
          backgroundImage: 'radial-gradient(ellipse at 50% 20%, #266352 0%, #1B4A3C 100%)'
        }}
      >
        {/* Layer 1: Left-aligned slideshow images with no borders on left, up (top) and down (bottom), fading to right to show green banner texture */}
        <div
          className="absolute inset-y-0 left-0 w-[52%] sm:w-[58%] lg:w-[54%] overflow-hidden pointer-events-none z-0"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 28%, rgba(0,0,0,0.6) 62%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 28%, rgba(0,0,0,0.6) 62%, rgba(0,0,0,0) 100%)'
          }}
        >
          {slides.map((slide, idx) => {
            const isCurrent = idx === currentIndex;
            const isKenBurnsActive = idx === activeKenBurnsIdx;
            const styleIndex = idx % KEN_BURNS_STYLES.length;
            const kbStyle = KEN_BURNS_STYLES[styleIndex];

            return (
              <div
                key={slide.id || idx}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  opacity: isCurrent ? 1 : 0,
                  transition: `opacity ${TRANSITION_DURATION_MS}ms ease-in-out`,
                  zIndex: isCurrent ? 2 : 1
                }}
              >
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className={`w-full h-full object-cover transform-gpu ${
                    isCurrent && isKenBurnsActive ? kbStyle.active : kbStyle.initial
                  }`}
                  style={{
                    transition: isCurrent && isKenBurnsActive
                      ? `transform ${SLIDE_INTERVAL_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
                      : 'none'
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/gallery%20(1).jpg';
                  }}
                />
              </div>
            );
          })}

          {/* Fade overlay smoothly blending image into the green banner */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1E5243]/20 via-55% to-[#1E5243] pointer-events-none" />
        </div>

        {/* Layer 2: Islamic Star & Lattice Tessellation Architectural Texture Overlay */}
        <div 
          className="hero-texture absolute inset-0 pointer-events-none opacity-[0.16] mix-blend-screen transition-transform duration-700 ease-out group-hover:scale-105 transform-gpu z-1"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23A7F3D0' stroke-width='0.7' fill='none' fill-rule='evenodd'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3Cpath d='M30 10l20 20-20 20-20-20z'/%3E%3Cpath d='M0 0l15 15L0 30l30 30 15-15L60 60V0L45 15 30 0z'/%3E%3Ccircle cx='30' cy='30' r='3.5' fill='%23A7F3D0' fill-opacity='0.25'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '48px 48px'
          }}
          aria-hidden="true"
        />

        {/* Layer 3: Tactile Fine Stipple Grain Texture Overlay */}
        <div 
          className="hero-texture absolute inset-0 pointer-events-none opacity-[0.10] mix-blend-overlay transition-transform duration-700 ease-out group-hover:scale-103 transform-gpu z-1"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
          aria-hidden="true"
        />

        {/* Layer 4: Subtle decorative ambient lights in harmonized theme shades */}
        <div className="hero-ambient-primary absolute top-0 right-1/4 w-[380px] h-[380px] rounded-full blur-3xl pointer-events-none transition-all duration-700 ease-out group-hover:scale-110 z-1" />
        <div className="hero-ambient-secondary absolute bottom-0 left-10 w-[340px] h-[340px] rounded-full blur-3xl pointer-events-none transition-all duration-700 ease-out group-hover:scale-110 z-1" />

        {/* Top Floating Controls: Upload Slides Button & Slide Index indicator */}
        <div className="absolute top-3.5 left-4 sm:left-6 z-30 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer"
            title="5 ފޮޓޯ އަދި ކެޕްޝަން ބަދަލުކުރައްވާ (Upload 5 Images & Captions)"
          >
            <Camera className="w-3.5 h-3.5 text-[#A7F3D0]" />
            <span className="hidden sm:inline">5 ފޮޓޯ & ކެޕްޝަން އަޕްލޯޑް</span>
            <span className="sm:hidden">5 ފޮޓޯ</span>
          </button>
        </div>

        {/* Top Right Organization Tag Badge */}
        <div className="absolute top-3.5 right-4 sm:right-8 z-30">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#A7F3D0] backdrop-blur-xs border border-white/15">
            <Sparkles className="w-3 h-3 text-[#A7F3D0]" />
            <span className="text-[11px] font-thaana">ހެޔޮބިންގާ ޖަމްޢިއްޔާ • CR/12/2024</span>
          </div>
        </div>

        {/* Layer 5: Main Content Container (Right-aligned horizontally and middle-aligned vertically) */}
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 relative z-20 flex items-center justify-end">
          <div className="w-full sm:w-[72%] md:w-[62%] lg:w-[50%] xl:w-[48%] flex flex-col justify-center items-end text-right space-y-2.5 sm:space-y-3">
            
            {/* Category / Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-[#13382E]/90 text-[#A7F3D0] border border-[#2B705C] backdrop-blur-md shadow-xs animate-in fade-in duration-500">
              <span className="w-2 h-2 rounded-full bg-[#1B6B52] animate-pulse shrink-0" />
              <span>{activeSlide.badge || 'ދަޢުވަތީ އިސް ޙަރަކާތް'}</span>
            </div>

            {/* Slide Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm font-thaana line-clamp-2">
              {activeSlide.title}
            </h1>

            {/* Slide Caption - Aligned right horizontally and middle vertically in container */}
            <p className="text-xs sm:text-sm text-[#D1E0D9] leading-relaxed max-w-lg text-right font-thaana font-normal line-clamp-3">
              {activeSlide.caption}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-2.5 pt-0.5">
              <button
                type="button"
                onClick={() => handleCtaClick(activeSlide.ctaLink)}
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>{activeSlide.ctaText || 'ޕްރޮގްރާމްތައް ބައްލަވާ'}</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleSecondaryCtaClick(activeSlide.secondaryCtaLink)}
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 border border-white/20 active:scale-95 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-[#A7F3D0]" />
                <span>{activeSlide.secondaryCtaText || 'ވޮލަންޓިއަރަކަށް ވެލައްވާ'}</span>
              </button>
            </div>

            {/* Slide Controls & Progress Bar Indicator */}
            <div className="flex items-center justify-end gap-2.5 pt-1 text-xs">
              {/* Play / Pause toggle */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 rounded-lg bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-colors cursor-pointer"
                title={isPlaying ? 'ހުއްޓުވާ (Pause)' : 'ކުރިއަށް ގެންދަވާ (Play)'}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
              </button>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1 rounded-lg bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="ކުރިއަށް"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1 rounded-lg bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="ފަހަތަށް"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 5 Slide Progress Bars */}
              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => {
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      className="relative h-1.5 sm:h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer"
                      style={{
                        width: isCurrent ? '26px' : '7px',
                        backgroundColor: isCurrent ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.3)'
                      }}
                      title={`ސްލައިޑް ${idx + 1}`}
                    >
                      {isCurrent && (
                        <div
                          className="h-full bg-[#A7F3D0] transition-all ease-linear"
                          style={{
                            width: `${progress}%`
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Slide Counter Numbers */}
              <span className="text-[11px] font-mono font-bold text-[#A7F3D0]">
                0{currentIndex + 1} / 0{slides.length}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Modal to Upload and Edit Slides */}
      <HeroSlidesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slides={slides}
        onSaveSlides={handleSaveSlides}
      />
    </>
  );
}
