import { useState, useEffect } from 'react';
import { NavigationTab, ProgramItem } from '../types';
import { PROGRAMS } from '../data/initialData';
import { Users, Sparkles, HeartHandshake, CheckCircle2, Headphones, GraduationCap, BookOpen } from 'lucide-react';

interface ProgramsPageProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenDonateModal: () => void;
  initialCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
  programs?: ProgramItem[];
}

export default function ProgramsPage({
  onNavigate,
  onOpenDonateModal,
  initialCategory,
  onSelectCategory,
  programs: propPrograms
}: ProgramsPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const programList = propPrograms || PROGRAMS;

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = [
    { id: 'all', label: 'ހުރިހާ ޕްރޮގްރާމްތައް' },
    { id: 'audiobooks', label: 'އޯޑިއޯ ފޮތްތައް (Audiobooks)' },
    { id: 'lectures', label: 'ދަރުސްތައް (Lectures)' },
    { id: 'women', label: 'އުޚުތުންނާއި ކަނބަލުންނަށް' },
    { id: 'toddlers', label: 'ތުއްތު ކުދިންގެ ބިންގާ' },
    { id: 'teenagers', label: 'ފުރާވަރުގެ ކުދިން' },
    { id: 'joint_ngo', label: 'އެންޖީއޯ ޖޮއިންޓް އޮޕަރޭޝަންސް' }
  ];

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    if (onSelectCategory) {
      onSelectCategory(catId === 'all' ? null : catId);
    }
  };

  const filteredPrograms = activeCategory === 'all'
    ? programList
    : programList.filter((p) => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-thaana">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#134e3e] via-[#1B6B52] to-[#124b3b] text-white p-8 sm:p-10 rounded-3xl border border-[#145541] shadow-xl text-right space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#A7F3D0] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
          <span>އުފެއްދުންތެރި އަދި މުޖުތަމަޢީ ޙަރަކާތްތައް</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          ޕްރޮގްރާމްތަކާއި މުޖުތަމަޢީ މަސައްކަތްތައް
        </h1>
        <p className="text-base sm:text-lg text-[#EBF5F0] max-w-3xl leading-relaxed">
          އާދަކާދައިގެ ތަޤްރީރުތަކުން ބޭރުވެ، ބައިވެރިން ޢަމަލީގޮތުން ބައިވެރިވާ އިންޓްރެކްޓިވް ސެޝަންތަކާއި، އޯޑިއޯ ފޮތްތަކާއި، ދަރުސްތައް އަދި ރާއްޖޭގެ އެންޖީއޯތަކާ ގުޅިގެން ހިންގޭ ޖޮއިންޓް އޮޕަރޭޝަންސް.
        </p>

        {/* Category filter pills */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-white text-[#1B6B52] shadow-md font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-[#EBF5F0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Programs List */}
      <div className="space-y-8">
        {filteredPrograms.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-[#556660] border border-[#E5ECE8]">
            <p className="text-base">މި ބައިގައި އަދި ޕްރޮގްރާމެއް ނުހިމެނެއެވެ.</p>
          </div>
        ) : (
          filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-3xl border border-[#E5ECE8] shadow-xs overflow-hidden hover:border-[#1B6B52]/40 transition-all duration-200"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Image & Key Stats */}
                <div className="lg:col-span-5 relative min-h-[260px] bg-[#1C2622]">
                  <img
                    src={prog.imageUrl}
                    alt={prog.title}
                    className="w-full h-full object-cover opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-6 flex flex-col justify-between text-right">
                    <span className="self-end px-3 py-1 rounded-full bg-[#1B6B52] text-white text-xs font-bold shadow-md">
                      {prog.categoryLabel}
                    </span>
                    <div>
                      <span className="text-xs text-[#A7F3D0] block font-bold">ޙާޞިލުކުރެވުނު މިންވަރު:</span>
                      <span className="text-xl font-bold text-white">{prog.impactMetrics}</span>
                    </div>
                  </div>
                </div>

                {/* Details Column with +2pt larger typography */}
                <div className="lg:col-span-7 p-6 sm:p-8 text-right space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-[#1B6B52] bg-[#EBF5F0] px-3 py-1 rounded-md">
                        ފޯމެޓް: {prog.format}
                      </span>
                      <span className="text-xs sm:text-sm text-[#556660]">
                        އަމާޒު: {prog.targetAudience}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#1C2622]">
                      {prog.title}
                    </h2>

                    <p className="text-sm sm:text-base text-[#556660] leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Feature Bullets */}
                    <div className="pt-2 space-y-2">
                      <span className="text-sm font-bold text-[#1C2622] block">މައިގަނޑު ސިފަތައް:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {prog.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-xs sm:text-sm text-[#1C2622]">
                            <CheckCircle2 className="w-4 h-4 text-[#1B6B52] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Collaborators & Action */}
                  <div className="pt-4 border-t border-[#E5ECE8] flex flex-wrap items-center justify-between gap-3">
                    {prog.collaborators && prog.collaborators.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#556660]">
                        <span className="font-bold text-[#1C2622]">ބައިވެރިން:</span>
                        <span>{prog.collaborators.join('، ')}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onOpenDonateModal}
                        className="px-4 py-2 rounded-xl bg-[#B83244] hover:bg-[#9A2434] text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-[#FED7AA]" />
                        <span>މި ޕްރޮގްރާމަށް އެހީވެލައްވާ</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('volunteer')}
                        className="px-4 py-2 rounded-xl bg-[#FAFCFB] hover:bg-[#EBF5F0] border border-[#E5ECE8] text-[#1C2622] font-semibold text-xs sm:text-sm transition-colors"
                      >
                        ބައިވެރިވެލައްވާ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Active NGO Volunteering Spotlight */}
      <section className="bg-[#1C2622] text-white rounded-3xl p-8 sm:p-10 border border-[#2B3B34] text-right space-y-4">
        <div className="flex items-center gap-2 text-[#A7F3D0] text-xs sm:text-sm font-bold">
          <HeartHandshake className="w-4 h-4 text-[#A7F3D0]" />
          <span>2 އަހަރުގެ ޖޮއިންޓް އޮޕަރޭޝަންސް</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold">
          ރާއްޖޭގެ އެންޖީއޯތަކާ ގުޅިގެން ކުރެވުނު މުހިންމު ޚިދުމަތްތައް
        </h3>
        <p className="text-sm sm:text-base text-[#D0DED7] leading-relaxed max-w-4xl">
          ހެޔޮބިންގާގެ ވޮލަންޓިއަރުން ވަނީ ފާއިތުވި 2 އަހަރު ދުވަހުގެ ތެރޭގައި އިންޓަނޭޝަނަލް އެއިޑް ކެމްޕޭން (IAC)، ޕީސް ފައުންޑޭޝަން، އަލް ޢަޞްރު، އެހީ އަދި ޖަމްޢިއްޔަތުއް ސަލަފް އިން އިންތިޒާމުކުރި ބޮޑެތި ޤައުމީ އިވެންޓްތަކުގައާއި ދަރުސްތަކުގައި، އަންހެނުންގެ ސެކްޝަންތައް ތަރުތީބުކުރުމާއި، ކާރިސާތަކުގެ އެހީގެ ސާމާނު ބަންދުކުރުމާއި ފޯރުކޮށްދިނުމުގައި ޢަމަލީގޮތުން ބައިވެރިވެފައެވެ.
        </p>
      </section>
    </div>
  );
}
