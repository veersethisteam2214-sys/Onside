import { CalendarDays, Home, Inbox, LayoutDashboard, Search, UserRound } from 'lucide-react'
import { TabBar, type TabDef } from './core'
import { useStore } from '../state/store'

export function AthleteTabs({ active }: { active: 'home' | 'search' | 'bookings' | 'account' }) {
  const { user, offers } = useStore()
  const pending = offers.filter((o) => o.athleteId === user?.id && o.status === 'pending').length
  const tabs: TabDef[] = [
    { id: 'home', label: 'Home', icon: (p) => <Home {...p} />, screen: { name: 'athleteHome' } },
    { id: 'search', label: 'Find', icon: (p) => <Search {...p} />, screen: { name: 'request' } },
    { id: 'bookings', label: 'Sessions', icon: (p) => <CalendarDays {...p} />, screen: { name: 'bookings' }, badge: pending },
    { id: 'account', label: 'Account', icon: (p) => <UserRound {...p} />, screen: { name: 'account' } },
  ]
  return <TabBar tabs={tabs} active={active} />
}

export function CoachTabs({ active }: { active: 'dashboard' | 'requests' | 'schedule' | 'account' }) {
  const { requests, offers, myCoach } = useStore()
  const offered = new Set(offers.filter((o) => o.coachId === myCoach?.id).map((o) => o.requestId))
  const fresh = requests.filter((r) => r.status === 'open' && r.sport === myCoach?.sport && !offered.has(r.id)).length
  const tabs: TabDef[] = [
    { id: 'dashboard', label: 'Dashboard', icon: (p) => <LayoutDashboard {...p} />, screen: { name: 'coachDashboard' } },
    { id: 'requests', label: 'Requests', icon: (p) => <Inbox {...p} />, screen: { name: 'coachRequests' }, badge: fresh },
    { id: 'schedule', label: 'Schedule', icon: (p) => <CalendarDays {...p} />, screen: { name: 'coachSchedule' } },
    { id: 'account', label: 'Account', icon: (p) => <UserRound {...p} />, screen: { name: 'account' } },
  ]
  return <TabBar tabs={tabs} active={active} />
}
