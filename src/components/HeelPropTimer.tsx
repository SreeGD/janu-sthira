import { useEffect, useState } from 'react'

const TOTAL_MS = 10 * 60 * 1000

/** Countdown based on timestamps so it survives screen lock. Calls onComplete once at zero. */
export function HeelPropTimer({ onComplete }: { onComplete: () => void }) {
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (endsAt == null) return
    const id = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(id)
  }, [endsAt])

  useEffect(() => {
    if (endsAt != null && now >= endsAt) {
      setEndsAt(null)
      onComplete()
    }
  }, [now, endsAt, onComplete])

  const left = endsAt == null ? TOTAL_MS : Math.max(0, endsAt - now)
  const mm = String(Math.floor(left / 60000)).padStart(2, '0')
  const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, '0')

  return (
    <div className="panel flex items-center justify-between gap-3">
      <div>
        <div className="font-bold" style={{ color: 'var(--navy)' }}>Heel prop timer</div>
        <div className="text-3xl font-bold tabular-nums" aria-live="off">{mm}:{ss}</div>
      </div>
      {endsAt == null ? (
        <button type="button" className="btn btn-primary" onClick={() => { setNow(Date.now()); setEndsAt(Date.now() + TOTAL_MS) }}>Start 10 min</button>
      ) : (
        <button type="button" className="btn" onClick={() => setEndsAt(null)}>Cancel</button>
      )}
    </div>
  )
}
