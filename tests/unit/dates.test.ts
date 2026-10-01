import { addDays, daysBetween, programmeWeek, weekdayIndex, msUntilMidnight, todayLocal } from '../../src/domain/dates'

describe('dates', () => {
  it('weekday index is Monday-based', () => {
    expect(weekdayIndex('2026-10-05')).toBe(0) // Monday
    expect(weekdayIndex('2026-10-11')).toBe(6) // Sunday
  })
  it('adds days across month end', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })
  it('programme week is 1-based', () => {
    expect(programmeWeek('2026-10-01', '2026-10-01')).toBe(1)
    expect(programmeWeek('2026-10-01', '2026-10-08')).toBe(2)
  })
  it('daysBetween', () => expect(daysBetween('2026-10-01', '2026-10-11')).toBe(10))
  it('uses local calendar date, not UTC', () => {
    expect(todayLocal(new Date(2026, 9, 1, 23, 59))).toBe('2026-10-01')
    expect(todayLocal(new Date(2026, 9, 2, 0, 1))).toBe('2026-10-02')
  })
  it('ms until midnight', () => {
    expect(msUntilMidnight(new Date(2026, 9, 1, 23, 59, 0))).toBe(60_000)
  })
})
