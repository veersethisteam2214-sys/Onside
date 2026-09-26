import { ShieldCheck, SearchX } from 'lucide-react'
import { useMemo } from 'react'
import { useStore } from '../../state/store'
import { findMatches } from '../../lib/matching'
import MatchCard from '../../components/MatchCard'
import { TopBar } from '../../components/ui'
import { blockById, fmtShort } from '../../lib/dates'

export default function Matches() {
  const { request: r, go, back } = useStore()
  const matches = useMemo(() => findMatches(r), [r])

  return (
    <div className="relative h-full">
      <TopBar title="Your matches" />
      <div className="h-full overflow-y-auto px-4 pt-[76px] pb-10">
        <div className="glass glass-soft rounded-[1.5rem] px-4 py-3.5">
          <div className="text-[10.5px] font-semibold tracking-[0.16em] text-ink/45 uppercase">You asked for</div>
          <div className="mt-1 text-[16px] font-semibold tracking-tight">
            {r.skill} · {r.level}
          </div>
          <div className="text-[12.5px] text-ink/60">
            {fmtShort(r.date)} · {blockById(r.block).label.toLowerCase()} · near {r.suburb}
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="mt-16 flex flex-col items-center px-6 text-center">
            <SearchX size={40} className="text-ink/30" />
            <p className="mt-4 font-semibold">No verified coaches for that yet</p>
            <p className="mt-1 text-[13px] text-ink/55">Try another day or a nearby suburb.</p>
            <button onClick={back} className="btn-glass mt-5 rounded-full px-5 py-2.5 text-[13px] font-semibold">
              Change request
            </button>
          </div>
        ) : (
          <>
            <p className="mt-5 mb-3 px-1 text-[13px] text-ink/60">
              <span className="font-semibold text-ink">{matches.length} coaches</span> ranked by how well they fit
            </p>
            <div className="space-y-4">
              {matches.map((m, i) => (
                <MatchCard
                  key={m.coach.id}
                  match={m}
                  rank={i}
                  onOpen={() => go({ name: 'coach', coachId: m.coach.id })}
                  onBook={() => go({ name: 'book', coachId: m.coach.id })}
                />
              ))}
            </div>
            <div className="glass glass-soft mt-6 flex items-start gap-2.5 rounded-[1.3rem] px-4 py-3 text-[12px] text-emerald-800">
              <ShieldCheck size={16} className="mt-px shrink-0 text-emerald-600" />
              Only coaches with a verified Working With Children Check, first aid and accreditation appear in results.
            </div>
          </>
        )}
      </div>
    </div>
  )
}
