import { afternoon, bedtime, eveningFor, lunch, midmorning, morning } from '../content/sessions'
import type { KneeCheck, ScheduleItem, SessionTemplate } from '../content/types'
import { weekdayIndex } from './dates'
import { nextWalkTarget, walkMinutesToday } from './walkTarget'

export type DayType = 'A' | 'B' | 'SUNDAY'
export type ItemStatus = 'full' | 'halved' | 'skipped'

export interface PlannedItem {
  item: ScheduleItem
  status: ItemStatus
  amount?: string
}

export interface PlannedSession {
  id: string
  slot: SessionTemplate['slot']
  title: string
  subtitle: string
  items: PlannedItem[]
}

export interface Banner {
  level: 'info' | 'warn' | 'stop'
  text: string
}

export interface TodayPlan {
  dayType: DayType
  restDay: boolean
  sessions: PlannedSession[]
  walkMinutesToday: number
  nextWalkTarget: number
  banners: Banner[]
}

export interface PlanInput {
  date: string
  yoga: boolean
  kneeCheck?: KneeCheck
  walkTarget: number
  walkMin?: number
  walkMax?: number
}

export function dayTypeOf(date: string): DayType {
  const i = weekdayIndex(date)
  if (i === 6) return 'SUNDAY'
  return i % 2 === 0 ? 'A' : 'B' // Mon, Wed, Fri = A; Tue, Thu, Sat = B
}

function planItem(item: ScheduleItem, check: KneeCheck | undefined, walkToday: number): PlannedItem {
  const amount = item.amount?.replace('{walk}', String(walkToday))
  const tags = item.tags
  switch (check) {
    case 'puffier':
      if (tags.includes('skip-puffy')) return { item, status: 'skipped', amount }
      if (tags.includes('bike')) return { item, status: 'halved', amount: '7-8 min (halved)' }
      if (tags.includes('walk')) return { item, status: 'halved', amount: `${walkToday} min (halved)` }
      return { item, status: 'full', amount }
    case 'swollen':
      return tags.includes('rest-ok') ? { item, status: 'full', amount } : { item, status: 'skipped', amount }
    case 'gaveWay':
      return tags.includes('walk') || tags.includes('standing') ? { item, status: 'skipped', amount } : { item, status: 'full', amount }
    default:
      return { item, status: 'full', amount }
  }
}

export function buildTodayPlan(input: PlanInput): TodayPlan {
  const { date, yoga, kneeCheck, walkTarget } = input
  const dayType = dayTypeOf(date)
  const walkToday = walkMinutesToday(walkTarget, kneeCheck)
  const walkLabel = kneeCheck === 'swollen' || kneeCheck === 'gaveWay' ? 0 : kneeCheck === 'puffier' ? walkToday : walkTarget

  const evening = yoga ? eveningFor.YOGA : eveningFor[dayType]
  const templates: SessionTemplate[] = [morning, midmorning]
  if (dayType !== 'SUNDAY') templates.push(lunch)
  templates.push(afternoon, evening, bedtime)

  const sessions: PlannedSession[] = templates.map((t) => ({
    id: t.id,
    slot: t.slot,
    title: t.title,
    subtitle: t.subtitle,
    items: t.items.map((i) => planItem(i, kneeCheck, walkLabel)),
  }))

  const banners: Banner[] = []
  if (!kneeCheck) banners.push({ level: 'info', text: 'Do the morning knee check first: it adjusts today\'s plan.' })
  if (kneeCheck === 'puffier') banners.push({ level: 'warn', text: 'Puffier today: walk and bike halved, chair pose and step-ups skipped.' })
  if (kneeCheck === 'swollen') banners.push({ level: 'warn', text: 'Rest day: quad sets, heel props, ankle pumps, legs up the wall and ice. Restart with a shorter walk tomorrow.' })
  if (kneeCheck === 'gaveWay') banners.push({ level: 'stop', text: 'The knee gave way. Stop standing work and walking today. Note what you were doing and tell your physio or surgeon.' })
  if (kneeCheck === 'better' && walkTarget < (input.walkMax ?? 40)) banners.push({ level: 'info', text: `Walk target ${walkTarget} min. If the knee stays calm, tomorrow it goes to ${nextWalkTarget(walkTarget, 'better', input.walkMin, input.walkMax)} min.` })

  return {
    dayType,
    restDay: kneeCheck === 'swollen',
    sessions,
    walkMinutesToday: walkToday,
    nextWalkTarget: nextWalkTarget(walkTarget, kneeCheck, input.walkMin, input.walkMax),
    banners,
  }
}

/** Items that count towards adherence (everything not skipped). */
export function activeItemIds(plan: TodayPlan): string[] {
  return plan.sessions.flatMap((s) => s.items.filter((i) => i.status !== 'skipped').map((i) => i.item.id))
}
