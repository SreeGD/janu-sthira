# Quickstart / Validation Guide

## Prerequisites
Node 20+, npm.

## Setup and run
```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest unit + component tests
npm run build && npm run preview
```

## Validation scenarios
1. **Today by weekday** (US1): mock date to Mon/Tue/Sun; evening shows A / B / lighter. Covered by `tests/unit/planEngine.test.ts`.
2. **Card links** (US2): tap each schedule item, card opens; content-integrity test confirms all codes resolve.
3. **Knee check** (US3): run through all four outcomes; compare with the table in [contracts/plan-engine.md](contracts/plan-engine.md).
4. **Persistence** (US1/FR-018): tick items, reload, ticks remain.
5. **Offline**: `npm run build && npm run preview`, load once, set DevTools to Offline, reload; app works.
6. **Backup** (FR-019): export, clear site data, import; schema in [contracts/backup-file.schema.json](contracts/backup-file.schema.json); data restored.
7. **Safety** (US6): enter calf warning in log; banner appears; Doppler to-do clears when marked done.
8. **Food** (US8/SC-008): content test fails if any food string matches onion|garlic|potato|carrot|beetroot|radish.
9. **Mobile**: check at 360×740 viewport, light and dark.
