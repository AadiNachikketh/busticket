export type IndianCity =
  | 'Mumbai'
  | 'New Delhi'
  | 'Bengaluru'
  | 'Udaipur'
  | 'Jaipur'
  | 'Hyderabad'
  | 'Pune'
  | 'Goa'
  | 'Chennai'
  | 'Mysuru';

export interface CityTerminal {
  city: IndianCity;
  code: string;
  loungeName: string;
  state: string;
  address: string;
  phone: string;
  whatsapp: string;
  googleMapsQuery: string;
  googleRating: number;
  googleReviewCount: number;
  operatingHours: string;
}

export interface SuiteSeat {
  id: string;
  deck: 'lower' | 'upper';
  row: number;
  col: 'A' | 'B';
  type: 'Sovereign Suite' | 'Royal Sleeper Pod' | 'Presidential Cabin';
  priceInr: number;
  status: 'available' | 'occupied' | 'reserved-ladies';
  features: string;
}

export interface LuxuryCoachRoute {
  id: string;
  coachCode: string;
  coachName: string;
  coachClass: 'Sovereign First Class' | 'Royal Sleeper Residence' | 'Deccan Grand Salon';
  origin: IndianCity;
  destination: IndianCity;
  originTerminal: string;
  destinationTerminal: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distanceKm: number;
  baseFareInr: number;
  butlerService: string;
  culinaryMenu: string;
  seats: SuiteSeat[];
}

export interface CaptchaChallenge {
  id: string;
  code: string;
  questionText: string;
  expectedAnswer: string;
  issuedAt: number;
}

export interface FareBreakdown {
  seatCount: number;
  subtotalInr: number;
  loungeConciergeInr: number;
  memberDiscountInr: number;
  gstInr: number;
  totalInr: number;
}

export interface PaymentPayload {
  method: 'upi' | 'card' | 'netbanking';
  upiId?: string;
  cardNumber?: string;
  cardHolder?: string;
  cardExpiry?: string;
  cardCvv?: string;
  bankCode?: string;
}

export interface BookingRecord {
  pnr: string;
  transactionId: string;
  coachId: string;
  coachName: string;
  coachCode: string;
  origin: IndianCity;
  destination: IndianCity;
  originTerminal: string;
  destinationTerminal: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  selectedSeats: string[];
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  dietaryPreference: string;
  chauffeurPickup: string;
  paymentMethodLabel: string;
  fare: FareBreakdown;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdAtIso: string;
  emailDispatchLog: {
    recipient: string;
    subject: string;
    dispatchedAt: string;
    messageId: string;
    bodyPreview: string;
  };
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  tier: 'Sovereign Privé' | 'Emerald Crest' | 'Ivory Member';
  membershipNumber: string;
  homeCity: IndianCity;
  preferredDietary: string;
  defaultChauffeurAddress: string;
  milesCompletedKm: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: 'Corridor Guides' | 'Cabin Engineering' | 'Culinary Heritage' | 'Concierge Dispatch';
  author: string;
  authorRole: string;
  publishedDate: string;
  readTimeMinutes: number;
  featuredCorridor: string;
  excerpt: string;
  contentParagraphs: string[];
  seoKeywords: string[];
}

export interface PassengerReview {
  id: string;
  passengerName: string;
  passengerRole: string;
  corridor: string;
  suiteType: string;
  rating: number;
  verifiedPnr: string;
  publishedDate: string;
  source: 'Google Business Profile' | 'Verified PNR Manifesto';
  title: string;
  comment: string;
}

export interface AppointmentRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  terminalCity: IndianCity;
  serviceType: 'Private Suite Inspection' | 'Royal Wedding Fleet Charter' | 'Corporate Corridor Account' | 'Concierge Travel Desk';
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: 'Confirmed';
}

export interface AnalyticsSummary {
  totalGrossRevenueInr: number;
  confirmedBookingsCount: number;
  overallOccupancyPercent: number;
  totalSuitesBooked: number;
  totalSuitesCapacity: number;
  averageRating: number;
  totalReviewsCount: number;
  googleSearchImpressions30d: number;
  whatsappAndCallConversions30d: number;
  corridorPerformance: Array<{
    routeId: string;
    coachCode: string;
    corridorLabel: string;
    occupiedSuites: number;
    totalSuites: number;
    occupancyPercent: number;
    estimatedRevenueInr: number;
  }>;
}

