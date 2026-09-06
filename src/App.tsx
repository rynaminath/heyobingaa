import { useState, useEffect } from 'react';
import { NavigationTab, MediaItem, EventItem, ProgramItem } from './types';
import { INITIAL_EVENTS, INITIAL_MEDIA, PROGRAMS } from './data/initialData';
import { AuthProvider } from './context/AuthContext';
import { subscribeToEvents, subscribeToMedia, subscribeToPrograms } from './services/firestoreService';

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
  const [selectedProgramCategory, setSelectedProgramCategory] = useState<string | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [activeMediaModal, setActiveMediaModal] = useState<MediaItem | null>(null);

  // Firestore real-time state with initial data fallback
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [programs, setPrograms] = useState<ProgramItem[]>(PROGRAMS);

  // Live Firebase Subscriptions
  useEffect(() => {
    const unsubEvents = subscribeToEvents((data) => {
      if (data && data.length > 0) setEvents(data);
    });
    const unsubMedia = subscribeToMedia((data) => {
      if (data && data.length > 0) setMediaList(data);
    });
    const unsubPrograms = subscribeToPrograms((data) => {
      if (data && data.length > 0) setPrograms(data);
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
        description: 'ހެޔޮބިންގާގެ މައިގަނޑު ދަޢުވަތީ އަދި ތަރުބަވީ ޕްރޮގްރާމްތައް: އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ ކުދިންނަށް ދީނީ ތަޢުލީމު، ޢާއިލީ ދަރުސްތައް، އޯޑިއޯ ފޮތްތައް އަދި ދަޢުވާ ވަޞީލަތްތައް.'
      },
      about: {
        title: 'About Us | Heyo Bingaa NGO',
        description: 'ހެޔޮބިންގާ ޖަމްޢިއްޔާގެ ތާރީޚު، ތަޞައްވުރު، މަޤްޞަދު އަދި ދަޢުވަތީ ޚިދުމަތްތައް.'
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
        description: 'ހެޔޮބިންގާ ޖަމްޢިއްޔާގެ ދަޢުވަތީ އަދި އިޖުތިމާޢީ ޙަރަކާތްތަކުގެ ފޮޓޯ ގެލެރީ އަދި ސްލައިޑްޝޯ.'
      },
      events: {
        title: 'Events & Campaigns | Heyo Bingaa NGO',
        description: 'ހެޔޮބިންގާއިން ރާވާ ހިންގާ ކުރިއަށް ހުރި ޙަރަކާތްތަކާއި ދަޢުވަތީ އިވެންޓްތައް.'
      },
      volunteer: {
        title: 'Volunteer | Heyo Bingaa NGO',
        description: 'ހެޔޮބިންގާގެ އިސްލާމީ އަދި އިޖުތިމާޢީ ޚިދުމަތްތަކުގައި ވޮލަންޓިއަރެއްގެ ގޮތުގައި ބައިވެރިވެވަޑައިގަންނަވާ.'
      },
      donate: {
        title: 'Donate & Ehee | Heyo Bingaa NGO',
        description: 'ހެޔޮބިންގާގެ ދަޢުވަތީ މަސައްކަތްތަކަށް މާލީ އެހީތެރިކަން ފޯރުކޮށްދެއްވާ. ބޭންކް އެކައުންޓްތަކާއި ވައިބަރ ސްލިޕް ހޮޓްލައިން.'
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

  // Sync hash route or path
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#/ehee' || hash === '#ehee' || window.location.pathname === '/ehee') {
        setCurrentTab('donate');
      } else if (hash === '#/admin' || hash === '#admin') {
        setCurrentTab('admin');
      } else if (hash === '#/about' || hash === '#about') {
        setCurrentTab('about');
      } else if (hash === '#/videos' || hash === '#videos' || hash === '#/media' || hash === '#media') {
        setCurrentTab('videos');
      } else if (hash === '#/gallery' || hash === '#gallery') {
        setCurrentTab('gallery');
      } else if (hash === '#/programs' || hash === '#programs') {
        setCurrentTab('programs');
      } else if (hash === '#/events' || hash === '#events') {
        setCurrentTab('events');
      } else if (hash === '#/volunteer' || hash === '#volunteer') {
        setCurrentTab('volunteer');
      } else if (hash === '#/donate' || hash === '#donate') {
        setCurrentTab('donate');
      } else if (hash === '#/home' || hash === '#home') {
        setCurrentTab('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (tab: NavigationTab) => {
    const targetTab = tab === 'media' ? 'videos' : tab;
    setCurrentTab(targetTab);
    if (targetTab === 'donate') {
      window.location.hash = '/ehee';
    } else {
      window.location.hash = `#/${targetTab}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProgramCategory = (cat: string) => {
    setSelectedProgramCategory(cat);
    handleNavigate('programs');
  };

  const featuredEvent = events.find((e) => e.isFeatured) || events[0];

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#FAFCFB] text-[#1C2622] flex flex-col selection:bg-[#1B6B52] selection:text-white font-thaana">
        {/* 1. Global Navigation Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setSelectedProgramCategory(null);
            handleNavigate(tab);
          }}
          onSelectProgramCategory={handleSelectProgramCategory}
          onOpenDonateModal={() => setIsDonateModalOpen(true)}
        />

        {/* 2. Main Page Content */}
        <main className="flex-1">
          {currentTab === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              onOpenDonateModal={() => setIsDonateModalOpen(true)}
              onSelectMedia={(media) => setActiveMediaModal(media)}
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
              onSelectMedia={(media) => setActiveMediaModal(media)}
            />
          )}

          {currentTab === 'gallery' && (
            <GalleryPage onNavigate={handleNavigate} />
          )}

          {currentTab === 'programs' && (
            <ProgramsPage
              onNavigate={handleNavigate}
              onOpenDonateModal={() => setIsDonateModalOpen(true)}
              initialCategory={selectedProgramCategory}
              onSelectCategory={(cat) => setSelectedProgramCategory(cat)}
              programs={programs}
            />
          )}

          {currentTab === 'events' && (
            <EventsPage
              events={events}
              onNavigate={handleNavigate}
              onOpenDonateModal={() => setIsDonateModalOpen(true)}
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
          onOpenDonateModal={() => setIsDonateModalOpen(true)}
        />

        {/* 4. Transfer & Viber Slip Modal */}
        <DonationReceiptModal
          isOpen={isDonateModalOpen}
          onClose={() => setIsDonateModalOpen(false)}
        />

        {/* 5. Video Player Modal for Dhaaris TV & Sign Language Media */}
        <VideoPlayerModal
          media={activeMediaModal}
          onClose={() => setActiveMediaModal(null)}
        />
      </div>
    </AuthProvider>
  );
}
