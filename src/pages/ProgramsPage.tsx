import { useState, useEffect, useRef, useCallback } from 'react';
import { NavigationTab } from '../types';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  Maximize2, 
  X, 
  Layers, 
  CheckCircle2
} from 'lucide-react';

interface ProgramsPageProps {
  onNavigate?: (tab: NavigationTab) => void;
  onOpenDonateModal?: () => void;
}

// Dynamically import all portrait event posters uploaded to src/eventposters
const posterModules = import.meta.glob<string>(
  '../eventposters/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG}',
  { eager: true, import: 'default' }
);
const POSTER_IMAGES: string[] = Object.values(posterModules);

const SLIDE_INTERVAL_MS = 5500; // 5.5 seconds per poster slide

export default function ProgramsPage({ onNavigate, onOpenDonateModal }: ProgramsPageProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  const posters = POSTER_IMAGES;

  const goToSlide = useCallback((nextIdx: number) => {
    if (posters.length === 0) return;
    const safeIdx = (nextIdx + posters.length) % posters.length;
    setCurrentIndex(safeIdx);
    setProgress(0);
  }, [posters.length]);

  const handleNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Slideshow auto-advance timer
  useEffect(() => {
    if (!isPlaying || isHovered || lightboxIndex !== null || posters.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
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
  }, [isPlaying, isHovered, lightboxIndex, currentIndex, posters.length, handleNext]);

  // Keyboard navigation for main slideshow (when not in lightbox)
  useEffect(() => {
    if (lightboxIndex !== null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handlePrev(); // RTL: right is previous
      } else if (e.key === 'ArrowLeft') {
        handleNext(); // RTL: left is next
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNext, handlePrev]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + posters.length) % posters.length : 0));
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % posters.length : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, posters.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-thaana">
      {/* 1. FIRST SECTION: Event Posters Portrait Slideshow */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E9E5] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E9E5] pb-5">
          <div className="text-right">
            <span className="text-xs font-bold text-[#1B6B52] uppercase tracking-wider block">
              ޕްރޮގްރާމްތަކުގެ ޕޯސްޓަރުތައް
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2622] mt-0.5">
              ޙަރަކާތްތަކުގެ ޕޯސްޓަރު ސްލައިޑްޝޯ (Event Posters)
            </h2>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-[#556660] font-mono" dir="ltr">
            <span className="text-sm font-bold text-[#1B6B52]">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span>/</span>
            <span>{String(posters.length).padStart(2, '0')}</span>
            <span className="text-xs font-thaana ml-1">ޕޯސްޓަރު</span>
          </div>
        </div>

        {posters.length === 0 ? (
          <div className="p-12 text-center text-[#556660] border border-dashed border-[#E2E9E5] rounded-2xl">
            <p>އެއްވެސް ޕޯސްޓަރެއް އަދި އަޕްލޯޑް ކުރެވިފައެއް ނުވެއެވެ.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Portrait Slideshow Viewer Frame */}
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative max-w-sm sm:max-w-md mx-auto bg-gradient-to-b from-[#1C2622] to-[#0A1612] rounded-3xl overflow-hidden shadow-2xl border border-[#234A3E] group select-none"
              style={{ aspectRatio: '3 / 4.2' }}
            >
              {/* Images Crossfade Layer */}
              {posters.map((posterUrl, idx) => {
                const isCurrent = idx === currentIndex;
                return (
                  <div
                    key={idx}
                    className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-in-out"
                    style={{
                      opacity: isCurrent ? 1 : 0,
                      pointerEvents: isCurrent ? 'auto' : 'none',
                      zIndex: isCurrent ? 2 : 1
                    }}
                  >
                    <img
                      src={posterUrl}
                      alt={`Event Poster ${idx + 1}`}
                      className="w-full h-full object-contain cursor-pointer transition-transform duration-500 group-hover:scale-[1.02]"
                      onClick={() => setLightboxIndex(idx)}
                      title="ބޮޑުކޮށް ބައްލަވާލެއްވުމަށް ފިއްތާލައްވާ (Click to Zoom)"
                    />
                  </div>
                );
              })}

              {/* Progress Line across Top of Poster */}
              <div className="absolute top-0 inset-x-0 h-1 bg-black/40 z-20">
                <div
                  className="h-full bg-[#38D39F] transition-all ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Click-to-Zoom Hint Badge (Top Right) */}
              <button
                type="button"
                onClick={() => setLightboxIndex(currentIndex)}
                className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-md"
                title="ބޮޑުކޮށް ބައްލަވާލެއްވުމަށް (Zoom)"
              >
                <Maximize2 className="w-4 h-4 text-[#A7F3D0]" />
              </button>

              {/* Navigation Arrows (Prev & Next) */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute top-1/2 -translate-y-1/2 right-3 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 active:scale-95 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-all opacity-90 group-hover:opacity-100 cursor-pointer"
                title="ކުރީގެ ޕޯސްޓަރު (Previous)"
                aria-label="Previous Poster"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute top-1/2 -translate-y-1/2 left-3 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 active:scale-95 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-all opacity-90 group-hover:opacity-100 cursor-pointer"
                title="ދެން އޮތް ޕޯސްޓަރު (Next)"
                aria-label="Next Poster"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              {/* Bottom Control Bar */}
              <div className="absolute bottom-3 inset-x-4 z-20 flex items-center justify-between px-4 py-2 rounded-2xl bg-black/65 backdrop-blur-md border border-white/20 shadow-xl text-white">
                {/* Play / Pause toggle */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title={isPlaying ? 'ހުއްޓުވާ (Pause)' : 'ކުރިއަށް ގެންދަވާ (Play)'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                {/* Dots / Indicator Pill */}
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-[180px] sm:max-w-[220px] px-2 no-scrollbar">
                  {posters.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer shrink-0 ${
                        idx === currentIndex ? 'w-6 bg-[#38D39F]' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      title={`ޕޯސްޓަރު ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Slide Counter */}
                <span className="text-xs font-mono font-bold text-[#A7F3D0]">
                  {String(currentIndex + 1).padStart(2, '0')}/{String(posters.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            <div className="space-y-2 pt-2">
              <span className="text-xs text-[#556660] font-semibold block text-center">
                ހުރިހާ ޕޯސްޓަރެއް ބައްލަވާލެއްވުމަށް ތިރީގައިވާ ތަމްބްނެއިލްއަށް ފިއްތާލައްވާ:
              </span>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 px-1 justify-start sm:justify-center no-scrollbar">
                {posters.map((thumbUrl, idx) => {
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      className={`relative w-16 sm:w-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer aspect-[3/4.2] ${
                        isCurrent
                          ? 'border-[#1B6B52] shadow-md scale-105 ring-2 ring-[#1B6B52]/40'
                          : 'border-[#E2E9E5] opacity-65 hover:opacity-100 hover:border-[#1B6B52]/60'
                      }`}
                      title={`ޕޯސްޓަރު ${idx + 1}`}
                    >
                      <img
                        src={thumbUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono text-white">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Header Banner */}
      <div className="bg-gradient-to-l from-[#134e3e] via-[#1B6B52] to-[#124b3b] text-white p-8 sm:p-10 rounded-3xl border border-[#145541] shadow-xl text-right space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#A7F3D0] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
          <span>ހެޔޮބިންގާ ޖަމްޢިއްޔާގެ ދަޢުވަތީ އަދި ތަރުބަވީ ޙަރަކާތްތައް</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          ޕްރޮގްރާމްތަކާއި މުޖުތަމަޢީ ޙަރަކާތްތައް
        </h1>
        <p className="text-base sm:text-lg text-[#EBF5F0] max-w-3xl leading-relaxed">
          ދިވެހި މުޖުތަމަޢުގެ އެންމެހައި ފަރާތްތަކަށް އިސްލާމީ ޞައްޙަ ޢަޤީދާއާއި ރިވެތި އަޚްލާޤާއި ހެޔޮލަފާ ތަރުބިއްޔަތު ފޯރުކޮށްދިނުމަށްޓަކައި ހިންގޭ ތަފާތު ޕްރޮގްރާމްތަކާއި ވޯކްޝޮޕްތައް.
        </p>
      </div>

      {/* 3. SECOND SECTION: Small Description About the Variety of Programs Conducted */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E9E5] shadow-xs text-right space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1B6B52] uppercase tracking-wider">
            <Layers className="w-4 h-4 text-[#1B6B52]" />
            <span>ޕްރޮގްރާމްތަކުގެ ތަޢާރަފް</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2622]">
            ހިންގޭ ތަފާތު ޕްރޮގްރާމްތަކުގެ ޚުލާޞާއެއް
          </h2>
        </div>

        <div className="text-sm sm:text-base text-[#445550] leading-relaxed space-y-3">
          <p>
            ހެޔޮބިންގާ ޖަމްޢިއްޔާއިން ހިންގާ ޙަރަކާތްތަކަކީ ހަމައެކަނި އާދައިގެ ތަޤުރީރުތަކަކަށް ސަމާލުކަންދިނުމުގެ ބަދަލުގައި، މުޖުތަމަޢުގެ އެކި ފަންތިތަކާއި އުމުރުފުރާތަކަށް ޢަމަލީގޮތުން ބައިވެރިވެވޭނެ ގޮތަށް ފަރުމާކުރެވިފައިވާ ތަފާތު ޕްރޮގްރާމްތަކެކެވެ. މީގެ ތެރޭގައި:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5]">
              <CheckCircle2 className="w-5 h-5 text-[#1B6B52] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-[#1C2622] text-sm block">ޢިލްމީ އަދި ދަޢުވަތީ ވޯކްޝޮޕްތައް:</span>
                <span className="text-xs text-[#556660] leading-relaxed block">
                  ދީނީ ވާޖިބުތަކާއި އަޅުކަންތައްތަކުގެ ޞައްޙަ ގޮތް އުނގަންނައިދިނުމަށް ޢިލްމުވެރިންނާ އެކު ކުރިއަށް ގެންދެވޭ ސެޝަންތައް.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5]">
              <CheckCircle2 className="w-5 h-5 text-[#1B6B52] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-[#1C2622] text-sm block">މޫސުމީ އަދި ޚާއްޞަ ކެމްޕޭންތައް:</span>
                <span className="text-xs text-[#556660] leading-relaxed block">
                  ރޯދަމަހާއި ޛުލްޙިއްޖާގެ މާތް 10 ދުވަހާއި މުޙައްރަމް މަސް ފަދަ ބަރަކާތްތެރި މޫސުންތަކަށް ޚާއްޞަކޮށްގެން ހިންގޭ ދަރުސްތައް.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5]">
              <CheckCircle2 className="w-5 h-5 text-[#1B6B52] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-[#1C2622] text-sm block">އުޚްތުންނާއި ކުދިންގެ ތަރުބިއްޔަތު:</span>
                <span className="text-xs text-[#556660] leading-relaxed block">
                  ކަނބަލުންނާއި ފުރާވަރުގެ ކުދިންގެ ނަފްސާނީ އަދި އިޖްތިމާޢީ ދުޅަހެޔޮކަމަށް އަމާޒުކޮށްގެން ބާއްވާ ޙަރަކާތްތައް.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5]">
              <CheckCircle2 className="w-5 h-5 text-[#1B6B52] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-[#1C2622] text-sm block">ޚާއްޞަ އެހީއަށް ބޭނުންވާ ފަރާތްތައް:</span>
                <span className="text-xs text-[#556660] leading-relaxed block">
                  އަޑުއިވުމާއި ފެނުމުން މަޙްރޫމްވެފައިވާ ފަރާތްތަކަށް އިޝާރާތުގެ ބަހުރުވައިން ތައްޔާރުކުރެވޭ ޚާއްޞަ ޕްރޮގްރާމްތައް.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="ލައްޕާލައްވާ (Close)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Poster Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black">
              <img
                src={posters[lightboxIndex]}
                alt={`Poster ${lightboxIndex + 1}`}
                className="max-h-[82vh] w-auto object-contain select-none"
              />
            </div>

            {/* Lightbox Controls */}
            <div className="flex items-center justify-between w-full max-w-md pt-3 text-white">
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + posters.length) % posters.length : 0))}
                className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                <span>ކުރީގެ ޕޯސްޓަރު</span>
              </button>

              <span className="text-xs font-mono text-[#A7F3D0]">
                {String(lightboxIndex + 1).padStart(2, '0')} / {String(posters.length).padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % posters.length : 0))}
                className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"
              >
                <span>ދެން އޮތް ޕޯސްޓަރު</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
