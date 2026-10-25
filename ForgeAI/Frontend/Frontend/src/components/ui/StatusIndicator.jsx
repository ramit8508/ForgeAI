/**
 * ForgeAI — Status indicator
 *
 * Supported statuses: 'online' | 'offline' | 'degraded' | 'loading'
 */

import { cn } from '../../lib/utils'

const statusConfig = {
  online:   { label: 'System Online',   dot: 'bg-success',     text: 'text-success' },
  offline:  { label: 'System Offline',  dot: 'bg-destructive', text: 'text-destructive' },
  degraded: { label: 'Degraded',        dot: 'bg-warning',     text: 'text-warning' },
  loading:  { label: 'Connecting…',     dot: 'bg-muted-foreground animate-pulse', text: 'text-muted-foreground' },
}

function StatusIndicator({ status = 'online', className }) {
  const cfg = statusConfig[status] || statusConfig.online

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.07em]',
        cfg.text,
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span className={cn('size-2 rounded-full', cfg.dot)} aria-hidden="true" />
      {cfg.label}
    </span>
  )
}

export default StatusIndicator
