import { Lock, RotateCcw, ShieldCheck, Loader2, Wifi } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../state/store'
import { BottomCTA, Section, TopBar } from '../../components/core'
import PriceBreakdown from '../../components/PriceBreakdown'
import { quote } from '../../lib/pricing'
import { blockById, fmtDay, money } from '../../lib/dates'
import { uid } from '../../lib/db'
import type { Booking } from '../../types'

const TRUST = [
  { icon: ShieldCheck, text: 'Sessions booked in-app are insured and covered by our safety policy' },
  { icon: RotateCcw, text: 'Free cancellation up to 24 hours before the session' },
  { icon: Lock, text: 'Payments processed by Stripe · coaches are paid automatically after each session' },
]

export default function Checkout({ coachId }: { coachId: string }) {
  const { request: r, draft, addBooking, updateUser, reset, coachById, user, isFirstSession } = useStore()
  const c = coachById(coachId)
  const [paying, setPaying] = useState(false)
  if (!c || !user) return null
  const addPremium = draft.addPremium && !user.premium
  const q = quote(r.segment, r.date, r.block, { firstSession: isFirstSession(user.id), addPremium })

  const pay = () => {
    setPaying(true)
    const booking: Booking = {
      id: uid('bk'),
      coachId: c.id,
      athleteId: user.id,
      athleteName: user.name,
      request: { ...r },
      quote: q,
      createdAt: new Date().toISOString(),
      source: 'direct',
    }
    // Simulated processing delay so the demo feels like a real payment.
    setTimeout(() => {
      addBooking(booking)
      if (addPremium) updateUser({ premium: true })
      reset({ name: 'confirmed', bookingId: booking.id })
    }, 1100)
  }

  return (
    <div className="relative h-full">
      <TopBar title="Checkout" />
      <div className="h-full overflow-y-auto px-5 pt-[76px] sm:pt-[108px] pb-[130px]">
        <div className="space-y-7">
          <Section label="Session">
            <div className="card p-4 text-[13.5px]">
              <div className="font-semibold tracking-tight">
                {r.skill} with {c.name}
              </div>
              <div className="mt-1 text-slate-500">
                {fmtDay(r.date)} · {blockById(r.block).hours}
              </div>
              <div className="text-slate-500">{c.venue}</div>
            </div>
          </Section>

          <Section label="Price breakdown">
            <PriceBreakdown q={q} showPlatform />
          </Section>

          <Section label="Payment method">
            <div
              className="relative h-[160px] overflow-hidden rounded-[22px] p-5 text-white shadow-[0_20px_40px_-20px_rgba(11,18,32,0.7)]"
              style={{ background: 'linear-gradient(135deg, #1b2438 0%, #0b1220 60%, #111a2e 100%)' }}
            >
              <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#0a66ff]/35 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-[#7c5cff]/25 blur-3xl" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold tracking-[0.2em] text-white/70">ONSIDE</span>
                  <Wifi size={18} className="rotate-90 text-white/60" />
                </div>
                <div className="mt-auto font-mono text-[17px] tracking-[0.16em]">•••• •••• •••• 4242</div>
                <div className="mt-1.5 flex justify-between text-[11px] text-white/55">
                  <span>{user.name.toUpperCase()}</span>
                  <span className="font-semibold tracking-wide text-white/80">VISA</span>
                </div>
              </div>
            </div>
            <p className="text-center text-[11.5px] text-slate-400">Demo card · no real charge</p>
          </Section>

          <ul className="space-y-2.5">
            {TRUST.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5 text-[12.5px] text-slate-500">
                <Icon size={15} className="mt-px shrink-0 text-emerald-600" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <BottomCTA onClick={pay} disabled={paying}>
        {paying ? (
          <>
            <Loader2 size={17} className="animate-spin" /> Processing…
          </>
        ) : (
          <>
            <Lock size={15} /> Pay {money(q.total)}
          </>
        )}
      </BottomCTA>
    </div>
  )
}
