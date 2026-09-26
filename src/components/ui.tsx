import type { ReactNode } from 'react'
import { ChevronLeft, Search, CalendarCheck, ShieldCheck, Star } from 'lucide-react'
import { motion } from 'motion/react'
import { useStore } from '../state/store'
import type { Verifications } from '../types'

export function Logo({ size = 48 }: { size?: number }) {
  return (
    <div
      className="btn-liquid rounded-full flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24" fill="none" className="relative z-10">
        <path d="M8 4l8 8-8 8" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export function Avatar({ initials, hue, size = 48 }: { initials: string; hue: number; size?: number }) {
  return (
    <div
      className="relative rounded-full flex items-center justify-center font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(145deg, hsl(${hue} 85% 62%), hsl(${(hue + 40) % 360} 70% 36%))`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 0 0 2px rgba(255,255,255,0.14), 0 8px 20px -8px hsl(${hue} 80% 50% / 0.8)`,
      }}
    >
      {initials}
    </div>
  )
}

/** Floating glass header — the content scrolls underneath it. */
export function TopBar({ title, right }: { title?: string; right?: ReactNode }) {
  const { back } = useStore()
  return (
    <>
    <div className="scrim-top absolute inset-x-0 top-0 z-20 h-[92px]" />
    <header className="absolute inset-x-0 top-0 z-30 flex items-center gap-3 px-4 pt-4 pb-3">
      <button onClick={back} aria-label="Back" className="btn-glass flex h-10 w-10 items-center justify-center rounded-full">
        <ChevronLeft size={21} />
      </button>
      {title && (
        <h1 className="glass liquid rounded-full px-4 py-2 text-[14px] font-semibold tracking-tight">{title}</h1>
      )}
      <div className="ml-auto">{right}</div>
    </header>
    </>
  )
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`glass rounded-full px-3.5 py-2 text-[13px] font-medium transition active:scale-[0.97] ${
        active ? 'glass-on text-accent' : 'glass-soft text-ink/70 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  layoutId = 'seg',
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
  layoutId?: string
}) {
  return (
    <div className="glass glass-soft flex rounded-2xl p-1">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} className="relative flex-1 rounded-xl py-2.5 text-[12.5px] font-medium">
          {value === o.id && (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-0 rounded-xl lens"
              transition={{ type: 'spring', stiffness: 480, damping: 36 }}
            />
          )}
          <span className={`relative ${value === o.id ? 'text-ink' : 'text-ink/50'}`}>{o.label}</span>
        </button>
      ))}
    </div>
  )
}

export function Section({ label, children, hint }: { label: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <section className="space-y-2.5">
      <div className="flex items-baseline justify-between px-1">
        <h2 className="text-[11px] font-semibold tracking-[0.16em] text-ink/45 uppercase">{label}</h2>
        {hint && <span className="text-[11.5px] text-ink/50">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

export function LiquidButton({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-liquid w-full rounded-full py-4 text-[15px] font-semibold text-white ${className}`}
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
    </button>
  )
}

/** Floating glass dock holding the primary action. */
export function BottomCTA({
  children,
  onClick,
  disabled,
  note,
  lifted = false,
}: {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  note?: ReactNode
  lifted?: boolean
}) {
  return (
    <>
    <div className={`scrim absolute inset-x-0 bottom-0 z-20 ${lifted ? 'h-[210px]' : 'h-[130px]'}`} />
    <div className={`absolute inset-x-0 z-30 px-4 ${lifted ? 'bottom-[88px]' : 'bottom-5'}`}>
      <div className="glass liquid rounded-[2rem] p-2">
        {note && <div className="px-3 pt-1 pb-2 text-center text-[11.5px] text-ink/65">{note}</div>}
        <LiquidButton onClick={onClick} disabled={disabled}>
          {children}
        </LiquidButton>
      </div>
    </div>
    </>
  )
}

export function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Star size={size} className="fill-amber-400 text-amber-400" />
      <span className="font-semibold">{rating.toFixed(1)}</span>
    </span>
  )
}

const V_LABEL: Record<keyof Verifications, string> = {
  wwcc: 'WWCC',
  firstAid: 'First aid',
  accreditation: 'Accredited',
}

export function VerifiedBadges({ v }: { v: Verifications }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {(Object.keys(V_LABEL) as (keyof Verifications)[]).map((k) => (
        <span
          key={k}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${
            v[k] === 'verified'
              ? 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/25'
              : 'bg-amber-500/10 text-amber-700 ring-amber-500/25'
          }`}
        >
          <ShieldCheck size={12} />
          {V_LABEL[k]}
        </span>
      ))}
    </div>
  )
}

/** iOS-style floating glass tab bar with a sliding lens behind the active tab. */
export function AthleteTabBar({ active }: { active: 'find' | 'bookings' }) {
  const { reset, bookings } = useStore()
  const tabs = [
    { id: 'find' as const, label: 'Find a coach', icon: Search, go: () => reset({ name: 'request' }) },
    {
      id: 'bookings' as const,
      label: bookings.length ? `Bookings · ${bookings.length}` : 'Bookings',
      icon: CalendarCheck,
      go: () => reset({ name: 'bookings' }),
    },
  ]
  return (
    <>
    <div className="scrim absolute inset-x-0 bottom-0 z-20 h-[110px]" />
    <nav className="absolute inset-x-0 bottom-5 z-30 flex justify-center px-10">
      <div className="glass liquid flex w-full rounded-full p-1.5">
        {tabs.map((t) => {
          const on = t.id === active
          const Icon = t.icon
          return (
            <button key={t.id} onClick={t.go} className="relative flex flex-1 items-center justify-center gap-2 rounded-full py-2.5">
              {on && (
                <motion.span
                  layoutId="tab-lens"
                  className="absolute inset-0 rounded-full lens"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <Icon size={18} className={`relative ${on ? 'text-accent' : 'text-ink/45'}`} />
              <span className={`relative text-[12.5px] font-semibold ${on ? 'text-ink' : 'text-ink/45'}`}>{t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
    </>
  )
}
