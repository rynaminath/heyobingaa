import { useState, useEffect } from 'react';
import { NavigationTab, MediaItem, EventItem, ProgramItem } from './types';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { subscribeToEvents, subscribeToMedia, subscribeToPrograms } from './services/firestoreService';
import { INITIAL_MEDIA } from './data/initialData';

import Header from './components/Header';
import Footer from './components/Footer';
import DonationReceiptModal from './components/DonationReceiptModal';
import VideoPlayerModal from './components/VideoPlayerModal';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MediaArchivePage from './pages/MediaArchivePage';
import GalleryPage from './pages/GalleryPage';
import ProgramsPage from './pages/ProgramsPage';
import EventsPage from './pages/EventsPage';
import VolunteerPage from './pages/VolunteerPage';
import DonatePage from './pages/DonatePage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [activeMediaModal, setActiveMediaModal] = useState<MediaItem | null>(null);

  // Pure Firestore real-time state driven by database with complete initial channel media
  const [events, setEvents] = useState<EventItem[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);

  // Live Firebase Subscriptions
  useEffect(() => {
    const unsubEvents = subscribeToEvents((data) => {
      setEvents(data || []);
    });
    const unsubMedia = subscribeToMedia((data) => {
      if (data && data.length >= INITIAL_MEDIA.length) {
        setMediaList(data);
      } else if (data && data.length > 0) {
        const ids = new Set(data.map((d) => d.id));
        const combined = [...data, ...INITIAL_MEDIA.filter((m) => !ids.has(m.id))];
        setMediaList(combined);
      } else {
        setMediaList(INITIAL_MEDIA);
      }
    });
    const unsubPrograms = subscribeToPrograms((data) => {
      setPrograms(data || []);
    });

    return () => {
      unsubEvents();
      unsubMedia();
      unsubPrograms();
    };
  }, []);

  // Dynamic Meta Tag Generator for Tab-Based Discoverability & SEO
  useEffect(() => {
    const tabMetaConfig: Record<NavigationTab, { title: string; description: string }> = {
      home: {
        title: 'Heyo Bingaa NGO | Official Portal (ހެޔޮބިންގާ)',
        description: 'ހެޔޮބިންގާ - ދިވެހިރާއްޖޭގައި އިސްލާމީ ދަޢުވަތާއި، އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ ކުދިންނާއި ފަރާތްތަކަށް އިޝާރާތުގެ ބަހުރުވައިން ދީނީ ހޭލުންތެރިކަން ފޯރުކޮށްދިނުމުގައި ޙަރަކާތްތެރިވާ އުޚުތުންގެ ޖަމްޢިއްޔާ.'
      },
      programs: {
        title: 'Programs | Heyo Bingaa NGO',
        description: 'ހެޔޮބިންގާގެ މައިގަނޑު ދީނީ އަދި ތަރުބަވީ ޕްރޮގްރާމްތައް: އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ ކުދިންނަށް ދީނީ ތަޢުލީމު، ޢާއިލީ ދަރުސްތައް، އޯޑިއޯ ފޮތްތައް އަދި ދަޢުވާ ވަޞީލަތްތައް.'
      },
      about: {
        title: 'About Us | Heyo Bingaa NGO',
        description: 'ހެޔޮބިންގާ ޖަމްޢިއްޔާގެ ތާރީޚު، ތަޞައްވުރު، މަޤްޞަދު އަދި ދީނީ ޚިދުމަތްތައް.'
      },
      videos: {
        title: 'Videos | Heyo Bingaa NGO',
        description: 'ހެޔޮބިންގާގެ ޔޫޓިއުބް ވީޑިއޯތަކާއި، ދާރިސް ޓީވީއާ ގުޅިގެން ތައްޔާރުކުރެވިފައިވާ އިޝާރާތުގެ ބަހުރުވައިގެ ދަރުސްތައް.'
      },
      media: {
        title: 'Videos & Media | Heyo Bingaa NGO',
        description: 'ދާރިސް ޓީވީއާއި ގުޅިގެން ތައްޔާރުކުރެވިފައިވާ އިޝާރާތުގެ ބަހުރުވައިގެ ވީޑިއޯތަކާއި ހެޔޮބިންގާގެ މީޑިއާ އާކައިވް.'
      },
      gallery: {
        title: 'Photo Gallery | Heyo Bingaa NGO',
        description: 'ހެޔޮބިންގާ ޖަމްޢިއްޔާގެ ދީނީ އަދި އިޖުތިމާޢީ ޙަރަކާތްތަކުގެ ފޮޓޯ ގެލެރީ އަދި ސްލައިޑްޝޯ.'
      },
      events: {
        title: 'Events & Campaigns | Heyo Bingaa NGO',
        description: 'ހެޔޮބިންގާއިން ރާވާ ހިންގާ ކުރިއަށް ހުރި ޙަރަކާތްތަކާއި ދީނީ އިވެންޓްތައް.'
      },
      volunteer: {
        title: 'Volunteer | Heyo Bingaa NGO',
        description: 'ހެޔޮބިންގާގެ އިސްލާމީ އަދި އިޖުތިމާޢީ ޚިދުމަތްތަކުގައި ވޮލަންޓިއަރެއްގެ ގޮތުގައި ބައިވެރިވެވަޑައިގަންނަވާ.'
      },
      donate: {
        title: 'Donate & Ehee | Heyo Bingaa NGO',
        description: 'ހެޔޮބިންގާގެ ދީނީ މަސައްކަތްތަކަށް މާލީ އެހީތެރިކަން ފޯރުކޮށްދެއްވާ. ބޭންކް އެކައުންޓްތަކާއި ވައިބަރ ސްލިޕް ހޮޓްލައިން.'
      },
      admin: {
        title: 'Admin Portal | Heyo Bingaa NGO',
        description: 'ހެޔޮބިންގާ ޖަމްޢިއްޔާގެ ވެބްސައިޓް ކޮންޓެންޓާއި ޑޭޓާ ބެލެހެއްޓެވުމުގެ އެޑްމިން ޕެނަލް.'
      }
    };

    const currentMeta = tabMetaConfig[currentTab] || tabMetaConfig.home;

    document.title = currentMeta.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', currentMeta.description);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', currentMeta.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', currentMeta.description);
  }, [currentTab]);

  // Parse navigation tab from URL hash
  const parseTabFromHash = (hashStr: string): NavigationTab => {
    const h = (hashStr || '').toLowerCase();
    if (h === '#/ehee' || h === '#ehee' || h === '#/donate' || h === '#donate' || window.location.pathname === '/ehee') {
      return 'donate';
    }
    if (h === '#/admin' || h === '#admin') return 'admin';
    if (h === '#/about' || h === '#about') return 'about';
    if (h === '#/videos' || h === '#videos' || h === '#/media' || h === '#media') return 'videos';
    if (h === '#/gallery' || h === '#gallery') return 'gallery';
    if (h === '#/programs' || h === '#programs') return 'programs';
    if (h === '#/events' || h === '#events') return 'events';
    if (h === '#/volunteer' || h === '#volunteer') return 'volunteer';
    return 'home';
  };

  // Synchronize native browser back and forward buttons
  useEffect(() => {
    // Initialize initial state if empty so user has a safe anchor
    if (!window.location.hash) {
      window.history.replaceState({ tab: 'home' }, '', '#/home');
    } else {
      const initialTab = parseTabFromHash(window.location.hash);
      setCurrentTab(initialTab);
      window.history.replaceState({ tab: initialTab }, '', window.location.hash);
    }

    const handlePopState = (e: PopStateEvent) => {
      // If a modal is open, browser back closes the modal instead of closing the app!
      if (isDonateModalOpen) {
        setIsDonateModalOpen(false);
        return;
      }
      if (activeMediaModal) {
        setActiveMediaModal(null);
        return;
      }

      // Sync active tab
      const targetTab = e.state?.tab || parseTabFromHash(window.location.hash);
      setCurrentTab(targetTab);
    };

    const handleHashChange = () => {
      const targetTab = parseTabFromHash(window.location.hash);
      setCurrentTab(targetTab);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isDonateModalOpen, activeMediaModal]);

  const handleNavigate = (tab: NavigationTab) => {
    const targetTab = tab === 'media' ? 'videos' : tab;
    setCurrentTab(targetTab);
    const hash = targetTab === 'donate' ? '#/ehee' : `#/${targetTab}`;
    if (window.location.hash !== hash) {
      window.history.pushState({ tab: targetTab }, '', hash);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDonateModal = () => {
    window.history.pushState({ modalOpen: true, tab: currentTab }, '');
    setIsDonateModalOpen(true);
  };

  const handleCloseDonateModal = () => {
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
    setIsDonateModalOpen(false);
  };

  const handleOpenMediaModal = (media: MediaItem) => {
    window.history.pushState({ modalOpen: true, tab: currentTab }, '');
    setActiveMediaModal(media);
  };

  const handleCloseMediaModal = () => {
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
    setActiveMediaModal(null);
  };

  const featuredEvent = events.find((e) => e.isFeatured) || events[0] || null;

  return (
    <AccessibilityProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col selection:bg-[#1B6B52] selection:text-white font-thaana">
        {/* 1. Global Navigation Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={handleNavigate}
          onOpenDonateModal={handleOpenDonateModal}
        />

        {/* 2. Main Page Content */}
        <main className="flex-1">
          {currentTab === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onOpenDonateModal={handleOpenDonateModal}
              onSelectMedia={(media) => handleOpenMediaModal(media)}
              featuredEvent={featuredEvent}
              featuredMediaList={mediaList}
            />
          )}

          {currentTab === 'about' && (
            <AboutPage onNavigate={handleNavigate} />
          )}

          {(currentTab === 'videos' || currentTab === 'media') && (
            <MediaArchivePage
              mediaList={mediaList}
              onSelectMedia={(media) => handleOpenMediaModal(media)}
            />
          )}

          {currentTab === 'gallery' && (
            <GalleryPage onNavigate={handleNavigate} />
          )}

          {currentTab === 'programs' && (
            <ProgramsPage
              onNavigate={handleNavigate}
              onOpenDonateModal={handleOpenDonateModal}
            />
          )}

          {currentTab === 'events' && (
            <EventsPage
              events={events}
              onNavigate={handleNavigate}
              onOpenDonateModal={handleOpenDonateModal}
            />
          )}

          {currentTab === 'volunteer' && (
            <VolunteerPage />
          )}

          {currentTab === 'donate' && (
            <DonatePage />
          )}

          {currentTab === 'admin' && (
            <AdminPage />
          )}
        </main>

        {/* 3. Global Omnipresent Footer */}
        <Footer
          onNavigate={handleNavigate}
          onOpenDonateModal={handleOpenDonateModal}
        />

        {/* 4. Transfer & Viber Slip Modal */}
        <DonationReceiptModal
          isOpen={isDonateModalOpen}
          onClose={handleCloseDonateModal}
        />

        {/* 5. Video Player Modal for Dhaaris TV & Sign Language Media */}
        <VideoPlayerModal
          media={activeMediaModal}
          onClose={handleCloseMediaModal}
        />
      </div>
    </AuthProvider>
    </AccessibilityProvider>
  );
}
