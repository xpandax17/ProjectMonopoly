/**
 * Project Monopoly — Property Cash Flow Calculator
 * Core calculation engine
 */

/**
 * Calculate Internal Rate of Return using Newton-Raphson method
 * @param {number[]} cashFlows - Array of cash flows (index 0 = year 0 / initial outlay)
 * @returns {number} IRR as a decimal (e.g. 0.13 = 13%)
 */
export function calculateIRR(cashFlows) {
  if (cashFlows.length < 2) return 0;

  let rate = 0.1; // initial guess: 10%

  for (let iter = 0; iter < 500; iter++) {
    let npv = 0;
    let derivNpv = 0;

    for (let t = 0; t < cashFlows.length; t++) {
      const discFactor = Math.pow(1 + rate, t);
      npv += cashFlows[t] / discFactor;
      derivNpv -= (t * cashFlows[t]) / (discFactor * (1 + rate));
    }

    if (Math.abs(derivNpv) < 1e-12) break;

    const nextRate = rate - npv / derivNpv;
    if (Math.abs(nextRate - rate) < 1e-8) return nextRate;
    rate = Math.max(-0.9999, nextRate);
  }

  return rate;
}

/**
 * Main property cash flow model
 * All percentage inputs are stored as whole numbers (e.g. 6 = 6%)
 * and converted inside this function.
 *
 * @param {object} inputs
 * @returns {object} Full model results
 */
