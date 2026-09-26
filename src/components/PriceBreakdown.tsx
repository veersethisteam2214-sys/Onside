import type { PackageType, PriceQuote, Tier } from '../types'
import { TIERS, PACKAGES, TAKE_RATE } from '../lib/pricing'
import { money } from '../lib/dates'

function Row({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return (
    <div className={`flex justify-between text-[13.5px] ${muted ? 'text-slate-400' : 'text-slate-600'}`}>
      <span>{label}</span>
      <span className={strong ? 'font-semibold text-ink' : 'tabular-nums'}>{value}</span>
    </div>
  )
}

/** Receipt so every pricing lever is visible on screen. */
export default function PriceBreakdown({
  q,
  tier,
  pkg,
  showPlatform = false,
}: {
  q: PriceQuote
  tier: Tier
  pkg: PackageType
  showPlatform?: boolean
}) {
  return (
    <div className="card space-y-2.5 p-4">
      <Row label="Coach base rate" value={`${money(q.baseRate)} / session`} />
      <Row label={q.isPeak ? 'Peak loading (weekend / after school)' : 'Off-peak'} value={q.isPeak ? `× ${q.peakMultiplier.toFixed(2)}` : '× 1.00'} />
      <Row label={`${TIERS[tier].label} tier`} value={`× ${q.tierRate.toFixed(2)}`} />
      <Row label={PACKAGES[pkg].label} value={`× ${q.packageDiscount.toFixed(2)}`} />

      <div className="border-t border-dashed border-slate-200" />

      <Row label="Price per session" value={money(q.unitPrice)} strong />
      <Row label="Sessions" value={`× ${q.sessions}`} />
      {q.saving > 0 && <Row label="You save" value={`− ${money(q.saving)}`} />}

      <div className="border-t border-slate-200" />

      <div className="flex items-baseline justify-between">
        <span className="text-[14px] font-semibold">Total</span>
        <span className="text-[26px] font-semibold tracking-tight">{money(q.total)}</span>
      </div>

      {showPlatform && (
        <div className="mt-1 space-y-1.5 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
          <div className="text-[12px] font-semibold text-slate-500">Where your money goes</div>
          <Row label="Coach receives" value={money(q.coachPayout)} />
          <Row label={`Onside platform fee (${Math.round(TAKE_RATE * 100)}%)`} value={money(q.platformFee)} muted />
        </div>
      )}
    </div>
  )
}
