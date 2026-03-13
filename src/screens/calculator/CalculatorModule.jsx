import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { calculateMultiExit } from '../../utils/calculations'
import InputsTab from './InputsTab'
import CashFlowTab from './CashFlowTab'
import ChartsTab from './ChartsTab'

export const DEFAULT_INPUTS = {
  // ── Core (visible) ────────────────────────────────────────────
  purchasePrice:    730000,
  weeklyRent:       500,
  lvr:              80,
  rateScenario:     'base',
  taxBracket:       45,
  // negativeGearing is always ON — not a user toggle

  // ── Financing ─────────────────────────────────────────────────
  ioYears:          5,
  lmi:              11424.49,
  rates: {
    80: { stressed: 7.50, base: 5.80, best: 4.30 },
    88: { stressed: 8.20, base: 6.50, best: 5.00 },
  },

  // ── Property assumptions (advanced) ───────────────────────────
  capitalGrowth:    6,
  rentalGrowth:     6,
  occupancyRate:    95,
  expenseGrowth:    3,
  landValuePct:     40,
  dwellingAge:      16,
  dwellingDuration: 40,

  // ── Ongoing costs (advanced) ──────────────────────────────────
  maintenance:      2000,
  pmFeesPct:        8,
  councilRates:     1800,
  waterRates:       1200,
  buildingInsurance:1800,
  loanAnnualFee:    395,

  // ── Purchase costs (advanced) ─────────────────────────────────
  stampDuty:           25920,
  transferFee:         2671.34,
  documentProcessing:  100,
  mortgageRegistration:232,
  conveyancingPurchase:1750,
  buyersAgent:         11667,
  bAndP:               550,
  renovation:          2000,
  otherCosts:          5000,

  // ── Selling costs (advanced) ──────────────────────────────────
  agentCommission:   2.5,
  auctionFees:       500,
  marketingFees:     500,
  bankDischargeFee:  500,
  conveyancingSale:  2000,
}

const TABS = [
  { id: 'inputs',   label: 'Inputs',    icon: '⚙️' },
  { id: 'cashflow', label: 'Cash Flow', icon: '📊' },
  { id: 'charts',   label: 'Charts',    icon: '📈' },
]

export default function CalculatorModule() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('inputs')
  const [selectedExit, setSelectedExit] = useState(10)  // Y5, Y10, Y15
  const [inputs, setInputs] = useState(() => {
    // Pre-fill purchase price from ?price= query param (from Module 3 CTA)
    const priceParam = searchParams.get('price')
    if (priceParam) {
      return { ...DEFAULT_INPUTS, purchasePrice: parseInt(priceParam) || DEFAULT_INPUTS.purchasePrice }
    }
    return DEFAULT_INPUTS
  })

  const update = useCallback((field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }))
  }, [])

  const updateRate = useCallback((lvr, scenario, value) => {
    setInputs(prev => ({
      ...prev,
      rates: {
        ...prev.rates,
        [lvr]: { ...prev.rates[lvr], [scenario]: parseFloat(value) || 0 },
      },
    }))
  }, [])

  // Derive model inputs (sum up costs, resolve rate)
  const modelInputs = useMemo(() => {
    const totalOtherPurchaseCosts =
      inputs.transferFee + inputs.documentProcessing + inputs.mortgageRegistration +
      inputs.conveyancingPurchase + inputs.buyersAgent + inputs.bAndP +
      inputs.renovation + inputs.otherCosts

    const fixedSellingCosts =
      inputs.auctionFees + inputs.marketingFees + inputs.bankDischargeFee + inputs.conveyancingSale

    const interestRate = inputs.rates[inputs.lvr][inputs.rateScenario]

    return {
      ...inputs,
      interestRate,
      totalOtherPurchaseCosts,
      fixedSellingCosts,
      negativeGearing: true,  // always ON
      trustStructure:  false, // always personal name
      totalYears: 20,
    }
  }, [inputs])

  // Calculate all 3 exit scenarios
  const allResults = useMemo(() => calculateMultiExit(modelInputs), [modelInputs])

  // Active result based on selected exit year
  const results = useMemo(() => {
    if (selectedExit === 5)  return allResults.y5
    if (selectedExit === 15) return allResults.y15
    return allResults.y10
  }, [allResults, selectedExit])

  return (
    <div>
      {/* ── Sub-header: breadcrumb + tab nav ──────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-3">
            <button onClick={() => navigate('/')} className="hover:text-navy transition-colors">Home</button>
            <span>/</span>
            <span className="text-navy font-medium">Cash Flow Calculator</span>
          </div>
          <nav className="flex gap-0 mt-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 text-sm font-semibold border-b-2 transition-all select-none
                  ${activeTab === tab.id
                    ? 'border-gold text-navy'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
                  }
                `}
              >
                <span className="mr-1.5">{tab.icon}</span>{tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'inputs'   && (
          <InputsTab
            inputs={inputs}
            update={update}
            updateRate={updateRate}
            allResults={allResults}
            selectedExit={selectedExit}
            setSelectedExit={setSelectedExit}
          />
        )}
        {activeTab === 'cashflow' && (
          <CashFlowTab
            inputs={{ ...modelInputs, exitYear: selectedExit }}
            results={results}
          />
        )}
        {activeTab === 'charts'   && (
          <ChartsTab
            inputs={{ ...modelInputs, exitYear: selectedExit }}
            results={results}
          />
        )}
      </main>
    </div>
  )
}
