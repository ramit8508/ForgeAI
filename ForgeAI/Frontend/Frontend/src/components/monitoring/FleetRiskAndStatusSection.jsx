import { Shield, Activity, Info } from 'lucide-react'
import Card from '../ui/Card'

const riskTones = {
  low: { label: 'Low Risk', color: 'bg-success', text: 'text-success', stroke: '#58c68d' },
  medium: { label: 'Medium Risk', color: 'bg-warning', text: 'text-warning', stroke: '#e4ad55' },
  high: { label: 'High Risk', color: 'bg-destructive', text: 'text-destructive', stroke: '#ef7777' },
}



/**
 * SVG Donut Chart for risk distribution
 */
function RiskDonutChart({ distribution, total }) {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeWidth = 10
  const safeTotal = total || 1

  let cumulativeOffset = 0

  return (
    <div className="relative mx-auto grid size-36 place-items-center" role="img" aria-label={`Risk distribution chart: ${distribution.low} low risk, ${distribution.medium} medium risk, ${distribution.high} high risk`}>
      <svg viewBox="0 0 130 130" className="size-full -rotate-90">
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/40"
        />
        {['low', 'medium', 'high'].map((key) => {
          const value = distribution[key] || 0
          const pct = value / safeTotal
          const dashLength = pct * circumference
          const offset = cumulativeOffset
          cumulativeOffset += dashLength

          if (pct === 0) return null

          return (
            <circle
              key={key}
              cx="65"
              cy="65"
              r={radius}
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
        <span className="font-mono text-2xl font-bold tracking-tight text-foreground">{total}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Machines</span>
      </div>
    </div>
  )
}

/**
 * FleetRiskAndStatusSection
 *
 * Side-by-side observability breakdown:
 * 1. AI Failure Risk (Predictive model output)
 * 2. Physical Operational Status (Machine condition)
 */
function FleetRiskAndStatusSection({
  riskDistribution,
  statusDistribution,
  totalMachines,
  onFilterRisk,
  onFilterStatus,
}) {
  const safeTotal = totalMachines || 1

  const opCount = statusDistribution?.operational || 0
  const warnCount = statusDistribution?.warning || 0
  const critCount = statusDistribution?.critical || 0
  const offCount = statusDistribution?.offline || 0

  const opPct = Math.round((opCount / safeTotal) * 100)
  const warnPct = Math.round((warnCount / safeTotal) * 100)
  const critPct = Math.round((critCount / safeTotal) * 100)
  const offPct = Math.round((offCount / safeTotal) * 100)

  return (
    <div className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-2">
        {/* Left: AI Failure Risk Distribution */}
        <Card className="p-5" as="section" aria-labelledby="monitoring-risk-distribution-title">
          <div className="flex items-start justify-between border-b border-border pb-3.5">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
                Predictive Model
              </span>
              <h2 className="mt-1 text-base font-semibold text-foreground" id="monitoring-risk-distribution-title">
                Failure Risk Distribution
              </h2>
            </div>
            <Shield className="text-muted-foreground" size={18} strokeWidth={1.8} aria-hidden="true" />
          </div>

          <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
            Machine breakdown risk classified by Random Forest inference (0.45 cutoff threshold). Click a category to filter the fleet registry.
          </p>

          <div className="py-4">
            <RiskDonutChart distribution={riskDistribution} total={totalMachines} />
          </div>

          <div className="grid gap-2 border-t border-border pt-3.5" role="list" aria-label="Risk category distribution list">
            {Object.entries(riskTones).map(([key, tone]) => {
              const count = riskDistribution?.[key] || 0
              const pct = Math.round((count / safeTotal) * 100)
              const riskCode = key === 'high' ? 'HIGH' : key === 'medium' ? 'MEDIUM' : 'LOW'

              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => onFilterRisk && onFilterRisk(riskCode)}
                  className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-muted/50 transition-colors cursor-pointer text-left w-full group"
                  aria-label={`Filter by ${tone.label}: ${count} machines (${pct}%)`}
                >
                  <span className="flex items-center gap-2 text-foreground font-medium group-hover:text-primary transition-colors">
                    <span className={`size-2.5 rounded-sm ${tone.color}`} aria-hidden="true" />
                    {tone.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-semibold ${tone.text}`}>{count}</span>
                    <span className="w-10 text-right font-mono text-muted-foreground">{pct}%</span>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Right: Physical Operational Status */}
        <Card className="p-5 flex flex-col justify-between" as="section" aria-labelledby="monitoring-status-distribution-title">
          <div>
            <div className="flex items-start justify-between border-b border-border pb-3.5">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  Plant Telemetry
                </span>
                <h2 className="mt-1 text-base font-semibold text-foreground" id="monitoring-status-distribution-title">
                  Physical Operational Status
                </h2>
              </div>
              <Activity className="text-muted-foreground" size={18} strokeWidth={1.8} aria-hidden="true" />
            </div>

            <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
              Current mechanical running states observed from machine controllers. Click a status box to filter the registry.
            </p>

            {/* Segmented Progress Bar */}
            <div className="mt-5">
              <div className="flex justify-between items-center text-xs font-mono mb-2 text-muted-foreground">
                <span>Fleet Operational Health</span>
                <span className="text-foreground font-semibold">{opPct}% Healthy</span>
              </div>
              <div className="h-3 w-full rounded-full bg-border/40 overflow-hidden flex" role="progressbar" aria-valuenow={opPct} aria-valuemin={0} aria-valuemax={100} aria-label="Operational status distribution">
                {opPct > 0 && <div style={{ width: `${opPct}%` }} className="h-full bg-success transition-all duration-500" title={`Operational: ${opPct}%`} />}
                {warnPct > 0 && <div style={{ width: `${warnPct}%` }} className="h-full bg-warning transition-all duration-500" title={`Warning: ${warnPct}%`} />}
                {critPct > 0 && <div style={{ width: `${critPct}%` }} className="h-full bg-destructive transition-all duration-500" title={`Critical: ${critPct}%`} />}
                {offPct > 0 && <div style={{ width: `${offPct}%` }} className="h-full bg-muted-foreground transition-all duration-500" title={`Offline: ${offPct}%`} />}
              </div>
            </div>

            {/* Interactive Status breakdown grid */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => onFilterStatus && onFilterStatus('OPERATIONAL')}
                className="rounded-lg border border-success/30 bg-success/5 p-3 text-center hover:bg-success/15 transition-colors cursor-pointer"
                aria-label="Filter by operational machines"
              >
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-success">Operational</span>
                <div className="mt-1 font-mono text-xl font-bold text-foreground">{opCount}</div>
                <span className="font-mono text-[11px] text-muted-foreground">{opPct}%</span>
              </button>

              <button
                type="button"
                onClick={() => onFilterStatus && onFilterStatus('WARNING_CRITICAL')}
                className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-center hover:bg-warning/15 transition-colors cursor-pointer"
                aria-label="Filter by warning machines"
              >
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-warning">Warning</span>
                <div className="mt-1 font-mono text-xl font-bold text-foreground">{warnCount}</div>
                <span className="font-mono text-[11px] text-muted-foreground">{warnPct}%</span>
              </button>

              <button
                type="button"
                onClick={() => onFilterStatus && onFilterStatus('WARNING_CRITICAL')}
                className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-center hover:bg-destructive/15 transition-colors cursor-pointer"
                aria-label="Filter by critical machines"
              >
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-destructive">Critical</span>
                <div className="mt-1 font-mono text-xl font-bold text-foreground">{critCount}</div>
                <span className="font-mono text-[11px] text-muted-foreground">{critPct}%</span>
              </button>

              <button
                type="button"
                onClick={() => onFilterStatus && onFilterStatus('OFFLINE')}
                className="rounded-lg border border-border/80 bg-background/50 p-3 text-center hover:bg-muted transition-colors cursor-pointer"
                aria-label="Filter by offline machines"
              >
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Offline</span>
                <div className="mt-1 font-mono text-xl font-bold text-foreground">{offCount}</div>
                <span className="font-mono text-[11px] text-muted-foreground">{offPct}%</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>Critical &amp; Warning Total</span>
            <span className="font-semibold text-destructive">{warnCount + critCount} machine{(warnCount + critCount) !== 1 ? 's' : ''}</span>
          </div>
        </Card>
      </div>

      {/* Critical Data Distinction Note */}
      <div className="flex items-start gap-2.5 rounded-lg border border-border/70 bg-card/50 p-3 text-xs text-muted-foreground">
        <Info size={15} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong className="text-foreground">Operational Distinction:</strong> Physical Operational Status reflects the mechanical/running condition reported by machine sensors. AI Failure Risk reflects the machine-learning model’s probabilistic assessment of failure likelihood. A machine may be physically Operational while having elevated Failure Risk due to cumulative sensor strain.
        </p>
      </div>
    </div>
  )
}

export default FleetRiskAndStatusSection
