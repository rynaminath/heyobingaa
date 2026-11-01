import React, { useState, useRef } from 'react';
import { HeroSlide, NavigationTab } from '../../types';
import { INITIAL_HERO_SLIDES } from '../../data/initialData';
import {
  saveHeroSlideToFirestore,
  deleteHeroSlideFromFirestore,
  reorderHeroSlidesInFirestore,
  resetHeroSlidesToDefaultsInFirestore
} from '../../services/firestoreService';
import {
  Plus,
  Trash2,
  Edit2,
  MoveUp,
  MoveDown,
  Upload,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Eye,
  AlertCircle,
  X,
  Layers,
  ArrowLeft
} from 'lucide-react';

interface AdminBannerTabProps {
  slides: HeroSlide[];
  onRefresh?: () => void;
  onNavigateTab?: (tab: NavigationTab) => void;
}

const NAV_TAB_OPTIONS: { label: string; value: NavigationTab }[] = [
  { label: 'ޕްރޮގްރާމްތައް (Programs)', value: 'programs' },
  { label: 'ދަރުސް & އިވެންޓްތައް (Events)', value: 'events' },
  { label: 'ވީޑިއޯތައް (Videos & Dhaaris TV)', value: 'videos' },
  { label: 'ދީނީ ލިޔުންތައް (Articles)', value: 'articles' },
  { label: 'ގެލެރީ (Gallery)', value: 'gallery' },
  { label: 'ވޮލަންޓިއަރ ވުން (Volunteer)', value: 'volunteer' },
  { label: 'އެހީދެއްވުން (Donate & Ehee)', value: 'donate' },
  { label: 'ޖަމިއްޔާގެ ތަޢާރަފް (About)', value: 'about' }
];

