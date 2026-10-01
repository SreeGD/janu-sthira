---

description: "Task list for Jānu Setu – ACL Rehab Tracker"
---

# Tasks: Jānu Setu – ACL Rehab Tracker

**Input**: Design documents from `/specs/001-rehab-tracker/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included for the safety-critical pure logic (plan engine, walk target, streaks, backup, content integrity) and key components, per plan.md and quickstart.md.

**Source of truth for content**: the ACL rehab booklet the programme content is based on (25 pages). Transcribe verbatim; do not paraphrase safety text.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependencies)
- **[Story]**: US1–US8 from spec.md

## Phase 1: Setup

- [X] T001 Scaffold Vite + React + TypeScript project in repo root (`package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `src/main.tsx`)
- [X] T002 Install and configure Tailwind CSS with CSS-variable light/dark theme in `tailwind.config.ts` and `src/styles/index.css`
- [X] T003 [P] Configure Vitest + React Testing Library + jsdom in `vite.config.ts` and `tests/setup.ts`
- [X] T004 [P] Configure vite-plugin-pwa (Workbox precache, manifest "Jānu Setu", icons) in `vite.config.ts` and `public/icons/`
- [X] T005 [P] Add ESLint + Prettier configs and `npm run lint`, `npm test`, `npm run build` scripts in `package.json`
- [X] T006 [P] Add React Router and app shell with bottom nav (Today, Cards, Progress, Food, More) in `src/App.tsx`

---

## Phase 2: Foundational (blocks all stories)

- [X] T007 Define content and user-data TypeScript types per data-model.md in `src/content/types.ts` (ExerciseCard, SessionTemplate, ScheduleItem, KneeCheckRule, Checkpoint, Meal, MriFinding, Settings, DayEntry; `walkTarget` within [15, 40]; `kneeCheck` one of 'better'|'puffier'|'swollen'|'gaveWay')
- [X] T008 [P] Implement local-date helpers (`todayLocal`, `weekdayOf`, `addDays`, `weeksSince`) using `YYYY-MM-DD` local strings in `src/domain/dates.ts`
- [X] T009 [P] Unit tests for date helpers incl. midnight rollover and week calc in `tests/unit/dates.test.ts`
- [X] T010 Implement IndexedDB access via idb-keyval in `src/storage/db.ts` and repository (`getDay`, `saveDay`, `listDays`, `getSettings`, `saveSettings`, defaults: startDate=today, walkTarget=15) in `src/storage/repository.ts`; request `navigator.storage.persist()`; wrap all calls in try/catch with in-memory fallback
- [X] T011 [P] Repository tests using fake-indexeddb in `tests/unit/repository.test.ts`
- [X] T012 Implement hooks `useSettings`, `useDayEntry(date)`, `useToday()` (re-evaluates date on visibilitychange and midnight timer) in `src/hooks/`
- [X] T013 [P] Shared UI components: `Page`, `Card`, `Checkbox`, `Chip`, `WarningBanner` in `src/components/`
- [X] T014 Persistent not-medical-advice footer and always-visible Safety shortcut button in `src/App.tsx` (FR-012, SC-005)

**Checkpoint**: shell runs offline, storage works.

---

## Phase 3: User Story 1 – Today's schedule and tick-off (P1) MVP

**Goal**: Today view with correct sessions per weekday, yoga swap, persistent ticks.

**Independent Test**: Mock date to Mon/Tue/Sun; verify evening items; tick, reload, ticks persist.

