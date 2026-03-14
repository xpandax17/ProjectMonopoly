import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, BarChart2, Calculator, Receipt, ArrowRight, Search } from 'lucide-react'

const TOOLS = [
  {
    path: '/quiz',
    icon: Brain,
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
    accentColor: 'bg-purple-600',
    tag: 'Step 1',
    title: 'Investor Profile Quiz',
    description: '12 questions · 5 archetypes. Understand your risk tolerance, time commitment, and strategy fit before you buy.',
    cta: 'Take the quiz',
    badge: '~4 mins',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    path: '/calculator',
    icon: BarChart2,
    color: 'bg-blue-50',
    iconColor: 'text-navy',
    accentColor: 'bg-navy',
    tag: 'Step 2',
    title: 'Cash Flow Model',
    description: 'Model a property\'s 20-year cash flow. Weekly holding cost, IRR, and net proceeds across Y5 / Y10 / Y15 exit scenarios.',
    cta: 'Run the numbers',
    badge: 'Core tool',
    badgeColor: 'bg-navy/10 text-navy',
  },
  {
    path: '/borrowing',
    icon: Calculator,
    color: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    accentColor: 'bg-emerald-600',
    tag: 'Step 3',
    title: 'Borrowing Power',
    description: 'Quick estimate of your maximum borrowing capacity based on income, expenses, and deposit size.',
    cta: 'Check capacity',
    badge: 'Quick calc',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    path: '/stamp-duty',
    icon: Receipt,
    color: 'bg-amber-50',
    iconColor: 'text-amber-600',
    accentColor: 'bg-amber-600',
    tag: 'Step 4',
    title: 'Stamp Duty & Costs',
    description: 'State-based stamp duty calculator for QLD · NSW · VIC · WA, plus conveyancer, inspection, and total upfront costs.',
    cta: 'Calculate costs',
    badge: 'QLD/NSW/VIC/WA',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    path: '/research',
    icon: Search,
    color: 'bg-slate-50',
    iconColor: 'text-slate-400',
    accentColor: 'bg-slate-400',
    tag: 'Coming Soon',
    title: 'Property Research',
    description: 'Paste a Domain.com.au link. Pull listing data, run comparable sales, and get a full due diligence checklist.',
    cta: 'Coming soon',
    badge: 'V4',
    badgeColor: 'bg-slate-100 text-slate-500',
    disabled: true,
  },
]

export default function HomeScreen() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-2">Property Investment Toolkit</p>
        <h1 className="font-playfair text-3xl font-bold text-navy mb-2">
          Where do you want to start?
        </h1>
        <p className="text-slate-500 text-base max-w-2xl">
          Five tools that take you from "what type of investor am I?" to "does this deal stack up?" — each one designed for clarity, not complexity.
        </p>
      </div>

      {/* Tool grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOOLS.map(tool => {
          const Icon = tool.icon
          return (
            <div
              key={tool.path}
              onClick={() => !tool.disabled && navigate(tool.path)}
              className={`
                group relative bg-white border border-slate-200 rounded-xl p-6 transition-all
                ${tool.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:border-navy/30 hover:shadow-md hover:-translate-y-0.5'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${tool.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={tool.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{tool.tag}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-navy text-base mb-1.5">{tool.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{tool.description}</p>
                  {!tool.disabled && (
                    <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-gold transition-colors">
                      {tool.cta}
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <p className="mt-8 text-xs text-slate-400 text-center">
        Built for Australian residential property investors · All projections are illustrative only · Not financial advice
      </p>
    </div>
  )
}
