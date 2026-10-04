import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { EventItem, MediaItem, ProgramItem, DonationSlip, VolunteerApplication, GalleryItem, ArticleItem, AuthorProfile } from '../types';
import {
  INITIAL_EVENTS,
  INITIAL_MEDIA,
  PROGRAMS,
  NGO_CONTACT,
  INITIAL_GALLERY,
  INITIAL_AUTHORS,
  INITIAL_ARTICLES
} from '../data/initialData';

// Bootstrapped admin email
export const BOOTSTRAP_ADMIN_EMAIL = 'ryn@azmans.com';

/**
 * Check if the given authenticated user is an administrator
 */
export async function checkUserIsAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;

  // Direct check for bootstrapped admin
  if (user.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
    return true;
  }

  try {
    const adminDocRef = doc(db, 'admins', user.uid);
    const snap = await getDoc(adminDocRef);
    return snap.exists();
  } catch (err) {
    console.warn('Error checking admin status:', err);
    return false;
  }
}

/**
 * Check if the given authenticated user is an author
 * (Admins are automatically authors, or users registered in 'authors' collection)
 */
export async function checkUserIsAuthor(user: User | null): Promise<{
  isAuthor: boolean;
  authorProfile?: AuthorProfile;
}> {
  if (!user) return { isAuthor: false };

  // Admins always have author privileges
  const isAdmin = await checkUserIsAdmin(user);
  if (isAdmin) {
    return {
      isAuthor: true,
      authorProfile: {
        id: user.uid,
        email: user.email || BOOTSTRAP_ADMIN_EMAIL,
        name: user.displayName || 'ހެޔޮބިންގާ އިދާރާ',
        title: 'އެޑްމިނިސްޓްރޭޓަރ & ލިޔުންތެރިޔާ',
        status: 'active',
        addedAt: new Date().toISOString()
      }
    };
  }

  try {
    // Check by UID first
    const authorDocRef = doc(db, 'authors', user.uid);
    const snap = await getDoc(authorDocRef);
    if (snap.exists() && snap.data().status === 'active') {
      return {
        isAuthor: true,
        authorProfile: { ...(snap.data() as AuthorProfile), id: snap.id }
      };
    }

    // Check by email query in authors collection
    if (user.email) {
      const q = query(collection(db, 'authors'), where('email', '==', user.email.toLowerCase()));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const docData = querySnap.docs[0].data() as AuthorProfile;
        if (docData.status === 'active') {
          return {
            isAuthor: true,
            authorProfile: { ...docData, id: querySnap.docs[0].id }
          };
        }
      }
    }

    return { isAuthor: false };
  } catch (err) {
    console.warn('Error checking author status:', err);
    return { isAuthor: false };
  }
}

/**
 * Realtime subscribe to Events
 */
export function subscribeToEvents(
  onData: (events: EventItem[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'events';
  const colRef = collection(db, colPath);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onData([]);
        return;
      }
      const list: EventItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as EventItem), id: docSnap.id });
      });
      // Sort upcoming first
      list.sort((a, b) => (a.date > b.date ? 1 : -1));
      onData(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, colPath);
    }
  );
}

/**
 * Realtime subscribe to Media items
 */
export function subscribeToMedia(
  onData: (media: MediaItem[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'media';
  const colRef = collection(db, colPath);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onData([]);
        return;
      }
      const list: MediaItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as MediaItem), id: docSnap.id });
      });
      onData(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, colPath);
    }
  );
}

/**
 * Realtime subscribe to Programs
 */
export function subscribeToPrograms(
  onData: (programs: ProgramItem[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'programs';
  const colRef = collection(db, colPath);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onData([]);
        return;
      }
      const list: ProgramItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as ProgramItem), id: docSnap.id });
      });
      onData(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, colPath);
    }
  );
}

/**
 * Realtime subscribe to Gallery items
 */
export function subscribeToGallery(
  onData: (items: GalleryItem[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'gallery';
  const colRef = collection(db, colPath);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onData([]);
        return;
      }
      const list: GalleryItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as GalleryItem), id: docSnap.id });
      });
      // Sort by order or creation date
      list.sort((a, b) => ((a.order ?? 999) - (b.order ?? 999)));
      onData(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, colPath);
    }
  );
}

