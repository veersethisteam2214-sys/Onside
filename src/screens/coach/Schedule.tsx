import { CalendarDays, MapPin } from 'lucide-react'
import { useStore } from '../../state/store'
import { Avatar, Badge, EmptyState, PageTitle, Section } from '../../components/core'
import { CoachTabs } from '../../components/tabs'
import { PACKAGES } from '../../lib/pricing'
import { blockById, fmtDay, money } from '../../lib/dates'
import { initialsOf } from '../../lib/db'

export default function CoachSchedule() {
  const { myCoach, bookings } = useStore()
  if (!myCoach) return null

  const sessions = bookings.filter((b) => b.coachId === myCoach.id).sort((a, b) => a.request.date.localeCompare(b.request.date))
  const gross = sessions.reduce((s, b) => s + b.quote.total, 0)
  const fees = sessions.reduce((s, b) => s + b.quote.platformFee, 0)

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-5 pt-14 pb-[120px]">
        <PageTitle title="Schedule" sub="Sessions athletes have booked with you." />

        <div className="card mt-5 overflow-hidden">
          <div className="p-4">
            <div className="text-[12px] font-medium text-slate-500">Your earnings</div>
            <div className="mt-1 text-[30px] font-semibold tracking-tight">{money(gross - fees)}</div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/70 text-[12.5px]">
            <div className="px-4 py-3">
              <div className="text-slate-400">Booked value</div>
              <div className="font-semibold">{money(gross)}</div>
            </div>
            <div className="px-4 py-3">
              <div className="text-slate-400">Onside fee (15%)</div>
              <div className="font-semibold">−{money(fees)}</div>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <Section label={`Upcoming (${sessions.length})`}>
            {sessions.length === 0 ? (
              <EmptyState icon={<CalendarDays size={22} />} title="Nothing booked yet" body="Send offers to athlete requests — accepted offers land here." />
            ) : (
              <div className="space-y-3">
                {sessions.map((b) => (
                  <div key={b.id} className="card card-hover p-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={initialsOf(b.athleteName)} hue={b.athleteName.length * 47} size={42} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] font-semibold tracking-tight">{b.athleteName}</div>
                        <div className="text-[12.5px] text-slate-500">
                          {b.request.skill} · {b.request.level}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[15px] font-semibold">{money(b.quote.coachPayout)}</div>
                        <div className="text-[11px] text-slate-400">your payout</div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1.5 text-[12.5px] text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={14} className="text-slate-400" /> {fmtDay(b.request.date)} · {blockById(b.request.block).hours}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400" /> {myCoach.venue}
                      </div>
                    </div>
                    <div className="mt-3 flex gap-1.5">
                      <Badge tone="green">Confirmed</Badge>
                      <Badge>{b.source === 'offer' ? 'From your offer' : PACKAGES[b.packageType].label}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>
      <CoachTabs active="schedule" />
    </div>
  )
}
