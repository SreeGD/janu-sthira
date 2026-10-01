import { useEffect, useState } from 'react'
import { msUntilMidnight, todayLocal } from '../domain/dates'

/** Today's local date; refreshes at midnight and when the tab becomes visible again. */
export function useToday(): string {
  const [today, setToday] = useState(todayLocal())
  useEffect(() => {
    const refresh = () => setToday(todayLocal())
    const t = setTimeout(refresh, msUntilMidnight() + 500)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearTimeout(t)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [today])
  return today
}
