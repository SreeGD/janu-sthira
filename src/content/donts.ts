export interface Dont {
  id: string
  dont: string
  why: string
  instead: string
  card?: string
  top?: boolean
}

export interface DontGroup {
  id: string
  title: string
  items: Dont[]
}

const d = (id: string, dont: string, why: string, instead: string, extra: Partial<Dont> = {}): Dont => ({ id, dont, why, instead, ...extra })

export const dontGroups: DontGroup[] = [
  {
    id: 'twist',
    title: 'Twisting, pivoting and sudden moves',
    items: [
      d('pivot', "Don't pivot or twist on the injured leg", 'A knee without an ACL cannot control rotation, so a pivot is the classic way it gives way and damages the meniscus and cartilage.', 'Turn with several small steps and move your feet to turn.', { top: true }),
      d('jump', "Don't jump down from steps, vehicles, walls or ditches", 'The landing shock on a loose knee is a common trigger for giving way.', 'Face the step, use handholds and lower the injured leg first. Use a plank or steps across ditches.', { top: true }),
      d('sports', "Don't play twisting or jumping sports until cleared", 'Football, cricket fielding, basketball, singles badminton, jumping and sudden turns all cause giving way.', 'Stay with straight-line activity: walking, cycling, swimming (flutter kick), gym machines. Get cleared by your physio or surgeon first.'),
      d('uneven', "Don't walk on uneven, slippery or sloping ground early on", 'Grass, gravel, slopes, mud, crowds and wet floors make a slip or sidestep more likely.', 'Use a flat, dry, even path and shoes with good grip until your strength and balance goals are met.', { card: 'M6' }),
      d('ladders', "Don't climb ladders or trees before the later-phase goals are met", 'A fall or a bad step from height risks another giving-way episode.', 'Wait for the Phase 3 goals, and have someone with you when you do.'),
      d('lift-twist', "Don't lift or carry while twisting", 'Load plus rotation puts extra strain on the knee.', 'Keep loads light and close to the body, lift with a straight back and both knees, and move your feet to turn.'),
    ],
  },
  {
    id: 'bend',
    title: 'Bending and floor sitting',
    items: [
      d('force-bend', "Don't force a swollen knee into a deep bend", 'It makes the swelling worse, and more swelling reduces the bend further.', 'Go gently, calm the swelling first (ice, legs up the wall, quad sets), and use the bend cards.', { card: 'K1', top: true }),
      d('cross-legged', "Don't sit cross-legged, in lotus pose or on your heels (vajrasana)", 'These need a very deep bend (about 140-150°) plus a twist, the worst combination for a knee without an ACL. They also squeeze a Baker\'s cyst if you have one.', 'Sit on a cushion or low stool with the injured leg straight out, or use a chair.', { card: 'K3' }),
      d('deep-squat', "Don't do deep squats, Indian-style toilets or low floor seating", 'Deep bending under load stresses the knee and cartilage.', 'Use a western commode, a low stool for prayer, and lower yourself carefully when you must go down.'),
      d('chair-early', "Don't do chair pose, lateral band walks or step-ups while the knee is swollen", 'They load a swollen knee before it can control the load.', 'Wait until the swelling has clearly gone down. Keep quad sets, heel props and straight-leg raises going.', { card: 'E5' }),
      d('deep-chair', "Don't go deeper than a shallow bend in wall chair pose", 'Past 30-45° the front of the knee takes too much load.', 'Bend only a little and stop if the front of the knee hurts.', { card: 'E5' }),
    ],
  },
  {
    id: 'swelling',
    title: 'Swelling, pain and warning signs',
    items: [
      d('push-through', "Don't push through sharp pain, catching, locking or a shifting feeling", 'These can mean meniscus or ligament damage.', 'Stop, rest, and tell your physio. Each card has its own stop-if line.', { top: true }),
      d('calf', "Don't ignore a painful, warm, tight or swollen calf", 'It can be a blood clot or a burst Baker\'s cyst, and only a scan tells them apart.', 'Get checked the same day. For sudden breathlessness or chest pain, call emergency services.', { top: true }),
      d('progress-fast', "Don't add more than 5 minutes to the walk at a time", 'Doing too much too soon brings the swelling back, which switches the quad off again.', 'Add 5 minutes only when the knee is calm the next morning, up to 40.', { card: 'M6' }),
      d('keep-going-swollen', "Don't carry on with the full plan on a swollen or painful morning", 'Training through swelling slows recovery.', 'Do the rest-day plan: quad sets, heel props, ankle pumps, legs up the wall and ice.'),
      d('wait-out', "Don't wait out a giving-way episode", 'Each episode can damage the meniscus and cartilage.', 'Note what you were doing, stop standing work for the day, and book a review.'),
      d('skip-quad', "Don't skip quad sets and heel props", 'They are the most important exercises: they switch the thigh on and let the knee straighten fully. Losing full straightening is much harder to fix.', 'Do them through the day, even on rest days.', { card: 'M5' }),
    ],
  },
  {
    id: 'form',
    title: 'Exercise form',
    items: [
      d('band-snap', "Don't let a resistance band snap back, or use a damaged band", 'The sudden pull jerks the knee, and a nicked band can snap.', 'Take 3 counts to return, check the band before every use and anchor it safely.'),
      d('snap-back', "Don't snap the knee back when you straighten it against a band", 'Hyperextending a loose knee stresses it.', 'Straighten firmly but smoothly, keep the heel down and do not twist.', { card: 'B1' }),
      d('knee-cave', "Don't let the knee fall inward or twist during bridges, band work and leg presses", 'Inward collapse is the same position that happens in an ACL injury.', 'Keep the knee in line with the second toe and the foot.', { card: 'B4' }),
      d('bike-stand', "Don't stand on the pedals or set the bike seat too low", 'Standing loads the knee, and a low seat forces a deep bend.', 'Seat high, knee nearly straight at the bottom, easy resistance.', { card: 'E1' }),
      d('strap-pull', "Don't yank the strap or force the stretch", 'Forcing a stretch causes pain, swelling and a tighter knee afterwards.', 'Pull gently and hold, then release slowly.', { card: 'K2' }),
      d('tree-knee', "Don't rest your foot on the side of the knee in tree pose", 'Pressure on the side of the knee can strain it.', 'Rest the sole on the inner calf, or keep the toes on the floor.', { card: 'E4' }),
      d('hold-breath', "Don't hold your breath during holds", 'It raises blood pressure and makes you tense.', 'Breathe steadily; breathe out on the effort.'),
    ],
  },
  {
    id: 'daily',
    title: 'Daily life and home',
    items: [
      d('cross-legs', "Don't sit with your legs crossed or stay seated for long stretches", 'It adds pressure on the leg veins and leaves the knee stiff.', 'Stand and walk 2-3 minutes every 30-45 minutes, and do ankle pumps and quad sets under the desk.'),
      d('slippery', "Don't wear smooth-soled shoes or leave the home with slip hazards", 'A slip on a loose knee can cause giving way.', 'Use shoes with grip, anti-slip bathroom mats, a grab bar, night lights and clear floors.'),
      d('car-twist', "Don't twist on the planted foot when getting in or out of a car", 'It is a hidden pivot.', 'Sit first, then swing both legs in together. Turn both legs out together before standing.'),
      d('stairs-no-rail', "Don't use stairs without the rail early on", 'A missed step is a high-risk moment.', 'Hold the rail, lead with the injured leg going down and the good leg going up.'),
      d('fear-inactive', "Don't let fear keep you inactive", 'Inactivity weakens the muscle that now does the ACL\'s job and makes instability more likely.', 'Stay active in straight-line activities and keep strength sessions going, even after the programme.'),
      d('brace-only', "Don't rely on a brace instead of strength", 'A brace supports the muscles but cannot replace them.', 'Use it only for rough-ground outings if at all, and keep building strength.'),
    ],
  },
  {
    id: 'food',
    title: 'Food and supplements',
    items: [
      d('salty-fried', "Don't lean on salty, fried and sugary foods", 'Salt worsens swelling and strains the veins; fried and sugary foods fuel inflammation and weight gain.', 'Keep pickles, papad and namkeen small, and favour protein, vegetables, fruit and plenty of water.'),
      d('juice-swap', "Don't swap fruit for packaged, sweetened or large servings of juice", 'Juice has little fibre and a fast sugar hit, and packaged juice is mostly added sugar.', 'Eat whole fruit. If you want juice, have a small fresh glass (about 150 ml) with a protein snack.'),
      d('skip-protein', "Don't skimp on protein", 'Muscle is your new ACL, and it needs protein to rebuild.', 'Aim for protein across the day, with 20-30 g at each main meal.'),
      d('many-supps', "Don't start several supplements at once or self-dose", 'You cannot tell what disagrees with you, and some interact with medicines or the blood.', 'Ask your doctor first and start one product at a time for a week. Test vitamin D and B12 before taking them.'),
      d('risky-herbs', "Don't take ashwagandha or giloy", 'Rare cases of liver injury are reported.', 'Skip them. Cooking amounts of turmeric are fine.'),
    ],
  },
]

export const topDonts: Dont[] = dontGroups.flatMap((g) => g.items).filter((i) => i.top)

export const dontsIntro =
  "Small habits can undo weeks of rehab. This is a list of things that tend to make a knee without an ACL worse, why, and what to do instead. It is general guidance, not medical advice."
