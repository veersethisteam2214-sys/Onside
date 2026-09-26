import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Booking, Coach, DB, OpenRequest, Offer, PackageType, Role, SessionRequest, Tier, User } from '../types'
import { nextSaturday } from '../lib/dates'
import { COACHES } from '../data/coaches'
import { DB_KEY, SESSION_KEY, ageFrom, hashPassword, loadDB, loadSession, resetDB, saveDB, saveSession, uid } from '../lib/db'
import { TAKE_RATE, isPeak } from '../lib/pricing'

export type Screen =
  // auth & onboarding
  | { name: 'welcome' }
  | { name: 'signIn' }
  | { name: 'signUp' }
  | { name: 'roleSelect' }
  | { name: 'profileSetup' }
  // athlete
  | { name: 'athleteHome' }
  | { name: 'request' }
  | { name: 'matches' }
  | { name: 'coach'; coachId: string }
  | { name: 'book'; coachId: string }
  | { name: 'checkout'; coachId: string }
  | { name: 'confirmed'; bookingId: string }
  | { name: 'bookings' }
  // coach
  | { name: 'coachDashboard' }
  | { name: 'coachRequests' }
  | { name: 'coachSchedule' }
  // shared
  | { name: 'account' }

export interface Draft {
  packageType: PackageType
  tier: Tier
}

interface Store {
  // navigation
  screen: Screen
  direction: 1 | -1
  go: (s: Screen) => void
  back: () => void
  reset: (s: Screen) => void
  goHome: () => void

  // auth
  user: User | null
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (name: string, email: string, password: string) => Promise<string | null>
  signOut: () => void
  updateUser: (patch: Partial<User>) => void
  saveCoachProfile: (coach: Coach) => void

  // marketplace data
  coaches: Coach[]
  coachById: (id: string) => Coach | undefined
  myCoach: Coach | undefined
  requests: OpenRequest[]
  offers: Offer[]
  bookings: Booking[]
  postRequest: (note: string) => OpenRequest | null
  sendOffer: (requestId: string, price: number, message: string) => void
  respondOffer: (offerId: string, accept: boolean) => Booking | null
  addBooking: (b: Booking) => void
  resetDemo: () => void

  // athlete booking flow
  request: SessionRequest
  setRequest: (patch: Partial<SessionRequest>) => void
  draft: Draft
  setDraft: (patch: Partial<Draft>) => void

  // feedback
  toast: string | null
  notify: (msg: string) => void
}

const DEFAULT_REQUEST: SessionRequest = {
  sport: 'athletics',
  skill: 'Long jump',
  level: 'Competitive',
  date: nextSaturday(),
  block: 'morning',
  suburb: 'Burwood',
  budget: 110,
}

