import {
  ShieldCheck,
  AlertTriangle,
  Cpu,
  CheckCircle2,
  CircleDot,
  RotateCcw,
  Info,
} from 'lucide-react'
import RiskBadge from '../ui/RiskBadge'
import Button from '../ui/Button'
import ProbabilityRiskScale from './ProbabilityRiskScale'
import { config, getRiskAssessment } from '../../lib/config'
import {
  formatProbabilityPercent,
  formatRawProbability,
} from '../../lib/formatters'
import { INFERENCE_PIPELINE_STEPS } from '../../data/predictions/prediction.mock'

/**
 * ForgeAI — Prediction Status View
 *
 * Renders the stateful contents of the Prediction Panel:
 * - 'idle': Ready for analysis prompt with model specs
 * - 'validating' / 'processing': ML pipeline inference progress
 * - 'success': Failure/No-Failure outcome, probability meter, risk badge, recommendations
 * - 'error': User-friendly failure card with retry action
 */
function PredictionStatus({
  state = 'idle',
  result = null,
  errorMessage = '',
  onAnalyze,
  onReset,
}) {
  const { model, risk } = config

  // 1. IDLE STATE
  if (state === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center sm:p-10">
        <div className="mb-4 grid size-12 place-items-center rounded-lg border border-border bg-muted/60 text-primary">
          <Cpu size={24} strokeWidth={1.8} aria-hidden="true" />
        </div>

        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
          Ready for Analysis
        </span>

        <h3 className="mt-1 text-base font-semibold text-foreground">
          Model Inference Standby
        </h3>

        <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
          Enter current machine telemetry or select a calibrated preset, then run the
          Random Forest classifier to evaluate failure probability.
        </p>

        {/* Model Spec Context */}
        <div className="mt-6 w-full rounded-md border border-border/70 bg-background/60 p-3 text-left">
          <div className="flex items-center justify-between border-b border-border/50 pb-2 text-[11px] font-mono uppercase tracking-[0.06em] text-muted-foreground">
            <span>Inference Model</span>
            <span className="text-foreground">{model.name}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>Decision Threshold</span>
            <span className="font-semibold text-primary">{model.threshold}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>Risk Bands</span>
            <span>
              Low &lt;{risk.low.max} · Med {risk.medium.min}–{risk.medium.max} · High &gt;{risk.high.min}
            </span>
          </div>
        </div>

        <div className="mt-6 w-full">
          <Button
            type="button"
            variant="primary"
            onClick={onAnalyze}
            className="w-full gap-2 text-xs uppercase tracking-[0.08em]"
          >
            <Cpu size={14} aria-hidden="true" />
            <span>Analyze Machine</span>
          </Button>
        </div>
      </div>
    )
  }

  // 2. VALIDATING / PROCESSING STATE
  if (state === 'validating' || state === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center sm:p-10" role="status" aria-live="polite">
        <div className="relative mb-5 grid size-14 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary">
          <Cpu size={26} className="animate-pulse" aria-hidden="true" />
          <span className="absolute -inset-1 animate-spin rounded-full border-2 border-primary border-t-transparent opacity-75" />
        </div>

        <h3 className="text-base font-semibold text-foreground">
          Analyzing Machine Telemetry...
        </h3>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
          Executing machine failure risk inference pipeline.
        </p>

        {/* Inference Progress Steps */}
        <div className="mt-6 w-full space-y-3 rounded-lg border border-border/70 bg-background/50 p-4 text-left">
          {INFERENCE_PIPELINE_STEPS.map((step, index) => {
            const isCompleted = index === 0
            const isCurrent = index === 1
            const isPending = index > 1

            return (
              <div key={step.id} className="flex items-center gap-2.5 text-xs">
                {isCompleted && (
                  <CheckCircle2 size={15} className="shrink-0 text-success" aria-hidden="true" />
                )}
                {isCurrent && (
                  <CircleDot size={15} className="shrink-0 animate-pulse text-primary" aria-hidden="true" />
                )}
                {isPending && (
                  <span className="size-3.5 shrink-0 rounded-full border border-muted-foreground/40" aria-hidden="true" />
                )}
                <span
                  className={
                    isCompleted
                      ? 'text-foreground line-through opacity-75'
                      : isCurrent
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground'
                  }
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // 3. ERROR STATE
  if (state === 'error') {
    return (
      <div className="flex flex-col items-center p-8 text-center sm:p-10" role="alert">
        <div className="mb-4 grid size-12 place-items-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
          <AlertTriangle size={24} aria-hidden="true" />
        </div>

        <h3 className="text-base font-semibold text-destructive">
          Unable to Complete Analysis
        </h3>
        <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
          {errorMessage ||
            'The prediction service could not process this machine reading. Please try again.'}
        </p>

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onReset}
            className="text-xs uppercase tracking-[0.06em]"
          >
            Reset Form
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onAnalyze}
            className="text-xs uppercase tracking-[0.06em]"
          >
            Retry Analysis
          </Button>
        </div>
      </div>
    )
  }

  // 4. SUCCESS STATE
  if (state === 'success' && result) {
    const isFailure = result.machineFailure
    const rawProbability = result.failureProbability
    const formattedPercent = formatProbabilityPercent(rawProbability)
    const rawProbabilityStr = formatRawProbability(rawProbability)
    const riskLevel = result.riskLevel
    const assessment = getRiskAssessment(riskLevel)

    return (
      <div className="flex flex-col gap-5 p-5 sm:p-6" role="region" aria-label="Prediction Result">
        {/* Outcome Header Banner */}
        <div
          className={`rounded-lg border p-4.5 transition-colors ${
            isFailure
              ? 'border-destructive/40 bg-destructive/10 text-destructive'
              : 'border-success/40 bg-success/10 text-success'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`grid size-10 shrink-0 place-items-center rounded-md border ${
                isFailure
                  ? 'border-destructive/40 bg-destructive/20 text-destructive'
                  : 'border-success/40 bg-success/20 text-success'
              }`}
            >
              {isFailure ? (
                <AlertTriangle size={22} aria-hidden="true" />
              ) : (
                <ShieldCheck size={22} aria-hidden="true" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] opacity-85">
                AI Classification Result
              </span>
              <h3 className="mt-0.5 text-base font-bold tracking-wide sm:text-lg">
                {isFailure ? 'FAILURE DETECTED' : 'NO FAILURE DETECTED'}
              </h3>
              <p className="mt-1 text-xs text-foreground/80 leading-relaxed">
                {assessment.interpretation}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid: Probability & Risk Level */}
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Failure Probability Card */}
          <div className="flex flex-col justify-between rounded-lg border border-border/80 bg-background/80 p-4">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Failure Probability
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {formattedPercent}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground" title="Raw model float probability">
                ({rawProbabilityStr})
              </span>
            </div>

            {/* Restrained Horizontal Probability & Risk Scale */}
            <div className="mt-3">
              <ProbabilityRiskScale
                probability={rawProbability}
                riskLevel={riskLevel}
                threshold={model.threshold}
              />
            </div>
          </div>

          {/* Risk Level Card */}
          <div className="flex flex-col justify-between rounded-lg border border-border/80 bg-background/80 p-4">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Risk Classification
            </span>
            <div className="mt-2">
              <RiskBadge level={riskLevel} />
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              {assessment.interpretation}
            </p>
          </div>
        </div>

        {/* Threshold Context Notice (Separate concepts clarification) */}
        <div className="rounded-lg border border-border/60 bg-secondary/30 p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Info size={13} className="text-primary" aria-hidden="true" />
            <span>Threshold Calibration Reference</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-mono text-muted-foreground">
            <div className="rounded border border-border/50 bg-background/60 p-2">
              <div className="text-foreground font-semibold">Classification: {model.threshold}</div>
              <div className="text-[10px] text-muted-foreground">Trigger for binary failure decision</div>
            </div>
            <div className="rounded border border-border/50 bg-background/60 p-2">
              <div className="text-foreground font-semibold">Risk Bands</div>
              <div className="text-[10px] text-muted-foreground">Low &lt;0.30 · Med 0.30-0.70 · High &gt;0.70</div>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground/90 leading-tight">
            Classification threshold ({model.threshold}) governs binary failure detection independently of operational risk classification bands.
          </p>
        </div>

        {/* Operational Attention Recommendation */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
            Operational Attention
          </span>
          <p className="mt-1 text-xs leading-relaxed text-foreground">
            {assessment.recommendation}
          </p>
        </div>

        {/* Reset / Re-run Actions */}
        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <span className="font-mono text-[11px] text-muted-foreground">
            Evaluated via {model.name}
          </span>
          <Button
            type="button"
            variant="secondary"
            onClick={onReset}
            className="gap-1.5 text-xs uppercase tracking-[0.06em]"
          >
            <RotateCcw size={12} aria-hidden="true" />
            <span>Clear / Reset</span>
          </Button>
        </div>
      </div>
    )
  }

  return null
}

export default PredictionStatus