/**
 * LocalStorage keys for fallback and offline persistence
 */
const LOCAL_VOLUNTEERS_KEY = 'heyo_volunteer_applications_v2';
const LOCAL_SLIPS_KEY = 'heyo_donation_slips_v2';

const SAMPLE_VOLUNTEERS: VolunteerApplication[] = [
  {
    id: 'vol-sample-1',
    name: 'ޢާއިޝަތު ނަޒީޙާ',
    phone: '7781234',
    email: 'nazeeha@example.com',
    islandCity: 'މާލެ',
    track: 'sisters',
    interests: ['ކުޑަކުދިންގެ ޕްރޮގްރާމްތަކުގައި އެހީތެރިވުން', 'އިވެންޓް ކޯޑިނޭޝަން އަދި އިންތިޒާމު'],
    availability: 'ހަވީރު އަދި ރޭގަނޑު',
    status: 'pending',
    submittedAt: '2026-10-01',
    notes: 'ކުރިންވެސް އިސްލާމީ އިވެންޓްތަކުގައި ވޮލަންޓިއަރ ކޮށްފައިވާނެ'
  },
  {
    id: 'vol-sample-2',
    name: 'އަޙްމަދު ރަޝީދު',
    phone: '9984321',
    email: 'rashid@example.com',
    islandCity: 'ހުޅުމާލެ ފޭސް 2',
    track: 'brothers',
    interests: ['ލޮޖިސްޓިކްސް އަދި ތަކެތި އުފުލުން', 'އޯޑިއޯ ވީޑިއޯ / ޓެކްނިކަލް ސެޓަޕް'],
    availability: 'ހަފްތާ ބަންދުގައި (ހުކުރު / ހޮނިހިރު)',
    status: 'reviewed',
    submittedAt: '2026-09-28',
    notes: 'ސައުންޑް ސިސްޓަމް ބެލެހެއްޓުމުގެ ތަޖުރިބާ ހުރި'
  },
  {
    id: 'vol-sample-3',
    name: 'މަރްޔަމް ޝިފާނާ',
    phone: '7905544',
    email: 'shifana@example.com',
    islandCity: 'މާލެ',
    track: 'sisters',
    interests: ['ކޮންޓެންޓް ރައިޓިންގ އަދި މީޑިއާ', 'އިދާރީ މަސައްކަތް'],
    availability: 'ހެނދުނު',
    status: 'contacted',
    submittedAt: '2026-09-25',
    notes: 'ގްރެފިކް ޑިޒައިނިންގ އަދި ސޯޝަލް މީޑިއާ ޕޯސްޓް ހެދުމުގެ ހުނަރު ހުރި'
  }
];

const SAMPLE_SLIPS: DonationSlip[] = [
  {
    id: 'slip-sample-1',
    donorName: 'ނަން ހާމަނުކުރާ ފަރާތެއް',
    phone: '7789000',
    amount: 1000,
    currency: 'MVR',
    bankAccount: 'ބީ.އެމް.އެލް (BML) - ދިވެހި ރުފިޔާ (MVR) - 7730000632367',
    date: '2026-10-02',
    referenceNumber: 'TX9923847',
    notes: 'ރަމަޟާން ޕްރޮގްރާމްތަކަށް ޞަދަޤާތެއް',
    verified: true,
    isAnonymous: true
  },
  {
    id: 'slip-sample-2',
    donorName: 'ޙުސައިން ޒާމިލް',
    phone: '9912345',
    amount: 500,
    currency: 'MVR',
    bankAccount: 'އެމް.އައި.ބީ (MIB) - ދިވެހި ރުފިޔާ (MVR) - 90101130007801000',
    date: '2026-10-01',
    referenceNumber: 'MIB-882190',
    notes: 'ހެޔޮބިންގާގެ ޢާންމު ފަންޑަށް',
    verified: false,
    isAnonymous: false
  }
];

function getStoredVolunteers(): VolunteerApplication[] {
  try {
    const raw = localStorage.getItem(LOCAL_VOLUNTEERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_VOLUNTEERS_KEY, JSON.stringify(SAMPLE_VOLUNTEERS));
      return SAMPLE_VOLUNTEERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_VOLUNTEERS;
  } catch {
    return SAMPLE_VOLUNTEERS;
  }
}

