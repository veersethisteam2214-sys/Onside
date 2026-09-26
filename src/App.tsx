import { motion } from 'motion/react'
import PhoneFrame from './components/PhoneFrame'
import { StoreProvider, useStore, type Screen } from './state/store'
import RolePicker from './screens/RolePicker'
import Request from './screens/athlete/Request'
import Matches from './screens/athlete/Matches'
import CoachProfile from './screens/athlete/CoachProfile'
import Book from './screens/athlete/Book'
import Checkout from './screens/athlete/Checkout'
import Confirmed from './screens/athlete/Confirmed'
import Bookings from './screens/athlete/Bookings'
import CoachHome from './screens/coach/CoachHome'

function render(s: Screen) {
  switch (s.name) {
    case 'role':
      return <RolePicker />
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
    case 'coachHome':
      return <CoachHome />
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
      initial={{ x: direction * 40 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
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
      </PhoneFrame>
    </StoreProvider>
  )
}
