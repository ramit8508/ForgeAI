import { ShieldCheck, ShieldAlert, Info } from 'lucide-react'
import Card from '../../ui/Card'
import { formatProbabilityPercent } from '../../../lib/formatters'

/**
 * FailureOutcomeComparison
 *
 * Compares predicted failure vs predicted non-failure model classifications.
 * Distinguishes model predictions from verified real-world machine failures.
 *
 * @param {{
 *   outcomeSummary: {
 *     total: number,
 *     predictedFailure: { count: number, percentage: number, avgProbability: number },
 *     predictedNonFailure: { count: number, percentage: number, avgProbability: number }
 *   }
 * }} props
 */
function FailureOutcomeComparison({ outcomeSummary }) {
  if (!outcomeSummary) return null

  const { total = 0, predictedFailure, predictedNonFailure } = outcomeSummary

  const failCount = predictedFailure?.count || 0
  const failPct = predictedFailure?.percentage || 0
  const failAvg = predictedFailure?.avgProbability || 0

  const nonFailCount = predictedNonFailure?.count || 0
  const nonFailPct = predictedNonFailure?.percentage || 0
  const nonFailAvg = predictedNonFailure?.avgProbability || 0

  return (
    <Card className="p-5 flex flex-col justify-between" as="section" aria-labelledby="outcome-summary-heading">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
              Model Outcomes
            </span>
            <h3 id="outcome-summary-heading" className="mt-0.5 text-base font-semibold text-foreground">
              Inference Outcome Comparison
            </h3>
          </div>

          <span className="font-mono text-[11px] text-muted-foreground">
            {total} total historical evaluations
          </span>
        </div>

        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Aggregated model classification decisions recorded in the prediction log.
        </p>

        {/* Stacked Ratio Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5 text-muted-foreground">
            <span className="text-destructive font-semibold">{failPct}% Predicted Failure</span>
            <span className="text-success font-semibold">{nonFailPct}% Predicted Nominal</span>
          </div>

          <div className="h-3 w-full rounded-full bg-border/40 overflow-hidden flex" role="progressbar" aria-label="Prediction outcome ratio">
            {failPct > 0 && (
              <div
                style={{ width: `${failPct}%` }}
                className="h-full bg-destructive transition-all duration-500"
                title={`Predicted Failure: ${failPct}%`}
              />
            )}
            {nonFailPct > 0 && (
              <div
                style={{ width: `${nonFailPct}%` }}
                className="h-full bg-success transition-all duration-500"
                title={`Predicted No Failure: ${nonFailPct}%`}
              />
            )}
          </div>
        </div>

        {/* Side by side metric boxes */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Predicted Failure */}
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-destructive">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
                  Predicted Failure
                </span>
                <ShieldAlert size={14} aria-hidden="true" />
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-destructive">
                  {failCount}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  ({failPct}%)
                </span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-destructive/20 text-[11px] font-mono text-muted-foreground">
              Mean Prob: <strong className="text-destructive">{formatProbabilityPercent(failAvg)}</strong>
            </div>
          </div>

          {/* Predicted No Failure */}
          <div className="rounded-lg border border-success/30 bg-success/5 p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-success">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
                  No Failure
                </span>
                <ShieldCheck size={14} aria-hidden="true" />
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-success">
                  {nonFailCount}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  ({nonFailPct}%)
                </span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-success/20 text-[11px] font-mono text-muted-foreground">
              Mean Prob: <strong className="text-success">{formatProbabilityPercent(nonFailAvg)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Outcome Integrity Notice */}
      <div className="mt-4 flex items-start gap-2 rounded border border-border/70 bg-card/60 p-2.5 text-[11px] text-muted-foreground font-mono">
        <Info size={13} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-tight">
          <strong className="text-foreground">Integrity Note:</strong> Reflects statistical classifier predictions. Never treated as verified post-inspection hardware failure without confirmed physical maintenance records.
        </p>
      </div>
    </Card>
  )
}

export default FailureOutcomeComparison
