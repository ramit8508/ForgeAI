import {
  Activity,
  AlertTriangle,
  BarChart3,
  Factory,
  Percent,
  ShieldCheck,
} from 'lucide-react'

import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import StatCard from '../components/dashboard/StatCard'
import RiskOverview from '../components/dashboard/RiskOverview'
import SystemStatus from '../components/dashboard/SystemStatus'
import RecentPredictions from '../components/dashboard/RecentPredictions'

import {
  fleetSummary,
  operationalMetrics,
  recentPredictions,
  systemServices,
  riskDistribution,
} from '../data/mock/dashboard'

/**
 * Transforms mock data into the shape <StatCard /> expects.
 * This is a UI-mapping concern — kept in the page, not the data layer.
 */
function buildKpiCards(fleet, metrics) {
  return [
    {
      label: 'Machines Monitored',
      value: fleet.totalMachines,
      detail: `${fleet.healthy} healthy · ${fleet.elevated} elevated · ${fleet.highRisk} high risk`,
      icon: Factory,
      tone: 'info',
    },
    {
      label: 'Predictions',
      value: metrics.predictionsRun.toLocaleString(),
      detail: metrics.predictionsWindow,
      icon: BarChart3,
      tone: 'neutral',
    },
    {
      label: 'Failures Detected',
      value: metrics.failuresDetected,
      detail: metrics.failuresWindow,
      icon: AlertTriangle,
      tone: 'danger',
    },
    {
      label: 'Avg Failure Risk',
      value: `${(metrics.avgFailureRisk * 100).toFixed(1)}%`,
      detail: 'Across monitored machines',
      icon: Percent,
      tone: 'warning',
    },
  ]
}

function Dashboard() {
  const kpiCards = buildKpiCards(fleetSummary, operationalMetrics)

  return (
    <PageContainer>
      {/* Page header */}
      <PageHeader
        breadcrumb="Dashboard"
        tag="Predictive maintenance intelligence"
        title="Dashboard"
        description="Machine risk overview and predictive maintenance operations."
      >
        <span className="rounded-full border border-warning/25 bg-warning/5 px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-warning">
          Demo data · Preview
        </span>
      </PageHeader>

      {/* KPI row */}
      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key metrics">
        {kpiCards.map((card) => (
          <StatCard {...card} key={card.label} />
        ))}
      </section>

      {/* Risk overview + System status */}
      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <RiskOverview distribution={riskDistribution} />
        <SystemStatus services={systemServices} />
      </div>

      {/* Recent predictions table */}
      <div className="mt-3">
        <RecentPredictions predictions={recentPredictions} />
      </div>
    </PageContainer>
  )
}

export default Dashboard
