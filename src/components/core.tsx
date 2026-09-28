import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { useState } from 'react'
import { ChevronLeft, ShieldCheck, Star, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import {
  BoxingGlove,
  PersonSimpleRun,
  PersonSimpleSwim,
  Racquet,
  SoccerBall,
  TennisBall,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react'
import { useStore, type Screen } from '../state/store'
import { cn } from '@/lib/utils'
import type { SportId, Verifications } from '../types'

// ─── Brand ──────────────────────────────────────────────────────────────

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: 'linear-gradient(160deg, #2a7dff 0%, #0a66ff 45%, #0648c4 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 18px -8px rgba(10,102,255,0.7)',
      }}
    >
      <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none">
        <path d="M9 5l7 7-7 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

const TONES = [
  { bg: '#e8f0ff', fg: '#0a58e0' },
  { bg: '#e7f6ef', fg: '#0f7a55' },
  { bg: '#fff1e6', fg: '#b4540c' },
  { bg: '#f1ecff', fg: '#6a3fd0' },
  { bg: '#fdebef', fg: '#b8314b' },
  { bg: '#e8f4fb', fg: '#1a6a9e' },
]

/** Tone lookup shared by Avatar and anything that wants a matching accent (e.g. a profile cover). */
export function toneOf(hue: number) {
  return TONES[Math.abs(Math.round(hue / 60)) % TONES.length]
}

/** Stable "person" index (1–70) so the same hue always resolves to the same stock headshot. */
function photoIndexOf(hue: number) {
  return (Math.abs(Math.round(hue)) % 70) + 1
}

/**
 * Real headshot avatar — a deterministic stock portrait keyed off the same hue that used to
 * pick a flat initials tone, so every coach/athlete gets a believable face instead of a
 * monogram. Falls back to the initials tile if the photo fails to load.
 */
export function Avatar({
  initials,
  hue = 210,
  size = 44,
  className,
  style,
}: {
  initials: string
  hue?: number
  size?: number
  className?: string
  style?: CSSProperties
}) {
  const t = toneOf(hue)
  const [broken, setBroken] = useState(false)
  const px = Math.round(size * 2)

  return (
    <div
      className={cn('relative shrink-0 overflow-hidden rounded-full', className)}
      style={{ width: size, height: size, background: t.bg, boxShadow: `inset 0 0 0 1px ${t.fg}1f`, ...style }}
    >
      {!broken && (
        <img
          src={`https://i.pravatar.cc/${px}?img=${photoIndexOf(hue)}`}
          alt=""
          draggable={false}
          onError={() => setBroken(true)}
          className="h-full w-full object-cover"
        />
      )}
      {broken && (
        <span
          className="absolute inset-0 flex items-center justify-center font-semibold"
          style={{ fontSize: size * 0.36, color: t.fg, letterSpacing: '-0.02em' }}
        >
          {initials}
        </span>
      )}
    </div>
  )
}

const SPORT_ICON: Record<SportId, PhosphorIcon> = {
  athletics: PersonSimpleRun,
  soccer: SoccerBall,
  tennis: TennisBall,
  padel: Racquet,
  boxing: BoxingGlove,
  swimming: PersonSimpleSwim,
}

/** One real, identifiable colour per sport — not a muted UI tone — so its badge reads instantly. */
const SPORT_COLOR: Record<SportId, string> = {
  athletics: '#e8590c',
  soccer: '#1a9e5c',
  tennis: '#a3b800',
  padel: '#0a84e8',
  boxing: '#dc2b3e',
  swimming: '#0ba5b8',
}

/** A real action shot per sport, curated on Unsplash — reads as a sport, not a clipart glyph. */
const SPORT_PHOTO: Record<SportId, string> = {
  athletics: '1461896836934-ffe607ba8211',
  soccer: '1560272564-c83b66b1ad12',
  tennis: '1714840961998-8d6c02ace00b',
  padel: '1646649853703-7645147474ba',
  boxing: '1549719386-74dfcbf7dbed',
  swimming: '1530549387789-4c1017266635',
}

export function sportPhotoUrl(sport: SportId, px: number) {
  return `https://images.unsplash.com/photo-${SPORT_PHOTO[sport]}?w=${px}&h=${px}&fit=crop&q=70&auto=format`
}

export function SportIcon({
  sport,
  size = 22,
  weight = 'regular',
  className,
  style,
}: {
  sport: SportId
  size?: number
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  className?: string
  style?: CSSProperties
}) {
  const I = SPORT_ICON[sport]
  return <I size={size} weight={weight} className={className} style={style} />
}

