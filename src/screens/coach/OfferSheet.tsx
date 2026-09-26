import { useEffect, useState } from 'react'
import type { Coach, OpenRequest } from '../../types'
import { Button, Field, Sheet } from '../../components/core'
import { blockById, fmtShort, money } from '../../lib/dates'
import { TAKE_RATE, listPrice } from '../../lib/pricing'

/** Coach composes an offer to an athlete's request: price + a short message. */
export default function OfferSheet({
  r,
  coach,
  onClose,
  onSend,
}: {
  r: OpenRequest | null
  coach: Coach
  onClose: () => void
  onSend: (price: number, message: string) => void
}) {
  const [price, setPrice] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!r) return
    setPrice(listPrice(coach.hourlyRate, r.date, r.block))
    setMessage(`Hi ${r.athleteName.split(' ')[0]}, I coach ${r.skill.toLowerCase()} and I'm free ${fmtShort(r.date)}. Happy to work on this with you.`)
  }, [r, coach])

  const fee = Math.round(price * TAKE_RATE)
  const fill = ((price - 40) / (200 - 40)) * 100

  return (
    <Sheet open={!!r} onClose={onClose} title={r ? `Offer to ${r.athleteName.split(' ')[0]}` : ''}>
      {r && (
        <>
          <p className="text-[13px] text-slate-500">
            {r.skill} · {fmtShort(r.date)} {blockById(r.block).hours} · {r.suburb} · budget {money(r.budget)}
          </p>

          <div className="mt-5 space-y-4">
            <Field label="Your price" hint={price > r.budget ? 'Above their budget' : 'Within budget'}>
              <div className="card px-4 pt-3 pb-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[26px] font-semibold tracking-tight">{money(price)}</span>
                  <span className="text-[12px] text-slate-400">
                    you receive {money(price - fee)} after {Math.round(TAKE_RATE * 100)}% fee
                  </span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={200}
                  step={5}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="range mt-3 w-full"
                  style={{ ['--fill' as string]: `${fill}%` }}
                />
              </div>
            </Field>
            <Field label="Message">
              <textarea className="field" rows={3} maxLength={240} value={message} onChange={(e) => setMessage(e.target.value)} />
            </Field>
          </div>

          <Button size="lg" full className="mt-5" onClick={() => onSend(price, message.trim())}>
            Send offer · {money(price)}
          </Button>
        </>
      )}
    </Sheet>
  )
}
