import type { PackageType, PriceQuote, TimeBlock, Tier } from '../types'

/**
 * The Onside pricing engine. Every number here should match the report's financials.
 *
 *   unitPrice   = coachRate × peakMultiplier × tierRate × packageDiscount
 *   platformFee = total × TAKE_RATE
 *   coachPayout = total − platformFee
 */

/** Platform's share of every booking (two-sided platform price structure). */
export const TAKE_RATE = 0.15

/** Dynamic pricing: weekends and weekday after-school slots are peak (perishable inventory). */
export const PEAK_MULTIPLIER = 1.15

/** Third-degree price discrimination by verified group; Performance is a product upgrade. */
export const TIERS: Record<Tier, { label: string; rate: number; blurb: string; perks: string[] }> = {
  concession: {
    label: 'Concession',
    rate: 0.5,
    blurb: 'Verified concession card or school equity program',
    perks: ['Same vetted coaches', 'Verification required at booking'],
  },
  standard: {
    label: 'Standard',
    rate: 1,
    blurb: 'Most athletes',
    perks: ['Vetted coach', 'In-app payment & refunds', 'Session notes'],
  },
  performance: {
    label: 'Performance',
    rate: 1.5,
    blurb: 'For athletes chasing selection',
    perks: ['Everything in Standard', 'Slow-motion video analysis', 'Written 4-week progress plan', 'Priority booking'],
  },
}

/** Second-degree price discrimination: bigger bundles, lower per-session price. */
export const PACKAGES: Record<PackageType, { label: string; sessions: number; discount: number; tag?: string }> = {
  single: { label: 'Single session', sessions: 1, discount: 1 },
  five: { label: '5-session pack', sessions: 5, discount: 0.92, tag: 'Save 8%' },
  ten: { label: '10-session pack', sessions: 10, discount: 0.85, tag: 'Best value · save 15%' },
}

export function isPeak(dateISO: string, block: TimeBlock): boolean {
  const day = new Date(dateISO + 'T12:00:00').getDay()
  const weekend = day === 0 || day === 6
  return weekend || block === 'afternoon'
}

export function quote(
  coachRate: number,
  dateISO: string,
  block: TimeBlock,
  tier: Tier,
  pkg: PackageType,
): PriceQuote {
  const peak = isPeak(dateISO, block)
  const peakMultiplier = peak ? PEAK_MULTIPLIER : 1
  const tierRate = TIERS[tier].rate
  const { sessions, discount } = PACKAGES[pkg]

  const fullUnit = coachRate * peakMultiplier * tierRate
  const unitPrice = Math.round(fullUnit * discount)
  const total = unitPrice * sessions
  const saving = Math.round(fullUnit * sessions) - total
  const platformFee = Math.round(total * TAKE_RATE)

  return {
    baseRate: coachRate,
    peakMultiplier,
    isPeak: peak,
    tierRate,
    packageDiscount: discount,
    sessions,
    unitPrice,
    total,
    saving,
    platformFee,
    coachPayout: total - platformFee,
  }
}

/** Price an athlete sees in search results: single session, standard tier. */
export const listPrice = (coachRate: number, dateISO: string, block: TimeBlock) =>
  quote(coachRate, dateISO, block, 'standard', 'single').unitPrice
