import type { DayEntry, SessionSlot } from '../content/types'
import { buildTodayPlan } from './planEngine'

export type CellState = 'done' | 'partial' | 'none' | 'na' | 'future'

export const gridRows: { slot: SessionSlot; label: string; full: string }[] = [
  { slot: 'morning', label: 'Morning', full: 'Morning stretch + walk' },
  { slot: 'midmorning', label: 'Mid-AM', full: 'Mid-morning heel prop + quad sets' },
  { slot: 'lunch', label: 'Lunch', full: 'Lunch strength' },
  { slot: 'afternoon', label: 'Afternoon', full: 'Heel prop after lunch, afternoon quad sets + ankle pumps' },
  { slot: 'evening', label: 'Evening', full: 'Evening (A band / B core / yoga)' },
  { slot: 'bedtime', label: 'Bedtime', full: 'Bedtime quad sets + heel prop' },
]

/** Item ids planned (not skipped) for one session slot on one day. */
export function slotItemIds(date: string, entry: DayEntry | undefined, slot: SessionSlot, walkTarget: number): string[] {
  const plan = buildTodayPlan({ date, yoga: entry?.yoga ?? false, kneeCheck: entry?.kneeCheck, walkTarget })
  return plan.sessions.filter((s) => s.slot === slot).flatMap((s) => s.items.filter((i) => i.status !== 'skipped').map((i) => i.item.id))
}

export function cellState(date: string, entry: DayEntry | undefined, slot: SessionSlot, today: string, walkTarget: number): CellState {
  if (date > today) return 'future'
  const ids = slotItemIds(date, entry, slot, walkTarget)
  if (ids.length === 0) return 'na'
  const ticked = new Set(entry?.ticked ?? [])
  const done = ids.filter((id) => ticked.has(id)).length
  return done === 0 ? 'none' : done === ids.length ? 'done' : 'partial'
}

/** Tapping a cell completes the whole session for that day, or clears it if already complete. */
export function toggleSlot(entry: DayEntry, slot: SessionSlot, walkTarget: number): DayEntry {
  const ids = slotItemIds(entry.date, entry, slot, walkTarget)
  const ticked = new Set(entry.ticked)
  const allDone = ids.length > 0 && ids.every((id) => ticked.has(id))
  for (const id of ids) {
    if (allDone) ticked.delete(id)
    else ticked.add(id)
  }
  return { ...entry, ticked: [...ticked] }
}
