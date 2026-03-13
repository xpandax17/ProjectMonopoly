import React, { useState } from 'react'
import { fmtCurrency } from '../utils/calculations'

const SECTIONS = [
  {
    title: 'INCOME',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    rows: [
      { key: 'grossRent',    label: 'Gross Rental Income' },
      { key: 'annualRent',   label: 'Effective Rent (after vacancy)', bold: false },
    ],
  },
  {
    title: 'EXPENSES',
    color: 'text-red-700',
    bg: 'bg-red-50',
    rows: [
      { key: 'interestAmt',   label: 'Interest Expense',        negate: true },
      { key: 'principalPaid', label: 'Principal Repayment',     negate: true, muted: true },
      { key: 'loanAnnualFee', label: 'Loan Annual Fee',         negate: true },
      { key: 'pmFees',        label: 'Property Management',     negate: true },
      { key: 'maint',         label: 'Maintenance',             negate: true },
      { key: 'council',       label: 'Council Rates',           negate: true },
      { key: 'water',         label: 'Water Rates',             negate: true },
      { key: 'insur',         label: 'Building Insurance',      negate: true },
      { key: 'landTaxAmt',    label: 'Land Tax',                negate: true },
    ],
  },
  {
    title: 'CASH FLOW',
    color: 'text-navy',
    bg: 'bg-navy/5',
    rows: [
      { key: 'netCFBeforeTax',  label: 'Net CF Before Tax',      bold: true },
      { key: 'annualDepreciation', label: 'Depreciation (non-cash)', negate: true, muted: true },
      { key: 'taxableIncome',   label: 'Taxable Income',         muted: true },
      { key: 'negGearBenefit',  label: 'Neg. Gearing Benefit',   highlight: 'green' },
      { key: 'netCFAfterTax',   label: 'Net CF After Tax',       bold: true, highlight: 'strong' },
      { key: 'weeklyNetAfter',  label: '→ Weekly ($/wk)',        italic: true, weekly: true },
    ],
  },
  {
    title: 'PROPERTY & LOAN',
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    rows: [
      { key: 'propValueEnd',  label: 'Property Value (end yr)' },
      { key: 'loanOpening',   label: 'Loan Balance (start)',   negate: true },
      { key: 'loanClosing',   label: 'Loan Balance (end)',     negate: true },
      { key: 'equity',        label: 'Equity',                 bold: true, highlight: 'gold' },
    ],
  },
]

function cellColor(value, opts = {}) {
  if (opts.highlight === 'strong') {
    return value >= 0 ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'
  }
  if (opts.highlight === 'green') {
    return value > 0 ? 'text-emerald-600 font-medium' : 'text-slate-400'
  }
  if (opts.highlight === 'gold') {
    return 'text-[#C9A84C] font-bold'
  }
  if (opts.muted) return 'text-slate-500'
  if (opts.bold)  return 'font-semibold text-slate-800'
  return 'text-slate-700'
}

function formatCell(value, opts) {
  if (opts.weekly) {
    if (value == null) return '—'
    return `${value >= 0 ? '+' : ''}$${Math.abs(value).toFixed(0)}`
  }
  const v = opts.negate ? value : value
  return fmtCurrency(v)
}

