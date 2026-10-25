import { Shield } from 'lucide-react'
import Card from '../ui/Card'

const riskTones = {
  low:    { label: 'Low Risk',    color: 'bg-success',     text: 'text-success',     stroke: '#58c68d' },
  medium: { label: 'Medium Risk', color: 'bg-warning',     text: 'text-warning',     stroke: '#e4ad55' },
  high:   { label: 'High Risk',   color: 'bg-destructive', text: 'text-destructive', stroke: '#ef7777' },
}

/**
 * SVG donut ring chart — lightweight, no dependencies.
 */
function DonutChart({ distribution }) {
  const total = distribution.low + distribution.medium + distribution.high || 1
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const strokeWidth = 10

  let cumulativeOffset = 0

  return (
    <div className="relative mx-auto grid size-40 place-items-center">
      <svg viewBox="0 0 130 130" className="size-full -rotate-90">
        <circle
          cx="65" cy="65" r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/60"
        />
        {['low', 'medium', 'high'].map((key) => {
          const value = distribution[key] || 0
          const pct = value / total
          const dashLength = pct * circumference
          const offset = cumulativeOffset
          cumulativeOffset += dashLength

          if (pct === 0) return null

          return (
            <circle
              key={key}
              cx="65" cy="65" r={radius}
              fill="none"
              stroke={riskTones[key].stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          )
        })}
      </svg>
      <div className="absolute flex flex-col items-center gap-0.5">
        <span className="text-3xl font-semibold tracking-tight text-foreground">{total}</span>
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">Machines</span>
      </div>
    </div>
  )
}

/**
 * @param {{ distribution: { low: number, medium: number, high: number } }} props
 */
function RiskOverview({ distribution = { low: 0, medium: 0, high: 0 } }) {
  const total = distribution.low + distribution.medium + distribution.high || 1

  return (
    <Card className="p-5" as="section" aria-labelledby="risk-overview-title">
      <div className="flex items-start justify-between border-b border-border pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Fleet analysis
          </span>
          <h2 className="mt-1 text-base font-semibold" id="risk-overview-title">
            Failure Risk Overview
          </h2>
        </div>
        <Shield className="text-muted-foreground" size={18} strokeWidth={1.7} aria-hidden="true" />
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Current risk distribution across monitored machines.
      </p>

      <div className="py-5">
        <DonutChart distribution={distribution} />
      </div>

      <div className="grid gap-2.5 border-t border-border pt-4">
        {Object.entries(riskTones).map(([key, tone]) => {
          const count = distribution[key] || 0
          const pct = ((count / total) * 100).toFixed(0)
          return (
            <div className="flex items-center justify-between text-sm" key={key}>
              <span className="flex items-center gap-2.5 text-secondary-foreground">
                <span className={`size-2.5 rounded-sm ${tone.color}`} aria-hidden="true" />
                {tone.label}
              </span>
              <span className="flex items-center gap-3">
                <span className={`font-mono text-sm font-semibold ${tone.text}`}>{count}</span>
                <span className="w-10 text-right font-mono text-xs text-muted-foreground">{pct}%</span>
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default RiskOverview
