import {
  ClipboardCheck,
  Compass,
  SlidersHorizontal,
  Info,
} from 'lucide-react'
import { config, getRiskAssessment } from '../../lib/config'
import RiskBadge from '../ui/RiskBadge'
import { formatProbabilityPercent } from '../../lib/formatters'
import { cn } from '../../lib/utils'

/**
 * ForgeAI — OperationalAssessmentCard (Part 6)
 *
 * Renders the operational interpretation, recommended maintenance attention,
 * and decision threshold calibration context based on the classified risk level.
 *
 * Explicitly separates statistical ML model output from deterministic
 * operational maintenance guidance policies.
 *
 * @param {{
 *   riskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
 *   failureProbability: number,
 *   machineFailure: boolean,
 *   className?: string
 * }} props
 */
function OperationalAssessmentCard({
  riskLevel = 'LOW',
  failureProbability = 0,
  machineFailure = false,
  className,
}) {
  const assessment = getRiskAssessment(riskLevel)
  const { model, risk } = config
  const formattedPct = formatProbabilityPercent(failureProbability)
  const thresholdPct = formatProbabilityPercent(model.threshold)

  // Tone styling for the operational recommendation card
  const toneClasses = {
    LOW: 'border-success/30 bg-success/5 text-success',
    MEDIUM: 'border-warning/30 bg-warning/5 text-warning',
    HIGH: 'border-destructive/30 bg-destructive/5 text-destructive',
  }

  const activeTone = toneClasses[riskLevel] || toneClasses.LOW

  return (
    <div
      className={cn(
        'rounded-lg border border-border/70 bg-card/60 p-4 sm:p-5 flex flex-col justify-between gap-4',
        className,
      )}
      aria-labelledby="operational-assessment-heading"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={16} className="text-primary" aria-hidden="true" />
          <h4
            id="operational-assessment-heading"
            className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground"
          >
            Operational Assessment
          </h4>
        </div>
        <RiskBadge level={riskLevel} />
      </div>

      {/* 1. Risk Interpretation */}
      <div className="space-y-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          Risk Interpretation
        </span>
        <p className="text-xs text-foreground/90 leading-relaxed font-sans">
          {assessment.interpretation}
        </p>
      </div>

      {/* 2. Recommended Operational Attention */}
      <div className={cn('rounded-md border p-3', activeTone)}>
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em]">
          <Compass size={13} aria-hidden="true" />
          <span>Recommended Attention</span>
        </div>
        <p className="mt-1 text-xs text-foreground font-medium leading-relaxed">
          {assessment.recommendation}
        </p>
      </div>

      {/* 3. Decision Boundary Calibration Context */}
      <div className="rounded-md border border-border/50 bg-background/50 p-3">
        <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground border-b border-border/40 pb-2">
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal size={12} className="text-primary" aria-hidden="true" />
            Decision Threshold
          </span>
          <span className="font-semibold text-primary">{model.threshold}</span>
        </div>

        <div className="mt-2 text-[11px] font-mono text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Model Cutoff</span>
            <span className="text-foreground">
              {machineFailure
                ? `${formattedPct} ≥ ${thresholdPct} (Binary 1)`
                : `${formattedPct} < ${thresholdPct} (Binary 0)`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Risk Bands</span>
            <span>
              Low &lt;{risk.low.max} · Med {risk.medium.min}–{risk.medium.max} · High &gt;{risk.high.min}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Policy Notice (Separation of AI prediction from operational policy) */}
      <div className="flex items-start gap-2 border-t border-border/40 pt-2 text-[10px] text-muted-foreground leading-normal">
        <Info size={13} className="shrink-0 text-muted-foreground/70 mt-0.5" aria-hidden="true" />
        <p>
          AI Prediction vs. Operational Guidance: The {model.name} model outputs failure probability ({formattedPct}). Operational attention rules are deterministic plant maintenance policies based on certified risk bands.
        </p>
      </div>
    </div>
  )
}

export default OperationalAssessmentCard
