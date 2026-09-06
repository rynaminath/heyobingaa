import { useState, useEffect, useRef } from 'react';
import { NavigationTab } from '../types';
import Logo from './Logo';
import { 
  HeartHandshake, 
  Menu, 
  X, 
  MessageSquare, 
  Video, 
  Calendar, 
  Users, 
  BookOpen, 
  Home, 
  Images, 
  Facebook, 
  Instagram, 
  Youtube, 
  Mail, 
  ChevronDown, 
  Headphones, 
  GraduationCap, 
  Sparkles 
} from 'lucide-react';
import { NGO_CONTACT } from '../data/initialData';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onSelectProgramCategory?: (category: string) => void;
  onOpenDonateModal: () => void;
}

export default function Header({ currentTab, onSelectTab, onSelectProgramCategory, onOpenDonateModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide menu bar together with top bar after scrolling down, restore smoothly when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) {
        setHeaderVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;

      // Always show if near top of page
      if (currentScrollY < 40) {
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 70) {
        // User scrolled down -> autohide entire header (menu bar + top bar)
        setHeaderVisible(false);
        setProgramsDropdownOpen(false);
      } else if (currentScrollY < lastScrollY) {
        // User scrolled back up -> restore entire header smoothly
        setHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'ފުރަތަމަ ޞަފްޙާ', icon: <Home className="w-4 h-4" /> },
    { id: 'about', label: 'ތަޢާރަފް', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'videos', label: 'ވީޑިއޯ', icon: <Video className="w-4 h-4" /> },
    { id: 'gallery', label: 'ގެލެރީ', icon: <Images className="w-4 h-4" /> },
    { id: 'programs', label: 'ޕްރޮގްރާމްތައް', icon: <Users className="w-4 h-4" /> },
    { id: 'events', label: 'ދަރުސްތައް', icon: <Calendar className="w-4 h-4" /> },
    { id: 'volunteer', label: 'ގުޅުއްވުމަށް', icon: <Users className="w-4 h-4" /> }
  ];

  const programSubCategories = [
    { id: 'all', label: 'ހުރިހާ ޕްރޮގްރާމްތައް', icon: <BookOpen className="w-4 h-4 text-[#1B6B52]" /> },
    { id: 'audiobooks', label: 'އޯޑިއޯ ފޮތްތައް (Audiobooks)', icon: <Headphones className="w-4 h-4 text-[#1B6B52]" /> },
    { id: 'lectures', label: 'ދަރުސްތައް (Lectures)', icon: <GraduationCap className="w-4 h-4 text-[#1B6B52]" /> },
    { id: 'women', label: 'އުޚުތުންނާއި ކަނބަލުންނަށް', icon: <Users className="w-4 h-4 text-[#1B6B52]" /> },
    { id: 'toddlers', label: 'ތުއްތު ކުދިންގެ ބިންގާ', icon: <Sparkles className="w-4 h-4 text-[#1B6B52]" /> }
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    setProgramsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubCategoryClick = (categoryId: string) => {
    if (onSelectProgramCategory) {
      onSelectProgramCategory(categoryId);
    } else {
      onSelectTab('programs');
    }
    setMobileMenuOpen(false);
    setProgramsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setProgramsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setProgramsDropdownOpen(false);
    }, 200);
  };

  return (
    <header 
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5ECE8] shadow-xs transition-transform duration-300 ease-in-out ${
        headerVisible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
      }`}
    >
      {/* Top Banner Notice: Contact & Social Media */}
      <div className="bg-[#1B6B52] text-[#EBF5F0] border-b border-[#145541] py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left / Contact & Social Links */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-0.5 no-scrollbar">
            <a
              href={NGO_CONTACT.viberLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] sm:text-xs text-[#EBF5F0] hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-2 sm:px-2.5 py-0.5 rounded-md font-mono shrink-0"
              title="Viber"
            >
              <MessageSquare className="w-3 h-3 text-[#A7F3D0]" />
              <span dir="ltr">{NGO_CONTACT.viberNumberFormatted}</span>
            </a>

            <a
              href={`mailto:${NGO_CONTACT.email}`}
              className="hidden md:flex items-center gap-1 text-[11px] text-[#EBF5F0] hover:text-white transition-colors font-mono shrink-0"
            >
              <Mail className="w-3 h-3 text-[#A7F3D0]" />
              <span>{NGO_CONTACT.email}</span>
            </a>

            {/* Social Icons */}
            <div className="flex items-center gap-1.5 shrink-0 border-r border-white/20 pr-2 mr-1">
              <a
                href={NGO_CONTACT.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/20 text-white/90 hover:text-white transition-colors"
                title="Facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href={NGO_CONTACT.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/20 text-white/90 hover:text-white transition-colors"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href={NGO_CONTACT.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/20 text-white/90 hover:text-white transition-colors"
                title="YouTube"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Top Bar Donate & Admin Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg text-xs font-semibold font-thaana transition-all ${
                currentTab === 'admin'
                  ? 'bg-white text-[#1B6B52]'
                  : 'bg-white/10 hover:bg-white/20 text-[#EBF5F0]'
              }`}
              title="އެޑްމިން ޕެނަލް"
            >
              <span>އެޑްމިން</span>
            </button>

            <button
              id="topbar-donate-button"
              type="button"
              onClick={() => handleNavClick('donate')}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-lg bg-[#B83244] hover:bg-[#9A2434] active:bg-[#7E1A27] text-white font-bold text-xs sm:text-sm font-thaana shadow-sm hover:shadow active:scale-95 transition-all duration-200 border border-[#B83244]/40"
            >
              <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:scale-110 transition-transform shrink-0" />
              <span>އެހީދެއްވުމަށް</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Right Side (RTL Start): Logo & Desktop Navigation - Kept right-aligned on all screen sizes */}
          <div className="flex items-center gap-6 xl:gap-8">
            {/* Logo: Anchored on the right across mobile, tablet, and desktop */}
            <div 
              onClick={() => handleNavClick('home')}
              className="cursor-pointer py-2 focus:outline-none shrink-0"
            >
              <Logo size="md" />
            </div>

            {/* Desktop Navigation Links with Icons (Right-aligned immediately next to logo) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => {
                const isActive = currentTab === item.id || (item.id === 'videos' && currentTab === 'media');

                if (item.id === 'programs') {
                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <button
                        id={`nav-link-${item.id}`}
                        type="button"
                        onClick={() => handleNavClick('programs')}
                        className={`relative px-3.5 py-2 rounded-xl text-lg font-semibold font-thaana transition-all duration-200 flex items-center gap-2 ${
                          isActive
                            ? 'text-[#1B6B52] bg-[#EBF5F0] font-bold shadow-xs'
                            : 'text-[#556660] hover:text-[#1B6B52] hover:bg-[#EBF5F0]/60'
                        }`}
                        aria-expanded={programsDropdownOpen}
                        aria-haspopup="true"
                      >
                        <span className="text-[#1B6B52] shrink-0">{item.icon}</span>
                        <span>{item.label}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-[#556660] transition-transform duration-200 ${programsDropdownOpen ? 'rotate-180 text-[#1B6B52]' : ''}`} />
                        {isActive && (
                          <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-[#1B6B52] rounded-full" />
                        )}
                      </button>

                      {/* Programs Dropdown Menu (Desktop) */}
                      {programsDropdownOpen && (
                        <div
                          className="absolute top-full right-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-[#E5ECE8] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                          onMouseEnter={handleDropdownEnter}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="px-3.5 py-1.5 border-b border-[#E5ECE8]/60 mb-1 text-xs font-bold text-[#556660]">
                            ޕްރޮގްރާމްތަކުގެ ބާވަތްތައް
                          </div>
                          {programSubCategories.map((sub) => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleSubCategoryClick(sub.id)}
                              className="w-full px-3.5 py-2 text-right text-base font-semibold font-thaana text-[#1C2622] hover:bg-[#EBF5F0] hover:text-[#1B6B52] flex items-center justify-between transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                {sub.icon}
                                <span>{sub.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-3.5 py-2 rounded-xl text-lg font-semibold font-thaana transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'text-[#1B6B52] bg-[#EBF5F0] font-bold shadow-xs'
                        : 'text-[#556660] hover:text-[#1B6B52] hover:bg-[#EBF5F0]/60'
                    }`}
                  >
                    <span className="text-[#1B6B52] shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-[#1B6B52] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Left Side (RTL End): Mobile & Tablet Hamburger Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1C2622] hover:bg-[#EBF5F0] focus:outline-none"
              aria-label="މެނޫ ހުޅުއްވާ"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5ECE8] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id || (item.id === 'videos' && currentTab === 'media');
              
              if (item.id === 'programs') {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-right font-thaana text-lg font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#EBF5F0] text-[#1B6B52] font-bold border-r-4 border-[#1B6B52]'
                          : 'text-[#556660] hover:bg-[#FAFCFB]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#1B6B52]">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-[#556660]" />
                    </button>

                    {/* Mobile Programs Sub-Categories */}
                    <div className="pr-8 pl-2 py-1 space-y-1 bg-[#FAFCFB] rounded-xl border border-[#E5ECE8]">
                      {programSubCategories.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSubCategoryClick(sub.id)}
                          className="w-full flex items-center gap-2.5 py-2 text-right text-base font-thaana text-[#556660] hover:text-[#1B6B52]"
                        >
                          <span className="shrink-0">{sub.icon}</span>
                          <span>{sub.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-right font-thaana text-lg font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#EBF5F0] text-[#1B6B52] font-bold border-r-4 border-[#1B6B52]'
                      : 'text-[#556660] hover:bg-[#FAFCFB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#1B6B52]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}

            {/* Mobile Admin Portal Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-right font-thaana text-lg font-semibold transition-colors ${
                currentTab === 'admin'
                  ? 'bg-[#EBF5F0] text-[#1B6B52] font-bold border-r-4 border-[#1B6B52]'
                  : 'text-[#556660] hover:bg-[#FAFCFB]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[#1B6B52]"><Users className="w-4 h-4" /></span>
                <span>އެޑްމިން ޕޯޓަލް (Admin)</span>
              </div>
            </button>

            {/* Social media in mobile drawer */}
            <div className="flex items-center justify-center gap-3 pt-3 pb-1 border-t border-[#E5ECE8]">
              <span className="text-xs text-[#556660] font-thaana">ސޯޝަލް މީޑިއާ:</span>
              <a
                href={NGO_CONTACT.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center hover:bg-[#1B6B52] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={NGO_CONTACT.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center hover:bg-[#1B6B52] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={NGO_CONTACT.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center hover:bg-[#1B6B52] hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('donate')}
                className="w-full py-3 rounded-xl bg-[#B83244] hover:bg-[#9A2434] text-white font-bold font-thaana text-base shadow-md flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>އެހީދެއްވުމަށް (Donate)</span>
              </button>

              <div className="flex items-center justify-between pt-1 px-1 text-xs text-[#556660] font-thaana">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDonateModal();
                  }}
                  className="text-[#1B6B52] font-semibold hover:underline"
                >
                  ސްލިޕް ފޮނުއްވުމަށް (Viber)
                </button>
                <a
                  href={NGO_CONTACT.viberLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#7360F2] font-mono font-semibold"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span dir="ltr">{NGO_CONTACT.viberNumberFormatted}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
