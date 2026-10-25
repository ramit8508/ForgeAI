import { cn } from '../../lib/utils'

function Badge({ children, tone = 'neutral' }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full border px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-[0.08em]',
        tone === 'info' && 'border-info/30 text-info',
        tone === 'neutral' && 'border-border text-muted-foreground',
      )}
    >
      {children}
    </span>
  )
}

export default Badge
