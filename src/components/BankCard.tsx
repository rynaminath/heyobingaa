import { useState } from 'react';
import { BankAccount } from '../types';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface BankCardProps {
  account: BankAccount;
  compact?: boolean;
  onUploadReceipt?: () => void;
}

export default function BankCard({ account, compact = false, onUploadReceipt }: BankCardProps) {
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

  // Card theme styling per account: Green (BML MVR), Blue (BML USD), Red (MIB)
  const getCardStyle = () => {
    if (account.currency === 'USD') {
      return {
        bg: 'bg-gradient-to-br from-[#255D96] via-[#1C4875] to-[#123152] border-[#CFE2F5]/40 shadow-lg shadow-[#255D96]/20',
        badge: 'bg-[#EDF4FC] text-[#255D96]',
        accent: 'text-[#CFE2F5]'
      };
    }
    if (account.bankCode === 'MIB') {
      return {
        bg: 'bg-gradient-to-br from-[#B83244] via-[#9A2434] to-[#731824] border-[#F7D0D4]/40 shadow-lg shadow-[#B83244]/20',
        badge: 'bg-[#FDF1F2] text-[#B83244]',
        accent: 'text-[#FED7AA]'
      };
    }
    return {
      bg: 'bg-gradient-to-br from-[#1B6B52] via-[#145541] to-[#0F3D2E] border-[#C8E0D5]/40 shadow-lg shadow-[#1B6B52]/20',
      badge: 'bg-[#EBF5F0] text-[#1B6B52]',
      accent: 'text-[#A7F3D0]'
    };
  };

  const style = getCardStyle();

  return (
    <div
      id={`bank-card-${account.id}`}
      className={`relative overflow-hidden rounded-2xl border text-white transition-all duration-300 ${style.bg} ${compact ? 'p-4' : 'p-5 md:p-6'}`}
    >
      {/* Decorative ambient subtle circle */}
      <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      {/* Header with bank badge and currency */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-latin tracking-wide shadow-xs ${style.badge}`}>
            {account.bankCode}
          </span>
          <span className="text-sm font-semibold text-white/95 font-thaana">
            {account.bankName}
          </span>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-white font-thaana">
          {account.badge}
        </span>
      </div>

      {/* Account Number Display with One-Touch Copy */}
      <div className="my-3 bg-black/25 backdrop-blur-xs rounded-xl p-3.5 border border-white/15 flex items-center justify-between gap-2">
        <div className="text-right">
          <span className="block text-xs text-white/80 font-thaana">
            އެކައުންޓް ނަންބަރު (Account Number)
          </span>
          <span className={`text-lg md:text-xl font-bold font-mono tracking-wider ${style.accent}`}>
            {account.accountNumber}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="ކޮޕީ ކުރައްވާ"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 shrink-0 font-thaana ${
            copied
              ? 'bg-white text-[#1B6B52] scale-95 shadow-md'
              : 'bg-white/20 hover:bg-white/30 text-white active:scale-95'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#1B6B52]" />
              <span>ކޮޕީ ވެއްޖެ!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>ނަންބަރު ކޮޕީ</span>
            </>
          )}
        </button>
      </div>

      {/* Account Holder Name */}
      <div className="flex items-center justify-between text-xs text-white/90 pt-2.5 border-t border-white/15">
        <div>
          <span className="text-xs text-white/70 block font-thaana">އެކައުންޓްގެ ނަން:</span>
          <span className="font-semibold text-white font-latin tracking-wide">{account.accountName}</span>
        </div>

        {onUploadReceipt && (
          <button
            type="button"
            onClick={onUploadReceipt}
            className="flex items-center gap-1 text-xs text-white hover:text-white/80 underline underline-offset-4 font-thaana transition-colors"
          >
            <span>ސްލިޕް ފޮނުއްވާ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
