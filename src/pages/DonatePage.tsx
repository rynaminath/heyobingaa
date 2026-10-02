import { useState, useRef } from 'react';
import { BANK_GROUPS, NGO_CONTACT } from '../data/initialData';
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
  HelpCircle,
  UploadCloud,
  Lock,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { submitDonationSlip } from '../services/firestoreService';

export default function DonatePage() {
  const [methodTab, setMethodTab] = useState<'upload' | 'viber'>('upload');
  const [copiedViber, setCopiedViber] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);

  // Upload Form State
  const [selectedBankKey, setSelectedBankKey] = useState<string>('BML-MVR');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'MVR' | 'USD'>('MVR');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [slipImageBase64, setSlipImageBase64] = useState<string | null>(null);
  const [slipFileName, setSlipFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleMessage = `އައްސަލާމު ޢަލައިކުމް. ހެޔޮބިންގާ ޖަމްޢިއްޔާއަށް އަޅުގަނޑު ޖަމާކުރި އެހީގެ ސްލިޕް ފޮނުވައިފީމެވެ.`;

  const bankOptions = [
    { key: 'BML-MVR', label: 'ބީ.އެމް.އެލް (BML) - ދިވެހި ރުފިޔާ (MVR)', num: '7730000632367', curr: 'MVR' as const },
    { key: 'BML-USD', label: 'ބީ.އެމް.އެލް (BML) - ޔޫ.އެސް ޑޮލަރު (USD)', num: '7730000632368', curr: 'USD' as const },
    { key: 'MIB-MVR', label: 'އެމް.އައި.ބީ (MIB) - ދިވެހި ރުފިޔާ (MVR)', num: '90101130007801000', curr: 'MVR' as const },
    { key: 'MIB-USD', label: 'އެމް.އައި.ބީ (MIB) - ޔޫ.އެސް ޑޮލަރު (USD)', num: '90101130007802000', curr: 'USD' as const }
  ];

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

  // Compress image to canvas data URL under 150KB JPEG
  const handleFileChange = (file: File) => {
    if (!file) return;
    setSlipFileName(file.name);
    setSubmitError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1000;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setSlipImageBase64(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
        setSlipImageBase64(compressedDataUrl);
      };
      img.onerror = () => {
        setSubmitError('ފޮޓޯ ބަރުކުރުމުގައި މައްސަލައެއް ދިމާވެއްޖެ.');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setSubmitError('ފައިލް ކިޔުމުގައި މައްސަލައެއް ދިމާވެއްޖެ.');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setSubmitError('އިލްތިމާސް: ޞައްޙަ ޢަދަދެއް ލިޔުއްވާ');
      return;
    }

    if (!isAnonymous && !donorName.trim()) {
      setSubmitError('އިލްތިމާސް: ތިޔަބޭފުޅާގެ ނަން ލިޔުއްވާ (ނުވަތަ ސިއްރު ޞަދަޤާތެއްގެ ގޮތުގައި ޚިޔާރުކުރައްވާ)');
      return;
    }

    const selectedOpt = bankOptions.find((b) => b.key === selectedBankKey) || bankOptions[0];

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await submitDonationSlip({
        donorName: isAnonymous ? 'ސިއްރު ފަރާތެއް (Anonymous)' : donorName.trim(),
        phone: phone.trim() || undefined,
        amount: numAmount,
        currency,
        bankAccount: `${selectedOpt.label} - ${selectedOpt.num}`,
        referenceNumber: referenceNumber.trim() || undefined,
        slipImageUrl: slipImageBase64 || undefined,
        slipFileName: slipFileName || undefined,
        notes: notes.trim() || undefined,
        date: new Date().toISOString().split('T')[0],
        isAnonymous
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setSubmitError('ސްލިޕް ހުށަހެޅުމުގައި މައްސަލައެއް ދިމާވެއްޖެ. އަލުން މަސައްކަތްކޮށްލައްވާ ނުވަތަ ވައިބަރ އިން ފޮނުއްވާ.');
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
          ހެޔޮބިންގާގެ އެންމެހައި ދަޢުވަތީ އަދި ތަރުބަވީ މަޝްރޫޢުތައް ކުރިއަށް ގެންދެވެނީ ތިޔަ ހެޔޮއެދޭ ޢާންމު ރައްޔިތުންގެ ޞަދަޤާތާއި ދީލަތި އެހީއިންނެވެ. ފައިސާ ޖަމާކުރެއްވުމަށްފަހު ސީދާ ވެބްސައިޓަށް ސްލިޕް އަޕްލޯޑްކުރައްވާ ނުވަތަ ވައިބަރ ނަންބަރަށް ފޮނުއްވާލަދެއްވާށެވެ.
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
              ސްލިޕް ހުށަހަޅުއްވާ (ވެބް ނުވަތަ ވައިބަރ)
            </h3>
            <p className="text-xs text-[#556660] leading-relaxed">
              ސީދާ ވެބްސައިޓަށް އަޕްލޯޑްކުރައްވާ، ނުވަތަ ވައިބަރ ނަންބަރު <strong className="text-[#1B6B52] font-mono" dir="ltr">{NGO_CONTACT.viberNumberFormatted}</strong> އަށް ފޮނުއްވާ (ނަން ހާމަނުކޮށް ސިއްރު ޞަދަޤާތެއްގެ ގޮތުގައިވެސް ހުށަހެޅޭނެ).
            </p>
          </div>
        </div>
      </section>

      {/* Main Action Grid: Bank Accounts & Slip Upload/Viber */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Bank Accounts Column */}
        <div className="lg:col-span-6 space-y-4 text-right">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#1B6B52] uppercase tracking-wider">
              އެކައުންޓް މަޢުލޫމާތު (2 މައި ބޭންކް: BML އަދި MIB)
            </span>
            <h3 className="text-2xl font-bold text-[#1C2622]">
              ރަސްމީ ބޭންކް އެކައުންޓްތައް
            </h3>
            <p className="text-xs text-[#556660]">
              ބީއެމްއެލް (BML) އަދި އެމްއައިބީ (MIB) ގެ ދިވެހި ރުފިޔާ (MVR) އަދި ޑޮލަރު (USD) އެކައުންޓްތައް.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {BANK_GROUPS.map((bank) => (
              <BankCard key={bank.id} bankGroup={bank} />
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

        {/* Right / Dual Action (Upload Slip or Viber) Column */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E9E5] shadow-md text-right space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B6B52] text-white text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>ސްލިޕް ހުށަހެޅުއްވުމުގެ އިޚްތިޔާރުތައް</span>
            </div>
            <h3 className="text-2xl font-bold text-[#1C2622]">
              ސްލިޕް ފޮނުއްވާނެ ގޮތް އިޚްތިޔާރުކުރައްވާ
            </h3>
            <p className="text-xs text-[#556660] leading-relaxed">
              ތިޔަބޭފުޅާއަށް ފަސޭހަ ގޮތަކަށް ސްލިޕް ފޮނުއްވޭނެއެވެ: ވެބްސައިޓަށް އަޕްލޯޑްކުރެއްވުން، ނުވަތަ ވައިބަރ އިން ފޮނުއްވުން. އަދި ނަން ހާމަނުކޮށް ސިއްރު ޞަދަޤާތެއްގެ ގޮތުގައިވެސް ހުށަހެޅުއްވޭނެއެވެ.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F4F7F5] rounded-2xl border border-[#E2E9E5]">
            <button
              type="button"
              onClick={() => setMethodTab('upload')}
              className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                methodTab === 'upload'
                  ? 'bg-white text-[#1B6B52] shadow-sm border border-[#E2E9E5]'
                  : 'text-[#556660] hover:text-[#1C2622]'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>ވެބްސައިޓަށް އަޕްލޯޑް (Upload)</span>
            </button>

            <button
              type="button"
              onClick={() => setMethodTab('viber')}
              className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                methodTab === 'viber'
                  ? 'bg-[#7360F2] text-white shadow-sm'
                  : 'text-[#556660] hover:text-[#1C2622]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>ވައިބަރ އިން ފޮނުއްވާ (Viber)</span>
            </button>
          </div>

          {/* METHOD 1: UPLOAD TO WEBSITE */}
          {methodTab === 'upload' && (
            submitSuccess ? (
              <div className="p-8 rounded-2xl bg-[#EBF5F0] border border-[#C8E0D5] text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1B6B52] text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-[#1C2622]">ޝުކުރިއްޔާ! ހެޔޮ ޖަޒާ މިންވަރު ކުރައްވާށި</h4>
                <p className="text-xs text-[#556660] leading-relaxed">
                  ތިޔަބޭފުޅާ ހުށަހެޅުއްވި އެހީގެ ސްލިޕް ހެޔޮބިންގާގެ ސިސްޓަމަށް ކާމިޔާބުކަމާއެކު ލިބިއްޖެއެވެ.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setAmount('');
                    setDonorName('');
                    setPhone('');
                    setReferenceNumber('');
                    setNotes('');
                    setSlipImageBase64(null);
                    setSlipFileName('');
                  }}
                  className="px-5 py-2 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  އިތުރު ސްލިޕެއް ހުށަހަޅުއްވާ
                </button>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#B83244] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Target Bank Account Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    ފައިސާ ޖަމާކުރެއްވި އެކައުންޓް:
                  </label>
                  <select
                    value={selectedBankKey}
                    onChange={(e) => {
                      setSelectedBankKey(e.target.value);
                      const opt = bankOptions.find((b) => b.key === e.target.value);
                      if (opt) setCurrency(opt.curr);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] bg-white text-xs font-thaana focus:outline-none focus:border-[#1B6B52]"
                  >
                    {bankOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label} — {opt.num}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount and Currency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1C2622] block">
                      ޖަމާކުރެއްވި ޢަދަދު:
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="1"
                      required
                      placeholder="މިސާލަކަށް: 500"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs font-mono focus:outline-none focus:border-[#1B6B52]"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1C2622] block">
                      ފައިސާގެ ބާވަތް (Currency):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrency('MVR')}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          currency === 'MVR'
                            ? 'bg-[#1B6B52] text-white border-[#1B6B52]'
                            : 'bg-white text-[#556660] border-[#E2E9E5]'
                        }`}
                      >
                        ދިވެހި ރުފިޔާ (MVR)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrency('USD')}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          currency === 'USD'
                            ? 'bg-[#1B6B52] text-white border-[#1B6B52]'
                            : 'bg-white text-[#556660] border-[#E2E9E5]'
                        }`}
                      >
                        ޑޮލަރު (USD)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Anonymous Toggle Checkbox */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1B6B52] focus:ring-[#1B6B52] cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C2622]">
                      <Lock className="w-3.5 h-3.5 text-[#1B6B52]" />
                      <span>ސިއްރު ޞަދަޤާތެއް (Anonymous - ނަން ހާމަނުކުރަން)</span>
                    </div>
                  </label>
                  <p className="text-[11px] text-[#556660] pr-6 leading-relaxed">
                    {isAnonymous
                      ? 'މި ޚިޔާރު ނެންގެވުމުން ތިޔަބޭފުޅާގެ ނަމާއި ފޯނު ނަންބަރު އެއްވެސް ލިސްޓެއްގައި ހާމައެއް ނުކުރެވޭނެއެވެ (ސިއްރު ޞަދަޤާތް).'
                      : 'ތިޔަބޭފުޅާގެ ނަމާއި ފޯނު ނަންބަރު ލިޔުއްވުމަށް، ނުވަތަ ސިއްރުކުރައްވަން މަތީގައިވާ ގޮޅީގައި ފާހަގަޖައްސަވާ.'}
                  </p>
                </div>

                {/* Donor Name & Phone (Only if NOT anonymous) */}
                {!isAnonymous ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#1C2622] block">
                        ތިޔަބޭފުޅާގެ ނަން:
                      </label>
                      <input
                        type="text"
                        required={!isAnonymous}
                        placeholder="ފުރިހަމަ ނަން"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs font-thaana focus:outline-none focus:border-[#1B6B52]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#1C2622] block">
                        ފޯނު ނަންބަރު:
                      </label>
                      <input
                        type="tel"
                        placeholder="7XXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs font-mono focus:outline-none focus:border-[#1B6B52]"
                        dir="ltr"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#556660] block">
                      އިޚްތިޔާރީ ފޯނު ނަންބަރު (ގުޅަން ބޭނުންފުޅުނަމަ އެކަނި):
                    </label>
                    <input
                      type="tel"
                      placeholder="އިޚްތިޔާރީ ފޯނު ނަންބަރު"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs font-mono focus:outline-none focus:border-[#1B6B52]"
                      dir="ltr"
                    />
                  </div>
                )}

                {/* Slip File Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1C2622] block">
                    ޓްރާންސްފަރ ސްލިޕްގެ ފޮޓޯ / ފައިލް:
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />

                  {slipImageBase64 ? (
                    <div className="p-3 rounded-2xl border border-[#C8E0D5] bg-[#EBF5F0] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img 
                          src={slipImageBase64} 
                          alt="Uploaded Slip" 
                          className="w-12 h-12 object-cover rounded-xl border border-white shadow-xs shrink-0" 
                        />
                        <div className="text-right overflow-hidden">
                          <span className="text-xs font-bold text-[#1B6B52] block truncate">
                            {slipFileName || 'ސްލިޕް ފޮޓޯ'}
                          </span>
                          <span className="text-[10px] text-[#556660]">ފައިލް އަޕްލޯޑް ވެއްޖެ</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSlipImageBase64(null);
                          setSlipFileName('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="px-2.5 py-1 text-xs text-[#B83244] bg-white rounded-lg border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        ބަދަލުކުރައްވާ
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-5 rounded-2xl border-2 border-dashed border-[#C8E0D5] hover:border-[#1B6B52] bg-[#F8FAF9] hover:bg-[#EBF5F0]/60 transition-all text-center cursor-pointer space-y-1"
                    >
                      <UploadCloud className="w-7 h-7 text-[#1B6B52] mx-auto opacity-80" />
                      <span className="text-xs font-bold text-[#1B6B52] block">
                        ސްލިޕްގެ ފޮޓޯ ނެންގެވުމަށް ނުވަތަ އަޕްލޯޑްކުރެއްވުމަށް ފިއްތާލައްވާ
                      </span>
                      <span className="text-[11px] text-[#556660] block">
                        PNG, JPG, JPEG (އޮޓޮމެޓިކުން ފަސޭހައިން ބަރުކޮށްދޭނެ)
                      </span>
                    </div>
                  )}
                </div>

                {/* Reference Number & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#556660] block">
                      ބޭންކް ރެފަރެންސް ނަންބަރު (އިޚްތިޔާރީ):
                    </label>
                    <input
                      type="text"
                      placeholder="Ref / Txn ID"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs font-mono focus:outline-none focus:border-[#1B6B52]"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#556660] block">
                      އިތުރު ނޯޓް / ޞަދަޤާތުގެ ނިޔަތް:
                    </label>
                    <input
                      type="text"
                      placeholder="މިސާލަކަށް: ދާރިސް ޓީވީ ސައިން ލެންގުއޭޖަށް"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs font-thaana focus:outline-none focus:border-[#1B6B52]"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>ސްލިޕް ފޮނުވެނީ...</span>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>ސްލިޕް ހުށަހަޅުއްވާ (Submit Slip to Website)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )
          )}

          {/* METHOD 2: SEND VIA VIBER */}
          {methodTab === 'viber' && (
            <div className="space-y-5">
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
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#EBF5F0] hover:bg-[#C8E0D5] text-[#1B6B52] transition-all cursor-pointer"
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
                    className="text-xs text-[#1B6B52] hover:underline font-bold flex items-center gap-1 cursor-pointer"
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
          )}
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
              އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ ކުދިންނާއި ފަރާތްތަކަށް ޚާއްޞަ ޓީވީ ޕްރޮޑަކްޝަން
            </h3>
            <p className="text-xs sm:text-sm text-[#556660] leading-relaxed">
              ދާރިސް ޓީވީއާ ގުޅިގެން އިޝާރާތުގެ ބަހުރުވައިން ދީނީ ޢިލްމު ގެނެސްދޭ ސިލްސިލާ ޕްރޮގްރާމްތައް އުފެއްދުމާއި، ސައިން ލެންގުއޭޖް އިންޓަޕްރިޓަރުންގެ ޚަރަދުތައް ހަމަޖެއްސުން.
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
