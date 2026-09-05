import { useState } from 'react';
import { HeartHandshake, Copy, Check, MessageSquare } from 'lucide-react';
import { BANK_ACCOUNTS, NGO_CONTACT } from '../data/initialData';

interface StickyMobileDonateBarProps {
  onOpenDonateModal: () => void;
  onNavigateToDonate: () => void;
}

export default function StickyMobileDonateBar({
  onOpenDonateModal,
  onNavigateToDonate
}: StickyMobileDonateBarProps) {
  const [copied, setCopied] = useState(false);
  const primaryAccount = BANK_ACCOUNTS[0]; // BML MVR

  const handleQuickCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(primaryAccount.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#0F231D]/95 backdrop-blur-md border-t border-[#1C3B32] px-3 py-2.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Quick copy account button */}
        <button
          type="button"
          onClick={handleQuickCopy}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold font-thaana border transition-all ${
            copied
              ? 'bg-[#1B6B52] border-[#1B6B52] text-white'
              : 'bg-[#18392F] border-[#234A3E] text-white active:bg-[#1C3B32]'
          }`}
          title="BML އެކައުންޓް ނަންބަރު ކޮޕީ"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>ކޮޕީ ވެއްޖެ!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#A7F3D0]" />
              <span>BML ކޮޕީ</span>
            </>
          )}
        </button>

        {/* Viber slip button */}
        <button
          type="button"
          onClick={onOpenDonateModal}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium font-thaana bg-[#7360F2] hover:bg-[#604CE2] text-white shadow-xs"
          title={`ވައިބަރ ސްލިޕް: ${NGO_CONTACT.viberNumberFormatted}`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>ވައިބަރ</span>
        </button>

        {/* Primary Donate CTA in Soft Red */}
        <button
          type="button"
          onClick={onNavigateToDonate}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B83244] hover:bg-[#9A2434] active:bg-[#7E1A27] text-white font-bold font-thaana text-xs shadow-md shadow-[#B83244]/20"
        >
          <HeartHandshake className="w-4 h-4 text-white" />
          <span>އެހީދެއްވުމަށް (Donate)</span>
        </button>
      </div>
    </div>
  );
}
