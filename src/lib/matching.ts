import { COACHES, isFullyVerified } from '../data/coaches'
import { suburbByName } from '../data/sports'
import type { Coach, Match, SessionRequest } from '../types'
import { listPrice } from './pricing'

/**
 * Match score — transparent on purpose, so the report can explain it and the app can
 * show *why* a coach ranked where they did.
 *
 *   score = 0.35 skill + 0.25 availability + 0.20 proximity + 0.10 rating + 0.10 price
 */
const W = { skill: 0.35, availability: 0.25, proximity: 0.2, rating: 0.1, price: 0.1 }

const BLOCK_LABEL = { morning: 'morning', afternoon: 'afternoon', evening: 'evening' } as const
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function km(a: string, b: string): number {
  const A = suburbByName(a)
  const B = suburbByName(b)
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(B.lat - A.lat)
  const dLng = toRad(B.lng - A.lng)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(A.lat)) * Math.cos(toRad(B.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function scoreCoach(coach: Coach, req: SessionRequest): Match | null {
  if (coach.sport !== req.sport) return null
  // Vetting gate: coaches only appear once every check is verified.
  if (!isFullyVerified(coach)) return null

  const day = new Date(req.date + 'T12:00:00').getDay()
  const blocksToday = coach.availability[day] ?? []

  const skill = coach.skills.includes(req.skill) ? 1 : 0.4
  const availability = blocksToday.includes(req.block) ? 1 : blocksToday.length ? 0.35 : 0
  const distance = km(coach.suburb, req.suburb)
  const proximity = Math.max(0, 1 - distance / 25)
  // unreviewed coaches get a neutral score rather than a perfect 5.0
  const rating = coach.reviewCount ? Math.min(1, Math.max(0, (coach.rating - 3.5) / 1.5)) : 0.5
  const sessionPrice = listPrice(coach.hourlyRate, req.date, req.block)
  const price =
    sessionPrice <= req.budget ? 1 : Math.max(0, 1 - (sessionPrice - req.budget) / req.budget)
  const levelFit = coach.levels.includes(req.level) ? 1 : 0.85

  const raw =
    W.skill * skill +
    W.availability * availability +
    W.proximity * proximity +
    W.rating * rating +
    W.price * price

  const reasons: string[] = []
  if (skill === 1) reasons.push(`Coaches ${req.skill.toLowerCase()}`)
  if (availability === 1) reasons.push(`Free ${DAY[day]} ${BLOCK_LABEL[req.block]}`)
  else if (availability > 0) reasons.push(`Free ${DAY[day]} (other time)`)
  reasons.push(`${distance < 1 ? '<1' : distance.toFixed(1)} km`)

  return {
    coach,
    score: Math.round(raw * levelFit * 100),
    km: distance,
    breakdown: { skill, availability, proximity, rating, price },
    reasons,
    sessionPrice,
  }
}

export function findMatches(req: SessionRequest, coaches: Coach[] = COACHES): Match[] {
  return coaches.map((c) => scoreCoach(c, req))
    .filter((m): m is Match => m !== null)
    .sort((a, b) => b.score - a.score)
}
