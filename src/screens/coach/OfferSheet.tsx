import { useEffect, useState } from 'react'
import type { OpenRequest } from '../../types'
import { Button, Field, Sheet } from '../../components/core'
import { blockById, fmtShort, money } from '../../lib/dates'
import { COACH_PAY, SEGMENTS, quote } from '../../lib/pricing'

/**
 * Coach responds to an athlete's request with a short message. The price is not the coach's
 * to set: Onside charges one price per segment and pays every coach a flat A$35 + peak bonus.
 */
export default function OfferSheet({
  r,
  onClose,
  onSend,
}: {
  r: OpenRequest | null
  onClose: () => void
  onSend: (message: string) => void
}) {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!r) return
    setMessage(`Hi ${r.athleteName.split(' ')[0]}, I coach ${r.skill.toLowerCase()} and I'm free ${fmtShort(r.date)}. Happy to work on this with you.`)
  }, [r])

  const q = r ? quote(r.segment, r.date, r.block) : null

  return (
    <Sheet open={!!r} onClose={onClose} title={r ? `Offer to ${r.athleteName.split(' ')[0]}` : ''}>
      {r && q && (
        <>
          <p className="text-[13px] text-slate-500">
            {r.skill} · {fmtShort(r.date)} {blockById(r.block).hours} · {r.suburb}
          </p>

          <div className="mt-5 space-y-4">
            <div className="card grid grid-cols-2 divide-x divide-slate-100 text-center">
              <div className="px-3 py-3.5">
                <div className="text-[24px] font-semibold tracking-tight">{money(q.coachPayout)}</div>
                <div className="text-[11.5px] text-slate-500">
                  you receive{q.peakBonus > 0 ? ` (${money(COACH_PAY)} + ${money(q.peakBonus)} peak bonus)` : ''}
                </div>
              </div>
              <div className="px-3 py-3.5">
                <div className="text-[24px] font-semibold tracking-tight">{money(q.sessionPrice)}</div>
                <div className="text-[11.5px] text-slate-500">{SEGMENTS[r.segment].label.toLowerCase()} price athlete pays</div>
              </div>
            </div>
            <p className="text-[11.5px] leading-relaxed text-slate-400">
              Onside sets the price, so you never have to negotiate. You’re paid the same for student and standard sessions, automatically after each one.
            </p>
            <Field label="Message">
              <textarea className="field" rows={3} maxLength={240} value={message} onChange={(e) => setMessage(e.target.value)} />
            </Field>
          </div>

          <Button size="lg" full className="mt-5" onClick={() => onSend(message.trim())}>
            Send offer
          </Button>
        </>
      )}
    </Sheet>
  )
}
