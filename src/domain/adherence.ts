import type { DayEntry } from '../content/types'
import { buildTodayPlan } from './planEngine'

export interface DayAdherence {
  planned: number
  done: number
  ratio: number
  bySlot: Record<string, { planned: number; done: number }>
}

export function dayAdherence(entry: DayEntry, walkTarget = 15): DayAdherence {
  const plan = buildTodayPlan({ date: entry.date, yoga: entry.yoga, kneeCheck: entry.kneeCheck, walkTarget })
  const ticked = new Set(entry.ticked)
  const bySlot: DayAdherence['bySlot'] = {}
  let planned = 0
  let done = 0
  for (const s of plan.sessions) {
    for (const p of s.items) {
      if (p.status === 'skipped') continue
      planned++
      const slot = (bySlot[s.slot] ??= { planned: 0, done: 0 })
      slot.planned++
      if (ticked.has(p.item.id)) {
        done++
        slot.done++
      }
    }
  }
  return { planned, done, ratio: planned === 0 ? 0 : done / planned, bySlot }
}

/** A day is complete when all non-skipped planned items are ticked. */
export function isDayComplete(entry: DayEntry | undefined, walkTarget = 15): boolean {
  if (!entry) return false
  const a = dayAdherence(entry, walkTarget)
  return a.planned > 0 && a.done === a.planned
}
