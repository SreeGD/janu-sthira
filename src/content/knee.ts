export interface Structure {
  id: string
  name: string
  short: string
  tag: string
  what: string
  job: string
  injury: string
  signs: string[]
  treatment: string
  care: string[]
  help: string
  cards?: string[]
}

export const kneeIntro =
  'The knee is a hinge joint that also rotates a little. It is held steady by two kinds of support: passive structures (ligaments, menisci, cartilage and the joint capsule) and active ones (the muscles around it). When a passive structure is damaged, strong, well-trained muscles can often make up much of the difference. This guide explains each part in plain language, how to look after it and how to avoid injuring it.'

export const structures: Structure[] = [
  {
    id: 'acl', name: 'ACL (anterior cruciate ligament)', tag: 'Front-to-back and rotation control',
    short: 'Stops the shin sliding forward and the knee rotating too far.',
    what: 'A strong band in the middle of the knee that runs from the back of the thigh bone (femur) to the front of the shin bone (tibia).',
    job: 'It prevents the tibia sliding forward under the femur and helps control twisting and pivoting. It also sends position signals to the brain, which helps balance.',
    injury: 'Most ACL tears happen without contact: a sudden stop, a change of direction, a pivot on a planted foot, or an awkward landing from a jump. Some come from a direct blow. People often feel or hear a pop.',
    signs: ['A pop at the time of injury', 'Swelling within hours', 'Feeling the knee shift or give way', 'Trouble straightening or bending fully', 'Pain walking, especially turning'],
    treatment: 'A complete ACL tear rarely heals by itself. Many people do well with structured, supervised rehab first, with surgery considered if the knee keeps giving way or they want to return to pivoting sport. The decision is made with your surgeon and physio.',
    care: ['Build strength in the quads, hamstrings, hips and core: muscle is the knee\'s "new ACL"', 'Avoid twisting and pivoting on the injured leg', 'Do balance training', 'Note and report every giving-way episode: each one can damage the meniscus'],
    help: 'See a doctor if the knee gives way, locks, or swells quickly after an injury.',
    cards: ['M5', 'L1', 'B2', 'E4'],
  },
  {
    id: 'pcl', name: 'PCL (posterior cruciate ligament)', tag: 'Stops the shin sliding backward',
    short: 'The ACL\'s partner: it stops the shin sliding backward.',
    what: 'A thick, strong ligament crossing behind the ACL, from the femur to the back of the tibia. It is the strongest ligament in the knee.',
    job: 'It prevents the tibia from sliding backward under the femur, especially when the knee is bent.',
    injury: 'Usually from a hard blow to the front of the bent shin (for example a dashboard injury in a car crash or a fall onto a bent knee) or from overextension. Often seen together with other ligament injuries.',
    signs: ['Pain and swelling, often at the back of the knee', 'A feeling of looseness, especially going downhill or down stairs', 'Stiffness', 'The shin may "sag" backward when the knee is bent (a doctor checks this)'],
    treatment: 'Isolated PCL injuries are often treated without surgery, and many people function well. Rehab focuses on the quadriceps. Ask your physio about hamstring exercises: after a PCL injury these are often limited early, unlike after an ACL injury.',
    care: ['Prioritise quad strengthening', 'Follow your physio\'s advice on hamstring work', 'Avoid deep bends under load early on', 'Build up activity gradually'],
    help: 'See a doctor after a hard blow to the front of the shin or any knee that feels loose.',
    cards: ['M5', 'L1'],
  },
  {
    id: 'collaterals', name: 'MCL and LCL (collateral ligaments)', tag: 'Side-to-side stability',
    short: 'Two ligaments on the sides that stop the knee bending sideways.',
    what: 'The MCL runs along the inner side of the knee (medial). The LCL runs along the outer side (lateral), from the femur to the top of the fibula.',
    job: 'They prevent the knee from buckling inward (MCL) or outward (LCL).',
    injury: 'The MCL is usually hurt by a blow to the outer knee that pushes it inward, or by a twist with the foot planted. LCL injuries are less common and often come with other injuries.',
    signs: ['Pain and tenderness along the inner or outer side', 'Swelling', 'A feeling the knee wobbles sideways'],
    treatment: 'MCL injuries often heal well with rest, protection (sometimes a brace) and gradual rehab. LCL and combined injuries need a specialist.',
    care: ['Strengthen the hip and thigh muscles', 'Keep the knee in line over the foot when landing and squatting', 'Return to sport gradually'],
    help: 'See a doctor for sideways instability, bruising or significant pain after a blow.',
    cards: ['L3', 'L4', 'B4', 'B6'],
  },
  {
    id: 'menisci', name: 'Menisci (medial and lateral)', tag: 'Shock absorbers',
    short: 'Two C-shaped cushions between the thigh bone and the shin bone.',
    what: 'Tough, rubbery cartilage discs on top of the tibia. There is one on the inner side (medial) and one on the outer side (lateral).',
    job: 'They absorb shock, spread load across the joint, add stability and help lubricate it. They protect the joint surface.',
    injury: 'A twist with the foot planted and the knee bent, a deep squat under load, or wear over time. Repeated giving way after an ACL injury is a common way to tear a meniscus.',
    signs: ['Pain along the joint line', 'Swelling that builds over a day or so', 'Catching, clicking or a feeling something is stuck', 'The knee locking so it will not fully straighten'],
    treatment: 'Some tears settle with rehab. Others are repaired or trimmed by arthroscopic surgery. The outer third has a blood supply and heals better than the inner part. A locked knee needs prompt review.',
    care: ['Avoid deep squatting and twisting under load', 'Prevent giving-way episodes with strength and balance work', 'Keep body weight in a healthy range', 'Strengthen the quads and hips'],
    help: 'See a doctor promptly if the knee locks, catches repeatedly or swells after twisting.',
    cards: ['M5', 'L2', 'E4'],
  },
  {
    id: 'cartilage', name: 'Articular cartilage', tag: 'The smooth joint surface',
    short: 'The smooth, slippery coating on the ends of the bones.',
    what: 'A thin layer of smooth cartilage covering the ends of the femur and tibia and the back of the kneecap.',
    job: 'It lets the bones glide with little friction and spreads load. It has a very limited ability to heal, so protecting it matters.',
    injury: 'Damage can come from a direct injury, from repeated giving way or from an unstable knee over years. Wear can lead to osteoarthritis.',
    signs: ['Deep aching, swelling after activity', 'Pain going up or down stairs', 'Grinding or catching'],
    treatment: 'Mild changes are managed with exercise, weight control and activity changes. Larger defects may need specialist treatment.',
    care: ['Keep the knee stable with strong muscles', 'Maintain a healthy weight: each kilogram lost takes roughly 3-4 kg of load off the knee with every step', 'Stay active with low-impact exercise', 'Avoid repeated high-impact twisting'],
    help: 'See a doctor for persistent swelling or pain that does not settle.',
    cards: ['E1', 'M6'],
  },
  {
    id: 'muscles', name: 'Muscles and tendons around the knee', tag: 'Active protection',
    short: 'The quadriceps, hamstrings, hips and calf are the knee\'s moving brakes.',
    what: 'The quadriceps at the front, the hamstrings at the back, the glutes and hip muscles, and the calf. Tendons attach them to bone, including the patellar tendon below the kneecap.',
    job: 'They move the knee and, just as importantly, control it. Strong, well-timed muscles take load off the ligaments and cartilage and make up for a missing ACL.',
    injury: 'Weakness, fatigue, poor control and sudden overload make injuries more likely. Swelling can "switch off" the quadriceps within hours.',
    signs: ['Thigh wasting or weakness', 'Knee collapsing inward when squatting or landing', 'Tiredness and loss of control late in activity'],
    treatment: 'Strength and neuromuscular training, usually guided by a physiotherapist.',
    care: ['Do quad sets every day', 'Train hamstrings, glutes and core, not only the thigh', 'Warm up before activity', 'Build load gradually'],
    help: 'See a physio if one thigh stays clearly weaker than the other.',
    cards: ['M5', 'L2', 'B1', 'B2', 'B5'],
  },
]

