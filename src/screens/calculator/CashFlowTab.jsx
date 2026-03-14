import React from 'react'
import { fmtCurrency, fmtPct } from '../../utils/calculations'
import { ExitSelector } from './InputsTab'

const SECTIONS = [
  {
    title: 'INCOME',
    color: 'text-emerald-700 bg-emerald-50',
    rows: [
      { key: 'grossRent',  label: 'Gross Rental Income' },
      { key: 'annualRent', label: 'Effective Rent (after vacancy)', muted: true },
    ],
  },
  {
    title: 'EXPENSES',
    color: 'text-red-700 bg-red-50',
    rows: [
      { key: 'interestAmt',   label: 'Interest Expense',       negate: true },
      { key: 'principalPaid', label: 'Principal Repayment',    negate: true, muted: true },
      { key: 'loanAnnualFee', label: 'Loan Annual Fee',        negate: true, muted: true },
      { key: 'pmFees',        label: 'Property Management',    negate: true },
      { key: 'maint',         label: 'Maintenance',            negate: true },
      { key: 'council',       label: 'Council Rates',          negate: true },
      { key: 'water',         label: 'Water Rates',            negate: true },
      { key: 'insur',         label: 'Building Insurance',     negate: true },
      { key: 'landTaxAmt',    label: 'Land Tax',               negate: true },
    ],
  },
  {
    title: 'CASH FLOW',
    color: 'text-navy bg-navy/5',
    rows: [
      { key: 'netCFBeforeTax',     label: 'Net CF Before Tax',        bold: true },
      { key: 'annualDepreciation', label: 'Depreciation (non-cash)',  negate: true, muted: true },
      { key: 'taxableIncome',      label: 'Taxable Income',           muted: true },
      { key: 'negGearBenefit',     label: 'Neg. Gearing Benefit',     highlight: 'green' },
      { key: 'netCFAfterTax',      label: 'Net CF After Tax',         bold: true, highlight: 'strong' },
    ],
  },
  {
    title: 'PROPERTY & LOAN',
    color: 'text-slate-700 bg-slate-50',
    rows: [
      { key: 'propValueEnd',  label: 'Property Value (end yr)' },
      { key: 'loanOpening',   label: 'Loan Balance (start)',   negate: true, muted: true },
      { key: 'loanClosing',   label: 'Loan Balance (end)',     negate: true },
      { key: 'equity',        label: 'Equity',                 bold: true, highlight: 'gold' },
    ],
  },
]

function cellClass(value, opts = {}) {
  if (opts.highlight === 'strong') return value >= 0 ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'
  if (opts.highlight === 'green')  return value > 0  ? 'text-emerald-600 font-medium' : 'text-slate-400'
  if (opts.highlight === 'gold')   return 'text-[#C9A84C] font-bold'
  if (opts.muted)  return 'text-slate-400'
  if (opts.bold)   return 'font-semibold text-slate-800'
  return 'text-slate-700'
}

