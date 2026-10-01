const pad = (n: number) => String(n).padStart(2, '0')

export function toDateString(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayLocal(now: Date = new Date()): string {
  return toDateString(now)
}

export function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** 0 = Monday ... 6 = Sunday */
export function weekdayIndex(s: string): number {
  return (parseDate(s).getDay() + 6) % 7
}

export function addDays(s: string, n: number): string {
  const d = parseDate(s)
  d.setDate(d.getDate() + n)
  return toDateString(d)
}

export function daysBetween(a: string, b: string): number {
  return Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / 86_400_000)
}

/** Programme week number, 1-based. */
export function programmeWeek(start: string, today: string): number {
  return Math.max(1, Math.floor(daysBetween(start, today) / 7) + 1)
}

export function msUntilMidnight(now: Date = new Date()): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return next.getTime() - now.getTime()
}

export const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
