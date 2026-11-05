# Challenges Hub & 30-Day Spiritual Campaigns System

An interactive Challenges & Campaigns Hub for Heyo Bingaa NGO, launching with the **30-Day No Backbiting Challenge** (30-Day No Gheebah Challenge). Designed to present twice-weekly posts (Mondays & Thursdays) featuring poster graphics, highlighted Ayahs and Hadiths, reflective guides, and shareable commitment pledges, fully manageable from the Admin Portal for present and future campaigns.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The design choices confirmed through interactive clarification have been integrated into this architectural blueprint:

- **Hub Placement**: Dedicated Challenges section linked seamlessly from both the **Homepage** (prominent featured banner & quick-link card) and the **Programs Page** (`/programs` with challenge filter and active campaign spotlight).
- **Post Browsing Format**: Visual feed of rich post cards highlighting the poster image, Qur'anic Ayah/Hadith quote box, reflective commentary, and week/day timeline milestones.
- **Interactive Daily Commitment**: Each challenge post includes a dedicated **"Our Commitment (އަޅުގަނޑުމެންގެ ޢަޒުމް)"** card with one-click copy, personal pledge toggle, and social sharing (WhatsApp, Viber, Instagram).
- **Scalable Program Engine**: Data architecture designed to support multiple concurrent or future campaigns (e.g., Ramadan prep, Fajr challenges, Quran memorization drives) beyond the 30-Day No Backbiting Challenge.

---

## 1. Overview & Core Concept

### What It Does
Provides a dedicated space on the Heyo Bingaa portal for structured spiritual challenges. The inaugural campaign, **30-Day No Backbiting Challenge (30 ދުވަހުގެ ޣީބަ ނުބުނުމުގެ ޗެލެންޖް)**, guides sisters and community members through bi-weekly reflections released every Monday and Thursday (started Monday, 2 November 2026). Each installment pairs an illustrated poster with Qur'anic evidence, practical advice on guarding the tongue and purifying the heart, and a actionable commitment.

### Target Audience & Persona
- **Maldivian Women & Community**: Sisters seeking practical, step-by-step spiritual growth, mindful speech habits, and mutual sisterhood encouragement.
- **NGO Campaign Administrators**: Content leaders who can schedule, draft, and publish new challenge posts twice weekly via the Admin Panel without touching code.

### Key Value
- Transforms one-off social media posts into a structured, searchable, and permanent spiritual curriculum on the official website.
- Enhances participant engagement through interactive pledge tracking and frictionless commitment sharing.

---

## 2. User Experience & Visual Design

### Key User Flows

#### A. Participant Browsing & Reflection Flow
1. **Homepage / Programs Entry**: A warm campaign card on the Homepage highlights the active "30-Day No Backbiting Challenge" showing current progress (e.g. *Week 1 · 2 Posts Published*).
2. **Dedicated Challenge Hub View**:
   - **Header Banner**: Warm Islamic typography, challenge emblem, aim statement, and schedule badge (*Mondays & Thursdays · ހޯމަ އަދި ބުރާސްފަތި*).
   - **Post Feed**: Chronological list of bi-weekly posts starting from Post 1 (Monday, 2 Nov 2026).
3. **Interactive Post Card**:
   - **Header & Timestamp**: Post title (e.g. *Week 1 · Post 1 · 2 Nov 2026*), milestone badge.
   - **Poster Image**: High-resolution graphic (`/src/images/nobackbite1.jpg`) with click-to-expand lightbox view and download option.
   - **Ayah / Hadith Focus Box**: Dignified calligraphy and framed Islamic quote styling for Surah Al-Hujurat 49:12.
   - **Reflection & Commentary**: Heartfelt prose on guarding speech, avoiding negative assumptions, and protecting sisters' honour.
   - **Interactive Commitment Card**:
     - *Quote*: "I will try my best to protect the honour of others, just as I would want them to protect mine."
     - *Actions*: "Copy Commitment (ޢަޒުމް ކޮޕީކުރައްވާ)", "Share on Viber / WhatsApp", and "Pledge Today (އަޅުގަނޑުގެ ޢަޒުމް)".