export const firstAid = [
  'Stop the activity and do not try to "walk it off" if the knee is painful or unstable.',
  'Protect the knee: avoid twisting and heavy load. Use support such as crutches if walking is painful.',
  'Elevate the leg and rest it. Cold packs for 10-15 minutes can make it more comfortable.',
  'Keep the knee gently moving within comfort once the first pain settles, and avoid forcing it.',
  'Get it examined. Early assessment makes it easier to plan the right treatment.',
]

export const redFlags = [
  'You heard or felt a pop and the knee swelled within a few hours.',
  'The knee will not take your weight, or gives way.',
  'The knee is locked and will not fully straighten or bend.',
  'The leg looks deformed, or the foot is numb, pale or cold.',
  'Painful, hot, red, tight or swollen calf, or sudden breathlessness or chest pain: possible clot, get urgent help.',
]

export interface PreventionGroup {
  id: string
  title: string
  points: string[]
  cards?: string[]
}

export const preventionIntro =
  'Many knee injuries, including a large share of non-contact ACL tears, are preventable. Structured warm-up programmes that combine strength, balance, landing and cutting technique have been shown in studies to cut injury rates substantially, especially when done regularly (2-3 times a week).'

export const prevention: PreventionGroup[] = [
  {
    id: 'strength', title: 'Build strength',
    points: ['Train the quadriceps, hamstrings, glutes and core, not only one muscle group', 'Aim for balanced strength between the two legs', 'Keep strength going year-round: it fades within weeks of stopping', 'Hamstring and hip strength help control the shin and the knee\'s alignment'],
    cards: ['M5', 'L1', 'L2', 'B2', 'B4', 'B5'],
  },
  {
    id: 'landing', title: 'Land and move well',
    points: ['Land softly on the whole foot with knees and hips bent', 'Keep your knees over your toes: do not let them cave inward', 'Stay balanced and avoid landing with the knee almost straight', 'Slow down before you turn and use a wider stance for cutting'],
    cards: ['E5', 'B6'],
  },
  {
    id: 'balance', title: 'Train balance and control',
    points: ['Practise standing on one leg, then with eyes closed or on a cushion', 'Add hopping and agility drills only once cleared and strong', 'Control matters as much as strength'],
    cards: ['E4', 'E3'],
  },
  {
    id: 'warmup', title: 'Warm up and pace yourself',
    points: ['Warm up for 10-15 minutes: easy running or cycling, dynamic stretches, then activation drills', 'Build training load gradually, not more than about 10% a week', 'Stop when you are tired: most injuries happen when fatigued', 'Include rest days, enough sleep and good nutrition'],
  },
  {
    id: 'kit', title: 'Choose surfaces and shoes',
    points: ['Wear shoes with good grip suited to the surface', 'Avoid wet, uneven or slippery ground when you can', 'Use ankle support if you have a history of sprains'],
  },
  {
    id: 'body', title: 'Look after the whole body',
    points: ['Keep body weight in a healthy range to lower load on the joint', 'Treat a previous knee injury seriously: it raises the risk of another', 'Women and girls have higher non-contact ACL injury rates, so landing and strength training are especially worthwhile', 'Do not return to pivoting sport until your physio has tested strength, balance and hopping'],
  },
  {
    id: 'daily', title: 'Everyday habits',
    points: ['Use handrails, anti-slip mats and good lighting at home', 'Turn with small steps instead of twisting on a planted foot', 'Avoid deep squatting and long cross-legged sitting if your knee is unstable', 'Stay active: inactivity weakens the muscles that protect the knee'],
  },
]

export const kneeDisclaimer =
  'This is general education, not a diagnosis. Knee injuries vary a lot, so your surgeon and physiotherapist decide what is right for you.'
