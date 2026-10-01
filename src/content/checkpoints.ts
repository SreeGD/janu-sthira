import type { Checkpoint } from './types'

export const checkpoints: Checkpoint[] = [
  { id: 'wk6', label: 'Week 6 review', weeks: 6, description: 'Range of movement, swelling, quad strength, walking. Any giving-way episodes?' },
  { id: 'm3', label: 'Month 3 review', weeks: 13, description: 'The key decision point. Knee stable in daily life? Meeting Phase 2 goals?' },
  { id: 'm6', label: 'Month 6 review', weeks: 26, description: 'Are you doing everything you want to do, with a knee you trust?' },
]

export const phases = [
  {
    name: '1. Calm and activate (weeks 0-6)',
    focus: 'This daily schedule.',
    goals: 'Knee fully straight (same as other side); bends to ~120 degrees; little or no swelling; leg raise with no bend; normal walking; no giving way.',
  },
  {
    name: '2. Strength and control (weeks 6-12)',
    focus: 'Heavier bands; band exercises standing on the injured leg (B1, B5); mini squats to ~60 degrees; step-ups and slow step-downs on the injured leg; hamstring curls; single-leg bridges and calf raises; balance on the injured leg (floor, then cushion); bike with more resistance; walks up to 45-60 min; perturbation training with a physio.',
    goals: 'Single-leg balance 30+ sec on the injured leg; step-down with the knee staying in line; thigh strength close to the other side; still no giving way.',
  },
  {
    name: '3. Back to your activities (months 3-6)',
    focus: 'Forward and side lunges; single-leg sit-to-stand; brisk walking and gentle slopes or trekking; yoga progressions; sport-specific drills only if cleared.',
    goals: 'Confident in daily life, stairs and uneven ground; strength and hop tests near 90% of the other leg (if you want pivoting sports).',
  },
]

export const reconsiderSurgery = [
  'The knee keeps giving way in everyday life despite 3 months of good rehab.',
  'The knee locks or catches (possible meniscus tear) or has new swelling after an episode.',
  'The MRI shows a repairable meniscus tear your surgeon wants to fix early.',
  "You can't do the activities that matter to you (for example trekking, uneven ground, sport) without the knee feeling unsafe.",
]

export const livingTips: { title: string; points: string[] }[] = [
  {
    title: 'Everyday habits',
    points: [
      'Strength for life: 2-3 strength and balance sessions a week after the 6-month programme.',
      'Turn with small steps; never pivot on the planted foot of the injured leg.',
      'Stairs: hold the rail; lead with the injured leg going down, the good leg going up.',
      'Avoid deep squatting, cross-legged floor sitting and Indian-style toilets.',
      'Home safety: anti-slip bathroom mats, a grab bar, night lights, clutter-free floors, shoes with grip.',
      "Don't let fear make you inactive.",
    ],
  },
  {
    title: 'At the desk',
    points: [
      'Stand and walk 2-3 minutes every 30-45 minutes.',
      'Heel prop at the desk: rest the injured heel on a stool, knee unsupported, for 10 minutes once or twice a day.',
      "Don't cross your legs (pressure on veins).",
      'Under the desk: ankle pumps and quad sets during calls.',
      'Long flights or journeys: aisle seat, walk every hour, ankle pumps; ask your doctor about compression stockings.',
    ],
  },
  {
    title: 'Driving and getting on and off vehicles',
    points: [
      'Automatic car: seat far enough back that the injured knee is comfortably bent; get in and out with both legs together; stop every 60-90 minutes on long drives.',
      'High vehicles (tractor, truck): face the vehicle, use handholds, keep 3 points of contact, lower the injured leg first, and NEVER jump down.',
    ],
  },
  {
    title: 'Outdoor and manual work',
    points: [
      'Boots with grip and ankle support; avoid deep mud and wet bunds until strong (Phase 3).',
      'Sit on a low stool or kneel on the good knee on a pad; use long-handled tools.',
      'Keep loads light and close to your body; never lift while twisting.',
      'Ladders and trees: avoid until Phase 3 goals are met.',
    ],
  },
]
