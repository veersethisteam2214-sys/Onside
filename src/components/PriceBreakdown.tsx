import type { PackageType, PriceQuote, Tier } from '../types'
import { TIERS, PACKAGES, TAKE_RATE } from '../lib/pricing'
import { money } from '../lib/dates'

function Row({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return (
    <div className={`flex justify-between text-[13px] ${muted ? 'text-ink/45' : 'text-ink/70'}`}>
      <span>{label}</span>
      <span className={strong ? 'font-semibold text-ink' : 'tabular-nums'}>{value}</span>
    </div>
  )
}

/** Glass receipt so every pricing lever is visible on screen. */
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
    <div className="glass rounded-[1.6rem] p-4 space-y-2">
      <Row label="Coach base rate" value={`${money(q.baseRate)} / session`} />
      <Row
        label={q.isPeak ? 'Peak loading (weekend / after school)' : 'Off-peak'}
        value={q.isPeak ? `× ${q.peakMultiplier.toFixed(2)}` : '× 1.00'}
      />
      <Row label={`${TIERS[tier].label} tier`} value={`× ${q.tierRate.toFixed(2)}`} />
      <Row label={PACKAGES[pkg].label} value={`× ${q.packageDiscount.toFixed(2)}`} />

      <div className="my-2 border-t border-dashed border-ink/10" />

      <Row label="Price per session" value={money(q.unitPrice)} strong />
      <Row label="Sessions" value={`× ${q.sessions}`} />
      {q.saving > 0 && <Row label="You save" value={`− ${money(q.saving)}`} />}

      <div className="my-2 border-t border-ink/10" />

      <div className="flex items-baseline justify-between">
        <span className="font-semibold">Total</span>
        <span className="text-[28px] font-bold tracking-tight">{money(q.total)}</span>
      </div>

      {showPlatform && (
        <div className="mt-3 space-y-1.5 rounded-2xl bg-ink/[0.04] p-3 ring-1 ring-ink/10">
          <div className="text-[10.5px] font-semibold tracking-[0.14em] text-ink/45 uppercase">Where your money goes</div>
          <Row label="Coach receives" value={money(q.coachPayout)} />
          <Row label={`Onside platform fee (${Math.round(TAKE_RATE * 100)}%)`} value={money(q.platformFee)} muted />
        </div>
      )}
    </div>
  )
}
