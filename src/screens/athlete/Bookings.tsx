import { CalendarPlus, Inbox, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../state/store'
import { Avatar, Badge, Button, EmptyState, PageTitle, Segmented, Stars } from '../../components/core'
import { AthleteTabs } from '../../components/tabs'
import { SEGMENTS, SLOT_LABEL } from '../../lib/pricing'
import { blockById, fmtShort, money } from '../../lib/dates'

type View = 'upcoming' | 'requests'

export default function Bookings() {
  const { user, bookings, requests, offers, coachById, respondOffer, go, notify } = useStore()
  const [view, setView] = useState<View>('upcoming')

  const mine = bookings.filter((b) => b.athleteId === user?.id).sort((a, b) => a.request.date.localeCompare(b.request.date))
  const myRequests = requests.filter((r) => r.athleteId === user?.id)

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-5 pt-14 pb-[120px]">
        <PageTitle title="Sessions" />
        <div className="mt-5">
          <Segmented
            options={[
              { id: 'upcoming', label: `Booked (${mine.length})` },
              { id: 'requests', label: `My requests (${myRequests.length})` },
            ]}
            value={view}
            onChange={setView}
            layoutId="sessions-view"
          />
        </div>

        <div className="mt-5 space-y-3">
          {view === 'upcoming' &&
            (mine.length === 0 ? (
              <EmptyState
                icon={<CalendarPlus size={22} />}
                title="No sessions yet"
                body="Find a coach for the one skill you want to fix."
                action={
                  <Button size="sm" onClick={() => go({ name: 'request' })}>
                    Find a coach
                  </Button>
                }
              />
            ) : (
              mine.map((b) => {
                const c = coachById(b.coachId)
                if (!c) return null
                return (
                  <div key={b.id} className="card card-hover p-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={c.initials} hue={c.hue} size={42} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] font-semibold tracking-tight">{b.request.skill}</div>
                        <div className="text-[12.5px] text-slate-500">with {c.name}</div>
                      </div>
                      <Badge tone="green">Confirmed</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[12.5px] text-slate-600">
                      <div className="rounded-xl bg-slate-50 px-3 py-2">
                        <div className="text-[11px] text-slate-400">Next</div>
                        {fmtShort(b.request.date)} · {blockById(b.request.block).hours}
                      </div>
                      <div className="rounded-xl bg-slate-50 px-3 py-2">
                        <div className="text-[11px] text-slate-400">Price</div>
                        {b.quote.introDiscount > 0 ? `First session · ${money(b.quote.sessionTotal)}` : `${SEGMENTS[b.quote.segment].label} · ${SLOT_LABEL[b.quote.slot].toLowerCase()}`}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11.5px] text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} /> {c.venue}
                      </span>
                      <span>
                        {b.source === 'offer' ? 'Coach offer' : 'Booked in app'} · {money(b.quote.total)} paid
                      </span>
                    </div>
                  </div>
                )
              })
            ))}

          {view === 'requests' &&
            (myRequests.length === 0 ? (
              <EmptyState
                icon={<Inbox size={22} />}
                title="No posted requests"
                body="Post a request from the Matches screen and coaches can send you offers."
              />
            ) : (
              myRequests.map((r) => {
                const rOffers = offers.filter((o) => o.requestId === r.id)
                return (
                  <div key={r.id} className="card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[15px] font-semibold tracking-tight">{r.skill}</div>
                        <div className="text-[12.5px] text-slate-500">
                          {fmtShort(r.date)} · {blockById(r.block).label.toLowerCase()} · {r.suburb}
                        </div>
                      </div>
                      <Badge tone={r.status === 'matched' ? 'green' : 'blue'}>{r.status === 'matched' ? 'Booked' : 'Open'}</Badge>
                    </div>
                    {rOffers.length === 0 ? (
                      <p className="mt-3 text-[12.5px] text-slate-400">Waiting for coaches to respond…</p>
                    ) : (
                      <div className="mt-3 space-y-2">
                        {rOffers.map((o) => {
                          const c = coachById(o.coachId)
                          if (!c) return null
                          return (
                            <div key={o.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                              <Avatar initials={c.initials} hue={c.hue} size={34} />
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-[13.5px] font-semibold">{c.name}</div>
                                <div className="text-[11.5px] text-slate-500">
                                  <Stars rating={c.rating} size={10} reviews={c.reviewCount} /> · {money(o.price)}
                                </div>
                              </div>
                              {o.status === 'pending' ? (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    if (respondOffer(o.id, true)) notify(`Booked with ${c.name}`)
                                  }}
                                >
                                  Accept
                                </Button>
                              ) : (
                                <Badge tone={o.status === 'accepted' ? 'green' : 'neutral'}>{o.status === 'accepted' ? 'Accepted' : 'Declined'}</Badge>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            ))}
        </div>
      </div>
      <AthleteTabs active="bookings" />
    </div>
  )
}
