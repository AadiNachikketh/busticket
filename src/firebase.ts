import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { BookingRecord, IndianCity, UserProfile, formatInr } from './utils/bookingLogic';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Verbatim schema constraints synced from firebase-blueprint.json
export const BLUEPRINT_CONSTRAINTS = {
  idPattern: /^[a-zA-Z0-9_\-]+$/,
  uidMaxLength: 128,
  fullNameMaxLength: 100,
  emailMaxLength: 150,
  phoneMaxLength: 30,
  tierMaxLength: 40,
  membershipNumberMaxLength: 40,
  homeCityMaxLength: 40,
  preferredDietaryMaxLength: 80,
  defaultChauffeurAddressMaxLength: 200,
  pnrMaxLength: 40,
};

function sanitizeString(value: string, minLen: number, maxLen: number, fallback: string): string {
  const trimmed = (value || '').trim();
  const safe = trimmed.length >= minLen ? trimmed : fallback;
  return safe.slice(0, maxLen);
}

/**
 * Ensures the authenticated Google user has a valid UserProfile document in /users/{uid}
 */
export async function ensureFirestoreUserProfile(fbUser: FirebaseUser): Promise<UserProfile> {
  const uid = fbUser.uid;
  const userPath = `users/${uid}`;
  const userRef = doc(db, 'users', uid);

  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: data.uid || uid,
        fullName: data.fullName || fbUser.displayName || 'Aurelia Privé Member',
        email: data.email || fbUser.email || 'member@aureliaoverland.in',
        phone: data.phone || '+91 98201 77420',
        tier: data.tier || 'Sovereign Privé',
        membershipNumber: data.membershipNumber || `AOV-GOOGLE-${uid.slice(0, 6).toUpperCase()}`,
        homeCity: (data.homeCity as IndianCity) || 'Mumbai',
        preferredDietary: data.preferredDietary || 'Marwari Heritage Vegetarian',
        defaultChauffeurAddress:
          data.defaultChauffeurAddress || 'The Oberoi Residences, Nariman Point, Mumbai',
        milesCompletedKm: typeof data.milesCompletedKm === 'number' ? data.milesCompletedKm : 6420,
      };
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
  }

  // Create new profile document adhering strictly to firebase-blueprint.json & firestore.rules
  const newProfile: UserProfile = {
    id: uid,
    fullName: sanitizeString(
      fbUser.displayName || 'Aurelia Privé Member',
      2,
      BLUEPRINT_CONSTRAINTS.fullNameMaxLength,
      'Aurelia Privé Member'
    ),
    email: sanitizeString(
      fbUser.email || 'member@aureliaoverland.in',
      3,
      BLUEPRINT_CONSTRAINTS.emailMaxLength,
      'member@aureliaoverland.in'
    ),
    phone: '+91 98201 77420',
    tier: 'Sovereign Privé',
    membershipNumber: `AOV-G-${uid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()}`,
    homeCity: 'Mumbai',
    preferredDietary: 'Marwari Heritage Vegetarian',
    defaultChauffeurAddress: 'The Oberoi Residences, Nariman Point, Mumbai',
    milesCompletedKm: 6420,
  };

  try {
    await setDoc(userRef, {
      uid: newProfile.id.slice(0, BLUEPRINT_CONSTRAINTS.uidMaxLength),
      fullName: newProfile.fullName,
      email: newProfile.email,
      phone: newProfile.phone,
      tier: newProfile.tier,
      membershipNumber: newProfile.membershipNumber,
      homeCity: newProfile.homeCity,
      preferredDietary: newProfile.preferredDietary,
      defaultChauffeurAddress: newProfile.defaultChauffeurAddress,
      milesCompletedKm: newProfile.milesCompletedKm,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, userPath);
  }

  return newProfile;
}

/**
 * Triggers Google OAuth sign-in popup and syncs UserProfile in Firestore
 */
export async function signInWithGooglePopup(): Promise<UserProfile> {
  const credential = await signInWithPopup(auth, googleProvider);
  return ensureFirestoreUserProfile(credential.user);
}

