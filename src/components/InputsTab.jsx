import React, { useState } from 'react'
import { fmtCurrency, fmtPct, fmtWeekly } from '../utils/calculations'

// ── Reusable primitives ────────────────────────────────────────────────────

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
      {prefix && (
        <span className="absolute left-3 text-slate-400 text-sm select-none">{prefix}</span>
      )}
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
      {suffix && (
        <span className="absolute right-3 text-slate-400 text-sm select-none">{suffix}</span>
      )}
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

function Toggle({ value, onChange, labelOn = 'Yes', labelOff = 'No' }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
        ${value ? 'bg-navy' : 'bg-slate-200'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
          ${value ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  )
}

function CardSection({ title, icon, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="text-base">{icon}</span>
        <h3 className="font-semibold text-navy text-sm">{title}</h3>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}

// ── Summary bar ─────────────────────────────────────────────────────────────

function SummaryBar({ results }) {
  const metrics = [
    { label: 'Initial Outlay',       value: fmtCurrency(results.totalInitialOutlay), color: 'text-slate-700' },
    { label: 'IRR',                   value: fmtPct(results.irr),                    color: results.irr > 0 ? 'text-emerald-600' : 'text-red-500' },
    { label: `Equity (Y${results.exitYear})`, value: fmtCurrency(results.exitEquity),  color: 'text-navy' },
    { label: 'Net Proceeds (post-CGT)', value: fmtCurrency(results.netProceeds),      color: results.netProceeds > 0 ? 'text-emerald-600' : 'text-red-500' },
    { label: 'Weekly Cost Y1',        value: fmtWeekly(results.weeklyY1After),       color: results.weeklyY1After >= 0 ? 'text-emerald-600' : 'text-amber-600' },
    { label: 'Return Multiple',       value: `${results.equityMultiple.toFixed(2)}x`, color: 'text-navy' },
  ]
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {metrics.map(m => (
        <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-3 text-center shadow-sm">
          <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
          <div className="text-xs text-slate-400 mt-0.5 leading-tight">{m.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export default function InputsTab({ inputs, update, updateRate, results }) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const totalOtherPurchCosts =
    inputs.transferFee + inputs.documentProcessing + inputs.mortgageRegistration +
    inputs.conveyancingPurchase + inputs.buyersAgent + inputs.bAndP +
    inputs.renovation + inputs.otherCosts

  const totalPurchCosts = inputs.stampDuty + totalOtherPurchCosts
  const totalInitialOutlay = inputs.purchasePrice * (1 - inputs.lvr / 100) + totalPurchCosts

  return (
    <div className="space-y-6">
      <SummaryBar results={results} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left column ── */}
        <div className="space-y-6">

          {/* Property */}
          <CardSection title="Property Details" icon="🏠">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Purchase Price">
                <NumberInput
                  value={inputs.purchasePrice}
                  onChange={v => update('purchasePrice', v)}
                  prefix="$"
                  step={1000}
                  min={0}
                />
              </Field>
              <Field label="Capital Growth p.a.">
                <NumberInput
                  value={inputs.capitalGrowth}
                  onChange={v => update('capitalGrowth', v)}
                  suffix="%"
                  step={0.5}
                  min={0}
                  max={20}
                  decimals={1}
                />
              </Field>
              <Field label="Weekly Rent">
                <NumberInput
                  value={inputs.weeklyRent}
                  onChange={v => update('weeklyRent', v)}
                  prefix="$"
                  suffix="/wk"
                  step={10}
                  min={0}
                />
              </Field>
              <Field label="Rental Growth p.a.">
                <NumberInput
                  value={inputs.rentalGrowth}
                  onChange={v => update('rentalGrowth', v)}
                  suffix="%"
                  step={0.5}
                  min={0}
                  max={20}
                  decimals={1}
                />
              </Field>
              <Field label="Occupancy Rate" hint="Typically 90–97%">
                <NumberInput
                  value={inputs.occupancyRate}
                  onChange={v => update('occupancyRate', v)}
                  suffix="%"
                  step={1}
                  min={50}
                  max={100}
                />
              </Field>
              <Field label="Expense Growth p.a." hint="Applied to rates, maintenance etc.">
                <NumberInput
                  value={inputs.expenseGrowth}
                  onChange={v => update('expenseGrowth', v)}
                  suffix="%"
                  step={0.5}
                  min={0}
                  max={10}
                  decimals={1}
                />
              </Field>
            </div>
          </CardSection>

          {/* Financing */}
          <CardSection title="Financing" icon="🏦">
            <div className="space-y-5">
              {/* LVR toggle */}
              <Field label="Loan-to-Value Ratio (LVR)">
                <SegmentedControl
                  options={[
                    { value: 80, label: '80% LVR' },
                    { value: 88, label: '88% LVR' },
                  ]}
                  value={inputs.lvr}
                  onChange={v => update('lvr', v)}
                />
                {inputs.lvr === 88 && (
                  <p className="text-xs text-amber-600 mt-1.5">
                    LMI of {fmtCurrency(inputs.lmi)} will be capitalised into the loan
                  </p>
                )}
              </Field>

              {/* IO Period */}
              <Field label="Interest-Only Period" hint="Years before principal repayments begin">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={inputs.ioYears}
                    onChange={e => update('ioYears', parseInt(e.target.value))}
                    className="flex-1 accent-navy"
                  />
                  <span className="text-sm font-semibold text-navy w-16 text-right">
                    {inputs.ioYears} yr{inputs.ioYears !== 1 ? 's' : ''}
                  </span>
                </div>
              </Field>

              {/* Interest rate scenario selector */}
              <div>
                <label className="label">Interest Rate Scenario</label>
                <SegmentedControl
                  options={[
                    { value: 'stressed', label: '😰 Stressed' },
                    { value: 'base',     label: '😐 Base' },
                    { value: 'best',     label: '😎 Best' },
                  ]}
                  value={inputs.rateScenario}
                  onChange={v => update('rateScenario', v)}
                />
              </div>

              {/* Rate table */}
              <div>
                <label className="label">Set Rates by Scenario</label>
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
                      {['stressed', 'base', 'best'].map((scenario, i) => {
                        const isActive = inputs.rateScenario === scenario
                        const labels = { stressed: '😰 Stressed', base: '😐 Base', best: '😎 Best' }
                        return (
                          <tr
                            key={scenario}
                            className={`border-t border-slate-100 ${isActive ? 'bg-navy/5' : ''}`}
                          >
                            <td className={`px-3 py-2 font-medium ${isActive ? 'text-navy' : 'text-slate-600'}`}>
                              {labels[scenario]}
                              {isActive && <span className="ml-1 text-xs text-gold">▶ active</span>}
                            </td>
                            {[80, 88].map(lvr => (
                              <td key={lvr} className="px-3 py-2 text-center">
                                <div className="relative inline-flex items-center">
                                  <input
                                    type="number"
                                    value={inputs.rates[lvr][scenario]}
                                    onChange={e => updateRate(lvr, scenario, e.target.value)}
                                    step={0.1}
                                    min={0}
                                    max={20}
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

              {/* LMI (only relevant for 88%) */}
              {inputs.lvr === 88 && (
                <Field label="LMI Amount" hint="Lenders Mortgage Insurance — capitalised into loan">
                  <NumberInput
                    value={inputs.lmi}
                    onChange={v => update('lmi', v)}
                    prefix="$"
                    step={100}
                    min={0}
                    decimals={2}
                  />
                </Field>
              )}
            </div>
          </CardSection>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-6">

          {/* Tax & Depreciation */}
          <CardSection title="Tax & Depreciation" icon="📋">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tax Bracket" hint="Marginal rate">
                <NumberInput
                  value={inputs.taxBracket}
                  onChange={v => update('taxBracket', v)}
                  suffix="%"
                  step={5}
                  min={0}
                  max={50}
                />
              </Field>
              <Field label="Land Value %" hint="% of purchase price">
                <NumberInput
                  value={inputs.landValuePct}
                  onChange={v => update('landValuePct', v)}
                  suffix="%"
                  step={5}
                  min={10}
                  max={90}
                />
              </Field>
              <Field label="Dwelling Age" hint="Years old at purchase">
                <NumberInput
                  value={inputs.dwellingAge}
                  onChange={v => update('dwellingAge', v)}
                  suffix="yrs"
                  step={1}
                  min={0}
                  max={40}
                />
              </Field>
              <Field label="Dwelling Duration" hint="Total lifespan (years)">
                <NumberInput
                  value={inputs.dwellingDuration}
                  onChange={v => update('dwellingDuration', v)}
                  suffix="yrs"
                  step={5}
                  min={20}
                  max={100}
                />
              </Field>
            </div>
            {/* Derived depreciation */}
            <div className="mt-3 bg-slate-50 rounded-lg px-4 py-2.5 text-sm flex justify-between items-center">
              <span className="text-slate-500">Annual depreciation (formula-driven)</span>
              <span className="font-semibold text-navy">
                {fmtCurrency(inputs.purchasePrice * (1 - inputs.landValuePct / 100) / Math.max(1, inputs.dwellingDuration - inputs.dwellingAge))}/yr
              </span>
            </div>
          </CardSection>

          {/* Structuring toggles */}
          <CardSection title="Structuring" icon="⚖️">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Trust Fund Structure</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Land tax threshold: {inputs.trustStructure ? '$350k (Trust)' : '$600k (Personal)'}
                  </p>
                </div>
                <Toggle value={inputs.trustStructure} onChange={v => update('trustStructure', v)} />
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Negative Gearing</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tax benefit on rental losses at {inputs.taxBracket}% marginal rate
                  </p>
                </div>
                <Toggle value={inputs.negativeGearing} onChange={v => update('negativeGearing', v)} />
              </div>
            </div>
          </CardSection>

          {/* Exit */}
          <CardSection title="Exit Strategy" icon="🚪">
            <Field
              label="Exit Year"
              hint={`Sell in Year ${inputs.exitYear} — property value projected at ${fmtCurrency(results.salePrice)}`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={5}
                    max={20}
                    step={1}
                    value={inputs.exitYear}
                    onChange={e => update('exitYear', parseInt(e.target.value))}
                    className="flex-1 accent-navy"
                  />
                  <span className="text-lg font-bold text-navy w-20 text-right">
                    Year {inputs.exitYear}
                  </span>
                </div>
                {/* Exit year markers */}
                <div className="flex justify-between text-xs text-slate-400 px-0.5">
                  {[5, 8, 10, 12, 15, 18, 20].map(y => (
                    <span
                      key={y}
                      onClick={() => update('exitYear', y)}
                      className={`cursor-pointer hover:text-navy ${inputs.exitYear === y ? 'text-navy font-semibold' : ''}`}
                    >
                      Y{y}
                    </span>
                  ))}
                </div>
              </div>
            </Field>
            {/* Exit summary */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                { label: 'Sale Price',      value: fmtCurrency(results.salePrice) },
                { label: 'Outstanding Loan', value: fmtCurrency(results.outstandLoan) },
                { label: 'CGT Payable',     value: fmtCurrency(-results.cgtPayable) },
                { label: 'Net Proceeds',    value: fmtCurrency(results.netProceeds) },
              ].map(m => (
                <div key={m.label} className="bg-slate-50 rounded-lg p-2.5 text-center">
                  <div className="text-xs text-slate-400">{m.label}</div>
                  <div className="text-sm font-bold text-navy mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>
          </CardSection>
        </div>
      </div>

      {/* ── Advanced costs (collapsible) ─────────────────────────── */}
      <div className="card overflow-hidden">
        <button
          onClick={() => setShowAdvanced(v => !v)}
          className="w-full card-header hover:bg-slate-50 transition-colors"
        >
          <span className="text-base">🔧</span>
          <h3 className="font-semibold text-navy text-sm flex-1 text-left">
            Advanced Costs
          </h3>
          <span className="text-xs text-slate-400 mr-2">
            Total purchase costs: {fmtCurrency(totalPurchCosts)} · Initial outlay: {fmtCurrency(totalInitialOutlay)}
          </span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Purchase costs */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  One-Off Purchase Costs
                </h4>
                <div className="space-y-3">
                  {[
                    { key: 'stampDuty',             label: 'Stamp Duty' },
                    { key: 'transferFee',           label: 'Transfer Fee' },
                    { key: 'documentProcessing',    label: 'Document Processing' },
                    { key: 'mortgageRegistration',  label: 'Mortgage Registration' },
                    { key: 'conveyancingPurchase',  label: 'Conveyancing / Solicitor' },
                    { key: 'buyersAgent',           label: "Buyer's Agent Fee" },
                    { key: 'bAndP',                 label: 'B&P Inspection' },
                    { key: 'renovation',            label: 'Renovation' },
                    { key: 'otherCosts',            label: 'Other Costs' },
                  ].map(f => (
                    <Field key={f.key} label={f.label}>
                      <NumberInput
                        value={inputs[f.key]}
                        onChange={v => update(f.key, v)}
                        prefix="$"
                        step={100}
                        min={0}
                      />
                    </Field>
                  ))}
                  <div className="bg-navy/5 rounded-lg p-2.5 flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">Total</span>
                    <span className="font-bold text-navy">{fmtCurrency(totalPurchCosts)}</span>
                  </div>
                </div>
              </div>

              {/* Ongoing costs */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Annual Ongoing Costs
                </h4>
                <div className="space-y-3">
                  <Field label="Maintenance (Year 1)">
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
                  <p className="text-xs text-slate-400">
                    Rates, maintenance & insurance grow at {inputs.expenseGrowth}% p.a.
                  </p>
                </div>
              </div>

              {/* Selling costs */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Selling Costs (at exit)
                </h4>
                <div className="space-y-3">
                  <Field label="Agent Commission">
                    <NumberInput value={inputs.agentCommission} onChange={v => update('agentCommission', v)} suffix="%" step={0.1} min={0} max={5} decimals={1} />
                  </Field>
                  <Field label="Auction Fees">
                    <NumberInput value={inputs.auctionFees} onChange={v => update('auctionFees', v)} prefix="$" step={100} min={0} />
                  </Field>
                  <Field label="Marketing Fees">
                    <NumberInput value={inputs.marketingFees} onChange={v => update('marketingFees', v)} prefix="$" step={100} min={0} />
                  </Field>
                  <Field label="Bank Discharge Fee">
                    <NumberInput value={inputs.bankDischargeFee} onChange={v => update('bankDischargeFee', v)} prefix="$" step={50} min={0} />
                  </Field>
                  <Field label="Conveyancing / Solicitor">
                    <NumberInput value={inputs.conveyancingSale} onChange={v => update('conveyancingSale', v)} prefix="$" step={100} min={0} />
                  </Field>
                  <div className="bg-navy/5 rounded-lg p-2.5 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Agent fees (at exit)</span>
                      <span className="font-medium text-navy">{fmtCurrency(results.agentFees)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-700">Total selling costs</span>
                      <span className="font-bold text-navy">{fmtCurrency(results.totalSellCosts)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
