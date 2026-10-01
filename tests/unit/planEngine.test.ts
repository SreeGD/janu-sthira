import { activeItemIds, buildTodayPlan, dayTypeOf } from '../../src/domain/planEngine'
import type { KneeCheck } from '../../src/content/types'

const MON = '2026-10-05', TUE = '2026-10-06', WED = '2026-10-07', SAT = '2026-10-10', SUN = '2026-10-11'
const ids = (p: ReturnType<typeof buildTodayPlan>, slot: string) =>
  p.sessions.filter((s) => s.slot === slot).flatMap((s) => s.items.map((i) => i.item.id))
const status = (p: ReturnType<typeof buildTodayPlan>, id: string) =>
  p.sessions.flatMap((s) => s.items).find((i) => i.item.id === id)?.status

describe('weekday mapping', () => {
  it.each([[MON, 'A'], [TUE, 'B'], [WED, 'A'], [SAT, 'B'], [SUN, 'SUNDAY']])('%s -> %s', (d, t) => {
    expect(dayTypeOf(d)).toBe(t)
  })
  it('Day A evening has band circuit', () => {
    const p = buildTodayPlan({ date: MON, yoga: false, walkTarget: 20 })
    expect(ids(p, 'evening')).toEqual(expect.arrayContaining(['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b8']))
  })
  it('Day B evening has good-leg + core', () => {
    const p = buildTodayPlan({ date: TUE, yoga: false, walkTarget: 20 })
    expect(ids(p, 'evening')).toEqual(expect.arrayContaining(['e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9']))
  })
  it('Sunday is lighter: no lunch strength, no band circuit', () => {
    const p = buildTodayPlan({ date: SUN, yoga: false, walkTarget: 20 })
    expect(ids(p, 'lunch')).toEqual([])
    expect(ids(p, 'evening')).not.toContain('b1')
    expect(ids(p, 'morning')).toContain('m6')
  })
  it('yoga swaps the evening but keeps the morning walk', () => {
    const p = buildTodayPlan({ date: MON, yoga: true, walkTarget: 20 })
    expect(ids(p, 'evening')).toContain('yoga')
    expect(ids(p, 'evening')).not.toContain('b1')
    expect(ids(p, 'morning')).toContain('m6')
  })
  it('no knee check -> full plan plus prompt banner', () => {
    const p = buildTodayPlan({ date: MON, yoga: false, walkTarget: 20 })
    expect(p.banners[0].text).toMatch(/knee check/i)
    expect(activeItemIds(p).length).toBeGreaterThan(20)
  })
})

describe('knee check outcomes', () => {
  const dates = [MON, TUE, SUN]
  it.each(dates)('better: full plan, target +5 (%s)', (d) => {
    const p = buildTodayPlan({ date: d, yoga: false, kneeCheck: 'better', walkTarget: 20 })
    expect(p.nextWalkTarget).toBe(25)
    expect(p.walkMinutesToday).toBe(20)
    expect(p.sessions.flatMap((s) => s.items).every((i) => i.status === 'full')).toBe(true)
  })
  it('better caps at 40', () => {
    expect(buildTodayPlan({ date: MON, yoga: false, kneeCheck: 'better', walkTarget: 40 }).nextWalkTarget).toBe(40)
    expect(buildTodayPlan({ date: MON, yoga: false, kneeCheck: 'better', walkTarget: 35 }).nextWalkTarget).toBe(40)
  })
  it.each(dates)('puffier: halves walk and bike, skips chair pose, step-ups (%s)', (d) => {
    const p = buildTodayPlan({ date: d, yoga: false, kneeCheck: 'puffier', walkTarget: 20 })
    expect(status(p, 'm6')).toBe('halved')
    expect(p.walkMinutesToday).toBe(10)
    if (d !== SUN) expect(status(p, 'e1')).toBe('halved')
    expect(p.nextWalkTarget).toBe(20)
    expect(status(p, 'm5')).toBe('full')
    if (d === TUE) {
      expect(status(p, 'e5')).toBe('skipped')
      expect(status(p, 'e3')).toBe('skipped')
    }
    if (d === MON) expect(status(p, 'b6')).toBe('skipped')
  })
  it.each(dates)('swollen: rest day only, walk 0, restart at 15 (%s)', (d) => {
    const p = buildTodayPlan({ date: d, yoga: false, kneeCheck: 'swollen', walkTarget: 30 })
    expect(p.restDay).toBe(true)
    expect(p.walkMinutesToday).toBe(0)
    expect(p.nextWalkTarget).toBe(15)
    expect(status(p, 'm6')).toBe('skipped')
    expect(status(p, 'm5')).toBe('full')
    expect(status(p, 'e10')).toBe('full')
    expect(status(p, 'bd-ice')).toBe('full')
    if (d !== SUN) expect(status(p, 'l2')).toBe('skipped')
  })
  it.each(dates)('gave way: stop banner, walking and standing removed (%s)', (d) => {
    const p = buildTodayPlan({ date: d, yoga: false, kneeCheck: 'gaveWay', walkTarget: 25 })
    expect(p.banners.some((b) => b.level === 'stop')).toBe(true)
    expect(status(p, 'm6')).toBe('skipped')
    if (d !== SUN) expect(status(p, 'e2')).toBe('skipped')
    expect(status(p, 'm5')).toBe('full')
    expect(p.nextWalkTarget).toBe(25)
  })
  it('all outcomes covered', () => {
    const outcomes: KneeCheck[] = ['better', 'puffier', 'swollen', 'gaveWay']
    for (const o of outcomes) expect(buildTodayPlan({ date: MON, yoga: false, kneeCheck: o, walkTarget: 20 })).toBeTruthy()
  })
})
