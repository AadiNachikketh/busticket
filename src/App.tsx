/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AppointmentRequest,
  BookingRecord,
  INITIAL_BLOG_POSTS,
  INITIAL_LUXURY_ROUTES,
  INITIAL_REVIEWS,
  LuxuryCoachRoute,
  PassengerReview,
  SuiteSeat,
  UserProfile,
  calculateFareBreakdown,
  filterCoachRoutes,
  formatInr,
  toggleSeatSelection,
} from './utils/bookingLogic';
import {
  HeroMotorcoachIllustration,
  RouteScenicBanner,
  SuiteCutawayIllustration,
} from './components/ArchitecturalVisuals';
import { SeatBookingWorkspace } from './components/SeatBookingWorkspace';
import { MemberPortal } from './components/MemberPortal';
import { ServicesAndAppointmentsView } from './components/ServicesAndAppointmentsView';
import { BlogJournalView } from './components/BlogJournalView';
import { ReviewsAndMapsView } from './components/ReviewsAndMapsView';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView';
import {
  auth,
  onAuthStateChanged,
  ensureFirestoreUserProfile,
  signInWithGooglePopup,
  signOutFirebaseUser,
  updateFirestoreUserProfile,
  createFirestoreBooking,
  cancelFirestoreBooking,
  subscribeToUserBookings,
} from './firebase';
import { ArrowRight, PhoneCall, MessageSquare, CheckCircle2, X, Sparkles } from 'lucide-react';

export type AppPage = 'booking' | 'services' | 'blog' | 'reviews-maps' | 'analytics' | 'portal';

const INITIAL_HISTORICAL_BOOKINGS: BookingRecord[] = [
  {
    pnr: 'AOV-DEL619042',
    transactionId: 'TXN-INR-619042-99',
    coachId: 'route-del-jai-02',
    coachName: 'The Rajputana Imperial Salon',
    coachCode: 'AO-204',
    origin: 'New Delhi',
    destination: 'Jaipur',
    originTerminal: 'Chanakyapuri Diplomatic Concourse',
    destinationTerminal: 'Rambagh Polo Club Salon',
    travelDate: '2026-09-14',
    departureTime: '17:00',
    arrivalTime: '21:30',
    selectedSeats: ['L1B', 'L2B'],
    passengerName: 'Vikramaditya Singhania',
    passengerEmail: 'vikramaditya.singhania@oberoicapital.in',
    passengerPhone: '+91 98201 77420',
    dietaryPreference: 'Marwari Heritage Vegetarian',
    chauffeurPickup: 'Amrita Shergill Marg, Lutyens Delhi',
    paymentMethodLabel: 'Card •••• 9184',
    fare: {
      seatCount: 2,
      subtotalInr: 2398,
      loungeConciergeInr: 198,
      memberDiscountInr: 240,
      gstInr: 118,
      totalInr: 2474,
    },
    status: 'Completed',
    createdAtIso: '2026-09-10T11:20:00.000Z',
    emailDispatchLog: {
      recipient: 'vikramaditya.singhania@oberoicapital.in',
      subject:
        'Confirmed Bus E-Ticket AOV-DEL619042 · New Delhi to Jaipur (The Rajputana Imperial Salon)',
      dispatchedAt: '16:52 IST',
      messageId: '<aov-del619042@dispatch.aureliaoverland.in>',
      bodyPreview: [
        'Dear Vikramaditya Singhania,',
        'Your luxury sleeper reservation aboard The Rajputana Imperial Salon (AO-204) is confirmed.',
        'Corridor: New Delhi (Chanakyapuri Diplomatic Concourse) → Jaipur (Rambagh Polo Club Salon)',
        'Departure: 2026-09-14 at 17:00 IST · Berths Assigned: L1B, L2B',
        'Settlement: ₹2,474 (incl. 5% GST) via Card •••• 9184 · Ref: TXN-INR-619042-99',
      ].join('\n'),
    },
  },
  {
    pnr: 'AOV-BOM408219',
    transactionId: 'TXN-INR-408219-99',
    coachId: 'route-bom-goi-03',
    coachName: 'The Konkan Coast Sanctuary',
    coachCode: 'AO-308',
    origin: 'Mumbai',
    destination: 'Goa',
    originTerminal: 'Worli Seaface Private Pavilion',
    destinationTerminal: 'Assagao Estate Arrival Courtyard',
    travelDate: '2026-10-02',
    departureTime: '21:00',
    arrivalTime: '07:30',
    selectedSeats: ['U1A'],
    passengerName: 'Vikramaditya Singhania',
    passengerEmail: 'vikramaditya.singhania@oberoicapital.in',
    passengerPhone: '+91 98201 77420',
    dietaryPreference: 'Marwari Heritage Vegetarian',
    chauffeurPickup: 'The Oberoi Residences, Nariman Point, Mumbai',
    paymentMethodLabel: 'UPI Instant (vikramaditya@okhdfcbank)',
    fare: {
      seatCount: 1,
      subtotalInr: 1299,
      loungeConciergeInr: 99,
      memberDiscountInr: 130,
      gstInr: 63,
      totalInr: 1331,
    },
    status: 'Completed',
    createdAtIso: '2026-09-29T14:10:00.000Z',
    emailDispatchLog: {
      recipient: 'vikramaditya.singhania@oberoicapital.in',
      subject:
        'Confirmed Bus E-Ticket AOV-BOM408219 · Mumbai to Goa (The Konkan Coast Sanctuary)',
      dispatchedAt: '19:40 IST',
      messageId: '<aov-bom408219@dispatch.aureliaoverland.in>',
      bodyPreview: [
        'Dear Vikramaditya Singhania,',
        'Your luxury sleeper reservation aboard The Konkan Coast Sanctuary (AO-308) is confirmed.',
        'Corridor: Mumbai (Worli Seaface Private Pavilion) → Goa (Assagao Estate Arrival Courtyard)',
        'Departure: 2026-10-02 at 21:00 IST · Berth Assigned: U1A',
        'Settlement: ₹1,331 (incl. 5% GST) via UPI Instant (vikramaditya@okhdfcbank) · Ref: TXN-INR-408219-99',
      ].join('\n'),
    },
  },
];

