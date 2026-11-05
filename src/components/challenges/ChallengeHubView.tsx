import { useState, useEffect } from 'react';
import { Challenge, ChallengePost, NavigationTab } from '../../types';
import { 
  subscribeToChallenges, 
  subscribeToChallengePosts 
} from '../../services/firestoreService';
import { INITIAL_CHALLENGES, INITIAL_CHALLENGE_POSTS } from '../../data/initialData';
import ChallengePostCard from './ChallengePostCard';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Flame, 
  Filter, 
  Layers, 
  X,
  Maximize2,
  CheckCircle2
} from 'lucide-react';

interface ChallengeHubViewProps {
  onNavigate?: (tab: NavigationTab) => void;
  selectedChallengeId?: string;
  isEmbedded?: boolean;
}

export default function ChallengeHubView({ 
  onNavigate, 
  selectedChallengeId, 
  isEmbedded = false 
}: ChallengeHubViewProps) {
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [activeChallengeId, setActiveChallengeId] = useState<string>(
    selectedChallengeId || INITIAL_CHALLENGES[0]?.id || '30-day-no-backbiting'
  );
  const [posts, setPosts] = useState<ChallengePost[]>(INITIAL_CHALLENGE_POSTS);
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  
  // Lightbox Modal State
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; imageUrl: string; title: string }>({
    isOpen: false,
    imageUrl: '',
    title: ''
  });

  // Subscribe to Challenges
  useEffect(() => {
    const unsubChallenges = subscribeToChallenges((data) => {
      if (data && data.length > 0) {
        setChallenges(data);
      } else {
        setChallenges(INITIAL_CHALLENGES);
      }
    });

    const unsubPosts = subscribeToChallengePosts((data) => {
      if (data && data.length > 0) {
        setPosts(data);
      } else {
        setPosts(INITIAL_CHALLENGE_POSTS);
      }
    });

    return () => {
      unsubChallenges();
      unsubPosts();
    };
  }, []);

  const activeChallenge = challenges.find((c) => c.id === activeChallengeId) || challenges[0] || INITIAL_CHALLENGES[0];
  
  // Filter posts belonging to active challenge, sorted by week and post order
  const challengePosts = posts
    .filter((p) => (p.challengeId === activeChallenge?.id || p.challengeId === 'no-backbiting-30' || p.challengeId === '30-day-no-backbiting') && p.isPublished !== false)
    .sort((a, b) => {
      if (a.weekNumber !== b.weekNumber) return a.weekNumber - b.weekNumber;
      return a.postNumber - b.postNumber;
    });

  const filteredPosts = selectedWeek === 'all' 
    ? challengePosts 
    : challengePosts.filter((p) => p.weekNumber === selectedWeek);

  // Derive available weeks for filter
  const availableWeeks = Array.from(new Set(challengePosts.map((p) => p.weekNumber))).sort((a, b) => a - b);

  const handleOpenLightbox = (imageUrl: string, title: string) => {
    setLightbox({ isOpen: true, imageUrl, title });
  };

  const handleCloseLightbox = () => {
    setLightbox({ isOpen: false, imageUrl: '', title: '' });
  };

  return (
    <div className={`space-y-8 ${isEmbedded ? '' : 'py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
      
      {/* 1. Optional Breadcrumb Navigation (only when standalone) */}
      {!isEmbedded && (
        <div className="flex items-center justify-between gap-4 font-thaana">
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('programs') : window.history.back()}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1B6B52] hover:text-[#145541] bg-white px-4 py-2 rounded-xl border border-[#E2E9E5] hover:border-[#1B6B52]/40 shadow-2xs transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>ޕްރޮގްރާމްތަކުގެ ޞަފްޙާއަށް އެނބުރިވަޑައިގަންނަވާ</span>
          </button>
        </div>
      )}

      {/* Multiple Campaigns Switcher (shown when multiple programs exist) */}
      {challenges.length > 1 && (
        <div className="flex flex-wrap items-center gap-2.5" dir="ltr">
          <span className="text-xs font-bold text-[#556660] font-sans">Active Campaigns:</span>
          {challenges.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveChallengeId(c.id);
                setSelectedWeek('all');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer font-sans ${
                activeChallengeId === c.id
                  ? 'bg-[#1B6B52] text-white shadow-xs'
                  : 'bg-white hover:bg-stone-50 text-[#1C2622] border border-[#E2E9E5]'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      )}

      {/* 2. Challenge Hero Banner with Islamic Aesthetic */}
      {activeChallenge && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#124b3b] via-[#1B6B52] to-[#0f3d30] text-white p-6 sm:p-10 lg:p-12 border border-[#145541] shadow-xl">
          
          {/* Subtle Islamic Motif Ambient Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 space-y-6 max-w-4xl">
            {/* Top Badges (Bilingual) */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-[#A7F3D0] text-xs font-bold font-sans">
                <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
                <span>Sisters' Community Initiative</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-bold font-sans">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>30-Day Program</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium font-sans">
                <Clock className="w-3.5 h-3.5 text-[#A7F3D0]" />
                <span>Twice Weekly · Mondays & Thursdays</span>
              </span>
            </div>

            {/* Main Program Title (English LTR) */}
            <div className="space-y-2 text-left" dir="ltr">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug font-sans text-white">
                30-Day No Backbiting Challenge
              </h1>
              <p className="text-base sm:text-lg text-emerald-100 font-medium font-sans">
                Guarding our tongues, purifying our hearts, and seeking the pleasure of Allah ﷻ
              </p>
            </div>

            {/* Dhivehi Intro Explanation (Requested: intro can be there in Dhivehi) */}
            <div className="p-5 rounded-2xl bg-black/25 border border-white/15 text-right font-thaana space-y-2.5" dir="rtl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A7F3D0]">
                <CheckCircle2 className="w-4 h-4 text-[#A7F3D0]" />
                <span>ޗެލެންޖްގެ މައިގަނޑު މަޤްޞަދު:</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-100 leading-relaxed">
                މިއީ އެކަކު އަނެކަކަށް ފާޑުކިޔައި ޙުކުމް ކުރުމުގެ ޗެލެންޖެއް ނޫނެވެ. މިއީ އަޅުގަނޑުމެންގެ އަމިއްލަ ނަފްސު އިޞްލާޙުކޮށް، މާތް ﷲ ގެ ފުއްސެވުމަށް އެދި، އުޚްތުންގެ ޢިއްޒަތާއި އަބުރު ރައްކާތެރިކުރުމުގެ މަތިވެރި ޢަޒުމެކެވެ. މަޤްޞަދަކީ ހަމައެކަނި އެއް މަސްދުވަހަށް ޣީބަ ބުނުން ހުއްޓާލުމެއް ނޫނެވެ. އަދި ކިއެއްތަ، އެކަކު އަނެކެއްގެ އަބުރު ރައްކާތެރިކުރުމާއި، ދެބައޮޑުވުމުން ދުރުހެލިވެ، ދުލުން ބުނާ ބަސްތަކަށް ސަމާލުވުމުގެ ދާއިމީ ހެޔޮ އާދައެއް އަށަގެންނެވުމެވެ.
              </p>
            </div>

            {/* Key Schedule Information Strip */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs sm:text-sm font-sans" dir="ltr">
              <div className="flex items-center gap-2.5 bg-black/20 p-3 rounded-2xl border border-white/10 text-left">
                <Calendar className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                <div>
                  <span className="text-stone-300 block text-[11px] uppercase tracking-wider">Start Date:</span>
                  <span className="font-bold text-white">Monday, 2 November 2026</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-black/20 p-3 rounded-2xl border border-white/10 text-left">
                <Clock className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                <div>
                  <span className="text-stone-300 block text-[11px] uppercase tracking-wider">Posting Schedule:</span>
                  <span className="font-bold text-white">Every Monday & Thursday</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-black/20 p-3 rounded-2xl border border-white/10 text-left">
                <Layers className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                <div>
                  <span className="text-stone-300 block text-[11px] uppercase tracking-wider">Published Posts:</span>
                  <span className="font-bold text-white">{challengePosts.length} Posts</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Filter Navigation: English LTR week filters */}
      {availableWeeks.length > 1 && (
        <div 
          dir="ltr"
          className="bg-white rounded-2xl p-4 border border-[#E2E9E5] shadow-xs flex flex-wrap items-center justify-between gap-3 text-left font-sans"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#556660]">
            <Filter className="w-4 h-4 text-[#1B6B52]" />
            <span>Browse by Week:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedWeek('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedWeek === 'all'
                  ? 'bg-[#1B6B52] text-white shadow-xs'
                  : 'bg-[#F8FAF9] hover:bg-[#EBF5F0] text-[#33443E] border border-[#E2E9E5]'
              }`}
            >
              All Posts ({challengePosts.length})
            </button>

            {availableWeeks.map((week) => {
              const weekPostsCount = challengePosts.filter((p) => p.weekNumber === week).length;
              return (
                <button
                  key={week}
                  type="button"
                  onClick={() => setSelectedWeek(week)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedWeek === week
                      ? 'bg-[#1B6B52] text-white shadow-xs'
                      : 'bg-[#F8FAF9] hover:bg-[#EBF5F0] text-[#33443E] border border-[#E2E9E5]'
                  }`}
                >
                  Week {week} ({weekPostsCount})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Timeline / Feed of Challenge Posts (English LTR) */}
      <section className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E2E9E5] space-y-3 font-sans" dir="ltr">
            <p className="text-base text-[#556660]">No challenge posts published for this selection yet.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <ChallengePostCard 
              key={post.id} 
              post={post} 
              onOpenLightbox={handleOpenLightbox} 
            />
          ))
        )}
      </section>

      {/* 5. Lightbox Modal for Full Image Expansion */}
      {lightbox.isOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={handleCloseLightbox}
        >
          <div 
            className="relative max-w-3xl max-h-[90vh] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Close Bar */}
            <div className="w-full flex items-center justify-between px-5 py-3.5 bg-black/50 text-white border-b border-white/10 font-sans" dir="ltr">
              <span className="text-sm font-bold truncate pr-4">{lightbox.title}</span>
              <button
                type="button"
                onClick={handleCloseLightbox}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Expanded Image */}
            <div className="p-3 overflow-auto max-h-[calc(90vh-70px)] flex items-center justify-center">
              <img
                src={lightbox.imageUrl}
                alt={lightbox.title}
                className="max-h-[80vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
