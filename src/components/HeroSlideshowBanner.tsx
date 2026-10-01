import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause 
} from 'lucide-react';
import { INITIAL_HERO_SLIDES } from '../data/initialData';

// Dynamically import all images uploaded to src/featurebannerimages
const bannerImageModules = import.meta.glob<string>(
  '../featurebannerimages/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG}',
  { eager: true, import: 'default' }
);
const IMPORTED_BANNER_IMAGES: string[] = Object.values(bannerImageModules);

// Fallback to initial hero slides if the directory is empty
const SLIDES: Array<{ id: string; imageUrl: string }> = 
  IMPORTED_BANNER_IMAGES.length > 0
    ? IMPORTED_BANNER_IMAGES.map((url, idx) => ({
        id: `feature-slide-${idx}`,
        imageUrl: url
      }))
    : INITIAL_HERO_SLIDES.map((s, idx) => ({
        id: s.id || `initial-slide-${idx}`,
        imageUrl: s.imageUrl
      }));

const SLIDE_INTERVAL_MS = 8000; // 8 seconds interval
const TRANSITION_DURATION_MS = 2500; // 2.5 seconds smooth transition time

// Distinct Ken Burns zoom & pan transform styles for each slide
const KEN_BURNS_STYLES = [
  {
    initial: 'scale-100 translate-x-0 translate-y-0',
    active: 'scale-110 translate-x-3 -translate-y-2'
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

export default function HeroSlideshowBanner() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeKenBurnsIdx, setActiveKenBurnsIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
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
    const nextIdx = (currentIndex + 1) % SLIDES.length;
    goToSlide(nextIdx);
  }, [currentIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + SLIDES.length) % SLIDES.length;
    goToSlide(prevIdx);
  }, [currentIndex, goToSlide]);

  // Slideshow timer: 8 seconds interval
  useEffect(() => {
    if (!isPlaying || isHovered || SLIDES.length <= 1) {
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
  }, [isPlaying, isHovered, currentIndex, handleNext]);

  return (
    <section
      id="hero-banner"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="hero-section group relative overflow-hidden text-white w-full h-[320px] sm:h-[360px] lg:h-[400px] border-b border-[#286352] shadow-xl transition-all duration-500 ease-out select-none"
      style={{
        backgroundColor: '#1E5243',
        backgroundImage: 'radial-gradient(ellipse at 50% 20%, #266352 0%, #1B4A3C 100%)'
      }}
    >
      {/* Layer 1: Slideshow images spanning 98% (1% green border on both sides) with 1.5% soft fade into textured green background */}
      <div
        className="absolute inset-y-0 left-[1%] w-[98%] overflow-hidden pointer-events-none z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 1.5%, rgba(0,0,0,1) 98.5%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 1.5%, rgba(0,0,0,1) 98.5%, rgba(0,0,0,0) 100%)'
        }}
      >
        {SLIDES.map((slide, idx) => {
          const isCurrent = idx === currentIndex;
          const isKenBurnsActive = idx === activeKenBurnsIdx;
          const styleIndex = idx % KEN_BURNS_STYLES.length;
          const kbStyle = KEN_BURNS_STYLES[styleIndex];

          return (
            <div
              key={slide.id}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                opacity: isCurrent ? 1 : 0,
                transition: `opacity ${TRANSITION_DURATION_MS}ms ease-in-out`,
                zIndex: isCurrent ? 2 : 1
              }}
            >
              <img
                src={slide.imageUrl}
                alt={`Feature Banner Slide ${idx + 1}`}
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
      </div>

      {/* Layer 2: Islamic Star & Lattice Tessellation Architectural Texture Overlay across entire banner */}
      <div 
        className="hero-texture absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-screen transition-transform duration-700 ease-out group-hover:scale-105 transform-gpu z-1"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23A7F3D0' stroke-width='0.7' fill='none' fill-rule='evenodd'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3Cpath d='M30 10l20 20-20 20-20-20z'/%3E%3Cpath d='M0 0l15 15L0 30l30 30 15-15L60 60V0L45 15 30 0z'/%3E%3Ccircle cx='30' cy='30' r='3.5' fill='%23A7F3D0' fill-opacity='0.25'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '48px 48px'
        }}
        aria-hidden="true"
      />

      {/* Layer 3: Tactile Fine Stipple Grain Texture Overlay across entire banner */}
      <div 
        className="hero-texture absolute inset-0 pointer-events-none opacity-[0.10] mix-blend-overlay transition-transform duration-700 ease-out group-hover:scale-103 transform-gpu z-1"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '16px 16px'
        }}
        aria-hidden="true"
      />

      {/* Layer 4: Subtle ambient theme glow lights */}
      <div className="hero-ambient-primary absolute top-0 right-1/4 w-[380px] h-[380px] rounded-full blur-3xl pointer-events-none transition-all duration-700 ease-out group-hover:scale-110 z-1" />
      <div className="hero-ambient-secondary absolute bottom-0 left-10 w-[340px] h-[340px] rounded-full blur-3xl pointer-events-none transition-all duration-700 ease-out group-hover:scale-110 z-1" />

      {/* Minimalist Slide Controls Bar (Bottom Center) - No captions or text overlays */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 shadow-xl text-white">
        {/* Play / Pause toggle */}
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1 rounded-md text-white/80 hover:text-white transition-colors cursor-pointer"
          title={isPlaying ? 'ހުއްޓުވާ (Pause)' : 'ކުރިއަށް ގެންދަވާ (Play)'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={handleNext}
            className="p-1 rounded-md text-white/80 hover:text-white transition-colors cursor-pointer"
            title="ކުރިއަށް"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 rounded-md text-white/80 hover:text-white transition-colors cursor-pointer"
            title="ފަހަތަށް"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Slide Progress Indicators */}
        <div className="flex items-center gap-1.5 px-1">
          {SLIDES.map((_, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                className="relative h-1.5 sm:h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer"
                style={{
                  width: isCurrent ? '26px' : '7px',
                  backgroundColor: isCurrent ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.35)'
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
        <span className="text-[11px] font-mono font-bold text-[#A7F3D0] pl-1">
          {String(currentIndex + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}
