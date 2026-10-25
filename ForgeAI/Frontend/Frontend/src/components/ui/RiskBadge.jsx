import { cn } from '../../lib/utils'

const toneMap = {
  LOW:    'border-success/25 bg-success/8 text-success',
  MEDIUM: 'border-warning/25 bg-warning/8 text-warning',
  HIGH:   'border-destructive/25 bg-destructive/8 text-destructive',
}

/**
 * Renders a compact risk-level indicator.
 * @param {{ level: 'LOW'|'MEDIUM'|'HIGH' }} props
 */
function RiskBadge({ level }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-[0.06em]',
        toneMap[level] || toneMap.LOW,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {level}
    </span>
  )
}

export default RiskBadge
