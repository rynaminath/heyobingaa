import { useState } from 'react';
import { MediaItem } from '../types';
import { Video, Play, Search, CheckCircle2, Youtube, ExternalLink, BookOpen, Layers } from 'lucide-react';
import { NGO_CONTACT } from '../data/initialData';

interface MediaArchivePageProps {
  mediaList: MediaItem[];
  onSelectMedia: (media: MediaItem) => void;
}

export default function MediaArchivePage({ mediaList, onSelectMedia }: MediaArchivePageProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'kithaabuh_salaath' | 'deaf_accessible' | 'sisters_family' | 'ramadan'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedia = mediaList.filter((item) => {
    const matchesFilter = selectedFilter === 'all' 
      ? true 
      : selectedFilter === 'kithaabuh_salaath'
        ? item.series === 'ކިތާބުއްޞަލާތު'
        : selectedFilter === 'deaf_accessible' 
          ? item.isDeafAccessible 
          : item.category === selectedFilter;

    const matchesSearch = searchQuery.trim() === ''
      ? true
      : item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.speaker && item.speaker.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.interpreter && item.interpreter.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const deafCount = mediaList.filter((m) => m.isDeafAccessible).length;
  const kithaabuhSalaathCount = mediaList.filter((m) => m.series === 'ކިތާބުއްޞަލާތު').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-thaana">
      {/* Header with YouTube Channel & Dhaaris TV Collab Hub */}
      <div className="bg-linear-to-r from-[#0F231D] via-[#142E26] to-[#0A1612] text-white p-6 sm:p-10 rounded-3xl border border-[#234A3E] shadow-xl text-right space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1B6B52]/50 border border-[#1B6B52] text-[#EBF5F0] text-xs font-semibold">
            <Video className="w-4 h-4 text-[#A7F3D0]" />
            <span>ހެޔޮބިންގާ ރަސްމީ ވީޑިއޯ އާކައިވް ({mediaList.length} ވީޑިއޯ)</span>
          </div>
          
          <a
            href={NGO_CONTACT.socialMedia.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E02424] hover:bg-[#C81E1E] text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <Youtube className="w-4 h-4 fill-current" />
            <span>ޔޫޓިއުބް ޗެނަލް (@heyobingaa)</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
          </a>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          ވީޑިއޯތައް (Videos & YouTube Channel)
        </h1>

        <p className="text-sm sm:text-base text-[#A8C4B8] max-w-3xl leading-relaxed">
          ހެޔޮބިންގާގެ ރަސްމީ ޔޫޓިއުބް ޗެނަލް (<span dir="ltr" className="font-mono text-[#A7F3D0]">@heyobingaa</span>) ގެ އެންމެހައި ވީޑިއޯތައް؛ މީގެ ތެރޭގައި ކިތާބުއްޞަލާތުގެ 28 ބައިގެ މުހިންމު ސިލްސިލާއާއި، އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ ފަރާތްތަކަށް އިޝާރާތުގެ ބަހުރުވައިން ގެނެސްދެވޭ ޕްރޮގްރާމްތަކާއި ޢާންމު ދަރުސްތައް ހިމެނެއެވެ.
        </p>

        {/* Deaf accessibility alert callout */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-[#EBF5F0]">
            <CheckCircle2 className="w-5 h-5 text-[#38D39F] shrink-0" />
            <span>
              އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ ކުދިންނާއި ފަރާތްތަކަށް ޚާއްޞަކޮށް <strong>{deafCount} ޕްރޮގްރާމް</strong> އިޝާރާތުގެ ބަހުރުވައިން ތައްޔާރުކުރެވިފައިވެއެވެ.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedFilter('deaf_accessible');
              setSearchQuery('');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[#1B6B52] hover:bg-[#145541] text-white font-bold transition-colors shrink-0 text-center cursor-pointer"
          >
            އިޝާރާތުގެ ބަހުރުވައިގެ ވީޑިއޯތައް އެކަނި ބައްލަވާ
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5ECE8] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#556660] absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ވީޑިއޯ ނުވަތަ މައުޟޫޢުގެ ނަމުން ހޯއްދަވާ..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-[#E5ECE8] text-xs sm:text-sm font-thaana focus:outline-none focus:ring-2 focus:ring-[#1B6B52] text-right bg-[#FAFCFB]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-thaana whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-[#1B6B52] text-white shadow-xs'
                  : 'bg-[#FAFCFB] border border-[#E5ECE8] text-[#556660] hover:text-[#1C2622]'
              }`}
            >
              ހުރިހާ ވީޑިއޯއެއް ({mediaList.length})
            </button>

            <button
              onClick={() => setSelectedFilter('kithaabuh_salaath')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-thaana whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedFilter === 'kithaabuh_salaath'
                  ? 'bg-[#1B6B52] text-white shadow-xs ring-2 ring-[#1B6B52]/30'
                  : 'bg-[#FAFCFB] border border-[#E5ECE8] text-[#556660] hover:text-[#1C2622]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>ކިތާބުއްޞަލާތު ({kithaabuhSalaathCount} ބައި)</span>
            </button>

            <button
              onClick={() => setSelectedFilter('deaf_accessible')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-thaana whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedFilter === 'deaf_accessible'
                  ? 'bg-[#1B6B52] text-white shadow-xs ring-2 ring-[#1B6B52]/30'
                  : 'bg-[#EBF5F0] text-[#1B6B52] hover:bg-[#EBF5F0]/80 border border-[#1B6B52]/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#38D39F]" />
              <span>އިޝާރާތުގެ ބަހުރުވަ (Deaf) ({deafCount})</span>
            </button>

            <button
              onClick={() => setSelectedFilter('sisters_family')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-thaana whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === 'sisters_family'
                  ? 'bg-[#1B6B52] text-white shadow-xs'
                  : 'bg-[#FAFCFB] border border-[#E5ECE8] text-[#556660] hover:text-[#1C2622]'
              }`}
            >
              ޢާންމު ދަރުސްތައް
            </button>

            <button
              onClick={() => setSelectedFilter('ramadan')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-thaana whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === 'ramadan'
                  ? 'bg-[#1B6B52] text-white shadow-xs'
                  : 'bg-[#FAFCFB] border border-[#E5ECE8] text-[#556660] hover:text-[#1C2622]'
              }`}
            >
              ރޯދައިގެ ސިލްސިލާ
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5ECE8] space-y-3">
          <p className="text-[#556660] text-sm font-thaana">
            ތިޔަ ހޯއްދެވި ބާވަތުގެ ވީޑިއޯއެއް ނުފެނުނު.
          </p>
          <button
            onClick={() => { setSelectedFilter('all'); setSearchQuery(''); }}
            className="text-xs text-[#1B6B52] font-bold underline underline-offset-4 cursor-pointer"
          >
            ހުރިހާ ވީޑިއޯތައް ދައްކަވާ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectMedia(item)}
              className="bg-white rounded-2xl border border-[#E5ECE8] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:border-[#1B6B52]/50 hover:-translate-y-1"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video overflow-hidden bg-[#0A1612]">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const fallbackVid = item.videoEmbedUrl?.split('/embed/')[1] || '';
                    if (fallbackVid) {
                      (e.currentTarget as HTMLImageElement).src = `https://i.ytimg.com/vi/${fallbackVid}/hqdefault.jpg`;
                    }
                  }}
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#B83244] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Duration badge */}
                {item.duration && (
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/80 text-[11px] font-mono text-white backdrop-blur-xs" dir="ltr">
                      {item.duration}
                    </span>
                  </div>
                )}

                {/* Episode Badge if exists */}
                {item.episodeNumber !== undefined && (
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#1B6B52]/90 text-[11px] font-bold text-white shadow-xs font-thaana">
                      ބައި {String(item.episodeNumber).padStart(2, '0')}
                    </span>
                  </div>
                )}

                {/* Deaf Accessibility Tag */}
                {item.isDeafAccessible && (
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1B6B52] text-white text-[10px] font-bold shadow-md">
                      އިޝާރާތުގެ ބަހުރުވަ
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 text-right space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#556660]">
                    <span className="text-[#1B6B52] font-bold flex items-center gap-1">
                      <Layers className="w-3 h-3 text-[#1B6B52]" />
                      <span>{item.series}</span>
                    </span>
                    {item.viewsCount && (
                      <span className="font-mono text-gray-500" dir="ltr">
                        {item.viewsCount}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-[#1C2622] text-sm sm:text-base leading-snug group-hover:text-[#1B6B52] transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#556660] leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5ECE8] flex items-center justify-between text-xs text-[#556660]">
                  <span className="text-[#B83244] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>ވީޑިއޯ ބައްލަވާ</span>
                    <span dir="ltr">←</span>
                  </span>

                  <span className="text-[11px] text-gray-500">
                    {item.speaker || item.partner}
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
