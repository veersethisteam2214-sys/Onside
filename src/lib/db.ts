import type { DB, OpenRequest, User } from '../types'
import { nextDays, toISO } from './dates'

/**
 * The prototype's "backend": one JSON document in localStorage. There is no server —
 * accounts, requests, offers and bookings live in this browser only, which is enough
 * to demo both sides of the marketplace (e.g. athlete in one tab, coach in another).
 */

export const DB_KEY = 'onside.db.v3'
export const SESSION_KEY = 'onside.session.v3'

/** Both demo accounts use the password "demo1234". */
export const DEMO_PASSWORD = 'demo1234'
export const DEMO_ATHLETE_EMAIL = 'athlete@onside.app'
export const DEMO_COACH_EMAIL = 'coach@onside.app'

// sha256("onside:demo1234") — precomputed so seeding stays synchronous
const DEMO_HASH = '033af6c8de88153a2aa968a9b4f969ca2c560146dbb1e1567c3b587e3af96bf8'

/**
 * Salted SHA-256 so plain passwords are never stored. (A real product would hash on a
 * server with bcrypt/argon2 — this only keeps the demo honest.)
 */
export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`onside:${password}`)
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', data)
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  // insecure-context fallback (e.g. opened over plain http on a LAN IP)
  let h = 0x811c9dc5
  for (const byte of data) h = Math.imul(h ^ byte, 0x01000193)
  return `fnv-${(h >>> 0).toString(16)}`
}

export const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

function seed(): DB {
  const days = nextDays(10).map(toISO)
  const now = new Date().toISOString()

  const users: User[] = [
    {
      id: 'u-demo-athlete',
      name: 'Alex Chen',
      email: DEMO_ATHLETE_EMAIL,
      passwordHash: DEMO_HASH,
      createdAt: now,
      role: 'athlete',
      dob: '2007-05-12',
      athlete: { sport: 'athletics', level: 'Competitive', suburb: 'Burwood', student: true },
    },
    {
      id: 'u-demo-coach',
      name: 'Ava Marchetti',
      email: DEMO_COACH_EMAIL,
      passwordHash: DEMO_HASH,
      createdAt: now,
      role: 'coach',
      dob: '1994-09-03',
      coachId: 'c-ava', // the seeded athletics coach
    },
  ]

  const req = (r: Omit<OpenRequest, 'id' | 'createdAt' | 'status'>, i: number): OpenRequest => ({
    ...r,
    id: `r-seed-${i}`,
    createdAt: now,
    status: 'open',
  })

  const requests: OpenRequest[] = [
    req({ athleteId: 'u-seed-1', athleteName: 'Mia Patel', athleteAge: 15, sport: 'athletics', skill: 'Long jump', level: 'Intermediate', date: days[2], block: 'afternoon', suburb: 'Box Hill', segment: 'concession', note: 'Keep fouling my take-off at comps. Want to fix my run-up before regionals.' }, 1),
    req({ athleteId: 'u-seed-2', athleteName: 'Josh Taylor', athleteAge: 17, sport: 'athletics', skill: 'Sprint starts', level: 'Competitive', date: days[4], block: 'morning', suburb: 'Camberwell', segment: 'concession', note: 'Slow out of the blocks — losing 0.1s in the first 10m.' }, 2),
    req({ athleteId: 'u-seed-3', athleteName: 'Sienna Brooks', athleteAge: 20, sport: 'athletics', skill: 'Hurdles', level: 'Beginner', date: days[5], block: 'evening', suburb: 'Glen Waverley', segment: 'concession', note: 'New to hurdles, want to learn proper lead-leg technique.' }, 3),
    req({ athleteId: 'u-seed-4', athleteName: 'Liam Nguyen', athleteAge: 19, sport: 'tennis', skill: 'Serve', level: 'Competitive', date: days[3], block: 'afternoon', suburb: 'Hawthorn', segment: 'standard', note: 'Second serve breaks down under pressure.' }, 4),
    req({ athleteId: 'u-seed-5', athleteName: 'Zoe Martin', athleteAge: 16, sport: 'soccer', skill: 'Goalkeeping', level: 'Intermediate', date: days[1], block: 'afternoon', suburb: 'Doncaster', segment: 'concession', note: 'Club has no keeper coach. Need help with handling and positioning.' }, 5),
    req({ athleteId: 'u-seed-6', athleteName: 'Kai Walker', athleteAge: 22, sport: 'boxing', skill: 'Defence', level: 'Beginner', date: days[6], block: 'evening', suburb: 'Brunswick', segment: 'standard', note: 'Getting hit too much in sparring, want to work on head movement.' }, 6),
    req({ athleteId: 'u-seed-7', athleteName: 'Harry Collins', athleteAge: 14, sport: 'swimming', skill: 'Starts & turns', level: 'Competitive', date: days[2], block: 'morning', suburb: 'Carlton', segment: 'concession', note: 'Losing time on tumble turns at state meets.' }, 7),
  ]

  return { version: 3, users, coaches: [], requests, offers: [], bookings: [] }
}

export function loadDB(): DB {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) {
      const db = JSON.parse(raw) as DB
      if (db.version === 3) return db
    }
  } catch {
    /* fall through to a fresh seed */
  }
  const fresh = seed()
  saveDB(fresh)
  return fresh
}

export function saveDB(db: DB) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
  } catch {
    /* storage unavailable — the demo still works for this page view */
  }
}

export function resetDB(): DB {
  const fresh = seed()
  saveDB(fresh)
  return fresh
}

export function loadSession(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

export function saveSession(userId: string | null) {
  try {
    if (userId) localStorage.setItem(SESSION_KEY, userId)
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export function ageFrom(dobISO?: string): number | undefined {
  if (!dobISO) return undefined
  const dob = new Date(dobISO + 'T12:00:00')
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const m = now.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--
  return age
}

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
}
