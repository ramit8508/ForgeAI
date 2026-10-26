import {
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import RiskBadge from '../ui/RiskBadge'
import ProbabilityRiskScale from './ProbabilityRiskScale'
import AnalyzedConditionsSnapshot from './AnalyzedConditionsSnapshot'
import OperationalAssessmentCard from './OperationalAssessmentCard'
import ExplainabilityPanel from '../explainability/ExplainabilityPanel'
import { config, getRiskAssessment } from '../../lib/config'
import {
  formatProbabilityPercent,
  formatRawProbability,
} from '../../lib/formatters'
import { cn } from '../../lib/utils'

/**
 * ForgeAI — PredictionResultView (Part 6 + Part 7 Explainability)
 *
 * Upgraded, professional industrial AI result interface.
 * When inference completes, the workspace transitions from INPUT to this ANALYSIS RESULT view.
 *
 * Implements:
 * 1. Primary AI outcome (NO FAILURE DETECTED / FAILURE DETECTED with icons, never raw 0/1)
 * 2. Failure probability percentage (e.g. 0.34%) with raw precision internally
 * 3. Restrained horizontal probability and risk scale with 3 risk bands + 0.45 cutoff marker
 * 4. Backend risk level badge (LOW / MEDIUM / HIGH)
 * 5. Deterministic risk interpretation and operational recommendations (clearly separated from ML)
 * 6. Centralized model configuration (Random Forest, threshold 0.45)
 * 7. Analyzed conditions snapshot (all 5 sensors + frontend-derived temperature difference)
 * 8. Traceability from Machine Conditions -> AI Prediction -> Risk Assessment
 * 9. Clear actions to run another analysis or modify telemetry
 * 10. SHAP-based model explainability panel (Part 7)
 *
 * @param {{
 *   result: {
 *     machineFailure: boolean,
 *     failureProbability: number,
 *     riskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
 *     evaluatedAt?: string,
 *   },
 *   sensorSnapshot: {
 *     air_temperature: number|string,
 *     process_temperature: number|string,
 *     rotational_speed: number|string,
 *     torque: number|string,
 *     tool_wear: number|string,
 *   },
 *   explainability: {
 *     explanationStatus: 'idle'|'loading'|'success'|'unavailable'|'error',
 *     explanation: Object|null,
 *     errorMessage: string|null,
 *     isExpanded: boolean,
 *     requestExplanation: () => void,
 *     retryExplanation: () => void,
 *     toggleExpanded: () => void,
 *   },
 *   onAnalyzeAgain: () => void,
 *   onEditInputs?: () => void,
 *   onReset?: () => void,
 * }} props
 */
function PredictionResultView({
  result,
  sensorSnapshot,
  explainability,
  onAnalyzeAgain,
  onEditInputs,
  onReset,
}) {
  if (!result) return null

  const { machineFailure, failureProbability, riskLevel } = result
  const assessment = getRiskAssessment(riskLevel)
  const { model } = config

  const formattedProbability = formatProbabilityPercent(failureProbability)
  const rawProbabilityStr = formatRawProbability(failureProbability)

  // Verdict tone styling
  const verdictBannerStyle = machineFailure
    ? 'border-destructive/40 bg-destructive/10 text-destructive'
    : 'border-success/40 bg-success/10 text-success'

  const verdictIconBoxStyle = machineFailure
    ? 'border-destructive/40 bg-destructive/20 text-destructive'
    : 'border-success/40 bg-success/20 text-success'

  return (
    <Card className="flex flex-col overflow-hidden border-border/80 shadow-panel" aria-label="Machine Prediction Analysis Result">
      {/* 1. Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-card/90 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary border border-primary/20">
            <Cpu size={18} aria-hidden="true" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Prediction Result
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 font-mono text-[11px] font-medium text-success border border-success/30">
                <CheckCircle2 size={11} aria-hidden="true" />
                Analysis completed
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Inference executed via {model.name} classifier
            </p>
          </div>
        </div>

        {/* Header Right: Metadata & Quick Action */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-md border border-border/60 bg-secondary/40 px-3 py-1 font-mono text-[11px] text-muted-foreground">
            <span className="text-foreground font-medium">{model.name}</span>
            <span>·</span>
            <span>Threshold: <strong className="text-primary">{model.threshold}</strong></span>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={onAnalyzeAgain}
            className="gap-1.5 text-xs uppercase tracking-[0.06em]"
            title="Modify sensor values or run another analysis"
          >
            <RotateCcw size={13} aria-hidden="true" />
            <span>Analyze Again</span>
          </Button>
        </div>
      </div>

      {/* 2. Primary Result Section (Hero Split) */}
      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Hero: AI Classification Verdict (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border p-5 transition-colors sm:p-6 bg-gradient-to-br from-card to-background">
            <div className="space-y-4">
              {/* Verdict Banner Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground flex items-center gap-1.5">
                  <Layers size={13} className="text-primary" aria-hidden="true" />
                  AI Classification Verdict
                </span>
                <RiskBadge level={riskLevel} />
              </div>

              {/* Outcome Banner */}
              <div className={cn('flex items-start gap-3.5 rounded-lg border p-4', verdictBannerStyle)}>
                <div className={cn('grid size-11 shrink-0 place-items-center rounded-lg border', verdictIconBoxStyle)}>
                  {machineFailure ? (
                    <AlertTriangle size={24} aria-hidden="true" />
                  ) : (
                    <ShieldCheck size={24} aria-hidden="true" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] opacity-80">
                    Primary Prediction
                  </div>
                  <h3 className="mt-0.5 text-lg font-bold tracking-wide sm:text-xl">
                    {machineFailure ? 'FAILURE DETECTED' : 'NO FAILURE DETECTED'}
                  </h3>
                  <p className="mt-1 text-xs text-foreground/80 leading-relaxed font-sans">
                    {assessment.interpretation}
                  </p>
                </div>
              </div>
            </div>

            {/* Verdict Subtext Context */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3 text-[11px] font-mono text-muted-foreground">
              <span>Risk Classification: <strong className="text-foreground">{riskLevel}</strong></span>
              <span>Threshold Cutoff: <strong className="text-primary">{model.threshold}</strong></span>
            </div>
          </div>

          {/* Right Hero: Failure Probability & Restrained Scale (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-border/80 bg-background/70 p-5 sm:p-6">
            <div>
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  Failure Probability
                </span>
                <span className="rounded bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground border border-border/40">
                  {assessment.qualifier}
                </span>
              </div>

              {/* Big Probability Metric */}
              <div className="mt-3 flex items-baseline gap-2.5">
                <span className="font-mono text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {formattedProbability}
                </span>
                <span className="font-mono text-xs text-muted-foreground" title="Raw model float probability">
                  ({rawProbabilityStr})
                </span>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Statistical likelihood of failure predicted by {model.name}.
              </p>
            </div>

            {/* Horizontal Restrained Scale */}
            <div className="mt-4 pt-3 border-t border-border/50">
              <ProbabilityRiskScale
                probability={failureProbability}
                riskLevel={riskLevel}
                threshold={model.threshold}
              />
            </div>
          </div>
        </div>

        {/* 3. Traceability Process Flow Banner */}
        <div className="my-6 flex items-center justify-center gap-2 sm:gap-4 rounded-lg border border-border/60 bg-secondary/30 px-4 py-2.5 text-center font-mono text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">Machine Telemetry (5 sensors)</span>
          <ArrowRight size={13} className="text-primary shrink-0" aria-hidden="true" />
          <span className="font-semibold text-foreground">AI Inference ({model.name} @ {model.threshold})</span>
          <ArrowRight size={13} className="text-primary shrink-0" aria-hidden="true" />
          <span className="font-semibold text-foreground">Risk Assessment ({riskLevel})</span>
        </div>

        {/* 4. Bottom Grid: Analyzed Conditions + Operational Assessment */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* Machine Conditions Snapshot (~58% desktop) */}
          <div className="lg:col-span-7">
            <AnalyzedConditionsSnapshot
              snapshot={sensorSnapshot}
              className="h-full"
            />
          </div>

          {/* Operational Assessment (~42% desktop) */}
          <div className="lg:col-span-5">
            <OperationalAssessmentCard
              riskLevel={riskLevel}
              failureProbability={failureProbability}
              machineFailure={machineFailure}
              className="h-full"
            />
          </div>
        </div>

        {/* 5. Model Explainability Section (Part 7) */}
        {explainability && (
          <ExplainabilityPanel
            explanationStatus={explainability.explanationStatus}
            explanation={explainability.explanation}
            errorMessage={explainability.errorMessage}
            isExpanded={explainability.isExpanded}
            onRequestExplanation={explainability.requestExplanation}
            onRetry={explainability.retryExplanation}
            onToggle={explainability.toggleExpanded}
          />
        )}

        {/* 6. Bottom Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-card/60 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-success" aria-hidden="true" />
            <span>Analysis locked to current telemetry snapshot.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onReset && (
              <Button
                type="button"
                variant="ghost"
                onClick={onReset}
                className="text-xs uppercase tracking-[0.06em] text-muted-foreground hover:text-foreground"
              >
                Reset to Nominal
              </Button>
            )}

            {onEditInputs && (
              <Button
                type="button"
                variant="secondary"
                onClick={onEditInputs}
                className="gap-1.5 text-xs uppercase tracking-[0.06em]"
              >
                <SlidersHorizontal size={13} aria-hidden="true" />
                <span>Modify Parameters</span>
              </Button>
            )}

            <Button
              type="button"
              variant="primary"
              onClick={onAnalyzeAgain}
              className="min-w-[150px] gap-2 text-xs uppercase tracking-[0.08em]"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span>Analyze Again</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default PredictionResultView
