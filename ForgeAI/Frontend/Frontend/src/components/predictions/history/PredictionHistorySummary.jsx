import { Bot, AlertOctagon, ShieldCheck, ShieldAlert } from 'lucide-react'
import Card from '../../ui/Card'

/**
 * Prediction History Summary KPIs
 *
 * Compact summary metrics derived dynamically from the prediction history dataset.
 *
 * @param {{
 *   summary: {
 *     totalPredictions: number,
 *     failuresDetected: number,
 *     lowRiskCount: number,
 *     highRiskCount: number,
 *     lowRiskPercentage: number,
 *     highRiskPercentage: number
 *   }
 * }} props
 */
function PredictionHistorySummary({
  summary = {
    totalPredictions: 0,
    failuresDetected: 0,
    lowRiskCount: 0,
    highRiskCount: 0,
    lowRiskPercentage: 0,
    highRiskPercentage: 0,
  },
}) {
  const cards = [
    {
      id: 'total',
      label: 'Total Predictions',
      value: summary.totalPredictions,
      detail: 'Historical inference events',
      icon: Bot,
      iconClasses: 'text-primary bg-primary/10',
      dotClasses: 'bg-primary',
    },
    {
      id: 'failures',
      label: 'Failures Detected',
      value: summary.failuresDetected,
      detail: 'Positive failure classifications',
      icon: AlertOctagon,
      iconClasses: 'text-destructive bg-destructive/10',
      dotClasses: 'bg-destructive',
    },
    {
      id: 'low-risk',
      label: 'Low Risk',
      value: `${summary.lowRiskCount} (${summary.lowRiskPercentage.toFixed(1)}%)`,
      detail: 'Operating within nominal limits',
      icon: ShieldCheck,
      iconClasses: 'text-success bg-success/10',
      dotClasses: 'bg-success',
    },
    {
      id: 'high-risk',
      label: 'High Risk',
      value: `${summary.highRiskCount} (${summary.highRiskPercentage.toFixed(1)}%)`,
      detail: 'Impending failure probability',
      icon: ShieldAlert,
      iconClasses: 'text-destructive bg-destructive/10',
      dotClasses: 'bg-destructive',
    },
  ]

  return (
    <section aria-labelledby="history-summary-heading" className="w-full">
      <h2 id="history-summary-heading" className="sr-only">
        Prediction History Summary
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
              <strong className="mt-3 block text-xl font-semibold tracking-tight sm:mt-4 sm:text-2xl tabular-nums">
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

export default PredictionHistorySummary
