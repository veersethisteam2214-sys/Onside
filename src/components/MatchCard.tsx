import { motion } from 'motion/react'
import { MapPin, Zap } from 'lucide-react'
import type { Match } from '../types'
import { Avatar, Stars } from './ui'
import { money } from '../lib/dates'
import { sportById } from '../data/sports'

/**
 * Coach match card — a liquid-glass take on the 21st.dev profile card: frosted panel,
 * live status dot, and a glowing tab underneath carrying the reason line.
 */
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
  const { coach, score, reasons, sessionPrice } = match
  const available = match.breakdown.availability === 1
  const top = rank === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + rank * 0.08, duration: 0.4, ease: 'easeOut' }}
      className="relative"
    >
      {/* glowing tab behind the card */}
      <div
        className={`absolute inset-x-3 bottom-0 top-10 rounded-[1.9rem] ${
          top
            ? 'bg-gradient-to-b from-[#8cc2ff] to-[#2f7bff] shadow-[0_20px_44px_-12px_rgba(47,123,255,0.85)]'
            : 'glass glass-soft'
        }`}
      />

      <div className="relative">
        <div className={`glass rounded-[1.9rem] p-4 ${top ? 'ring-1 ring-accent/40' : ''}`}>
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="inline-flex items-center gap-1.5 text-ink/75">
              <span className="relative flex h-2 w-2">
                {available && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${available ? 'bg-emerald-400' : 'bg-amber-300'}`} />
              </span>
              {available ? 'Available at your time' : 'Available that day'}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 font-bold ${
                top ? 'btn-liquid text-white' : 'bg-ink/[0.06] text-ink ring-1 ring-ink/10'
              }`}
            >
              <span className="relative z-10">{score}% match</span>
            </span>
          </div>

          <button onClick={onOpen} className="mt-3.5 flex w-full items-center gap-3 text-left">
            <Avatar initials={coach.initials} hue={coach.hue} size={48} />
            <div className="min-w-0">
              <div className="font-semibold text-[16.5px] tracking-tight truncate">{coach.name}</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink/65">
                <Stars rating={coach.rating} size={12} />
                <span>· {coach.reviewCount} reviews</span>
                <span>· {sportById(coach.sport).name}</span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-[19px] font-bold tracking-tight">{money(sessionPrice)}</div>
              <div className="text-[10.5px] text-ink/55">per session</div>
            </div>
          </button>

          <div className="mt-4 flex gap-2">
            <button onClick={onOpen} className="btn-glass flex-1 rounded-full py-2.5 text-[12.5px] font-semibold">
              View profile
            </button>
            <button
              onClick={onBook}
              className="btn-liquid flex-1 rounded-full py-2.5 text-[12.5px] font-bold text-white"
            >
              Book
            </button>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 px-6 py-2.5 text-[11.5px] font-semibold ${top ? 'text-white' : 'text-ink/60'}`}>
          <Zap size={13} className={top ? 'fill-white' : 'fill-ink/40'} />
          <span className="truncate">{reasons.slice(0, 2).join(' · ')}</span>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1">
            <MapPin size={12} />
            {reasons[reasons.length - 1]}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
