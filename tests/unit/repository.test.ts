import { clearAll, getWeekReview, saveWeekReview, getDay, getSettings, listDays, saveDay, saveSettings } from '../../src/storage/repository'
import { exportBackup, importBackup, validateBackup } from '../../src/storage/backup'

beforeEach(async () => {
  await clearAll()
})

describe('repository', () => {
  it('returns defaults on first run', async () => {
    const s = await getSettings()
    expect(s.walkTarget).toBe(15)
    expect(s.dopplerDone).toBe(false)
  })
  it('persists a day entry', async () => {
    const d = await getDay('2026-10-05')
    d.ticked = ['m1']
    await saveDay(d)
    expect((await getDay('2026-10-05')).ticked).toEqual(['m1'])
    expect(Object.keys(await listDays())).toEqual(['2026-10-05'])
  })
})

describe('backup', () => {
  it('round-trips export -> clear -> import', async () => {
    const d = await getDay('2026-10-05')
    d.ticked = ['m1', 'm2']
    d.log.notes = 'ok'
    await saveDay(d)
    await saveSettings({ ...(await getSettings()), walkTarget: 30 })
    const file = await exportBackup()
    await clearAll()
    expect(Object.keys(await listDays())).toHaveLength(0)
    const n = await importBackup(JSON.stringify(file))
    expect(n).toBe(1)
    expect((await getDay('2026-10-05')).log.notes).toBe('ok')
    expect((await getSettings()).walkTarget).toBe(30)
  })
  it('round-trips weekly reviews', async () => {
    await saveWeekReview({ weekStart: '2026-10-05', wins: 'steady' })
    const file = await exportBackup()
    await clearAll()
    await importBackup(JSON.stringify(file))
    expect((await getWeekReview('2026-10-05')).wins).toBe('steady')
  })
  it('rejects bad files', () => {
    expect(() => validateBackup(null)).toThrow()
    expect(() => validateBackup({ app: 'other' })).toThrow(/not a Jaanu Setu/)
    expect(() => validateBackup({ app: 'jaanu-setu', version: 1, exportedAt: 'x', settings: {}, days: { bad: {} } })).toThrow(/date key/)
  })
  it('rejects invalid JSON', async () => {
    await expect(importBackup('{nope')).rejects.toThrow(/valid JSON/)
  })
})

import { mergeBackup, mergeDay, mergeText, previewMerge, importMerge, type BackupFile, type LocalData } from '../../src/storage/backup'
import { defaultSettings, emptyDay } from '../../src/storage/repository'
import type { DayEntry } from '../../src/content/types'

const day = (date: string, updatedAt: string, ticked: string[] = []): DayEntry => ({ ...emptyDay(date), ticked, updatedAt })
const local = (days: DayEntry[], over = {}): LocalData => ({ settings: { ...defaultSettings(), ...over }, days: Object.fromEntries(days.map((d) => [d.date, d])), weeks: {} })
const file = (days: DayEntry[], over = {}, weeks = {}): BackupFile => ({ app: 'jaanu-setu', version: 1, exportedAt: '2026-10-20T00:00:00Z', settings: { ...defaultSettings(), ...over }, days: Object.fromEntries(days.map((d) => [d.date, d])), weeks })

