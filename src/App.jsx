import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import QuizModule from './screens/quiz/QuizModule'
import CalculatorModule from './screens/calculator/CalculatorModule'
import VersionBadge from './components/VersionBadge'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F0F2F7] font-inter">
        {/* ── Global header ─────────────────────────────────────── */}
        <header className="bg-navy text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center text-lg shadow-md">
                🏠
              </div>
              <div>
                <h1 className="font-playfair text-xl font-bold leading-none tracking-tight">
                  Project Monopoly
                </h1>
                <p className="text-slate-300 text-xs mt-0.5 tracking-wide">
                  Property Investment Toolkit
                </p>
              </div>
            </a>
            <VersionBadge />
          </div>
        </header>

        {/* ── Routes ────────────────────────────────────────────── */}
        <Routes>
          <Route path="/"            element={<HomeScreen />} />
          <Route path="/quiz"        element={<QuizModule />} />
          <Route path="/calculator"  element={<CalculatorModule />} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>

        {/* ── Footer ────────────────────────────────────────────── */}
        <footer className="text-center text-xs text-slate-400 py-6 mt-4">
          Project Monopoly · For illustrative purposes only · Not financial advice
        </footer>
      </div>
    </BrowserRouter>
  )
}
