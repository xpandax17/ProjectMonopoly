import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import HomeScreen from './screens/HomeScreen'
import QuizModule from './screens/quiz/QuizModule'
import CalculatorModule from './screens/calculator/CalculatorModule'
import BorrowingModule from './screens/borrowing/BorrowingModule'
import StampDutyModule from './screens/stampduty/StampDutyModule'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-50 font-inter overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/"           element={<HomeScreen />} />
            <Route path="/quiz"       element={<QuizModule />} />
            <Route path="/calculator" element={<CalculatorModule />} />
            <Route path="/borrowing"  element={<BorrowingModule />} />
            <Route path="/stamp-duty" element={<StampDutyModule />} />
            <Route path="*"           element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
