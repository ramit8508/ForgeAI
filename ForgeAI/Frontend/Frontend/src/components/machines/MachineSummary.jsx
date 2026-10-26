import { Cpu, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react'
import Card from '../ui/Card'

/**
 * Fleet Summary KPIs
 *
 * Compact summary metrics derived dynamically from the machine dataset.
 *
 * @param {{
 *   summary: {
 *     total: number,
 *     operational: number,
 *     warning: number,
 *     critical: number,
 *     offline?: number
 *   }
 * }} props
 */
function MachineSummary({ summary = { total: 0, operational: 0, warning: 0, critical: 0 } }) {
  const cards = [
    {
      id: 'total',
      label: 'Machines Monitored',
      value: summary.total,
      detail: 'Active in intelligence registry',
      icon: Cpu,
      iconClasses: 'text-primary bg-primary/10',
      dotClasses: 'bg-primary',
    },
    {
      id: 'operational',
      label: 'Operational',
      value: summary.operational,
      detail: 'Nominal operational status',
      icon: CheckCircle2,
      iconClasses: 'text-success bg-success/10',
      dotClasses: 'bg-success',
    },
    {
      id: 'warning',
      label: 'Warning',
      value: summary.warning,
      detail: 'Elevated monitoring required',
      icon: AlertTriangle,
      iconClasses: 'text-warning bg-warning/10',
      dotClasses: 'bg-warning',
    },
    {
      id: 'critical',
      label: 'Critical',
      value: summary.critical,
      detail: 'High attention required',
      icon: AlertOctagon,
      iconClasses: 'text-destructive bg-destructive/10',
      dotClasses: 'bg-destructive',
    },
  ]

  return (
    <section aria-labelledby="fleet-summary-heading" className="w-full">
      <h2 id="fleet-summary-heading" className="sr-only">
        Fleet Summary
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card className="p-4 sm:p-5" key={card.id}>
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {card.label}
                </span>
                <span
                  className={`grid size-8 place-items-center rounded-md sm:size-9 ${card.iconClasses}`}
                  aria-hidden="true"
                >
                  <Icon size={16} strokeWidth={2} />
                </span>
              </div>
              <strong className="mt-3 block text-2xl font-semibold tracking-tight sm:mt-4 sm:text-3xl tabular-nums">
                {card.value}
              </strong>
              <span className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
                <span className={`size-1.5 rounded-full ${card.dotClasses}`} aria-hidden="true" />
                <span className="truncate">{card.detail}</span>
              </span>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export default MachineSummary
