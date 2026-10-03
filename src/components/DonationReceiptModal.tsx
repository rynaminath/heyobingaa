import { useState, useRef } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  MessageSquare, 
  Phone, 
  HeartHandshake, 
  ArrowUpRight, 
  UploadCloud, 
  ShieldCheck, 
  FileText,
  AlertCircle,
  Sparkles,
  Lock
} from 'lucide-react';
import { BANK_GROUPS, NGO_CONTACT } from '../data/initialData';
import { submitDonationSlip } from '../services/firestoreService';

interface DonationReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationReceiptModal({
  isOpen,
  onClose
}: DonationReceiptModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'viber'>('upload');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [copiedViber, setCopiedViber] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Form states for uploading slip directly to website
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

  if (!isOpen) return null;

  const defaultMessage = `އައްސަލާމު ޢަލައިކުމް. ހެޔޮބިންގާ ޖަމްޢިއްޔާއަށް އަޅުގަނޑު ޖަމާކުރި އެހީގެ ސްލިޕް ޙިއްޞާކޮށްލީމެވެ.`;

  // Bank accounts map for easy selection
  const bankOptions = [
    { key: 'BML-MVR', label: 'ބީ.އެމް.އެލް (BML) - ދިވެހި ރުފިޔާ (MVR)', num: '7730000632367', curr: 'MVR' as const },
    { key: 'BML-USD', label: 'ބީ.އެމް.އެލް (BML) - ޔޫ.އެސް ޑޮލަރު (USD)', num: '7730000632368', curr: 'USD' as const },
    { key: 'MIB-MVR', label: 'އެމް.އައި.ބީ (MIB) - ދިވެހި ރުފިޔާ (MVR)', num: '90101130007801000', curr: 'MVR' as const },
    { key: 'MIB-USD', label: 'އެމް.އައި.ބީ (MIB) - ޔޫ.އެސް ޑޮލަރު (USD)', num: '90101130007802000', curr: 'USD' as const }
  ];

  const handleCopyAccount = async (accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccount(accountNumber);
      setTimeout(() => setCopiedAccount(null), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyViber = async () => {
    try {
      await navigator.clipboard.writeText(NGO_CONTACT.viberNumberFormatted);
      setCopiedViber(true);
      setTimeout(() => setCopiedViber(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(defaultMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
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
        phone: isAnonymous ? (phone.trim() || undefined) : (phone.trim() || undefined),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E2E9E5] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1B6B52] to-[#145541] text-white p-5 flex items-center justify-between">
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-xs text-[#EBF5F0] font-thaana mb-1">
              <HeartHandshake className="w-3.5 h-3.5 text-[#A7F3D0]" />
              <span>ހެޔޮބިންގާއަށް އެހީދެއްވުން</span>
            </div>
            <h3 className="text-xl font-bold font-thaana">ދީލަތި އެހީތެރިކަން ފޯރުކޮށްދެއްވާ</h3>
            <p className="text-xs text-[#EBF5F0]/90 font-thaana mt-0.5">
              ވެބްސައިޓަށް ސްލިޕް އަޕްލޯޑްކުރައްވާ، ނުވަތަ ވައިބަރ މެދުވެރިކޮށް ފޮނުއްވާ
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="ލައްޕާލައްވާ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 text-right space-y-5 font-thaana">
          {/* Informative Choice Banner */}
          <div className="p-3.5 rounded-2xl bg-[#EBF5F0] border border-[#C8E0D5] flex items-start gap-2.5 text-xs text-[#1C2622]">
            <Sparkles className="w-4 h-4 text-[#1B6B52] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              ތިޔަބޭފުޅާއަށް ފަސޭހަ ގޮތަކަށް ސްލިޕް ފޮނުއްވޭނެއެވެ: <strong>ސީދާ ވެބްސައިޓަށް އަޕްލޯޑްކުރެއްވުން</strong> ނުވަތަ <strong>ވައިބަރ އިން ފޮނުއްވުން</strong>. އަދި ނަން ހާމަނުކޮށް <strong>ސިއްރު ޞަދަޤާތެއްގެ</strong> ގޮތުގައިވެސް ހުށަހެޅުއްވޭނެއެވެ.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F4F7F5] rounded-2xl border border-[#E2E9E5]">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-[#1B6B52] shadow-sm border border-[#E2E9E5]'
                  : 'text-[#556660] hover:text-[#1C2622]'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>ވެބްސައިޓަށް އަޕްލޯޑް (Direct Upload)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('viber')}
              className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'viber'
                  ? 'bg-[#7360F2] text-white shadow-sm'
                  : 'text-[#556660] hover:text-[#1C2622]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>ވައިބަރ އިން ފޮނުއްވާ (Viber)</span>
            </button>
          </div>

          {/* TAB 1: UPLOAD SLIP TO WEBSITE */}
          {activeTab === 'upload' && (
            submitSuccess ? (
              <div className="p-6 rounded-2xl bg-[#EBF5F0] border border-[#C8E0D5] text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1B6B52] text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-[#1C2622]">ޝުކުރިއްޔާ! ހެޔޮ ޖަޒާ މިންވަރު ކުރައްވާށި</h4>
                <p className="text-xs text-[#556660] leading-relaxed max-w-md mx-auto">
                  ތިޔަބޭފުޅާ ހުށަހެޅުއްވި އެހީގެ ސްލިޕް ހެޔޮބިންގާގެ ސިސްޓަމަށް ލިބިއްޖެއެވެ. ޖަމާޢަތުގެ ދީނީ އަދި ތަރުބަވީ މަޝްރޫޢުތަކަށް ދެއްވި ދީލަތި އެހީތެރިކަމަށްޓަކައި އިޚްލާޞްތެރިކަމާއެކު ޝުކުރު ދަންނަވަމެވެ.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 rounded-xl bg-[#1B6B52] hover:bg-[#15533F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    ނިންމާލައްވާ
                  </button>
                </div>
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
                    className="w-full py-3 px-5 rounded-2xl bg-[#1B6B52] hover:bg-[#15533F] text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>ސްލިޕް ފޮނުވެނީ...</span>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>ސްލިޕް ހުށަހަޅުއްވާ (Submit Slip)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )
          )}

          {/* TAB 2: SEND VIA VIBER */}
          {activeTab === 'viber' && (
            <div className="space-y-4">
              {/* Highlight Viber Hotline Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#EBF5F0] border border-[#C8E0D5] text-right space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#1B6B52] text-white text-xs font-bold font-thaana">
                    ރަސްމީ ވައިބަރ ނަންބަރު
                  </span>
                  <span className="text-xs font-bold text-[#1B6B52] font-mono" dir="ltr">
                    {NGO_CONTACT.viberNumberFormatted}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-[#1C2622]">
                    ސްލިޕް ވައިބަރ އިން ފޮނުއްވާނީ:
                  </h4>
                  <p className="text-xs text-[#556660] leading-relaxed mt-1">
                    ހެޔޮބިންގާގެ ރަސްމީ އެކައުންޓަށް ފައިސާ ޖަމާކުރެއްވުމަށްފަހު، ޓްރާންސްފަރ ސްލިޕް އަޅުގަނޑުމެންގެ ރަސްމީ ވައިބަރ ނަންބަރަށް ފޮނުއްވާލަދެއްވާށެވެ.
                  </p>
                </div>

                {/* Action Buttons for Viber */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <a
                    href={NGO_CONTACT.viberLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#7360F2] hover:bg-[#604CE2] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>ވައިބަރ އިން ފޮނުއްވާ (Viber Slip)</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyViber}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#1C2622] border border-[#C8E0D5] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedViber ? (
                      <>
                        <Check className="w-4 h-4 text-[#1B6B52]" />
                        <span>ކޮޕީ ވެއްޖެ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#556660]" />
                        <span>ނަންބަރު ކޮޕީ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bank Accounts List: 2 Main Boxes (BML and MIB) */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#1B6B52] uppercase tracking-wider block">
                  ހެޔޮބިންގާ ރަސްމީ އެކައުންޓްތައް (BML & MIB):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BANK_GROUPS.map((bank) => (
                    <div
                      key={bank.id}
                      className="p-3.5 rounded-2xl border border-[#E2E9E5] bg-[#F8FAF9] space-y-2.5 text-right"
                    >
                      <div className="flex items-center justify-between border-b border-[#E2E9E5] pb-2">
                        <span
                          dir="ltr"
                          className={`text-[11px] font-bold font-latin px-2 py-0.5 rounded-md ${
                            bank.bankCode === 'BML'
                              ? 'bg-[#DC2626] text-white'
                              : 'bg-[#EA580C] text-white'
                          }`}
                        >
                          {bank.bankCode}
                        </span>
                        <span className="text-xs font-bold text-[#1C2622]">
                          {bank.bankName}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {bank.accounts.map((acc) => (
                          <div
                            key={acc.id}
                            className="bg-white p-2.5 rounded-xl border border-[#E2E9E5] flex items-center justify-between gap-2"
                          >
                            <div className="text-right">
                              <span className="text-[10px] font-semibold text-[#556660]">
                                {acc.currency === 'USD' ? 'ޔޫ.އެސް ޑޮލަރު' : 'ދިވެހި ރުފިޔާ'} ({acc.currency})
                              </span>
                              <span
                                className="text-xs sm:text-sm font-bold font-mono text-[#1B6B52] block tracking-wider"
                                dir="ltr"
                              >
                                {acc.accountNumber}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCopyAccount(acc.accountNumber)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F8FAF9] hover:bg-[#EBF5F0] text-[#1C2622] border border-[#E2E9E5] transition-colors shrink-0 cursor-pointer"
                            >
                              {copiedAccount === acc.accountNumber ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-[#1B6B52]" />
                                  <span>ކޮޕީ ވެއްޖެ!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-[#556660]" />
                                  <span>ކޮޕީ</span>
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Message Helper */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#556660] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1C2622]">ވައިބަރ މެސެޖު ނަމޫނާ:</span>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="text-[11px] text-[#1B6B52] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedMessage ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedMessage ? 'މެސެޖު ކޮޕީ ވެއްޖެ' : 'މެސެޖު ކޮޕީ'}</span>
                  </button>
                </div>
                <p className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-[#1C2622] leading-relaxed">
                  "{defaultMessage}"
                </p>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E2E9E5] text-xs text-[#556660]">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#1B6B52]" />
              <span>ގުޅުއްވުމަށް: {NGO_CONTACT.viberNumberFormatted}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1C2622] font-semibold text-xs transition-colors cursor-pointer"
            >
              ނިންމާލައްވާ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