export default function AdminBannerTab({ slides, onRefresh }: AdminBannerTabProps) {
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [previewSlide, setPreviewSlide] = useState<HeroSlide | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Client-side image compression using HTML5 Canvas (1280x720 JPEG @ 80%)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showNotification('error', 'ފޮޓޯގެ ސައިޒު 8MB އަށްވުރެ ކުޑަކުރައްވާ');
      return;
    }

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
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setEditingSlide((prev) => (prev ? { ...prev, imageUrl: compressedDataUrl } : null));
          showNotification('success', 'ފޮޓޯ ކާމިޔާބުކަމާއެކު އަޕްލޯޑްކުރެވިއްޖެ');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingSlide({
      id: `slide-${Date.now()}`,
      title: '',
      caption: '',
      badge: 'އާ ޙަރަކާތް',
      imageUrl: '/images/gallery%20(1).jpg',
      ctaText: 'ޕްރޮގްރާމްތައް ބައްލަވާ',
      ctaLink: 'programs',
      secondaryCtaText: 'އިތުރު މަޢުލޫމާތު',
      secondaryCtaLink: 'about',
      order: slides.length + 1,
      status: 'active'
    });
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setIsNew(false);
    setEditingSlide({ ...slide });
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide?.title?.trim() || !editingSlide?.caption?.trim() || !editingSlide?.imageUrl?.trim()) {
      showNotification('error', 'ސުރުޚީ، ކެޕްޝަން އަދި ފޮޓޯ ފުރިހަމަކުރައްވާ');
      return;
    }

    try {
      setLoading(true);
      const slideToSave: HeroSlide = {
        id: editingSlide.id || `slide-${Date.now()}`,
        title: editingSlide.title.trim(),
        caption: editingSlide.caption.trim(),
        badge: editingSlide.badge?.trim() || '',
        imageUrl: editingSlide.imageUrl.trim(),
        ctaText: editingSlide.ctaText?.trim() || 'ޕްރޮގްރާމްތައް ބައްލަވާ',
        ctaLink: editingSlide.ctaLink || 'programs',
        secondaryCtaText: editingSlide.secondaryCtaText?.trim() || '',
        secondaryCtaLink: editingSlide.secondaryCtaLink || 'about',
        order: Number(editingSlide.order ?? slides.length + 1),
        status: editingSlide.status || 'active',
        updatedAt: new Date().toISOString()
      };

      await saveHeroSlideToFirestore(slideToSave);
      showNotification('success', isNew ? 'އައު ސްލައިޑް ކާމިޔާބުކަމާއެކު އިތުރުކުރެވިއްޖެ' : 'ސްލައިޑަށް ގެނައި ބަދަލުތައް ސޭވްކުރެވިއްޖެ');
      setEditingSlide(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error saving slide:', err);
      showNotification('error', 'ސްލައިޑް ސޭވްކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (slides.length <= 1) {
      showNotification('error', 'މަދުވެގެން 1 ސްލައިޑް ބެހެއްޓެވުން ލާޒިމެވެ');
      return;
    }
    if (!window.confirm('މި ސްލައިޑް ޑިލީޓްކޮށްލަން ބޭނުންފުޅުތޯ؟')) return;

    try {
      setLoading(true);
      await deleteHeroSlideFromFirestore(slideId);
      showNotification('success', 'ސްލައިޑް ޑިލީޓްކުރެވިއްޖެ');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error deleting slide:', err);
      showNotification('error', 'ސްލައިޑް ޑިލީޓްކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveSlide = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= slides.length) return;
    const reordered = [...slides];
    const item = reordered.splice(fromIndex, 1)[0];
    reordered.splice(toIndex, 0, item);

    try {
      setLoading(true);
      await reorderHeroSlidesInFirestore(reordered);
      showNotification('success', 'ސްލައިޑްތަކުގެ ތަރުތީބު ބަދަލުކުރެވިއްޖެ');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error reordering slides:', err);
      showNotification('error', 'ތަރުތީބު ބަދަލުކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('އަސްލު 5 ސްލައިޑަށް އަލުން ބަދަލުކޮށްލަން ބޭނުންފުޅުތޯ؟ މިހާރު ހުރި ބަދަލުތައް އައުވާނެއެވެ.')) return;
    try {
      setLoading(true);
      await resetHeroSlidesToDefaultsInFirestore();
      showNotification('success', 'އަސްލު 5 ސްލައިޑް އަލުން އިއާދަކުރެވިއްޖެ');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error resetting slides:', err);
      showNotification('error', 'ސްލައިޑްތައް އިއާދަކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-right font-thaana">
      {/* Tab Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E9E5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1B6B52] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#1B6B52]" />
            <span>ހޯމްޕޭޖް ފީޗަރ ބެނާ މެނޭޖަރ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1C2622] tracking-tight mt-1">
            ފީޗަރ ބެނާގެ ސްލައިޑްތައް ބަދަލުކުރެއްވުން
          </h2>
          <p className="text-xs sm:text-sm text-[#556660] mt-1">
            ހޯމްޕޭޖުގައި ފެންނަ ސިނަމެޓިކް ފީޗަރ ސްލައިޑްތައް އިތުރުކުރައްވާ، ފޮޓޯ ބަދަލުކުރައްވާ، އަދި ތަރުތީބު ކުރައްވާ.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors border border-stone-200 cursor-pointer disabled:opacity-50"
            title="އަސްލު 5 ސްލައިޑް އަނބުރާ ގެންނަވާ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">އަސްލު ސްލައިޑްތަކަށް</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNew}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>އައު ސްލައިޑެއް އިތުރުކުރައްވާ</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-3 ${
            statusMsg.type === 'success'
              ? 'bg-[#EBF5F0] border-[#1B6B52] text-[#145541]'
              : 'bg-[#FDF1F2] border-[#B83244] text-[#9A2434]'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === 'success' ? (
              <Check className="w-4 h-4 text-[#1B6B52]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#B83244]" />
            )}
            <span>{statusMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMsg(null)}
            className="p-1 hover:opacity-70 text-current"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Slides Grid / List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#556660]">
            އެކްޓިވް ސްލައިޑްތައް ({slides.length})
          </span>
          <span className="text-[11px] text-[#556660]">
            ސްލައިޑްތައް ބަދަލުވާ ތަރުތީބު: މަތިން ތިރިއަށް
          </span>
        </div>

        {slides.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E9E5] space-y-3">
            <Layers className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#1C2622]">އެއްވެސް ސްލައިޑެއް ނެތް</h3>
            <p className="text-xs text-[#556660]">ފުރަތަމަ ސްލައިޑް އިތުރުކުރައްވާ ނުވަތަ އަސްލު ސްލައިޑްތައް އިއާދަކުރައްވާ.</p>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-xl bg-[#1B6B52] text-white text-xs font-bold cursor-pointer hover:bg-[#145541]"
            >
              އަސްލު ސްލައިޑްތައް ލޯޑްކުރައްވާ
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {slides.map((slide, index) => {
              const slideBadge = slide.badge || `Slide 0${index + 1}`;
              return (
                <div
                  key={slide.id}
                  className="bg-white rounded-3xl border border-[#E2E9E5] hover:border-[#C8E0D5] p-4 sm:p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                >
                  {/* Left: Thumbnail & Content Details */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 overflow-hidden">
                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-44 aspect-video rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shrink-0 shadow-xs">
                      <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/gallery%20(1).jpg';
                        }}
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-mono font-bold">
                        #{index + 1}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-[#1B6B52] font-bold">
                        <span>{slideBadge}</span>
                        {slide.status === 'archived' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800">
                            އާކައިވް
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-[#1C2622] truncate">
                        {slide.title}
                      </h3>

                      <p className="text-xs text-[#556660] line-clamp-2 leading-relaxed">
                        {slide.caption}
                      </p>

                      <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                        {slide.ctaText && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                            <span>ފިތް 1: {slide.ctaText}</span>
                            <ArrowLeft className="w-3 h-3 text-[#1B6B52]" />
                            <span className="font-mono text-[10px]">({slide.ctaLink || 'programs'})</span>
                          </span>
                        )}
                        {slide.secondaryCtaText && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                            <span>ފިތް 2: {slide.secondaryCtaText}</span>
                            <span className="font-mono text-[10px]">({slide.secondaryCtaLink || 'about'})</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions & Up/Down Ordering */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                    {/* Up / Down Order */}
                    <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(index, index - 1)}
                        disabled={index === 0 || loading}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-white disabled:opacity-30 transition-colors cursor-pointer"
                        title="މައްޗަށް ޖައްސަވާ"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(index, index + 1)}
                        disabled={index === slides.length - 1 || loading}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-white disabled:opacity-30 transition-colors cursor-pointer"
                        title="ތިރިއަށް ޖައްސަވާ"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Preview Live Glass Card */}
                    <button
                      type="button"
                      onClick={() => setPreviewSlide(slide)}
                      className="p-2 rounded-xl text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors cursor-pointer"
                      title="ލައިވް ބެލުމަށް (Live Preview)"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(slide)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EBF5F0] hover:bg-[#D4EDE0] text-[#145541] text-xs font-bold transition-colors border border-[#C8E0D5] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>ބަދަލުކުރައްވާ</span>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(slide.id)}
                      disabled={slides.length <= 1 || loading}
                      className="p-2 rounded-xl text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 disabled:opacity-30 transition-colors cursor-pointer"
                      title="ޑިލީޓް"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit / Create Slide Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E2E9E5] overflow-hidden my-6 max-h-[92vh] flex flex-col text-right font-thaana"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#E2E9E5] bg-[#F8FAF9]">
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-[#E2E9E5]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-right">
                <span className="text-xs text-[#1B6B52] font-bold">
                  {isNew ? 'އައު ސްލައިޑެއް' : 'ސްލައިޑް ބަދަލުކުރެއްވުން'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#1C2622]">
                  {isNew ? 'ހޯމްޕޭޖް ފީޗަރ ބެނާ އަށް ސްލައިޑެއް އިތުރުކުރެއްވުން' : editingSlide.title || 'ސްލައިޑް އެޑިޓް'}
                </h3>
              </div>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveSlide} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* Image Uploader & Preview Box */}
              <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C2622]">ބެނާ ފޮޓޯ (16:9 Aspect Ratio)</span>
                  <span className="text-[11px] text-[#556660]">އޮޓޯ-ކޮމްޕްރެސް ވާނެ</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden bg-black/10 border border-[#E2E9E5] shrink-0">
                    <img
                      src={editingSlide.imageUrl || '/images/gallery%20(1).jpg'}
                      alt={editingSlide.title || 'Preview'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/gallery%20(1).jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                      <span className="text-[10px] text-white font-mono">ފޮޓޯ ފެންނަ ގޮތް</span>
                    </div>
                  </div>

                  <div className="w-full space-y-2.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>ޑިވައިސް އިން އައު ފޮޓޯއެއް އަޕްލޯޑް ކުރައްވާ</span>
                    </button>

                    <div className="space-y-1">
                      <label className="text-[11px] text-[#556660] block font-mono">ނުވަތަ ފޮޓޯ ޔޫ.އާރް.އެލް (URL / Path):</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editingSlide.imageUrl || ''}
                          onChange={(e) => setEditingSlide((prev) => prev ? { ...prev, imageUrl: e.target.value } : null)}
                          dir="ltr"
                          placeholder="/images/gallery (1).jpg ނުވަތަ https://..."
                          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E2E9E5] focus:outline-none focus:border-[#1B6B52] bg-white font-mono"
                        />
                        <ImageIcon className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    ސުރުޚީ (Slide Title) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.title || ''}
                    onChange={(e) => setEditingSlide((prev) => prev ? { ...prev, title: e.target.value } : null)}
                    placeholder="މިސާލު: އިސްލާމީ ހޭލުންތެރިކަމާއި އޯގާތެރި މުޖުތަމަޢެއް"
                    className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-[#E2E9E5] focus:outline-none focus:border-[#1B6B52] bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    ބެޖް / ޓެގް (Badge Tag)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.badge || ''}
                    onChange={(e) => setEditingSlide((prev) => prev ? { ...prev, badge: e.target.value } : null)}
                    placeholder="މިސާލު: އިސް ޙަރަކާތް"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E9E5] focus:outline-none focus:border-[#1B6B52] bg-white"
                  />
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1C2622] block">
                  ކެޕްޝަން / ތަފްޞީލު (Caption) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingSlide.caption || ''}
                  onChange={(e) => setEditingSlide((prev) => prev ? { ...prev, caption: e.target.value } : null)}
                  placeholder="ސްލައިޑްގެ ތަފްޞީލީ ލިޔުން މިތަނަށް ލިޔުއްވާ..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E9E5] focus:outline-none focus:border-[#1B6B52] bg-white leading-relaxed resize-none"
                />
              </div>

              {/* CTA 1 (Primary) */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <span className="text-xs font-bold text-[#1C2622] block">
                  ފުރަތަމަ ފިތް (Primary Action Button)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#556660] block">ފިތުގައި ލިޔާނެ ބަސް:</label>
                    <input
                      type="text"
                      value={editingSlide.ctaText || ''}
                      onChange={(e) => setEditingSlide((prev) => prev ? { ...prev, ctaText: e.target.value } : null)}
                      placeholder="ޕްރޮގްރާމްތައް ބައްލަވާ"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E2E9E5] bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#556660] block">ފިއްތާލުމުން ދާނެ ޞަފްޙާ:</label>
                    <select
                      value={editingSlide.ctaLink || 'programs'}
                      onChange={(e) => setEditingSlide((prev) => prev ? { ...prev, ctaLink: e.target.value as NavigationTab } : null)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E2E9E5] bg-white"
                    >
                      {NAV_TAB_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* CTA 2 (Secondary) */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <span className="text-xs font-bold text-[#1C2622] block">
                  ދެވަނަ ފިތް (Secondary Action Button - އިޚްތިޔާރީ)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#556660] block">ފިތުގައި ލިޔާނެ ބަސް:</label>
                    <input
                      type="text"
                      value={editingSlide.secondaryCtaText || ''}
                      onChange={(e) => setEditingSlide((prev) => prev ? { ...prev, secondaryCtaText: e.target.value } : null)}
                      placeholder="އިތުރު މަޢުލޫމާތު"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E2E9E5] bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#556660] block">ފިއްތާލުމުން ދާނެ ޞަފްޙާ:</label>
                    <select
                      value={editingSlide.secondaryCtaLink || 'about'}
                      onChange={(e) => setEditingSlide((prev) => prev ? { ...prev, secondaryCtaLink: e.target.value as NavigationTab } : null)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E2E9E5] bg-white"
                    >
                      {NAV_TAB_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Status & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1C2622] block">ޙާލަތު (Status):</label>
                  <select
                    value={editingSlide.status || 'active'}
                    onChange={(e) => setEditingSlide((prev) => prev ? { ...prev, status: e.target.value as 'active' | 'archived' } : null)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E9E5] bg-white"
                  >
                    <option value="active">އެކްޓިވް (ހޯމްޕޭޖުގައި ދައްކާ)</option>
                    <option value="archived">އާކައިވް (ވަގުތީގޮތުން ފޮރުވާފައި)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1C2622] block">ތަރުތީބު ނަންބަރު (Order Index):</label>
                  <input
                    type="number"
                    min={1}
                    value={editingSlide.order ?? 1}
                    onChange={(e) => setEditingSlide((prev) => prev ? { ...prev, order: Number(e.target.value) } : null)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E2E9E5] bg-white font-mono"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#E2E9E5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  ކެންސަލް
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>{isNew ? 'ސްލައިޑް އިތުރުކުރައްވާ' : 'ބަދަލުތައް ސޭވްކުރައްވާ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Glass Overlay Preview Modal */}
      {previewSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div
            className="relative w-full max-w-4xl bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 text-right font-thaana"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 sm:p-4 bg-black/60 flex items-center justify-between border-b border-white/10 text-white">
              <button
                type="button"
                onClick={() => setPreviewSlide(null)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-xs font-bold text-[#A7F3D0]">
                <Eye className="w-4 h-4" />
                <span>ހޯމްޕޭޖުގައި މި ސްލައިޑް ފެންނާނެ ގޮތް (Live Preview)</span>
              </div>
            </div>

            {/* Simulated Banner Container */}
            <div className="relative w-full h-[380px] sm:h-[420px] overflow-hidden">
              <img
                src={previewSlide.imageUrl}
                alt={previewSlide.title}
                className="w-full h-full object-cover"
              />
              {/* Simulated Glass Overlay Card (No dark gradient overlay over image) */}
              <div className="absolute inset-0 flex items-end sm:items-center justify-end p-5 sm:p-8">
                <div className="max-w-xl p-5 sm:p-7 rounded-3xl bg-black/25 backdrop-blur-md border border-white/25 text-white space-y-3.5 shadow-xl">
                  {previewSlide.badge && (
                    <div className="text-xs text-[#A7F3D0] font-bold drop-shadow-sm">
                      {previewSlide.badge}
                    </div>
                  )}

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    {previewSlide.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed line-clamp-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                    {previewSlide.caption}
                  </p>

                  <div className="pt-2 flex items-center gap-3">
                    {previewSlide.ctaText && (
                      <span className="px-4 py-2 rounded-xl bg-[#1B6B52] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md">
                        <span>{previewSlide.ctaText}</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {previewSlide.secondaryCtaText && (
                      <span className="px-4 py-2 rounded-xl bg-white/15 text-white text-xs font-bold border border-white/25">
                        {previewSlide.secondaryCtaText}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
