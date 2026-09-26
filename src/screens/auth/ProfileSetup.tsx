import { AlertCircle, Info, MapPin, ChevronDown } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useStore } from '../../state/store'
import { BottomCTA, Chip, Field, PageTitle, Section, Segmented, SportIcon } from '../../components/core'
import { DateWheelPicker } from '@/components/ui/date-wheel-picker'
import { SPORTS, SUBURBS, sportById } from '../../data/sports'
import { ageFrom, initialsOf } from '../../lib/db'
import { toISO, money } from '../../lib/dates'
import type { Coach, Level, SportId } from '../../types'

const LEVELS: { id: Level; label: string }[] = [
  { id: 'Beginner', label: 'Beginner' },
  { id: 'Intermediate', label: 'Inter.' },
  { id: 'Competitive', label: 'Competitive' },
  { id: 'Elite', label: 'Elite' },
]

const VENUE: Record<SportId, string> = {
  athletics: 'Athletics track',
  soccer: 'Sports field',
  tennis: 'Tennis courts',
  padel: 'Padel club',
  boxing: 'Boxing gym',
  swimming: 'Aquatic centre',
}

export default function ProfileSetup() {
  const { user, updateUser, saveCoachProfile, reset } = useStore()
  const isCoach = user?.role === 'coach'

  const [dob, setDob] = useState<Date>(() => (user?.dob ? new Date(user.dob + 'T12:00:00') : new Date(isCoach ? 1995 : 2007, 0, 1)))
  const onDob = useCallback((d: Date) => setDob(d), [])
  const age = ageFrom(toISO(dob)) ?? 0

  const [sport, setSport] = useState<SportId>('athletics')
  const [level, setLevel] = useState<Level>('Intermediate')
  const [suburb, setSuburb] = useState('Burwood')
  const [skills, setSkills] = useState<string[]>([sportById('athletics').skills[0]])
  const [rate, setRate] = useState(85)
  const [years, setYears] = useState(3)
  const [bio, setBio] = useState('')

  const pickSport = (s: SportId) => {
    setSport(s)
    setSkills([sportById(s).skills[0]])
  }
  const toggleSkill = (k: string) => setSkills((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]))

  const problem = useMemo(() => {
    if (age < 5) return 'Check your date of birth.'
    if (isCoach && age < 18) return 'Coaches must be 18 or over to join Onside.'
    if (isCoach && skills.length === 0) return 'Pick at least one skill you coach.'
    return null
  }, [age, isCoach, skills.length])

  const finish = () => {
    if (!user || problem) return
    const dobISO = toISO(dob)
    if (isCoach) {
      const coach: Coach = {
        id: `c-${user.id}`,
        userId: user.id,
        name: user.name,
        initials: initialsOf(user.name),
        sport,
        skills,
        levels: ['Beginner', 'Intermediate', 'Competitive'],
        suburb,
        venue: `${VENUE[sport]}, ${suburb}`,
        hourlyRate: rate,
        rating: 5,
        reviewCount: 0,
        sessionsRun: 0,
        yearsCoaching: years,
        bio: bio.trim() || `${sportById(sport).name} coach based in ${suburb}.`,
        // Demo: checks are auto-approved so a new coach appears in athlete results straight away.
        verifications: { wwcc: 'verified', firstAid: 'verified', accreditation: 'verified' },
        availability: { 1: ['afternoon'], 3: ['afternoon', 'evening'], 5: ['afternoon'], 6: ['morning'], 0: ['morning'] },
        reviews: [],
        hue: Math.floor(Math.random() * 360),
      }
      saveCoachProfile(coach)
      updateUser({ dob: dobISO, coachId: coach.id })
      reset({ name: 'coachDashboard' })
    } else {
      updateUser({ dob: dobISO, athlete: { sport, level, suburb } })
      reset({ name: 'athleteHome' })
    }
  }

  const fill = ((rate - 40) / (180 - 40)) * 100

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-6 pt-16 pb-[140px]">
        <PageTitle
          eyebrow={isCoach ? 'Coach profile' : 'Athlete profile'}
          title={isCoach ? 'Tell athletes about you' : 'Set up your profile'}
          sub={isCoach ? 'This is what athletes see when you’re matched.' : 'We use this to match you with the right coach.'}
        />

        <div className="mt-8 space-y-7">
          <Section label="Date of birth">
            <div className="card overflow-hidden px-2 py-3" style={{ ['--background' as string]: '#ffffff' }}>
              <DateWheelPicker value={dob} onChange={onDob} minYear={1940} maxYear={new Date().getFullYear()} size="sm" />
            </div>
            <div className="flex items-center justify-between px-1 text-[12.5px]">
              <span className="text-slate-500">
                {dob.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="font-semibold">{age} years old</span>
            </div>
            {!isCoach && age < 18 && age >= 5 && (
              <div className="flex gap-2.5 rounded-2xl bg-blue-50 p-3 text-[12.5px] leading-relaxed text-blue-800 ring-1 ring-blue-100">
                <Info size={16} className="mt-px shrink-0" />
                You’re under 18, so we’ll ask a parent or guardian to approve bookings. Every coach you see holds a verified Working With Children Check.
              </div>
            )}
            {problem && (
              <div className="flex gap-2.5 rounded-2xl bg-rose-50 p-3 text-[12.5px] text-rose-700 ring-1 ring-rose-100">
                <AlertCircle size={16} className="mt-px shrink-0" />
                {problem}
              </div>
            )}
          </Section>

          <Section label={isCoach ? 'Sport you coach' : 'Your main sport'}>
            <div className="grid grid-cols-3 gap-2">
              {SPORTS.map((s) => (
                <button key={s.id} onClick={() => pickSport(s.id)} data-on={s.id === sport} className="selectable flex flex-col items-center gap-1.5 rounded-2xl py-3">
                  <SportIcon sport={s.id} size={24} weight={s.id === sport ? 'fill' : 'regular'} />
                  <span className="text-[12px] font-medium">{s.name}</span>
                </button>
              ))}
            </div>
          </Section>

          {isCoach ? (
            <>
              <Section label="Skills you coach" action={<span className="text-[12px] text-slate-400">Pick any</span>}>
                <div className="flex flex-wrap gap-2">
                  {sportById(sport).skills.map((k) => (
                    <Chip key={k} active={skills.includes(k)} onClick={() => toggleSkill(k)}>
                      {k}
                    </Chip>
                  ))}
                </div>
              </Section>

              <Section label="Base rate per session" action={<span className="text-[15px] font-semibold">{money(rate)}</span>}>
                <div className="card px-4 pt-4 pb-3">
                  <input type="range" min={40} max={180} step={5} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="range w-full" style={{ ['--fill' as string]: `${fill}%` }} />
                  <div className="mt-2 flex justify-between text-[11.5px] text-slate-400">
                    <span>$40</span>
                    <span>Typical $50–150</span>
                    <span>$180</span>
                  </div>
                </div>
              </Section>

              <Section label="Years coaching">
                <div className="card flex items-center justify-between px-4 py-2.5">
                  <span className="text-[14px] text-slate-600">{years === 0 ? 'Less than a year' : `${years} year${years > 1 ? 's' : ''}`}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => setYears((y) => Math.max(0, y - 1))} className="btn btn-secondary h-9 w-9 rounded-xl text-[18px]">−</button>
                    <button onClick={() => setYears((y) => Math.min(40, y + 1))} className="btn btn-secondary h-9 w-9 rounded-xl text-[18px]">+</button>
                  </div>
                </div>
              </Section>

              <Field label="Short bio" hint={`${bio.length}/180`}>
                <textarea className="field" rows={3} maxLength={180} placeholder="Your background and what you focus on in sessions." value={bio} onChange={(e) => setBio(e.target.value)} />
              </Field>
            </>
          ) : (
            <Section label="Your level">
              <Segmented options={LEVELS} value={level} onChange={setLevel} layoutId="setup-level" />
            </Section>
          )}

          <Field label={isCoach ? 'Where you coach' : 'Where you train'}>
            <div className="relative">
              <MapPin size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select value={suburb} onChange={(e) => setSuburb(e.target.value)} className="field appearance-none pl-10">
                {SUBURBS.map((s) => (
                  <option key={s.name}>{s.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </Field>

          {isCoach && (
            <p className="rounded-2xl bg-white/70 p-3 text-[12px] leading-relaxed text-slate-500 ring-1 ring-slate-200/80">
              In the live product we verify your Working With Children Check, first-aid certificate and accreditation before you appear to athletes. In this prototype they’re approved automatically.
            </p>
          )}
        </div>
      </div>

      <BottomCTA onClick={finish} disabled={!!problem}>
        {isCoach ? 'Create coach profile' : 'Start finding coaches'}
      </BottomCTA>
    </div>
  )
}