export const INDIAN_TERMINALS: CityTerminal[] = [
  {
    city: 'Mumbai',
    code: 'BOM',
    loungeName: 'Worli Seaface Private Pavilion',
    state: 'Maharashtra',
    address: 'Plot 42, Dr. Annie Besant Road, Worli Seaface, Mumbai 400030',
    phone: '+91 22 6849 1100',
    whatsapp: '919820177420',
    googleMapsQuery: 'Worli+Seaface+Mumbai+Maharashtra',
    googleRating: 4.9,
    googleReviewCount: 142,
    operatingHours: '05:00 IST – 23:59 IST Daily',
  },
  {
    city: 'Udaipur',
    code: 'UDR',
    loungeName: 'Fateh Sagar Heritage Terminal',
    state: 'Rajasthan',
    address: 'Rani Road Promenade, Fateh Sagar Lakefront, Udaipur 313001',
    phone: '+91 294 243 8800',
    whatsapp: '919820177420',
    googleMapsQuery: 'Fateh+Sagar+Lake+Udaipur+Rajasthan',
    googleRating: 5.0,
    googleReviewCount: 89,
    operatingHours: '05:30 IST – 23:00 IST Daily',
  },
  {
    city: 'New Delhi',
    code: 'DEL',
    loungeName: 'Chanakyapuri Diplomatic Concourse',
    state: 'Delhi NCR',
    address: '14 Nyaya Marg, Chanakyapuri Diplomatic Enclave, New Delhi 110021',
    phone: '+91 11 4092 3300',
    whatsapp: '919820177420',
    googleMapsQuery: 'Chanakyapuri+New+Delhi',
    googleRating: 4.9,
    googleReviewCount: 118,
    operatingHours: '05:00 IST – 23:59 IST Daily',
  },
  {
    city: 'Jaipur',
    code: 'JAI',
    loungeName: 'Rambagh Polo Club Salon',
    state: 'Rajasthan',
    address: 'Bhawani Singh Road, Near Rambagh Circle, Jaipur 302005',
    phone: '+91 141 238 5900',
    whatsapp: '919820177420',
    googleMapsQuery: 'Bhawani+Singh+Road+Jaipur+Rajasthan',
    googleRating: 4.9,
    googleReviewCount: 76,
    operatingHours: '06:00 IST – 23:30 IST Daily',
  },
  {
    city: 'Bengaluru',
    code: 'BLR',
    loungeName: 'Lavelle Road Executive Sanctuary',
    state: 'Karnataka',
    address: '28 Lavelle Road, Shanthala Nagar, Ashok Nagar, Bengaluru 560001',
    phone: '+91 80 4112 7700',
    whatsapp: '919820177420',
    googleMapsQuery: 'Lavelle+Road+Bengaluru+Karnataka',
    googleRating: 4.8,
    googleReviewCount: 94,
    operatingHours: '05:00 IST – 23:59 IST Daily',
  },
  {
    city: 'Hyderabad',
    code: 'HYD',
    loungeName: 'Banjara Hills Jubilee Lounge',
    state: 'Telangana',
    address: 'Road No. 12, Banjara Hills, Hyderabad 500034',
    phone: '+91 40 6682 4400',
    whatsapp: '919820177420',
    googleMapsQuery: 'Road+No+12+Banjara+Hills+Hyderabad',
    googleRating: 4.9,
    googleReviewCount: 64,
    operatingHours: '05:30 IST – 23:30 IST Daily',
  },
  {
    city: 'Goa',
    code: 'GOI',
    loungeName: 'Assagao Estate Arrival Courtyard',
    state: 'Goa',
    address: 'Bairo Alto, Assagao-Anjuna Valley Road, North Goa 403507',
    phone: '+91 832 226 9100',
    whatsapp: '919820177420',
    googleMapsQuery: 'Assagao+Goa',
    googleRating: 5.0,
    googleReviewCount: 82,
    operatingHours: '06:00 IST – 23:00 IST Daily',
  },
  {
    city: 'Pune',
    code: 'PNQ',
    loungeName: 'Koregaon Park Botanical Lounge',
    state: 'Maharashtra',
    address: 'North Main Road, Koregaon Park, Pune 411001',
    phone: '+91 20 6721 1900',
    whatsapp: '919820177420',
    googleMapsQuery: 'Koregaon+Park+Pune+Maharashtra',
    googleRating: 4.8,
    googleReviewCount: 51,
    operatingHours: '05:30 IST – 23:30 IST Daily',
  },
  {
    city: 'Chennai',
    code: 'MAA',
    loungeName: 'Adyar Estuary Private Pier',
    state: 'Tamil Nadu',
    address: 'Greenways Road, Raja Annamalai Puram, Chennai 600028',
    phone: '+91 44 2493 8200',
    whatsapp: '919820177420',
    googleMapsQuery: 'Raja+Annamalai+Puram+Chennai',
    googleRating: 4.9,
    googleReviewCount: 58,
    operatingHours: '05:30 IST – 23:30 IST Daily',
  },
  {
    city: 'Mysuru',
    code: 'MYQ',
    loungeName: 'Chamundi Foothills Royal Gate',
    state: 'Karnataka',
    address: 'Lalitha Mahal Palace Road, Siddhartha Layout, Mysuru 570011',
    phone: '+91 821 247 3100',
    whatsapp: '919820177420',
    googleMapsQuery: 'Lalitha+Mahal+Road+Mysuru',
    googleRating: 4.9,
    googleReviewCount: 47,
    operatingHours: '06:00 IST – 23:00 IST Daily',
  },
];

