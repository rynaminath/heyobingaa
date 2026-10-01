import React from 'react';
import { Calendar, Award, CheckCircle2 } from 'lucide-react';
import { RECORDED_ACTIVITIES } from '../data/initialData';

interface ActivityRecordsTableProps {
  showTitle?: boolean;
}

export default function ActivityRecordsTable({ showTitle = true }: ActivityRecordsTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#D5DFD9] shadow-sm overflow-hidden text-right font-thaana">
      {showTitle && (
        <div className="p-6 sm:p-7 border-b border-[#E2E9E5] bg-gradient-to-l from-[#F4F8F6] to-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF5F0] text-[#1B6B52] text-xs font-bold border border-[#C8E0D5] mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>ރަސްމީ ރެކޯޑް (Official Activities Log)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1C2622]">
              ކުރެވުނު މަސައްކަތްތަކާއި ބައިވެރިވި ޙަރަކާތްތައް (2024 - 2025)
            </h3>
            <p className="text-xs sm:text-sm text-[#556660] mt-1">
              ވޭތުވެދިޔަ އަހަރުތަކުގައި ހެޔޮބިންގާއިން ހިންގާފައިވާ އަދި ބައިވެރިވެފައިވާ މުހިންމު ޙަރަކާތްތަކުގެ ރެކޯޑް
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#556660] bg-white px-3 py-1.5 rounded-xl border border-[#E2E9E5] shrink-0">
            <Calendar className="w-3.5 h-3.5 text-[#1B6B52]" />
            <span>2024 - 2025 RECORD</span>
          </div>
        </div>
      )}

      {/* Official Table matching document format */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[620px]">
          {/* Main Table Header */}
          <thead>
            <tr className="bg-[#2D6A9F] text-white">
              <th className="py-3 px-4 sm:px-6 text-sm font-bold border-l border-white/20 w-3/4">
                ކުރެވުނު މަސައްކަތް / ބައިވެރިވި ޙަރަކާތް
              </th>
              <th className="py-3 px-4 sm:px-6 text-sm font-bold text-center w-1/4">
                ތާރީޚް
              </th>
            </tr>
          </thead>
          <tbody>
            {RECORDED_ACTIVITIES.map((section) => (
              <React.Fragment key={section.code}>
                {/* Category Header Row */}
                <tr className="bg-[#E5ECE9] border-t border-b border-[#CBD8D2]">
                  <td colSpan={2} className="py-2.5 px-4 sm:px-6 text-center text-xs sm:text-sm font-extrabold text-[#193F34]">
                    <span>{section.category}</span>
                  </td>
                </tr>

                {/* Section Items */}
                {section.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[#E2E9E5] hover:bg-[#F9FCFA] transition-colors"
                  >
                    {/* Activity Description */}
                    <td className="py-3.5 px-4 sm:px-6 text-xs sm:text-sm text-[#1C2622] leading-relaxed border-l border-[#E2E9E5]">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#1B6B52] shrink-0 mt-0.5" />
                        <span>{item.description}</span>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 sm:px-6 text-center align-middle whitespace-nowrap">
                      <div className="flex flex-col items-center justify-center gap-1">
                        {item.dates.map((dateStr, dIdx) => (
                          <span
                            key={dIdx}
                            dir="ltr"
                            className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#F0F5F2] text-[#1B6B52] border border-[#D5E5DC]"
                          >
                            {dateStr}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
