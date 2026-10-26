/**
 * ForgeAI — ExplainabilitySummary
 *
 * Compact header summary for the explainability section.
 * Displays the model base value, output value, and total feature count.
 *
 * @param {{
 *   baseValue: number,
 *   outputValue: number,
 *   featureCount: number,
 * }} props
 */

function ExplainabilitySummary({ baseValue, outputValue, featureCount }) {
  const formatValue = (v) =>
    typeof v === 'number' && Number.isFinite(v)
      ? v.toFixed(4)
      : '—'

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-md border border-border/50 bg-background/50 p-2.5">
        <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
          Base Value
        </div>
        <div className="mt-1 font-mono text-sm font-semibold text-foreground">
          {formatValue(baseValue)}
        </div>
      </div>

      <div className="rounded-md border border-border/50 bg-background/50 p-2.5">
        <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
          Output Value
        </div>
        <div className="mt-1 font-mono text-sm font-semibold text-foreground">
          {formatValue(outputValue)}
        </div>
      </div>

      <div className="rounded-md border border-border/50 bg-background/50 p-2.5">
        <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
          Features Analyzed
        </div>
        <div className="mt-1 font-mono text-sm font-semibold text-foreground">
          {featureCount}
        </div>
      </div>
    </div>
  )
}

export default ExplainabilitySummary
