import { ChevronRight, Clock } from 'lucide-react'
import Card from '../../ui/Card'
import PredictionResultBadge from './PredictionResultBadge'
import RiskBadge from '../../ui/RiskBadge'
import ProbabilityIndicator from '../../ui/ProbabilityIndicator'

function formatDateTime(iso) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '—'
    return `${d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })} · ${d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`
  } catch {
    return '—'
  }
}

/**
 * Mobile Prediction History Card
 *
 * Dedicated touch-friendly card representation for mobile viewports,
 * avoiding squished desktop tables and preventing horizontal overflow.
 *
 * @param {{
 *   prediction: {
 *     id: string,
 *     machine: { id: string, name: string },
 *     createdAt: string,
 *     result: { machineFailure: 0|1, failureProbability: number, riskLevel: 'LOW'|'MEDIUM'|'HIGH' },
 *     model: { name: string, threshold: number }
 *   },
 *   onSelect: (predictionId: string) => void
 * }} props
 */
function PredictionHistoryCard({ prediction, onSelect }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(prediction.id)
    }
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(prediction.id)}
      onKeyDown={handleKeyDown}
      aria-label={`Inspect prediction ${prediction.id} for ${prediction.machine?.id}`}
      className="group relative cursor-pointer p-4 transition-all hover:border-primary/40 hover:bg-card/90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Header: Machine ID + Prediction ID badge */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="font-mono text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {prediction.machine?.id}
          </span>
          <h3 className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {prediction.machine?.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {prediction.id}
          </span>
          <span className="grid size-7 place-items-center rounded bg-muted text-muted-foreground group-hover:text-primary transition-colors">
            <ChevronRight size={16} strokeWidth={2} />
          </span>
        </div>
      </div>

      {/* Badges: Result Outcome + Risk */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PredictionResultBadge failure={prediction.result?.machineFailure} />
        <RiskBadge level={prediction.result?.riskLevel} />
      </div>

      {/* Failure Risk probability */}
      <div className="mt-4 rounded-md border border-border/70 bg-background/60 p-2.5">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block mb-1">
          Failure Probability
        </span>
        <ProbabilityIndicator
          probability={prediction.result?.failureProbability}
          riskLevel={prediction.result?.riskLevel}
        />
      </div>

      {/* Timestamp footer */}
      <div className="mt-3.5 flex items-center justify-between border-t border-border/50 pt-2.5 text-xs text-muted-foreground font-mono">
        <div className="flex items-center gap-1.5">
          <Clock size={12} strokeWidth={2} className="shrink-0 text-muted-foreground" />
          <span>{formatDateTime(prediction.createdAt)}</span>
        </div>
        <span className="text-primary font-sans font-medium text-xs group-hover:underline">
          View Prediction
        </span>
      </div>
    </Card>
  )
}

export default PredictionHistoryCard
