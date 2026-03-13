import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QUESTIONS, scoreQuiz } from './questions'
import { ARCHETYPES } from './archetypes'

// ── Quiz states ─────────────────────────────────────────────────────────────
// 'intro' → 'question' → 'result'

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

function IntroScreen({ onStart }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-6">
      <div className="text-6xl mb-6">🧠</div>
      <h2 className="font-playfair text-3xl font-bold text-navy mb-4">
        What Kind of Investor Are You?
      </h2>
      <p className="text-slate-500 text-lg mb-4 leading-relaxed">
        12 quick questions. We'll profile your risk appetite, time commitment, and goals — then match you to one of 5 investor archetypes.
      </p>
      <p className="text-slate-400 text-sm mb-8">
        Based on the investor framework from <em>The Armchair Guide to Property Investing</em> by Helen Kingsley & Stuart Wemyss.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
        {['~4 minutes', '12 questions', '5 archetypes'].map(item => (
          <span key={item} className="bg-navy/5 text-navy text-sm font-medium px-4 py-2 rounded-full">
            {item}
          </span>
        ))}
      </div>
      <button
        onClick={onStart}
        className="bg-navy text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-navy-light transition-colors shadow-lg"
      >
        Start the quiz →
      </button>
    </div>
  )
}

function QuestionScreen({ question, qIndex, total, onAnswer, selectedAnswer }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Question {qIndex + 1} of {total}</span>
          <span>{Math.round(((qIndex) / total) * 100)}% complete</span>
        </div>
        <ProgressBar current={qIndex} total={total} />
      </div>

      {/* Question */}
      <h3 className="text-xl font-bold text-navy mb-6 leading-snug">
        {question.question}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(i)}
            className={`
              w-full text-left px-5 py-4 rounded-xl border-2 text-sm transition-all duration-150
              ${selectedAnswer === i
                ? 'border-navy bg-navy/5 text-navy font-medium shadow-sm'
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
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  )
}

function ResultScreen({ archetype, scores, onRestart, onGoToCalculator, onExploreAll, showingAll, setShowingAll }) {
  const navigate = useNavigate()
  const archetypeNames = ['The Hustler', 'The Part-Timer', 'The Strategist', 'The Wealth Builder', 'The Analyst']
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

      {/* Score bar */}
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

      {/* Description */}
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
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-amber-700 mb-1">⚠️ Watch out for</h4>
          <p className="text-amber-700 text-sm leading-relaxed">{archetype.watchOut}</p>
        </div>
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

      {/* Explore all archetypes */}
      <button
        onClick={() => setShowingAll(v => !v)}
        className="w-full text-sm font-medium text-navy hover:text-navy-light transition-colors flex items-center justify-center gap-2 py-2"
      >
        {showingAll ? '▲ Hide' : '▼ Explore'} all 5 investor types
      </button>

      {showingAll && (
        <div className="mt-4 space-y-3">
          {ARCHETYPES.map(a => (
            <div key={a.id} className={`card overflow-hidden ${a.id === archetype.id ? 'ring-2 ring-gold' : ''}`}>
              <div className={`bg-gradient-to-r ${a.color} px-5 py-3 flex items-center gap-3`}>
                <span className="text-2xl">{a.emoji}</span>
                <div>
                  <h4 className="text-white font-bold text-sm">{a.name}</h4>
                  <p className="text-white/70 text-xs">{a.tagline}</p>
                </div>
                {a.id === archetype.id && (
                  <span className="ml-auto text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">You</span>
                )}
              </div>
              <div className="px-5 py-3 text-sm text-slate-600 leading-relaxed">
                {a.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main QuizModule ──────────────────────────────────────────────────────────

export default function QuizModule() {
  const navigate = useNavigate()
  const [stage, setStage] = useState('intro')      // 'intro' | 'question' | 'result'
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])        // selected option index per question
  const [result, setResult] = useState(null)        // { archetype, scores }
  const [showingAll, setShowingAll] = useState(false)

  const handleStart = () => {
    setAnswers([])
    setCurrentQ(0)
    setStage('question')
  }

  const handleAnswer = (optionIdx) => {
    const newAnswers = [...answers]
    newAnswers[currentQ] = optionIdx
    setAnswers(newAnswers)

    // Auto-advance after brief delay
    setTimeout(() => {
      if (currentQ + 1 < QUESTIONS.length) {
        setCurrentQ(q => q + 1)
      } else {
        // Score and show result
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
    setShowingAll(false)
  }

  return (
    <div>
      {/* Sub-header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
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
          onExploreAll={() => setShowingAll(true)}
          showingAll={showingAll}
          setShowingAll={setShowingAll}
        />
      )}
    </div>
  )
}
