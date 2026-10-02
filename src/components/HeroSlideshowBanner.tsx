import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { NavigationTab } from '../types';
import { INITIAL_HERO_SLIDES } from '../data/initialData';

interface HeroSlideshowBannerProps {
  onNavigate?: (tab: NavigationTab) => void;
}

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

export default function HeroSlideshowBanner({ onNavigate }: HeroSlideshowBannerProps) {
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
      className="hero-section group relative overflow-hidden text-white w-full h-[450px] sm:h-[460px] lg:h-[470px] border-b border-[#286352] shadow-xl transition-all duration-500 ease-out select-none"
      style={{
        backgroundColor: '#1E5243',
        backgroundImage: 'radial-gradient(ellipse at 50% 20%, #266352 0%, #174235 100%)'
      }}
    >
      {/* Layer 1: Slideshow images flush to left (no green on left), fading on right edge into the right green section */}
      {/* NO texture over the image */}
      <div
        className="absolute inset-y-0 left-0 w-full lg:w-[70%] xl:w-[72%] overflow-hidden pointer-events-none z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 84%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 84%, rgba(0,0,0,0) 100%)'
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

      {/* Mobile Subtle Dark Overlay Gradient so text directly on the green gradient is crystal clear */}
      <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-[#0D241C] via-[#0E2E23]/80 to-transparent z-10 pointer-events-none" />

      {/* Layer 2: Texture ONLY on the right side green area - NOT over the image */}
      <div 
        className="absolute inset-y-0 right-0 w-full lg:w-[34%] xl:w-[31%] pointer-events-none z-1 overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 16%, rgba(0,0,0,1) 100%)',
          maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 16%, rgba(0,0,0,1) 100%)'
        }}
      >
        {/* Islamic Star & Lattice Tessellation Architectural Texture Overlay */}
        <div 
          className="hero-texture absolute inset-0 opacity-[0.24] mix-blend-screen transition-transform duration-700 ease-out group-hover:scale-105 transform-gpu"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23A7F3D0' stroke-width='0.7' fill='none' fill-rule='evenodd'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3Cpath d='M30 10l20 20-20 20-20-20z'/%3E%3Cpath d='M0 0l15 15L0 30l30 30 15-15L60 60V0L45 15 30 0z'/%3E%3Ccircle cx='30' cy='30' r='3.5' fill='%23A7F3D0' fill-opacity='0.25'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '36px 36px'
          }}
          aria-hidden="true"
        />

        {/* Tactile Fine Stipple Grain Texture Overlay */}
        <div 
          className="hero-texture absolute inset-0 opacity-[0.14] mix-blend-overlay transition-transform duration-700 ease-out group-hover:scale-103 transform-gpu"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
          aria-hidden="true"
        />
      </div>

      {/* Layer 3: Subtle ambient theme glow light on the right */}
      <div className="hero-ambient-primary absolute top-0 right-0 w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none transition-all duration-700 ease-out group-hover:scale-110 z-1" />

      {/* Layer 4: Jamiyyaage Maqsad Contents - Integrated directly into the green banner background (Narrower, No Box, No Logo) */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[34%] xl:w-[31%] z-20 flex flex-col justify-center px-5 sm:px-6 lg:px-7 xl:px-8 py-6 text-right">
        <div className="space-y-3.5 max-w-sm lg:max-w-[340px] xl:max-w-[360px] mr-auto lg:mr-0 ml-auto select-text">
          {/* Header Row: Integrated Pill Badge (Logo removed as requested) */}
          <div className="flex items-center justify-start border-b border-white/15 pb-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#A7F3D0] text-xs font-semibold backdrop-blur-xs shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>ޖަމިއްޔާގެ މަޤުޞަދު</span>
            </div>
          </div>

          {/* Maqsad Quote Statement in Crisp, Proportional Thaana Typography */}
          <blockquote className="relative pr-0.5">
            <p className="text-sm sm:text-base lg:text-[16.5px] xl:text-[17.5px] font-bold leading-relaxed sm:leading-loose text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-thaana">
              "މި ޖަމިއްޔާގެ މަޤްޞަދަކީ އިޖުތިމާއީ، ޢިލްމީ، ދީނީ، ތަރުބަވީ އަދި ފަންނީ ރަނގަޅު ޖީލެއް އުފައްދާ ހެޔޮ މުޖުތަމައުއެއް ބިނާކުރުމަށް މަސައްކަތް ކުރުމެވެ."
            </p>
          </blockquote>

          {/* Footer Info & Read More Button seamlessly blended */}
          <div className="pt-2.5 border-t border-white/15 flex items-center justify-between text-xs text-[#EBF5F0]">
            <span className="font-mono text-[11px] sm:text-xs text-[#A7F3D0] drop-shadow-xs">
              ރަޖިސްޓްރީ: CR/12/2024
            </span>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-[#EBF5F0] hover:text-white border border-white/20 backdrop-blur-xs transition-all text-xs font-bold cursor-pointer shadow-xs active:scale-95"
              >
                <span>އިތުރަށް ކިޔުއްވާ</span>
                <ArrowLeft className="w-3 h-3 text-[#A7F3D0]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Minimalist Slide Controls Bar (Bottom Left) */}
      <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-6 lg:left-8 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-xl text-white">
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
                  width: isCurrent ? '24px' : '7px',
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
