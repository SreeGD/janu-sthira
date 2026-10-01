import { cardByCode } from '../../src/content/cards'
import { prevention, structures } from '../../src/content/knee'

describe('knee guide content', () => {
  it('covers the ACL, PCL, collaterals, menisci, cartilage and muscles', () => {
    expect(structures.map((s) => s.id)).toEqual(['acl', 'pcl', 'collaterals', 'menisci', 'cartilage', 'muscles'])
  })
  it('every structure explains injury, signs, care and when to get help', () => {
    for (const s of structures) {
      for (const f of [s.what, s.job, s.injury, s.treatment, s.help]) expect(f.length, s.id).toBeGreaterThan(20)
      expect(s.signs.length, s.id).toBeGreaterThan(1)
      expect(s.care.length, s.id).toBeGreaterThan(1)
    }
  })
  it('related exercise cards exist', () => {
    for (const c of [...structures.flatMap((s) => s.cards ?? []), ...prevention.flatMap((p) => p.cards ?? [])]) expect(cardByCode.has(c), c).toBe(true)
  })
  it('has no personal references', () => {
    expect(JSON.stringify([structures, prevention])).not.toMatch(/\bleft (knee|leg)|your MRI|sree|gmail/i)
  })
})
