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
import { EventItem, MediaItem, ProgramItem, DonationSlip, VolunteerApplication } from '../types';
import {
  INITIAL_EVENTS,
  INITIAL_MEDIA,
  PROGRAMS,
  NGO_CONTACT,
  BANK_ACCOUNTS,
  INITIAL_DONATION_SLIPS,
  INITIAL_VOLUNTEERS
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
        onData(INITIAL_EVENTS);
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
        onData(INITIAL_MEDIA);
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
        onData(PROGRAMS);
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
 * Realtime subscribe to Donation Slips (Admin Only)
 */
export function subscribeToDonationSlips(
  onData: (slips: DonationSlip[]) => void,
  onError?: (err: unknown) => void
) {
  const colPath = 'donationSlips';
  const colRef = collection(db, colPath);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: DonationSlip[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as DonationSlip), id: docSnap.id });
      });
      list.sort((a, b) => (a.date < b.date ? 1 : -1));
      onData(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, colPath);
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
  const colRef = collection(db, colPath);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: VolunteerApplication[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as VolunteerApplication), id: docSnap.id });
      });
      list.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
      onData(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, colPath);
    }
  );
}

/**
 * Submit Donation Slip (Supporter Public Action)
 */
export async function submitDonationSlip(slip: Omit<DonationSlip, 'id' | 'verified'>): Promise<string> {
  const path = 'donationSlips';
  try {
    const id = `slip-${Date.now()}`;
    const payload: DonationSlip = {
      ...slip,
      id,
      verified: false
    };
    await setDoc(doc(db, path, id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

/**
 * Submit Volunteer Application (Public Action)
 */
export async function submitVolunteerApplication(app: Omit<VolunteerApplication, 'id' | 'status'>): Promise<string> {
  const path = 'volunteerApplications';
  try {
    const id = `vol-${Date.now()}`;
    const payload: VolunteerApplication = {
      ...app,
      id,
      status: 'pending'
    };
    await setDoc(doc(db, path, id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
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
 * Admin: Toggle verification of donation slip
 */
export async function verifyDonationSlipInFirestore(id: string, verified: boolean): Promise<void> {
  const path = `donationSlips/${id}`;
  try {
    await setDoc(doc(db, 'donationSlips', id), { verified }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Admin: Delete donation slip
 */
export async function deleteDonationSlipInFirestore(id: string): Promise<void> {
  const path = `donationSlips/${id}`;
  try {
    await deleteDoc(doc(db, 'donationSlips', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Admin: Update volunteer status
 */
export async function updateVolunteerStatusInFirestore(
  id: string,
  status: 'pending' | 'reviewed' | 'contacted'
): Promise<void> {
  const path = `volunteerApplications/${id}`;
  try {
    await setDoc(doc(db, 'volunteerApplications', id), { status }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
}

/**
 * Admin: Seed Initial Data into Firestore
 */
export async function seedInitialDataToFirestore(): Promise<{
  eventsCount: number;
  mediaCount: number;
  programsCount: number;
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

  // 4. Seed site settings
  await setDoc(
    doc(db, 'siteSettings', 'global'),
    {
      ...NGO_CONTACT,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  // 5. Seed sample slips & volunteers for admin test
  for (const slip of INITIAL_DONATION_SLIPS) {
    await setDoc(doc(db, 'donationSlips', slip.id), slip, { merge: true });
  }
  for (const v of INITIAL_VOLUNTEERS) {
    await setDoc(doc(db, 'volunteerApplications', v.id), v, { merge: true });
  }

  return { eventsCount, mediaCount, programsCount };
}
