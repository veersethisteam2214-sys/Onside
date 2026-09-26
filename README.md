# Onside — prototype

A working prototype of **Onside**, a two-sided marketplace that matches athletes in individual
sports with vetted coaches for a single session or a package, at a time and place that suits them.

Built for MAE214 Business Strategy in the Digital Economy, Assignment 3.

> **This is a demo, not a product.** There is no server. Accounts, requests, offers and bookings
> are stored in your browser's localStorage, and no real payments are taken. Don't enter real
> personal information — especially not anyone under 18.

## Try it

**Live:** https://onside-xi.vercel.app

**Demo accounts** (password `demo1234` for both), or use the one-tap buttons on the welcome screen:

| Role | Email |
|---|---|
| Athlete | `athlete@onside.app` |
| Coach | `coach@onside.app` |

You can also create your own account — sign-up works, with passwords hashed (SHA-256) before
they're stored.

### A two-minute demo of both sides

1. Sign in as the **demo athlete** → *Find a coach* → *Find coaches* → *Post request*.
2. Sign out, sign in as the **demo coach** → *Requests* → *Send offer* to Alex.
3. Sign out, sign in as the athlete again → accept the offer on Home.
4. The session now appears in the athlete's *Sessions* and the coach's *Schedule* and earnings.

Tip: open the athlete and coach in two tabs of the same browser — changes sync live between them.
*Account → Reset demo data* restores the starting state.

## Run locally

```bash
npm install
npm run dev
```

## What's in it

**Onboarding:** welcome, sign in, sign up, role choice (athlete or coach), profile setup with a
date-of-birth wheel. Athletes under 18 see a guardian-consent notice; coaches must be 18+.

**Athlete:** home (offers, next session, browse by sport, top coaches), search, ranked matches,
coach profile, package and tier picker, checkout, sessions and posted requests.

**Coach:** dashboard (earnings, sessions, new requests), athlete request feed with offers,
schedule with payouts after the platform fee.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · motion · lucide-react · Phosphor icons.
shadcn-style `@/` alias, `cn()` helper and `src/components/ui/` for drop-in components.

| Path | What's in it |
|---|---|
| `src/screens/auth`, `athlete`, `coach` | Screens for each part of the app |
| `src/components/core.tsx` | Buttons, cards, tab bar, sheet, badges, sport icons |
| `src/components/ui/date-wheel-picker.tsx` | Date-of-birth wheel (21st.dev component) |
| `src/state/store.tsx` | Navigation, auth and marketplace actions |
| `src/lib/db.ts` | The localStorage "database", demo seed data and password hashing |
| `src/lib/pricing.ts` | Tiers, packages, peak loading, 15% platform take rate |
| `src/lib/matching.ts` | The coach match score |

The full build plan is in [PLAN.md](PLAN.md).

## AI use

AI assistance was used for scaffolding, component code and seed data, and is acknowledged in
the assignment submission.
