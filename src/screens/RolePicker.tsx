import { motion } from 'motion/react'
import { useStore } from '../state/store'
import { Logo, LiquidButton } from '../components/ui'
import { SPORTS } from '../data/sports'

export default function RolePicker() {
  const { reset } = useStore()

  return (
    <div className="relative h-full overflow-hidden flex flex-col px-7 pt-16 pb-8">
      {/* pitch-line arcs, echoing the title slide */}
      <svg className="pointer-events-none absolute -right-44 top-6 opacity-[0.16]" width="540" height="540" viewBox="0 0 540 540" fill="none">
        {[90, 150, 210, 262].map((r) => (
          <circle key={r} cx="270" cy="270" r={r} stroke="#2f7bff" strokeWidth="1.2" />
        ))}
      </svg>
      <motion.div
        className="pointer-events-none absolute h-3 w-3 rounded-full bg-accent shadow-[0_0_0_7px_rgba(47,123,255,0.18),0_0_24px_rgba(47,123,255,0.7)]"
        style={{ right: 104, top: 128 }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <Logo size={58} />
        <h1 className="mt-9 text-[56px] font-bold leading-none tracking-[-0.04em]">Onside</h1>
        <p className="mt-4 text-[11px] font-semibold tracking-[0.24em] text-accent">COACHING ON YOUR SIDE</p>
        <p className="mt-5 max-w-[290px] text-[15px] leading-relaxed text-ink/75">
          Find a vetted coach for the exact skill you want to work on — at a time and place that suits you.
        </p>
      </motion.div>

      <motion.div className="mt-8 flex flex-wrap gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        {SPORTS.map((s) => (
          <span key={s.id} className="glass glass-soft rounded-full px-3 py-1.5 text-[12px] text-ink/85">
            {s.emoji} {s.name}
          </span>
        ))}
      </motion.div>

      <motion.div
        className="mt-auto"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <div className="glass liquid space-y-2 rounded-[2.2rem] p-2">
          <LiquidButton onClick={() => reset({ name: 'request' })}>I'm an athlete</LiquidButton>
          <button onClick={() => reset({ name: 'coachHome' })} className="btn-glass w-full rounded-full py-4 text-[15px] font-semibold text-ink">
            I'm a coach
          </button>
        </div>
        <p className="pt-4 text-center text-[11px] text-ink/45">Prototype · demo data only · no real payments</p>
      </motion.div>
    </div>
  )
}
