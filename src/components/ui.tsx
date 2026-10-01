import type { ReactNode } from 'react'

export function Page({ title, children, back }: { title: string; children: ReactNode; back?: ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-28 pt-3">
      {back}
      <h1 className="h-title mb-3">{title}</h1>
      <div className="flex flex-col gap-3">{children}</div>
    </main>
  )
}

export function WarningBanner({ level, children }: { level: 'info' | 'warn' | 'stop'; children: ReactNode }) {
  const icon = level === 'stop' ? 'STOP: ' : level === 'warn' ? 'Note: ' : ''
  return (
    <div role={level === 'info' ? 'status' : 'alert'} className={`banner banner-${level}`}>
      {icon && <strong>{icon}</strong>}
      {children}
    </div>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="panel">
      <h2 className="mb-2 font-bold" style={{ color: 'var(--navy)' }}>{title}</h2>
      {children}
    </section>
  )
}

export function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="muted">{value} / {max}</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: 'var(--border)' }} role="progressbar" aria-valuenow={value} aria-valuemax={max} aria-label={label}>
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: 'var(--teal)' }} />
      </div>
    </div>
  )
}

export function Ring({ value, max, size = 76, label }: { value: number; max: number; size?: number; label: string }) {
  const r = (size - 10) / 2
  const c = 2 * Math.PI * r
  const pct = max === 0 ? 0 : Math.min(1, value / max)
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${Math.round(pct * 100)} percent`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="8" />
        <circle className="ring-fill" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">{Math.round(pct * 100)}%</div>
    </div>
  )
}