function saveStoredVolunteers(apps: VolunteerApplication[]) {
  try {
    localStorage.setItem(LOCAL_VOLUNTEERS_KEY, JSON.stringify(apps));
  } catch (e) {
    console.warn('Failed to save volunteers to localStorage', e);
  }
}

function getStoredSlips(): DonationSlip[] {
  try {
    const raw = localStorage.getItem(LOCAL_SLIPS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_SLIPS_KEY, JSON.stringify(SAMPLE_SLIPS));
      return SAMPLE_SLIPS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_SLIPS;
  } catch {
    return SAMPLE_SLIPS;
  }
}

function saveStoredSlips(slips: DonationSlip[]) {
  try {
    localStorage.setItem(LOCAL_SLIPS_KEY, JSON.stringify(slips));
  } catch (e) {
    console.warn('Failed to save donation slips to localStorage', e);
  }
}

/**
 * Realtime subscribe to Donation Slips (Admin Only)
 */
export function subscribeToDonationSlips(
  onData: (slips: DonationSlip[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'donationSlips';
  // Emit stored local slips immediately
  onData(getStoredSlips());

  const colRef = collection(db, colPath);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const firestoreList: DonationSlip[] = [];
      snapshot.forEach((docSnap) => {
        firestoreList.push({ ...(docSnap.data() as DonationSlip), id: docSnap.id });
      });

      const localList = getStoredSlips();
      const map = new Map<string, DonationSlip>();
      localList.forEach((s) => map.set(s.id, s));
      firestoreList.forEach((s) => map.set(s.id, s));

      const combined = Array.from(map.values());
      combined.sort((a, b) => (a.date < b.date ? 1 : -1));
      saveStoredSlips(combined);
      onData(combined);
    },
    (error) => {
      console.warn('Firestore slips error, using local fallback:', error);
      onData(getStoredSlips());
      if (onError) onError(error);
    }
  );
}

/**
 * Realtime subscribe to Volunteer Applications (Admin Only)
 */
export function subscribeToVolunteers(
  onData: (apps: VolunteerApplication[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'volunteerApplications';
  // Emit stored local applications immediately
  onData(getStoredVolunteers());

  const colRef = collection(db, colPath);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const firestoreList: VolunteerApplication[] = [];
      snapshot.forEach((docSnap) => {
        firestoreList.push({ ...(docSnap.data() as VolunteerApplication), id: docSnap.id });
      });

      const localList = getStoredVolunteers();
      const map = new Map<string, VolunteerApplication>();
      localList.forEach((a) => map.set(a.id, a));
      firestoreList.forEach((a) => map.set(a.id, a));

      const combined = Array.from(map.values());
      combined.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
      saveStoredVolunteers(combined);
      onData(combined);
    },
    (error) => {
      console.warn('Firestore volunteers error, using local fallback:', error);
      onData(getStoredVolunteers());
      if (onError) onError(error);
    }
  );
}

/**
 * Submit Donation Slip (Supporter Public Action)
 */
export async function submitDonationSlip(slip: Omit<DonationSlip, 'id' | 'verified'>): Promise<string> {
  const path = 'donationSlips';
  const id = `slip-${Date.now()}`;
  
  const cleanSlip: DonationSlip = {
    id,
    amount: Number(slip.amount),
    currency: slip.currency,
    bankAccount: slip.bankAccount,
    date: slip.date || new Date().toISOString().split('T')[0],
    verified: false,
    isAnonymous: Boolean(slip.isAnonymous),
    donorName: slip.donorName && slip.donorName.trim()
      ? slip.donorName.trim()
      : (Boolean(slip.isAnonymous) ? 'ސިއްރު ފަރާތެއް (Anonymous)' : 'ނަން ހާމަނުކުރާ ފަރާތެއް')
  };

  if (slip.phone && slip.phone.trim()) cleanSlip.phone = slip.phone.trim();
  if (slip.referenceNumber && slip.referenceNumber.trim()) cleanSlip.referenceNumber = slip.referenceNumber.trim();
  if (slip.notes && slip.notes.trim()) cleanSlip.notes = slip.notes.trim();
  if (slip.slipImageUrl && slip.slipImageUrl.trim()) cleanSlip.slipImageUrl = slip.slipImageUrl;
  if (slip.slipFileName && slip.slipFileName.trim()) cleanSlip.slipFileName = slip.slipFileName.trim();

  // 1. Infallible Local Persistence
  const currentSlips = getStoredSlips();
  saveStoredSlips([cleanSlip, ...currentSlips.filter((s) => s.id !== id)]);

  // 2. Try Firestore Cloud persistence
  try {
    await setDoc(doc(db, path, id), cleanSlip);
  } catch (error) {
    console.warn('Firestore write warning for donation slip (persisted locally):', error);
  }

  return id;
}