/**
 * Photo-real sport badge — an actual action shot per discipline, tinted with the sport's colour
 * and lit up on selection, rather than a flat icon glyph on a tinted square.
 */
export function SportBadge({
  sport,
  size = 40,
  active = false,
  className,
}: {
  sport: SportId
  size?: number
  active?: boolean
  className?: string
}) {
  const color = SPORT_COLOR[sport]
  return (
    <span
      className={cn('relative inline-flex shrink-0 overflow-hidden rounded-2xl transition-all duration-200', className)}
      style={{
        width: size,
        height: size,
        boxShadow: active ? `0 8px 18px -8px ${color}b3, inset 0 0 0 2px ${color}` : `inset 0 0 0 1px ${color}2e`,
      }}
    >
      <img
        src={sportPhotoUrl(sport, Math.round(size * 2))}
        alt=""
        draggable={false}
        className="h-full w-full object-cover"
        style={{ filter: active ? 'saturate(1.15)' : 'saturate(0.55) brightness(0.92)' }}
      />
      <span className="absolute inset-0" style={{ background: active ? `linear-gradient(180deg, transparent 55%, ${color}55 100%)` : `${color}3d` }} />
      {size >= 30 && (
        <span
          className="absolute flex items-center justify-center rounded-full"
          style={{ width: size * 0.4, height: size * 0.4, right: size * 0.06, bottom: size * 0.06, background: 'rgba(10,10,15,0.42)', backdropFilter: 'blur(2px)' }}
        >
          <SportIcon sport={sport} size={size * 0.24} weight="fill" className="text-white" />
        </span>
      )}
    </span>
  )
}

// ─── Buttons ────────────────────────────────────────────────────────────

type Variant = 'primary' | 'dark' | 'secondary' | 'soft' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const SIZE: Record<Size, string> = {
  sm: 'h-9 rounded-xl px-3.5 text-[13px]',
  md: 'h-11 rounded-[14px] px-4 text-[14px]',
  lg: 'h-[52px] rounded-2xl px-5 text-[15px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  full,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; full?: boolean }) {
  const shine = variant === 'primary' || variant === 'dark'
  return (
    <button
      {...rest}
      className={cn('btn', `btn-${variant}`, shine && 'btn-shine', SIZE[size], full && 'w-full', className)}
    >
      {children}
    </button>
  )
}

export function IconButton({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="glass-bar flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:scale-105 active:scale-95"
    >
      {children}
    </button>
  )
}

// ─── Layout chrome ──────────────────────────────────────────────────────

/** Floating glass back button + title; content scrolls underneath. */
export function TopBar({ title, right }: { title?: string; right?: ReactNode }) {
  const { back } = useStore()
  return (
    <>
      <div className="scrim-top absolute inset-x-0 top-0 z-20 h-[88px] sm:h-[116px]" />
      <header className="absolute inset-x-0 top-0 z-30 flex items-center gap-3 px-4 pt-4 sm:pt-12">
        <IconButton onClick={back} label="Back">
          <ChevronLeft size={20} strokeWidth={2.2} />
        </IconButton>
        {title && <h1 className="text-[15px] font-semibold tracking-tight">{title}</h1>}
        <div className="ml-auto">{right}</div>
      </header>
    </>
  )
}

export function PageTitle({ eyebrow, title, sub }: { eyebrow?: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <div>
      {eyebrow && <p className="text-[13px] font-medium text-slate-500">{eyebrow}</p>}
      <h1 className="mt-0.5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em]">{title}</h1>
      {sub && <p className="mt-1.5 text-[14px] leading-relaxed text-slate-500">{sub}</p>}
    </div>
  )
}