export function calculateModel(inputs) {
  const {
    // Property
    purchasePrice,
    capitalGrowth,       // % e.g. 6
    weeklyRent,
    rentalGrowth,        // % e.g. 6
    occupancyRate,       // % e.g. 95

    // Costs & tax
    expenseGrowth,       // % e.g. 3
    taxBracket,          // % e.g. 45
    dwellingAge,         // years e.g. 16
    dwellingDuration,    // years e.g. 40
    landValuePct,        // % e.g. 40
    depreciationRatePct, // % e.g. 2.5 (ATO Div 43 flat-line rate)

    // Financing
    lvr,                 // % e.g. 80 or 88
    interestRate,        // % e.g. 5.8
    ioYears,             // integer e.g. 5
    lmi,                 // $ amount, capitalised for 88% LVR

    // Ongoing costs
    maintenance,
    pmFeesPct,           // % e.g. 8
    councilRates,
    waterRates,
    buildingInsurance,
    loanAnnualFee,

    // Purchase costs
    stampDuty,
    totalOtherPurchaseCosts,

    // Selling costs
    agentCommission,     // % e.g. 2.5
    fixedSellingCosts,

    // Toggles
    trustStructure,
    negativeGearing,

    // Model settings
    exitYear,
    totalYears,
  } = inputs;

  // ── Convert percentages ───────────────────────────────────────────────────
  const capGrowth  = capitalGrowth / 100;
  const rentGrowth = rentalGrowth / 100;
  const occRate    = occupancyRate / 100;
  const expGrowth  = expenseGrowth / 100;
  const taxRate    = taxBracket / 100;
  const landPct    = landValuePct / 100;
  const lvrDec     = lvr / 100;
  const intRate    = interestRate / 100;
  const pmRate     = pmFeesPct / 100;
  const agentRate  = agentCommission / 100;

  // ── Dwelling depreciation (ATO Div 43 method) ────────────────────────────
  // Gross up current dwelling value to estimate original construction cost,
  // then apply the flat-line rate to that original cost each year.
  // Formula: originalCost = dwellingAtPurchase / (1 - depRate)^dwellingAge
  const dwellingAtPurchase = purchasePrice * (1 - landPct);
  const depRate            = (depreciationRatePct ?? 2.5) / 100;
  const annualDepreciation = dwellingAtPurchase * depRate / Math.pow(1 - depRate, dwellingAge);

  // ── Loan setup ────────────────────────────────────────────────────────────
  const loanBase       = purchasePrice * lvrDec;
  const capitalizedLMI = lvr >= 88 ? lmi : 0;   // LMI is capitalised into loan
  const openingLoan    = loanBase + capitalizedLMI;
  const deposit        = purchasePrice * (1 - lvrDec);
  const totalPurchCosts = stampDuty + totalOtherPurchaseCosts;
  const totalInitialOutlay = deposit + totalPurchCosts;
  // Note: LMI is NOT an upfront cost for 88% LVR — it's added to the loan

  // ── P&I payment precomputed (fixed rate, fixed over P&I period) ──────────
  const pAndIYears   = 30 - ioYears;
  const mRate        = intRate / 12;
  const nMonths      = pAndIYears * 12;
  const monthlyPAndI = mRate > 0
    ? openingLoan * mRate / (1 - Math.pow(1 + mRate, -nMonths))
    : openingLoan / Math.max(1, nMonths);
  const annualPAndI  = monthlyPAndI * 12;

  // ── Land tax thresholds (Queensland) ────────────────────────────────────
  const PERSONAL_THRESHOLD = 600000;
  const TRUST_THRESHOLD    = 350000;

  // ── Year-by-year loop ─────────────────────────────────────────────────────
  const yearlyData = [];
  let loanBalance  = openingLoan;

  for (let y = 1; y <= totalYears; y++) {
    // Property value
    const propValueEnd   = purchasePrice * Math.pow(1 + capGrowth, y);
    const propValueStart = purchasePrice * Math.pow(1 + capGrowth, y - 1);

    // Dwelling depreciation & land split
    const dwellingEnd = Math.max(0, dwellingAtPurchase - y * annualDepreciation);
    const landEnd     = propValueEnd - dwellingEnd;

    // Rental income
    const grossRent  = weeklyRent * 52 * Math.pow(1 + rentGrowth, y - 1);
    const annualRent = grossRent * occRate;

    // Interest & principal
    const interestAmt = loanBalance * intRate;
    let principalPaid = 0;
    if (y > ioYears && loanBalance > 0) {
      principalPaid = Math.min(loanBalance, Math.max(0, annualPAndI - interestAmt));
    }
    const closingLoan = Math.max(0, loanBalance - principalPaid);

    // Operating expenses (growing at expGrowth from year 1)
    const gf       = Math.pow(1 + expGrowth, y - 1);
    const maint    = maintenance * gf;
    const pmFees   = annualRent * pmRate;
    const council  = councilRates * gf;
    const water    = waterRates * gf;
    const insur    = buildingInsurance * gf;

    // Land tax (Queensland rates)
    let landTaxAmt = 0;
    if (trustStructure) {
      if (landEnd > TRUST_THRESHOLD)
        landTaxAmt = 1450 + 0.017 * (landEnd - TRUST_THRESHOLD);
    } else {
      if (landEnd > PERSONAL_THRESHOLD)
        landTaxAmt = 500 + 0.01 * (landEnd - PERSONAL_THRESHOLD);
    }

    // Net cash flow
    const totalExpenses   = interestAmt + loanAnnualFee + pmFees + maint + council + water + insur + landTaxAmt;
    const netCFBeforeTax  = annualRent - totalExpenses;

    // Tax & negative gearing
    const taxableIncome   = netCFBeforeTax - annualDepreciation;
    // Neg gearing benefit only applies when property is cash-flow NEGATIVE (netCFBeforeTax < 0).
    // Depreciation can create a taxable loss even on CF-positive properties, but we don't
    // model that here — once the property is CF-positive it is no longer "negatively geared".
    const negGearBenefit  = (negativeGearing && netCFBeforeTax < 0 && taxableIncome < 0)
      ? Math.abs(taxableIncome) * taxRate
      : 0;
    const netCFAfterTax   = netCFBeforeTax + negGearBenefit;

    // Equity position
    const equity = propValueEnd - closingLoan;

    yearlyData.push({
      year: y,
      propValueStart,
      propValueEnd,
      dwellingEnd,
      landEnd,
      loanOpening: loanBalance,
      loanClosing: closingLoan,
      principalPaid,
      interestAmt,
      loanAnnualFee,
      grossRent,
      annualRent,
      pmFees,
      maint,
      council,
      water,
      insur,
      landTaxAmt,
      totalExpenses,
      netCFBeforeTax,
      annualDepreciation,
      taxableIncome,
      negGearBenefit,
      netCFAfterTax,
      weeklyNetBefore: netCFBeforeTax / 52,
      weeklyNetAfter:  netCFAfterTax  / 52,
      equity,
    });

    loanBalance = closingLoan;
  }

  // ── Exit analysis at chosen year ─────────────────────────────────────────
  const exitData      = yearlyData[Math.min(exitYear, totalYears) - 1];
  const salePrice     = exitData.propValueEnd;
  const outstandLoan  = exitData.loanClosing;
  const agentFees     = salePrice * agentRate;
  const totalSellCosts = agentFees + fixedSellingCosts;
  // Selling costs reduce the taxable gain (net sale proceeds minus original cost)
  const capitalGain   = salePrice - purchasePrice - totalSellCosts;
  const taxableGain   = capitalGain * 0.5; // 50% CGT discount (held > 12 months)
  const cgtPayable    = Math.max(0, taxableGain * taxRate);
  const netProceeds   = salePrice - outstandLoan - totalSellCosts - cgtPayable;

  // ── IRR ──────────────────────────────────────────────────────────────────
  // Cash flow array: [year0 = -initialOutlay, year1 net CF, ..., exitYear net CF + sale proceeds]
  const irrFlows = [-totalInitialOutlay];
  for (let i = 0; i < exitYear; i++) {
    const cf = yearlyData[i].netCFAfterTax;
    irrFlows.push(i === exitYear - 1 ? cf + netProceeds : cf);
  }
  const irr = calculateIRR(irrFlows);

  // ── Summary metrics ───────────────────────────────────────────────────────
  const equityMultiple = netProceeds / totalInitialOutlay;
  const weeklyY1After  = yearlyData[0].weeklyNetAfter;

  return {
    yearlyData,
    totalInitialOutlay,
    deposit,
    totalPurchCosts,
    capitalizedLMI,
    openingLoan,
    annualDepreciation,
    // Exit
    exitYear,
    salePrice,
    outstandLoan,
    agentFees,
    totalSellCosts,
    capitalGain,
    taxableGain,
    cgtPayable,
    netProceeds,
    exitEquity: exitData.equity,
    // Returns
    irr:            irr * 100,          // as %
    equityMultiple,
    weeklyY1After,
  };
}

