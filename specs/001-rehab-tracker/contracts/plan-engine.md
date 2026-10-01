# Contract: Plan Engine

Pure function; no I/O.

```ts
buildTodayPlan(input: {
  date: string            // YYYY-MM-DD, local
  yoga: boolean
  kneeCheck?: 'better' | 'puffier' | 'swollen' | 'gaveWay'
  walkTarget: number      // minutes
}): {
  dayType: 'A' | 'B' | 'SUNDAY'
  sessions: PlannedSession[]    // items each with status: 'full' | 'halved' | 'skipped' | 'rest'
  walkMinutesToday: number      // 0 when swollen/gaveWay
  nextWalkTarget: number        // proposed target for tomorrow
  banners: { level: 'info'|'warn'|'stop'; text: string }[]
}
```

## Rules (from PDF table)
| kneeCheck | Result |
|---|---|
| better (same or better) | Full plan; nextWalkTarget = min(40, walkTarget+5) |
| puffier | Keep stretches, quad sets, heel props, hip work; walk and bike halved; chair pose and step-ups skipped; target held |
| swollen | Rest day: quad sets, heel props, ankle pumps, legs up the wall, ice; walkMinutesToday 0; nextWalkTarget = 15 (shorter restart) |
| gaveWay | Stop banner; walking and standing-tagged items skipped; prompt to note cause and tell physio/surgeon |
| undefined | Full plan, banner prompting the knee check first |

Weekday: Mon/Wed/Fri → A, Tue/Thu/Sat → B, Sun → lighter. `yoga: true` swaps the evening session for the yoga entry; morning walk stays.

Tests: table-driven, one per row × day type, plus yoga and Sunday combinations.