export default function CashFlowTab({ inputs, results, allResults, selectedExit, setSelectedExit }) {
  const { yearlyData, totalInitialOutlay, exitYear, salePrice, outstandLoan,
          totalSellCosts, cgtPayable, netProceeds, capitalGain } = results

  const visibleYears = yearlyData.filter(y => y.year <= exitYear)

  return (
    <div className="space-y-5">

      {/* ── Exit selector ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-navy">Exit Scenarios</h3>
          <span className="text-xs text-slate-400">{inputs.lvr}% LVR · {inputs.rateScenario} rate · Annual figures</span>
        </div>
        <ExitSelector selectedExit={selectedExit} setSelectedExit={setSelectedExit} allResults={allResults} />
      </div>

      {/* ── Table ─────────────────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <div
          className="cf-table-container overflow-auto"
          style={{ maxHeight: 'calc(100vh - 320px)', minHeight: '500px' }}
        >
          <table className="min-w-full text-xs border-collapse">
            <thead>
              <tr className="bg-navy text-white" style={{ position: 'sticky', top: 0, zIndex: 20 }}>
                <th
                  className="bg-navy px-4 py-3 text-left font-semibold w-52 whitespace-nowrap"
                  style={{ position: 'sticky', left: 0, zIndex: 30 }}
                >
                  Year
                </th>
                {visibleYears.map(y => (
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
                <td
                  className="bg-slate-100 px-4 py-2 font-semibold text-slate-700 whitespace-nowrap"
                  style={{ position: 'sticky', left: 0, zIndex: 10 }}
                >
                  Initial Outlay
                </td>
                <td className="px-3 py-2 text-right font-semibold text-red-600">
                  {fmtCurrency(-totalInitialOutlay)}
                </td>
                {visibleYears.slice(1).map(y => (
                  <td key={y.year} className="px-3 py-2 text-center text-slate-300">—</td>
                ))}
              </tr>

              {SECTIONS.map(section => (
                <React.Fragment key={section.title}>
                  <tr>
                    <td
                      colSpan={visibleYears.length + 1}
                      className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${section.color}`}
                      style={{ position: 'sticky', left: 0 }}
                    >
                      {section.title}
                    </td>
                  </tr>
                  {section.rows.map((row, ri) => (
                    <tr key={row.key} className={`border-b border-slate-100 hover:bg-slate-50/60 ${ri % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                      <td
                        className={`bg-white px-4 py-1.5 whitespace-nowrap ${
                          row.bold ? 'font-semibold text-slate-800' : row.muted ? 'text-slate-400 pl-6' : 'text-slate-600'
                        }`}
                        style={{ position: 'sticky', left: 0, zIndex: 10 }}
                      >
                        {row.label}
                      </td>
                      {visibleYears.map(y => {
                        const raw = y[row.key]
                        const isExit = y.year === exitYear
                        return (
                          <td
                            key={y.year}
                            className={`px-3 py-1.5 text-right whitespace-nowrap ${cellClass(raw, row)} ${isExit ? 'bg-amber-50' : ''}`}
                          >
                            {fmtCurrency(row.negate ? -raw : raw)}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}

              {/* Weekly / Monthly rows */}
              <tr className="bg-navy/5 border-t-2 border-navy/20">
                <td
                  className="bg-navy/5 px-4 py-2 font-bold text-navy whitespace-nowrap text-xs uppercase tracking-wide"
                  style={{ position: 'sticky', left: 0, zIndex: 10 }}
                >
                  Weekly CF (after neg. gearing)
                </td>
                {visibleYears.map(y => (
                  <td key={y.year} className={`px-3 py-2 text-right font-semibold whitespace-nowrap text-xs ${
                    y.year === exitYear ? 'bg-amber-50' : ''
                  } ${y.weeklyNetAfter >= 0 ? 'text-emerald-600' : 'text-amber-700'}`}>
                    {`${y.weeklyNetAfter >= 0 ? '+' : ''}$${Math.abs(y.weeklyNetAfter).toFixed(0)}/wk`}
                  </td>
                ))}
              </tr>
              <tr className="bg-navy/5 border-b border-navy/10">
                <td
                  className="bg-navy/5 px-4 py-2 font-bold text-navy whitespace-nowrap text-xs uppercase tracking-wide"
                  style={{ position: 'sticky', left: 0, zIndex: 10 }}
                >
                  Monthly CF (after neg. gearing)
                </td>
                {visibleYears.map(y => {
                  const monthly = y.netCFAfterTax / 12
                  return (
                    <td key={y.year} className={`px-3 py-2 text-right font-semibold whitespace-nowrap text-xs ${
                      y.year === exitYear ? 'bg-amber-50' : ''
                    } ${monthly >= 0 ? 'text-emerald-600' : 'text-amber-700'}`}>
                      {`${monthly >= 0 ? '+' : ''}$${Math.abs(monthly).toFixed(0)}/mo`}
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Exit analysis ─────────────────────────────────────────── */}
      <div className="mt-8 card border-l-4 border-gold overflow-hidden">
        <div className="card-header bg-gold/5">
          <h3 className="font-semibold text-navy text-sm">Exit Analysis — Year {exitYear}</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
            {[
              { label: 'Sale Price',             value: fmtCurrency(salePrice),      color: 'text-navy' },
              { label: 'Outstanding Loan',       value: fmtCurrency(-outstandLoan),  color: 'text-red-600' },
              { label: 'Selling Costs',          value: fmtCurrency(-totalSellCosts),color: 'text-red-600' },
              { label: 'CGT Payable',            value: fmtCurrency(-cgtPayable),    color: 'text-red-600' },
            ].map(m => (
              <div key={m.label}>
                <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Net Proceeds (after all costs &amp; CGT)</span>
            <span className={`text-2xl font-bold ${netProceeds >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {fmtCurrency(netProceeds)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            CGT: 50% discount on capital gain of {fmtCurrency(capitalGain)}, taxed at {inputs.taxBracket}% · Held {exitYear} years.
          </p>
        </div>
      </div>
    </div>
  )
}
