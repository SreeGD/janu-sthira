# Research: Jānu Sthira

## R1. Framework and build
- **Decision**: Vite + React + TypeScript.
- **Rationale**: Fast static build, strong typing for content data, user-specified stack.
- **Alternatives**: Next.js (SSR unnecessary, heavier); plain JS (weaker content typing); Svelte (fine, but user chose React).

## R2. Offline / installability
- **Decision**: vite-plugin-pwa with Workbox precache of the whole app shell and illustrations; web manifest for home-screen install.
- **Rationale**: App has no runtime network needs; precache gives full offline.
- **Alternatives**: Hand-written service worker (more error-prone).

## R3. Persistence
- **Decision**: IndexedDB through idb-keyval; one record per date (`day:YYYY-MM-DD`) plus `settings`. Request persistent storage (`navigator.storage.persist()`) where available.
- **Rationale**: More durable than localStorage and survives larger histories; per-day keys keep writes small. Safari can evict data, hence JSON export/import (FR-019) and a backup reminder.
- **Alternatives**: localStorage (5 MB, sync, simpler but less durable); Dexie (overkill).

## R4. Date handling
- **Decision**: Store dates as local calendar strings `YYYY-MM-DD`; compute weekday from the local date; re-evaluate "today" on visibilitychange and at midnight.
- **Rationale**: Avoids UTC off-by-one around midnight (edge case in spec).

## R5. Plan engine design
- **Decision**: Pure function `buildTodayPlan({date, yoga, kneeCheck, walkTarget})` returning sessions with items flagged `full | halved | skipped | rest`, plus banners. Rules live in `content/adjustments.ts` and are covered by table-driven tests against the PDF's four-row table.
- **Rationale**: Highest-risk logic; must be deterministic and testable (SC-007).

## R6. Walk target progression
- **Decision**: Start 15 min (range 15–20 configurable). After "same or better" check: +5 up to 40. "Puffier": hold target, today's walk halved. "Swollen/painful": rest today, next walk target resets to 15 min (the PDF says restart with a shorter walk). "Gave way": no walking today; target held until the user logs the next calm day.
- **Rationale**: Follows the PDF wording with the simplest unambiguous numbers; editable in Settings.

## R7. Illustrations
- **Decision**: Hand-built inline SVG per card in the PDF's visual language (orange = injured leg, grey = start position, arrow = movement), stored in `public/illustrations/`. Cards fall back to text-only if an illustration is missing.
- **Rationale**: PDF images cannot be reused programmatically at quality; text steps remain the source of truth.
- **Alternatives**: Extracting images from the PDF (low quality, licensing unclear).

## R8. Content fidelity
- **Decision**: Transcribe cards verbatim from the PDF into typed data; a content-integrity test checks every schedule card code resolves to a card and no food item contains onion or garlic.
- **Rationale**: Safety and SC-008.

## R9. Yoga sequence
- **Decision**: Placeholder entry ("40-minute yoga sequence, see separate Yoga PDF") with an optional free-form checklist the user can edit later.
- **Rationale**: Content is not in the provided PDF.

## R10. Notifications
- **Decision**: Out of scope for v1 (spec assumption).

## R11. Theme and accessibility
- **Decision**: Tailwind with CSS variables; follows system light/dark; large tap targets (≥44 px), semantic headings, colour never the sole state indicator.
