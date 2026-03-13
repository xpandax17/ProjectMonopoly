import React, { useState } from 'react'
import { fmtCurrency, fmtPct, fmtWeekly } from '../../utils/calculations'

// ── Primitives ──────────────────────────────────────────────────────────────

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

function NumberInput({ value, onChange, prefix, suffix, step = 'any', min, max, decimals }) {
  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-slate-400 text-sm select-none">{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={e => {
          const v = decimals !== undefined
            ? parseFloat(parseFloat(e.target.value).toFixed(decimals))
            : parseFloat(e.target.value)
          if (!isNaN(v)) onChange(v)
        }}
        step={step}
        min={min}
        max={max}
        className={`input-field ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-12' : ''}`}
      />
      {suffix && <span className="absolute right-3 text-slate-400 text-sm select-none">{suffix}</span>}
    </div>
  )
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="pill-toggle w-full">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`pill-btn flex-1 text-center ${value === opt.value ? 'pill-btn-active' : 'pill-btn-inactive'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ── Exit scenario cards ─────────────────────────────────────────────────────

function ExitCard({ year, results, selected, onClick }) {
  if (!results) return null
  const { irr, netProceeds, weeklyY1After } = results
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 rounded-xl border-2 p-4 text-left transition-all
        ${selected
          ? 'border-gold bg-gold/5 shadow-md'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
        }
      `}
    >
      <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${selected ? 'text-gold-dark' : 'text-slate-400'}`}>
        Exit Year {year}
        {selected && <span className="ml-2 text-gold">▼ selected</span>}
      </div>
      <div className="space-y-1.5">
        <div>
          <div className={`text-xl font-bold ${irr > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {fmtPct(irr)}
          </div>
          <div className="text-xs text-slate-400">IRR</div>
        </div>
        <div>
          <div className={`text-lg font-bold ${netProceeds > 0 ? 'text-navy' : 'text-red-500'}`}>
            {fmtCurrency(netProceeds)}
          </div>
          <div className="text-xs text-slate-400">Net proceeds (after CGT)</div>
        </div>
        <div>
          <div className={`text-sm font-semibold ${weeklyY1After >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {fmtWeekly(weeklyY1After)}
          </div>
          <div className="text-xs text-slate-400">Weekly cost Y1 (after neg. gearing)</div>
        </div>
      </div>
    </button>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export default function InputsTab({ inputs, update, updateRate, allResults, selectedExit, setSelectedExit }) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const totalOtherPurchCosts =
    inputs.transferFee + inputs.documentProcessing + inputs.mortgageRegistration +
    inputs.conveyancingPurchase + inputs.buyersAgent + inputs.bAndP +
    inputs.renovation + inputs.otherCosts
  const totalPurchCosts = inputs.stampDuty + totalOtherPurchCosts

  // Derived depreciation display
  const annualDepr = inputs.purchasePrice * (1 - inputs.landValuePct / 100) / Math.max(1, inputs.dwellingDuration - inputs.dwellingAge)

  return (
    <div className="space-y-6">

      {/* ── Exit scenario cards (always at top) ─────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-navy">Exit Scenarios</h3>
          <span className="text-xs text-slate-400">Click a scenario to update the Cash Flow and Charts tabs</span>
        </div>
        <div className="flex gap-3">
          {[5, 10, 15].map(yr => (
            <ExitCard
              key={yr}
              year={yr}
              results={yr === 5 ? allResults.y5 : yr === 10 ? allResults.y10 : allResults.y15}
              selected={selectedExit === yr}
              onClick={() => setSelectedExit(yr)}
            />
          ))}
        </div>
      </div>

      {/* ── Core inputs ─────────────────────────────────────────── */}
      <div className="card">
        <div className="card-header">
          <span>🏠</span>
          <h3 className="font-semibold text-navy text-sm">Property & Financing</h3>
          <span className="ml-auto text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
            Negative gearing ON
          </span>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Field label="Purchase Price">
              <NumberInput value={inputs.purchasePrice} onChange={v => update('purchasePrice', v)} prefix="$" step={1000} min={0} />
            </Field>
            <Field label="Weekly Rent">
              <NumberInput value={inputs.weeklyRent} onChange={v => update('weeklyRent', v)} prefix="$" suffix="/wk" step={10} min={0} />
            </Field>
            <Field label="Tax Bracket" hint="Your marginal rate">
              <NumberInput value={inputs.taxBracket} onChange={v => update('taxBracket', v)} suffix="%" step={5} min={0} max={50} />
            </Field>
            <Field label="Loan-to-Value Ratio">
              <SegmentedControl
                options={[{ value: 80, label: '80% LVR' }, { value: 88, label: '88% LVR' }]}
                value={inputs.lvr}
                onChange={v => update('lvr', v)}
              />
              {inputs.lvr === 88 && (
                <p className="text-xs text-amber-600 mt-1">LMI {fmtCurrency(inputs.lmi)} capitalised into loan</p>
              )}
            </Field>
            <Field label="Interest Rate Scenario">
              <SegmentedControl
                options={[
                  { value: 'stressed', label: '😰 Stressed' },
                  { value: 'base',     label: '😐 Base' },
                  { value: 'best',     label: '😎 Best' },
                ]}
                value={inputs.rateScenario}
                onChange={v => update('rateScenario', v)}
              />
              <p className="text-xs text-slate-400 mt-1">
                Active rate: {inputs.rates[inputs.lvr][inputs.rateScenario]}% ({inputs.lvr}% LVR · {inputs.rateScenario})
              </p>
            </Field>
          </div>

          {/* Compact rate table */}
          <div className="mt-5">
            <label className="label">Interest Rates by Scenario</label>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-sm">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Scenario</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-slate-500">80% LVR</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-slate-500">88% LVR</th>
                  </tr>
                </thead>
                <tbody>
                  {['stressed', 'base', 'best'].map(scenario => {
                    const labels = { stressed: '😰 Stressed', base: '😐 Base', best: '😎 Best' }
                    const isActive = inputs.rateScenario === scenario
                    return (
                      <tr key={scenario} className={`border-t border-slate-100 ${isActive ? 'bg-navy/5' : ''}`}>
                        <td className={`px-3 py-2 font-medium ${isActive ? 'text-navy' : 'text-slate-600'}`}>
                          {labels[scenario]} {isActive && <span className="text-xs text-gold ml-1">▶ active</span>}
                        </td>
                        {[80, 88].map(lvr => (
                          <td key={lvr} className="px-3 py-2 text-center">
                            <div className="relative inline-flex items-center">
                              <input
                                type="number"
                                value={inputs.rates[lvr][scenario]}
                                onChange={e => updateRate(lvr, scenario, e.target.value)}
                                step={0.1} min={0} max={20}
                                className="w-20 text-center input-field py-1 text-xs"
                              />
                              <span className="absolute right-2 text-slate-400 text-xs">%</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Advanced settings ────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <button
          onClick={() => setShowAdvanced(v => !v)}
          className="w-full card-header hover:bg-slate-50 transition-colors"
        >
          <span>🔧</span>
          <h3 className="font-semibold text-navy text-sm flex-1 text-left">Advanced Settings</h3>
          <span className="text-xs text-slate-400 mr-2">
            Total purchase costs: {fmtCurrency(totalPurchCosts)} · Depreciation: {fmtCurrency(annualDepr)}/yr
          </span>
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Growth assumptions */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Growth Assumptions</h4>
                <div className="space-y-3">
                  <Field label="Capital Growth p.a.">
                    <NumberInput value={inputs.capitalGrowth} onChange={v => update('capitalGrowth', v)} suffix="%" step={0.5} min={0} max={20} decimals={1} />
                  </Field>
                  <Field label="Rental Growth p.a.">
                    <NumberInput value={inputs.rentalGrowth} onChange={v => update('rentalGrowth', v)} suffix="%" step={0.5} min={0} max={20} decimals={1} />
                  </Field>
                  <Field label="Occupancy Rate">
                    <NumberInput value={inputs.occupancyRate} onChange={v => update('occupancyRate', v)} suffix="%" step={1} min={50} max={100} />
                  </Field>
                  <Field label="Expense Growth p.a.">
                    <NumberInput value={inputs.expenseGrowth} onChange={v => update('expenseGrowth', v)} suffix="%" step={0.5} min={0} max={10} decimals={1} />
                  </Field>
                  <Field label="Interest-Only Period">
                    <NumberInput value={inputs.ioYears} onChange={v => update('ioYears', v)} suffix="yrs" step={1} min={0} max={10} />
                  </Field>
                  {inputs.lvr === 88 && (
                    <Field label="LMI Amount">
                      <NumberInput value={inputs.lmi} onChange={v => update('lmi', v)} prefix="$" step={100} min={0} decimals={2} />
                    </Field>
                  )}
                </div>
              </div>

              {/* Depreciation */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Depreciation</h4>
                <div className="space-y-3">
                  <Field label="Land Value %">
                    <NumberInput value={inputs.landValuePct} onChange={v => update('landValuePct', v)} suffix="%" step={5} min={10} max={90} />
                  </Field>
                  <Field label="Dwelling Age at Purchase">
                    <NumberInput value={inputs.dwellingAge} onChange={v => update('dwellingAge', v)} suffix="yrs" step={1} min={0} max={40} />
                  </Field>
                  <Field label="Dwelling Total Lifespan">
                    <NumberInput value={inputs.dwellingDuration} onChange={v => update('dwellingDuration', v)} suffix="yrs" step={5} min={20} max={100} />
                  </Field>
                  <div className="bg-slate-50 rounded-lg px-3 py-2.5 text-sm">
                    <span className="text-slate-500">Annual depreciation</span>
                    <div className="font-bold text-navy">{fmtCurrency(annualDepr)}/yr</div>
                  </div>
                </div>
              </div>

              {/* Ongoing costs */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Annual Costs (Year 1)</h4>
                <div className="space-y-3">
                  <Field label="Maintenance">
                    <NumberInput value={inputs.maintenance} onChange={v => update('maintenance', v)} prefix="$" suffix="/yr" step={100} min={0} />
                  </Field>
                  <Field label="PM Fee (% of rent)">
                    <NumberInput value={inputs.pmFeesPct} onChange={v => update('pmFeesPct', v)} suffix="%" step={0.5} min={0} max={20} decimals={1} />
                  </Field>
                  <Field label="Council Rates">
                    <NumberInput value={inputs.councilRates} onChange={v => update('councilRates', v)} prefix="$" suffix="/yr" step={50} min={0} />
                  </Field>
                  <Field label="Water Rates">
                    <NumberInput value={inputs.waterRates} onChange={v => update('waterRates', v)} prefix="$" suffix="/yr" step={50} min={0} />
                  </Field>
                  <Field label="Building Insurance">
                    <NumberInput value={inputs.buildingInsurance} onChange={v => update('buildingInsurance', v)} prefix="$" suffix="/yr" step={50} min={0} />
                  </Field>
                  <Field label="Loan Annual Fee">
                    <NumberInput value={inputs.loanAnnualFee} onChange={v => update('loanAnnualFee', v)} prefix="$" suffix="/yr" step={50} min={0} />
                  </Field>
                </div>
              </div>

              {/* Purchase & selling costs */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Purchase Costs</h4>
                <div className="space-y-3">
                  {[
                    { key: 'stampDuty',             label: 'Stamp Duty' },
                    { key: 'transferFee',           label: 'Transfer Fee' },
                    { key: 'documentProcessing',    label: 'Document Processing' },
                    { key: 'mortgageRegistration',  label: 'Mortgage Reg.' },
                    { key: 'conveyancingPurchase',  label: 'Conveyancing' },
                    { key: 'buyersAgent',           label: "Buyer's Agent" },
                    { key: 'bAndP',                 label: 'B&P Inspection' },
                    { key: 'renovation',            label: 'Renovation' },
                    { key: 'otherCosts',            label: 'Other' },
                  ].map(f => (
                    <Field key={f.key} label={f.label}>
                      <NumberInput value={inputs[f.key]} onChange={v => update(f.key, v)} prefix="$" step={100} min={0} />
                    </Field>
                  ))}
                  <div className="bg-navy/5 rounded-lg p-2.5 flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">Total</span>
                    <span className="font-bold text-navy">{fmtCurrency(totalPurchCosts)}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide pt-2">Selling Costs</h4>
                  <Field label="Agent Commission">
                    <NumberInput value={inputs.agentCommission} onChange={v => update('agentCommission', v)} suffix="%" step={0.1} min={0} max={5} decimals={1} />
                  </Field>
                  <Field label="Fixed Selling Costs">
                    <NumberInput value={inputs.auctionFees + inputs.marketingFees + inputs.bankDischargeFee + inputs.conveyancingSale} onChange={() => {}} prefix="$" />
                  </Field>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
