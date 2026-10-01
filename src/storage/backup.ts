import type { DayEntry, DayReview, Settings, WeekReview } from '../content/types'
import { kvSet } from './db'
import { clearAll, getSettings, listDays, listWeekReviews, saveSettings } from './repository'

export interface BackupFile {
  app: 'jaanu-setu'
  version: 1
  exportedAt: string
  settings: Settings
  days: Record<string, DayEntry>
  weeks?: Record<string, WeekReview>
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export async function exportBackup(): Promise<BackupFile> {
  const settings = await getSettings()
  const days = await listDays()
  const weeks = await listWeekReviews()
  const file: BackupFile = { app: 'jaanu-setu', version: 1, exportedAt: new Date().toISOString(), settings: { ...settings, backupLastAt: new Date().toISOString() }, days, weeks }
  await saveSettings(file.settings)
  return file
}

/** Validates against contracts/backup-file.schema.json. Throws with a readable message. */
export function validateBackup(data: unknown): BackupFile {
  const d = data as Partial<BackupFile> | null
  if (!d || typeof d !== 'object') throw new Error('Not a backup file.')
  if (d.app !== 'jaanu-setu') throw new Error('This file is not a Jaanu Setu backup.')
  if (typeof d.version !== 'number' || d.version < 1) throw new Error('Unknown backup version.')
  if (typeof d.exportedAt !== 'string') throw new Error('Backup is missing its export date.')
  if (!d.settings || typeof d.settings !== 'object') throw new Error('Backup is missing settings.')
  if (!d.days || typeof d.days !== 'object') throw new Error('Backup is missing days.')
  for (const [k, v] of Object.entries(d.days)) {
    if (!DATE_RE.test(k)) throw new Error(`Invalid date key: ${k}`)
    const e = v as Partial<DayEntry>
    if (!e || typeof e !== 'object' || !Array.isArray(e.ticked) || !e.counters || !e.log) throw new Error(`Invalid entry for ${k}`)
  }
  if (d.weeks) for (const k of Object.keys(d.weeks)) if (!DATE_RE.test(k)) throw new Error(`Invalid week key: ${k}`)
  return d as BackupFile
}

export async function importBackup(json: string): Promise<number> {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('File is not valid JSON.')
  }
  const file = validateBackup(parsed)
  await clearAll()
  await saveSettings(file.settings)
  for (const e of Object.values(file.days)) await kvSetDayRaw(e)
  for (const w of Object.values(file.weeks ?? {})) await kvSetWeekRaw(w)
  return Object.keys(file.days).length
}

// ---------- merge import (for moving between devices) ----------

export interface LocalData {
  settings: Settings
  days: Record<string, DayEntry>
  weeks: Record<string, WeekReview>
}

export interface ImportSummary {
  exportedAt: string
  daysInFile: number
  daysNew: number
  daysMerged: number
  daysSame: number
  weeksInFile: number
  weeksChanged: number
  settingsFromFile: boolean
}

const latest = (days: Record<string, DayEntry>) =>
  Object.values(days).reduce((m, d) => (d.updatedAt > m ? d.updatedAt : m), '')

const isDef = <T,>(v: T | undefined | null): v is T => v !== undefined && v !== null

/** Text from two devices: keep both if they differ; idempotent when one already contains the other. */
export function mergeText(newer?: string, older?: string): string | undefined {
  const a = newer?.trim() ? newer : undefined
  const b = older?.trim() ? older : undefined
  if (!a) return b
  if (!b) return a
  if (a.includes(b)) return a
  if (b.includes(a)) return b
  return `${a}\n---\n${b}`
}

const pickDef = <T,>(newer: T | undefined, older: T | undefined): T | undefined => (isDef(newer) ? newer : older)
const union = <T,>(a: T[], b: T[]): T[] => [...new Set([...a, ...b])]

function mergeReview(n?: DayReview, o?: DayReview): DayReview | undefined {
  if (!n && !o) return undefined
  return {
    wentWell: mergeText(n?.wentWell, o?.wentWell),
    hard: mergeText(n?.hard, o?.hard),
    learned: mergeText(n?.learned, o?.learned),
    tomorrow: mergeText(n?.tomorrow, o?.tomorrow),
    mood: pickDef(n?.mood, o?.mood),
    savedAt: [n?.savedAt, o?.savedAt].filter(isDef).sort().pop(),
  }
}

/** Field-level merge of one day. Nothing from either device is dropped: ticks and meals are unioned,
 *  counters take the larger value, text is combined, and single answers prefer the more recently saved side. */
export function mergeDay(x: DayEntry, y: DayEntry): DayEntry {
  const [n, o] = x.updatedAt >= y.updatedAt ? [x, y] : [y, x]
  const seen = new Set<string>()
  const givingWay = [...n.log.givingWay, ...o.log.givingWay].filter((g) => {
    const k = `${g.time ?? ''}|${g.note}`
    return seen.has(k) ? false : (seen.add(k), true)
  })
  return {
    date: n.date,
    yoga: n.yoga || o.yoga,
    kneeCheck: pickDef(n.kneeCheck, o.kneeCheck),
    walkBase: pickDef(n.walkBase, o.walkBase),
    ticked: union(n.ticked, o.ticked),
    counters: {
      quadSets: Math.max(n.counters.quadSets, o.counters.quadSets),
      heelProp: Math.max(n.counters.heelProp, o.counters.heelProp),
      anklePumps: Math.max(n.counters.anklePumps, o.counters.anklePumps),
    },
    log: {
      swelling: pickDef(n.log.swelling, o.log.swelling),
      pain: pickDef(n.log.pain, o.log.pain),
      walkMin: pickDef(n.log.walkMin, o.log.walkMin),
      heelToButtockCm: pickDef(n.log.heelToButtockCm, o.log.heelToButtockCm),
      calfWarning: n.log.calfWarning || o.log.calfWarning || undefined,
      givingWay,
      notes: mergeText(n.log.notes, o.log.notes),
    },
    review: mergeReview(n.review, o.review),
    meals: union(n.meals, o.meals),
    waterL: isDef(n.waterL) || isDef(o.waterL) ? Math.max(n.waterL ?? 0, o.waterL ?? 0) : undefined,
    updatedAt: n.updatedAt,
  }
}

