import { Factory, AlertTriangle, Percent, BarChart3 } from 'lucide-react'
import StatCard from '../dashboard/StatCard'
import { formatProbabilityPercent } from '../../lib/formatters'

/**
 * MonitoringSummaryCards
 *
 * Renders key monitoring metrics derived dynamically from fleet telemetry
 * and prediction logs.
 *
 * @param {{
 *   metrics: {
 *     totalMachines: number,
 *     avgFailureRisk: number,
 *     riskDistribution: { low: number, medium: number, high: number },
 *     statusDistribution: { operational: number, warning: number, critical: number, offline: number },
 *     totalPredictions: number,
 *     failurePredictionsCount: number,
 *     highRiskCount: number,
 *   }
 * }} props
 */
function MonitoringSummaryCards({ metrics }) {
  const {
    totalMachines = 0,
    avgFailureRisk = 0,
    statusDistribution = { operational: 0, warning: 0, critical: 0, offline: 0 },
    totalPredictions = 0,
    failurePredictionsCount = 0,
    highRiskCount = 0,
  } = metrics || {}

  const statusDetail = `${statusDistribution.operational} operational · ${statusDistribution.warning} warning · ${statusDistribution.critical} critical`

  const cards = [
    {
      label: 'Monitored Fleet',
      value: totalMachines,
      detail: statusDetail,
      icon: Factory,
      tone: 'info',
    },
    {
      label: 'High-Risk Machines',
      value: highRiskCount,
      detail: highRiskCount > 0 ? 'Exceeds 0.45 failure threshold' : 'All machines below threshold',
      icon: AlertTriangle,
      tone: highRiskCount > 0 ? 'danger' : 'success',
    },
    {
      label: 'Avg Failure Risk',
      value: formatProbabilityPercent(avgFailureRisk, 1),
      detail: 'Mean risk across fleet',
      icon: Percent,
      tone: avgFailureRisk > 0.3 ? 'warning' : 'neutral',
    },
    {
      label: 'Predictions Logged',
      value: totalPredictions,
      detail: `${failurePredictionsCount} failures identified`,
      icon: BarChart3,
      tone: 'neutral',
    },
  ]

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Monitoring Key Metrics">
      {cards.map((card) => (
        <StatCard {...card} key={card.label} />
      ))}
    </section>
  )
}

export default MonitoringSummaryCards
