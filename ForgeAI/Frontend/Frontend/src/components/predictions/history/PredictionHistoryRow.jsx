import { ChevronRight } from 'lucide-react'
import PredictionResultBadge from './PredictionResultBadge'
import RiskBadge from '../../ui/RiskBadge'
import ProbabilityIndicator from '../../ui/ProbabilityIndicator'

function formatDateTime(iso) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return { time: '—', date: '—' }
    return {
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
  } catch {
    return { time: '—', date: '—' }
  }
}

/**
 * Desktop & Tablet Prediction History Table Row
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
function PredictionHistoryRow({ prediction, onSelect }) {
  const { time, date } = formatDateTime(prediction.createdAt)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(prediction.id)
    }
  }

  return (
    <tr
      onClick={() => onSelect(prediction.id)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="row"
      aria-label={`Prediction ${prediction.id} for ${prediction.machine?.id}: ${
        prediction.result?.machineFailure === 1 ? 'Failure Detected' : 'No Failure'
      }, Risk ${prediction.result?.riskLevel}`}
      className="group cursor-pointer border-b border-border transition-colors hover:bg-accent/40 focus-visible:bg-accent/40 focus-visible:outline-none"
    >
      {/* Timestamp */}
      <td className="px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-sm font-semibold text-foreground">{time}</span>
          <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">{date}</span>
        </div>
      </td>

      {/* Prediction ID */}
      <td className="px-3 py-3">
        <span className="font-mono text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
          {prediction.id}
        </span>
      </td>

      {/* Machine Identity */}
      <td className="px-3 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            {prediction.machine?.id}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[180px] lg:max-w-[220px]">
            {prediction.machine?.name}
          </span>
        </div>
      </td>

      {/* Result Outcome */}
      <td className="px-3 py-3">
        <PredictionResultBadge failure={prediction.result?.machineFailure} />
      </td>

      {/* Risk Level */}
      <td className="px-3 py-3">
        <RiskBadge level={prediction.result?.riskLevel} />
      </td>

      {/* Failure Probability */}
      <td className="px-3 py-3">
        <ProbabilityIndicator
          probability={prediction.result?.failureProbability}
          riskLevel={prediction.result?.riskLevel}
        />
      </td>

      {/* Model Metadata */}
      <td className="px-3 py-3 hidden xl:table-cell">
        <span className="font-mono text-xs text-muted-foreground">
          {prediction.model?.name} (t={prediction.model?.threshold?.toFixed(2)})
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right sm:px-5">
        <span className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
          <span className="hidden sm:inline">Inspect</span>
          <ChevronRight size={15} strokeWidth={2} />
        </span>
      </td>
    </tr>
  )
}

export default PredictionHistoryRow
