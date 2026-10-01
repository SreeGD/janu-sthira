import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { calfWarning } from '../content/safety'
import { givingWayRule } from '../content/safety'
import type { KneeCheck as Check } from '../content/types'
import { DayLogForm } from '../components/DayLogForm'
import { Counter } from '../components/Counter'
import { HeelPropTimer } from '../components/HeelPropTimer'
import { KneeCheck } from '../components/KneeCheck'
import { SessionList } from '../components/SessionList'
import { Page, Ring, WarningBanner } from '../components/ui'
import { dayAdherence } from '../domain/adherence'
import { parseDate, programmeWeek } from '../domain/dates'
import { buildTodayPlan } from '../domain/planEngine'
import { nextWalkTarget } from '../domain/walkTarget'
import { useDayEntry } from '../hooks/useDayEntry'
import { useSettings } from '../hooks/useSettings'
import { useToday } from '../hooks/useToday'

export default function Today() {
  const today = useToday()
  return <TodayFor key={today} date={today} />
}

export function TodayFor({ date }: { date: string }) {
  const { settings, update: updateSettings } = useSettings()
  const { entry, loaded, update, toggleTick } = useDayEntry(date)
  const [showLog, setShowLog] = useState(false)

  const walkTarget = entry.walkBase ?? settings.walkTarget
  const plan = useMemo(
    () => buildTodayPlan({ date, yoga: entry.yoga, kneeCheck: entry.kneeCheck, walkTarget, walkMin: settings.walkMin, walkMax: settings.walkMax }),
    [date, entry.yoga, entry.kneeCheck, walkTarget, settings.walkMin, settings.walkMax],
  )
  const adherence = dayAdherence(entry, walkTarget)

  const onCheck = useCallback(
    async (check: Check) => {
      const base = entry.walkBase ?? settings.walkTarget
      await update((d) => ({
        ...d,
        kneeCheck: check,
        walkBase: base,
        log: check === 'gaveWay' && d.log.givingWay.length === 0 ? { ...d.log, givingWay: [{ time: new Date().toTimeString().slice(0, 5), note: '' }] } : d.log,
      }))
      await updateSettings({ walkTarget: nextWalkTarget(base, check, settings.walkMin, settings.walkMax) })
      if (check === 'gaveWay') setShowLog(true)
    },
    [entry.walkBase, settings, update, updateSettings],
  )

  const dateLabel = parseDate(date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })
  const dayLabel = entry.yoga ? 'Yoga day' : plan.dayType === 'A' ? 'Day A: band circuit' : plan.dayType === 'B' ? 'Day B: good leg + core' : 'Sunday: lighter day'

  if (!loaded) return <Page title="Today"><p className="muted">Loading…</p></Page>

  return (
    <Page title={dateLabel}>
      <div className="panel-soft flex items-center gap-4">
        <Ring value={adherence.done} max={adherence.planned} label="Today's progress" />
        <div className="min-w-0 flex-1 text-sm">
          <div className="font-bold" style={{ color: 'var(--navy)' }}>{dayLabel}</div>
          <div className="muted">Week {programmeWeek(settings.startDate, date)} of your programme</div>
          <div className="mt-1">{adherence.done} of {adherence.planned} done · walk {plan.walkMinutesToday > 0 || entry.kneeCheck ? `${plan.walkMinutesToday} min` : `${walkTarget} min`}</div>
        </div>
      </div>

      {entry.log.calfWarning && (
        <WarningBanner level="stop">{calfWarning.title}. <Link to="/safety" className="underline">Read more</Link></WarningBanner>
      )}
      {settings.dopplerAdvised && !settings.dopplerDone && (
        <WarningBanner level="warn">
          Venous Doppler scan not done yet. <Link to="/safety" className="underline">Details</Link>
        </WarningBanner>
      )}
      {plan.banners.map((b, i) => <WarningBanner key={i} level={b.level}>{b.text}</WarningBanner>)}
      {entry.kneeCheck === 'gaveWay' && <WarningBanner level="warn">{givingWayRule.text}</WarningBanner>}

      <KneeCheck value={entry.kneeCheck} onChange={onCheck} />

      <label className="panel flex items-center gap-3">
        <input type="checkbox" className="h-6 w-6" checked={entry.yoga} onChange={(e) => update((d) => ({ ...d, yoga: e.target.checked }))} />
        <span>Yoga day: swap the evening session for the 40-minute yoga sequence</span>
      </label>

      <SessionList sessions={plan.sessions} ticked={entry.ticked} onToggle={toggleTick} />

      <h2 className="h-title mt-2">Through the day</h2>
      <Counter label="Quad sets (sets of 10)" value={entry.counters.quadSets} target={6} onChange={(v) => update((d) => ({ ...d, counters: { ...d.counters, quadSets: v } }))} />
      <Counter label="Heel props (10 min)" value={entry.counters.heelProp} target={3} onChange={(v) => update((d) => ({ ...d, counters: { ...d.counters, heelProp: v } }))} />
      <HeelPropTimer onComplete={() => update((d) => ({ ...d, counters: { ...d.counters, heelProp: d.counters.heelProp + 1 } }))} />
      <Counter label="Ankle pump sets (of 20)" value={entry.counters.anklePumps} target={6} onChange={(v) => update((d) => ({ ...d, counters: { ...d.counters, anklePumps: v } }))} />

      <Link to="/review" className="btn btn-primary w-full">Review your day and plan tomorrow</Link>

      <section className="panel">
        <button type="button" className="btn w-full" aria-expanded={showLog} onClick={() => setShowLog((s) => !s)}>
          {showLog ? 'Hide' : 'Open'} daily log (swelling, pain, walk, notes)
        </button>
        {showLog && <div className="mt-3"><DayLogForm entry={entry} onChange={update} /></div>}
      </section>
    </Page>
  )
}
