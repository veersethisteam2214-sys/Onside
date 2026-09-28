import { motion } from 'motion/react'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Avatar, SportBadge } from './core'
import type { Coach, SportId } from '../types'

const STEPS = ['Scanning nearby coaches', 'Checking vetting & availability', 'Ranking your best fit']

/**
 * Full-screen radar sweep played once between "Find coaches" and the results list — turns a
 * blocking fetch into the thing the product actually claims to do: search, verify, rank.
 */
export default function MatchingScan({ sport, coaches, onDone }: { sport: SportId; coaches: Coach[]; onDone: () => void }) {
  const [step, setStep] = useState(0)
  const found = coaches.slice(0, 5)

  useEffect(() => {
    const t1 = window.setTimeout(() => setStep(1), 550)
    const t2 = window.setTimeout(() => setStep(2), 1150)
    const t3 = window.setTimeout(onDone, 1850)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [onDone])

  // Blips placed on a circle around the hub — each "arrives" once the sweep has passed its angle.
  const angles = found.map((_, i) => (360 / found.length) * i - 90)

  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#f6f8fb]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <div className="relative h-[220px] w-[220px]">
        {/* concentric pulse rings */}
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-accent/40"
            initial={{ scale: 0.35, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: i * 0.7 }}
          />
        ))}

        {/* faint static rings for depth */}
        <span className="absolute inset-[14%] rounded-full border border-slate-200" />
        <span className="absolute inset-[32%] rounded-full border border-slate-200" />

        {/* rotating radar sweep wedge */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, rgba(10,102,255,0.28) 0deg, transparent 70deg)',
            maskImage: 'radial-gradient(circle, transparent 0%, black 100%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 0%, black 100%)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
        />

        {/* coach blips */}
        {found.map((c, i) => {
          const rad = (angles[i] * Math.PI) / 180
          const r = 92
          const x = Math.cos(rad) * r
          const y = Math.sin(rad) * r
          return (
            <motion.div
              key={c.id}
              className="absolute left-1/2 top-1/2"
              style={{ marginLeft: -14, marginTop: -14 }}
              initial={{ opacity: 0, scale: 0.4, x, y }}
              animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.4, x, y }}
              transition={{ duration: 0.4, delay: i * 0.09, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Avatar initials={c.initials} hue={c.hue} size={28} className="shadow-[0_4px_12px_-4px_rgba(16,40,90,0.35)] ring-2 ring-white" />
            </motion.div>
          )
        })}

        {/* hub */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background: 'linear-gradient(160deg, #2a7dff 0%, #0a66ff 45%, #0648c4 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 10px 24px -10px rgba(10,102,255,0.7)',
            }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {step < 2 ? <Sparkles size={24} className="text-white" /> : <ShieldCheck size={24} className="text-white" />}
          </motion.div>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-2">
        <SportBadge sport={sport} size={22} active />
        <motion.p key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[14px] font-medium text-slate-600">
          {STEPS[step]}…
        </motion.p>
      </div>

      <div className="mt-4 flex gap-1.5">
        {STEPS.map((_, i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i <= step ? 'bg-accent' : 'bg-slate-200'}`} />
        ))}
      </div>
    </motion.div>
  )
}
