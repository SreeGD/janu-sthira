# Jānu Sthira

**Jānu Sthira** (Sanskrit *jānu*, knee + *sthira*, steady) is a free, offline-first web app for following a structured, rehab-first recovery plan after an ACL injury. It turns a rehab booklet into a daily habit tracker: a schedule of exercise sessions, an illustrated card for every exercise, a morning knee check that adapts the day and the walking target, a weekly tick sheet, daily and weekly reviews, and guides for the MRI, safety warnings, getting the knee bend back, things to avoid, a vegetarian food plan with a weekly shopping list, and supplements. It works on your phone, stores everything on your device, and needs no account.

**Not medical advice.** The exercise, MRI, supplement and food content is general educational material based on a rehab booklet. Agree any plan with your surgeon and physiotherapist.

This repository contains no personal or health data. Everything you enter stays in your own browser.

## Try it

Live app: https://sreegd.github.io/janu-sthira/ (open once online; then it works offline and can be added to your home screen).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit + component tests
npm run build      # type-check + production build (PWA, precached)
npm run preview    # serve the build
```

## Deploy

`dist/` is a static site (hash routing, relative base), so it works from any static host. This repo deploys to GitHub Pages automatically from `main` via `.github/workflows/pages.yml`; you can also use Netlify or `npx serve dist`. Open it once online; after that it works offline and can be added to the home screen.

## Your data

Everything is stored in your browser (IndexedDB). Nothing is sent anywhere. If you clear site data it is lost.

**Moving between devices:** More → Settings → *Move to another device*. Export on one device (share/save a file, or copy as text), then import on the other. Import **merges** by default (ticks, meals and notes from both devices are combined, nothing is overwritten or deleted) and shows a preview first; *Replace everything* is available with a confirmation.

## Structure

- `src/content/` programme content transcribed from the PDF (cards, sessions, food, MRI, checkpoints)
- `src/domain/` pure logic: plan engine, walk target, streaks, adherence
- `src/storage/` IndexedDB layer and backup import/export
- `src/pages/`, `src/components/` UI
- `specs/001-rehab-tracker/` spec, plan, tasks

## License

Copyright (C) 2026 SreeGD

Jānu Sthira is free software: you can use, study, share and improve it under the terms of the
[GNU General Public License v3.0 or later](LICENSE). If you distribute a modified version, you must
release it under the same licence with its source. It comes with no warranty, and is not a medical device.
