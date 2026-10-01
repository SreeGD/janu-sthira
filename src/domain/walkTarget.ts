import type { KneeCheck } from '../content/types'

export const WALK_MIN = 15
export const WALK_MAX = 40

export function clampWalk(n: number, min = WALK_MIN, max = WALK_MAX): number {
  return Math.min(max, Math.max(min, n))
}

/** Target proposed for the next day, given today's knee check. */
export function nextWalkTarget(current: number, check: KneeCheck | undefined, min = WALK_MIN, max = WALK_MAX): number {
  switch (check) {
    case 'better':
      return clampWalk(current + 5, min, max)
    case 'swollen':
      return min
    case 'puffier':
    case 'gaveWay':
    default:
      return clampWalk(current, min, max)
  }
}

/** Minutes to actually walk today. */
export function walkMinutesToday(target: number, check: KneeCheck | undefined): number {
  switch (check) {
    case 'puffier':
      return Math.round(target / 2)
    case 'swollen':
    case 'gaveWay':
      return 0
    default:
      return target
  }
}
