import { useState } from 'react';
import { VolunteerApplication } from '../types';
import { NGO_CONTACT } from '../data/initialData';
import { 
  Users, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  HelpCircle, 
  MessageSquare, 
  HeartHandshake,
  ArrowUpRight 
} from 'lucide-react';

interface VolunteerPageProps {
  onVolunteerRegistered?: (application: VolunteerApplication) => void;
}

export default function VolunteerPage({ onVolunteerRegistered }: VolunteerPageProps) {
  // Volunteer form state
  const [track, setTrack] = useState<'sisters' | 'brothers'>('sisters');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [islandCity, setIslandCity] = useState('މާލެ');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [availability, setAvailability] = useState('ހަވީރު އަދި ރޭގަނޑު');
  const [notes, setNotes] = useState('');
  const [isSubmittingVol, setIsSubmittingVol] = useState(false);
  const [volSuccess, setVolSuccess] = useState(false);
  const [volError, setVolError] = useState('');

  // General inquiry form state
  const [inqName, setInqName] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqSubject, setInqSubject] = useState('');
  const [inqMessage, setInqMessage] = useState('');
  const [inqSuccess, setInqSuccess] = useState(false);

  const sisterInterests = [
    'އިވެންޓް ކޯޑިނޭޝަން އަދި އިންތިޒާމު',
    'ކުޑަކުދިންގެ ޕްރޮގްރާމްތަކުގައި އެހީތެރިވުން',
    'ކޮންޓެންޓް ރައިޓިންގ އަދި މީޑިއާ',
    'އުޚުތުންގެ މުރާޖަޢާ ވޯކްޝޮޕްތައް',
    'އިދާރީ މަސައްކަތް'
  ];

  const brotherInterests = [
    'ލޮޖިސްޓިކްސް އަދި ތަކެތި އުފުލުން',
    'އޯޑިއޯ ވީޑިއޯ / ޓެކްނިކަލް ސެޓަޕް',
    'ދަރުސްތަކުގެ ސެކިއުރިޓީ އަދި މަގުދެއްކުން',
    'ދަތުރުފަތުރުގެ އެހީތެރިކަން',
    'ބޮޑެތި އިވެންޓްތަކުގެ މާލަން ތައްޔާރުކުރުން'
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setVolError('އިލްތިމާސް: ނަމާއި ފޯނު ނަންބަރު ފުރިހަމަކުރައްވާ');
      return;
    }

    setIsSubmittingVol(true);
    setVolError('');

    const newApp: VolunteerApplication = {
      id: `vol-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      islandCity: islandCity.trim(),
      track,
      interests: selectedInterests.length > 0 ? selectedInterests : ['ޢާންމު ވޮލަންޓިއަރ މަސައްކަތް'],
      availability,
      notes: notes.trim() || undefined,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setTimeout(() => {
      if (onVolunteerRegistered) {
        onVolunteerRegistered(newApp);
      }

      setIsSubmittingVol(false);
      setVolSuccess(true);
    }, 400);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqName.trim() || !inqPhone.trim() || !inqMessage.trim()) return;
    setInqSuccess(true);
    setTimeout(() => {
      setInqSuccess(false);
      setInqName('');
      setInqPhone('');
      setInqSubject('');
      setInqMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14 font-thaana">
      {/* Header Banner with Harmonized Emerald Theme */}
      <div className="bg-gradient-to-l from-[#134e3e] via-[#1B6B52] to-[#124b3b] text-white p-8 sm:p-10 rounded-3xl border border-[#145541] shadow-xl text-right space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[#A7F3D0] text-xs font-semibold">
          <Users className="w-3.5 h-3.5 text-[#A7F3D0]" />
          <span>ހެޔޮ ޢަމަލުގައި ބައިވެރިވެލައްވާ</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          ވޮލަންޓިއަރ ވުމާއި ގުޅުއްވުމަށް
        </h1>
        <p className="text-sm sm:text-base text-[#EBF5F0] max-w-3xl leading-relaxed">
          ހެޔޮބިންގާއަކީ އުޚުތުންގެ ލީޑަރޝިޕްގައި ހިންގޭ ޖަމްޢިއްޔާއަކަށްވާއިރު، އިވެންޓްތަކުގެ ލޮޖިސްޓިކްސްއާއި ބޮޑެތި ޙަރަކާތްތަކުގައި ފިރިހެން ވޮލަންޓިއަރުންގެ އެހީތެރިކަން މަރުޙަބާ ކިޔަމެވެ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Volunteer Registration Form - Primary Focus */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E9E5] shadow-sm text-right space-y-6">
          <div>
            <div className="flex items-center gap-2 text-[#1B6B52] font-bold text-sm">
              <HeartHandshake className="w-4 h-4 text-[#1B6B52]" />
              <span>ވޮލަންޓިއަރ ރަޖިސްޓްރޭޝަން</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1C2622] mt-1">
              ހެޔޮބިންގާގެ ވޮލަންޓިއަރ ޓީމާ ގުޅިވަޑައިގަންނަވާ
            </h2>
            <p className="text-xs sm:text-sm text-[#556660] mt-1 leading-relaxed">
              ތިޔަބޭފުޅާގެ ވަގުތާއި ހުނަރު އިސްލާމީ ދަޢުވަތަށާއި މުޖުތަމަޢުގެ ޚިދުމަތުގައި ހޭދަކުރައްވާ.
            </p>
          </div>

          {/* Track Selector: Sisters vs Brothers */}
          <div className="p-1.5 rounded-2xl bg-[#F8FAF9] border border-[#E2E9E5] grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setTrack('sisters'); setSelectedInterests([]); }}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                track === 'sisters'
                  ? 'bg-[#1B6B52] text-white shadow-md'
                  : 'text-[#556660] hover:text-[#1C2622]'
              }`}
            >
              <span>1. އުޚުތުންގެ ޓްރެކް (Sisters)</span>
              <span className="text-[10px] font-normal opacity-90">ކޯ މެނޭޖްމަންޓް & ވޯކްޝޮޕްތައް</span>
            </button>

            <button
              type="button"
              onClick={() => { setTrack('brothers'); setSelectedInterests([]); }}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                track === 'brothers'
                  ? 'bg-[#1C2622] text-white shadow-md'
                  : 'text-[#556660] hover:text-[#1C2622]'
              }`}
            >
              <span>2. އަޚުންގެ ޓްރެކް (Brothers)</span>
              <span className="text-[10px] font-normal opacity-90">ލޮޖިސްޓިކްސް & ޓެކްނިކަލް އެހީ</span>
            </button>
          </div>

          {volSuccess ? (
            <div className="p-8 text-center bg-[#F8FAF9] rounded-2xl border border-[#C8E0D5] space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#EBF5F0] text-[#1B6B52] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#1C2622]">ޝުކުރިއްޔާ! ފޯމު ލިބިއްޖެ</h3>
              <p className="text-xs text-[#556660] max-w-sm mx-auto leading-relaxed">
                ހެޔޮބިންގާގެ ވޮލަންޓިއަރ ލިސްޓަށް ތިޔަބޭފުޅާގެ މަޢުލޫމާތު އިތުރުކުރެވިއްޖެއެވެ. އަވަހަށް ގުޅުއްވަން ބޭނުންފުޅުނަމަ ވައިބަރ މެދުވެރިކޮށް މެސެޖު ކޮށްލައްވާށެވެ.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={NGO_CONTACT.viberLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#7360F2] hover:bg-[#604CE2] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>ވައިބަރ މެދުވެރިކޮށް ގުޅުއްވާ ({NGO_CONTACT.viberNumberFormatted})</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setVolSuccess(false)}
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#E2E9E5] hover:bg-slate-50 text-[#1C2622] font-semibold text-xs"
                >
                  އަނެއްކާވެސް ފޯމެއް ފުރުއްވުމަށް
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVolunteerSubmit} className="space-y-4">
              {volError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{volError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C2622] mb-1">
                    ފުރިހަމަ ނަން <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ނަން ލިޔުއްވާ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E9E5] text-sm focus:ring-2 focus:ring-[#1B6B52] focus:border-[#1B6B52] focus:outline-none text-right bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2622] mb-1">
                    ފޯނު ނަންބަރު <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="7789012"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E9E5] text-sm font-latin focus:ring-2 focus:ring-[#1B6B52] focus:border-[#1B6B52] focus:outline-none text-right bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C2622] mb-1">
                    އީމެއިލް (އިޚްތިޔާރީ)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E9E5] text-sm font-latin focus:ring-2 focus:ring-[#1B6B52] focus:border-[#1B6B52] focus:outline-none text-right bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2622] mb-1">
                    ދިރިއުޅޭ ރަށް / އަވަށް
                  </label>
                  <input
                    type="text"
                    value={islandCity}
                    onChange={(e) => setIslandCity(e.target.value)}
                    placeholder="މިސާލު: މާލެ، ހުޅުމާލެ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E9E5] text-sm focus:ring-2 focus:ring-[#1B6B52] focus:border-[#1B6B52] focus:outline-none text-right bg-white"
                  />
                </div>
              </div>

              {/* Interests Checklist */}
              <div>
                <label className="block text-xs font-semibold text-[#1C2622] mb-2">
                  އެހީތެރިވެދެވޭނެ ދާއިރާތައް:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(track === 'sisters' ? sisterInterests : brotherInterests).map((interest, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => toggleInterest(interest)}
                      className={`p-2.5 rounded-xl text-xs text-right border transition-all flex items-center justify-between gap-2 ${
                        selectedInterests.includes(interest)
                          ? 'bg-[#EBF5F0] border-[#1B6B52] text-[#1B6B52] font-bold'
                          : 'bg-[#F8FAF9] border-[#E2E9E5] text-[#556660] hover:bg-[#EBF5F0]/50'
                      }`}
                    >
                      <span>{interest}</span>
                      {selectedInterests.includes(interest) && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1B6B52] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-xs font-semibold text-[#1C2622] mb-1">
                  ވަގުތު ދެވޭނެ ގަޑިތައް
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E9E5] text-sm focus:ring-2 focus:ring-[#1B6B52] bg-white text-right"
                >
                  <option value="ހަވީރު އަދި ރޭގަނޑު">ހަވީރު އަދި ރޭގަނޑު</option>
                  <option value="ހަމައެކަނި ބަންދު ދުވަސްތަކުގައި">ހަމައެކަނި ބަންދު ދުވަސްތަކުގައި (ހުކުރު / ހޮނިހިރު)</option>
                  <option value="ހެނދުނު ގަޑިތަކުގައި">ހެނދުނު ގަޑިތަކުގައި</option>
                  <option value="ކޮންމެ ވަގުތަކުވެސް (ކޯލް ލިބުމުން)">ކޮންމެ ވަގުތަކުވެސް (ކޯލް ލިބުމުން)</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#1C2622] mb-1">
                  އިތުރު މަޢުލޫމާތު ނުވަތަ ތަޖުރިބާ (އިޚްތިޔާރީ)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ކުރިން ވޮލަންޓިއަރ ކޮށްފައިވާ ދާއިރާތައް ނުވަތަ ޚާއްޞަ ހުނަރު..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E9E5] text-sm focus:ring-2 focus:ring-[#1B6B52] focus:border-[#1B6B52] focus:outline-none text-right bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingVol}
                className="w-full py-3 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                {isSubmittingVol ? (
                  <span>ފޯމު ފޮނުވެނީ...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ވޮލަންޓިއަރ ފޯމު ފޮނުއްވާ</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* General Inquiry Form & Contact Info */}
        <div className="lg:col-span-5 space-y-6 text-right">
          {/* General Inquiry Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E9E5] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#1B6B52] font-bold text-sm">
              <Mail className="w-4 h-4 text-[#1B6B52]" />
              <span>ޢާންމު ސުވާލާއި މެސެޖް (Inquiry)</span>
            </div>
            <h3 className="text-lg font-bold text-[#1C2622]">
              ޖަމިއްޔާއަށް މެސެޖެއް ފޮނުއްވާ
            </h3>

            {inqSuccess ? (
              <div className="p-4 bg-[#EBF5F0] border border-[#C8E0D5] rounded-xl text-[#1B6B52] text-xs text-center font-semibold">
                ޝުކުރިއްޔާ! ތިޔަ ފޮނުއްވި މެސެޖަށް އަޅުގަނޑުމެން އަވަހަށް ޖަވާބުދާރީވާނަމެވެ.
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1C2622] mb-1">
                    ނަން
                  </label>
                  <input
                    type="text"
                    required
                    value={inqName}
                    onChange={(e) => setInqName(e.target.value)}
                    placeholder="ފުރިހަމަ ނަން"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs focus:ring-2 focus:ring-[#1B6B52] focus:border-[#1B6B52] focus:outline-none text-right bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2622] mb-1">
                    ފޯނު ނަންބަރު
                  </label>
                  <input
                    type="tel"
                    required
                    value={inqPhone}
                    onChange={(e) => setInqPhone(e.target.value)}
                    placeholder="7789012"
                    dir="ltr"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs font-latin focus:ring-2 focus:ring-[#1B6B52] focus:border-[#1B6B52] focus:outline-none text-right bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2622] mb-1">
                    މައުޟޫޢު
                  </label>
                  <input
                    type="text"
                    value={inqSubject}
                    onChange={(e) => setInqSubject(e.target.value)}
                    placeholder="ސުވާލު ނުވަތަ ޚިޔާލު"
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs focus:ring-2 focus:ring-[#1B6B52] focus:border-[#1B6B52] focus:outline-none text-right bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2622] mb-1">
                    މެސެޖް
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={inqMessage}
                    onChange={(e) => setInqMessage(e.target.value)}
                    placeholder="ތިޔަބޭފުޅާގެ މެސެޖް ލިޔުއްވާ..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E9E5] text-xs focus:ring-2 focus:ring-[#1B6B52] focus:border-[#1B6B52] focus:outline-none text-right bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#1B6B52] hover:bg-[#145541] text-white font-bold text-xs shadow-sm transition-colors active:scale-98"
                >
                  މެސެޖް ފޮނުއްވާ
                </button>
              </form>
            )}
          </div>

          {/* Contact Details Card */}
          <div className="bg-gradient-to-br from-[#0F231D] via-[#142E26] to-[#0A1612] text-white rounded-3xl p-6 sm:p-7 border border-[#234A3E] space-y-4 shadow-lg">
            <h4 className="font-bold text-sm text-[#A7F3D0] border-b border-white/10 pb-2.5">
              ރަސްމީ އޮފީސް & ގުޅޭނެ ގޮތްތައް
            </h4>
            <div className="space-y-3.5 text-xs text-[#EBF5F0]">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#38D39F] shrink-0" />
                <span>މާލެ، ދިވެހިރާއްޖެ (ހެޔޮބިންގާ އެންޖީއޯ)</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#38D39F] shrink-0" />
                <span dir="ltr" className="font-latin">{NGO_CONTACT.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#38D39F] shrink-0" />
                <span dir="ltr" className="font-latin">{NGO_CONTACT.email}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 text-[11px] text-[#A7F3D0]/80">
              ރަސްމީ ރަޖިސްޓްރޭޝަން: CR/12/2024 (15 ޖެނުއަރީ 2024)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
