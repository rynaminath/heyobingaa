import { useState } from 'react';
import { X, Play, Share2, Eye, Calendar, UserCheck, ExternalLink } from 'lucide-react';
import { MediaItem } from '../types';

interface VideoPlayerModalProps {
  media: MediaItem | null;
  onClose: () => void;
}

export default function VideoPlayerModal({ media, onClose }: VideoPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  const [copiedLink, setCopiedLink] = useState(false);

  if (!media) return null;

  const youtubeWatchUrl = media.id === 'media-1' || media.videoEmbedUrl?.includes('3Q_Za7OtXNA')
    ? 'https://www.youtube.com/watch?v=3Q_Za7OtXNA'
    : 'https://www.youtube.com/@heyobingaa';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: media.title,
          text: `${media.title} - ހެޔޮބިންގާ & ދާރިސް ޓީވީ`,
          url: youtubeWatchUrl,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(youtubeWatchUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#171514] text-slate-100 rounded-3xl shadow-2xl border border-stone-800 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-stone-800 bg-[#141211]">
          <div className="text-right">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1B6B52]/30 text-[#A7F3D0] border border-[#1B6B52]/50 font-thaana">
                {media.partner}
              </span>
              {media.isDeafAccessible && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#255D96]/30 text-[#CFE2F5] border border-[#255D96]/50 font-thaana flex items-center gap-1 font-bold">
                  <span>އިޝާރާތުގެ ބަހުރުވަ (Sign Language)</span>
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-thaana mt-1 line-clamp-1">
              {media.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Responsive Video Container */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {isPlaying && media.videoEmbedUrl ? (
            <iframe
              src={`${media.videoEmbedUrl}?autoplay=1&rel=0`}
              title={media.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={media.thumbnailUrl}
                alt={media.title}
                className="w-full h-full object-cover opacity-80"
              />
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#B83244] hover:bg-[#9A2434] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
              >
                <Play className="w-8 h-8 fill-current translate-x-0.5" />
              </button>
            </div>
          )}
        </div>

        {/* Video Information & Actions */}
        <div className="p-5 sm:p-6 space-y-4 text-right font-thaana bg-[#1A1817]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
            <div className="flex items-center gap-4 text-xs text-stone-300">
              <span className="flex items-center gap-1 font-mono" dir="ltr">
                <Eye className="w-3.5 h-3.5 text-[#A7F3D0]" />
                <span>{media.viewsCount || '4.8k'}</span>
              </span>
              <span className="flex items-center gap-1 font-mono" dir="ltr">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{media.publishedDate}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-xs font-mono" dir="ltr">
                {media.duration}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={youtubeWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#CC0000] hover:bg-[#B30000] text-white font-thaana text-xs font-bold transition-all shadow-xs"
              >
                <span>ޔޫޓިއުބުން ބައްލަވާ</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-thaana text-xs transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'ލިންކް ކޮޕީ ވެއްޖެ!' : 'ޙިއްޞާ'}</span>
              </button>
            </div>
          </div>

          {media.interpreter && (
            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <UserCheck className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                <span>އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ: <strong className="text-white">{media.interpreter}</strong></span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#1B6B52]/40 text-[#EBF5F0] border border-[#1B6B52]/50">
                އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ ފަރާތްތަކަށް ޚާއްޞަ
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-stone-400">ޕްރޮގްރާމްގެ ޚުލާޞާ:</h4>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {media.summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
