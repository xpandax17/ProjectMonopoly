/**
 * Quiz questions and archetype scoring matrix.
 * Scores per answer: [Hustler, PartTimer, Strategist, WealthBuilder, Analyst]
 * Archetype with highest total score wins.
 */
export const QUESTIONS = [
  {
    id: 1,
    question: "How much time can you realistically commit to your investment property each month?",
    options: [
      { text: "Minimal — a few emails and a glance at the statement",             scores: [0, 0, 1, 3, 2] },
      { text: "A couple of hours — occasional check-ins and a site visit yearly", scores: [0, 1, 2, 1, 1] },
      { text: "1-2 full days — I want to be actively involved in oversight",       scores: [1, 3, 2, 0, 0] },
      { text: "As much as it takes — this is a serious project for me",            scores: [3, 1, 0, 0, 0] },
    ],
  },
  {
    id: 2,
    question: "How do you feel about doing maintenance and minor repairs yourself?",
    options: [
      { text: "I'd handle most things myself — saves money and I enjoy it",   scores: [3, 1, 0, 0, 0] },
      { text: "Happy with basic stuff, I'd outsource anything complex",        scores: [1, 3, 0, 0, 0] },
      { text: "I'd manage and coordinate trades, but not pick up a hammer",    scores: [0, 1, 3, 0, 0] },
      { text: "Zero involvement in the physical property — that's what PMs are for", scores: [0, 0, 1, 3, 2] },
    ],
  },
  {
    id: 3,
    question: "What's your primary financial goal from property investment?",
    options: [
      { text: "Extra income now — I want it to help fund my lifestyle",              scores: [3, 1, 1, 0, 0] },
      { text: "Maximum long-term wealth — income can come much later",              scores: [0, 0, 1, 3, 2] },
      { text: "A balance — some cash flow improvement plus steady capital growth",  scores: [0, 2, 2, 1, 0] },
      { text: "Build a large, systematic multi-property portfolio",                 scores: [0, 0, 0, 1, 3] },
    ],
  },
  {
    id: 4,
    question: "How comfortable are you with paying out of pocket each week (negative cash flow)?",
    options: [
      { text: "Not comfortable — I need it near cash-flow neutral from day 1",        scores: [3, 1, 0, 0, 0] },
      { text: "OK for 1-3 years if capital growth is strong",                         scores: [0, 3, 1, 0, 0] },
      { text: "Fine with 5-7 years of negative cash flow",                            scores: [0, 0, 2, 2, 1] },
      { text: "No problem — I can hold comfortably for 10+ years regardless",         scores: [0, 0, 0, 2, 3] },
    ],
  },
  {
    id: 5,
    question: "How many investment properties do you eventually want to own?",
    options: [
      { text: "1-2 high-quality assets, done right",                    scores: [0, 1, 1, 3, 0] },
      { text: "3-5 properties built up strategically over time",        scores: [1, 2, 3, 0, 1] },
      { text: "5+ properties — I want real scale",                      scores: [2, 1, 0, 0, 2] },
      { text: "As many as possible with disciplined leverage and data", scores: [1, 0, 0, 0, 3] },
    ],
  },
  {
    id: 6,
    question: "How comfortable are you with data analysis and doing your own property research?",
    options: [
      { text: "I love data — I'd build my own models and do deep comparative analysis",   scores: [1, 0, 1, 0, 3] },
      { text: "I can do the analysis but want professional input on the big decisions",   scores: [0, 1, 2, 1, 1] },
      { text: "I rely mostly on a buyer's agent and financial advisor to filter options", scores: [0, 0, 2, 2, 0] },
      { text: "Point me to a solid deal — I trust the people I've hired",                 scores: [0, 0, 0, 3, 0] },
    ],
  },
  {
    id: 7,
    question: "Where do you prefer to invest?",
    options: [
      { text: "Local area — I want to know the streets and be able to drive past it",         scores: [3, 2, 0, 0, 0] },
      { text: "Best performing suburbs within a few hours of home",                           scores: [1, 2, 2, 1, 0] },
      { text: "Best growth markets anywhere in Australia — I don't need to visit the place", scores: [0, 0, 1, 2, 3] },
    ],
  },
  {
    id: 8,
    question: "What's your appetite for property renovations?",
    options: [
      { text: "I'd actively renovate between tenants to add value — this excites me",       scores: [3, 2, 0, 0, 0] },
      { text: "A cosmetic refresh is worth the effort if the numbers stack up",             scores: [1, 3, 0, 0, 0] },
      { text: "Only if the numbers clearly justify it and I manage the trades",             scores: [0, 1, 3, 0, 0] },
      { text: "Buy the right property and let time and growth do the work",                 scores: [0, 0, 1, 2, 2] },
    ],
  },
  {
    id: 9,
    question: "How do you want to manage the tenancy day-to-day?",
    options: [
      { text: "Self-manage — maximise returns and I can handle tenant issues",         scores: [3, 1, 0, 0, 0] },
      { text: "Self-manage initially, then move to a PM as the portfolio grows",       scores: [1, 3, 1, 0, 0] },
      { text: "Property manager always — I just want to see the monthly statement",   scores: [0, 0, 2, 3, 2] },
    ],
  },
  {
    id: 10,
    question: "What's your ideal hold period for an investment property?",
    options: [
      { text: "Short — 5-7 years, take the profit and recycle the equity",          scores: [2, 2, 0, 0, 1] },
      { text: "Medium — 10-12 years, a focused and clear strategy",                 scores: [1, 1, 3, 1, 0] },
      { text: "Long — 15-20+ years, set and forget while it compounds",             scores: [0, 0, 1, 3, 2] },
    ],
  },
  {
    id: 11,
    question: "How important is it that the property actively helps fund your current lifestyle?",
    options: [
      { text: "Critical — I need the cash flow to live the life I want today",      scores: [3, 2, 0, 0, 0] },
      { text: "Nice to have, but my salary comfortably covers the shortfall",       scores: [1, 1, 2, 1, 0] },
      { text: "Not important — I'm playing the long game and holding costs easily", scores: [0, 0, 1, 2, 3] },
    ],
  },
  {
    id: 12,
    question: "Which statement describes you best?",
    options: [
      { text: "\"I want to be hands-on and make every property work as hard as possible\"",       scores: [3, 0, 0, 0, 0] },
      { text: "\"I can put in weekends but I need my weekdays free for other things\"",           scores: [0, 3, 0, 0, 0] },
      { text: "\"I make the key strategic decisions, then my team executes\"",                    scores: [0, 0, 3, 0, 0] },
      { text: "\"I want a great asset quietly compounding while I focus on my career\"",          scores: [0, 0, 0, 3, 0] },
      { text: "\"I want a data-driven, systematic portfolio built to defined entry criteria\"",   scores: [0, 0, 0, 0, 3] },
    ],
  },
]

/**
 * Score a set of answers and return the winning archetype index (0-4).
 * @param {number[]} answers - array of selected option indices per question
 * @returns {{ scores: number[], winnerIdx: number }}
 */
export function scoreQuiz(answers) {
  const totals = [0, 0, 0, 0, 0]  // [Hustler, PartTimer, Strategist, WealthBuilder, Analyst]
  answers.forEach((answerIdx, questionIdx) => {
    const q = QUESTIONS[questionIdx]
    if (!q || answerIdx == null) return
    const scores = q.options[answerIdx]?.scores || [0, 0, 0, 0, 0]
    scores.forEach((s, i) => { totals[i] += s })
  })
  const maxScore = Math.max(...totals)
  const winnerIdx = totals.indexOf(maxScore)
  return { scores: totals, winnerIdx }
}
