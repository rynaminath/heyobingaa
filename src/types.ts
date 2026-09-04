export type NavigationTab = 
  | 'home' 
  | 'about' 
  | 'media' 
  | 'programs' 
  | 'events' 
  | 'volunteer' 
  | 'donate';

export interface BankAccount {
  id: string;
  bankName: string;
  bankCode: 'BML' | 'MIB';
  accountName: string;
  accountNumber: string;
  currency: 'MVR' | 'USD';
  badge: string;
}

export interface EventItem {
  id: string;
  title: string;
  titleEn?: string;
  speaker: string;
  venue: string;
  date: string;
  time: string;
  dayText: string;
  audience: string;
  broadcast: string;
  description: string;
  isFeatured?: boolean;
  status: 'upcoming' | 'ongoing' | 'completed';
  partnerOrganization?: string;
  registrationUrl?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  series: string;
  episodeNumber?: number;
  duration: string;
  speaker?: string;
  interpreter?: string; // Sign language interpreter name
  isDeafAccessible: boolean; // Sign language integrated
  partner: string; // e.g. Dhares TV
  thumbnailUrl: string;
  videoEmbedUrl?: string;
  summary: string;
  category: 'deaf_accessible' | 'sisters_family' | 'kids_youth' | 'ramadan' | 'dawah';
  publishedDate: string;
  viewsCount?: string;
}

export interface ProgramItem {
  id: string;
  title: string;
  category: 'women' | 'toddlers' | 'teenagers' | 'joint_ngo' | 'community';
  categoryLabel: string;
  targetAudience: string;
  format: string; // Interactive workshop, lecture, outdoor, etc.
  description: string;
  impactMetrics: string;
  collaborators?: string[];
  features: string[];
  imageUrl: string;
}

export interface VolunteerApplication {
  id: string;
  name: string;
  phone: string;
  email?: string;
  islandCity: string;
  track: 'sisters' | 'brothers';
  interests: string[];
  availability: string;
  notes?: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'contacted';
}

export interface DonationSlip {
  id: string;
  donorName: string;
  phone: string;
  amount: number;
  currency: 'MVR' | 'USD';
  bankAccount: string;
  referenceNumber?: string;
  slipImageUrl?: string;
  slipFileName?: string;
  notes?: string;
  date: string;
  verified: boolean;
}

export interface PartnerOrg {
  id: string;
  nameDv: string;
  nameEn: string;
  role: string;
  tag: string;
  accentColor: string;
}