const INITIAL_APPOINTMENTS: AppointmentRequest[] = [
  {
    id: 'APT-4810',
    clientName: 'Maharani Padmini Kumari',
    clientPhone: '+91 98290 11200',
    clientEmail: 'padmini@jaipurheritage.in',
    terminalCity: 'Jaipur',
    serviceType: 'Royal Wedding Fleet Charter',
    preferredDate: '2026-11-04',
    preferredTime: '15:00',
    notes: 'Chartering 4 coaches for Jaipur–Udaipur royal wedding procession.',
    status: 'Confirmed',
  },
];

export default function App() {
  const [activePage, setActivePage] = useState<AppPage>('booking');
  const [routes, setRoutes] = useState<LuxuryCoachRoute[]>(INITIAL_LUXURY_ROUTES);

  // Search filter state
  const [originFilter, setOriginFilter] = useState<string>('All');
  const [destinationFilter, setDestinationFilter] = useState<string>('All');
  const [classFilter, setClassFilter] = useState<string>('All');
  const [travelDate, setTravelDate] = useState<string>('2026-10-24');

  // Selected coach & synced seat selection
  const [selectedRouteId, setSelectedRouteId] = useState<string>(INITIAL_LUXURY_ROUTES[0].id);
  const [syncedSelectedSeats, setSyncedSelectedSeats] = useState<string[] | null>(null);

  // Interactive Quick Bus & Seat Selector Modal (Opened by Hero CTA Button)
  const [isQuickPickerOpen, setIsQuickPickerOpen] = useState<boolean>(false);
  const [modalDeck, setModalDeck] = useState<'lower' | 'upper'>('lower');
  const [modalSelectedSeats, setModalSelectedSeats] = useState<string[]>(['L1A']);
  const [modalSeatError, setModalSeatError] = useState<string | null>(null);

  // User authentication, bookings, reviews & appointments
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_HISTORICAL_BOOKINGS);
  const [reviews, setReviews] = useState<PassengerReview[]>(INITIAL_REVIEWS);
  const [appointments, setAppointments] = useState<AppointmentRequest[]>(INITIAL_APPOINTMENTS);

  // Listen for Firebase Google Authentication state & real-time Firestore bookings
  useEffect(() => {
    let unsubBookings: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (unsubBookings) {
        unsubBookings();
        unsubBookings = null;
      }

      if (fbUser) {
        try {
          const profile = await ensureFirestoreUserProfile(fbUser);
          setUser(profile);
          unsubBookings = subscribeToUserBookings(fbUser.uid, (cloudBookings) => {
            if (cloudBookings.length > 0) {
              const cloudPnrs = new Set(cloudBookings.map((b) => b.pnr));
              const merged = [
                ...cloudBookings,
                ...INITIAL_HISTORICAL_BOOKINGS.filter((b) => !cloudPnrs.has(b.pnr)),
              ];
              setBookings(merged);
            }
          });
        } catch (err) {
          console.error('Error syncing authenticated Google profile:', err);
        }
      }
    });

    return () => {
      unsubAuth();
      if (unsubBookings) unsubBookings();
    };
  }, []);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const profile = await signInWithGooglePopup();
      setUser(profile);
      setActivePage('portal');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLogout = async () => {
    if (auth.currentUser) {
      await signOutFirebaseUser();
    }
    setUser(null);
  };

  const handleUpdateProfile = async (updated: UserProfile) => {
    setUser(updated);
    if (auth.currentUser && auth.currentUser.uid === updated.id) {
      await updateFirestoreUserProfile(updated);
    }
  };

  const filteredRoutes = filterCoachRoutes(routes, originFilter, destinationFilter, classFilter);
  const activeRoute =
    routes.find((r) => r.id === selectedRouteId) ||
    filteredRoutes[0] ||
    routes[0];

  const handleOpenQuickSeatModal = (preselectSeatId?: string) => {
    const avail = activeRoute.seats.find((s) => s.status === 'available');
    const targetSeat = preselectSeatId
      ? activeRoute.seats.find((s) => s.id === preselectSeatId && s.status !== 'occupied')
      : avail;
    const initialSeatId = targetSeat ? targetSeat.id : avail ? avail.id : 'L1A';
    setModalSelectedSeats([initialSeatId]);
    setModalDeck(initialSeatId.startsWith('U') ? 'upper' : 'lower');
    setModalSeatError(null);
    setIsQuickPickerOpen(true);
  };

  const handleModalRouteChange = (newRouteId: string) => {
    setSelectedRouteId(newRouteId);
    const nextRoute = routes.find((r) => r.id === newRouteId) || routes[0];
    const firstAvail = nextRoute.seats.find((s) => s.status === 'available');
    setModalSelectedSeats(firstAvail ? [firstAvail.id] : []);
    setModalSeatError(null);
  };

  const handleModalSeatClick = (seat: SuiteSeat) => {
    setModalSeatError(null);
    const res = toggleSeatSelection(modalSelectedSeats, seat, 4);
    if (res.error) {
      setModalSeatError(res.error);
    } else {
      setModalSelectedSeats(res.selected);
    }
  };

  const handleConfirmModalSelection = () => {
    if (modalSelectedSeats.length === 0) {
      setModalSeatError('Please select at least 1 available berth to continue.');
      return;
    }
    setSyncedSelectedSeats([...modalSelectedSeats]);
    setIsQuickPickerOpen(false);
    setTimeout(() => {
      const el = document.getElementById('seat-booking-workspace');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  const handleSelectRouteForSeatMap = (routeId: string) => {
    setSelectedRouteId(routeId);
    setActivePage('booking');
    setTimeout(() => {
      const el = document.getElementById('seat-booking-workspace');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 30);
  };

  const handleBookingConfirmed = (newRecord: BookingRecord) => {
    setRoutes((prevRoutes) =>
      prevRoutes.map((r) => {
        if (r.id !== newRecord.coachId) return r;
        return {
          ...r,
          seats: r.seats.map((s) =>
            newRecord.selectedSeats.includes(s.id) ? { ...s, status: 'occupied' } : s
          ),
        };
      })
    );
    setBookings((prev) => [newRecord, ...prev]);
    if (auth.currentUser) {
      createFirestoreBooking(newRecord).catch((err) =>
        console.error('Failed to persist booking to Firestore:', err)
      );
    }
  };

  const handleCancelBooking = (pnr: string) => {
    const target = bookings.find((b) => b.pnr === pnr);
    setBookings((prev) =>
      prev.map((b) => (b.pnr === pnr ? { ...b, status: 'Cancelled' } : b))
    );
    if (target) {
      setRoutes((prevRoutes) =>
        prevRoutes.map((r) => {
          if (r.id !== target.coachId) return r;
          return {
            ...r,
            seats: r.seats.map((s) =>
              target.selectedSeats.includes(s.id) ? { ...s, status: 'available' } : s
            ),
          };
        })
      );
    }
    if (auth.currentUser) {
      cancelFirestoreBooking(pnr).catch((err) =>
        console.error('Failed to cancel booking in Firestore:', err)
      );
    }
  };

  const switchPage = (page: AppPage) => {
    setActivePage(page);
    window.scrollTo(0, 0);
  };

  const modalFare = calculateFareBreakdown(
    activeRoute.seats,
    modalSelectedSeats,
    Boolean(user)
  );
  const modalDisplayedSeats = activeRoute.seats.filter((s) => s.deck === modalDeck);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Strictly Compliant 3-Zone Top Bar Contract (Compact <56px on Mobile for 15% Sticky Cap, Balanced on Tablet 768px) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5 sm:py-3.5 shadow-2xs">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3 sm:gap-6 lg:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              switchPage('booking');
            }}
            className="font-display text-xl sm:text-2xl font-bold tracking-tight text-blue-950 whitespace-nowrap shrink-0"
          >
            Aurelia Overland
          </a>

          {/* Zone 2: 5 concise single-line text navigation links (Tablet md: & Desktop lg: optimized spacing) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-3.5 lg:gap-6 text-xs lg:text-sm font-semibold text-slate-600"
          >
            <a
              href="#booking"
              onClick={(e) => {
                e.preventDefault();
                switchPage('booking');
              }}
              className={`py-1.5 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'booking'
                  ? 'text-blue-700 font-bold underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Book Journey
            </a>
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                switchPage('services');
              }}
              className={`py-1.5 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'services'
                  ? 'text-blue-700 font-bold underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Services
            </a>
            <a
              href="#blog"
              onClick={(e) => {
                e.preventDefault();
                switchPage('blog');
              }}
              className={`py-1.5 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'blog'
                  ? 'text-blue-700 font-bold underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Blog
            </a>
            <a
              href="#reviews-maps"
              onClick={(e) => {
                e.preventDefault();
                switchPage('reviews-maps');
              }}
              className={`py-1.5 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'reviews-maps'
                  ? 'text-blue-700 font-bold underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Reviews & Maps
            </a>
            <a
              href="#analytics"
              onClick={(e) => {
                e.preventDefault();
                switchPage('analytics');
              }}
              className={`py-1.5 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 ${
                activePage === 'analytics'
                  ? 'text-blue-700 font-bold underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Analytics
            </a>
          </nav>

          {/* Zone 3: 1 primary action (44px min touch height on mobile/tablet) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => switchPage('portal')}
              className="min-h-[40px] sm:min-h-[42px] px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {user ? `Privé · ${user.fullName.split(' ')[0]}` : 'Sign In / Google Login'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Bar (Non-sticky in document flow, 44px touch targets, smooth horizontal scroll) */}
      <div className="md:hidden bg-blue-50/90 border-b border-blue-100 px-3 py-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5">
          {(
            [
              ['booking', 'Book Journey'],
              ['services', 'Services'],
              ['blog', 'Blog'],
              ['reviews-maps', 'Reviews & Maps'],
              ['analytics', 'Analytics'],
              ['portal', 'Google Login / Portal'],
            ] as const
          ).map(([pageKey, label]) => (
            <button
              key={pageKey}
              type="button"
              onClick={() => switchPage(pageKey)}
              className={`min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                activePage === pageKey
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white/80 text-slate-700 hover:text-blue-700 border border-blue-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <main id="top" className="flex-1">
        {activePage === 'portal' && (
          <MemberPortal
            user={user}
            onLoginSuccess={(profile) => setUser(profile)}
            onGoogleLogin={handleGoogleLogin}
            isGoogleLoading={isGoogleLoading}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onBookNewRoute={() => switchPage('booking')}
          />
        )}

        {activePage === 'services' && (
          <ServicesAndAppointmentsView
            appointments={appointments}
            onCreateAppointment={(apt) => setAppointments((prev) => [apt, ...prev])}
            onNavigateToBooking={() => switchPage('booking')}
          />
        )}

        {activePage === 'blog' && (
          <BlogJournalView
            posts={INITIAL_BLOG_POSTS}
            onNavigateToBooking={() => switchPage('booking')}
          />
        )}

        {activePage === 'reviews-maps' && (
          <ReviewsAndMapsView
            reviews={reviews}
            onAddReview={(rev) => setReviews((prev) => [rev, ...prev])}
          />
        )}

        {activePage === 'analytics' && (
          <AnalyticsDashboardView
            routes={routes}
            bookings={bookings}
            reviews={reviews}
            onSelectCorridorToBook={(routeId) => handleSelectRouteForSeatMap(routeId)}
          />
        )}

        {activePage === 'booking' && (
          <>
            {/* Section 1: Hero Proposition + Attractive Interactive Coach Showcase */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-5 sm:pt-8 pb-8 sm:pb-10 space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                {/* Left 6 Cols: Editorial Luxury Proposition */}
                <div className="lg:col-span-6 flex flex-col justify-between py-1 sm:py-2 space-y-5 sm:space-y-6">
                  <div className="space-y-3.5 sm:space-y-4">
                    <div className="flex flex-wrap items-center gap-y-1 text-xs font-bold text-blue-700 uppercase tracking-wider">
                      <span>Luxury AC Sleeper Buses</span>
                      <span className="mx-2" aria-hidden="true">·</span>
                      <span className="text-emerald-700">Tickets from ₹899</span>
                      <span className="mx-2" aria-hidden="true">·</span>
                      <span className="text-amber-600">4.9 / 5.0 Google Verified</span>
                    </div>

                    <h1
                      className="font-display font-bold tracking-tight text-slate-900 leading-[1.08]"
                      style={{
                        fontSize: 'clamp(2rem, 3.8vw, 3.5rem)',
                        textWrap: 'balance',
                      }}
                    >
                      Luxury Private Sleeper Buses Across India Starting at Just ₹899.
                    </h1>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-[62ch]">
                      Travel between Mumbai, New Delhi, Jaipur, Udaipur, Bengaluru, Goa, Hyderabad,
                      and Mysuru aboard custom Volvo 9600 multi-axle sleeper coaches. Enjoy 200 cm
                      flat quilted berths, complimentary hot meal boxes, Google Account sign-in,
                      Google reCAPTCHA ticket protection, and instant email E-Tickets.
                    </p>
                  </div>

                  {/* Primary Action (CSS Selector 1) + Direct WhatsApp & Call Actions */}
                  <div className="pt-1 sm:pt-2 space-y-5 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenQuickSeatModal()}
                        className="min-h-[48px] px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-sm font-bold rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>Select Suite & Book Seat</span>
                        <ArrowRight className="w-4 h-4 text-amber-300" aria-hidden="true" />
                      </button>

                      <a
                        href="https://wa.me/919820177420?text=Hello%20Aurelia%20Overland%20Concierge%2C%20I%20would%20like%20to%20book%20a%20private%20suite."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[46px] px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                      >
                        <MessageSquare className="w-4 h-4" aria-hidden="true" />
                        <span>WhatsApp Concierge</span>
                      </a>

                      <a
                        href="tel:+912268491100"
                        className="min-h-[46px] px-4 py-3 bg-white hover:bg-blue-50 text-slate-900 text-xs font-bold rounded-xl border-2 border-slate-200 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                      >
                        <PhoneCall className="w-4 h-4 text-blue-600" aria-hidden="true" />
                        <span>Call +91 22 6849 1100</span>
                      </a>
                    </div>

                    {/* Quantitative Proof Strip Adjacent to Hero Claim (1-col on narrow mobile, 3-col on tablet/desktop) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-4 sm:pt-5 border-t border-slate-200 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs flex sm:block items-center justify-between gap-2">
                        <p className="font-mono text-base sm:text-lg font-extrabold text-blue-700 tabular-nums whitespace-nowrap">
                          ₹899 – ₹1,499
                        </p>
                        <p className="text-slate-600 sm:mt-0.5 text-right sm:text-left">
                          Affordable all-inclusive AC sleeper bus fares
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs flex sm:block items-center justify-between gap-2">
                        <p className="font-mono text-base sm:text-lg font-extrabold text-emerald-700 tabular-nums whitespace-nowrap">
                          99.4% On-Time
                        </p>
                        <p className="text-slate-600 sm:mt-0.5 text-right sm:text-left">
                          Verified GPS expressway departures across 10 cities
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-2xs flex sm:block items-center justify-between gap-2">
                        <p className="font-mono text-base sm:text-lg font-extrabold text-amber-600 tabular-nums whitespace-nowrap">
                          4.9 / 5.0 Google
                        </p>
                        <p className="text-slate-600 sm:mt-0.5 text-right sm:text-left">
                          Google Login + reCAPTCHA v2 anti-bot guard
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 6 Cols: Attractive Interactive Coach & Suite Visual Showcase */}
                <div className="lg:col-span-6 flex">
                  <HeroMotorcoachIllustration
                    onQuickSelectSeat={(seatId) => handleOpenQuickSeatModal(seatId)}
                  />
                </div>
              </div>

              {/* Full-Width Interactive Corridor Search & Filter Strip (Mobile 1-col, Tablet 2-col, Desktop 5-col) */}
              <div
                id="corridors-booking"
                className="bg-white rounded-2xl border-2 border-blue-100 p-4 sm:p-6 shadow-sm"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 items-end">
                  <div>
                    <label
                      htmlFor="filter-origin"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      Origin Indian City
                    </label>
                    <select
                      id="filter-origin"
                      value={originFilter}
                      onChange={(e) => setOriginFilter(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm font-medium bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600"
                    >
                      <option value="All">All Origin Cities (10)</option>
                      {Array.from(new Set(routes.map((r) => r.origin))).map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="filter-dest"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      Destination Indian City
                    </label>
                    <select
                      id="filter-dest"
                      value={destinationFilter}
                      onChange={(e) => setDestinationFilter(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm font-medium bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600"
                    >
                      <option value="All">All Destination Cities</option>
                      {Array.from(new Set(routes.map((r) => r.destination))).map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="filter-date"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      Departure Date
                    </label>
                    <input
                      id="filter-date"
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="filter-class"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      Bus Sleeper Class
                    </label>
                    <select
                      id="filter-class"
                      value={classFilter}
                      onChange={(e) => setClassFilter(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm font-medium bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600"
                    >
                      <option value="All">All Sleeper Classes</option>
                      <option value="Sovereign First Class">Sovereign First Class</option>
                      <option value="Royal Sleeper Residence">Royal Sleeper Residence</option>
                      <option value="Deccan Grand Salon">Deccan Grand Salon</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <button
                      type="button"
                      onClick={() => {
                        setOriginFilter('All');
                        setDestinationFilter('All');
                        setClassFilter('All');
                      }}
                      className="w-full min-h-[44px] py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-xl border border-blue-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Reset Filters ({filteredRoutes.length} Buses)
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Luxury Intercity Departures & Real-Time Seat Selection Workspace */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">
              {/* div:nth-of-type(1) */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                    01. Scheduled Intercity Luxury Sleeper Buses
                  </p>
                  <h2 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
                    Select Your Bus Route & Sleeper Berth
                  </h2>
                </div>
                <p className="text-xs font-medium text-slate-600">
                  Showing <span className="font-mono font-bold text-blue-700">{filteredRoutes.length}</span>{' '}
                  daily luxury buses · Affordable fares from ₹899
                </p>
              </div>

              {/* div:nth-of-type(2) — Responsive Coach Schedule Grid (1-col Mobile, 2-col Tablet md:, 3-col Desktop lg:) */}
              {filteredRoutes.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
                  <p className="text-base font-bold text-slate-900">
                    No direct coach departures match that exact origin/destination pair.
                  </p>
                  <p className="text-xs text-slate-600">
                    Reset the route filter to inspect all 6 flagship Indian intercity corridors.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOriginFilter('All');
                      setDestinationFilter('All');
                      setClassFilter('All');
                    }}
                    className="min-h-[44px] px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Show All 6 Luxury Bus Routes
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {filteredRoutes.map((route) => {
                    const availCount = route.seats.filter((s) => s.status !== 'occupied').length;
                    const isCurrent = route.id === activeRoute.id;

                    return (
                      <article
                        key={route.id}
                        className={`rounded-2xl border-2 p-4 sm:p-5 flex flex-col justify-between transition-all ${
                          isCurrent
                            ? 'bg-gradient-to-b from-blue-950 to-slate-900 text-white border-blue-500 shadow-xl ring-2 ring-blue-300'
                            : 'bg-white text-slate-900 border-slate-200 hover:border-blue-500 shadow-xs'
                        }`}
                      >
                        <div className="space-y-3.5 sm:space-y-4">
                          {/* Attractive Colorful Corridor Visual Banner */}
                          <RouteScenicBanner
                            routeId={route.id}
                            origin={route.origin}
                            destination={route.destination}
                            coachCode={route.coachCode}
                            baseFareInr={route.baseFareInr}
                          />

                          <div
                            className={`text-xs font-semibold flex items-center justify-between ${
                              isCurrent ? 'text-sky-200' : 'text-blue-700'
                            }`}
                          >
                            <span>{route.coachClass}</span>
                            <span className="font-mono tabular-nums">{route.duration}</span>
                          </div>

                          <div>
                            <h3 className="font-display text-2xl font-bold">
                              {route.origin} to {route.destination}
                            </h3>
                            <p
                              className={`text-xs font-medium mt-0.5 ${
                                isCurrent ? 'text-amber-300' : 'text-emerald-700'
                              }`}
                            >
                              {route.coachName}
                            </p>
                          </div>

                          <div
                            className={`text-xs space-y-1.5 pt-3 border-t ${
                              isCurrent
                                ? 'border-slate-700 text-slate-200'
                                : 'border-slate-100 text-slate-600'
                            }`}
                          >
                            <p className="font-mono font-semibold tabular-nums">
                              Departs {route.departureTime} IST · Arrives {route.arrivalTime} IST (
                              {route.distanceKm} km)
                            </p>
                            <p>
                              {route.originTerminal} → {route.destinationTerminal}
                            </p>
                            <p
                              className={`pt-1 font-medium ${
                                isCurrent ? 'text-emerald-300' : 'text-slate-700'
                              }`}
                            >
                              Included: {route.culinaryMenu}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`mt-5 pt-4 border-t flex items-center justify-between gap-3 ${
                            isCurrent ? 'border-slate-700' : 'border-slate-100'
                          }`}
                        >
                          <div>
                            <span
                              className={`block text-[11px] font-semibold ${
                                isCurrent ? 'text-emerald-300' : 'text-emerald-700'
                              }`}
                            >
                              {availCount} Berths Available
                            </span>
                            <span className="font-mono text-xl font-extrabold tabular-nums">
                              {formatInr(route.baseFareInr)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectRouteForSeatMap(route.id)}
                            className={`min-h-[42px] px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                              isCurrent
                                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-xs'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                            }`}
                          >
                            {isCurrent ? 'Selected on Seat Map' : 'Select Bus & Seats'}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* div#seat-booking-workspace:nth-of-type(3) — Contiguous Real-Time Seat Selection & Checkout Module */}
              <SeatBookingWorkspace
                route={activeRoute}
                allRoutes={routes}
                onChangeRoute={(routeId) => setSelectedRouteId(routeId)}
                externalSelectedSeats={syncedSelectedSeats}
                travelDate={travelDate}
                user={user}
                onBookingConfirmed={handleBookingConfirmed}
                onViewMemberTrips={() => switchPage('portal')}
              />
            </section>

            {/* Section 3: Private Fleet Architecture & Premium Online Presence Highlights */}
            <section
              id="private-fleet"
              className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8 sm:space-y-10 border-t border-slate-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6">
                <div className="max-w-2xl space-y-2">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                    02. Luxury Sleeper Cabin Gallery & Amenities
                  </p>
                  <h2 className="font-display text-2xl sm:text-4xl font-bold text-slate-900">
                    Three Private Sleeper Configurations, Zero Middle Seats.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Every Aurelia Overland bus is built on an air-suspended Volvo 9600 multi-axle
                    chassis, replacing cramped rows with 14 sound-insulated sleeper berths and a
                    fresh onboard dining pantry—at affordable fares from ₹899.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => switchPage('services')}
                    className="min-h-[42px] px-4 py-2.5 bg-white hover:bg-blue-50 text-slate-900 text-xs font-bold rounded-xl border border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Explore Services & Packages
                  </button>
                  <button
                    type="button"
                    onClick={() => switchPage('reviews-maps')}
                    className="min-h-[42px] px-4 py-2.5 bg-white hover:bg-blue-50 text-slate-900 text-xs font-bold rounded-xl border border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Google Maps & Verified Reviews
                  </button>
                  <button
                    type="button"
                    onClick={() => switchPage('analytics')}
                    className="min-h-[42px] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer whitespace-nowrap shrink-0"
                  >
                    View Analytics Dashboard
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <SuiteCutawayIllustration variant="presidential" />
                    <div className="text-xs font-bold text-blue-700">
                      <span>Lower Deck Forward</span>
                      <span className="mx-2" aria-hidden="true">·</span>
                      <span>Suites L1A & L1B</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-slate-900">
                      01. The Presidential Cabin
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Full-height sliding privacy door, 200 cm quilted flat bed, personal snack bar,
                      individual AC control, and dedicated attendant call bell.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-emerald-700">
                    <span>DIMENSIONS: 200 × 92 CM</span>
                    <span>₹1,299 – ₹1,899</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <SuiteCutawayIllustration variant="sleeper" />
                    <div className="text-xs font-bold text-blue-700">
                      <span>Upper Panoramic Deck</span>
                      <span className="mx-2" aria-hidden="true">·</span>
                      <span>Pods U1A – U4B</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-slate-900">
                      02. Royal Sky Sleeper Pod
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Elevated highway and mountain views through UV-shielded panoramic glass,
                      zero-gravity backrest recline, and fresh cotton duvet kit.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-emerald-700">
                    <span>DIMENSIONS: 195 × 84 CM</span>
                    <span>₹899 – ₹1,499</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col justify-between md:col-span-2 lg:col-span-1">
                  <div className="space-y-4">
                    <SuiteCutawayIllustration variant="salon" />
                    <div className="text-xs font-bold text-blue-700">
                      <span>Hospitality & Culinary</span>
                      <span className="mx-2" aria-hidden="true">·</span>
                      <span>All Departures</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-slate-900">
                      03. Onboard Hot Dining Pantry
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Freshly packed regional meal boxes served warm at your berth’s fold-out table,
                      accompanied by morning masala chai and South Indian filter coffee.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-emerald-700">
                    <span>COMPLIMENTARY MEAL</span>
                    <span>FREE WI-FI</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Interactive Quick Route & Seat Selection Modal (Mobile Bottom-Sheet + Tablet/Desktop Centered Dialog) */}
      {isQuickPickerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Interactive Bus Route and Seat Selection"
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-t-3xl sm:rounded-2xl border-t-2 sm:border-2 border-blue-500 shadow-2xl max-w-4xl w-full p-4 sm:p-6 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Mobile Bottom-Sheet Grab Handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden" />

            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3.5">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Instant Interactive Bus & Berth Selector</span>
                </span>
                <h3 className="font-display text-xl sm:text-3xl font-bold text-slate-900 mt-0.5">
                  Choose Your Bus Route & Click Your Sleeper Berth
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickPickerOpen(false)}
                aria-label="Close seat selection modal"
                className="min-h-[42px] min-w-[42px] flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Select Bus Corridor */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Step 1: Select Luxury Bus Corridor (Fares from ₹899)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {routes.map((r) => {
                  const active = r.id === activeRoute.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleModalRouteChange(r.id)}
                      className={`min-h-[52px] p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                        active
                          ? 'bg-blue-600 border-blue-700 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-blue-400'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">
                          {r.origin} → {r.destination}
                        </p>
                        <p className={`text-[11px] ${active ? 'text-blue-100' : 'text-slate-500'}`}>
                          {r.departureTime} IST · {r.coachCode}
                        </p>
                      </div>
                      <span
                        className={`font-mono text-xs font-extrabold px-2 py-1 rounded ${
                          active ? 'bg-amber-300 text-slate-950' : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {formatInr(r.baseFareInr)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Interactive Color-Coded Berth Picker */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Step 2: Click Available Berths ({activeRoute.origin} to {activeRoute.destination})
                </span>
                <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setModalDeck('lower')}
                    className={`min-h-[38px] px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
                      modalDeck === 'lower'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Lower Deck Suites (6)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalDeck('upper')}
                    className={`min-h-[38px] px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
                      modalDeck === 'upper'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Upper Deck Sky Pods (8)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                {modalDisplayedSeats.map((seat) => {
                  const isSelected = modalSelectedSeats.includes(seat.id);
                  const isOccupied = seat.status === 'occupied';
                  const isLadies = seat.status === 'reserved-ladies';

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => handleModalSeatClick(seat)}
                      className={`min-h-[82px] p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                        isOccupied
                          ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-600 border-blue-800 text-white shadow-md ring-2 ring-blue-300 cursor-pointer'
                          : isLadies
                          ? 'bg-rose-50 border-rose-400 text-rose-950 hover:bg-rose-100 cursor-pointer'
                          : 'bg-emerald-50 border-emerald-500 text-slate-900 hover:bg-emerald-100 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-xs font-extrabold">Berth {seat.id}</span>
                        <span className="font-mono text-xs font-bold">
                          {formatInr(seat.priceInr)}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold mt-1">{seat.type}</p>
                      <span className="text-[10px] font-mono font-bold mt-2 block">
                        {isOccupied
                          ? 'BOOKED'
                          : isSelected
                          ? 'SELECTED'
                          : isLadies
                          ? 'LADIES BERTH'
                          : 'AVAILABLE'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {modalSeatError && (
                <p className="text-xs font-semibold text-red-600">{modalSeatError}</p>
              )}
            </div>

            {/* Modal Footer: Live Total & Confirm Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-xs text-slate-600">
                  Selected Berths:{' '}
                  <span className="font-mono font-bold text-blue-700">
                    {modalSelectedSeats.length > 0 ? modalSelectedSeats.join(', ') : 'None'}
                  </span>
                </p>
                <p className="text-lg font-mono font-extrabold text-slate-900">
                  Total Payable: {formatInr(modalFare.totalInr)}{' '}
                  <span className="text-xs font-normal text-emerald-700">(incl. 5% GST)</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsQuickPickerOpen(false)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmModalSelection}
                  className="min-h-[46px] px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Confirm Selected Seats & Proceed to Payment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiet Editorial Footer with Complete 5-Page Navigation & WhatsApp/Call Contact */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 px-4 sm:px-6 py-8 sm:py-10 mt-10 sm:mt-12">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-xs">
          <div className="space-y-1.5">
            <p className="font-display text-xl font-bold text-white">Aurelia Overland</p>
            <p className="text-slate-400">
              Luxury Sleeper Motorcoach Transit · Mumbai · New Delhi · Udaipur · Bengaluru ·
              Jaipur · Goa · Hyderabad · Chennai · Pune · Mysuru
            </p>
            <p className="font-mono text-amber-300">
              Concierge Desk: +91 22 6849 1100 · WhatsApp: +91 98201 77420 ·
              concierge@aureliaoverland.in
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-5 font-semibold">
            <button
              type="button"
              onClick={() => switchPage('booking')}
              className="py-1 hover:text-white transition-colors cursor-pointer"
            >
              Book Journey
            </button>
            <button
              type="button"
              onClick={() => switchPage('services')}
              className="py-1 hover:text-white transition-colors cursor-pointer"
            >
              Services & Appointments
            </button>
            <button
              type="button"
              onClick={() => switchPage('blog')}
              className="py-1 hover:text-white transition-colors cursor-pointer"
            >
              Overland Blog
            </button>
            <button
              type="button"
              onClick={() => switchPage('reviews-maps')}
              className="py-1 hover:text-white transition-colors cursor-pointer"
            >
              Google Maps & Reviews
            </button>
            <button
              type="button"
              onClick={() => switchPage('analytics')}
              className="py-1 hover:text-white transition-colors cursor-pointer"
            >
              Analytics Dashboard
            </button>
            <button
              type="button"
              onClick={() => switchPage('portal')}
              className="py-1 hover:text-white transition-colors cursor-pointer"
            >
              Member Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
