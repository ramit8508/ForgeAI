import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import Card from '../../ui/Card'
import { config } from '../../../lib/config'
import { formatProbabilityPercent } from '../../../lib/formatters'
import { cn } from '../../../lib/utils'

/**
 * ProbabilityRankingChart
 *
 * Horizontal ranking bar chart ordering machines by predicted failure probability descending.
 * Clicking a machine bar navigates directly to its machine diagnostic page.
 *
 * @param {{
 *   rankedMachines: Array<Object>,
 *   onSelectMachine?: (machineId: string) => void
 * }} props
 */
function ProbabilityRankingChart({ rankedMachines = [], onSelectMachine }) {
  const navigate = useNavigate()
  const [hoveredId, setHoveredId] = useState(null)
  const threshold = config.model.threshold // 0.45

  const handleRowClick = (machineId) => {
    if (onSelectMachine) onSelectMachine(machineId)
    else navigate(`/machines/${machineId}`)
  }

  return (
    <Card className="p-5 overflow-hidden" as="section" aria-labelledby="probability-ranking-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3.5">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
            Asset Risk Hierarchy
          </span>
          <h3 id="probability-ranking-heading" className="mt-0.5 text-base font-semibold text-foreground">
            Machine Failure Probability Ranking
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            All monitored fleet assets ranked by statistical failure probability from highest to lowest.
          </p>
        </div>

        {/* Legend & Threshold note */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-destructive" aria-hidden="true" />
            High Risk (≥ 70%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-warning" aria-hidden="true" />
            Medium Risk (30–70%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-success" aria-hidden="true" />
            Low Risk (&lt; 30%)
          </span>
          <span className="rounded bg-primary/10 px-2 py-0.5 text-primary border border-primary/20">
            Cutoff: {config.model.thresholdPercent}
          </span>
        </div>
      </div>

      {rankedMachines.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground">
          No machines available for risk ranking.
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {rankedMachines.map((m) => {
            const prob = m.failureProbability || 0
            const pct = Math.min(100, Math.max(0, prob * 100))
            const isHovered = hoveredId === m.id

            // Semantic bar color
            const barColor = prob >= 0.7
              ? 'bg-gradient-to-r from-destructive/80 to-destructive'
              : prob >= 0.3
                ? 'bg-gradient-to-r from-warning/80 to-warning'
                : 'bg-gradient-to-r from-success/80 to-success'

            const textColor = prob >= 0.7
              ? 'text-destructive'
              : prob >= 0.3
                ? 'text-warning'
                : 'text-success'

            return (
              <div
                key={m.id}
                role="button"
                tabIndex={0}
                onClick={() => handleRowClick(m.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleRowClick(m.id)
                  }
                }}
                onMouseEnter={() => setHoveredId(m.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  'group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-lg border transition-all cursor-pointer',
                  isHovered
                    ? 'border-primary/50 bg-accent/40 shadow-sm'
                    : 'border-border/50 bg-background/40 hover:bg-background/70',
                )}
                aria-label={`${m.id} ${m.name}: ${formatProbabilityPercent(prob)} failure probability`}
              >
                {/* Left: Rank, ID, Name */}
                <div className="flex items-center gap-3 min-w-[220px]">
                  <span className="font-mono text-xs font-bold text-muted-foreground w-6 text-center">
                    #{m.rank}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {m.id}
                      </span>
                      <ExternalLink size={11} className="text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] text-muted-foreground truncate max-w-[180px]" title={m.name}>
                      {m.name}
                    </span>
                  </div>
                </div>

                {/* Center: Horizontal Probability Bar with 0.45 Cutoff marker */}
                <div className="flex-1 relative mx-2">
                  <div className="h-2.5 w-full rounded-full bg-border/40 overflow-hidden relative">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500 ease-out', barColor)}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                      aria-hidden="true"
                    />
                  </div>

                  {/* 45% Threshold guide marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-primary/40 pointer-events-none"
                    style={{ left: `${threshold * 100}%` }}
                    title={`Threshold cutoff line: ${config.model.thresholdPercent}`}
                  />
                </div>

                {/* Right: Metric & Risk Badge */}
                <div className="flex items-center justify-end gap-3 min-w-[120px]">
                  <span className={cn('font-mono text-xs font-bold tabular-nums', textColor)}>
                    {formatProbabilityPercent(prob)}
                  </span>
                  <span className={cn(
                    'font-mono text-[10px] font-semibold px-2 py-0.5 rounded border uppercase',
                    prob >= 0.7
                      ? 'border-destructive/30 bg-destructive/10 text-destructive'
                      : prob >= 0.3
                        ? 'border-warning/30 bg-warning/10 text-warning'
                        : 'border-success/30 bg-success/10 text-success'
                  )}>
                    {m.riskLevel}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export default ProbabilityRankingChart
