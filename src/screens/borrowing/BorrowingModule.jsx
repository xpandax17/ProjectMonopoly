import React, { useState, useEffect } from 'react'
import { DollarSign, Percent, TrendingUp, Home } from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return '$' + Math.round(n).toLocaleString()
}

function fmtPct(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toFixed(1) + '%'
}

function calcBorrowingPower({ grossIncome, rentalIncome, monthlyExpenses, existingRepayments, deposit, interestRate }) {
  // Net monthly income (after ~30% effective tax), + rental income (taxed at effective rate)
  const netMonthly = (grossIncome * 0.70) / 12
  const netRentalMonthly = rentalIncome / 12 * 0.70  // rough 30% tax on rental income

  // Surplus after living expenses and existing debt commitments
  const surplus = netMonthly + netRentalMonthly - monthlyExpenses - existingRepayments
  if (surplus <= 0) return null

  const maxRepayment = surplus * 0.80  // 20% buffer (lender HEM buffer)
  const monthlyRate = interestRate / 100 / 12
  const n = 360 // 30-year term

  const maxLoan = maxRepayment * (1 - Math.pow(1 + monthlyRate, -n)) / monthlyRate
  const maxPurchase = maxLoan + deposit
  const lvr = maxPurchase > 0 ? (maxLoan / maxPurchase) * 100 : 0

  // Monthly repayment on max loan (P&I, 30yr)
  const monthlyRepayment = maxLoan * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)

  return {
    maxLoan: Math.max(0, maxLoan),
    maxPurchase: Math.max(0, maxPurchase),
    monthlyRepayment: Math.max(0, monthlyRepayment),
    lvr,
    depositPct: maxPurchase > 0 ? (deposit / maxPurchase) * 100 : 0,
    netMonthly,
    netRentalMonthly,
    surplus,
    maxRepayment,
  }
}

// ── Number Input with comma formatting ───────────────────────────────────────

function NumberInput({ value, onChange, prefix, suffix }) {
  const [local, setLocal] = useState(String(value))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const parsed = parseFloat(local)
    if (isNaN(parsed) || parsed !== value) setLocal(String(value))
  }, [value])

  const formatCommas = (raw) => {
    const num = parseFloat(raw)
    if (isNaN(num) || num < 1000) return raw
    return Math.round(num).toLocaleString('en-AU')
  }

  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-slate-400 text-sm pointer-events-none">{prefix}</span>}
      <input
        type="text"
        inputMode="decimal"
        value={focused ? local : formatCommas(local)}
        onChange={e => {
          setLocal(e.target.value)
          const p = parseFloat(e.target.value)
          if (!isNaN(p) && p >= 0) onChange(p)
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          const p = parseFloat(local)
          if (isNaN(p)) setLocal(String(value))
          else setLocal(String(p))
        }}
        className={`input-field ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-8' : ''}`}
      />
      {suffix && <span className="absolute right-3 text-slate-400 text-sm pointer-events-none">{suffix}</span>}
    </div>
  )
}

// ── Bank links ────────────────────────────────────────────────────────────────

const BANKS = [
  { name: 'CommBank', color: 'bg-yellow-400', url: 'https://www.commbank.com.au/home-loans/calculators/how-much-can-i-borrow.html' },
  { name: 'ANZ', color: 'bg-blue-600', url: 'https://www.anz.com.au/personal/home-loans/calculators-tools/how-much-borrow/' },
  { name: 'Westpac', color: 'bg-red-600', url: 'https://www.westpac.com.au/personal-banking/home-loans/calculator/borrowing-power-calculator/' },
  { name: 'NAB', color: 'bg-red-700', url: 'https://www.nab.com.au/personal/home-loans/calculators/borrowing-power-calculator' },
]

// ── Main ──────────────────────────────────────────────────────────────────────

