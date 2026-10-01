export type CardGroup = 'M' | 'L' | 'E' | 'B' | 'K'

export interface ExerciseCard {
  code: string
  name: string
  group: CardGroup
  category: string
  steps: string[]
  howMuch?: string
  holdRepeat?: string
  breath?: string
  feel?: string
  kneeSafety?: string
  easier?: string
  harder?: string
  stopIf?: string
  /** seated alternative */
  chair?: string
}

export type ItemTag = 'walk' | 'bike' | 'skip-puffy' | 'standing' | 'rest-ok'
export type CounterKey = 'quadSets' | 'heelProp' | 'anklePumps'

export interface ScheduleItem {
  id: string
  minutes?: string
  text: string
  amount?: string
  cardCodes: string[]
  tags: ItemTag[]
}

export type SessionSlot = 'morning' | 'midmorning' | 'lunch' | 'afternoon' | 'evening' | 'bedtime'

export interface SessionTemplate {
  id: string
  slot: SessionSlot
  title: string
  subtitle: string
  items: ScheduleItem[]
}

export type KneeCheck = 'better' | 'puffier' | 'swollen' | 'gaveWay'

export interface KneeCheckRule {
  outcome: KneeCheck
  label: string
  description: string
  whatToDo: string
}

export interface Checkpoint {
  id: string
  label: string
  weeks: number
  description: string
}

export interface Meal {
  key: string
  slot: string
  dishes: string
  proteinG: number
}

export interface Settings {
  startDate: string
  walkTarget: number
  walkMin: number
  walkMax: number
  theme: 'system' | 'light' | 'dark'
  /** the user was advised a venous Doppler scan, so show the reminder */
  dopplerAdvised?: boolean
  dopplerDone: boolean
  dopplerDoneOn?: string
  checkpointNotes: Record<string, string>
  /** shopping-list items already bought, keyed by week start (Monday) */
  shoppingChecked?: Record<string, string[]>
  /** supplement id -> where the user is with it */
  supplementStatus?: Record<string, 'asked' | 'taking' | 'declined'>
  /** show seated alternatives under each schedule item */
  chairMode?: boolean
  backupLastAt?: string
}

export interface GivingWayEvent {
  time?: string
  note: string
}

export interface DayLog {
  swelling?: number
  pain?: number
  walkMin?: number
  /** weekly bend check: distance from heel to buttock, cm (smaller = more bend) */
  heelToButtockCm?: number
  calfWarning?: boolean
  givingWay: GivingWayEvent[]
  notes?: string
}

export interface DayReview {
  wentWell?: string
  hard?: string
  learned?: string
  tomorrow?: string
  mood?: number
  savedAt?: string
}

export interface WeekReview {
  weekStart: string
  wins?: string
  struggles?: string
  learned?: string
  nextFocus?: string
  nextPlan?: string
  nextWalkTarget?: number
  savedAt?: string
}

export interface DayEntry {
  date: string
  yoga: boolean
  kneeCheck?: KneeCheck
  /** walk target at the time of today's first knee check; keeps re-answering idempotent */
  walkBase?: number
  ticked: string[]
  counters: { quadSets: number; heelProp: number; anklePumps: number }
  log: DayLog
  review?: DayReview
  meals: string[]
  waterL?: number
  updatedAt: string
}
