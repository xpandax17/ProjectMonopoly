import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, ChartBar, Calculator, Receipt, MagnifyingGlass, ArrowRight } from '@phosphor-icons/react'

const TOOLS = [
  {
    path: '/quiz',
    icon: Brain,
    gradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-200',
    iconColor: 'text-violet-700',
    step: '01',
    title: 'Investor Profile',
    tagline: 'What type of investor are you?',
    desc: '12 questions · 5 archetypes · strategy fit',
    cta: 'Take the quiz',
  },
  {
    path: '/calculator',
    icon: ChartBar,
    gradient: 'from-navy to-blue-700',
    iconBg: 'bg-blue-200',
    iconColor: 'text-navy',
    step: '02',
    title: 'Cash Flow Model',
    tagline: 'Does this deal stack up?',
    desc: 'IRR · weekly cost · Y5 / Y10 / Y15 exits',
    cta: 'Run the numbers',
    highlight: true,
  },
  {
    path: '/borrowing',
    icon: Calculator,
    gradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-200',
    iconColor: 'text-emerald-700',
    step: '03',
    title: 'Borrowing Power',
    tagline: 'How much can you borrow?',
    desc: 'Income · expenses · deposit → max loan',
    cta: 'Check capacity',
  },
  {
    path: '/stamp-duty',
    icon: Receipt,
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-200',
    iconColor: 'text-amber-700',
    step: '04',
    title: 'Stamp Duty',
    tagline: 'What\'s the total upfront cost?',
    desc: 'QLD · NSW · VIC · WA · FHB concessions',
    cta: 'Calculate costs',
  },
  {
    path: '/research',
    icon: MagnifyingGlass,
    gradient: 'from-slate-400 to-slate-500',
    iconBg: 'bg-slate-200',
    iconColor: 'text-slate-500',
    step: '05',
    title: 'Property Research',
    tagline: 'Due diligence on any listing',
    desc: 'Comparables · suburb data · checklist',
    cta: 'Coming in V4',
    disabled: true,
  },
]

export default function HomeScreen() {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">

      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-bold text-gold uppercase tracking-widest mb-3">Project Monopoly</p>
        <h1 className="font-playfair text-4xl font-bold text-navy mb-3 leading-tight">
          Property Investment Toolkit
        </h1>
        <p className="text-slate-400 text-base max-w-lg">
          Four tools. From investor profile to deal analysis.
        </p>
      </div>

      {/* Tool grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TOOLS.map(tool => {
          const Icon = tool.icon
          return (
            <div
              key={tool.path}
              onClick={() => !tool.disabled && navigate(tool.path)}
              className={`
                group relative bg-white border rounded-2xl overflow-hidden transition-all
                ${tool.disabled
                  ? 'opacity-40 cursor-not-allowed border-slate-200'
                  : tool.highlight
                    ? 'cursor-pointer border-navy/30 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                    : 'cursor-pointer border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
                }
              `}
            >
              {/* Colour accent strip */}
              <div className={`h-1 w-full bg-gradient-to-r ${tool.gradient}`} />

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl ${tool.iconBg} flex items-center justify-center`}>
                    <Icon size={20} weight="duotone" className={tool.iconColor} />
                  </div>
                  {/* Step number */}
                  <span className="text-xs font-bold text-slate-200 tabular-nums">{tool.step}</span>
                </div>

                <h3 className="font-bold text-navy text-lg mb-0.5 leading-tight">{tool.title}</h3>
                <p className="text-sm font-medium text-slate-600 mb-2">{tool.tagline}</p>
                <p className="text-xs text-slate-400">{tool.desc}</p>

                {!tool.disabled && (
                  <div className="mt-5 flex items-center gap-1 text-xs font-bold text-navy group-hover:text-gold transition-colors uppercase tracking-wide">
                    {tool.cta}
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-8 text-xs text-slate-300 text-center">
        For Australian residential property investors · Illustrative only · Not financial advice
      </p>
    </div>
  )
}
