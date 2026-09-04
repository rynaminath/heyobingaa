import { useState } from 'react';
import { X, Copy, Check, MessageSquare, Phone, HeartHandshake, ArrowUpRight } from 'lucide-react';
import { BANK_ACCOUNTS, NGO_CONTACT } from '../data/initialData';

interface DonationReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReceiptSubmitted?: (slip: any) => void;
}

export default function DonationReceiptModal({
  isOpen,
  onClose
}: DonationReceiptModalProps) {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [copiedViber, setCopiedViber] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!isOpen) return null;

  const defaultMessage = `އައްސަލާމު ޢަލައިކުމް. ހެޔޮބިންގާ ޖަމްޢިއްޔާއަށް އަޅުގަނޑު ޖަމާކުރި އެހީގެ ސްލިޕް ޙިއްޞާކޮށްލީމެވެ.`;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E2E9E5] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1B6B52] to-[#145541] text-white p-5 flex items-center justify-between">
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-xs text-[#EBF5F0] font-thaana mb-1">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>އެހީގެ ސްލިޕް ފޮނުއްވުން</span>
            </div>
            <h3 className="text-lg font-bold font-thaana">ޓްރާންސްފަރ & ވައިބަރ ސްލިޕް</h3>
            <p className="text-xs text-[#EBF5F0]/90 font-thaana mt-0.5">
              ފައިސާ ޓްރާންސްފަރ ކުރެއްވުމަށްފަހު ސްލިޕް ވައިބަރ ކުރައްވާ
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="ލައްޕާލައްވާ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 text-right space-y-5 font-thaana">
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
                ސްލިޕް ވައިބަރ ކުރައްވާނީ:
              </h4>
              <p className="text-xs text-[#556660] leading-relaxed mt-1">
                ހެޔޮބިންގާގެ ރަސްމީ އެކައުންޓަށް ފައިސާ ޖަމާކުރެއްވުމަށްފަހު، ޓްރާންސްފަރ ސްލިޕް މި ނަންބަރަށް ވައިބަރ މެދުވެރިކޮށް ފޮނުއްވާލަދެއްވާށެވެ.
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
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#1C2622] border border-[#C8E0D5] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
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

          {/* Bank Accounts List with Instant Copy */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#1B6B52] uppercase tracking-wider block">
              ހެޔޮބިންގާ ރަސްމީ އެކައުންޓްތައް:
            </span>
            <div className="space-y-2.5">
              {BANK_ACCOUNTS.map((acc) => (
                <div
                  key={acc.id}
                  className="p-3.5 rounded-xl border border-[#E2E9E5] bg-[#F8FAF9] flex items-center justify-between gap-2"
                >
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1C2622]">{acc.bankName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#E2E9E5] text-[#556660]">
                        {acc.badge}
                      </span>
                    </div>
                    <span className="text-sm font-bold font-mono text-[#1B6B52] tracking-wider block mt-0.5" dir="ltr">
                      {acc.accountNumber}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyAccount(acc.accountNumber)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-[#EBF5F0] text-[#1C2622] border border-[#E2E9E5] transition-colors shrink-0"
                  >
                    {copiedAccount === acc.accountNumber ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#1B6B52]" />
                        <span>ކޮޕީ ވެއްޖެ</span>
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

          {/* Quick Message Helper */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#556660] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#1C2622]">ވައިބަރ މެސެޖު ނަމޫނާ:</span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-[11px] text-[#1B6B52] hover:underline font-bold flex items-center gap-1"
              >
                {copiedMessage ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedMessage ? 'މެސެޖު ކޮޕީ ވެއްޖެ' : 'މެސެޖު ކޮޕީ'}</span>
              </button>
            </div>
            <p className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-[#1C2622] leading-relaxed">
              "{defaultMessage}"
            </p>
          </div>

          {/* Footer Note */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E2E9E5] text-xs text-[#556660]">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#1B6B52]" />
              <span>ގުޅުއްވުމަށް: {NGO_CONTACT.viberNumberFormatted}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1C2622] font-semibold text-xs transition-colors"
            >
              ނިންމާލައްވާ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
