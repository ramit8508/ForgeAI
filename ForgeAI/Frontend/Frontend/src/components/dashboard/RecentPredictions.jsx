import { Clock, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react'
import Card from '../ui/Card'
import RiskBadge from '../ui/RiskBadge'
import ProbabilityIndicator from '../ui/ProbabilityIndicator'

function formatTime(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  } catch {
    return '—'
  }
}

function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return '—'
  }
}

/**
 * @param {{ predictions: Array<{ id: string, machineId: string, timestamp: string, failure_probability: number, risk_level: string, machine_failure: number }> }} props
 */
function RecentPredictions({ predictions = [] }) {
  return (
    <Card className="overflow-hidden" as="section" aria-labelledby="recent-predictions-title">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-border px-5 py-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Inference log
          </span>
          <h2 className="mt-1 text-base font-semibold" id="recent-predictions-title">
            Recent Predictions
          </h2>
        </div>
        <Clock className="text-muted-foreground" size={18} strokeWidth={1.7} aria-hidden="true" />
      </div>

      {predictions.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-muted-foreground">
          No predictions available. Predictions will appear here once inference begins.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-3 text-left font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Machine
                </th>
                <th className="px-3 py-3 text-left font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Timestamp
                </th>
                <th className="px-3 py-3 text-left font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Failure Probability
                </th>
                <th className="px-3 py-3 text-left font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Risk
                </th>
                <th className="px-3 py-3 text-left font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Prediction
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {predictions.map((pred) => (
                <tr
                  className="transition-colors hover:bg-accent/50"
                  key={pred.id}
                >
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {pred.machineId}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-sm text-foreground">
                        {formatTime(pred.timestamp)}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatDate(pred.timestamp)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <ProbabilityIndicator
                      probability={pred.failure_probability}
                      riskLevel={pred.risk_level}
                    />
                  </td>
                  <td className="px-3 py-3.5">
                    <RiskBadge level={pred.risk_level} />
                  </td>
                  <td className="px-3 py-3.5">
                    {pred.machine_failure === 1 ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-[0.06em] text-destructive">
                        <ShieldAlert size={15} strokeWidth={2} />
                        Failure Detected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.06em] text-success">
                        <ShieldCheck size={15} strokeWidth={1.8} />
                        No Failure
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <span className="text-sm text-muted-foreground">
          {predictions.length} prediction{predictions.length !== 1 ? 's' : ''} · Demo data
        </span>
        <button
          className="flex cursor-not-allowed items-center gap-1.5 text-sm text-muted-foreground opacity-50"
          type="button"
          disabled
          aria-label="View all predictions — coming soon"
        >
          View all
          <ArrowRight size={15} strokeWidth={1.8} />
        </button>
      </div>
    </Card>
  )
}

export default RecentPredictions
