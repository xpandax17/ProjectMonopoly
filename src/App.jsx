import React, { useState, useMemo, useCallback } from 'react'
import InputsTab from './components/InputsTab'
import CashFlowTab from './components/CashFlowTab'
import ChartsTab from './components/ChartsTab'
import { calculateModel } from './utils/calculations'

export const DEFAULT_INPUTS = {
  // ── Property ──────────────────────────────────────────────────
  purchasePrice:   730000,
  capitalGrowth:   6,
  weeklyRent:      500,
  rentalGrowth:    6,
  occupancyRate:   95,

  // ── Financing ─────────────────────────────────────────────────
  lvr:             80,
  ioYears:         5,
  lmi:             11424.49,
  rates: {
    80: { stressed: 7.50, base: 5.80, best: 4.30 },
    88: { stressed: 8.20, base: 6.50, best: 5.00 },
  },
  rateScenario:    'base',

  // ── Tax & depreciation ────────────────────────────────────────
  taxBracket:      45,
  landValuePct:    40,
  dwellingAge:     16,
  dwellingDuration:40,
  expenseGrowth:   3,

  // ── Toggles ───────────────────────────────────────────────────
  trustStructure:  false,
  negativeGearing: true,

  // ── Exit ──────────────────────────────────────────────────────
  exitYear:        10,

  // ── Ongoing costs ─────────────────────────────────────────────
  maintenance:     2000,
  pmFeesPct:       8,
  councilRates:    1800,
  waterRates:      1200,
  buildingInsurance:1800,
  loanAnnualFee:   395,

  // ── Purchase costs ────────────────────────────────────────────
  stampDuty:          25920,
  transferFee:        2671.34,
  documentProcessing: 100,
  mortgageRegistration:232,
  conveyancingPurchase:1750,
  buyersAgent:        11667,
  bAndP:              550,
  renovation:         2000,
  otherCosts:         5000,

  // ── Selling costs ─────────────────────────────────────────────
  agentCommission:   2.5,
  auctionFees:       500,
  marketingFees:     500,
  bankDischargeFee:  500,
  conveyancingSale:  2000,
}

const TABS = [
  { id: 'inputs',   label: 'Inputs',     icon: '⚙️' },
  { id: 'cashflow', label: 'Cash Flow',  icon: '📊' },
  { id: 'charts',   label: 'Charts',     icon: '📈' },
]

export default function App() {
  const [inputs, setInputs]     = useState(DEFAULT_INPUTS)
  const [activeTab, setActiveTab] = useState('inputs')

  // Generic field update
  const update = useCallback((field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }))
  }, [])

  // Nested rate update
  const updateRate = useCallback((lvr, scenario, value) => {
    setInputs(prev => ({
      ...prev,
      rates: {
        ...prev.rates,
        [lvr]: { ...prev.rates[lvr], [scenario]: parseFloat(value) || 0 },
      },
    }))
  }, [])

  // Derived: sum up purchase costs
  const modelInputs = useMemo(() => {
    const totalOtherPurchaseCosts =
      inputs.transferFee +
      inputs.documentProcessing +
      inputs.mortgageRegistration +
      inputs.conveyancingPurchase +
      inputs.buyersAgent +
      inputs.bAndP +
      inputs.renovation +
      inputs.otherCosts

    const fixedSellingCosts =
      inputs.auctionFees +
      inputs.marketingFees +
      inputs.bankDischargeFee +
      inputs.conveyancingSale

    const interestRate = inputs.rates[inputs.lvr][inputs.rateScenario]

    return {
      ...inputs,
      interestRate,
      totalOtherPurchaseCosts,
      fixedSellingCosts,
      totalYears: 20,
    }
  }, [inputs])

  const results = useMemo(() => calculateModel(modelInputs), [modelInputs])

  // Helper: get the active interest rate label
  const rateLabel = `${inputs.rates[inputs.lvr][inputs.rateScenario]}% (${inputs.rateScenario})`

  return (
    <div className="min-h-screen bg-[#F0F2F7] font-inter">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center text-xl shadow-md">
              🏠
            </div>
            <div>
              <h1 className="font-playfair text-2xl font-bold leading-none tracking-tight">
                Project Monopoly
              </h1>
              <p className="text-slate-300 text-xs mt-0.5 tracking-wide">
                Property Cash Flow Calculator
              </p>
            </div>
          </div>

          {/* Quick config badges */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="bg-navy-light px-3 py-1.5 rounded-full text-slate-200 font-medium">
              {inputs.lvr}% LVR
            </span>
            <span className="bg-navy-light px-3 py-1.5 rounded-full text-slate-200 font-medium capitalize">
              {inputs.rateScenario} · {rateLabel}
            </span>
            <span className={`px-3 py-1.5 rounded-full font-medium ${
              inputs.trustStructure ? 'bg-gold/20 text-gold-light' : 'bg-navy-light text-slate-200'
            }`}>
              {inputs.trustStructure ? 'Trust' : 'Personal Name'}
            </span>
            <span className={`px-3 py-1.5 rounded-full font-medium ${
              inputs.negativeGearing ? 'bg-green-800/60 text-green-300' : 'bg-navy-light text-slate-200'
            }`}>
              {inputs.negativeGearing ? 'Neg. Gearing On' : 'No Neg. Gearing'}
            </span>
          </div>
        </div>
      </header>

      {/* ── Tab nav ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-4 text-sm font-semibold border-b-2 transition-all select-none
                  ${activeTab === tab.id
                    ? 'border-gold text-navy'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'inputs'   && <InputsTab   inputs={inputs} update={update} updateRate={updateRate} results={results} />}
        {activeTab === 'cashflow' && <CashFlowTab  inputs={inputs} results={results} />}
        {activeTab === 'charts'   && <ChartsTab    inputs={inputs} results={results} />}
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-400 border-t border-slate-200 mt-4">
        Project Monopoly · For illustrative purposes only · Not financial advice
      </footer>
    </div>
  )
}
