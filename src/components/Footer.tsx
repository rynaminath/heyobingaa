import { NavigationTab } from '../types';
import { BANK_ACCOUNTS, PARTNERS, NGO_CONTACT } from '../data/initialData';
import BankCard from './BankCard';
import Logo from './Logo';
import { HeartHandshake, MessageSquare, Mail, Phone, MapPin, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenDonateModal: () => void;
}

export default function Footer({ onNavigate, onOpenDonateModal }: FooterProps) {
  return (
    <footer className="bg-[#0F231D] text-[#D1E0D9] pt-14 pb-24 lg:pb-14 border-t border-[#1C3B32] font-thaana relative overflow-hidden">
      {/* Decorative backdrop elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#1B6B52]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[#255D96]/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* TOP SECTION: Omnipresent Donation Bank Accounts Block */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-[#142E26] border border-[#234A3E] shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#234A3E]">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5F0] text-[#1B6B52] text-xs font-semibold mb-2 shadow-xs">
                <HeartHandshake className="w-4 h-4 text-[#1B6B52]" />
                <span>ރަސްމީ އެކައުންޓްތައް • ދެމެހެއްޓެނިވި އެހީ</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                ހެޔޮބިންގާގެ މުހިންމު މަސައްކަތްތަކަށް އެހީތެރިވެދެއްވާ
              </h3>
              <p className="text-xs sm:text-sm text-[#A8C4B8] mt-1 max-w-2xl leading-relaxed">
                ދީނީ ޢިލްމު ފެތުރުމާއި، ބީރު މުޖުތަމަޢަށް ޚާއްޞަ ޓީވީ ޕްރޮގްރާމްތަކާއި، ކަނބަލުންނާއި ކުޑަކުދިންގެ އިސްލާމީ ބިންގާ ވަރުގަދަކުރުމަށް ތިޔަބޭފުޅުންގެ ދީލަތި އެހީ މުހިންމެވެ.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenDonateModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7360F2] hover:bg-[#604CE2] text-white font-semibold text-xs sm:text-sm shadow-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>ސްލިޕް ވައިބަރ ކުރައްވާ (<span dir="ltr" className="font-mono font-bold">{NGO_CONTACT.viberNumberFormatted}</span>)</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('donate')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B83244] hover:bg-[#9A2434] text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>އެހީގެ ޞަފްޙާއަށް</span>
              </button>
            </div>
          </div>

          {/* Grid of Bank Account Cards (2 Banks x 2 Accounts) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            {BANK_ACCOUNTS.map((acc) => (
              <BankCard
                key={acc.id}
                account={acc}
              />
            ))}
          </div>
        </div>

        {/* MIDDLE SECTION: Navigation & Partner Network */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#234A3E]">
          {/* Col 1: Organization Identity */}
          <div className="md:col-span-2 space-y-4">
            <Logo variant="dark" size="lg" />
            <p className="text-xs sm:text-sm text-[#A8C4B8] leading-relaxed max-w-lg">
              ހެޔޮބިންގާ އަކީ އުޚުތުންގެ އިސްނެގުމާއި ލީޑަރޝިޕްގެ ދަށުން ހިންގޭ ދިވެހި ޖަމްޢިއްޔާއެކެވެ. އިވެންޓްތަކާއި ލޮޖިސްޓިކްސްގެ މަސައްކަތްތަކުގައި ފިރިހެން ވޮލަންޓިއަރުންގެ އެހީތެރިކަން ލިބިގެންދެއެވެ. ވޭތުވެދިޔަ 13+ އަހަރުގެ ދަޢުވަތީ އަދި އިޖުތިމާޢީ މައިދާނުގެ ތަޖުރިބާއާއެކު ރަސްމީކޮށް ރަޖިސްޓްރީ ކުރެވުނީ 15 ޖެނުއަރީ 2024 ގައެވެ.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#A7F3D0]">
              <span className="px-3 py-1 rounded-md bg-[#18392F] border border-[#234A3E]">
                ރަޖިސްޓްރީ: <span dir="ltr" className="font-mono">15/01/2024</span>
              </span>
              <span className="px-3 py-1 rounded-md bg-[#18392F] border border-[#234A3E]">
                ސިސްޓާސް-ލެޑް އެންޖީއޯ
              </span>
              <span className="px-3 py-1 rounded-md bg-[#18392F] border border-[#234A3E] text-[#CFE2F5]">
                ދާރެސް ޓީވީ ޕާޓްނަރ
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              މައިގަނޑު ބައިތައް
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#A8C4B8]">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  ފުރަތަމަ ޞަފްޙާ (Home)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  ޖަމިއްޔާގެ ތަޢާރަފް (About Us)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('media')} className="hover:text-white transition-colors">
                  ޓީވީ / މީޑިއާ & ބީރު މުޖުތަމަޢު (Media Archive)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">
                  ޕްރޮގްރާމްތައް & ވޯކްޝޮޕްތައް (Programs)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('events')} className="hover:text-white transition-colors">
                  ދަރުސްތަކާއި ޙަރަކާތްތައް (Events)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('volunteer')} className="hover:text-white transition-colors">
                  ވޮލަންޓިއަރ ވުމާއި ގުޅުއްވުން (Contact & Join)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Headquarters */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              ގުޅުއްވުމަށް
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-[#A8C4B8]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                <span>{NGO_CONTACT.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                <span className="font-thaana">ވައިބަރ: </span>
                <a href={NGO_CONTACT.viberLink} target="_blank" rel="noopener noreferrer" dir="ltr" className="font-mono text-white hover:underline font-bold">
                  {NGO_CONTACT.viberNumberFormatted}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                <span dir="ltr" className="font-mono">{NGO_CONTACT.phone} / {NGO_CONTACT.secondaryPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                <span dir="ltr" className="font-mono">{NGO_CONTACT.email}</span>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenDonateModal}
                  className="text-xs text-[#A7F3D0] hover:text-white underline underline-offset-4 flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>ޓްރާންސްފަރ ސްލިޕް ވައިބަރ އަށް ފޮނުއްވާ (<span dir="ltr" className="font-mono">{NGO_CONTACT.viberNumberFormatted}</span>)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Collaborative Partner Logos / Badges */}
        <div className="py-6 border-b border-[#234A3E]">
          <p className="text-xs text-[#8BAEA0] font-medium mb-3 text-center sm:text-right">
            އެއްބާރުލުން ދެއްވާ ބައިވެރިން (Collaborating Partners):
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            {PARTNERS.map((partner) => (
              <div
                key={partner.id}
                className="px-3.5 py-2 rounded-lg bg-[#18392F] border border-[#234A3E] text-xs text-white flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B6B52]" />
                <span className="font-thaana font-medium">{partner.nameDv}</span>
                <span className="text-[11px] text-[#A8C4B8] hidden sm:inline">({partner.nameEn})</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION: Copyright & Domain */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8BAEA0]">
          <p>
            © {new Date().getFullYear()} ހެޔޮބިންގާ ޖަމްޢިއްޔާ (Heyo Bingaa NGO). ހުރިހާ ޙައްޤެއް ރައްކާތެރިކުރެވިފައި.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-white transition-colors"
            >
              އަސާސީ ޤަވާޢިދު
            </button>
            <span>•</span>
            <a
              href="https://www.heyobingaa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white hover:text-[#A7F3D0] transition-colors bg-[#18392F] hover:bg-[#1B6B52] px-3 py-1.5 rounded-lg border border-[#234A3E] font-latin"
            >
              <Globe className="w-3.5 h-3.5 text-[#A7F3D0]" />
              <span>www.heyobingaa.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
