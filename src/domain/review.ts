import type { DayEntry, Settings } from '../content/types'
import { mealsForDay } from '../content/food'
import { addDays, weekdayIndex } from './dates'
import { dayAdherence, isDayComplete } from './adherence'
import { proteinTotal } from './protein'
import { nextWalkTarget } from './walkTarget'

export interface DayStats {
  ratio: number
  done: number
  planned: number
  walkMin?: number
  swelling?: number
  pain?: number
  kneeCheck?: DayEntry['kneeCheck']
  protein: number
  counters: DayEntry['counters']
  givingWay: number
  calfWarning: boolean
}

export function dayStats(entry: DayEntry, walkTarget = 15): DayStats {
  const a = dayAdherence(entry, walkTarget)
  return {
    ratio: a.ratio, done: a.done, planned: a.planned,
    walkMin: entry.log.walkMin, swelling: entry.log.swelling, pain: entry.log.pain, kneeCheck: entry.kneeCheck,
    protein: proteinTotal(mealsForDay(weekdayIndex(entry.date)), entry.meals),
    counters: entry.counters, givingWay: entry.log.givingWay.length, calfWarning: !!entry.log.calfWarning,
  }
}

export function weekStartOf(date: string): string {
  return addDays(date, -weekdayIndex(date))
}

export interface WeekStats {
  weekStart: string
  daysLogged: number
  daysComplete: number
  avgAdherence: number
  totalWalkMin: number
  walkDays: number
  avgSwelling?: number
  avgPain?: number
  checks: { better: number; puffier: number; swollen: number; gaveWay: number }
  givingWay: number
  calfWarnings: number
  avgProtein: number
  best?: string
  worst?: string
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : undefined)

export function weekStats(days: Record<string, DayEntry>, weekStart: string, walkTarget = 15): WeekStats {
  const dates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const entries = dates.map((d) => days[d]).filter(Boolean) as DayEntry[]
  const ratios = dates.map((d) => (days[d] ? dayAdherence(days[d], walkTarget).ratio : 0))
  const checks = { better: 0, puffier: 0, swollen: 0, gaveWay: 0 }
  for (const e of entries) if (e.kneeCheck) checks[e.kneeCheck]++
  const walks = entries.map((e) => e.log.walkMin).filter((n): n is number => n != null && n > 0)
  const proteins = entries.map((e) => dayStats(e, walkTarget).protein).filter((n) => n > 0)
  let best: string | undefined, worst: string | undefined
  if (entries.length) {
    const idx = ratios.map((r, i) => [r, i] as const).filter(([, i]) => days[dates[i]])
    best = dates[idx.reduce((a, b) => (b[0] > a[0] ? b : a))[1]]
    worst = dates[idx.reduce((a, b) => (b[0] < a[0] ? b : a))[1]]
  }
  return {
    weekStart,
    daysLogged: entries.length,
    daysComplete: entries.filter((e) => isDayComplete(e, walkTarget)).length,
    avgAdherence: ratios.reduce((a, b) => a + b, 0) / 7,
    totalWalkMin: walks.reduce((a, b) => a + b, 0),
    walkDays: walks.length,
    avgSwelling: avg(entries.map((e) => e.log.swelling).filter((n): n is number => n != null)),
    avgPain: avg(entries.map((e) => e.log.pain).filter((n): n is number => n != null)),
    checks,
    givingWay: entries.reduce((n, e) => n + e.log.givingWay.length, 0),
    calfWarnings: entries.filter((e) => e.log.calfWarning).length,
    avgProtein: Math.round(avg(proteins) ?? 0),
    best, worst,
  }
}

export interface Suggestion {
  level: 'info' | 'warn' | 'stop'
  text: string
}

export interface NextWeekSuggestion {
  walkTarget: number
  items: Suggestion[]
}

/** Rule-based suggestions for next week, from this week's numbers. */
export function suggestNextWeek(stats: WeekStats, settings: Settings, nextCheckpointInDays?: number, nextCheckpointLabel?: string): NextWeekSuggestion {
  const items: Suggestion[] = []
  const { checks } = stats
  const troubled = checks.puffier + checks.swollen
  let walkTarget = settings.walkTarget

  if (stats.calfWarnings > 0) items.push({ level: 'stop', text: 'You logged calf symptoms this week. Make sure a doctor has checked them, and get the Doppler scan done before building up.' })
  if (stats.givingWay > 0 || checks.gaveWay > 0) {
    walkTarget = nextWalkTarget(settings.walkTarget, 'gaveWay', settings.walkMin, settings.walkMax)
    items.push({ level: 'stop', text: `The knee gave way ${stats.givingWay || checks.gaveWay} time(s). Hold the walk at ${walkTarget} min, skip pivoting and uneven ground, and book a review with your physio or surgeon.` })
  } else if (checks.swollen > 0) {
    walkTarget = settings.walkMin
    items.push({ level: 'warn', text: `Swollen day(s) this week. Restart the walk at ${walkTarget} min and build back by 5 min only after calm mornings.` })
  } else if (troubled >= 2) {
    items.push({ level: 'warn', text: `${troubled} puffy mornings. Hold the walk at ${walkTarget} min next week instead of increasing.` })
  } else if (stats.avgAdherence >= 0.7 && checks.better >= 3) {
    walkTarget = Math.min(settings.walkMax, settings.walkTarget + 5)
    items.push({ level: 'info', text: `Good, calm week. You can aim for a ${walkTarget} min walk (target ${settings.walkMax}).` })
  } else if (stats.daysLogged < 4) {
    items.push({ level: 'info', text: 'Few days logged. Keep the walk where it is and try to do the knee check every morning so the plan can adjust.' })
  }

  if (stats.avgAdherence < 0.6) items.push({ level: 'info', text: 'Adherence was under 60%. Pick the two sessions that matter most (morning stretch + walk, and quad sets / heel props) and protect those first.' })
  else if (stats.avgAdherence >= 0.85) items.push({ level: 'info', text: 'Excellent consistency. Keep the same rhythm.' })
  if (stats.avgProtein > 0 && stats.avgProtein < 85) items.push({ level: 'info', text: `Protein averaged about ${stats.avgProtein} g on logged days (target about 105 g). Add paneer, curd or soya at the weakest meal.` })
  if (settings.dopplerAdvised && !settings.dopplerDone) items.push({ level: 'warn', text: 'Venous Doppler scan is still not done. Book it this week.' })
  if (nextCheckpointInDays != null && nextCheckpointInDays <= 14 && nextCheckpointInDays >= 0)
    items.push({ level: 'info', text: `${nextCheckpointLabel} is in ${nextCheckpointInDays} days. Note your questions and any giving-way events for the visit.` })

  return { walkTarget, items }
}