export function Section({ label, children, action }: { label: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-slate-900">{label}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} data-on={active} className="selectable rounded-full px-3.5 py-2 text-[13px] font-medium">
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
    <div className="flex rounded-[14px] bg-slate-900/[0.05] p-1">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} className="relative flex-1 rounded-[10px] py-2 text-[13px] font-medium">
          {value === o.id && (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-0 rounded-[10px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.08),0_4px_10px_-4px_rgba(16,24,40,0.15)]"
              transition={{ type: 'spring', stiffness: 520, damping: 38 }}
            />
          )}
          <span className={cn('relative transition-colors', value === o.id ? 'text-ink' : 'text-slate-500 hover:text-slate-700')}>
            {o.label}
          </span>
        </button>
      ))}
    </div>
  )
}

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-baseline justify-between text-[13px] font-medium text-slate-700">
        {label}
        {hint && <span className="text-[12px] font-normal text-slate-400">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

/** Floating glass dock holding the primary action. */
export function BottomCTA({
  children,
  onClick,
  disabled,
  note,
  secondary,
  lifted = false,
}: {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  note?: ReactNode
  secondary?: ReactNode
  lifted?: boolean
}) {
  return (
    <>
      <div className={cn('scrim-bottom absolute inset-x-0 bottom-0 z-20', lifted ? 'h-[200px]' : 'h-[130px]')} />
      <div className={cn('absolute inset-x-0 z-30 px-4', lifted ? 'bottom-[92px]' : 'bottom-5')}>
        <div className="glass-bar rounded-[22px] p-2">
          {note && <div className="px-3 pt-1 pb-2 text-center text-[12px] text-slate-500">{note}</div>}
          <div className="flex gap-2">
            {secondary}
            <Button size="lg" full onClick={onClick} disabled={disabled}>
              {children}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export interface TabDef {
  id: string
  label: string
  icon: (p: { size?: number; strokeWidth?: number; className?: string }) => ReactNode
  screen: Screen
  badge?: number
}

/** iOS-style floating glass tab bar with a sliding highlight. */
export function TabBar({ tabs, active }: { tabs: TabDef[]; active: string }) {
  const { reset } = useStore()
  return (
    <>
      <div className="scrim-bottom absolute inset-x-0 bottom-0 z-20 h-[110px]" />
      <nav className="absolute inset-x-0 bottom-5 z-30 px-4">
        <div className="glass-bar flex rounded-[26px] p-1.5">
          {tabs.map((t) => {
            const on = t.id === active
            return (
              <button
                key={t.id}
                onClick={() => reset(t.screen)}
                className="group relative flex flex-1 flex-col items-center gap-0.5 rounded-[20px] py-2"
              >
                {on && (
                  <motion.span
                    layoutId="tab-hl"
                    className="absolute inset-0 rounded-[20px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.08),0_6px_14px_-6px_rgba(16,40,90,0.25)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 36 }}
                  />
                )}
                <span className="relative">
                  {t.icon({
                    size: 20,
                    strokeWidth: on ? 2.2 : 1.8,
                    className: cn('transition-colors', on ? 'text-accent' : 'text-slate-400 group-hover:text-slate-600'),
                  })}
                  {!!t.badge && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white ring-2 ring-white">
                      {t.badge}
                    </span>
                  )}
                </span>
                <span className={cn('relative text-[10.5px] font-medium transition-colors', on ? 'text-ink' : 'text-slate-400 group-hover:text-slate-600')}>
                  {t.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}

// ─── Small pieces ───────────────────────────────────────────────────────

type Tone = 'neutral' | 'blue' | 'green' | 'amber' | 'red'
const TONE: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
  blue: 'bg-blue-50 text-blue-700 ring-blue-100',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  red: 'bg-rose-50 text-rose-700 ring-rose-100',
}

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium ring-1', TONE[tone], className)}>
      {children}
    </span>
  )
}

export function Stars({ rating, size = 13, reviews }: { rating: number; size?: number; reviews?: number }) {
  if (reviews === 0) return <span className="font-semibold text-accent">New</span>
  return (
    <span className="inline-flex items-center gap-1">
      <Star size={size} className="fill-amber-400 text-amber-400" />
      <span className="font-semibold text-ink">{rating.toFixed(1)}</span>
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
        <Badge key={k} tone={v[k] === 'verified' ? 'green' : 'amber'}>
          <ShieldCheck size={12} />
          {V_LABEL[k]}
        </Badge>
      ))}
    </div>
  )
}

export function StatCard({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="card p-3.5">
      <div className="text-[12px] font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-[20px] font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-0.5 text-[11.5px] text-slate-400">{sub}</div>}
    </div>
  )
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">{icon}</div>
      <p className="mt-4 text-[15px] font-semibold">{title}</p>
      <p className="mt-1 max-w-[240px] text-[13px] leading-relaxed text-slate-500">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/** Bottom sheet over the current screen. */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-40 bg-slate-900/25 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-white px-5 pt-3 pb-6 shadow-[0_-20px_50px_-20px_rgba(16,40,90,0.35)]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          >
            <div className="mx-auto h-1 w-10 rounded-full bg-slate-200" />
            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-[17px] font-semibold tracking-tight">{title}</h3>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function Toast() {
  const { toast } = useStore()
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-4 z-[60] flex justify-center px-6"
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        >
          <div className="glass-bar rounded-2xl px-4 py-2.5 text-center text-[13px] font-medium text-ink">{toast}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
