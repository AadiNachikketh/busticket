import React, { useState, useEffect } from 'react';
import {
  BookingRecord,
  CaptchaChallenge,
  LuxuryCoachRoute,
  SuiteSeat,
  UserProfile,
  buildConfirmedBookingRecord,
  calculateFareBreakdown,
  formatInr,
  generateCaptchaChallenge,
  toggleSeatSelection,
  validatePaymentGatewayInput,
  verifyAntiBotSecurity,
} from '../utils/bookingLogic';
import { SecurityCaptchaBox } from './SecurityCaptchaBox';
import { CheckCircle2, Mail, ShieldAlert, ArrowRight, Bus } from 'lucide-react';

interface SeatBookingWorkspaceProps {
  route: LuxuryCoachRoute;
  allRoutes?: LuxuryCoachRoute[];
  onChangeRoute?: (routeId: string) => void;
  externalSelectedSeats?: string[] | null;
  travelDate: string;
  user: UserProfile | null;
  onBookingConfirmed: (record: BookingRecord) => void;
  onViewMemberTrips: () => void;
}

export const SeatBookingWorkspace: React.FC<SeatBookingWorkspaceProps> = ({
  route,
  allRoutes,
  onChangeRoute,
  externalSelectedSeats,
  travelDate,
  user,
  onBookingConfirmed,
  onViewMemberTrips,
}) => {
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['L1A']);
  const [seatError, setSeatError] = useState<string | null>(null);

  // Passenger manifest fields
  const [passengerName, setPassengerName] = useState(user?.fullName || 'Arundhati Deshmukh');
  const [passengerEmail, setPassengerEmail] = useState(
    user?.email || 'arundhati.deshmukh@tatawealth.in'
  );
  const [passengerPhone, setPassengerPhone] = useState(user?.phone || '+91 98204 51290');
  const [dietaryPreference, setDietaryPreference] = useState(
    user?.preferredDietary || 'Marwari Heritage Vegetarian'
  );
  const [chauffeurPickup, setChauffeurPickup] = useState(
    user?.defaultChauffeurAddress || 'Taj Mahal Palace Tower Wing, Apollo Bunder, Mumbai'
  );

  // Payment Gateway fields
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('arundhati.deshmukh@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 8819 0042 9184');
  const [cardHolder, setCardHolder] = useState('ARUNDHATI DESHMUKH');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvv, setCardCvv] = useState('849');
  const [bankCode, setBankCode] = useState('HDFC Private Wealth Banking');

  // Anti-Bot Security & CAPTCHA fields
  const [notARobot, setNotARobot] = useState(false);
  const [captchaSeed, setCaptchaSeed] = useState(0);
  const [captchaChallenge, setCaptchaChallenge] = useState<CaptchaChallenge>(() =>
    generateCaptchaChallenge(0)
  );
  const [captchaInput, setCaptchaInput] = useState('');

  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [confirmedRecord, setConfirmedRecord] = useState<BookingRecord | null>(null);

  // Reset selected seat to first available seat when route changes
  useEffect(() => {
    const firstAvail = route.seats.find((s) => s.status === 'available');
    setSelectedSeats(firstAvail ? [firstAvail.id] : []);
    setSeatError(null);
    setCheckoutError(null);
    setConfirmedRecord(null);
  }, [route.id]);

  // Sync seats chosen via Hero Interactive Seat Selector Modal
  useEffect(() => {
    if (externalSelectedSeats && externalSelectedSeats.length > 0) {
      setSelectedSeats(externalSelectedSeats);
      const firstId = externalSelectedSeats[0];
      if (firstId.startsWith('U')) {
        setActiveDeck('upper');
      } else {
        setActiveDeck('lower');
      }
    }
  }, [externalSelectedSeats]);

  // Sync user profile changes into passenger fields if logged in
  useEffect(() => {
    if (user) {
      setPassengerName(user.fullName);
      setPassengerEmail(user.email);
      setPassengerPhone(user.phone);
      setDietaryPreference(user.preferredDietary);
      setChauffeurPickup(user.defaultChauffeurAddress);
    }
  }, [user]);

  const handleSeatClick = (seat: SuiteSeat) => {
    setSeatError(null);
    setCheckoutError(null);
    const result = toggleSeatSelection(selectedSeats, seat, 4);
    if (result.error) {
      setSeatError(result.error);
    } else {
      setSelectedSeats(result.selected);
    }
  };

  const handleRefreshCaptcha = () => {
    const next = captchaSeed + 1;
    setCaptchaSeed(next);
    setCaptchaChallenge(generateCaptchaChallenge(next));
    setCaptchaInput('');
  };

  const handleOneClickVerifySecurity = () => {
    setNotARobot(true);
    setCaptchaInput(captchaChallenge.expectedAnswer);
    setCheckoutError(null);
  };

  const fare = calculateFareBreakdown(route.seats, selectedSeats, Boolean(user));
  const lowerSeats = route.seats.filter((s) => s.status !== undefined && s.deck === 'lower');
  const upperSeats = route.seats.filter((s) => s.status !== undefined && s.deck === 'upper');
  const displayedSeats = activeDeck === 'lower' ? lowerSeats : upperSeats;

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (selectedSeats.length === 0) {
      setCheckoutError('Please select at least one private suite or sleeper pod on the coach deck.');
      return;
    }
    if (!passengerName.trim() || passengerName.trim().length < 3) {
      setCheckoutError('Please enter the primary passenger full legal name.');
      return;
    }
    if (!passengerEmail.trim() || !passengerEmail.includes('@')) {
      setCheckoutError('Please enter a valid email address for E-Ticket and confirmation dispatch.');
      return;
    }
    if (!passengerPhone.trim() || passengerPhone.trim().length < 8) {
      setCheckoutError(
        'Please enter a valid 10-digit Indian mobile number for chauffeur coordination.'
      );
      return;
    }

    // Verify Anti-Bot Not-a-Robot & CAPTCHA
    const secCheck = verifyAntiBotSecurity({
      notARobotChecked: notARobot,
      captchaInput,
      expectedCaptcha: captchaChallenge.expectedAnswer,
    });
    if (!secCheck.valid) {
      setCheckoutError(secCheck.error || 'Security verification failed.');
      return;
    }

    // Verify Payment Gateway
    const payCheck = validatePaymentGatewayInput({
      method: paymentMethod,
      upiId,
      cardNumber,
      cardHolder,
      cardExpiry,
      cardCvv,
      bankCode,
    });
    if (!payCheck.valid) {
      setCheckoutError(payCheck.error || 'Payment authorization failed.');
      return;
    }

    const record = buildConfirmedBookingRecord({
      route,
      travelDate,
      selectedSeats,
      passengerName,
      passengerEmail,
      passengerPhone,
      dietaryPreference,
      chauffeurPickup,
      paymentMethodLabel: payCheck.methodLabel,
      fare,
    });

    setConfirmedRecord(record);
    onBookingConfirmed(record);
    setTimeout(() => {
      const bannerEl = document.getElementById('booking-confirmation-banner');
      if (bannerEl) {
        bannerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  return (
    <div
      id="seat-booking-workspace"
      className="bg-white rounded-2xl border-2 border-blue-200 shadow-lg p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8"
    >
      {/* div:nth-of-type(1) — Workspace Header & Direct Route Switcher */}
      <div className="space-y-5 border-b border-slate-200 pb-5 sm:pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-blue-700 font-bold uppercase tracking-wider flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Bus className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Interactive Real-Time Coach Deck</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-emerald-700">{route.coachCode}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-700">From {formatInr(route.baseFareInr)}</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {route.coachName}: {route.origin} to {route.destination}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {route.originTerminal} ({route.departureTime} IST) → {route.destinationTerminal} (
              {route.arrivalTime} IST) · {route.duration}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            {/* Direct Route Switcher inside Workspace */}
            {allRoutes && onChangeRoute && (
              <div className="w-full sm:w-auto">
                <label htmlFor="workspace-route-select" className="sr-only">
                  Switch Bus Route
                </label>
                <select
                  id="workspace-route-select"
                  value={route.id}
                  onChange={(e) => onChangeRoute(e.target.value)}
                  className="w-full sm:w-auto min-h-[44px] px-3.5 py-2 text-xs font-bold bg-blue-50 border border-blue-300 text-blue-950 rounded-xl cursor-pointer"
                >
                  {allRoutes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.origin} → {r.destination} ({formatInr(r.baseFareInr)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Deck Selector Segmented Control (Full-width 2-col on mobile, inline on tablet/desktop) */}
            <div className="grid grid-cols-2 sm:flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveDeck('lower')}
                className={`min-h-[40px] px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeDeck === 'lower'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Lower Deck · Suites (6)
              </button>
              <button
                type="button"
                onClick={() => setActiveDeck('upper')}
                className={`min-h-[40px] px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeDeck === 'upper'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Upper Deck · Sky Pods (8)
              </button>
            </div>
          </div>
        </div>

        {/* Confirmed Booking Receipt & Email Notification Banner */}
        {confirmedRecord && (
          <div
            id="booking-confirmation-banner"
            role="region"
            aria-label="Booking Confirmation and Email Dispatch Receipt"
            className="rounded-xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-4 sm:p-7 border-2 border-emerald-400 space-y-5 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="w-6 h-6 text-emerald-400 shrink-0 mt-1"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-mono font-bold text-emerald-300">
                    RESERVATION CONFIRMED · PNR: {confirmedRecord.pnr}
                  </p>
                  <h4 className="font-display text-xl sm:text-3xl font-bold text-white mt-0.5">
                    Private Suite Boarding Pass & Email Confirmation Dispatched
                  </h4>
                  <p className="text-xs text-emerald-100 mt-1">
                    Transaction Ref: {confirmedRecord.transactionId} · Settled:{' '}
                    <span className="font-mono font-bold text-amber-300">
                      {formatInr(confirmedRecord.fare.totalInr)}
                    </span>{' '}
                    via {confirmedRecord.paymentMethodLabel}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onViewMemberTrips}
                className="min-h-[44px] px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <span>Track in Member Portal</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Dispatched Email Preview */}
            <div className="bg-slate-950/80 rounded-lg border border-emerald-500/30 p-3.5 sm:p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-200 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-300 shrink-0" aria-hidden="true" />
                  <span className="font-bold text-white">
                    Automated Email Confirmation Notification Sent
                  </span>
                </div>
                <span className="font-mono text-[11px] sm:text-xs">
                  Recipient: {confirmedRecord.emailDispatchLog.recipient} ·{' '}
                  {confirmedRecord.emailDispatchLog.dispatchedAt}
                </span>
              </div>
              <p className="text-xs text-slate-200">
                <span className="text-white font-semibold">Subject:</span>{' '}
                {confirmedRecord.emailDispatchLog.subject}
              </p>
              <pre className="text-[11px] sm:text-xs font-mono whitespace-pre-wrap text-emerald-100 bg-slate-900 p-3 sm:p-3.5 rounded border border-slate-700 leading-relaxed overflow-x-auto">
                {confirmedRecord.emailDispatchLog.bodyPreview}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* div:nth-of-type(2) — Main 2-Column Split: Left Interactive Coach Deck Blueprint, Right Contiguous Checkout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left 6 Columns: Interactive Color-Coded Coach Floorplan */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5">
          {/* Clear High-Contrast Color Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-emerald-100 border-2 border-emerald-500 inline-block shrink-0" />
              <span className="text-emerald-900">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-600 border-2 border-blue-700 inline-block shrink-0" />
              <span className="text-blue-700">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-rose-100 border-2 border-rose-500 inline-block shrink-0" />
              <span className="text-rose-800">Ladies Berth</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-slate-200 border-2 border-slate-400 inline-block shrink-0" />
              <span className="text-slate-500">Booked / Sold</span>
            </div>
          </div>

          {/* Coach Chassis Container */}
          <div className="rounded-2xl border-2 border-blue-900 bg-slate-50 p-3.5 sm:p-5 space-y-4 sm:space-y-5 shadow-inner">
            {/* Forward Cockpit & Butler Galley Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white text-xs shadow-xs">
              <div>
                <span className="font-mono font-bold text-amber-300">FRONT OF BUS</span>
                <span className="mx-1.5 sm:mx-2" aria-hidden="true">·</span>
                <span>
                  {activeDeck === 'lower'
                    ? 'Captain Cockpit & Soundproof Partition'
                    : 'Panoramic Sky Observation Glass'}
                </span>
              </div>
              <span className="font-mono text-emerald-300 font-semibold">HOT PANTRY</span>
            </div>

            {/* Suite Grid: 2 Columns (Port Side A & Starboard Side B with Private Corridor) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {displayedSeats.map((seat) => {
                const isSelected = selectedSeats.includes(seat.id);
                const isOccupied = seat.status === 'occupied';
                const isLadies = seat.status === 'reserved-ladies';

                return (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={isOccupied}
                    onClick={() => handleSeatClick(seat)}
                    aria-label={`Suite ${seat.id}, ${seat.type}, ${formatInr(seat.priceInr)}, ${
                      isOccupied ? 'Occupied' : isSelected ? 'Selected' : 'Available'
                    }`}
                    aria-pressed={isSelected}
                    className={`text-left p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[116px] sm:min-h-[122px] ${
                      isOccupied
                        ? 'bg-slate-200/90 border-slate-300 text-slate-500 cursor-not-allowed opacity-75'
                        : isSelected
                        ? 'bg-blue-600 border-blue-800 text-white shadow-md ring-2 ring-blue-300 cursor-pointer'
                        : isLadies
                        ? 'bg-rose-50 border-rose-400 text-rose-950 hover:bg-rose-100 hover:border-rose-600 cursor-pointer'
                        : 'bg-emerald-50/75 border-emerald-500 text-slate-900 hover:bg-emerald-100/80 hover:border-emerald-600 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span className="font-mono text-xs sm:text-sm font-extrabold">
                        Suite {seat.id}
                      </span>
                      <span
                        className={`font-mono text-[11px] sm:text-xs font-extrabold px-1.5 sm:px-2 py-0.5 rounded tabular-nums ${
                          isSelected
                            ? 'bg-amber-300 text-slate-950'
                            : isOccupied
                            ? 'bg-slate-300 text-slate-600'
                            : isLadies
                            ? 'bg-rose-200 text-rose-900'
                            : 'bg-emerald-200/90 text-emerald-950'
                        }`}
                      >
                        {formatInr(seat.priceInr)}
                      </span>
                    </div>

                    <div className="my-1.5 sm:my-2">
                      <p className="text-xs font-bold leading-tight">{seat.type}</p>
                      <p
                        className={`text-[10.5px] sm:text-[11px] mt-0.5 leading-snug ${
                          isSelected
                            ? 'text-blue-100'
                            : isOccupied
                            ? 'text-slate-500'
                            : 'text-slate-600'
                        }`}
                      >
                        {seat.features}
                      </p>
                    </div>

                    <div className="flex items-center justify-between w-full pt-2 border-t border-current/15 text-[10px] sm:text-[11px] font-mono font-bold">
                      <span
                        className={
                          isSelected
                            ? 'text-amber-300'
                            : isOccupied
                            ? 'text-slate-500'
                            : isLadies
                            ? 'text-rose-700'
                            : 'text-emerald-700'
                        }
                      >
                        {isOccupied
                          ? 'BOOKED'
                          : isSelected
                          ? 'SELECTED'
                          : isLadies
                          ? 'LADIES BERTH'
                          : 'AVAILABLE'}
                      </span>
                      <span>{seat.col === 'A' ? 'LEFT' : 'RIGHT'}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Rear Spa Washroom & Air Purification Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-blue-100/80 border border-blue-200 text-xs font-semibold text-blue-950">
              <span>Rear Hygienic Bio-Washroom & Fresh Linen Locker</span>
              <span className="font-mono text-emerald-800">GPS & HEPA-14 ACTIVE</span>
            </div>
          </div>

          {/* Mobile & Tablet Instant Selected Seat Summary & Jump to Checkout Bar */}
          <div className="lg:hidden flex items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-950 text-white border border-blue-700 shadow-sm">
            <div>
              <p className="text-[11px] text-sky-200">
                Selected: <span className="font-mono font-bold text-amber-300">{selectedSeats.join(', ') || 'None'}</span>
              </p>
              <p className="font-mono text-base font-extrabold text-white">
                Total: {formatInr(fare.totalInr)} <span className="text-[11px] font-normal text-emerald-300">(incl. GST)</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const paxInput = document.getElementById('booking-pax-name');
                if (paxInput) {
                  paxInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="min-h-[42px] px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap shrink-0"
            >
              Fill Details & Pay ↓
            </button>
          </div>

          {seatError && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-red-50 border border-red-300 text-xs font-semibold text-red-800"
            >
              {seatError}
            </div>
          )}

          {/* Culinary & Butler Inclusions Note */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5 text-emerald-950">
            <p className="font-bold text-emerald-900">Complimentary Ticket Inclusions (No Extra Charge)</p>
            <p>
              <span>{route.butlerService}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>{route.culinaryMenu}</span>
            </p>
          </div>
        </div>

        {/* Right 6 Columns: form:nth-of-type(1) — Contiguous Passenger Manifest, CAPTCHA Security & Payment Gateway */}
        <form onSubmit={handleCompleteBooking} className="lg:col-span-6 space-y-6" noValidate>
          {/* form > div:nth-of-type(1): Live Itemized Fare Module */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-emerald-50/40 border-2 border-blue-200 p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 pb-3">
              <div>
                <h4 className="font-display text-xl font-bold text-slate-900">
                  Affordable Ticket Fare & Settlement Summary
                </h4>
                <p className="text-xs text-slate-600">
                  Travel Date: <span className="font-mono font-semibold text-slate-900">{travelDate}</span> · Selected
                  Berths:{' '}
                  <span className="font-mono font-bold text-blue-700">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None Selected'}
                  </span>
                </p>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                5% GST ONLY
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>
                  Sleeper Berth Fare ({fare.seatCount} {fare.seatCount === 1 ? 'Berth' : 'Berths'})
                </span>
                <span className="font-mono font-semibold tabular-nums text-slate-900">
                  {formatInr(fare.subtotalInr)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>AC Departure Lounge & Meal Box Service</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900">
                  {formatInr(fare.loungeConciergeInr)}
                </span>
              </div>
              {fare.memberDiscountInr > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Registered Member Privilege (10% Off)</span>
                  <span className="font-mono tabular-nums">
                    -{formatInr(fare.memberDiscountInr)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard Indian AC Bus Passenger GST (5%)</span>
                <span className="font-mono font-semibold tabular-nums text-slate-900">
                  {formatInr(fare.gstInr)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-blue-200 text-sm font-bold text-slate-900">
                <span>Total Payable Amount</span>
                <span className="font-mono text-lg font-extrabold text-blue-700 tabular-nums">
                  {formatInr(fare.totalInr)}
                </span>
              </div>
            </div>
          </div>

          {/* form > div:nth-of-type(2): Passenger & Concierge Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">
                01. Passenger Details & Boarding Point
              </h4>
              <span className="text-xs font-semibold text-emerald-700">Instant Email E-Ticket</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="booking-pax-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Passenger Full Name
                </label>
                <input
                  id="booking-pax-name"
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="booking-pax-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirmation Email Address
                </label>
                <input
                  id="booking-pax-email"
                  type="email"
                  value={passengerEmail}
                  onChange={(e) => setPassengerEmail(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="booking-pax-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (WhatsApp / SMS Alert)
                </label>
                <input
                  id="booking-pax-phone"
                  type="tel"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="booking-pax-diet" className="block text-xs font-semibold text-slate-700 mb-1">
                  Complimentary Onboard Meal Box
                </label>
                <select
                  id="booking-pax-diet"
                  value={dietaryPreference}
                  onChange={(e) => setDietaryPreference(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  <option value="Marwari Heritage Vegetarian">Marwari Heritage Vegetarian</option>
                  <option value="Jain Royal Sattvik (No Root Vegetables)">
                    Jain Royal Sattvik (No Root Vegetables)
                  </option>
                  <option value="Coastal Malabar & Konkan Pescatarian">
                    Coastal Malabar & Konkan Thali
                  </option>
                  <option value="Deccan Royal Frontier Gastronomy">
                    Deccan Hyderabadi Biryani Box
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="booking-chauffeur" className="block text-xs font-semibold text-slate-700 mb-1">
                Pickup / Boarding Point Note ({route.origin})
              </label>
              <input
                id="booking-chauffeur"
                type="text"
                value={chauffeurPickup}
                onChange={(e) => setChauffeurPickup(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* form > div:nth-of-type(3): 02. Secure Payment Gateway */}
          <div className="space-y-4 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">
                02. Secure Indian Payment Gateway (UPI / Card / NetBanking)
              </h4>
              <span className="font-mono text-xs font-semibold text-blue-700">RBI PCI-DSS 4.0</span>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`min-h-[40px] py-2 px-2 sm:px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                UPI Instant
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`min-h-[40px] py-2 px-2 sm:px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`min-h-[40px] py-2 px-2 sm:px-3 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                NetBanking
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div>
                <label htmlFor="pay-upi-id" className="block text-xs font-semibold text-slate-700 mb-1">
                  Verified UPI ID (GPay, PhonePe, Paytm, BHIM)
                </label>
                <input
                  id="pay-upi-id"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@okhdfcbank"
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm font-mono bg-white border border-slate-300 rounded-xl text-slate-900"
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label htmlFor="pay-card-num" className="block text-xs font-semibold text-slate-700 mb-1">
                    16-Digit Card Number (Visa / MasterCard / RuPay)
                  </label>
                  <input
                    id="pay-card-num"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm font-mono bg-white border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="pay-card-exp" className="block text-xs font-semibold text-slate-700 mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      id="pay-card-exp"
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="pay-card-cvv" className="block text-xs font-semibold text-slate-700 mb-1">
                      CVV
                    </label>
                    <input
                      id="pay-card-cvv"
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="pay-card-holder" className="block text-xs font-semibold text-slate-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      id="pay-card-holder"
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div>
                <label htmlFor="pay-bank-select" className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Indian Bank
                </label>
                <select
                  id="pay-bank-select"
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-900"
                >
                  <option value="HDFC Private Wealth Banking">HDFC Bank NetBanking</option>
                  <option value="ICICI Wealth Management">ICICI Bank NetBanking</option>
                  <option value="Axis Burgundy Private">Axis Bank NetBanking</option>
                  <option value="Kotak Privy League">Kotak Mahindra Bank</option>
                  <option value="State Bank of India Wealth">State Bank of India (SBI)</option>
                </select>
              </div>
            )}
          </div>

          {/* form > div:nth-of-type(4): 03. Anti-Automation "Not a Robot" & Real Google reCAPTCHA Verification */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                03. Google reCAPTCHA Security & Anti-Bot Guard
              </h4>
              <button
                type="button"
                onClick={handleOneClickVerifySecurity}
                className="min-h-[36px] text-xs font-bold text-blue-700 hover:text-blue-900 underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
              >
                Auto-Verify CAPTCHA (Demo)
              </button>
            </div>

            <SecurityCaptchaBox
              idPrefix="checkout-sec"
              notARobotChecked={notARobot}
              onToggleNotARobot={setNotARobot}
              captchaChallenge={captchaChallenge}
              captchaInput={captchaInput}
              onChangeCaptchaInput={setCaptchaInput}
              onRefreshCaptcha={handleRefreshCaptcha}
            />
          </div>

          {checkoutError && (
            <div
              role="alert"
              className="p-3.5 rounded-lg bg-red-50 border border-red-300 text-xs font-semibold text-red-800 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{checkoutError}</span>
            </div>
          )}

          {/* Primary Pay & Confirm Action */}
          <button
            type="submit"
            className="w-full min-h-[52px] py-4 px-5 sm:px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              Authorize {formatInr(fare.totalInr)} & Dispatch Email E-Ticket ({selectedSeats.length}{' '}
              {selectedSeats.length === 1 ? 'Berth' : 'Berths'})
            </span>
            <ArrowRight className="w-4 h-4 text-amber-300 shrink-0" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
};
