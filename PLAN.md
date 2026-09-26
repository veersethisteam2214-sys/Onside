# Onside — Prototype App Build Plan

A plan for a clickable prototype of the Onside marketplace, to show CJ and to screenshot for the
MAE214 A3 business proposal. **This is a plan only — nothing is built yet.**

---

## 1. What the prototype has to prove

It is a demo, not a product. It succeeds if someone can pick it up and, in two minutes, see:

1. **The matching works.** An athlete asks for one sport, one skill, one time, one place — and gets
   a shortlist of coaches who actually fit. This is the thing directories don't do.
2. **The economics are visible.** The three price tiers, the session packages, the peak-time
   pricing and the platform's cut should all be on screen, not hidden in a spreadsheet.
3. **Trust is built in.** Vetting badges (WWCC, first aid, accreditation), ratings and in-app
   payment — the reasons an athlete books through us rather than a DM.
4. **Both sides exist.** A coach view as well as an athlete view, because Onside is a two-sided
   platform and that is the Week 10 theory the report leans on.

**Non-goal:** a real, secure, production app. No real money, no real personal data, no real
children's information. Everything is seeded demo data.

---

## 2. Scope

### In
- Athlete flow: request → match → coach profile → book → pay (simulated) → confirmation → rate
- Coach flow: profile, availability, incoming requests, accept/decline, earnings
- A visible pricing engine: tiers, packages, peak multiplier, platform take rate
- An admin vetting screen showing coach verification status
- Seed data: ~12 coaches, 6 sports, Melbourne suburbs, sample bookings and reviews

### Out (say so in the demo, don't build it)
- Real authentication, real payments, real maps, messaging, push notifications
- A real database or server — seed data in files is enough
- Native iOS/Android — build a mobile-shaped web app instead

---

## 3. Tech stack

**Recommended: Vite + React + TypeScript + Tailwind CSS, client-side only, deployed to Vercel.**

| Choice | Why |
|---|---|
| Vite + React + TS | Fastest setup, huge amount of AI training data, no server to manage |
| Tailwind | Styling without writing CSS files; keeps the navy/orange brand consistent |
| No backend | State lives in React + `localStorage`. A prototype does not need a database. |
| Vercel | Free, gives a public URL you can open on a phone in the meeting |
| Mobile-first layout | Design at 390px wide, then show it inside a phone frame on desktop |

**Optional later (only if there is time after the report is done):** Supabase for a real database
and login, and Stripe **test mode** for a realistic checkout. Neither is needed for the demo.

---

## 4. Screens

### Athlete
| # | Screen | Key contents |
|---|---|---|
| A1 | Splash / role picker | "I'm an athlete" / "I'm a coach" — lets you demo both sides |
| A2 | Request a session | Sport, skill, level, date & time, suburb, budget |
| A3 | Matches | Ranked coach cards: photo, rating, price, distance, match score, badges |
| A4 | Coach profile | Bio, sports & skills, accreditation badges, reviews, availability |
| A5 | Choose a package | Single / 5-pack / 10-pack, with the per-session price falling |
| A6 | Checkout | Price breakdown: base, peak loading, tier discount, total. Simulated payment. |
| A7 | Confirmation | Time, place, coach, what to bring |
| A8 | My bookings | Upcoming and past sessions, package sessions remaining |
| A9 | Rate your session | Stars plus a skill-progress note |

### Coach
| # | Screen | Key contents |
|---|---|---|
| C1 | Coach dashboard | Upcoming sessions, this week's earnings, rating |
| C2 | Availability | Weekly grid of available slots |
| C3 | Requests | Incoming athlete requests, accept or decline |
| C4 | Earnings | Session fee, platform fee (take rate), net payout |

### Admin (one screen, for the vetting story)
| # | Screen | Key contents |
|---|---|---|
| D1 | Coach verification | WWCC, first aid, accreditation: verified / pending / expired |

---

## 5. Data model

Plain TypeScript types with seeded JSON. No database needed.

```
Sport        id, name, skills[]
Coach        id, name, sports[], skills[], suburb, lat, lng, hourlyRate,
             rating, reviewCount, bio, verifications{wwcc, firstAid, accreditation},
             availability[] (weekday + time blocks)
Athlete      id, name, age, suburb, sport, level, tier ('concession'|'standard'|'premium')
Request      id, athleteId, sport, skill, level, preferredDate, timeBlock, suburb, maxPrice
Match        requestId, coachId, score, breakdown{skill, distance, availability, rating, price}
Booking      id, athleteId, coachId, requestId, datetime, venue, packageType,
             pricing{base, peakMultiplier, tierRate, total, platformFee, coachPayout},
             status
Package      type ('single'|'five'|'ten'), sessions, unitPrice, saving
Review       id, bookingId, rating, comment, skillProgressNote
```

---

## 6. The matching algorithm

Keep it simple, transparent and explainable — the report needs to describe it, and the score
breakdown on screen is what makes the demo land.

```
score = 0.35 × skillMatch        // does the coach actually coach this skill?
      + 0.25 × availabilityFit   // is the coach free in the requested block?
      + 0.20 × proximity         // suburb distance, decaying with km
      + 0.10 × rating            // normalised 0–1
      + 0.10 × priceFit          // closeness to the athlete's stated budget
```

Show the top 3–5 coaches with a visible **"92% match"** badge and a one-line reason
("Coaches long jump · free Saturday morning · 4km away"). That single UI detail is the whole
product thesis on one screen.

---

## 7. The pricing engine

Put this in one file, `src/lib/pricing.ts`, so the report can describe it precisely and the
numbers on screen always agree with the numbers in the financials.

