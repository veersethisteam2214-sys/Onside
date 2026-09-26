import { motion } from 'motion/react'
import { BadgeCheck, CalendarCheck2, MapPin, Target } from 'lucide-react'
import type { Match } from '../types'
import { Avatar, Button, Stars } from './core'
import { money } from '../lib/dates'
import { cn } from '@/lib/utils'

/** Circular match-score ring. */
function ScoreRing({ score, strong }: { score: number; strong: boolean }) {
  const r = 17
  const c = 2 * Math.PI * r
  return (
    <div className="relative h-11 w-11 shrink-0">
      <svg viewBox="0 0 44 44" className="h-11 w-11 -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#eef2f7" strokeWidth="4" />
        <motion.circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={strong ? '#0a66ff' : '#94a3b8'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - score / 100) }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11.5px] font-semibold">{score}</span>
    </div>
  )
}

export default function MatchCard({
  match,
  rank,
  onOpen,
  onBook,
}: {
  match: Match
  rank: number
  onOpen: () => void
  onBook: () => void
}) {
  const { coach, score, sessionPrice, breakdown, km } = match
  const top = rank === 0
  const tags = [
    breakdown.skill === 1 && { icon: Target, text: 'Coaches this skill' },
    breakdown.availability === 1 && { icon: CalendarCheck2, text: 'Free at your time' },
    { icon: MapPin, text: `${km < 1 ? '<1' : km.toFixed(1)} km away` },
  ].filter(Boolean) as { icon: typeof Target; text: string }[]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 + rank * 0.07, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn('card card-hover relative p-4', top && 'ring-2 ring-accent/80 border-transparent')}
    >
      {top && (
        <span className="absolute -top-2.5 left-4 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-[0_6px_14px_-6px_rgba(10,102,255,0.8)]">
          Best match
        </span>
      )}

      <button onClick={onOpen} className="flex w-full items-center gap-3 text-left">
        <Avatar initials={coach.initials} hue={coach.hue} size={48} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[16px] font-semibold tracking-tight">{coach.name}</span>
            <BadgeCheck size={16} className="shrink-0 text-accent" />
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-slate-500">
            <Stars rating={coach.rating} size={12} reviews={coach.reviewCount} />
            {coach.reviewCount > 0 && <span>({coach.reviewCount})</span>}
            <span className="text-slate-300">·</span>
            <span>{coach.yearsCoaching} yrs</span>
          </div>
        </div>
        <ScoreRing score={score} strong={top} />
      </button>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {tags.map(({ icon: I, text }) => (
          <span key={text} className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[11.5px] font-medium text-slate-600 ring-1 ring-slate-100">
            <I size={12} className="text-slate-400" />
            {text}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3.5">
        <div>
          <div className="text-[18px] font-semibold tracking-tight">{money(sessionPrice)}</div>
          <div className="text-[11px] text-slate-400">per session</div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" size="sm" onClick={onOpen}>
            Profile
          </Button>
          <Button size="sm" onClick={onBook}>
            Book
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
