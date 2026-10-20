import React, { useState } from 'react';
import {
  BookingRecord,
  LuxuryCoachRoute,
  PassengerReview,
  computeAnalyticsSummary,
  formatInr,
} from '../utils/bookingLogic';
import { BarChart3, TrendingUp, Search, PhoneCall, CheckCircle2 } from 'lucide-react';

interface AnalyticsDashboardViewProps {
  routes: LuxuryCoachRoute[];
  bookings: BookingRecord[];
  reviews: PassengerReview[];
  onSelectCorridorToBook: (routeId: string) => void;
}

export const AnalyticsDashboardView: React.FC<AnalyticsDashboardViewProps> = ({
  routes,
  bookings,
  reviews,
  onSelectCorridorToBook,
}) => {
  const [timeframe, setTimeframe] = useState<'30d' | '90d'>('30d');
  const summary = computeAnalyticsSummary(routes, bookings, reviews);
  const multiplier = timeframe === '90d' ? 2.85 : 1;

  const topSearchKeywords = [
    {
      keyword: 'luxury sleeper bus mumbai to udaipur',
      impressions: Math.round(14200 * multiplier),
      clicks: Math.round(1890 * multiplier),
      ctr: '13.3%',
      avgPosition: '1.2',
    },
    {
      keyword: 'private cabin bus new delhi to jaipur',
      impressions: Math.round(11800 * multiplier),
      clicks: Math.round(1540 * multiplier),
      ctr: '13.1%',
      avgPosition: '1.4',
    },
    {
      keyword: 'first class sleeper coach mumbai to goa',
      impressions: Math.round(9640 * multiplier),
      clicks: Math.round(1290 * multiplier),
      ctr: '13.4%',
      avgPosition: '1.1',
    },
    {
      keyword: 'bengaluru to hyderabad luxury suite bus',
      impressions: Math.round(8120 * multiplier),
      clicks: Math.round(980 * multiplier),
      ctr: '12.1%',
      avgPosition: '1.6',
    },
  ];

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-10 space-y-10">
      {/* Header & Timeframe Control */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5DEC9] pb-6">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#8C6239]">
            Executive Telemetry · Corridor Revenue · Google Search & Maps SEO Performance
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413]">
            Transit & Digital Presence Analytics Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#F4F0EA] rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeframe('30d')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              timeframe === '30d'
                ? 'bg-[#141413] text-[#FAF8F5]'
                : 'text-[#5C5852] hover:text-[#141413]'
            }`}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('90d')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              timeframe === '90d'
                ? 'bg-[#141413] text-[#FAF8F5]'
                : 'text-[#5C5852] hover:text-[#141413]'
            }`}
          >
            Quarterly (90 Days)
          </button>
        </div>
      </div>

      {/* 4-Column KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-[#E2DCD0] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#656059]">
            <span>Gross Suite Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#1B5E37]" aria-hidden="true" />
          </div>
          <p className="font-mono text-2xl font-bold text-[#141413] tabular-nums">
            {formatInr(summary.totalGrossRevenueInr * multiplier)}
          </p>
          <p className="text-xs text-[#1B5E37]">
            +18.4% vs prior period · {Math.round(summary.confirmedBookingsCount * multiplier)}{' '}
            Settled PNRs
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2DCD0] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#656059]">
            <span>Active Fleet Suite Occupancy</span>
            <BarChart3 className="w-4 h-4 text-[#8C6239]" aria-hidden="true" />
          </div>
          <p className="font-mono text-2xl font-bold text-[#141413] tabular-nums">
            {summary.overallOccupancyPercent}% ({summary.totalSuitesBooked}/
            {summary.totalSuitesCapacity} Suites)
          </p>
          <p className="text-xs text-[#656059]">
            Real-time sync with Lower & Upper Deck manifests
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2DCD0] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#656059]">
            <span>Google Search & Maps Views</span>
            <Search className="w-4 h-4 text-[#8C6239]" aria-hidden="true" />
          </div>
          <p className="font-mono text-2xl font-bold text-[#141413] tabular-nums">
            {Math.round(summary.googleSearchImpressions30d * multiplier).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-[#1B5E37]">
            Schema.org JSON-LD & 10 Google Business Pins Active
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E2DCD0] p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#656059]">
            <span>WhatsApp & Direct Call Leads</span>
            <PhoneCall className="w-4 h-4 text-[#1B5E37]" aria-hidden="true" />
          </div>
          <p className="font-mono text-2xl font-bold text-[#141413] tabular-nums">
            {Math.round(summary.whatsappAndCallConversions30d * multiplier).toLocaleString('en-IN')}{' '}
            Calls
          </p>
          <p className="text-xs text-[#656059]">
            Google Rating: <span className="font-mono font-semibold">{summary.averageRating} / 5.0</span>{' '}
            ({summary.totalReviewsCount} Verified)
          </p>
        </div>
      </div>

      {/* High-Density Corridor Performance Table & SEO Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Corridor Suite Utilization & Revenue Ledger */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2DCD0] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#141413]">
                Corridor Suite Utilization & Revenue
              </h2>
              <p className="text-xs text-[#656059]">
                Live telemetry across all 6 flagship Indian intercity luxury motorcoaches.
              </p>
            </div>
            <span className="font-mono text-xs text-[#8C6239]">LIVE MANIFEST</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5DEC9] text-[#656059]">
                  <th className="py-2.5 pr-3 font-medium">Coach</th>
                  <th className="py-2.5 px-3 font-medium">Indian Corridor</th>
                  <th className="py-2.5 px-3 font-medium text-right">Suites Occupied</th>
                  <th className="py-2.5 px-3 font-medium text-right">Occupancy</th>
                  <th className="py-2.5 pl-3 font-medium text-right">Departure Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {summary.corridorPerformance.map((row) => (
                  <tr key={row.routeId} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 pr-3 font-mono font-semibold text-[#141413]">
                      {row.coachCode}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => onSelectCorridorToBook(row.routeId)}
                        className="font-medium text-[#141413] hover:text-[#8C6239] hover:underline cursor-pointer text-left"
                      >
                        {row.corridorLabel}
                      </button>
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-right text-[#4A4640]">
                      {row.occupiedSuites} / {row.totalSuites}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-right font-semibold text-[#141413]">
                      {row.occupancyPercent}%
                    </td>
                    <td className="py-3 pl-3 font-mono tabular-nums text-right font-semibold text-[#141413]">
                      {formatInr(row.estimatedRevenueInr)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 Cols: Google Search Console & SEO Keyword Ranking Table */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E2DCD0] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#141413]">
                Google SEO & Search Rankings
              </h2>
              <p className="text-xs text-[#656059]">
                Organic search performance driving passenger calls & bookings.
              </p>
            </div>
            <span className="font-mono text-xs text-[#1B5E37] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>INDEXED</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5DEC9] text-[#656059]">
                  <th className="py-2 pr-2 font-medium">Search Query</th>
                  <th className="py-2 px-2 font-medium text-right">Clicks</th>
                  <th className="py-2 pl-2 font-medium text-right">Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {topSearchKeywords.map((kw) => (
                  <tr key={kw.keyword} className="hover:bg-[#FAF8F5]">
                    <td className="py-2.5 pr-2 text-[#141413] font-medium">{kw.keyword}</td>
                    <td className="py-2.5 px-2 font-mono tabular-nums text-right text-[#4A4640]">
                      {kw.clicks.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 pl-2 font-mono tabular-nums text-right font-semibold text-[#1B5E37]">
                      #{kw.avgPosition}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#EAE4D8] text-xs text-[#4A4640] space-y-1">
            <p className="font-semibold text-[#141413]">Active Technical SEO Stack</p>
            <p>
              Schema.org <code className="font-mono">TravelAgency</code> JSON-LD · OpenGraph &
              Twitter Cards · 10 Verified Google Business Locations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
