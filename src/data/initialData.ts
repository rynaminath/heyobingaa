import { BankAccount, EventItem, MediaItem, ProgramItem, PartnerOrg, DonationSlip, VolunteerApplication } from '../types';

export const NGO_CONTACT = {
  viberNumber: '+9607522778',
  viberNumberFormatted: '+960 752-2778',
  viberLink: 'viber://chat?number=%2B9607522778',
  viberWebLink: 'https://msng.link/o?9607522778=vi',
  phone: '+960 752-2778',
  mobile: '+960 752-2778',
  secondaryPhone: '+960 752-2778',
  email: 'info@heyobingaa.com',
  website: 'www.heyobingaa.com',
  websiteUrl: 'https://www.heyobingaa.com',
  address: 'މާލެ، ދިވެހިރާއްޖެ (Male\', Maldives)',
  socialMedia: {
    facebook: 'https://www.facebook.com/heyobingaa',
    instagram: 'https://www.instagram.com/heyobingaa',
    youtube: 'https://www.youtube.com/@heyobingaa'
  }
};

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bml-mvr',
    bankName: 'ބޭންކް އޮފް މޯލްޑިވްސް (BML)',
    bankCode: 'BML',
    accountName: 'HEYO BINGAA',
    accountNumber: '7770000179374',
    currency: 'MVR',
    badge: 'ދިވެހި ރުފިޔާ (MVR)'
  },
  {
    id: 'bml-usd',
    bankName: 'ބޭންކް އޮފް މޯލްޑިވްސް (BML)',
    bankCode: 'BML',
    accountName: 'HEYO BINGAA',
    accountNumber: '7770000179375',
    currency: 'USD',
    badge: 'ޔޫ.އެސް ޑޮލަރު (USD)'
  },
  {
    id: 'mib-mvr',
    bankName: 'މޯލްޑިވްސް އިސްލާމިކް ބޭންކް (MIB)',
    bankCode: 'MIB',
    accountName: 'HEYO BINGAA',
    accountNumber: '90101555001661000',
    currency: 'MVR',
    badge: 'ދިވެހި ރުފިޔާ (MVR)'
  },
  {
    id: 'mib-usd',
    bankName: 'މޯލްޑިވްސް އިސްލާމިކް ބޭންކް (MIB)',
    bankCode: 'MIB',
    accountName: 'HEYO BINGAA',
    accountNumber: '90101555001662000',
    currency: 'USD',
    badge: 'ޔޫ.އެސް ޑޮލަރު (USD)'
  }
];

