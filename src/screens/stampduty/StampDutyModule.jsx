import React, { useState, useMemo } from 'react'
import { calcStampDuty, TRANSFER_FEES, STATE_LABELS } from '../../utils/stampDutyData'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n) {
  if (!n && n !== 0) return '—'
  return '$' + Math.round(n).toLocaleString()
}

// ── Number Input with comma formatting ───────────────────────────────────────

function NumberInput({ value, onChange, prefix, suffix }) {
  const [local, setLocal] = React.useState(String(value))
  const [focused, setFocused] = React.useState(false)

  React.useEffect(() => {
    const p = parseFloat(local)
    if (isNaN(p) || p !== value) setLocal(String(value))
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

// ── Pill Toggle ───────────────────────────────────────────────────────────────

function PillToggle({ options, value, onChange }) {
  return (
    <div className="pill-toggle">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`pill-btn ${value === opt.value ? 'pill-btn-active' : 'pill-btn-inactive'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function StampDutyModule() {
  const [state, setState] = useState('QLD')
  const [price, setPrice] = useState(700000)
  const [isFHB, setIsFHB] = useState(false)
  const [deposit, setDeposit] = useState(140000)
  const [conveyancer, setConveyancer] = useState(1500)
  const [otherCosts, setOtherCosts] = useState(0)
  const [includeBP, setIncludeBP] = useState(true)
  const bpCost = 600

  const results = useMemo(() => {
    const duty = calcStampDuty(state, price, isFHB)
    const transferFee = TRANSFER_FEES[state] ? TRANSFER_FEES[state](price) : 0
    const lvr = price > 0 ? ((price - deposit) / price) * 100 : 0
    const lmiEst = lvr > 80 ? Math.round((price - deposit) * 0.015) : 0
    const bp = includeBP ? bpCost : 0
    const totalCosts = duty + transferFee + conveyancer + bp + lmiEst + otherCosts
    const totalCashRequired = deposit + totalCosts

    return { duty, transferFee, lvr, lmiEst, totalCosts, totalCashRequired }
  }, [state, price, isFHB, deposit, conveyancer, includeBP, otherCosts])

  const stateOptions = Object.keys(STATE_LABELS).map(s => ({ value: s, label: s }))

  const lineItems = [
    { label: 'Stamp duty', value: results.duty, highlight: true },
    { label: 'Transfer registration fee', value: results.transferFee },
    { label: 'Conveyancer / solicitor', value: conveyancer },
    ...(includeBP ? [{ label: 'Building & pest inspection', value: bpCost }] : []),
    ...(otherCosts > 0 ? [{ label: 'Other costs', value: otherCosts }] : []),
    ...(results.lmiEst > 0 ? [{ label: 'LMI (indicative)', value: results.lmiEst, warn: true }] : []),
  ]

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Stamp Duty Calculator</h1>
        <p className="page-subtitle">QLD · NSW · VIC · WA — 2024–25 rates</p>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Inputs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card">
              <div className="card-header">
                <span className="text-sm font-semibold text-navy">Property Details</span>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <label className="label">State</label>
                  <PillToggle options={stateOptions} value={state} onChange={setState} />
                </div>
                <div>
                  <label className="label">Purchase price</label>
                  <NumberInput value={price} onChange={setPrice} prefix="$" />
                </div>
                <div>
                  <label className="label">Your deposit</label>
                  <NumberInput value={deposit} onChange={setDeposit} prefix="$" />
                  {results.lvr > 80 && (
                    <p className="field-hint text-amber-500">LVR {results.lvr.toFixed(0)}% — LMI likely</p>
                  )}
                </div>
                <div className="flex items-center justify-between py-1">
                  <div>
                    <span className="text-sm font-medium text-slate-700">First home buyer</span>
                    <p className="text-xs text-slate-400 mt-0.5">Apply FHB concession / exemption</p>
                  </div>
                  <button
                    onClick={() => setIsFHB(v => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isFHB ? 'bg-navy' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFHB ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="text-sm font-semibold text-navy">Other Purchase Costs</span>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <label className="label">Conveyancer / solicitor</label>
                  <NumberInput value={conveyancer} onChange={setConveyancer} prefix="$" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-slate-700">Building & pest inspection</span>
                    <p className="text-xs text-slate-400">{fmt(bpCost)}</p>
                  </div>
                  <button
                    onClick={() => setIncludeBP(v => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${includeBP ? 'bg-navy' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${includeBP ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div>
                  <label className="label">Other costs</label>
                  <NumberInput value={otherCosts} onChange={setOtherCosts} prefix="$" />
                  <p className="field-hint">Buyer's agent, inspection reports, moving costs, etc.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {/* Summary metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4 border-navy/30">
                <p className="text-xs text-slate-500 font-medium mb-1">Stamp duty</p>
                <p className="text-3xl font-bold text-navy">{fmt(results.duty)}</p>
                {isFHB && results.duty === 0 && (
                  <p className="text-xs text-emerald-600 mt-0.5">FHB exemption applied</p>
                )}
                {isFHB && results.duty > 0 && (
                  <p className="text-xs text-emerald-600 mt-0.5">FHB concession applied</p>
                )}
              </div>
              <div className="card p-4">
                <p className="text-xs text-slate-500 font-medium mb-1">Total cash required</p>
                <p className="text-3xl font-bold text-slate-800">{fmt(results.totalCashRequired)}</p>
                <p className="text-xs text-slate-400 mt-0.5">Deposit + all purchase costs</p>
              </div>
            </div>

            {/* Itemised breakdown */}
            <div className="card p-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Cost breakdown</h4>

              <div className="space-y-0">
                {lineItems.map((item, i) => (
                  <div key={i} className={`flex justify-between py-2.5 text-sm border-b border-slate-50 last:border-0 ${item.highlight ? 'font-medium text-navy' : item.warn ? 'text-amber-600' : 'text-slate-600'}`}>
                    <span>{item.label}{item.warn ? ' *' : ''}</span>
                    <span>{fmt(item.value)}</span>
                  </div>
                ))}

                <div className="flex justify-between py-2.5 text-sm font-semibold text-navy border-t-2 border-slate-200 mt-1">
                  <span>Total purchase costs</span>
                  <span>{fmt(results.totalCosts)}</span>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Your deposit</span>
                    <span>{fmt(deposit)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Purchase costs</span>
                    <span>{fmt(results.totalCosts)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-navy text-base pt-1 border-t border-slate-200">
                    <span>Total cash required</span>
                    <span>{fmt(results.totalCashRequired)}</span>
                  </div>
                </div>

                {results.lmiEst > 0 && (
                  <p className="text-xs text-amber-600 mt-2">
                    * LMI is an indicative estimate at ~1.5% of loan. Confirm with your broker — actual LMI varies by lender and loan amount.
                  </p>
                )}
              </div>
            </div>

            {/* FHB info */}
            {isFHB && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-700">
                <strong>FHB thresholds for {STATE_LABELS[state]}:</strong>
                {{
                  QLD: ' Exempt on homes ≤ $500k. Concessional (proportional) $500k–$550k.',
                  NSW: ' Exempt on homes ≤ $800k. Concessional (proportional) $800k–$1M.',
                  VIC: ' Exempt on homes ≤ $600k. Concessional (proportional) $600k–$750k.',
                  WA:  ' Exempt on homes ≤ $430k. Concessional (proportional) $430k–$530k.',
                }[state]}
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700 leading-relaxed">
              Based on 2024–25 published rates. Rates may change — always confirm with your solicitor or conveyancer before exchanging contracts.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
