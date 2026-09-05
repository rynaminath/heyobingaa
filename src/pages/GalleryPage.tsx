import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Play, Pause, Maximize2, X, Grid, Film } from 'lucide-react';
import { NavigationTab } from '../types';

interface GalleryPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

interface GalleryItem {
  id: string;
  url: string;
  filename: string;
  title: string;
}

// Pre-configured list of the 13 uploaded gallery images in /public/images
const UPLOADED_GALLERY_IMAGES: GalleryItem[] = Array.from({ length: 13 }, (_, i) => {
  const num = i + 1;
  const filename = `gallery (${num}).jpg`;
  return {
    id: `gallery-${num}`,
    url: `/images/${encodeURIComponent(filename)}`,
    filename,
    title: `ހެޔޮބިންގާ ޙަރަކާތްތައް • ތަޞްވީރު ${num}`
  };
});

export default function GalleryPage({ onNavigate }: GalleryPageProps) {
  // Read all 13 images instantly, with dynamic scan support
  const [images, setImages] = useState<GalleryItem[]>(UPLOADED_GALLERY_IMAGES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'slideshow' | 'grid'>('slideshow');

  useEffect(() => {
    try {
      // Scan all images in public/images
      const modules = import.meta.glob<{ default: string }>(
        ['/public/images/*.*', '/images/*.*'],
        { eager: true, query: '?url', import: 'default' }
      );

      const detected: GalleryItem[] = [];
      for (const [path, urlValue] of Object.entries(modules)) {
        const cleanPath = path.replace(/^\/public/, '');
        const filename = cleanPath.split('/').pop() || '';
        if (!filename) continue;

        // Skip non-image files if any
        if (!/\.(jpg|jpeg|png|webp|svg)$/i.test(filename)) continue;

        const matchNumber = filename.match(/\(([0-9]+)\)/);
        const readableTitle = matchNumber
          ? `ހެޔޮބިންގާ ޙަރަކާތްތައް • ތަޞްވީރު ${matchNumber[1]}`
          : filename
              .replace(/\.[^/.]+$/, '')
              .replace(/^[0-9]+[_-]?/, '')
              .replace(/[_-]+/g, ' ');

        detected.push({
          id: path,
          url: typeof urlValue === 'string' ? urlValue : `/images/${encodeURIComponent(filename)}`,
          filename,
          title: readableTitle || filename
        });
      }

      // If detected images found via glob, sort naturally
      if (detected.length > 0) {
        detected.sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }));
        setImages(detected);
      }
    } catch {
      // Fallback is already initialized to UPLOADED_GALLERY_IMAGES
    }
  }, []);

  const total = images.length;

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay slideshow
  useEffect(() => {
    if (!isPlaying || total <= 1 || viewMode === 'grid') return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, total, nextSlide, viewMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        // In RTL, right arrow goes to previous or next depending on orientation
        prevSlide();
      } else if (e.key === 'ArrowLeft') {
        nextSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isFullscreen]);

  const currentImage = images[currentIndex] || images[0];

  return (
    <div className="min-h-screen bg-[#FAFCFB] font-thaana py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5ECE8]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF5F0] text-[#1B6B52] text-xs font-semibold mb-2">
              <Film className="w-3.5 h-3.5" />
              <span>ހެޔޮބިންގާ ފޮޓޯ އަލްބަމް • ހަނދާންތައް</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C2622] tracking-tight">
              ފޮޓޯ ގެލެރީ (Photo Gallery)
            </h1>
            <p className="text-xs sm:text-sm text-[#556660] mt-1 max-w-2xl">
              ޖަމްޢިއްޔާގެ ދަޢުވަތީ، އިޖުތިމާޢީ އަދި ތަރުބަވީ ޙަރަކާތްތަކާއި ބައްދަލުވުންތަކުގެ ތަޞްވީރުތައް.
            </p>
          </div>

          {/* View Toggle & Image Count */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="flex items-center bg-white border border-[#E5ECE8] rounded-xl p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('slideshow')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'slideshow'
                    ? 'bg-[#1B6B52] text-white shadow-xs'
                    : 'text-[#556660] hover:text-[#1C2622]'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>ސްލައިޑްޝޯ</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#1B6B52] text-white shadow-xs'
                    : 'text-[#556660] hover:text-[#1C2622]'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>ގްރިޑް</span>
              </button>
            </div>

            <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-white border border-[#E5ECE8] text-[#1B6B52] shadow-xs">
              {total} Photos
            </div>
          </div>
        </div>

        {/* VIEW MODE 1: SLIDESHOW */}
        {viewMode === 'slideshow' && currentImage && (
          <div className="space-y-4">
            {/* Main Stage Container */}
            <div className="relative aspect-16/9 sm:aspect-21/9 w-full max-h-[620px] rounded-3xl overflow-hidden bg-[#0A1612] shadow-2xl border border-[#E5ECE8] group">
              <img
                src={currentImage.url}
                alt={currentImage.title}
                className="w-full h-full object-cover transition-opacity duration-500"
              />

              {/* Gradient Overlays for Controls Readability */}
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

              {/* Top Bar: Counter & Fullscreen */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                <div className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-mono font-bold border border-white/20">
                  <span dir="ltr">{currentIndex + 1} / {total}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white flex items-center justify-center transition-colors border border-white/20"
                    title={isPlaying ? 'Pause Autoplay' : 'Start Autoplay'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFullscreen(true)}
                    className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white flex items-center justify-center transition-colors border border-white/20"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Arrows: Left & Right */}
              <button
                type="button"
                onClick={nextSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all border border-white/20 hover:scale-105 shadow-lg z-20"
                aria-label="Next image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={prevSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all border border-white/20 hover:scale-105 shadow-lg z-20"
                aria-label="Previous image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Bottom Caption Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white">
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-thaana drop-shadow-md">
                    {currentImage.title}
                  </h3>
                  <p className="text-xs text-[#E5ECE8] font-mono opacity-80" dir="ltr">
                    {currentImage.filename}
                  </p>
                </div>
                <div className="text-xs font-thaana text-emerald-300">
                  ހެޔޮބިންގާ ޖަމްޢިއްޔާ
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            <div className="bg-white p-3 rounded-2xl border border-[#E5ECE8] shadow-xs">
              <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
                {images.map((img, idx) => {
                  const isSelected = idx === currentIndex;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`relative shrink-0 w-20 sm:w-24 aspect-16/10 rounded-xl overflow-hidden border-2 transition-all ${
                        isSelected
                          ? 'border-[#1B6B52] ring-2 ring-[#1B6B52]/30 scale-105 shadow-md'
                          : 'border-transparent opacity-65 hover:opacity-100 hover:scale-102'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#1B6B52]/15 pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE 2: RESPONSIVE PHOTO GRID */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setViewMode('slideshow');
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-[#0A1612] cursor-pointer shadow-sm hover:shadow-xl transition-all border border-[#E5ECE8] hover:-translate-y-1"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-mono text-emerald-300 block mb-0.5" dir="ltr">
                    #{idx + 1}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold truncate">
                    {img.title}
                  </h4>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isFullscreen && currentImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-20">
            <div className="text-sm font-mono">
              <span dir="ltr">{currentIndex + 1} / {total}</span> • <span className="font-thaana">{currentImage.title}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                title="Play/Pause"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Image Stage */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
            <img
              src={currentImage.url}
              alt={currentImage.title}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
            />

            {/* Next / Prev Buttons */}
            <button
              type="button"
              onClick={nextSlide}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-14 aspect-16/10 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  idx === currentIndex ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