export const PARTNERS: PartnerOrg[] = [
  {
    id: 'islamic-affairs',
    nameDv: 'މިނިސްޓްރީ އޮފް އިސްލާމިކް އެފެއާޒް',
    nameEn: 'Ministry of Islamic Affairs',
    role: 'ދަރުސްތަކާއި ޤައުމީ ޙަރަކާތްތަކުގެ އެއްބާރުލުން',
    tag: 'ސަރުކާރުގެ ބައިވެރިޔާ',
    accentColor: 'emerald'
  },
  {
    id: 'salaf',
    nameDv: 'ޖަމްޢިއްޔަތުއް ސަލަފް',
    nameEn: 'Jamiyyathul Salaf',
    role: 'ދީނީ ޕްރޮގްރާމްތަކާއި ދަރުސްތައް އިންތިޒާމުކުރުން',
    tag: 'ދަޢުވަތީ ބައިވެރިޔާ',
    accentColor: 'green'
  },
  {
    id: 'dhares-tv',
    nameDv: 'ދާރިސް ޓީވީ',
    nameEn: 'Dhaaris TV',
    role: 'ޓީވީ ޕްރޮގްރާމްތަކާއި އިޝާރާތުގެ ބަހުރުވަ އުފެއްދުން',
    tag: 'މީޑިއާ ބައިވެރިޔާ',
    accentColor: 'blue'
  },
  {
    id: 'peace-foundation',
    nameDv: 'ޕީސް ފައުންޑޭޝަން',
    nameEn: 'Peace Foundation',
    role: 'އިޖުތިމާޢީ އަދި ދަޢުވަތީ ގުޅިފައިވާ ޙަރަކާތްތައް',
    tag: 'އެންޖީއޯ ބައިވެރިޔާ',
    accentColor: 'teal'
  },
  {
    id: 'al-asr',
    nameDv: 'އަލް ޢަޞްރު',
    nameEn: 'Al-Asr',
    role: 'ދީނީ ޢިލްމާއި ހޭލުންތެރިކުރުން',
    tag: 'ދަޢުވަތީ ބައިވެރިޔާ',
    accentColor: 'indigo'
  },
  {
    id: 'ehee',
    nameDv: 'އެހީ',
    nameEn: 'Ehee NGO',
    role: 'އިންސާނީ އެހީތެރިކަމާއި އިޖުތިމާޢީ ރައްކާތެރިކަން',
    tag: 'އިޖުތިމާޢީ ބައިވެރިޔާ',
    accentColor: 'rose'
  },
  {
    id: 'iac',
    nameDv: 'އިންޓަނޭޝަނަލް އެއިޑް ކެމްޕޭން (IAC)',
    nameEn: 'International Aid Campaign',
    role: 'އިޖުތިމާޢީ އަދި ކާރިސާތަކުގައި ގުޅިގެން މަސައްކަތްކުރުން',
    tag: 'އިންސާނީ ބައިވެރިޔާ',
    accentColor: 'amber'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'event-1',
    title: 'ރޯދައިގެ ހިޔަލުގައި',
    titleEn: 'In the Shadow of Ramadan',
    speaker: 'އައްޝައިޚް ޢަބްދުއްސަލާމް ދާއޫދު',
    venue: 'މިނިސްޓްރީ އޮފް އިސްލާމިކް އެފެއާޒް ހޯލް',
    date: '2026-03-18',
    time: 'ރޭގަނޑު 8:45',
    dayText: 'ރޯދަ މަހުގެ 28 ވާ ބުދަ ދުވަހުގެ ރޭގަނޑު',
    audience: 'އާންމުކޮށް ހުރިހާ ފަރާތްތަކަށް (އަންހެނުން، ފިރިހެނުން އަދި ހުރިހާ އުމުރުފުރާއެއް)',
    broadcast: 'ދާރެސް ޓީވީ (Dhares TV) އިން ވަގުތުން ލައިވްކޮށް ދުރަށް ދައްކާނެ',
    description: 'ބަރަކާތްތެރި ރޯދަމަހުގެ ފަހު ދިހައިގެ ހެޔޮ ދަރުމައާއި ޘަވާބު ޙާޞިލުކުރުމަށާއި، ރޯދައިގެ ޙަޤީޤީ ރޫޙު ދިރިއުޅުމަށް ގެނައުމާ ގުޅޭގޮތުން ޚާއްޞަ ދަރުހެއް. މިއީ މިނިސްޓްރީ އޮފް އިސްލާމިކް އެފެއާޒްގެ އެއްބާރުލުމާއެކު ހެޔޮބިންގާ އިން އިންތިޒާމުކުރާ ޚާއްޞަ ޙަރަކާތެކެވެ.',
    isFeatured: true,
    status: 'upcoming',
    partnerOrganization: 'މިނިސްޓްރީ އޮފް އިސްލާމިކް އެފެއާޒް & ދާރެސް ޓީވީ'
  },
  {
    id: 'event-2',
    title: 'އުފާވެރި ޢާއިލާއެއްގެ ބިންގާ',
    titleEn: 'Foundation of a Joyful Family',
    speaker: 'ޑރ. އާއިޝަތު ނަޝީދާ & އުޚުތުންގެ ޓީމު',
    venue: 'ހެޔޮބިންގާ ޓްރެއިނިންގ ސެންޓަރ (މާލެ)',
    date: '2026-04-12',
    time: 'ހަވީރު 4:15',
    dayText: 'ހޮނިހިރު ދުވަހުގެ ހަވީރު',
    audience: 'ޚާއްޞަކޮށް ކަނބަލުންނާއި ޒުވާން މައިންބަފައިންނަށް',
    broadcast: 'ޔޫޓިއުބް ޗެނަލް އަދި ފޭސްބުކް ލައިވް',
    description: 'އިސްލާމީ ތަރުބިއްޔަތުގެ އަލީގައި ދަރިން ބަލާބޮޑުކުރުމާއި، ކައިވެނީގެ ގުޅުން ބަދަހިކުރުމަށް އަމާޒުކޮށްގެން ބޭއްވޭ މުރާޖަޢާ މަސައްކަތު ބައްދަލުވުމެއް.',
    isFeatured: false,
    status: 'upcoming',
    partnerOrganization: 'ޕީސް ފައުންޑޭޝަން'
  },
  {
    id: 'event-3',
    title: 'ބީރު އަދި އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ ފަރާތްތަކަށް: ނަމާދުގެ ފިޤުހު',
    titleEn: 'Fiqh of Salah with Sign Language',
    speaker: 'އުސްތާޛު ޢަލީ ޒައިދް (އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާއާއެކު)',
    venue: 'އިސްލާމީ މަރުކަޒުގެ ޖަލްސާކުރާ މާލަން',
    date: '2026-04-25',
    time: 'ރޭގަނޑު 8:30',
    dayText: 'ހުކުރު ދުވަހުގެ ރޭގަނޑު',
    audience: 'ބީރު މުޖުތަމަޢާއި އެބޭފުޅުންގެ ޢާއިލާތަކަށް',
    broadcast: 'ދާރެސް ޓީވީ އަދި ސޯޝަލް މީޑިއާ',
    description: 'ނަމާދުގެ ރުކުންތަކާއި ވާޖިބުތައް އިޝާރާތުގެ ބަހުރުވައިން ތަފްޞީލުކޮށް ބަޔާންކޮށްދޭ ޚާއްޞަ މަޢުލޫމާތު ސެޝަން.',
    isFeatured: false,
    status: 'upcoming',
    partnerOrganization: 'ދާރެސް ޓީވީ'
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'vid-3Q_Za7OtXNA',
    title: 'Roadha Leaflet with full sign-language interpretation (ރޯދަ ލީފްލެޓް: އިޝާރާތުގެ ބަހުރުވައިގެ ފުރިހަމަ ތަރުޖަމާ)',
    series: 'އިޝާރާތުގެ ބަހުރުވަ & ރޯދަ',
    episodeNumber: 1,
    duration: '10 މިނެޓު',
    speaker: 'ހެޔޮބިންގާ ޓީމު',
    interpreter: 'އިޝާރާތުގެ ބަހުރުވައިގެ ފުރިހަމަ ތަރުޖަމާ',
    isDeafAccessible: true,
    partner: 'Heyo Bingaa Official',
    thumbnailUrl: 'https://i.ytimg.com/vi/3Q_Za7OtXNA/hqdefault.jpg',
    videoEmbedUrl: 'https://www.youtube.com/embed/3Q_Za7OtXNA',
    summary: 'ދާރެސް ޓީވީއާ ގުޅިގެން ހެޔޮބިންގާއިން ތައްޔާރުކޮށްފައިވާ ރޯދަ ލީފްލެޓް. ބީރު އަދި އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ ފަރާތްތަކަށް ޚާއްޞަކޮށް ފުރިހަމަ އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާއާއެކު ގެނެސްދެވިފައިވާ މުހިންމު ދަޢުވަތީ ޕްރޮގްރާމެއް.',
    category: 'deaf_accessible',
    publishedDate: '2026-03-01',
    viewsCount: 'Official'
  },
  {
    id: 'vid-tAAUztN_y18',
    title: '24 Kithaabuh Salaath - Hukuru namaadh (ކިތާބުއްޞަލާތު: ހުކުރު ނަމާދު)',
    series: 'ކިތާބުއްޞަލާތު',
    episodeNumber: 24,
    duration: '12 މިނެޓު',
    speaker: 'ހެޔޮބިންގާ ޢިލްމީ ޓީމު',
    isDeafAccessible: true,
    partner: 'Heyo Bingaa Official',
    thumbnailUrl: 'https://i.ytimg.com/vi/tAAUztN_y18/hqdefault.jpg',
    videoEmbedUrl: 'https://www.youtube.com/embed/tAAUztN_y18',
    summary: 'ހުކުރު ނަމާދުގެ ޙުކުމްތަކާއި، ވާޖިބުވާ ފަރާތްތަކާއި، ހުކުރު ދުވަހުގެ މާތްކަމާއި ސުންނަތްތަކާ ގުޅޭގޮތުން ބަޔާންކޮށްދޭ ޢިލްމީ ދަރުސް.',
    category: 'dawah',
    publishedDate: '2026-02-15',
    viewsCount: 'Official'
  },
  {
    id: 'vid-kNHFjC5MsTE',
    title: '27 Kithaabuh Salaath - Eid namaadhah bangi govumaai qamaiy dhinun (ޢީދު ނަމާދަށް ބަންގި ގޮވުމާއި ޤާމަތް ދިނުން)',
    series: 'ކިތާބުއްޞަލާތު',
    episodeNumber: 27,
    duration: '09 މިނެޓު',
    speaker: 'ހެޔޮބިންގާ ޢިލްމީ ޓީމު',
    isDeafAccessible: true,
    partner: 'Heyo Bingaa Official',
    thumbnailUrl: 'https://i.ytimg.com/vi/kNHFjC5MsTE/hqdefault.jpg',
    videoEmbedUrl: 'https://www.youtube.com/embed/kNHFjC5MsTE',
    summary: 'ޢީދު ނަމާދުގެ ޙުކުމްތަކާއި ބަންގި އަދި ޤާމަތާ ގުޅޭ ސުންނަތް ގޮތްތައް އޮޅުންފިލުވައިދިނުން.',
    category: 'dawah',
    publishedDate: '2026-02-10',
    viewsCount: 'Official'
  },
  {
    id: 'vid-i6Zh4FPoatQ',
    title: '07 Kithaabuh Salaath - Fahu attahiyyaathugai salaam dhinumuge kurin (ފަހު އައްތަޙިއްޔާތުގައި ސަލާމް ދިނުމުގެ ކުރިން)',
    series: 'ކިތާބުއްޞަލާތު',
    episodeNumber: 7,
    duration: '11 މިނެޓު',
    speaker: 'ހެޔޮބިންގާ ޢިލްމީ ޓީމު',
    isDeafAccessible: true,
    partner: 'Heyo Bingaa Official',
    thumbnailUrl: 'https://i.ytimg.com/vi/i6Zh4FPoatQ/hqdefault.jpg',
    videoEmbedUrl: 'https://www.youtube.com/embed/i6Zh4FPoatQ',
    summary: 'ނަމާދުގެ ފަހު އައްތަޙިއްޔާތުގައި ސަލާމް ދިނުމުގެ ކުރިން ކިޔަންޖެހޭ މުހިންމު ދުޢާތަކާއި އޭގެ މާނަ.',
    category: 'dawah',
    publishedDate: '2026-01-28',
    viewsCount: 'Official'
  },
  {
    id: 'vid-f2rcIcGQ6O0',
    title: '05 Kithaabuh Salaath - Bismi kiyun (ކިތާބުއްޞަލާތު: ބިސްމި ކިޔުން)',
    series: 'ކިތާބުއްޞަލާތު',
    episodeNumber: 5,
    duration: '08 މިނެޓު',
    speaker: 'ހެޔޮބިންގާ ޢިލްމީ ޓީމު',
    isDeafAccessible: true,
    partner: 'Heyo Bingaa Official',
    thumbnailUrl: 'https://i.ytimg.com/vi/f2rcIcGQ6O0/hqdefault.jpg',
    videoEmbedUrl: 'https://www.youtube.com/embed/f2rcIcGQ6O0',
    summary: 'ނަމާދުގައި ސޫރަތުލް ފާތިޙާ ކިޔެވުމުގެ ކުރިން ބިސްމި ކިޔުމުގެ ޙުކުމްތަކާއި ގޮތްތައް.',
    category: 'dawah',
    publishedDate: '2026-01-20',
    viewsCount: 'Official'
  },
  {
    id: 'vid-yxOBLGFvaEg',
    title: '17 Kithaabuh Salaath - Isthisqaa namaadh (ކިތާބުއްޞަލާތު: އިސްތިސްޤާ ނަމާދު - ވާރޭ ވެއްސެވުން އެދި ކުރާ ނަމާދު)',
    series: 'ކިތާބުއްޞަލާތު',
    episodeNumber: 17,
    duration: '14 މިނެޓު',
    speaker: 'ހެޔޮބިންގާ ޢިލްމީ ޓީމު',
    isDeafAccessible: true,
    partner: 'Heyo Bingaa Official',
    thumbnailUrl: 'https://i.ytimg.com/vi/yxOBLGFvaEg/hqdefault.jpg',
    videoEmbedUrl: 'https://www.youtube.com/embed/yxOBLGFvaEg',
    summary: 'ވާރޭ ނުވެހި ތަދުމަޑުކަން ކުރިމަތިވާ ހިނދު އިސްތިސްޤާ ނަމާދު ކުރާނެ ގޮތާއި އޭގެ ސުންނަތްތައް.',
    category: 'dawah',
    publishedDate: '2026-01-15',
    viewsCount: 'Official'
  },
  {
    id: 'vid-k0Wjov4xkU0',
    title: '15 Kithaabuh Salaath - Haajai Namaadhu adhi Thaubaa namaadh (ޙާޖަތް ނަމާދާއި ތައުބާ ނަމާދު)',
    series: 'ކިތާބުއްޞަލާތު',
    episodeNumber: 15,
    duration: '13 މިނެޓު',
    speaker: 'ހެޔޮބިންގާ ޢިލްމީ ޓީމު',
    isDeafAccessible: true,
    partner: 'Heyo Bingaa Official',
    thumbnailUrl: 'https://i.ytimg.com/vi/k0Wjov4xkU0/hqdefault.jpg',
    videoEmbedUrl: 'https://www.youtube.com/embed/k0Wjov4xkU0',
    summary: 'ބޭނުމެއް ޖެހުމުން ކުރާ ޙާޖަތް ނަމާދާއި ފާފައަކަށްފަހު ކުރާ ތައުބާ ނަމާދާ ގުޅޭ ޞައްޙަ ޙުކުމްތައް.',
    category: 'sisters_family',
    publishedDate: '2026-01-10',
    viewsCount: 'Official'
  },
  {
    id: 'vid-UiAQGUVSRVc',
    title: '25 Kithaabuh Salaath - Ebaehge mahchah hukuru namaadh vaajibu vegenvaa (ހުކުރު ނަމާދު ވާޖިބުވެގެންވާ ފަރާތްތައް)',
    series: 'ކިތާބުއްޞަލާތު',
    episodeNumber: 25,
    duration: '10 މިނެޓު',
    speaker: 'ހެޔޮބިންގާ ޢިލްމީ ޓީމު',
    isDeafAccessible: true,
    partner: 'Heyo Bingaa Official',
    thumbnailUrl: 'https://i.ytimg.com/vi/UiAQGUVSRVc/hqdefault.jpg',
    videoEmbedUrl: 'https://www.youtube.com/embed/UiAQGUVSRVc',
    summary: 'ހުކުރު ނަމާދު ކުރުން ވާޖިބުވަނީ ކޮން ބައެއްގެ މައްޗަށް ކަމާއި، އުޛުރުވެރިންގެ ޙުކުމްތައް.',
    category: 'dawah',
    publishedDate: '2026-01-05',
    viewsCount: 'Official'
  },
  {
    id: 'vid-SPJy2m7HseM',
    title: '18 Kithaabuh Salaath - Thilaavathuge sajidhai (ތިލާވަތުގެ ސަޖިދަ)',
    series: 'ކިތާބުއްޞަލާތު',
    episodeNumber: 18,
    duration: '11 މިނެޓު',
    speaker: 'ހެޔޮބިންގާ ޢިލްމީ ޓީމު',
    isDeafAccessible: true,
    partner: 'Heyo Bingaa Official',
    thumbnailUrl: 'https://i.ytimg.com/vi/SPJy2m7HseM/hqdefault.jpg',
    videoEmbedUrl: 'https://www.youtube.com/embed/SPJy2m7HseM',
    summary: 'ޤުރްއާން ކިޔަވާއިރު އަންނަ ސަޖިދައިގެ އާޔަތްތަކުގައި ތިލާވަތުގެ ސަޖިދަ ޖަހާނެ ގޮތާއި ކިޔާނެ ދުޢާތައް.',
    category: 'dawah',
    publishedDate: '2025-12-28',
    viewsCount: 'Official'
  },
  {
    id: 'vid-iL29d2xWIU8',
    title: '08 Kithaabuh Salaath - Namaadhuge fardh thakaa sunnaiy thakaa eku (ނަމާދުގެ ފަރުޟުތަކާއި ސުންނަތްތައް)',
    series: 'ކިތާބުއްޞަލާތު',
    episodeNumber: 8,
    duration: '15 މިނެޓު',
    speaker: 'ހެޔޮބިންގާ ޢިލްމީ ޓީމު',
    isDeafAccessible: true,
    partner: 'Heyo Bingaa Official',
    thumbnailUrl: 'https://i.ytimg.com/vi/iL29d2xWIU8/hqdefault.jpg',
    videoEmbedUrl: 'https://www.youtube.com/embed/iL29d2xWIU8',
    summary: 'ނަމާދު ޞައްޙަވުމުގެ ރުކުންތަކާއި ފަރުޟުތައް އަދި އިތުރު ދަރުމަ ލިބޭ މުހިންމު ސުންނަތްތައް.',
    category: 'dawah',
    publishedDate: '2025-12-20',
    viewsCount: 'Official'
  }
];

