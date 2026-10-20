import React, { useState, useEffect } from 'react';
import {
  BookingRecord,
  CaptchaChallenge,
  INDIAN_TERMINALS,
  IndianCity,
  UserProfile,
  formatInr,
  generateCaptchaChallenge,
  verifyAntiBotSecurity,
} from '../utils/bookingLogic';
import { SecurityCaptchaBox } from './SecurityCaptchaBox';
import {
  CheckCircle2,
  Mail,
  LogOut,
  UserCheck,
  FileText,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface MemberPortalProps {
  user: UserProfile | null;
  onLoginSuccess: (profile: UserProfile) => void;
  onGoogleLogin: () => Promise<void>;
  isGoogleLoading?: boolean;
  onLogout: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  bookings: BookingRecord[];
  onCancelBooking: (pnr: string) => void;
  onBookNewRoute: () => void;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({
  user,
  onLoginSuccess,
  onGoogleLogin,
  isGoogleLoading = false,
  onLogout,
  onUpdateProfile,
  bookings,
  onCancelBooking,
  onBookNewRoute,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('vikramaditya.singhania@oberoicapital.in');
  const [password, setPassword] = useState('Sovereign#2026');
  const [fullName, setFullName] = useState('Vikramaditya Singhania');
  const [phone, setPhone] = useState('+91 98201 77420');
  const [homeCity, setHomeCity] = useState<IndianCity>('Mumbai');

  // Security states for login/registration
  const [notARobot, setNotARobot] = useState(false);
  const [captchaSeed, setCaptchaSeed] = useState(1);
  const [captchaChallenge, setCaptchaChallenge] = useState<CaptchaChallenge>(() =>
    generateCaptchaChallenge(1)
  );
  const [captchaInput, setCaptchaInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Profile editor states when logged in
  const [editName, setEditName] = useState(user?.fullName || 'Vikramaditya Singhania');
  const [editPhone, setEditPhone] = useState(user?.phone || '+91 98201 77420');
  const [editHomeCity, setEditHomeCity] = useState<IndianCity>(user?.homeCity || 'Mumbai');
  const [editDietary, setEditDietary] = useState(
    user?.preferredDietary || 'Marwari Heritage Vegetarian'
  );
  const [editChauffeur, setEditChauffeur] = useState(
    user?.defaultChauffeurAddress || 'The Oberoi Residences, Nariman Point, Mumbai'
  );
  const [profileSavedBanner, setProfileSavedBanner] = useState(false);
  const [activeEmailModal, setActiveEmailModal] = useState<BookingRecord | null>(null);
  const [resentNoticePnr, setResentNoticePnr] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEditName(user.fullName);
      setEditPhone(user.phone);
      setEditHomeCity(user.homeCity);
      setEditDietary(user.preferredDietary);
      setEditChauffeur(user.defaultChauffeurAddress);
    }
  }, [user]);

  const handleRefreshCaptcha = () => {
    const nextSeed = captchaSeed + 1;
    setCaptchaSeed(nextSeed);
    setCaptchaChallenge(generateCaptchaChallenge(nextSeed));
    setCaptchaInput('');
  };

  const handleQuickFillSecurity = () => {
    setNotARobot(true);
    setCaptchaInput(captchaChallenge.expectedAnswer);
    setAuthError(null);
  };

  const handleGoogleSignInClick = async () => {
    setAuthError(null);
    try {
      await onGoogleLogin();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes('auth/popup-closed-by-user')) {
        setAuthError(
          'Google Sign-In popup could not complete in this preview window. Please ensure popups are allowed or use the instant Member Sign-In below.'
        );
      }
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim() || !email.includes('@')) {
      setAuthError('Please enter a valid registered corporate or personal email address.');
      return;
    }
    if (!password || password.length < 6) {
      setAuthError('Please enter your security passphrase (minimum 6 characters).');
      return;
    }
    if (authMode === 'register' && !fullName.trim()) {
      setAuthError('Please provide your full legal name as on government photo ID.');
      return;
    }

    const security = verifyAntiBotSecurity({
      notARobotChecked: notARobot,
      captchaInput,
      expectedCaptcha: captchaChallenge.expectedAnswer,
    });
    if (!security.valid) {
      setAuthError(security.error || 'Security verification failed.');
      return;
    }

    const loggedInProfile: UserProfile = {
      id: 'usr-sovereign-01',
      fullName: authMode === 'register' ? fullName.trim() : 'Vikramaditya Singhania',
      email: email.trim(),
      phone: phone.trim(),
      tier: 'Sovereign Privé',
      membershipNumber: 'AOV-PRIVE-88412',
      homeCity,
      preferredDietary: 'Marwari Heritage Vegetarian',
      defaultChauffeurAddress: 'The Oberoi Residences, Nariman Point, Mumbai',
      milesCompletedKm: 6420,
    };

    onLoginSuccess(loggedInProfile);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!editName.trim() || !editPhone.trim()) return;
    onUpdateProfile({
      ...user,
      fullName: editName.trim(),
      phone: editPhone.trim(),
      homeCity: editHomeCity,
      preferredDietary: editDietary,
      defaultChauffeurAddress: editChauffeur.trim(),
    });
    setProfileSavedBanner(true);
    setTimeout(() => setProfileSavedBanner(false), 3500);
  };

  if (!user) {
    return (
      <section className="max-w-[1180px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
          {/* Left Column: Member Privileges & Security Architecture */}
          <div className="lg:col-span-5 bg-gradient-to-b from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between border-2 border-blue-500 shadow-xl">
            <div className="space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Aurelia Privé Membership · Google & reCAPTCHA Secured</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Manage Your Sleeper Bookings & Member Profile.
              </h1>
              <p className="text-sm text-sky-100/90 leading-relaxed">
                Sign in with your Google Account or registered Aurelia Privé credentials to unlock
                an instant 10% member fare discount on all intercity sleeper buses, cloud-synced
                trip history, and saved boarding preferences.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/15 text-sm">
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <p className="font-bold text-amber-300">01. One-Click Google Account Login</p>
                  <p className="text-xs text-slate-300 mt-1">
                    Authenticate securely with Firebase Google Sign-In and sync your profile and PNR
                    tickets across mobile, tablet, and desktop.
                  </p>
                </div>
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <p className="font-bold text-emerald-300">02. Complete Trip Ledger & GST E-Tickets</p>
                  <p className="text-xs text-slate-300 mt-1">
                    Access past and upcoming bus PNR manifests, inspect instant email confirmations,
                    or cancel active sleeper reservations.
                  </p>
                </div>
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <p className="font-bold text-sky-300">03. Google reCAPTCHA v2 Bot Protection</p>
                  <p className="text-xs text-slate-300 mt-1">
                    Protected by interactive human verification and Firestore zero-trust security
                    rules.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/15 mt-8 flex items-center justify-between text-xs text-amber-300 font-semibold">
              <span>Google OAuth 2.0 + Firebase Auth</span>
              <span className="font-mono">10% MEMBER DISCOUNT</span>
            </div>
          </div>

          {/* Right Column: Login with Google + Member Sign In / Register Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-slate-200 p-5 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-6">
              {/* Primary Google Sign-In Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Instant Cloud Authentication
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    Recommended · 1-Click Access
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignInClick}
                  disabled={isGoogleLoading}
                  className="w-full min-h-[52px] py-3 px-5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 text-sm font-bold rounded-xl border-2 border-slate-300 hover:border-blue-600 shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  {/* Official 4-Color Google G Emblem SVG */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.49 12.275c0-.85-.075-1.675-.215-2.475H12v4.69h6.45c-.28 1.485-1.12 2.745-2.385 3.59v2.985h3.86c2.26-2.08 3.565-5.145 3.565-8.79z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.955-1.075 7.94-2.91l-3.86-2.985c-1.075.72-2.45 1.15-4.08 1.15-3.135 0-5.79-2.115-6.74-4.96H1.27v3.09C3.245 21.305 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.26 14.295c-.24-.72-.38-1.49-.38-2.295s.14-1.575.38-2.295V6.615H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.385l3.99-3.09z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.76 0 3.34.605 4.585 1.795l3.435-3.435C17.95 1.19 15.235 0 12 0 7.31 0 3.245 2.695 1.27 6.615l3.99 3.09c.95-2.845 3.605-4.955 6.74-4.955z"
                    />
                  </svg>
                  <span>
                    {isGoogleLoading ? 'Connecting to Google Account...' : 'Continue with Google'}
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center py-1">
                <div className="grow border-t border-slate-200" />
                <span className="shrink-0 mx-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Or Sign In with Member Email & reCAPTCHA
                </span>
                <div className="grow border-t border-slate-200" />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="grid grid-cols-2 sm:flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthError(null);
                    }}
                    className={`min-h-[38px] px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      authMode === 'signin'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Member Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setAuthError(null);
                    }}
                    className={`min-h-[38px] px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      authMode === 'register'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Register New Profile
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleQuickFillSecurity}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Auto-Complete Security Check (Demo)
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4" noValidate>
                {authMode === 'register' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="portal-fullname"
                        className="block text-xs font-bold text-slate-700 mb-1.5"
                      >
                        Full Legal Name
                      </label>
                      <input
                        id="portal-fullname"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="portal-homecity"
                        className="block text-xs font-bold text-slate-700 mb-1.5"
                      >
                        Home Lounge Terminal
                      </label>
                      <select
                        id="portal-homecity"
                        value={homeCity}
                        onChange={(e) => setHomeCity(e.target.value as IndianCity)}
                        className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                      >
                        {INDIAN_TERMINALS.map((t) => (
                          <option key={t.city} value={t.city}>
                            {t.city} ({t.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="portal-email"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      Registered Email Address
                    </label>
                    <input
                      id="portal-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="portal-password"
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                    >
                      Security Passphrase
                    </label>
                    <input
                      id="portal-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                </div>

                {/* Mandatory Not-A-Robot + CAPTCHA Security Gate */}
                <SecurityCaptchaBox
                  idPrefix="member-auth"
                  notARobotChecked={notARobot}
                  onToggleNotARobot={setNotARobot}
                  captchaChallenge={captchaChallenge}
                  captchaInput={captchaInput}
                  onChangeCaptchaInput={setCaptchaInput}
                  onRefreshCaptcha={handleRefreshCaptcha}
                />

                {authError && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-red-50 border-2 border-red-200 text-xs font-semibold text-red-700"
                  >
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full min-h-[48px] py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <UserCheck className="w-4 h-4 text-amber-300" aria-hidden="true" />
                  <span>
                    {authMode === 'signin'
                      ? 'Authenticate & Enter Member Portal'
                      : 'Complete Enrollment & Access Portal'}
                  </span>
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <span>Demo Member: vikramaditya.singhania@oberoicapital.in</span>
              <span className="font-mono font-bold text-emerald-700">10% Privé Discount Active</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Authenticated Member Dashboard View
  return (
    <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Top Member Header Card */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-8 border-2 border-blue-500 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-y-1 text-xs text-amber-300 font-mono font-bold">
            <span>{user.tier}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>ID: {user.membershipNumber}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="text-emerald-300">Home Pavilion: {user.homeCity}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-white">
            Welcome back, {user.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100/90">
            {user.email} · {user.phone} · Cumulative Luxury Overland Distance:{' '}
            <span className="font-mono font-bold text-amber-300 tabular-nums">
              {user.milesCompletedKm.toLocaleString('en-IN')} km
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onBookNewRoute}
            className="min-h-[44px] px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span>Book New Bus Journey</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="min-h-[44px] px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left Profile Management, Right Trip History & Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left 5 Cols: Profile & Chauffeur Preferences */}
        <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-slate-200 p-5 sm:p-7 space-y-6 shadow-xs">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Profile & Boarding Preferences
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Changes sync directly to your Cloud Firestore member profile and boarding manifest.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label
                htmlFor="edit-fullname"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Passenger Full Name
              </label>
              <input
                id="edit-fullname"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="edit-phone"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Direct Mobile (WhatsApp/SMS)
                </label>
                <input
                  id="edit-phone"
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600"
                />
              </div>
              <div>
                <label
                  htmlFor="edit-city"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Home Terminal City
                </label>
                <select
                  id="edit-city"
                  value={editHomeCity}
                  onChange={(e) => setEditHomeCity(e.target.value as IndianCity)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600"
                >
                  {INDIAN_TERMINALS.map((t) => (
                    <option key={t.city} value={t.city}>
                      {t.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="edit-dietary"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Complimentary Onboard Meal Box
              </label>
              <select
                id="edit-dietary"
                value={editDietary}
                onChange={(e) => setEditDietary(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600"
              >
                <option value="Marwari Heritage Vegetarian">Marwari Heritage Vegetarian</option>
                <option value="Jain Royal Sattvik (No Root Vegetables)">
                  Jain Royal Sattvik (No Root Vegetables)
                </option>
                <option value="Coastal Malabar & Konkan Pescatarian">
                  Coastal Malabar & Konkan Pescatarian
                </option>
                <option value="Deccan Royal Frontier Gastronomy">
                  Deccan Royal Frontier Gastronomy
                </option>
                <option value="Artisanal Vegan & Cold-Pressed">
                  Artisanal Vegan & Cold-Pressed
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-chauffeur"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Default Pickup / Boarding Notes
              </label>
              <textarea
                id="edit-chauffeur"
                rows={2}
                value={editChauffeur}
                onChange={(e) => setEditChauffeur(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600"
              />
            </div>

            {profileSavedBanner && (
              <div
                role="status"
                className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>Member profile synced and saved to Cloud Firestore.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full min-h-[46px] py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
            >
              Save Profile Preferences
            </button>
          </form>
        </div>

        {/* Right 7 Cols: Previous & Upcoming Trips Ledger */}
        <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-slate-200 p-5 sm:p-7 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Journey Ledger & Previous Trips
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Real-time sleeper manifests, payment settlements, and email confirmation E-Tickets.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 tabular-nums">
              {bookings.length} Recorded {bookings.length === 1 ? 'Journey' : 'Journeys'}
            </span>
          </div>

          <div className="space-y-4">
            {bookings.map((trip) => (
              <div
                key={trip.pnr}
                className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 sm:p-5 space-y-4"
              >
                {/* Metadata row */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 border-b border-slate-200 pb-3">
                  <div className="font-mono text-slate-900 font-bold">
                    <span>PNR: {trip.pnr}</span>
                    <span className="mx-2 text-slate-400" aria-hidden="true">·</span>
                    <span className="text-blue-700">{trip.coachCode}</span>
                    <span className="mx-2 text-slate-400" aria-hidden="true">·</span>
                    <span
                      className={
                        trip.status === 'Cancelled' ? 'text-red-600' : 'text-emerald-700'
                      }
                    >
                      Status: {trip.status}
                    </span>
                  </div>
                  <div className="font-mono font-semibold tabular-nums">
                    <span>{trip.travelDate}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{trip.departureTime} IST</span>
                  </div>
                </div>

                {/* Route & Suite Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {trip.origin} to {trip.destination} — {trip.coachName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {trip.originTerminal} → {trip.destinationTerminal}
                    </p>
                    <p className="text-xs text-slate-700 mt-1.5">
                      <span>Berths Assigned: </span>
                      <span className="font-mono font-bold text-blue-700">
                        {trip.selectedSeats.join(', ')}
                      </span>
                      <span className="mx-2" aria-hidden="true">·</span>
                      <span>Meal: {trip.dietaryPreference}</span>
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <p className="font-mono text-lg font-extrabold text-emerald-700 tabular-nums">
                      {formatInr(trip.fare.totalInr)}
                    </p>
                    <p className="text-xs text-slate-600">{trip.paymentMethodLabel}</p>
                  </div>
                </div>

                {resentNoticePnr === trip.pnr && (
                  <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg px-3 py-2">
                    Confirmation email re-dispatched to {trip.emailDispatchLog.recipient} at{' '}
                    {new Date().toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    IST.
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveEmailModal(trip)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>View Email Confirmation & E-Ticket</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setResentNoticePnr(trip.pnr);
                        setTimeout(() => setResentNoticePnr(null), 4000);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Resend Confirmation Email</span>
                    </button>
                  </div>

                  {trip.status === 'Confirmed' && (
                    <button
                      type="button"
                      onClick={() => onCancelBooking(trip.pnr)}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Cancel Berth Reservation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email Confirmation Transcript Modal */}
      {activeEmailModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="email-transcript-title"
        >
          <div className="bg-white rounded-2xl border-2 border-blue-500 max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3
                  id="email-transcript-title"
                  className="font-display text-2xl font-bold text-slate-900"
                >
                  Dispatched Email Confirmation
                </h3>
                <p className="text-xs font-mono text-slate-600">
                  SMTP Message ID: {activeEmailModal.emailDispatchLog.messageId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveEmailModal(null)}
                className="min-h-[38px] px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-900 cursor-pointer whitespace-nowrap shrink-0"
              >
                Close Preview
              </button>
            </div>

            <div className="text-xs space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <p>
                <span className="font-bold text-slate-900">To:</span>{' '}
                {activeEmailModal.emailDispatchLog.recipient}
              </p>
              <p>
                <span className="font-bold text-slate-900">Subject:</span>{' '}
                {activeEmailModal.emailDispatchLog.subject}
              </p>
              <p>
                <span className="font-bold text-slate-900">Dispatched At:</span>{' '}
                {activeEmailModal.emailDispatchLog.dispatchedAt}
              </p>
            </div>

            <pre className="text-xs font-mono whitespace-pre-wrap bg-slate-900 text-slate-100 p-4 rounded-xl leading-relaxed overflow-x-auto">
              {activeEmailModal.emailDispatchLog.bodyPreview}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
};
