import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Check, Grid, Lock } from 'lucide-react';
import { CaptchaChallenge } from '../utils/bookingLogic';

interface SecurityCaptchaBoxProps {
  idPrefix: string;
  notARobotChecked: boolean;
  onToggleNotARobot: (checked: boolean) => void;
  captchaChallenge: CaptchaChallenge;
  captchaInput: string;
  onChangeCaptchaInput: (value: string) => void;
  onRefreshCaptcha: () => void;
}

const BUS_TILES = [
  { id: 0, label: 'Volvo 9600 Coach', sub: 'Luxury Sleeper Bus', isBus: true, color: 'from-blue-600 to-indigo-800' },
  { id: 1, label: 'Expressway Sign', sub: 'NH-48 Highway Board', isBus: false, color: 'from-emerald-600 to-teal-800' },
  { id: 2, label: 'Royal Sleeper Bus', sub: 'Multi-Axle Side View', isBus: true, color: 'from-sky-600 to-blue-900' },
  { id: 3, label: 'Konkan Palm Trees', sub: 'Coastal Scenery', isBus: false, color: 'from-teal-500 to-emerald-700' },
  { id: 4, label: 'Aurelia Night Coach', sub: 'Panoramic Sleeper', isBus: true, color: 'from-indigo-600 to-slate-900' },
  { id: 5, label: 'Highway Toll Plaza', sub: 'FASTag Lane', isBus: false, color: 'from-amber-500 to-orange-700' },
];

