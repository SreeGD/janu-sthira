import { Bar } from './ui'

interface Props {
  label: string
  value: number
  target: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}

export function Counter({ label, value, target, step = 1, onChange }: Props) {
  return (
    <div className="panel flex flex-col gap-2">
      <Bar value={value} max={target} label={label} />
      <div className="flex gap-2">
        <button type="button" className="btn flex-1" aria-label={`Remove one ${label}`} onClick={() => onChange(Math.max(0, value - step))}>−</button>
        <button type="button" className="btn btn-primary flex-[3]" aria-label={`Add one ${label}`} onClick={() => onChange(value + step)}>+ {label}</button>
      </div>
    </div>
  )
}
