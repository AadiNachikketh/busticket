import React, { useState } from 'react';
import {
  AppointmentRequest,
  INDIAN_TERMINALS,
  IndianCity,
} from '../utils/bookingLogic';
import { SuiteCutawayIllustration } from './ArchitecturalVisuals';
import {
  Calendar,
  CheckCircle2,
  FileText,
  PhoneCall,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

interface ServicesAndAppointmentsViewProps {
  appointments: AppointmentRequest[];
  onCreateAppointment: (appt: AppointmentRequest) => void;
  onNavigateToBooking: () => void;
}

export const ServicesAndAppointmentsView: React.FC<ServicesAndAppointmentsViewProps> = ({
  appointments,
  onCreateAppointment,
  onNavigateToBooking,
}) => {
  const [clientName, setClientName] = useState('Rajyavardhan Rathore');
  const [clientPhone, setClientPhone] = useState('+91 98290 44120');
  const [clientEmail, setClientEmail] = useState('rajyavardhan@mewarholdings.in');
  const [terminalCity, setTerminalCity] = useState<IndianCity>('Udaipur');
  const [serviceType, setServiceType] =
    useState<AppointmentRequest['serviceType']>('Royal Wedding Fleet Charter');
  const [preferredDate, setPreferredDate] = useState('2026-10-28');
  const [preferredTime, setPreferredTime] = useState('11:30');
  const [notes, setNotes] = useState(
    'Requiring 3 full 14-suite coaches for wedding guests travelling from Mumbai & Delhi to Udaipur.'
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [latestAppt, setLatestAppt] = useState<AppointmentRequest | null>(null);

  const handleSubmitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!clientName.trim() || clientName.trim().length < 3) {
      setFormError('Please enter your full name for the concierge appointment.');
      return;
    }
    if (!clientPhone.trim() || clientPhone.trim().length < 8) {
      setFormError('Please enter a valid 10-digit Indian phone or WhatsApp number.');
      return;
    }
    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setFormError('Please enter a valid email address for appointment confirmation.');
      return;
    }

    const created: AppointmentRequest = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      terminalCity,
      serviceType,
      preferredDate,
      preferredTime,
      notes: notes.trim(),
      status: 'Confirmed',
    };

    setLatestAppt(created);
    onCreateAppointment(created);
  };

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-10 space-y-14">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5DEC9] pb-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium text-[#8C6239]">
            Bespoke Transit Services · Appointment Booking · Premium Package Architecture
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#141413] leading-tight">
            Hospitality Services, Private Charters & Concierge Appointments.
          </h1>
          <p className="text-sm text-[#4A4640] leading-relaxed">
            From individual Presidential Suite bookings to full-coach Royal Wedding charters across
            Rajasthan, Maharashtra, Goa, and Karnataka, explore our complete service portfolio and
            schedule a private terminal consultation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="tel:+912268491100"
            className="px-4 py-2.5 bg-white hover:bg-[#F4F0EA] text-[#141413] text-xs font-semibold rounded-lg border border-[#D5CEC2] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#8C6239]" aria-hidden="true" />
            <span>Call Desk: +91 22 6849 1100</span>
          </a>
          <a
            href="https://wa.me/919820177420?text=Hello%20Aurelia%20Overland%20Concierge%2C%20I%20would%20like%20to%20inquire%20about%20a%20private%20suite%20or%20charter."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-[#1B5E37] hover:bg-[#14492A] text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
            <span>WhatsApp Concierge</span>
          </a>
        </div>
      </div>

      {/* 01. Three Core Cabin & Charter Services */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#141413]">
            01. Bespoke Fleet & Hospitality Services
          </h2>
          <button
            type="button"
            onClick={onNavigateToBooking}
            className="text-xs font-semibold text-[#8C6239] hover:text-[#141413] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Book Scheduled Suite</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          <div className="bg-white rounded-xl border border-[#E2DCD0] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <SuiteCutawayIllustration variant="presidential" />
              <div className="text-xs text-[#8C6239]">
                <span>Scheduled Intercity Service</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>Lower Deck L1A–L3B</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#141413]">
                01. Presidential & Sovereign Suites
              </h3>
              <p className="text-xs text-[#4A4640] leading-relaxed">
                Sliding electrochromic privacy doors, 200 cm Poltrona Frau flat beds, personal
                refreshment vaults, and complimentary S-Class / Vellfire terminal transfers in 10
                Indian cities.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs font-mono text-[#141413]">
              <span>TARIFF: ₹7,400 – ₹10,900</span>
              <span>38 dB ISOLATED</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2DCD0] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <SuiteCutawayIllustration variant="sleeper" />
              <div className="text-xs text-[#8C6239]">
                <span>Full-Coach Bespoke Charter</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>14 Suites per Coach</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#141413]">
                02. Royal Wedding & Diplomatic Charters
              </h3>
              <p className="text-xs text-[#4A4640] leading-relaxed">
                Dedicated door-to-palace motorcoach convoys for destination weddings in Udaipur,
                Jaipur, Jodhpur, and Goa with custom floral livery, monogrammed linens, and onboard
                butlers.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs font-mono text-[#141413]">
              <span>CHARTER: ₹1,45,000 / COACH</span>
              <span>CUSTOM ROUTE</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2DCD0] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <SuiteCutawayIllustration variant="salon" />
              <div className="text-xs text-[#8C6239]">
                <span>Gastronomy & Lounge Access</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>10 Private Pavilions</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#141413]">
                03. Culinary Galley & Terminal Lounges
              </h3>
              <p className="text-xs text-[#4A4640] leading-relaxed">
                Arrive 90 minutes prior to departure at our private architectural lounges for shower
                suites, espresso bars, and Chef-curated Marwari, Jain Sattvik, or Konkan suppers.
              </p>
            </div>
            <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs font-mono text-[#141413]">
              <span>1:4 STEWARD RATIO</span>
              <span>INCLUDED IN FARE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 02. Appointment Booking Module (Standard + Premium Deliverable) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-[#E5DEC9]">
        <div className="lg:col-span-5 space-y-5">
          <div className="text-xs font-medium text-[#8C6239]">
            02. Concierge & Charter Appointment Booking
          </div>
          <h2 className="font-display text-3xl font-semibold text-[#141413]">
            Schedule a Private Suite Inspection or Charter Consultation.
          </h2>
          <p className="text-sm text-[#4A4640] leading-relaxed">
            Planning a family wedding convoy to Udaipur, a corporate board retreat to Goa, or wish
            to tour a Sovereign First Class coach in person at our Worli or Chanakyapuri pavilion?
            Book a dedicated 30-minute appointment with our Senior Fleet Director.
          </p>

          <div className="bg-[#141413] text-[#FAF8F5] rounded-xl p-6 space-y-4 border border-[#2A2927]">
            <p className="text-xs font-mono text-[#D4AF37]">
              RECORDED CONCIERGE APPOINTMENTS ({appointments.length})
            </p>
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-lg bg-[#1F1E1C] border border-[#2E2D2A] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-mono text-[#D4AF37]">
                    <span>
                      {apt.id} · {apt.serviceType}
                    </span>
                    <span>{apt.status}</span>
                  </div>
                  <p className="font-semibold text-[#FAF8F5]">
                    {apt.clientName} — {apt.terminalCity} Pavilion
                  </p>
                  <p className="text-[#B8B2A6] font-mono tabular-nums">
                    {apt.preferredDate} at {apt.preferredTime} IST · {apt.clientPhone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmitAppointment}
          className="lg:col-span-7 bg-white rounded-xl border border-[#DED7C8] p-6 sm:p-8 space-y-5"
          noValidate
        >
          <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4">
            <div>
              <h3 className="font-display text-2xl font-semibold text-[#141413]">
                Book Concierge Appointment
              </h3>
              <p className="text-xs text-[#656059]">
                Instant calendar lock with SMS, WhatsApp, and email confirmation.
              </p>
            </div>
            <Calendar className="w-5 h-5 text-[#8C6239]" aria-hidden="true" />
          </div>

          {latestAppt && (
            <div
              role="status"
              className="p-4 rounded-lg bg-[#EDF7F0] border border-[#B7DFC4] text-xs text-[#1B5E37] space-y-1"
            >
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  Appointment {latestAppt.id} Confirmed for {latestAppt.clientName}
                </span>
              </div>
              <p>
                Scheduled at {latestAppt.terminalCity} Pavilion on {latestAppt.preferredDate} at{' '}
                {latestAppt.preferredTime} IST ({latestAppt.serviceType}). Confirmation sent to{' '}
                {latestAppt.clientEmail}.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="apt-name" className="block text-xs font-medium text-[#4A4640] mb-1">
                Full Name / Organization
              </label>
              <input
                id="apt-name"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg text-[#141413]"
                required
              />
            </div>
            <div>
              <label htmlFor="apt-phone" className="block text-xs font-medium text-[#4A4640] mb-1">
                WhatsApp / Direct Mobile Number
              </label>
              <input
                id="apt-phone"
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg text-[#141413]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="apt-email" className="block text-xs font-medium text-[#4A4640] mb-1">
                Official Email Address
              </label>
              <input
                id="apt-email"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg text-[#141413]"
                required
              />
            </div>
            <div>
              <label htmlFor="apt-service" className="block text-xs font-medium text-[#4A4640] mb-1">
                Service / Consultation Type
              </label>
              <select
                id="apt-service"
                value={serviceType}
                onChange={(e) =>
                  setServiceType(e.target.value as AppointmentRequest['serviceType'])
                }
                className="w-full px-3.5 py-2 text-sm bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg text-[#141413]"
              >
                <option value="Royal Wedding Fleet Charter">Royal Wedding Fleet Charter</option>
                <option value="Private Suite Inspection">Private Suite Physical Inspection</option>
                <option value="Corporate Corridor Account">Corporate Corridor Retainer</option>
                <option value="Concierge Travel Desk">Bespoke Multi-City Itinerary</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="apt-city" className="block text-xs font-medium text-[#4A4640] mb-1">
                Sovereign Pavilion City
              </label>
              <select
                id="apt-city"
                value={terminalCity}
                onChange={(e) => setTerminalCity(e.target.value as IndianCity)}
                className="w-full px-3.5 py-2 text-sm bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg text-[#141413]"
              >
                {INDIAN_TERMINALS.map((t) => (
                  <option key={t.city} value={t.city}>
                    {t.city} ({t.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="apt-date" className="block text-xs font-medium text-[#4A4640] mb-1">
                Preferred Date
              </label>
              <input
                id="apt-date"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm font-mono bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg text-[#141413]"
              />
            </div>
            <div>
              <label htmlFor="apt-time" className="block text-xs font-medium text-[#4A4640] mb-1">
                Preferred Time (IST)
              </label>
              <input
                id="apt-time"
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3.5 py-2 text-sm font-mono bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg text-[#141413]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="apt-notes" className="block text-xs font-medium text-[#4A4640] mb-1">
              Charter / Itinerary Notes
            </label>
            <textarea
              id="apt-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-[#FAF8F5] border border-[#D5CEC2] rounded-lg text-[#141413]"
            />
          </div>

          {formError && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-[#FDF2F2] border border-[#F5C2C2] text-xs font-medium text-[#9B1C1C]"
            >
              {formError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#141413] hover:bg-[#292826] text-[#FAF8F5] text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Confirm Concierge Appointment
          </button>
        </form>
      </div>

      {/* 03. Website & Digital Presence Packages Specification (Matching Attached PDF) */}
      <div className="pt-8 border-t border-[#E5DEC9] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#8C6239]">
              03. Complete Online Presence & Digital Architecture Tiers
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#141413] mt-1">
              Website Packages & Active Premium Deliverables
            </h2>
            <p className="text-xs text-[#656059] mt-1">
              Get found on Google. Get more passenger, charter & customer calls — built to the full
              Premium Package specification.
            </p>
          </div>

          <a
            href="/assets/aistudio/Website_Packages_11917506.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white hover:bg-[#F4F0EA] text-[#141413] text-xs font-semibold rounded-lg border border-[#D5CEC2] inline-flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-[#8C6239]" aria-hidden="true" />
            <span>Open Reference Package PDF</span>
          </a>
        </div>

        {/* 3-Column Package Comparison Grid (Starter / Standard / Premium) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* STARTER */}
          <div className="bg-white rounded-xl border border-[#E2DCD0] p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="border-b border-[#EFECE6] pb-4">
                <p className="text-xs font-mono font-semibold text-[#656059]">STARTER TIER</p>
                <p className="font-mono text-2xl font-bold text-[#141413] mt-1 tabular-nums">
                  ₹10,000 – 18,000
                </p>
                <p className="text-xs text-[#656059] mt-1">Perfect to get online fast</p>
              </div>
              <ul className="space-y-2.5 text-xs text-[#4A4640]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E37] shrink-0" aria-hidden="true" />
                  <span>4–5 page website (Included & Active)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E37] shrink-0" aria-hidden="true" />
                  <span>Mobile-friendly responsive design (Included)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E37] shrink-0" aria-hidden="true" />
                  <span>WhatsApp & direct call buttons (Included)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E37] shrink-0" aria-hidden="true" />
                  <span>Google Maps integration across 10 cities (Included)</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-[#EFECE6] text-xs font-mono text-[#1B5E37]">
              ALL STARTER FEATURES LIVE ✓
            </div>
          </div>

          {/* STANDARD */}
          <div className="bg-white rounded-xl border border-[#8C6239] p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="border-b border-[#EFECE6] pb-4">
                <p className="text-xs font-mono font-semibold text-[#8C6239]">
                  STANDARD TIER · POPULAR
                </p>
                <p className="font-mono text-2xl font-bold text-[#141413] mt-1 tabular-nums">
                  ₹20,000 – 35,000
                </p>
                <p className="text-xs text-[#656059] mt-1">
                  Best for growing transit & hospitality operators
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-[#4A4640]">
                <li className="flex items-center gap-2 font-semibold text-[#141413]">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E37] shrink-0" aria-hidden="true" />
                  <span>Everything in Starter</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E37] shrink-0" aria-hidden="true" />
                  <span>Appointment & Suite seat booking system</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E37] shrink-0" aria-hidden="true" />
                  <span>Dedicated Services & Charter pages</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E37] shrink-0" aria-hidden="true" />
                  <span>Basic SEO & Schema.org JSON-LD markup</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E37] shrink-0" aria-hidden="true" />
                  <span>Google Business setup & verified profiles</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-[#EFECE6] text-xs font-mono text-[#1B5E37]">
              ALL STANDARD FEATURES LIVE ✓
            </div>
          </div>

          {/* PREMIUM (ACTIVE) */}
          <div className="bg-[#141413] text-[#FAF8F5] rounded-xl border border-[#D4AF37] p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="border-b border-[#2E2D2A] pb-4">
                <p className="text-xs font-mono font-semibold text-[#D4AF37]">
                  PREMIUM TIER · ACTIVE BUILD
                </p>
                <p className="font-mono text-2xl font-bold text-[#FAF8F5] mt-1 tabular-nums">
                  ₹40,000 – 70,000
                </p>
                <p className="text-xs text-[#C5B396] mt-1">Complete online presence</p>
              </div>
              <ul className="space-y-2.5 text-xs text-[#E5DEC9]">
                <li className="flex items-center gap-2 font-semibold text-[#FAF8F5]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                  <span>Everything in Standard & Starter</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                  <span>Editorial Blog section with reader & search</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                  <span>Google Reviews integration & live submission</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                  <span>Executive Analytics dashboard & SEO metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
                  <span>Custom bespoke architectural luxury design</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-[#2E2D2A] text-xs font-mono text-[#D4AF37]">
              ACTIVE PREMIUM SPECIFICATION ✓
            </div>
          </div>
        </div>

        {/* Optional Add-ons & Terms Banner from PDF */}
        <div className="bg-white rounded-xl border border-[#E2DCD0] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-[#4A4640]">
          <div className="space-y-1">
            <p className="font-semibold text-[#141413]">
              Optional Managed Add-Ons & Enterprise SLA
            </p>
            <p>
              <span>Hosting, domain & maintenance: </span>
              <span className="font-mono font-semibold text-[#141413]">₹3,000 – 8,000 / year</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>Monthly SEO & Google Business management: </span>
              <span className="font-mono font-semibold text-[#141413]">
                ₹5,000 – 15,000 / month
              </span>
            </p>
          </div>
          <div className="md:text-right font-mono text-[#656059]">
            Payment terms: 50% advance to start · 50% on delivery
          </div>
        </div>
      </div>
    </section>
  );
};
