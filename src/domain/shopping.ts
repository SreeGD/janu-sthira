import { shoppingList } from '../content/shopping'
import { addDays, parseDate } from './dates'

export function allItemIds(): string[] {
  return shoppingList.flatMap((c) => c.items.map((i) => i.id))
}

/** Which week to shop for by default: next week from Saturday, else this week. */
export function defaultShoppingWeek(weekStartThisWeek: string, weekdayIdx: number): string {
  return weekdayIdx >= 5 ? addDays(weekStartThisWeek, 7) : weekStartThisWeek
}

export function shoppingText(weekStart: string, checked: string[], onlyRemaining = true): string {
  const done = new Set(checked)
  const label = parseDate(weekStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const lines: string[] = [`Weekly shopping list: week of ${label} (Jānu Sthira)`, 'Vegetarian, no onion or garlic.', '']
  let count = 0
  for (const c of shoppingList) {
    const items = c.items.filter((i) => !onlyRemaining || !done.has(i.id))
    if (items.length === 0) continue
    lines.push(c.title.toUpperCase())
    for (const i of items) {
      lines.push(`- ${i.name}: ${i.qty}`)
      count++
    }
    lines.push('')
  }
  if (count === 0) lines.push('Everything is bought.')
  return lines.join('\n').trimEnd()
}
