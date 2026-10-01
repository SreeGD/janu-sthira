import type { DayEntry } from '../content/types'
import { addDays } from './dates'
import { isDayComplete } from './adherence'

export interface Streaks {
  current: number
  best: number
}

/** Current streak counts back from today (today may still be in progress, so it is not required). */
export function computeStreaks(days: Record<string, DayEntry>, today: string): Streaks {
  const dates = Object.keys(days).sort()
  let best = 0
  let run = 0
  let prev: string | undefined
  for (const d of dates) {
    if (isDayComplete(days[d])) {
      run = prev && addDays(prev, 1) === d ? run + 1 : 1
      prev = d
      best = Math.max(best, run)
    } else {
      run = 0
      prev = undefined
    }
  }
  let current = 0
  let cursor = isDayComplete(days[today]) ? today : addDays(today, -1)
  while (isDayComplete(days[cursor])) {
    current++
    cursor = addDays(cursor, -1)
  }
  return { current, best: Math.max(best, current) }
}
