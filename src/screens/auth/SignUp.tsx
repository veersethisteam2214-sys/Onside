import { Check, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useStore } from '../../state/store'
import { Button, Field, PageTitle, TopBar } from '../../components/core'
import { cn } from '@/lib/utils'

function strength(pw: string) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
const LABEL = ['Too short', 'Weak', 'Okay', 'Good', 'Strong']
const BAR = ['bg-slate-200', 'bg-rose-400', 'bg-amber-400', 'bg-blue-500', 'bg-emerald-500']

export default function SignUp() {
  const { signUp, go } = useStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const s = password.length < 8 ? 0 : strength(password)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (name.trim().length < 2) return setError('Enter your full name.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    setBusy(true)
    const err = await signUp(name, email, password)
    setBusy(false)
    if (err) setError(err)
  }

  return (
    <div className="relative h-full">
      <TopBar />
      <form onSubmit={submit} className="h-full overflow-y-auto px-6 pt-[84px] sm:pt-[116px] pb-8">
        <PageTitle title="Create your account" sub="It takes less than a minute." />

        <div className="mt-8 space-y-4">
          <Field label="Full name">
            <input className="field" autoComplete="name" placeholder="Jordan Smith" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email">
            <input className="field" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password" hint="8+ characters">
            <div className="relative">
              <input
                className="field pr-11"
                type={show ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </Field>
          {password && (
            <div className="flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={cn('h-1 flex-1 rounded-full transition-colors', i <= s ? BAR[s] : 'bg-slate-200')} />
                ))}
              </div>
              <span className="w-16 text-right text-[11.5px] text-slate-500">{LABEL[s]}</span>
            </div>
          )}

          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[13px] text-rose-700 ring-1 ring-rose-100">{error}</p>}

          <Button type="submit" size="lg" full disabled={busy}>
            {busy && <Loader2 size={17} className="animate-spin" />} Continue
          </Button>

          <ul className="space-y-1.5 pt-2 text-[12px] text-slate-500">
            {['Your password is hashed before it is saved', 'Prototype: accounts are stored in this browser only'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check size={13} className="text-emerald-500" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-center text-[13.5px] text-slate-500">
          Already have an account?{' '}
          <button type="button" onClick={() => go({ name: 'signIn' })} className="font-semibold text-accent hover:underline">
            Sign in
          </button>
        </p>
      </form>
    </div>
  )
}
