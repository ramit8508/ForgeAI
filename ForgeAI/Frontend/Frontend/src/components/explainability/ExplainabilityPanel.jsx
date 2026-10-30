/**
 * ForgeAI — ExplainabilityPanel
 *
 * Main container component for the SHAP-based model explanation.
 * Renders below the prediction result as an expandable analysis section.
 *
 * States:
 *   idle      → "Explain Prediction" button available
 *   loading   → Subtle loading indicator ("Analyzing model contribution…")
 *   success   → Full SHAP explanation with feature contribution bars
 *   unavailable → Clean "not yet available" message (endpoint doesn't exist)
 *   error     → Error message with retry action
 *
 * This component does NOT fabricate SHAP data. It consumes real data from
 * the explainability service or shows appropriate empty/error states.
 *
 * @param {{
 *   explanationStatus: 'idle'|'loading'|'success'|'unavailable'|'error',
 *   explanation: import('../../services/explainabilityService').Explanation|null,
 *   errorMessage: string|null,
 *   isExpanded: boolean,
 *   onRequestExplanation: () => void,
 *   onRetry: () => void,
 *   onToggle: () => void,
 * }} props
 */

import {
  Brain,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  RotateCcw,
  Server,
} from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import FeatureContributionList from './FeatureContributionList'
import ExplainabilitySummary from './ExplainabilitySummary'
import ExplainabilityDisclaimer from './ExplainabilityDisclaimer'
import { cn } from '../../lib/utils'

function ExplainabilityPanel({
  explanationStatus,
  explanation,
  errorMessage,
  isExpanded,
  onRequestExplanation,
  onRetry,
  onToggle,
}) {
  const isIdle = explanationStatus === 'idle'
  const isLoading = explanationStatus === 'loading'
  const isSuccess = explanationStatus === 'success'
  const isUnavailable = explanationStatus === 'unavailable'
  const isError = explanationStatus === 'error'

  return (
    <div className="mt-6" data-testid="explainability-panel">
      {/* Entry Point: Explain Prediction button (idle state) */}
      {isIdle && (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border/60 bg-card/30 p-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onRequestExplanation}
            className="gap-2 text-sm uppercase tracking-[0.06em]"
            aria-label="Explain this prediction using SHAP model analysis"
          >
            <Brain size={15} aria-hidden="true" />
            <span>Explain Prediction</span>
          </Button>
        </div>
      )}

      {/* Expanded Section (loading, success, unavailable, error) */}
      {!isIdle && (
        <Card className="overflow-hidden border-border/70">
          {/* Section Header — always visible when not idle */}
          <button
            type="button"
            onClick={onToggle}
            className={cn(
              'flex w-full items-center justify-between gap-3 px-5 py-3.5',
              'border-b border-border/60 bg-card/90 transition-colors',
              'hover:bg-accent/30 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary',
              'cursor-pointer',
            )}
            aria-expanded={isExpanded}
            aria-controls="explainability-content"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-md bg-primary/10 text-primary border border-primary/20">
                <Brain size={15} aria-hidden="true" />
              </span>
              <div className="text-left">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Model Explanation
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isLoading && 'Analyzing model contribution…'}
                  {isSuccess && `${explanation?.features?.length || 0} features analyzed`}
                  {isUnavailable && 'Explanation not yet available'}
                  {isError && 'Explanation could not be retrieved'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isLoading && (
                <Loader2
                  size={15}
                  className="animate-spin text-primary"
                  aria-label="Loading model explanation"
                />
              )}
              {isSuccess && (
                <span                 className="hidden sm:inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 font-mono text-xs font-medium text-success border border-success/30">
                  Analysis complete
                </span>
              )}
              {isError && (
                <span                 className="hidden sm:inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 font-mono text-xs font-medium text-destructive border border-destructive/30">
                  Error
                </span>
              )}
              {isExpanded ? (
                <ChevronUp size={16} className="text-muted-foreground" aria-hidden="true" />
              ) : (
                <ChevronDown size={16} className="text-muted-foreground" aria-hidden="true" />
              )}
            </div>
          </button>

          {/* Collapsible Content */}
          <div
            id="explainability-content"
            role="region"
            aria-label="Model explanation details"
            className={cn(
              'transition-all duration-300 ease-in-out overflow-hidden',
              isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            <div className="p-5 space-y-5">
              {/* Loading State */}
              {isLoading && <LoadingState />}

              {/* Success State — Real SHAP Data */}
              {isSuccess && explanation && (
                <SuccessState explanation={explanation} />
              )}

              {/* Unavailable State — Endpoint doesn't exist yet */}
              {isUnavailable && <UnavailableState />}

              {/* Error State */}
              {isError && (
                <ErrorState
                  errorMessage={errorMessage}
                  onRetry={onRetry}
                />
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

/**
 * Loading indicator — subtle, professional.
 */
function LoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-8"
      data-testid="explainability-loading"
      aria-live="polite"
    >
      <div className="relative">
        <div className="size-10 rounded-full border-2 border-border/50" />
        <div className="absolute inset-0 size-10 rounded-full border-2 border-t-primary animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          Analyzing model contribution…
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Computing feature influence via SHAP analysis
        </p>
      </div>
    </div>
  )
}

/**
 * Successful explanation with real SHAP data.
 */
function SuccessState({ explanation }) {
  return (
    <div className="space-y-5" data-testid="explainability-success">
      {/* Intro Text */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground leading-relaxed">
          The following input features contributed most to this prediction.
          Features are ranked by absolute contribution magnitude.
        </p>
      </div>

      {/* Model Summary Metrics */}
      <ExplainabilitySummary
        baseValue={explanation.baseValue}
        outputValue={explanation.outputValue}
        featureCount={explanation.features.length}
      />

      {/* Feature Contribution Section */}
      <div>
        <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-3">
          <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Feature Contribution
          </h4>
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-amber-400" aria-hidden="true" />
              Increases risk
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-teal-400" aria-hidden="true" />
              Decreases risk
            </span>
          </div>
        </div>

        <FeatureContributionList features={explanation.features} />
      </div>

      {/* Disclaimer */}
      <ExplainabilityDisclaimer />
    </div>
  )
}

/**
 * Endpoint not available — clean empty state.
 */
function UnavailableState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-8 text-center"
      data-testid="explainability-unavailable"
      aria-live="polite"
    >
      <div className="grid size-12 place-items-center rounded-lg border border-border/60 bg-secondary/40 text-muted-foreground">
        <Server size={22} aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          Model explanation not yet available
        </p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground leading-relaxed">
          This prediction can be explained once model contribution data is available
          from the analysis service. The prediction result remains valid.
        </p>
      </div>
    </div>
  )
}

/**
 * Error with retry capability.
 */
function ErrorState({ errorMessage, onRetry }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-8 text-center"
      data-testid="explainability-error"
      aria-live="polite"
    >
      <div className="grid size-12 place-items-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
        <AlertCircle size={22} aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          Explainability unavailable
        </p>
        <p         className="mt-1 max-w-sm text-sm text-muted-foreground leading-relaxed">
          {errorMessage ||
            'The prediction was completed successfully, but model explanation data could not be retrieved.'}
        </p>
      </div>
      {onRetry && (
        <Button
          type="button"
          variant="secondary"
          onClick={onRetry}
          className="mt-1 gap-1.5 text-sm uppercase tracking-[0.06em]"
          aria-label="Retry loading model explanation"
        >
          <RotateCcw size={13} aria-hidden="true" />
          <span>Retry</span>
        </Button>
      )}
    </div>
  )
}

export default ExplainabilityPanel
