import { computeStreaks } from '../../src/domain/streaks'
import { dayAdherence } from '../../src/domain/adherence'
import { activeItemIds, buildTodayPlan } from '../../src/domain/planEngine'
import type { DayEntry } from '../../src/content/types'

function entry(date: string, complete: boolean, kneeCheck?: DayEntry['kneeCheck']): DayEntry {
  const plan = buildTodayPlan({ date, yoga: false, kneeCheck, walkTarget: 15 })
  const all = activeItemIds(plan)
  return {
    date, yoga: false, kneeCheck, ticked: complete ? all : all.slice(0, 2),
    counters: { quadSets: 0, heelProp: 0, anklePumps: 0 }, log: { givingWay: [] }, meals: [], updatedAt: '',
  }
}

describe('adherence and streaks', () => {
  it('3 consecutive complete days -> streak 3', () => {
    const days = Object.fromEntries(['2026-10-05', '2026-10-06', '2026-10-07'].map((d) => [d, entry(d, true)]))
    expect(computeStreaks(days, '2026-10-07')).toEqual({ current: 3, best: 3 })
  })
  it('missed day resets current but keeps best', () => {
    const days = {
      '2026-10-05': entry('2026-10-05', true), '2026-10-06': entry('2026-10-06', true),
      '2026-10-07': entry('2026-10-07', false), '2026-10-08': entry('2026-10-08', true),
    }
    expect(computeStreaks(days, '2026-10-08')).toEqual({ current: 1, best: 2 })
  })
  it('today in progress does not break the streak', () => {
    const days = { '2026-10-05': entry('2026-10-05', true), '2026-10-06': entry('2026-10-06', false) }
    expect(computeStreaks(days, '2026-10-06').current).toBe(1)
  })
  it('rest day counts when rest items ticked', () => {
    const e = entry('2026-10-06', true, 'swollen')
    expect(dayAdherence(e).ratio).toBe(1)
    expect(dayAdherence(e).planned).toBeLessThan(dayAdherence(entry('2026-10-06', true)).planned)
  })
  it('ticked ids not in plan are ignored', () => {
    const e = entry('2026-10-06', false)
    e.ticked.push('ghost')
    expect(dayAdherence(e).done).toBe(2)
  })
})