export default function BorrowingModule() {
  const [grossIncome, setGrossIncome] = useState(120000)
  const [rentalIncome, setRentalIncome] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState(3000)
  const [existingRepayments, setExistingRepayments] = useState(0)
  const [deposit, setDeposit] = useState(100000)
  const [interestRate, setInterestRate] = useState(6.0)

  const result = calcBorrowingPower({ grossIncome, rentalIncome, monthlyExpenses, existingRepayments, deposit, interestRate })

  const metrics = result ? [
    {
      label: 'Max borrowing capacity',
      value: fmt(result.maxLoan),
      sub: 'Based on income surplus',
      icon: TrendingUp,
      highlight: true,
    },
    {
      label: 'Max purchase price',
      value: fmt(result.maxPurchase),
      sub: `Loan + ${fmt(deposit)} deposit`,
      icon: Home,
    },
    {
      label: 'Est. monthly repayment',
      value: fmt(result.monthlyRepayment),
      sub: 'P&I, 30 years, on max loan',
      icon: DollarSign,
    },
    {
      label: 'Deposit / purchase price',
      value: fmtPct(result.depositPct),
      sub: result.lvr > 80 ? 'LMI likely required (>80% LVR)' : 'No LMI required (<80% LVR)',
      icon: Percent,
      warn: result.lvr > 80,
    },
  ] : []

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Borrowing Power</h1>
        <p className="page-subtitle">Estimate how much you can borrow based on income and expenses</p>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Inputs */}
          <div className="lg:col-span-2 space-y-4">

            {/* Income */}
            <div className="card">
              <div className="card-header">
                <span className="text-sm font-semibold text-navy">Your Income</span>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <label className="label">Gross annual income</label>
                  <NumberInput value={grossIncome} onChange={setGrossIncome} prefix="$" />
                  <p className="field-hint">Before tax, all employment sources</p>
                </div>
                <div>
                  <label className="label">Annual rental income (other properties)</label>
                  <NumberInput value={rentalIncome} onChange={setRentalIncome} prefix="$" />
                  <p className="field-hint">Gross rent from existing investment properties</p>
                </div>
              </div>
            </div>

            {/* Expenses & liabilities */}
            <div className="card">
              <div className="card-header">
                <span className="text-sm font-semibold text-navy">Expenses &amp; Liabilities</span>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <label className="label">Monthly living expenses</label>
                  <NumberInput value={monthlyExpenses} onChange={setMonthlyExpenses} prefix="$" />
                  <p className="field-hint">Rent/mortgage, food, bills, subscriptions</p>
                </div>
                <div>
                  <label className="label">Monthly existing loan repayments</label>
                  <NumberInput value={existingRepayments} onChange={setExistingRepayments} prefix="$" />
                  <p className="field-hint">Car loans, personal loans, other mortgages</p>
                </div>
              </div>
            </div>

            {/* Deposit & rate */}
            <div className="card">
              <div className="card-header">
                <span className="text-sm font-semibold text-navy">Deposit &amp; Rate</span>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <label className="label">Available deposit</label>
                  <NumberInput value={deposit} onChange={setDeposit} prefix="$" />
                  <p className="field-hint">Savings you can put towards purchase</p>
                </div>
                <div>
                  <label className="label">Interest rate</label>
                  <NumberInput value={interestRate} onChange={setInterestRate} suffix="%" />
                  <p className="field-hint">Current average: ~6.0%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-3 space-y-4">
            {result ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {metrics.map((m, i) => {
                    const Icon = m.icon
                    return (
                      <div key={i} className={`card p-4 ${m.highlight ? 'border-navy/30' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-xs text-slate-500 font-medium leading-tight pr-2">{m.label}</p>
                          <div className={`p-1.5 rounded-lg flex-shrink-0 ${m.highlight ? 'bg-navy/10' : 'bg-slate-100'}`}>
                            <Icon size={14} className={m.highlight ? 'text-navy' : 'text-slate-400'} />
                          </div>
                        </div>
                        <p className={`text-2xl font-bold ${m.highlight ? 'text-navy' : m.warn ? 'text-amber-600' : 'text-slate-800'}`}>
                          {m.value}
                        </p>
                        <p className={`text-xs mt-0.5 ${m.warn ? 'text-amber-600' : 'text-slate-400'}`}>{m.sub}</p>
                      </div>
                    )
                  })}
                </div>

                {/* How it's calculated */}
                <div className="card p-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">How this is estimated</h4>
                  <div className="space-y-1.5 text-sm">
                    {[
                      { label: 'Gross annual income', val: fmt(grossIncome) },
                      ...(rentalIncome > 0 ? [{ label: 'Annual rental income', val: fmt(rentalIncome) }] : []),
                      { label: 'Est. net monthly income (~70% effective rate)', val: fmt(result.netMonthly) },
                      ...(rentalIncome > 0 ? [{ label: 'Net rental (after tax)', val: `+ ${fmt(result.netRentalMonthly)}` }] : []),
                      { label: 'Monthly living expenses', val: `- ${fmt(monthlyExpenses)}` },
                      ...(existingRepayments > 0 ? [{ label: 'Existing loan repayments', val: `- ${fmt(existingRepayments)}` }] : []),
                      { label: 'Monthly surplus', val: fmt(result.surplus), bold: true },
                      { label: 'Max repayment (80% of surplus)', val: fmt(result.maxRepayment), bold: true },
                    ].map((row, i) => (
                      <div key={i} className={`flex justify-between ${row.bold ? 'pt-1.5 border-t border-slate-100 font-semibold text-navy' : 'text-slate-600'}`}>
                        <span>{row.label}</span>
                        <span>{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700 leading-relaxed">
                  <strong>Indicative only.</strong> This proxy assumes ~30% effective tax rate and 80% income serviceability. Your actual borrowing capacity depends on credit history, existing debts, number of dependants, HEM benchmarks, and each lender's individual assessment criteria. Always speak to a mortgage broker.
                </div>

                {/* Bank links */}
                <div className="card p-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Get a lender estimate</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {BANKS.map(bank => (
                      <a
                        key={bank.name}
                        href={bank.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm font-medium text-slate-700"
                      >
                        <span className={`w-3 h-3 rounded-sm flex-shrink-0 ${bank.color}`} />
                        {bank.name} →
                      </a>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="card p-8 text-center text-slate-400">
                <p className="text-sm">Monthly surplus is zero or negative — reduce expenses or increase income to see results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
