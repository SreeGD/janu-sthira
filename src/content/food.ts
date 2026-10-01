import type { Meal } from './types'

export const proteinTarget = 105
export const waterGoalL = 3

export const nutrients = [
  { need: 'Protein, 1.2-1.5 g per kg body weight a day', why: 'Builds the quad, hamstring and hip muscle the rehab depends on.', sources: 'Paneer, curd, hung curd, milk, dals, rajma, chole, soya chunks, tofu, besan, moong' },
  { need: 'Vitamin C', why: 'Needed to make collagen, the building material of ligaments and tendons.', sources: 'Amla, guava, orange, lemon, tomato, capsicum' },
  { need: 'Calcium + vitamin D', why: 'Bone and muscle strength.', sources: 'Milk, curd, ragi, sesame, greens; get vitamin D checked' },
  { need: 'Omega-3 fats', why: 'Calm inflammation.', sources: 'Flaxseed, walnuts, chia' },
  { need: 'Vitamin B12', why: 'Nerve and muscle function; vegetarians are often low.', sources: 'Milk, curd; get it checked' },
  { need: 'Fibre + water', why: 'Avoids straining, which pressures leg veins.', sources: 'Whole grains, dals, fruit; 2.5-3 litres of water a day' },
]

export const flavourTip =
  'Flavour without onion or garlic: hing (asafoetida), cumin, mustard seeds, curry leaves, tomato, tamarind, coconut, fennel, kasuri methi, green chilli, fresh coriander (ginger and turmeric if your practice allows).'

export const plateGuide = 'Half vegetables, greens and salad; a quarter protein (dal, paneer, rajma, tofu); a quarter grains (roti, millet, rice). Each main meal should give 20-30 g protein.'

/** Fixed daily slots; the 'dishes' text for breakfast/snack/dinner depends on the weekday rotation. */
export const dailyPattern: { key: string; slot: string; what: string; proteinG: number }[] = [
  { key: 'prewalk', slot: 'Before morning walk', what: 'Warm water, 5 soaked almonds, 2 walnuts, 1 tsp flaxseed', proteinG: 4 },
  { key: 'midam', slot: 'Mid-morning', what: 'Guava, orange or amla (whole fruit is best; a small glass of fresh juice is fine) + roasted chana or buttermilk', proteinG: 7 },
  { key: 'bedtime', slot: 'Bedtime', what: 'Warm milk with a pinch of turmeric and black pepper', proteinG: 8 },
]

/** 7-day rotation, index 0 = Monday ... 6 = Sunday. */
export const rotation = [
  { day: 'Mon', breakfast: '2 pesarattu, tomato chutney', lunch: 'Rajma, jeera rice, palak', snack: 'Moong sprout chaat', dinner: 'Paneer-capsicum sabzi, rotis' },
  { day: 'Tue', breakfast: 'Besan chilla with paneer', lunch: 'Toor dal, beans poriyal, rotis', snack: 'Makhana + buttermilk', dinner: 'Moong-dal khichdi with peas, curd' },
  { day: 'Wed', breakfast: 'Ragi dosa, sambar (hing)', lunch: 'Chole, rotis, cabbage sabzi', snack: 'Tawa paneer tikka', dinner: 'Tofu-spinach curry, millet roti' },
  { day: 'Thu', breakfast: 'Oats-peas upma, hung curd', lunch: 'Gongura / palak dal, rice, raita', snack: 'Chana chaat', dinner: 'Soya chunk-capsicum sabzi, rotis' },
  { day: 'Fri', breakfast: 'Moong chilla, coconut chutney', lunch: 'Sambar rice, thotakura fry, curd', snack: 'Peanut-sesame chikki, buttermilk', dinner: 'Paneer bhurji with tomato, rotis' },
  { day: 'Sat', breakfast: 'Idli, sambar, glass of milk', lunch: 'Mixed dal, bottle-gourd sabzi, rotis', snack: 'Sprout salad with lemon', dinner: 'Veg pulao with soya chunks, raita' },
  { day: 'Sun', breakfast: 'Paneer paratha with curd', lunch: 'Kadhi, rice, bhindi sabzi', snack: 'Fruit bowl + roasted chana', dinner: 'Light dosa with sambar' },
]

