import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Video,
  BookOpen,
  HeartHandshake,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  ExternalLink,
  LogIn,
  LogOut,
  ShieldCheck,
  Database,
  RefreshCw,
  X,
  AlertCircle,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  subscribeToEvents,
  subscribeToMedia,
  subscribeToPrograms,
  subscribeToDonationSlips,
  subscribeToVolunteers,
  saveEventToFirestore,
  deleteEventFromFirestore,
  saveMediaToFirestore,
  deleteMediaFromFirestore,
  saveProgramToFirestore,
  deleteProgramFromFirestore,
  verifyDonationSlipInFirestore,
  deleteDonationSlipInFirestore,
  updateVolunteerStatusInFirestore,
  seedInitialDataToFirestore
} from '../services/firestoreService';
import { EventItem, MediaItem, ProgramItem, DonationSlip, VolunteerApplication } from '../types';
import { NGO_CONTACT } from '../data/initialData';

type AdminTab = 'events' | 'media' | 'programs' | 'slips' | 'volunteers' | 'seeder';

export default function AdminPage() {
  const { user, isAdmin, loading, loginWithGoogle, logout, adminEmail } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('events');

  // Firestore Data states
  const [events, setEvents] = useState<EventItem[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [slips, setSlips] = useState<DonationSlip[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);

  // UI status states
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals
  const [editingEvent, setEditingEvent] = useState<Partial<EventItem> | null>(null);
  const [editingMedia, setEditingMedia] = useState<Partial<MediaItem> | null>(null);
  const [editingProgram, setEditingProgram] = useState<Partial<ProgramItem> | null>(null);
  const [viewingSlip, setViewingSlip] = useState<DonationSlip | null>(null);

  // Subscriptions
  useEffect(() => {
    const unsubEvents = subscribeToEvents(setEvents);
    const unsubMedia = subscribeToMedia(setMediaList);
    const unsubPrograms = subscribeToPrograms(setPrograms);

    let unsubSlips = () => {};
    let unsubVolunteers = () => {};

    if (isAdmin) {
      unsubSlips = subscribeToDonationSlips(setSlips);
      unsubVolunteers = subscribeToVolunteers(setVolunteers);
    }

    return () => {
      unsubEvents();
      unsubMedia();
      unsubPrograms();
      unsubSlips();
      unsubVolunteers();
    };
  }, [isAdmin]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // Seed Initial Data handler
  const handleSeedData = async () => {
    if (!window.confirm('ހުރިހާ އިވެންޓްތަކާއި، ވީޑިއޯތަކާއި، ޕްރޮގްރާމްތަކުގެ ޑޭޓާ ފަޔަރބޭސްއަށް އަޅަން ބޭނުންފުޅުތޯ؟')) {
      return;
    }
    try {
      setActionLoading(true);
      const res = await seedInitialDataToFirestore();
      showNotification(
        'success',
        `ޑޭޓާބޭސް ކާމިޔާބުކަމާއެކު ސީޑްކުރެވިއްޖެ! (${res.eventsCount} އިވެންޓް، ${res.mediaCount} ވީޑިއޯ، ${res.programsCount} ޕްރޮގްރާމް)`
      );
    } catch (err) {
      console.error(err);
      showNotification('error', 'ޑޭޓާ އަޅާއިރު މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Events CRUD ---
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.title || !editingEvent?.speaker || !editingEvent?.venue || !editingEvent?.date) {
      showNotification('error', 'ކޮންމެހެން ފުރަންޖެހޭ ބައިތައް ފުރިހަމަކުރައްވާ');
      return;
    }
    try {
      setActionLoading(true);
      const id = editingEvent.id || `event-${Date.now()}`;
      const payload: EventItem = {
        id,
        title: editingEvent.title || '',
        titleEn: editingEvent.titleEn || '',
        speaker: editingEvent.speaker || '',
        venue: editingEvent.venue || '',
        date: editingEvent.date || '',
        time: editingEvent.time || '',
        dayText: editingEvent.dayText || '',
        audience: editingEvent.audience || '',
        broadcast: editingEvent.broadcast || '',
        description: editingEvent.description || '',
        isFeatured: Boolean(editingEvent.isFeatured),
        status: (editingEvent.status as any) || 'upcoming',
        partnerOrganization: editingEvent.partnerOrganization || ''
      };
      await saveEventToFirestore(payload);
      setEditingEvent(null);
      showNotification('success', 'އިވެންޓް ކާމިޔާބުކަމާއެކު ރައްކާކުރެވިއްޖެ');
    } catch (err) {
      console.error(err);
      showNotification('error', 'އިވެންޓް ރައްކާކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('މި އިވެންޓް ފޮހެލަން ބޭނުންފުޅުތޯ؟')) return;
    try {
      setActionLoading(true);
      await deleteEventFromFirestore(id);
      showNotification('success', 'އިވެންޓް ފޮހެލެވިއްޖެ');
    } catch (err) {
      showNotification('error', 'އިވެންޓް ފޮހެލުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Media CRUD ---
  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia?.title || !editingMedia?.thumbnailUrl || !editingMedia?.category) {
      showNotification('error', 'ކޮންމެހެން ފުރަންޖެހޭ ބައިތައް ފުރިހަމަކުރައްވާ');
      return;
    }
    try {
      setActionLoading(true);
      let embed = editingMedia.videoEmbedUrl || '';
      // Convert YouTube watch URL to embed URL if needed
      if (embed.includes('youtube.com/watch?v=')) {
        const videoId = embed.split('v=')[1]?.split('&')[0];
        if (videoId) embed = `https://www.youtube.com/embed/${videoId}`;
      } else if (embed.includes('youtu.be/')) {
        const videoId = embed.split('youtu.be/')[1]?.split('?')[0];
        if (videoId) embed = `https://www.youtube.com/embed/${videoId}`;
      }

      const id = editingMedia.id || `vid-${Date.now()}`;
      const payload: MediaItem = {
        id,
        title: editingMedia.title || '',
        series: editingMedia.series || '',
        episodeNumber: Number(editingMedia.episodeNumber) || 1,
        duration: editingMedia.duration || '10 މިނެޓު',
        speaker: editingMedia.speaker || 'ހެޔޮބިންގާ ޓީމު',
        interpreter: editingMedia.interpreter || '',
        isDeafAccessible: Boolean(editingMedia.isDeafAccessible),
        partner: editingMedia.partner || 'Heyo Bingaa Official',
        thumbnailUrl: editingMedia.thumbnailUrl || '',
        videoEmbedUrl: embed,
        summary: editingMedia.summary || '',
        category: (editingMedia.category as any) || 'deaf_accessible',
        publishedDate: editingMedia.publishedDate || new Date().toISOString().split('T')[0]
      };
      await saveMediaToFirestore(payload);
      setEditingMedia(null);
      showNotification('success', 'ވީޑިއޯ ކާމިޔާބުކަމާއެކު ރައްކާކުރެވިއްޖެ');
    } catch (err) {
      console.error(err);
      showNotification('error', 'ވީޑިއޯ ރައްކާކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!window.confirm('މި ވީޑިއޯ ފޮހެލަން ބޭނުންފުޅުތޯ؟')) return;
    try {
      setActionLoading(true);
      await deleteMediaFromFirestore(id);
      showNotification('success', 'ވީޑިއޯ ފޮހެލެވިއްޖެ');
    } catch (err) {
      showNotification('error', 'ވީޑިއޯ ފޮހެލުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Programs CRUD ---
  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram?.title || !editingProgram?.category || !editingProgram?.description) {
      showNotification('error', 'ކޮންމެހެން ފުރަންޖެހޭ ބައިތައް ފުރިހަމަކުރައްވާ');
      return;
    }
    try {
      setActionLoading(true);
      const id = editingProgram.id || `prog-${Date.now()}`;
      const payload: ProgramItem = {
        id,
        title: editingProgram.title || '',
        category: (editingProgram.category as any) || 'women',
        categoryLabel: editingProgram.categoryLabel || 'ޕްރޮގްރާމް',
        targetAudience: editingProgram.targetAudience || '',
        format: editingProgram.format || '',
        description: editingProgram.description || '',
        impactMetrics: editingProgram.impactMetrics || '',
        features: editingProgram.features || ['ދީނީ އަދި ނަފްސާނީ ހޭލުންތެރިކަން'],
        imageUrl: editingProgram.imageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
      };
      await saveProgramToFirestore(payload);
      setEditingProgram(null);
      showNotification('success', 'ޕްރޮގްރާމް ކާމިޔާބުކަމާއެކު ރައްކާކުރެވިއްޖެ');
    } catch (err) {
      showNotification('error', 'ޕްރޮގްރާމް ރައްކާކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!window.confirm('މި ޕްރޮގްރާމް ފޮހެލަން ބޭނުންފުޅުތޯ؟')) return;
    try {
      setActionLoading(true);
      await deleteProgramFromFirestore(id);
      showNotification('success', 'ޕްރޮގްރާމް ފޮހެލެވިއްޖެ');
    } catch (err) {
      showNotification('error', 'ޕްރޮގްރާމް ފޮހެލުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Slips Actions ---
  const handleToggleSlipVerify = async (id: string, current: boolean) => {
    try {
      await verifyDonationSlipInFirestore(id, !current);
      showNotification('success', !current ? 'ސްލިޕް ވެރިފައި ކުރެވިއްޖެ' : 'ވެރިފިކޭޝަން ބަދަލުކުރެވިއްޖެ');
    } catch (err) {
      showNotification('error', 'ސްލިޕް އަޕްޑޭޓް ކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    }
  };

  const handleDeleteSlip = async (id: string) => {
    if (!window.confirm('މި ސްލިޕް ފޮހެލަން ބޭނުންފުޅުތޯ؟')) return;
    try {
      await deleteDonationSlipInFirestore(id);
      showNotification('success', 'ސްލިޕް ފޮހެލެވިއްޖެ');
    } catch (err) {
      showNotification('error', 'ސްލިޕް ފޮހެލުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    }
  };

  // --- Volunteer Actions ---
  const handleUpdateVolStatus = async (id: string, status: 'pending' | 'reviewed' | 'contacted') => {
    try {
      await updateVolunteerStatusInFirestore(id, status);
      showNotification('success', 'ސްޓޭޓަސް ބަދަލުކުރެވިއްޖެ');
    } catch (err) {
      showNotification('error', 'ސްޓޭޓަސް ބަދަލުކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ');
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
        <RefreshCw className="w-8 h-8 text-[#1B6B52] animate-spin mb-4" />
        <p className="text-lg font-thaana text-[#556660]">ފަޔަރބޭސް ލޮގިން ޗެކްކުރެވެނީ...</p>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E5ECE8] shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#EBF5F0] text-[#1B6B52] mx-auto flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-thaana text-[#1C2622]">އެޑްމިން ޕޯޓަލް</h1>
            <p className="text-sm font-thaana text-[#556660] mt-2 leading-relaxed">
              މިއީ ހެޔޮބިންގާ ޖަމްޢިއްޔާގެ ވެބްސައިޓްގެ ކޮންޓެންޓާއި ޑޭޓާ ބެލެހެއްޓުމަށް ޚާއްޞަ ޕޯޓަލްއެވެ.
            </p>
          </div>

          <div className="bg-[#FAFCFB] p-4 rounded-2xl border border-[#E5ECE8] text-right text-xs font-thaana text-[#556660] space-y-1">
            <p className="font-bold text-[#1B6B52]">ހުއްދަ ދެވިފައިވާ އެޑްމިން:</p>
            <p className="font-mono text-[13px] dir-ltr text-left text-[#1C2622]">{adminEmail}</p>
          </div>

          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-thaana font-bold text-base shadow-sm hover:shadow active:scale-95 transition-all"
          >
            <LogIn className="w-5 h-5" />
            <span>ގޫގުލް އެކައުންޓުން ވަދެވަޑައިގަންނަވާ</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Authenticated but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E5ECE8] shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-thaana text-[#1C2622]">ހުއްދަ ނެތް އެކައުންޓެއް</h1>
            <p className="text-sm font-thaana text-[#556660] mt-2 leading-relaxed">
              ތިޔަ ލޮގިންވެވަޑައިގެންނެވި އެކައުންޓަކީ ({user.email}) ހެޔޮބިންގާ އެޑްމިން ލިސްޓުގައި ހިމެނޭ އެކައުންޓެއް ނޫނެވެ.
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#FAFCFB] hover:bg-[#EBF5F0] text-[#B83244] border border-[#E5ECE8] font-thaana font-bold text-base transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>އެކައުންޓުން ވަކިވެވަޑައިގަންނަވާ</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. Authorized Admin Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-thaana">
      {/* Top Banner & Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5ECE8] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1B6B52] text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#1C2622]">އެޑްމިން ކޮންޓްރޯލް ޕެނަލް</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF5F0] text-[#1B6B52]">
                <Database className="w-3 h-3" />
                <span>ފަޔަރބޭސް ގުޅިފައި</span>
              </span>
            </div>
            <p className="text-sm text-[#556660] mt-1">
              ލޮގިންވެފައި: <span className="font-mono text-xs text-[#1C2622]">{user.email}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSeedData}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EBF5F0] hover:bg-[#D5EBE1] text-[#1B6B52] font-bold text-sm transition-all"
            title="ވެބްސައިޓްގެ އަސްލު ހުރިހާ ޑޭޓާއެއް ޑޭޓާބޭސްއަށް އަޅާލުން"
          >
            <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
            <span>ޑޭޓާބޭސް ސީޑްކުރުން (Seed)</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#FAFCFB] text-[#B83244] border border-[#E5ECE8] font-bold text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>ވަކިވެވަޑައިގަންނަވާ</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${
            message.type === 'success'
              ? 'bg-[#EBF5F0] text-[#1B6B52] border border-[#A7F3D0]'
              : 'bg-red-50 text-[#B83244] border border-red-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="font-semibold text-sm">{message.text}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-[#E5ECE8]">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2.5 rounded-xl font-bold text-base flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'events'
              ? 'bg-[#1B6B52] text-white shadow-sm'
              : 'text-[#556660] hover:bg-[#EBF5F0] hover:text-[#1B6B52]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>އިވެންޓްތައް ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2.5 rounded-xl font-bold text-base flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'media'
              ? 'bg-[#1B6B52] text-white shadow-sm'
              : 'text-[#556660] hover:bg-[#EBF5F0] hover:text-[#1B6B52]'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>ވީޑިއޯ & މީޑިއާ ({mediaList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('programs')}
          className={`px-4 py-2.5 rounded-xl font-bold text-base flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'programs'
              ? 'bg-[#1B6B52] text-white shadow-sm'
              : 'text-[#556660] hover:bg-[#EBF5F0] hover:text-[#1B6B52]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>ޕްރޮގްރާމްތައް ({programs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('slips')}
          className={`px-4 py-2.5 rounded-xl font-bold text-base flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'slips'
              ? 'bg-[#1B6B52] text-white shadow-sm'
              : 'text-[#556660] hover:bg-[#EBF5F0] hover:text-[#1B6B52]'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>އެހީގެ ސްލިޕްތައް ({slips.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('volunteers')}
          className={`px-4 py-2.5 rounded-xl font-bold text-base flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'volunteers'
              ? 'bg-[#1B6B52] text-white shadow-sm'
              : 'text-[#556660] hover:bg-[#EBF5F0] hover:text-[#1B6B52]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ވޮލަންޓިއަރުން ({volunteers.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: 1. EVENTS */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1C2622]">އިވެންޓްތައް ބެލެހެއްޓެވުން</h2>
            <button
              type="button"
              onClick={() =>
                setEditingEvent({
                  title: '',
                  titleEn: '',
                  speaker: '',
                  venue: '',
                  date: new Date().toISOString().split('T')[0],
                  time: 'ރޭގަނޑު 8:30',
                  dayText: '',
                  audience: 'އާންމުކޮށް ހުރިހާ ފަރާތްތަކަށް',
                  broadcast: '',
                  description: '',
                  isFeatured: false,
                  status: 'upcoming',
                  partnerOrganization: ''
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>އައު އިވެންޓެއް އިތުރުކުރައްވާ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white rounded-2xl p-5 border border-[#E5ECE8] shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-md font-semibold ${
                        ev.status === 'upcoming'
                          ? 'bg-[#EBF5F0] text-[#1B6B52]'
                          : ev.status === 'ongoing'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {ev.status === 'upcoming' ? 'ކުރިއަށް އޮތީ' : ev.status === 'ongoing' ? 'ހިނގަމުންދަނީ' : 'ނިމިފައި'}
                    </span>
                    {ev.isFeatured && (
                      <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">
                        ފީޗާޑް
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-[#1C2622]">{ev.title}</h3>
                  <p className="text-xs text-[#556660]">ވާހަކަދައްކަވަނީ: {ev.speaker}</p>
                  <p className="text-xs text-[#556660]">ތާރީޚު: {ev.date} ({ev.time})</p>
                  <p className="text-xs text-[#556660]">ތަން: {ev.venue}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5ECE8]/60">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(ev)}
                    className="p-2 text-[#1B6B52] hover:bg-[#EBF5F0] rounded-lg transition-colors"
                    title="އިސްލާޙުކުރައްވާ"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="p-2 text-[#B83244] hover:bg-red-50 rounded-lg transition-colors"
                    title="ފޮހެލައްވާ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. MEDIA */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1C2622]">ވީޑިއޯ އަދި ދަރުސްތައް ބެލެހެއްޓެވުން</h2>
            <button
              type="button"
              onClick={() =>
                setEditingMedia({
                  title: '',
                  series: 'ކިތާބުއްޞަލާތު',
                  episodeNumber: 1,
                  duration: '10 މިނެޓު',
                  speaker: 'ހެޔޮބިންގާ ޢިލްމީ ޓީމު',
                  interpreter: 'އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ',
                  isDeafAccessible: true,
                  partner: 'Heyo Bingaa Official',
                  thumbnailUrl: 'https://i.ytimg.com/vi/3Q_Za7OtXNA/hqdefault.jpg',
                  videoEmbedUrl: '',
                  summary: '',
                  category: 'deaf_accessible',
                  publishedDate: new Date().toISOString().split('T')[0]
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>އައު ވީޑިއޯއެއް އިތުރުކުރައްވާ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaList.map((m) => (
              <div key={m.id} className="bg-white rounded-2xl overflow-hidden border border-[#E5ECE8] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video bg-gray-100">
                    <img src={m.thumbnailUrl} alt={m.title} className="w-full h-full object-cover" />
                    {m.isDeafAccessible && (
                      <span className="absolute top-2 right-2 bg-[#1B6B52] text-white text-[11px] px-2 py-0.5 rounded-md font-bold">
                        އިޝާރާތުގެ ބަހުރުވަ
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-1.5">
                    <span className="text-xs text-[#1B6B52] font-semibold">{m.series}</span>
                    <h3 className="font-bold text-base text-[#1C2622] line-clamp-2">{m.title}</h3>
                    <p className="text-xs text-[#556660]">{m.speaker}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 p-3 border-t border-[#E5ECE8]/60 bg-[#FAFCFB]">
                  <button
                    type="button"
                    onClick={() => setEditingMedia(m)}
                    className="p-2 text-[#1B6B52] hover:bg-[#EBF5F0] rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMedia(m.id)}
                    className="p-2 text-[#B83244] hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. PROGRAMS */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1C2622]">ޕްރޮގްރާމްތައް ބެލެހެއްޓެވުން</h2>
            <button
              type="button"
              onClick={() =>
                setEditingProgram({
                  title: '',
                  category: 'women',
                  categoryLabel: 'އުޚުތުންނާއި ކަނބަލުންނަށް',
                  targetAudience: '',
                  format: '',
                  description: '',
                  impactMetrics: '',
                  features: ['އިސްލާމީ ހޭލުންތެރިކަން އިތުރުކުރުން'],
                  imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>އައު ޕްރޮގްރާމެއް އިތުރުކުރައްވާ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((prog) => (
              <div key={prog.id} className="bg-white rounded-2xl p-5 border border-[#E5ECE8] shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-xs bg-[#EBF5F0] text-[#1B6B52] px-2.5 py-0.5 rounded-md font-semibold">
                    {prog.categoryLabel}
                  </span>
                  <h3 className="font-bold text-lg text-[#1C2622]">{prog.title}</h3>
                  <p className="text-xs text-[#556660] line-clamp-3 leading-relaxed">{prog.description}</p>
                  <p className="text-xs text-[#1B6B52] font-semibold">{prog.impactMetrics}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5ECE8]/60">
                  <button
                    type="button"
                    onClick={() => setEditingProgram(prog)}
                    className="p-2 text-[#1B6B52] hover:bg-[#EBF5F0] rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProgram(prog.id)}
                    className="p-2 text-[#B83244] hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. DONATION SLIPS */}
      {activeTab === 'slips' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1C2622]">އެހީގެ ޓްރާންސްފަރ ސްލިޕްތައް</h2>
              <p className="text-xs text-[#556660] mt-1">ސަޕޯޓަރުން ފޮނުވާފައިވާ ޓްރާންސްފަރ ސްލިޕްތައް ޗެކްކޮށް ވެރިފައިކުރައްވާ</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5ECE8] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-[#FAFCFB] border-b border-[#E5ECE8] text-[#556660]">
                  <tr>
                    <th className="py-3 px-4">ތާރީޚު</th>
                    <th className="py-3 px-4">އެހީދިން ފަރާތް</th>
                    <th className="py-3 px-4">ފޯނު ނަންބަރު</th>
                    <th className="py-3 px-4">ޢަދަދު</th>
                    <th className="py-3 px-4">އެކައުންޓް</th>
                    <th className="py-3 px-4">ސްޓޭޓަސް</th>
                    <th className="py-3 px-4 text-left">ޢަމަލުތައް</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5ECE8]/60">
                  {slips.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#556660]">
                        އެއްވެސް ސްލިޕެއް އަދި ލިބިފައެއް ނުވޭ
                      </td>
                    </tr>
                  ) : (
                    slips.map((slip) => (
                      <tr key={slip.id} className="hover:bg-[#FAFCFB]">
                        <td className="py-3 px-4 font-mono text-xs">{slip.date}</td>
                        <td className="py-3 px-4 font-bold">{slip.donorName}</td>
                        <td className="py-3 px-4 font-mono text-xs">{slip.phone}</td>
                        <td className="py-3 px-4 font-bold text-[#1B6B52]">
                          {slip.amount} {slip.currency}
                        </td>
                        <td className="py-3 px-4 text-xs text-[#556660]">{slip.bankAccount}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                              slip.verified ? 'bg-[#EBF5F0] text-[#1B6B52]' : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {slip.verified ? 'ވެރިފައިކުރެވިފައި' : 'ޕެންޑިންގ'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-left">
                          <div className="flex items-center justify-end gap-2">
                            {slip.slipImageUrl && (
                              <button
                                type="button"
                                onClick={() => setViewingSlip(slip)}
                                className="p-1.5 text-[#1B6B52] hover:bg-[#EBF5F0] rounded-lg"
                                title="ސްލިޕް ބައްލަވާ"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleToggleSlipVerify(slip.id, slip.verified)}
                              className={`p-1.5 rounded-lg text-xs font-bold ${
                                slip.verified ? 'text-amber-700 hover:bg-amber-50' : 'text-[#1B6B52] hover:bg-[#EBF5F0]'
                              }`}
                            >
                              {slip.verified ? 'އަންވެރިފައި' : 'ވެރިފައި'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSlip(slip.id)}
                              className="p-1.5 text-[#B83244] hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. VOLUNTEERS */}
      {activeTab === 'volunteers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1C2622]">ވޮލަންޓިއަރުންގެ އެޕްލިކޭޝަންތައް</h2>
              <p className="text-xs text-[#556660] mt-1">ސައިޓުން ފޯމު ފުރައިގެން އައިސްފައިވާ ވޮލަންޓިއަރުންގެ މަޢުލޫމާތު</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5ECE8] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-[#FAFCFB] border-b border-[#E5ECE8] text-[#556660]">
                  <tr>
                    <th className="py-3 px-4">ހުށަހެޅި ތާރީޚު</th>
                    <th className="py-3 px-4">ނަން</th>
                    <th className="py-3 px-4">ފޯނު</th>
                    <th className="py-3 px-4">ރަށް / ސިޓީ</th>
                    <th className="py-3 px-4">ޓްރެކް</th>
                    <th className="py-3 px-4">ވަގުތު</th>
                    <th className="py-3 px-4">ސްޓޭޓަސް</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5ECE8]/60">
                  {volunteers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#556660]">
                        އެއްވެސް އެޕްލިކޭޝަނެއް އަދި ލިބިފައެއް ނުވޭ
                      </td>
                    </tr>
                  ) : (
                    volunteers.map((vol) => (
                      <tr key={vol.id} className="hover:bg-[#FAFCFB]">
                        <td className="py-3 px-4 font-mono text-xs">{vol.submittedAt}</td>
                        <td className="py-3 px-4 font-bold">{vol.name}</td>
                        <td className="py-3 px-4 font-mono text-xs">{vol.phone}</td>
                        <td className="py-3 px-4">{vol.islandCity}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              vol.track === 'sisters' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {vol.track === 'sisters' ? 'އުޚުތުން' : 'އަޚުން'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-[#556660]">{vol.availability}</td>
                        <td className="py-3 px-4">
                          <select
                            value={vol.status}
                            onChange={(e) => handleUpdateVolStatus(vol.id, e.target.value as any)}
                            className="text-xs bg-white border border-[#E5ECE8] rounded-lg p-1.5 font-thaana"
                          >
                            <option value="pending">ޕެންޑިންގ</option>
                            <option value="reviewed">ބެލިފައި</option>
                            <option value="contacted">ގުޅިފައި</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- EVENT EDIT/ADD MODAL --- */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5ECE8] pb-3">
              <h3 className="text-lg font-bold text-[#1C2622]">
                {editingEvent.id ? 'އިވެންޓް އިސްލާޙުކުރައްވާ' : 'އައު އިވެންޓެއް އިތުރުކުރައްވާ'}
              </h3>
              <button onClick={() => setEditingEvent(null)} className="p-1 hover:bg-[#FAFCFB] rounded-lg">
                <X className="w-5 h-5 text-[#556660]" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">އިވެންޓްގެ ނަން *</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#556660] mb-1">ވާހަކަދައްކަވާ ބޭފުޅާ *</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.speaker || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, speaker: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#556660] mb-1">އޮންނަ ތަން *</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.venue || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#556660] mb-1">ތާރީޚު (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={editingEvent.date || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#556660] mb-1">ގަޑި</label>
                  <input
                    type="text"
                    value={editingEvent.time || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none"
                    placeholder="ރޭގަނޑު 8:30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#556660] mb-1">ސްޓޭޓަސް</label>
                  <select
                    value={editingEvent.status || 'upcoming'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none bg-white"
                  >
                    <option value="upcoming">ކުރިއަށް އޮތީ (Upcoming)</option>
                    <option value="ongoing">ހިނގަމުންދަނީ (Ongoing)</option>
                    <option value="completed">ނިމިފައި (Completed)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featEvent"
                    checked={Boolean(editingEvent.isFeatured)}
                    onChange={(e) => setEditingEvent({ ...editingEvent, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-[#1B6B52]"
                  />
                  <label htmlFor="featEvent" className="text-sm font-bold text-[#1C2622]">
                    ހޯމްޕޭޖުގައި ފީޗާކުރޭ
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">ބައިވެރިވާ ޖަމްޢިއްޔާތައް / ޕާޓްނަރުން</label>
                <input
                  type="text"
                  value={editingEvent.partnerOrganization || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, partnerOrganization: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none"
                  placeholder="މިނިސްޓްރީ އޮފް އިސްލާމިކް އެފެއާޒް & ދާރިސް ޓީވީ"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">ތަފްޞީލު</label>
                <textarea
                  rows={3}
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5ECE8]">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5ECE8] text-[#556660] font-bold text-sm"
                >
                  ކެންސަލް
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-sm"
                >
                  ރައްކާކުރައްވާ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MEDIA EDIT/ADD MODAL --- */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5ECE8] pb-3">
              <h3 className="text-lg font-bold text-[#1C2622]">
                {editingMedia.id ? 'ވީޑިއޯ އިސްލާޙުކުރައްވާ' : 'އައު ވީޑިއޯއެއް އިތުރުކުރައްވާ'}
              </h3>
              <button onClick={() => setEditingMedia(null)} className="p-1 hover:bg-[#FAFCFB] rounded-lg">
                <X className="w-5 h-5 text-[#556660]" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">ވީޑިއޯގެ ނަން *</label>
                <input
                  type="text"
                  required
                  value={editingMedia.title || ''}
                  onChange={(e) => setEditingMedia({ ...editingMedia, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#556660] mb-1">ސީރީޒް</label>
                  <input
                    type="text"
                    value={editingMedia.series || ''}
                    onChange={(e) => setEditingMedia({ ...editingMedia, series: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#556660] mb-1">ކެޓަގަރީ *</label>
                  <select
                    value={editingMedia.category || 'deaf_accessible'}
                    onChange={(e) => setEditingMedia({ ...editingMedia, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none bg-white"
                  >
                    <option value="deaf_accessible">އިޝާރާތުގެ ބަހުރުވަ (Deaf Accessible)</option>
                    <option value="dawah">ދަޢުވާ & ދަރުސް (Dawah)</option>
                    <option value="sisters_family">އުޚުތުން & ޢާއިލާ (Family)</option>
                    <option value="kids_youth">ކުޑަކުދިން & ޒުވާނުން (Kids)</option>
                    <option value="ramadan">ރޯދަ މަސް (Ramadan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">ޔޫޓިއުބް ލިންކް (Watch URL or Embed) *</label>
                <input
                  type="text"
                  required
                  value={editingMedia.videoEmbedUrl || ''}
                  onChange={(e) => setEditingMedia({ ...editingMedia, videoEmbedUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none font-mono text-xs"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">ތަމްބްނެއިލް URL *</label>
                <input
                  type="text"
                  required
                  value={editingMedia.thumbnailUrl || ''}
                  onChange={(e) => setEditingMedia({ ...editingMedia, thumbnailUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none font-mono text-xs"
                  placeholder="https://i.ytimg.com/vi/..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="deafAcc"
                  checked={Boolean(editingMedia.isDeafAccessible)}
                  onChange={(e) => setEditingMedia({ ...editingMedia, isDeafAccessible: e.target.checked })}
                  className="w-4 h-4 text-[#1B6B52]"
                />
                <label htmlFor="deafAcc" className="text-sm font-bold text-[#1C2622]">
                  އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ ހިމެނޭ
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5ECE8]">
                <button
                  type="button"
                  onClick={() => setEditingMedia(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5ECE8] text-[#556660] font-bold text-sm"
                >
                  ކެންސަލް
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-sm"
                >
                  ރައްކާކުރައްވާ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PROGRAM EDIT/ADD MODAL --- */}
      {editingProgram && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5ECE8] pb-3">
              <h3 className="text-lg font-bold text-[#1C2622]">
                {editingProgram.id ? 'ޕްރޮގްރާމް އިސްލާޙުކުރައްވާ' : 'އައު ޕްރޮގްރާމެއް އިތުރުކުރައްވާ'}
              </h3>
              <button onClick={() => setEditingProgram(null)} className="p-1 hover:bg-[#FAFCFB] rounded-lg">
                <X className="w-5 h-5 text-[#556660]" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">ޕްރޮގްރާމްގެ ނަން *</label>
                <input
                  type="text"
                  required
                  value={editingProgram.title || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#556660] mb-1">ކެޓަގަރީ</label>
                  <select
                    value={editingProgram.category || 'women'}
                    onChange={(e) => setEditingProgram({ ...editingProgram, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none bg-white"
                  >
                    <option value="women">އުޚުތުންނަށް (women)</option>
                    <option value="toddlers">ތުއްތު ކުދިންނަށް (toddlers)</option>
                    <option value="teenagers">ފުރާވަރުގެ ކުދިންނަށް (teenagers)</option>
                    <option value="audiobooks">އޯޑިއޯ ފޮތްތައް (audiobooks)</option>
                    <option value="lectures">ދަރުސްތައް (lectures)</option>
                    <option value="joint_ngo">ޖޮއިންޓް އޮޕަރޭޝަން (joint_ngo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#556660] mb-1">ކެޓަގަރީ ލޭބަލް (ދިވެހިން)</label>
                  <input
                    type="text"
                    value={editingProgram.categoryLabel || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, categoryLabel: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">ތަފްޞީލު *</label>
                <textarea
                  rows={4}
                  required
                  value={editingProgram.description || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#556660] mb-1">ފޮޓޯ URL</label>
                <input
                  type="text"
                  value={editingProgram.imageUrl || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5ECE8] focus:border-[#1B6B52] outline-none font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5ECE8]">
                <button
                  type="button"
                  onClick={() => setEditingProgram(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5ECE8] text-[#556660] font-bold text-sm"
                >
                  ކެންސަލް
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-sm"
                >
                  ރައްކާކުރައްވާ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW SLIP MODAL --- */}
      {viewingSlip && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5ECE8] pb-3">
              <h3 className="font-bold text-lg text-[#1C2622]">
                އެހީގެ ސްލިޕް ({viewingSlip.amount} {viewingSlip.currency})
              </h3>
              <button onClick={() => setViewingSlip(null)} className="p-1 hover:bg-[#FAFCFB] rounded-lg">
                <X className="w-5 h-5 text-[#556660]" />
              </button>
            </div>
            {viewingSlip.slipImageUrl ? (
              <div className="max-h-[60vh] overflow-auto rounded-xl border border-[#E5ECE8]">
                <img src={viewingSlip.slipImageUrl} alt="Slip" className="w-full object-contain" />
              </div>
            ) : (
              <p className="text-center py-6 text-[#556660]">ފޮޓޯއެއް އަޕްލޯޑްކޮށްފައެއް ނުވޭ</p>
            )}
            <div className="space-y-1 text-xs text-[#556660]">
              <p>އެހީދިން ފަރާތް: <span className="font-bold text-[#1C2622]">{viewingSlip.donorName}</span></p>
              <p>ފޯނު: <span className="font-mono text-[#1C2622]">{viewingSlip.phone}</span></p>
              {viewingSlip.notes && <p>ނޯޓް: {viewingSlip.notes}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
