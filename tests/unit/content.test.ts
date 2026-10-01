import { existsSync } from 'node:fs'
import { cards, cardByCode } from '../../src/content/cards'
import { allSessions } from '../../src/content/sessions'
import { rotation, dailyPattern, soups, powderRoutine, nutrients, flavourTip } from '../../src/content/food'

describe('content integrity', () => {
  it('has all expected card codes', () => {
    const expected = [
      ...[1, 2, 3, 4, 5, 6].map((n) => `M${n}`),
      ...[1, 2, 3, 4, 5].map((n) => `L${n}`),
      ...Array.from({ length: 11 }, (_, i) => `E${i + 1}`),
      ...Array.from({ length: 8 }, (_, i) => `B${i + 1}`),
    ]
    expect(cards.map((c) => c.code).sort()).toEqual(expected.sort())
  })
  it('every schedule card code resolves to a card', () => {
    for (const s of allSessions) for (const i of s.items) for (const c of i.cardCodes) expect(cardByCode.has(c), `${i.id}:${c}`).toBe(true)
  })
  it('schedule item ids are unique', () => {
    const ids = allSessions.flatMap((s) => s.items.map((i) => i.id))
    const dup = ids.filter((id, n) => ids.indexOf(id) !== n)
    // evening A/B share eveningStart/eveningEnd ids by design (same items); anything else is a bug
    expect(new Set(dup)).toEqual(new Set(['e1', 'e-qc', 'e2', 'e10']))
  })
  it('every card has an illustration file', () => {
    for (const c of cards) expect(existsSync(`public/illustrations/${c.code}.svg`), c.code).toBe(true)
  })
  it('every card has steps', () => {
    for (const c of cards) expect(c.steps.length, c.code).toBeGreaterThan(0)
  })
})

describe('food rules', () => {
  const banned = /onion|garlic|potato|carrot|beetroot|radish/i
  it('no onion, garlic or root vegetables in the food plan', () => {
    const text = JSON.stringify({ rotation, dailyPattern, soups, powderRoutine, nutrients })
    expect(text).not.toMatch(banned)
    // the flavour tip only mentions them to say they are excluded
    expect(flavourTip).toMatch(/without onion or garlic/)
  })
})
