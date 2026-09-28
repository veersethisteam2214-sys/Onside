import { BadgeCheck, MapPin, Quote } from 'lucide-react'
import { useStore } from '../../state/store'
import { sportById } from '../../data/sports'
import { Avatar, BottomCTA, Section, SportIcon, Stars, TopBar, VerifiedBadges, toneOf } from '../../components/core'
import { BLOCKS, money } from '../../lib/dates'
import { listPrice } from '../../lib/pricing'
import { cn } from '@/lib/utils'

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const DAY_INDEX = [1, 2, 3, 4, 5, 6, 0]

export default function CoachProfile({ coachId }: { coachId: string }) {
  const { request: r, go, coachById } = useStore()
  const c = coachById(coachId)
  if (!c) return null
  const price = listPrice(c.hourlyRate, r.date, r.block)
  const sport = sportById(c.sport)
  const tone = toneOf(c.hue)

  return (
    <div className="relative h-full">
      <TopBar />
      <div className="h-full overflow-y-auto px-5 pt-[76px] sm:pt-[108px] pb-[120px]">
        <div className="card overflow-hidden">
          <div
            className="relative h-24 overflow-hidden"
            style={{ background: `linear-gradient(160deg, ${tone.bg} 0%, #ffffff 115%)` }}
          >
            <SportIcon
              sport={c.sport}
              size={96}
              weight="duotone"
              className="pointer-events-none absolute -right-4 -top-5 opacity-[0.14]"
            />
          </div>

          <div className="relative px-5 pb-5 pt-[38px] text-center">
            <Avatar
              initials={c.initials}
              hue={c.hue}
              size={76}
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 ring-4 ring-white"
            />
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="truncate text-[21px] font-semibold tracking-[-0.02em]">{c.name}</h1>
              <BadgeCheck size={18} className="shrink-0 text-accent" />
            </div>
            <div className="mt-0.5 flex items-center justify-center gap-1.5 text-[13px] text-slate-500">
              <SportIcon sport={c.sport} size={15} /> {sport.name} coach · {c.suburb}
            </div>
            <div className="mt-1 flex items-center justify-center text-[13px] text-slate-500">
              {c.reviewCount > 0 ? (
                <>
                  <Stars rating={c.rating} /> ({c.reviewCount} reviews)
                </>
              ) : (
                <span className="font-medium text-accent">New on Onside</span>
              )}
            </div>

            <div className="mt-4 flex justify-center">
              <VerifiedBadges v={c.verifications} />
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl bg-slate-50 py-3 text-center">
              {[
                [String(c.sessionsRun), 'sessions'],
                [`${c.yearsCoaching} yrs`, 'coaching'],
                [money(c.hourlyRate), 'base rate'],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="text-[16px] font-semibold tracking-tight">{v}</div>
                  <div className="text-[11px] text-slate-400">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 space-y-7">
          <Section label="About">
            <p className="text-[14px] leading-relaxed text-slate-600">{c.bio}</p>
          </Section>

          <Section label="Skills coached">
            <div className="flex flex-wrap gap-2">
              {c.skills.map((s) => (
                <span
                  key={s}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-[12.5px] font-medium ring-1',
                    s === r.skill ? 'bg-blue-50 text-blue-700 ring-blue-200' : 'bg-white text-slate-600 ring-slate-200',
                  )}
                >
                  {s}
                  {s === r.skill && ' · your pick'}
                </span>
              ))}
            </div>
            <div className="text-[12px] text-slate-400">Levels: {c.levels.join(', ')}</div>
          </Section>

          <Section label="Weekly availability">
            <div className="card p-3.5">
              <div className="grid grid-cols-[84px_repeat(7,1fr)] gap-y-2.5 text-center text-[11px]">
                <span />
                {DAYS.map((d, i) => (
                  <span key={i} className="font-medium text-slate-400">
                    {d}
                  </span>
                ))}
                {BLOCKS.map((b) => (
                  <div key={b.id} className="contents">
                    <span className="text-left text-slate-500">{b.label}</span>
                    {DAY_INDEX.map((di) => (
                      <span key={di} className="flex justify-center">
                        <span className={cn('h-5 w-5 rounded-md', c.availability[di]?.includes(b.id) ? 'bg-accent' : 'bg-slate-100')} />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section label="Where you’ll train">
            <div className="card flex items-center gap-2.5 px-4 py-3.5 text-[13.5px]">
              <MapPin size={16} className="text-slate-400" />
              {c.venue}
              <span className="ml-auto text-[11.5px] text-slate-400">or a place you choose</span>
            </div>
          </Section>

          <Section label="Reviews">
            {c.reviews.length === 0 ? (
              <p className="text-[13px] text-slate-400">No reviews yet.</p>
            ) : (
              <div className="space-y-2.5">
                {c.reviews.map((rv) => (
                  <div key={rv.author} className="card p-4">
                    <Quote size={15} className="text-slate-300" />
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-700">{rv.text}</p>
                    <div className="mt-2 flex items-center justify-between text-[11.5px] text-slate-400">
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

      <BottomCTA onClick={() => go({ name: 'book', coachId: c.id })}>Book · from {money(price)} per session</BottomCTA>
    </div>
  )
}
