import { Inbox } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../state/store'
import { EmptyState, PageTitle, Segmented } from '../../components/core'
import { CoachTabs } from '../../components/tabs'
import RequestCard from './RequestCard'
import OfferSheet from './OfferSheet'
import { sportById } from '../../data/sports'
import { km } from '../../lib/matching'
import type { OpenRequest } from '../../types'

type Filter = 'mine' | 'all'

export default function CoachRequests() {
  const { myCoach, requests, offers, sendOffer, notify } = useStore()
  const [filter, setFilter] = useState<Filter>('mine')
  const [target, setTarget] = useState<OpenRequest | null>(null)
  if (!myCoach) return null

  const offerFor = (id: string) => offers.find((o) => o.coachId === myCoach.id && o.requestId === id)
  const list = requests
    .filter((r) => (filter === 'mine' ? r.sport === myCoach.sport : true))
    .filter((r) => r.status === 'open' || offerFor(r.id))
    .sort((a, b) => km(myCoach.suburb, a.suburb) - km(myCoach.suburb, b.suburb))

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-5 pt-14 pb-[120px]">
        <PageTitle title="Athlete requests" sub="Athletes who posted what they want to work on. Nearest first." />
        <div className="mt-5">
          <Segmented
            options={[
              { id: 'mine', label: sportById(myCoach.sport).name },
              { id: 'all', label: 'All sports' },
            ]}
            value={filter}
            onChange={setFilter}
            layoutId="req-filter"
          />
        </div>

        <div className="mt-5 space-y-3">
          {list.length === 0 ? (
            <EmptyState icon={<Inbox size={22} />} title="No open requests" body="Check back soon — athletes post new requests every day." />
          ) : (
            list.map((r, i) => <RequestCard key={r.id} r={r} coach={myCoach} offer={offerFor(r.id)} index={i} onOffer={() => setTarget(r)} />)
          )}
        </div>
      </div>

      <OfferSheet
        r={target}
        onClose={() => setTarget(null)}
        onSend={(message) => {
          if (!target) return
          sendOffer(target.id, message)
          notify(`Offer sent to ${target.athleteName.split(' ')[0]}`)
          setTarget(null)
        }}
      />
      <CoachTabs active="requests" />
    </div>
  )
}
