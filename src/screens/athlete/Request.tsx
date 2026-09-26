import { MapPin, Sparkles, ChevronDown } from 'lucide-react'
import { useStore } from '../../state/store'
import { SPORTS, SUBURBS, sportById } from '../../data/sports'
import { AthleteTabBar, BottomCTA, Chip, Logo, Section, Segmented } from '../../components/ui'
import { BLOCKS, nextDays, toISO, money } from '../../lib/dates'
import { isPeak } from '../../lib/pricing'
import type { Level } from '../../types'

const LEVELS: { id: Level; label: string }[] = [
  { id: 'Beginner', label: 'Beginner' },
  { id: 'Intermediate', label: 'Inter.' },
  { id: 'Competitive', label: 'Competitive' },
  { id: 'Elite', label: 'Elite' },
]

const MIN = 40
const MAX = 180

export default function Request() {
  const { request: r, setRequest, go } = useStore()
  const sport = sportById(r.sport)
  const days = nextDays(10)
  const fill = ((r.budget - MIN) / (MAX - MIN)) * 100

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-5 pt-8 pb-[190px]">
        <div className="flex items-center gap-2.5">
          <Logo size={32} />
          <span className="text-[15px] font-bold tracking-tight">Onside</span>
        </div>
        <h1 className="mt-7 text-[30px] font-bold leading-[1.1] tracking-[-0.03em]">
          What do you want
          <br />
          to work on?
        </h1>
        <p className="mt-2 text-[13.5px] text-ink/65">One skill. One coach. When and where it suits you.</p>

        <div className="mt-7 space-y-7">
          <Section label="Sport">
            <div className="grid grid-cols-3 gap-2.5">
              {SPORTS.map((s) => {
                const active = s.id === r.sport
                return (
                  <button
                    key={s.id}
                    onClick={() => setRequest({ sport: s.id, skill: s.skills[0] })}
                    className={`glass rounded-[1.3rem] px-2 py-3.5 text-center transition active:scale-[0.97] ${
                      active ? 'glass-on' : 'glass-soft'
                    }`}
                  >
                    <div className="text-[22px] leading-none">{s.emoji}</div>
                    <div className={`mt-2 text-[12px] font-semibold ${active ? 'text-accent' : 'text-ink/65'}`}>{s.name}</div>
                  </button>
                )
              })}
            </div>
          </Section>

          <Section label="The skill" hint="pick one">
            <div className="flex flex-wrap gap-2">
              {sport.skills.map((k) => (
                <Chip key={k} active={k === r.skill} onClick={() => setRequest({ skill: k })}>
                  {k}
                </Chip>
              ))}
            </div>
          </Section>

          <Section label="Your level">
            <Segmented options={LEVELS} value={r.level} onChange={(level) => setRequest({ level })} layoutId="level" />
          </Section>

          <Section label="When">
            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 py-1">
              {days.map((d) => {
                const iso = toISO(d)
                const active = iso === r.date
                const weekend = d.getDay() === 0 || d.getDay() === 6
                return (
                  <button
                    key={iso}
                    onClick={() => setRequest({ date: iso })}
                    className={`glass flex w-[54px] shrink-0 flex-col items-center rounded-[1.2rem] py-2.5 transition active:scale-[0.96] ${
                      active ? 'glass-on' : 'glass-soft'
                    }`}
                  >
                    <span
                      className={`text-[10.5px] font-semibold ${
                        active ? 'text-accent' : weekend ? 'text-accent' : 'text-ink/45'
                      }`}
                    >
                      {d.toLocaleDateString('en-AU', { weekday: 'short' })}
                    </span>
                    <span className="mt-0.5 text-[18px] font-bold">{d.getDate()}</span>
                  </button>
                )
              })}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {BLOCKS.map((b) => {
                const active = b.id === r.block
                const peak = isPeak(r.date, b.id)
                return (
                  <button
                    key={b.id}
                    onClick={() => setRequest({ block: b.id })}
                    className={`glass relative rounded-[1.2rem] px-2 py-3 text-center transition active:scale-[0.97] ${
                      active ? 'glass-on' : 'glass-soft'
                    }`}
                  >
                    <div className="text-[12.5px] font-semibold">{b.label}</div>
                    <div className={`text-[11px] ${active ? 'text-accent/80' : 'text-ink/45'}`}>{b.hours}</div>
                    {peak && (
                      <span className="btn-liquid text-white absolute -top-2 right-2 rounded-full px-1.5 py-px text-[9px] font-bold tracking-wide">
                        <span className="relative z-10">PEAK</span>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </Section>

          <Section label="Where">
            <label className="glass glass-soft flex items-center gap-2.5 rounded-[1.3rem] px-4 py-3.5">
              <MapPin size={18} className="text-accent" />
              <select
                value={r.suburb}
                onChange={(e) => setRequest({ suburb: e.target.value })}
                className="flex-1 appearance-none bg-transparent text-[14.5px] font-semibold outline-none"
              >
                {SUBURBS.map((s) => (
                  <option key={s.name}>{s.name}</option>
                ))}
              </select>
              <span className="text-[11.5px] text-ink/45">Melbourne</span>
              <ChevronDown size={16} className="text-ink/45" />
            </label>
          </Section>

          <Section label="Budget per session" hint={<span className="text-[15px] font-bold text-ink">{money(r.budget)}</span>}>
            <div className="glass glass-soft rounded-[1.3rem] px-4 pt-4 pb-3">
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={5}
                value={r.budget}
                onChange={(e) => setRequest({ budget: Number(e.target.value) })}
                className="range-liquid w-full"
                style={{ ['--fill' as string]: `${fill}%` }}
              />
              <div className="mt-2 flex justify-between text-[11px] text-ink/45">
                <span>${MIN}</span>
                <span>${MAX}</span>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <BottomCTA lifted onClick={() => go({ name: 'matches' })}>
        <Sparkles size={18} /> Find my coach
      </BottomCTA>
      <AthleteTabBar active="find" />
    </div>
  )
}
