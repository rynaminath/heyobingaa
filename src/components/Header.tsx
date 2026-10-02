import { useState, useEffect, useRef } from 'react';
import { NavigationTab } from '../types';
import Logo from './Logo';
import { 
  HeartHandshake, 
  Menu, 
  X, 
  MessageSquare, 
  Video, 
  Users, 
  BookOpen, 
  Home, 
  Images, 
  Facebook, 
  Instagram, 
  Youtube, 
  Mail 
} from 'lucide-react';
import { NGO_CONTACT } from '../data/initialData';
import AccessibilityMenu from './AccessibilityMenu';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenDonateModal: () => void;
}

export default function Header({ currentTab, onSelectTab, onOpenDonateModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(115);
  const headerRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef(0);
  const accumulatedDownScrollRef = useRef(0);

  // Measure header height dynamically to keep spacer in exact sync
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Header waits until at least the feature banner is scrolled up before hiding, and unhides when scrolled back
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (mobileMenuOpen) {
            setHeaderVisible(true);
            ticking = false;
            return;
          }

          const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
          const deltaY = currentScrollY - lastScrollYRef.current;

          // Determine if feature banner has scrolled up completely
          // Checks for #hero-banner, .hero-section, or top page container
          const heroEl = document.getElementById('hero-banner') || document.querySelector('.hero-section');
          let bannerStillInView = false;

          if (heroEl) {
            const rect = heroEl.getBoundingClientRect();
            // The feature banner is still scrolling up if its bottom edge is visible (rect.bottom > 0)
            bannerStillInView = rect.bottom > 0;
          } else {
            // For subpages without the hero banner, wait until at least 420px has scrolled up
            bannerStillInView = currentScrollY < 420;
          }

          if (bannerStillInView || currentScrollY < 60) {
            // The header MUST wait until at least the feature banner is scrolled up
            setHeaderVisible(true);
            accumulatedDownScrollRef.current = 0;
          } else if (deltaY < -2) {
            // When scrolled back (upward scroll): immediately unhide!
            setHeaderVisible(true);
            accumulatedDownScrollRef.current = 0;
          } else if (deltaY > 2) {
            // Feature banner has completely scrolled up, and user continues scrolling downward:
            accumulatedDownScrollRef.current += deltaY;
            if (accumulatedDownScrollRef.current > 30) {
              setHeaderVisible(false);
            }
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'ފުރަތަމަ ޞަފްޙާ', icon: <Home className="w-4 h-4" /> },
    { id: 'about', label: 'ތަޢާރަފް', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'videos', label: 'ވީޑިއޯ', icon: <Video className="w-4 h-4" /> },
    { id: 'gallery', label: 'ގެލެރީ', icon: <Images className="w-4 h-4" /> },
    { id: 'programs', label: 'ޕްރޮގްރާމްތައް', icon: <Users className="w-4 h-4" /> },
    { id: 'volunteer', label: 'ގުޅުއްވުމަށް', icon: <Users className="w-4 h-4" /> }
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header 
        ref={headerRef}
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5ECE8] shadow-xs transform-gpu will-change-transform transition-transform duration-300 ease-in-out ${
          headerVisible ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}
      >
      {/* Top Banner Notice: Contact & Social Media */}
      <div 
        id="header-topbar"
        className="relative overflow-hidden bg-gradient-to-r from-[#0F3528] via-[#1A6850] via-[#20775C] to-[#124536] text-[#EBF5F0] border-b border-[#124335] py-1.5 px-3 sm:px-4 shadow-xs"
      >
        {/* Layer 1: Islamic Star & Lattice Tessellation Texture Overlay */}
        <div 
          className="topbar-texture absolute inset-0 pointer-events-none opacity-[0.16] mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23A7F3D0' stroke-width='0.7' fill='none' fill-rule='evenodd'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3Cpath d='M30 10l20 20-20 20-20-20z'/%3E%3Cpath d='M0 0l15 15L0 30l30 30 15-15L60 60V0L45 15 30 0z'/%3E%3Ccircle cx='30' cy='30' r='3.5' fill='%23A7F3D0' fill-opacity='0.25'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '42px 42px'
          }}
          aria-hidden="true"
        />

        {/* Layer 2: Tactile Fine Stipple Grain Texture Overlay */}
        <div 
          className="topbar-texture absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 relative z-10">
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

          {/* Top Bar Donate & Accessibility Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <AccessibilityMenu variant="topbar" />

            <button
              id="topbar-donate-button"
              type="button"
              onClick={() => handleNavClick('donate')}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-lg bg-[#B83244] hover:bg-[#9A2434] active:bg-[#7E1A27] text-white font-bold text-xs sm:text-sm font-thaana shadow-sm hover:shadow active:scale-95 transition-all duration-200 border border-[#B83244]/40 cursor-pointer"
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
                const isActive = item.id === currentTab || (item.id === 'videos' && currentTab === 'media');

                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative px-3.5 py-2 rounded-xl text-lg font-semibold font-thaana transition-all duration-200 flex items-center gap-2 cursor-pointer ${
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

          {/* Left Side: Mobile Hamburger Toggle */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#1C2622] hover:bg-[#EBF5F0] transition-colors cursor-pointer"
              aria-label="ތަފްޞީލީ މެނޫ"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5ECE8] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200 shadow-xl max-h-[calc(100vh-100px)] overflow-y-auto">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = item.id === currentTab || (item.id === 'videos' && currentTab === 'media');

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-right font-thaana text-lg font-semibold transition-colors cursor-pointer ${
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

            {/* Mobile Accessibility Settings */}
            <div className="pt-2">
              <AccessibilityMenu 
                variant="mobile" 
                onCloseMobileDrawer={() => setMobileMenuOpen(false)} 
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('donate')}
                className="w-full py-3 rounded-xl bg-[#B83244] hover:bg-[#9A2434] text-white font-bold font-thaana text-base shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
                  className="text-[#1B6B52] font-semibold hover:underline cursor-pointer"
                >
                  ސްލިޕް ފޮނުއްވުމަށް (Viber)
                </button>
                <span dir="ltr" className="font-mono text-[#556660]">
                  {NGO_CONTACT.viberNumberFormatted}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
    {/* Spacer to prevent layout shifts and keep page content positioned below fixed header */}
    <div 
      id="header-spacer" 
      aria-hidden="true" 
      style={{ height: `${headerHeight}px` }} 
      className="w-full shrink-0 pointer-events-none" 
    />
  </>
  );
}
