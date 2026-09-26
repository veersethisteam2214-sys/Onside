import { Lock, RotateCcw, ShieldCheck, Loader2, Wifi } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../state/store'
import { coachById } from '../../data/coaches'
import { BottomCTA, Section, TopBar } from '../../components/ui'
import PriceBreakdown from '../../components/PriceBreakdown'
import { quote } from '../../lib/pricing'
import { blockById, fmtDay, money } from '../../lib/dates'
import type { Booking } from '../../types'

const TRUST = [
  { icon: ShieldCheck, text: 'Sessions booked in-app are insured and covered by our safety policy' },
  { icon: RotateCcw, text: 'Free cancellation up to 24 hours before · unused package sessions refundable' },
  { icon: Lock, text: 'Payments processed securely by Stripe — coaches are paid after each session' },
]

export default function Checkout({ coachId }: { coachId: string }) {
  const { request: r, draft, addBooking, reset } = useStore()
  const c = coachById(coachId)
  const q = quote(c.hourlyRate, r.date, r.block, draft.tier, draft.packageType)
  const [paying, setPaying] = useState(false)

  const pay = () => {
    setPaying(true)
    const booking: Booking = {
      id: `bk-${Date.now().toString(36)}`,
      coachId: c.id,
      request: { ...r },
      packageType: draft.packageType,
      tier: draft.tier,
      quote: q,
      createdAt: new Date().toISOString(),
      sessionsUsed: 0,
    }
    // Simulated processing delay so the demo feels like a real payment.
    setTimeout(() => {
      addBooking(booking)
      reset({ name: 'confirmed', bookingId: booking.id })
    }, 1100)
  }

  return (
    <div className="relative h-full">
      <TopBar title="Checkout" />
      <div className="h-full overflow-y-auto px-5 pt-[76px] pb-[130px]">
        <div className="space-y-7">
          <Section label="Your first session">
            <div className="glass rounded-[1.5rem] p-4 text-[13.5px]">
              <div className="font-semibold tracking-tight">
                {r.skill} with {c.name}
              </div>
              <div className="mt-1 text-ink/60">
                {fmtDay(r.date)} · {blockById(r.block).hours}
              </div>
              <div className="text-ink/60">{c.venue}</div>
            </div>
          </Section>

          <Section label="Price breakdown">
            <PriceBreakdown q={q} tier={draft.tier} pkg={draft.packageType} showPlatform />
          </Section>

          <Section label="Payment">
            {/* glass card-art */}
            <div className="glass relative overflow-hidden rounded-[1.5rem] p-5 h-[150px]">
              <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#8cc2ff]/60 blur-2xl" />
              <div className="pointer-events-none absolute -left-8 bottom-[-50px] h-36 w-36 rounded-full bg-[#b8aaff]/50 blur-2xl" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold tracking-[0.18em] text-ink/70">ONSIDE PAY</span>
                  <Wifi size={18} className="rotate-90 text-ink/60" />
                </div>
                <div className="mt-auto font-mono text-[17px] tracking-[0.14em]">•••• •••• •••• 4242</div>
                <div className="mt-1 flex justify-between text-[11px] text-ink/55">
                  <span>Demo card · no real charge</span>
                  <span>VISA</span>
                </div>
              </div>
            </div>
          </Section>

          <div className="space-y-2.5 px-1">
            {TRUST.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-2.5 text-[12px] text-ink/60">
                <Icon size={15} className="mt-px shrink-0 text-emerald-600" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomCTA onClick={pay} disabled={paying}>
        {paying ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Processing…
          </>
        ) : (
          <>
            <Lock size={16} /> Pay {money(q.total)}
          </>
        )}
      </BottomCTA>
    </div>
  )
}
