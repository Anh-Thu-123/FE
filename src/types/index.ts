/**
 * Type definitions mirroring the MongoDB schema & API contract described in
 * "khung-he-thong-nagare-v1.1.html" (muc 05 - Mo hinh du lieu, muc 07 - Thiet ke API).
 * Keep these in sync with the backend once it stabilizes.
 */

export type Locale = "vi" | "ja";

export interface Bilingual {
  vi: string;
  ja: string;
}

/* ---------------------------------- Auth --------------------------------- */

export type Role =
  | "DIRECTOR" // Giam doc
  | "SECRETARY" // Thu ky
  | "OPS_MANAGER" // Truong phong Dieu hanh
  | "TOUR_DESIGNER" // Nhan vien Thiet ke Tour
  | "TOUR_GUIDE" // Nhan vien Dan tour (HDV)
  | "MKT_MANAGER" // Truong phong Marketing
  | "MKT_STAFF" // Nhan vien Marketing & CSKH
  | "CUSTOMER";

export type UserStatus = "ACTIVE" | "LOCKED";

export interface AuthUser {
  id: string;
  username: string;
  role: Role;
  status: UserStatus;
  mustChangePassword: boolean;
  employeeId?: string;
  customerId?: string;
  permissions: string[]; // flat list of permission keys used to build the menu
  fullName?: string;
}

/* -------------------------------- Employees ------------------------------- */

export type Department = "BGD" | "OPERATIONS" | "SALES";

export interface GuideProfile {
  licenseNo?: string;
  licenseExpiry?: string;
  specialties?: string[];
}

export interface Employee {
  id: string;
  userId?: string;
  code: string;
  fullName: string;
  position: string;
  department: Department;
  phone: string;
  email: string;
  languages: ("vi" | "ja" | "en")[];
  joinedAt: string;
  status: UserStatus;
  guideProfile?: GuideProfile;
}

/* -------------------------------- Customers ------------------------------- */

export type CustomerSource = "WEB" | "PHONE" | "ZALO" | "WALK_IN" | "IMPORT";

export interface Customer {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  email?: string;
  zalo?: string;
  nationality: string;
  dob?: string;
  address?: string;
  source: CustomerSource;
  tags: string[];
  ownerId?: string;
  mergedIntoId?: string;
  note?: string;
  createdAt: string;
}

/* ---------------------------------- Tours --------------------------------- */

export type TourType = "OUTBOUND" | "INBOUND" | "DOMESTIC";
export type TourTheme =
  | "HEALING"
  | "YOUTH"
  | "ACADEMIC"
  | "CLASSIC"
  | "NATURE"
  | "ADVENTURE"
  | "HERITAGE";

export type PublicationStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED";

export interface ItineraryDay {
  day: number;
  title: Bilingual;
  detail: Bilingual;
  meals: string[];
  accommodation?: string;
}

export interface TourImage {
  publicId: string;
  alt: Bilingual;
}

export interface Tour {
  id: string;
  code: string;
  type: TourType;
  theme: TourTheme;
  title: Bilingual;
  slug: Bilingual;
  summary: Bilingual;
  highlights: Bilingual[];
  targetAudience: Bilingual;
  durationDays: number;
  durationNights: number;
  destinations: string[];
  itinerary: ItineraryDay[];
  inclusions: Bilingual[];
  exclusions: Bilingual[];
  coverImage?: string;
  images: TourImage[];
  basePriceAdult: number;
  currency: "VND" | "JPY";
  designerId?: string;
  publication: {
    vi: { status: PublicationStatus; publishedAt?: string };
    ja: { status: PublicationStatus; publishedAt?: string };
  };
}

/* ------------------------------- Departures -------------------------------- */

export type DepartureStatus =
  | "OPEN"
  | "GUARANTEED"
  | "FULL"
  | "CLOSED"
  | "CANCELLED"
  | "COMPLETED";

