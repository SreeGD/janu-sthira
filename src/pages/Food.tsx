import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { dailyPattern, eatLess, flavourTip, mealsForDay, nutrients, plateGuide, powderNote, powderRoutine, proteinReference, proteinTarget, rotation, soups, waterGoalL } from '../content/food'
import { Bar, Page, Section } from '../components/ui'
import { weekdayIndex } from '../domain/dates'
import { proteinTotal } from '../domain/protein'
import { useDayEntry } from '../hooks/useDayEntry'
import { useToday } from '../hooks/useToday'

export default function Food() {
  const today = useToday()
  const { entry, update } = useDayEntry(today)
  const idx = weekdayIndex(today)
  const meals = useMemo(() => mealsForDay(idx), [idx])
  const total = proteinTotal(meals, entry.meals)
  const [open, setOpen] = useState<string | null>(null)
  const toggle = (k: string) => update((d) => ({ ...d, meals: d.meals.includes(k) ? d.meals.filter((x) => x !== k) : [...d.meals, k] }))

  return (
    <Page title="Food for a stronger knee">
      <p className="muted -mt-2 text-sm">Strictly vegetarian · no onion, garlic or root vegetables</p>
      <Link to="/shopping" className="btn btn-primary w-full">Weekly shopping list: view and share</Link>
      <Link to="/supplements" className="btn w-full">Supplements: vegetarian options</Link>
      <Bar value={total} max={proteinTarget} label="Protein today (g)" />
      <Bar value={entry.waterL ?? 0} max={waterGoalL} label="Water (litres)" />
      <div className="flex gap-2">
        <button className="btn flex-1" type="button" onClick={() => update((d) => ({ ...d, waterL: Math.max(0, (d.waterL ?? 0) - 0.25) }))}>− 250 ml</button>
        <button className="btn btn-primary flex-1" type="button" onClick={() => update((d) => ({ ...d, waterL: (d.waterL ?? 0) + 0.25 }))}>+ 250 ml</button>
      </div>

      <Section title={`Today's meals (${rotation[idx].day})`}>
        <ul>
          {meals.map((m) => (
            <li key={m.key} className="flex items-start gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
              <input id={`meal-${m.key}`} type="checkbox" className="mt-1 h-6 w-6 shrink-0" checked={entry.meals.includes(m.key)} onChange={() => toggle(m.key)} />
              <label htmlFor={`meal-${m.key}`} className="flex-1">
                <span className="font-semibold">{m.slot}</span> <span className="chip">~{m.proteinG} g</span>
                <span className="muted block text-sm">{m.dishes}</span>
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Plate guide"><p className="text-sm">{plateGuide}</p></Section>

      <Section title="7-day rotation">
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Snack</th><th>Dinner</th></tr></thead>
            <tbody>
              {rotation.map((r, i) => (
                <tr key={r.day} style={{ fontWeight: i === idx ? 700 : 400 }}>
                  <td>{r.day}</td><td>{r.breakfast}</td><td>{r.lunch}</td><td>{r.snack}</td><td>{r.dinner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted mt-2 text-sm">Add a bowl of soup before dinner 4-5 days a week.</p>
      </Section>

      <Section title="What the knee needs">
        <ul className="text-sm">
          {nutrients.map((n) => (
            <li key={n.need} className="mb-2"><strong>{n.need}.</strong> {n.why}<span className="muted block">{n.sources}</span></li>
          ))}
        </ul>
        <p className="mt-2 text-sm">{flavourTip}</p>
      </Section>

      <Section title="Protein quick reference">
        <table><tbody>{proteinReference.map(([f, p]) => <tr key={f}><td>{f}</td><td>{p}</td></tr>)}</tbody></table>
      </Section>

      <Section title="Eat less of">
        <ul className="list-disc pl-5 text-sm">{eatLess.map((e) => <li key={e}>{e}</li>)}</ul>
      </Section>

      <Section title="Soups for recovery">
        {soups.map((s) => (
          <div key={s.name} className="mb-2">
            <button type="button" className="btn w-full !justify-between" aria-expanded={open === s.name} onClick={() => setOpen(open === s.name ? null : s.name)}>
              <span>{s.name}</span><span className="muted text-xs">{s.note}</span>
            </button>
            {open === s.name && (
              <div className="mt-2 text-sm">
                <p><strong>You need:</strong> {s.need}</p>
                <ol className="mt-1 list-decimal pl-5">{s.steps.map((x) => <li key={x}>{x}</li>)}</ol>
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="Daily powder routine">
        <table><tbody>{powderRoutine.map(([w, a]) => <tr key={w}><td>{w}</td><td>{a}</td></tr>)}</tbody></table>
        <p className="muted mt-2 text-sm">{powderNote}</p>
      </Section>
      <p className="muted text-sm">Daily pattern slots: {dailyPattern.map((d) => d.slot).join(', ')}. Protein estimates are from your booklet.</p>
    </Page>
  )
}
