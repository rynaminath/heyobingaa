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
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { nobackbite1Img } from '../data/initialData';
import ChallengeHubView from '../components/challenges/ChallengeHubView';

interface ProgramsPageProps {
  onNavigate?: (tab: NavigationTab) => void;
  onOpenDonateModal?: () => void;
  initialView?: 'challenge' | 'overview' | 'posters';
}

// Dynamically import all portrait event posters uploaded to src/eventposters
const posterModules = import.meta.glob<string>(
  '../eventposters/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG}',
  { eager: true, import: 'default' }
);
const POSTER_IMAGES: string[] = Object.values(posterModules);

const SLIDE_INTERVAL_MS = 5500; // 5.5 seconds per poster slide

export default function ProgramsPage({ onNavigate, onOpenDonateModal, initialView = 'challenge' }: ProgramsPageProps) {
  const [activeTab, setActiveTab] = useState<'challenge' | 'overview' | 'posters'>(initialView);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  const posters = POSTER_IMAGES;

  // Sync when initialView prop changes
  useEffect(() => {
    if (initialView) {
      setActiveTab(initialView);
    }
  }, [initialView]);

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

  // Slideshow auto-advance timer (only active when posters tab is visible)
  useEffect(() => {
    if (activeTab !== 'posters' || !isPlaying || isHovered || lightboxIndex !== null || posters.length <= 1) {
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
  }, [activeTab, isPlaying, isHovered, lightboxIndex, currentIndex, posters.length, handleNext]);

  return (
    <div className="py-8 sm:py-12 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Sub-Navigation Tabs inside Programs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E9E5] pb-4 font-thaana">
        
        {/* Right / Main Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {/* Tab 1: 30-Day No Backbiting Challenge */}
          <button
            type="button"
            onClick={() => setActiveTab('challenge')}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'challenge'
                ? 'bg-[#1B6B52] text-white shadow-md'
                : 'bg-white hover:bg-[#EBF5F0] text-[#1C2622] border border-[#E2E9E5]'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'challenge' ? 'text-amber-300' : 'text-[#1B6B52]'}`} />
            <span className="font-sans font-extrabold tracking-tight">30-Day No Backbiting Challenge</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
              activeTab === 'challenge' ? 'bg-amber-400 text-stone-900' : 'bg-emerald-100 text-emerald-800'
            }`}>
              Live
            </span>
          </button>

          {/* Tab 2: All Core Programs */}
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#1B6B52] text-white shadow-md'
                : 'bg-white hover:bg-[#EBF5F0] text-[#1C2622] border border-[#E2E9E5]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>ހުރިހާ ޕްރޮގްރާމްތަކެއް</span>
          </button>

          {/* Tab 3: Posters Slideshow */}
          <button
            type="button"
            onClick={() => setActiveTab('posters')}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'posters'
                ? 'bg-[#1B6B52] text-white shadow-md'
                : 'bg-white hover:bg-[#EBF5F0] text-[#1C2622] border border-[#E2E9E5]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>ޕޯސްޓަރުތަކުގެ ސްލައިޑްޝޯ ({posters.length})</span>
          </button>
        </div>

        {/* Left: Quick indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-[#556660]">
          <span>ހެޔޮބިންގާ ޖަމްޢިއްޔާގެ ދީނީ & ތަރުބަވީ ޙަރަކާތްތައް</span>
        </div>
      </div>

      {/* 2. TAB CONTENT: 30-Day No Backbiting Challenge (Inside Programs) */}
      {activeTab === 'challenge' && (
        <ChallengeHubView onNavigate={onNavigate} isEmbedded={true} />
      )}

      {/* 3. TAB CONTENT: Core Programs Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8 font-thaana">
          {/* Header Banner */}
          <div className="bg-gradient-to-l from-[#134e3e] via-[#1B6B52] to-[#124b3b] text-white p-8 sm:p-10 rounded-3xl border border-[#145541] shadow-xl text-right space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#A7F3D0] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>ހެޔޮބިންގާ ޖަމްޢިއްޔާގެ ދީނީ އަދި ތަރުބަވީ ޙަރަކާތްތައް</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              ޕްރޮގްރާމްތަކާއި ޙަރަކާތްތައް
            </h1>
            <p className="text-base sm:text-lg text-[#EBF5F0] max-w-3xl leading-relaxed">
              ދިވެހި މުޖުތަމަޢުގެ އެންމެހައި ފަރާތްތަކަށް އިސްލާމީ ޞައްޙަ ޢަޤީދާއާއި ރިވެތި އަޚްލާޤާއި ހެޔޮލަފާ ތަރުބިއްޔަތު ފޯރުކޮށްދިނުމަށްޓަކައި ހިންގޭ ތަފާތު ޕްރޮގްރާމްތަކާއި ވޯކްޝޮޕްތައް.
            </p>
          </div>

          {/* Spotlight banner inside Overview linking directly to challenge */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#1B6B52]/30 shadow-xs text-right space-y-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="w-full md:w-48 shrink-0 flex justify-center md:justify-start">
                <img
                  src={nobackbite1Img}
                  alt="30-Day No Backbiting Challenge"
                  className="w-full h-auto max-h-52 object-contain rounded-2xl border border-[#E2E9E5] bg-stone-50 shadow-2xs"
                />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EBF5F0] text-[#145541] font-bold text-xs border border-[#C8E0D5]">
                    <Sparkles className="w-3.5 h-3.5 text-[#1B6B52]" />
                    <span>ޚާއްޞަ ކެމްޕޭން</span>
                  </span>
                  <span className="text-xs text-[#556660]">ހަފްތާއަކު 2 ޕޯސްޓް (ހޯމަ & ބުރާސްފަތި)</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#1C2622]">
                  30-Day No Backbiting Challenge
                </h3>

                <p className="text-xs sm:text-sm text-[#556660] leading-relaxed">
                  އަޅުގަނޑުމެންގެ ދޫތަކާއި ހިތްތައް ރައްކާތެރިކުރުމަށާއި، އުޚްތުންގެ އަބުރު ޙިމާޔަތްކުރުމަށްޓަކައި ކުރިއަށްގެންދެވޭ 30 ދުވަހުގެ ޚާއްޞަ ޕްރޮގްރާމެކެވެ. އިނގިރޭސި ބަހުން ގެނެސްދެވޭ އާޔަތްތަކާއި ޢަޒުމް ޕޯސްޓްތައް ބައްލަވާލައްވާ.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('challenge')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                  >
                    <span>ޗެލެންޖް ޕޯސްޓްތައް ބައްލަވާ</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Description of Core Varieties */}
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

            <div className="text-sm sm:text-base text-[#556660] leading-relaxed space-y-3">
              <p>
                ހެޔޮބިންގާ ޖަމްޢިއްޔާއިން ހިންގާ ޙަރަކާތްތަކަކީ ހަމައެކަނި އާދައިގެ ތަޤުރީރުތަކަކަށް ސަމާލުކަންދިނުމުގެ ބަދަލުގައި، މުޖުތަމަޢުގެ އެކި ފަންތިތަކާއި އުމުރުފުރާތަކަށް ޢަމަލީގޮތުން ބައިވެރިވެވޭނެ ގޮތަށް ފަރުމާކުރެވިފައިވާ ތަފާތު ޕްރޮގްރާމްތަކެކެވެ. މީގެ ތެރޭގައި:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5]">
                  <CheckCircle2 className="w-5 h-5 text-[#1B6B52] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-[#1C2622] text-sm block">ޢިލްމީ އަދި ދީނީ ވޯކްޝޮޕްތައް:</span>
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
        </div>
      )}

      {/* 4. TAB CONTENT: Posters Slideshow & Gallery */}
      {activeTab === 'posters' && (
        <section 
          className="bg-white rounded-3xl p-5 sm:p-8 lg:p-9 border border-[#E2E9E5] shadow-xs text-right space-y-6 font-thaana"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E9E5] pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1B6B52] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#1B6B52]" />
                <span>މައިދާނީ ޙަރަކާތްތަކުގެ ޕޯސްޓަރުތައް</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1C2622] mt-0.5">
                ހެޔޮބިންގާގެ ޕްރޮގްރާމްތަކުގެ ޕޯސްޓަރު ގެލެރީ
              </h2>
            </div>
            <span className="text-xs text-[#556660] font-mono">
              ޖުމްލަ: {posters.length} ޕޯސްޓަރު
            </span>
          </div>

          {posters.length > 0 && (
            <div className="space-y-4">
              {/* Main Slideshow Frame */}
              <div className="relative group max-w-md sm:max-w-lg md:max-w-xl mx-auto rounded-3xl overflow-hidden bg-stone-900 border border-[#E2E9E5] shadow-xl aspect-[3/4.2]">
                
                {/* Image */}
                <img
                  src={posters[currentIndex]}
                  alt={`Program Poster ${currentIndex + 1}`}
                  className="w-full h-full object-contain transition-opacity duration-300"
                />

                {/* Progress Bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-black/40 z-30">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1B6B52] via-[#38D39F] to-[#A7F3D0] transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Lightbox Trigger overlay */}
                <button
                  type="button"
                  onClick={() => setLightboxIndex(currentIndex)}
                  className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="ބޮޑުކޮށް ބައްލަވާ (Enlarge Poster)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>ބޮޑުކޮށް ބައްލަވާ</span>
                </button>

                {/* Arrows */}
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
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title={isPlaying ? 'ހުއްޓުވާ (Pause)' : 'ކުރިއަށް ގެންދަވާ (Play)'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

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

                  <span className="text-xs font-mono font-bold text-[#A7F3D0]">
                    {String(currentIndex + 1).padStart(2, '0')}/{String(posters.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Thumbnail Strip */}
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
      )}

      {/* 5. Fullscreen Lightbox Modal for Posters */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="ލައްޕާލައްވާ (Close)"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black">
              <img
                src={posters[lightboxIndex]}
                alt={`Poster ${lightboxIndex + 1}`}
                className="max-h-[82vh] w-auto object-contain select-none"
              />
            </div>

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
