import { EventItem, MediaItem, NavigationTab } from '../types';
import { BANK_ACCOUNTS, PARTNERS } from '../data/initialData';
import BankCard from '../components/BankCard';
import logoImg from '../images/logo.png';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Tv, 
  HeartHandshake, 
  ArrowLeft, 
  Sparkles, 
  Play, 
  ShieldCheck, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenDonateModal: () => void;
  onSelectMedia: (media: MediaItem) => void;
  featuredEvent: EventItem;
  featuredMediaList: MediaItem[];
}

export default function HomePage({
  onNavigate,
  onOpenDonateModal,
  onSelectMedia,
  featuredEvent,
  featuredMediaList
}: HomePageProps) {
  const deafAccessibleMedia = featuredMediaList.find((m) => m.isDeafAccessible) || featuredMediaList[0];

  return (
    <div className="space-y-16 pb-12 font-thaana">
      {/* 1. HERO BANNER: Flagship Event & Deaf-accessible Media Spotlight */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F231D] via-[#16332A] to-[#0E1E19] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#1C3B32] shadow-xl">
        {/* Subtle decorative ambient lights in soft green and soft blue */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B6B52]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#255D96]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Announcement Badge with Official Logo */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#18392F] border border-[#234A3E] text-[#EBF5F0] text-xs font-semibold shadow-xs">
              <img src={logoImg} alt="Logo" className="w-5 h-5 object-contain" />
              <span>ހެޔޮބިންގާ • 15 ޖެނުއަރީ 2024 ގައި ރަޖިސްޓްރީ ކުރެވުނު ޖަމްޢިއްޔާ</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B83244]/30 border border-[#B83244]/50 text-[#FEE2E2] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#FED7AA]" />
              <span>13+ އަހަރުގެ ދަޢުވަތީ އަދި އިޖުތިމާޢީ ތަޖުރިބާ</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Right Column (RTL Lead): Main Hero Text & Event Spotlight */}
            <div className="lg:col-span-7 space-y-6 text-right">
              <div className="space-y-3">
                <span className="text-[#A7F3D0] font-bold text-sm tracking-wide block">
                  އުޚުތުންގެ އިސްނެގުމުގައި ހެޔޮ މުޖުތަމަޢެއް ބިނާކުރުން
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  ހެޔޮ ޖީލެއް، <span className="text-[#A7F3D0]">ހެޔޮބިންގަލެއް</span> ގެ މަތީގައި
                </h1>
                <p className="text-sm sm:text-base text-[#D1E0D9] leading-relaxed max-w-2xl pt-2">
                  ހެޔޮބިންގާ އަކީ އުޚުތުންގެ ފުރިހަމަ ލީޑަރޝިޕްގައި، މުޖުތަމަޢުގެ އިސްލާމީ ހޭލުންތެރިކަން އިތުރުކުރުމަށާއި، ބީރު މުޖުތަމަޢަށް ދީނީ ޢިލްމު ފޯރުކޮށްދިނުމަށާއި، ތުއްތުކުދިންނާއި ޒުވާނުން ތަރުބިއްޔަތުކުރުމަށް ހިންގޭ ދިވެހި ޖަމްޢިއްޔާއެކެވެ.
                </p>
              </div>

              {/* Spotlight Event Card: "ރޯދައިގެ ހިޔަލުގައި" */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#142E26]/90 backdrop-blur-md border border-[#234A3E] shadow-xl space-y-4 hover:border-[#1B6B52] transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#234A3E] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#1B6B52] text-white font-bold text-xs">
                      އިސް ޙަރަކާތް
                    </span>
                    <span className="text-xs text-[#CFE2F5]">
                      މިނިސްޓްރީ އޮފް އިސްލާމިކް އެފެއާޒް & ދާރެސް ޓީވީ ގުޅިގެން
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#D1E0D9]">
                    {featuredEvent.time}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    ދަރުސް: "{featuredEvent.title}"
                  </h2>
                  <p className="text-sm font-semibold text-[#A7F3D0] mt-1">
                    ވާހަކަދައްކަވަނީ: {featuredEvent.speaker}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#D1E0D9] pt-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                    <span>{featuredEvent.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                    <span>{featuredEvent.dayText}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#A7F3D0] shrink-0" />
                    <span>ވަގުތު: {featuredEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tv className="w-4 h-4 text-[#CFE2F5] shrink-0" />
                    <span>{featuredEvent.broadcast}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('events')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white font-bold text-xs transition-all shadow-md"
                  >
                    <span>ދަރުހުގެ ތަފްޞީލު ބައްލަވާ</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={onOpenDonateModal}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs transition-colors"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-[#FEE2E2]" />
                    <span>ދަރުސް އިންތިޒާމަށް އެހީވެލައްވާ</span>
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('donate')}
                  className="px-6 py-3 rounded-xl bg-[#B83244] hover:bg-[#9A2434] text-white font-bold text-sm shadow-lg shadow-[#B83244]/25 active:scale-95 transition-all flex items-center gap-2 border border-[#B83244]/40"
                >
                  <HeartHandshake className="w-4 h-4 text-white" />
                  <span>އެހީތެރިވެލައްވާ (Donate Now)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="px-5 py-3 rounded-xl bg-[#142E26] hover:bg-[#1B6B52] text-white border border-[#234A3E] font-medium text-sm transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#A7F3D0]" />
                  <span>ޖަމިއްޔާގެ ތަޢާރަފް</span>
                </button>
              </div>
            </div>

            {/* Left Column: Featured Dhares TV Deaf-Accessible Production Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#142E26] border border-[#234A3E] rounded-3xl p-5 shadow-2xl backdrop-blur-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#255D96] animate-pulse" />
                    <span className="text-xs font-bold text-[#CFE2F5] font-latin">DHARES TV × HEYO BINGAA</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#255D96] text-white text-xs font-bold shadow-xs">
                    އިޝާރާތުގެ ބަހުރުވަ
                  </span>
                </div>

                {/* Video Card Clickable */}
                <div 
                  onClick={() => onSelectMedia(deafAccessibleMedia)}
                  className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-lg border border-[#234A3E]"
                >
                  <img
                    src={deafAccessibleMedia.thumbnailUrl}
                    alt={deafAccessibleMedia.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-4">
                    <div className="flex justify-start">
                      <span className="px-2 py-0.5 rounded bg-black/60 text-xs text-white font-mono">
                        {deafAccessibleMedia.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#255D96] hover:bg-[#1C4875] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#CFE2F5] font-semibold">{deafAccessibleMedia.series}</p>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{deafAccessibleMedia.title}</h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-2 text-xs text-[#D1E0D9]">
                  <p className="leading-relaxed">
                    ދާރެސް ޓީވީއާ ގުޅިގެން، ރާއްޖޭގެ ބީރު އަދި އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ މުޖުތަމަޢަށް އިސްލާމީ ޢިލްމާއި ތަރުބިއްޔަތު އިޝާރާތުގެ ބަހުރުވައިން ފޯރުކޮށްދިނުމުގެ މުހިންމު ސިލްސިލާ.
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-[#234A3E]">
                    <span className="text-[#A7F3D0] text-xs">
                      އިންޓަޕްރިޓަރ: {deafAccessibleMedia.interpreter || 'ރަސްމީ ސައިން ޓީމު'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('media')}
                      className="text-xs text-[#CFE2F5] hover:text-white underline underline-offset-4"
                    >
                      ހުރިހާ ވީޑިއޯއެއް ބައްލަވާ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SNIPPET: Sisters-led NGO with 13+ years community contribution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E9E5] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-right">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EBF5F0] text-[#1B6B52] text-xs font-bold border border-[#C8E0D5]">
                <ShieldCheck className="w-4 h-4 text-[#1B6B52]" />
                <span>ޖަމިއްޔާގެ އަސާސީ ވަނަވަރު</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2622] tracking-tight">
                13+ އަހަރުގެ މައިދާނީ ޚިދުމަތް، ރަސްމީ ބިންގަލެއްގެ މަތީގައި
              </h2>
              <p className="text-sm sm:text-base text-[#556660] leading-relaxed">
                ހެޔޮބިންގާ އަކީ 15 ޖެނުއަރީ 2024 ގައި ރަސްމީކޮށް ރަޖިސްޓްރީ ކުރެވުނު ޖަމްޢިއްޔާއެއް ނަމަވެސް، މި ޖަމްޢިއްޔާގެ ފަހަތުގައިވަނީ އިސްލާމީ ދަޢުވަތާއި އިޖުތިމާޢީ ޚިދުމަތުގައި ވޭތުވެދިޔަ 13 އަހަރަށް ވުރެ ގިނަ ދުވަހު މައިދާނުގައި ހަރަކާތްތެރިވެފައިވާ ތަޖުރިބާކާރު ޓީމެކެވެ.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E2E9E5] flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1C2622]">އުޚުތުންގެ ލީޑަރޝިޕް</h4>
                    <p className="text-xs text-[#556660] mt-0.5 leading-relaxed">
                      ޖަމިއްޔާގެ އެންމެހައި ނިންމުންތަކާއި ހިންގުން ކުރިއަށްދަނީ ކަނބަލުންގެ ފުރިހަމަ އިސްނެގުމުގައެވެ.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAF9] border border-[#E2E9E5] flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EDF4FC] text-[#255D96] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1C2622]">އަޚުންގެ އެހީތެރިކަން</h4>
                    <p className="text-xs text-[#556660] mt-0.5 leading-relaxed">
                      ބޮޑެތި އިވެންޓްތަކުގެ ލޮޖިސްޓިކްސް އަދި ޓެކްނިކަލް މަސައްކަތްތަކުގައި ފިރިހެން ވޮލަންޓިއަރުން ބައިވެރިވެއެވެ.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-gradient-to-br from-[#1B6B52] to-[#124837] text-white rounded-2xl p-6 text-right space-y-4 shadow-lg border border-[#1B6B52]">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="text-xs text-[#EBF5F0] font-bold tracking-wider uppercase block">
                  ޖަމިއްޔާގެ މަޤުޞަދު
                </span>
                <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain brightness-110" />
              </div>
              <p className="text-base sm:text-lg font-bold leading-relaxed">
                "ހެޔޮ ޖީލެއް ބިނާކުރުމާއި، ހެޔޮލަފާ މުޖުތަމަޢެއް ޤާއިމުކުރުމަށްޓަކައި އިޖުތިމާޢީ، ތަޢުލީމީ، ދީނީ، އަދި ތަރައްޤީގެ މަސައްކަތްތައް ކުރުން."
              </p>
              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs text-[#EBF5F0]">
                <span>ރަޖިސްޓްރީ ނަންބަރު: CR/12/2024</span>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white underline underline-offset-4"
                >
                  އިތުރަށް ކިޔުއްވާ
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED DONATION CALLOUT: Persistent & Visible in Soft Red / White */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E2E9E5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E2E9E5]">
            <div className="text-right space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF1F2] text-[#B83244] text-xs font-bold border border-[#F7D0D4]">
                <HeartHandshake className="w-4 h-4 text-[#B83244]" />
                <span>އެހީތެރިކަމުގެ ގޮވާލުން</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1C2622]">
                ދީނީ އަދި އިޖުތިމާޢީ ޕްރޮގްރާމްތަކަށް ޞަދަޤާތް ކުރައްވާ
              </h3>
              <p className="text-xs sm:text-sm text-[#556660] max-w-xl leading-relaxed">
                ހެޔޮބިންގާގެ ޙަރަކާތްތައް ހިންގުމަށް ބޭނުންވާ ފައިސާ ހޯދަނީ ޢާންމު ހެޔޮއެދޭ ފަރާތްތަކުގެ ދީލަތި އެހީއިންނެވެ. ބޭންކް އެކައުންޓަށް ޖަމާކުރެއްވުމަށްފަހު ފަސޭހައިން ސްލިޕް އަޕްލޯޑް ކުރައްވާށެވެ.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenDonateModal}
                className="px-5 py-3 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>ސްލިޕް ފޮނުއްވާ (Upload Receipt)</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('donate')}
                className="px-5 py-3 rounded-xl bg-[#B83244] hover:bg-[#9A2434] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <span>ތަފްޞީލީ ޞަފްޙާ</span>
              </button>
            </div>
          </div>

          {/* Bank cards row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {BANK_ACCOUNTS.map((acc) => (
              <BankCard key={acc.id} account={acc} onUploadReceipt={onOpenDonateModal} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. KEY INITIATIVES & WORKSHOPS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E9E5] pb-4">
          <div className="text-right">
            <span className="text-xs font-bold text-[#1B6B52] uppercase tracking-wider">
              އަމާޒުކުރެވޭ ދާއިރާތައް
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1C2622] mt-0.5">
              ހެޔޮބިންގާގެ ޚާއްޞަ ޕްރޮގްރާމްތައް
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('programs')}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-[#1B6B52] hover:text-[#145541] font-bold self-end sm:self-auto"
          >
            <span>ހުރިހާ ޕްރޮގްރާމްތަކެއް ބައްލަވާ</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Sisters - Soft Green */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E9E5] shadow-xs space-y-3 text-right hover:border-[#1B6B52]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#1C2622]">
              ކަނބަލުންގެ މުރާޖަޢާ ވޯކްޝޮޕްތައް
            </h4>
            <p className="text-xs text-[#556660] leading-relaxed">
              އާދަކާދައިގެ ތަޤްރީރުތަކާ ޚިލާފަށް، އިންޓްރެކްޓިވް ގޮތެއްގައި ކަނބަލުންގެ ނަފްސާނީ އަދި އިސްލާމީ ތަރުބިއްޔަތު ހަރުދަނާކުރުމުގެ ސެޝަންތައް.
            </p>
          </div>

          {/* Card 2: Toddlers - Soft Red */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E9E5] shadow-xs space-y-3 text-right hover:border-[#B83244]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FDF1F2] text-[#B83244] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#1C2622]">
              ތުއްތު ކުދިންގެ އިސްލާމީ ބިންގާ
            </h4>
            <p className="text-xs text-[#556660] leading-relaxed">
              3 އަހަރާއި 7 އަހަރާ ދެމެދުގެ ކުދިންނަށް ކުޅިވަރާއި ވާހަކަތަކުގެ ޒަރީޢާއިން އިސްލާމީ ރިވެތި އަޚްލާޤާއި ތައުޙީދު އުނގަންނައިދިނުން.
            </p>
          </div>

          {/* Card 3: Deaf Community - Soft Blue */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E9E5] shadow-xs space-y-3 text-right hover:border-[#255D96]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#EDF4FC] text-[#255D96] flex items-center justify-center">
              <Tv className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#1C2622]">
              ބީރު މުޖުތަމަޢަށް ދާރެސް ޓީވީ ޕްރޮގްރާމްތައް
            </h4>
            <p className="text-xs text-[#556660] leading-relaxed">
              އިޝާރާތުގެ ބަހުރުވައިން ދީނީ ޢިލްމު ގެނެސްދިނުމަށް ޚާއްޞަ ޓީވީ ސީރީޒްތައް ދާރެސް ޓީވީއާ ގުޅިގެން އުފެއްދުން.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PARTNER NETWORK LOGOS / CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-[#E2E9E5] shadow-xs text-center space-y-6">
          <div>
            <span className="text-xs font-bold text-[#556660] uppercase tracking-wider block">
              ގުޅިގެން މަސައްކަތްކުރާ އިދާރާތައް
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1C2622] mt-1">
              ޕާޓްނަރ ނެޓްވަރކް (Collaborating Partners)
            </h3>
            <p className="text-xs sm:text-sm text-[#556660] max-w-2xl mx-auto mt-1">
              ހެޔޮބިންގާއިން ދަނީ ރާއްޖޭގެ ރަސްމީ ވުޒާރާތަކާއި ޚިދުމަތްތެރި ޖަމްޢިއްޔާތަކާ ގުޅިގެން ޤައުމީ ފެންވަރުގައި މަސައްކަތް ކުރަމުންނެވެ.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
            {PARTNERS.map((partner) => (
              <div
                key={partner.id}
                className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] hover:border-[#1B6B52]/40 transition-all text-right flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-white text-[#556660] border border-[#E2E9E5] inline-block mb-2">
                    {partner.tag}
                  </span>
                  <h4 className="font-bold text-[#1C2622] text-sm">{partner.nameDv}</h4>
                  <p className="text-xs text-[#556660] font-latin mt-0.5">{partner.nameEn}</p>
                </div>
                <p className="text-xs text-[#1B6B52] font-semibold mt-3 pt-2 border-t border-[#E2E9E5]">
                  {partner.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
