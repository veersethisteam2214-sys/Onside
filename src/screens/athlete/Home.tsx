import { ArrowRight, CalendarDays, ChevronRight, MapPin, Search } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { useStore } from '../../state/store'
import { Avatar, Button, Section, SportIcon, Stars } from '../../components/core'
import { AthleteTabs } from '../../components/tabs'
import { SPORTS, sportById } from '../../data/sports'
import { blockById, fmtShort, money } from '../../lib/dates'
import { initialsOf } from '../../lib/db'

let seededFor: string | null = null

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function AthleteHome() {
  const { user, request, setRequest, go, coaches, coachById, offers, requests, bookings, respondOffer, notify } = useStore()
  const profile = user?.athlete

  // Start the search from the athlete's own sport, level and suburb (once per sign-in).
  useEffect(() => {
    if (user && profile && seededFor !== user.id) {
      seededFor = user.id
      setRequest({ sport: profile.sport, skill: sportById(profile.sport).skills[0], level: profile.level, suburb: profile.suburb })
    }
  }, [user, profile, setRequest])

  const myOffers = offers.filter((o) => o.athleteId === user?.id && o.status === 'pending')
  const next = bookings
    .filter((b) => b.athleteId === user?.id)
    .sort((a, b) => a.request.date.localeCompare(b.request.date))[0]
  const featured = coaches
    .filter((c) => c.sport === (profile?.sport ?? request.sport) && c.verifications.wwcc === 'verified' && c.verifications.firstAid === 'verified')
    .sort((a, b) => (b.reviewCount ? b.rating : 0) - (a.reviewCount ? a.rating : 0))
    .slice(0, 3)

  const accept = (offerId: string, coachName: string) => {
    const b = respondOffer(offerId, true)
    if (b) notify(`Booked with ${coachName}`)
  }

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-5 pt-14 pb-[120px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium text-slate-500">{greeting()}</p>
            <h1 className="text-[26px] font-semibold tracking-[-0.025em]">{user?.name.split(' ')[0]}</h1>
          </div>
          <button onClick={() => go({ name: 'account' })} className="rounded-full transition hover:scale-105 active:scale-95">
            <Avatar initials={initialsOf(user?.name ?? '')} hue={210} size={42} />
          </button>
        </div>

        {/* search entry */}
        <button onClick={() => go({ name: 'request' })} className="card card-hover mt-5 flex w-full items-center gap-3 p-4 text-left">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-white shadow-[0_8px_18px_-8px_rgba(10,102,255,0.8)]">
            <Search size={20} />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-semibold tracking-tight">Find a coach</span>
            <span className="block text-[12.5px] text-slate-500">
              {sportById(request.sport).name} · {request.skill} · near {request.suburb}
            </span>
          </span>
          <ArrowRight size={18} className="text-slate-400" />
        </button>

        <div className="mt-7 space-y-7">
          {myOffers.length > 0 && (
            <Section label={`Offers from coaches (${myOffers.length})`}>
              <div className="space-y-2.5">
                {myOffers.map((o) => {
                  const c = coachById(o.coachId)
                  const r = requests.find((x) => x.id === o.requestId)
                  if (!c || !r) return null
                  return (
                    <motion.div key={o.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-4 ring-1 ring-accent/20">
                      <div className="flex items-center gap-3">
                        <Avatar initials={c.initials} hue={c.hue} size={42} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[14.5px] font-semibold">{c.name}</div>
                          <div className="text-[12px] text-slate-500">
                            <Stars rating={c.rating} size={11} reviews={c.reviewCount} /> · {r.skill} · {fmtShort(r.date)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[17px] font-semibold">{money(o.price)}</div>
                          <div className="text-[11px] text-slate-400">session</div>
                        </div>
                      </div>
                      {o.message && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-[13px] leading-relaxed text-slate-600">“{o.message}”</p>}
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Button variant="secondary" size="sm" onClick={() => respondOffer(o.id, false)}>
                          Decline
                        </Button>
                        <Button size="sm" onClick={() => accept(o.id, c.name)}>
                          Accept & book
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </Section>
          )}

          {next && (() => {
            const c = coachById(next.coachId)
            return (
              <Section label="Next session">
                <button onClick={() => go({ name: 'bookings' })} className="card card-hover w-full overflow-hidden text-left">
                  <div className="flex items-center gap-3 p-4">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <span className="text-[10px] font-medium uppercase tracking-wide text-slate-300">
                        {new Date(next.request.date + 'T12:00:00').toLocaleDateString('en-AU', { month: 'short' })}
                      </span>
                      <span className="text-[17px] font-semibold leading-none">{new Date(next.request.date + 'T12:00:00').getDate()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-semibold tracking-tight">{next.request.skill}</div>
                      <div className="text-[12.5px] text-slate-500">
                        with {c?.name} · {blockById(next.request.block).hours}
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </div>
                  <div className="flex items-center gap-1.5 border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-[12px] text-slate-500">
                    <MapPin size={13} /> {c?.venue}
                  </div>
                </button>
              </Section>
            )
          })()}

          <Section label="Browse by sport">
            <div className="grid grid-cols-3 gap-2">
              {SPORTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setRequest({ sport: s.id, skill: s.skills[0] })
                    go({ name: 'request' })
                  }}
                  className="card card-hover group flex flex-col items-center gap-2 py-4"
                >
                  <SportIcon sport={s.id} size={26} weight="duotone" className="text-slate-600 transition group-hover:text-accent" />
                  <span className="text-[12.5px] font-medium text-slate-700">{s.name}</span>
                </button>
              ))}
            </div>
          </Section>

          {featured.length > 0 && (
            <Section label={`Top ${sportById(profile?.sport ?? request.sport).name.toLowerCase()} coaches`}>
              <div className="card divide-y divide-slate-100 overflow-hidden">
                {featured.map((c) => (
                  <button key={c.id} onClick={() => go({ name: 'coach', coachId: c.id })} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50">
                    <Avatar initials={c.initials} hue={c.hue} size={40} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14.5px] font-semibold">{c.name}</div>
                      <div className="text-[12px] text-slate-500">
                        <Stars rating={c.rating} size={11} reviews={c.reviewCount} /> · {c.suburb}
                      </div>
                    </div>
                    <span className="text-[13px] font-semibold">{money(c.hourlyRate)}</span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                ))}
              </div>
            </Section>
          )}

          {!next && myOffers.length === 0 && (
            <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-slate-200/80">
              <CalendarDays size={18} className="shrink-0 text-accent" />
              <p className="text-[12.5px] leading-relaxed text-slate-600">
                No sessions yet. Search for a coach, or post a request and let coaches send you offers.
              </p>
            </div>
          )}
        </div>
      </div>
      <AthleteTabs active="home" />
    </div>
  )
}
