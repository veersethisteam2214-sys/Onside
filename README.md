# Onside — prototype

A clickable prototype of **Onside**, a marketplace that matches athletes in individual sports
with vetted coaches for a single session or a package, at a time and place that suits them.

Built for MAE214 Business Strategy in the Digital Economy, Assignment 3.

> **This is a demo, not a product.** Seed data only. No real accounts, no real payments,
> and no real personal information — especially not of anyone under 18.

## Run it

```bash
npm install
npm run dev
```

Then open the URL that Vite prints. The app is designed mobile-first and shows inside a phone
frame on desktop.

## Build

```bash
npm run build
npm run preview
```

## Stack

Vite · React · TypeScript · Tailwind CSS v4. No backend — state lives in React and
`localStorage`, and the demo data sits in `src/data`.

## Where things live

| Path | What's in it |
|---|---|
| `src/screens/` | Athlete, coach and admin screens |
| `src/components/` | Shared UI (phone frame, coach card, price breakdown) |
| `src/lib/pricing.ts` | Tiers, packages, peak loading, platform take rate |
| `src/lib/matching.ts` | The coach match score |
| `src/data/` | Seed coaches, sports, athletes, reviews |

## Plan

The full build plan — screens, data model, pricing engine, phases — is in [PLAN.md](PLAN.md).

## AI use

AI assistance was used for scaffolding, component code and seed data, and is acknowledged in
the assignment submission.
