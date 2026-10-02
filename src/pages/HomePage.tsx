import { EventItem, MediaItem, NavigationTab } from '../types';
import { BANK_GROUPS } from '../data/initialData';
import BankCard from '../components/BankCard';
import HeroSlideshowBanner from '../components/HeroSlideshowBanner';
import logoImg from '../images/logo.png';
import { 
  Tv, 
  HeartHandshake, 
  ArrowLeft, 
  Sparkles, 
  Users, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenDonateModal: () => void;
  onSelectMedia?: (media: MediaItem) => void;
  featuredEvent?: EventItem | null;
  featuredMediaList?: MediaItem[];
}

export default function HomePage({
  onNavigate,
  onOpenDonateModal
}: HomePageProps) {

  return (
    <div className="space-y-16 pb-12 font-thaana">
      {/* 1. HERO SLIDESHOW BANNER (With Jamiyyaage Maqsad Box integrated into right side green) */}
      <HeroSlideshowBanner onNavigate={onNavigate} />

      {/* 2. ABOUT SNIPPET: Sisters-led NGO with 13+ years community contribution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E9E5] shadow-xs text-right space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E9E5] pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1B6B52] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#1B6B52]" />
                <span>ތާރީޚާއި ބިންގާ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2622] tracking-tight mt-1">
                <span dir="ltr" className="inline-block font-mono">13+</span> އަހަރުގެ މައިދާނީ ޚިދުމަތް، ރަސްމީ ބިންގަލެއްގެ މަތީގައި
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1B6B52] hover:text-[#145541] font-bold self-end sm:self-auto cursor-pointer"
            >
              <span>ތަޢާރަފް ފުރިހަމަކޮށް ބައްލަވާ</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm sm:text-base text-[#556660] leading-relaxed max-w-4xl">
            ހެޔޮބިންގާ އަކީ 15 ޖެނުއަރީ 2024 ގައި ރަސްމީކޮށް ރަޖިސްޓްރީ ކުރެވުނު ޖަމްޢިއްޔާއެއް ނަމަވެސް، މި ޖަމްޢިއްޔާގެ ފަހަތުގައިވަނީ އިސްލާމީ ދަޢުވަތާއި އިޖުތިމާޢީ ޚިދުމަތުގައި ވޭތުވެދިޔަ <span dir="ltr" className="inline-block font-mono font-bold">13+</span> އަހަރަށް ވުރެ ގިނަ ދުވަހު މައިދާނުގައި ހަރަކާތްތެރިވެފައިވާ ތަޖުރިބާކާރު ޓީމެކެވެ.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-[#1C2622]">އުޚުތުންގެ ލީޑަރޝިޕް</h4>
              <p className="text-xs sm:text-sm text-[#556660] leading-relaxed">
                ޖަމިއްޔާގެ އެންމެހައި ނިންމުންތަކާއި ހިންގުން ކުރިއަށްދަނީ ކަނބަލުންގެ ފުރިހަމަ އިސްނެގުމުގައެވެ.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-[#1C2622]">އަޚުންގެ އެހީތެރިކަން</h4>
              <p className="text-xs sm:text-sm text-[#556660] leading-relaxed">
                ބޮޑެތި އިވެންޓްތަކުގެ ލޮޖިސްޓިކްސް އަދި ޓެކްނިކަލް މަސައްކަތްތަކުގައި ފިރިހެން ވޮލަންޓިއަރުން ބައިވެރިވެއެވެ.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm sm:text-base text-[#1C2622]">ދަޢުވަތީ އަދި ތަރުބަވީ ބިންގާ</h4>
              <p className="text-xs sm:text-sm text-[#556660] leading-relaxed">
                އިޖުތިމާޢީ، ޢިލްމީ އަދި ދީނީ ހޭލުންތެރިކަން އިތުރުކޮށް ހެޔޮލަފާ ޖީލެއް ބިނާކުރުމުގެ މަތިވެރި ޢަޒުމް.
              </p>
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
                <span>އެހީތެރިވުމަށް</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1C2622]">
                ދީނީ އަދި އިޖުތިމާޢީ ޕްރޮގްރާމްތަކަށް ޞަދަޤާތް ކުރައްވާ
              </h3>
              <p className="text-xs sm:text-sm text-[#556660] max-w-xl leading-relaxed">
                މައިގަނޑު ގޮތެއްގައި ހެޔޮބިންގާގެ ހަރަކާތްތައް ހިންގަނީ ޢާންމުންނާއި ހެޔޮ އެދޭ ފަރާތްތަކުގެ ދީލަތި އެހީ އިންނެވެ.
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

          {/* Bank cards row: 2 main boxes (1 for BML, 1 for MIB) with MVR and USD inside */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {BANK_GROUPS.map((bank) => (
              <BankCard key={bank.id} bankGroup={bank} />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Area 1: Sisters Programs */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E9E5] shadow-xs space-y-3 text-right hover:border-[#1B6B52]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#1C2622] leading-snug">
              އުޚްތުންނަށް  ޚާއްސަ  ކުރެވޭ  ޕްރޮގްރާމްތައް
            </h4>
            <p className="text-xs text-[#556660] leading-relaxed">
             އުޚްތުންގެ  ނަފްސާނީ  އަދި ޖިސްމާނީ  ދުޅަހެޔޮކަމާއި  ފަންނީ  ހުނަރުތައް  ތަރައްޤީ  ކޮށް، ދީނީ  ހޭލުންތެރިކަން  އިތުރުކުރުމަށް  ހިންގޭ  އިންޓަރެކްޓިވް  ޕްރޮގްރާމްތައް
            </p>
          </div>

          {/* Area 2: Kids & Youth Programs */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E9E5] shadow-xs space-y-3 text-right hover:border-[#B83244]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FDF1F2] text-[#B83244] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#1C2622] leading-snug">
              ކުޑަކުދިންނާއި  ފުރާވަރު  ކުދިންނަށް  އަމާޒު  ކުރެވޭ  ޕްރޮގްރާމްތައް
            </h4>
            <p className="text-xs text-[#556660] leading-relaxed">
             ކުޑަކުދިންނާއި  ފުރާވަރުގެ  ކުދިން  ގަޔާވާނެ  ފަދަ  މައޫޟޫއުތަކަށް  އިންޓަރރެކްޓިވްކޮށް ހިންގޭ  ދީނީ  އަދި  އިޖްތިމާޢީ  ތަރުބަވީ  ޕްރޮގްރާމްތައް
            </p>
          </div>

          {/* Area 3: Deaf & Blind Special Needs Community */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E9E5] shadow-xs space-y-3 text-right hover:border-[#255D96]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#EDF4FC] text-[#255D96] flex items-center justify-center">
              <Tv className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#1C2622] leading-snug">
              އަޑުއިވުމާއި  ފެނުމުން  މަހްރޫމްވެފައިވާ  ޚާއްސަ  އެހީއަށް  ބޭނުންވާ  ފަރާތްތަކަށް  ހިންގޭ  ޕްރޮގްރާމްތައް
            </h4>
            <p className="text-xs text-[#556660] leading-relaxed">
             ޚާއްސަ  އެހީއަށް  ބޭނުންވާ ފަރާތްތަކުގެ  މެދުގައި  ދީނީ  ހޭލުންތެރިކަން  އިތުރުކުރުމަށް  ތައްޔާރުކުރެވި އިޝާރާތުގެ  ބަހުން ހުށަހަޅައިދީ  ގެނެސްދެވޭ  ޓީވީ  ޕްރޮގްރާމްތަކާއި  އެހެނިހެން  ޕްރޮގްރާމްތައް
            </p>
          </div>

          {/* Area 4: General Public Lectures */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E9E5] shadow-xs space-y-3 text-right hover:border-[#D97706]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FEF6EE] text-[#D97706] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#1C2622] leading-snug">
              ޢާންމުންނަށް  ބޭއްވޭ  ދަރުސްތައް
            </h4>
            <p className="text-xs text-[#556660] leading-relaxed">
             ޢާންމުރައްޔިތުންގެ  މެދުގައި  ހޭލުންތެރިކަން  އިތުރުކުރުމަށް  ރާވާ  ހިންގޭ  ދީނީ  އަދި  ތަރުބަވީ  ޕްރޮގްރާމްތައް
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
