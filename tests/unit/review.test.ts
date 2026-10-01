import { suggestNextWeek, weekStartOf, weekStats } from '../../src/domain/review'
import { defaultSettings } from '../../src/storage/repository'
import { activeItemIds, buildTodayPlan } from '../../src/domain/planEngine'
import type { DayEntry } from '../../src/content/types'

const WK = '2026-10-05' // Monday

function day(date: string, o: Partial<DayEntry> & { complete?: boolean } = {}): DayEntry {
  const plan = buildTodayPlan({ date, yoga: false, kneeCheck: o.kneeCheck, walkTarget: 15 })
  const all = activeItemIds(plan)
  return {
    date, yoga: false, ticked: o.complete === false ? [] : all,
    counters: { quadSets: 0, heelProp: 0, anklePumps: 0 }, log: { givingWay: [], ...o.log }, meals: [], updatedAt: '', ...o,
  } as DayEntry
}
const week = (n: number, o: Partial<DayEntry> = {}) =>
  Object.fromEntries(Array.from({ length: n }, (_, i) => { const d = `2026-10-0${5 + i}`; return [d, day(d, o)] }))

describe('weekStartOf', () => {
  it('returns Monday', () => {
    expect(weekStartOf('2026-10-11')).toBe(WK)
    expect(weekStartOf(WK)).toBe(WK)
  })
})

describe('weekStats', () => {
  it('aggregates adherence, checks, walk and giving-way', () => {
    const days = {
      ...week(3, { kneeCheck: 'better', log: { walkMin: 20, givingWay: [] } }),
      '2026-10-08': day('2026-10-08', { kneeCheck: 'swollen', log: { givingWay: [{ note: 'x' }], calfWarning: true } }),
    }
    const s = weekStats(days, WK)
    expect(s.daysLogged).toBe(4)
    expect(s.daysComplete).toBe(4)
    expect(s.checks.better).toBe(3)
    expect(s.checks.swollen).toBe(1)
    expect(s.totalWalkMin).toBe(60)
    expect(s.givingWay).toBe(1)
    expect(s.calfWarnings).toBe(1)
    expect(s.avgAdherence).toBeCloseTo(4 / 7)
  })
  it('empty week', () => {
    const s = weekStats({}, WK)
    expect(s.daysLogged).toBe(0)
    expect(s.avgAdherence).toBe(0)
    expect(s.best).toBeUndefined()
  })
})

describe('bend tracking', () => {
  const d = (date: string, cm: number): DayEntry => day(date, { log: { givingWay: [], heelToButtockCm: cm } })
  it('reports latest measurement and change vs last week', () => {
    const days = { '2026-09-30': d('2026-09-30', 28), '2026-10-07': d('2026-10-07', 22), '2026-10-09': d('2026-10-09', 20) }
    const s = weekStats(days, WK)
    expect(s.bendCm).toBe(20)
    expect(s.bendChangeCm).toBe(-8)
  })
  it('flags no improvement, and no change without a previous week', () => {
    const stuck = weekStats({ '2026-09-30': d('2026-09-30', 20), '2026-10-07': d('2026-10-07', 21) }, WK)
    const r = suggestNextWeek(stuck, { ...defaultSettings(), walkTarget: 25 })
    expect(r.items.some((i) => /not shrunk/.test(i.text))).toBe(true)
    expect(weekStats({ '2026-10-07': d('2026-10-07', 21) }, WK).bendChangeCm).toBeUndefined()
  })
})

describe('suggestNextWeek', () => {
  const settings = { ...defaultSettings(), walkTarget: 25, dopplerDone: true }
  it('calm strong week raises target by 5', () => {
    const s = weekStats(week(7, { kneeCheck: 'better' }), WK)
    expect(suggestNextWeek(s, settings).walkTarget).toBe(30)
  })
  it('swollen day resets target to 15', () => {
    const days = { ...week(6, { kneeCheck: 'better' }), '2026-10-11': day('2026-10-11', { kneeCheck: 'swollen' }) }
    expect(suggestNextWeek(weekStats(days, WK), settings).walkTarget).toBe(15)
  })
  it('two puffy mornings hold target', () => {
    const days = { ...week(3, { kneeCheck: 'better' }), '2026-10-08': day('2026-10-08', { kneeCheck: 'puffier' }), '2026-10-09': day('2026-10-09', { kneeCheck: 'puffier' }) }
    expect(suggestNextWeek(weekStats(days, WK), settings).walkTarget).toBe(25)
  })
  it('giving way produces a stop suggestion and holds target', () => {
    const days = week(5, { kneeCheck: 'better', log: { givingWay: [{ note: 'stairs' }] } })
    const r = suggestNextWeek(weekStats(days, WK), settings)
    expect(r.items.some((i) => i.level === 'stop' && /review/i.test(i.text))).toBe(true)
    expect(r.walkTarget).toBe(25)
  })
  it('caps at max and flags Doppler and checkpoint', () => {
    const r = suggestNextWeek(weekStats(week(7, { kneeCheck: 'better' }), WK), { ...settings, walkTarget: 40, dopplerAdvised: true, dopplerDone: false }, 10, 'Week 6 review')
    expect(r.walkTarget).toBe(40)
    expect(r.items.some((i) => /Doppler/.test(i.text))).toBe(true)
    expect(r.items.some((i) => /Week 6 review is in 10 days/.test(i.text))).toBe(true)
  })
})
