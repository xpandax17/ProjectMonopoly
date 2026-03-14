export const ARCHETYPES = [
  {
    id: 'hustler',
    name: 'The Hustler',
    subtitle: 'Active Worker',
    emoji: '🔨',
    tagline: 'Hands-on, high-yield, maximum involvement',
    color: 'from-orange-500 to-red-600',
    description:
      "You treat property like a business. You're happy to pick up a paintbrush, manage tenants directly, and squeeze every dollar out of your asset. Your edge is proximity — you know your streets, you spot opportunities others miss, and you're willing to put in the time to maximise returns.",
    strategyFit: [
      'High-yield regional markets and older suburban homes',
      'Renovation upside — fibro homes, cosmetic renovations, dual-occupancy potential',
      'Positive or near-neutral cash flow from day one',
      'Shorter hold periods (5–7 years) — buy, improve, sell, recycle equity',
      'Self-managed tenancy to maximise net yield',
    ],
    idealProperty:
      'An older home in a high-yield market where renovation adds clear value. Think regional QLD/NSW, older brick homes, properties the market has overlooked because they need work.',
    watchOut:
      "Burnout. Returns on your time aren't always linear, and managing multiple properties gets exhausting. Build a delegation model as your portfolio grows — your time has value.",
    soWhat: [
      { bold: 'Target high-yield, regional markets', detail: ' — find properties others overlook because of condition' },
      { bold: 'Keep hold periods short (5–7 yrs)', detail: ' — add value, then recycle equity into the next deal' },
      { bold: 'Self-manage to protect margin', detail: ' — but build systems before adding a second property' },
    ],
    scores: { timeCommitment: 5, renovationAppetite: 5, riskTolerance: 4, holdPeriod: 2 },
  },
  {
    id: 'parttimer',
    name: 'The Part-Timer',
    subtitle: 'Active Weekend Worker',
    emoji: '🗓️',
    tagline: 'Strategic involvement, without the full-time commitment',
    color: 'from-yellow-500 to-orange-500',
    description:
      "Property is your passion project, not your second job. You're hands-on enough to manage a renovation or handle a tricky tenant when needed, but you need your weekdays free. You're disciplined about which problems you solve yourself versus outsource.",
    strategyFit: [
      'Growth corridor suburbs with some value-add potential',
      'Moderate negative gearing acceptable if capital growth is strong',
      'Property manager for day-to-day; you handle strategic decisions',
      'Cosmetic renovations where the effort:return ratio is clear',
      'Hold for 7–12 years, then review',
    ],
    idealProperty:
      'An established house in a suburb with strong fundamentals — good schools, infrastructure, growing rental demand. Liveable now, with scope for a weekend renovation to add value.',
    watchOut:
      "Scope creep. A quick renovation can become a 6-month project. Set hard time and budget limits on any improvement work.",
    soWhat: [
      { bold: 'Buy suburbs with clear value-add potential', detail: ' — cosmetic renovation upside is your edge' },
      { bold: 'Use a PM for day-to-day', detail: ' — you focus on the strategic and financial decisions only' },
      { bold: 'Set a hard budget before any reno work', detail: ' — scope creep is the part-timer\'s biggest risk' },
    ],
    scores: { timeCommitment: 3, renovationAppetite: 3, riskTolerance: 3, holdPeriod: 3 },
  },
  {
    id: 'strategist',
    name: 'The Strategist',
    subtitle: 'Active Manager',
    emoji: '🎯',
    tagline: 'Make the big calls, delegate the execution',
    color: 'from-blue-500 to-indigo-600',
    description:
      "You're an investor, not an operator. You decide where, what, and when — then a trusted team handles everything else. You check in monthly, make decisions quarterly, and review the portfolio annually. Your edge is strategy: you think in portfolios, not individual properties.",
    strategyFit: [
      '3–5 quality assets across growth corridors over 10–15 years',
      'Mix of yield and growth — balance cash flow with capital appreciation',
      'Professional property management always — you review performance, not toilets',
      'Buyers agent, accountant, and broker working as a team',
      'Disciplined entry criteria: yield floor, land content minimum, suburb checklist',
    ],
    idealProperty:
      "An established house in a suburb with strong long-term demand fundamentals — population growth, infrastructure investment, good land-to-value ratio. You're buying for the land.",
    watchOut:
      "Over-relying on your team. Delegating execution is smart; delegating strategy is not. Review the numbers yourself every 6–12 months.",
    soWhat: [
      { bold: 'Build a trusted team first', detail: ' — buyers agent, PM, accountant, broker all aligned to your strategy' },
      { bold: 'Buy for land content and fundamentals', detail: ' — infrastructure, population growth, rental demand' },
      { bold: 'Review the numbers yourself', detail: ' — monthly check-in minimum, don\'t fully outsource the thinking' },
    ],
    scores: { timeCommitment: 2, renovationAppetite: 1, riskTolerance: 3, holdPeriod: 4 },
  },
  {
    id: 'wealthbuilder',
    name: 'The Wealth Builder',
    subtitle: 'Passive Investor',
    emoji: '🌱',
    tagline: 'Set it, let it grow, harvest later',
    color: 'from-emerald-500 to-teal-600',
    description:
      "You're not here to run a property business. You want a great asset that compounds quietly in the background while you focus on your career and life. Negative cash flow is fine — you have the income to hold comfortably. Buy right once, hold long, let time build your wealth.",
    strategyFit: [
      'Premium growth suburbs — inner and middle ring of major cities',
      'Negatively geared OK — the tax benefit plus capital growth makes the math work',
      'Long hold: 15–20 years, minimal involvement required',
      '1–2 high-quality properties done right rather than many average ones',
      'Property manager always, set and (mostly) forget',
    ],
    idealProperty:
      "A well-located established house or quality unit in the inner-to-middle ring of a major city. Strong demand from owner-occupiers, good school catchment, walkable location. Buy the suburb first.",
    watchOut:
      "'Set and forget' doesn't mean 'never review'. Check in annually on rent, PM performance, and the portfolio. Make sure the asset is still performing to its potential.",
    soWhat: [
      { bold: 'Buy the suburb, not just the property', detail: ' — inner-to-middle ring, owner-occupier demand, good schools' },
      { bold: 'Hold 15–20 years and let compounding work', detail: ' — negative gearing is your friend in the early years' },
      { bold: 'Annual review is still non-negotiable', detail: ' — check rent, PM performance, and market position once a year' },
    ],
    scores: { timeCommitment: 1, renovationAppetite: 1, riskTolerance: 2, holdPeriod: 5 },
  },
  {
    id: 'analyst',
    name: 'The Analyst',
    subtitle: 'Pure Investor',
    emoji: '📐',
    tagline: 'Data-first, emotion-free, systematic',
    color: 'from-purple-600 to-violet-700',
    description:
      "You've probably already built your own spreadsheet. You evaluate properties on yield, growth trajectory, land value ratio, vacancy rates, and comparable sales. Emotion doesn't feature. You're building a portfolio the way a fund manager builds a book — systematically, with defined entry criteria.",
    strategyFit: [
      'Data-driven market selection — you screen suburbs before you screen streets',
      'Multiple properties across geographies wherever the numbers stack up',
      'Systematic leveraging with careful DTI and serviceability modelling',
      'Optimised tax structure from day one (trust vs personal vs SMSF)',
      'Annual portfolio review with clear sell/hold/add decisions based on data',
    ],
    idealProperty:
      "Whatever the data says. You have a defined checklist: gross yield floor, land content %, suburb vacancy rate ceiling, price-to-income ratio range. If a property passes all screens, it's a candidate.",
    watchOut:
      "Analysis paralysis. The perfect property doesn't exist. Set a decision deadline — holding cash waiting for the perfect deal has a real opportunity cost.",
    soWhat: [
      { bold: 'Build your entry criteria before you search', detail: ' — yield floor, land %, vacancy rate ceiling, price-to-income range' },
      { bold: 'Screen suburbs first, then streets', detail: ' — data should eliminate 90% of options before you inspect a single property' },
      { bold: 'Set a decision deadline', detail: ' — analysis paralysis is your biggest enemy, not the property market' },
    ],
    scores: { timeCommitment: 2, renovationAppetite: 1, riskTolerance: 4, holdPeriod: 4 },
  },
]
