import { useState } from 'react';
import { ChallengePost } from '../../types';
import { 
  Copy, 
  Check, 
  Share2, 
  Calendar, 
  Sparkles, 
  Maximize2
} from 'lucide-react';

interface ChallengePostCardProps {
  post: ChallengePost;
  onOpenLightbox?: (imageUrl: string, title: string) => void;
}

export default function ChallengePostCard({ post, onOpenLightbox }: ChallengePostCardProps) {
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Copy full post text to clipboard
  const handleCopyPostText = async () => {
    const textToCopy = `${post.title}\n\n${post.content}\n\n${(post.hashtags || []).join(' ')}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Share post via Web Share API or copy link
  const handleShare = async () => {
    const shareData = {
      title: `${post.title} - 30-Day No Backbiting Challenge`,
      text: `${post.title}\n\n${post.content}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      } catch (err) {
        console.warn('Share copy error:', err);
      }
    }
  };

  return (
    <article 
      dir="ltr"
      className="bg-white rounded-3xl border border-[#E2E9E5] hover:border-[#C8E0D5] p-5 sm:p-8 lg:p-9 shadow-xs transition-all space-y-6 text-left font-sans"
    >
      {/* Top Header: Week / Post Milestone & Date (English LTR) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E9E5] pb-4">
        {/* Milestone Indicator */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5F0] border border-[#C8E0D5] text-[#145541] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#1B6B52]" />
            <span>Week {post.weekNumber} · Post {post.postNumber}</span>
          </div>
        </div>

        {/* Date & Day of week */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#556660]">
          <Calendar className="w-4 h-4 text-[#1B6B52]" />
          <span className="font-medium">{post.dayOfWeek}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="font-mono text-xs text-[#556660]">{post.publishDate}</span>
        </div>
      </div>

      {/* Main Post Title (English LTR) */}
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1C2622] tracking-tight leading-tight">
          {post.title}
        </h3>
      </div>

      {/* Grid: Poster Image & Accompanying Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left: Poster Graphic with click-to-expand */}
        {post.imageUrl && (
          <div className="lg:col-span-5 space-y-2">
            <div 
              onClick={() => onOpenLightbox && onOpenLightbox(post.imageUrl!, post.title)}
              className="relative group rounded-2xl overflow-hidden border border-[#E2E9E5] shadow-sm bg-stone-50 cursor-pointer aspect-[3/4] max-h-[460px] mx-auto"
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-500"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/gallery%20(1).jpg';
                }}
              />
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-xs text-xs font-bold text-stone-900 shadow-md">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Click to Enlarge Poster</span>
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#556660] text-center">
              Click poster to view in full size
            </p>
          </div>
        )}

        {/* Right: Accompanying Post Content Body */}
        <div className={`${post.imageUrl ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-5`}>
          
          {/* Post Content (English LTR) */}
          <div className="text-sm sm:text-base text-[#2C3833] leading-relaxed whitespace-pre-line font-sans">
            {post.content}
          </div>

          {/* Action Bar & Sharing */}
          <div className="pt-4 border-t border-[#E2E9E5] flex flex-wrap items-center justify-between gap-3">
            
            {/* Copy Post Text Button */}
            <button
              type="button"
              onClick={handleCopyPostText}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F8FAF9] hover:bg-[#EBF5F0] text-[#145541] border border-[#C8E0D5] text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Copy post text to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#1B6B52]" />
                  <span>Copy Post Text</span>
                </>
              )}
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              title="Share this challenge post"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareSuccess ? 'Link Copied!' : 'Share Post'}</span>
            </button>

          </div>

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#1B6B52] font-mono">
              {post.hashtags.map((tag, idx) => (
                <span key={idx} className="hover:underline cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          )}

        </div>
      </div>
    </article>
  );
}