export function mergeWeek(x: WeekReview, y: WeekReview): WeekReview {
  const [n, o] = (x.savedAt ?? '') >= (y.savedAt ?? '') ? [x, y] : [y, x]
  return {
    weekStart: n.weekStart,
    wins: mergeText(n.wins, o.wins),
    struggles: mergeText(n.struggles, o.struggles),
    learned: mergeText(n.learned, o.learned),
    nextFocus: mergeText(n.nextFocus, o.nextFocus),
    nextPlan: mergeText(n.nextPlan, o.nextPlan),
    nextWalkTarget: pickDef(n.nextWalkTarget, o.nextWalkTarget),
    savedAt: n.savedAt,
  }
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

/** Pure merge of a backup into local data. Local data is never removed or overwritten wholesale. */
export function mergeBackup(local: LocalData, incoming: BackupFile): { merged: LocalData; summary: ImportSummary } {
  const days = { ...local.days }
  let daysNew = 0, daysMerged = 0, daysSame = 0
  for (const [k, inc] of Object.entries(incoming.days)) {
    const cur = days[k]
    if (!cur) { days[k] = inc; daysNew++; continue }
    const m = mergeDay(cur, inc)
    if (same(m, cur)) daysSame++
    else { days[k] = m; daysMerged++ }
  }

  const weeks = { ...local.weeks }
  let weeksChanged = 0
  for (const [k, inc] of Object.entries(incoming.weeks ?? {})) {
    const cur = weeks[k]
    if (!cur) { weeks[k] = inc; weeksChanged++; continue }
    const m = mergeWeek(cur, inc)
    if (!same(m, cur)) { weeks[k] = m; weeksChanged++ }
  }

  // Scalar settings follow whichever device was used most recently; collections are merged.
  const fromFile = latest(incoming.days) > latest(local.days)
  const a = local.settings, b = incoming.settings
  const pick = fromFile ? b : a
  const checkpointNotes: Record<string, string> = { ...b.checkpointNotes, ...a.checkpointNotes }
  for (const k of Object.keys(checkpointNotes)) {
    const ln = a.checkpointNotes?.[k], inn = b.checkpointNotes?.[k]
    checkpointNotes[k] = fromFile ? (inn || ln || '') : (ln || inn || '')
  }
  const shoppingChecked: Record<string, string[]> = { ...(b.shoppingChecked ?? {}) }
  for (const [wk, ids] of Object.entries(a.shoppingChecked ?? {})) shoppingChecked[wk] = [...new Set([...(shoppingChecked[wk] ?? []), ...ids])]
  const supplementStatus = fromFile ? { ...(a.supplementStatus ?? {}), ...(b.supplementStatus ?? {}) } : { ...(b.supplementStatus ?? {}), ...(a.supplementStatus ?? {}) }

  const settings: Settings = {
    ...pick,
    dopplerAdvised: a.dopplerAdvised || b.dopplerAdvised,
    dopplerDone: a.dopplerDone || b.dopplerDone,
    dopplerDoneOn: a.dopplerDoneOn ?? b.dopplerDoneOn,
    checkpointNotes,
    shoppingChecked,
    supplementStatus,
    backupLastAt: a.backupLastAt,
  }
  return {
    merged: { settings, days, weeks },
    summary: { exportedAt: incoming.exportedAt, daysInFile: Object.keys(incoming.days).length, daysNew, daysMerged, daysSame, weeksInFile: Object.keys(incoming.weeks ?? {}).length, weeksChanged, settingsFromFile: fromFile },
  }
}

export async function readLocal(): Promise<LocalData> {
  return { settings: await getSettings(), days: await listDays(), weeks: await listWeekReviews() }
}

export function parseBackup(json: string): BackupFile {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('That is not valid backup text or file.')
  }
  return validateBackup(parsed)
}

/** Dry run: what a merge would do, without writing anything. */
export async function previewMerge(json: string): Promise<ImportSummary> {
  return mergeBackup(await readLocal(), parseBackup(json)).summary
}

/** Merge the file into this device's data. Nothing local is deleted or overwritten. */
export async function importMerge(json: string): Promise<ImportSummary> {
  const { merged, summary } = mergeBackup(await readLocal(), parseBackup(json))
  await saveSettings(merged.settings)
  for (const e of Object.values(merged.days)) await kvSetDayRaw(e)
  for (const w of Object.values(merged.weeks)) await kvSetWeekRaw(w)
  return summary
}

export function backupFileName(now = new Date()): string {
  return `jaanu-setu-backup-${now.toISOString().slice(0, 10)}.json`
}

const kvSetDayRaw = (e: DayEntry) => kvSet('day:' + e.date, e)
const kvSetWeekRaw = (w: WeekReview) => kvSet('week:' + w.weekStart, w)
