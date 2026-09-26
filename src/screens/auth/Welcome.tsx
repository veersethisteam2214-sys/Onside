import { motion } from 'motion/react'
import { CreditCard, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../state/store'
import { Button, Logo, SportIcon } from '../../components/core'
import { SPORTS } from '../../data/sports'
import { DEMO_ATHLETE_EMAIL, DEMO_COACH_EMAIL, DEMO_PASSWORD } from '../../lib/db'

const TRUST = [
  { icon: ShieldCheck, text: 'Every coach WWCC & first-aid verified' },
  { icon: Sparkles, text: 'Matched on skill, time and location' },
  { icon: CreditCard, text: 'Secure in-app payments' },
]

export default function Welcome() {
  const { go, signIn } = useStore()
  const [busy, setBusy] = useState<string | null>(null)

  const demo = async (email: string) => {
    setBusy(email)
    await signIn(email, DEMO_PASSWORD)
    setBusy(null)
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 pt-16 pb-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-2.5">
          <Logo size={40} />
          <span className="text-[19px] font-semibold tracking-tight">Onside</span>
        </div>

        <h1 className="mt-10 text-[36px] font-semibold leading-[1.08] tracking-[-0.035em]">
          The right coach,
          <br />
          <span className="text-accent">for the exact skill.</span>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-slate-500">
          One-to-one sessions with vetted coaches — at a time and place that works for you.
        </p>
      </motion.div>

      <motion.div
        className="mt-8 grid grid-cols-6 gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {SPORTS.map((s, i) => (
          <motion.div
            key={s.id}
            title={s.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.05 }}
            className="card flex aspect-square items-center justify-center text-slate-700 transition hover:-translate-y-0.5 hover:text-accent"
          >
            <SportIcon sport={s.id} size={22} weight="duotone" />
          </motion.div>
        ))}
      </motion.div>

      <motion.ul className="mt-7 space-y-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        {TRUST.map(({ icon: I, text }) => (
          <li key={text} className="flex items-center gap-2.5 text-[13.5px] text-slate-600">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-accent ring-1 ring-slate-200/80">
              <I size={15} />
            </span>
            {text}
          </li>
        ))}
      </motion.ul>

      <motion.div
        className="mt-auto space-y-2.5 pt-10"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Button size="lg" full onClick={() => go({ name: 'signUp' })}>
          Create account
        </Button>
        <Button size="lg" variant="secondary" full onClick={() => go({ name: 'signIn' })}>
          Sign in
        </Button>

        <div className="pt-4">
          <p className="text-center text-[12px] text-slate-400">Explore the prototype with a demo account</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button variant="soft" size="sm" disabled={!!busy} onClick={() => demo(DEMO_ATHLETE_EMAIL)}>
              {busy === DEMO_ATHLETE_EMAIL ? 'Signing in…' : 'Demo athlete'}
            </Button>
            <Button variant="soft" size="sm" disabled={!!busy} onClick={() => demo(DEMO_COACH_EMAIL)}>
              {busy === DEMO_COACH_EMAIL ? 'Signing in…' : 'Demo coach'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
