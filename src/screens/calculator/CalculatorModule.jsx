import React, { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { calculateMultiExit } from '../../utils/calculations'
import InputsTab from './InputsTab'
import CashFlowTab from './CashFlowTab'
import ChartsTab from './ChartsTab'

export const DEFAULT_INPUTS = {
  // ── Core ──────────────────────────────────────────────────────
  purchasePrice:    730000,
  weeklyRent:       500,
  lvr:              80,
  rateScenario:     'base',
  taxBracket:       45,
  negativeGearing:  true,

  // ── Financing ─────────────────────────────────────────────────
  ioYears:          5,
  lmi:              11424.49,
  rates: {
    80: { stressed: 7.50, base: 5.80, best: 4.30 },
    88: { stressed: 8.20, base: 6.50, best: 5.00 },
  },

  // ── Property assumptions ──────────────────────────────────────
  capitalGrowth:    6,
  rentalGrowth:     6,
  occupancyRate:    95,
  expenseGrowth:    3,
  landValuePct:     40,
  dwellingAge:      16,
  dwellingDuration: 40,

  // ── Ongoing costs ─────────────────────────────────────────────
  maintenance:      2000,
  pmFeesPct:        8,
  councilRates:     1800,
  waterRates:       1200,
  buildingInsurance:1800,
  loanAnnualFee:    395,

  // ── Purchase costs ────────────────────────────────────────────
  stampDuty:           25920,
  transferFee:         2671.34,
  documentProcessing:  100,
  mortgageRegistration:232,
  conveyancingPurchase:1750,
  buyersAgent:         11667,
  bAndP:               550,
  renovation:          2000,
  otherCosts:          5000,

  // ── Selling costs ─────────────────────────────────────────────
  agentCommission:   2.5,
  auctionFees:       500,
  marketingFees:     500,
  bankDischargeFee:  500,
  conveyancingSale:  2000,
}

const TABS = [
  { id: 'inputs',   label: 'Inputs'    },
  { id: 'cashflow', label: 'Cash Flow' },
  { id: 'charts',   label: 'Charts'    },
]

export default function CalculatorModule() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('inputs')
  const [selectedExit, setSelectedExit] = useState(10)
  const [inputs, setInputs] = useState(() => {
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
      trustStructure: false,
      totalYears: 20,
    }
  }, [inputs])

  const allResults = useMemo(() => calculateMultiExit(modelInputs), [modelInputs])

  const results = useMemo(() => {
    if (selectedExit === 5)  return allResults.y5
    if (selectedExit === 15) return allResults.y15
    return allResults.y10
  }, [allResults, selectedExit])

  return (
    <div className="flex flex-col h-full">
      {/* ── Tab nav ──────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-8">
          <div className="flex items-end gap-4 pt-5 pb-0">
            <nav className="flex gap-0">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-5 py-3 text-sm font-semibold border-b-2 transition-all select-none
                    ${activeTab === tab.id
                      ? 'border-gold text-navy'
                      : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="ml-auto pb-3">
              <p className="text-xs text-slate-400 font-medium">Property Cash Flow Model</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="px-8 py-6">
        {activeTab === 'inputs' && (
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
            allResults={allResults}
            selectedExit={selectedExit}
            setSelectedExit={setSelectedExit}
          />
        )}
        {activeTab === 'charts' && (
          <ChartsTab
            inputs={{ ...modelInputs, exitYear: selectedExit }}
            results={results}
            allResults={allResults}
            selectedExit={selectedExit}
            setSelectedExit={setSelectedExit}
          />
        )}
      </div>
    </div>
  )
}
