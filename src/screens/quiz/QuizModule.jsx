import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { QUESTIONS, scoreQuiz } from './questions'
import { ARCHETYPES } from './archetypes'

// ── Helpers ──────────────────────────────────────────────────────────────────

function renderText(text) {
  if (!text) return null
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

// ── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total }) {
  return (
    <div className="w-full bg-slate-200 rounded-full h-1.5">
      <div
        className="bg-gold h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  )
}

// ── Intro Screen ─────────────────────────────────────────────────────────────

function IntroScreen({ onStart }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-6">
      <div className="text-6xl mb-6">🧠</div>
      <h2 className="font-playfair text-3xl font-bold text-navy mb-4">
        What Kind of Investor Are You?
      </h2>
      <p className="text-slate-500 text-lg mb-4 leading-relaxed">
        12 quick questions. We'll match you to one of 5 investor archetypes.
      </p>
      <p className="text-slate-400 text-sm mb-8">
        Based on the investor framework from <em>The Armchair Guide to Property Investing</em>.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
        {['~4 minutes', '12 questions', '5 archetypes'].map(item => (
          <span key={item} className="bg-navy/5 text-navy text-sm font-medium px-4 py-2 rounded-full">
            {item}
          </span>
        ))}
      </div>
      <button
        onClick={onStart}
        className="bg-navy text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-navy-light transition-colors"
      >
        Start the quiz →
      </button>
    </div>
  )
}

// ── Question Screen ───────────────────────────────────────────────────────────

