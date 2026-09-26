import type { TimeBlock } from '../types'

export const BLOCKS: { id: TimeBlock; label: string; hours: string }[] = [
  { id: 'morning', label: 'Morning', hours: '6–10am' },
  { id: 'afternoon', label: 'After school', hours: '3–7pm' },
  { id: 'evening', label: 'Evening', hours: '7–9pm' },
]

export const blockById = (id: TimeBlock) => BLOCKS.find((b) => b.id === id)!

const pad = (n: number) => String(n).padStart(2, '0')

export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const fromISO = (iso: string) => new Date(iso + 'T12:00:00')

/** The next `n` days starting today. */
export function nextDays(n = 10): Date[] {
  const out: Date[] = []
  const start = new Date()
  start.setHours(12, 0, 0, 0)
  for (let i = 0; i < n; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    out.push(d)
  }
  return out
}

/** Next Saturday — the demo script's default ("free Saturday morning"). */
export function nextSaturday(): string {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  const add = (6 - d.getDay() + 7) % 7 || 7
  d.setDate(d.getDate() + add)
  return toISO(d)
}

export const fmtDay = (iso: string) =>
  fromISO(iso).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })

export const fmtShort = (iso: string) =>
  fromISO(iso).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })

export const money = (n: number) => `$${n.toLocaleString('en-AU')}`