#### B. Administrator Campaign Management Flow
1. **Admin Portal**: Admin navigates to the dedicated **"ޗެލެންޖްތައް (Challenges)"** tab.
2. **Campaign Overview**: View active challenges and their post count.
3. **Post Manager**:
   - Click "އައު ޕޯސްޓެއް އިތުރުކުރައްވާ (Add New Post)".
   - Select Challenge (*30-Day No Backbiting Challenge* or future campaigns).
   - Set Week Number, Post Number, and Release Date (e.g. Thursday, 5 Nov 2026).
   - Enter Ayah/Hadith text (Arabic, translation, reference).
   - Upload new poster image or choose from media library.
   - Enter reflection body text and commitment statement.
   - Save & publish immediately or save as draft.

### Visual Identity & Theme
- **Color Palette**:
  - Warm Sand & Rose-Grey Paper (`#FBF9F6`, `#F3ECE7`) inspired by the soft muted tones of the campaign poster.
  - Deep Forest Ink (`#1C332A`, `#145541`) for high-contrast, fatigue-free Thaana and Arabic reading.
  - Emerald & Sage Accents (`#1B6B52`, `#EBF5F0`) maintaining cohesion with the Heyo Bingaa brand.
- **Typography**:
  - Display Title: Bold Faruma Thaana (`text-2xl sm:text-3xl font-black`).
  - Ayah / Hadith: High-contrast bordered callout with classical quotation marks and Arabic font rendering (`Amiri` / `Scheherazade New`).
  - Body Text: Relaxed measure (65–75 characters per line, `leading-relaxed`) ensuring readable mobile and desktop experience.
- **Anti-Slop Restraint**: Zero floating pill clusters; clean unboxed editorial date separators (`Monday, 2 Nov 2026 · Week 1 · Post 1`).

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Dedicated Hub vs. Mixing into Generic Blog/Articles
- **Chosen Approach**: A dedicated Challenge Hub view with direct linkages from both the Homepage and Programs page.
- **Why**: A structured 30-day challenge has a sequential timeline, milestone progress, and commitment pledges that would get diluted in a standard chronological blog or news feed.
- **Trade-off**: Requires dedicated navigation and components; addressed by building a reusable Challenge Engine that powers both this campaign and future ones (e.g., Ramadan 2027 challenges).

### Decision 2: Data Persistence Architecture
- **Chosen Approach**: Dual persistence using Firestore document sync (`siteSettings/challenges`) combined with browser `localStorage` caching and pre-populated initial seed data.
- **Why**: Guarantees zero latency on page load, instant offline availability, and absolute safety against permission mismatches, while allowing real-time administrative publishing.

### Decision 3: Initial Seed Post
- **Chosen Approach**: Pre-populate Post 1 (Monday, 2 November 2026) with the user's provided copy, Surah Al-Hujurat 49:12, and the attached poster image (`src/images/nobackbite1.jpg`) so the challenge is immediately live and interactive.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                            │
├───────────────────────────────────┬────────────────────────────────────┤
│           PUBLIC PORTAL           │            ADMIN PORTAL            │
│  ┌─────────────────────────────┐  │  ┌──────────────────────────────┐  │
│  │ HomePage Highlight Card     │  │  │ AdminChallengesTab           │  │
│  │   - Current post snippet    │  │  │   - Challenge list & status  │  │
│  │   - "Join Challenge" CTA    │  │  │   - Post creation form       │  │
│  └──────────────┬──────────────┘  │  │   - Ayah/Hadith quote editor │  │
│                 ▼                 │  │   - Poster image uploader    │  │
│  ┌─────────────────────────────┐  │  │   - Schedule date (Mon/Thu)  │  │
│  │ ChallengeHubView            │  │  └───────────────▲──────────────┘  │
│  │   - Challenge header & info │  │                  │                 │
│  │   - Bi-weekly visual feed   │  │                  │                 │
│  │   - Ayah callout block      │  │                  │                 │
│  │   - Commitment card & share │  │                  │                 │
│  └──────────────▲──────────────┘  │                  │                 │
└─────────────────┼─────────────────┴──────────────────┼─────────────────┘
                  │                                    │
                  │ real-time subscribe                │ save / edit / delete
                  │                                    │
