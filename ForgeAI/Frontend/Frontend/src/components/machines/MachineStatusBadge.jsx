import { CheckCircle2, AlertTriangle, AlertOctagon, PowerOff } from 'lucide-react'
import { cn } from '../../lib/utils'

const STATUS_CONFIG = {
  OPERATIONAL: {
    label: 'Operational',
    icon: CheckCircle2,
    badgeClasses: 'border-success/30 bg-success/10 text-success',
    dotClasses: 'bg-success',
  },
  WARNING: {
    label: 'Warning',
    icon: AlertTriangle,
    badgeClasses: 'border-warning/30 bg-warning/10 text-warning',
    dotClasses: 'bg-warning',
  },
  CRITICAL: {
    label: 'Critical',
    icon: AlertOctagon,
    badgeClasses: 'border-destructive/30 bg-destructive/10 text-destructive',
    dotClasses: 'bg-destructive',
  },
  OFFLINE: {
    label: 'Offline',
    icon: PowerOff,
    badgeClasses: 'border-border bg-muted/60 text-muted-foreground',
    dotClasses: 'bg-muted-foreground',
  },
}

/**
 * Renders an accessible, semantic operational status indicator.
 * Displays state using icon, color, and text label (not color alone).
 *
 * @param {{ status: 'Operational'|'Warning'|'Critical'|'Offline'|string, className?: string, showIcon?: boolean }} props
 */
function MachineStatusBadge({ status = 'Operational', className, showIcon = true }) {
  const normalizedKey = (status || '').toUpperCase()
  const cfg = STATUS_CONFIG[normalizedKey] || STATUS_CONFIG.OPERATIONAL
  const Icon = cfg.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-[0.06em]',
        cfg.badgeClasses,
        className,
      )}
      role="status"
      aria-label={`Machine status: ${cfg.label}`}
    >
      {showIcon ? (
        <Icon size={13} strokeWidth={2.2} aria-hidden="true" />
      ) : (
        <span className={cn('size-1.5 rounded-full', cfg.dotClasses)} aria-hidden="true" />
      )}
      <span>{cfg.label}</span>
    </span>
  )
}

export default MachineStatusBadge
