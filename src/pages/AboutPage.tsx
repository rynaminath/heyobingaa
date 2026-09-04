import { 
  Users, 
  Calendar, 
  ShieldCheck, 
  Heart, 
  Compass, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { NavigationTab } from '../types';

interface AboutPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const pillars = [
    {
      title: 'ދީނީ އަދި ދަޢުވަތީ (Religious & Dawah)',
      desc: 'ޞައްޙަ އިސްލާމީ ޢަޤީދާއާއި ޢިލްމު ފެތުރުމާއި، ބޮޑެތި ދަރުސްތަކާއި ޓީވީ ޕްރޮގްރާމްތައް އިންތިޒާމުކުރުން.'
    },
    {
      title: 'ތަޢުލީމީ އަދި ތަރުބިއްޔަތު (Educational & Nurturing)',
      desc: 'ކަނބަލުންނާއި، ތުއްތުކުދިންނާއި، ފުރާވަރުގެ ޒުވާނުންނަށް ޚާއްޞަ ޒަމާނީ އިންޓްރެކްޓިވް ވޯކްޝޮޕްތަކާއި ކޭމްޕްތައް.'
    },
    {
      title: 'އިޖުތިމާޢީ އަދި އިންސާނީ (Social & Humanitarian)',
      desc: 'އެހީތެރިކަމަށް ބޭނުންވާ ޢާއިލާތަކަށް އެހީވުމާއި، ބައިނަލްއަޤްވާމީ އަދި ޤައުމީ ކާރިސާތަކުގައި ޖޮއިންޓް އޮޕަރޭޝަންސް ހިންގުން.'
    },
    {
      title: 'ޚާއްޞަ އެހީއާއި ބީރު މުޖުތަމަޢު (Accessibility & Inclusion)',
      desc: 'އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ ފަރާތްތަކަށް އިޝާރާތުގެ ބަހުރުވައިން ދީނީ ޢިލްމު ފޯރުކޮށްދޭ ޓީވީ ކޮންޓެންޓް އުފެއްދުން.'
    },
    {
      title: 'ތަރައްޤީއާއި ޓެކްނިކަލް (Developmental & Technical)',
      desc: 'ދަޢުވަތީ މައިދާނުގައި ޓެކްނޮލޮޖީއާއި މީޑިއާގެ ޒަމާނީ ވަސީލަތްތައް ބޭނުންކޮށް، ދެމެހެއްޓެނިވި ހިންގުމުގެ ނިޒާމު ޤާއިމުކުރުން.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14 font-thaana">
      {/* Page Header */}
      <div className="text-right space-y-3 bg-gradient-to-l from-[#1F1C1B] via-[#2D2926] to-[#171514] text-white p-8 sm:p-12 rounded-3xl shadow-xl border border-[#38332F]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B2E34]/50 border border-[#8B2E34] text-[#F9EDED] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#F27D26]" />
          <span>ރަސްމީ ރަޖިސްޓްރޭޝަން: 15 ޖެނުއަރީ 2024</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          ހެޔޮބިންގާ ޖަމްޢިއްޔާގެ ތަޢާރަފް
        </h1>
        <p className="text-sm sm:text-base text-[#D8D2C7] max-w-3xl leading-relaxed pt-1">
          އުޚުތުންގެ އިސްނެގުމާއި ލީޑަރޝިޕްގެ ދަށުން، މުޖުތަމަޢުގައި ހެޔޮލަފާ ޖީލެއް ބިނާކުރުމަށްޓަކައި ވޭތުވެދިޔަ 13 އަހަރުގެ މައިދާނީ ތަޖުރިބާގެ މައްޗަށް ބިނާކުރެވިފައިވާ ޖަމްޢިއްޔާއެއް.
        </p>
      </div>

      {/* Core Profile & Heritage (13+ years) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DC] shadow-xs space-y-5 text-right">
          <div className="flex items-center gap-2 text-[#8B2E34] font-bold text-sm">
            <Calendar className="w-4 h-4" />
            <span>ޖަމިއްޔާގެ ފެށުމާއި ތާރީޚު</span>
          </div>

          <h2 className="text-2xl font-bold text-[#2D2926] leading-snug">
            13+ އަހަރުގެ ދަޢުވަތީ ތަޖުރިބާއިން ރަސްމީ ބިންގަލަކަށް
          </h2>

          <p className="text-sm text-[#6E6963] leading-relaxed">
            ހެޔޮބިންގާ ރަސްމީގޮތުން ވުޖޫދަށް އައީ <strong>15 ޖެނުއަރީ 2024</strong> ގައެވެ. ނަމަވެސް، މި ޖަމްޢިއްޔާ އުފަންވެގެން އައީ އިސްލާމީ ދަޢުވަތާއި، އިޖުތިމާޢީ އެހީތެރިކަމާއި، ތަޢުލީމީ މައިދާނުގައި 13 އަހަރަށްވުރެ ގިނަ ދުވަހު މެދުކެނޑުމެއްނެތި މަސައްކަތްކުރަމުން އައި ކަނބަލުންތަކެއްގެ މިންނެތް މަސައްކަތުންނެވެ.
          </p>

          <p className="text-sm text-[#6E6963] leading-relaxed">
            ރާއްޖޭގެ އެކި ކަންކޮޅުތަކުގައި ބޭއްވުނު ދަރުސްތަކާއި، ކަނބަލުންނަށް ޚާއްޞަކުރެވުނު މުރާޖަޢާ ވޯކްޝޮޕްތަކާއި، ތުއްތުކުދިންގެ އިސްލާމީ ތަރުބިއްޔަތު ޙަރަކާތްތަކަކީ މި ޖަމްޢިއްޔާގެ މައިގަނޑު އަސާސެވެ.
          </p>

          <div className="pt-4 border-t border-[#E8E4DC] grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#FCFBF8] border border-[#E8E4DC]">
              <span className="text-xs text-[#6E6963] block">ރަޖިސްޓްރީ ކުރެވުނު ތާރީޚް</span>
              <span className="font-bold text-[#8B2E34] text-sm">15 ޖެނުއަރީ 2024</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FCFBF8] border border-[#E8E4DC]">
              <span className="text-xs text-[#6E6963] block">މައިދާނީ ޚިދުމަތް</span>
              <span className="font-bold text-[#8B2E34] text-sm">13+ އަހަރުގެ ތަޖުރިބާ</span>
            </div>
          </div>
        </div>

        {/* Governance & Leadership Dynamic (Sisters + Brothers) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#FCFBF8] via-[#F9EDED]/40 to-white rounded-3xl p-6 sm:p-8 border border-[#E8E4DC] shadow-xs space-y-6 text-right flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F9EDED] text-[#8B2E34] text-xs font-bold">
              <Users className="w-4 h-4 text-[#8B2E34]" />
              <span>ހިންގުމުގެ އޮނިގަނޑާއި ވޮލަންޓިއަރ ސަޤާފަތް</span>
            </div>

            <h3 className="text-xl font-bold text-[#2D2926]">
              އުޚުތުންގެ ލީޑަރޝިޕް & އަޚުންގެ އެހީތެރިކަން
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-[#2D2926] leading-relaxed">
              <div className="p-3.5 rounded-xl bg-white border border-[#E8E4DC] shadow-xs space-y-1">
                <span className="font-bold text-[#8B2E34] block">1. ފުރިހަމަ އުޚުތުންގެ ޖަމްޢިއްޔާއެއް (Sisters-Led)</span>
                <p className="text-[#6E6963] text-xs">
                  ޖަމިއްޔާގެ ހިންގާ ކޮމިޓީއާއި، ރޭވުންތެރިކަމާއި، ޕްރޮގްރާމްތަކުގެ ކޮންޓެންޓް ފަރުމާކުރުމުގެ އެންމެހައި ކަންކަން ހިންގަނީ ޢިލްމީ އަދި ޤާބިލު އުޚުތުންނެވެ.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E8E4DC] shadow-xs space-y-1">
                <span className="font-bold text-[#2D2926] block">2. އަޚުންގެ ޙާލަތާ ގުޅޭ އެހީތެރިކަން (Male Volunteers)</span>
                <p className="text-[#6E6963] text-xs">
                  އިވެންޓްތަކުގެ ލޮޖިސްޓިކްސް، ބަރު ތަކެތި އުފުލުމާއި، ޓެކްނިކަލް އޯޑިއޯ/ވީޑިއޯ ސެޓަޕް އަދި ބޮޑެތި ދަރުސްތަކުގެ ސެކިއުރިޓީ ބެލެހެއްޓުމުގައި ފިރިހެން ވޮލަންޓިއަރުން ބައިވެރިވެއެވެ.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('volunteer')}
              className="w-full py-2.5 rounded-xl bg-[#8B2E34] hover:bg-[#702328] text-white font-bold text-xs shadow-sm transition-colors text-center"
            >
              ވޮލަންޓިއަރ ޓީމާ ގުޅިވަޑައިގަންނަވާ
            </button>
          </div>
        </div>
      </section>

      {/* Vision & Mission (މަޤުސަދު) */}
      <section className="bg-[#1F1C1B] text-white rounded-3xl p-8 sm:p-12 border border-[#38332F] shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-right space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B2E34]/30 border border-[#8B2E34]/50 text-[#F9EDED] text-xs font-bold">
              <Compass className="w-4 h-4 text-[#F27D26]" />
              <span>ތަޞައްވުރު (Vision)</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold leading-snug text-white">
              ހެޔޮ ޖީލެއް، ހެޔޮލަފާ މުޖުތަމަޢެއް
            </h3>
            <p className="text-sm text-[#D8D2C7] leading-relaxed">
              އިސްލާމީ ރިވެތި އުޞޫލުތަކުގެ މައްޗަށް ބިނާވެފައިވާ، އަޚްލާޤީ ގޮތުން ހަރުދަނާ، އޯގާތެރި، އަދި ދެދުނިޔޭގެ ބާއްޖަވެރިކަމަށް ވާޞިލުވާނޭ ހެޔޮލަފާ ޖީލެއް ދިވެހި ފަސްގަނޑުގައި ބިނާކުރުން.
            </p>
          </div>

          <div className="text-right space-y-4 md:border-r md:border-[#38332F] md:pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F27D26]/20 border border-[#F27D26]/30 text-[#F27D26] text-xs font-bold">
              <Sparkles className="w-4 h-4 text-[#F27D26]" />
              <span>މަޤުޞަދު (Mission)</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold leading-snug text-white">
              ފަސް ދާއިރާއަކުން ޤައުމީ ޚިދުމަތް
            </h3>
            <p className="text-sm text-[#D8D2C7] leading-relaxed">
              ހެޔޮ ޖީލެއް ބިނާކުރުމާއި ހެޔޮލަފާ މުޖުތަމަޢެއް ޤާއިމުކުރުމަށްޓަކައި އިޖުތިމާޢީ، ތަޢުލީމީ، ދީނީ، ތަރައްޤީގެ، އަދި ޓެކްނިކަލް ގޮތުން ކުރެވެން ހުރި އެންމެހައި މަސައްކަތްތައް އިޚްލާޞްތެރިކަމާއެކު ކުރުން.
            </p>
          </div>
        </div>
      </section>

      {/* 5 Core Pillars */}
      <section className="space-y-6 text-right">
        <div>
          <span className="text-xs font-bold text-[#8B2E34] uppercase tracking-wider">
            މަސައްކަތުގެ އަސާސްތައް
          </span>
          <h3 className="text-2xl font-bold text-[#2D2926] mt-1">
            ހެޔޮބިންގާގެ މައިގަނޑު 5 ދާއިރާ
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#E8E4DC] shadow-xs space-y-3 hover:border-[#8B2E34]/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#F9EDED] text-[#8B2E34] font-bold text-xs flex items-center justify-center font-mono">
                0{idx + 1}
              </div>
              <h4 className="font-bold text-[#2D2926] text-base">{pillar.title}</h4>
              <p className="text-xs text-[#6E6963] leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
