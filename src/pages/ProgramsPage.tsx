import { ProgramItem, NavigationTab } from '../types';
import { PROGRAMS } from '../data/initialData';
import { Users, Sparkles, HeartHandshake, CheckCircle2, ArrowLeft } from 'lucide-react';

interface ProgramsPageProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenDonateModal: () => void;
}

export default function ProgramsPage({ onNavigate, onOpenDonateModal }: ProgramsPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-thaana">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#1F1C1B] via-[#2A2523] to-[#171514] text-white p-8 sm:p-10 rounded-3xl border border-[#38332F] shadow-xl text-right space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B2E34]/50 border border-[#8B2E34] text-[#F9EDED] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#F27D26]" />
          <span>އުފެއްދުންތެރި އަދި މުޖުތަމަޢީ ޙަރަކާތްތައް</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          ޕްރޮގްރާމްތަކާއި މުޖުތަމަޢީ މަސައްކަތްތައް
        </h1>
        <p className="text-sm text-[#D8D2C7] max-w-3xl leading-relaxed">
          އާދަކާދައިގެ ތަޤްރީރުތަކުން ބޭރުވެ، ބައިވެރިން ޢަމަލީގޮތުން ބައިވެރިވާ އިންޓްރެކްޓިވް ސެޝަންތަކާއި، ރާއްޖޭގެ އެންޖީއޯތަކާ ގުޅިގެން ވޭތުވެދިޔަ 2 އަހަރު ހިންގުނު ޖޮއިންޓް އޮޕަރޭޝަންސް.
        </p>
      </div>

      {/* Programs List */}
      <div className="space-y-10">
        {PROGRAMS.map((prog) => (
          <div
            key={prog.id}
            className="bg-white rounded-3xl border border-[#E8E4DC] shadow-sm overflow-hidden hover:border-[#8B2E34]/40 transition-colors"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Image & Key Stats */}
              <div className="lg:col-span-5 relative min-h-[260px] bg-[#171514]">
                <img
                  src={prog.imageUrl}
                  alt={prog.title}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-between text-right">
                  <span className="self-end px-3 py-1 rounded-full bg-[#8B2E34] text-white text-xs font-bold shadow-md">
                    {prog.categoryLabel}
                  </span>
                  <div>
                    <span className="text-[11px] text-[#F27D26] block font-bold">ޙާޞިލުކުރެވުނު މިންވަރު:</span>
                    <span className="text-lg font-bold text-white">{prog.impactMetrics}</span>
                  </div>
                </div>
              </div>

              {/* Details Column */}
              <div className="lg:col-span-7 p-6 sm:p-8 text-right space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#8B2E34] bg-[#F9EDED] px-2.5 py-1 rounded-md">
                      ފޯމެޓް: {prog.format}
                    </span>
                    <span className="text-xs text-[#6E6963]">
                      އަމާޒު: {prog.targetAudience}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-[#2D2926]">
                    {prog.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#6E6963] leading-relaxed">
                    {prog.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="pt-2 space-y-2">
                    <span className="text-xs font-bold text-[#2D2926] block">މައިގަނޑު ސިފަތައް:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {prog.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-[#2D2926]">
                          <CheckCircle2 className="w-4 h-4 text-[#8B2E34] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Collaborators & Action */}
                <div className="pt-4 border-t border-[#E8E4DC] flex flex-wrap items-center justify-between gap-3">
                  {prog.collaborators && prog.collaborators.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-[#6E6963]">
                      <span className="font-bold text-[#2D2926]">ބައިވެރިން:</span>
                      <span>{prog.collaborators.join('، ')}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onOpenDonateModal}
                      className="px-4 py-2 rounded-xl bg-[#8B2E34] hover:bg-[#702328] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <HeartHandshake className="w-3.5 h-3.5 text-[#F27D26]" />
                      <span>މި ޕްރޮގްރާމަށް އެހީވެލައްވާ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('volunteer')}
                      className="px-4 py-2 rounded-xl bg-[#FCFBF8] hover:bg-[#F9EDED]/60 border border-[#E8E4DC] text-[#2D2926] font-medium text-xs transition-colors"
                    >
                      ބައިވެރިވެލައްވާ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Years of Active NGO Volunteering Spotlight */}
      <section className="bg-[#1F1C1B] text-white rounded-3xl p-8 sm:p-10 border border-[#38332F] text-right space-y-4">
        <div className="flex items-center gap-2 text-[#F27D26] text-xs font-bold">
          <HeartHandshake className="w-4 h-4 text-[#F27D26]" />
          <span>2 އަހަރުގެ ޖޮއިންޓް އޮޕަރޭޝަންސް</span>
        </div>
        <h3 className="text-2xl font-bold">
          ރާއްޖޭގެ އެންޖީއޯތަކާ ގުޅިގެން ކުރެވުނު މުހިންމު ޚިދުމަތްތައް
        </h3>
        <p className="text-xs sm:text-sm text-[#D8D2C7] leading-relaxed max-w-4xl">
          ހެޔޮބިންގާގެ ވޮލަންޓިއަރުން ވަނީ ފާއިތުވި 2 އަހަރު ދުވަހުގެ ތެރޭގައި އިންޓަނޭޝަނަލް އެއިޑް ކެމްޕޭން (IAC)، ޕީސް ފައުންޑޭޝަން، އަލް ޢަޞްރު، އެހީ އަދި ޖަމްޢިއްޔަތުއް ސަލަފް އިން އިންތިޒާމުކުރި ބޮޑެތި ޤައުމީ އިވެންޓްތަކުގައާއި ދަރުސްތަކުގައި، އަންހެނުންގެ ސެކްޝަންތައް ތަރުތީބުކުރުމާއި، ކާރިސާތަކުގެ އެހީގެ ސާމާނު ބަންދުކުރުމާއި ފޯރުކޮށްދިނުމުގައި ޢަމަލީގޮތުން ބައިވެރިވެފައެވެ.
        </p>
      </section>
    </div>
  );
}
