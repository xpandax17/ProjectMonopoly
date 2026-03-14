// Stamp duty rate tables for QLD, NSW, VIC, WA
// Each bracket: { upTo, base, rate } where rate is % on excess above previous threshold
// upTo: Infinity = no ceiling

export const STAMP_DUTY_RATES = {
  QLD: {
    general: [
      { upTo: 5000,    base: 0,      rate: 0.015 },
      { upTo: 75000,   base: 75,     rate: 0.015 },
      { upTo: 540000,  base: 1050,   rate: 0.035 },
      { upTo: 1000000, base: 17325,  rate: 0.045 },
      { upTo: Infinity,base: 38025,  rate: 0.0575 },
    ],
    fhb: {
      exemptUpTo: 500000,
      concessionUpTo: 550000,
      // Concession: proportional reduction between 500k–550k
    },
  },
  NSW: {
    general: [
      { upTo: 14000,    base: 0,      rate: 0.0125 },
      { upTo: 30000,    base: 175,    rate: 0.015  },
      { upTo: 80000,    base: 415,    rate: 0.0175 },
      { upTo: 300000,   base: 1290,   rate: 0.035  },
      { upTo: 1000000,  base: 8990,   rate: 0.045  },
      { upTo: 3000000,  base: 40490,  rate: 0.055  },
      { upTo: Infinity, base: 150490, rate: 0.07   },
    ],
    fhb: {
      exemptUpTo: 800000,
      concessionUpTo: 1000000,
    },
  },
  VIC: {
    general: [
      { upTo: 25000,    base: 0,      rate: 0.014  },
      { upTo: 130000,   base: 350,    rate: 0.024  },
      { upTo: 960000,   base: 2870,   rate: 0.06   },
      { upTo: 2000000,  base: 52670,  rate: 0.055  },
      { upTo: Infinity, base: 110870, rate: 0.065  },
    ],
    fhb: {
      exemptUpTo: 600000,
      concessionUpTo: 750000,
    },
  },
  WA: {
    general: [
      { upTo: 80000,    base: 0,      rate: 0.019  },
      { upTo: 100000,   base: 1520,   rate: 0.0285 },
      { upTo: 250000,   base: 2090,   rate: 0.038  },
      { upTo: 500000,   base: 7790,   rate: 0.0475 },
      { upTo: Infinity, base: 19665,  rate: 0.0515 },
    ],
    fhb: {
      exemptUpTo: 430000,
      concessionUpTo: 530000,
    },
  },
}

// Transfer registration fees (approximate, state-based)
export const TRANSFER_FEES = {
  QLD: (price) => {
    if (price <= 180000) return 197
    if (price <= 360000) return 397
    if (price <= 540000) return 597
    return Math.min(1400, Math.round((price / 180000) * 200))
  },
  NSW: (price) => {
    if (price <= 300000) return 214
    if (price <= 1000000) return 399
    return 599
  },
  VIC: (price) => {
    if (price <= 130000) return 284
    if (price <= 1000000) return 424
    return 624
  },
  WA: (price) => {
    if (price <= 200000) return 176
    if (price <= 500000) return 346
    return 546
  },
}

/**
 * Calculate stamp duty using marginal rate tables.
 * Returns the full duty, then applies FHB concession if applicable.
 */
export function calcStampDuty(state, price, isFHB) {
  const stateData = STAMP_DUTY_RATES[state]
  if (!stateData) return 0

  const brackets = stateData.general

  // Find the applicable bracket
  let bracketIdx = brackets.findIndex(b => price <= b.upTo)
  if (bracketIdx === -1) bracketIdx = brackets.length - 1

  const bracket = brackets[bracketIdx]

  // Calculate previous bracket ceiling
  const prevCeiling = bracketIdx === 0 ? 0 : brackets[bracketIdx - 1].upTo

  const duty = bracket.base + (price - prevCeiling) * bracket.rate

  // Apply FHB concession
  if (isFHB && stateData.fhb) {
    const { exemptUpTo, concessionUpTo } = stateData.fhb
    if (price <= exemptUpTo) return 0
    if (price <= concessionUpTo) {
      // Proportional reduction: scale from 0 at exemptUpTo to full duty at concessionUpTo
      const proportion = (price - exemptUpTo) / (concessionUpTo - exemptUpTo)
      return Math.round(duty * proportion)
    }
  }

  return Math.round(duty)
}

export const STATE_LABELS = {
  QLD: 'Queensland',
  NSW: 'New South Wales',
  VIC: 'Victoria',
  WA: 'Western Australia',
}
