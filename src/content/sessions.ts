import type { ScheduleItem, SessionTemplate } from './types'

const item = (
  id: string,
  text: string,
  cardCodes: string[],
  opts: Partial<Pick<ScheduleItem, 'minutes' | 'amount' | 'tags'>> = {},
): ScheduleItem => ({ id, text, cardCodes, tags: [], ...opts })

export const morning: SessionTemplate = {
  id: 'morning',
  slot: 'morning',
  title: 'Morning session',
  subtitle: '50 min | stretch + walk',
  items: [
    item('m1', 'Ankle pumps and circles, lying or sitting', ['M1'], { minutes: '0-2', amount: '20 pumps; 10 circles each way', tags: ['rest-ok'] }),
    item('m2', 'Heel slides, gentle, to loosen the knee', ['M2'], { minutes: '2-4', amount: '1 x 15' }),
    item('m3', 'Hamstring stretch with strap', ['M3'], { minutes: '4-6', amount: '3 x 5 breaths' }),
    item('m4', 'Calf stretch: downward dog with hands on a chair seat', ['M4'], { minutes: '6-8', amount: '3 x 5 breaths' }),
    item('m5', 'Quad sets to switch the thigh on before walking', ['M5'], { minutes: '8-10', amount: '10 x 5-sec holds', tags: ['rest-ok'] }),
    item('m6', 'Flat-surface walk. Start at 15-20 min while swelling settles, add 5 min when the knee is calm', ['M6'], { minutes: '10-50', amount: '{walk} min (target 40)', tags: ['walk'] }),
  ],
}

export const midmorning: SessionTemplate = {
  id: 'midmorning',
  slot: 'midmorning',
  title: 'Mid-morning (desk)',
  subtitle: 'heel prop #1 + quad sets',
  items: [
    item('d-hp1', 'Heel prop #1: rest the heel on a stool or chair for 10 minutes while you work, knee unsupported', ['L5'], { amount: '10 min', tags: ['rest-ok'] }),
    item('d-qs1', 'Add 10 quad sets', ['M5'], { amount: '10 x 5-sec holds', tags: ['rest-ok'] }),
  ],
}

export const lunch: SessionTemplate = {
  id: 'lunch',
  slot: 'lunch',
  title: 'Before lunch',
  subtitle: '20 min | quad + hip strength',
  items: [
    item('l-qs', 'Quad sets', ['M5'], { minutes: '0-3', amount: '10 x 5-sec holds', tags: ['rest-ok'] }),
    item('l1', 'Straight-leg raises', ['L1'], { minutes: '3-8', amount: '3 x 10' }),
    item('l2', 'Bridges', ['L2'], { minutes: '8-12', amount: '3 x 10-15' }),
    item('l3', 'Clamshells, both sides', ['L3'], { minutes: '12-16', amount: '2 x 12-15' }),
    item('l4', 'Side leg lifts, both sides', ['L4'], { minutes: '16-20', amount: '2 x 12-15' }),
  ],
}

export const afternoon: SessionTemplate = {
  id: 'afternoon',
  slot: 'afternoon',
  title: 'Afternoon (desk)',
  subtitle: 'heel prop #2, quad sets, ankle pumps, bend work',
  items: [
    item('d-hp2', 'After lunch: heel prop #2', ['L5'], { amount: '10 min', tags: ['rest-ok'] }),
    item('d-qs2', 'Mid-afternoon: 10 quad sets', ['M5'], { amount: '10 x 5-sec holds', tags: ['rest-ok'] }),
    item('d-ap', 'Mid-afternoon: 20 ankle pumps (or band ankle push, B7)', ['M1', 'B7'], { amount: '20 pumps', tags: ['rest-ok'] }),
    item('d-hs2', 'Heel slides, second round: gently, towel around the foot for the last bit', ['M2'], { amount: '1 x 15' }),
    item('d-k1', 'Seated knee bend: slide the foot back under the chair', ['K1'], { amount: '10 reps, hold 10 sec' }),
  ],
}

const eveningStart = [
  item('e1', 'Stationary bike, low resistance (no bike: 15 min heel slides, ankle work and a short flat walk)', ['E1'], { minutes: '0-15', amount: '15 min', tags: ['bike'] }),
  item('e-qc', 'Quad sets', ['M5'], { minutes: '15-20', amount: '10 x 5 sec', tags: ['rest-ok'] }),
  item('e2', 'Calf raises', ['E2'], { minutes: '15-20', amount: '2 x 15', tags: ['standing'] }),
]

