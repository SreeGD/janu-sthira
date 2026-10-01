import { nextWalkTarget, walkMinutesToday, clampWalk } from '../../src/domain/walkTarget'

describe('walk target', () => {
  it('progresses +5 on better, capped at 40', () => {
    expect(nextWalkTarget(15, 'better')).toBe(20)
    expect(nextWalkTarget(38, 'better')).toBe(40)
  })
  it('floors at 15', () => {
    expect(clampWalk(5)).toBe(15)
    expect(nextWalkTarget(30, 'swollen')).toBe(15)
  })
  it('holds on puffier and gave way', () => {
    expect(nextWalkTarget(25, 'puffier')).toBe(25)
    expect(nextWalkTarget(25, 'gaveWay')).toBe(25)
  })
  it('minutes today', () => {
    expect(walkMinutesToday(20, undefined)).toBe(20)
    expect(walkMinutesToday(20, 'puffier')).toBe(10)
    expect(walkMinutesToday(20, 'swollen')).toBe(0)
    expect(walkMinutesToday(20, 'gaveWay')).toBe(0)
  })
})
