import { checkpoints } from '../content/checkpoints'
import { addDays, daysBetween } from './dates'

export interface CheckpointStatus {
  id: string
  label: string
  description: string
  date: string
  daysLeft: number
  passed: boolean
}

export function checkpointStatuses(start: string, today: string): CheckpointStatus[] {
  return checkpoints.map((c) => {
    const date = addDays(start, c.weeks * 7)
    const daysLeft = daysBetween(today, date)
    return { id: c.id, label: c.label, description: c.description, date, daysLeft, passed: daysLeft < 0 }
  })
}

export function nextCheckpoint(start: string, today: string): CheckpointStatus | undefined {
  return checkpointStatuses(start, today).find((c) => !c.passed)
}
