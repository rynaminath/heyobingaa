import { useState } from 'react';
import { NavigationTab } from '../types';
import Logo from './Logo';
import { HeartHandshake, Menu, X, MessageSquare, Video, Calendar, Users, BookOpen, Home, Images, Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import { NGO_CONTACT } from '../data/initialData';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenDonateModal: () => void;
}

export default function Header({ currentTab, onSelectTab, onOpenDonateModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'ފުރަތަމަ ޞަފްޙާ', icon: <Home className="w-4 h-4" /> },
    { id: 'about', label: 'ތަޢާރަފް', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'videos', label: 'ވީޑިއޯ', icon: <Video className="w-4 h-4" /> },
    { id: 'gallery', label: 'ގެލެރީ', icon: <Images className="w-4 h-4" /> },
    { id: 'programs', label: 'ޕްރޮގްރާމްތައް', icon: <Users className="w-4 h-4" /> },
    { id: 'events', label: 'ދަރުސްތައް', icon: <Calendar className="w-4 h-4" /> },
    { id: 'volunteer', label: 'ގުޅުއްވުމަށް', icon: <Users className="w-4 h-4" /> }
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5ECE8] shadow-xs transition-all">
      {/* Top Banner Notice: Contact & Social Media */}
      <div className="bg-[#1B6B52] text-[#EBF5F0] text-xs py-1.5 px-3 sm:px-4 border-b border-[#145541]">
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

          {/* Right / Donate button in top bar */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleNavClick('donate')}
              className="flex items-center gap-1.5 text-[11px] sm:text-xs text-white hover:text-[#FED7AA] transition-colors bg-white/15 hover:bg-white/25 px-2.5 sm:px-3 py-0.5 rounded-md font-thaana font-semibold"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#FED7AA]" />
              <span>އެހީ (Donate)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile Hamburger Menu Button on the Right (RTL start) */}
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

          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="cursor-pointer py-2 focus:outline-none"
          >
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id || (item.id === 'videos' && currentTab === 'media');
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-sm font-semibold font-thaana transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#1B6B52] bg-[#EBF5F0] font-bold shadow-xs'
                      : 'text-[#556660] hover:text-[#1B6B52] hover:bg-[#EBF5F0]/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-[#1B6B52] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Action: Donate button */}
          <div className="flex items-center gap-2">
            <button
              id="header-donate-button"
              type="button"
              onClick={() => handleNavClick('donate')}
              className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#B83244] hover:bg-[#9A2434] text-white font-bold text-xs sm:text-sm font-thaana shadow-sm hover:shadow-md active:scale-95 transition-all duration-200"
            >
              <HeartHandshake className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>އެހީތެރިވެލައްވާ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5ECE8] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id || (item.id === 'videos' && currentTab === 'media');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-right font-thaana text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EBF5F0] text-[#1B6B52] font-bold border-r-4 border-[#1B6B52]'
                      : 'text-[#556660] hover:bg-[#FAFCFB]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
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

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('donate')}
                className="w-full py-2.5 rounded-xl bg-[#B83244] hover:bg-[#9A2434] text-white font-bold font-thaana text-sm shadow-md flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>އެހީތެރިވެލައްވާ (Donate)</span>
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
