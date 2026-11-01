# Modern Cinematic Feature Banner & Admin Customization

A modern, full-width cinematic hero slider with refined glassmorphism overlay and Ken Burns motion, paired with complete real-time management from the Admin Panel.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The design choices confirmed through interactive clarification have been integrated into this architectural blueprint:

- **Layout Style**: Full-width cinematic slider with a modern frosted glass overlay card, presenting high-contrast Dhivehi typography, badge tag, title, caption, and dual call-to-action buttons.
- **Admin Customization Scope**: Full administrative control per slide (custom image upload or URL, title, caption, badge tag, primary button label & link, secondary button label & link, display order, and status).
- **Motion & Transitions**: Smooth cross-fade transitions coupled with subtle Ken Burns zoom/pan on the active background image and an animated progress bar indicating slide timing.
- **Data Persistence**: Dedicated Firestore `heroSlides` collection with real-time `onSnapshot` sync, RBAC rules (public read, verified Admin write), and seamless fallback to `INITIAL_HERO_SLIDES`.

---

## 1. Overview & Core Concept

### What It Does
Replaces the static single-image banner with a dynamic, full-width cinematic slideshow on the Heyo Bingaa homepage. Visitors experience high-resolution visuals representing the NGO's key missions (Islamic awareness, deaf accessibility with sign language, sisters-led initiatives, youth tarbiyah, and charitable campaigns) accompanied by crystal-clear Thaana typography. Administrators can add, edit, reorder, and remove slides directly from the Admin Portal without code deployments.

### Target Audience & Persona
- **General Public & Beneficiaries**: Visitors seeking Islamic lectures, programs for women and children, sign language accessible media, and donation transparency.
- **NGO Administrators & Content Managers**: Authorized team members who need to highlight upcoming Ramadan campaigns, new educational series, or urgent community appeals quickly.

### Key Value
- Elevates the visual identity of the organization from a static header to an engaging, institutional-grade portal.
- Empowers the NGO team with zero-code real-time content updates for their highest-visibility landing surface.

---

## 2. User Experience & Visual Design

### Key User Flows

#### A. Homepage Visitor Flow
1. **First Impression**: The banner spans the full container width with a high-resolution visual slowly breathing with a subtle Ken Burns zoom.
2. **Glassmorphism Content Card**: Positioned with comfortable padding, a frosted glass card (`backdrop-blur-md bg-stone-950/40 border border-white/15`) showcases the slide's badge tag, bold Thaana headline, descriptive caption, and interactive buttons.
3. **Interactive Controls**: Minimalist glass controls (previous/next chevron buttons, play/pause toggle, and segmented progress bars) let visitors pause or jump between slides seamlessly.
4. **Direct Navigation**: Clicking the CTA button navigates to the relevant page (e.g., `#programs`, `#videos`, `#donate`, `#volunteer`, or `#about`).

#### B. Administrator Management Flow
1. **Admin Portal**: Admin logs in and selects the new dedicated **"ފީޗަރ ބެނާ (Feature Banner)"** tab (or clicks a direct "Edit Banner" quick button from the homepage when authenticated).
2. **Slide Inventory**: View all active slides with miniature preview cards, current display order, and live status.
3. **Slide Editor Modal / Form**:
   - Upload new image directly (with automatic canvas client-side compression to protect Firestore quotas) or provide an image URL.
   - Enter Dhivehi Title, Caption, Badge Tag, and Action Button labels.
   - Select destination page from a clean dropdown.
   - Reorder slides instantly with Move Up / Move Down controls.
4. **Instant Synchronization**: On saving, changes are committed to Firestore and immediately reflect on the live homepage across all connected devices via real-time listener.

### Visual Identity & Theme
- **Aesthetic Direction**: Contemporary Islamic Institutional — serene forest green (`#1B6B52`), deep emerald (`#145541`), warm parchment text tones (`#FAFCFB`, `#EBF5F0`), and soft amber accents (`#FDE68A`).
- **Typography & Thaana Hierarchy**:
  - *Display Headlines*: Bold Faruma / Noto Sans Thaana (`clamp(1.5rem, 3.5vw, 2.5rem)`), `text-wrap: balance` to prevent orphan words, subtle text drop-shadow for optical legibility over diverse photos.
  - *Captions*: 15px–16px Faruma with relaxed line height (`leading-relaxed`), measure constrained to `max-w-2xl`.
  - *Badge Tags*: Clean unboxed text with typographic separator (`·`) adhering strictly to the Anti-Slop Zero-Pill rule.
