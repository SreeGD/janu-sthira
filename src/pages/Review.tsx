import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { kneeCheckLabel } from '../content/adjustments'
import type { DayEntry, WeekReview } from '../content/types'
import { Page, Section, WarningBanner } from '../components/ui'
import { nextCheckpoint } from '../domain/checkpoints'
import { addDays, parseDate, weekdayIndex, weekdayNames } from '../domain/dates'
import { buildTodayPlan, dayTypeOf } from '../domain/planEngine'
import { dayStats, suggestNextWeek, weekStartOf, weekStats } from '../domain/review'
import { useDayEntry } from '../hooks/useDayEntry'
import { useSettings } from '../hooks/useSettings'
import { useToday } from '../hooks/useToday'
import { getWeekReview, listDays, saveWeekReview } from '../storage/repository'

const dayTypeLabel = { A: 'Day A: band circuit', B: 'Day B: good leg + core', SUNDAY: 'Sunday: lighter day' }
const fmt = (d: string) => parseDate(d).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
const pct = (r: number) => `${Math.round(r * 100)}%`

function Field({ label, value, onChange, rows = 3, placeholder }: { label: string; value?: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <textarea rows={rows} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="panel text-center"><div className="text-xl font-bold">{value}</div><div className="muted text-xs">{label}</div></div>
}

export default function Review() {
  const [mode, setMode] = useState<'day' | 'week'>('day')
  return (
    <Page title="Review">
      <div className="flex gap-2" role="group" aria-label="Review type">
        <button type="button" className={`btn flex-1 ${mode === 'day' ? 'btn-primary' : ''}`} aria-pressed={mode === 'day'} onClick={() => setMode('day')}>Daily</button>
        <button type="button" className={`btn flex-1 ${mode === 'week' ? 'btn-primary' : ''}`} aria-pressed={mode === 'week'} onClick={() => setMode('week')}>Weekly</button>
      </div>
      {mode === 'day' ? <DailyReview /> : <WeeklyReview />}
    </Page>
  )
}

export function DailyReview() {
  const today = useToday()
  const [date, setDate] = useState(today)
  const { settings } = useSettings()
  const { entry, loaded, update } = useDayEntry(date)
  const stats = useMemo(() => dayStats(entry, entry.walkBase ?? settings.walkTarget), [entry, settings.walkTarget])
  const setReview = (patch: Partial<NonNullable<DayEntry['review']>>) =>
    update((d) => ({ ...d, review: { ...d.review, ...patch, savedAt: new Date().toISOString() } }))
  const r = entry.review ?? {}

  const tomorrow = addDays(date, 1)
  const tPlan = buildTodayPlan({ date: tomorrow, yoga: false, walkTarget: settings.walkTarget, walkMin: settings.walkMin, walkMax: settings.walkMax })

  if (!loaded) return <p className="muted">Loading…</p>
  return (
    <>
      <label className="block text-sm font-semibold">
        Day
        <input type="date" value={date} max={today} onChange={(e) => e.target.value && setDate(e.target.value)} />
      </label>

      <Section title={`How ${date === today ? 'today' : fmt(date)} went`}>
        <div className="grid grid-cols-3 gap-2">
          <Stat label="plan done" value={pct(stats.ratio)} />
          <Stat label="items" value={`${stats.done}/${stats.planned}`} />
          <Stat label="walk" value={stats.walkMin != null ? `${stats.walkMin} min` : '–'} />
          <Stat label="knee check" value={stats.kneeCheck ? kneeCheckLabel[stats.kneeCheck] : '–'} />
          <Stat label="swelling / pain" value={`${stats.swelling ?? '–'} / ${stats.pain ?? '–'}`} />
          <Stat label="protein" value={`${stats.protein} g`} />
          <Stat label="quad sets" value={`${stats.counters.quadSets}`} />
          <Stat label="heel props" value={`${stats.counters.heelProp}`} />
          <Stat label="giving way" value={`${stats.givingWay}`} />
        </div>
        {stats.calfWarning && <div className="mt-2"><WarningBanner level="stop">Calf symptoms logged. Get checked the same day. <Link to="/safety" className="underline">Safety</Link></WarningBanner></div>}
        {stats.givingWay > 0 && <div className="mt-2"><WarningBanner level="warn">The knee gave way today. Tell your physio or surgeon.</WarningBanner></div>}
        {stats.planned > 0 && stats.done < stats.planned && (
          <p className="muted mt-2 text-sm">Not done: {stats.planned - stats.done} item(s). <Link className="underline" to="/">Open Today</Link> to tick anything you finished.</p>
        )}
      </Section>

      <Section title="Reflection">
        <div className="flex flex-col gap-3">
          <fieldset>
            <legend className="text-sm font-semibold">How did the knee and body feel overall? (1 low – 5 great)</legend>
            <div className="mt-1 flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" className={`btn flex-1 ${r.mood === n ? 'btn-primary' : ''}`} aria-pressed={r.mood === n} onClick={() => setReview({ mood: n })}>{n}</button>
              ))}
            </div>
          </fieldset>
          <Field label="What went well?" value={r.wentWell} onChange={(v) => setReview({ wentWell: v })} placeholder="e.g. walked 25 min without a limp" />
          <Field label="What was hard or got skipped, and why?" value={r.hard} onChange={(v) => setReview({ hard: v })} />
          <Field label="What did I notice about the knee?" value={r.learned} onChange={(v) => setReview({ learned: v })} placeholder="e.g. swelling after the long sitting call" />
        </div>
      </Section>

      <Section title={`Plan for tomorrow (${fmt(tomorrow)})`}>
        <p className="text-sm"><strong>{dayTypeLabel[tPlan.dayType]}</strong>. Walk target {settings.walkTarget} min, adjusted by tomorrow's morning knee check.</p>
        <div className="mt-2"><Field label="My intention for tomorrow" rows={2} value={r.tomorrow} onChange={(v) => setReview({ tomorrow: v })} placeholder="e.g. do heel prop #1 before the 11am call" /></div>
      </Section>
      <p className="muted text-xs">{r.savedAt ? `Saved ${new Date(r.savedAt).toLocaleTimeString()}` : 'Saves automatically.'}</p>
    </>
  )
}

