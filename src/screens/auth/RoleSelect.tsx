import { Check } from 'lucide-react'
import { ClipboardText, PersonSimpleRun } from '@phosphor-icons/react'
import { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../../state/store'
import { BottomCTA, PageTitle } from '../../components/core'
import type { Role } from '../../types'
import { cn } from '@/lib/utils'

const OPTIONS: { id: Role; title: string; body: string; icon: typeof PersonSimpleRun; points: string[] }[] = [
  {
    id: 'athlete',
    title: "I'm an athlete",
    body: 'Find a vetted coach for the one skill you want to improve.',
    icon: PersonSimpleRun,
    points: ['Matched on skill, time & place', 'Book single sessions or packages'],
  },
  {
    id: 'coach',
    title: "I'm a coach",
    body: 'Get matched with athletes near you and fill your calendar.',
    icon: ClipboardText,
    points: ['See athletes looking for coaching', 'Get paid in-app after every session'],
  },
]

export default function RoleSelect() {
  const { user, updateUser, go, signOut } = useStore()
  const [role, setRole] = useState<Role | null>(user?.role ?? null)

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-6 pt-16 pb-[130px]">
        <PageTitle eyebrow={`Welcome, ${user?.name.split(' ')[0] ?? ''}`} title="How will you use Onside?" sub="You can’t switch later in the prototype, so pick the side you want to demo." />

        <div className="mt-8 space-y-3">
          {OPTIONS.map((o, i) => {
            const on = role === o.id
            const I = o.icon
            return (
              <motion.button
                key={o.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.08 }}
                onClick={() => setRole(o.id)}
                data-on={on}
                className="selectable relative w-full rounded-[22px] p-5 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl transition-colors', on ? 'bg-accent text-white' : 'bg-slate-100 text-slate-600')}>
                    <I size={26} weight="duotone" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[16.5px] font-semibold tracking-tight text-ink">{o.title}</div>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-slate-500">{o.body}</p>
                    <ul className="mt-3 space-y-1">
                      {o.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-[12.5px] text-slate-600">
                          <Check size={13} className="text-accent" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className={cn('flex h-5 w-5 items-center justify-center rounded-full transition', on ? 'bg-accent' : 'ring-2 ring-slate-300')}>
                    {on && <Check size={12} strokeWidth={3} className="text-white" />}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>

        <button onClick={signOut} className="mt-6 w-full text-center text-[13px] text-slate-400 transition hover:text-slate-600">
          Not you? Sign out
        </button>
      </div>

      <BottomCTA
        disabled={!role}
        onClick={() => {
          if (!role) return
          updateUser({ role })
          go({ name: 'profileSetup' })
        }}
      >
        Continue
      </BottomCTA>
    </div>
  )
}
