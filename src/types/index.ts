export type SportId = 'athletics' | 'soccer' | 'tennis' | 'padel' | 'boxing' | 'swimming'

export interface Sport {
  id: SportId
  name: string
  emoji: string
  skills: string[]
}

export type Level = 'Beginner' | 'Intermediate' | 'Competitive' | 'Elite'

/** Morning 6–10am, Afternoon 3–7pm, Evening 7–9pm */
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
  request: SessionRequest
  packageType: PackageType
  tier: Tier
  quote: PriceQuote
  createdAt: string
  sessionsUsed: number
}
