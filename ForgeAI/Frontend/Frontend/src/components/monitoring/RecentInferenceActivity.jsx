import { Link } from 'react-router-dom'
import { Clock, ArrowRight, ExternalLink } from 'lucide-react'
import Card from '../ui/Card'
import RiskBadge from '../ui/RiskBadge'
import PredictionResultBadge from '../predictions/history/PredictionResultBadge'

function formatDateTime(iso) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch {
    return '—'
  }
}

/**
 * RecentInferenceActivity
 *
 * Renders recent model prediction evaluations from the prediction history log.
 */
function RecentInferenceActivity({ predictions = [] }) {
  return (
    <Card className="overflow-hidden" as="section" aria-labelledby="recent-inference-heading">
      <div className="flex items-center justify-between border-b border-border bg-card/80 px-5 py-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Inference Stream
          </span>
          <h2 id="recent-inference-heading" className="mt-0.5 text-base font-semibold text-foreground">
            Recent Prediction Activity
          </h2>
        </div>

        <Link
          to="/predictions/history"
          className="flex items-center gap-1 font-mono text-xs text-primary hover:underline"
        >
          <span>All history</span>
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>

      {predictions.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground">
          No historical inference events logged yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-xs" aria-label="Recent Predictions Table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Prediction Event
                </th>
                <th className="px-3 py-3 text-left font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Machine
                </th>
                <th className="px-3 py-3 text-left font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Timestamp
                </th>
                <th className="px-3 py-3 text-left font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Model Outcome
                </th>
                <th className="px-3 py-3 text-left font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Probability
                </th>
                <th className="px-4 py-3 text-right font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Inspect
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {predictions.map((pred) => {
                const res = pred.result || {}
                const m = pred.machine || {}

                return (
                  <tr
                    key={pred.id}
                    className="transition-colors hover:bg-accent/40"
                  >
                    {/* Prediction ID */}
                    <td className="px-5 py-3">
                      <Link
                        to={`/predictions/history/${pred.id}`}
                        className="font-mono font-semibold text-foreground hover:text-primary transition-colors hover:underline"
                      >
                        {pred.id}
                      </Link>
                    </td>

                    {/* Machine ID */}
                    <td className="px-3 py-3">
                      <Link
                        to={`/machines/${m.id}`}
                        className="font-mono text-muted-foreground hover:text-foreground transition-colors hover:underline"
                        title={m.name}
                      >
                        {m.id}
                      </Link>
                    </td>

                    {/* Timestamp */}
                    <td className="px-3 py-3 font-mono text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} className="text-muted-foreground" aria-hidden="true" />
                        {formatDateTime(pred.createdAt)}
                      </span>
                    </td>

                    {/* Model Outcome */}
                    <td className="px-3 py-3">
                      <PredictionResultBadge failure={res.machineFailure} />
                    </td>

                    {/* Probability & Risk */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <RiskBadge level={res.riskLevel} />
                        <span className="font-mono text-xs text-foreground">
                          {((res.failureProbability || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/predictions/history/${pred.id}`}
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
                        aria-label={`Inspect prediction ${pred.id}`}
                      >
                        <span>Details</span>
                        <ExternalLink size={11} aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border px-5 py-3 bg-card/40 text-xs text-muted-foreground font-mono">
        <span>Logged inference events via Random Forest classifier</span>
        <Link
          to="/predictions/history"
          className="flex items-center gap-1 text-primary hover:underline"
        >
          <span>View all {predictions.length} records</span>
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </Card>
  )
}

export default RecentInferenceActivity
