import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_LUXURY_ROUTES,
  INITIAL_BLOG_POSTS,
  INITIAL_REVIEWS,
  filterCoachRoutes,
  filterBlogPosts,
  calculateReviewStats,
  computeAnalyticsSummary,
  toggleSeatSelection,
  calculateFareBreakdown,
  verifyAntiBotSecurity,
  validatePaymentGatewayInput,
  buildConfirmedBookingRecord,
  formatInr,
} from './bookingLogic.ts';

test('filterCoachRoutes filters by Indian origin and destination accurately', () => {
  const mumbaiToUdaipur = filterCoachRoutes(INITIAL_LUXURY_ROUTES, 'Mumbai', 'Udaipur');
  assert.equal(mumbaiToUdaipur.length, 1);
  assert.equal(mumbaiToUdaipur[0].coachCode, 'AO-101');
  assert.equal(mumbaiToUdaipur[0].baseFareInr, 1499);

  const allRoutes = filterCoachRoutes(INITIAL_LUXURY_ROUTES, 'All', 'All');
  assert.equal(allRoutes.length, INITIAL_LUXURY_ROUTES.length);
});

test('toggleSeatSelection rejects occupied seats and enforces max 4 suites anti-hoarding limit', () => {
  const route = INITIAL_LUXURY_ROUTES[0];
  const occupiedSeat = route.seats.find((s) => s.status === 'occupied')!;
  const availableSeats = route.seats.filter((s) => s.status === 'available');

  const occupiedAttempt = toggleSeatSelection([], occupiedSeat);
  assert.equal(occupiedAttempt.selected.length, 0);
  assert.ok(occupiedAttempt.error?.includes('already occupied'));

  let selected: string[] = [];
  for (let i = 0; i < 4; i++) {
    const res = toggleSeatSelection(selected, availableSeats[i]);
    selected = res.selected;
  }
  assert.equal(selected.length, 4);

  const fifthAttempt = toggleSeatSelection(selected, availableSeats[4]);
  assert.equal(fifthAttempt.selected.length, 4);
  assert.ok(fifthAttempt.error?.includes('Maximum 4'));
});

test('calculateFareBreakdown computes affordable Indian bus fare, ₹99 lounge fee, member discount, and 5% GST', () => {
  const route = INITIAL_LUXURY_ROUTES[0]; // baseFare 1499; L1A is Presidential (1499 + 400 = 1899)
  const guestBreakdown = calculateFareBreakdown(route.seats, ['L1A'], false);
  assert.equal(guestBreakdown.seatCount, 1);
  assert.equal(guestBreakdown.subtotalInr, 1899);
  assert.equal(guestBreakdown.loungeConciergeInr, 99);
  assert.equal(guestBreakdown.memberDiscountInr, 0);
  assert.equal(guestBreakdown.gstInr, Math.round((1899 + 99) * 0.05));
  assert.equal(guestBreakdown.totalInr, 1899 + 99 + guestBreakdown.gstInr);

  const memberBreakdown = calculateFareBreakdown(route.seats, ['L1A'], true);
  assert.ok(memberBreakdown.memberDiscountInr > 0);
  assert.ok(memberBreakdown.totalInr < guestBreakdown.totalInr);
});

test('verifyAntiBotSecurity enforces Google reCAPTCHA checkbox and verification state', () => {
  const missingRobot = verifyAntiBotSecurity({
    notARobotChecked: false,
    captchaInput: 'AO-84K9',
    expectedCaptcha: 'AO-84K9',
  });
  assert.equal(missingRobot.valid, false);

  const wrongCaptcha = verifyAntiBotSecurity({
    notARobotChecked: true,
    captchaInput: 'WRONG-11',
    expectedCaptcha: 'AO-84K9',
  });
  assert.equal(wrongCaptcha.valid, false);

  const validCheck = verifyAntiBotSecurity({
    notARobotChecked: true,
    captchaInput: 'ao-84k9 ',
    expectedCaptcha: 'AO-84K9',
  });
  assert.equal(validCheck.valid, true);
});

test('validatePaymentGatewayInput validates UPI, 16-digit Card, and NetBanking', () => {
  assert.equal(
    validatePaymentGatewayInput({ method: 'upi', upiId: 'invalid-upi' }).valid,
    false
  );
  assert.equal(
    validatePaymentGatewayInput({ method: 'upi', upiId: 'arjun.singhania@okhdfcbank' }).valid,
    true
  );

  assert.equal(
    validatePaymentGatewayInput({
      method: 'card',
      cardNumber: '4532 0192 8834 7712',
      cardHolder: 'Vikramaditya Rao',
      cardExpiry: '08/29',
      cardCvv: '842',
    }).valid,
    true
  );
});

test('buildConfirmedBookingRecord creates PNR and email confirmation dispatch payload', () => {
  const route = INITIAL_LUXURY_ROUTES[0];
  const fare = calculateFareBreakdown(route.seats, ['L1A'], true);
  const record = buildConfirmedBookingRecord({
    route,
    travelDate: '2026-10-24',
    selectedSeats: ['L1A'],
    passengerName: 'Arundhati Roy',
    passengerEmail: 'arundhati@example.in',
    passengerPhone: '+91 98201 44910',
    dietaryPreference: 'Jain Royal Sattvik',
    chauffeurPickup: 'Taj Mahal Palace, Colaba',
    paymentMethodLabel: 'UPI Instant (arundhati@okicici)',
    fare,
    deterministicSuffix: '774120',
  });

  assert.equal(record.pnr, 'AOV-MUM774120');
  assert.equal(record.emailDispatchLog.recipient, 'arundhati@example.in');
  assert.ok(record.emailDispatchLog.bodyPreview.includes(formatInr(fare.totalInr)));
});

test('filterBlogPosts filters articles by category and keyword search', () => {
  const engineering = filterBlogPosts(INITIAL_BLOG_POSTS, 'Cabin Engineering', '');
  assert.equal(engineering.length, 1);
  assert.ok(engineering[0].title.includes('38 dB'));

  const udaipurSearch = filterBlogPosts(INITIAL_BLOG_POSTS, 'All', 'Udaipur');
  assert.ok(udaipurSearch.length >= 2);
});

test('calculateReviewStats and computeAnalyticsSummary compute accurate metrics', () => {
  const stats = calculateReviewStats(INITIAL_REVIEWS);
  assert.equal(stats.totalCount, 4);
  assert.equal(stats.averageRating, 5);

  const summary = computeAnalyticsSummary(INITIAL_LUXURY_ROUTES, [], INITIAL_REVIEWS);
  assert.ok(summary.totalGrossRevenueInr > 15000);
  assert.equal(summary.corridorPerformance.length, 6);
  assert.ok(summary.overallOccupancyPercent > 0);
});
