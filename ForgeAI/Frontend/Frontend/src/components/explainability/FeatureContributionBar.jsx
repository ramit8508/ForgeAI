/**
 * ForgeAI — FeatureContributionBar
 *
 * Renders a single horizontal contribution bar for one SHAP feature.
 * Communicates:
 *   - Feature display name
 *   - Original sensor value + unit
 *   - SHAP contribution magnitude (horizontal bar width)
 *   - Direction (positive = increases failure risk, negative = decreases)
 *
 * Positive contribution → warm amber/orange semantic treatment
 * Negative contribution → cool teal/blue semantic treatment
 *
 * Does NOT depend solely on color — includes textual direction indicators.
 *
 * @param {{
 *   displayName: string,
 *   value: number,
 *   unit: string,
 *   shapValue: number,
 *   direction: 'positive'|'negative',
 *   maxAbsShap: number,
 * }} props
 */
function FeatureContributionBar({
  displayName,
  value,
  unit,
  shapValue,
  direction,
  maxAbsShap,
}) {
  const absShap = Math.abs(shapValue)
  const barPercent = maxAbsShap > 0 ? (absShap / maxAbsShap) * 100 : 0

  const isPositive = direction === 'positive'

  // Format the SHAP value for display (avoid calling it probability or confidence)
  const formattedShap = absShap < 0.0001
    ? '<0.0001'
    : absShap.toFixed(4)

  // Format sensor value
  const formattedValue = typeof value === 'number' && Number.isFinite(value)
    ? (Number.isInteger(value) ? value.toLocaleString('en-US') : value.toFixed(1))
    : '—'

  return (
    <div
      className="group rounded-md border border-border/50 bg-background/40 p-3 transition-colors hover:border-border/80 hover:bg-background/60"
      role="listitem"
      aria-label={`${displayName}: ${isPositive ? 'increases' : 'decreases'} predicted failure risk by ${formattedShap}`}
    >
      {/* Row 1: Feature name + sensor value */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold text-foreground tracking-tight">
          {displayName}
        </span>
        <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
          {formattedValue}{unit ? ` ${unit}` : ''}
        </span>
      </div>

      {/* Row 2: Contribution bar + direction label */}
      <div className="mt-2 flex items-center gap-2.5">
        {/* Bar container */}
        <div className="flex-1 h-2 rounded-full bg-border/30 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isPositive
                ? 'bg-gradient-to-r from-amber-500/70 to-amber-400'
                : 'bg-gradient-to-r from-teal-500/70 to-teal-400'
            }`}
            style={{ width: `${Math.max(barPercent, 2)}%` }}
            aria-hidden="true"
          />
        </div>

        {/* Direction indicator + SHAP value */}
        <div className="flex items-center gap-1 shrink-0 min-w-[90px] justify-end">
          <span
            className={`font-mono text-[11px] font-semibold ${
              isPositive ? 'text-amber-400' : 'text-teal-400'
            }`}
          >
            {isPositive ? '↑' : '↓'} {isPositive ? '+' : '−'}{formattedShap}
          </span>
        </div>
      </div>

      {/* Row 3: Direction explanation text */}
      <div className="mt-1.5">
        <span
          className={`text-[10px] font-mono ${
            isPositive ? 'text-amber-400/70' : 'text-teal-400/70'
          }`}
        >
          {isPositive
            ? '↑ increases predicted failure risk'
            : '↓ decreases predicted failure risk'}
        </span>
      </div>
    </div>
  )
}

export default FeatureContributionBar