┌─────────────────▼────────────────────────────────────▼─────────────────┐
│                          CHALLENGES SERVICE                            │
│  - subscribeToChallenges(callback)                                     │
│  - subscribeToChallengePosts(challengeId, callback)                    │
│  - saveChallengePost(post)                                             │
│  - deleteChallengePost(postId)                                         │
│  - Fallback & Cache: localStorage + INITIAL_CHALLENGES                 │
└─────────────────────────────────▲──────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼──────────────────────────────────────┐
│                    FIRESTORE PERSISTENCE & SCHEMAS                     │
│  - Path: siteSettings/challenges & siteSettings/challengePosts         │
│  - Read: Public                                                        │
│  - Write: Admin only                                                   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema (TypeScript)

```typescript
export interface Challenge {
  id: string;               // e.g. "no-backbiting-30"
  slug: string;             // URL-friendly identifier
  title: string;            // "30-Day No Backbiting Challenge" / "30 ދުވަހުގެ ޣީބަ ނުބުނުމުގެ ޗެލެންޖް"
  tagline: string;          // "Guarding our tongues, purifying our hearts"
  description: string;      // Campaign mission and purpose
  startDate: string;        // "2026-11-02"
  durationDays: number;     // 30
  scheduleText: string;     // "Weekly twice: Mondays & Thursdays"
  bannerImage?: string;     // Header or social card
  status: 'active' | 'upcoming' | 'completed';
  postsCount: number;
}

export interface ChallengePost {
  id: string;               // e.g. "nb-post-1"
  challengeId: string;      // "no-backbiting-30"
  weekNumber: number;       // 1
  postNumber: number;       // 1
  dayOfWeek: string;        // "Monday" / "ހޯމަ"
  publishDate: string;      // "2026-11-02"
  title: string;            // "Our First Commitment: Protecting Each Other's Honour"
  imageUrl: string;         // "/src/images/nobackbite1.jpg"
  quote: {
    type: 'ayah' | 'hadith';
    arabic?: string;
    translation: string;
    reference: string;      // "Qur'an 49:12"
  };
  content: string;          // Main reflection body
  commitmentText: string;   // Actionable pledge
  hashtags: string[];       // ["#30DayNoBackbitingChallenge"]
  isPublished: boolean;
  order: number;
}
```

### Execution Steps
1. **Types & Data Layer (`src/types.ts` & `src/data/initialData.ts`)**:
   - Define `Challenge` and `ChallengePost` interfaces.
   - Seed `INITIAL_CHALLENGES` and `INITIAL_CHALLENGE_POSTS` with the user's Post 1 text and `/src/images/nobackbite1.jpg`.
2. **Service Functions (`src/services/firestoreService.ts`)**:
   - Implement `subscribeToChallenges`, `subscribeToChallengePosts`, `saveChallengePost`, and `deleteChallengePost` using the resilient `siteSettings` and `localStorage` pattern.
3. **Public Challenge Hub View (`src/components/challenges/ChallengeHubView.tsx`)**:
   - Build the responsive visual feed displaying post cards, poster image lightbox, Ayah quote container, reflection typography, and the interactive Commitment card with "Copy" and "Share" buttons.
4. **Homepage & Programs Integration**:
   - Add a high-visibility "Active Challenge" showcase tile on the Homepage with a direct link to the Challenge Hub.
   - Add a "ޗެލެންޖްތައް (Challenges)" tab filter or quick section in the Programs page.
5. **Admin Management Suite (`src/components/admin/AdminChallengesTab.tsx`)**:
   - Implement post creation/editing modal with image upload, Ayah/Hadith formatting fields, Monday/Thursday date pickers, and post reordering.
   - Wire into `AdminPage.tsx` tab navigation.
6. **Verification & Build Validation**:
   - Validate with `lint_applet` (`tsc --noEmit`) and `compile_applet`.
   - Verify dev server responsiveness and test interactive pledge sharing.
