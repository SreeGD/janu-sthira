import { shoppingList } from '../../src/content/shopping'
import { allItemIds, defaultShoppingWeek, shoppingText } from '../../src/domain/shopping'

describe('shopping list', () => {
  it('has unique ids', () => {
    const ids = allItemIds()
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('contains no onion or garlic', () => {
    const text = JSON.stringify(shoppingList)
    expect(text).not.toMatch(/onion|garlic/i)
  })
  it('share text lists everything by default and skips bought items', () => {
    const all = shoppingText('2026-10-05', [], true)
    expect(all).toContain('Paneer: 700 g')
    expect(all).toContain('week of 5 Oct')
    const some = shoppingText('2026-10-05', ['paneer'], true)
    expect(some).not.toContain('Paneer:')
    expect(shoppingText('2026-10-05', ['paneer'], false)).toContain('Paneer:')
  })
  it('says so when everything is bought', () => {
    expect(shoppingText('2026-10-05', allItemIds(), true)).toContain('Everything is bought.')
  })
  it('defaults to next week on Saturday and Sunday', () => {
    expect(defaultShoppingWeek('2026-10-05', 2)).toBe('2026-10-05')
    expect(defaultShoppingWeek('2026-10-05', 5)).toBe('2026-10-12')
    expect(defaultShoppingWeek('2026-10-05', 6)).toBe('2026-10-12')
  })
})
