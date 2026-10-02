import { MapPin, Sparkles, ChevronDown } from 'lucide-react'
import { useStore } from '../../state/store'
import { SPORTS, SUBURBS, sportById } from '../../data/sports'
import { BottomCTA, Chip, PageTitle, Section, Segmented, SportBadge } from '../../components/core'
import { AthleteTabs } from '../../components/tabs'
import { BLOCKS, nextDays, toISO, money } from '../../lib/dates'
import { SEGMENTS, sessionPrice, slotType } from '../../lib/pricing'
import type { Level, Segment } from '../../types'
import { cn } from '@/lib/utils'

const LEVELS: { id: Level; label: string }[] = [
  { id: 'Beginner', label: 'Beginner' },
  { id: 'Intermediate', label: 'Inter.' },
  { id: 'Competitive', label: 'Competitive' },
  { id: 'Elite', label: 'Elite' },
]

export default function Request() {
  const { request: r, setRequest, go } = useStore()
  const sport = sportById(r.sport)
  const days = nextDays(10)

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-5 pt-14 pb-[200px]">
        <PageTitle title="Find a coach" sub="Tell us the one thing you want to work on." />

        <div className="mt-7 space-y-7">
          <Section label="Sport">
            <div className="grid grid-cols-3 gap-2">
              {SPORTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setRequest({ sport: s.id, skill: s.skills[0] })}
                  data-on={s.id === r.sport}
                  className="selectable flex flex-col items-center gap-1.5 rounded-2xl py-3"
                >
                  <SportBadge sport={s.id} size={34} active={s.id === r.sport} />
                  <span className="text-[12px] font-medium">{s.name}</span>
                </button>
              ))}
            </div>
          </Section>

          <Section label="Skill">
            <div className="flex flex-wrap gap-2">
              {sport.skills.map((k) => (
                <Chip key={k} active={k === r.skill} onClick={() => setRequest({ skill: k })}>
                  {k}
                </Chip>
              ))}
            </div>
          </Section>

          <Section label="Your level">
            <Segmented options={LEVELS} value={r.level} onChange={(level) => setRequest({ level })} layoutId="req-level" />
          </Section>

          <Section label="When">
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 py-1">
              {days.map((d) => {
                const iso = toISO(d)
                const on = iso === r.date
                const weekend = d.getDay() === 0 || d.getDay() === 6
                return (
                  <button key={iso} onClick={() => setRequest({ date: iso })} data-on={on} className="selectable flex w-[54px] shrink-0 flex-col items-center rounded-2xl py-2.5">
                    <span className={cn('text-[11px] font-medium', on ? 'text-accent' : weekend ? 'text-slate-700' : 'text-slate-400')}>
                      {d.toLocaleDateString('en-AU', { weekday: 'short' })}
                    </span>
                    <span className="text-[17px] font-semibold">{d.getDate()}</span>
                  </button>
                )
              })}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {BLOCKS.map((b) => {
                const on = b.id === r.block
                return (
                  <button key={b.id} onClick={() => setRequest({ block: b.id })} data-on={on} className="selectable relative rounded-2xl px-2 py-2.5 text-center">
                    <div className="text-[12.5px] font-semibold">{b.label}</div>
                    <div className={cn('text-[11px]', on ? 'text-accent/80' : 'text-slate-400')}>{b.hours}</div>
                    {r.segment === 'standard' && slotType(r.date, b.id) !== 'base' && (
                      <span
                        className={cn(
                          'absolute -top-2 right-2 rounded-full px-1.5 py-px text-[9px] font-semibold tracking-wide',
                          slotType(r.date, b.id) === 'peak' ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white',
                        )}
                      >
                        {money(sessionPrice('standard', r.date, b.id))}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </Section>

          <Section label="Where">
            <div className="relative">
              <MapPin size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select value={r.suburb} onChange={(e) => setRequest({ suburb: e.target.value })} className="field appearance-none pl-10">
                {SUBURBS.map((s) => (
                  <option key={s.name}>{s.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </Section>

          <Section label="Price" action={<span className="text-[12px] text-slate-400">Same for every coach</span>}>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SEGMENTS) as Segment[]).map((id) => (
                <button key={id} onClick={() => setRequest({ segment: id })} data-on={r.segment === id} className="selectable flex flex-col rounded-2xl p-3 text-left">
                  <span className="flex items-baseline justify-between">
                    <span className="text-[13px] font-semibold">{id === 'concession' ? 'Student' : 'Standard'}</span>
                    <span className="text-[15px] font-semibold">{money(SEGMENTS[id].price)}</span>
                  </span>
                  <span className="mt-0.5 text-[11.5px] leading-snug text-slate-500">
                    {id === 'concession' ? 'School or uni · never surges' : '$51 off-peak to $72 peak'}
                  </span>
                </button>
              ))}
            </div>
          </Section>
        </div>
      </div>

      <BottomCTA lifted onClick={() => go({ name: 'matches' })}>
        <Sparkles size={17} /> Find coaches
      </BottomCTA>
      <AthleteTabs active="search" />
    </div>
  )
}
