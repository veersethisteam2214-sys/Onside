import { Megaphone, SearchX, ShieldCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useStore } from '../../state/store'
import { findMatches } from '../../lib/matching'
import MatchCard from '../../components/MatchCard'
import MatchingScan from '../../components/MatchingScan'
import { Button, EmptyState, Field, Sheet, TopBar } from '../../components/core'
import { blockById, fmtShort } from '../../lib/dates'

export default function Matches() {
  const { request: r, go, back, coaches, postRequest, notify } = useStore()
  const matches = useMemo(() => findMatches(r, coaches), [r, coaches])
  const [scanning, setScanning] = useState(true)
  const [sheet, setSheet] = useState(false)
  const [note, setNote] = useState('')
  const [posted, setPosted] = useState(false)

  const post = () => {
    if (postRequest(note.trim())) {
      setPosted(true)
      setSheet(false)
      notify('Request posted — coaches can now send you offers')
    }
  }

  return (
    <div className="relative h-full">
      <TopBar title="Matches" />

      <AnimatePresence>{scanning && <MatchingScan sport={r.sport} coaches={matches.map((m) => m.coach)} onDone={() => setScanning(false)} />}</AnimatePresence>

      <motion.div
        className="h-full overflow-y-auto px-4 pt-[76px] sm:pt-[108px] pb-10"
        initial={false}
        animate={scanning ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.35, delay: scanning ? 0 : 0.05 }}
      >
        <div className="card px-4 py-3.5">
          <div className="text-[12px] font-medium text-slate-500">You asked for</div>
          <div className="mt-0.5 text-[16px] font-semibold tracking-tight">
            {r.skill} · {r.level}
          </div>
          <div className="text-[12.5px] text-slate-500">
            {fmtShort(r.date)} · {blockById(r.block).label.toLowerCase()} · near {r.suburb}
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<SearchX size={22} />}
              title="No verified coaches yet"
              body="Try another day or suburb — or post your request so coaches can come to you."
              action={
                <Button variant="secondary" size="sm" onClick={back}>
                  Change request
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <p className="mt-5 mb-4 px-1 text-[13px] text-slate-500">
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
          </>
        )}

        <div className="card mt-5 flex items-start gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-accent">
            <Megaphone size={18} />
          </span>
          <div className="flex-1">
            <div className="text-[14px] font-semibold">{posted ? 'Request posted' : 'Let coaches come to you'}</div>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-500">
              {posted ? 'You’ll see offers on your Home and Sessions tabs.' : 'Post this request and coaches in your area can send you an offer.'}
            </p>
            {!posted && (
              <Button variant="soft" size="sm" className="mt-3" onClick={() => setSheet(true)}>
                Post request
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 px-1 text-[12px] text-slate-500">
          <ShieldCheck size={15} className="mt-px shrink-0 text-emerald-600" />
          Only coaches with a verified Working With Children Check, first aid and accreditation appear in results.
        </div>
      </motion.div>

      <Sheet open={sheet} onClose={() => setSheet(false)} title="Post your request">
        <p className="text-[13px] text-slate-500">
          {r.skill} · {r.level} · {fmtShort(r.date)} {blockById(r.block).hours} · {r.suburb}
        </p>
        <div className="mt-4">
          <Field label="Anything a coach should know?" hint="Optional">
            <textarea className="field" rows={3} maxLength={200} placeholder="e.g. I keep fouling my take-off at comps." value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>
        <Button size="lg" full className="mt-5" onClick={post}>
          Post to coaches
        </Button>
      </Sheet>
    </div>
  )
}