function buildStandardSeats(baseFare: number, occupiedIds: string[], ladiesIds: string[] = []): SuiteSeat[] {
  const seats: SuiteSeat[] = [];
  for (let row = 1; row <= 3; row++) {
    for (const col of ['A', 'B'] as const) {
      const id = `L${row}${col}`;
      const isPresidential = row === 1;
      const priceInr = isPresidential ? baseFare + 400 : baseFare + 200;
      seats.push({
        id,
        deck: 'lower',
        row,
        col,
        type: isPresidential ? 'Presidential Cabin' : 'Sovereign Suite',
        priceInr,
        status: occupiedIds.includes(id)
          ? 'occupied'
          : ladiesIds.includes(id)
          ? 'reserved-ladies'
          : 'available',
        features: isPresidential
          ? 'Enclosed privacy suite · 200cm flat bed · Personal snack bar'
          : 'Sliding privacy curtain/door · 195cm lie-flat leather berth',
      });
    }
  }
  for (let row = 1; row <= 4; row++) {
    for (const col of ['A', 'B'] as const) {
      const id = `U${row}${col}`;
      seats.push({
        id,
        deck: 'upper',
        row,
        col,
        type: 'Royal Sleeper Pod',
        priceInr: baseFare,
        status: occupiedIds.includes(id)
          ? 'occupied'
          : ladiesIds.includes(id)
          ? 'reserved-ladies'
          : 'available',
        features: 'Panoramic sky window · Zero-gravity recline · Fresh linen kit',
      });
    }
  }
  return seats;
}

