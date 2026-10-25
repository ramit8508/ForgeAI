import Card from '../ui/Card'

const toneConfig = {
  info:    { icon: 'text-info bg-info/10',       dot: 'bg-info' },
  success: { icon: 'text-success bg-success/10', dot: 'bg-success' },
  warning: { icon: 'text-warning bg-warning/10', dot: 'bg-warning' },
  danger:  { icon: 'text-destructive bg-destructive/10', dot: 'bg-destructive' },
  neutral: { icon: 'text-muted-foreground bg-muted', dot: 'bg-muted-foreground' },
}

/**
 * @param {{ label: string, value: string|number, detail: string, icon: import('lucide-react').LucideIcon, tone?: string }} props
 */
function StatCard({ label, value, detail, icon: Icon, tone = 'neutral' }) {
  const t = toneConfig[tone] || toneConfig.neutral

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {label}
        </span>
        <span
          className={`grid size-9 place-items-center rounded-md ${t.icon}`}
          aria-hidden="true"
        >
          <Icon size={17} strokeWidth={1.8} />
        </span>
      </div>
      <strong className="mt-4 block text-3xl font-semibold tracking-tight sm:text-4xl">
        {value}
      </strong>
      <span className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <span className={`size-2 rounded-full ${t.dot}`} aria-hidden="true" />
        {detail}
      </span>
    </Card>
  )
}

export default StatCard
