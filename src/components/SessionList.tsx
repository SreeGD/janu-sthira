import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cardByCode } from '../content/cards'
import type { PlannedSession } from '../domain/planEngine'

const slotColor: Record<string, string> = {
  morning: '#a85f0f', midmorning: '#4a6785', lunch: '#1f7a7a', afternoon: '#4a6785', evening: '#5b4a8a', bedtime: '#3c4a6b',
}

function chairTextFor(codes: string[]): string | undefined {
  for (const c of codes) {
    const t = cardByCode.get(c)?.chair
    if (t) return t
  }
  return undefined
}

interface Props {
  sessions: PlannedSession[]
  ticked: string[]
  onToggle: (id: string) => void
  chairMode?: boolean
}

export function SessionList({ sessions, ticked, onToggle, chairMode }: Props) {
  const incomplete = (s: PlannedSession) => s.items.some((i) => i.status !== 'skipped' && !ticked.includes(i.item.id))
  const firstOpen = sessions.find(incomplete)?.id
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const isOpen = (s: PlannedSession) => open[s.id] ?? (s.id === firstOpen)
  return (
    <>
      {sessions.map((s) => {
        const active = s.items.filter((i) => i.status !== 'skipped')
        const done = active.filter((i) => ticked.includes(i.item.id)).length
        return (
          <section key={s.id} aria-label={s.title}>
            <button
              type="button"
              className="session-head w-full text-left"
              style={{ background: slotColor[s.slot], borderRadius: isOpen(s) ? '12px 12px 0 0' : 12, minHeight: 56 }}
              aria-expanded={isOpen(s)}
              onClick={() => setOpen((o) => ({ ...o, [s.id]: !isOpen(s) }))}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-bold"><span className="chev mr-1" aria-hidden>▸</span>{s.title}</h2>
                <span className="text-sm" aria-label={`${done} of ${active.length} done`}>{done === active.length && active.length > 0 ? '✓ ' : ''}{done}/{active.length}</span>
              </div>
              <div className="text-xs opacity-90">{s.subtitle}</div>
            </button>
            {isOpen(s) && <ul className="panel" style={{ borderRadius: '0 0 12px 12px', padding: 0 }}>
              {s.items.map((p) => {
                const skipped = p.status === 'skipped'
                const checked = ticked.includes(p.item.id)
                const inputId = `tick-${s.id}-${p.item.id}`
                return (
                  <li key={p.item.id} className="flex items-start gap-3 px-3 py-2" style={{ borderTop: '1px solid var(--border)', opacity: skipped ? 0.55 : 1 }}>
                    <input
                      id={inputId}
                      type="checkbox"
                      className="mt-1 h-6 w-6 shrink-0"
                      checked={checked}
                      disabled={skipped}
                      onChange={() => onToggle(p.item.id)}
                    />
                    <label htmlFor={inputId} className="min-w-0 flex-1 text-[15px]" style={{ textDecoration: checked ? 'line-through' : undefined }}>
                      {p.item.minutes && <span className="muted mr-1 text-xs">{p.item.minutes} min</span>}
                      {p.item.text}
                      {p.amount && <span className="muted block text-sm">{p.amount}</span>}
                      {p.status === 'halved' && <span className="chip ml-1">halved</span>}
                      {skipped && <span className="chip ml-1">skip today</span>}
                      {chairMode && !skipped && chairTextFor(p.item.cardCodes) && (
                        <span className="mt-1 block rounded-md px-2 py-1 text-sm" style={{ background: 'color-mix(in srgb, var(--teal) 10%, var(--surface))' }}>
                          <strong style={{ color: 'var(--teal)' }}>🪑 On a chair:</strong> {chairTextFor(p.item.cardCodes)}
                        </span>
                      )}
                    </label>
                    <span className="flex shrink-0 flex-wrap justify-end gap-1">
                      {p.item.cardCodes.map((c) => (
                        <Link key={c} to={`/cards/${c}`} className="chip flex items-center" aria-label={`Open card ${c}`}>{c}</Link>
                      ))}
                    </span>
                  </li>
                )
              })}
            </ul>}
          </section>
        )
      })}
    </>
  )
}
