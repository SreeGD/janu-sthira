# Data Model: Jānu Sthira

Static content types live in `src/content/`; user data lives in IndexedDB.

## Static content

**ExerciseCard** `{ code: 'M1'|…, name, group: 'M'|'L'|'E'|'B', category, steps: string[], amount?, breath?, howMuch?, feel?, kneeSafety?, easier?, harder?, stopIf?, illustration?: string }`

**SessionTemplate** `{ id: 'morning'|'lunch'|'evening-A'|'evening-B'|'evening-sunday'|'evening-yoga'|'desk', title, durationMin, label, items: ScheduleItem[] }`

**ScheduleItem** `{ id, minutes?, text, amount, cardCodes: string[], tags: ('walk'|'bike'|'chair-pose'|'step-up'|'standing')[], counter?: 'quadSets'|'heelProp'|'anklePumps' }`

**KneeCheckRule** `{ outcome, label, effect: { walk: 'plus5'|'halve'|'none'|'rest'; skipTags: string[]; restDay: boolean; stopNotice: boolean } }`

**Checkpoint** `{ id, label, afterWeeks|afterMonths, description }` (6 weeks, 3 months, 6 months)

**Meal** `{ day: 0-6, slot: 'breakfast'|'lunch'|'snack'|'dinner'|…, dishes: string, proteinG }`

**MriFinding** `{ finding, plainMeaning, whatItChanges }`

## User data

**Settings** `{ startDate: 'YYYY-MM-DD', walkTarget: number, walkMin: 15, walkMax: 40, theme: 'system'|'light'|'dark', dopplerAdvised?: boolean, dopplerDone: boolean, dopplerDoneOn?: date, checkpointNotes: Record<checkpointId, string>, backupLastAt?: iso }`

**DayEntry** (key `day:YYYY-MM-DD`)
```
{
  date, yoga: boolean,
  kneeCheck?: 'better'|'puffier'|'swollen'|'gaveWay',
  ticked: string[],            // ScheduleItem ids
  counters: { quadSets: number, heelPropMin: number, anklePumps: number },
  log: { swelling?: 0-3, pain?: 0-10, walkMin?: number, calfWarning?: boolean, givingWay: {time?, note}[], notes?: string },
  meals: string[],             // Meal keys ticked
  waterL?: number,
  updatedAt: iso
}
```

## Derived (not stored)
Today's plan, planned vs completed counts, adherence per day/session, streak and best streak, programme week, protein total.

## Validation / state rules
- `walkTarget` always within [walkMin, walkMax], multiples of 5 when auto-adjusted.
- `kneeCheck` can be replaced during a day; plan recomputes.
- `gaveWay` check removes items tagged walk/standing from Today and sets `stopNotice`.
- Ticked ids not present in the current plan are ignored in adherence (plan changes don't corrupt history).
- Streak day = day with at least all non-skipped planned items ticked; rest days count if rest items are ticked.
