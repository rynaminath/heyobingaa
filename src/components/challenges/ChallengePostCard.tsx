import { useState } from 'react';
import { ChallengePost } from '../../types';
import { 
  Copy, 
  Check, 
  Share2, 
  Calendar, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Maximize2
} from 'lucide-react';
import { toggleChallengePostPledge } from '../../services/firestoreService';

interface ChallengePostCardProps {
  post: ChallengePost;
  onOpenLightbox?: (imageUrl: string, title: string) => void;
}

export default function ChallengePostCard({ post, onOpenLightbox }: ChallengePostCardProps) {
  const [copied, setCopied] = useState(false);
  const [pledged, setPledged] = useState(false);
  const [pledgeCount, setPledgeCount] = useState(post.pledgesCount || 0);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Copy commitment text to clipboard
  const handleCopyCommitment = async () => {
    try {
      await navigator.clipboard.writeText(post.commitmentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = post.commitmentText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Toggle personal commitment pledge
  const handleTogglePledge = () => {
    const nextState = !pledged;
    setPledged(nextState);
    setPledgeCount(prev => nextState ? prev + 1 : Math.max(0, prev - 1));
    toggleChallengePostPledge(post.id, nextState);
  };

  // Share post via Web Share API or copy link
  const handleShare = async () => {
    const shareData = {
      title: `${post.title} - 30-Day No Backbiting Challenge`,
      text: `${post.title}\n\n${post.commitmentText}\n\n#30DayNoBackbitingChallenge #HeyoBingaa`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share dismissed
      }
    } else {
      // Fallback copy full post link & text
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

      {/* Grid: Poster Image & Content */}
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

        {/* Right: Ayah / Hadith, Reflection Body, and Commitment */}
        <div className={`${post.imageUrl ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-5`}>
          
          {/* Qur'anic Ayah / Hadith Highlight Box */}
          {post.quote && (
            <div className="rounded-2xl p-5 sm:p-6 bg-[#F8FAF9] border-l-4 border-l-[#1B6B52] border border-[#E2E9E5] space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E2E9E5] pb-2 text-xs">
                <span className="font-bold text-[#1B6B52] inline-flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <BookOpen className="w-4 h-4" />
                  <span>{post.quote.type === 'ayah' ? 'Qur\'an Verse' : post.quote.type === 'hadith' ? 'Hadith' : 'Quote'}</span>
                </span>
                <span className="text-[#556660] font-medium text-xs">
                  {post.quote.reference}
                </span>
              </div>

              {/* Arabic Text if provided */}
              {post.quote.arabic && (
                <div 
                  dir="rtl" 
                  className="text-base sm:text-lg lg:text-xl font-serif text-[#1C2622] leading-loose text-right font-medium pt-1"
                >
                  «{post.quote.arabic}»
                </div>
              )}

              {/* English Translation */}
              <p className="text-xs sm:text-sm text-[#33443E] leading-relaxed italic">
                {post.quote.translation}
              </p>
            </div>
          )}

          {/* Reflection Body Prose (English LTR) */}
          <div className="text-sm sm:text-base text-[#3C4A45] leading-relaxed whitespace-pre-line font-sans space-y-3">
            {post.content}
          </div>

          {/* Reflection Guiding Questions (if present) */}
          {post.reflectionQuestions && post.reflectionQuestions.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <span className="text-xs font-bold text-amber-900 block uppercase tracking-wider">
                Points for Reflection:
              </span>
              <ul className="space-y-1.5 text-xs sm:text-sm text-amber-950 pl-5 list-disc list-outside">
                {post.reflectionQuestions.map((q, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Commitment Box (English LTR) */}
          <div className="rounded-2xl p-5 sm:p-6 bg-[#FAF5F2] border border-[#ECDCD3] space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#ECDCD3] pb-2.5">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8A4A32] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#C26B4A]" />
                <span>Our Daily Commitment</span>
              </div>
              <span className="text-[11px] text-[#8A4A32]/80 font-mono font-bold">#Commitment</span>
            </div>

            {/* Commitment Statement */}
            <blockquote className="text-sm sm:text-base font-semibold text-[#3B251D] leading-relaxed whitespace-pre-line">
              {post.commitmentText}
            </blockquote>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#ECDCD3]">
              
              {/* Pledge Toggle Button */}
              <button
                type="button"
                onClick={handleTogglePledge}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  pledged
                    ? 'bg-[#1B6B52] text-white shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-[#3B251D] border border-[#ECDCD3]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${pledged ? 'fill-white text-white' : 'text-[#C26B4A]'}`} />
                <span>{pledged ? 'I Took This Pledge!' : 'I Commit to This'}</span>
                {pledgeCount > 0 && (
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-black/10">
                    {pledgeCount}
                  </span>
                )}
              </button>

              {/* Copy & Share Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCommitment}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-[#ECDCD3] text-xs font-bold transition-colors cursor-pointer"
                  title="Copy commitment text"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#8A4A32] hover:bg-[#723C28] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  title="Share with sisters"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{shareSuccess ? 'Copied Link!' : 'Share'}</span>
                </button>
              </div>

            </div>
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
