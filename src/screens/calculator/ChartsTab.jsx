import React, { useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { fmtCurrency, fmtPct, fmtWeekly, fmtMultiple, buildChartData, calculateIRRSensitivity } from '../../utils/calculations'
import { ExitSelector } from './InputsTab'

const C = {
  navy:   '#1B2B4A',
  gold:   '#C9A84C',
  green:  '#059669',
  red:    '#DC2626',
  blue:   '#3B82F6',
  slate:  '#94A3B8',
  teal:   '#0D9488',
}

function yFmt(v) {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (Math.abs(v) >= 1_000)     return `$${(v / 1_000).toFixed(0)}k`
  return `$${v}`
}

function CustomTooltip({ active, payload, label, valueFormatter }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-4 py-3 text-sm min-w-[170px]">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ background: p.color }} />
            <span className="text-slate-600 text-xs">{p.name}</span>
          </span>
          <span className="font-semibold text-xs" style={{ color: p.color }}>
            {valueFormatter ? valueFormatter(p.value) : fmtCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

function ChartCard({ title, subtitle, children, note }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="font-semibold text-navy text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5">
        {children}
        {note && <p className="text-xs text-slate-400 mt-2 text-center">{note}</p>}
      </div>
    </div>
  )
}

function MetricCard({ label, value, sub, color = 'text-navy', badge }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      {badge && (
        <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>
          {badge.text}
        </span>
      )}
    </div>
  )
}

export default function ChartsTab({ inputs, results, allResults, selectedExit, setSelectedExit }) {
  const { totalInitialOutlay, irr, equityMultiple, netProceeds, weeklyY1After, exitYear, salePrice } = results

  const chartData = useMemo(() => buildChartData(results), [results])
  const sensitivityData = useMemo(() => calculateIRRSensitivity(inputs), [inputs])

  const exitLabel = `Y${exitYear}`
  const yearlyData = chartData.filter(d => d.yearNum > 0)

  return (
    <div className="space-y-5">

      {/* Exit selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-navy">Exit Scenarios</h3>
        </div>
        <ExitSelector selectedExit={selectedExit} setSelectedExit={setSelectedExit} allResults={allResults} />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard label="Initial Outlay" value={fmtCurrency(totalInitialOutlay)} sub="Deposit + purchase costs" color="text-slate-700" />
        <MetricCard label={`Sale Price (Y${exitYear})`} value={fmtCurrency(salePrice)} sub={`${fmtPct(inputs.capitalGrowth)} p.a.`} color="text-navy" />
        <MetricCard label="Net Proceeds" value={fmtCurrency(netProceeds)} sub="After loan, costs & CGT" color={netProceeds >= 0 ? 'text-emerald-600' : 'text-red-600'} />
        <MetricCard
          label="IRR" value={fmtPct(irr, 1)} sub={`${exitYear}-year hold`}
          color={irr > 10 ? 'text-emerald-600' : irr > 5 ? 'text-amber-600' : 'text-red-500'}
          badge={irr > 12 ? { text: 'Strong', cls: 'bg-emerald-100 text-emerald-700' } : irr > 8 ? { text: 'Good', cls: 'bg-amber-100 text-amber-700' } : { text: 'Moderate', cls: 'bg-slate-100 text-slate-600' }}
        />
        <MetricCard label="Return Multiple" value={fmtMultiple(equityMultiple)} sub="Net proceeds / invested" color={equityMultiple >= 2 ? 'text-emerald-600' : 'text-navy'} />
        <MetricCard label="Weekly Cost Y1" value={fmtWeekly(weeklyY1After)} sub="After neg. gearing" color={weeklyY1After >= 0 ? 'text-emerald-600' : 'text-amber-600'} />
      </div>

      {/* Charts 2×3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* 1. Wealth Build-Up */}
        <ChartCard title="Wealth Build-Up" subtitle="Property value, equity and loan balance — Y1 to exit">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={yearlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="gProp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.navy} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={C.navy} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gEq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.gold} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.gold} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tickFormatter={yFmt} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine x={exitLabel} stroke={C.gold} strokeDasharray="4 4" strokeWidth={2} label={{ value: 'Exit', position: 'top', fontSize: 10, fill: C.gold }} />
              <Area type="monotone" dataKey="propertyValue" name="Property Value" stroke={C.navy} fill="url(#gProp)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="equity"        name="Equity"         stroke={C.gold} fill="url(#gEq)"   strokeWidth={2} dot={false} />
              <Line  type="monotone" dataKey="loanBalance"  name="Loan Balance"   stroke={C.red}  strokeWidth={2} dot={false} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Annual CF Before vs After Neg. Gearing */}
        <ChartCard
          title="Annual Cash Flow — Neg. Gearing Impact"
          subtitle="Before and after tax benefit · Y1 to exit year"
          note="Gap between bars = tax saving from negative gearing"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={yearlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tickFormatter={yFmt} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke={C.navy} strokeWidth={1.5} />
              <ReferenceLine x={exitLabel} stroke={C.gold} strokeDasharray="4 4" strokeWidth={2} />
              <Bar dataKey="netCFBefore"   name="Before neg. gearing" fill={C.slate} radius={[3, 3, 0, 0]} />
              <Bar dataKey="netCFAfterTax" name="After neg. gearing"  fill={C.navy}  radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Weekly Cash Position */}
        <ChartCard title="Weekly Cash Position" subtitle="Holding cost per week — before and after negative gearing">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={yearlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${Math.abs(v)}`} />
              <Tooltip content={<CustomTooltip valueFormatter={v => `${v >= 0 ? '+' : ''}$${Math.abs(v).toFixed(0)}/wk`} />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke={C.navy} strokeWidth={1.5} label={{ value: 'Break-even', position: 'right', fontSize: 10, fill: '#94a3b8' }} />
              <ReferenceLine x={exitLabel} stroke={C.gold} strokeDasharray="4 4" strokeWidth={2} />
              <Line type="monotone" dataKey="weeklyBefore" name="Before neg. gearing" stroke={C.slate} strokeWidth={2} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="weeklyAfter"  name="After neg. gearing"  stroke={C.navy}  strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Cumulative Cash Position */}
        <ChartCard
          title="Cumulative Cash Position"
          subtitle="Starts at −initial outlay · Jumps at exit with sale proceeds"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="gCum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.teal} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.teal} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tickFormatter={yFmt} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke={C.navy} strokeWidth={1.5} label={{ value: 'Break-even', position: 'right', fontSize: 10, fill: '#94a3b8' }} />
              <ReferenceLine x={exitLabel} stroke={C.gold} strokeDasharray="4 4" strokeWidth={2} label={{ value: 'Exit + proceeds', position: 'top', fontSize: 10, fill: C.gold }} />
              <Area type="monotone" dataKey="cumulativeCF" name="Cumulative CF" stroke={C.teal} fill="url(#gCum)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Equity vs Cash Invested — leverage story */}
        <ChartCard
          title="Equity vs Cash Invested — The Leverage Story"
          subtitle="Small ongoing outlay builds a large equity position via leverage"
          note="Gap between lines = leverage at work"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={yearlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="gEqLev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.navy} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.navy} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tickFormatter={yFmt} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine x={exitLabel} stroke={C.gold} strokeDasharray="4 4" strokeWidth={2} label={{ value: 'Exit', position: 'top', fontSize: 10, fill: C.gold }} />
              <Area type="monotone" dataKey="equity"           name="Equity (property − loan)"  stroke={C.navy} fill="url(#gEqLev)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="cumulativeCashIn" name="Total Cash Invested"        stroke={C.gold} strokeWidth={2} dot={false} strokeDasharray="5 2" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 6. IRR Sensitivity */}
        <ChartCard
          title="IRR Sensitivity — Capital Growth Scenarios"
          subtitle="How your return changes across growth rates and exit years"
          note={`Base: ${inputs.capitalGrowth}% p.a. · Downside: ${inputs.capitalGrowth - 2}% · Upside: ${inputs.capitalGrowth + 2}%`}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sensitivityData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="growthLabel" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip valueFormatter={v => `${v.toFixed(1)}% IRR`} />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke={C.navy} strokeWidth={1} />
              <Bar dataKey="y5"  name="Exit Y5"  fill={C.slate} radius={[3, 3, 0, 0]} />
              <Bar dataKey="y10" name="Exit Y10" fill={C.navy}  radius={[3, 3, 0, 0]} />
              <Bar dataKey="y15" name="Exit Y15" fill={C.gold}  radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Assumptions footnote */}
      <div className="card p-4 text-xs text-slate-400 space-y-1">
        <p className="font-medium text-slate-500">Assumptions</p>
        <p>Capital growth {fmtPct(inputs.capitalGrowth)} · Rental growth {fmtPct(inputs.rentalGrowth)} · Expense growth {fmtPct(inputs.expenseGrowth)} · Occupancy {fmtPct(inputs.occupancyRate)}</p>
        <p>Rate {inputs.rates[inputs.lvr][inputs.rateScenario]}% ({inputs.rateScenario}) · IO {inputs.ioYears} yrs · 30-yr loan · {inputs.lvr}% LVR · Neg. gearing {inputs.negativeGearing ? 'ON' : 'OFF'}</p>
        <p>CGT: 50% discount, {inputs.taxBracket}% marginal rate · Land tax: personal name threshold $600k (QLD)</p>
        <p className="italic">For illustrative purposes only. Not financial advice.</p>
      </div>
    </div>
  )
}
