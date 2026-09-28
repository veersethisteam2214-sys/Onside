import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'

/**
 * Spring-driven count-up — ports the "Animated Counter" pattern from 21st.dev (HextaUI) onto
 * this app's own money formatter, so a stat's value rolls in instead of just appearing.
 */
export function AnimatedCounter({
  value,
  format = (n) => Math.round(n).toLocaleString('en-AU'),
  className,
}: {
  value: number
  format?: (n: number) => string
  className?: string
}) {
  const raw = useMotionValue(0)
  const spring = useSpring(raw, { stiffness: 120, damping: 22, mass: 0.7 })
  const display = useTransform(spring, (v) => format(v))

  useEffect(() => {
    raw.set(value)
  }, [value, raw])

  return <motion.span className={className}>{display}</motion.span>
}

export function AnimatedMoney({ value, className }: { value: number; className?: string }) {
  return <AnimatedCounter value={value} format={(n) => `$${Math.round(n).toLocaleString('en-AU')}`} className={className} />
}