```
basePrice        = coach.hourlyRate
peakMultiplier   = 1.15 on weekends and weekday 4–7pm, else 1.00
tierRate         = concession 0.6 | standard 1.0 | premium 1.5   (verification gated)
packageDiscount  = single 1.00 | 5-pack 0.92 | 10-pack 0.85
sessionPrice     = basePrice × peakMultiplier × tierRate × packageDiscount
platformFee      = sessionPrice × takeRate        (takeRate = 0.15)
coachPayout      = sessionPrice − platformFee
```

Each line is a piece of class theory made visible:

| Feature on screen | Theory it demonstrates |
|---|---|
| Three price tiers, concession needs verification | Third-degree price discrimination, with arbitrage blocked |
| Single / 5-pack / 10-pack with falling unit price | Second-degree price discrimination and product line design |
| Peak loading on weekends and after school | Dynamic pricing with perishable inventory |
| Platform fee shown on the coach's earnings screen | Two-sided platform price structure — which side pays |
| "Book in-app for insurance, refunds and package credit" | Holdup mitigation: keeping bookings on-platform |
| Match score improving with booking history | Data as an asset, and an isolating mechanism |

**Put these numbers in the report's financials too.** Take rate, peak multiplier and package
discounts should be identical in both places.

---

## 8. Repo structure

```
onside-prototype/
├─ README.md                  what it is, how to run it, that it is a demo
├─ package.json
├─ index.html
├─ tailwind.config.js
├─ public/
│  └─ coaches/                placeholder coach images
└─ src/
   ├─ main.tsx
   ├─ App.tsx                 routing + role switcher
   ├─ lib/
   │  ├─ pricing.ts           the pricing engine (section 7)
   │  ├─ matching.ts          the match score (section 6)
   │  └─ storage.ts           localStorage helpers
   ├─ data/
   │  ├─ sports.json
   │  ├─ coaches.json
   │  ├─ athletes.json
   │  └─ reviews.json
   ├─ types/index.ts
   ├─ components/             CoachCard, PriceBreakdown, BadgeRow, PhoneFrame…
   └─ screens/
      ├─ athlete/             Request, Matches, CoachProfile, Packages, Checkout…
      ├─ coach/               Dashboard, Availability, Requests, Earnings
      └─ admin/               Verification
```

---

## 9. Build phases

Sized for a 2–3 day build with AI assistance. **The 4,000-word report is worth 35 marks and the
prototype is worth none of them directly — do not let this eat the report.**

| Phase | What gets done | Rough time |
|---|---|---|
| **P0** | Create repo, scaffold Vite + React + TS + Tailwind, brand colours, phone frame, deploy an empty app to Vercel so the pipeline works | 1–2 hrs |
| **P1** | Types + seed data: 12 coaches, 6 sports, suburbs, reviews | 2 hrs |
| **P2** | Athlete flow screens A1–A4 with real matching | half day |
| **P3** | Pricing engine + packages + checkout (A5–A7) | half day |
| **P4** | Coach side C1–C4 and admin D1 | half day |
| **P5** | Reviews, my-bookings, polish, empty states, screenshots for the report | half day |
| **P6** *(optional)* | Supabase and Stripe test mode | only if the report is finished |

---

## 10. Seed data to prepare

Realistic data makes the demo credible, and the brief penalises invented claims.

- **6 sports:** athletics (Jordan's), soccer (Taha's), tennis, padel, boxing, swimming
- **Skills per sport:** e.g. athletics → long jump, sprint starts, hurdles technique
- **12 coaches** across Melbourne suburbs, rates $50–150/hr — **use real advertised rates you can
  cite**, since the A2 feedback penalised numbers taken from class material rather than researched
- **Verification states:** mostly verified, one pending, one expired — it makes the vetting real
- **Reviews** written like real athletes wrote them, not marketing copy

---

## 11. Demo script for the meeting (2 minutes)

1. "I'm 16, I do long jump, my take-off is the problem, and I'm free Saturday morning in Burwood."
2. Submit → three coaches, top one at 94% match, with the reason shown.
3. Open the profile — WWCC and first aid verified, 4.8 stars, coaches long jump specifically.
4. Choose a 5-pack — watch the per-session price drop.
5. Checkout — show the price breakdown, including the peak loading for Saturday.
6. Switch to the coach view — same booking, showing the platform fee and the coach's payout.
7. Close on the admin screen: "no coach appears in results until vetting is verified."

---

## 12. What to screenshot for the report

| Report section | Screenshot |
|---|---|
| Product/service description | The request screen and the match results |
| Pricing and positioning | The price breakdown and the package comparison |
| Production / vertical boundaries | The coach earnings screen, showing the platform's cut |
| Competitive advantage | The match score with its reason line |
| Company story | The whole athlete flow as one figure |

The brief says to use figures wherever possible, so these earn marks in the completeness criterion.

---

## 13. Risks

| Risk | Handling |
|---|---|
| The build eats the report time | Hard stop after P5. The report is the marked deliverable. |
| Scope creep into a real app | No auth, no database, no real payments. Repeat it in the README. |
| Screens look generic | Use the Onside navy/orange brand from the pitch deck throughout. |
| Fake data looks fake | Use real advertised coach rates and real Melbourne suburbs. |
| Children's data | Seed data only. Never put a real person's details in the repo. |

---

## 14. Academic integrity

The brief encourages AI use but requires you to acknowledge it. Keep a short note of what AI did
(scaffolding, component code, seed data) for the report's AI acknowledgement section.

---

## 15. Next step

Create the GitHub repo (suggested name: **`onside-prototype`**), then share the repo URL or clone it
locally and point me at the folder. First commit should be P0: the scaffold, the brand colours and a
working deploy.