describe('merge import', () => {
  it('adds new days and combines the same day from both devices without losing anything', () => {
    const a = { ...day('2026-10-06', '2026-10-06T10:00:00Z', ['m1', 'm2']), counters: { quadSets: 3, heelProp: 1, anklePumps: 0 }, meals: ['lunch'], log: { givingWay: [], swelling: 1, notes: 'phone note' } }
    const b = { ...day('2026-10-06', '2026-10-06T14:00:00Z', ['m2', 'l1']), counters: { quadSets: 5, heelProp: 0, anklePumps: 2 }, meals: ['dinner'], log: { givingWay: [{ time: '09:00', note: 'stairs' }], pain: 2, notes: 'laptop note' } }
    const l = local([day('2026-10-05', '2026-10-05T10:00:00Z', ['a']), a])
    const f = file([b, day('2026-10-07', '2026-10-07T10:00:00Z', ['new'])])
    const { merged, summary } = mergeBackup(l, f)
    const d = merged.days['2026-10-06']
    expect(d.ticked.sort()).toEqual(['l1', 'm1', 'm2'])
    expect(d.counters).toEqual({ quadSets: 5, heelProp: 1, anklePumps: 2 })
    expect(d.meals.sort()).toEqual(['dinner', 'lunch'])
    expect(d.log.swelling).toBe(1)
    expect(d.log.pain).toBe(2)
    expect(d.log.givingWay).toHaveLength(1)
    expect(d.log.notes).toContain('phone note')
    expect(d.log.notes).toContain('laptop note')
    expect(merged.days['2026-10-05'].ticked).toEqual(['a'])
    expect(Object.keys(merged.days)).toHaveLength(3)
    expect(summary).toMatchObject({ daysNew: 1, daysMerged: 1, daysSame: 0 })
  })
  it('single answers prefer the more recently saved side, but never discard a value only one side has', () => {
    const older = { ...day('2026-10-06', '2026-10-06T08:00:00Z'), kneeCheck: 'puffier' as const, log: { givingWay: [], swelling: 2, walkMin: 20 } }
    const newer = { ...day('2026-10-06', '2026-10-06T12:00:00Z'), kneeCheck: 'better' as const, log: { givingWay: [], swelling: 0 } }
    const m = mergeDay(older, newer)
    expect(m.kneeCheck).toBe('better')
    expect(m.log.swelling).toBe(0)
    expect(m.log.walkMin).toBe(20)
    expect(m.updatedAt).toBe('2026-10-06T12:00:00Z')
  })
  it('is idempotent: merging the same file twice changes nothing the second time', () => {
    const l = local([{ ...day('2026-10-06', '2026-10-06T10:00:00Z', ['a']), log: { givingWay: [], notes: 'one' } }])
    const f = file([{ ...day('2026-10-06', '2026-10-06T12:00:00Z', ['b']), log: { givingWay: [], notes: 'two' } }])
    const first = mergeBackup(l, f).merged
    const second = mergeBackup(first, f)
    expect(second.summary.daysMerged).toBe(0)
    expect(second.summary.daysSame).toBe(1)
    expect(second.merged.days['2026-10-06'].log.notes).toBe(first.days['2026-10-06'].log.notes)
  })
  it('mergeText keeps both, dedupes containment', () => {
    expect(mergeText('a', 'b')).toBe('a\n---\nb')
    expect(mergeText('a\n---\nb', 'b')).toBe('a\n---\nb')
    expect(mergeText(undefined, 'x')).toBe('x')
    expect(mergeText('', '')).toBeUndefined()
  })
  it('weekly reviews are combined too', () => {
    const l = { ...local([]), weeks: { '2026-10-05': { weekStart: '2026-10-05', wins: 'old', nextFocus: 'keep me', savedAt: '2026-10-10T00:00:00Z' } } }
    const f = file([], {}, { '2026-10-05': { weekStart: '2026-10-05', wins: 'new', savedAt: '2026-10-12T00:00:00Z' }, '2026-10-12': { weekStart: '2026-10-12', wins: 'x', savedAt: '2026-10-19T00:00:00Z' } })
    const { merged, summary } = mergeBackup(l, f)
    expect(merged.weeks['2026-10-05'].wins).toContain('new')
    expect(merged.weeks['2026-10-05'].wins).toContain('old')
    expect(merged.weeks['2026-10-05'].nextFocus).toBe('keep me')
    expect(Object.keys(merged.weeks)).toHaveLength(2)
    expect(summary.weeksChanged).toBe(2)
  })
  it('settings: most recently used device wins scalars; collections combine; doppler true wins', () => {
    const l = local([day('2026-10-05', '2026-10-05T10:00:00Z')], { walkTarget: 20, dopplerDone: false, shoppingChecked: { w: ['a'] }, supplementStatus: { protein: 'taking' } })
    const f = file([day('2026-10-09', '2026-10-09T10:00:00Z')], { walkTarget: 30, dopplerDone: true, shoppingChecked: { w: ['b'] }, supplementStatus: { b12: 'asked' } })
    const { merged, summary } = mergeBackup(l, f)
    expect(summary.settingsFromFile).toBe(true)
    expect(merged.settings.walkTarget).toBe(30)
    expect(merged.settings.dopplerDone).toBe(true)
    expect(merged.settings.shoppingChecked?.w.sort()).toEqual(['a', 'b'])
    expect(merged.settings.supplementStatus).toEqual({ protein: 'taking', b12: 'asked' })
  })
  it('keeps local scalars when this device was used more recently', () => {
    const l = local([day('2026-10-09', '2026-10-09T10:00:00Z')], { walkTarget: 35 })
    const f = file([day('2026-10-05', '2026-10-05T10:00:00Z')], { walkTarget: 15 })
    expect(mergeBackup(l, f).merged.settings.walkTarget).toBe(35)
  })
  it('end to end: preview does not write, merge preserves timestamps', async () => {
    await clearAll()
    await saveDay({ ...emptyDay('2026-10-05'), ticked: ['m1'] })
    const f = file([day('2026-10-06', '2026-10-06T10:00:00Z', ['x'])])
    const json = JSON.stringify(f)
    const p = await previewMerge(json)
    expect(p.daysNew).toBe(1)
    expect(Object.keys(await listDays())).toEqual(['2026-10-05'])
    await importMerge(json)
    const days = await listDays()
    expect(Object.keys(days).sort()).toEqual(['2026-10-05', '2026-10-06'])
    expect(days['2026-10-06'].updatedAt).toBe('2026-10-06T10:00:00Z')
  })
})
