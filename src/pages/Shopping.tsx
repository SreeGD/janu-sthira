import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { shoppingList, shoppingNote } from '../content/shopping'
import { Bar, Page, Section } from '../components/ui'
import { addDays, parseDate, weekdayIndex } from '../domain/dates'
import { weekStartOf } from '../domain/review'
import { allItemIds, defaultShoppingWeek, shoppingText } from '../domain/shopping'
import { useSettings } from '../hooks/useSettings'
import { useToday } from '../hooks/useToday'

const fmt = (d: string) => parseDate(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

export default function Shopping() {
  const today = useToday()
  const { settings, update } = useSettings()
  const thisWeek = weekStartOf(today)
  const [weekStart, setWeekStart] = useState(defaultShoppingWeek(thisWeek, weekdayIndex(today)))
  const [onlyRemaining, setOnlyRemaining] = useState(true)
  const [msg, setMsg] = useState('')

  const checked = settings.shoppingChecked?.[weekStart] ?? []
  const total = useMemo(() => allItemIds().length, [])
  const text = shoppingText(weekStart, checked, onlyRemaining)

  const setChecked = (ids: string[]) => update({ shoppingChecked: { ...settings.shoppingChecked, [weekStart]: ids } })
  const toggle = (id: string) => setChecked(checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id])

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Weekly shopping list', text })
        setMsg('Shared.')
        return
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
    }
    await copy()
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setMsg('Copied to clipboard. Paste it into any chat.')
    } catch {
      setMsg('Could not copy. Use the WhatsApp button or select the text below.')
    }
  }

  return (
    <Page title="Weekly shopping list" back={<Link to="/food" className="muted mb-2 inline-flex items-center text-sm">← Food</Link>}>
      <div className="flex items-center justify-between gap-2">
        <button type="button" className="btn" aria-label="Previous week" onClick={() => setWeekStart(addDays(weekStart, -7))}>←</button>
        <div className="text-center text-sm font-semibold">Week of {fmt(weekStart)}{weekStart === thisWeek ? ' (this week)' : weekStart === addDays(thisWeek, 7) ? ' (next week)' : ''}</div>
        <button type="button" className="btn" aria-label="Next week" onClick={() => setWeekStart(addDays(weekStart, 7))}>→</button>
      </div>

      <Bar value={checked.length} max={total} label="Bought" />

      <div className="panel flex flex-col gap-2">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" className="h-6 w-6" checked={onlyRemaining} onChange={(e) => setOnlyRemaining(e.target.checked)} />
          Share only what is still to buy
        </label>
        <div className="flex gap-2">
          <button type="button" className="btn btn-primary flex-1" onClick={share}>Share list</button>
          <button type="button" className="btn flex-1" onClick={copy}>Copy</button>
          <a className="btn flex-1" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
        {msg && <p role="status" className="text-sm">{msg}</p>}
      </div>

      {shoppingList.map((c) => {
        const done = c.items.filter((i) => checked.includes(i.id)).length
        return (
          <Section key={c.id} title={`${c.title} (${done}/${c.items.length})`}>
            <ul>
              {c.items.map((i) => (
                <li key={i.id} className="flex items-start gap-3 py-1.5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <input id={`buy-${i.id}`} type="checkbox" className="mt-1 h-6 w-6 shrink-0" checked={checked.includes(i.id)} onChange={() => toggle(i.id)} />
                  <label htmlFor={`buy-${i.id}`} className="flex-1 text-[15px]" style={{ textDecoration: checked.includes(i.id) ? 'line-through' : undefined, opacity: checked.includes(i.id) ? 0.6 : 1 }}>
                    <span className="font-semibold">{i.name}</span> <span className="muted">· {i.qty}</span>
                    {i.note && <span className="muted block text-xs">{i.note}</span>}
                  </label>
                </li>
              ))}
            </ul>
          </Section>
        )
      })}

      <div className="flex gap-2">
        <button type="button" className="btn flex-1" onClick={() => setChecked([])}>Clear ticks</button>
        <button type="button" className="btn flex-1" onClick={() => setChecked(allItemIds())}>Tick all</button>
      </div>
      <p className="muted text-sm">{shoppingNote}</p>
    </Page>
  )
}
