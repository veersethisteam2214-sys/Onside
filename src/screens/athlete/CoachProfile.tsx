import { MapPin, Quote } from 'lucide-react'
import { useStore } from '../../state/store'
import { coachById } from '../../data/coaches'
import { sportById } from '../../data/sports'
import { Avatar, BottomCTA, Section, Stars, TopBar, VerifiedBadges } from '../../components/ui'
import { BLOCKS, money } from '../../lib/dates'
import { listPrice } from '../../lib/pricing'

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const DAY_INDEX = [1, 2, 3, 4, 5, 6, 0]

export default function CoachProfile({ coachId }: { coachId: string }) {
  const { request: r, go } = useStore()
  const c = coachById(coachId)
  const price = listPrice(c.hourlyRate, r.date, r.block)
  const sport = sportById(c.sport)

  return (
    <div className="relative h-full">
      <TopBar />
      <div className="h-full overflow-y-auto px-5 pt-[76px] pb-[120px]">
        <div className="flex flex-col items-center text-center">
          <Avatar initials={c.initials} hue={c.hue} size={88} />
          <h1 className="mt-4 text-[26px] font-bold tracking-[-0.02em]">{c.name}</h1>
          <div className="mt-1 text-[13px] text-ink/65">
            {sport.emoji} {sport.name} coach · {c.suburb}
          </div>
          <div className="mt-1.5 text-[13px]">
            <Stars rating={c.rating} /> <span className="text-ink/55">({c.reviewCount} reviews)</span>
          </div>
          <div className="mt-4">
            <VerifiedBadges v={c.verifications} />
          </div>
        </div>

        <div className="glass mt-6 grid grid-cols-3 divide-x divide-ink/10 rounded-[1.5rem] py-3.5 text-center">
          {[
            [String(c.sessionsRun), 'sessions run'],
            [`${c.yearsCoaching} yrs`, 'coaching'],
            [money(c.hourlyRate), 'base rate'],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-[18px] font-bold tracking-tight">{v}</div>
              <div className="text-[11px] text-ink/50">{l}</div>
            </div>
          ))}
        </div>

        <div className="mt-7 space-y-7">
          <Section label="About">
            <p className="glass glass-soft rounded-[1.4rem] p-4 text-[14px] leading-relaxed text-ink/80">{c.bio}</p>
          </Section>

          <Section label="Skills coached">
            <div className="flex flex-wrap gap-2">
              {c.skills.map((s) => (
                <span
                  key={s}
                  className={`glass rounded-full px-3.5 py-2 text-[12.5px] font-medium ${s === r.skill ? 'glass-on' : 'glass-soft text-ink/75'}`}
                >
                  {s}
                  {s === r.skill && ' ✓'}
                </span>
              ))}
            </div>
            <div className="px-1 text-[12px] text-ink/45">Levels: {c.levels.join(', ')}</div>
          </Section>

          <Section label="Weekly availability">
            <div className="glass glass-soft rounded-[1.4rem] p-3.5">
              <div className="grid grid-cols-[76px_repeat(7,1fr)] gap-y-2.5 text-center text-[11px]">
                <span />
                {DAYS.map((d, i) => (
                  <span key={i} className="font-semibold text-ink/45">
                    {d}
                  </span>
                ))}
                {BLOCKS.map((b) => (
                  <div key={b.id} className="contents">
                    <span className="text-left text-ink/60">{b.label}</span>
                    {DAY_INDEX.map((di) => {
                      const on = c.availability[di]?.includes(b.id)
                      return (
                        <span key={di} className="flex justify-center">
                          <span
                            className={`h-5 w-5 rounded-[7px] ${
                              on
                                ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7),inset_0_1px_0_rgba(255,255,255,0.6)]'
                                : 'bg-ink/[0.06]'
                            }`}
                          />
                        </span>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section label="Where you'll train">
            <div className="glass glass-soft flex items-center gap-2.5 rounded-[1.4rem] px-4 py-3.5 text-[13.5px]">
              <MapPin size={17} className="text-accent" />
              {c.venue}
              <span className="ml-auto text-[11px] text-ink/45">or your choice</span>
            </div>
          </Section>

          <Section label={`Reviews (${c.reviewCount})`}>
            {c.reviews.length === 0 ? (
              <p className="px-1 text-[13px] text-ink/45">No written reviews yet.</p>
            ) : (
              <div className="space-y-2.5">
                {c.reviews.map((rv) => (
                  <div key={rv.author} className="glass glass-soft rounded-[1.4rem] p-4">
                    <Quote size={15} className="text-accent" />
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/85">{rv.text}</p>
                    <div className="mt-2 flex items-center justify-between text-[11.5px] text-ink/45">
                      <span>
                        {rv.author} · {rv.when}
                      </span>
                      <span className="text-amber-500">{'★'.repeat(rv.rating)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>

      <BottomCTA onClick={() => go({ name: 'book', coachId: c.id })}>Book from {money(price)} / session</BottomCTA>
    </div>
  )
}