/** Where a signed-in user belongs: onboarding until their profile is complete. */
export function homeFor(u: User | null): Screen {
  if (!u) return { name: 'welcome' }
  if (!u.role) return { name: 'roleSelect' }
  if (!u.dob || (u.role === 'athlete' && !u.athlete) || (u.role === 'coach' && !u.coachId)) return { name: 'profileSetup' }
  return u.role === 'coach' ? { name: 'coachDashboard' } : { name: 'athleteHome' }
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(loadDB)
  const [userId, setUserId] = useState<string | null>(loadSession)
  const user = useMemo(() => db.users.find((u) => u.id === userId) ?? null, [db.users, userId])

  const [stack, setStack] = useState<Screen[]>(() => [homeFor(user)])
  const [direction, setDirection] = useState<1 | -1>(1)
  const [request, setRequestState] = useState<SessionRequest>(DEFAULT_REQUEST)
  const [draft, setDraftState] = useState<Draft>({ packageType: 'five', tier: 'standard' })
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  /** Apply a change to the database and persist it. */
  const commit = useCallback((fn: (d: DB) => DB) => {
    setDb((prev) => {
      const next = fn(prev)
      saveDB(next)
      return next
    })
  }, [])

  // Live sync: an athlete in one tab and a coach in another see each other's actions.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === DB_KEY) setDb(loadDB())
      if (e.key === SESSION_KEY) setUserId(loadSession())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // ── navigation ────────────────────────────────────────────────────────
  const go = useCallback((s: Screen) => {
    setDirection(1)
    setStack((st) => [...st, s])
  }, [])
  const back = useCallback(() => {
    setDirection(-1)
    setStack((st) => (st.length > 1 ? st.slice(0, -1) : st))
  }, [])
  const reset = useCallback((s: Screen) => {
    setDirection(1)
    setStack([s])
  }, [])

  const notify = useCallback((msg: string) => {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])

  // ── auth ──────────────────────────────────────────────────────────────
  const signIn = useCallback(
    async (email: string, password: string) => {
      const found = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
      if (!found) return 'No account found with that email.'
      if ((await hashPassword(password)) !== found.passwordHash) return 'Incorrect password.'
      saveSession(found.id)
      setUserId(found.id)
      reset(homeFor(found))
      return null
    },
    [db.users, reset],
  )

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const clean = email.trim().toLowerCase()
      if (db.users.some((u) => u.email.toLowerCase() === clean)) return 'An account with that email already exists.'
      const newUser: User = {
        id: uid('u'),
        name: name.trim(),
        email: clean,
        passwordHash: await hashPassword(password),
        createdAt: new Date().toISOString(),
      }
      commit((d) => ({ ...d, users: [...d.users, newUser] }))
      saveSession(newUser.id)
      setUserId(newUser.id)
      reset({ name: 'roleSelect' })
      return null
    },
    [db.users, commit, reset],
  )

  const signOut = useCallback(() => {
    saveSession(null)
    setUserId(null)
    reset({ name: 'welcome' })
  }, [reset])

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      if (!userId) return
      commit((d) => ({ ...d, users: d.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)) }))
    },
    [userId, commit],
  )

  const saveCoachProfile = useCallback(
    (coach: Coach) => {
      commit((d) => ({
        ...d,
        coaches: [...d.coaches.filter((c) => c.id !== coach.id), coach],
        users: d.users.map((u) => (u.id === userId ? { ...u, coachId: coach.id } : u)),
      }))
    },
    [userId, commit],
  )

  const goHome = useCallback(() => reset(homeFor(user)), [reset, user])

  // ── marketplace ───────────────────────────────────────────────────────
  const coaches = useMemo(() => [...COACHES, ...db.coaches], [db.coaches])
  const coachById = useCallback((id: string) => coaches.find((c) => c.id === id), [coaches])
  const myCoach = user?.coachId ? coachById(user.coachId) : undefined

  const addBooking = useCallback((b: Booking) => commit((d) => ({ ...d, bookings: [b, ...d.bookings] })), [commit])

  const postRequest = useCallback(
    (note: string) => {
      if (!user) return null
      const r: OpenRequest = {
        ...request,
        id: uid('r'),
        athleteId: user.id,
        athleteName: user.name,
        athleteAge: ageFrom(user.dob),
        note,
        createdAt: new Date().toISOString(),
        status: 'open',
      }
      commit((d) => ({ ...d, requests: [r, ...d.requests] }))
      return r
    },
    [user, request, commit],
  )

  const sendOffer = useCallback(
    (requestId: string, price: number, message: string) => {
      if (!user?.coachId) return
      const r = db.requests.find((x) => x.id === requestId)
      if (!r) return
      const offer: Offer = {
        id: uid('o'),
        requestId,
        coachId: user.coachId,
        athleteId: r.athleteId,
        price,
        message,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      commit((d) => ({ ...d, offers: [offer, ...d.offers] }))
    },
    [user, db.requests, commit],
  )

  const respondOffer = useCallback(
    (offerId: string, accept: boolean) => {
      const offer = db.offers.find((o) => o.id === offerId)
      if (!offer) return null
      const r = db.requests.find((x) => x.id === offer.requestId)
      if (!accept || !r) {
        commit((d) => ({ ...d, offers: d.offers.map((o) => (o.id === offerId ? { ...o, status: 'declined' } : o)) }))
        return null
      }
      // Accepting creates a single standard session at the offered price.
      const platformFee = Math.round(offer.price * TAKE_RATE)
      const booking: Booking = {
        id: uid('bk'),
        coachId: offer.coachId,
        athleteId: r.athleteId,
        athleteName: r.athleteName,
        request: { sport: r.sport, skill: r.skill, level: r.level, date: r.date, block: r.block, suburb: r.suburb, budget: r.budget },
        packageType: 'single',
        tier: 'standard',
        quote: {
          baseRate: offer.price,
          peakMultiplier: 1,
          isPeak: isPeak(r.date, r.block),
          tierRate: 1,
          packageDiscount: 1,
          sessions: 1,
          unitPrice: offer.price,
          total: offer.price,
          saving: 0,
          platformFee,
          coachPayout: offer.price - platformFee,
        },
        createdAt: new Date().toISOString(),
        sessionsUsed: 0,
        source: 'offer',
      }
      commit((d) => ({
        ...d,
        offers: d.offers.map((o) =>
          o.id === offerId ? { ...o, status: 'accepted' } : o.requestId === offer.requestId && o.status === 'pending' ? { ...o, status: 'declined' } : o,
        ),
        requests: d.requests.map((x) => (x.id === r.id ? { ...x, status: 'matched' } : x)),
        bookings: [booking, ...d.bookings],
      }))
      return booking
    },
    [db.offers, db.requests, commit],
  )

  const resetDemo = useCallback(() => {
    const fresh = resetDB()
    setDb(fresh)
    saveSession(null)
    setUserId(null)
    reset({ name: 'welcome' })
  }, [reset])

  const setRequest = useCallback((patch: Partial<SessionRequest>) => setRequestState((r) => ({ ...r, ...patch })), [])
  const setDraft = useCallback((patch: Partial<Draft>) => setDraftState((d) => ({ ...d, ...patch })), [])

  const value = useMemo<Store>(
    () => ({
      screen: stack[stack.length - 1],
      direction,
      go,
      back,
      reset,
      goHome,
      user,
      signIn,
      signUp,
      signOut,
      updateUser,
      saveCoachProfile,
      coaches,
      coachById,
      myCoach,
      requests: db.requests,
      offers: db.offers,
      bookings: db.bookings,
      postRequest,
      sendOffer,
      respondOffer,
      addBooking,
      resetDemo,
      request,
      setRequest,
      draft,
      setDraft,
      toast,
      notify,
    }),
    [stack, direction, go, back, reset, goHome, user, signIn, signUp, signOut, updateUser, saveCoachProfile, coaches, coachById, myCoach, db.requests, db.offers, db.bookings, postRequest, sendOffer, respondOffer, addBooking, resetDemo, request, setRequest, draft, setDraft, toast, notify],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}

export type { Role }
