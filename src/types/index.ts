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
  hourlyRate: number
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
  budget: number
}

export interface MatchBreakdown {
  skill: number
  availability: number
  proximity: number
  rating: number
  price: number
}

export interface Match {
  coach: Coach
  score: number // 0–100
  km: number
  breakdown: MatchBreakdown
  reasons: string[]
  sessionPrice: number
}

export type PackageType = 'single' | 'five' | 'ten'

/**
 * Concession: verified concession card or school equity program (third-degree price discrimination).
 * Standard: default.
 * Performance: adds video analysis + a written progress plan (a product upgrade, not just a higher price).
 */
export type Tier = 'concession' | 'standard' | 'performance'

export interface PriceQuote {
  baseRate: number
  peakMultiplier: number
  isPeak: boolean
  tierRate: number
  packageDiscount: number
  sessions: number
  unitPrice: number
  total: number
  saving: number
  platformFee: number
  coachPayout: number
}

export interface Booking {
  id: string
  coachId: string
  athleteId: string
  athleteName: string
  request: SessionRequest
  packageType: PackageType
  tier: Tier
  quote: PriceQuote
  createdAt: string
  sessionsUsed: number
  source: 'direct' | 'offer'
}

// ─── Accounts & the two-sided marketplace ─────────────────────────────────

export type Role = 'athlete' | 'coach'

export interface AthleteProfile {
  sport: SportId
  level: Level
  suburb: string
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
  price: number
  message: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

export interface DB {
  version: 2
  users: User[]
  coaches: Coach[] // coaches created by sign-up (seed coaches live in data/coaches.ts)
  requests: OpenRequest[]
  offers: Offer[]
  bookings: Booking[]
}