/** Protein per slot from the booklet's daily eating pattern. */
export const slotProtein = { breakfast: 25, lunch: 28, snack: 12, dinner: 22 }

export function mealsForDay(dayIndex: number): Meal[] {
  const r = rotation[dayIndex]
  const fixed = dailyPattern.map((p) => ({ key: p.key, slot: p.slot, dishes: p.what, proteinG: p.proteinG }))
  return [
    fixed[0],
    { key: 'breakfast', slot: 'Breakfast (after walk)', dishes: `${r.breakfast} + 1 cup curd`, proteinG: slotProtein.breakfast },
    fixed[1],
    { key: 'lunch', slot: 'Lunch', dishes: r.lunch, proteinG: slotProtein.lunch },
    { key: 'snack', slot: 'Before evening session', dishes: r.snack, proteinG: slotProtein.snack },
    { key: 'dinner', slot: 'Dinner (lighter)', dishes: r.dinner, proteinG: slotProtein.dinner },
    fixed[2],
  ]
}

export const proteinReference = [
  ['Paneer, 100 g', '~18 g'], ['Hung curd, 1 cup', '~15 g'], ['Curd, 1 cup', '~8 g'], ['Milk, 1 glass (250 ml)', '~8 g'],
  ['Soya chunks, 30 g dry', '~15 g'], ['Tofu, 100 g', '~10 g'], ['Cooked rajma or chole, 1 cup', '~13 g'],
  ['Cooked dal, 1 cup', '~9 g'], ['Pesarattu / besan chilla, 2', '~12 g'], ['Roasted chana, 30 g', '~6 g'],
  ['Peanuts, 30 g', '~7 g'], ['Whey protein, 1 scoop (optional)', '~24 g'],
]

export const eatLess = [
  'Fried and sugary foods, maida, sweets, packaged snacks: they fuel inflammation and weight gain.',
  'Salty foods (pickles, papad, namkeen): they worsen swelling and are hard on the veins.',
  'Extra weight: each kilogram lost takes roughly 3-4 kg of load off the knee with every step.',
]

export const soups = [
  { name: 'Moringa and Moong Dal Soup', note: '~10-12 g protein / bowl', need: '1/2 cup yellow moong dal, 1 tomato, 1 cup fresh drumstick leaves (or 1 tsp moringa powder), 1 tsp ghee, 1/2 tsp cumin, pinch of hing, 8-10 curry leaves, pepper, turmeric, salt, juice of 1/2 lemon', steps: ['Pressure-cook the moong dal and tomato with 3 cups water until soft (3 whistles). Whisk smooth.', 'Heat ghee. Add cumin, hing and curry leaves; let them sizzle.', 'Pour in the dal, add pepper, turmeric and salt. Simmer 3 minutes.', 'Add the fresh moringa leaves and simmer 2-3 minutes. (Powder: stir in after switching off the heat.)', 'Switch off and squeeze in the lemon juice just before serving.'] },
  { name: 'Drumstick and Tomato Rasam-Soup', note: 'light + warming', need: '2 drumsticks cut in 5 cm pieces, 2 ripe tomatoes, a small ball of tamarind soaked, 1/2 cup cooked toor dal with its water, 1 tsp ghee, mustard seeds, cumin, hing, curry leaves, 1 tsp pepper-cumin powder, coriander, salt', steps: ['Boil drumstick pieces in 2 cups water with salt and turmeric until tender (8-10 min).', 'Add tomatoes and tamarind water; simmer 5 minutes until the tomatoes break down.', 'Stir in the mashed toor dal and pepper-cumin powder. Simmer 3 minutes.', 'Temper ghee with mustard seeds, cumin, hing and curry leaves; pour over.', 'Finish with coriander.'] },
  { name: 'Pumpkin and Moong Soup', note: 'creamy, no dairy', need: '2 cups red pumpkin, 1/4 cup yellow moong dal, 1/2 cup thin coconut milk, 1 tsp ghee, 1/2 tsp cumin, pinch of hing, pepper, nutmeg, salt, 1 tbsp toasted pumpkin seeds', steps: ['Pressure-cook pumpkin and moong dal with 2 cups water (2 whistles).', 'Blend until smooth.', 'Heat ghee, add cumin and hing, then pour in the blended soup.', 'Add coconut milk, pepper, nutmeg and salt; warm through without boiling hard.', 'Top with toasted pumpkin seeds.'] },
]

