/**
 * ForgeAI — Probability indicator
 *
 * Compact progress bar + percentage for displaying failure probability.
 */

const barTones = {
  LOW:    'bg-success',
  MEDIUM: 'bg-warning',
  HIGH:   'bg-destructive',
}

function ProbabilityIndicator({ probability, riskLevel = 'LOW' }) {
  const pct = (probability * 100).toFixed(1)
  const barColor = barTones[riskLevel] || barTones.LOW

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
        {pct}%
      </span>
      <div className="hidden h-2 w-20 overflow-hidden rounded-full bg-muted sm:block">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-300`}
          style={{ width: `${Math.min(probability * 100, 100)}%` }}
          role="progressbar"
          aria-valuenow={probability * 100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% failure probability`}
        />
      </div>
    </div>
  )
}

export default ProbabilityIndicator
