import { Link } from 'react-router-dom'
import { AlertTriangle, TrendingUp, Cpu, Gauge, ArrowRight } from 'lucide-react'
import Card from '../../ui/Card'
import { formatProbabilityPercent } from '../../../lib/formatters'

/**
 * AnalyticsInsightsSummary
 *
 * Executive analytics insights calculated strictly from available machine and prediction records.
 *
 * @param {{
 *   insights: {
 *     highestRiskMachine: Object|null,
 *     highRiskThresholdCount: number,
 *     threshold: number,
 *     sensorAnomaliesCount: number,
 *     riskBalanceText: string,
 *     predictionActivitySummary: string,
 *     distribution: { low: number, medium: number, high: number }
 *   }
 * }} props
 */
function AnalyticsInsightsSummary({ insights }) {
  if (!insights) return null

  const {
    highestRiskMachine,
    highRiskThresholdCount = 0,
    threshold = 0.45,
    sensorAnomaliesCount = 0,
    riskBalanceText = '',
    predictionActivitySummary = '',
  } = insights

  return (
    <Card className="p-5 border-border/80 bg-card" as="section" aria-labelledby="executive-insights-heading">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded bg-primary/10 text-primary border border-primary/20">
            <Cpu size={14} aria-hidden="true" />
          </span>
          <h2 id="executive-insights-heading" className="text-sm font-semibold text-foreground tracking-tight">
            Industrial Analytics &amp; Predictive Insights
          </h2>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          Calculated from active fleet snapshot telemetry &amp; inference logs
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Peak Risk Machine */}
        <div className="rounded-lg border border-border/80 bg-background/50 p-3.5 flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-destructive" aria-hidden="true" />
              Highest Predicted Risk
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-destructive">
                {highestRiskMachine ? formatProbabilityPercent(highestRiskMachine.failureProbability) : '—'}
              </span>
              {highestRiskMachine && (
                <span className="font-mono text-xs text-foreground font-semibold">
                  {highestRiskMachine.id}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground truncate" title={highestRiskMachine?.name}>
              {highestRiskMachine?.name || 'No machines analyzed'}
            </p>
          </div>
          {highestRiskMachine && (
            <Link
              to={`/machines/${highestRiskMachine.id}`}
              className="mt-2.5 inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
            >
              <span>Inspect machine</span>
              <ArrowRight size={11} aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* 2. Threshold Breaches */}
        <div className="rounded-lg border border-border/80 bg-background/50 p-3.5 flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Gauge size={12} className="text-warning" aria-hidden="true" />
              Threshold Breaches (≥ {threshold})
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-warning">
                {highRiskThresholdCount}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                machine{highRiskThresholdCount !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Exceeding model classification boundary for failure prediction.
            </p>
          </div>
          <span className="mt-2.5 font-mono text-[10px] text-muted-foreground">
            Binary cutoff: <strong className="text-foreground">{threshold}</strong>
          </span>
        </div>

        {/* 3. Telemetry Strain Outliers */}
        <div className="rounded-lg border border-border/80 bg-background/50 p-3.5 flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <TrendingUp size={12} className="text-primary" aria-hidden="true" />
              Telemetry Strain Outliers
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-foreground">
                {sensorAnomaliesCount}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                strained asset{sensorAnomaliesCount !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Exceeding wear (&gt;200m), torque (&gt;55Nm), or thermal limits.
            </p>
          </div>
          <span className="mt-2.5 font-mono text-[10px] text-muted-foreground">
            Engineering boundaries active
          </span>
        </div>

        {/* 4. Fleet Balance & Inference Summary */}
        <div className="rounded-lg border border-border/80 bg-background/50 p-3.5 flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Fleet Risk Balance
            </span>
            <div className="mt-2 font-mono text-sm font-semibold text-foreground">
              {riskBalanceText}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
              {predictionActivitySummary}
            </p>
          </div>
          <span className="mt-2.5 font-mono text-[10px] text-muted-foreground">
            Ensemble Random Forest
          </span>
        </div>
      </div>
    </Card>
  )
}

export default AnalyticsInsightsSummary