export function WeeklyReview() {
  const today = useToday()
  const { settings, update: updateSettings } = useSettings()
  const [weekStart, setWeekStart] = useState(weekStartOf(today))
  const [days, setDays] = useState<Record<string, DayEntry>>({})
  const [review, setReview] = useState<WeekReview>({ weekStart })
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    let live = true
    void Promise.all([listDays(), getWeekReview(weekStart)]).then(([d, w]) => {
      if (!live) return
      setDays(d)
      setReview(w)
      setApplied(false)
    })
    return () => { live = false }
  }, [weekStart])

  const stats = useMemo(() => weekStats(days, weekStart, settings.walkTarget), [days, weekStart, settings.walkTarget])
  const next = nextCheckpoint(settings.startDate, today)
  const suggestion = useMemo(
    () => suggestNextWeek(stats, settings, next?.daysLeft, next?.label),
    [stats, settings, next?.daysLeft, next?.label],
  )
  const nextStart = addDays(weekStart, 7)
  const save = (patch: Partial<WeekReview>) => {
    const w = { ...review, ...patch, weekStart }
    setReview(w)
    void saveWeekReview(w)
  }
  const isCurrent = weekStart === weekStartOf(today)
  const dates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const chosenTarget = review.nextWalkTarget ?? suggestion.walkTarget

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <button type="button" className="btn" onClick={() => setWeekStart(addDays(weekStart, -7))} aria-label="Previous week">←</button>
        <div className="text-center text-sm font-semibold">{fmt(weekStart)} – {fmt(addDays(weekStart, 6))}{isCurrent ? ' (this week)' : ''}</div>
        <button type="button" className="btn" disabled={isCurrent || weekStart > today} onClick={() => setWeekStart(addDays(weekStart, 7))} aria-label="Next week">→</button>
      </div>

      <Section title="The week in numbers">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="plan done (avg)" value={pct(stats.avgAdherence)} />
          <Stat label="full days" value={`${stats.daysComplete}/7`} />
          <Stat label="days logged" value={`${stats.daysLogged}/7`} />
          <Stat label="walked" value={`${stats.totalWalkMin} min`} />
          <Stat label="avg swelling" value={stats.avgSwelling != null ? stats.avgSwelling.toFixed(1) : '–'} />
          <Stat label="avg pain" value={stats.avgPain != null ? stats.avgPain.toFixed(1) : '–'} />
          <Stat label="calm mornings" value={`${stats.checks.better}`} />
          <Stat label="puffy / swollen" value={`${stats.checks.puffier} / ${stats.checks.swollen}`} />
          <Stat label="giving way" value={`${stats.givingWay}`} />
        </div>
        <table className="mt-3">
          <thead><tr><th>Day</th><th>Done</th><th>Knee</th><th>Walk</th></tr></thead>
          <tbody>
            {dates.map((d) => {
              const e = days[d]
              const s = e ? dayStats(e, settings.walkTarget) : undefined
              return (
                <tr key={d}>
                  <td>{weekdayNames[weekdayIndex(d)]} {d.slice(8)}{d === stats.best ? ' ★' : ''}</td>
                  <td>{s && s.done > 0 ? pct(s.ratio) : '–'}</td>
                  <td>{s?.kneeCheck ? kneeCheckLabel[s.kneeCheck] : '–'}</td>
                  <td>{s?.walkMin != null ? `${s.walkMin} min` : '–'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {stats.avgProtein > 0 && <p className="muted mt-2 text-sm">Protein averaged about {stats.avgProtein} g on logged days.</p>}
        {stats.best && stats.worst && stats.best !== stats.worst && <p className="muted text-sm">Best day ★ {fmt(stats.best)}; toughest {fmt(stats.worst)}.</p>}
      </Section>

      <Section title="Reflection">
        <div className="flex flex-col gap-3">
          <Field label="Wins this week" value={review.wins} onChange={(v) => save({ wins: v })} />
          <Field label="What got in the way?" value={review.struggles} onChange={(v) => save({ struggles: v })} />
          <Field label="What did I learn about my knee?" value={review.learned} onChange={(v) => save({ learned: v })} />
        </div>
      </Section>

      <Section title={`Plan for next week (${fmt(nextStart)} – ${fmt(addDays(nextStart, 6))})`}>
        <p className="muted mb-2 text-sm">Suggestions from this week's numbers:</p>
        <div className="flex flex-col gap-2">
          {suggestion.items.length === 0 && <p className="text-sm">Nothing flagged. Keep going as planned.</p>}
          {suggestion.items.map((s, i) => <WarningBanner key={i} level={s.level}>{s.text}</WarningBanner>)}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 text-sm">
          <span>Walk target for next week: <strong>{chosenTarget} min</strong></span>
          <span className="flex gap-1">
            <button type="button" className="btn" aria-label="Lower walk target" onClick={() => save({ nextWalkTarget: Math.max(settings.walkMin, chosenTarget - 5) })}>−5</button>
            <button type="button" className="btn" aria-label="Raise walk target" onClick={() => save({ nextWalkTarget: Math.min(settings.walkMax, chosenTarget + 5) })}>+5</button>
          </span>
        </div>
        {isCurrent && (
          <button type="button" className="btn btn-primary mt-2 w-full" disabled={applied || settings.walkTarget === chosenTarget} onClick={() => { void updateSettings({ walkTarget: chosenTarget }); setApplied(true) }}>
            {applied ? 'Walk target updated' : `Set walk target to ${chosenTarget} min now`}
          </button>
        )}

        <ul className="mt-3 text-sm">
          {Array.from({ length: 7 }, (_, i) => addDays(nextStart, i)).map((d) => (
            <li key={d} className="flex justify-between border-b py-1" style={{ borderColor: 'var(--border)' }}>
              <span>{weekdayNames[weekdayIndex(d)]} {d.slice(8)}</span><span className="muted">{dayTypeLabel[dayTypeOf(d)]}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex flex-col gap-3">
          <Field label="Focus for next week" rows={2} value={review.nextFocus} onChange={(v) => save({ nextFocus: v })} placeholder="e.g. protect morning walk and quad sets" />
          <Field label="My plan (sessions, appointments, what to change)" value={review.nextPlan} onChange={(v) => save({ nextPlan: v })} />
          <button type="button" className="btn" onClick={() => save({ nextPlan: [review.nextPlan, ...suggestion.items.map((s) => `- ${s.text}`)].filter(Boolean).join('\n') })}>Add the suggestions to my plan</button>
        </div>
      </Section>
    </>
  )
}
