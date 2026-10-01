import { cellState, slotItemIds, toggleSlot } from '../../src/domain/weekGrid'
import { emptyDay } from '../../src/storage/repository'

const MON = '2026-10-05', SUN = '2026-10-11', TODAY = '2026-10-07'

describe('weekGrid', () => {
  it('slot items exclude skipped ones', () => {
    expect(slotItemIds(MON, undefined, 'morning', 15)).toHaveLength(6)
    const swollen = { ...emptyDay(MON), kneeCheck: 'swollen' as const }
    expect(slotItemIds(MON, swollen, 'morning', 15).sort()).toEqual(['m1', 'm5'])
  })
  it('states: none, partial, done, na (Sunday lunch), future', () => {
    expect(cellState(MON, undefined, 'morning', TODAY, 15)).toBe('none')
    const e = { ...emptyDay(MON), ticked: ['m1', 'm2'] }
    expect(cellState(MON, e, 'morning', TODAY, 15)).toBe('partial')
    expect(cellState(MON, { ...e, ticked: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'] }, 'morning', TODAY, 15)).toBe('done')
    expect(cellState(SUN, undefined, 'lunch', '2026-10-12', 15)).toBe('na')
    expect(cellState(SUN, undefined, 'morning', TODAY, 15)).toBe('future')
  })
  it('toggleSlot completes the session, then clears it; leaves other sessions alone', () => {
    const e = { ...emptyDay(MON), ticked: ['l1'] }
    const done = toggleSlot(e, 'morning', 15)
    expect(done.ticked).toEqual(expect.arrayContaining(['l1', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6']))
    const cleared = toggleSlot(done, 'morning', 15)
    expect(cleared.ticked).toEqual(['l1'])
  })
  it('partial tap completes the rest', () => {
    const e = { ...emptyDay(MON), ticked: ['m1'] }
    expect(toggleSlot(e, 'morning', 15).ticked).toHaveLength(6)
  })
})
