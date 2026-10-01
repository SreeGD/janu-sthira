import { kneeCheckRules } from '../content/adjustments'
import type { KneeCheck as Check } from '../content/types'

const mark: Record<Check, { icon: string; color: string }> = {
  better: { icon: '✓', color: 'var(--good)' },
  puffier: { icon: '~', color: 'var(--warn)' },
  swollen: { icon: '!', color: 'var(--bad)' },
  gaveWay: { icon: '✕', color: 'var(--bad)' },
}

export function KneeCheck({ value, onChange }: { value?: Check; onChange: (v: Check) => void }) {
  return (
    <fieldset className="panel">
      <legend className="px-1 font-bold" style={{ color: 'var(--navy)' }}>Morning knee check</legend>
      <p className="muted mb-2 text-sm">How does the knee feel compared with yesterday?</p>
      <div className="flex flex-col gap-2">
        {kneeCheckRules.map((r) => {
          const selected = value === r.outcome
          return (
            <button
              key={r.outcome}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(r.outcome)}
              className="btn !justify-start !text-left"
              style={{ borderColor: selected ? mark[r.outcome].color : undefined, borderWidth: selected ? 2 : 1 }}
            >
              <span aria-hidden style={{ color: mark[r.outcome].color, fontWeight: 800, width: 18 }}>{mark[r.outcome].icon}</span>
              <span>
                {r.label}
                {selected && <span className="muted block text-sm font-normal">{r.whatToDo}</span>}
              </span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
