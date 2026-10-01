import React, { useState, useRef } from 'react';
import { HeroSlide, NavigationTab } from '../types';
import { INITIAL_HERO_SLIDES } from '../data/initialData';
import { X, Upload, Plus, Trash2, RotateCcw, Check, Sparkles, Image as ImageIcon, Link as LinkIcon, MoveUp, MoveDown } from 'lucide-react';

interface HeroSlidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: HeroSlide[];
  onSaveSlides: (slides: HeroSlide[]) => void;
}

export default function HeroSlidesModal({
  isOpen,
  onClose,
  slides,
  onSaveSlides
}: HeroSlidesModalProps) {
  const [editableSlides, setEditableSlides] = useState<HeroSlide[]>(slides);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync when opened
  React.useEffect(() => {
    if (isOpen) {
      setEditableSlides(slides);
      setActiveSlideIndex(0);
      setIsSaved(false);
    }
  }, [isOpen, slides]);

  if (!isOpen) return null;

  const currentSlide = editableSlides[activeSlideIndex] || editableSlides[0];

  // Helper to compress uploaded image using Canvas
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 720;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          updateCurrentSlide('imageUrl', compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const updateCurrentSlide = (field: keyof HeroSlide, value: any) => {
    setEditableSlides((prev) =>
      prev.map((s, idx) => (idx === activeSlideIndex ? { ...s, [field]: value } : s))
    );
  };

  const handleAddNewSlide = () => {
    if (editableSlides.length >= 7) return;
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      imageUrl: '/images/gallery%20(1).jpg',
      badge: 'އާ ޙަރަކާތް',
      title: 'އައު ސުރުޚީއެއް ލިޔުއްވާ',
      caption: 'މި ސްލައިޑްގެ ތަފްޞީލީ މަޢުލޫމާތާއި ކެޕްޝަން މިތަނަށް ލިޔުއްވާ.',
      ctaText: 'ޕްރޮގްރާމްތައް ބައްލަވާ',
      ctaLink: 'programs',
      secondaryCtaText: 'އިތުރު މަޢުލޫމާތު',
      secondaryCtaLink: 'about',
      order: editableSlides.length + 1
    };
    const updated = [...editableSlides, newSlide];
    setEditableSlides(updated);
    setActiveSlideIndex(updated.length - 1);
  };

  const handleDeleteSlide = (indexToDelete: number) => {
    if (editableSlides.length <= 1) return;
    const updated = editableSlides.filter((_, idx) => idx !== indexToDelete);
    setEditableSlides(updated);
    setActiveSlideIndex(Math.max(0, indexToDelete - 1));
  };

  const handleMoveSlide = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= editableSlides.length) return;
    const updated = [...editableSlides];
    const item = updated.splice(fromIndex, 1)[0];
    updated.splice(toIndex, 0, item);
    setEditableSlides(updated);
    setActiveSlideIndex(toIndex);
  };

  const handleResetToDefaults = () => {
    setEditableSlides(INITIAL_HERO_SLIDES);
    setActiveSlideIndex(0);
  };

  const handleSave = () => {
    onSaveSlides(editableSlides);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const navTabOptions: { label: string; value: NavigationTab }[] = [
    { label: 'ޕްރޮގްރާމްތައް (Programs)', value: 'programs' },
    { label: 'ދަރުސް & އިވެންޓްތައް (Events)', value: 'events' },
    { label: 'ވީޑިއޯތައް (Videos & Dhaaris TV)', value: 'videos' },
    { label: 'ވޮލަންޓިއަރ ވުން (Volunteer)', value: 'volunteer' },
    { label: 'އެހީދެއްވުން (Donate)', value: 'donate' },
    { label: 'ޖަމިއްޔާގެ ތަޢާރަފް (About)', value: 'about' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto font-thaana">
      <div 
        className="relative w-full max-w-4xl bg-white text-[#1C2622] rounded-3xl shadow-2xl border border-[#E2E9E5] overflow-hidden my-6 max-h-[92vh] flex flex-col text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#E2E9E5] bg-[#F8FAF9]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-[#E2E9E5] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#B83244] hover:bg-[#FDF1F2] border border-[#F5D5DB] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>އަސްލު 5 ސްލައިޑަށް ބަދަލުކުރައްވާ</span>
            </button>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#1B6B52] font-bold">
              <Sparkles className="w-4 h-4 text-[#1B6B52]" />
              <span>ހީރޯ ސްލައިޑްޝޯ ބެނާ މެނޭޖަރ</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#1C2622]">
              ސްލައިޑް ފޮޓޯތައް އަޕްލޯޑްކޮށް ބަދަލުކުރެއްވުން
            </h3>
          </div>
        </div>

        {/* Modal Body: Split view (Slide Selector on Right, Editor on Left) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Slides List & Thumbnails */}
          <div className="lg:col-span-4 space-y-3 order-2 lg:order-1 border-t lg:border-t-0 lg:border-l border-[#E2E9E5] lg:pl-6 pt-4 lg:pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#556660]">ސްލައިޑްތަކުގެ ލިސްޓް ({editableSlides.length})</span>
              {editableSlides.length < 7 && (
                <button
                  type="button"
                  onClick={handleAddNewSlide}
                  className="flex items-center gap-1 text-xs font-bold text-[#1B6B52] hover:text-[#145541]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>އައު ސްލައިޑެއް</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {editableSlides.map((slide, idx) => {
                const isSelected = idx === activeSlideIndex;
                return (
                  <div
                    key={slide.id || idx}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`group relative p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#EBF5F0] border-[#1B6B52] shadow-xs'
                        : 'bg-[#FAFCFB] border-[#E2E9E5] hover:border-[#C8E0D5]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-12 h-10 rounded-xl overflow-hidden bg-black/10 shrink-0 border border-black/10 relative">
                        <img
                          src={slide.imageUrl}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/gallery%20(1).jpg';
                          }}
                        />
                      </div>
                      <div className="text-right overflow-hidden">
                        <div className="text-xs font-bold text-[#1C2622] truncate max-w-[140px]">
                          {slide.title || `ސްލައިޑް ${idx + 1}`}
                        </div>
                        <div className="text-[10px] text-[#556660] font-mono">
                          Slide 0{idx + 1}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSlide(idx, idx - 1);
                        }}
                        disabled={idx === 0}
                        className="p-1 rounded text-stone-500 hover:text-stone-800 disabled:opacity-30"
                        title="މައްޗަށް"
                      >
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSlide(idx, idx + 1);
                        }}
                        disabled={idx === editableSlides.length - 1}
                        className="p-1 rounded text-stone-500 hover:text-stone-800 disabled:opacity-30"
                        title="ތިރިއަށް"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                      {editableSlides.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSlide(idx);
                          }}
                          className="p-1 rounded text-red-500 hover:text-red-700"
                          title="ޑިލީޓް"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slide Editor Panel */}
          {currentSlide && (
            <div className="lg:col-span-8 space-y-4 order-1 lg:order-2">
              {/* Image Preview & Upload Container */}
              <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C2622]">ފޮޓޯ އަޕްލޯޑް ކުރައްވާ / ލިންކު</span>
                  <span className="text-[11px] text-[#556660]">ސްލައިޑް: {activeSlideIndex + 1} ގެ ފޮޓޯ</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden bg-black/10 border border-[#E2E9E5] shrink-0 shadow-xs">
                    <img
                      src={currentSlide.imageUrl}
                      alt={currentSlide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                      <span className="text-[10px] text-white font-mono">ފެންނަ ގޮތް</span>
                    </div>
                  </div>

                  <div className="w-full space-y-2.5">
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 px-3 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        <span>ޑިވައިސް އިން އައު ފޮޓޯއެއް އަޕްލޯޑް ކުރައްވާ</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-[#556660] block font-mono">ނުވަތަ ފޮޓޯ ޔޫ.އާރް.އެލް (Image URL):</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={currentSlide.imageUrl}
                          onChange={(e) => updateCurrentSlide('imageUrl', e.target.value)}
                          dir="ltr"
                          placeholder="https://... / images/..."
                          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E2E9E5] focus:outline-none focus:border-[#1B6B52] bg-white font-mono"
                        />
                        <ImageIcon className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Badge */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1C2622] block">
                      ބެޖު / ކެޓަގަރީ (Badge Tag):
                    </label>
                    <input
                      type="text"
                      value={currentSlide.badge || ''}
                      onChange={(e) => updateCurrentSlide('badge', e.target.value)}
                      placeholder="މިސާލު: އިސް ޙަރަކާތް"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E9E5] focus:outline-none focus:border-[#1B6B52] bg-white"
                    />
                  </div>

                  {/* Primary CTA Link */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1C2622] block">
                      ފިއްތާލުމުން ދާނެ ޞަފްޙާ (Button Link):
                    </label>
                    <select
                      value={currentSlide.ctaLink || 'programs'}
                      onChange={(e) => updateCurrentSlide('ctaLink', e.target.value as NavigationTab)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E9E5] focus:outline-none focus:border-[#1B6B52] bg-white"
                    >
                      {navTabOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Main Heading */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    ސުރުޚީ (Slide Title):
                  </label>
                  <input
                    type="text"
                    value={currentSlide.title}
                    onChange={(e) => updateCurrentSlide('title', e.target.value)}
                    placeholder="ސްލައިޑްގެ ބޮޑު ސުރުޚީ..."
                    className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-[#E2E9E5] focus:outline-none focus:border-[#1B6B52] bg-white"
                  />
                </div>

                {/* Caption / Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    ކެޕްޝަން / ތަފްޞީލު (Caption & Description):
                  </label>
                  <textarea
                    rows={3}
                    value={currentSlide.caption}
                    onChange={(e) => updateCurrentSlide('caption', e.target.value)}
                    placeholder="ސްލައިޑްގެ ކެޕްޝަން ލިޔުއްވާ..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E9E5] focus:outline-none focus:border-[#1B6B52] bg-white leading-relaxed resize-none"
                  />
                </div>

                {/* Button Labels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1C2622] block">
                      ފުރަތަމަ ފިތުގެ ނަން (Primary Button Text):
                    </label>
                    <input
                      type="text"
                      value={currentSlide.ctaText || ''}
                      onChange={(e) => updateCurrentSlide('ctaText', e.target.value)}
                      placeholder="ޕްރޮގްރާމްތައް ބައްލަވާ"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E2E9E5] focus:outline-none focus:border-[#1B6B52] bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1C2622] block">
                      ދެވަނަ ފިތުގެ ނަން (Secondary Button Text):
                    </label>
                    <input
                      type="text"
                      value={currentSlide.secondaryCtaText || ''}
                      onChange={(e) => updateCurrentSlide('secondaryCtaText', e.target.value)}
                      placeholder="ވޮލަންޓިއަރަކަށް ވެލައްވާ"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E2E9E5] focus:outline-none focus:border-[#1B6B52] bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-t border-[#E2E9E5] bg-[#F8FAF9]">
          <span className="text-xs text-[#556660]">
            ސްލައިޑް ބަދަލުކުރުމަށްފަހު "ސޭވް ކުރައްވާ" އަށް ފިއްތަވާލައްވާ
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              ކެންސަލް
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>ސޭވް ވެއްޖެ!</span>
                </>
              ) : (
                <span>ސޭވް ކުރައްވާ (Save Slides)</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
