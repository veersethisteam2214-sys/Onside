import { CalendarDays, MapPin, Wallet } from 'lucide-react'
import { motion } from 'motion/react'
import type { Coach, OpenRequest, Offer } from '../../types'
import { Avatar, Badge, Button, SportIcon } from '../../components/core'
import { blockById, fmtShort, money } from '../../lib/dates'
import { initialsOf } from '../../lib/db'
import { km } from '../../lib/matching'
import { quote } from '../../lib/pricing'

export default function RequestCard({
  r,
  coach,
  offer,
  onOffer,
  index = 0,
}: {
  r: OpenRequest
  coach: Coach
  offer?: Offer
  onOffer: () => void
  index?: number
}) {
  const distance = km(coach.suburb, r.suburb)
  const skillMatch = coach.sport === r.sport && coach.skills.includes(r.skill)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="card card-hover p-4"
    >
      <div className="flex items-center gap-3">
        <Avatar initials={initialsOf(r.athleteName)} hue={r.athleteName.length * 47} size={42} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[15px] font-semibold tracking-tight">{r.athleteName}</span>
            {r.athleteAge !== undefined && <span className="text-[12px] text-slate-400">{r.athleteAge}</span>}
            {r.athleteAge !== undefined && r.athleteAge < 18 && <Badge tone="amber">Under 18</Badge>}
          </div>
          <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
            <SportIcon sport={r.sport} size={14} /> {r.skill} · {r.level}
          </div>
        </div>
        {skillMatch && <Badge tone="blue">Your skill</Badge>}
      </div>

      {r.note && <p className="mt-3 text-[13px] leading-relaxed text-slate-600">“{r.note}”</p>}

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11.5px] text-slate-600">
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-100">
          <CalendarDays size={12} className="text-slate-400" /> {fmtShort(r.date)} · {blockById(r.block).hours}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-100">
          <MapPin size={12} className="text-slate-400" /> {r.suburb} · {distance < 1 ? '<1' : distance.toFixed(1)} km
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-100">
          <Wallet size={12} className="text-slate-400" /> {r.segment === 'concession' ? 'Student' : 'Standard'} · you earn {money(quote(r.segment, r.date, r.block).coachPayout)}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
        {offer ? (
          <>
            <span className="text-[12.5px] text-slate-500">Offer sent · athlete pays {money(offer.price)}</span>
            <Badge tone={offer.status === 'accepted' ? 'green' : offer.status === 'declined' ? 'neutral' : 'blue'}>
              {offer.status === 'accepted' ? 'Accepted · booked' : offer.status === 'declined' ? 'Declined' : 'Offer sent'}
            </Badge>
          </>
        ) : r.status === 'matched' ? (
          <>
            <span className="text-[12.5px] text-slate-500">Booked with another coach</span>
            <Badge>Closed</Badge>
          </>
        ) : (
          <>
            <span className="text-[12px] text-slate-400">Posted {new Date(r.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
            <Button size="sm" onClick={onOffer}>
              Send offer
            </Button>
          </>
        )}
      </div>
    </motion.div>
  )
}
