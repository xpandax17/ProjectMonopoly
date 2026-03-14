/**
 * Quiz questions — scores: [Hustler, PartTimer, Strategist, WealthBuilder, Analyst]
 */
export const QUESTIONS = [
  {
    id: 1,
    question: "How much time can you give your property each month?",
    options: [
      { text: "**Minimal** — emails and a statement glance",     scores: [0, 0, 1, 3, 2] },
      { text: "**A couple of hours** — occasional check-ins",    scores: [0, 1, 2, 1, 1] },
      { text: "**1–2 days** — actively involved in oversight",   scores: [1, 3, 2, 0, 0] },
      { text: "**As much as it takes** — serious side project",  scores: [3, 1, 0, 0, 0] },
    ],
  },
  {
    id: 2,
    question: "Maintenance and minor repairs — how hands-on are you?",
    options: [
      { text: "**Handle most myself** — saves money, I enjoy it",  scores: [3, 1, 0, 0, 0] },
      { text: "**Basic stuff yes**, outsource the complex jobs",    scores: [1, 3, 0, 0, 0] },
      { text: "**Coordinate trades**, but no tools in my hands",   scores: [0, 1, 3, 0, 0] },
      { text: "**Zero involvement** — that's what PMs are for",    scores: [0, 0, 1, 3, 2] },
    ],
  },
  {
    id: 3,
    question: "What's your primary goal from property?",
    options: [
      { text: "**Cash flow now** — fund my lifestyle today",            scores: [3, 1, 1, 0, 0] },
      { text: "**Long-term wealth** — income can wait",                 scores: [0, 0, 1, 3, 2] },
      { text: "**Both** — some income plus steady capital growth",      scores: [0, 2, 2, 1, 0] },
      { text: "**Scale** — a large, data-driven portfolio",             scores: [0, 0, 0, 1, 3] },
    ],
  },
  {
    id: 4,
    question: "How do you feel about negative cash flow each week?",
    options: [
      { text: "**Can't stomach it** — needs to be near neutral day 1",  scores: [3, 1, 0, 0, 0] },
      { text: "**1–3 years OK** if capital growth is strong",           scores: [0, 3, 1, 0, 0] },
      { text: "**5–7 years fine** — I have the income to hold",         scores: [0, 0, 2, 2, 1] },
      { text: "**10+ years no problem** — long game mentality",         scores: [0, 0, 0, 2, 3] },
    ],
  },
  {
    id: 5,
    question: "How many properties do you eventually want to own?",
    options: [
      { text: "**1–2 great properties**, done right",                  scores: [0, 1, 1, 3, 0] },
      { text: "**3–5 properties** built strategically",                scores: [1, 2, 3, 0, 1] },
      { text: "**5+ properties** — I want real scale",                 scores: [2, 1, 0, 0, 2] },
      { text: "**As many as possible** with disciplined leverage",     scores: [1, 0, 0, 0, 3] },
    ],
  },
  {
    id: 6,
    question: "How comfortable are you with data and research?",
    options: [
      { text: "**Love it** — I build my own models and deep-dive",       scores: [1, 0, 1, 0, 3] },
      { text: "**Can do it**, but want expert input on big calls",        scores: [0, 1, 2, 1, 1] },
      { text: "**Rely on professionals** to filter and recommend",        scores: [0, 0, 2, 2, 0] },
      { text: "**Just point me** to a solid deal — I trust my team",     scores: [0, 0, 0, 3, 0] },
    ],
  },
  {
    id: 7,
    question: "Where do you prefer to invest?",
    options: [
      { text: "**Local** — I want to know the streets, drive past it",   scores: [3, 2, 0, 0, 0] },
      { text: "**Nearby growth suburbs** — few hours from home",         scores: [1, 2, 2, 1, 0] },
      { text: "**Anywhere in Australia** the numbers make sense",        scores: [0, 0, 1, 2, 3] },
    ],
  },
  {
    id: 8,
    question: "What's your appetite for renovations?",
    options: [
      { text: "**Love it** — I'd renovate between tenants to add value", scores: [3, 2, 0, 0, 0] },
      { text: "**Cosmetic refreshes**, if the numbers justify it",        scores: [1, 3, 0, 0, 0] },
      { text: "**Only if clearly justified** — I'd manage the trades",   scores: [0, 1, 3, 0, 0] },
      { text: "**Buy right and let time** do the work",                  scores: [0, 0, 1, 2, 2] },
    ],
  },
  {
    id: 9,
    question: "How do you want to manage tenants?",
    options: [
      { text: "**Self-manage** — maximise returns, I can handle it",     scores: [3, 1, 0, 0, 0] },
      { text: "**Self-manage** at first, PM as portfolio grows",         scores: [1, 3, 1, 0, 0] },
      { text: "**PM always** — I just want the monthly statement",       scores: [0, 0, 2, 3, 2] },
    ],
  },
  {
    id: 10,
    question: "What's your ideal hold period?",
    options: [
      { text: "**Short** — 5–7 years, take profit, recycle equity",     scores: [2, 2, 0, 0, 1] },
      { text: "**Medium** — 10–12 years, focused strategy",             scores: [1, 1, 3, 1, 0] },
      { text: "**Long** — 15–20+ years, set and forget",                scores: [0, 0, 1, 3, 2] },
    ],
  },
  {
    id: 11,
    question: "Does the property need to fund your lifestyle now?",
    options: [
      { text: "**Critical** — I need the cash flow today",              scores: [3, 2, 0, 0, 0] },
      { text: "**Nice to have** — salary covers the shortfall easily",  scores: [1, 1, 2, 1, 0] },
      { text: "**Not important** — I'm playing the long game",          scores: [0, 0, 1, 2, 3] },
    ],
  },
  {
    id: 12,
    question: "Which statement is most you?",
    options: [
      { text: "**\"Hands-on — every property works as hard as possible\"**",          scores: [3, 0, 0, 0, 0] },
      { text: "**\"Weekends OK, but weekdays are mine\"**",                            scores: [0, 3, 0, 0, 0] },
      { text: "**\"I make the big calls, my team executes\"**",                        scores: [0, 0, 3, 0, 0] },
      { text: "**\"Great asset compounding quietly while I focus on my career\"**",   scores: [0, 0, 0, 3, 0] },
      { text: "**\"Systematic, data-driven portfolio with defined entry criteria\"**", scores: [0, 0, 0, 0, 3] },
    ],
  },
]

export function scoreQuiz(answers) {
  const totals = [0, 0, 0, 0, 0]
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
