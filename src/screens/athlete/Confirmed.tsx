import { Check, MapPin, CalendarDays } from 'lucide-react'
import { motion } from 'motion/react'
import { useStore } from '../../state/store'
import { Avatar, Button } from '../../components/core'
import { SEGMENTS } from '../../lib/pricing'
import { blockById, fmtDay, money } from '../../lib/dates'

export default function Confirmed({ bookingId }: { bookingId: string }) {
  const { bookings, reset, coachById } = useStore()
  const b = bookings.find((x) => x.id === bookingId)
  const c = b ? coachById(b.coachId) : undefined
  if (!b || !c) return null

  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 pt-20 pb-8">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_12px_28px_-10px_rgba(16,185,129,0.7)]"
        >
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-emerald-400"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <Check size={30} strokeWidth={3} />
        </motion.div>
        <h1 className="mt-5 text-[24px] font-semibold tracking-[-0.02em]">You’re booked in</h1>
        <p className="mt-1 text-[14px] text-slate-500">{c.name.split(' ')[0]} has been notified and will confirm shortly.</p>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.45 }} className="card mt-8 overflow-hidden">
        <div className="p-5">
          <div className="flex items-center gap-3">
            <Avatar initials={c.initials} hue={c.hue} size={44} />
            <div>
              <div className="font-semibold tracking-tight">{c.name}</div>
              <div className="text-[12.5px] text-slate-500">{b.request.skill}</div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-[13px] text-slate-600">
            <div className="flex items-center gap-2">
              <CalendarDays size={15} className="text-slate-400" />
              {fmtDay(b.request.date)} · {blockById(b.request.block).hours}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-slate-400" />
              {c.venue}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 border-t border-dashed border-slate-200 p-5 text-center">
          {[
            [SEGMENTS[b.quote.segment].label, 'price'],
            [money(b.quote.sessionTotal), 'session'],
            [money(b.quote.total), 'paid'],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-[18px] font-semibold tracking-tight">{v}</div>
              <div className="text-[11px] text-slate-400">{l}</div>
            </div>
          ))}
        </div>
        <div className="bg-slate-50 px-5 py-3 text-center text-[12px] text-slate-500">
          {b.quote.introDiscount > 0 ? 'First-session offer applied · ' : ''}Your coach is paid {money(b.quote.coachPayout)} after the session
        </div>
      </motion.div>

      <div className="mt-auto space-y-2 pt-8">
        <Button size="lg" full onClick={() => reset({ name: 'bookings' })}>
          View my sessions
        </Button>
        <Button size="lg" variant="ghost" full onClick={() => reset({ name: 'athleteHome' })}>
          Back to home
        </Button>
      </div>
    </div>
  )
}
