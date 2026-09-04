import { useState, useEffect } from 'react';
import { NavigationTab, MediaItem } from './types';
import { INITIAL_EVENTS, INITIAL_MEDIA } from './data/initialData';
import Header from './components/Header';
import Footer from './components/Footer';
import StickyMobileDonateBar from './components/StickyMobileDonateBar';
import DonationReceiptModal from './components/DonationReceiptModal';
import VideoPlayerModal from './components/VideoPlayerModal';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MediaArchivePage from './pages/MediaArchivePage';
import ProgramsPage from './pages/ProgramsPage';
import EventsPage from './pages/EventsPage';
import VolunteerPage from './pages/VolunteerPage';
import DonatePage from './pages/DonatePage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [activeMediaModal, setActiveMediaModal] = useState<MediaItem | null>(null);

  // Static content driven directly from initialData (no database required)
  const events = INITIAL_EVENTS;
  const mediaList = INITIAL_MEDIA;

  // Sync /ehee hash route or path
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#/ehee' || hash === '#ehee' || window.location.pathname === '/ehee') {
        setCurrentTab('donate');
      } else if (hash === '#/about' || hash === '#about') {
        setCurrentTab('about');
      } else if (hash === '#/media' || hash === '#media') {
        setCurrentTab('media');
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
    setCurrentTab(tab);
    if (tab === 'donate') {
      window.location.hash = '/ehee';
    } else {
      window.location.hash = `#/${tab}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredEvent = events.find(e => e.isFeatured) || events[0];

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1C2622] flex flex-col selection:bg-[#1B6B52] selection:text-white font-thaana">
      {/* 1. Global Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        onOpenDonateModal={() => setIsDonateModalOpen(false || true)}
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

        {currentTab === 'media' && (
          <MediaArchivePage
            mediaList={mediaList}
            onSelectMedia={(media) => setActiveMediaModal(media)}
          />
        )}

        {currentTab === 'programs' && (
          <ProgramsPage
            onNavigate={handleNavigate}
            onOpenDonateModal={() => setIsDonateModalOpen(true)}
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
      </main>

      {/* 3. Global Omnipresent Footer on every page */}
      <Footer
        onNavigate={handleNavigate}
        onOpenDonateModal={() => setIsDonateModalOpen(true)}
      />

      {/* 4. Sticky Mobile Donate Action Bar (Anchored during scroll) */}
      <StickyMobileDonateBar
        onOpenDonateModal={() => setIsDonateModalOpen(true)}
        onNavigateToDonate={() => handleNavigate('donate')}
      />

      {/* 5. Transfer & Viber Slip Modal */}
      <DonationReceiptModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
      />

      {/* 6. Video Player Modal for Dhares TV & Sign Language Media */}
      <VideoPlayerModal
        media={activeMediaModal}
        onClose={() => setActiveMediaModal(null)}
      />
    </div>
  );
}
