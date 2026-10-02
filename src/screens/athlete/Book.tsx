import { Check, CalendarDays, BadgeCheck, Gift, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../state/store'
import { Avatar, BottomCTA, Section, TopBar } from '../../components/core'
import PriceBreakdown from '../../components/PriceBreakdown'
import { COACH_PAY, INTRO_PRICE, PREMIUM, PREMIUM_PERKS, SEGMENTS, SLOT_LABEL, quote, sessionPrice } from '../../lib/pricing'
import { blockById, fmtShort, money } from '../../lib/dates'
import type { Segment } from '../../types'
import { cn } from '@/lib/utils'

export default function Book({ coachId }: { coachId: string }) {
  const { request: r, setRequest, draft, setDraft, go, coachById, user, isFirstSession } = useStore()
  const c = coachById(coachId)
  const [studentOk, setStudentOk] = useState(!!user?.athlete?.student)
  if (!c || !user) return null

  const first = isFirstSession(user.id)
  const addPremium = draft.addPremium && !user.premium
  const q = quote(r.segment, r.date, r.block, { firstSession: first, addPremium })
  const blocked = r.segment === 'concession' && !studentOk

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

        {first && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100">
            <Gift size={20} className="shrink-0 text-emerald-600" />
            <div className="text-[12.5px] leading-snug text-emerald-900">
              <span className="font-semibold">Your first session is {money(INTRO_PRICE)}.</span> Your coach is still paid in full.
            </div>
          </div>
        )}

        <div className="mt-7 space-y-7">
          <Section label="Your price" action={<span className="text-[12px] text-slate-400">{SLOT_LABEL[q.slot]} slot</span>}>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SEGMENTS) as Segment[]).map((id) => {
                const on = r.segment === id
                const p = sessionPrice(id, r.date, r.block)
                return (
                  <button key={id} onClick={() => setRequest({ segment: id })} data-on={on} className="selectable flex flex-col rounded-2xl p-3.5 text-left">
                    <span className="flex items-center justify-between">
                      <span className="text-[13.5px] font-semibold">{SEGMENTS[id].label}</span>
                      <span className={cn('flex h-5 w-5 items-center justify-center rounded-full transition', on ? 'bg-accent' : 'ring-2 ring-slate-300')}>
                        {on && <Check size={12} strokeWidth={3} className="text-white" />}
                      </span>
                    </span>
                    <span className="mt-1.5 text-[22px] font-semibold tracking-tight text-ink">{money(p)}</span>
                    <span className="text-[11.5px] leading-snug text-slate-500">{SEGMENTS[id].who}</span>
                  </button>
                )
              })}
            </div>

            {r.segment === 'concession' && (
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-amber-50 p-4 text-[12.5px] text-amber-900 ring-1 ring-amber-100">
                <input type="checkbox" checked={studentOk} onChange={(e) => setStudentOk(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0a66ff]" />
                <span>
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <BadgeCheck size={14} /> Verify student status (demo)
                  </span>
                  <br />
                  <span className="text-amber-800/80">
                    The live app checks a school or university enrolment at sign-up, which stops others claiming the concession price.
                  </span>
                </span>
              </label>
            )}
          </Section>

          <Section label="Onside Premium" action={<span className="text-[12px] text-slate-400">Optional · monthly</span>}>
            {user.premium ? (
              <div className="card flex items-center gap-3 p-4 text-[13px] text-slate-600">
                <Sparkles size={18} className="shrink-0 text-accent" /> You’re a Premium member. Your AI training plan updates after this session.
              </div>
            ) : (
              <button onClick={() => setDraft({ addPremium: !draft.addPremium })} data-on={draft.addPremium} className="selectable w-full rounded-2xl p-4 text-left">
                <div className="flex items-center gap-3">
                  <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition', draft.addPremium ? 'bg-accent' : 'ring-2 ring-slate-300')}>
                    {draft.addPremium && <Check size={12} strokeWidth={3} className="text-white" />}
                  </span>
                  <span className="text-[14.5px] font-semibold text-ink">Add Premium</span>
                  <span className="ml-auto text-right">
                    <span className="text-[18px] font-semibold tracking-tight text-ink">{money(PREMIUM[r.segment])}</span>
                    <span className="text-[11px] text-slate-400"> / month</span>
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5 pl-8">
                  {PREMIUM_PERKS.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-[12.5px] text-slate-600">
                      <Check size={13} className="text-emerald-600" /> {perk}
                    </li>
                  ))}
                  <li className="text-[11.5px] text-slate-400">Sessions stay the same price.</li>
                </ul>
              </button>
            )}
          </Section>

          <Section label="Price breakdown">
            <PriceBreakdown q={q} />
          </Section>
        </div>
      </div>

      <BottomCTA
        disabled={blocked}
        onClick={() => go({ name: 'checkout', coachId: c.id })}
        note={
          first
            ? `First-session offer · your coach is still paid ${money(COACH_PAY)}`
            : r.segment === 'concession'
            ? 'Concession price · never changes with demand'
            : q.slot === 'peak'
              ? 'Peak slot · +20%, paid to your coach as a bonus'
              : q.slot === 'offpeak'
                ? 'Off-peak slot · 15% off'
                : 'Standard time · base price'
        }
      >
        Continue · {money(q.total)}
      </BottomCTA>
    </div>
  )
}
