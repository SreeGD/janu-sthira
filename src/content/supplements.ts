export type Stance = 'food-first' | 'test-first' | 'optional' | 'ask-doctor' | 'skip'
export type Evidence = 'Stronger' | 'Moderate' | 'Mixed' | 'Early' | 'Weak'

export interface Supplement {
  id: string
  name: string
  stance: Stance
  evidence: Evidence
  why: string
  vegOption: string
  food: string
  how: string
  caution: string
}

export const stanceLabel: Record<Stance, string> = {
  'food-first': 'Food first',
  'test-first': 'Test first',
  optional: 'Optional',
  'ask-doctor': 'Ask your doctor',
  skip: 'Skip',
}

export const supplements: Supplement[] = [
  {
    id: 'protein', name: 'Protein', stance: 'food-first', evidence: 'Stronger',
    why: 'Best-supported. Extra protein helps rebuild quad, hamstring and hip muscle, which stands in for the ACL. Most trials are after surgery, but the muscle logic applies to rehab too.',
    vegOption: 'Whey protein (dairy, so fine for lacto-vegetarian) or soya / pea protein isolate (plant-based).',
    food: 'Paneer, curd, hung curd, milk, dals, rajma, chole, soya chunks, tofu, besan, moong. Your plan targets about 105 g a day.',
    how: 'Fill gaps with food first. A scoop (about 24 g) only on days you miss your target, ideally after a session.',
    caution: 'Check labels for added sugar and for onion or garlic flavourings. Drink plenty of water.',
  },
  {
    id: 'vitamin-d', name: 'Vitamin D', stance: 'test-first', evidence: 'Moderate',
    why: 'Low levels are linked with weaker muscle and poorer healing. Supplementing has helped quad strength after ACL surgery. Only worth it if you are actually low.',
    vegOption: 'D2 (ergocalciferol) is plant-based. Many D3 products come from sheep wool (lanolin), which suits lacto-vegetarian but not vegan. Lichen-based D3 is a vegan option.',
    food: 'Milk, curd and fortified foods give a little; sunlight does most of the work.',
    how: 'Get a blood test (25-OH vitamin D). If low, your doctor sets the dose and the retest date.',
    caution: 'More is not better: high doses over time can raise blood calcium. Do not self-dose.',
  },
  {
    id: 'b12', name: 'Vitamin B12', stance: 'test-first', evidence: 'Moderate',
    why: 'Vegetarians are often low. B12 supports nerves and muscle. Low B12 can also cause tiredness and weakness that would hold back rehab.',
    vegOption: 'Cyanocobalamin or methylcobalamin tablets are made by fermentation, so they are vegetarian and vegan.',
    food: 'Milk, curd, paneer.',
    how: 'Get a blood test. If low, your doctor chooses tablets or injections and the dose.',
    caution: 'Do not self-dose in place of a test; low B12 has other causes your doctor may want to check.',
  },
  {
    id: 'omega3', name: 'Omega-3 (EPA / DHA)', stance: 'optional', evidence: 'Early',
    why: 'Helps calm inflammation. One trial of flaxseed oil in ACL patients showed better outcomes at 2 years; other support is indirect.',
    vegOption: 'Algal oil (DHA / EPA from algae) is the vegetarian version of fish oil. Flax, chia and walnuts give ALA, which the body converts only partly.',
    food: 'Ground flaxseed (1 tbsp a day, already in the plan), walnuts, chia.',
    how: 'Food first. Algal oil is an optional add-on once your doctor agrees.',
    caution: 'High doses can thin the blood. Ask your doctor first, especially if you have vein problems, a pending Doppler scan, or take any medicine. Fish oil is not vegetarian.',
  },
  {
    id: 'vitamin-c', name: 'Vitamin C', stance: 'food-first', evidence: 'Early',
    why: 'Needed to make collagen, the material of ligaments and tendons. Taken with protein before loading exercise it may help collagen remodelling.',
    vegOption: 'Amla, guava, orange, lemon, tomato and capsicum. Amla powder is a plant-based supplement.',
    food: 'Amla, guava, orange, lemon, tomato, capsicum (all in the plan).',
    how: 'Have a vitamin C food with your protein snack about 30-60 minutes before the strength session.',
    caution: 'Food amounts are fine. Very high-dose tablets can upset the stomach.',
  },
  {
    id: 'creatine', name: 'Creatine monohydrate', stance: 'ask-doctor', evidence: 'Mixed',
    why: 'Some studies show it protects muscle during disuse and helps when paired with resistance training. Two trials in ACL reconstruction and leg immobilisation found no benefit in the early weeks.',
    vegOption: 'Creatine is made synthetically, so it is vegetarian and vegan. Vegetarians start with lower stores, but few were included in the trials.',
    food: 'Only in meat and fish, so not in your diet.',
    how: 'Optional, not essential. If you are curious, discuss with your doctor first.',
    caution: 'Needs plenty of water. Avoid it if you have kidney problems. Choose a lab-tested brand.',
  },
  {
    id: 'collagen', name: 'Collagen or gelatin', stance: 'skip', evidence: 'Early',
    why: 'Early research suggests collagen plus vitamin C may help tendon and ligament remodelling when paired with loading exercise. Evidence in ACL injury specifically is thin.',
    vegOption: 'Collagen and gelatin are animal-derived, so they do not fit your diet. The vegetarian route is protein foods plus a vitamin C food (see above). "Vegan collagen boosters" do not contain collagen.',
    food: 'Protein foods and vitamin C foods.',
    how: 'Nothing to take. Skip it.',
    caution: 'Many gummies and powders add sugar and flavourings.',
  },
  {
    id: 'calcium', name: 'Calcium', stance: 'food-first', evidence: 'Moderate',
    why: 'Bone and muscle strength. Most people can meet it from food.',
    vegOption: 'Milk, curd, paneer, ragi, sesame and greens. Tablets only if your doctor advises.',
    food: 'Milk, curd, ragi, sesame, greens (all in the plan).',
    how: 'Food first. Ask your doctor before taking calcium tablets.',
    caution: 'Tablets can cause constipation, which strains the leg veins. Too much calcium is not helpful.',
  },
  {
    id: 'turmeric-boswellia', name: 'Turmeric extract / Boswellia', stance: 'ask-doctor', evidence: 'Weak',
    why: 'Evidence is for arthritis pain, not for rebuilding the knee after an ACL tear. Kitchen turmeric and haldi milk are fine.',
    vegOption: 'Plant-based. Choose lab-tested products.',
    food: 'Turmeric with black pepper in cooking and haldi milk.',
    how: 'Cooking amounts only, unless your doctor approves an extract.',
    caution: 'Concentrated extracts can interact with blood thinners and diabetes medicine. Ask your doctor, particularly if you have vein problems.',
  },
  {
    id: 'glucosamine', name: 'Glucosamine / chondroitin', stance: 'skip', evidence: 'Weak',
    why: 'Weak evidence in ACL injury, and your menisci and cartilage are normal on the MRI.',
    vegOption: 'Often shellfish-derived or from animal cartilage. Not a good fit.',
    food: 'Not applicable.',
    how: 'Skip it.',
    caution: 'Can contain shellfish; some products have added sugar.',
  },
  {
    id: 'ashwagandha-giloy', name: 'Ashwagandha and giloy', stance: 'skip', evidence: 'Weak',
    why: 'Small strength gains in trials with weight training, but rare cases of liver injury are reported with both.',
    vegOption: 'Ashwagandha is a root, which conflicts with your diet. Giloy has reported liver injury cases in India.',
    food: 'Not applicable.',
    how: 'Skip both, as your booklet says.',
    caution: 'Report yellow eyes, dark urine or severe tiredness to a doctor straight away if you ever take them.',
  },
]

export const testsToAsk = [
  'Vitamin D (25-OH vitamin D)',
  'Vitamin B12',
  'Ask whether any blood tests are needed before you start anything new.',
]

export const supplementIntro =
  'Supplements are the smallest piece of recovery. Strength work, sleep and food protein do far more. This page lists what the research suggests, with a vegetarian option for each. It is general information, not advice for you personally.'

export const supplementWarning =
  'Check with your doctor or pharmacist before starting anything, especially if you have vein problems, a Doppler scan pending, or take regular medicines. Start one new product at a time, for a week, so you can tell if it disagrees with you.'
