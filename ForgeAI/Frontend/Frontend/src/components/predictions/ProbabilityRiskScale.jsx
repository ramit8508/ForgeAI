import { useId } from 'react'
import { config } from '../../lib/config'
import { formatProbabilityPercent } from '../../lib/formatters'
import { cn } from '../../lib/utils'

/**
 * ForgeAI — ProbabilityRiskScale (Part 6)
 *
 * Restrained horizontal probability and risk scale component.
 * Displays the three calibrated risk bands (LOW < 0.30, MEDIUM 0.30–0.70, HIGH > 0.70),
 * the model classification threshold marker (0.45), and the active failure probability.
 *
 * Designed to cleanly support the numeric probability without overwhelming the UI.
 *
 * @param {{
 *   probability: number,
 *   riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH',
 *   threshold?: number,
 *   className?: string
 * }} props
 */
function ProbabilityRiskScale({
  probability = 0,
  riskLevel = 'LOW',
  threshold = config.model.threshold,
  className,
}) {
  const scaleId = useId()
  const rawPct = Math.min(Math.max((Number(probability) || 0) * 100, 0), 100)
  const formattedPct = formatProbabilityPercent(probability)

  // Subtle risk tone styles for the active fill
  const fillTone =
    riskLevel === 'HIGH'
      ? 'bg-destructive shadow-[0_0_10px_rgba(239,119,119,0.35)]'
      : riskLevel === 'MEDIUM'
        ? 'bg-warning shadow-[0_0_10px_rgba(228,173,85,0.35)]'
        : 'bg-success shadow-[0_0_10px_rgba(88,198,141,0.35)]'

  return (
    <div className={cn('w-full', className)} aria-labelledby={`${scaleId}-label`}>
      {/* Zone band headers */}
      <div
        id={`${scaleId}-label`}
        className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
      >
        <div className="flex w-[30%] items-center gap-1 text-success">
          <span className="size-1.5 rounded-full bg-success/80" aria-hidden="true" />
          <span>Low (&lt;0.30)</span>
        </div>
        <div className="flex w-[40%] justify-center items-center gap-1 text-warning">
          <span className="size-1.5 rounded-full bg-warning/80" aria-hidden="true" />
          <span>Medium (0.30–0.70)</span>
        </div>
        <div className="flex w-[30%] justify-end items-center gap-1 text-destructive">
          <span className="size-1.5 rounded-full bg-destructive/80" aria-hidden="true" />
          <span>High (&gt;0.70)</span>
        </div>
      </div>

      {/* Main Track Container */}
      <div className="relative h-3 w-full overflow-hidden rounded-md border border-border/80 bg-muted/40">
        {/* Background Segment Tints */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div className="w-[30%] border-r border-border/60 bg-success/10" />
          <div className="w-[40%] border-r border-border/60 bg-warning/10" />
          <div className="w-[30%] bg-destructive/10" />
        </div>

        {/* Classification Threshold Marker (0.45) */}
        <div
          className="absolute top-0 bottom-0 z-10 w-px border-l border-dashed border-primary"
          style={{ left: `${threshold * 100}%` }}
          title={`Classification Threshold: ${threshold}`}
          aria-hidden="true"
        />

        {/* Active Probability Fill */}
        <div
          className={cn(
            'relative h-full rounded-l-md transition-all duration-500 ease-out',
            fillTone,
          )}
          style={{ width: `${Math.max(rawPct, 1.5)}%` }}
          role="progressbar"
          aria-valuenow={rawPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Failure probability ${formattedPct}`}
        />
      </div>

      {/* Ticks and Threshold Annotation */}
      <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] text-muted-foreground/80">
        <span className="w-8">0%</span>
        <span className="text-center">0.30</span>
        <span
          className="relative font-semibold text-primary"
          title="Binary classification threshold"
        >
          ▲ {threshold} cutoff
        </span>
        <span className="text-center">0.70</span>
        <span className="w-8 text-right">100%</span>
      </div>
    </div>
  )
}

export default ProbabilityRiskScale
