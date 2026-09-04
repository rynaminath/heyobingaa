import { useState } from 'react';
import { MediaItem } from '../types';
import { Tv, Play, Search, Filter, Eye, Clock, CheckCircle2, UserCheck } from 'lucide-react';

interface MediaArchivePageProps {
  mediaList: MediaItem[];
  onSelectMedia: (media: MediaItem) => void;
}

export default function MediaArchivePage({ mediaList, onSelectMedia }: MediaArchivePageProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'deaf_accessible' | 'sisters_family' | 'kids_youth' | 'ramadan'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedia = mediaList.filter((item) => {
    const matchesFilter = selectedFilter === 'all' 
      ? true 
      : selectedFilter === 'deaf_accessible' 
        ? item.isDeafAccessible 
        : item.category === selectedFilter;

    const matchesSearch = searchQuery.trim() === ''
      ? true
      : item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.speaker && item.speaker.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.interpreter && item.interpreter.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const deafCount = mediaList.filter((m) => m.isDeafAccessible).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-thaana">
      {/* Header with Dhares TV Hub badge */}
      <div className="bg-gradient-to-r from-[#1F1C1B] via-[#2A2523] to-[#171514] text-white p-8 sm:p-10 rounded-3xl border border-[#38332F] shadow-xl text-right space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B2E34]/50 border border-[#8B2E34] text-[#F9EDED] text-xs font-semibold">
            <Tv className="w-4 h-4 text-[#F27D26]" />
            <span>ދާރެސް ޓީވީ (Dhares TV) ކޮލެބޮރޭޝަން ހަބް</span>
          </div>
          <span className="text-xs text-[#F9EDED] px-3 py-1 rounded-lg bg-white/10">
            ޖުމްލަ {mediaList.length} ޕްރޮގްރާމް
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          ޓީވީ އަދި މީޑިއާ އާކައިވް
        </h1>

        <p className="text-sm text-[#D8D2C7] max-w-3xl leading-relaxed">
          ދާރެސް ޓީވީއާ ގުޅިގެން ހެޔޮބިންގާއިން އުފައްދާފައިވާ ޚާއްޞަ ޓީވީ ސިލްސިލާތަކާއި، ބީރު އަދި އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ މުޖުތަމަޢަށް އަމާޒުކޮށް އިޝާރާތުގެ ބަހުރުވައިން ތައްޔާރުކޮށްފައިވާ އެންމެހައި ޕްރޮގްރާމްތަކުގެ ޚަޒާނާ.
        </p>

        {/* Deaf accessibility alert callout */}
        <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#F9EDED]">
            <CheckCircle2 className="w-5 h-5 text-[#F27D26] shrink-0" />
            <span>
              ބީރު މުޖުތަމަޢަށް ޚާއްޞަކޮށް <strong>{deafCount} ޕްރޮގްރާމް</strong> އިޝާރާތުގެ ބަހުރުވައިން ތައްޔާރުކުރެވިފައިވެއެވެ.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedFilter('deaf_accessible');
              setSearchQuery('');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[#8B2E34] hover:bg-[#702328] text-white font-bold transition-colors shrink-0 text-center"
          >
            ބީރު މީހުންގެ ވީޑިއޯތައް އެކަނި ބައްލަވާ
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E4DC] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#6E6963] absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ޕްރޮގްރާމް ނުވަތަ ޝައިޚްގެ ނަމުން ހޯއްދަވާ..."
              className="w-full pr-10 pl-4 py-2 rounded-xl border border-[#E8E4DC] text-xs sm:text-sm font-thaana focus:outline-none focus:ring-2 focus:ring-[#8B2E34] text-right"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-thaana whitespace-nowrap transition-all ${
                selectedFilter === 'all'
                  ? 'bg-[#8B2E34] text-white shadow-xs'
                  : 'bg-[#FCFBF8] border border-[#E8E4DC] text-[#6E6963] hover:text-[#2D2926]'
              }`}
            >
              ހުރިހާ ޕްރޮގްރާމެއް ({mediaList.length})
            </button>

            <button
              onClick={() => setSelectedFilter('deaf_accessible')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-thaana whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedFilter === 'deaf_accessible'
                  ? 'bg-[#8B2E34] text-white shadow-xs ring-2 ring-[#8B2E34]/30'
                  : 'bg-[#F9EDED] text-[#8B2E34] hover:bg-[#F9EDED]/80 border border-[#8B2E34]/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#F27D26]" />
              <span>އިޝާރާތުގެ ބަހުރުވަ (Deaf) ({deafCount})</span>
            </button>

            <button
              onClick={() => setSelectedFilter('sisters_family')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-thaana whitespace-nowrap transition-all ${
                selectedFilter === 'sisters_family'
                  ? 'bg-[#8B2E34] text-white shadow-xs'
                  : 'bg-[#FCFBF8] border border-[#E8E4DC] text-[#6E6963] hover:text-[#2D2926]'
              }`}
            >
              އުޚުތުންނާއި ޢާއިލާ
            </button>

            <button
              onClick={() => setSelectedFilter('kids_youth')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-thaana whitespace-nowrap transition-all ${
                selectedFilter === 'kids_youth'
                  ? 'bg-[#8B2E34] text-white shadow-xs'
                  : 'bg-[#FCFBF8] border border-[#E8E4DC] text-[#6E6963] hover:text-[#2D2926]'
              }`}
            >
              ތުއްތުކުދިން & ޒުވާނުން
            </button>

            <button
              onClick={() => setSelectedFilter('ramadan')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-thaana whitespace-nowrap transition-all ${
                selectedFilter === 'ramadan'
                  ? 'bg-[#8B2E34] text-white shadow-xs'
                  : 'bg-[#FCFBF8] border border-[#E8E4DC] text-[#6E6963] hover:text-[#2D2926]'
              }`}
            >
              ރޯދައިގެ ސިލްސިލާ
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E4DC] space-y-3">
          <p className="text-[#6E6963] text-sm font-thaana">
            ތިޔަ ހޯއްދެވި ބާވަތުގެ ޕްރޮގްރާމެއް ނުފެނުނު.
          </p>
          <button
            onClick={() => { setSelectedFilter('all'); setSearchQuery(''); }}
            className="text-xs text-[#8B2E34] font-bold underline underline-offset-4"
          >
            ހުރިހާ ޕްރޮގްރާމްތައް ދައްކަވާ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectMedia(item)}
              className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:border-[#8B2E34]/50"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video overflow-hidden bg-[#171514]">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#8B2E34] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-white">
                    {item.duration}
                  </span>
                </div>

                {/* Deaf Accessibility Tag */}
                {item.isDeafAccessible && (
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#8B2E34] text-white text-[10px] font-bold shadow-md">
                      އިޝާރާތުގެ ބަހުރުވަ
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 text-right space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#6E6963]">
                    <span className="text-[#8B2E34] font-bold">{item.series}</span>
                    <span className="font-mono">{item.publishedDate}</span>
                  </div>

                  <h3 className="font-bold text-[#2D2926] text-base group-hover:text-[#8B2E34] transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#6E6963] line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Interpreter / Speaker row */}
                <div className="pt-3 border-t border-[#E8E4DC] flex items-center justify-between text-xs text-[#6E6963]">
                  {item.interpreter ? (
                    <div className="flex items-center gap-1.5 text-[#8B2E34] font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-[#8B2E34]" />
                      <span className="text-[11px]">އިންޓަޕްރިޓަރ: {item.interpreter.split(' ')[0]}</span>
                    </div>
                  ) : item.speaker ? (
                    <span className="text-[11px] text-[#6E6963]">{item.speaker}</span>
                  ) : (
                    <span className="text-[11px] text-[#6E6963]">{item.partner}</span>
                  )}

                  <span className="text-[11px] text-[#8B2E34] font-bold group-hover:underline">
                    ބައްލަވާ →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
