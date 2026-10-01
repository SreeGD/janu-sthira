import { supplements } from '../../src/content/supplements'

describe('supplements content', () => {
  it('has unique ids and a vegetarian option, food source and caution for each', () => {
    const ids = supplements.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const s of supplements) {
      expect(s.vegOption.length, s.id).toBeGreaterThan(10)
      expect(s.caution.length, s.id).toBeGreaterThan(10)
      expect(s.food.length, s.id).toBeGreaterThan(0)
    }
  })
  it('never recommends non-vegetarian sources as the option', () => {
    for (const s of supplements) {
      if (s.stance !== 'skip') expect(s.vegOption, s.id).not.toMatch(/fish oil (is|from)(?! not)|cod liver|krill/i)
    }
  })
  it('animal-derived items are marked skip', () => {
    expect(supplements.find((s) => s.id === 'collagen')?.stance).toBe('skip')
    expect(supplements.find((s) => s.id === 'glucosamine')?.stance).toBe('skip')
  })
  it('does not mention onion, garlic or root vegetables as recommendations', () => {
    const text = JSON.stringify(supplements.map((s) => [s.why, s.vegOption, s.food, s.how]))
    expect(text).not.toMatch(/onion|garlic|potato|carrot|beetroot|radish/i)
  })
})
