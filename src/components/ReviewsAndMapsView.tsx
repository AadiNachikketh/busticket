import React, { useState } from 'react';
import {
  CityTerminal,
  INDIAN_TERMINALS,
  PassengerReview,
  calculateReviewStats,
} from '../utils/bookingLogic';
import {
  MapPin,
  PhoneCall,
  MessageSquare,
  Star,
  CheckCircle2,
  ExternalLink,
  Compass,
} from 'lucide-react';

interface ReviewsAndMapsViewProps {
  reviews: PassengerReview[];
  onAddReview: (review: PassengerReview) => void;
}

export const ReviewsAndMapsView: React.FC<ReviewsAndMapsViewProps> = ({
  reviews,
  onAddReview,
}) => {
  const [selectedTerminal, setSelectedTerminal] = useState<CityTerminal>(INDIAN_TERMINALS[0]);
  const [corridorFilter, setCorridorFilter] = useState<string>('All');
  const [showLiveIframe, setShowLiveIframe] = useState<boolean>(false);

  // New Review Form State
  const [passengerName, setPassengerName] = useState('');
  const [passengerRole, setPassengerRole] = useState('');
  const [corridor, setCorridor] = useState('Mumbai to Udaipur');
  const [suiteType, setSuiteType] = useState('Presidential Cabin (L1A)');
  const [rating, setRating] = useState<number>(5);
  const [verifiedPnr, setVerifiedPnr] = useState('AOV-MUM774120');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  const stats = calculateReviewStats(reviews);

  const filteredReviews = reviews.filter((r) => {
    if (corridorFilter === 'All') return true;
    return r.corridor.toLowerCase().includes(corridorFilter.toLowerCase());
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSubmitted(false);

    if (!passengerName.trim() || passengerName.trim().length < 2) {
      setReviewError('Please enter your full name as it appears on your boarding manifest.');
      return;
    }
    if (!title.trim() || title.trim().length < 4) {
      setReviewError('Please provide a short headline for your journey review.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 12) {
      setReviewError('Please write a brief review of your suite, steward service, or pavilion experience.');
      return;
    }

    const newRev: PassengerReview = {
      id: `rev-${Date.now()}`,
      passengerName: passengerName.trim(),
      passengerRole: passengerRole.trim() || 'Sovereign Privé Traveller',
      corridor,
      suiteType,
      rating,
      verifiedPnr: verifiedPnr.trim().toUpperCase() || 'AOV-VERIFIED',
      publishedDate: 'October 20, 2026',
      source: 'Google Business Profile',
      title: title.trim(),
      comment: comment.trim(),
    };

    onAddReview(newRev);
    setPassengerName('');
    setPassengerRole('');
    setTitle('');
    setComment('');
    setReviewSubmitted(true);
  };

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-10 space-y-14">
      {/* Section 1: Google Business Setup & Interactive Google Maps Terminal Locator */}
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5DEC9] pb-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium text-[#8C6239]">
              Google Maps Integration · Verified Google Business Setup · 10 Indian Cities
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#141413] leading-tight">
              Sovereign Terminal Locator & Verified Passenger Reviews.
            </h1>
            <p className="text-sm text-[#4A4640] leading-relaxed">
              Every Aurelia Overland departure pavilion is registered and verified on Google
              Business Profile with direct valet navigation, priority WhatsApp dispatch, and
              authenticated passenger reviews.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs bg-white border border-[#E2DCD0] rounded-xl px-5 py-3.5 shrink-0">
            <div>
              <p className="text-[#656059]">Google Business Aggregate</p>
              <p className="font-mono text-lg font-bold text-[#141413] tabular-nums flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37] shrink-0" aria-hidden="true" />
                <span>
                  {stats.averageRating} / 5.0 ({424 + stats.totalCount} Reviews)
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* City Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F4F0EA] rounded-xl">
          {INDIAN_TERMINALS.map((term) => {
            const active = term.city === selectedTerminal.city;
            return (
              <button
                key={term.code}
                type="button"
                onClick={() => setSelectedTerminal(term)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#141413] text-[#FAF8F5]'
                    : 'text-[#5C5852] hover:text-[#141413]'
                }`}
              >
                {term.city} ({term.code})
              </button>
            );
          })}
        </div>

        {/* 2-Column Split: Left Verified Google Business Profile Card, Right Interactive Google Map Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 5 Cols: Google Business Profile Card */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#DED7C8] p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3 text-xs">
                <span className="font-semibold text-[#1B5E37] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>Google Business Profile Verified</span>
                </span>
                <span className="font-mono text-[#8C6239]">CODE: {selectedTerminal.code}</span>
              </div>

              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#141413]">
                  {selectedTerminal.loungeName}
                </h2>
                <p className="text-xs text-[#656059] mt-0.5">
                  Aurelia Overland Private Terminal · {selectedTerminal.city},{' '}
                  {selectedTerminal.state}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#141413] bg-[#FAF8F5] px-3.5 py-2.5 rounded-lg border border-[#EAE4D8]">
                <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" aria-hidden="true" />
                <span className="font-bold tabular-nums">{selectedTerminal.googleRating} / 5.0</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {selectedTerminal.googleReviewCount} Google Reviews
                </span>
                <span aria-hidden="true">·</span>
                <span>Valet Lounge</span>
              </div>

              <div className="space-y-2.5 text-xs text-[#4A4640] pt-2">
                <p>
                  <strong className="text-[#141413]">Street Address:</strong>{' '}
                  {selectedTerminal.address}
                </p>
                <p>
                  <strong className="text-[#141413]">Operating Hours:</strong>{' '}
                  <span className="font-mono">{selectedTerminal.operatingHours}</span>
                </p>
                <p>
                  <strong className="text-[#141413]">Direct Terminal Desk:</strong>{' '}
                  <span className="font-mono">{selectedTerminal.phone}</span>
                </p>
              </div>
            </div>

            {/* Direct Action Buttons: Call, WhatsApp, Open in Google Maps */}
            <div className="space-y-2.5 pt-4 border-t border-[#EFECE6]">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedTerminal.phone.replace(/\s+/g, '')}`}
                  className="py-2.5 px-3 bg-[#141413] hover:bg-[#292826] text-[#FAF8F5] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
                  <span>Call Pavilion</span>
                </a>
                <a
                  href={`https://wa.me/${selectedTerminal.whatsapp}?text=Hello%20Aurelia%20Overland%20${encodeURIComponent(
                    selectedTerminal.city
                  )}%20Pavilion%2C%20please%20share%20boarding%20gate%20pin.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#1B5E37] hover:bg-[#14492A] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedTerminal.googleMapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#8C6239] hover:text-[#141413] inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <span>Open Directions in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={() => setShowLiveIframe((prev) => !prev)}
                  className="text-xs font-medium text-[#656059] hover:text-[#141413] underline cursor-pointer whitespace-nowrap shrink-0"
                >
                  {showLiveIframe ? 'Show Architectural Map' : 'Toggle Live Map Embed'}
                </button>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Interactive Google Map Canvas */}
          <div className="lg:col-span-7 bg-[#141413] text-[#FAF8F5] rounded-xl border border-[#2A2927] p-6 flex flex-col justify-between min-h-[380px] relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#2E2D2A] pb-3 z-10">
              <div className="flex items-center gap-2 text-xs text-[#C5B396]">
                <MapPin className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                <span>
                  Google Maps Coordinate Pin · {selectedTerminal.city} ({selectedTerminal.state})
                </span>
              </div>
              <span className="font-mono text-xs text-[#D4AF37]">
                VERIFIED PIN · {selectedTerminal.code}
              </span>
            </div>

            {showLiveIframe ? (
              <div className="my-4 flex-1 rounded-lg overflow-hidden border border-[#2E2D2A] bg-[#1F1E1C]">
                <iframe
                  title={`Google Maps location for ${selectedTerminal.loungeName}`}
                  src={`https://maps.google.com/maps?q=${selectedTerminal.googleMapsQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-[270px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="my-auto py-4 z-10">
                <svg
                  viewBox="0 0 680 250"
                  className="w-full h-auto rounded-lg border border-[#2E2D2A] bg-[#1A1917]"
                  role="img"
                  aria-label={`Interactive corridor and terminal street map for ${selectedTerminal.loungeName} in ${selectedTerminal.city}`}
                >
                  {/* Map arterial roads & sector grid */}
                  <g stroke="#2E2B26" strokeWidth="1">
                    <line x1="0" y1="50" x2="680" y2="50" />
                    <line x1="0" y1="100" x2="680" y2="100" />
                    <line x1="0" y1="150" x2="680" y2="150" />
                    <line x1="0" y1="200" x2="680" y2="200" />
                    <line x1="120" y1="0" x2="120" y2="250" />
                    <line x1="260" y1="0" x2="260" y2="250" />
                    <line x1="420" y1="0" x2="420" y2="250" />
                    <line x1="560" y1="0" x2="560" y2="250" />
                  </g>

                  {/* Golden Highway Express Corridor */}
                  <path
                    d="M 30 210 Q 210 175 340 125 T 640 45"
                    fill="none"
                    stroke="#8C6239"
                    strokeWidth="4"
                    strokeOpacity="0.55"
                  />
                  <path
                    d="M 30 210 Q 210 175 340 125 T 640 45"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                  />

                  {/* Secondary city nodes */}
                  <circle cx="145" cy="182" r="5" fill="#8C6239" />
                  <text x="155" y="186" fill="#9E988E" fontSize="10" fontFamily="JetBrains Mono, monospace">
                    VALET GATE 1
                  </text>

                  <circle cx="525" cy="72" r="5" fill="#8C6239" />
                  <text x="535" y="76" fill="#9E988E" fontSize="10" fontFamily="JetBrains Mono, monospace">
                    HIGHWAY CORRIDOR EXIT
                  </text>

                  {/* Active Terminal Pin Callout */}
                  <circle cx="340" cy="125" r="24" fill="#D4AF37" fillOpacity="0.16" />
                  <circle cx="340" cy="125" r="9" fill="#D4AF37" stroke="#141413" strokeWidth="2.5" />

                  <rect
                    x="210"
                    y="36"
                    width="260"
                    height="62"
                    rx="6"
                    fill="#141413"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                  />
                  <text
                    x="224"
                    y="58"
                    fill="#FAF8F5"
                    fontSize="11.5"
                    fontWeight="600"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {selectedTerminal.loungeName}
                  </text>
                  <text
                    x="224"
                    y="75"
                    fill="#D4AF37"
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {selectedTerminal.city.toUpperCase()} · RATING {selectedTerminal.googleRating}/5.0 (
                    {selectedTerminal.googleReviewCount} REVIEWS)
                  </text>
                  <text
                    x="224"
                    y="90"
                    fill="#C5B396"
                    fontSize="9"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    Chauffeur Drop Bay · 90-Min Pre-Departure Lounge
                  </text>
                </svg>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#2E2D2A] text-xs text-[#B8B2A6] z-10">
              <span>Address: {selectedTerminal.address}</span>
              <span className="font-mono text-[#FAF8F5]">GPS VALET READY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Reviews Integration & Live Review Submission */}
      <div className="pt-8 border-t border-[#E5DEC9] space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#8C6239]">
              Verified Reviews Integration · Google Business & PNR Synced
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413] mt-1">
              Authenticated Passenger Reviews ({stats.totalCount})
            </h2>
          </div>

          {/* Filter by Corridor */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F4F0EA] rounded-lg">
            {['All', 'Mumbai', 'Bengaluru', 'Chennai'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCorridorFilter(c)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  corridorFilter === c
                    ? 'bg-[#141413] text-[#FAF8F5]'
                    : 'text-[#5C5852] hover:text-[#141413]'
                }`}
              >
                {c === 'All' ? 'All Corridors' : `${c} Routes`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Cols: Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {filteredReviews.map((rev) => (
              <article
                key={rev.id}
                className="bg-white rounded-xl border border-[#E2DCD0] p-6 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#656059] border-b border-[#EFECE6] pb-2.5">
                  <div className="flex items-center flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]"
                          aria-hidden="true"
                        />
                      ))}
                    </span>
                    <span className="font-mono font-bold text-[#141413]">{rev.rating}.0</span>
                    <span className="mx-1" aria-hidden="true">·</span>
                    <span>{rev.source}</span>
                    <span className="mx-1" aria-hidden="true">·</span>
                    <span className="font-mono">PNR: {rev.verifiedPnr}</span>
                  </div>
                  <span>{rev.publishedDate}</span>
                </div>

                <h3 className="text-base font-semibold text-[#141413]">{rev.title}</h3>
                <p className="text-xs sm:text-sm text-[#4A4640] leading-relaxed">
                  “{rev.comment}”
                </p>

                <div className="pt-2 text-xs text-[#656059]">
                  <strong className="text-[#141413]">{rev.passengerName}</strong> ·{' '}
                  {rev.passengerRole} · <span>{rev.corridor}</span> ({rev.suiteType})
                </div>
              </article>
            ))}
          </div>

          {/* Right 5 Cols: Submit a Verified Review Form */}
          <form
            onSubmit={handleReviewSubmit}
            className="lg:col-span-5 bg-white rounded-xl border border-[#DED7C8] p-6 space-y-4"
            noValidate
          >
            <div className="border-b border-[#EFECE6] pb-3">
              <h3 className="font-display text-2xl font-semibold text-[#141413]">
                Publish Verified Journey Review
              </h3>
              <p className="text-xs text-[#656059] mt-0.5">
                Reviews sync directly with our corridor ledger and Google Business widget.
              </p>
            </div>

            {reviewSubmitted && (
              <div
                role="status"
                className="p-3 rounded-lg bg-[#EDF7F0] border border-[#B7DFC4] text-xs font-medium text-[#1B5E37]"
              >
                Thank you. Your verified review has been published to the live passenger feed.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="rev-name" className="block text-xs font-medium text-[#4A4640] mb-1">
                  Passenger Full Name
                </label>
                <input
                  id="rev-name"
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="e.g. Harshvardhan Singh"
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg text-[#141413]"
                  required
                />
              </div>
              <div>
                <label htmlFor="rev-pnr" className="block text-xs font-medium text-[#4A4640] mb-1">
                  Booking PNR
                </label>
                <input
                  id="rev-pnr"
                  type="text"
                  value={verifiedPnr}
                  onChange={(e) => setVerifiedPnr(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg text-[#141413]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="rev-corridor" className="block text-xs font-medium text-[#4A4640] mb-1">
                  Corridor Travelled
                </label>
                <select
                  id="rev-corridor"
                  value={corridor}
                  onChange={(e) => setCorridor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg text-[#141413]"
                >
                  <option value="Mumbai to Udaipur">Mumbai to Udaipur</option>
                  <option value="New Delhi to Jaipur">New Delhi to Jaipur</option>
                  <option value="Mumbai to Goa">Mumbai to Goa</option>
                  <option value="Bengaluru to Hyderabad">Bengaluru to Hyderabad</option>
                  <option value="New Delhi to Udaipur">New Delhi to Udaipur</option>
                  <option value="Chennai to Mysuru">Chennai to Mysuru</option>
                </select>
              </div>
              <div>
                <label htmlFor="rev-rating" className="block text-xs font-medium text-[#4A4640] mb-1">
                  Rating
                </label>
                <select
                  id="rev-rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg text-[#141413]"
                >
                  <option value={5}>5.0 / 5.0 — Exceptional</option>
                  <option value={4}>4.0 / 5.0 — Distinguished</option>
                  <option value={3}>3.0 / 5.0 — Satisfactory</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="rev-title" className="block text-xs font-medium text-[#4A4640] mb-1">
                Review Headline
              </label>
              <input
                id="rev-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your overnight suite experience"
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg text-[#141413]"
                required
              />
            </div>

            <div>
              <label htmlFor="rev-comment" className="block text-xs font-medium text-[#4A4640] mb-1">
                Detailed Review
              </label>
              <textarea
                id="rev-comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share feedback on cabin acoustics, flat bed comfort, or culinary service..."
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg text-[#141413]"
                required
              />
            </div>

            {reviewError && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-[#FDF2F2] border border-[#F5C2C2] text-xs font-medium text-[#9B1C1C]"
              >
                {reviewError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#141413] hover:bg-[#292826] text-[#FAF8F5] text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Submit Verified Review
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
