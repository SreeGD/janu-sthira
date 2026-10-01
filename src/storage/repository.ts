import type { DayEntry, Settings, WeekReview } from '../content/types'
import { todayLocal } from '../domain/dates'
import { kvDel, kvGet, kvKeys, kvSet } from './db'

const DAY = 'day:'
const WEEK = 'week:'
const SETTINGS = 'settings'

export function defaultSettings(): Settings {
  return {
    startDate: todayLocal(),
    walkTarget: 15,
    walkMin: 15,
    walkMax: 40,
    theme: 'system',
    dopplerAdvised: false,
    dopplerDone: false,
    checkpointNotes: {},
  }
}

export function emptyDay(date: string): DayEntry {
  return {
    date,
    yoga: false,
    ticked: [],
    counters: { quadSets: 0, heelProp: 0, anklePumps: 0 },
    log: { givingWay: [] },
    meals: [],
    updatedAt: new Date().toISOString(),
  }
}

export async function getSettings(): Promise<Settings> {
  const s = await kvGet<Settings>(SETTINGS)
  if (s) return { ...defaultSettings(), ...s }
  const fresh = defaultSettings()
  await kvSet(SETTINGS, fresh)
  return fresh
}

export async function saveSettings(s: Settings): Promise<void> {
  await kvSet(SETTINGS, s)
}

export async function getDay(date: string): Promise<DayEntry> {
  const d = await kvGet<DayEntry>(DAY + date)
  return d ? { ...emptyDay(date), ...d, log: { ...d.log, givingWay: d.log?.givingWay ?? [] } } : emptyDay(date)
}

export async function saveDay(entry: DayEntry): Promise<void> {
  await kvSet(DAY + entry.date, { ...entry, updatedAt: new Date().toISOString() })
}

export async function listDays(): Promise<Record<string, DayEntry>> {
  const out: Record<string, DayEntry> = {}
  for (const k of await kvKeys()) {
    if (k.startsWith(DAY)) {
      const d = await kvGet<DayEntry>(k)
      if (d) out[k.slice(DAY.length)] = d
    }
  }
  return out
}

export async function clearAll(): Promise<void> {
  for (const k of await kvKeys()) await kvDel(k)
}

export async function getWeekReview(weekStart: string): Promise<WeekReview> {
  return (await kvGet<WeekReview>(WEEK + weekStart)) ?? { weekStart }
}

export async function saveWeekReview(r: WeekReview): Promise<void> {
  await kvSet(WEEK + r.weekStart, { ...r, savedAt: new Date().toISOString() })
}

export async function listWeekReviews(): Promise<Record<string, WeekReview>> {
  const out: Record<string, WeekReview> = {}
  for (const k of await kvKeys()) {
    if (k.startsWith(WEEK)) {
      const w = await kvGet<WeekReview>(k)
      if (w) out[k.slice(WEEK.length)] = w
    }
  }
  return out
}
