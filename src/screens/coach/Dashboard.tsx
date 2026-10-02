import { ArrowRight, BadgeCheck, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../state/store'
import { Avatar, Button, EmptyState, Section, StatCard, Stars, Wordmark } from '../../components/core'
import { AnimatedMoney } from '../../components/AnimatedCounter'
import { CoachTabs } from '../../components/tabs'
import RequestCard from './RequestCard'
import OfferSheet from './OfferSheet'
import { sportById } from '../../data/sports'
import { blockById, fmtShort } from '../../lib/dates'
import { initialsOf } from '../../lib/db'
import type { OpenRequest } from '../../types'
import { Inbox } from 'lucide-react'

export default function CoachDashboard() {
  const { user, myCoach, requests, offers, bookings, sendOffer, go, notify } = useStore()
  const [target, setTarget] = useState<OpenRequest | null>(null)
  if (!myCoach) return null

  const myOffers = offers.filter((o) => o.coachId === myCoach.id)
  const offerFor = (id: string) => myOffers.find((o) => o.requestId === id)
  const fresh = requests.filter((r) => r.status === 'open' && r.sport === myCoach.sport && !offerFor(r.id))
  const sessions = bookings.filter((b) => b.coachId === myCoach.id).sort((a, b) => a.request.date.localeCompare(b.request.date))
  const earnings = sessions.reduce((s, b) => s + b.quote.coachPayout, 0)
  const pending = myOffers.filter((o) => o.status === 'pending').length

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-5 pt-14 pb-[120px]">
        <Wordmark height={22} className="mb-4" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium text-slate-500">Coach dashboard</p>
            <h1 className="text-[26px] font-semibold tracking-[-0.025em]">Hi, {user?.name.split(' ')[0]}</h1>
          </div>
          <button onClick={() => go({ name: 'account' })} className="rounded-full transition hover:scale-105 active:scale-95">
            <Avatar initials={initialsOf(myCoach.name)} hue={myCoach.hue} size={42} />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100">
          <BadgeCheck size={20} className="shrink-0 text-emerald-600" />
          <div className="text-[12.5px] leading-snug text-emerald-900">
            <span className="font-semibold">Verified & visible to athletes.</span> WWCC, first aid and accreditation approved.
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <StatCard label="Earnings" value={<AnimatedMoney value={earnings} />} sub="after platform fee" />
          <StatCard label="Booked sessions" value={sessions.length} sub={sessions[0] ? `next ${fmtShort(sessions[0].request.date)}` : 'none yet'} />
          <StatCard label="New requests" value={fresh.length} sub={`${sportById(myCoach.sport).name.toLowerCase()} near you`} />
          <StatCard
            label="Rating"
            value={myCoach.reviewCount ? <Stars rating={myCoach.rating} size={16} /> : 'New'}
            sub={pending ? `${pending} offer${pending > 1 ? 's' : ''} awaiting reply` : `${myCoach.reviewCount} reviews`}
          />
        </div>

        <div className="mt-7 space-y-7">
          <Section
            label="Athletes looking for a coach"
            action={
              <button onClick={() => go({ name: 'coachRequests' })} className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-accent hover:underline">
                View all <ArrowRight size={13} />
              </button>
            }
          >
            {fresh.length === 0 ? (
              <EmptyState icon={<Inbox size={22} />} title="You’re all caught up" body="New requests in your sport will appear here." />
            ) : (
              <div className="space-y-3">
                {fresh.slice(0, 2).map((r, i) => (
                  <RequestCard key={r.id} r={r} coach={myCoach} index={i} onOffer={() => setTarget(r)} />
                ))}
              </div>
            )}
          </Section>

          <Section label="Upcoming sessions">
            {sessions.length === 0 ? (
              <p className="text-[13px] text-slate-400">No sessions booked yet — send offers to get started.</p>
            ) : (
              <div className="card divide-y divide-slate-100 overflow-hidden">
                {sessions.slice(0, 3).map((b) => (
                  <button key={b.id} onClick={() => go({ name: 'coachSchedule' })} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50">
                    <Avatar initials={initialsOf(b.athleteName)} hue={b.athleteName.length * 47} size={38} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-semibold">{b.athleteName}</div>
                      <div className="text-[12px] text-slate-500">
                        {b.request.skill} · {fmtShort(b.request.date)} {blockById(b.request.block).hours}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                ))}
              </div>
            )}
          </Section>

          <Button variant="secondary" full onClick={() => go({ name: 'coach', coachId: myCoach.id })}>
            Preview my public profile
          </Button>
        </div>
      </div>

      <OfferSheet
        r={target}
        coach={myCoach}
        onClose={() => setTarget(null)}
        onSend={(price, message) => {
          if (!target) return
          sendOffer(target.id, price, message)
          notify(`Offer sent to ${target.athleteName.split(' ')[0]}`)
          setTarget(null)
        }}
      />
      <CoachTabs active="dashboard" />
    </div>
  )
}