export const INITIAL_LUXURY_ROUTES: LuxuryCoachRoute[] = [
  {
    id: 'route-bom-udr-01',
    coachCode: 'AO-101',
    coachName: 'The Mewar Sovereign Express',
    coachClass: 'Sovereign First Class',
    origin: 'Mumbai',
    destination: 'Udaipur',
    originTerminal: 'Worli Seaface Private Pavilion',
    destinationTerminal: 'Fateh Sagar Heritage Terminal',
    departureTime: '19:30',
    arrivalTime: '06:45',
    duration: '11h 15m',
    distanceKm: 760,
    baseFareInr: 1499,
    butlerService: 'Dedicated Cabin Attendant & Complimentary Wi-Fi',
    culinaryMenu: 'Hot Marwari & Coastal Dinner Box + Morning Masala Chai',
    seats: buildStandardSeats(1499, ['L1B', 'L2A', 'U1B', 'U3A'], ['L3B']),
  },
  {
    id: 'route-del-jai-02',
    coachCode: 'AO-204',
    coachName: 'The Rajputana Imperial Salon',
    coachClass: 'Deccan Grand Salon',
    origin: 'New Delhi',
    destination: 'Jaipur',
    originTerminal: 'Chanakyapuri Diplomatic Concourse',
    destinationTerminal: 'Rambagh Polo Club Salon',
    departureTime: '17:00',
    arrivalTime: '21:30',
    duration: '04h 30m',
    distanceKm: 280,
    baseFareInr: 899,
    butlerService: 'Express Highway Steward & Refreshment Service',
    culinaryMenu: 'Darjeeling High Tea & Artisanal Saffron Snack Tray',
    seats: buildStandardSeats(899, ['L1A', 'U2A', 'U2B'], ['U1A']),
  },
  {
    id: 'route-bom-goi-03',
    coachCode: 'AO-308',
    coachName: 'The Konkan Coast Sanctuary',
    coachClass: 'Royal Sleeper Residence',
    origin: 'Mumbai',
    destination: 'Goa',
    originTerminal: 'Worli Seaface Private Pavilion',
    destinationTerminal: 'Assagao Estate Arrival Courtyard',
    departureTime: '21:00',
    arrivalTime: '07:30',
    duration: '10h 30m',
    distanceKm: 590,
    baseFareInr: 1299,
    butlerService: 'Overnight Sleep Steward & Morning Filter Coffee',
    culinaryMenu: 'Konkan Coastal Thali Box & Warm Croissant Breakfast',
    seats: buildStandardSeats(1299, ['L1A', 'L1B', 'U4A'], []),
  },
  {
    id: 'route-blr-hyd-04',
    coachCode: 'AO-412',
    coachName: 'The Deccan Nizam Nocturne',
    coachClass: 'Sovereign First Class',
    origin: 'Bengaluru',
    destination: 'Hyderabad',
    originTerminal: 'Lavelle Road Executive Sanctuary',
    destinationTerminal: 'Banjara Hills Jubilee Lounge',
    departureTime: '22:15',
    arrivalTime: '06:30',
    duration: '08h 15m',
    distanceKm: 575,
    baseFareInr: 1199,
    butlerService: 'Quiet-Cabin Night Steward & Fast Charging Ports',
    culinaryMenu: 'Hyderabadi Subz Biryani Supper & Coorg Filter Coffee',
    seats: buildStandardSeats(1199, ['L2B', 'U1A', 'U3B'], ['L3A']),
  },
  {
    id: 'route-del-udr-05',
    coachCode: 'AO-509',
    coachName: 'The Aravalli Crest Sleeper',
    coachClass: 'Sovereign First Class',
    origin: 'New Delhi',
    destination: 'Udaipur',
    originTerminal: 'Chanakyapuri Diplomatic Concourse',
    destinationTerminal: 'Fateh Sagar Heritage Terminal',
    departureTime: '20:00',
    arrivalTime: '06:15',
    duration: '10h 15m',
    distanceKm: 660,
    baseFareInr: 1399,
    butlerService: 'Dedicated White-Glove Cabin Attendant',
    culinaryMenu: 'Rajasthani Royal Thali & Morning Herbal Tea',
    seats: buildStandardSeats(1399, ['L1B', 'U2A'], ['U4B']),
  },
  {
    id: 'route-maa-myq-06',
    coachCode: 'AO-615',
    coachName: 'The Coromandel Wodeyar Express',
    coachClass: 'Deccan Grand Salon',
    origin: 'Chennai',
    destination: 'Mysuru',
    originTerminal: 'Adyar Estuary Private Pier',
    destinationTerminal: 'Chamundi Foothills Royal Gate',
    departureTime: '16:30',
    arrivalTime: '23:00',
    duration: '06h 30m',
    distanceKm: 480,
    baseFareInr: 999,
    butlerService: 'Onboard Steward & Pillows/Blanket Kit',
    culinaryMenu: 'South Indian Mini Tiffin & Mysore Brass Filter Kaapi',
    seats: buildStandardSeats(999, ['L2A', 'U1B'], []),
  },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-01',
    slug: 'inside-the-14-suite-volvo-b11r-acoustic-engineering',
    title: 'How We Engineered a 38 dB Whisper-Quiet Sleeper Suite for Indian Highways',
    category: 'Cabin Engineering',
    author: 'Raghavendra Kulkarni',
    authorRole: 'Chief Coachbuilder & Acoustic Architect',
    publishedDate: 'October 14, 2026',
    readTimeMinutes: 6,
    featuredCorridor: 'Mumbai — Udaipur (AO-101)',
    excerpt:
      'Why conventional sleeper buses fail the restorative sleep test, and how triple-laminated privacy glass and active pneumatic suspension transform overnight transit at affordable Indian fares.',
    contentParagraphs: [
      'When we began designing the Aurelia Overland fleet in early 2024, our benchmark was first-class rail salons and aviation suites—yet priced accessibly from ₹899 to ₹1,899 for intercity Indian commuters.',
      'By configuring our multi-axle Volvo 9600 and B11R coaches with spacious private suites, we gained the structural room needed for sound-insulated walls, cushioned floor mounts, and sliding privacy doors rated at 38 decibels.',
      'Each Presidential Cabin on the lower deck features a 200 cm flat bed with fresh quilted linens, individual AC vents, high-speed USB-C charging, and personal reading lamps so guests arrive in Udaipur or Hyderabad completely rested.',
    ],
    seoKeywords: ['Luxury Sleeper Bus India', 'Private Suite Motorcoach', 'Mumbai to Udaipur Luxury Bus'],
  },
  {
    id: 'blog-02',
    slug: 'culinary-journey-marwari-and-konkan-tasting-menus-at-80-kmh',
    title: 'Fresh Hot Meals & Filter Coffee Onboard: Redefining Highway Dining',
    category: 'Culinary Heritage',
    author: 'Chef Devika Rathore',
    authorRole: 'Culinary Director, Aurelia Overland',
    publishedDate: 'October 08, 2026',
    readTimeMinutes: 5,
    featuredCorridor: 'Mumbai — Goa (AO-308)',
    excerpt:
      'Skip unhygienic midnight highway stops with our onboard pantry, sealed hot regional meal boxes, and morning filter coffee served at your berth.',
    contentParagraphs: [
      'One of the biggest inconveniences of overnight road travel is the unscheduled midnight stop. For families, solo women travellers, and executives, stepping out late at night disrupts both safety and sleep.',
      'Aboard every Aurelia Overland coach, our forward pantry serves freshly prepared regional meals directly at your berth’s fold-out table, accompanied by morning masala chai or South Indian filter kaapi.',
      'Registered members can pre-select Jain Sattvik, Marwari Vegetarian, or Coastal Konkan meal preferences in their Member Portal at no extra cost.',
    ],
    seoKeywords: ['AC Sleeper Bus with Food', 'Jain Travel India', 'Mumbai to Goa Sleeper Bus'],
  },
  {
    id: 'blog-03',
    slug: 'delhi-to-jaipur-and-udaipur-diplomatic-concourse-guide',
    title: 'Delhi to Jaipur in 4.5 Hours for ₹899: The Express Highway Guide',
    category: 'Corridor Guides',
    author: 'Vikramjit Sen',
    authorRole: 'Head of Sovereign Pavilions & Concierge',
    publishedDate: 'September 29, 2026',
    readTimeMinutes: 4,
    featuredCorridor: 'New Delhi — Jaipur — Udaipur',
    excerpt:
      'How the new expressway corridor and our clean departure lounges in Delhi, Jaipur, and Udaipur make luxury bus travel faster and more comfortable than ever.',
    contentParagraphs: [
      'With fares starting at just ₹899 on the New Delhi to Jaipur Rajputana Imperial Salon (AO-204), travellers enjoy air-conditioned lounge seating before boarding, zero-delay expressway routing, and spacious lie-flat berths.',
      'Every coach is tracked via live GPS and equipped with verified security cameras, dedicated Ladies Priority berths, and 24/7 WhatsApp customer support.',
    ],
    seoKeywords: ['Delhi to Jaipur Bus ₹899', 'Delhi to Udaipur Volvo Sleeper', 'Luxury Bus Lounge India'],
  },
  {
    id: 'blog-04',
    slug: 'why-we-enforced-captcha-and-anti-bot-suite-protection',
    title: 'Protecting Fair Fares: How Google reCAPTCHA Stops Festive Ticket Touts',
    category: 'Concierge Dispatch',
    author: 'Ananya Sundaram',
    authorRole: 'VP of Digital Trust & Passenger Security',
    publishedDate: 'September 18, 2026',
    readTimeMinutes: 4,
    featuredCorridor: 'All 10 Indian Corridors',
    excerpt:
      'During Diwali and weekend peaks, automated bots try to bulk-buy sleeper berths to resell at inflated prices. Here is how our Google reCAPTCHA gate protects genuine passengers.',
    contentParagraphs: [
      'Because our luxury sleeper berths are priced affordably from ₹899 to ₹1,899, unauthorized agents often attempt to use automated scripts to lock lower-deck suites as soon as bookings open.',
      'Our integrated Google reCAPTCHA v2 verification and 4-berth limit per PNR ensure that real families and travellers always get fair direct prices with instant email E-Ticket confirmation.',
    ],
    seoKeywords: ['Secure Bus Booking India', 'Google reCAPTCHA Bus Ticket', 'Verified Bus PNR'],
  },
];

