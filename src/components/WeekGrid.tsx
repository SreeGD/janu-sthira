import { useMemo } from 'react'
import type { DayEntry } from '../content/types'
import { addDays, weekdayIndex, weekdayNames } from '../domain/dates'
import { dayAdherence } from '../domain/adherence'
import { cellState, gridRows, toggleSlot, type CellState } from '../domain/weekGrid'
import { emptyDay, saveDay } from '../storage/repository'

interface Props {
  weekStart: string
  today: string
  days: Record<string, DayEntry>
  walkTarget: number
  selected?: string
  onSelect?: (date: string) => void
  onChanged: () => void
}

const glyph: Record<CellState, string> = { done: '✓', partial: '◐', none: '', na: '–', future: '' }
const knee = { better: ['✓', 'calm'], puffier: ['~', 'puffier'], swollen: ['!', 'swollen'], gaveWay: ['✕', 'gave way'] } as const

export function WeekGrid({ weekStart, today, days, walkTarget, selected, onSelect, onChanged }: Props) {
  const dates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])
  const counts = useMemo(() => {
    const out: Record<string, number> = {}
    for (const r of gridRows) out[r.slot] = dates.filter((d) => cellState(d, days[d], r.slot, today, walkTarget) === 'done').length
    return out
  }, [dates, days, today, walkTarget])

  async function tap(d: string, slot: (typeof gridRows)[number]['slot']) {
    const next = toggleSlot(days[d] ?? emptyDay(d), slot, walkTarget)
    await saveDay(next)
    onChanged()
  }

  const colStyle = { gridTemplateColumns: '78px repeat(7, minmax(0, 1fr))' }
  return (
    <div role="table" aria-label="Weekly tick sheet" className="text-xs">
      <div role="row" className="grid items-end gap-1" style={colStyle}>
        <div role="columnheader" />
        {dates.map((d) => (
          <button key={d} type="button" role="columnheader" aria-label={`Select ${d}`} onClick={() => onSelect?.(d)} className="rounded-md py-1 text-center font-semibold" style={{ minHeight: 44, background: d === selected ? 'var(--navy)' : d === today ? 'color-mix(in srgb, var(--teal) 18%, transparent)' : 'transparent', color: d === selected ? 'var(--bg)' : 'var(--text)' }}>
            <div>{weekdayNames[weekdayIndex(d)]}</div>
            <div className="font-normal opacity-80">{d.slice(8)}</div>
          </button>
        ))}
      </div>

      {gridRows.map((r) => (
        <div role="row" key={r.slot} className="mt-1 grid items-center gap-1" style={colStyle}>
          <div role="rowheader" title={r.full} className="leading-tight">
            <div className="font-semibold">{r.label}</div>
            <div className="muted">{counts[r.slot]}/7</div>
          </div>
          {dates.map((d) => {
            const st = cellState(d, days[d], r.slot, today, walkTarget)
            const interactive = st !== 'future' && st !== 'na'
            const label = `${r.full}, ${weekdayNames[weekdayIndex(d)]} ${d.slice(8)}: ${{ done: 'done', partial: 'partly done', none: 'not done', na: 'not planned', future: 'upcoming' }[st]}`
            return (
              <button
                key={d}
                type="button"
                role="cell"
                aria-label={label}
                disabled={!interactive}
                onClick={() => tap(d, r.slot)}
                className="flex items-center justify-center rounded-md border text-base font-bold"
                style={{
                  minHeight: 44,
                  borderColor: st === 'done' ? 'var(--good)' : 'var(--border)',
                  background: st === 'done' ? 'color-mix(in srgb, var(--good) 22%, var(--surface))' : st === 'partial' ? 'color-mix(in srgb, var(--warn) 18%, var(--surface))' : 'var(--surface)',
                  color: st === 'done' ? 'var(--good)' : st === 'partial' ? 'var(--warn)' : 'var(--muted)',
                  opacity: st === 'future' || st === 'na' ? 0.5 : 1,
                }}
              >
                {glyph[st]}
              </button>
            )
          })}
        </div>
      ))}

      <div role="row" className="mt-2 grid items-center gap-1" style={colStyle}>
        <div role="rowheader" className="leading-tight"><div className="font-semibold">Knee</div><div className="muted">next morning</div></div>
        {dates.map((d) => {
          const k = days[d]?.kneeCheck
          return <div key={d} role="cell" aria-label={`Knee check ${d}: ${k ? knee[k][1] : 'not recorded'}`} className="text-center text-base font-bold" style={{ color: k === 'better' ? 'var(--good)' : k === 'puffier' ? 'var(--warn)' : k ? 'var(--bad)' : 'var(--muted)' }}>{k ? knee[k][0] : '·'}</div>
        })}
      </div>
      <div role="row" className="grid items-center gap-1" style={colStyle}>
        <div role="rowheader" className="leading-tight"><div className="font-semibold">Gave way?</div></div>
        {dates.map((d) => {
          const e = days[d]
          const y = !!e && (e.log.givingWay.length > 0 || e.kneeCheck === 'gaveWay')
          return <div key={d} role="cell" aria-label={`Giving way ${d}: ${y ? 'yes' : e ? 'no' : 'not recorded'}`} className="py-1 text-center font-bold" style={{ color: y ? 'var(--bad)' : 'var(--muted)' }}>{y ? 'Y' : e ? 'N' : '·'}</div>
        })}
      </div>
      <div role="row" className="grid items-center gap-1" style={colStyle}>
        <div role="rowheader" className="leading-tight"><div className="font-semibold">Bend</div><div className="muted">heel-butt cm</div></div>
        {dates.map((d) => {
          const v = days[d]?.log.heelToButtockCm
          return <div key={d} role="cell" aria-label={`Bend measurement ${d}: ${v != null ? v + ' cm' : 'not measured'}`} className="py-1 text-center font-semibold">{v ?? '·'}</div>
        })}
      </div>
      <div role="row" className="mt-1 grid items-center gap-1 border-t pt-2" style={{ ...colStyle, borderColor: 'var(--border)' }}>
        <div role="rowheader" className="font-semibold">Day total</div>
        {dates.map((d) => {
          const e = days[d]
          const a = e && d <= today ? dayAdherence(e, walkTarget) : undefined
          return <div key={d} role="cell" className="text-center font-semibold">{a && a.done > 0 ? `${Math.round(a.ratio * 100)}%` : d > today ? '' : '–'}</div>
        })}
      </div>
      <p className="muted mt-2">Tap a box to tick or clear that whole session. ◐ = partly done, – = not planned that day.</p>
    </div>
  )
}
