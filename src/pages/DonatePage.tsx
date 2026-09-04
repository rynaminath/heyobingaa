import { useState } from 'react';
import { BANK_ACCOUNTS, NGO_CONTACT } from '../data/initialData';
import BankCard from '../components/BankCard';
import { 
  HeartHandshake, 
  MessageSquare, 
  Copy, 
  Check, 
  ShieldCheck, 
  Tv, 
  BookOpen, 
  Users, 
  Phone, 
  ArrowUpRight,
  HelpCircle
} from 'lucide-react';

interface DonatePageProps {
  onReceiptSubmitted?: (slip?: any) => void;
}

export default function DonatePage({}: DonatePageProps) {
  const [copiedViber, setCopiedViber] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);

  const sampleMessage = `އައްސަލާމު ޢަލައިކުމް. ހެޔޮބިންގާ ޖަމްޢިއްޔާއަށް އަޅުގަނޑު ޖަމާކުރި އެހީގެ ސްލިޕް ފޮނުވައިފީމެވެ.`;

  const handleCopyViberNumber = async () => {
    try {
      await navigator.clipboard.writeText(NGO_CONTACT.viberNumberFormatted);
      setCopiedViber(true);
      setTimeout(() => setCopiedViber(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopySample = async () => {
    try {
      await navigator.clipboard.writeText(sampleMessage);
      setCopiedSample(true);
      setTimeout(() => setCopiedSample(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-thaana">
      {/* Page Header */}
      <div className="bg-gradient-to-l from-[#142E26] via-[#1B6B52] to-[#123126] text-white p-8 sm:p-12 rounded-3xl border border-[#234A3E] shadow-xl text-right space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-[#EBF5F0] text-xs font-semibold backdrop-blur-xs">
          <HeartHandshake className="w-4 h-4 text-[#A7F3D0]" />
          <span>ހެޔޮބިންގާ އެހީގެ މަރުކަޒު (/ehee)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          ދީލަތި އެހީތެރިކަން ފޯރުކޮށްދެއްވާ
        </h1>
        <p className="text-sm sm:text-base text-[#D1E0D9] max-w-3xl leading-relaxed">
          ހެޔޮބިންގާގެ އެންމެހައި ދަޢުވަތީ އަދި ތަރުބަވީ މަޝްރޫޢުތައް ކުރިއަށް ގެންދެވެނީ ތިޔަ ހެޔޮއެދޭ ޢާންމު ރައްޔިތުންގެ ޞަދަޤާތާއި ދީލަތި އެހީއިންނެވެ. ފައިސާ ޖަމާކުރެއްވުމަށްފަހު ޓްރާންސްފަރ ސްލިޕް އަޅުގަނޑުމެންގެ ވައިބަރ ނަންބަރަށް ފޮނުއްވާލަދެއްވާށެވެ.
        </p>
      </div>

      {/* 3-Step Simple Process Banner */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E9E5] shadow-xs">
        <div className="text-right mb-6">
          <span className="text-xs font-bold text-[#1B6B52] uppercase tracking-wider block">
            އެހީ ފޯރުކޮށްދެއްވުމުގެ އުޞޫލު
          </span>
          <h2 className="text-2xl font-bold text-[#1C2622] mt-1">
            ފަސޭހަ 3 ފިޔަވަޅުން އެހީ ފޮނުއްވާ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] space-y-3 relative">
            <span className="w-8 h-8 rounded-xl bg-[#1B6B52] text-white font-bold text-sm flex items-center justify-center font-latin">
              1
            </span>
            <h3 className="text-base font-bold text-[#1C2622]">
              އެކައުންޓް ނަންބަރު ކޮޕީކުރައްވާ
            </h3>
            <p className="text-xs text-[#556660] leading-relaxed">
              ތިރީގައިވާ ހެޔޮބިންގާގެ ރަސްމީ BML ނުވަތަ MIB އެކައުންޓް ނަންބަރު އެއް ފިއްތުމުން ކޮޕީކޮށްލައްވާ.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] space-y-3 relative">
            <span className="w-8 h-8 rounded-xl bg-[#255D96] text-white font-bold text-sm flex items-center justify-center font-latin">
              2
            </span>
            <h3 className="text-base font-bold text-[#1C2622]">
              ބޭންކް އެޕުން ޓްރާންސްފަރ ކުރައްވާ
            </h3>
            <p className="text-xs text-[#556660] leading-relaxed">
              މޯބައިލް ބޭންކިންގ އެޕްލިކޭޝަން (BML / MIB) މެދުވެރިކޮށް ތިޔަބޭފުޅާ އެދިލައްވާ މިންވަރަކަށް ފައިސާ ޖަމާކުރައްވާ.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-[#EBF5F0] border border-[#C8E0D5] space-y-3 relative">
            <span className="w-8 h-8 rounded-xl bg-[#B83244] text-white font-bold text-sm flex items-center justify-center font-latin">
              3
            </span>
            <h3 className="text-base font-bold text-[#1C2622]">
              ސްލިޕް ވައިބަރ އަށް ފޮނުއްވާ
            </h3>
            <p className="text-xs text-[#556660] leading-relaxed">
              ޖަމާކުރެއްވި ސްލިޕް ހެޔޮބިންގާގެ ވައިބަރ ނަންބަރު <strong className="text-[#1B6B52] font-mono" dir="ltr">{NGO_CONTACT.viberNumberFormatted}</strong> އަށް ފޮނުއްވާ.
            </p>
          </div>
        </div>
      </section>

      {/* Main Action Grid: Bank Accounts & Viber Slip Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Bank Accounts Column */}
        <div className="lg:col-span-7 space-y-4 text-right">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#1B6B52] uppercase tracking-wider">
              އެކައުންޓް މަޢުލޫމާތު (2 ބޭންކް • 4 އެކައުންޓް)
            </span>
            <h3 className="text-2xl font-bold text-[#1C2622]">
              ރަސްމީ ބޭންކް އެކައުންޓްތައް
            </h3>
            <p className="text-xs text-[#556660]">
              ބީއެމްއެލް (BML) އަދި އެމްއައިބީ (MIB) ގެ ދިވެހި ރުފިޔާ އަދި ޑޮލަރު އެކައުންޓް.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {BANK_ACCOUNTS.map((acc) => (
              <BankCard key={acc.id} account={acc} />
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E2E9E5] text-xs text-[#1C2622] space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-[#1B6B52]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>ހާމަކަން ބޮޑު އިތުބާރު އަދި ރަޖިސްޓްރީ</span>
            </div>
            <p className="leading-relaxed text-[11px] text-[#556660]">
              ހެޔޮބިންގާ އަކީ ދިވެހި ސަރުކާރުގައި ޤާނޫނީ ގޮތުން ރަޖިސްޓްރީ ކުރެވިފައިވާ (<span dir="ltr" className="font-mono">15/01/2024</span>)، އެންމެހައި އެހީގެ ފައިސާގެ އޮޑިޓް ހެދި، ޤަވާޢިދުން ކަމާބެހޭ އިދާރާތަކަށް ހުށަހެޅޭ ޖަމްޢިއްޔާއެކެވެ.
            </p>
          </div>
        </div>

        {/* Right / Viber Slip Action Column */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E9E5] shadow-md text-right space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#EBF5F0] via-[#F4F9F6] to-white border border-[#C8E0D5] space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B6B52] text-white text-xs font-bold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>އޮފިޝަލް ވައިބަރ ސްލިޕް ހޮޓްލައިން</span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#1C2622]">
                ސްލިޕް ވައިބަރ ކުރައްވާ
              </h3>
              <p className="text-xs sm:text-sm text-[#556660] mt-1 leading-relaxed">
                އެހީ ޖަމާކުރެއްވުމަށްފަހު، ރެކޯޑް ބެލެހެއްޓުމަށާއި ކަށަވަރުކުރުމަށްޓަކައި ޓްރާންސްފަރ ސްލިޕް ހެޔޮބިންގާގެ ވައިބަރ ނަންބަރަށް ފޮނުއްވާލަދެއްވާށެވެ.
              </p>
            </div>

            {/* Direct Big Viber Phone Display */}
            <div className="bg-white rounded-2xl p-4 border border-[#C8E0D5] flex items-center justify-between shadow-xs">
              <div className="text-right">
                <span className="text-[11px] text-[#556660] block">ވައިބަރ ނަންބަރު (Viber Number)</span>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#1B6B52] tracking-wider" dir="ltr">
                  {NGO_CONTACT.viberNumberFormatted}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyViberNumber}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#EBF5F0] hover:bg-[#C8E0D5] text-[#1B6B52] transition-all"
              >
                {copiedViber ? (
                  <>
                    <Check className="w-4 h-4 text-[#1B6B52]" />
                    <span>ކޮޕީ ވެއްޖެ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#1B6B52]" />
                    <span>ނަންބަރު ކޮޕީ</span>
                  </>
                )}
              </button>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={NGO_CONTACT.viberLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-5 rounded-xl bg-[#7360F2] hover:bg-[#604CE2] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#7360F2]/25 transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>ވައިބަރ އިން ސްލިޕް ފޮނުއްވާ (Open Viber)</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={`tel:${NGO_CONTACT.viberNumber}`}
                className="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#1C2622] border border-[#E2E9E5] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#1B6B52]" />
                <span>ގުޅުއްވުމަށް</span>
              </a>
            </div>
          </div>

          {/* Sample Message Copier */}
          <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] space-y-2.5 text-right">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2622]">ވައިބަރ މެސެޖު ނަމޫނާ (Sample Message):</span>
              <button
                type="button"
                onClick={handleCopySample}
                className="text-xs text-[#1B6B52] hover:underline font-bold flex items-center gap-1"
              >
                {copiedSample ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSample ? 'ކޮޕީ ވެއްޖެ' : 'މެސެޖު ކޮޕީކުރައްވާ'}</span>
              </button>
            </div>
            <p className="p-3 rounded-xl bg-white border border-[#E2E9E5] text-xs text-[#556660] leading-relaxed">
              "{sampleMessage}"
            </p>
            <p className="text-[11px] text-[#8BAEA0]">
              މި މެސެޖު ކޮޕީކުރެއްވުމަށްފަހު، ސްލިޕްގެ ފޮޓޯއާއެކު ވައިބަރ އިން ފޮނުއްވާލެވޭނެއެވެ.
            </p>
          </div>

          {/* Quick FAQ / Note */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2E9E5] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1C2622]">
              <HelpCircle className="w-4 h-4 text-[#255D96]" />
              <span>އެހީ ޔަޤީންކުރުމާއި ޝުކުރު ދެންނެވުން</span>
            </div>
            <p className="text-xs text-[#556660] leading-relaxed">
              ވައިބަރ އަށް ސްލިޕް ފޮނުއްވުމުން، ހެޔޮބިންގާގެ ޓީމުން އެހީ ބަލައިގަނެ، ތިޔަބޭފުޅާއަށް ޖަވާބު އަރުވާނެއެވެ. އެހީތެރިވެދެއްވި ކޮންމެ ފަރާތަކަށް މާތް ﷲ ހެޔޮ ޖަޒާ މިންވަރު ކުރައްވާށި.
            </p>
          </div>
        </div>
      </div>

      {/* How Funds Support the Mission */}
      <section className="space-y-6 text-right pt-6">
        <div>
          <span className="text-xs font-bold text-[#1B6B52] uppercase tracking-wider">
            އެހީގެ ބޭނުންކުރެވޭ ގޮތް
          </span>
          <h2 className="text-2xl font-bold text-[#1C2622] mt-1">
            ތިޔަބޭފުޅާގެ އެހީ ޚަރަދުކުރެވޭ މައިގަނޑު ދާއިރާތައް
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Deaf Accessibility */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E9E5] shadow-xs space-y-3 text-right hover:border-[#255D96]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#EDF4FC] text-[#255D96] flex items-center justify-center">
              <Tv className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1C2622]">
              ބީރު މުޖުތަމަޢަށް ޚާއްޞަ ޓީވީ ޕްރޮޑަކްޝަން
            </h3>
            <p className="text-xs text-[#556660] leading-relaxed">
              ދާރެސް ޓީވީއާ ގުޅިގެން އިޝާރާތުގެ ބަހުރުވައިން ދީނީ ޢިލްމު ގެނެސްދޭ ސިލްސިލާ ޕްރޮގްރާމްތައް އުފެއްދުމާއި، ސައިން ލެންގުއޭޖް އިންޓަޕްރިޓަރުންގެ ޚަރަދުތައް ހަމަޖެއްސުން.
            </p>
          </div>

          {/* Pillar 2: Educational Workshops */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E9E5] shadow-xs space-y-3 text-right hover:border-[#1B6B52]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1C2622]">
              ކަނބަލުންނާއި ކުދިންގެ ތަޢުލީމީ ވޯކްޝޮޕްތައް
            </h3>
            <p className="text-xs text-[#556660] leading-relaxed">
              އާދަކާދައިގެ ތަޤްރީރުތަކާ ޚިލާފަށް ބާއްވާ އިންޓްރެކްޓިވް ސެޝަންތަކަށް ބޭނުންވާ ތަކެއްޗާއި، ތަމްރީނު ފޮތްތަކާއި، ހޯލްތަކުގެ އިންތިޒާމުތައް ހަމަޖެއްސުން.
            </p>
          </div>

          {/* Pillar 3: Community Dawah */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E9E5] shadow-xs space-y-3 text-right hover:border-[#B83244]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FDF1F2] text-[#B83244] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1C2622]">
              ޢާންމު ދަޢުވަތާއި އިޖުތިމާޢީ އެހީ
            </h3>
            <p className="text-xs text-[#556660] leading-relaxed">
              މިނިސްޓްރީ އޮފް އިސްލާމިކް އެފެއާޒް ހޯލް ފަދަ ބޮޑެތި މާލަންތަކުގައި ބޭއްވޭ ޤައުމީ ދަރުސްތަކުގެ ލޮޖިސްޓިކްސްއާއި، ބައިނަލްއަޤްވާމީ ކާރިސާތަކުގެ އެހީ.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
