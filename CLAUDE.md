# ComplyCheck — Project Context for Claude Code

This file orients any AI coding assistant working in this repo. Read this
before making changes so you don't undo deliberate decisions.

## What this is

A browser-based compliance readiness & gap assessment tool. Users pick a
security/privacy framework, mark each control Covered/Partial/Gap/N/A,
watch a live readiness score, and export a PDF Gap Assessment Report.
Everything runs client-side; assessments persist to `localStorage`.

## Stack & why

- **Next.js 15, App Router, TypeScript, Tailwind CSS v4** — per original spec.
- **Fonts: `@fontsource/*` packages, NOT `next/font/google`.** This was a
  deliberate swap during development (network sandbox couldn't reach
  fonts.googleapis.com at build time). Self-hosted fonts are also more
  portable for CI/CD generally — keep this pattern, don't revert to
  `next/font/google` without a good reason.
- **jsPDF + jspdf-autotable** for the PDF report (`lib/pdfGenerator.ts`).
- **canvas-confetti** fires once when a framework assessment reaches 100%
  marked (see `handleStatusChange` in `app/page.tsx`).

## Architecture

- `lib/types.ts` — the type system everything else depends on. Change
  carefully; `Control`, `Framework`, `AssessmentState` ripple everywhere.
- `lib/scoring.ts` — readiness/gap % calculation. Formula:
  `readiness% = (covered*1.0 + partial*0.5) / activeControls * 100`,
  where `activeControls` excludes N/A. Domain scores use the same formula
  scoped to one domain.
- `lib/storage.ts` — localStorage read/write, key `complycheck.assessment.v1`.
  Bump the key suffix if you ever change `AssessmentState`'s shape in a
  breaking way, so old saved data doesn't crash on load.
- `data/frameworks/*.ts` — one file per standard, each exports a `Framework`
  object. Control catalogs are a **real but representative subset** (12–26
  controls per standard), not exhaustive. Adding controls is safe and
  expected — just follow the existing `Control` shape and keep `id` unique
  and prefixed per framework (e.g. `iso-8.1`, `csf-pr.aa`).
- `data/policies.ts` — governance policy catalog, cross-referenced by
  `Control.relatedPolicies` (policy `id`s) and `Policy.appliesTo`
  (framework ids).
- `data/demoData.ts` — the "Load sample assessment" data. Deliberately
  tuned to ~64% readiness / ~23% gap on ISO 27001. If you touch the ISO
  27001 control list, re-check this still lands near those numbers.
- `app/page.tsx` — the only stateful orchestrator. All modals, view
  routing, and the `AssessmentState` live here and get passed down as
  props. Child components are intentionally not doing their own data
  fetching or localStorage access.
- `app/api/send-report/route.ts` — Resend integration, degrades
  gracefully (logs + clear error) if `RESEND_API_KEY` isn't set. Don't
  make this throw/500 on missing config — that's intentional fallback
  behavior, not a bug.
- `app/api/feedback/route.ts` — same graceful-degradation pattern, just
  console.log until a real persistence layer is wired up.

## Design system (don't freelance new colors)

Defined in `app/globals.css` as CSS variables, consumed via Tailwind v4
`@theme inline`:

- `--color-navy` #0A1128 / `--color-navy-2` #0F172A — brand/dark surfaces
- `--color-emerald` #10B981 — "Covered" / primary CTA
- `--color-cyan` #06B6D4 — accents, "essential" badges
- `--color-amber` #F59E0B — "Partial"
- `--color-rose` #F43F5E — "Gap"
- `--bg`, `--bg-elevated`, `--bg-sunken`, `--text`, `--text-muted`,
  `--border`, `--border-strong` — theme-aware (light in `:root`, dark in
  `.dark`), swap automatically with the theme toggle.
- Fonts: `font-display` (Fraunces, headlines), `font-sans` (Inter, body —
  also the default), `font-mono` (IBM Plex Mono, control ref codes like
  `A.5.1` / `PR.AC-01` — this is a legitimate structural use, not
  decoration, keep it on ref codes).

If a new component needs a color, reuse these tokens rather than adding
arbitrary hex values.

## Known gaps / things NOT yet done

- No automated tests.
- Control catalogs are representative, not audit-complete — flag this to
  the user if a change implies otherwise.
- Email delivery and Plausible analytics require env vars the user
  supplies (`.env.example` has the list) — don't assume they're active.

## Verification before considering a change "done"

```bash
npx tsc --noEmit
npx eslint .
npm run build
```

All three passed clean as of the last update to this file. Keep them
clean.
