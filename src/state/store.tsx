import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Booking, PackageType, SessionRequest, Tier } from '../types'
import { nextSaturday } from '../lib/dates'

export type Screen =
  | { name: 'role' }
  | { name: 'request' }
  | { name: 'matches' }
  | { name: 'coach'; coachId: string }
  | { name: 'book'; coachId: string }
  | { name: 'checkout'; coachId: string }
  | { name: 'confirmed'; bookingId: string }
  | { name: 'bookings' }
  | { name: 'coachHome' }

export interface Draft {
  packageType: PackageType
  tier: Tier
}

interface Store {
  screen: Screen
  direction: 1 | -1
  go: (s: Screen) => void
  back: () => void
  reset: (s: Screen) => void
  request: SessionRequest
  setRequest: (patch: Partial<SessionRequest>) => void
  draft: Draft
  setDraft: (patch: Partial<Draft>) => void
  bookings: Booking[]
  addBooking: (b: Booking) => void
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

const KEY = 'onside.bookings.v1'

function load(): Booking[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Booking[]) : []
  } catch {
    return []
  }
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Screen[]>([{ name: 'role' }])
  const [direction, setDirection] = useState<1 | -1>(1)
  const [request, setRequestState] = useState<SessionRequest>(DEFAULT_REQUEST)
  const [draft, setDraftState] = useState<Draft>({ packageType: 'five', tier: 'standard' })
  const [bookings, setBookings] = useState<Booking[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(bookings))
    } catch {
      /* storage unavailable — fine for a demo */
    }
  }, [bookings])

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

  const setRequest = useCallback(
    (patch: Partial<SessionRequest>) => setRequestState((r) => ({ ...r, ...patch })),
    [],
  )
  const setDraft = useCallback((patch: Partial<Draft>) => setDraftState((d) => ({ ...d, ...patch })), [])
  const addBooking = useCallback((b: Booking) => setBookings((bs) => [b, ...bs]), [])

  const value = useMemo<Store>(
    () => ({
      screen: stack[stack.length - 1],
      direction,
      go,
      back,
      reset,
      request,
      setRequest,
      draft,
      setDraft,
      bookings,
      addBooking,
    }),
    [stack, direction, go, back, reset, request, setRequest, draft, setDraft, bookings, addBooking],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}
