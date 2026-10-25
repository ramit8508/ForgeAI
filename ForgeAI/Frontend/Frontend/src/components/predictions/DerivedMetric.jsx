import { Calculator, Lock, Info } from 'lucide-react'
import { DERIVED_METRIC_DEFINITION } from '../../data/predictions/prediction.mock'

/**
 * ForgeAI — Derived Metric: Temperature Difference
 *
 * Computes: `Process Temperature [K] - Air Temperature [K]`
 *
 * This value is strictly read-only and computed live on the client
 * to match the backend feature engineering pipeline exactly.
 */
function DerivedMetric({ airTemp, processTemp }) {
  const { label, unit, formula } = DERIVED_METRIC_DEFINITION

  const air = parseFloat(airTemp)
  const process = parseFloat(processTemp)

  const isValidAir = !isNaN(air) && air > 0
  const isValidProcess = !isNaN(process) && process > 0
  const isCalculable = isValidAir && isValidProcess

  const difference = isCalculable ? process - air : null
  const formattedDifference = difference !== null ? `${difference.toFixed(1)} ${unit}` : `-- ${unit}`

  const isAbnormalThermal = difference !== null && difference < 0

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-accent/40 bg-accent/20 p-3.5 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Calculator size={14} className="text-primary" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground">
            {label}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded border border-border/80 bg-muted/80 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
          <Lock size={10} aria-hidden="true" />
          <span>Derived</span>
        </span>
      </div>

      {/* Value Display */}
      <div className="flex items-baseline justify-between rounded-md border border-border/60 bg-background/80 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-base font-semibold tracking-tight text-foreground sm:text-lg"
            aria-live="polite"
          >
            {formattedDifference}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            ({formula})
          </span>
        </div>
        <span className="font-mono text-xs text-primary font-medium">
          Auto-Engineered
        </span>
      </div>

      {/* Helper text explaining feature-engineering consistency */}
      <div className="flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground">
        <Info size={12} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        <span>
          Derived automatically from sensor readings to guarantee exact feature consistency with backend model weights.
        </span>
      </div>

      {/* Notice if process temperature is lower than air temperature */}
      {isAbnormalThermal && (
        <div className="rounded border border-warning/30 bg-warning/10 p-2 text-xs text-warning">
          <strong>Sensor warning:</strong> Process temperature is lower than ambient temperature. Verify sensor calibration before running critical analysis.
        </div>
      )}
    </div>
  )
}

export default DerivedMetric
