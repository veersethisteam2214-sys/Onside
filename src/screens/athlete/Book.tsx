import { Check, CalendarDays, BadgeCheck } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../../state/store'
import { coachById } from '../../data/coaches'
import { Avatar, BottomCTA, Section, TopBar } from '../../components/ui'
import { PACKAGES, TIERS, quote } from '../../lib/pricing'
import { blockById, fmtShort, money } from '../../lib/dates'
import type { PackageType, Tier } from '../../types'

/**
 * Package + tier picker — selectable glass pricing cards with one highlighted
 * "best value" option, after the 21st.dev pricing-card pattern.
 */
export default function Book({ coachId }: { coachId: string }) {
  const { request: r, draft, setDraft, go } = useStore()
  const c = coachById(coachId)
  const [concessionOk, setConcessionOk] = useState(false)

  const q = quote(c.hourlyRate, r.date, r.block, draft.tier, draft.packageType)
  const blocked = draft.tier === 'concession' && !concessionOk

  return (
    <div className="relative h-full">
      <TopBar title="Book a session" />
      <div className="h-full overflow-y-auto px-5 pt-[76px] pb-[150px]">
        <div className="glass flex items-center gap-3 rounded-[1.6rem] p-3.5">
          <Avatar initials={c.initials} hue={c.hue} size={44} />
          <div className="min-w-0">
            <div className="font-semibold tracking-tight">{c.name}</div>
            <div className="flex items-center gap-1.5 text-[12px] text-ink/60">
              <CalendarDays size={13} />
              {fmtShort(r.date)} · {blockById(r.block).hours}
            </div>
          </div>
          <div className="ml-auto shrink-0 whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent ring-1 ring-accent/30">
            {r.skill}
          </div>
        </div>

        <div className="mt-7 space-y-7">
          <Section label="Choose a package" hint="more sessions, lower price">
            <div className="space-y-3">
              {(Object.keys(PACKAGES) as PackageType[]).map((id) => {
                const p = PACKAGES[id]
                const pq = quote(c.hourlyRate, r.date, r.block, draft.tier, id)
                const active = draft.packageType === id
                const best = id === 'ten'
                return (
                  <button
                    key={id}
                    onClick={() => setDraft({ packageType: id })}
                    className={`glass relative w-full rounded-[1.5rem] p-4 text-left transition active:scale-[0.99] ${
                      active ? 'glass-on' : 'glass-soft'
                    }`}
                  >
                    {p.tag && (
                      <span
                        className={`absolute -top-2.5 left-4 z-10 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${
                          best ? 'bg-ink text-white' : 'btn-liquid'
                        }`}
                      >
                        <span className="relative z-10">{p.tag}</span>
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          active ? 'bg-accent' : 'ring-2 ring-ink/20'
                        }`}
                      >
                        {active && <Check size={12} className="text-white" strokeWidth={3.5} />}
                      </span>
                      <div>
                        <div className="text-[14.5px] font-semibold">{p.label}</div>
                        <div className={`text-[12px] ${active ? 'text-accent/80' : 'text-ink/50'}`}>
                          {money(pq.total)} total{pq.saving > 0 && ` · save ${money(pq.saving)}`}
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-[22px] font-bold tracking-tight">{money(pq.unitPrice)}</div>
                        <div className={`text-[10.5px] ${active ? 'text-accent/70' : 'text-ink/45'}`}>per session</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </Section>

          <Section label="Your pricing tier">
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(TIERS) as Tier[]).map((id) => {
                const t = TIERS[id]
                const active = draft.tier === id
                return (
                  <button
                    key={id}
                    onClick={() => setDraft({ tier: id })}
                    className={`glass flex flex-col justify-start rounded-[1.3rem] p-3 text-left transition active:scale-[0.98] ${
                      active ? 'glass-on' : 'glass-soft'
                    }`}
                  >
                    <div className="text-[13px] font-semibold">{t.label}</div>
                    <div className={`mt-1 text-[10.5px] leading-snug ${active ? 'text-accent/80' : 'text-ink/45'}`}>{t.blurb}</div>
                  </button>
                )
              })}
            </div>

            <motion.ul
              key={draft.tier}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass glass-soft space-y-2 rounded-[1.3rem] p-4"
            >
              {TIERS[draft.tier].perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-[12.5px] text-ink/80">
                  <Check size={14} className="text-emerald-600" /> {perk}
                </li>
              ))}
            </motion.ul>

            {draft.tier === 'concession' && (
              <label className="glass flex items-start gap-3 rounded-[1.3rem] bg-amber-400/10 p-4 text-[12.5px] text-amber-900">
                <input
                  type="checkbox"
                  checked={concessionOk}
                  onChange={(e) => setConcessionOk(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#2f7bff]"
                />
                <span>
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                    <BadgeCheck size={14} /> Verify eligibility (demo)
                  </span>
                  <br />
                  <span className="text-amber-900/70">
                    In the real app a concession card or school equity program is checked before booking — that's what stops
                    everyone claiming the discount.
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
