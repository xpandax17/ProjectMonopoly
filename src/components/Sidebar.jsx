import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Home, Brain, BarChart2, Calculator, Receipt, Search,
  Building2, ChevronRight, Clock
} from 'lucide-react'
import { CHANGELOG } from '../constants/changelog'

const NAV_ITEMS = [
  { path: '/',            icon: Home,       label: 'Home'            },
  { path: '/quiz',        icon: Brain,      label: 'Investor Quiz'   },
  { path: '/calculator',  icon: BarChart2,  label: 'Cash Flow Model' },
  { path: '/borrowing',   icon: Calculator, label: 'Borrowing Power' },
  { path: '/stamp-duty',  icon: Receipt,    label: 'Stamp Duty'      },
  { path: '/research',    icon: Search,     label: 'Property Research', disabled: true },
]

function ChangelogModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-navy text-white p-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="font-playfair text-lg font-bold">Changelog</h2>
            <p className="text-slate-300 text-xs mt-0.5">Project Monopoly</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white text-xl leading-none">×</button>
        </div>
        <div className="p-5 space-y-6">
          {CHANGELOG.map(entry => (
            <div key={entry.version}>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-navy text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  v{entry.version}
                </span>
                <span className="text-slate-400 text-xs">{entry.date}</span>
              </div>
              <ul className="space-y-1.5">
                {entry.changes.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-gold mt-0.5 flex-shrink-0">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [changelogOpen, setChangelogOpen] = useState(false)
  const current = CHANGELOG[0]

  return (
    <>
      <div className="w-60 flex-shrink-0 bg-navy flex flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity w-full text-left"
          >
            <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 size={18} className="text-navy" />
            </div>
            <div>
              <div className="font-playfair text-white font-bold text-base leading-tight">Project Monopoly</div>
              <div className="text-slate-400 text-xs mt-0.5">Investment Toolkit</div>
            </div>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-3 mb-3">Tools</p>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)
            const isDisabled = item.disabled

            return (
              <button
                key={item.path}
                onClick={() => !isDisabled && navigate(item.path)}
                disabled={isDisabled}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left
                  ${isActive
                    ? 'bg-white/10 text-gold border-l-2 border-gold pl-[10px]'
                    : isDisabled
                      ? 'text-slate-600 cursor-not-allowed opacity-60'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent pl-[10px]'
                  }
                `}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isDisabled && (
                  <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                    <Clock size={9} />
                    Soon
                  </span>
                )}
                {isActive && !isDisabled && (
                  <ChevronRight size={13} className="text-gold/60 flex-shrink-0" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => setChangelogOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-xs font-medium transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse flex-shrink-0" />
            Changelog
            <span className="ml-auto text-slate-600">v{current.version}</span>
          </button>
        </div>
      </div>

      {changelogOpen && <ChangelogModal onClose={() => setChangelogOpen(false)} />}
    </>
  )
}
