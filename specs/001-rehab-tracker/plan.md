# Implementation Plan: Jaanu Setu – ACL Rehab Tracker

**Branch**: `001-rehab-tracker` | **Date**: 2026-10-01 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-rehab-tracker/spec.md`

## Summary

A single-user, offline-first, mobile-first PWA that turns the ACL rehab PDF into a daily tracker. All programme content (cards, sessions, food, MRI, checkpoints) is typed static data transcribed from the PDF. A pure, unit-tested "plan engine" derives Today's plan from weekday, yoga flag, knee check and walk target. User data (day entries, settings) lives in browser storage behind a small storage layer, with JSON export/import.

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20+ for tooling

**Primary Dependencies**: React 18, Vite, Tailwind CSS, React Router, vite-plugin-pwa (Workbox), idb-keyval (IndexedDB wrapper)

**Storage**: IndexedDB (via idb-keyval) for day entries and settings; static content bundled in code; export/import as JSON file

**Testing**: Vitest + React Testing Library; Playwright smoke test for offline reload (optional)

**Target Platform**: Modern mobile browsers (iOS Safari 16+, Chrome Android), installable PWA; desktop browsers secondary

**Project Type**: Static web application (no backend)

**Performance Goals**: First load under 2 s on mid-range phone over 4G; interactions under 100 ms; whole app shell under ~300 KB gzipped excluding illustrations

**Constraints**: Fully offline after first load; no accounts, no network calls at runtime; data on device only; WCAG AA contrast; light/dark theme

**Scale/Scope**: 1 user; ~9 screens (Today, Cards, Card detail, Progress, Counters, Safety, MRI/Checkpoints, Food, Settings/Backup); ~35 exercise cards; 7-day food rotation

## Constitution Check

The constitution at `.specify/memory/constitution.md` is still the unfilled template, so there are no ratified gates. Working principles applied for this plan (to be ratified via `/speckit-constitution` if desired): safety-first content fidelity to the source PDF, offline/local-only privacy, simplicity (no backend, no unnecessary libraries), pure testable logic for plan rules.

**Gate result**: PASS (no violations). Re-checked after Phase 1 design: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/001-rehab-tracker/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── plan-engine.md
│   └── backup-file.schema.json
└── tasks.md             # created by /speckit-tasks
```

### Source Code (repository root)

```text
index.html
vite.config.ts
tailwind.config.ts
package.json
public/
├── icons/                      # PWA icons
└── illustrations/              # SVG exercise illustrations
src/
├── main.tsx
├── App.tsx                     # routes + shell + safety banner
├── content/                    # typed static data from the PDF
│   ├── cards.ts                # M1-M6, L1-L5, E1-E11, B1-B8, band basics
│   ├── sessions.ts             # session templates (morning, lunch, evening A/B/Sun/yoga, desk)
│   ├── adjustments.ts          # knee-check outcomes -> plan rules
│   ├── mri.ts
│   ├── checkpoints.ts
│   ├── safety.ts
│   └── food.ts                 # plate guide, pattern, 7-day rotation, protein
├── domain/                     # pure logic, no React
│   ├── planEngine.ts           # buildTodayPlan()
│   ├── walkTarget.ts
│   ├── streaks.ts
│   ├── adherence.ts
│   ├── checkpoints.ts
│   └── protein.ts
├── storage/
│   ├── db.ts                   # IndexedDB access
│   ├── repository.ts           # day entries, settings
│   └── backup.ts               # export/import + validation
├── hooks/                      # useToday, useDayEntry, useSettings
├── components/                 # SessionList, CardView, KneeCheck, Counter, Timer, WarningBanner...
├── pages/                      # Today, Cards, CardDetail, Progress, Safety, Mri, Food, Settings
└── styles/
tests/
├── unit/                       # planEngine, walkTarget, streaks, adherence, protein, backup, content-integrity
├── component/                  # KneeCheck, Counter, Today
└── e2e/                        # offline reload smoke (optional)
```

**Structure Decision**: Single static front-end project. Content, pure domain logic, storage, and UI are separated so the safety-critical plan rules are testable without a browser and content can be audited against the PDF.

## Complexity Tracking

No violations to justify.
