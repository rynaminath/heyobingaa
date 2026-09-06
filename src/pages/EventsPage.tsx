import { useState } from 'react';
import { EventItem, NavigationTab } from '../types';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Tv, 
  Users, 
  HeartHandshake, 
  Share2, 
  Bell, 
  CheckCircle2, 
  Radio, 
  ExternalLink 
} from 'lucide-react';

interface EventsPageProps {
  events: EventItem[];
  onNavigate: (tab: NavigationTab) => void;
  onOpenDonateModal: () => void;
}

export default function EventsPage({ events, onNavigate, onOpenDonateModal }: EventsPageProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');
  const [savedReminder, setSavedReminder] = useState<string | null>(null);

  const filteredEvents = events.filter((ev) => {
    if (filter === 'all') return true;
    return ev.status === filter;
  });

  const handleSetReminder = (eventTitle: string) => {
    setSavedReminder(eventTitle);
    setTimeout(() => setSavedReminder(null), 3500);

    // Provide modern iCalendar download format
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Heyo Bingaa NGO//Events//DV
BEGIN:VEVENT
SUMMARY:${eventTitle}
DESCRIPTION:Heyo Bingaa NGO Lecture
LOCATION:Islamic Ministry Hall
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${eventTitle}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-thaana">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-[#134e3e] via-[#1B6B52] to-[#124b3b] text-white p-8 sm:p-10 rounded-3xl border border-[#145541] shadow-xl text-right space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#A7F3D0] text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-[#FDE68A]" />
          <span>އާންމު ދަރުސްތަކާއި ސެޝަންތައް</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          ދަރުސްތަކާއި ޙަރަކާތްތައް
        </h1>
        <p className="text-sm sm:text-base text-[#EBF5F0] max-w-3xl leading-relaxed">
          މިނިސްޓްރީ އޮފް އިސްލާމިކް އެފެއާޒް އަދި ދާރިސް ޓީވީގެ އެއްބާރުލުމާއެކު އިންތިޒާމުކުރެވޭ ބޮޑެތި ޢާންމު ދަރުސްތަކާއި، ސެމިނާރތަކުގެ މަޢުލޫމާތު.
        </p>
      </div>

      {/* Reminder notification toast */}
      {savedReminder && (
        <div className="p-4 rounded-2xl bg-[#F9EDED] border border-[#8B2E34]/30 text-[#2D2926] text-sm flex items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#8B2E34] shrink-0" />
            <span>
              "{savedReminder}" ކަލަންޑަރަށް އިތުރުކުރެވިއްޖެ! އިވެންޓް ފެށުމުގެ ކުރިން ހަނދާންކޮށްދޭނެއެވެ.
            </span>
          </div>
          <button
            onClick={() => setSavedReminder(null)}
            className="text-xs font-bold text-[#8B2E34] underline"
          >
            ބަންދުކުރައްވާ
          </button>
        </div>
      )}

      {/* Events Filter Tabs */}
      <div className="flex items-center gap-3 border-b border-[#E5ECE8] pb-3">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            filter === 'upcoming'
              ? 'bg-[#1B6B52] text-white shadow-xs'
              : 'bg-[#FAFCFB] border border-[#E5ECE8] text-[#556660] hover:text-[#1C2622]'
          }`}
        >
          ކުރިއަށް ހުރި ޙަރަކާތްތައް
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            filter === 'all'
              ? 'bg-[#1B6B52] text-white shadow-xs'
              : 'bg-[#FAFCFB] border border-[#E5ECE8] text-[#556660] hover:text-[#1C2622]'
          }`}
        >
          ހުރިހާ ދަރުސްތަކެއް ({events.length})
        </button>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5ECE8] space-y-3">
          <Calendar className="w-12 h-12 text-[#1B6B52]/40 mx-auto" />
          <h3 className="text-lg font-bold text-[#1C2622]">އަދި އެއްވެސް އިވެންޓެއް ނެތް</h3>
          <p className="text-sm text-[#556660] max-w-md mx-auto">
            ކުރިއަށް އޮތް ދަރުސްތަކާއި ޕްރޮގްރާމްތަކުގެ މަޢުލޫމާތު ވަރަށް އަވަހަށް އިތުރުކުރެވޭނެއެވެ.
          </p>
        </div>
      ) : (
        <>
          {/* Featured Flagship Event Detailed Module */}
      {events.filter(e => e.isFeatured).map((ev) => (
        <div
          key={ev.id}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F231D] via-[#142E26] to-[#0A1612] text-white border-2 border-[#1B6B52]/60 shadow-2xl p-6 sm:p-10 space-y-6 text-right"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#1B6B52] text-white font-bold text-xs">
                ޚާއްޞަ އިވެންޓް
              </span>
              <span className="text-xs text-[#A7F3D0] font-bold">
                {ev.partnerOrganization}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#EBF5F0] bg-[#18392F] px-3 py-1 rounded-lg border border-[#234A3E]">
              <Radio className="w-3.5 h-3.5 text-[#38D39F] animate-ping" />
              <span>ދާރިސް ޓީވީން ލައިވް ދެއްކުން</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[#F27D26] font-bold text-sm block">
              މިނިސްޓްރީ އޮފް އިސްލާމިކް އެފެއާޒް ހޯލުގައި ބޭއްވޭ ޚާއްޞަ ދަރުސް
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              "{ev.title}"
            </h2>
            <p className="text-base sm:text-lg font-bold text-[#F9EDED]">
              ދަރުސް ދެއްވަނީ: {ev.speaker}
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#D8D2C7] leading-relaxed max-w-4xl">
            {ev.description}
          </p>

          {/* Grid of Key Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs sm:text-sm">
            <div className="space-y-1">
              <span className="text-neutral-400 text-[11px] block">ތަން / މާލަން:</span>
              <div className="flex items-center gap-2 font-bold text-white">
                <MapPin className="w-4 h-4 text-[#F27D26] shrink-0" />
                <span>{ev.venue}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-neutral-400 text-[11px] block">ދުވަސް:</span>
              <div className="flex items-center gap-2 font-bold text-white">
                <Calendar className="w-4 h-4 text-[#F27D26] shrink-0" />
                <span>{ev.dayText}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-neutral-400 text-[11px] block">ގަޑި:</span>
              <div className="flex items-center gap-2 font-bold text-white">
                <Clock className="w-4 h-4 text-[#F27D26] shrink-0" />
                <span>{ev.time}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-neutral-400 text-[11px] block">ބައިވެރިވެވޭ ފަރާތްތައް:</span>
              <div className="flex items-center gap-2 font-bold text-[#F9EDED]">
                <Users className="w-4 h-4 text-[#F27D26] shrink-0" />
                <span>{ev.audience}</span>
              </div>
            </div>
          </div>

          {/* Live broadcast notice & Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#D8D2C7]">
              <Tv className="w-4 h-4 text-[#F27D26]" />
              <span>ބްރޯޑްކާސްޓް: {ev.broadcast}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleSetReminder(ev.title)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors border border-white/10"
              >
                <Bell className="w-4 h-4 text-[#F27D26]" />
                <span>ކަލަންޑަރަށް އިތުރުކުރައްވާ (ICS)</span>
              </button>

              <button
                type="button"
                onClick={onOpenDonateModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B2E34] hover:bg-[#702328] text-white font-bold text-xs shadow-md transition-all"
              >
                <HeartHandshake className="w-4 h-4 text-[#F27D26]" />
                <span>ދަރުސް އިންތިޒާމަށް އެހީވެލައްވާ</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Other Events Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#2D2926] text-right">
          އިތުރު ދަރުސްތަކާއި ޕްރޮގްރާމްތައް
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.filter(e => !e.isFeatured).map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-xs hover:border-[#8B2E34]/40 hover:shadow-md transition-all text-right space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F9EDED] text-[#8B2E34] font-bold">
                    {ev.status === 'upcoming' ? 'ކުރިއަށް އޮތީ' : 'ނިމިފައި'}
                  </span>
                  <span className="text-xs text-[#6E6963] font-mono">{ev.date}</span>
                </div>

                <h4 className="text-lg font-bold text-[#2D2926]">{ev.title}</h4>
                <p className="text-xs font-semibold text-[#8B2E34]">ވާހަކަދައްކަވަނީ: {ev.speaker}</p>
                <p className="text-xs text-[#6E6963] leading-relaxed">{ev.description}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[#E8E4DC] text-xs text-[#6E6963]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#6E6963] shrink-0" />
                  <span>{ev.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#6E6963] shrink-0" />
                  <span>{ev.dayText} - {ev.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#6E6963] shrink-0" />
                  <span>{ev.audience}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleSetReminder(ev.title)}
                  className="text-xs text-[#8B2E34] hover:text-[#702328] font-bold flex items-center gap-1"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>ހަނދާންކޮށްދިނުން (Remind Me)</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenDonateModal}
                  className="text-xs text-[#F27D26] hover:underline font-bold"
                >
                  އެހީވެލައްވާ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
        </>
      )}
    </div>
  );
}
