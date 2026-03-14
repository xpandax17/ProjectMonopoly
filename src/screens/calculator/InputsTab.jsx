import React, { useState, useEffect } from 'react'
import { fmtCurrency, fmtPct, fmtWeekly } from '../../utils/calculations'
import { Home, TrendingUp, Landmark, BadgePercent, Settings, ChevronDown } from 'lucide-react'

// ── NumberInput — allows deleting all digits without snapping back ────────────

function NumberInput({ value, onChange, prefix, suffix, min, max, decimals }) {
  const [localVal, setLocalVal] = useState(String(value))

  useEffect(() => {
    // Only sync from parent if the parsed value differs (avoids overwriting "5." mid-type)
    const parsed = parseFloat(localVal)
    if (isNaN(parsed) || parsed !== value) {
      setLocalVal(String(value))
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = e => {
    const raw = e.target.value
    setLocalVal(raw)
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) {
      const clamped = min !== undefined ? Math.max(min, parsed) : parsed
      const final = decimals !== undefined ? parseFloat(clamped.toFixed(decimals)) : clamped
      onChange(final)
    }
  }

  const handleBlur = () => {
    const parsed = parseFloat(localVal)
    if (isNaN(parsed)) {
      setLocalVal(String(value)) // revert to last valid if user leaves empty
    } else {
      setLocalVal(String(decimals !== undefined ? parseFloat(parsed.toFixed(decimals)) : parsed))
    }
  }

  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-slate-400 text-sm select-none pointer-events-none">{prefix}</span>}
      <input
        type="text"
        inputMode="decimal"
        value={localVal}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`input-field ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-12' : ''}`}
      />
      {suffix && <span className="absolute right-3 text-slate-400 text-sm select-none pointer-events-none">{suffix}</span>}
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && <p className="field-hint">{hint}</p>}
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

function Toggle({ checked, onChange, label, hint }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {hint && <div className="text-xs text-slate-400 mt-0.5">{hint}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-navy' : 'bg-slate-200'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    </div>
  )
}

function SectionCard({ icon: Icon, title, badge, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="w-7 h-7 rounded-lg bg-navy/8 flex items-center justify-center flex-shrink-0">
          <Icon size={14} className="text-navy" />
        </div>
        <h3 className="font-semibold text-navy text-sm">{title}</h3>
        {badge && <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{badge}</span>}
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}

// ── Exit scenario cards ─────────────────────────────────────────────────────

export function ExitSelector({ selectedExit, setSelectedExit, allResults }) {
  return (
    <div className="flex gap-3">
      {[5, 10, 15].map(yr => {
        const res = yr === 5 ? allResults?.y5 : yr === 10 ? allResults?.y10 : allResults?.y15
        const selected = selectedExit === yr
        if (!res) return null
        const { irr, netProceeds, weeklyY1After } = res
        return (
          <button
            key={yr}
            onClick={() => setSelectedExit(yr)}
            className={`flex-1 rounded-xl border-2 p-4 text-left transition-all ${
              selected
                ? 'border-gold bg-gold/5 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className={`text-xs font-bold uppercase tracking-wide mb-3 ${selected ? 'text-gold' : 'text-slate-400'}`}>
              Exit Y{yr} {selected && '▼'}
            </div>
            <div className="space-y-1.5">
              <div>
                <div className={`text-xl font-bold ${irr > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{fmtPct(irr)}</div>
                <div className="text-xs text-slate-400">IRR</div>
              </div>
              <div>
                <div className={`text-base font-bold ${netProceeds > 0 ? 'text-navy' : 'text-red-500'}`}>{fmtCurrency(netProceeds)}</div>
                <div className="text-xs text-slate-400">Net proceeds after CGT</div>
              </div>
              <div>
                <div className={`text-sm font-semibold ${weeklyY1After >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>{fmtWeekly(weeklyY1After)}</div>
                <div className="text-xs text-slate-400">Weekly cost Y1</div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
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
  const totalSellCosts = inputs.auctionFees + inputs.marketingFees + inputs.bankDischargeFee + inputs.conveyancingSale
  const annualDepr = inputs.purchasePrice * (1 - inputs.landValuePct / 100) / Math.max(1, inputs.dwellingDuration - inputs.dwellingAge)

  return (
    <div className="space-y-5">

      {/* ── Exit scenario cards ──────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-navy">Exit Scenarios</h3>
          <span className="text-xs text-slate-400">Select to update Cash Flow &amp; Charts tabs</span>
        </div>
        <ExitSelector selectedExit={selectedExit} setSelectedExit={setSelectedExit} allResults={allResults} />
      </div>

      {/* ── Section 1: Property ──────────────────────────────────── */}
      <SectionCard icon={Home} title="Property">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Purchase Price">
            <NumberInput value={inputs.purchasePrice} onChange={v => update('purchasePrice', v)} prefix="$" min={0} />
          </Field>
          <Field label="Weekly Rent">
            <NumberInput value={inputs.weeklyRent} onChange={v => update('weeklyRent', v)} prefix="$" suffix="/wk" min={0} />
          </Field>
          <Field label="Occupancy Rate" hint="Weeks rented per year ÷ 52">
            <NumberInput value={inputs.occupancyRate} onChange={v => update('occupancyRate', v)} suffix="%" min={50} max={100} />
          </Field>
        </div>
      </SectionCard>

      {/* ── Section 2: Growth Assumptions ───────────────────────── */}
      <SectionCard icon={TrendingUp} title="Growth Assumptions">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Capital Growth p.a.">
            <NumberInput value={inputs.capitalGrowth} onChange={v => update('capitalGrowth', v)} suffix="%" min={0} max={20} decimals={1} />
          </Field>
          <Field label="Rental Growth p.a.">
            <NumberInput value={inputs.rentalGrowth} onChange={v => update('rentalGrowth', v)} suffix="%" min={0} max={20} decimals={1} />
          </Field>
          <Field label="Expense Growth p.a.">
            <NumberInput value={inputs.expenseGrowth} onChange={v => update('expenseGrowth', v)} suffix="%" min={0} max={10} decimals={1} />
          </Field>
        </div>
      </SectionCard>

      {/* ── Section 3: Financing ─────────────────────────────────── */}
      <SectionCard icon={Landmark} title="Financing">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <Field label="Loan-to-Value Ratio">
            <SegmentedControl
              options={[{ value: 80, label: '80% LVR' }, { value: 88, label: '88% LVR' }]}
              value={inputs.lvr}
              onChange={v => update('lvr', v)}
            />
            {inputs.lvr === 88 && (
              <p className="field-hint text-amber-600 mt-1">LMI {fmtCurrency(inputs.lmi)} capitalised into loan</p>
            )}
          </Field>
          <Field label="Interest Rate Scenario">
            <SegmentedControl
              options={[
                { value: 'stressed', label: 'Stressed' },
                { value: 'base',     label: 'Base' },
                { value: 'best',     label: 'Best' },
              ]}
              value={inputs.rateScenario}
              onChange={v => update('rateScenario', v)}
            />
            <p className="field-hint mt-1">
              Active: {inputs.rates[inputs.lvr][inputs.rateScenario]}%
            </p>
          </Field>
          <Field label="Interest-Only Period">
            <NumberInput value={inputs.ioYears} onChange={v => update('ioYears', v)} suffix="yrs" min={0} max={10} />
          </Field>
          {inputs.lvr === 88 && (
            <Field label="LMI Amount">
              <NumberInput value={inputs.lmi} onChange={v => update('lmi', v)} prefix="$" min={0} decimals={2} />
            </Field>
          )}
        </div>

        {/* Rate table */}
        <div>
          <label className="label">Interest Rates — edit to customise</label>
          <div className="border border-slate-200 rounded-lg overflow-hidden text-sm">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Scenario</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-slate-500">80% LVR</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-slate-500">88% LVR</th>
                </tr>
              </thead>
              <tbody>
                {['stressed', 'base', 'best'].map(scenario => {
                  const labels = { stressed: 'Stressed', base: 'Base', best: 'Best' }
                  const isActive = inputs.rateScenario === scenario && true
                  return (
                    <tr key={scenario} className={`border-t border-slate-100 ${isActive ? 'bg-blue-50/50' : ''}`}>
                      <td className={`px-4 py-2 font-medium ${isActive ? 'text-navy' : 'text-slate-600'}`}>
                        {labels[scenario]}
                        {isActive && <span className="ml-2 text-xs text-gold font-semibold">active</span>}
                      </td>
                      {[80, 88].map(lvr => (
                        <td key={lvr} className="px-4 py-2 text-center">
                          <div className="relative inline-flex items-center justify-center">
                            <input
                              type="number"
                              value={inputs.rates[lvr][scenario]}
                              onChange={e => updateRate(lvr, scenario, e.target.value)}
                              step={0.1} min={0} max={20}
                              className="w-20 text-center input-field py-1.5 text-xs"
                            />
                            <span className="absolute right-2 text-slate-400 text-xs pointer-events-none">%</span>
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
      </SectionCard>

      {/* ── Section 4: Tax & Structure ───────────────────────────── */}
      <SectionCard icon={BadgePercent} title="Tax &amp; Structure">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Marginal Tax Bracket" hint="Your personal income tax rate">
            <NumberInput value={inputs.taxBracket} onChange={v => update('taxBracket', v)} suffix="%" min={0} max={50} />
          </Field>
          <div className="flex flex-col justify-end pb-1">
            <Toggle
              checked={inputs.negativeGearing}
              onChange={v => update('negativeGearing', v)}
              label="Negative Gearing"
              hint="Apply tax benefit on annual losses"
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Advanced settings ────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <button
          onClick={() => setShowAdvanced(v => !v)}
          className="w-full card-header hover:bg-slate-50 transition-colors text-left"
        >
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Settings size={14} className="text-slate-500" />
          </div>
          <h3 className="font-semibold text-slate-600 text-sm flex-1">Advanced Settings</h3>
          <span className="text-xs text-slate-400 mr-2">
            Purchase costs {fmtCurrency(totalPurchCosts)} · Depreciation {fmtCurrency(annualDepr)}/yr
          </span>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {showAdvanced && (
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Depreciation */}
              <div>
                <p className="section-label mb-4">Depreciation</p>
                <div className="space-y-4">
                  <Field label="Land Value %">
                    <NumberInput value={inputs.landValuePct} onChange={v => update('landValuePct', v)} suffix="%" min={10} max={90} />
                  </Field>
                  <Field label="Dwelling Age at Purchase">
                    <NumberInput value={inputs.dwellingAge} onChange={v => update('dwellingAge', v)} suffix="yrs" min={0} max={40} />
                  </Field>
                  <Field label="Dwelling Total Lifespan">
                    <NumberInput value={inputs.dwellingDuration} onChange={v => update('dwellingDuration', v)} suffix="yrs" min={20} max={100} />
                  </Field>
                  <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                    <div className="text-xs text-slate-500">Annual depreciation</div>
                    <div className="font-bold text-navy text-sm mt-0.5">{fmtCurrency(annualDepr)}/yr</div>
                  </div>
                </div>
              </div>

              {/* Ongoing Costs */}
              <div>
                <p className="section-label mb-4">Ongoing Costs (Year 1)</p>
                <div className="space-y-4">
                  <Field label="Maintenance">
                    <NumberInput value={inputs.maintenance} onChange={v => update('maintenance', v)} prefix="$" suffix="/yr" min={0} />
                  </Field>
                  <Field label="PM Fee (% of rent)">
                    <NumberInput value={inputs.pmFeesPct} onChange={v => update('pmFeesPct', v)} suffix="%" min={0} max={20} decimals={1} />
                  </Field>
                  <Field label="Council Rates">
                    <NumberInput value={inputs.councilRates} onChange={v => update('councilRates', v)} prefix="$" suffix="/yr" min={0} />
                  </Field>
                  <Field label="Water Rates">
                    <NumberInput value={inputs.waterRates} onChange={v => update('waterRates', v)} prefix="$" suffix="/yr" min={0} />
                  </Field>
                  <Field label="Building Insurance">
                    <NumberInput value={inputs.buildingInsurance} onChange={v => update('buildingInsurance', v)} prefix="$" suffix="/yr" min={0} />
                  </Field>
                  <Field label="Loan Annual Fee">
                    <NumberInput value={inputs.loanAnnualFee} onChange={v => update('loanAnnualFee', v)} prefix="$" suffix="/yr" min={0} />
                  </Field>
                </div>
              </div>

              {/* Transaction Costs */}
              <div>
                <p className="section-label mb-4">Purchase Costs</p>
                <div className="space-y-3">
                  {[
                    { key: 'stampDuty',            label: 'Stamp Duty' },
                    { key: 'transferFee',          label: 'Transfer Fee' },
                    { key: 'documentProcessing',   label: 'Document Processing' },
                    { key: 'mortgageRegistration', label: 'Mortgage Registration' },
                    { key: 'conveyancingPurchase', label: 'Conveyancing' },
                    { key: 'buyersAgent',          label: "Buyer's Agent" },
                    { key: 'bAndP',                label: 'B&P Inspection' },
                    { key: 'renovation',           label: 'Renovation' },
                    { key: 'otherCosts',           label: 'Other' },
                  ].map(f => (
                    <Field key={f.key} label={f.label}>
                      <NumberInput value={inputs[f.key]} onChange={v => update(f.key, v)} prefix="$" min={0} />
                    </Field>
                  ))}
                  <div className="bg-navy/5 rounded-lg px-3 py-2.5 flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">Total purchase costs</span>
                    <span className="font-bold text-navy">{fmtCurrency(totalPurchCosts)}</span>
                  </div>
                </div>

                <p className="section-label mt-6 mb-4">Selling Costs</p>
                <div className="space-y-3">
                  <Field label="Agent Commission">
                    <NumberInput value={inputs.agentCommission} onChange={v => update('agentCommission', v)} suffix="%" min={0} max={5} decimals={1} />
                  </Field>
                  <Field label="Auction Fees">
                    <NumberInput value={inputs.auctionFees} onChange={v => update('auctionFees', v)} prefix="$" min={0} />
                  </Field>
                  <Field label="Marketing Fees">
                    <NumberInput value={inputs.marketingFees} onChange={v => update('marketingFees', v)} prefix="$" min={0} />
                  </Field>
                  <Field label="Bank Discharge Fee">
                    <NumberInput value={inputs.bankDischargeFee} onChange={v => update('bankDischargeFee', v)} prefix="$" min={0} />
                  </Field>
                  <Field label="Conveyancing (Sale)">
                    <NumberInput value={inputs.conveyancingSale} onChange={v => update('conveyancingSale', v)} prefix="$" min={0} />
                  </Field>
                  <div className="bg-navy/5 rounded-lg px-3 py-2.5 flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">Total selling costs (ex. commission)</span>
                    <span className="font-bold text-navy">{fmtCurrency(totalSellCosts)}</span>
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
