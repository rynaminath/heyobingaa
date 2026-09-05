import { NavigationTab } from '../types';
import { PARTNERS, NGO_CONTACT } from '../data/initialData';
import Logo from './Logo';
import { MessageSquare, Mail, Phone, MapPin, Globe, Facebook, Instagram, Youtube } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenDonateModal: () => void;
}

export default function Footer({ onNavigate, onOpenDonateModal }: FooterProps) {
  return (
    <footer className="bg-[#0F231D] text-[#D1E0D9] py-12 border-t border-[#1C3B32] font-thaana relative overflow-hidden">
      {/* Decorative backdrop elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#1B6B52]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[#255D96]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* MAIN FOOTER: Navigation & Contact Network */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#234A3E]">
          {/* Col 1: Organization Identity & Socials */}
          <div className="md:col-span-2 space-y-4">
            <Logo variant="dark" size="lg" />
            <p className="text-xs sm:text-sm text-[#A8C4B8] leading-relaxed max-w-lg">
              ހެޔޮބިންގާ އަކީ އުޚުތުންގެ އިސްނެގުމާއި ލީޑަރޝިޕްގެ ދަށުން ހިންގޭ ދިވެހި ޖަމްޢިއްޔާއެކެވެ. އިވެންޓްތަކާއި ލޮޖިސްޓިކްސްގެ މަސައްކަތްތަކުގައި ފިރިހެން ވޮލަންޓިއަރުންގެ އެހީތެރިކަން ލިބިގެންދެއެވެ. ވޭތުވެދިޔަ <span dir="ltr" className="inline-block font-mono font-bold text-[#A7F3D0]">13+</span> އަހަރުގެ ދަޢުވަތީ އަދި އިޖުތިމާޢީ މައިދާނުގެ ތަޖުރިބާއާއެކު ރަސްމީކޮށް ރަޖިސްޓްރީ ކުރެވުނީ 15 ޖެނުއަރީ 2024 ގައެވެ.
            </p>
            
            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs text-[#A8C4B8] font-semibold">ސޯޝަލް މީޑިއާ:</span>
              <a
                href={NGO_CONTACT.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#18392F] hover:bg-[#1B6B52] text-white flex items-center justify-center transition-colors border border-[#234A3E]"
                aria-label="Facebook"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={NGO_CONTACT.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#18392F] hover:bg-[#1B6B52] text-white flex items-center justify-center transition-colors border border-[#234A3E]"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={NGO_CONTACT.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#18392F] hover:bg-[#1B6B52] text-white flex items-center justify-center transition-colors border border-[#234A3E]"
                aria-label="YouTube"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#A7F3D0]">
              <span className="px-3 py-1 rounded-md bg-[#18392F] border border-[#234A3E]">
                ރަޖިސްޓްރީ: <span dir="ltr" className="font-mono">15/01/2024</span>
              </span>
              <span className="px-3 py-1 rounded-md bg-[#18392F] border border-[#234A3E]">
                ސިސްޓާސް-ލެޑް އެންޖީއޯ
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
                <button onClick={() => onNavigate('videos')} className="hover:text-white transition-colors">
                  ވީޑިއޯތައް (Videos)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-white transition-colors">
                  ފޮޓޯ ގެލެރީ (Gallery)
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
              <li>
                <button onClick={() => onNavigate('donate')} className="text-[#A7F3D0] hover:text-white transition-colors font-semibold">
                  އެހީދެއްވުމަށް (Donate)
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
                <Globe className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                <a href={NGO_CONTACT.websiteUrl} target="_blank" rel="noopener noreferrer" dir="ltr" className="font-mono text-white hover:underline">
                  {NGO_CONTACT.website}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                <span className="font-thaana">Mobile/Viber: </span>
                <a href={NGO_CONTACT.viberLink} target="_blank" rel="noopener noreferrer" dir="ltr" className="font-mono text-white hover:underline font-bold">
                  {NGO_CONTACT.viberNumberFormatted}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                <a href={`mailto:${NGO_CONTACT.email}`} dir="ltr" className="font-mono text-white hover:underline">
                  {NGO_CONTACT.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                <span>{NGO_CONTACT.address}</span>
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