export const INITIAL_REVIEWS: PassengerReview[] = [
  {
    id: 'rev-01',
    passengerName: 'Devika Rathore',
    passengerRole: 'Managing Partner, Mewar Heritage Hospitality',
    corridor: 'Mumbai to Udaipur',
    suiteType: 'Presidential Cabin (L1A)',
    rating: 5,
    verifiedPnr: 'AOV-MUM882104',
    publishedDate: 'October 16, 2026',
    source: 'Google Business Profile',
    title: 'Incredible luxury sleeper comfort at ₹1,499!',
    comment:
      'Getting a private enclosed sleeper berth with clean white linen, hot dinner, and punctual arrival in Udaipur for ₹1,499 is unbeatable value. Worli Lounge check-in took 4 minutes and the bed was super comfortable.',
  },
  {
    id: 'rev-02',
    passengerName: 'Siddharth Reddy',
    passengerRole: 'Chief Investment Officer, Deccan Ventures',
    corridor: 'Bengaluru to Hyderabad',
    suiteType: 'Sovereign Suite (L2A)',
    rating: 5,
    verifiedPnr: 'AOV-BLR519032',
    publishedDate: 'October 11, 2026',
    source: 'Verified PNR Manifesto',
    title: 'Super quiet cabin, great Wi-Fi, and on-time arrival at Banjara Hills',
    comment:
      'The privacy door on the Bengaluru–Hyderabad coach let me work on my laptop until 11 PM and sleep peacefully for 7 hours. Arriving right in Banjara Hills saved me the long airport taxi ride.',
  },
  {
    id: 'rev-03',
    passengerName: 'Meenakshi Sundaram',
    passengerRole: 'Senior Advocate, Madras High Court',
    corridor: 'Chennai to Mysuru',
    suiteType: 'Ladies Priority Suite (L3B)',
    rating: 5,
    verifiedPnr: 'AOV-MAA304918',
    publishedDate: 'October 04, 2026',
    source: 'Google Business Profile',
    title: 'Best and safest overnight bus for solo women travellers',
    comment:
      'At just ₹999 from Chennai to Mysuru, the dedicated Ladies Suite with internal privacy lock, courteous onboard attendant, and live GPS tracking sets a gold standard for Indian bus travel.',
  },
  {
    id: 'rev-04',
    passengerName: 'Kabir & Tara Malhotra',
    passengerRole: 'Architects, Studio Alibaug & Goa',
    corridor: 'Mumbai to Goa',
    suiteType: 'Royal Sleeper Pod (U1A, U1B)',
    rating: 5,
    verifiedPnr: 'AOV-BOM408219',
    publishedDate: 'September 27, 2026',
    source: 'Google Business Profile',
    title: 'Waking up to the Western Ghats sunrise with hot filter coffee',
    comment:
      'Booking two Upper Deck Sky Pods to Goa for ₹1,299 each was amazing. Clean washroom onboard, zero-gravity backrest, and hot filter coffee in the morning!',
  },
];

