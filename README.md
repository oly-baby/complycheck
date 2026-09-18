# ComplyCheck

Compliance Readiness & Gap Assessment Platform — a browser-based self-assessment
tool for security, GRC, and engineering teams. Score your readiness against
major security standards and control frameworks, mark each control as
**Covered, Partial, Gap, or N/A**, and export an executive-ready Gap
Assessment Report with prioritized remediation strategies as a PDF.

## Stack

Next.js 15 (App Router, TypeScript), Tailwind CSS v4, Lucide icons, jsPDF +
jspdf-autotable for PDF export, canvas-confetti, self-hosted fonts via
`@fontsource` (Fraunces / Inter / IBM Plex Mono).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's included

- **10 frameworks**: ISO/IEC 27001:2022 (93 Annex A controls), NIST CSF 2.0
  (106 subcategories across 6 core functions), SOC 2 Trust Services Criteria
  (Type I / Type II), PCI-DSS 4.0 (with 10 SAQ types — A, A-EP, B, B-IP,
  C-VT, C, P2PE, D-Merchant, D-ServiceProvider, SPoC), GDPR, NIST SP
  800-53 Rev 5 (20 control families), HIPAA (18 Standards / 42 Implementation
  Specifications across Administrative, Physical, Technical Safeguards +
  Privacy), DORA (5 Core Pillars), NDPA (Nigeria Data Protection Act 2023),
  CIS Critical Security Controls v8 — each in `data/frameworks/`.
- **Policy checklist**: 30+ governance policies cross-referenced to the
  frameworks that require them (`data/policies.ts`).
- **Four-state control assessment**: mark each control as **Covered**,
  **Partial**, **Gap**, or **N/A** with notes and remediation strategies
  baked into every control (`remediationStrategy` field).
- **Live scoring**: `lib/scoring.ts` computes readiness %, gap %, and
  domain-level breakdowns, excluding N/A controls from the denominator.
- **Persistence**: assessments autosave to `localStorage`
  (`lib/storage.ts`) — no backend, no account, nothing leaves the browser
  unless the user explicitly emails or exports a report.
- **Export**: in-browser PDF (`lib/pdfGenerator.ts`), CSV and JSON
  (`lib/exportUtils.ts`).
- **Demo mode**: "Load sample assessment" in the navbar populates a
  realistic ISO 27001 assessment (~64% readiness / ~23% gap) for a quick
  walkthrough.

## Extending a framework's control catalog

Each file in `data/frameworks/` exports a single `Framework` object typed by
`lib/types.ts`. The catalogs here are a solid, real starting set per
standard (12–26 controls each) rather than the full control list of every
standard — add more `Control` entries to any file to deepen coverage; the
scoring engine, checklist UI, and PDF report all pick up new controls
automatically with no other changes.

## Email delivery & analytics (optional)

Copy `.env.example` to `.env.local`:

- Set `RESEND_API_KEY` to enable `/api/send-report` to actually send email
  via Resend. Without it, the endpoint logs the request and returns a
  clear "not configured" error instead of failing silently.
- Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to enable Plausible Analytics
  (`assessment_started`, `framework_selected`, `assessment_completed`,
  `pdf_downloaded`, `email_submitted`, `feedback_submitted` events are
  already instrumented in `lib/analytics.ts`).

## Deploying

Deploys to Vercel with zero configuration:

```bash
npx vercel
```

## Verification run so far

- `npx tsc --noEmit` — passes
- `npx eslint .` — passes
- `npm run build` — passes (static homepage, dynamic API routes)
- `npm run start` — verified `/`, `/api/feedback`, and `/api/send-report`
  respond correctly

Not yet done: no automated tests, and the control catalogs, while accurate
in substance, are a representative subset rather than a full audit-grade
mapping of every standard — worth a compliance SME review before this is
used for a real audit.
