import type { PriceQuote } from '../types'
import { COACH_PAY, INTRO_PRICE, SEGMENTS, SLOT_LABEL } from '../lib/pricing'
import { money } from '../lib/dates'

function Row({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 text-[13.5px] ${muted ? 'text-slate-400' : 'text-slate-600'}`}>
      <span>{label}</span>
      <span className={strong ? 'font-semibold text-ink' : 'shrink-0 tabular-nums'}>{value}</span>
    </div>
  )
}

const signed = (n: number) => (n < 0 ? `− ${money(-n)}` : `+ ${money(n)}`)

/** Receipt so every pricing lever (segment, dynamic pricing, intro offer, Premium, coach pay) is visible. */
export default function PriceBreakdown({ q, showPlatform = false }: { q: PriceQuote; showPlatform?: boolean }) {
  const surge = q.sessionPrice - q.listPrice
  const isConcession = q.segment === 'concession'

  return (
    <div className="card space-y-2.5 p-4">
      <Row label={`${SEGMENTS[q.segment].label} session`} value={money(q.listPrice)} />
      {isConcession ? (
        <Row label={`${SLOT_LABEL[q.slot]} · concession prices never surge`} value={money(0)} muted />
      ) : surge !== 0 ? (
        <Row label={surge > 0 ? 'Peak time (+20%)' : 'Off-peak (−15%)'} value={signed(surge)} />
      ) : (
        <Row label="Standard time" value={money(0)} muted />
      )}
      {q.introDiscount > 0 && <Row label={`First-session offer (${money(INTRO_PRICE)})`} value={signed(-q.introDiscount)} />}

      <div className="border-t border-dashed border-slate-200" />
      <Row label="Session price" value={money(q.sessionTotal)} strong />
      {q.premiumFee > 0 && <Row label="Onside Premium · first month" value={money(q.premiumFee)} />}

      <div className="border-t border-slate-200" />
      <div className="flex items-baseline justify-between">
        <span className="text-[14px] font-semibold">Total</span>
        <span className="text-[26px] font-semibold tracking-tight">{money(q.total)}</span>
      </div>

      {showPlatform && (
        <div className="mt-1 space-y-1.5 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
          <div className="text-[12px] font-semibold text-slate-500">Where your session money goes</div>
          <Row label={`Coach is paid (flat ${money(COACH_PAY)})`} value={money(COACH_PAY)} />
          {q.peakBonus > 0 && <Row label="Coach peak bonus (the surge goes to the coach)" value={money(q.peakBonus)} />}
          {q.onsideMargin >= 0 ? (
            <Row label="Onside keeps" value={money(q.onsideMargin)} muted />
          ) : (
            <Row label="Onside covers (first-session offer)" value={money(-q.onsideMargin)} muted />
          )}
        </div>
      )}
    </div>
  )
}