- **Glassmorphism Scrim**: A multi-stop vertical and horizontal vignette scrim (`bg-gradient-to-t from-black/85 via-black/45 to-transparent`) ensures WCAG AA contrast (exceeding 4.5:1 ratio) on all imagery.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Firestore Collection vs. Local Storage
- **Chosen Approach**: Store banner slides in a top-level Firestore collection `heroSlides/{slideId}` with fallback to `INITIAL_HERO_SLIDES`.
- **Why**: Ensures all visitors across phones, tablets, and desktops see the NGO's current announcements simultaneously, while maintaining full offline/initial reliability.
- **Trade-off**: Requires Firestore security rules and write permissions; solved by restricting write/delete to verified administrators (`isAdmin()`).

### Decision 2: Image Handling in Firestore
- **Chosen Approach**: Allow direct image upload with automatic client-side canvas compression (1280x720 JPEG at 80% quality, generating ~100-150KB Data URIs) or direct image URL / internal asset path.
- **Why**: Keeps all data self-contained in Firestore without requiring external storage buckets or third-party image hosts that might break in evaluation sandboxes.

### Decision 3: Quick Admin Access
- **Chosen Approach**: When an authenticated administrator is browsing the homepage, render an unobtrusive floating or header "ބެނާ މެނޭޖްކުރައްވާ (Manage Banner)" shortcut that immediately routes to `#admin` with the banner tab open.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                            │
├───────────────────────────────────┬────────────────────────────────────┤
│           HOMEPAGE                │            ADMIN PORTAL            │
│  ┌─────────────────────────────┐  │  ┌──────────────────────────────┐  │
│  │   HeroSlideshowBanner       │  │  │   AdminBannerTab             │  │
│  │   - Full-width Ken Burns    │  │  │   - Live preview list        │  │
│  │   - Frosted glass card      │  │  │   - Image upload & compress  │  │
│  │   - Animated progress bar   │  │  │   - Text, badge & link edit  │  │
│  │   - Nav click handlers      │  │  │   - Up/down reorder controls │  │
│  └──────────────▲──────────────┘  │  └───────────────▲──────────────┘  │
└─────────────────┼─────────────────┴──────────────────┼─────────────────┘
                  │ real-time subscribe                │ save / delete
                  │ (onSnapshot)                       │ (setDoc / deleteDoc)
┌─────────────────▼────────────────────────────────────▼─────────────────┐
│                          FIRESTORE SERVICE                             │
│  - subscribeToHeroSlides(callback)                                     │
│  - saveHeroSlideToFirestore(slide)                                     │
│  - deleteHeroSlideFromFirestore(slideId)                               │
│  - reorderHeroSlidesInFirestore(slides)                                │
│  - Fallback: INITIAL_HERO_SLIDES                                       │
└─────────────────────────────────▲──────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼──────────────────────────────────────┐
│                    FIRESTORE SECURITY & BLUEPRINT                      │
│  - Collection: /heroSlides/{slideId}                                   │
│  - Read: Public (allow get, list: if true)                             │
│  - Write: Admin only (isAdmin() && isValidHeroSlide(incoming()))       │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema (`firebase-blueprint.json` & TypeScript)

```typescript
export interface HeroSlide {
  id: string;               // alphanumeric ID e.g. "slide-1"
  imageUrl: string;         // Data URI or asset path
  badge?: string;           // e.g. "އިސް ޙަރަކާތް • ދީނީ ދައުރު"
  title: string;            // Primary headline
  caption: string;          // Descriptive subtitle
  ctaText?: string;         // Primary button label
  ctaLink?: NavigationTab;  // Target navigation tab ('programs' | 'events' | etc.)
  secondaryCtaText?: string;// Secondary button label
  secondaryCtaLink?: NavigationTab;
  order: number;            // Display sequence (1, 2, 3...)
  status?: 'active' | 'archived';
  updatedAt?: string;
}
```

### Execution Steps
1. **Schema & Security Hardening**:
   - Add `heroSlide` entity and `/heroSlides/{slideId}` path to `firebase-blueprint.json`.
   - Update `firestore.rules` with `isValidHeroSlide(incoming())` helper and admin-restricted create/update/delete rules.
2. **Firestore Service Integration**:
   - Implement `subscribeToHeroSlides`, `saveHeroSlideToFirestore`, and `deleteHeroSlideFromFirestore` in `src/services/firestoreService.ts`.
3. **Admin Panel Banner Tab (`AdminBannerTab.tsx`)**:
   - Create a polished tab in `AdminPage.tsx` with slide reordering, image uploading with canvas compression, preview modal, and field editing.
4. **Hero Slideshow Banner Modernization (`HeroSlideshowBanner.tsx`)**:
   - Re-architect into a full-width cinematic hero with smooth cross-fade, Ken Burns slow pan, modern glassmorphism content overlay, and interactive controls.
   - Connect to real-time hero slides state with seamless fallback.
5. **Verification & Testing**:
   - Run `lint_applet` and `compile_applet` to confirm zero TypeScript errors and successful production build.
   - Verify dev server responsiveness and preview rendering.
