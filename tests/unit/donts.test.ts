import { cardByCode } from '../../src/content/cards'
import { dontGroups, topDonts } from '../../src/content/donts'

const all = dontGroups.flatMap((g) => g.items)

describe("don'ts content", () => {
  it('has unique ids and a reason and an alternative for each', () => {
    expect(new Set(all.map((i) => i.id)).size).toBe(all.length)
    for (const i of all) {
      expect(i.why.length, i.id).toBeGreaterThan(10)
      expect(i.instead.length, i.id).toBeGreaterThan(10)
      expect(i.dont.startsWith("Don't"), i.id).toBe(true)
    }
  })
  it('card references resolve', () => {
    for (const i of all) if (i.card) expect(cardByCode.has(i.card), i.id).toBe(true)
  })
  it('has a short top list', () => {
    expect(topDonts.length).toBeGreaterThanOrEqual(3)
    expect(topDonts.length).toBeLessThanOrEqual(6)
  })
  it('has no personal references or onion/garlic/root-vegetable recommendations', () => {
    expect(JSON.stringify(dontGroups)).not.toMatch(/\bleft (knee|leg|foot)|your MRI|onion|garlic|potato|carrot|beetroot|radish/i)
  })
})
