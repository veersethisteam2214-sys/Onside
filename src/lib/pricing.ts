import type { PriceQuote, Segment, SlotType, TimeBlock } from '../types'

/**
 * The Onside pricing engine. Every number here matches Section 5 of the report
 * (and the A$20 first-session offer in Section 6.5).
 *
 *   athlete pays  = segment price, moved by dynamic pricing (standard only)
 *   coach is paid = A$35 flat + any peak surge (the surge goes to the coach)
 *   Onside keeps  = what the athlete pays − what the coach is paid
 */

/** Third-degree price discrimination: student status is the verified proxy for income. */
export const SEGMENTS: Record<Segment, { label: string; price: number; who: string }> = {
  concession: { label: 'Concession', price: 40, who: 'School and university students' },
  standard: { label: 'Standard', price: 60, who: 'All other athletes' },
}

/** Flat coach pay, the same in both segments, so coaches don't avoid concession bookings. */
export const COACH_PAY = 35

/** Dynamic pricing applies to standard sessions only; concession prices never surge. */
export const STANDARD_PEAK = 1.2 // A$72
export const STANDARD_OFF_PEAK = 0.85 // A$51

/** Introductory price for an athlete's first session; Onside covers the gap to the coach's A$35. */
export const INTRO_PRICE = 20

/** Onside Premium (second-degree price discrimination): monthly, sessions stay at normal prices. */
export const PREMIUM: Record<Segment, number> = { concession: 12, standard: 20 }
export const PREMIUM_PERKS = ['AI training plan built from coach-written drills', 'Progress tracking', 'Priority booking of peak slots']

export const SLOT_LABEL: Record<SlotType, string> = { peak: 'Peak', base: 'Standard time', offpeak: 'Off-peak' }

/**
 * Weekends and weekday after-school slots are peak; weekday mornings, when coaches sit idle,
 * are off-peak; weekday evenings are charged at the base price.
 */
export function slotType(dateISO: string, block: TimeBlock): SlotType {
  const day = new Date(dateISO + 'T12:00:00').getDay()
  if (day === 0 || day === 6 || block === 'afternoon') return 'peak'
  return block === 'morning' ? 'offpeak' : 'base'
}

export const isPeak = (dateISO: string, block: TimeBlock) => slotType(dateISO, block) === 'peak'

/** Session price before any first-session offer. */
export function sessionPrice(segment: Segment, dateISO: string, block: TimeBlock): number {
  const base = SEGMENTS[segment].price
  if (segment === 'concession') return base
  const slot = slotType(dateISO, block)
  return Math.round(base * (slot === 'peak' ? STANDARD_PEAK : slot === 'offpeak' ? STANDARD_OFF_PEAK : 1))
}

export function quote(
  segment: Segment,
  dateISO: string,
  block: TimeBlock,
  opts: { firstSession?: boolean; addPremium?: boolean } = {},
): PriceQuote {
  const slot = slotType(dateISO, block)
  const listPrice = SEGMENTS[segment].price
  const price = sessionPrice(segment, dateISO, block)
  const intro = !!opts.firstSession

  // The intro price carries no surge, so the coach gets the flat A$35 and Onside covers the gap.
  const peakBonus = intro ? 0 : Math.max(0, price - listPrice)
  const introDiscount = intro ? price - INTRO_PRICE : 0
  const sessionTotal = price - introDiscount
  const coachPayout = COACH_PAY + peakBonus
  const premiumFee = opts.addPremium ? PREMIUM[segment] : 0

  return {
    segment,
    slot,
    listPrice,
    sessionPrice: price,
    introDiscount,
    sessionTotal,
    premiumFee,
    total: sessionTotal + premiumFee,
    coachPayout,
    peakBonus,
    onsideMargin: sessionTotal - coachPayout,
  }
}