/**
 * Submit Volunteer Application (Public Action)
 */
export async function submitVolunteerApplication(app: Omit<VolunteerApplication, 'id' | 'status'>): Promise<string> {
  const path = 'volunteerApplications';
  const id = `vol-${Date.now()}`;
  
  const cleanApp: VolunteerApplication = {
    id,
    name: app.name.trim(),
    phone: app.phone.trim(),
    islandCity: (app.islandCity || 'މާލެ').trim(),
    track: app.track || 'sisters',
    availability: (app.availability || 'ހަވީރު އަދި ރޭގަނޑު').trim(),
    status: 'pending',
    submittedAt: app.submittedAt || new Date().toISOString().split('T')[0],
    interests: app.interests && Array.isArray(app.interests) && app.interests.length > 0 
      ? app.interests 
      : ['ޢާންމު ވޮލަންޓިއަރ މަސައްކަތް']
  };

  if (app.email && app.email.trim()) cleanApp.email = app.email.trim();
  if (app.notes && app.notes.trim()) cleanApp.notes = app.notes.trim();

  // 1. Infallible Local Persistence
  const currentVolunteers = getStoredVolunteers();
  saveStoredVolunteers([cleanApp, ...currentVolunteers.filter((v) => v.id !== id)]);

  // 2. Try Firestore Cloud persistence
  try {
    const firestorePayload: Record<string, any> = {
      id: cleanApp.id,
      name: cleanApp.name,
      phone: cleanApp.phone,
      islandCity: cleanApp.islandCity,
      track: cleanApp.track,
      availability: cleanApp.availability,
      status: cleanApp.status,
      submittedAt: cleanApp.submittedAt,
      createdAt: new Date().toISOString()
    };
    if (cleanApp.email) firestorePayload.email = cleanApp.email;
    if (cleanApp.notes) firestorePayload.notes = cleanApp.notes;
    if (cleanApp.interests) firestorePayload.interests = cleanApp.interests;

    await setDoc(doc(db, path, id), firestorePayload);
  } catch (error) {
    console.warn('Firestore write warning for volunteer application (persisted locally):', error);
  }

  return id;
}

/**
 * Admin: Save or Update Event
 */
