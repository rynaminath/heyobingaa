import { X, Play, Share2, Eye, Calendar, UserCheck } from 'lucide-react';
import { MediaItem } from '../types';

interface VideoPlayerModalProps {
  media: MediaItem | null;
  onClose: () => void;
}

export default function VideoPlayerModal({ media, onClose }: VideoPlayerModalProps) {
  if (!media) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: media.title,
          text: `${media.title} - ހެޔޮބިންގާ & ދާރެސް ޓީވީ`,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('ލިންކް ކޮޕީ ކުރެވިއްޖެ!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 bg-[#171514]">
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#8B2E34]/30 text-[#F9EDED] border border-[#8B2E34]/40 font-thaana">
                {media.partner}
              </span>
              {media.isDeafAccessible && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/40 font-thaana flex items-center gap-1 font-bold">
                  <span>އިޝާރާތުގެ ބަހުރުވަ (Sign Language)</span>
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-thaana mt-1">
              {media.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#292523] hover:bg-[#3D3734] text-[#D8D2C7] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Simulation / Player Container */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
          <img
            src={media.thumbnailUrl}
            alt={media.title}
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          />

          {/* Player controls overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171514] via-transparent to-transparent flex flex-col justify-between p-6">
            <div className="flex justify-end">
              <span className="text-xs font-mono bg-black/70 px-2.5 py-1 rounded text-slate-200">
                {media.duration}
              </span>
            </div>

            {/* Play Button & Center Indicator */}
            <div className="self-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#8B2E34] hover:bg-[#702328] text-white flex items-center justify-center shadow-xl shadow-black/60 ring-4 ring-[#F27D26]/40 hover:scale-110 active:scale-95 transition-all cursor-pointer">
                <Play className="w-8 h-8 fill-current translate-x-0.5" />
              </div>
              <span className="text-xs sm:text-sm font-thaana bg-black/60 px-3 py-1 rounded-full text-slate-200">
                ދާރެސް ޓީވީ އަދި ހެޔޮބިންގާ ޕްރޮޑަކްޝަން
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-mono">
                  <Eye className="w-3.5 h-3.5 text-[#F27D26]" />
                  <span>{media.viewsCount || '2.5k'} ބެލުންތެރިން</span>
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#BDB7AB]" />
                  <span>{media.publishedDate}</span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-thaana transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>ޙިއްޞާކުރައްވާ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Information & Accessibility metadata */}
        <div className="p-6 space-y-4 text-right font-thaana bg-[#1F1C1B]">
          {media.interpreter && (
            <div className="p-3 rounded-2xl bg-[#292523] border border-[#3D3734] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#D8D2C7]">
                <UserCheck className="w-4 h-4 text-[#F27D26]" />
                <span>އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ: <strong className="text-white">{media.interpreter}</strong></span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#8B2E34]/40 text-[#F9EDED] border border-[#8B2E34]/50">
                ބީރު މުޖުތަމަޢަށް ޚާއްޞަ
              </span>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-200">ޕްރޮގްރާމްގެ ޚުލާޞާ:</h4>
            <p className="text-xs sm:text-sm text-[#BDB7AB] leading-relaxed">
              {media.summary}
            </p>
          </div>

          <div className="pt-3 border-t border-[#38332F] flex flex-wrap items-center justify-between gap-3 text-xs text-[#BDB7AB]">
            <div>
              <span>ޕާޓްނަރ: </span>
              <strong className="text-white">{media.partner}</strong>
            </div>
            <div>
              <span>ސިލްސިލާ: </span>
              <strong className="text-white">{media.series}</strong>
            </div>
            {media.speaker && (
              <div>
                <span>ބައިވެރިވެވަޑައިގަތީ: </span>
                <strong className="text-white">{media.speaker}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
