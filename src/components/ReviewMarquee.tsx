import { motion, useAnimationFrame, useMotionValue, useMotionValueEvent } from 'motion/react'
import { BadgeCheck, Quote, Star } from 'lucide-react'
import { useRef, useState } from 'react'
import { Avatar, toneOf } from './core'
import type { Review } from '../types'

const CARD_W = 280 // card width + gap, px — must match the track's gap-x below
const SPEED = 34 // px/sec of the auto-scroll
const RESUME_DELAY = 900 // ms of stillness after a drag before auto-scroll picks back up

/** Deterministic per-author tint so the same person always gets the same look across the loop. */
function hueOf(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360
  return h
}

function ReviewCard({ rv }: { rv: Review }) {
  const hue = hueOf(rv.author)
  const tone = toneOf(hue)
  return (
    <div
      className="relative w-[260px] shrink-0 overflow-hidden rounded-[22px] p-4"
      style={{ background: `linear-gradient(165deg, ${tone.bg} 0%, #ffffff 60%)`, boxShadow: `0 1px 2px rgb(16 24 40 / 0.04), 0 10px 26px -16px ${tone.fg}55` }}
    >
      <Quote size={40} className="absolute -right-1 -top-1" style={{ color: tone.fg, opacity: 0.14 }} fill="currentColor" />

      <div className="relative flex items-center gap-2.5">
        <Avatar initials={rv.author.slice(0, 2).toUpperCase()} hue={hue} size={40} className="ring-2 ring-white" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-semibold text-ink">{rv.author}</div>
          <div className="text-[11px] text-slate-400">{rv.when}</div>
        </div>
      </div>

      <div className="relative mt-3 flex items-center gap-1.5">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12.5} className={i < rv.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'} />
          ))}
        </div>
        <span className="inline-flex items-center gap-0.5 text-[10.5px] font-medium" style={{ color: tone.fg }}>
          <BadgeCheck size={12} /> Verified session
        </span>
      </div>

      <p className="relative mt-2.5 text-[13.5px] font-medium leading-relaxed text-slate-700">{rv.text}</p>
    </div>
  )
}

/**
 * Self-playing review strip that hands control to the user on touch: drag it to move at your own
 * pace or stop on one card, and it picks the auto-scroll back up a moment after you let go.
 */
export function ReviewMarquee({ reviews }: { reviews: Review[] }) {
  const loop = reviews.length < 4 ? [...reviews, ...reviews, ...reviews] : [...reviews, ...reviews]
  const setWidth = CARD_W * reviews.length

  const x = useMotionValue(0)
  const [dragging, setDragging] = useState(false)
  const resumeAt = useRef(0)

  // Seamless infinite wrap: whichever copy of the set scrolled off-screen, snap it back in range —
  // works the same whether x moved from the auto-scroll or from the user's own drag.
  useMotionValueEvent(x, 'change', (latest) => {
    if (latest <= -setWidth) x.set(latest + setWidth)
    else if (latest > 0) x.set(latest - setWidth)
  })

  useAnimationFrame((_, delta) => {
    if (dragging || performance.now() < resumeAt.current) return
    // Clamp the frame delta so a backgrounded/throttled tab can't produce one huge jump on return.
    x.set(x.get() - (Math.min(delta, 50) / 1000) * SPEED)
  })

  if (reviews.length === 0) return null

  return (
    <div
      className="-mx-5 overflow-hidden"
      style={{
        maskImage: 'linear-gradient(90deg, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)',
      }}
    >
      <motion.div
        className="flex w-max cursor-grab select-none gap-3.5 px-5 py-1 active:cursor-grabbing"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -Infinity, right: Infinity }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => {
          setDragging(false)
          resumeAt.current = performance.now() + RESUME_DELAY
        }}
      >
        {loop.map((rv, i) => (
          <ReviewCard key={`${rv.author}-${i}`} rv={rv} />
        ))}
      </motion.div>
    </div>
  )
}