export interface Departure {
  id: string;
  tourId: string;
  code: string;
  departDate: string;
  returnDate: string;
  capacity: number;
  minPax: number;
  seatsHeld: number;
  seatsConfirmed: number;
  currency: "VND" | "JPY";
  priceAdult: number;
  priceChild: number;
  priceInfant: number;
  singleSupplement: number;
  fxRateToVnd?: number;
  status: DepartureStatus;
  meetingPoint?: Bilingual;
  note?: string;
  /** Derived client-side helper: capacity - seatsHeld - seatsConfirmed */
  seatsAvailable?: number;
}

/* ------------------------------ Add-on services ----------------------------- */

export type AddOnCategory =
  | "CONCERT"
  | "WORKSHOP"
  | "COSTUME_PHOTO"
  | "PRIVATE_ONSEN"
  | "SIM_WIFI"
  | "OTHER";
export type PricingUnit = "PER_PAX" | "PER_BOOKING" | "PER_GROUP";

export interface AddOnService {
  id: string;
  code: string;
  name: Bilingual;
  description: Bilingual;
  category: AddOnCategory;
  pricingUnit: PricingUnit;
  price: number;
  currency: "VND" | "JPY";
  appliesTo: { tourTypes: TourType[]; tourIds: string[] };
  leadTimeDays: number;
  requiresConfirmation: boolean;
  status: "ACTIVE" | "INACTIVE";
}

/* ---------------------------------- Bookings -------------------------------- */

export type BookingKind = "JOIN" | "CUSTOM";
export type PaxType = "ADULT" | "CHILD" | "INFANT";
export type BookingStatus = "HELD" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type AddOnLineStatus = "REQUESTED" | "CONFIRMED" | "UNAVAILABLE";
export type PaymentDirection = "RECEIPT" | "REFUND";
export type PaymentMethod = "CASH" | "BANK_TRANSFER";

export interface Pax {
  paxId: string;
  fullName: string;
  dob: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  paxType: PaxType;
  occupiesSeat: boolean;
  passportNo?: string;
  passportExpiry?: string;
  nationality: string;
  dietary?: string;
  note?: string;
}

export interface BookingAddOnLine {
  addOnId: string;
  nameSnapshot: Bilingual;
  unitPrice: number;
  quantity: number;
  paxIds: string[];
  status: AddOnLineStatus;
}

export interface Payment {
  direction: PaymentDirection;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  recordedBy: string;
  reference?: string;
  note?: string;
}

export interface BookingPricing {
  adultCount: number;
  childCount: number;
  infantCount: number;
  unitPrices: Record<string, number>;
  addOnTotal: number;
  subtotal: number;
  discount: number;
  total: number;
  currency: "VND" | "JPY";
  fxRateToVnd?: number;
}

export interface TimelineEntry {
  at: string;
  by: string;
  action: string;
  note?: string;
}

export interface Booking {
  id: string;
  code: string;
  kind: BookingKind;
  departureId?: string;
  tourId?: string;
  tourRequestId?: string;
  quoteVersion?: number;
  customerId?: string;
  contact: { fullName: string; phone: string; email?: string; zalo?: string };
  pax: Pax[];
  addOns: BookingAddOnLine[];
  status: BookingStatus;
  holdExpiresAt?: string;
  pricing: BookingPricing;
  payments: Payment[];
  salesOwnerId?: string;
  source?: string;
  cancelReason?: string;
  timeline: TimelineEntry[];
  createdAt: string;
  /** Derived client-side: sum(RECEIPT) - sum(REFUND) */
  paidAmount?: number;
  balance?: number;
}

/* -------------------------------- Tour requests ------------------------------ */

export type TourRequestStatus = "NEW" | "ASSIGNED" | "QUOTING" | "QUOTED" | "WON" | "LOST";

export interface Quote {
  version: number;
  summary: Bilingual;
  itinerary: ItineraryDay[];
  pricePerPax: number;
  total: number;
  validUntil: string;
  createdBy: string;
  createdAt: string;
}

