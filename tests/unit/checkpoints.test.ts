import { checkpointStatuses, nextCheckpoint } from '../../src/domain/checkpoints'
import { proteinTotal } from '../../src/domain/protein'
import { mealsForDay } from '../../src/content/food'

describe('checkpoints', () => {
  it('dates and countdown', () => {
    const s = checkpointStatuses('2026-10-01', '2026-10-01')
    expect(s[0].date).toBe('2026-11-12')
    expect(s[0].daysLeft).toBe(42)
    expect(s.map((c) => c.id)).toEqual(['wk6', 'm3', 'm6'])
  })
  it('next checkpoint skips passed ones', () => {
    expect(nextCheckpoint('2026-10-01', '2026-12-01')?.id).toBe('m3')
    expect(nextCheckpoint('2026-10-01', '2030-01-01')).toBeUndefined()
  })
})

describe('protein', () => {
  it('sums ticked meals', () => {
    const meals = mealsForDay(2)
    expect(proteinTotal(meals, ['lunch', 'dinner'])).toBe(28 + 22)
    expect(proteinTotal(meals, [])).toBe(0)
  })
  it('full day is about the 105 g target', () => {
    const meals = mealsForDay(0)
    expect(proteinTotal(meals, meals.map((m) => m.key))).toBe(106)
  })
})
