import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  Sparkles, 
  ArrowLeft,
  Edit2
} from 'lucide-react';
import { NavigationTab, HeroSlide } from '../types';
import { INITIAL_HERO_SLIDES } from '../data/initialData';
import { useAuth } from '../context/AuthContext';

interface HeroSlideshowBannerProps {
  slides?: HeroSlide[];
  onNavigate?: (tab: NavigationTab) => void;
}

const SLIDE_INTERVAL_MS = 7500; // 7.5 seconds per slide
const TRANSITION_DURATION_MS = 1200; // 1.2s smooth cross-fade

// Subtle Ken Burns slow pan & zoom transforms
const KEN_BURNS_STYLES = [
  {
    initial: 'scale-100 translate-x-0 translate-y-0',
    active: 'scale-108 translate-x-2 -translate-y-1'
  },
  {
    initial: 'scale-104 -translate-x-1 translate-y-1',
    active: 'scale-112 translate-x-2 -translate-y-1'
  },
  {
    initial: 'scale-100 translate-x-1',
    active: 'scale-110 -translate-x-2 translate-y-1'
  },
  {
    initial: 'scale-105 translate-y-1',
    active: 'scale-100 -translate-x-1 -translate-y-1'
  },
  {
    initial: 'scale-102 -translate-x-1',
    active: 'scale-110 translate-x-2 translate-y-1'
  }
];

export default function HeroSlideshowBanner({ slides: propSlides, onNavigate }: HeroSlideshowBannerProps) {
  const { isAdmin } = useAuth();

  // Filter active slides from props, falling back to INITIAL_HERO_SLIDES
  const activeSlides: HeroSlide[] = 
    propSlides && propSlides.length > 0
      ? propSlides.filter((s) => s.status !== 'archived')
      : INITIAL_HERO_SLIDES;

  const slidesToUse = activeSlides.length > 0 ? activeSlides : INITIAL_HERO_SLIDES;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeKenBurnsIdx, setActiveKenBurnsIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Trigger Ken Burns transform on active slide change
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
    const nextIdx = (currentIndex + 1) % slidesToUse.length;
    goToSlide(nextIdx);
  }, [currentIndex, goToSlide, slidesToUse.length]);

  const handlePrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + slidesToUse.length) % slidesToUse.length;
    goToSlide(prevIdx);
  }, [currentIndex, goToSlide, slidesToUse.length]);

  // Slideshow auto-advance and smooth progress bar
  useEffect(() => {
    if (!isPlaying || isHovered || slidesToUse.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const startTime = Date.now();
    setProgress(0);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / SLIDE_INTERVAL_MS) * 100);
      setProgress(pct);
    }, 60);
    progressTimerRef.current = progressInterval as unknown as number;

    timerRef.current = setInterval(() => {
      handleNext();
    }, SLIDE_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, isHovered, currentIndex, handleNext, slidesToUse.length]);

  // Touch Swipe Handlers for Mobile & Tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    // RTL swipe: positive diff means swipe left (next), negative diff means swipe right (prev)
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  const currentSlide = slidesToUse[currentIndex] || slidesToUse[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section
        id="hero-banner"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Homepage Feature Banner"
        className="hero-section group relative overflow-hidden text-white w-full h-[460px] sm:h-[490px] lg:h-[520px] bg-stone-900 rounded-3xl border border-[#E2E9E5] select-none shadow-md"
      >
        {/* 1. Unshaded, Vibrant Background Slides (No dark shading over image) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {slidesToUse.map((slide, idx) => {
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
                  transition: `opacity ${TRANSITION_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
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
                      ? `transform ${SLIDE_INTERVAL_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
                      : 'none'
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/gallery%20(1).jpg';
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* 2. Top Real-time Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/15 z-30 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1B6B52] via-[#2DBE93] to-[#A7F3D0] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 3. Quick Admin Shortcut Button */}
        {isAdmin && onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="absolute top-4 left-4 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/35 hover:bg-black/55 text-[#A7F3D0] hover:text-white border border-white/25 backdrop-blur-md text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            title="ފީޗަރ ބެނާ އެޑިޓްކުރައްވާ (Admin Portal)"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>ބެނާ ބަދަލުކުރައްވާ</span>
          </button>
        )}

        {/* 4. Highly Transparent Modern Frosted Glass Overlay Card */}
        <div className="relative z-20 h-full p-4 sm:p-6 lg:p-8 flex items-end sm:items-center justify-end">
          <div className="w-full max-w-xl text-right">
            {/* Highly Transparent Glass Card */}
            <div className="p-5 sm:p-7 lg:p-8 rounded-3xl bg-black/25 sm:bg-black/20 backdrop-blur-md border border-white/25 shadow-xl space-y-3.5 sm:space-y-4 text-white transition-all duration-300">
              
              {/* Header: Context Tag & Registration */}
              <div className="flex items-center justify-between border-b border-white/20 pb-2.5">
                <span className="font-mono text-[11px] sm:text-xs text-[#A7F3D0] tracking-wide drop-shadow-sm font-bold">
                  ރަޖިސްޓްރީ: CR/12/2024
                </span>

                {currentSlide.badge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/30 border border-white/25 text-[#A7F3D0] text-xs font-semibold backdrop-blur-xs drop-shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
                    <span>{currentSlide.badge}</span>
                  </div>
                )}
              </div>

              {/* Display Headline with deep text shadow for crisp legibility */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                {currentSlide.title}
              </h2>

              {/* Caption Description */}
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-thaana line-clamp-3 sm:line-clamp-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] font-medium">
                {currentSlide.caption}
              </p>

              {/* Action Buttons Row */}
              <div className="pt-1.5 flex flex-wrap items-center justify-start gap-2.5">
                {currentSlide.ctaText && onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate(currentSlide.ctaLink || 'programs')}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#1B6B52]/90 hover:bg-[#1B6B52] active:bg-[#145541] text-white text-xs sm:text-sm font-bold shadow-md border border-white/20 backdrop-blur-xs transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <span>{currentSlide.ctaText}</span>
                    <ArrowLeft className="w-4 h-4 text-[#A7F3D0]" />
                  </button>
                )}

                {currentSlide.secondaryCtaText && onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate(currentSlide.secondaryCtaLink || 'about')}
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-black/30 hover:bg-black/50 active:bg-black/60 text-white border border-white/25 backdrop-blur-xs text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
                  >
                    <span>{currentSlide.secondaryCtaText}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Floating Modern Transparent Glass Control Bar (Bottom Left) */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 lg:left-8 z-30 flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-black/35 backdrop-blur-md border border-white/25 shadow-lg text-white">
          {/* Play / Pause Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            title={isPlaying ? 'ހުއްޓުވާ (Pause)' : 'ކުރިއަށް ގެންދަވާ (Play)'}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Slide Dots / Capsules */}
          <div className="flex items-center gap-1.5 px-1">
            {slidesToUse.map((slide, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={slide.id || idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isSelected
                      ? 'w-7 h-2 bg-[#2DBE93] shadow-xs'
                      : 'w-2 h-2 bg-white/45 hover:bg-white/80'
                  }`}
                  title={`ސްލައިޑް ${idx + 1}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Counter */}
          <span className="font-mono text-[11px] text-white/80 px-1 border-r border-white/20">
            0{currentIndex + 1} / 0{slidesToUse.length}
          </span>

          {/* Next / Previous Buttons */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title="ކުރީގެ ސްލައިޑް"
              aria-label="Previous slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title="ދެން އޮތް ސްލައިޑް"
              aria-label="Next slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
