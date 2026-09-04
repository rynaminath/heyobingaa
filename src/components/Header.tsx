import { useState } from 'react';
import { NavigationTab } from '../types';
import Logo from './Logo';
import { HeartHandshake, Menu, X, MessageSquare, Tv, Calendar, Users, BookOpen, Home } from 'lucide-react';
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
    { id: 'media', label: 'ޓީވީ / މީޑިއާ', icon: <Tv className="w-4 h-4" /> },
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E9E5] shadow-xs transition-all">
      {/* Top Banner Notice: Only Viber number and Donation link */}
      <div className="bg-[#1B6B52] text-[#EBF5F0] text-xs py-2 px-4 border-b border-[#145541]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a
            href={NGO_CONTACT.viberLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#EBF5F0] hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg font-mono font-medium"
            title="Viber"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#A7F3D0]" />
            <span dir="ltr">Viber: {NGO_CONTACT.viberNumberFormatted}</span>
          </a>

          <button
            type="button"
            onClick={() => handleNavClick('donate')}
            className="flex items-center gap-1.5 text-xs text-[#EBF5F0] hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg font-thaana font-semibold"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-[#FED7AA]" />
            <span>އެހީތެރިވެލައްވާ (Donate)</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
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
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold font-thaana transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#1B6B52] bg-[#EBF5F0] font-bold shadow-xs'
                      : 'text-[#556660] hover:text-[#1B6B52] hover:bg-[#EBF5F0]/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#1B6B52] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Action: High-contrast Donate button */}
          <div className="flex items-center gap-2">
            <button
              id="header-donate-button"
              type="button"
              onClick={() => handleNavClick('donate')}
              className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#B83244] hover:bg-[#9A2434] text-white font-bold text-xs sm:text-sm font-thaana shadow-md shadow-[#B83244]/20 hover:shadow-lg hover:shadow-[#B83244]/30 active:scale-95 transition-all duration-200 border border-[#B83244]/40"
            >
              <HeartHandshake className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>އެހީތެރިވެލައްވާ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2E9E5] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-right font-thaana text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EBF5F0] text-[#1B6B52] font-bold border-r-4 border-[#1B6B52]'
                      : 'text-[#556660] hover:bg-[#F8FAF9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#1B6B52]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-[#E2E9E5] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('donate')}
                className="w-full py-3 rounded-xl bg-[#B83244] hover:bg-[#9A2434] text-white font-bold font-thaana text-sm shadow-md flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>އެހީތެރިވެލައްވާ (Donate)</span>
              </button>

              <div className="flex items-center justify-between pt-2 px-1 text-xs text-[#556660] font-thaana">
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
