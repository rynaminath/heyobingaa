import { BankAccount, BankGroup, EventItem, MediaItem, ProgramItem, PartnerOrg, GalleryItem, HeroSlide, RecordedActivitySection } from '../types';

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

export const BANK_GROUPS: BankGroup[] = [
  {
    id: 'bml',
    bankCode: 'BML',
    bankName: 'ބޭންކް އޮފް މޯލްޑިވްސް (BML)',
    bankNameEn: 'Bank of Maldives',
    accountName: 'HEYO BINGAA',
    accounts: [
      BANK_ACCOUNTS[0], // BML MVR (7770000179374)
      BANK_ACCOUNTS[1]  // BML USD (7770000179375)
    ]
  },
  {
    id: 'mib',
    bankCode: 'MIB',
    bankName: 'މޯލްޑިވްސް އިސްލާމިކް ބޭންކް (MIB)',
    bankNameEn: 'Maldives Islamic Bank',
    accountName: 'HEYO BINGAA',
    accounts: [
      BANK_ACCOUNTS[2], // MIB MVR (90101555001661000)
      BANK_ACCOUNTS[3]  // MIB USD (90101555001662000)
    ]
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
    tag: 'ދީނީ ބައިވެރިޔާ',
    accentColor: 'green'
  },
  {
    id: 'dhaaris-tv',
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
    role: 'އިޖުތިމާޢީ އަދި ދީނީ ގުޅިފައިވާ ޙަރަކާތްތައް',
    tag: 'އެންޖީއޯ ބައިވެރިޔާ',
    accentColor: 'teal'
  },
  {
    id: 'al-asr',
    nameDv: 'އަލް ޢަޞްރު',
    nameEn: 'Al-Asr',
    role: 'ދީނީ ޢިލްމާއި ހޭލުންތެރިކުރުން',
    tag: 'ދީނީ ބައިވެރިޔާ',
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
    broadcast: 'ދާރިސް ޓީވީ (Dhaaris TV) އިން ވަގުތުން ލައިވްކޮށް ދުރަށް ދައްކާނެ',
    description: 'ބަރަކާތްތެރި ރޯދަމަހުގެ ފަހު ދިހައިގެ ހެޔޮ ދަރުމައާއި ޘަވާބު ޙާޞިލުކުރުމަށާއި، ރޯދައިގެ ޙަޤީޤީ ރޫޙު ދިރިއުޅުމަށް ގެނައުމާ ގުޅޭގޮތުން ޚާއްޞަ ދަރުހެއް. މިއީ މިނިސްޓްރީ އޮފް އިސްލާމިކް އެފެއާޒްގެ އެއްބާރުލުމާއެކު ހެޔޮބިންގާ އިން އިންތިޒާމުކުރާ ޚާއްޞަ ޙަރަކާތެކެވެ.',
    isFeatured: true,
    status: 'upcoming',
    partnerOrganization: 'މިނިސްޓްރީ އޮފް އިސްލާމިކް އެފެއާޒް & ދާރިސް ޓީވީ'
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
    title: 'އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ ކުދިންނާއި ފަރާތްތަކަށް: ނަމާދުގެ ފިޤުހު',
    titleEn: 'Fiqh of Salah with Sign Language',
    speaker: 'އުސްތާޛު ޢަލީ ޒައިދް (އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާއާއެކު)',
    venue: 'އިސްލާމީ މަރުކަޒުގެ ޖަލްސާކުރާ މާލަން',
    date: '2026-04-25',
    time: 'ރޭގަނޑު 8:30',
    dayText: 'ހުކުރު ދުވަހުގެ ރޭގަނޑު',
    audience: 'އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ ކުދިންނާއި ފަރާތްތަކާއި އެބޭފުޅުންގެ ޢާއިލާތަކަށް',
    broadcast: 'ދާރިސް ޓީވީ އަދި ސޯޝަލް މީޑިއާ',
    description: 'ނަމާދުގެ ރުކުންތަކާއި ވާޖިބުތައް އިޝާރާތުގެ ބަހުރުވައިން ތަފްޞީލުކޮށް ބަޔާންކޮށްދޭ ޚާއްޞަ މަޢުލޫމާތު ސެޝަން.',
    isFeatured: false,
    status: 'upcoming',
    partnerOrganization: 'ދާރިސް ޓީވީ'
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    "id": "vid-4xF2eybvmHA",
    "title": "Maaiy Dhiha Dhuvas - Dharus by Sheikha Maryam Shabana | Dhul Hijjah 10 days (މާތް 10 ދުވަސް - ޝައިޚާ މަރްޔަމް ޝަބާނާ)",
    "series": "ޢާންމު ދަރުސްތައް",
    "episodeNumber": 1,
    "duration": "1:05:00",
    "speaker": "ޝައިޚާ މަރްޔަމް ޝަބާނާ",
    "isDeafAccessible": false,
    "partner": "Heyo Bingaa Official",
    "thumbnailUrl": "https://i.ytimg.com/vi/4xF2eybvmHA/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/4xF2eybvmHA",
    "summary": "ޙައްޖު މަހުގެ ފުރަތަމަ ދިހަ ދުވަހުގެ މާތްކަމާއި އެ ދުވަސްތަކުގައި ކުރެވޭނެ ހެޔޮ ޢަމަލުތަކާ ގުޅޭގޮތުން ޝައިޚާ މަރްޔަމް ޝަބާނާ ދެއްވި ޚާއްޞަ ޢިލްމީ ދަރުސް.",
    "category": "sisters_family",
    "publishedDate": "2025-06-01",
    "viewsCount": "482 views"
  },
  {
    "id": "vid-3Q_Za7OtXNA",
    "title": "Roadha Leaflet with full sign-language interpretation (ރޯދަ ލީފްލެޓް: އިޝާރާތުގެ ބަހުރުވައިގެ ފުރިހަމަ ތަރުޖަމާ)",
    "series": "އިޝާރާތުގެ ބަހުރުވަ & ރޯދަ",
    "episodeNumber": 1,
    "duration": "15:00",
    "speaker": "ހެޔޮބިންގާ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ފުރިހަމަ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Dhaaris TV & Heyo Bingaa",
    "thumbnailUrl": "https://i.ytimg.com/vi/3Q_Za7OtXNA/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/3Q_Za7OtXNA",
    "summary": "ދާރިސް ޓީވީއާ ގުޅިގެން ހެޔޮބިންގާއިން ތައްޔާރުކޮށްފައިވާ ރޯދަ ލީފްލެޓް. އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ ކުދިންނާއި ފަރާތްތަކަށް ޚާއްޞަކޮށް ފުރިހަމަ އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާއާއެކު ގެނެސްދެވިފައިވާ މުހިންމު ދީނީ ޕްރޮގްރާމެއް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-03-01",
    "viewsCount": "41 views"
  },
  {
    "id": "vid-A7BxRgbYH8Q",
    "title": "01 Kithaabuh Salaath - Mugahdima (01 ކިތާބުއްޞަލާތު: މުޤައްދިމާ)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 1,
    "duration": "09:58",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/A7BxRgbYH8Q/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/A7BxRgbYH8Q",
    "summary": "ކިތާބުއްޞަލާތު ސިލްސިލާގެ ފެށުން: ނަމާދުގެ މުހިންމުކަމާއި ޝަރުޢީ ޙުކުމްތަކުގެ ތަޢާރަފް، އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާއާއެކު.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-01",
    "viewsCount": "288 views"
  },
  {
    "id": "vid-EkffiXAfjGo",
    "title": "02 Kithaabuh Salaath - Al Salat (02 ކިތާބުއްޞަލާތު: އައްޞަލާތު)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 2,
    "duration": "06:03",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/EkffiXAfjGo/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/EkffiXAfjGo",
    "summary": "އައްޞަލާތުގެ މާނައާއި އިސްލާމްދީނުގައި ނަމާދަށް ދެވިފައިވާ ޚާއްޞަ މަޤާމު އޮޅުންފިލުވައިދިނުން.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-02",
    "viewsCount": "94 views"
  },
  {
    "id": "vid--qBmg_liKns",
    "title": "03 Kithaabuh Salaath - Namaadhuge vaguthu thah (03 ކިތާބުއްޞަލާތު: ނަމާދުގެ ވަޤުތުތައް)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 3,
    "duration": "25:00",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/-qBmg_liKns/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/-qBmg_liKns",
    "summary": "ފަރުޟު ފަސް ނަމާދުގެ ވަޤުތުތައް ފެށޭ އަދި ނިމޭ ގޮތްތަކުގެ ތަފްޞީލީ ބަޔާން.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-03",
    "viewsCount": "61 views"
  },
  {
    "id": "vid-AzPxqU2cW4A",
    "title": "04 Kithaabuh Salaath - Namaadhuge rukunthah (04 ކިތާބުއްޞަލާތު: ނަމާދުގެ ރުކުންތައް)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 4,
    "duration": "16:00",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/AzPxqU2cW4A/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/AzPxqU2cW4A",
    "summary": "ނަމާދު ޞައްޙަވުމުގެ އަސާސީ ރުކުންތަކާއި އެ ރުކުންތައް އަދާކުރާނެ ސުންނަތް ގޮތް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-04",
    "viewsCount": "51 views"
  },
  {
    "id": "vid-f2rcIcGQ6O0",
    "title": "05 Kithaabuh Salaath - Bismi kiyun (05 ކިތާބުއްޞަލާތު: ބިސްމި ކިޔުން)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 5,
    "duration": "04:28",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/f2rcIcGQ6O0/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/f2rcIcGQ6O0",
    "summary": "ނަމާދުގައި ސޫރަތުލް ފާތިޙާ ކިޔެވުމުގެ ކުރިން ބިސްމި ކިޔުމާ ގުޅޭ ޙުކުމްތައް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-05",
    "viewsCount": "22 views"
  },
  {
    "id": "vid-OraMlpIQEoM",
    "title": "06 Kithaabuh Salaath - Imaam meehaage fahathugai maumoomun kiyevun (06 ކިތާބުއްޞަލާތު: އިމާމް މީހާގެ ފަހަތުގައި ކިޔެވުން)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 6,
    "duration": "21:00",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/OraMlpIQEoM/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/OraMlpIQEoM",
    "summary": "ޖަމާޢަތުގައި ނަމާދުކުރާއިރު އިމާމާގެ ފަހަތުގައި މައުމޫމުން ކިޔަވާނެ ގޮތުގެ ޝަރުޢީ ޙުކުމްތައް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-06",
    "viewsCount": "28 views"
  },
  {
    "id": "vid-i6Zh4FPoatQ",
    "title": "07 Kithaabuh Salaath - Fahu attahiyyaathugai salaam dhinumuge kurin (07 ކިތާބުއްޞަލާތު: ފަހު އައްތަޙިއްޔާތުގައި ސަލާމް ދިނުމުގެ ކުރިން)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 7,
    "duration": "15:00",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/i6Zh4FPoatQ/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/i6Zh4FPoatQ",
    "summary": "ނަމާދުގެ ފަހު އައްތަޙިއްޔާތުގައި ސަލާމް ދިނުމުގެ ކުރިން ކިޔުމަށް ވާރިދުވެފައިވާ މުހިންމު ދުޢާތައް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-07",
    "viewsCount": "26 views"
  },
  {
    "id": "vid-iL29d2xWIU8",
    "title": "08 Kithaabuh Salaath - Namaadhuge fardh thakaa sunnaiy thakaa eku (08 ކިތާބުއްޞަލާތު: ނަމާދުގެ ފަރުޟުތަކާއި ސުންނަތްތައް)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 8,
    "duration": "04:10",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/iL29d2xWIU8/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/iL29d2xWIU8",
    "summary": "ނަމާދުގެ ފަރުޟުތަކާއި ވާޖިބުތަކާއި ސުންނަތްތަކުގެ ތަފާތު ސާފުކޮށް އޮޅުންފިލުވައިދިނުން.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-08",
    "viewsCount": "20 views"
  },
  {
    "id": "vid-LPN1D9ZXKO4",
    "title": "09 Kithaabuh Salaath - Fardh fas namaadhugai qunooth kiyun (09 ކިތާބުއްޞަލާތު: ފަރުޟު ފަސް ނަމާދުގައި ޤުނޫތު ކިޔުން)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 9,
    "duration": "02:38",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/LPN1D9ZXKO4/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/LPN1D9ZXKO4",
    "summary": "ފަރުޟު ފަސް ނަމާދުގައި ޤުނޫތު ކިޔުމުގެ ޙުކުމާއި ސުންނަތުގައި އެކަން އައިސްފައިވާ ގޮތް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-09",
    "viewsCount": "10 views"
  },
  {
    "id": "vid-94iAHkVn72E",
    "title": "10 Kithaabuh Salaath - Sunnaiy namaadh (10 ކިތާބުއްޞަލާތު: ސުންނަތް ނަމާދު)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 10,
    "duration": "15:00",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/94iAHkVn72E/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/94iAHkVn72E",
    "summary": "ރަވާތިބު ސުންނަތްތަކާއި ދުވާލާއި ރޭގަނޑުގެ އެހެނިހެން ސުންނަތް ނަމާދުތަކުގެ މާތްކަން.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-10",
    "viewsCount": "25 views"
  },
  {
    "id": "vid-B9_d1upPmRY",
    "title": "11 Kithaabuh Salaath - Tahajjud namaadh (11 ކިތާބުއްޞަލާތު: ތަހައްޖުދު ނަމާދު)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 11,
    "duration": "11:59",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/B9_d1upPmRY/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/B9_d1upPmRY",
    "summary": "ރޭއަޅުކަމާއި ތަހައްޖުދު ނަމާދުގެ މާތްކަމާއި އެ ނަމާދު ކުރާނެ މޮޅު ގޮތްތައް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-11",
    "viewsCount": "36 views"
  },
  {
    "id": "vid-hxZ2rl88ZtU",
    "title": "12 Kithaabuh Salaath - Ramadan qiyam adhi Tharaaveekh namaadh (12 ކިތާބުއްޞަލާތު: ރަމަޟާން ޤިޔާމް އަދި ތަރާވީޙް ނަމާދު)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 12,
    "duration": "04:22",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/hxZ2rl88ZtU/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/hxZ2rl88ZtU",
    "summary": "ރަމަޟާން މަހުގެ ރޭއަޅުކަމާއި ތަރާވީޙް ނަމާދުގެ ޙުކުމްތަކާއި ސުންނަތްތައް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-12",
    "viewsCount": "7 views"
  },
  {
    "id": "vid-2w9CIwguoSU",
    "title": "13 Kithaabuh Salaath - Duha namaadh (13 ކިތާބުއްޞަލާތު: ޟުޙާ ނަމާދު)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 13,
    "duration": "03:03",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/2w9CIwguoSU/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/2w9CIwguoSU",
    "summary": "ޟުޙާ (އިޝްރާޤް) ނަމާދުގެ ވަޤުތާއި ރަކުޢާތްތަކުގެ ޢަދަދާއި އޭގެ ދަރުމައާއި ޘަވާބު.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-13",
    "viewsCount": "11 views"
  },
  {
    "id": "vid-W9BijGWL2-w",
    "title": "14 Kithaabuh Salaath - Isthikhaaraa namaadh (14 ކިތާބުއްޞަލާތު: އިސްތިޚާރާ ނަމާދު)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 14,
    "duration": "04:44",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/W9BijGWL2-w/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/W9BijGWL2-w",
    "summary": "ކަންކަމުގައި ހެޔޮ ގޮތް އެދި ﷲގެ ޙަޟްރަތުގައި ދަންނަވާ އިސްތިޚާރާ ނަމާދާއި ދުޢާ.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-14",
    "viewsCount": "15 views"
  },
  {
    "id": "vid-k0Wjov4xkU0",
    "title": "15 Kithaabuh Salaath - Haajai Namaadhu adhi Thaubaa namaadh (15 ކިތާބުއްޞަލާތު: ޙާޖަތުގެ ނަމާދާއި ތައުބާ ނަމާދު)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 15,
    "duration": "03:37",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/k0Wjov4xkU0/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/k0Wjov4xkU0",
    "summary": "ޙާޖަތުގެ ނަމާދާއި ފާފަފުއްސެވުން އެދި ކުރެވޭ ތައުބާ ނަމާދާ ގުޅޭ ޝަރުޢީ ޙުކުމްތައް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-15",
    "viewsCount": "6 views"
  },
  {
    "id": "vid-CVtNCWHVZd4",
    "title": "16 Kithaabuh Salaath - Keytha namaadh (16 ކިތާބުއްޞަލާތު: ކޭތަ ނަމާދު)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 16,
    "duration": "04:45",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/CVtNCWHVZd4/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/CVtNCWHVZd4",
    "summary": "އިރު ނުވަތަ ހަނދު ކޭތަ ހިފުމުން ކުރެވޭ ކޭތަ ނަމާދުގެ ސުންނަތް ގޮތާއި ޙުކުމްތައް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-16",
    "viewsCount": "13 views"
  },
  {
    "id": "vid-yxOBLGFvaEg",
    "title": "17 Kithaabuh Salaath - Isthisqaa namaadh (17 ކިތާބުއްޞަލާތު: އިސްތިސްޤާ ނަމާދު)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 17,
    "duration": "06:55",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/yxOBLGFvaEg/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/yxOBLGFvaEg",
    "summary": "ވާރޭ ވެއްސެވުން އެދި ކުރެވޭ އިސްތިސްޤާ ނަމާދާއި ޚުޠުބާއާއި އޭގެ ސުންނަތްތައް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-17",
    "viewsCount": "19 views"
  },
  {
    "id": "vid-SPJy2m7HseM",
    "title": "18 Kithaabuh Salaath - Thilaavathuge sajidha (18 ކިތާބުއްޞަލާތު: ތިލާވަތުގެ ސަޖިދަ)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 18,
    "duration": "03:34",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/SPJy2m7HseM/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/SPJy2m7HseM",
    "summary": "ޤުރްއާނުގެ ސަޖިދައިގެ އާޔަތެއް ކިޔަވައި ނުވަތަ އަޑުއަހާއިރު ކުރެވޭ ތިލާވަތުގެ ސަޖިދަ.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-18",
    "viewsCount": "7 views"
  },
  {
    "id": "vid-9ne3oKMH5qw",
    "title": "19 Kithaabuh Salaath - Shukuruge adhi Kushu sajidha (19 ކިތާބުއްޞަލާތު: ޝުކުރުގެ އަދި ކުށު ސަޖިދަ)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 19,
    "duration": "25:00",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/9ne3oKMH5qw/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/9ne3oKMH5qw",
    "summary": "ނިޢުމަތެއް ލިބުމުން ކުރާ ޝުކުރުގެ ސަޖިދައާއި ނަމާދުގައި އޮޅުންއެރުމުން ޖަހާ ސަހުވުގެ (ކުށު) ސަޖިދަ.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-19",
    "viewsCount": "25 views"
  },
  {
    "id": "vid-8OtVmASYgkQ",
    "title": "20 Kithaabuh Salaath - Kushu sajidha adhi Jamaa athuge Namaadhu (20 ކިތާބުއްޞަލާތު: ކުށު ސަޖިދަ އަދި ޖަމާޢަތުގެ ނަމާދު)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 20,
    "duration": "14:50",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/8OtVmASYgkQ/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/8OtVmASYgkQ",
    "summary": "ޖަމާޢަތުގެ ނަމާދުގެ މާތްކަމާއި އިމާމާ ކުށު ސަޖިދަ ޖަހާއިރު މައުމޫމުން ޢަމަލުކުރާނެ ގޮތް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-20",
    "viewsCount": "24 views"
  },
  {
    "id": "vid-Jub6EWNA7bs",
    "title": "21 Kithaabuh Salaath - Namaadh kurun manaa vegen vaa than than (21 ކިތާބުއްޞަލާތު: ނަމާދު ކުރުން މަނާވެގެންވާ ތަންތަން)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 21,
    "duration": "16:00",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/Jub6EWNA7bs/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/Jub6EWNA7bs",
    "summary": "ޤަބުރުސްތާނާއި ކަތީލާ ތަންތަން ފަދަ ނަމާދުކުރުން ޝަރުޢީގޮތުން މަނާވެގެންވާ ތަންތަން.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-21",
    "viewsCount": "17 views"
  },
  {
    "id": "vid-KI-YKIF_rJ8",
    "title": "22 Kithaabuh Salaath - Namaadh makurooha vaa kanthah thah (22 ކިތާބުއްޞަލާތު: ނަމާދު މަކުރޫހަވާ ކަންތައްތައް)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 22,
    "duration": "14:48",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/KI-YKIF_rJ8/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/KI-YKIF_rJ8",
    "summary": "ނަމާދުގެ ޚުޝޫޢަތްތެރިކަން ގެއްލި ނަމާދު މަކުރޫހަވާ އެންމެހައި ކަންކަމުގެ ތަފްޞީލް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-22",
    "viewsCount": "12 views"
  },
  {
    "id": "vid-APzrQQ_i9uQ",
    "title": "23 Book of Prayer - Combining two prayers (23 ކިތާބުއްޞަލާތު: ދެ ނަމާދު ޖަމްޢުކުރުން)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 23,
    "duration": "13:43",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/APzrQQ_i9uQ/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/APzrQQ_i9uQ",
    "summary": "ދަތުރުވެރިންނާއި ބަލިމީހުންނާއި ވިއްސާރައިގައި ދެ ނަމާދު ޖަމްޢުކުރުމުގެ ޝަރުޢީ ލުއިފަސޭހަތައް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-23",
    "viewsCount": "14 views"
  },
  {
    "id": "vid-tAAUztN_y18",
    "title": "24 Kithaabuh Salaath - Hukuru namaadh (24 ކިތާބުއްޞަލާތު: ހުކުރު ނަމާދު)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 24,
    "duration": "10:59",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/tAAUztN_y18/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/tAAUztN_y18",
    "summary": "ހުކުރު ނަމާދުގެ ޙުކުމްތަކާއި، ވާޖިބުވާ ފަރާތްތަކާއި، ހުކުރު ދުވަހުގެ މާތްކަމާއި ސުންނަތްތައް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-24",
    "viewsCount": "52 views"
  },
  {
    "id": "vid-UiAQGUVSRVc",
    "title": "25 Kithaabuh Salaath - Ebaehge mahchah hukuru namaadh vaajibu vegenvaa (25 ކިތާބުއްޞަލާތު: އެބައެއްގެ މައްޗަށް ހުކުރު ނަމާދު ވާޖިބުވެގެންވާ)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 25,
    "duration": "05:26",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/UiAQGUVSRVc/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/UiAQGUVSRVc",
    "summary": "ހުކުރު ނަމާދު އަދާކުރުން ވާޖިބުވާ މީހުންނާއި ޢުޛުރުވެރިންގެ ޝަރުޢީ ޙުކުމްތައް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-25",
    "viewsCount": "14 views"
  },
  {
    "id": "vid-dLP04cG5JJo",
    "title": "26 Kithaabuh Salaath - Hukuru khuthubaa (26 ކިތާބުއްޞަލާތު: ހުކުރު ޚުޠުބާ)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 26,
    "duration": "22:00",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/dLP04cG5JJo/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/dLP04cG5JJo",
    "summary": "ހުކުރު ޚުޠުބާގެ ރުކުންތަކާއި ޚުޠުބާ އަޑުއެހުމުގެ އަދަބުތަކާއި ސުންނަތްތައް.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-26",
    "viewsCount": "37 views"
  },
  {
    "id": "vid-kNHFjC5MsTE",
    "title": "27 Kithaabuh Salaath - Eid namaadhah bangi govumaai qamaiy dhinun (27 ކިތާބުއްޞަލާތު: ޢީދު ނަމާދަށް ބަންގި ގޮވުމާއި ޤާމަތް ދިނުން)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 27,
    "duration": "07:47",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/kNHFjC5MsTE/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/kNHFjC5MsTE",
    "summary": "ޢީދު ނަމާދުގެ ޙުކުމްތަކާއި ބަންގި އަދި ޤާމަތާ ގުޅޭ ސުންނަތް ގޮތްތައް އޮޅުންފިލުވައިދިނުން.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-27",
    "viewsCount": "95 views"
  },
  {
    "id": "vid-OE-drtRadTY",
    "title": "28 Kithaabuh Salaath - Miskiy thakaa behey baeh hukum thah (28 ކިތާބުއްޞަލާތު: މިސްކިތްތަކާ ބެހޭ ބައެއް ޙުކުމްތައް)",
    "series": "ކިތާބުއްޞަލާތު",
    "episodeNumber": 28,
    "duration": "12:17",
    "speaker": "ހެޔޮބިންގާ ޢިލްމީ ޓީމު",
    "interpreter": "އިޝާރާތުގެ ބަހުރުވައިގެ ތަރުޖަމާ",
    "isDeafAccessible": true,
    "partner": "Heyo Bingaa & Dhaaris TV",
    "thumbnailUrl": "https://i.ytimg.com/vi/OE-drtRadTY/hqdefault.jpg",
    "videoEmbedUrl": "https://www.youtube.com/embed/OE-drtRadTY",
    "summary": "މިސްކިތްތަކުގެ ޙުރުމަތާއި އަދަބުތަކާއި މިސްކިތް ބިނާކުރުމާއި ޠާހިރުކޮށް ބެލެހެއްޓުމުގެ މާތްކަން.",
    "category": "deaf_accessible",
    "publishedDate": "2026-02-28",
    "viewsCount": "26 views"
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
    collaborators: ['ދާރިސް ޓީވީ'],
    features: [
      'މަލާމަލި އިސްލާމީ ވާހަކަ ކިޔައިދިނުމުގެ ސެޝަންތައް',
      'ހެޔޮ ޢަމަލުތަކުގެ އެކްޓިވިޓީ ފޮތްތަކާއި ވޯކްޝީޓް',
      'އިސްލާމީ ތަހުނިޔާތަކާއި ކުރު ދުޢާތައް ދަސްކޮށްދިނުން',
      'ދަރިންނާއެކު މައިންބަފައިން ބައިވެރިވާ ޚާއްޞަ ވަގުތު'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prog-audiobooks',
    title: 'އޯޑިއޯ ފޮތްތަކާއި އަޑުއަހާ ވާހަކަތައް (Islamic Audiobooks Collection)',
    category: 'audiobooks',
    categoryLabel: 'އޯޑިއޯ ފޮތްތައް (Audiobooks)',
    targetAudience: 'ޢާއިލާތައް، ކުޑަކުދިން، ލޯފަން ފަރާތްތައް އަދި ދަތުރުމަތީގައި އަޑުއަހާ ފަރާތްތައް',
    format: 'ހައި-ކޮލިޓީ އޯޑިއޯ ރެކޯޑިންގްސް، ޕޮޑްކާސްޓް އަދި ޑިޖިޓަލް އޯޑިއޯ',
    description: 'ކީރިތި ޤުރްއާނުގެ ޢިބުރަތްތެރި ވާހަކަތަކާއި، ނަބިއްޔުންގެ ޙަޔާތްޕުޅާއި، އިސްލާމީ އަޚްލާޤާއި ތާރީޚާ ގުޅޭ ފޮތްތައް ފަސޭހަކަމާއެކު އަޑުއަހާލެވޭ ގޮތަށް ތައްޔާރުކުރެވިފައިވާ ޚާއްޞަ އޯޑިއޯ ލައިބްރަރީ.',
    impactMetrics: '20+ އޯޑިއޯ ފޮތާއި ވާހަކަ ރެކޯޑްކޮށް ޝާއިޢުކުރެވިފައިވޭ',
    collaborators: ['ދާރިސް ޓީވީ', 'ހެޔޮބިންގާ އޯޑިއޯ ޓީމު'],
    features: [
      'ސާފު ދިވެހި އަޑުން ރެކޯޑްކުރެވިފައިވާ ފޮތްތައް',
      'ކުޑަކުދިންގެ ޝައުޤުވެރިކަން ދަމައިގަންނަ ވާހަކަ ކިޔުން',
      'ބަސްމަގާއި އަދަބުތައް ދަސްކޮށްދޭ ޒަމާނީ ފޯމެޓް',
      'އިންޓަނެޓް ނެތް ޙާލަތްތަކުގައިވެސް ޑައުންލޯޑްކޮށް އަޑުއެހުން'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prog-lectures',
    title: 'ދަރުސްތަކާއި ޢިލްމީ މަޖިލިސްތައް (Lectures & Knowledge Seminars)',
    category: 'lectures',
    categoryLabel: 'ދަރުސްތައް (Lectures)',
    targetAudience: 'ޒުވާނުން، ކަނބަލުން އަދި ޢާންމު ރައްޔިތުން',
    format: 'ޢާންމު ދަރުސް، ސެމިނާރ، ޕެނަލް ޑިސްކަޝަން އަދި ލައިވް ބްރޯޑްކާސްޓް',
    description: 'ދިވެހިރާއްޖޭގެ ފުންނާބުއުސް ޢިލްމުވެރިންނާ ގުޅިގެން މުޅި ރާއްޖެއަށް ހުޅުވާލައިގެން ބޭއްވޭ ޢާންމު ބޮޑެތި ދަރުސްތަކާއި، ސުވާލާއި ޖަވާބު އަދި މުހިންމު ދީނީ ޤަޟިއްޔާތަކަށް ހޭލުންތެރިކަން އިތުރުކުރުމުގެ ސިލްސިލާ.',
    impactMetrics: '50+ ދަރުސް އަދި 30,000+ ބައިވެރިން ޙާޟިރުވެފައިވޭ',
    collaborators: ['މިނިސްޓްރީ އޮފް އިސްލާމިކް އެފެއާޒް', 'ދާރިސް ޓީވީ', 'ޖަމްޢިއްޔަތުއް ސަލަފް'],
    features: [
      'މާލެއާއި އަތޮޅުތަކުގައި ޢާންމުކޮށް ހުޅުވާލައިގެން ބޭއްވުން',
      'އިޝާރާތުގެ ބަހުރުވައިގެ ލައިވް ތަރުޖަމާ ފޯރުކޮށްދިނުން',
      'ސުވާލުކުރުމާއި ވަގުތުން ޖަވާބު ލިބޭ ސެގްމެންޓް',
      'ޓީވީ އަދި ސޯޝަލް މީޑިއާއިން ވަގުތުން ލައިވްކޮށް ދުރަށް ދެއްކުން'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544928141-565c08492432?auto=format&fit=crop&w=800&q=80'
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
      'ރަށްރަށަށް ކުރެވޭ ދީނީ ދަތުރުތަކުގައި ބައިވެރިވުން'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = Array.from({ length: 13 }, (_, i) => {
  const num = i + 1;
  const filename = `gallery (${num}).jpg`;
  return {
    id: `gallery-${num}`,
    url: `/images/${encodeURIComponent(filename)}`,
    filename,
    title: `ހެޔޮބިންގާ ޙަރަކާތްތައް • ތަޞްވީރު ${num}`,
    order: num,
    category: 'community',
    createdAt: '2026-03-01T00:00:00.000Z'
  };
});

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    imageUrl: '/images/gallery%20(1).jpg',
    badge: 'އިސް ޙަރަކާތް • ދީނީ ދައުރު',
    title: 'އިސްލާމީ ހޭލުންތެރިކަމާއި އޯގާތެރި މުޖުތަމަޢެއް',
    caption: 'ހެޔޮބިންގާއަކީ އުޚުތުންގެ އިސްނެގުމާއި ލީޑަރޝިޕްގައި، މުޖުތަމަޢުގެ އިސްލާމީ ހޭލުންތެރިކަން ކުރިއެރުވުމަށާއި ހެޔޮލަފާ ޖީލެއް ބިނާކުރުމަށް ހިންގޭ ދިވެހި ޖަމްޢިއްޔާއެކެވެ.',
    ctaText: 'ޕްރޮގްރާމްތައް ބައްލަވާ',
    ctaLink: 'programs',
    secondaryCtaText: 'ވޮލަންޓިއަރަކަށް ވެލައްވާ',
    secondaryCtaLink: 'volunteer',
    order: 1
  },
  {
    id: 'slide-2',
    imageUrl: '/images/gallery%20(2).jpg',
    badge: 'އިޝާރާތުގެ ބަހުރުވަ (Deaf Accessible)',
    title: 'ދާރިސް ޓީވީ & އިޝާރާތުގެ ބަހުރުވައިގެ ޚާއްޞަ ސީރީޒްތައް',
    caption: 'ރާއްޖޭގެ އަޑުއިވުމުން މަޙްރޫމްވެފައިވާ ކުދިންނާއި ފަރާތްތަކަށް އިސްލާމީ ޢިލްމާއި ތަރުބިއްޔަތު އިޝާރާތުގެ ބަހުރުވައިން ފޯރުކޮށްދިނުމަށް ދާރިސް ޓީވީއާ ގުޅިގެން އުފައްދާ މުހިންމު ސިލްސިލާ.',
    ctaText: 'ވީޑިއޯތައް ބައްލަވާ',
    ctaLink: 'videos',
    secondaryCtaText: 'އިތުރު މަޢުލޫމާތު',
    secondaryCtaLink: 'about',
    order: 2
  },
  {
    id: 'slide-3',
    imageUrl: '/images/gallery%20(6).jpg',
    badge: 'ސިސްޓާސް-ލެޑް އެންޖީއޯ • 13+ އަހަރު',
    title: 'އުޚުތުންގެ އިސްނެގުމުގައި ހެޔޮ ބިންގަލެއް',
    caption: '13+ އަހަރަށްވުރެ ގިނަ ދުވަހު މައިދާނުގައި ހަރަކާތްތެރިވެފައިވާ ތަޖުރިބާކާރު ކަނބަލުންގެ އިސްނެގުމާއެކު، އަންހެނުންގެ މުރާޖަޢާ ވޯކްޝޮޕްތަކާއި ނަފްސާނީ ހޭލުންތެރިކަން.',
    ctaText: 'ޖަމިއްޔާގެ ތަޢާރަފް',
    ctaLink: 'about',
    secondaryCtaText: 'ވޮލަންޓިއަރ ޓީމާ ގުޅިވަޑައިގަންނަވާ',
    secondaryCtaLink: 'volunteer',
    order: 3
  },
  {
    id: 'slide-4',
    imageUrl: '/images/gallery%20(5).jpg',
    badge: 'ތަރުބަވީ ބިންގާ (Kids & Youth)',
    title: 'ތުއްތުކުދިންނާއި ޒުވާނުންގެ އިސްލާމީ ތަރުބިއްޔަތު',
    caption: '3 އަހަރާއި 7 އަހަރާ ދެމެދުގެ ކުދިންނަށް ކުޅިވަރާއި ވާހަކަތަކުގެ ޒަރީޢާއިން އިސްލާމީ ރިވެތި އަޚްލާޤާއި ތައުޙީދު އުނގަންނައިދިނުމުގެ އަމާޒު.',
    ctaText: 'ޕްރޮގްރާމްތައް ބައްލަވާ',
    ctaLink: 'programs',
    secondaryCtaText: 'އެހީދެއްވުމަށް',
    secondaryCtaLink: 'donate',
    order: 4
  },
  {
    id: 'slide-5',
    imageUrl: '/images/gallery%20(3).jpg',
    badge: 'އެހީތެރިވުމަށް (Support)',
    title: 'ދީނީ އަދި އިޖުތިމާޢީ މަޝްރޫޢުތަކަށް ޞަދަޤާތް ކުރައްވާ',
    caption: 'ހެޔޮބިންގާގެ އެންމެހައި ދީނީ އަދި ތަރުބަވީ މަސައްކަތްތައް ކުރިއަށްދަނީ ތިޔަބޭފުޅުންގެ ދީލަތި އެހީއިންނެވެ. ފަސޭހައިން އެކައުންޓަށް ޖަމާކުރައްވައި ސްލިޕް އަޕްލޯޑް ކުރައްވާ.',
    ctaText: 'އެހީ ފޯރުކޮށްދެއްވާ',
    ctaLink: 'donate',
    secondaryCtaText: 'އެކައުންޓް ނަންބަރުތައް',
    secondaryCtaLink: 'donate',
    order: 5
  }
];

export const RECORDED_ACTIVITIES: RecordedActivitySection[] = [
  {
    code: '6.1',
    category: '6.1- އިޖްތިމާޢީ ތަރައްޤީގެ ތެރެއިން',
    items: [
      {
        dates: ['23/03/2024', '05/04/2024'],
        description: 'ރަމަޟާން މަހުގެ ހުކުރު ދުވަސްތަކުގައި "ޔޫން" ޖަމިއްޔާގެ ފަރާތުން އިންތިޒާމު ކުރި "ސެޓް ޔޯރ ގޯލް" ހަރަކާތުގައި ބައިވެރިވުން'
      }
    ]
  },
  {
    code: '6.5',
    category: '6.5 - ހޭލުންތެރިކަން (ދީނީ، ސިއްހީ)',
    items: [
      {
        dates: ['02/04/2024', '04/04/2024', '07/04/2024'],
        description: 'ރަމަޟާން މަހާއި ގުޅުވައިގެން ކުޑަކުދިންނަށް ޚާއްސަކޮށްގެން "މިނީ މުސްލިމްސް" ގެ ނަމުގައި 3 ދުވަހުގެ ޕްރޮގްރާމެއް ބޭއްވުން'
      }
    ]
  },
  {
    code: '6.2',
    category: '6.2 ތަޢުލީމީ ތަމްރީންގެ ތެރެއިން',
    items: [
      {
        dates: ['15/09/2024'],
        description: 'އިސްލާމީ ކަންތައްތަކާއި ބެހޭ ވުޒާރާއިން އިންތިޒާމުކުރި ދީނީ އިޖްތިމާޢީ މަސައްކަތްކުރާ ޖަމިއްޔާތަކުގެ އަހަރީ ބައްދަލުވުމުގައި ބައިވެރިވުން'
      },
      {
        dates: ['28/09/2024'],
        description: 'އިސްލާމީ ކަންތައްތަކާއި ބެހޭ ވުޒާރާއިން އިންތިޒާމުކުރި ދައުވާ ވޯރކްޝޮޕުގައި ބައިވެރިވުން'
      },
      {
        dates: ['23/11/2024'],
        description: 'އިސްލާމީ ކަންތައްތަކާއި ބެހޭ ވުޒާރާއިން އިންތިޒާމުކުރި ފަތުވާ މަހާސިންތާގައި ބައިވެރިވުން'
      }
    ]
  },
  {
    code: '6.8',
    category: '6.8 މުނާސަބާ ފާހަގަކުރުމާއި އެހެނިހެން ޙަރަކާތްތަކުގެ ތެރެއިން',
    items: [
      {
        dates: ['18/02/2025'],
        description: 'މިނިސްޓަރ އޮފް ޔޫތު އެންޕަވަމެންޓު،އިންފޮމޭޝަން އެންޑް އާރޓްސް އިން ބޭއްވި މަދަނީ ޖަމިއްޔާތަކުގެ މާހެފުމުގައި ބައިވެރިވުން.'
      }
    ]
  }
];

