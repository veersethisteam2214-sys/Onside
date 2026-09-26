import { CalendarDays, CalendarPlus } from 'lucide-react'
import { useStore } from '../../state/store'
import { coachById } from '../../data/coaches'
import { AthleteTabBar, Avatar } from '../../components/ui'
import { PACKAGES, TIERS } from '../../lib/pricing'
import { blockById, fmtShort, money } from '../../lib/dates'

export default function Bookings() {
  const { bookings, reset } = useStore()

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-5 pt-10 pb-[110px]">
        <h1 className="text-[30px] font-bold tracking-[-0.03em]">My bookings</h1>
        <p className="mt-1 text-[13.5px] text-ink/60">Upcoming sessions and package credit</p>

        {bookings.length === 0 ? (
          <div className="mt-20 flex flex-col items-center px-6 text-center">
            <div className="glass flex h-16 w-16 items-center justify-center rounded-full">
              <CalendarPlus size={28} className="text-ink/70" />
            </div>
            <p className="mt-5 font-semibold">No sessions yet</p>
            <p className="mt-1 text-[13px] text-ink/55">Find a coach for the one skill you want to fix.</p>
            <button onClick={() => reset({ name: 'request' })} className="btn-liquid text-white mt-6 rounded-full px-6 py-3 text-[13.5px] font-semibold">
              <span className="relative z-10">Find a coach</span>
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {bookings.map((b) => {
              const c = coachById(b.coachId)
              const left = b.quote.sessions - b.sessionsUsed
              const pct = (left / b.quote.sessions) * 100
              return (
                <div key={b.id} className="glass rounded-[1.6rem] p-4">
                  <div className="flex items-center gap-3">
                    <Avatar initials={c.initials} hue={c.hue} size={42} />
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold tracking-tight">{b.request.skill}</div>
                      <div className="text-[12px] text-ink/55">with {c.name}</div>
                    </div>
                    <span className="ml-auto rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/25">
                      Confirmed
                    </span>
                  </div>
                  <div className="mt-3.5 flex items-center gap-1.5 text-[12.5px] text-ink/75">
                    <CalendarDays size={14} className="text-accent" />
                    Next: {fmtShort(b.request.date)} · {blockById(b.request.block).hours}
                  </div>
                  <div className="mt-3.5">
                    <div className="flex justify-between text-[11.5px] text-ink/55">
                      <span>
                        {PACKAGES[b.packageType].label} · {TIERS[b.tier].label}
                      </span>
                      <span className="font-semibold text-ink">
                        {left} of {b.quote.sessions} left
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-ink/10">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[#8cc2ff] to-[#2f7bff] shadow-[0_0_12px_rgba(47,123,255,0.7)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-[11.5px] text-ink/45">Paid {money(b.quote.total)} in-app</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <AthleteTabBar active="bookings" />
    </div>
  )
}