- [X] T015 [P] [US1] Transcribe Morning (M1–M6), Before-lunch (L1–L5) schedule rows and desk mini-sessions (mid-morning heel prop #1, after lunch heel prop #2, mid-afternoon quad sets + ankle pumps/B7, bedtime quad sets + heel prop #3/E11) in `src/content/sessions.ts` with minutes, amount, card codes and tags (walk, bike, chair-pose, step-up, standing)
- [X] T016 [P] [US1] Transcribe Evening session variants (common 0–20 min, Day A band circuit B1–B6 + B8, Day B E3–E9, legs up wall E10, Sunday lighter plan, yoga placeholder entry "40-minute yoga sequence, see separate Yoga PDF") in `src/content/sessions.ts`
- [X] T017 [US1] Implement `buildTodayPlan` base behaviour (weekday → A/B/Sunday, yoga swap, no knee check → full plan + banner) per contracts/plan-engine.md in `src/domain/planEngine.ts`
- [X] T018 [P] [US1] Table-driven tests for weekday mapping, Sunday, yoga swap in `tests/unit/planEngine.test.ts`
- [X] T019 [P] [US1] `SessionList` and `ScheduleItemRow` components (tick, card code chip, amount, status styling) in `src/components/SessionList.tsx`
- [X] T020 [US1] Today page with date header, yoga-day toggle, per-session and day completion, persistence via `useDayEntry` in `src/pages/Today.tsx`
- [X] T021 [P] [US1] Component test: tick persists across remount in `tests/component/Today.test.tsx`

---

## Phase 4: User Story 2 – Exercise card library (P1)

**Goal**: Every card readable from Today or browsable/searchable.

**Independent Test**: Tap M5 from Today; search "bridge" returns L2 and B4.

- [X] T022 [P] [US2] Transcribe cards M1–M6 with all fields in `src/content/cards.ts`
- [X] T023 [P] [US2] Transcribe cards L1–L5 in `src/content/cards.ts`
- [X] T024 [P] [US2] Transcribe cards E1–E11 in `src/content/cards.ts`
- [X] T025 [P] [US2] Transcribe band basics and cards B1–B8 in `src/content/cards.ts` and `src/content/bandBasics.ts`
- [X] T026 [P] [US2] Create simple SVG illustrations in the PDF style (orange injured leg, grey start position, arrow) for each card in `public/illustrations/<code>.svg`; text-only fallback if missing
- [X] T027 [US2] `CardView` component showing steps, amount/hold, breath, feel, knee safety, easier, harder, stop-if (labelled and colour-coded plus text) in `src/components/CardView.tsx`
- [X] T028 [US2] Cards list page with group filter and search by code/name/category in `src/pages/Cards.tsx`; card detail route `/cards/:code` in `src/pages/CardDetail.tsx`
- [X] T029 [US2] Link schedule items to card detail (modal or route) from `src/components/SessionList.tsx`
- [X] T030 [P] [US2] Content-integrity test: every `cardCodes` entry in sessions resolves to a card; all expected codes M1–M6, L1–L5, E1–E11, B1–B8 exist in `tests/unit/content.test.ts`

---

## Phase 5: User Story 3 – Morning knee check (P1)

**Goal**: Four-outcome check adjusts Today and the walk target.

**Independent Test**: Each outcome yields the plan in contracts/plan-engine.md.

- [X] T031 [P] [US3] Transcribe adjustment rules (4 rows) in `src/content/adjustments.ts`
- [X] T032 [US3] Implement `walkTarget` logic (`better` +5 capped at 40, `puffier` hold, `swollen` reset to 15, `gaveWay` hold) in `src/domain/walkTarget.ts`
- [X] T033 [US3] Extend `buildTodayPlan` for knee-check outcomes: halve walk/bike on puffier, skip chair-pose/step-up tags, rest-day plan on swollen (quad sets, heel props, ankle pumps, legs up wall, ice), stop banner and removal of walk/standing-tagged items on gaveWay, in `src/domain/planEngine.ts`
- [X] T034 [P] [US3] Tests: every outcome × Day A/B/Sunday, walk-target cap at 40, floor at 15, in `tests/unit/planEngine.test.ts` and `tests/unit/walkTarget.test.ts`
- [X] T035 [US3] `KneeCheck` component (4 large options, replaceable answer, text + icon not colour only) in `src/components/KneeCheck.tsx`
- [X] T036 [US3] Wire KneeCheck into Today; save result, update settings walk target for next day, show "note what you were doing" prompt for gaveWay (adds to log) in `src/pages/Today.tsx`
- [X] T037 [P] [US3] Component test for KneeCheck → plan change in `tests/component/KneeCheck.test.tsx`

---

## Phase 6: User Story 4 – Daily log, streaks, weekly view (P2)

**Goal**: Log fields and progress insights.

**Independent Test**: Log 3 days; streak = 3; weekly grid and trends reflect them.

- [X] T038 [P] [US4] Implement `adherence` (planned vs ticked per session/day, ignoring ticked ids not in plan) in `src/domain/adherence.ts`
- [X] T039 [P] [US4] Implement `streaks` (current/best; day complete when all non-skipped planned items ticked) in `src/domain/streaks.ts`
- [X] T040 [P] [US4] Tests for adherence and streaks incl. missed day and rest day in `tests/unit/adherence.test.ts`, `tests/unit/streaks.test.ts`
- [X] T041 [US4] `DayLogForm` (swelling 0–3, pain 0–10, walk minutes, giving-way events with time/note, notes) in `src/components/DayLogForm.tsx`
- [X] T042 [US4] Progress page: streak, weekly adherence grid, trend charts for walk min/swelling/pain (lightweight inline SVG), giving-way list in `src/pages/Progress.tsx`
- [X] T043 [US4] Allow editing past days from Progress via date picker in `src/pages/Progress.tsx`

---

## Phase 7: User Story 5 – Counters and timer (P2)

**Goal**: Quad-set, heel-prop, ankle-pump counters.

**Independent Test**: 5 taps → 5/6; heel-prop timer counts 10 minutes.

- [X] T044 [P] [US5] `Counter` component with +/− and daily target (quad sets 6 × 10, heel props 3 × 10 min, ankle pumps) in `src/components/Counter.tsx`
- [X] T045 [P] [US5] `HeelPropTimer` (10-min countdown, completes → +1 heel prop, survives screen lock by using timestamps) in `src/components/HeelPropTimer.tsx`
- [X] T046 [US5] Counters strip on Today and persistence into `DayEntry.counters`; new day starts at 0 in `src/pages/Today.tsx`
- [X] T047 [P] [US5] Component test for Counter and timer in `tests/component/Counter.test.tsx`

---

## Phase 8: User Story 6 – Safety (P2)

**Goal**: Always-reachable warnings and Doppler to-do.

**Independent Test**: Calf symptom log shows same-day warning; Doppler to-do clears when marked done.

- [X] T048 [P] [US6] Transcribe safety content (calf pain/swelling/tightness same-day check, Baker's cyst vs clot, giving-way rule, stop-if guidance, "not medical advice") in `src/content/safety.ts`
- [X] T049 [US6] Safety page and quick-access route in `src/pages/Safety.tsx`
- [X] T050 [US6] Calf-symptom flag in `DayLogForm` triggers prominent same-day warning banner on Today in `src/components/DayLogForm.tsx` and `src/pages/Today.tsx`
- [X] T051 [US6] Doppler to-do reminder on Today until marked done (stored in settings) in `src/pages/Today.tsx` and `src/pages/Safety.tsx`
- [X] T052 [P] [US6] Component test: warning and Doppler reminder behaviour in `tests/component/Safety.test.tsx`

---

## Phase 9: User Story 7 – MRI and checkpoints (P3)

**Goal**: Reference plus timeline with notes.

**Independent Test**: Start date → "Week N", next checkpoint date.

- [X] T053 [P] [US7] Transcribe MRI findings table, first 2–3 weeks adjustments, surgeon question in `src/content/mri.ts`
- [X] T054 [P] [US7] Define checkpoints (6 weeks, 3 months, 6 months; from PDF progression pages) in `src/content/checkpoints.ts`
- [X] T055 [P] [US7] Implement checkpoint date and week calculation in `src/domain/checkpoints.ts` with tests in `tests/unit/checkpoints.test.ts`
- [X] T056 [US7] MRI page and Checkpoints page with countdown, editable start date and per-checkpoint notes in `src/pages/Mri.tsx`, `src/pages/Checkpoints.tsx`

---

## Phase 10: User Story 8 – Food plan and protein (P3)

**Goal**: Vegetarian plan, meal ticks, protein/water progress.

**Independent Test**: Wednesday rotation shown; ticking lunch raises protein total.

- [X] T057 [P] [US8] Transcribe plate guide, nutrient table, daily eating pattern (with protein per slot) and 7-day rotation in `src/content/food.ts`
- [X] T058 [P] [US8] Implement `protein` totals vs 105 g target in `src/domain/protein.ts` with tests in `tests/unit/protein.test.ts`
- [X] T059 [P] [US8] Content test: no food string matches onion|garlic|potato|carrot|beetroot|radish in `tests/unit/content.test.ts`
- [X] T060 [US8] Food page: today's meals, ticks, protein bar, water goal (2.5–3 L), full rotation view in `src/pages/Food.tsx`

---

## Phase 11: Backup, polish, cross-cutting

- [X] T061 [P] Implement backup export/import with validation against `contracts/backup-file.schema.json` in `src/storage/backup.ts` and tests in `tests/unit/backup.test.ts` (FR-019)
- [X] T062 Settings page: theme, start date, walk range, export/import, backup reminder, data-cleared warning in `src/pages/Settings.tsx`
- [ ] T063 [P] Accessibility pass: tap targets ≥44px, contrast AA in light/dark, labels, focus order across all pages
- [ ] T064 [P] Verify offline: build, preview, reload with network off (quickstart scenario 5); optional Playwright smoke in `tests/e2e/offline.spec.ts`
- [ ] T065 [P] Check layout at 360×740 and install-to-home-screen on iOS/Android
- [ ] T066 Run all quickstart.md validation scenarios and fix gaps
- [X] T067 [P] Write `README.md` (run, build, deploy to GitHub Pages/Netlify, backup advice)

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → user stories → Phase 11.
- US1 is the MVP and must precede US3 (extends the plan engine), US5 (counters strip on Today), and US6 T050–T051 (Today banners).
- US2 can run in parallel with US1 (T029 links after both).
- US4 needs US1 data. US7, US8 are independent after Phase 2.
- Within a story: content transcription [P] → logic → components → page → tests.

## Parallel Examples

- After Phase 2: T015, T016 (US1 content), T022–T025 (US2 cards), T053–T054 (MRI/checkpoints), T057 (food) can all proceed at once.
- US3: T031 and T034 tests alongside T032.

## Implementation Strategy

1. **MVP**: Phases 1–2, then US1 + US2 (Today + cards) → usable daily tracker.
2. Add US3 (knee check): safety-critical, do next.
3. US4–US6, then US7–US8, then Phase 11.
4. Validate each story with its Independent Test before moving on.
