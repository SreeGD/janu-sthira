import type { Meal } from '../content/types'

export function proteinTotal(meals: Meal[], ticked: string[]): number {
  const set = new Set(ticked)
  return meals.filter((m) => set.has(m.key)).reduce((sum, m) => sum + m.proteinG, 0)
}
