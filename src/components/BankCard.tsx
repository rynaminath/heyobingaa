import { useState } from 'react';
import { BankAccount } from '../types';
import { Copy, Check } from 'lucide-react';

interface BankCardProps {
  account: BankAccount;
  compact?: boolean;
}

export default function BankCard({ account, compact = false }: BankCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(account.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  // Harmonized styling for 2 banks (BML, MIB) x 2 currencies (MVR, USD)
  const getCardStyle = () => {
    if (account.bankCode === 'BML') {
      if (account.currency === 'USD') {
        return {
          bg: 'bg-gradient-to-br from-[#1B4D7E] via-[#153C63] to-[#0E2842] border-[#7EA9D6]/40 shadow-sm',
          bankBadge: 'bg-[#EDF4FC] text-[#1B4D7E]',
          currencyBadge: 'bg-[#7EA9D6]/30 text-white border-[#7EA9D6]/40',
          numberColor: 'text-[#D0E2F6]'
        };
      }
      return {
        bg: 'bg-gradient-to-br from-[#1B6B52] via-[#145541] to-[#0E3B2D] border-[#8CD0B6]/40 shadow-sm',
        bankBadge: 'bg-[#EBF5F0] text-[#1B6B52]',
        currencyBadge: 'bg-[#8CD0B6]/30 text-white border-[#8CD0B6]/40',
        numberColor: 'text-[#C7EADB]'
      };
    }

    // MIB (Maldives Islamic Bank)
    if (account.currency === 'USD') {
      return {
        bg: 'bg-gradient-to-br from-[#5C2B66] via-[#482050] to-[#311438] border-[#D0A4DC]/40 shadow-sm',
        bankBadge: 'bg-[#F9EFFB] text-[#5C2B66]',
        currencyBadge: 'bg-[#D0A4DC]/30 text-white border-[#D0A4DC]/40',
        numberColor: 'text-[#EEDCF4]'
      };
    }
    return {
      bg: 'bg-gradient-to-br from-[#A82835] via-[#8B1E29] to-[#60121B] border-[#F2A3AB]/40 shadow-sm',
      bankBadge: 'bg-[#FDF1F2] text-[#A82835]',
      currencyBadge: 'bg-[#F2A3AB]/30 text-white border-[#F2A3AB]/40',
      numberColor: 'text-[#FAD0D5]'
    };
  };

  const style = getCardStyle();

  return (
    <div
      id={`bank-card-${account.id}`}
      className={`relative rounded-2xl border text-white transition-all duration-200 ${style.bg} ${
        compact ? 'p-4' : 'p-4 sm:p-5'
      }`}
    >
      {/* Top Header: Bank Identifier & Currency */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span 
            dir="ltr" 
            className={`px-2 py-0.5 rounded-md text-xs font-bold font-latin shadow-xs shrink-0 ${style.bankBadge}`}
          >
            {account.bankCode}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-white/95 font-thaana truncate">
            {account.bankName.replace(/ \([A-Z]+\)/, '')}
          </span>
        </div>

        <span 
          dir="ltr" 
          className={`text-xs px-2.5 py-0.5 rounded-full border font-latin font-bold shrink-0 ${style.currencyBadge}`}
        >
          {account.currency}
        </span>
      </div>

      {/* Account Number Box with balanced proportions */}
      <div className="my-2.5 bg-black/25 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-white/15 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-white/75 font-thaana">
          <span>އެކައުންޓް ނަންބަރު:</span>
          <span dir="ltr" className="font-mono text-[10px] text-white/70 uppercase">
            {account.currency}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 bg-black/30 rounded-lg px-2.5 py-2 border border-white/10">
          <span 
            dir="ltr" 
            className={`text-sm sm:text-base font-bold font-mono tracking-wider select-all truncate ${style.numberColor}`}
          >
            {account.accountNumber}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            aria-label="ކޮޕީ ކުރައްވާ"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 shrink-0 font-thaana whitespace-nowrap ${
              copied
                ? 'bg-white text-[#1B6B52] shadow-xs font-bold'
                : 'bg-white/20 hover:bg-white/30 text-white active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#1B6B52]" />
                <span>ކޮޕީ ވެއްޖެ</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>ކޮޕީ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Account Holder Name */}
      <div className="flex items-center justify-between text-xs text-white/80 pt-2 border-t border-white/10">
        <span className="text-[11px] font-thaana">އެކައުންޓްގެ ނަން:</span>
        <span dir="ltr" className="font-semibold text-white font-latin text-xs">
          {account.accountName}
        </span>
      </div>
    </div>
  );
}