function QuestionScreen({ question, qIndex, total, onAnswer, selectedAnswer }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Question {qIndex + 1} of {total}</span>
          <span>{Math.round((qIndex / total) * 100)}% complete</span>
        </div>
        <ProgressBar current={qIndex} total={total} />
      </div>

      <h3 className="text-xl font-bold text-navy mb-6 leading-snug">
        {renderText(question.question)}
      </h3>

      <div className="space-y-3">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            className={`
              w-full text-left px-5 py-4 rounded-xl border-2 text-sm transition-all duration-150
              ${selectedAnswer === i
                ? 'border-navy bg-navy/5 text-navy font-medium'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }
            `}
          >
            <span className={`
              inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold mr-3 flex-shrink-0
              ${selectedAnswer === i ? 'bg-navy text-white' : 'bg-slate-100 text-slate-500'}
            `}>
              {String.fromCharCode(65 + i)}
            </span>
            {renderText(opt.text)}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Comparison Chart ──────────────────────────────────────────────────────────

const DIMENSIONS = [
  { key: 'timeCommitment', label: 'Time Commitment' },
  { key: 'renovationAppetite', label: 'Renovation Appetite' },
  { key: 'riskTolerance', label: 'Risk Tolerance' },
  { key: 'holdPeriod', label: 'Hold Period' },
]

function ComparisonChart({ userArchetype }) {
  // Build chart data — one row per dimension
  const chartData = DIMENSIONS.map(dim => {
    const row = { dimension: dim.label }
    ARCHETYPES.forEach(a => {
      row[a.id] = a.scores[dim.key]
    })
    return row
  })

  const COLORS = {
    hustler: '#f97316',
    parttimer: '#eab308',
    strategist: '#3b82f6',
    wealthbuilder: '#10b981',
    analyst: '#8b5cf6',
  }

  return (
    <div className="mt-6">
      <div className="card p-5 mb-5">
        <h4 className="text-sm font-semibold text-navy mb-1">How all 5 types compare</h4>
        <p className="text-xs text-slate-400 mb-4">Scored 1–5 across four key dimensions</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="dimension" tick={{ fontSize: 11 }} width={120} />
            <Tooltip
              formatter={(val, name) => {
                const a = ARCHETYPES.find(a => a.id === name)
                return [val + ' / 5', a ? a.name : name]
              }}
            />
            {ARCHETYPES.map(a => (
              <Bar
                key={a.id}
                dataKey={a.id}
                fill={COLORS[a.id]}
                opacity={a.id === userArchetype.id ? 1 : 0.45}
                radius={[0, 3, 3, 0]}
                barSize={8}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-3">
          {ARCHETYPES.map(a => (
            <div key={a.id} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: COLORS[a.id], opacity: a.id === userArchetype.id ? 1 : 0.45 }}
              />
              <span className={`text-xs ${a.id === userArchetype.id ? 'font-semibold text-navy' : 'text-slate-500'}`}>
                {a.name}{a.id === userArchetype.id ? ' (you)' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini archetype cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ARCHETYPES.map(a => (
          <div
            key={a.id}
            className={`card p-4 ${a.id === userArchetype.id ? 'ring-2 ring-gold' : ''}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{a.emoji}</span>
              <div>
                <p className="text-xs font-bold text-navy leading-tight">{a.name}</p>
                <p className="text-xs text-slate-400 leading-tight">{a.tagline}</p>
              </div>
              {a.id === userArchetype.id && (
                <span className="ml-auto text-xs bg-gold/20 text-gold font-semibold px-2 py-0.5 rounded-full">You</span>
              )}
            </div>
            <ul className="space-y-1.5 mt-2">
              {a.soWhat.map((item, i) => (
                <li key={i} className="text-xs text-slate-600 flex gap-1.5">
                  <span className="text-gold flex-shrink-0">→</span>
                  <span><strong>{item.bold}</strong>{item.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Result Screen ─────────────────────────────────────────────────────────────

function ResultScreen({ archetype, scores, onRestart, onGoToCalculator, showingComparison, setShowingComparison }) {
  const navigate = useNavigate()
  const archetypeNames = ARCHETYPES.map(a => a.name)
  const maxScore = Math.max(...scores)

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Result hero */}
      <div className={`bg-gradient-to-r ${archetype.color} rounded-2xl p-8 text-white mb-6 text-center`}>
        <div className="text-5xl mb-3">{archetype.emoji}</div>
        <p className="text-white/60 text-sm uppercase tracking-widest font-semibold mb-1">Your investor type</p>
        <h2 className="font-playfair text-3xl font-bold mb-1">{archetype.name}</h2>
        <p className="text-white/80 text-sm mb-3">{archetype.subtitle}</p>
        <p className="text-white/90 text-base font-medium italic">"{archetype.tagline}"</p>
      </div>

      {/* Score breakdown */}
      <div className="card p-4 mb-5">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Your score breakdown</h4>
        <div className="space-y-2">
          {archetypeNames.map((name, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-28 text-right flex-shrink-0">{name}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${i === ARCHETYPES.indexOf(archetype) ? 'bg-navy' : 'bg-slate-300'}`}
                  style={{ width: `${maxScore > 0 ? (scores[i] / maxScore) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-500 w-6">{scores[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main description card */}
      <div className="card p-5 mb-5 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-navy mb-2">About you</h4>
          <p className="text-slate-600 text-sm leading-relaxed">{archetype.description}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-navy mb-2">Your strategy fit</h4>
          <ul className="space-y-1.5">
            {archetype.strategyFit.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-600">
                <span className="text-gold flex-shrink-0 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-navy mb-1">Ideal property type</h4>
          <p className="text-slate-600 text-sm leading-relaxed">{archetype.idealProperty}</p>
        </div>
      </div>

      {/* So What section */}
      <div className="bg-navy/5 border border-navy/10 rounded-xl p-5 mb-5">
        <h4 className="text-sm font-bold text-navy mb-3">So what does this mean for you?</h4>
        <ul className="space-y-2.5">
          {archetype.soWhat.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-slate-700">
              <span className="text-gold font-bold flex-shrink-0 mt-0.5">→</span>
              <span><strong>{item.bold}</strong>{item.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Watch out */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-amber-700 mb-1">Watch out for</h4>
        <p className="text-amber-700 text-sm leading-relaxed">{archetype.watchOut}</p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={onGoToCalculator}
          className="flex-1 bg-navy text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-navy-light transition-colors text-center"
        >
          Model a property → Cash Flow Calculator
        </button>
        <button
          onClick={onRestart}
          className="flex-1 bg-white text-navy border-2 border-navy px-6 py-3 rounded-xl font-semibold text-sm hover:bg-navy/5 transition-colors text-center"
        >
          Retake the quiz
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 bg-white text-slate-600 border-2 border-slate-200 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors text-center"
        >
          ← Back to home
        </button>
      </div>

      {/* Compare all types toggle */}
      <button
        onClick={() => setShowingComparison(v => !v)}
        className="w-full text-sm font-medium text-navy hover:text-navy-light transition-colors flex items-center justify-center gap-2 py-2 border border-navy/20 rounded-xl hover:bg-navy/5"
      >
        {showingComparison ? '▲ Hide comparison' : 'Compare all 5 investor types →'}
      </button>

      {showingComparison && <ComparisonChart userArchetype={archetype} />}
    </div>
  )
}

// ── Main QuizModule ───────────────────────────────────────────────────────────

export default function QuizModule() {
  const navigate = useNavigate()
  const [stage, setStage] = useState('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [showingComparison, setShowingComparison] = useState(false)

  const handleStart = () => {
    setAnswers([])
    setCurrentQ(0)
    setStage('question')
  }

  const handleAnswer = (optionIdx) => {
    const newAnswers = [...answers]
    newAnswers[currentQ] = optionIdx
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentQ + 1 < QUESTIONS.length) {
        setCurrentQ(q => q + 1)
      } else {
        const { scores, winnerIdx } = scoreQuiz(newAnswers)
        setResult({ archetype: ARCHETYPES[winnerIdx], scores })
        setStage('result')
      }
    }, 200)
  }

  const handleRestart = () => {
    setStage('intro')
    setAnswers([])
    setCurrentQ(0)
    setResult(null)
    setShowingComparison(false)
  }

  return (
    <div>
      {/* Sub-header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-navy transition-colors">Home</button>
            <span>/</span>
            <span className="text-navy font-medium">Investor Quiz</span>
            {stage === 'question' && (
              <>
                <span>/</span>
                <span className="text-slate-500">Question {currentQ + 1} of {QUESTIONS.length}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {stage === 'intro' && <IntroScreen onStart={handleStart} />}

      {stage === 'question' && (
        <QuestionScreen
          question={QUESTIONS[currentQ]}
          qIndex={currentQ}
          total={QUESTIONS.length}
          onAnswer={handleAnswer}
          selectedAnswer={answers[currentQ]}
        />
      )}

      {stage === 'result' && result && (
        <ResultScreen
          archetype={result.archetype}
          scores={result.scores}
          onRestart={handleRestart}
          onGoToCalculator={() => navigate('/calculator')}
          showingComparison={showingComparison}
          setShowingComparison={setShowingComparison}
        />
      )}
    </div>
  )
}
