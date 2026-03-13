import React from 'react'
import { useNavigate } from 'react-router-dom'

const MODULES = [
  {
    id: 'quiz',
    path: '/quiz',
    icon: '🧠',
    tag: 'Module 1',
    title: 'What Investor Am I?',
    description: '12 questions. 5 investor archetypes. Understand your strategy, risk tolerance, and the kind of property that actually fits your life.',
    cta: 'Take the quiz',
    color: 'from-purple-600 to-indigo-700',
    badge: '~4 mins',
  },
  {
    id: 'calculator',
    path: '/calculator',
    icon: '📊',
    tag: 'Module 2',
    title: 'Cash Flow Calculator',
    description: 'Model a property\'s 20-year cash flow. See your weekly holding cost, IRR, and net proceeds across 5, 10 and 15 year exit scenarios.',
    cta: 'Run the numbers',
    color: 'from-navy to-blue-800',
    badge: 'Core tool',
  },
  {
    id: 'research',
    path: '/research',
    icon: '🔍',
    tag: 'Module 3',
    title: 'Property Research',
    description: 'Paste a Domain.com.au link. Pull listing data, run a comparable sales analysis, and get a due diligence checklist — all in one place.',
    cta: 'Coming soon',
    color: 'from-slate-500 to-slate-700',
    badge: 'Coming soon',
    disabled: true,
  },
]

export default function HomeScreen() {
  const navigate = useNavigate()

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-playfair font-bold text-navy mb-3">
          Your Property Investment Toolkit
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          From "am I the right type of investor?" to "does this deal stack up?" — three tools that take you through the full decision.
        </p>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MODULES.map(mod => (
          <div
            key={mod.id}
            className={`relative rounded-2xl overflow-hidden shadow-lg transition-all duration-200 ${
              mod.disabled ? 'opacity-60 cursor-default' : 'cursor-pointer hover:-translate-y-1 hover:shadow-xl'
            }`}
            onClick={() => !mod.disabled && navigate(mod.path)}
          >
            {/* Gradient top bar */}
            <div className={`bg-gradient-to-r ${mod.color} p-6 pb-8`}>
              <div className="flex items-start justify-between">
                <span className="text-4xl">{mod.icon}</span>
                <span className="text-xs font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full">
                  {mod.badge}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">{mod.tag}</p>
                <h3 className="text-white text-xl font-bold mt-1 leading-tight">{mod.title}</h3>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white p-6">
              <p className="text-slate-500 text-sm leading-relaxed">{mod.description}</p>
              <div className="mt-5">
                <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
                  mod.disabled ? 'text-slate-400' : 'text-navy'
                }`}>
                  {mod.cta}
                  {!mod.disabled && <span className="text-gold">→</span>}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom tagline */}
      <div className="mt-12 text-center">
        <p className="text-slate-400 text-sm">
          Built for Australian residential property investors · All projections are illustrative only
        </p>
      </div>
    </main>
  )
}
