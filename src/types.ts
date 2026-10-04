export type NavigationTab = 
  | 'home' 
  | 'about' 
  | 'articles'
  | 'videos'
  | 'media' // alias for backwards compatibility
  | 'gallery'
  | 'programs' 
  | 'events' 
  | 'volunteer' 
  | 'donate'
  | 'admin';

export interface BankAccount {
  id: string;
  bankName: string;
  bankCode: 'BML' | 'MIB';
  accountName: string;
  accountNumber: string;
  currency: 'MVR' | 'USD';
  badge: string;
}

export interface BankGroup {
  id: 'bml' | 'mib';
  bankCode: 'BML' | 'MIB';
  bankName: string;
  bankNameEn: string;
  accountName: string;
  accounts: BankAccount[];
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
  partner: string; // e.g. Dhaaris TV
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
  category: 'women' | 'toddlers' | 'teenagers' | 'joint_ngo' | 'community' | 'audiobooks' | 'lectures';
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
  createdAt?: string;
  status: 'pending' | 'reviewed' | 'contacted';
}

export interface DonationSlip {
  id: string;
  donorName: string;
  phone?: string;
  amount: number;
  currency: 'MVR' | 'USD';
  bankAccount: string;
  referenceNumber?: string;
  slipImageUrl?: string;
  slipFileName?: string;
  notes?: string;
  date: string;
  verified: boolean;
  isAnonymous?: boolean;
}

export interface PartnerOrg {
  id: string;
  nameDv: string;
  nameEn: string;
  role: string;
  tag: string;
  accentColor: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  filename?: string;
  title: string;
  category?: string;
  date?: string;
  order?: number;
  createdAt?: string;
}

export interface HeroSlide {
  id: string;
  imageUrl: string;
  badge?: string;
  title: string;
  caption: string;
  ctaText?: string;
  ctaLink?: NavigationTab;
  secondaryCtaText?: string;
  secondaryCtaLink?: NavigationTab;
  order?: number;
}

export interface RecordedActivityItem {
  dates: string[];
  description: string;
}

export interface RecordedActivitySection {
  code: string;
  category: string;
  items: RecordedActivityItem[];
}

export type ArticleStatus = 'draft' | 'pending_approval' | 'published' | 'rejected';

export interface AuthorProfile {
  id: string; // auth uid or custom author id
  email: string; // Google email
  name: string; // Author name in Dhivehi (or English)
  title?: string; // e.g. ދީނީ ލިޔުންތެރިޔާ, ޢިލްމީ މުދައްރިސް
  bio?: string;
  avatarUrl?: string;
  status: 'active' | 'suspended';
  addedAt: string;
  addedBy?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  featuredImage: string; // Standardized 16:9 aspect ratio image URL / Data URI
  category: 'tawheed' | 'fiqh' | 'family' | 'youth' | 'seerah' | 'ramadan' | 'general';
  categoryLabel: string;
  authorId?: string; // UID of submitter or author
  authorEmail?: string;
  authorName: string; // Displayed author name (admins can customize author name)
  authorRole?: string;
  status: ArticleStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
  readingTimeMinutes?: number;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  viewsCount?: number;
}