// ── Formatting helpers ────────────────────────────────────────────────────────

export function fmtCurrency(n, decimals = 0) {
  if (n == null || isNaN(n)) return '—';
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString('en-AU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return n < 0 ? `-$${formatted}` : `$${formatted}`;
}

export function fmtPct(n, decimals = 1) {
  if (n == null || isNaN(n)) return '—';
  return `${n.toFixed(decimals)}%`;
}

export function fmtMultiple(n) {
  if (n == null || isNaN(n)) return '—';
  return `${n.toFixed(2)}x`;
}

export function fmtWeekly(n) {
  if (n == null || isNaN(n)) return '—';
  const abs = Math.abs(n);
  const str = `$${abs.toFixed(0)}/wk`;
  return n < 0 ? `-${str}` : `+${str}`;
}

/**
 * Run calculateModel for 3 exit years (5, 10, 15) and return all three results.
 * Used by CalculatorModule to show side-by-side exit scenario cards.
 */
export function calculateMultiExit(baseInputs) {
  return {
    y5:  calculateModel({ ...baseInputs, exitYear: 5  }),
    y10: calculateModel({ ...baseInputs, exitYear: 10 }),
    y15: calculateModel({ ...baseInputs, exitYear: 15 }),
  };
}

/**
 * Build chart-ready data array for a given model result.
 * Includes Y0 (initial outlay) and crops at exitYear.
 * Cumulative CF at exit year includes sale proceeds (the payoff).
 * Includes netCFBefore and cumulativeCashIn for new charts.
 */
export function buildChartData(results) {
  const { yearlyData, totalInitialOutlay, exitYear, netProceeds } = results;

  // Year 0 — initial outlay
  const chartData = [{
    year: 'Y0',
    yearNum: 0,
    label: 'Initial Outlay',
    propertyValue: 0,
    loanBalance: results.openingLoan,
    equity: 0,
    netCFAfterTax: -totalInitialOutlay,
    netCFBefore: -totalInitialOutlay,
    weeklyBefore: 0,
    weeklyAfter: 0,
    cumulativeCF: -totalInitialOutlay,
    cumulativeCashIn: totalInitialOutlay,
    isInitialOutlay: true,
  }];

  let cumulativeCF = -totalInitialOutlay;
  let cumulativeCashIn = totalInitialOutlay; // running total of cash paid in

  // Years 1 → exitYear only
  yearlyData
    .filter(y => y.year <= exitYear)
    .forEach(y => {
      cumulativeCF += y.netCFAfterTax;
      // Cash in = out-of-pocket holding costs (only count negative CF years)
      if (y.netCFAfterTax < 0) {
        cumulativeCashIn += Math.abs(y.netCFAfterTax);
      }
      const isExit = y.year === exitYear;
      // At exit year: cumulative CF jumps by net proceeds
      const cumulativeThisYear = isExit ? cumulativeCF + netProceeds : cumulativeCF;

      chartData.push({
        year: `Y${y.year}`,
        yearNum: y.year,
        propertyValue: Math.round(y.propValueEnd),
        loanBalance:   Math.round(y.loanClosing),
        equity:        Math.round(y.equity),
        netCFAfterTax: Math.round(y.netCFAfterTax),
        netCFBefore:   Math.round(y.netCFBeforeTax),
        weeklyBefore:  parseFloat(y.weeklyNetBefore.toFixed(0)),
        weeklyAfter:   parseFloat(y.weeklyNetAfter.toFixed(0)),
        cumulativeCF:  Math.round(cumulativeThisYear),
        cumulativeCashIn: Math.round(cumulativeCashIn),
        isExit,
      });
    });

  return chartData;
}

/**
 * Calculate IRR across 3 capital growth scenarios × 3 exit years.
 * Returns 9 data points for the sensitivity chart.
 */
export function calculateIRRSensitivity(baseInputs) {
  const offsets = [-2, 0, 2];
  return offsets.map(delta => {
    const growth = baseInputs.capitalGrowth + delta;
    const modified = { ...baseInputs, capitalGrowth: growth };
    const y5  = calculateModel({ ...modified, exitYear: 5  });
    const y10 = calculateModel({ ...modified, exitYear: 10 });
    const y15 = calculateModel({ ...modified, exitYear: 15 });
    return {
      growth: `${growth}% growth`,
      growthLabel: delta === 0 ? 'Base case' : delta > 0 ? `+${delta}% upside` : `${delta}% downside`,
      y5:  parseFloat(y5.irr.toFixed(1)),
      y10: parseFloat(y10.irr.toFixed(1)),
      y15: parseFloat(y15.irr.toFixed(1)),
    };
  });
}
