import { useState } from 'react'
import type { DayEntry } from '../content/types'

interface Props {
  entry: DayEntry
  onChange: (fn: (d: DayEntry) => DayEntry) => void
}

export function DayLogForm({ entry, onChange }: Props) {
  const [note, setNote] = useState('')
  const log = entry.log
  const setLog = (patch: Partial<DayEntry['log']>) => onChange((d) => ({ ...d, log: { ...d.log, ...patch } }))
  const num = (v: string) => (v === '' ? undefined : Number(v))

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-sm font-semibold">
        Swelling (0 none – 3 clearly swollen)
        <select value={log.swelling ?? ''} onChange={(e) => setLog({ swelling: num(e.target.value) })}>
          <option value="">–</option>
          <option value="0">0 none</option><option value="1">1 slight</option><option value="2">2 moderate</option><option value="3">3 clearly swollen</option>
        </select>
      </label>
      <label className="block text-sm font-semibold">
        Pain (0–10)
        <input type="number" min={0} max={10} inputMode="numeric" value={log.pain ?? ''} onChange={(e) => setLog({ pain: num(e.target.value) })} />
      </label>
      <label className="block text-sm font-semibold">
        Walk minutes
        <input type="number" min={0} max={240} inputMode="numeric" value={log.walkMin ?? ''} onChange={(e) => setLog({ walkMin: num(e.target.value) })} />
      </label>
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input type="checkbox" className="h-6 w-6" checked={!!log.calfWarning} onChange={(e) => setLog({ calfWarning: e.target.checked })} />
        Calf painful, tender, warm, red, tight or swollen today
      </label>
      <div>
        <div className="text-sm font-semibold">Giving-way events ({log.givingWay.length})</div>
        <ul className="my-1 text-sm">
          {log.givingWay.map((g, i) => (
            <li key={i} className="flex justify-between gap-2">
              <span>{g.time ? `${g.time} · ` : ''}{g.note || '(no note)'}</span>
              <button type="button" className="chip" onClick={() => setLog({ givingWay: log.givingWay.filter((_, j) => j !== i) })}>remove</button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input type="text" placeholder="What were you doing?" value={note} onChange={(e) => setNote(e.target.value)} aria-label="Giving-way note" />
          <button type="button" className="btn" onClick={() => { setLog({ givingWay: [...log.givingWay, { time: new Date().toTimeString().slice(0, 5), note }] }); setNote('') }}>Add</button>
        </div>
      </div>
      <label className="block text-sm font-semibold">
        Notes
        <textarea rows={3} value={log.notes ?? ''} onChange={(e) => setLog({ notes: e.target.value })} />
      </label>
    </div>
  )
}
