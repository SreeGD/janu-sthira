# Jaanu Setu

A bridge back to a confident knee: an offline-first, mobile-first tracker for a rehab-first ACL recovery programme, built from the *ACL Rehab Programme Daily Schedule* booklet.

**Not medical advice.** The exercise, MRI, supplement and food content is general educational material based on a rehab booklet. Agree any plan with your surgeon and physiotherapist.

This repository contains no personal or health data. Everything you enter stays in your own browser.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit + component tests
npm run build      # type-check + production build (PWA, precached)
npm run preview    # serve the build
```

## Deploy

`dist/` is a static site (hash routing, relative base), so it works from any static host:
GitHub Pages, Netlify, or `npx serve dist`. Open it once online; after that it works offline and can be added to the home screen.

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

Jaanu Setu is free software: you can use, study, share and improve it under the terms of the
[GNU General Public License v3.0 or later](LICENSE). If you distribute a modified version, you must
release it under the same licence with its source. It comes with no warranty, and is not a medical device.