const eveningEnd = [
  item('e10', 'Legs up the wall', ['E10'], { minutes: '40-45', amount: '5 min', tags: ['rest-ok'] }),
]

export const eveningA: SessionTemplate = {
  id: 'evening-A',
  slot: 'evening',
  title: 'Evening session: Day A (Mon / Wed / Fri)',
  subtitle: '45 min | bike + band circuit + recovery',
  items: [
    ...eveningStart,
    item('b1', 'Band: terminal knee extension', ['B1'], { minutes: '20-40', amount: '2 x 12-15', tags: ['standing'] }),
    item('b2', 'Band: hamstring curl', ['B2'], { amount: '2 x 12-15' }),
    item('b3', 'Band: lying leg press', ['B3'], { amount: '2 x 12-15' }),
    item('b4', 'Band: banded bridge', ['B4'], { amount: '2 x 12-15' }),
    item('b5', 'Band: standing hip abduction + kickback', ['B5'], { amount: '2 x 12-15', tags: ['standing'] }),
    item('b6', 'Band: lateral band walk (only once the swelling has clearly gone down)', ['B6'], { amount: '2 x 12-15', tags: ['standing', 'skip-puffy'] }),
    item('b8', 'Band: Pallof press', ['B8'], { amount: '2 x 12-15', tags: ['standing'] }),
    ...eveningEnd,
  ],
}

export const eveningB: SessionTemplate = {
  id: 'evening-B',
  slot: 'evening',
  title: 'Evening session: Day B (Tue / Thu / Sat)',
  subtitle: '45 min | bike + good leg + core + recovery',
  items: [
    ...eveningStart,
    item('e3', 'Good-leg training', ['E3'], { minutes: '20-40', amount: 'as on card', tags: ['standing', 'skip-puffy'] }),
    item('e4', 'Tree pose on the good leg', ['E4'], { amount: 'as on card', tags: ['standing'] }),
    item('e5', 'Chair pose at the wall (hold off until swelling has gone down)', ['E5'], { amount: 'as on card', tags: ['standing', 'skip-puffy'] }),
    item('e6', 'Plank', ['E6'], { amount: 'as on card' }),
    item('e7', 'Side plank from the knees', ['E7'], { amount: 'as on card' }),
    item('e8', 'Dead bug', ['E8'], { amount: 'as on card' }),
    item('e9', 'Half locust', ['E9'], { amount: 'as on card' }),
    ...eveningEnd,
  ],
}

export const eveningSunday: SessionTemplate = {
  id: 'evening-sunday',
  slot: 'evening',
  title: 'Evening: Sunday, lighter day',
  subtitle: 'yoga optional + recovery',
  items: [
    item('sun-yoga', 'Yoga (optional)', [], { amount: 'as you feel' }),
    ...eveningEnd,
  ],
}

export const eveningYoga: SessionTemplate = {
  id: 'evening-yoga',
  slot: 'evening',
  title: 'Evening session: Yoga day',
  subtitle: '40 min yoga replaces the evening session',
  items: [
    item('yoga', '40-minute yoga sequence (see the separate Yoga PDF)', [], { amount: '40 min' }),
    ...eveningEnd,
  ],
}

export const bedtime: SessionTemplate = {
  id: 'bedtime',
  slot: 'bedtime',
  title: 'Bedtime',
  subtitle: 'quad sets, heel prop, bend, ice if swollen',
  items: [
    item('bd-qs', '10 quad sets', ['M5'], { amount: '10 x 5-sec holds', tags: ['rest-ok'] }),
    item('bd-hp3', 'Heel prop #3: Savasana with a roll under the heel', ['L5', 'E11'], { amount: '10 min', tags: ['rest-ok'] }),
    item('d-k2', 'Face-down strap bend (gentle, never forced)', ['K2'], { amount: '5 x 10-20 sec' }),
    item('bd-ice', 'Ice 15 min if the knee is swollen (legs up the wall after the walk and in the evening)', [], { amount: '15 min', tags: ['rest-ok'] }),
  ],
}

export const eveningFor = {
  A: eveningA,
  B: eveningB,
  SUNDAY: eveningSunday,
  YOGA: eveningYoga,
}

export const allSessions: SessionTemplate[] = [
  morning, midmorning, lunch, afternoon, eveningA, eveningB, eveningSunday, eveningYoga, bedtime,
]