export function formatInr(amount: number): string {
  const rounded = Math.round(amount);
  return '₹' + rounded.toLocaleString('en-IN');
}

export function filterCoachRoutes(
  routes: LuxuryCoachRoute[],
  origin?: string,
  destination?: string,
  coachClass?: string
): LuxuryCoachRoute[] {
  return routes.filter((route) => {
    const matchOrigin = !origin || origin === 'All' || route.origin === origin;
    const matchDest = !destination || destination === 'All' || route.destination === destination;
    const matchClass = !coachClass || coachClass === 'All' || route.coachClass === coachClass;
    return matchOrigin && matchDest && matchClass;
  });
}

export function filterBlogPosts(
  posts: BlogPost[],
  category: string = 'All',
  searchQuery: string = ''
): BlogPost[] {
  const q = searchQuery.trim().toLowerCase();
  return posts.filter((post) => {
    const matchCat = !category || category === 'All' || post.category === category;
    const matchQuery =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.featuredCorridor.toLowerCase().includes(q) ||
      post.seoKeywords.some((k) => k.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });
}

export function calculateReviewStats(reviews: PassengerReview[]): {
  averageRating: number;
  totalCount: number;
  fiveStarPercent: number;
} {
  if (reviews.length === 0) {
    return { averageRating: 0, totalCount: 0, fiveStarPercent: 0 };
  }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const fiveStars = reviews.filter((r) => r.rating === 5).length;
  return {
    averageRating: Number((sum / reviews.length).toFixed(2)),
    totalCount: reviews.length,
    fiveStarPercent: Math.round((fiveStars / reviews.length) * 100),
  };
}

export function computeAnalyticsSummary(
  routes: LuxuryCoachRoute[],
  bookings: BookingRecord[],
  reviews: PassengerReview[]
): AnalyticsSummary {
  const activeBookings = bookings.filter((b) => b.status !== 'Cancelled');
  const bookedRevenue = activeBookings.reduce((sum, b) => sum + b.fare.totalInr, 0);

  let totalSuitesBooked = 0;
  let totalSuitesCapacity = 0;
  let fleetOccupiedRevenue = 0;

  const corridorPerformance = routes.map((route) => {
    const occupied = route.seats.filter((s) => s.status === 'occupied');
    const occupiedSuites = occupied.length;
    const totalSuites = route.seats.length;
    const occupancyPercent = Math.round((occupiedSuites / totalSuites) * 100);
    const estimatedRevenueInr = occupied.reduce((sum, s) => sum + Math.round(s.priceInr * 1.05), 0);

    totalSuitesBooked += occupiedSuites;
    totalSuitesCapacity += totalSuites;
    fleetOccupiedRevenue += estimatedRevenueInr;

    return {
      routeId: route.id,
      coachCode: route.coachCode,
      corridorLabel: `${route.origin} → ${route.destination}`,
      occupiedSuites,
      totalSuites,
      occupancyPercent,
      estimatedRevenueInr,
    };
  });

  const revStats = calculateReviewStats(reviews);

  return {
    totalGrossRevenueInr: fleetOccupiedRevenue + bookedRevenue,
    confirmedBookingsCount: activeBookings.length + 18,
    overallOccupancyPercent:
      totalSuitesCapacity > 0 ? Math.round((totalSuitesBooked / totalSuitesCapacity) * 100) : 0,
    totalSuitesBooked,
    totalSuitesCapacity,
    averageRating: revStats.averageRating,
    totalReviewsCount: 424 + reviews.length,
    googleSearchImpressions30d: 48920 + activeBookings.length * 110,
    whatsappAndCallConversions30d: 312 + activeBookings.length * 3,
    corridorPerformance,
  };
}

export function toggleSeatSelection(
  currentSelected: string[],
  seat: SuiteSeat,
  maxSeats = 4
): { selected: string[]; error?: string } {
  if (seat.status === 'occupied') {
    return {
      selected: currentSelected,
      error: `Suite ${seat.id} is already occupied on this departure.`,
    };
  }
  if (currentSelected.includes(seat.id)) {
    return {
      selected: currentSelected.filter((id) => id !== seat.id),
    };
  }
  if (currentSelected.length >= maxSeats) {
    return {
      selected: currentSelected,
      error: `Maximum ${maxSeats} private suites permitted per transaction to prevent automated block hoarding.`,
    };
  }
  return {
    selected: [...currentSelected, seat.id],
  };
}

export function calculateFareBreakdown(
  seats: SuiteSeat[],
  selectedSeatIds: string[],
  isLoggedInMember = false
): FareBreakdown {
  const chosen = seats.filter((s) => selectedSeatIds.includes(s.id));
  const seatCount = chosen.length;
  if (seatCount === 0) {
    return {
      seatCount: 0,
      subtotalInr: 0,
      loungeConciergeInr: 0,
      memberDiscountInr: 0,
      gstInr: 0,
      totalInr: 0,
    };
  }
  const subtotalInr = chosen.reduce((sum, s) => sum + s.priceInr, 0);
  const loungeConciergeInr = seatCount * 99;
  const memberDiscountInr = isLoggedInMember ? Math.round(subtotalInr * 0.1) : 0;
  const taxableAmount = subtotalInr + loungeConciergeInr - memberDiscountInr;
  // Standard Indian AC Motorcoach Passenger GST is 5%
  const gstInr = Math.round(taxableAmount * 0.05);
  const totalInr = taxableAmount + gstInr;

  return {
    seatCount,
    subtotalInr,
    loungeConciergeInr,
    memberDiscountInr,
    gstInr,
    totalInr,
  };
}

const CAPTCHA_POOL: Array<{ code: string; questionText: string; expectedAnswer: string }> = [
  { code: 'AO-84K9', questionText: 'Enter security glyph: AO-84K9', expectedAnswer: 'AO-84K9' },
  { code: 'udr-72x', questionText: 'Enter security glyph: UDR-72X', expectedAnswer: 'UDR-72X' },
  { code: 'BOM-91M', questionText: 'Enter security glyph: BOM-91M', expectedAnswer: 'BOM-91M' },
  { code: 'DEL-46Q', questionText: 'Enter security glyph: DEL-46Q', expectedAnswer: 'DEL-46Q' },
  { code: 'JAI-53V', questionText: 'Enter security glyph: JAI-53V', expectedAnswer: 'JAI-53V' },
];

export function generateCaptchaChallenge(seedIndex = 0): CaptchaChallenge {
  const idx = Math.abs(seedIndex) % CAPTCHA_POOL.length;
  const item = CAPTCHA_POOL[idx];
  return {
    id: `cap-${idx}-${Date.now()}`,
    code: item.expectedAnswer,
    questionText: item.questionText,
    expectedAnswer: item.expectedAnswer,
    issuedAt: Date.now(),
  };
}

export function verifyAntiBotSecurity(params: {
  notARobotChecked: boolean;
  captchaInput: string;
  expectedCaptcha: string;
}): { valid: boolean; error?: string } {
  if (!params.notARobotChecked) {
    return {
      valid: false,
      error: 'Please complete the Google reCAPTCHA "I\'m not a robot" verification checkbox before proceeding.',
    };
  }
  const cleanedInput = (params.captchaInput || '').trim().toUpperCase();
  const cleanedExpected = (params.expectedCaptcha || '').trim().toUpperCase();
  if (!cleanedInput) {
    return {
      valid: false,
      error: 'Please complete the security challenge or enter the verification code.',
    };
  }
  if (cleanedInput !== cleanedExpected) {
    return {
      valid: false,
      error: 'Verification challenge code did not match. Please try again.',
    };
  }
  return { valid: true };
}

export function validatePaymentGatewayInput(payload: PaymentPayload): {
  valid: boolean;
  error?: string;
  methodLabel: string;
} {
  if (payload.method === 'upi') {
    const upi = (payload.upiId || '').trim();
    const upiRegex = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/;
    if (!upiRegex.test(upi)) {
      return {
        valid: false,
        error: 'Enter a valid verified UPI handle (for example: traveller@okhdfcbank).',
        methodLabel: 'UPI Instant Mandate',
      };
    }
    return { valid: true, methodLabel: `UPI Instant (${upi})` };
  }

  if (payload.method === 'card') {
    const digits = (payload.cardNumber || '').replace(/\s+/g, '');
    if (!/^\d{16}$/.test(digits)) {
      return {
        valid: false,
        error: 'Enter a valid 16-digit debit or credit card number.',
        methodLabel: 'Card Payment',
      };
    }
    if (!(payload.cardHolder || '').trim() || (payload.cardHolder || '').trim().length < 3) {
      return {
        valid: false,
        error: 'Enter the cardholder name as shown on the card.',
        methodLabel: 'Card Payment',
      };
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test((payload.cardExpiry || '').trim())) {
      return {
        valid: false,
        error: 'Enter card expiry in MM/YY format.',
        methodLabel: 'Card Payment',
      };
    }
    if (!/^\d{3,4}$/.test((payload.cardCvv || '').trim())) {
      return {
        valid: false,
        error: 'Enter a valid 3 or 4 digit security CVV.',
        methodLabel: 'Card Payment',
      };
    }
    const last4 = digits.slice(-4);
    return { valid: true, methodLabel: `Card •••• ${last4}` };
  }

  if (payload.method === 'netbanking') {
    if (!(payload.bankCode || '').trim()) {
      return {
        valid: false,
        error: 'Select an Indian bank for NetBanking authorization.',
        methodLabel: 'NetBanking',
      };
    }
    return { valid: true, methodLabel: `NetBanking (${payload.bankCode})` };
  }

  return { valid: false, error: 'Unsupported payment gateway method.', methodLabel: 'Unknown' };
}

export function buildConfirmedBookingRecord(params: {
  route: LuxuryCoachRoute;
  travelDate: string;
  selectedSeats: string[];
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  dietaryPreference: string;
  chauffeurPickup: string;
  paymentMethodLabel: string;
  fare: FareBreakdown;
  deterministicSuffix?: string;
}): BookingRecord {
  const suffix =
    params.deterministicSuffix ||
    Math.floor(100000 + Math.random() * 900000)
      .toString()
      .slice(0, 6);
  const pnr = `AOV-${params.route.origin.slice(0, 3).toUpperCase()}${suffix}`;
  const transactionId = `TXN-INR-${suffix}-99`;
  const nowIso = new Date().toISOString();

  const subject = `Confirmed Bus E-Ticket ${pnr} · ${params.route.origin} to ${params.route.destination} (${params.route.coachName})`;
  const bodyPreview = [
    `Dear ${params.passengerName},`,
    `Your luxury sleeper reservation aboard ${params.route.coachName} (${params.route.coachCode}) is confirmed.`,
    `Route: ${params.route.origin} (${params.route.originTerminal}) → ${params.route.destination} (${params.route.destinationTerminal})`,
    `Departure: ${params.travelDate} at ${params.route.departureTime} IST · Seats/Berths Assigned: ${params.selectedSeats.join(', ')}`,
    `Total Paid: ${formatInr(params.fare.totalInr)} (incl. 5% GST) via ${params.paymentMethodLabel} · Ref: ${transactionId}`,
    `Pickup & Boarding Note: ${params.chauffeurPickup || 'Report at departure lounge 30 mins prior to departure.'}`,
  ].join('\n');

  return {
    pnr,
    transactionId,
    coachId: params.route.id,
    coachName: params.route.coachName,
    coachCode: params.route.coachCode,
    origin: params.route.origin,
    destination: params.route.destination,
    originTerminal: params.route.originTerminal,
    destinationTerminal: params.route.destinationTerminal,
    travelDate: params.travelDate,
    departureTime: params.route.departureTime,
    arrivalTime: params.route.arrivalTime,
    selectedSeats: [...params.selectedSeats],
    passengerName: params.passengerName.trim(),
    passengerEmail: params.passengerEmail.trim(),
    passengerPhone: params.passengerPhone.trim(),
    dietaryPreference: params.dietaryPreference,
    chauffeurPickup: params.chauffeurPickup.trim(),
    paymentMethodLabel: params.paymentMethodLabel,
    fare: params.fare,
    status: 'Confirmed',
    createdAtIso: nowIso,
    emailDispatchLog: {
      recipient: params.passengerEmail.trim(),
      subject,
      dispatchedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      messageId: `<${pnr.toLowerCase()}@dispatch.aureliaoverland.in>`,
      bodyPreview,
    },
  };
}