export const powderRoutine = [
  ['Morning, before walk', '1 tsp amla powder in warm water'],
  ['Breakfast', '1 tbsp ground flaxseed stirred into curd'],
  ['Lunch', '1 tsp moringa powder stirred into dal after cooking; sesame podi with rice'],
  ['Before dinner', 'Moringa-moong soup (fresh leaves) 4-5 days a week'],
  ['Bedtime', 'Haldi milk: a pinch of turmeric and black pepper in warm milk'],
]

export const powderNote =
  'Skip ashwagandha (a root, and a rare cause of liver injury) and giloy (liver injury cases). Discuss boswellia and turmeric extracts with your doctor first, especially if you have vein problems. Buy powders from reputable brands with lab testing, and start one new powder at a time for a week.'

export interface Drink {
  name: string
  note: string
}

/** Juices and drinks, grouped by how freely to have them. Follows the plan's rules: vegetarian, no onion or garlic. */
export const drinks = {
  good: [
    { name: 'Plain water', note: 'The main drink: 2.5-3 litres a day across the day. It helps the veins and avoids constipation and straining.' },
    { name: 'Warm water with amla powder or lemon', note: 'Before the morning walk. Lemon adds vitamin C and no sugar.' },
    { name: 'Buttermilk (chaas)', note: 'Plain, lightly salted. A good protein and calcium snack with roasted chana.' },
    { name: 'Tender coconut water', note: 'A glass on hot days or after a long walk. Natural potassium; no added sugar.' },
    { name: 'Jeera, ajwain or fennel water, unsweetened herbal tea', note: 'Flavour without sugar.' },
    { name: 'Warm haldi milk at bedtime', note: 'Already in the plan: about 8 g protein.' },
  ] as Drink[],
  limit: [
    { name: 'Fresh orange, mosambi, guava or pomegranate juice', note: 'One small glass (about 150 ml), freshly squeezed with no added sugar, taken with a protein snack or a meal. Whole fruit is better: the fibre slows the sugar and keeps you full. Count juice as a fruit serving, not as water.' },
    { name: 'Fresh amla juice', note: 'Rich in vitamin C. Dilute it with water and keep it small: it is sour and can upset the stomach.' },
    { name: 'Carrot juice', note: 'Vitamin A and natural sugar, with the fibre removed. One small glass with a meal; the whole carrot is better.' },
    { name: 'Beetroot juice', note: 'Can lower blood pressure a little. Keep it to a small glass, and ask your doctor first if you take blood pressure medicine.' },
    { name: 'Sugarcane juice', note: 'A big dose of sugar. Only occasionally and a small glass.' },
  ] as Drink[],
  avoid: [
    { name: 'Packaged and bottled juices, nectars and squashes', note: 'Mostly added sugar with little fibre. Sugar fuels inflammation and weight gain.' },
    { name: 'Soft drinks, energy drinks, sweet lassi and sugary milkshakes', note: 'Empty calories and sugar with no benefit for the muscle you are rebuilding.' },
    { name: 'Very salty drinks (salted lassi, heavily salted lime water)', note: 'Salt worsens swelling and is hard on the leg veins.' },
    { name: '"Detox" or juice-only cleanses', note: 'They cut the protein your muscles need.' },
    { name: 'Alcohol', note: 'Disturbs sleep and recovery and can interact with medicines. Ask your doctor before drinking.' },
  ] as Drink[],
  cautions: [
    'Grapefruit juice interacts with many medicines. If you take regular medicines, ask your pharmacist before having it.',
    'Amla and bitter-gourd juices can lower blood sugar. If you take diabetes medicine, ask your doctor first.',
    'Have juice with protein (for example roasted chana or curd), not on its own, so the sugar is absorbed more slowly.',
  ],
}
