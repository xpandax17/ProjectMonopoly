import React from 'react'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'
import { fmtCurrency, fmtPct, fmtWeekly, fmtMultiple } from '../utils/calculations'

// ── Chart colours ────────────────────────────────────────────────────────────
const C = {
  navy:   '#1B2B4A',
  gold:   '#C9A84C',
  green:  '#059669',
  red:    '#DC2626',
  blue:   '#3B82F6',
  purple: '#7C3AED',
  slate:  '#94A3B8',
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-4 py-3 text-sm min-w-[160px]">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: p.color }} />
            <span className="text-slate-600">{p.name}</span>
          </span>
          <span className="font-medium" style={{ color: p.color }}>
            {formatter ? formatter(p.value, p.dataKey) : fmtCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

function yAxisFormatter(v) {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (Math.abs(v) >= 1_000)    return `$${(v / 1_000).toFixed(0)}k`
  return `$${v}`
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="font-semibold text-navy text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

// ── Metric cards ─────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, color = 'text-navy', badge }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
      {sub  && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      {badge && (
        <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>
          {badge.text}
        </span>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ChartsTab({ inputs, results }) {
  const { yearlyData, totalInitialOutlay, irr, equityMultiple, netProceeds, weeklyY1After, exitYear, salePrice } = results

  // Chart data
  const chartData = yearlyData.map(y => ({
    year: `Y${y.year}`,
    yearNum: y.year,
    propertyValue: Math.round(y.propValueEnd),
    loanBalance:   Math.round(y.loanClosing),
    equity:        Math.round(y.equity),
    netCFAfterTax: Math.round(y.netCFAfterTax),
    weeklyBefore:  parseFloat(y.weeklyNetBefore.toFixed(0)),
    weeklyAfter:   parseFloat(y.weeklyNetAfter.toFixed(0)),
    cumulativeCF:  0, // filled below
  }))

  // Cumulative cash flow (excluding initial outlay)
  let cumCF = -totalInitialOutlay
  chartData.forEach((d, i) => {
    cumCF += yearlyData[i].netCFAfterTax
    d.cumulativeCF = Math.round(cumCF)
  })

  const exitData = chartData[exitYear - 1]
  const y1Weekly = weeklyY1After
  const weeklyLabel = y1Weekly >= 0
    ? `+${fmtCurrency(Math.abs(y1Weekly * 52), 0)}/yr income`
    : `${fmtCurrency(Math.abs(y1Weekly * 52), 0)}/yr cost`

  return (
    <div className="space-y-6">

      {/* ── Key metrics row ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Initial Outlay"
          value={fmtCurrency(totalInitialOutlay)}
          sub="Deposit + purchase costs"
          color="text-slate-700"
        />
        <MetricCard
          label={`Sale Price (Y${exitYear})`}
          value={fmtCurrency(salePrice)}
          sub={`${fmtPct(inputs.capitalGrowth)} p.a. growth`}
          color="text-navy"
        />
        <MetricCard
          label="Net Proceeds"
          value={fmtCurrency(netProceeds)}
          sub="After loan, costs & CGT"
          color={netProceeds >= 0 ? 'text-emerald-600' : 'text-red-600'}
        />
        <MetricCard
          label="IRR"
          value={fmtPct(irr, 1)}
          sub={`${exitYear}-year hold`}
          color={irr > 10 ? 'text-emerald-600' : irr > 5 ? 'text-amber-600' : 'text-red-500'}
          badge={
            irr > 12 ? { text: 'Strong', cls: 'bg-emerald-100 text-emerald-700' } :
            irr > 8  ? { text: 'Good',   cls: 'bg-amber-100 text-amber-700' } :
                       { text: 'Moderate', cls: 'bg-slate-100 text-slate-600' }
          }
        />
        <MetricCard
          label="Return Multiple"
          value={fmtMultiple(equityMultiple)}
          sub="Net proceeds / invested"
          color={equityMultiple >= 2 ? 'text-emerald-600' : 'text-navy'}
        />
        <MetricCard
          label="Weekly Cost (Y1)"
          value={fmtWeekly(weeklyY1After)}
          sub={`After neg. gearing · ${weeklyLabel}`}
          color={weeklyY1After >= 0 ? 'text-emerald-600' : 'text-amber-600'}
        />
      </div>

      {/* ── Charts 2×2 grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Property Value vs Loan vs Equity */}
        <ChartCard
          title="Wealth Build-Up Over Time"
          subtitle="Property value, loan balance and equity (end of each year)"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="gradProp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.navy}  stopOpacity={0.15} />
                  <stop offset="95%" stopColor={C.navy}  stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradEquity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.gold}  stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.gold}  stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine x={`Y${exitYear}`} stroke={C.gold} strokeDasharray="4 4" strokeWidth={2} label={{ value: 'Exit', position: 'top', fontSize: 11, fill: C.gold }} />
              <Area type="monotone" dataKey="propertyValue" name="Property Value" stroke={C.navy} fill="url(#gradProp)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="equity"        name="Equity"         stroke={C.gold} fill="url(#gradEquity)" strokeWidth={2} dot={false} />
              <Line  type="monotone" dataKey="loanBalance"  name="Loan Balance"   stroke={C.red}  strokeWidth={2} dot={false} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Annual Net Cash Flow (bar chart) */}
        <ChartCard
          title="Annual Net Cash Flow"
          subtitle="After tax & negative gearing benefit — positive means cash in pocket"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                content={<CustomTooltip formatter={(v) => fmtCurrency(v)} />}
              />
              <ReferenceLine y={0} stroke="#1B2B4A" strokeWidth={1.5} />
              <ReferenceLine x={`Y${exitYear}`} stroke={C.gold} strokeDasharray="4 4" strokeWidth={2} />
              <Bar dataKey="netCFAfterTax" name="Net CF After Tax" radius={[3, 3, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.yearNum === exitYear ? C.gold : entry.netCFAfterTax >= 0 ? C.green : '#FB923C'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Orange bars = cash out of pocket · Green = cash positive · Gold = exit year
          </p>
        </ChartCard>

        {/* 3. Weekly cash position */}
        <ChartCard
          title="Weekly Cash Position"
          subtitle="Holding cost per week — before and after negative gearing tax benefit"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis
                tickFormatter={v => `$${Math.abs(v)}`}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
              />
              <Tooltip
                content={<CustomTooltip formatter={(v) => `${v >= 0 ? '+' : ''}$${Math.abs(v).toFixed(0)}/wk`} />}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine y={0} stroke="#1B2B4A" strokeWidth={1.5} label={{ value: 'Break-even', position: 'right', fontSize: 10, fill: '#94a3b8' }} />
              <ReferenceLine x={`Y${exitYear}`} stroke={C.gold} strokeDasharray="4 4" strokeWidth={2} />
              <Line type="monotone" dataKey="weeklyBefore" name="Before neg. gearing" stroke={C.slate} strokeWidth={2} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="weeklyAfter"  name="After neg. gearing"  stroke={C.navy}  strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Cumulative cash position */}
        <ChartCard
          title="Cumulative Cash Position"
          subtitle="Running total from initial outlay — crosses zero = break-even"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="gradCumPos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.green} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.green} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradCumNeg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.red}   stopOpacity={0.02} />
                  <stop offset="95%" stopColor={C.red}   stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip formatter={(v) => fmtCurrency(v)} />} />
              <ReferenceLine y={0} stroke="#1B2B4A" strokeWidth={1.5} label={{ value: 'Break-even', position: 'right', fontSize: 10, fill: '#94a3b8' }} />
              <ReferenceLine x={`Y${exitYear}`} stroke={C.gold} strokeDasharray="4 4" strokeWidth={2} label={{ value: 'Exit', position: 'top', fontSize: 11, fill: C.gold }} />
              <Area
                type="monotone"
                dataKey="cumulativeCF"
                name="Cumulative CF"
                stroke={C.blue}
                fill="url(#gradCumPos)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-400 mt-2 text-center">
            Includes initial outlay. Excludes sale proceeds — add {fmtCurrency(netProceeds)} at exit.
          </p>
        </ChartCard>

      </div>

      {/* ── Assumptions footnote ──────────────────────────────────── */}
      <div className="card p-4 text-xs text-slate-400 space-y-1">
        <p className="font-medium text-slate-500">Assumptions & methodology</p>
        <p>• Capital growth: {inputs.capitalGrowth}% p.a. compounding · Rent growth: {inputs.rentalGrowth}% p.a. · Expense growth: {inputs.expenseGrowth}% p.a.</p>
        <p>• Interest rate: {inputs.rates[inputs.lvr][inputs.rateScenario]}% ({inputs.rateScenario} case) · Interest-only for {inputs.ioYears} years · 30-year loan term · {inputs.lvr}% LVR</p>
        <p>• Depreciation: formula-driven at {fmtCurrency(results.annualDepreciation)}/yr ({inputs.dwellingDuration - inputs.dwellingAge} yrs useful life remaining)</p>
        <p>• CGT: 50% discount on capital gain, taxed at {inputs.taxBracket}% marginal rate · Negative gearing: {inputs.negativeGearing ? 'on' : 'off'} · Structure: {inputs.trustStructure ? 'trust' : 'personal name'}</p>
        <p>• Land tax: {inputs.trustStructure ? 'Trust threshold $350k at $1,450 + 1.7%' : 'Personal threshold $600k at $500 + 1.0%'} (QLD rates)</p>
        <p className="italic">For illustrative purposes only. Not financial advice. Projections are estimates and may vary significantly from actual outcomes.</p>
      </div>

    </div>
  )
}
