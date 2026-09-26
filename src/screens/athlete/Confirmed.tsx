import { Check, MapPin, CalendarDays } from 'lucide-react'
import { motion } from 'motion/react'
import { useStore } from '../../state/store'
import { coachById } from '../../data/coaches'
import { Avatar, LiquidButton } from '../../components/ui'
import { PACKAGES } from '../../lib/pricing'
import { blockById, fmtDay, money } from '../../lib/dates'

export default function Confirmed({ bookingId }: { bookingId: string }) {
  const { bookings, reset } = useStore()
  const b = bookings.find((x) => x.id === bookingId)
  if (!b) return null
  const c = coachById(b.coachId)

  return (
    <div className="h-full overflow-y-auto px-6 pt-14 pb-8 flex flex-col">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="btn-liquid text-white relative flex h-20 w-20 items-center justify-center rounded-full"
        >
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-accent-soft"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <Check size={38} strokeWidth={3} className="relative z-10" />
        </motion.div>
        <h1 className="mt-6 text-[26px] font-bold tracking-[-0.02em]">You're booked in</h1>
        <p className="mt-1.5 text-[13.5px] text-ink/65">{c.name.split(' ')[0]} has your request and will confirm shortly.</p>
      </div>

      {/* glass ticket */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.45 }}
        className="glass mt-8 overflow-hidden rounded-[1.8rem]"
      >
        <div className="p-5">
          <div className="flex items-center gap-3">
            <Avatar initials={c.initials} hue={c.hue} size={46} />
            <div>
              <div className="font-semibold tracking-tight">{c.name}</div>
              <div className="text-[12.5px] text-ink/60">{b.request.skill}</div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-[13px] text-ink/75">
            <div className="flex items-center gap-2">
              <CalendarDays size={15} className="text-accent" />
              {fmtDay(b.request.date)} · {blockById(b.request.block).hours}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-accent" />
              {c.venue}
            </div>
          </div>
        </div>
        <div className="mx-5 border-t-2 border-dashed border-ink/10" />
        <div className="grid grid-cols-3 p-5 text-center">
          {[
            [String(b.quote.sessions), 'sessions'],
            [money(b.quote.unitPrice), 'per session'],
            [money(b.quote.total), 'paid'],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-[19px] font-bold tracking-tight">{v}</div>
              <div className="text-[11px] text-ink/50">{l}</div>
            </div>
          ))}
        </div>
        <div className="bg-ink/[0.04] px-5 py-3 text-center text-[12px] text-ink/55">
          {PACKAGES[b.packageType].label} · remaining sessions stay in your account
        </div>
      </motion.div>

      <div className="mt-auto pt-8 space-y-2">
        <LiquidButton onClick={() => reset({ name: 'bookings' })}>View my bookings</LiquidButton>
        <button onClick={() => reset({ name: 'request' })} className="w-full py-3 text-[13.5px] font-medium text-ink/65">
          Book something else
        </button>
      </div>
    </div>
  )
}
