import type { KneeCheck, KneeCheckRule } from './types'

export const kneeCheckRules: KneeCheckRule[] = [
  {
    outcome: 'better', label: 'Same or better', description: 'Calm knee this morning.',
    whatToDo: 'Full plan. Add 5 minutes to the walk when the knee is calm, until you reach 40.',
  },
  {
    outcome: 'puffier', label: 'A bit puffier or stiffer', description: 'Slightly more swollen or stiff than yesterday.',
    whatToDo: 'Keep stretches, quad sets, heel props, hip work. Halve the walk and the bike. Skip chair pose and step-ups.',
  },
  {
    outcome: 'swollen', label: 'Clearly swollen, warm or painful', description: 'Obvious swelling, warmth or pain.',
    whatToDo: 'Rest day: quad sets, heel props, ankle pumps, legs up the wall, ice. Restart with a shorter walk next day.',
  },
  {
    outcome: 'gaveWay', label: 'Knee shifted or gave way', description: 'The knee shifted or buckled.',
    whatToDo: 'Stop standing work and walking; note what you were doing; tell your physio or surgeon.',
  },
]

export const kneeCheckLabel: Record<KneeCheck, string> = {
  better: 'Same or better',
  puffier: 'A bit puffier',
  swollen: 'Swollen',
  gaveWay: 'Gave way',
}
