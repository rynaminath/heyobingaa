import React, { useState, useRef } from 'react';
import { Challenge, ChallengePost } from '../../types';
import { 
  saveChallengePostToFirestore, 
  deleteChallengePostFromFirestore,
  saveChallengeToFirestore,
  deleteChallengeFromFirestore
} from '../../services/firestoreService';
import { INITIAL_CHALLENGES, INITIAL_CHALLENGE_POSTS } from '../../data/initialData';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Calendar, 
  Clock, 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  X, 
  Check, 
  Layers, 
  Eye,
  CheckCircle,
  AlertCircle,
  FolderPlus,
  Settings,
  ChevronDown
} from 'lucide-react';

interface AdminChallengesTabProps {
  challenges: Challenge[];
  posts: ChallengePost[];
  onRefresh?: () => void;
}

export default function AdminChallengesTab({
  challenges,
  posts,
  onRefresh
}: AdminChallengesTabProps) {
  const activeChallenges = challenges.length > 0 ? challenges : INITIAL_CHALLENGES;
  const activePosts = posts.length > 0 ? posts : INITIAL_CHALLENGE_POSTS;

  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    activeChallenges[0]?.id || '30-day-no-backbiting'
  );

  // Modals state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<ChallengePost> | null>(null);

  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Partial<Challenge> | null>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3500);
  };

  const currentChallenge = activeChallenges.find((c) => c.id === selectedChallengeId) || activeChallenges[0];

  const currentPosts = activePosts
    .filter((p) => (p.challengeId === currentChallenge?.id || (currentChallenge?.id === '30-day-no-backbiting' && p.challengeId === 'no-backbiting-30')))
    .sort((a, b) => {
      if (a.weekNumber !== b.weekNumber) return a.weekNumber - b.weekNumber;
      return a.postNumber - b.postNumber;
    });

  // Handle image upload from computer (resizes nicely for web performance)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'ހަމައެކަނި ފޮޓޯ ފައިލް (JPG, PNG, WebP) އަޕްލޯޑްކުރެއްވޭނެއެވެ.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setEditingPost((prev) => ({
            ...prev,
            imageUrl: compressedDataUrl
          }));
          showToast('success', 'ޕޯސްޓަރ ފޮޓޯ ކާމިޔާބުކަމާއެކު ނެގިއްޖެ');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Open modal to add a brand new program / challenge in the future
  const handleOpenAddProgram = () => {
    setEditingProgram({
      id: `challenge-${Date.now()}`,
      slug: `new-challenge-${activeChallenges.length + 1}`,
      title: '',
      titleEn: '',
      tagline: '',
      targetAudience: "Sisters' Community Initiative",
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      durationDays: 30,
      scheduleText: 'Weekly twice: Mondays & Thursdays',
      scheduleDays: ['monday', 'thursday'],
      status: 'active',
      postsCount: 0,
      order: activeChallenges.length + 1
    });
    setIsProgramModalOpen(true);
  };

  // Open modal to edit existing program
  const handleOpenEditProgram = (challenge: Challenge) => {
    setEditingProgram({ ...challenge });
    setIsProgramModalOpen(true);
  };

  // Save Challenge Program
  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram || !editingProgram.title) {
      showToast('error', 'ޕްރޮގްރާމްގެ ނަން / ސުރުޚީ ލިޔުއްވުން ލާޒިމެވެ.');
      return;
    }

    try {
      setIsSaving(true);
      const programId = editingProgram.id || `challenge-${Date.now()}`;
      const slug = editingProgram.slug || programId.toLowerCase().replace(/[^a-z0-9]/g, '-');

      const programToSave: Challenge = {
        id: programId,
        slug: slug,
        title: editingProgram.title,
        titleEn: editingProgram.titleEn || editingProgram.title,
        tagline: editingProgram.tagline || '',
        targetAudience: editingProgram.targetAudience || "Sisters' Community Initiative",
        description: editingProgram.description || '',
        startDate: editingProgram.startDate || new Date().toISOString().split('T')[0],
        durationDays: Number(editingProgram.durationDays) || 30,
        scheduleText: editingProgram.scheduleText || 'Weekly twice: Mondays & Thursdays',
        scheduleDays: editingProgram.scheduleDays || ['monday', 'thursday'],
        bannerImage: editingProgram.bannerImage || '',
        status: (editingProgram.status as 'active' | 'upcoming' | 'completed') || 'active',
        postsCount: editingProgram.postsCount || currentPosts.length,
        order: Number(editingProgram.order) || activeChallenges.length + 1,
        updatedAt: new Date().toISOString()
      };

      await saveChallengeToFirestore(programToSave);
      setSelectedChallengeId(programId);
      showToast('success', 'ޕްރޮގްރާމް ކާމިޔާބުކަމާއެކު ރައްކާކުރެވިއްޖެ!');
      setIsProgramModalOpen(false);
      setEditingProgram(null);
      onRefresh?.();
    } catch {
      showToast('error', 'ޕްރޮގްރާމް ރައްކާކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Challenge Program
  const handleDeleteProgram = async (challengeId: string) => {
    if (!window.confirm('މި ޕްރޮގްރާމާއި މީގެ ހުރިހާ ޕޯސްޓްތައް ފޮހެލަން ބޭނުންފުޅުތޯ؟')) return;
    try {
      setIsSaving(true);
      await deleteChallengeFromFirestore(challengeId);
      showToast('success', 'ޕްރޮގްރާމް ފޮހެލެވިއްޖެ');
      const remaining = activeChallenges.filter((c) => c.id !== challengeId);
      if (remaining.length > 0) {
        setSelectedChallengeId(remaining[0].id);
      }
      onRefresh?.();
    } catch {
      showToast('error', 'ޕްރޮގްރާމް ފޮހެލުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setIsSaving(false);
    }
  };

  // Open Add Post Modal with intelligent defaults for next post
  const handleOpenAddPost = () => {
    const nextPostNumber = currentPosts.length + 1;
    const nextWeekNumber = Math.ceil(nextPostNumber / 2) || 1;
    const isOdd = nextPostNumber % 2 !== 0;

    setEditingPost({
      challengeId: currentChallenge?.id || '30-day-no-backbiting',
      title: `${currentChallenge?.title || '30-DAY CHALLENGE'} - POST ${nextPostNumber}`,
      weekNumber: nextWeekNumber,
      postNumber: nextPostNumber,
      dayOfWeek: isOdd ? 'Monday' : 'Thursday',
      publishDate: new Date().toISOString().split('T')[0],
      content: '',
      hashtags: [`#${currentChallenge?.title?.replace(/[^a-zA-Z0-9]/g, '') || 'Challenge'}`, '#HeyoBingaa'],
      isPublished: true,
      order: nextPostNumber
    });
    setIsPostModalOpen(true);
  };

  const handleEditPost = (post: ChallengePost) => {
    setEditingPost({ ...post });
    setIsPostModalOpen(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('މި ޕޯސްޓް ފޮހެލަން ބޭނުންފުޅުތޯ؟')) return;
    try {
      setIsSaving(true);
      await deleteChallengePostFromFirestore(postId);
      showToast('success', 'ޕޯސްޓް ފޮހެލެވިއްޖެ');
      onRefresh?.();
    } catch {
      showToast('error', 'ޕޯސްޓް ފޮހެލުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title) {
      showToast('error', 'ސުރުޚީ ލިޔުއްވުން ލާޒިމެވެ.');
      return;
    }

    try {
      setIsSaving(true);
      const postToSave: ChallengePost = {
        id: editingPost.id || `post-${Date.now()}`,
        challengeId: editingPost.challengeId || currentChallenge.id,
        weekNumber: Number(editingPost.weekNumber) || 1,
        postNumber: Number(editingPost.postNumber) || 1,
        dayOfWeek: editingPost.dayOfWeek || 'Monday',
        publishDate: editingPost.publishDate || new Date().toISOString().split('T')[0],
        title: editingPost.title,
        imageUrl: editingPost.imageUrl || '',
        content: editingPost.content || '',
        hashtags: editingPost.hashtags || ['#30DayNoBackbitingChallenge', '#HeyoBingaa'],
        isPublished: editingPost.isPublished !== false,
        order: Number(editingPost.order || editingPost.postNumber || 1)
      };

      await saveChallengePostToFirestore(postToSave);
      showToast('success', 'ޗެލެންޖް ޕޯސްޓް ކާމިޔާބުކަމާއެކު ރައްކާކުރެވިއްޖެ!');
      setIsPostModalOpen(false);
      setEditingPost(null);
      onRefresh?.();
    } catch {
      showToast('error', 'ޕޯސްޓް ރައްކާކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-thaana text-right">
      
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${
            notification.type === 'success'
              ? 'bg-[#EBF5F0] text-[#1B6B52] border border-[#A7F3D0]'
              : 'bg-red-50 text-[#B83244] border border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="font-semibold text-sm">{notification.text}</span>
        </div>
      )}

      {/* TOP BAR: Programs Selector & Add Program Button */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E9E5] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1B6B52]">
              <Sparkles className="w-4 h-4 text-[#1B6B52]" />
              <span>ޗެލެންޖް & ކެމްޕޭން ޕްރޮގްރާމްތައް މެނޭޖްކުރުން</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1C2622] mt-0.5">
              ޕްރޮގްރާމް އިޚްތިޔާރުކުރައްވާ ނުވަތަ އައު ޕްރޮގްރާމެއް އިތުރުކުރައްވާ
            </h3>
            <p className="text-xs text-[#556660]">
              މުސްތަޤްބަލުގައި ހިންގޭ އިތުރު ކެމްޕޭންތަކާއި ޕްރޮގްރާމްތައް މިތަނުން އިތުރުކުރައްވައި ޕޯސްޓްތައް އަޅުއްވާ.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddProgram}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer shrink-0 self-start md:self-auto"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ އައު ޕްރޮގްރާމެއް އިތުރުކުރައްވާ</span>
          </button>
        </div>

        {/* Challenge Programs Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar pt-2 border-t border-[#E2E9E5]">
          {activeChallenges.map((prog) => {
            const isSelected = prog.id === currentChallenge?.id;
            const progPosts = activePosts.filter((p) => p.challengeId === prog.id);
            return (
              <button
                key={prog.id}
                type="button"
                onClick={() => setSelectedChallengeId(prog.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1B6B52] text-white shadow-sm'
                    : 'bg-[#F8FAF9] hover:bg-[#EBF5F0] text-[#1C2622] border border-[#E2E9E5]'
                }`}
              >
                <span>{prog.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                }`}>
                  {progPosts.length} ޕޯސްޓް
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED PROGRAM OVERVIEW & POSTS MANAGEMENT */}
      {currentChallenge && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E9E5] shadow-xs space-y-6">
          
          {/* Header of Selected Program */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E2E9E5] pb-6">
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#EBF5F0] text-[#145541] font-bold text-xs border border-[#C8E0D5]">
                  {currentChallenge.targetAudience || 'އުޚްތުންގެ ޚާއްޞަ ޕްރޮގްރާމް'}
                </span>
                <span className="text-xs text-[#556660]">
                  {currentChallenge.scheduleText || 'Weekly twice: Mondays & Thursdays'}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                  ID: {currentChallenge.id}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#1C2622]">
                {currentChallenge.title}
              </h2>

              {currentChallenge.tagline && (
                <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                  {currentChallenge.tagline}
                </p>
              )}

              {currentChallenge.description && (
                <p className="text-xs text-[#556660] line-clamp-2 max-w-3xl">
                  {currentChallenge.description}
                </p>
              )}
            </div>

            {/* Actions for Current Program */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => handleOpenEditProgram(currentChallenge)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1C2622] text-xs font-bold transition-all cursor-pointer"
                title="ޕްރޮގްރާމް އިޞްލާޙުކުރައްވާ"
              >
                <Settings className="w-3.5 h-3.5 text-[#1B6B52]" />
                <span>ޕްރޮގްރާމް އިޞްލާޙު</span>
              </button>

              {activeChallenges.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteProgram(currentChallenge.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#B83244] text-xs font-bold transition-all cursor-pointer"
                  title="މި ޕްރޮގްރާމް ފޮހެލައްވާ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ފޮހެލައްވާ</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleOpenAddPost}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ މިއަށް އައު ޕޯސްޓެއް އިތުރުކުރައްވާ</span>
              </button>
            </div>
          </div>

          {/* Program Stats Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] space-y-1">
              <span className="text-[11px] text-[#556660] block">މި ޕްރޮގްރާމްގެ ޕޯސްޓްތައް</span>
              <span className="text-xl font-mono font-bold text-[#1C2622]">{currentPosts.length}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] space-y-1">
              <span className="text-[11px] text-[#556660] block">ތާވަލު</span>
              <span className="text-xs sm:text-sm font-bold text-[#1B6B52]">{currentChallenge.scheduleText || 'Weekly twice'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] space-y-1">
              <span className="text-[11px] text-[#556660] block">ފެށުނު ތާރީޚު</span>
              <span className="text-xs font-mono font-bold text-[#1C2622]">{currentChallenge.startDate || '2026-11-02'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] space-y-1">
              <span className="text-[11px] text-[#556660] block">މުއްދަތު</span>
              <span className="text-sm font-bold text-[#D97706]">{currentChallenge.durationDays || 30} ދުވަސް</span>
            </div>
          </div>

          {/* List of Challenge Posts for Selected Program */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1C2622]">
                ޝާއިޢުކުރެވިފައިވާ ޕޯސްޓްތައް ({currentPosts.length})
              </h3>
              <button
                type="button"
                onClick={handleOpenAddPost}
                className="text-xs text-[#1B6B52] hover:underline font-bold inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>އައު ޕޯސްޓެއް އިތުރުކުރައްވާ</span>
              </button>
            </div>

            {currentPosts.length === 0 ? (
              <div className="bg-stone-50 rounded-3xl p-10 text-center border border-[#E2E9E5] space-y-3">
                <p className="text-sm text-[#556660]">މި ޕްރޮގްރާމަށް އަދި އެއްވެސް ޕޯސްޓެއް އިތުރުކުރެވިފައެއް ނުވެއެވެ.</p>
                <button
                  type="button"
                  onClick={handleOpenAddPost}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B6B52] text-white text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ފުރަތަމަ ޕޯސްޓް އިތުރުކުރައްވާ</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {currentPosts.map((post) => (
                  <div 
                    key={post.id}
                    className="bg-white rounded-2xl p-5 border border-[#E2E9E5] hover:border-[#1B6B52]/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                  >
                    {/* Right/Info: Poster thumbnail + details */}
                    <div className="flex items-start gap-4">
                      {post.imageUrl ? (
                        <img 
                          src={post.imageUrl} 
                          alt={post.title}
                          className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl border border-[#E2E9E5] shrink-0 bg-stone-100"
                        />
                      ) : (
                        <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl border border-[#E2E9E5] bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2 font-sans" dir="ltr">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EBF5F0] text-[#145541] font-bold text-xs">
                            Week {post.weekNumber} · Post {post.postNumber}
                          </span>
                          <span className="text-xs text-[#556660] flex items-center gap-1 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-[#1B6B52]" />
                            <span>{post.dayOfWeek} ({post.publishDate})</span>
                          </span>
                          {post.isPublished ? (
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                              Published
                            </span>
                          ) : (
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 font-medium">
                              Draft
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-base text-[#1C2622] font-sans text-left" dir="ltr">
                          {post.title}
                        </h4>

                        {post.content && (
                          <p className="text-xs text-[#556660] line-clamp-2 font-sans text-left leading-relaxed" dir="ltr">
                            {post.content}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditPost(post)}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-[#EBF5F0] text-stone-700 hover:text-[#1B6B52] transition-colors cursor-pointer"
                        title="އިޞްލާޙުކުރައްވާ"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-[#B83244] transition-colors cursor-pointer"
                        title="ފޮހެލައްވާ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT CHALLENGE PROGRAM */}
      {isProgramModalOpen && editingProgram && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 border border-[#E2E9E5] shadow-2xl text-right font-thaana space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2E9E5] pb-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#1C2622]">
                  {editingProgram.id && activeChallenges.some(c => c.id === editingProgram.id) 
                    ? 'ޕްރޮގްރާމް / ޗެލެންޖް އިޞްލާޙުކުރެއްވުން' 
                    : 'އައު ޕްރޮގްރާމެއް / ޗެލެންޖެއް އިތުރުކުރެއްވުން'}
                </h3>
                <p className="text-xs text-[#556660]">
                  މުސްތަޤްބަލުގައި ހިންގޭ ދީނީ، ތަރުބަވީ އަދި ޚާއްޞަ ކެމްޕޭންތަކުގެ މަޢުލޫމާތު
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProgramModalOpen(false)}
                className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4">
              {/* Row 1: Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1C2622] block">
                  ޕްރޮގްރާމްގެ ނަން (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={editingProgram.title || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                  placeholder="e.g. 30-Day Morning Adhkar Challenge"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E9E5] text-sm focus:border-[#1B6B52] outline-hidden"
                />
              </div>

              {/* Row 2: Tagline / Subtitle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1C2622] block">
                  ޓެގްލައިން / ޝިޢާރު (Tagline)
                </label>
                <input
                  type="text"
                  value={editingProgram.tagline || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, tagline: e.target.value })}
                  placeholder="e.g. Start each day with remembrance of Allah"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E9E5] text-sm focus:border-[#1B6B52] outline-hidden"
                />
              </div>

              {/* Row 3: Target Audience & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    އަމާޒުކުރެވޭ ފަރާތް (Target Audience)
                  </label>
                  <input
                    type="text"
                    value={editingProgram.targetAudience || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, targetAudience: e.target.value })}
                    placeholder="e.g. Sisters' Community Initiative"
                    className="w-full px-4 py-2 rounded-xl border border-[#E2E9E5] text-xs focus:border-[#1B6B52] outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    މުއްދަތު ދުވަހުން (Duration in Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={editingProgram.durationDays || 30}
                    onChange={(e) => setEditingProgram({ ...editingProgram, durationDays: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-[#E2E9E5] text-xs font-mono focus:border-[#1B6B52] outline-hidden"
                  />
                </div>
              </div>

              {/* Row 4: Start Date & Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    ފެށޭ ތާރީޚު (Start Date)
                  </label>
                  <input
                    type="date"
                    value={editingProgram.startDate || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, startDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-[#E2E9E5] text-xs font-mono focus:border-[#1B6B52] outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    ޕޯސްޓްކުރެވޭ ތާވަލު (Schedule Description)
                  </label>
                  <input
                    type="text"
                    value={editingProgram.scheduleText || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, scheduleText: e.target.value })}
                    placeholder="Weekly twice: Mondays & Thursdays"
                    className="w-full px-4 py-2 rounded-xl border border-[#E2E9E5] text-xs focus:border-[#1B6B52] outline-hidden"
                  />
                </div>
              </div>

              {/* Row 5: Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1C2622] block">
                  ޕްރޮގްރާމްގެ ތަޢާރަފް / މަޤްޞަދު (Description)
                </label>
                <textarea
                  rows={4}
                  value={editingProgram.description || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                  placeholder="ދިވެހި ބަހުން ނުވަތަ އިނގިރޭސި ބަހުން ތަޢާރަފް ލިޔުއްވާ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E9E5] text-xs sm:text-sm leading-relaxed focus:border-[#1B6B52] outline-hidden"
                />
              </div>

              {/* Row 6: Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1C2622] block">
                  ޙާލަތު (Status)
                </label>
                <select
                  value={editingProgram.status || 'active'}
                  onChange={(e) => setEditingProgram({ ...editingProgram, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs focus:border-[#1B6B52] outline-hidden bg-white"
                >
                  <option value="active">މިހާރު ހިނގަމުންދާ (Active)</option>
                  <option value="upcoming">ކުރިއަށް އޮތް (Upcoming)</option>
                  <option value="completed">ނިމިފައިވާ (Completed)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E2E9E5] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsProgramModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E2E9E5] hover:bg-stone-50 text-[#556660] text-xs font-bold transition-colors cursor-pointer"
                >
                  ކެންސަލް
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-60"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'ރައްކާކުރެވެނީ...' : 'ޕްރޮގްރާމް ރައްކާކުރައްވާ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT CHALLENGE POST */}
      {isPostModalOpen && editingPost && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 border border-[#E2E9E5] shadow-2xl text-right font-thaana space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2E9E5] pb-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#1C2622]">
                  {editingPost.id ? 'ޕޯސްޓް އިޞްލާޙުކުރެއްވުން' : 'އައު ޕޯސްޓެއް އިތުރުކުރެއްވުން'}
                </h3>
                <p className="text-xs text-[#556660]">
                  {currentChallenge?.title} ގެ ޕޯސްޓް ތަފްޞީލުތައް
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-5">
              
              {/* Program Association */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1C2622] block">
                  މި ޕޯސްޓް ގުޅުވާ ޕްރޮގްރާމް (Program / Challenge) *
                </label>
                <select
                  value={editingPost.challengeId || currentChallenge.id}
                  onChange={(e) => setEditingPost({ ...editingPost, challengeId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E9E5] text-xs font-bold focus:border-[#1B6B52] outline-hidden bg-white"
                >
                  {activeChallenges.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title (English LTR) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1C2622] block">
                  ޕޯސްޓްގެ ސުރުޚީ (Title in English) *
                </label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  placeholder="30-DAY NO BACKBITING CHALLENGE"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E9E5] text-sm font-sans text-left focus:border-[#1B6B52] outline-hidden"
                />
              </div>

              {/* Week, Post Number, Day of week, Publish Date */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    ހަފްތާ ނަންބަރު (Week)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editingPost.weekNumber || 1}
                    onChange={(e) => setEditingPost({ ...editingPost, weekNumber: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-[#E2E9E5] text-sm font-mono focus:border-[#1B6B52] outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    ޕޯސްޓް ނަންބަރު (Post #)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={editingPost.postNumber || 1}
                    onChange={(e) => setEditingPost({ ...editingPost, postNumber: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-[#E2E9E5] text-sm font-mono focus:border-[#1B6B52] outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    ދުވަސް (Day of Week)
                  </label>
                  <select
                    value={editingPost.dayOfWeek || 'Monday'}
                    onChange={(e) => setEditingPost({ ...editingPost, dayOfWeek: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs font-sans focus:border-[#1B6B52] outline-hidden bg-white text-left"
                    dir="ltr"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    ތާރީޚު (Date)
                  </label>
                  <input
                    type="date"
                    value={editingPost.publishDate || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, publishDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs font-mono focus:border-[#1B6B52] outline-hidden"
                  />
                </div>
              </div>

              {/* Poster Graphic Image */}
              <div className="space-y-2 p-4 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5]">
                <label className="text-xs font-bold text-[#1C2622] flex items-center justify-between">
                  <span>ޕޯސްޓަރ ފޮޓޯ (Graphic Poster)</span>
                  <span className="text-[11px] font-normal text-[#556660]">JPG, PNG, ނުވަތަ URL</span>
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#E2E9E5] text-xs font-bold text-[#1C2622] shadow-2xs transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-[#1B6B52]" />
                    <span>ކޮމްޕިއުޓަރުން ފޮޓޯ ނަންގަވާ</span>
                  </button>

                  <span className="text-xs text-[#556660]">ނުވަތަ ލިންކު:</span>

                  <input
                    type="text"
                    placeholder="/src/images/nobackbite1.jpg ނުވަތަ https://..."
                    value={editingPost.imageUrl || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, imageUrl: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs font-sans text-left dir-ltr focus:border-[#1B6B52] outline-hidden bg-white"
                  />
                </div>

                {editingPost.imageUrl && (
                  <div className="pt-2 flex items-center gap-3">
                    <img
                      src={editingPost.imageUrl}
                      alt="Preview"
                      className="w-16 h-20 object-contain rounded-lg border border-[#E2E9E5] bg-white"
                    />
                    <div className="text-xs text-[#556660] space-y-1">
                      <span className="font-bold text-emerald-700 block">ފޮޓޯ ފެންނަމުންދަނީ ކާމިޔާބުކޮށް!</span>
                      <button
                        type="button"
                        onClick={() => setEditingPost({ ...editingPost, imageUrl: '' })}
                        className="text-[11px] text-red-600 hover:underline"
                      >
                        ފޮޓޯ ވަކިކުރައްވާ
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Accompanying Post Content Text Body (English LTR) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1C2622] block">
                  ޕޯސްޓްގެ ލިޔުން (Post Text / Caption in English) *
                </label>
                <textarea
                  required
                  rows={10}
                  dir="ltr"
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="Assalamu Alaikum wa Rahmatullahi wa Barakatuh, dear sisters! 🤍..."
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E9E5] text-xs sm:text-sm font-sans text-left leading-relaxed focus:border-[#1B6B52] outline-hidden"
                />
                <p className="text-[11px] text-[#556660]">
                  މުޅި ޕޯސްޓްގެ ލިޔުން (އާޔަތްތަކާއި، ނަޞޭޙަތާއި، ޢަޒުމާއި ހޭޝްޓެގް ހިމެނޭހެން) މިތަނުގައި ލިޔުއްވާ ނުވަތަ ޕޭސްޓްކުރައްވާ.
                </p>
              </div>

              {/* Hashtags & Publish Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    ހޭޝްޓެގްތައް (Hashtags)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={(editingPost.hashtags || []).join(', ')}
                    onChange={(e) => setEditingPost({
                      ...editingPost,
                      hashtags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="#30DayNoBackbitingChallenge, #HeyoBingaa"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs font-mono text-left focus:border-[#1B6B52] outline-hidden"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E2E9E5] bg-[#F8FAF9] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPost.isPublished !== false}
                      onChange={(e) => setEditingPost({ ...editingPost, isPublished: e.target.checked })}
                      className="w-4 h-4 text-[#1B6B52] rounded-md focus:ring-0"
                    />
                    <span className="text-xs font-bold text-[#1C2622]">ވެބްސައިޓުގައި ވަގުތުން ޝާއިޢުކުރައްވާ (Published)</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E2E9E5] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E2E9E5] hover:bg-stone-50 text-[#556660] text-xs font-bold transition-colors cursor-pointer"
                >
                  ކެންސަލް
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-60"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'ރައްކާކުރެވެނީ...' : 'ރައްކާކުރައްވާ'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
