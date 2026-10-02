export type SportId = 'athletics' | 'soccer' | 'tennis' | 'padel' | 'boxing' | 'swimming'

export interface Sport {
  id: SportId
  name: string
  skills: string[]
}

export type Level = 'Beginner' | 'Intermediate' | 'Competitive' | 'Elite'

/** Morning 6–10am, After school 3–7pm, Evening 7–9pm */
export type TimeBlock = 'morning' | 'afternoon' | 'evening'

export interface Suburb {
  name: string
  lat: number
  lng: number
}

export type VerificationStatus = 'verified' | 'pending' | 'expired'

export interface Verifications {
  wwcc: VerificationStatus
  firstAid: VerificationStatus
  accreditation: VerificationStatus
}

export interface Review {
  author: string
  rating: number
  text: string
  when: string
}

export interface Coach {
  id: string
  name: string
  initials: string
  sport: SportId
  skills: string[]
  levels: Level[]
  suburb: string
  venue: string
  rating: number
  reviewCount: number
  sessionsRun: number
  yearsCoaching: number
  bio: string
  verifications: Verifications
  /** day of week (0 = Sunday) → blocks the coach is free */
  availability: Partial<Record<number, TimeBlock[]>>
  reviews: Review[]
  hue: number
  /** set when the coach is a signed-up user rather than seed data */
  userId?: string
}

export interface SessionRequest {
  sport: SportId
  skill: string
  level: Level
  date: string // ISO yyyy-mm-dd
  block: TimeBlock
  suburb: string
  /** price segment: decides what the athlete pays */
  segment: Segment
}

export interface MatchBreakdown {
  skill: number
  availability: number
  proximity: number
  rating: number
}

export interface Match {
  coach: Coach
  score: number // 0–100
  km: number
  breakdown: MatchBreakdown
  reasons: string[]
  sessionPrice: number
}

/** Third-degree price discrimination: verified school and university students pay the concession price. */
export type Segment = 'concession' | 'standard'

/** Dynamic pricing slot (standard sessions only move with it). */
export type SlotType = 'peak' | 'base' | 'offpeak'

export interface PriceQuote {
  segment: Segment
  slot: SlotType
  /** A$40 concession or A$60 standard */
  listPrice: number
  /** after dynamic pricing (A$51 / A$60 / A$72 standard; concession stays A$40) */
  sessionPrice: number
  /** first-session offer: price brought down to A$20 */
  introDiscount: number
  /** what the athlete pays for the session */
  sessionTotal: number
  /** first month of Onside Premium, if added at checkout */
  premiumFee: number
  total: number
  /** A$35 flat plus any peak surge */
  coachPayout: number
  peakBonus: number
  /** Onside's margin on the session (negative when it funds the first-session offer) */
  onsideMargin: number
}

export interface Booking {
  id: string
  coachId: string
  athleteId: string
  athleteName: string
  request: SessionRequest
  quote: PriceQuote
  createdAt: string
  source: 'direct' | 'offer'
}

// ─── Accounts & the two-sided marketplace ─────────────────────────────────

export type Role = 'athlete' | 'coach'

export interface AthleteProfile {
  sport: SportId
  level: Level
  suburb: string
  /** verified school or university student: concession price */
  student?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
  role?: Role
  dob?: string // ISO yyyy-mm-dd
  athlete?: AthleteProfile
  /** Onside Premium member */
  premium?: boolean
  /** for coaches: the Coach record they own */
  coachId?: string
}

/** An athlete's public "looking for a coach" post that coaches can respond to. */
export interface OpenRequest extends SessionRequest {
  id: string
  athleteId: string
  athleteName: string
  athleteAge?: number
  note: string
  createdAt: string
  status: 'open' | 'matched'
}

export interface Offer {
  id: string
  requestId: string
  coachId: string
  athleteId: string
  /** what the athlete will pay for the session (set by Onside's pricing, not the coach) */
  price: number
  message: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

export interface DB {
  version: 3
  users: User[]
  coaches: Coach[] // coaches created by sign-up (seed coaches live in data/coaches.ts)
  requests: OpenRequest[]
  offers: Offer[]
  bookings: Booking[]
}
