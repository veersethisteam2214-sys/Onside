import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useStore } from '../../state/store'
import { Button, Field, PageTitle, TopBar } from '../../components/core'
import { DEMO_ATHLETE_EMAIL, DEMO_COACH_EMAIL, DEMO_PASSWORD } from '../../lib/db'

export function AppleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.37 12.62c-.02-2.1 1.72-3.12 1.8-3.17-.98-1.43-2.5-1.63-3.04-1.65-1.29-.13-2.52.76-3.17.76-.66 0-1.66-.74-2.73-.72-1.4.02-2.7.82-3.42 2.08-1.46 2.53-.37 6.28 1.05 8.33.7 1 1.52 2.13 2.6 2.09 1.05-.04 1.44-.67 2.7-.67 1.26 0 1.62.67 2.72.65 1.13-.02 1.84-1.02 2.52-2.03.8-1.16 1.13-2.29 1.14-2.35-.02-.01-2.19-.84-2.17-3.32zM14.29 6.46c.58-.7.97-1.67.86-2.64-.83.03-1.84.55-2.44 1.25-.53.62-1 1.61-.88 2.56.93.07 1.88-.47 2.46-1.17z" />
    </svg>
  )
}

export function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h5.9a5.05 5.05 0 0 1-2.2 3.3v2.74h3.55c2.08-1.92 3.25-4.74 3.25-8.07z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.75c-.99.66-2.25 1.06-3.73 1.06-2.87 0-5.3-1.94-6.16-4.54H2.17v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.17a11 11 0 0 0 0 9.9l3.67-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.17 7.05l3.67 2.84C6.7 7.3 9.13 5.38 12 5.38z" />
    </svg>
  )
}

export default function SignIn() {
  const { signIn, go, notify } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e?: FormEvent) => {
    e?.preventDefault()
    setError(null)
    if (!email || !password) return setError('Enter your email and password.')
    setBusy(true)
    const err = await signIn(email, password)
    setBusy(false)
    if (err) setError(err)
  }

  const social = () => notify('Social sign-in is off in the prototype — use email instead')

  return (
    <div className="relative h-full">
      <TopBar />
      <form onSubmit={submit} className="h-full overflow-y-auto px-6 pt-[84px] sm:pt-[116px] pb-8">
        <PageTitle title="Welcome back" sub="Sign in to continue to Onside." />

        <div className="mt-8 space-y-4">
          <Field label="Email">
            <input className="field" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input
                className="field pr-11"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </Field>

          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[13px] text-rose-700 ring-1 ring-rose-100">{error}</p>}

          <Button type="submit" size="lg" full disabled={busy}>
            {busy && <Loader2 size={17} className="animate-spin" />} Sign in
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3 text-[12px] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="space-y-2.5">
          <Button type="button" variant="dark" size="lg" full onClick={social}>
            <AppleMark /> Continue with Apple
          </Button>
          <Button type="button" variant="secondary" size="lg" full onClick={social}>
            <GoogleMark /> Continue with Google
          </Button>
        </div>

        <div className="mt-6 rounded-2xl bg-white/70 p-3.5 ring-1 ring-slate-200/80">
          <p className="text-[12px] font-medium text-slate-500">Demo accounts · password {DEMO_PASSWORD}</p>
          <div className="mt-2 flex gap-2">
            {[
              ['Athlete', DEMO_ATHLETE_EMAIL],
              ['Coach', DEMO_COACH_EMAIL],
            ].map(([label, addr]) => (
              <button
                key={addr}
                type="button"
                onClick={() => {
                  setEmail(addr)
                  setPassword(DEMO_PASSWORD)
                  setError(null)
                }}
                className="selectable flex-1 rounded-xl px-3 py-2 text-left"
              >
                <div className="text-[12.5px] font-semibold">{label}</div>
                <div className="truncate text-[11px] text-slate-400">{addr}</div>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-[13.5px] text-slate-500">
          New to Onside?{' '}
          <button type="button" onClick={() => go({ name: 'signUp' })} className="font-semibold text-accent hover:underline">
            Create an account
          </button>
        </p>
      </form>
    </div>
  )
}
