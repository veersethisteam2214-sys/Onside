import { LogOut, RotateCcw, ShieldCheck } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useStore } from '../state/store'
import { Avatar, Badge, Button, PageTitle, Sheet, SportIcon } from '../components/core'
import { AthleteTabs, CoachTabs } from '../components/tabs'
import { sportById } from '../data/sports'
import { ageFrom, initialsOf } from '../lib/db'
import { money } from '../lib/dates'
import { COACH_PAY, SEGMENTS } from '../lib/pricing'

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-[13.5px]">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  )
}

export default function Account() {
  const { user, myCoach, signOut, resetDemo } = useStore()
  const [confirm, setConfirm] = useState(false)
  if (!user) return null
  const isCoach = user.role === 'coach'
  const sport = isCoach ? myCoach?.sport : user.athlete?.sport

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-5 pt-14 pb-[120px]">
        <PageTitle title="Account" />

        <div className="card mt-5 flex items-center gap-4 p-4">
          <Avatar initials={initialsOf(user.name)} hue={myCoach?.hue ?? 210} size={56} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[17px] font-semibold tracking-tight">{user.name}</div>
            <div className="truncate text-[13px] text-slate-500">{user.email}</div>
          </div>
          <Badge tone="blue">{isCoach ? 'Coach' : 'Athlete'}</Badge>
        </div>

        <div className="card mt-4 divide-y divide-slate-100">
          <Row label="Age" value={`${ageFrom(user.dob) ?? '—'}`} />
          {sport && (
            <Row
              label="Sport"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <SportIcon sport={sport} size={15} /> {sportById(sport).name}
                </span>
              }
            />
          )}
          {isCoach && myCoach ? (
            <>
              <Row label="Pay per session" value={`${money(COACH_PAY)} + peak bonus`} />
              <Row label="Coaching area" value={myCoach.suburb} />
              <Row
                label="Verification"
                value={
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <ShieldCheck size={14} /> Approved
                  </span>
                }
              />
            </>
          ) : (
            <>
              <Row label="Level" value={user.athlete?.level ?? '—'} />
              <Row label="Home suburb" value={user.athlete?.suburb ?? '—'} />
              <Row label="Price" value={user.athlete?.student ? `Student · ${money(SEGMENTS.concession.price)}` : `Standard · ${money(SEGMENTS.standard.price)}`} />
              <Row label="Onside Premium" value={user.premium ? 'Member' : 'Not a member'} />
            </>
          )}
        </div>

        <div className="mt-6 space-y-2.5">
          <Button variant="secondary" size="lg" full onClick={signOut}>
            <LogOut size={17} /> Sign out
          </Button>
          <Button variant="ghost" size="lg" full className="text-rose-600 hover:text-rose-700" onClick={() => setConfirm(true)}>
            <RotateCcw size={16} /> Reset demo data
          </Button>
        </div>

        <p className="mt-6 text-center text-[11.5px] leading-relaxed text-slate-400">
          Onside prototype for MAE214. Accounts and bookings are stored in this browser only — no server, no real payments.
        </p>
      </div>

      <Sheet open={confirm} onClose={() => setConfirm(false)} title="Reset demo data?">
        <p className="text-[13.5px] leading-relaxed text-slate-500">
          This deletes every account, request, offer and booking created in this browser and restores the demo accounts. You’ll be signed out.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="secondary" size="lg" onClick={() => setConfirm(false)}>
            Cancel
          </Button>
          <Button size="lg" className="!bg-rose-600 ![background-image:none]" onClick={resetDemo}>
            Reset
          </Button>
        </div>
      </Sheet>

      {isCoach ? <CoachTabs active="account" /> : <AthleteTabs active="account" />}
    </div>
  )
}
