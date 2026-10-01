import { useEffect, useMemo, useState } from 'react'
import type { DayEntry } from '../content/types'
import { DayLogForm } from '../components/DayLogForm'
import { WeekGrid } from '../components/WeekGrid'
import { useSettings } from '../hooks/useSettings'
import { Page, Section } from '../components/ui'
import { addDays, parseDate } from '../domain/dates'
import { weekStartOf } from '../domain/review'
import { computeStreaks } from '../domain/streaks'
import { useToday } from '../hooks/useToday'
import { useDayEntry } from '../hooks/useDayEntry'
import { listDays } from '../storage/repository'

const fmt = (d: string) => parseDate(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

function Spark({ values, max, label }: { values: (number | undefined)[]; max: number; label: string }) {
  const w = 280, h = 50
  const pts = values.map((v, i) => (v == null ? null : [(i / Math.max(1, values.length - 1)) * w, h - (Math.min(v, max) / max) * (h - 6) - 3] as const))
  const d = pts.filter(Boolean).map((p, i) => `${i ? 'L' : 'M'}${p![0].toFixed(1)},${p![1].toFixed(1)}`).join(' ')
  if (!d) {
    return (
      <figure>
        <figcaption className="text-sm font-semibold">{label}</figcaption>
        <p className="muted text-sm">No data yet. Log it in the daily log on Today.</p>
      </figure>
    )
  }
  return (
    <figure>
      <figcaption className="text-sm font-semibold">{label}</figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label={`${label} over the last ${values.length} days`}>
        <line x1="0" y1={h - 1} x2={w} y2={h - 1} stroke="var(--border)" />
        {d && <path d={d} fill="none" stroke="var(--teal)" strokeWidth="2" />}
        {pts.map((p, i) => p && <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="var(--teal)" />)}
      </svg>
    </figure>
  )
}

export default function Progress() {
  const today = useToday()
  const [days, setDays] = useState<Record<string, DayEntry>>({})
  const [edit, setEdit] = useState(today)
  const { entry, update } = useDayEntry(edit)
  const [rev, setRev] = useState(0)
  const { settings } = useSettings()
  const [weekStart, setWeekStart] = useState(weekStartOf(today))

  useEffect(() => {
    void listDays().then(setDays)
  }, [rev, entry.updatedAt])

  const streaks = useMemo(() => computeStreaks(days, today), [days, today])
  const last14 = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(today, i - 13)), [today])
  const givingWay = Object.values(days).flatMap((d) => d.log.givingWay.map((g) => ({ date: d.date, ...g }))).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <Page title="Progress">
      <div className="grid grid-cols-2 gap-3">
        <div className="panel text-center"><div className="text-3xl font-bold">{streaks.current}</div><div className="muted text-sm">day streak</div></div>
        <div className="panel text-center"><div className="text-3xl font-bold">{streaks.best}</div><div className="muted text-sm">best streak</div></div>
      </div>

      <Section title="Weekly tick sheet">
        <div className="mb-3 flex items-center justify-between gap-2">
          <button type="button" className="btn" aria-label="Previous week" onClick={() => setWeekStart(addDays(weekStart, -7))}>←</button>
          <div className="text-center text-sm font-semibold">
            {fmt(weekStart)} – {fmt(addDays(weekStart, 6))}{weekStart === weekStartOf(today) ? ' (this week)' : ''}
          </div>
          <button type="button" className="btn" aria-label="Next week" disabled={weekStart >= weekStartOf(today)} onClick={() => setWeekStart(addDays(weekStart, 7))}>→</button>
        </div>
        <WeekGrid weekStart={weekStart} today={today} days={days} walkTarget={settings.walkTarget} selected={edit} onSelect={setEdit} onChanged={() => setRev((r) => r + 1)} />
      </Section>

      <Section title="Trends (14 days)">
        <Spark label="Walk minutes" max={60} values={last14.map((d) => days[d]?.log.walkMin)} />
        <Spark label="Heel to buttock (cm, lower = more bend)" max={60} values={last14.map((d) => days[d]?.log.heelToButtockCm)} />
        <Spark label="Swelling (0–3)" max={3} values={last14.map((d) => days[d]?.log.swelling)} />
        <Spark label="Pain (0–10)" max={10} values={last14.map((d) => days[d]?.log.pain)} />
      </Section>

      <Section title="Giving-way events">
        {givingWay.length === 0 ? <p className="muted text-sm">None logged.</p> : (
          <ul className="text-sm">{givingWay.map((g, i) => <li key={i}>{g.date} {g.time} · {g.note || '(no note)'}</li>)}</ul>
        )}
      </Section>

      <Section title="Edit a day">
        <label className="mb-3 block text-sm font-semibold">
          Date
          <input type="date" value={edit} max={today} onChange={(e) => e.target.value && setEdit(e.target.value)} />
        </label>
        <DayLogForm entry={entry} onChange={async (fn) => { await update(fn); setRev((r) => r + 1) }} />
      </Section>
    </Page>
  )
}
