import { Check, CalendarDays, BadgeCheck } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../../state/store'
import { Avatar, BottomCTA, Section, TopBar } from '../../components/core'
import { PACKAGES, TIERS, quote } from '../../lib/pricing'
import { blockById, fmtShort, money } from '../../lib/dates'
import type { PackageType, Tier } from '../../types'
import { cn } from '@/lib/utils'

export default function Book({ coachId }: { coachId: string }) {
  const { request: r, draft, setDraft, go, coachById } = useStore()
  const c = coachById(coachId)
  const [concessionOk, setConcessionOk] = useState(false)
  if (!c) return null

  const q = quote(c.hourlyRate, r.date, r.block, draft.tier, draft.packageType)
  const blocked = draft.tier === 'concession' && !concessionOk

  return (
    <div className="relative h-full">
      <TopBar title="Book a session" />
      <div className="h-full overflow-y-auto px-5 pt-[76px] sm:pt-[108px] pb-[160px]">
        <div className="card flex items-center gap-3 p-3.5">
          <Avatar initials={c.initials} hue={c.hue} size={44} />
          <div className="min-w-0">
            <div className="font-semibold tracking-tight">{c.name}</div>
            <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
              <CalendarDays size={13} />
              {fmtShort(r.date)} · {blockById(r.block).hours}
            </div>
          </div>
          <span className="ml-auto shrink-0 whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-[11.5px] font-medium text-blue-700 ring-1 ring-blue-100">
            {r.skill}
          </span>
        </div>

        <div className="mt-7 space-y-7">
          <Section label="Choose a package" action={<span className="text-[12px] text-slate-400">More sessions, lower price</span>}>
            <div className="space-y-2.5">
              {(Object.keys(PACKAGES) as PackageType[]).map((id) => {
                const p = PACKAGES[id]
                const pq = quote(c.hourlyRate, r.date, r.block, draft.tier, id)
                const on = draft.packageType === id
                return (
                  <button key={id} onClick={() => setDraft({ packageType: id })} data-on={on} className="selectable relative w-full rounded-2xl p-4 text-left">
                    {p.tag && (
                      <span
                        className={cn(
                          'absolute -top-2.5 left-4 rounded-full px-2 py-0.5 text-[10.5px] font-semibold',
                          id === 'ten' ? 'bg-slate-900 text-white' : 'bg-accent text-white',
                        )}
                      >
                        {p.tag}
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition', on ? 'bg-accent' : 'ring-2 ring-slate-300')}>
                        {on && <Check size={12} strokeWidth={3} className="text-white" />}
                      </span>
                      <div>
                        <div className="text-[14.5px] font-semibold text-ink">{p.label}</div>
                        <div className="text-[12px] text-slate-500">
                          {money(pq.total)} total{pq.saving > 0 && ` · save ${money(pq.saving)}`}
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-[20px] font-semibold tracking-tight text-ink">{money(pq.unitPrice)}</div>
                        <div className="text-[11px] text-slate-400">per session</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </Section>

          <Section label="Pricing tier">
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(TIERS) as Tier[]).map((id) => (
                <button key={id} onClick={() => setDraft({ tier: id })} data-on={draft.tier === id} className="selectable flex flex-col rounded-2xl p-3 text-left">
                  <span className="text-[13px] font-semibold">{TIERS[id].label}</span>
                  <span className="mt-1 text-[11px] leading-snug text-slate-500">{TIERS[id].blurb}</span>
                </button>
              ))}
            </div>

            <motion.ul key={draft.tier} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="card space-y-2 p-4">
              {TIERS[draft.tier].perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-[13px] text-slate-600">
                  <Check size={14} className="text-emerald-600" /> {perk}
                </li>
              ))}
            </motion.ul>

            {draft.tier === 'concession' && (
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-amber-50 p-4 text-[12.5px] text-amber-900 ring-1 ring-amber-100">
                <input type="checkbox" checked={concessionOk} onChange={(e) => setConcessionOk(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0a66ff]" />
                <span>
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <BadgeCheck size={14} /> Verify eligibility (demo)
                  </span>
                  <br />
                  <span className="text-amber-800/80">
                    The live app checks a concession card or school equity program before booking — which is what stops everyone claiming the discount.
                  </span>
                </span>
              </label>
            )}
          </Section>
        </div>
      </div>

      <BottomCTA
        disabled={blocked}
        onClick={() => go({ name: 'checkout', coachId: c.id })}
        note={q.isPeak ? 'Peak slot · includes 15% weekend / after-school loading' : 'Off-peak slot · no peak loading'}
      >
        Continue · {money(q.total)}
      </BottomCTA>
    </div>
  )
}