export async function saveEventToFirestore(event: EventItem): Promise<void> {
  const path = `events/${event.id}`;
  try {
    await setDoc(doc(db, 'events', event.id), event, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Admin: Delete Event
 */
export async function deleteEventFromFirestore(id: string): Promise<void> {
  const path = `events/${id}`;
  try {
    await deleteDoc(doc(db, 'events', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Admin: Save or Update Media Item
 */
export async function saveMediaToFirestore(item: MediaItem): Promise<void> {
  const path = `media/${item.id}`;
  try {
    await setDoc(doc(db, 'media', item.id), item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Admin: Delete Media Item
 */
export async function deleteMediaFromFirestore(id: string): Promise<void> {
  const path = `media/${id}`;
  try {
    await deleteDoc(doc(db, 'media', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Admin: Save or Update Program
 */
export async function saveProgramToFirestore(program: ProgramItem): Promise<void> {
  const path = `programs/${program.id}`;
  try {
    await setDoc(doc(db, 'programs', program.id), program, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Admin: Delete Program
 */
export async function deleteProgramFromFirestore(id: string): Promise<void> {
  const path = `programs/${id}`;
  try {
    await deleteDoc(doc(db, 'programs', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Admin: Save or Update Gallery Item
 */
export async function saveGalleryItemToFirestore(item: GalleryItem): Promise<void> {
  const path = `gallery/${item.id}`;
  try {
    await setDoc(doc(db, 'gallery', item.id), item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Admin: Delete Gallery Item
 */
export async function deleteGalleryItemFromFirestore(id: string): Promise<void> {
  const path = `gallery/${id}`;
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Admin: Toggle verification of donation slip
 */
export async function verifyDonationSlipInFirestore(id: string, verified: boolean): Promise<void> {
  // Update local storage
  const currentSlips = getStoredSlips();
  const updatedSlips = currentSlips.map((s) => (s.id === id ? { ...s, verified } : s));
  saveStoredSlips(updatedSlips);

  const path = `donationSlips/${id}`;
  try {
    await setDoc(doc(db, 'donationSlips', id), { verified }, { merge: true });
  } catch (error) {
    console.warn('Firestore write warning for slip verification (updated locally):', error);
  }
}

/**
 * Admin: Delete donation slip
 */
export async function deleteDonationSlipInFirestore(id: string): Promise<void> {
  // Update local storage
  const currentSlips = getStoredSlips();
  const updatedSlips = currentSlips.filter((s) => s.id !== id);
  saveStoredSlips(updatedSlips);

  const path = `donationSlips/${id}`;
  try {
    await deleteDoc(doc(db, 'donationSlips', id));
  } catch (error) {
    console.warn('Firestore write warning for slip deletion (deleted locally):', error);
  }
}

/**
 * Admin: Update volunteer status
 */
export async function updateVolunteerStatusInFirestore(
  id: string,
  status: 'pending' | 'reviewed' | 'contacted'
): Promise<void> {
  // Update local storage
  const currentVolunteers = getStoredVolunteers();
  const updatedVolunteers = currentVolunteers.map((v) => (v.id === id ? { ...v, status } : v));
  saveStoredVolunteers(updatedVolunteers);

  const path = `volunteerApplications/${id}`;
  try {
    await setDoc(doc(db, 'volunteerApplications', id), { status }, { merge: true });
  } catch (error) {
    console.warn('Firestore write warning for volunteer status update (updated locally):', error);
  }
}

/**
 * Admin: Delete volunteer application
 */
export async function deleteVolunteerApplicationInFirestore(id: string): Promise<void> {
  // Update local storage
  const currentVolunteers = getStoredVolunteers();
  const updatedVolunteers = currentVolunteers.filter((v) => v.id !== id);
  saveStoredVolunteers(updatedVolunteers);

  const path = `volunteerApplications/${id}`;
  try {
    await deleteDoc(doc(db, 'volunteerApplications', id));
  } catch (error) {
    console.warn('Firestore write warning for volunteer deletion (deleted locally):', error);
  }
}

/**
 * Admin: Seed Initial Data into Firestore
 */
export async function seedInitialDataToFirestore(): Promise<{
  eventsCount: number;
  mediaCount: number;
  programsCount: number;
  galleryCount: number;
  articlesCount: number;
  authorsCount: number;
}> {
  let eventsCount = 0;
  let mediaCount = 0;
  let programsCount = 0;

  // 1. Seed Events
  for (const ev of INITIAL_EVENTS) {
    await setDoc(doc(db, 'events', ev.id), ev, { merge: true });
    eventsCount++;
  }

  // 2. Seed Media
  for (const m of INITIAL_MEDIA) {
    await setDoc(doc(db, 'media', m.id), m, { merge: true });
    mediaCount++;
  }

  // 3. Seed Programs
  for (const p of PROGRAMS) {
    await setDoc(doc(db, 'programs', p.id), p, { merge: true });
    programsCount++;
  }

  // 4. Seed Gallery
  let galleryCount = 0;
  for (const g of INITIAL_GALLERY) {
    await setDoc(doc(db, 'gallery', g.id), g, { merge: true });
    galleryCount++;
  }

  // 5. Seed Authors
  let authorsCount = 0;
  for (const a of INITIAL_AUTHORS) {
    await setDoc(doc(db, 'authors', a.id), a, { merge: true });
    authorsCount++;
  }

  // 6. Seed Articles
  let articlesCount = 0;
  for (const art of INITIAL_ARTICLES) {
    await setDoc(doc(db, 'articles', art.id), art, { merge: true });
    articlesCount++;
  }

  // 7. Seed site settings
  await setDoc(
    doc(db, 'siteSettings', 'global'),
    {
      ...NGO_CONTACT,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  return { eventsCount, mediaCount, programsCount, galleryCount, articlesCount, authorsCount };
}

/**
 * Realtime subscribe to Published Articles (Public)
 */
export function subscribeToPublishedArticles(
  onData: (articles: ArticleItem[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'articles';
  const colRef = collection(db, colPath);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_ARTICLES);
        return;
      }
      const list: ArticleItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as ArticleItem;
        if (data.status === 'published') {
          list.push({ ...data, id: docSnap.id });
        }
      });
      // Sort newest published first
      list.sort((a, b) => ((b.publishedAt || b.createdAt) > (a.publishedAt || a.createdAt) ? 1 : -1));
      if (list.length === 0) {
        onData(INITIAL_ARTICLES);
      } else {
        onData(list);
      }
    },
    (error) => {
      console.warn('Articles snapshot error, using initial articles:', error);
      onData(INITIAL_ARTICLES);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, colPath);
    }
  );
}

/**
 * Realtime subscribe to All Articles (Admin or Author view)
 */
export function subscribeToAllArticles(
  onData: (articles: ArticleItem[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'articles';
  const colRef = collection(db, colPath);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_ARTICLES);
        return;
      }
      const list: ArticleItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as ArticleItem), id: docSnap.id });
      });
      list.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
      onData(list);
    },
    (error) => {
      console.warn('All articles subscription error, using initial articles:', error);
      onData(INITIAL_ARTICLES);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, colPath);
    }
  );
}

/**
 * Realtime subscribe to Authors list
 */
export function subscribeToAuthors(
  onData: (authors: AuthorProfile[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'authors';
  const colRef = collection(db, colPath);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_AUTHORS);
        return;
      }
      const list: AuthorProfile[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as AuthorProfile), id: docSnap.id });
      });
      onData(list);
    },
    (error) => {
      console.warn('Authors subscription warning:', error);
      onData(INITIAL_AUTHORS);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, colPath);
    }
  );
}

/**
 * Save or update an Article in Firestore
 */
export async function saveArticleToFirestore(article: ArticleItem): Promise<void> {
  const path = `articles/${article.id}`;
  try {
    await setDoc(doc(db, 'articles', article.id), article, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Admin: Approve and Publish an Article
 */
export async function approveAndPublishArticleInFirestore(
  articleId: string,
  adminUid: string,
  customAuthorName?: string
): Promise<void> {
  const path = `articles/${articleId}`;
  try {
    const updatePayload: Record<string, any> = {
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvedBy: adminUid,
      approvedAt: new Date().toISOString()
    };
    if (customAuthorName && customAuthorName.trim().length > 0) {
      updatePayload.authorName = customAuthorName.trim();
    }
    await setDoc(doc(db, 'articles', articleId), updatePayload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Admin: Reject / Send back article for revision
 */
export async function rejectArticleInFirestore(
  articleId: string,
  rejectionReason: string
): Promise<void> {
  const path = `articles/${articleId}`;
  try {
    await setDoc(
      doc(db, 'articles', articleId),
      {
        status: 'rejected',
        rejectionReason,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Delete an Article from Firestore
 */
export async function deleteArticleFromFirestore(articleId: string): Promise<void> {
  const path = `articles/${articleId}`;
  try {
    await deleteDoc(doc(db, 'articles', articleId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Admin: Save or update an Author in Firestore
 */
export async function saveAuthorToFirestore(author: AuthorProfile): Promise<void> {
  const path = `authors/${author.id}`;
  try {
    await setDoc(doc(db, 'authors', author.id), author, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Admin: Delete an Author from Firestore
 */
export async function deleteAuthorFromFirestore(authorId: string): Promise<void> {
  const path = `authors/${authorId}`;
  try {
    await deleteDoc(doc(db, 'authors', authorId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