export default function CashFlowTab({ inputs, results }) {
  const { yearlyData, totalInitialOutlay, exitYear, salePrice, outstandLoan, totalSellCosts, cgtPayable, netProceeds } = results
  const [showAll, setShowAll] = useState(false)

  const years = showAll ? yearlyData : yearlyData.slice(0, 15)
  const exitIdx = exitYear - 1

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-navy">20-Year Cash Flow Model</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Annual figures · {inputs.lvr}% LVR · {inputs.rateScenario} rate scenario · Exit Year {exitYear}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-300 inline-block"></span>Exit year</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 inline-block"></span>Positive CF</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 border border-red-300 inline-block"></span>Negative CF</span>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="cf-table-container overflow-x-auto">
          <table className="min-w-full text-xs border-collapse">
            <thead>
              {/* Year row */}
              <tr className="bg-navy text-white">
                <th className="sticky left-0 z-10 bg-navy px-4 py-3 text-left font-semibold w-52 whitespace-nowrap">
                  Year
                </th>
                {years.map(y => (
                  <th
                    key={y.year}
                    className={`px-3 py-3 text-center font-semibold whitespace-nowrap min-w-[90px] ${
                      y.year === exitYear ? 'bg-amber-600' : ''
                    }`}
                  >
                    Y{y.year}
                    {y.year === exitYear && <span className="block text-amber-200 text-xs font-normal">exit</span>}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Initial outlay */}
              <tr className="bg-slate-100 border-b border-slate-300">
                <td className="sticky left-0 z-10 bg-slate-100 px-4 py-2 font-semibold text-slate-700 whitespace-nowrap">
                  Initial Outlay
                </td>
                <td className="px-3 py-2 text-center font-semibold text-red-600">
                  {fmtCurrency(-totalInitialOutlay)}
                </td>
                {years.slice(1).map(y => (
                  <td key={y.year} className="px-3 py-2 text-center text-slate-300">—</td>
                ))}
              </tr>

              {SECTIONS.map(section => (
                <React.Fragment key={section.title}>
                  {/* Section header */}
                  <tr>
                    <td
                      colSpan={years.length + 1}
                      className={`sticky left-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${section.color} ${section.bg}`}
                    >
                      {section.title}
                    </td>
                  </tr>

                  {/* Section rows */}
                  {section.rows.map((row, ri) => (
                    <tr
                      key={row.key}
                      className={`border-b border-slate-100 hover:bg-slate-50 ${ri % 2 === 0 ? '' : 'bg-slate-50/40'}`}
                    >
                      <td className={`sticky left-0 z-10 bg-white px-4 py-1.5 whitespace-nowrap ${
                        row.bold ? 'font-semibold text-slate-800' : row.muted ? 'text-slate-400 pl-6' : 'text-slate-600'
                      } ${row.italic ? 'italic' : ''}`}>
                        {row.label}
                      </td>

                      {years.map(y => {
                        const raw = y[row.key]
                        const val = row.negate ? -raw : raw
                        const isExit = y.year === exitYear

                        return (
                          <td
                            key={y.year}
                            className={`px-3 py-1.5 text-right whitespace-nowrap ${cellColor(raw, row)} ${
                              isExit ? 'bg-amber-50' : ''
                            }`}
                          >
                            {formatCell(raw, row)}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Toggle show all */}
        {yearlyData.length > 15 && (
          <div className="border-t border-slate-200 p-3 text-center">
            <button
              onClick={() => setShowAll(v => !v)}
              className="text-sm text-navy font-medium hover:text-navy-light transition-colors"
            >
              {showAll ? '▲ Show less' : `▼ Show Year 16–20`}
            </button>
          </div>
        )}
      </div>

      {/* Exit analysis box */}
      <div className="card border-l-4 border-gold overflow-hidden">
        <div className="card-header bg-gold/5">
          <span>🚪</span>
          <h3 className="font-semibold text-navy text-sm">Exit Analysis — Year {exitYear}</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Sale Price',        value: fmtCurrency(salePrice),      color: 'text-navy' },
              { label: 'Less: Loan',        value: fmtCurrency(-outstandLoan),  color: 'text-red-600' },
              { label: 'Less: Selling Costs', value: fmtCurrency(-totalSellCosts), color: 'text-red-600' },
              { label: 'Less: CGT',         value: fmtCurrency(-cgtPayable),    color: 'text-red-600' },
            ].map(m => (
              <div key={m.label} className="text-center">
                <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Net Proceeds (after all costs & CGT)</span>
            <span className={`text-2xl font-bold ${netProceeds >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {fmtCurrency(netProceeds)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            CGT calculated with 50% discount (property held &gt;12 months) at {inputs.taxBracket}% marginal rate.
            Capital gain: {fmtCurrency(results.capitalGain)}.
          </p>
        </div>
      </div>
    </div>
  )
}
