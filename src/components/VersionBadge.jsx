import React, { useState } from 'react'
import { CHANGELOG } from '../constants/changelog'

export default function VersionBadge() {
  const [open, setOpen] = useState(false)
  const current = CHANGELOG[0]

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
        v{current.version}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
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
              <button
                onClick={() => setOpen(false)}
                className="text-slate-300 hover:text-white text-xl leading-none"
              >
                ×
              </button>
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
      )}
    </>
  )
}
