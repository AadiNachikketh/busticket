import React, { useState } from 'react';
import { Sparkles, Eye, CheckCircle2 } from 'lucide-react';

interface HeroMotorcoachIllustrationProps {
  onQuickSelectSeat?: (seatId?: string) => void;
}

export const HeroMotorcoachIllustration: React.FC<HeroMotorcoachIllustrationProps> = ({
  onQuickSelectSeat,
}) => {
  const [activeScene, setActiveScene] = useState<'exterior' | 'suite' | 'lounge'>('exterior');

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[430px] bg-gradient-to-br from-[#0A192F] via-[#1E3A8A] to-[#0F766E] text-white overflow-hidden rounded-2xl border-2 border-sky-400/40 shadow-xl flex flex-col justify-between p-4 sm:p-5 lg:p-6">
      {/* Golden Hour Sunset & Mountain Highway Backdrop */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="skySunset" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="42%" stopColor="#1D4ED8" />
            <stop offset="75%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="sunOrb" cx="78%" cy="24%" r="34%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#F97316" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="highwaySurface" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        <rect width="800" height="500" fill="url(#skySunset)" />
        <circle cx="625" cy="125" r="195" fill="url(#sunOrb)" />

        {/* Western Ghats & Aravalli Mountain Silhouettes */}
        <path
          d="M 0 330 L 110 220 L 220 290 L 370 185 L 510 275 L 650 205 L 800 285 L 800 370 L 0 370 Z"
          fill="#0F172A"
          fillOpacity="0.45"
        />
        <path
          d="M 0 355 L 160 270 L 310 325 L 480 245 L 640 315 L 800 265 L 800 385 L 0 385 Z"
          fill="#091326"
          fillOpacity="0.72"
        />

        {/* Express Highway Surface */}
        <rect x="0" y="348" width="800" height="152" fill="url(#highwaySurface)" />
        <line x1="0" y1="350" x2="800" y2="350" stroke="#38BDF8" strokeWidth="2" strokeOpacity="0.65" />
        <line
          x1="40"
          y1="422"
          x2="760"
          y2="422"
          stroke="#FACC15"
          strokeWidth="3.5"
          strokeDasharray="28 22"
          strokeOpacity="0.85"
        />
      </svg>

      {/* Top Interactive Gallery Switcher & Fare Highlight */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/20 pb-3">
        <div className="grid grid-cols-3 sm:flex items-center gap-1 w-full sm:w-auto bg-slate-950/55 p-1 rounded-xl border border-white/15">
          <button
            type="button"
            onClick={() => setActiveScene('exterior')}
            className={`min-h-[36px] px-2 sm:px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer truncate ${
              activeScene === 'exterior'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'text-sky-100 hover:text-white'
            }`}
          >
            1. Exterior Coach
          </button>
          <button
            type="button"
            onClick={() => setActiveScene('suite')}
            className={`min-h-[36px] px-2 sm:px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer truncate ${
              activeScene === 'suite'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'text-sky-100 hover:text-white'
            }`}
          >
            2. Sleeper Suite
          </button>
          <button
            type="button"
            onClick={() => setActiveScene('lounge')}
            className={`min-h-[36px] px-2 sm:px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer truncate ${
              activeScene === 'lounge'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'text-sky-100 hover:text-white'
            }`}
          >
            3. Sky & Dining
          </button>
        </div>

        <span className="hidden sm:inline-block font-mono text-xs text-amber-300 font-bold bg-slate-950/50 px-2.5 py-1 rounded-md border border-amber-400/30">
          FARES FROM ₹899
        </span>
      </div>

      {/* Central Full-Color Gleaming Luxury Coach / Interior Artwork */}
      <div className="relative z-10 my-auto py-3">
        {activeScene === 'exterior' && (
          <div className="space-y-2">
            <svg
              viewBox="0 0 760 235"
              className="w-full h-auto drop-shadow-2xl"
              role="img"
              aria-label="Vibrant golden-hour illustration of the Aurelia Overland Pearl White, Royal Sapphire, and Emerald Volvo 9600 luxury sleeper coach"
            >
              <defs>
                <linearGradient id="pearlCoachBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="55%" stopColor="#F8FAFC" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>
                <linearGradient id="royalLiveryStripe" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1D4ED8" />
                  <stop offset="50%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="warmCabinGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0F172A" />
                  <stop offset="55%" stopColor="#1E3A8A" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.88" />
                </linearGradient>
              </defs>

              {/* Road shadow under coach */}
              <ellipse cx="390" cy="208" rx="335" ry="13" fill="#020617" fillOpacity="0.8" />

              {/* Main Aerodynamic Pearl White & Metallic Blue Coach Shell */}
              <path
                d="M 44 186 L 44 62 Q 44 26 90 24 L 664 24 Q 708 24 726 66 L 738 142 Q 740 186 712 186 Z"
                fill="url(#pearlCoachBody)"
                stroke="#38BDF8"
                strokeWidth="2.5"
              />

              {/* Dynamic Royal Blue & Emerald Aerodynamic Livery Wave */}
              <path
                d="M 44 120 L 520 120 Q 620 120 734 94 L 738 148 L 44 156 Z"
                fill="url(#royalLiveryStripe)"
              />
              <path d="M 44 156 L 738 148 L 734 162 L 44 166 Z" fill="#F59E0B" />

              {/* Upper Deck Panoramic Sky Sleeper Windows (Clickable) */}
              {[
                { x: 84, id: 'U1A', label: 'U1A · ₹899+' },
                { x: 220, id: 'U2A', label: 'U2A · SKY POD' },
                { x: 356, id: 'U3A', label: 'U3A · SKY POD' },
                { x: 492, id: 'U4A', label: 'U4A · AVAILABLE' },
              ].map((win) => (
                <g
                  key={win.id}
                  onClick={() => onQuickSelectSeat && onQuickSelectSeat(win.id)}
                  className="cursor-pointer"
                >
                  <rect
                    x={win.x}
                    y={36}
                    width={122}
                    height={56}
                    rx={8}
                    fill="url(#warmCabinGlow)"
                    stroke="#38BDF8"
                    strokeWidth="2"
                  />
                  <circle cx={win.x + 98} cy={54} r="7" fill="#FDE047" fillOpacity="0.9" />
                  <rect
                    x={win.x + 12}
                    y={72}
                    width={88}
                    height={11}
                    rx={4}
                    fill="#FFFFFF"
                    fillOpacity="0.92"
                  />
                  <text
                    x={win.x + 12}
                    y={56}
                    fill="#FEF08A"
                    fontSize="10.5"
                    fontWeight="700"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {win.label}
                  </text>
                </g>
              ))}

              {/* Lower Deck Private Suite Windows (Clickable) */}
              {[
                { x: 84, id: 'L1A', title: 'L1A · PRESIDENTIAL', sub: '200cm Flat Bed · Click to Select' },
                { x: 264, id: 'L2A', title: 'L2A · SOVEREIGN SUITE', sub: 'Sliding Privacy Door · AC' },
                { x: 444, id: 'L3A', title: 'L3A · LADIES / FAMILY', sub: 'Lie-Flat Quilted Berth' },
              ].map((win) => (
                <g
                  key={win.id}
                  onClick={() => onQuickSelectSeat && onQuickSelectSeat(win.id)}
                  className="cursor-pointer"
                >
                  <rect
                    x={win.x}
                    y={102}
                    width={166}
                    height={46}
                    rx={7}
                    fill="#0F172A"
                    stroke="#FACC15"
                    strokeWidth="2"
                  />
                  <rect
                    x={win.x + 6}
                    y={108}
                    width={154}
                    height={34}
                    rx={5}
                    fill="#F59E0B"
                    fillOpacity="0.25"
                  />
                  <text
                    x={win.x + 12}
                    y={123}
                    fill="#FEF08A"
                    fontSize="10.5"
                    fontWeight="700"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {win.title}
                  </text>
                  <text
                    x={win.x + 12}
                    y={137}
                    fill="#E2E8F0"
                    fontSize="9.5"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {win.sub}
                  </text>
                </g>
              ))}

              {/* Front Panoramic Captain & Steward Windshield */}
              <path
                d="M 624 36 L 698 36 Q 718 62 726 100 L 624 100 Z"
                fill="#0F172A"
                stroke="#38BDF8"
                strokeWidth="2"
              />
              <text
                x="634"
                y="68"
                fill="#38BDF8"
                fontSize="10"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
              >
                VOLVO 9600
              </text>
              <text
                x="634"
                y="84"
                fill="#FDE047"
                fontSize="9"
                fontWeight="700"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                LUXURY BUS
              </text>

              {/* Chrome Multi-Axle Alloy Wheels */}
              {[158, 232, 592].map((cx) => (
                <g key={`wheel-${cx}`}>
                  <circle cx={cx} cy="186" r="24" fill="#0F172A" stroke="#E2E8F0" strokeWidth="3.5" />
                  <circle cx={cx} cy="186" r="14" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2.5" />
                  <circle cx={cx} cy="186" r="5" fill="#F59E0B" />
                </g>
              ))}

              {/* Bright Xenon LED Headlight Beam */}
              <polygon points="734,152 760,132 760,180 734,168" fill="#FEF08A" fillOpacity="0.85" />
            </svg>

            <div className="flex items-center justify-between text-xs bg-slate-950/55 px-3.5 py-2 rounded-lg border border-sky-400/30">
              <span className="text-sky-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Click any glowing cabin window above or button below to pick your seat</span>
              </span>
              {onQuickSelectSeat && (
                <button
                  type="button"
                  onClick={() => onQuickSelectSeat('L1A')}
                  className="text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-4 cursor-pointer whitespace-nowrap ml-2"
                >
                  Quick-Pick Seat →
                </button>
              )}
            </div>
          </div>
        )}

        {activeScene === 'suite' && (
          <div className="bg-slate-950/75 rounded-xl border border-amber-400/40 p-4 space-y-3">
            <svg
              viewBox="0 0 700 200"
              className="w-full h-auto"
              role="img"
              aria-label="Interior view of First-Class Lie-Flat Sleeper Suite with panoramic sunset window and plush bedding"
            >
              <rect x="10" y="10" width="680" height="180" rx="12" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
              {/* Panoramic Sunset Window */}
              <rect x="30" y="24" width="410" height="84" rx="8" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="360" cy="58" r="24" fill="#FDE047" fillOpacity="0.9" />
              <path d="M 30 88 Q 180 55 440 88 L 440 108 L 30 108 Z" fill="#0D9488" fillOpacity="0.75" />
              {/* Plush 200cm Lie-Flat Quilted Bed */}
              <rect x="30" y="122" width="410" height="52" rx="10" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="2.5" />
              <rect x="42" y="128" width="85" height="40" rx="8" fill="#FDE68A" />
              <text x="145" y="152" fill="#0F172A" fontSize="14" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
                200 cm Flat Italian Quilted Sleeper Bed (Suite L1A)
              </text>
              {/* Privacy Sliding Glass Door & Smart Console */}
              <rect x="460" y="24" width="210" height="150" rx="8" fill="#1E293B" stroke="#34D399" strokeWidth="2" />
              <text x="480" y="54" fill="#6EE7B7" fontSize="12" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                SUITE AMENITIES Included:
              </text>
              <text x="480" y="80" fill="#F8FAFC" fontSize="11.5" fontFamily="Plus Jakarta Sans, sans-serif">
                • Sliding Acoustic Glass Door
              </text>
              <text x="480" y="102" fill="#F8FAFC" fontSize="11.5" fontFamily="Plus Jakarta Sans, sans-serif">
                • Individual AC & Reading Lamp
              </text>
              <text x="480" y="124" fill="#F8FAFC" fontSize="11.5" fontFamily="Plus Jakarta Sans, sans-serif">
                • High-Speed Wi-Fi & USB-C Port
              </text>
              <text x="480" y="148" fill="#FDE047" fontSize="12" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                • Direct Fare: ₹1,099 – ₹1,899
              </text>
            </svg>
          </div>
        )}

        {activeScene === 'lounge' && (
          <div className="bg-slate-950/75 rounded-xl border border-emerald-400/40 p-4 space-y-3">
            <svg
              viewBox="0 0 700 200"
              className="w-full h-auto"
              role="img"
              aria-label="Upper Deck Sky Pod and Onboard Hot Meal & Filter Coffee Pantry"
            >
              <rect x="10" y="10" width="680" height="180" rx="12" fill="#0F172A" stroke="#34D399" strokeWidth="2" />
              <rect x="28" y="26" width="310" height="148" rx="10" fill="#064E3B" stroke="#34D399" strokeWidth="1.5" />
              <text x="48" y="56" fill="#A7F3D0" fontSize="13" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                ONBOARD HOT DINING & CHAI BAR
              </text>
              <text x="48" y="84" fill="#ECFDF5" fontSize="11.5" fontFamily="Plus Jakarta Sans, sans-serif">
                • Fresh Regional Thali & Jain Meal Boxes
              </text>
              <text x="48" y="108" fill="#ECFDF5" fontSize="11.5" fontFamily="Plus Jakarta Sans, sans-serif">
                • Morning South Indian Filter Coffee & Chai
              </text>
              <text x="48" y="132" fill="#FEF08A" fontSize="11.5" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
                • Served Directly at Your Berth Table
              </text>

              <rect x="358" y="26" width="314" height="148" rx="10" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1.5" />
              <text x="378" y="56" fill="#BAE6FD" fontSize="13" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                UPPER DECK SKY PODS (U1A–U4B)
              </text>
              <text x="378" y="84" fill="#F0F9FF" fontSize="11.5" fontFamily="Plus Jakarta Sans, sans-serif">
                • Panoramic Starlight & Ghat Horizon Glass
              </text>
              <text x="378" y="108" fill="#F0F9FF" fontSize="11.5" fontFamily="Plus Jakarta Sans, sans-serif">
                • Zero-Gravity Recliner + Fresh Cotton Duvet
              </text>
              <text x="378" y="132" fill="#FDE047" fontSize="12" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                • Fares Starting at Just ₹899
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* Bottom Colorful Route & Price Highlights */}
      <div className="relative z-10 grid grid-cols-3 gap-2.5 border-t border-white/20 pt-3.5 text-xs">
        <div
          onClick={() => onQuickSelectSeat && onQuickSelectSeat('U1A')}
          className="bg-slate-950/55 hover:bg-slate-950/80 border border-amber-400/40 rounded-lg px-3 py-2 cursor-pointer transition-all"
        >
          <p className="text-sky-200 text-[11px] font-medium">Delhi ↔ Jaipur</p>
          <p className="font-mono text-sm font-bold text-amber-300 mt-0.5 tabular-nums">
            From ₹899
          </p>
        </div>
        <div
          onClick={() => onQuickSelectSeat && onQuickSelectSeat('U2A')}
          className="bg-slate-950/55 hover:bg-slate-950/80 border border-emerald-400/40 rounded-lg px-3 py-2 cursor-pointer transition-all"
        >
          <p className="text-sky-200 text-[11px] font-medium">Mumbai ↔ Goa</p>
          <p className="font-mono text-sm font-bold text-emerald-300 mt-0.5 tabular-nums">
            From ₹1,299
          </p>
        </div>
        <div
          onClick={() => onQuickSelectSeat && onQuickSelectSeat('L1A')}
          className="bg-slate-950/55 hover:bg-slate-950/80 border border-sky-400/40 rounded-lg px-3 py-2 cursor-pointer transition-all"
        >
          <p className="text-sky-200 text-[11px] font-medium">Mumbai ↔ Udaipur</p>
          <p className="font-mono text-sm font-bold text-sky-300 mt-0.5 tabular-nums">
            From ₹1,499
          </p>
        </div>
      </div>
    </div>
  );
};

export const RouteScenicBanner: React.FC<{
  routeId: string;
  origin: string;
  destination: string;
  coachCode: string;
  baseFareInr: number;
}> = ({ routeId, origin, destination, coachCode, baseFareInr }) => {
  // Distinct vibrant color theme per Indian corridor
  const themes: Record<
    string,
    { gradient: string; accent: string; landmark: string; tagBg: string }
  > = {
    'route-bom-udr-01': {
      gradient: 'from-indigo-900 via-blue-800 to-amber-600',
      accent: '#FDE047',
      landmark: 'Lake Pichola & Mewar Palace Sunset Express',
      tagBg: 'bg-amber-400 text-slate-950',
    },
    'route-del-jai-02': {
      gradient: 'from-rose-900 via-fuchsia-800 to-amber-500',
      accent: '#FDBA74',
      landmark: 'Pink City Hawa Mahal & Expressway Salon',
      tagBg: 'bg-emerald-400 text-slate-950',
    },
    'route-bom-goi-03': {
      gradient: 'from-teal-900 via-emerald-700 to-sky-500',
      accent: '#6EE7B7',
      landmark: 'Konkan Coastal Palm Highway & Arabian Sea',
      tagBg: 'bg-sky-300 text-slate-950',
    },
    'route-blr-hyd-04': {
      gradient: 'from-blue-950 via-indigo-800 to-cyan-600',
      accent: '#7DD3FC',
      landmark: 'Deccan Plateau & Charminar Starlight Express',
      tagBg: 'bg-amber-300 text-slate-950',
    },
    'route-del-udr-05': {
      gradient: 'from-purple-950 via-indigo-800 to-amber-600',
      accent: '#FDE68A',
      landmark: 'Aravalli Range & Fateh Sagar Lakefront',
      tagBg: 'bg-emerald-300 text-slate-950',
    },
    'route-maa-myq-06': {
      gradient: 'from-emerald-950 via-teal-800 to-amber-500',
      accent: '#FDE047',
      landmark: 'Illuminated Mysuru Palace & Cauvery Corridor',
      tagBg: 'bg-amber-400 text-slate-950',
    },
  };

  const theme = themes[routeId] || themes['route-bom-udr-01'];

  return (
    <div
      className={`relative w-full h-36 rounded-xl bg-gradient-to-r ${theme.gradient} overflow-hidden p-3.5 flex flex-col justify-between text-white border border-white/20 shadow-sm`}
    >
      {/* Decorative Scenic Landmark & Luxury Coach Silhouette SVG */}
      <svg
        viewBox="0 0 400 130"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <circle cx="335" cy="34" r="34" fill={theme.accent} fillOpacity="0.28" />
        <circle cx="335" cy="34" r="16" fill={theme.accent} fillOpacity="0.65" />
        <path
          d="M 0 98 Q 95 66 200 92 T 400 76 L 400 130 L 0 130 Z"
          fill="#0F172A"
          fillOpacity="0.6"
        />
        {/* Sleek Mini Luxury Coach Graphic on Upper Right Highway */}
        <g transform="translate(246, 36) scale(0.85)">
          <rect
            x="0"
            y="8"
            width="162"
            height="38"
            rx="8"
            fill="#FFFFFF"
            fillOpacity="0.95"
            stroke="#38BDF8"
            strokeWidth="1.5"
          />
          <rect x="8" y="13" width="32" height="14" rx="3" fill="#0F172A" />
          <rect x="44" y="13" width="32" height="14" rx="3" fill="#0F172A" />
          <rect x="80" y="13" width="32" height="14" rx="3" fill="#0F172A" />
          <rect x="116" y="13" width="36" height="14" rx="3" fill="#0284C7" />
          <rect x="0" y="31" width="162" height="6" fill="#1D4ED8" />
          <circle cx="32" cy="46" r="7" fill="#0F172A" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="130" cy="46" r="7" fill="#0F172A" stroke="#E2E8F0" strokeWidth="2" />
        </g>
      </svg>

      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="px-2.5 py-0.5 rounded-md bg-slate-950/75 text-[11px] font-mono font-bold text-white border border-white/20">
          {coachCode} · VOLVO 9600
        </span>
        <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-extrabold ${theme.tagBg}`}>
          ₹{baseFareInr.toLocaleString('en-IN')}
        </span>
      </div>

      <div className="relative z-10 bg-slate-950/55 backdrop-blur-2xs rounded-lg px-2.5 py-1.5 border border-white/10">
        <p className="font-display text-lg sm:text-xl font-bold text-white leading-tight">
          {origin} to {destination}
        </p>
        <p className="text-[11px] text-sky-100 font-medium truncate">{theme.landmark}</p>
      </div>
    </div>
  );
};

export const SuiteCutawayIllustration: React.FC<{
  variant: 'presidential' | 'sleeper' | 'salon';
}> = ({ variant }) => {
  const bgClass =
    variant === 'presidential'
      ? 'from-blue-950 via-indigo-900 to-amber-800'
      : variant === 'sleeper'
      ? 'from-slate-900 via-sky-900 to-teal-800'
      : 'from-emerald-950 via-teal-900 to-cyan-800';

  return (
    <div
      className={`w-full aspect-[4/3] bg-gradient-to-br ${bgClass} rounded-xl border-2 border-sky-400/35 p-4 flex flex-col justify-between overflow-hidden relative text-white shadow-md`}
    >
      <div className="flex items-center justify-between text-xs text-sky-100 border-b border-white/20 pb-2">
        <span className="font-semibold">
          {variant === 'presidential'
            ? 'Lower Deck · Suite L1A'
            : variant === 'sleeper'
            ? 'Upper Deck · Sky Berth U1A'
            : 'Onboard Pantry · Hot Dining'}
        </span>
        <span className="font-mono text-amber-300 font-bold">
          {variant === 'presidential'
            ? '₹1,299 – ₹1,899'
            : variant === 'sleeper'
            ? '₹899 – ₹1,499'
            : 'INCLUDED FREE'}
        </span>
      </div>

      <svg
        viewBox="0 0 360 190"
        className="w-full h-auto my-auto"
        role="img"
        aria-label={`Vibrant full-color illustration for ${variant} cabin`}
      >
        <rect
          x="12"
          y="12"
          width="336"
          height="166"
          rx="10"
          fill="#0F172A"
          fillOpacity="0.7"
          stroke="#38BDF8"
          strokeWidth="1.8"
        />
        {variant === 'presidential' && (
          <>
            {/* Sunset Scenic Window */}
            <rect
              x="28"
              y="24"
              width="200"
              height="64"
              rx="6"
              fill="#1E3A8A"
              stroke="#F59E0B"
              strokeWidth="1.8"
            />
            <circle cx="185" cy="48" r="15" fill="#FDE047" fillOpacity="0.9" />
            <path d="M 28 74 Q 110 50 228 74 L 228 88 L 28 88 Z" fill="#0D9488" fillOpacity="0.75" />
            {/* Plush Quilted Lie-Flat Bed */}
            <rect
              x="28"
              y="104"
              width="216"
              height="50"
              rx="8"
              fill="#FFFBEB"
              stroke="#F59E0B"
              strokeWidth="2.2"
            />
            <rect x="36" y="110" width="48" height="38" rx="6" fill="#FDE68A" />
            {/* Personal Entertainment & Refreshment Console */}
            <rect
              x="258"
              y="24"
              width="74"
              height="130"
              rx="6"
              fill="#1E293B"
              stroke="#38BDF8"
              strokeWidth="1.5"
            />
            <circle cx="295" cy="62" r="15" fill="#0284C7" stroke="#BAE6FD" strokeWidth="1.5" />
            <text
              x="38"
              y="46"
              fill="#FEF08A"
              fontSize="9.5"
              fontWeight="700"
              fontFamily="JetBrains Mono, monospace"
            >
              PANORAMIC PRIVACY GLASS
            </text>
            <text
              x="92"
              y="133"
              fill="#0F172A"
              fontSize="10.5"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              200cm Flat Quilted Berth
            </text>
          </>
        )}
        {variant === 'sleeper' && (
          <>
            <rect
              x="36"
              y="28"
              width="288"
              height="66"
              rx="8"
              fill="#0369A1"
              stroke="#38BDF8"
              strokeWidth="1.8"
            />
            <circle cx="80" cy="54" r="3.5" fill="#FEF08A" />
            <circle cx="140" cy="46" r="3" fill="#FEF08A" />
            <circle cx="220" cy="52" r="3.5" fill="#FEF08A" />
            <circle cx="285" cy="48" r="3" fill="#FEF08A" />
            <rect
              x="36"
              y="108"
              width="288"
              height="48"
              rx="8"
              fill="#E0F2FE"
              stroke="#0284C7"
              strokeWidth="2.2"
            />
            <text
              x="54"
              y="66"
              fill="#FEF08A"
              fontSize="10.5"
              fontWeight="700"
              fontFamily="JetBrains Mono, monospace"
            >
              SKYVIEW WINDOW · ZERO-GRAVITY RECLINE
            </text>
            <text
              x="64"
              y="136"
              fill="#0F172A"
              fontSize="10.5"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Fresh Cotton Duvet & USB-C Fast Charger
            </text>
          </>
        )}
        {variant === 'salon' && (
          <>
            <rect
              x="28"
              y="28"
              width="140"
              height="130"
              rx="8"
              fill="#065F46"
              stroke="#34D399"
              strokeWidth="1.8"
            />
            <rect
              x="192"
              y="28"
              width="140"
              height="130"
              rx="8"
              fill="#1E3A8A"
              stroke="#60A5FA"
              strokeWidth="1.8"
            />
            <circle
              cx="180"
              cy="94"
              r="32"
              fill="#F59E0B"
              stroke="#FEF08A"
              strokeWidth="2.2"
            />
            <text
              x="154"
              y="98"
              fill="#0F172A"
              fontSize="9.5"
              fontWeight="700"
              fontFamily="JetBrains Mono, monospace"
            >
              HOT MEALS
            </text>
            <text
              x="44"
              y="64"
              fill="#ECFDF5"
              fontSize="10.5"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Regional Thali Box
            </text>
            <text
              x="210"
              y="64"
              fill="#EFF6FF"
              fontSize="10.5"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Filter Coffee Bar
            </text>
          </>
        )}
      </svg>

      <div className="flex items-center justify-between text-xs text-sky-100 pt-2 border-t border-white/20">
        <span>Individual AC & Reading Light</span>
        <span className="font-mono text-emerald-300 font-semibold">GPS & CCTV SECURED</span>
      </div>
    </div>
  );
};
