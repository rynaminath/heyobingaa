import { useState } from 'react';
import { BankGroup } from '../types';
import { Copy, Check, Building2 } from 'lucide-react';

interface BankCardProps {
  bankGroup: BankGroup;
  compact?: boolean;
}

export default function BankCard({ bankGroup, compact = false }: BankCardProps) {
  const [copiedAccountId, setCopiedAccountId] = useState<string | null>(null);

  const handleCopy = async (accId: string, accNumber: string) => {
    try {
      await navigator.clipboard.writeText(accNumber);
      setCopiedAccountId(accId);
      setTimeout(() => {
        setCopiedAccountId((prev) => (prev === accId ? null : prev));
      }, 2500);
    } catch (err) {
      console.error('Failed to copy account number', err);
    }
  };

  const isBML = bankGroup.bankCode === 'BML';

  return (
    <div
      id={`bank-box-${bankGroup.id}`}
      className={`relative rounded-3xl border-2 text-white shadow-xl transition-all duration-200 overflow-hidden text-right flex flex-col justify-between ${
        isBML
          ? 'bg-gradient-to-br from-[#0F231D] via-[#142E26] to-[#0A1612] border-[#1B6B52]/70'
          : 'bg-gradient-to-br from-[#0D2232] via-[#152F42] to-[#0A1823] border-[#255D96]/70'
      } ${compact ? 'p-4 sm:p-5' : 'p-5 sm:p-7'}`}
    >
      {/* Decorative subtle ambient lights */}
      <div 
        className={`absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl pointer-events-none ${
          isBML ? 'bg-[#1B6B52]/20' : 'bg-[#255D96]/20'
        }`} 
      />

      <div className="relative space-y-4">
        {/* Bank Header Row */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          {/* Bank Badge (BML Red / MIB Orange) */}
          <div className="flex items-center gap-2">
            <span
              dir="ltr"
              className={`px-3 py-1 rounded-xl text-xs font-black font-latin tracking-wide shadow-md ${
                isBML
                  ? 'bg-[#DC2626] text-white border border-red-400/40'
                  : 'bg-[#EA580C] text-white border border-orange-400/40'
              }`}
            >
              {bankGroup.bankCode}
            </span>
            <div className="text-right">
              <h4 className="text-sm sm:text-base font-extrabold text-white font-thaana">
                {bankGroup.bankName}
              </h4>
              <span className="text-[11px] text-white/60 block font-latin">
                {bankGroup.bankNameEn}
              </span>
            </div>
          </div>

          <Building2 className={`w-5 h-5 shrink-0 opacity-40 ${isBML ? 'text-[#38D39F]' : 'text-[#60A5FA]'}`} />
        </div>

        {/* Official Account Name Header */}
        <div className="flex items-center justify-between text-xs bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
          <span className="text-[11px] text-white/70 font-thaana">އެކައުންޓްގެ ނަން:</span>
          <span dir="ltr" className="font-bold text-white font-latin text-xs sm:text-sm tracking-wider">
            {bankGroup.accountName}
          </span>
        </div>

        {/* 2 Accounts Listed Inside (MVR & USD) */}
        <div className="space-y-3 pt-1">
          {bankGroup.accounts.map((acc) => {
            const isCopied = copiedAccountId === acc.id;
            const isUSD = acc.currency === 'USD';

            return (
              <div
                key={acc.id}
                className="bg-black/35 backdrop-blur-xs rounded-2xl p-3 sm:p-3.5 border border-white/10 hover:border-white/20 transition-all space-y-2"
              >
                {/* Account Currency & Description */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      dir="ltr"
                      className={`text-[11px] px-2.5 py-0.5 rounded-md font-latin font-bold border ${
                        isUSD
                          ? 'bg-[#1E3A5F] text-[#93C5FD] border-[#3B82F6]/40'
                          : 'bg-[#143D30] text-[#86EFAC] border-[#22C55E]/40'
                      }`}
                    >
                      {acc.currency}
                    </span>
                    <span className="text-xs text-white/85 font-semibold font-thaana">
                      {acc.badge}
                    </span>
                  </div>

                  <span className="text-[10px] text-white/50 font-thaana">
                    {isUSD ? 'ޑޮލަރު އެކައުންޓް' : 'ރުފިޔާ އެކައުންޓް'}
                  </span>
                </div>

                {/* Account Number & Copy Button */}
                <div className="flex items-center justify-between gap-2 bg-black/40 rounded-xl px-3 py-2 border border-white/10">
                  <span
                    dir="ltr"
                    className={`text-sm sm:text-base font-bold font-mono tracking-wider select-all truncate ${
                      isUSD ? 'text-[#CFE2F5]' : 'text-[#D1E7DD]'
                    }`}
                  >
                    {acc.accountNumber}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopy(acc.id, acc.accountNumber)}
                    aria-label={`${acc.currency} އެކައުންޓް ނަންބަރު ކޮޕީ ކުރައްވާ`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 shrink-0 font-thaana whitespace-nowrap active:scale-95 ${
                      isCopied
                        ? 'bg-white text-[#1B6B52] shadow-md font-bold'
                        : 'bg-white/15 hover:bg-white/25 text-white border border-white/15'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#1B6B52]" />
                        <span>ކޮޕީ ވެއްޖެ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>ކޮޕީ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
