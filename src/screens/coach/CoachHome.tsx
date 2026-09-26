import { useStore } from '../../state/store'
import { Logo } from '../../components/ui'

/** Placeholder until phase P4 (coach dashboard, availability, requests, earnings). */
export default function CoachHome() {
  const { reset } = useStore()
  return (
    <div className="h-full flex flex-col items-center justify-center px-8 text-center">
      <div className="glass flex flex-col items-center rounded-[2rem] px-7 py-9">
        <Logo size={52} />
        <p className="mt-6 text-[11px] font-semibold tracking-[0.2em] text-accent">COACH VIEW</p>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight">Coach dashboard</h1>
        <p className="mt-3 text-[13px] leading-relaxed text-ink/65">
          Requests, availability and earnings arrive in the next build phase.
        </p>
        <button onClick={() => reset({ name: 'role' })} className="btn-glass mt-7 rounded-full px-6 py-3 text-[13.5px] font-semibold">
          Back to start
        </button>
      </div>
    </div>
  )
}