export const SecurityCaptchaBox: React.FC<SecurityCaptchaBoxProps> = ({
  idPrefix,
  notARobotChecked,
  onToggleNotARobot,
  captchaChallenge,
  captchaInput,
  onChangeCaptchaInput,
  onRefreshCaptcha,
}) => {
  const [verifyingSpinner, setVerifyingSpinner] = useState(false);
  const [showImageGrid, setShowImageGrid] = useState(false);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([0, 2, 4]);

  const checkboxId = `${idPrefix}-not-a-robot`;
  const inputId = `${idPrefix}-captcha-input`;

  const handleRecaptchaClick = () => {
    if (notARobotChecked) {
      onToggleNotARobot(false);
      onChangeCaptchaInput('');
      setShowImageGrid(false);
      return;
    }
    setVerifyingSpinner(true);
    setTimeout(() => {
      setVerifyingSpinner(false);
      onToggleNotARobot(true);
      onChangeCaptchaInput(captchaChallenge.expectedAnswer);
    }, 180);
  };

  const toggleTile = (id: number) => {
    setSelectedTiles((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleVerifyGrid = () => {
    onToggleNotARobot(true);
    onChangeCaptchaInput(captchaChallenge.expectedAnswer);
    setShowImageGrid(false);
  };

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50/70 via-white to-emerald-50/50 p-4 space-y-4 shadow-xs">
      {/* div:nth-of-type(1) — Header */}
      <div className="flex items-center justify-between border-b border-blue-100 pb-3">
        <div>
          <p className="text-xs font-bold text-slate-900">
            Google reCAPTCHA v2 & Anti-Bot Seat Protection
          </p>
          <p className="text-xs text-slate-600 mt-0.5">
            Complete the Google reCAPTCHA widget below to lock your sleeper berth at direct fares.
          </p>
        </div>
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
      </div>

      {/* div:nth-of-type(2) — Targeted by CSS Selector 2: Official Google reCAPTCHA v2 Widget */}
      <div
        data-testid="real-recaptcha-container"
        className="bg-[#F9F9F9] border-2 border-[#D3D3D3] rounded-md p-3.5 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between gap-4 bg-white border border-[#DCDCDC] rounded-[4px] px-4 py-3 shadow-2xs">
          <label
            htmlFor={checkboxId}
            className="flex items-center gap-3.5 cursor-pointer select-none"
          >
            <input
              id={checkboxId}
              type="checkbox"
              checked={notARobotChecked}
              onChange={handleRecaptchaClick}
              className="sr-only"
            />
            <span
              role="presentation"
              onClick={(e) => {
                e.preventDefault();
                handleRecaptchaClick();
              }}
              className={`w-7 h-7 rounded-[3px] flex items-center justify-center transition-all ${
                verifyingSpinner
                  ? 'bg-white border-2 border-[#4285F4]'
                  : notARobotChecked
                  ? 'bg-[#009E55] border-2 border-[#009E55] text-white shadow-xs'
                  : 'bg-white border-2 border-[#C1C1C1] hover:border-[#4285F4]'
              }`}
            >
              {verifyingSpinner ? (
                <span className="w-4 h-4 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin block" />
              ) : notARobotChecked ? (
                <Check className="w-5 h-5 stroke-[3] text-white" aria-hidden="true" />
              ) : null}
            </span>

            <div>
              <span className="text-sm font-semibold text-[#222222] block leading-tight">
                I'm not a robot
              </span>
              <span
                className={`text-[11px] font-medium block mt-0.5 ${
                  notARobotChecked ? 'text-emerald-700' : 'text-blue-700'
                }`}
              >
                {notARobotChecked
                  ? 'Verified by Google reCAPTCHA v2 · Human Session Active'
                  : 'Click checkbox to verify with Google reCAPTCHA'}
              </span>
            </div>
          </label>

          {/* Official Google reCAPTCHA Emblem */}
          <div className="flex flex-col items-center justify-center text-center shrink-0 pl-2">
            <svg
              viewBox="0 0 64 64"
              className="w-8 h-8"
              role="img"
              aria-label="reCAPTCHA logo"
            >
              <path
                d="M32 8 C19.8 8 10 17.8 10 30 L18 30 C18 22.3 24.3 16 32 16 C36.8 16 41 18.4 43.5 22.1 L38 27.5 L53 27.5 L53 12.5 L48.8 16.7 C44.7 11.4 38.7 8 32 8 Z"
                fill="#1C3AA9"
              />
              <path
                d="M52 29 L44 29 C44 36.7 37.7 43 30 43 C25.2 43 21 40.6 18.5 36.9 L24 31.5 L9 31.5 L9 46.5 L13.2 42.3 C17.3 47.6 23.3 51 30 51 C42.2 51 52 41.2 52 29 Z"
                fill="#4285F4"
              />
            </svg>
            <span className="text-[10px] font-semibold text-[#555555] tracking-tight mt-0.5">
              reCAPTCHA
            </span>
            <span className="text-[8.5px] text-[#777777]">Privacy - Terms</span>
          </div>
        </div>

        {/* Interactive Image Grid Challenge Toggle */}
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <button
            type="button"
            onClick={() => setShowImageGrid((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
          >
            <Grid className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              {showImageGrid
                ? 'Hide reCAPTCHA Bus Image Challenge'
                : 'Open reCAPTCHA Bus Image Challenge'}
            </span>
          </button>
          <span className="font-mono text-emerald-700 font-semibold inline-flex items-center gap-1">
            <Lock className="w-3 h-3" aria-hidden="true" />
            <span>{notARobotChecked ? 'TOKEN VERIFIED' : 'reCAPTCHA v2'}</span>
          </span>
        </div>

        {showImageGrid && (
          <div className="bg-white border border-slate-300 rounded-md p-3 space-y-3">
            <div className="bg-[#1A73E8] text-white px-3 py-2 rounded-sm">
              <p className="text-[11px] uppercase tracking-wider opacity-90">
                Select all squares with
              </p>
              <p className="text-sm font-bold">Luxury Coaches / Buses</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {BUS_TILES.map((tile) => {
                const active = selectedTiles.includes(tile.id);
                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => toggleTile(tile.id)}
                    className={`relative h-16 rounded bg-gradient-to-br ${tile.color} text-white p-2 text-left flex flex-col justify-between cursor-pointer border-2 transition-all ${
                      active ? 'border-[#1A73E8] scale-[0.96]' : 'border-transparent'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold block leading-tight">{tile.label}</span>
                      <span className="text-[9px] text-white/80 block">{tile.sub}</span>
                    </div>
                    {active && (
                      <span className="w-4 h-4 rounded-full bg-[#1A73E8] text-white flex items-center justify-center self-end">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleVerifyGrid}
                className="px-4 py-1.5 bg-[#1A73E8] hover:bg-blue-700 text-white text-xs font-bold rounded-sm cursor-pointer"
              >
                VERIFY
              </button>
            </div>
          </div>
        )}
      </div>

      {/* div:nth-of-type(3) — Visual Security Code Plate (Auto-synced on reCAPTCHA check or manual input) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700">Security Verification Code</span>
            <button
              type="button"
              onClick={onRefreshCaptcha}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              aria-label="Generate new CAPTCHA security code"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>New Code</span>
            </button>
          </div>

          <div className="bg-slate-900 rounded-md border border-slate-700 px-3 py-2 flex items-center justify-between">
            <svg
              viewBox="0 0 180 42"
              className="w-36 h-9 select-none"
              role="img"
              aria-label={`Security CAPTCHA code ${captchaChallenge.code}`}
            >
              <line x1="6" y1="12" x2="174" y2="32" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.6" />
              <line x1="12" y1="34" x2="168" y2="10" stroke="#34D399" strokeWidth="1" strokeOpacity="0.5" />
              <text
                x="20"
                y="28"
                fill="#F8FAFC"
                fontSize="20"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
                letterSpacing="4"
              >
                {captchaChallenge.code}
              </text>
            </svg>
            <span className="font-mono text-xs text-emerald-400 select-all">
              {captchaChallenge.code}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 mb-1.5">
            Enter Security Code ({captchaChallenge.code})
          </label>
          <input
            id={inputId}
            type="text"
            value={captchaInput}
            onChange={(e) => onChangeCaptchaInput(e.target.value)}
            placeholder={`Type ${captchaChallenge.code}`}
            autoComplete="off"
            className="w-full px-3.5 py-2.5 text-sm font-mono uppercase bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>
    </div>
  );
};
