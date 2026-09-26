import { motion } from 'motion/react'
import PhoneFrame from './components/PhoneFrame'
import { Toast } from './components/core'
import { StoreProvider, useStore, type Screen } from './state/store'
import Welcome from './screens/auth/Welcome'
import SignIn from './screens/auth/SignIn'
import SignUp from './screens/auth/SignUp'
import RoleSelect from './screens/auth/RoleSelect'
import ProfileSetup from './screens/auth/ProfileSetup'
import AthleteHome from './screens/athlete/Home'
import Request from './screens/athlete/Request'
import Matches from './screens/athlete/Matches'
import CoachProfile from './screens/athlete/CoachProfile'
import Book from './screens/athlete/Book'
import Checkout from './screens/athlete/Checkout'
import Confirmed from './screens/athlete/Confirmed'
import Bookings from './screens/athlete/Bookings'
import CoachDashboard from './screens/coach/Dashboard'
import CoachRequests from './screens/coach/Requests'
import CoachSchedule from './screens/coach/Schedule'
import Account from './screens/Account'

function render(s: Screen) {
  switch (s.name) {
    case 'welcome':
      return <Welcome />
    case 'signIn':
      return <SignIn />
    case 'signUp':
      return <SignUp />
    case 'roleSelect':
      return <RoleSelect />
    case 'profileSetup':
      return <ProfileSetup />
    case 'athleteHome':
      return <AthleteHome />
    case 'request':
      return <Request />
    case 'matches':
      return <Matches />
    case 'coach':
      return <CoachProfile coachId={s.coachId} />
    case 'book':
      return <Book coachId={s.coachId} />
    case 'checkout':
      return <Checkout coachId={s.coachId} />
    case 'confirmed':
      return <Confirmed bookingId={s.bookingId} />
    case 'bookings':
      return <Bookings />
    case 'coachDashboard':
      return <CoachDashboard />
    case 'coachRequests':
      return <CoachRequests />
    case 'coachSchedule':
      return <CoachSchedule />
    case 'account':
      return <Account />
  }
}

const keyOf = (s: Screen) => ('coachId' in s ? `${s.name}:${s.coachId}` : 'bookingId' in s ? `${s.name}:${s.bookingId}` : s.name)

/**
 * Enter-only transition: the previous screen unmounts immediately, so nothing depends on an
 * exit animation finishing (throttled animation frames can't leave stale screens behind).
 */
function Screens() {
  const { screen, direction } = useStore()
  return (
    <motion.div
      key={keyOf(screen)}
      initial={{ x: direction * 28, opacity: 0.4 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
      className="absolute inset-0"
    >
      {render(screen)}
    </motion.div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <PhoneFrame>
        <Screens />
        <Toast />
      </PhoneFrame>
    </StoreProvider>
  )
}