export interface TourRequest {
  id: string;
  customerId?: string;
  contact: { fullName: string; phone: string; email?: string };
  direction: TourType;
  destinations: string[];
  desiredFrom?: string;
  desiredTo?: string;
  flexibleDays?: number;
  paxAdult: number;
  paxChild: number;
  budgetPerPax?: number;
  interests: string[];
  status: TourRequestStatus;
  assigneeId?: string;
  quotes: Quote[];
  convertedBookingId?: string;
  lostReason?: string;
  createdAt: string;
}

/* --------------------------------- Assignments -------------------------------- */

export type AssignmentRole = "LEAD_GUIDE" | "ASSISTANT_GUIDE" | "OPERATOR";
export type AssignmentStatus = "PLANNED" | "CONFIRMED" | "DONE" | "CANCELLED";

export interface Assignment {
  id: string;
  employeeId: string;
  departureId: string;
  role: AssignmentRole;
  startDate: string;
  endDate: string;
  status: AssignmentStatus;
  handoverFromId?: string;
}

/* ---------------------------------- Tour logs --------------------------------- */

export type TourLogType = "DAILY_LOG" | "INCIDENT" | "FINAL_REPORT";

export interface TourLog {
  id: string;
  departureId: string;
  authorId: string;
  type: TourLogType;
  day?: number;
  content: string;
  photos: string[];
  expenses: { item: string; amount: number; receiptPublicId?: string }[];
  createdAt: string;
}

export interface TourFeedback {
  id: string;
  departureId: string;
  bookingId: string;
  customerId?: string;
  guideScore: number;
  serviceScore: number;
  overallScore: number;
  comment?: string;
  wouldRecommend: boolean;
  submittedAt: string;
}

/* ---------------------------------- Visa cases --------------------------------- */

export type VisaCaseType = "JAPAN_VISA" | "TEMP_RESIDENCE" | "VISIT_JAPAN_WEB" | "MINOR_CONSENT";
export type VisaCaseStatus = "COLLECTING" | "SUBMITTED" | "EXTRA_REQUIRED" | "APPROVED" | "REJECTED";
export type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface VisaDocument {
  docId: string;
  docType: string;
  publicId: string;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  status: DocumentStatus;
  rejectReason?: string;
}

export interface VisaCase {
  id: string;
  bookingId: string;
  paxId: string;
  customerName: string;
  caseType: VisaCaseType;
  status: VisaCaseStatus;
  deadline: string;
  appointmentAt?: string;
  handlerId?: string;
  documents: VisaDocument[];
  notes: { at: string; by: string; text: string }[];
  purgeAfter?: string;
}

/* ------------------------------- Leave / attendance ------------------------------ */

export type LeaveType = "ANNUAL" | "SICK" | "UNPAID" | "BUSINESS_TRIP";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  fromDate: string;
  toDate: string;
  halfDay?: boolean;
  reason: string;
  status: LeaveStatus;
  approverId?: string;
  decidedAt?: string;
  decisionNote?: string;
  /** Client-side warning: conflicting assignments in this date range */
  conflictingAssignments?: Assignment[];
}

export type AttendanceSource = "WEB" | "ON_TOUR" | "LEAVE";

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkInAt?: string;
  checkOutAt?: string;
  source: AttendanceSource;
  departureId?: string;
  note?: string;
}

/* --------------------------------- Notifications --------------------------------- */

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  readAt?: string;
  createdAt: string;
}

/* ------------------------------------ Reports ------------------------------------ */

export interface RevenuePoint {
  period: string;
  revenue: number;
  bookingsCount: number;
}

export interface OccupancyPoint {
  departureId: string;
  tourTitle: string;
  departDate: string;
  capacity: number;
  seatsConfirmed: number;
  minPax: number;
  occupancyRate: number;
}

export interface GuidePerformancePoint {
  employeeId: string;
  fullName: string;
  daysGuided: number;
  averageScore: number;
  toursCount: number;
}

/* --------------------------------- API envelope ----------------------------------- */

export interface ApiError {
  code: string;
  message: string;
  fieldErrors?: { field: string; message: string }[];
}

export interface PageResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