export const PROGRAMS: ProgramItem[] = [
  {
    id: 'prog-sisters',
    title: 'ކަނބަލުންގެ މުރާޖަޢާ އަދި ޢިލްމީ މަސައްކަތު ބައްދަލުވުންތައް',
    category: 'women',
    categoryLabel: 'އުޚުތުންނާއި ކަނބަލުންނަށް',
    targetAudience: 'ޒުވާން އަންހެނުން، މައިން، އަދި ގޭގައި ތިބޭ ކަނބަލުން',
    format: 'އިންޓްރެކްޓިވް ވޯކްޝޮޕްތައް އަދި ޢަމަލީ ތަމްރީނު',
    description: 'އާދަކާދައިގެ ތަޤްރީރުތަކާ ޚިލާފަށް، ބައިވެރިންގެ ބައިވެރިވުން ފުރިހަމައަށް ލިބޭގޮތަށް ފަރުމާކުރެވިފައިވާ ޒަމާނީ މަސައްކަތު ބައްދަލުވުންތައް. މީގެ ތެރޭގައި ޢާއިލީ ގުޅުންތައް ބަދަހިކުރުމާއި، އިސްލާމީ ނަޒަރިއްޔާތުން ނަފްސާނީ ދުޅަހެޔޮކަން ދެމެހެއްޓުން ހިމެނެއެވެ.',
    impactMetrics: '1,200+ ކަނބަލުން ބައިވެރިވެ ތަމްރީނު ފުރިހަމަކޮށްފައިވޭ',
    collaborators: ['މިނިސްޓްރީ އޮފް އިސްލާމިކް އެފެއާޒް', 'ޕީސް ފައުންޑޭޝަން'],
    features: [
      'ކުދި ގްރޫޕްތަކުގައި ޚިޔާލު ބަދަލުކުރުމުގެ ފުރުޞަތު',
      'ދީނީ އަދި ނަފްސާނީ ކައުންސިލިންގ ގައިޑަންސް',
      'ތަރުބިއްޔަތާއި ދަރިން ބެލުމުގެ ޢަމަލީ ތަމްރީނު',
      'އުޚުތުވަންތަކަމުގެ ގާތް ގުޅުން ބަދަހިކުރުން'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prog-toddlers',
    title: 'ތުއްތު ކުދިންގެ އިސްލާމީ ބިންގާ (Kids Nurturing & Islamic Values)',
    category: 'toddlers',
    categoryLabel: 'ތުއްތު ކުދިންނަށް (އުމުރުން 3 - 7 އަހަރު)',
    targetAudience: 'ޅަފަތުގެ ކުދިން އަދި މައިންބަފައިން',
    format: 'ކުޅިވަރާއި، ކުލަޖެއްސުމާއި، ޢިބުރަތްތެރި ވާހަކަތަކުގެ ޒަރީޢާއިން',
    description: 'ކުޑަކުދިންގެ ހިތްތަކުގައި ﷲ ތަޢާލާއަށް ލޯބިޖެއްސުމާއި، ރިވެތި އަޚްލާޤާއި ސަލާމްގޮވުމާއި ކެއިންބުއިމުގެ އަދަބުތައް ޝައުޤުވެރި ޙަރަކާތްތަކުގެ ތެރެއިން އުނގަންނައިދިނުން.',
    impactMetrics: '800+ ތުއްތު ކުދިންނަށް ބާއްވާފައިވާ ސެޝަންތައް',
    collaborators: ['ދާރެސް ޓީވީ'],
    features: [
      'މަލާމަލި އިސްލާމީ ވާހަކަ ކިޔައިދިނުމުގެ ސެޝަންތައް',
      'ހެޔޮ ޢަމަލުތަކުގެ އެކްޓިވިޓީ ފޮތްތަކާއި ވޯކްޝީޓް',
      'އިސްލާމީ ތަހުނިޔާތަކާއި ކުރު ދުޢާތައް ދަސްކޮށްދިނުން',
      'ދަރިންނާއެކު މައިންބަފައިން ބައިވެރިވާ ޚާއްޞަ ވަގުތު'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prog-teenagers',
    title: 'ފުރާވަރު އުމުރުފުރާގެ ޒުވާނުން ބިނާކުރުން (Youth Empowerment & Faith)',
    category: 'teenagers',
    categoryLabel: 'ފުރާވަރުގެ ކުދިންނަށް (12 - 18 އަހަރު)',
    targetAudience: 'ސްކޫލް ދަރިވަރުން އަދި ފުރާވަރުގެ ޒުވާނުން',
    format: 'ދިރިއުޅުމުގެ ހުނަރު، ކްރިއޭޓިވް ވޯކްޝޮޕް، އަދި މެންޓަރޝިޕް',
    description: 'މުޖުތަމަޢުގައި ދިމާވާ ނުފޫޒުތަކާއި ސޯޝަލް މީޑިއާގެ ގޮންޖެހުންތަކުން ސަލާމަތްވެ، އިސްލާމީ ވަރުގަދަ ޝަޚްޞިއްޔަތެއް ބިނާކުރުމަށް އެހީތެރިވެދޭ ޚާއްޞަ ޕްރޮގްރާމްތައް.',
    impactMetrics: '450+ ފުރާވަރުގެ ކުދިން ބައިވެރިވި ކޭމްޕްތައް',
    collaborators: ['އަލް ޢަޞްރު', 'ޖަމްޢިއްޔަތުއް ސަލަފް'],
    features: [
      'ޝައްކުތަކާއި ސުވާލުތަކަށް ހުޅުވާލެވިފައިވާ ޢިލްމީ ޖަވާބު',
      'ލީޑަރޝިޕާއި ޓީމްވޯކް ކުރިއެރުވުން',
      'ވަގުތު މެނޭޖްކުރުމާއި ކިޔެވުމުގެ ރޭވުންތެރިކަން',
      'އިޖުތިމާޢީ ޚިދުމަތުގައި ޢަމަލީގޮތުން ބައިވެރިވުން'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prog-joint-ngo',
    title: 'އެންޖީއޯތަކާ ގުޅިގެން ކުރިއަށްގެންދެވޭ ޖޮއިންޓް އޮޕަރޭޝަންތައް',
    category: 'joint_ngo',
    categoryLabel: 'މުޖުތަމަޢީ ގުޅިފައިވާ ޙަރަކާތްތައް',
    targetAudience: 'މުޅި ދިވެހި މުޖުތަމަޢު އަދި އެހީއަށް ބޭނުންވާ ފަރާތްތައް',
    format: 'ފީލްޑް ވޮލަންޓިއަރ މަސައްކަތް، ކާރިސާތަކުގެ އެހީ، ބޮޑެތި ދަރުސްތައް',
    description: 'ވޭތުވެދިޔަ 2 އަހަރު ދުވަހުގެ ތެރޭގައި ރާއްޖޭގެ ފުންނާބުއުސް ޖަމްޢިއްޔާތަކާއި (އައި.އޭ.ސީ، ޕީސް ފައުންޑޭޝަން، އެހީ، ސަލަފް، އަލް ޢަޞްރު) ގުޅިގެން ފީލްޑް ލޮޖިސްޓިކްސް އަދި ވޮލަންޓިއަރ އެހީތެރިކަން ފޯރުކޮށްދިނުން.',
    impactMetrics: '15+ ބޮޑެތި ޤައުމީ ޙަރަކާތުގައި ހަރަކާތްތެރިވެފައިވޭ',
    collaborators: ['IAC', 'Peace Foundation', 'Ehee', 'Jamiyyathul Salaf', 'Al-Asr'],
    features: [
      'ކާރިސާތަކުގައި ކާބޯތަކެއްޗާއި އެހީގެ ތަކެތި ބަންދުކުރުމާއި ބެހުން',
      'ބޮޑެތި ދަރުސްތަކުގައި އަންހެނުންގެ ސަރަޙައްދު ބެލެހެއްޓުމާއި މެހެމާންދާރީ',
      'ފިރިހެން ވޮލަންޓިއަރުންގެ އެހީގައި ޓެކްނިކަލް އަދި ލޮޖިސްޓިކް ސަޕޯޓް',
      'ރަށްރަށަށް ކުރެވޭ ދަޢުވަތީ ދަތުރުތަކުގައި ބައިވެރިވުން'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_DONATION_SLIPS: DonationSlip[] = [
  {
    id: 'slip-001',
    donorName: 'އާމިނަތު ޝަފީޤާ',
    phone: '7789012',
    amount: 500,
    currency: 'MVR',
    bankAccount: 'BML MVR (7730000584219)',
    referenceNumber: 'TXN-984210',
    notes: 'ބީރު މީހުންގެ ޓީވީ ޕްރޮގްރާމްތަކަށް ހޭދަކޮށްދެއްވުން އެދެން',
    date: '2026-03-01',
    verified: true
  },
  {
    id: 'slip-002',
    donorName: 'ޙުސައިން އިމްރާން',
    phone: '9912345',
    amount: 1500,
    currency: 'MVR',
    bankAccount: 'MIB MVR (901018421901)',
    referenceNumber: 'MIB-883192',
    notes: 'ރޯދައިގެ ހިޔަލުގައި ދަރުސް އިންތިޒާމުކުރުމަށް',
    date: '2026-03-02',
    verified: true
  },
  {
    id: 'slip-003',
    donorName: 'ސިއްރު ފަރާތެއް',
    phone: '7654321',
    amount: 100,
    currency: 'USD',
    bankAccount: 'BML USD (7730000584220)',
    referenceNumber: 'USD-441029',
    notes: 'ތުއްތުކުދިންގެ އިސްލާމީ ބިންގާ ޕްރޮގްރާމަށް',
    date: '2026-03-03',
    verified: false
  }
];

export const INITIAL_VOLUNTEERS: VolunteerApplication[] = [
  {
    id: 'vol-001',
    name: 'މަރިޔަމް ލުޖައިން',
    phone: '7904321',
    email: 'lujain@example.com',
    islandCity: 'މާލެ',
    track: 'sisters',
    interests: ['އިވެންޓް ކޯޑިނޭޝަން', 'ކުޑަކުދިންގެ ޕްރޮގްރާމްތައް', 'ކޮންޓެންޓް ރައިޓިންގ'],
    availability: 'ހަވީރު އަދި ރޭގަނޑު ގަޑިތަކުގައި',
    notes: 'ކުރިންވެސް އިސްލާމީ ވޯކްޝޮޕްތަކުގައި ވޮލަންޓިއަރ ކޮށްފައިވާނެ',
    submittedAt: '2026-02-24',
    status: 'reviewed'
  },
  {
    id: 'vol-002',
    name: 'އަޙްމަދު ރަޝީދު',
    phone: '7776543',
    email: 'ahmed.rash@example.com',
    islandCity: 'ހުޅުމާލެ',
    track: 'brothers',
    interests: ['ލޮޖިސްޓިކްސް އަދި ތަކެތި އުފުލުން', 'އޯޑިއޯ ވީޑިއޯ ސެޓަޕް', 'އިވެންޓް ސެކިއުރިޓީ'],
    availability: 'ބަންދު ދުވަސްތަކާއި ރޭގަނޑު',
    notes: 'ބޮޑެތި ޖަލްސާތަކުގެ ސައުންޑް ސިސްޓަމް ހަރުކުރުމުގެ ތަޖުރިބާ އެބަހުރި',
    submittedAt: '2026-02-27',
    status: 'contacted'
  }
];