/**
 * Signs out of Firebase Auth
 */
export async function signOutFirebaseUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Updates mutable profile fields in /users/{uid} adhering strictly to affectedKeys().hasOnly()
 */
export async function updateFirestoreUserProfile(updated: UserProfile): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== updated.id) {
    return;
  }
  const userPath = `users/${updated.id}`;
  const userRef = doc(db, 'users', updated.id);
  try {
    await updateDoc(userRef, {
      fullName: sanitizeString(
        updated.fullName,
        2,
        BLUEPRINT_CONSTRAINTS.fullNameMaxLength,
        'Aurelia Member'
      ),
      phone: sanitizeString(
        updated.phone,
        6,
        BLUEPRINT_CONSTRAINTS.phoneMaxLength,
        '+91 98201 77420'
      ),
      homeCity: sanitizeString(
        updated.homeCity,
        2,
        BLUEPRINT_CONSTRAINTS.homeCityMaxLength,
        'Mumbai'
      ),
      preferredDietary: sanitizeString(
        updated.preferredDietary,
        2,
        BLUEPRINT_CONSTRAINTS.preferredDietaryMaxLength,
        'Marwari Heritage Vegetarian'
      ),
      defaultChauffeurAddress: sanitizeString(
        updated.defaultChauffeurAddress,
        2,
        BLUEPRINT_CONSTRAINTS.defaultChauffeurAddressMaxLength,
        'Terminal Pavilion Pickup'
      ),
      milesCompletedKm: Math.min(Math.max(0, updated.milesCompletedKm), 1000000),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}

/**
 * Persists a newly confirmed booking into /bookings/{pnr} when signed in with Google
 */
export async function createFirestoreBooking(booking: BookingRecord): Promise<void> {
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;
  const safePnr = booking.pnr.replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, BLUEPRINT_CONSTRAINTS.pnrMaxLength);
  const bookingPath = `bookings/${safePnr}`;
  const bookingRef = doc(db, 'bookings', safePnr);

  try {
    await setDoc(bookingRef, {
      pnr: safePnr,
      userId: uid,
      transactionId: sanitizeString(booking.transactionId, 4, 60, 'TXN-INR-1001'),
      coachId: sanitizeString(booking.coachId, 2, 60, 'route-bom-udr-01'),
      coachName: sanitizeString(booking.coachName, 2, 100, 'Aurelia Luxury Coach'),
      coachCode: sanitizeString(booking.coachCode, 2, 30, 'AO-101'),
      origin: sanitizeString(booking.origin, 2, 50, 'Mumbai'),
      destination: sanitizeString(booking.destination, 2, 50, 'Udaipur'),
      originTerminal: sanitizeString(booking.originTerminal, 2, 120, 'Main Terminal'),
      destinationTerminal: sanitizeString(booking.destinationTerminal, 2, 120, 'Arrival Terminal'),
      travelDate: sanitizeString(booking.travelDate, 4, 30, '2026-10-24'),
      departureTime: sanitizeString(booking.departureTime, 2, 20, '19:30'),
      arrivalTime: sanitizeString(booking.arrivalTime, 2, 20, '08:15'),
      selectedSeats: booking.selectedSeats.slice(0, 4).map((s) => String(s).slice(0, 10)),
      passengerName: sanitizeString(booking.passengerName, 2, 100, 'Aurelia Passenger'),
      passengerEmail: sanitizeString(booking.passengerEmail, 3, 150, 'passenger@aureliaoverland.in'),
      passengerPhone: sanitizeString(booking.passengerPhone, 6, 30, '+91 98201 77420'),
      dietaryPreference: sanitizeString(
        booking.dietaryPreference,
        2,
        80,
        'Marwari Heritage Vegetarian'
      ),
      chauffeurPickup: sanitizeString(
        booking.chauffeurPickup,
        2,
        200,
        'Terminal Lounge Boarding'
      ),
      paymentMethodLabel: sanitizeString(booking.paymentMethodLabel, 2, 80, 'UPI Instant'),
      totalInr: Math.min(Math.max(500, booking.fare.totalInr), 500000),
      status: 'Confirmed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, bookingPath);
  }
}

/**
 * Transitions a booking in /bookings/{pnr} from 'Confirmed' to 'Cancelled'
 */
export async function cancelFirestoreBooking(pnr: string): Promise<void> {
  if (!auth.currentUser) return;
  const safePnr = pnr.replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, BLUEPRINT_CONSTRAINTS.pnrMaxLength);
  const bookingPath = `bookings/${safePnr}`;
  const bookingRef = doc(db, 'bookings', safePnr);

  try {
    const snap = await getDoc(bookingRef);
    if (!snap.exists()) return;
    await updateDoc(bookingRef, {
      status: 'Cancelled',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, bookingPath);
  }
}

/**
 * Subscribes to authenticated user's bookings in /bookings where userId == uid
 */
export function subscribeToUserBookings(
  uid: string,
  onUpdate: (bookings: BookingRecord[]) => void
): Unsubscribe {
  const bookingsQuery = query(collection(db, 'bookings'), where('userId', '==', uid));
  return onSnapshot(
    bookingsQuery,
    (snapshot) => {
      const loaded: BookingRecord[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        const totalInr = typeof d.totalInr === 'number' ? d.totalInr : 1299;
        const seats = Array.isArray(d.selectedSeats) ? d.selectedSeats : ['L1A'];
        return {
          pnr: d.pnr || docSnap.id,
          transactionId: d.transactionId || 'TXN-INR-9901',
          coachId: d.coachId || 'route-bom-udr-01',
          coachName: d.coachName || 'The Mewar Sovereign Express',
          coachCode: d.coachCode || 'AO-101',
          origin: d.origin || 'Mumbai',
          destination: d.destination || 'Udaipur',
          originTerminal: d.originTerminal || 'Worli Seaface Private Pavilion',
          destinationTerminal: d.destinationTerminal || 'Pichola Lakefront Arrival Salon',
          travelDate: d.travelDate || '2026-10-24',
          departureTime: d.departureTime || '19:30',
          arrivalTime: d.arrivalTime || '08:15',
          selectedSeats: seats,
          passengerName: d.passengerName || 'Aurelia Passenger',
          passengerEmail: d.passengerEmail || 'passenger@aureliaoverland.in',
          passengerPhone: d.passengerPhone || '+91 98201 77420',
          dietaryPreference: d.dietaryPreference || 'Marwari Heritage Vegetarian',
          chauffeurPickup: d.chauffeurPickup || 'Terminal Lounge Boarding',
          paymentMethodLabel: d.paymentMethodLabel || 'UPI Instant',
          fare: {
            seatCount: seats.length,
            subtotalInr: Math.round(totalInr * 0.9),
            loungeConciergeInr: 99 * seats.length,
            memberDiscountInr: 0,
            gstInr: Math.round(totalInr * 0.05),
            totalInr,
          },
          status: d.status || 'Confirmed',
          createdAtIso: new Date().toISOString(),
          emailDispatchLog: {
            recipient: d.passengerEmail || 'passenger@aureliaoverland.in',
            subject: `Confirmed Bus E-Ticket ${d.pnr || docSnap.id} · ${d.origin} to ${d.destination} (${d.coachName})`,
            dispatchedAt: 'Instant Cloud Sync',
            messageId: `<${(d.pnr || docSnap.id).toLowerCase()}@dispatch.aureliaoverland.in>`,
            bodyPreview: [
              `Dear ${d.passengerName},`,
              `Your luxury sleeper reservation aboard ${d.coachName} (${d.coachCode}) is ${d.status}.`,
              `Corridor: ${d.origin} (${d.originTerminal}) → ${d.destination} (${d.destinationTerminal})`,
              `Departure: ${d.travelDate} at ${d.departureTime} IST · Berths Assigned: ${seats.join(', ')}`,
              `Settlement: ${formatInr(totalInr)} (incl. 5% GST) via ${d.paymentMethodLabel} · Ref: ${d.transactionId}`,
            ].join('\n'),
          },
        };
      });
      onUpdate(loaded);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
    }
  );
}

export { onAuthStateChanged };
