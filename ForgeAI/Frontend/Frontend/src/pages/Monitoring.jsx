import { useState } from 'react'
import { RefreshCw, AlertCircle, Loader2, BarChart2, Activity, Layers } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import MonitoringSummaryCards from '../components/monitoring/MonitoringSummaryCards'
import FleetRiskAndStatusSection from '../components/monitoring/FleetRiskAndStatusSection'
import ActionableAttentionQueue from '../components/monitoring/ActionableAttentionQueue'
import MonitoredFleetTable from '../components/monitoring/MonitoredFleetTable'
import RecentInferenceActivity from '../components/monitoring/RecentInferenceActivity'
import TelemetryStreamNotice from '../components/monitoring/TelemetryStreamNotice'

// Advanced Analytics Components
import AnalyticsInsightsSummary from '../components/monitoring/analytics/AnalyticsInsightsSummary'
import ProbabilityRankingChart from '../components/monitoring/analytics/ProbabilityRankingChart'
import ProbabilityHistogramChart from '../components/monitoring/analytics/ProbabilityHistogramChart'
import SensorTelemetryGrid from '../components/monitoring/analytics/SensorTelemetryGrid'
import RiskCorrelationScatterPlot from '../components/monitoring/analytics/RiskCorrelationScatterPlot'
import PredictionTimelineChart from '../components/monitoring/analytics/PredictionTimelineChart'
import FailureOutcomeComparison from '../components/monitoring/analytics/FailureOutcomeComparison'

import { useMonitoring, MONITORING_FILTER_TABS } from '../hooks/useMonitoring'
import { cn } from '../lib/utils'

/**
 * ForgeAI — Monitoring Dashboard (Phase 9 Upgrade)
 *
 * Comprehensive industrial observability & advanced analytics workstation:
 * - Fleet totals, status distribution, and model failure-risk distribution
 * - Executive analytics summary computed from live dataset
 * - Horizontal failure probability ranking with direct machine navigation
 * - 10-bin failure probability histogram with 0.45 cutoff threshold
 * - Multi-sensor diagnostic snapshot analysis with engineering limits
 * - Risk vs. Sensor Telemetry correlation scatter plot
 * - Historical prediction timeline & binary outcome comparison
 * - High-risk attention queue with quick diagnostic actions
 * - Searchable & filterable machine telemetry registry
 * - Transparent telemetry pipeline status (Batch simulated mode)
 */
function Monitoring() {
  const {
    machines,
    filteredMachines,
    metrics,
    attentionQueue,
    recentPredictions,
    rankedMachines,
    probabilityBins,
    sensorAnalytics,
    predictionTimeline,
    failureOutcomeSummary,
    executiveInsights,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filterTab,
    setFilterTab,
    resetFilters,
    refetch,
  } = useMonitoring()

  const [activeView, setActiveView] = useState('all') // 'all' | 'analytics' | 'operations'

  const handleFilterRisk = (riskCode) => {
    if (riskCode === 'HIGH') {
      setFilterTab(MONITORING_FILTER_TABS.HIGH_RISK)
    } else {
      setFilterTab(MONITORING_FILTER_TABS.ALL)
      setSearchQuery(riskCode)
    }
  }

  const handleFilterStatus = (statusCode) => {
    if (statusCode === 'OPERATIONAL') {
      setFilterTab(MONITORING_FILTER_TABS.OPERATIONAL)
    } else if (statusCode === 'WARNING_CRITICAL') {
      setFilterTab(MONITORING_FILTER_TABS.WARNING_CRITICAL)
    } else if (statusCode === 'OFFLINE') {
      setFilterTab(MONITORING_FILTER_TABS.OFFLINE)
    } else {
      setFilterTab(MONITORING_FILTER_TABS.ALL)
    }
  }

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        breadcrumb="Monitoring"
        tag="Fleet Observability &amp; Predictive Analytics"
        title="Monitoring Dashboard"
        description="Real-time operational running states, model failure-risk distributions, multivariate sensor analytics, and inference activity."
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-warning">
            Demo data · Simulated Fleet
          </span>

          <Button
            type="button"
            variant="secondary"
            onClick={refetch}
            disabled={loading}
            className="h-8 gap-1.5 text-xs uppercase tracking-[0.06em]"
            aria-label="Refresh monitoring dashboard"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
            <span>Refresh</span>
          </Button>
        </div>
      </PageHeader>

      {/* Loading State */}
      {loading && machines.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center p-16 text-center" aria-live="polite">
          <Loader2 size={32} className="animate-spin text-primary" aria-hidden="true" />
          <span className="mt-4 font-mono text-sm text-muted-foreground">
            Synchronizing fleet observability telemetry &amp; analytics...
          </span>
        </div>
      ) : error ? (
        /* Error State */
        <Card className="mt-6 p-8 text-center" role="alert">
          <div className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive border border-destructive/30 mx-auto">
            <AlertCircle size={24} aria-hidden="true" />
          </div>
          <h2 className="mt-3 text-base font-semibold text-foreground">
            Failed to Load Monitoring Data
          </h2>
          <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
            {error || 'Unable to retrieve fleet records from the machine service.'}
          </p>
          <div className="mt-5">
            <Button
              type="button"
              variant="secondary"
              onClick={refetch}
              className="text-xs uppercase tracking-[0.06em]"
            >
              Retry Connection
            </Button>
          </div>
        </Card>
      ) : (
        /* Main Workspace */
        <div className="mt-6 space-y-6">
          {/* Workspace View Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
            <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-background/60 p-1" role="tablist" aria-label="Monitoring view switcher">
              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'all'}
                onClick={() => setActiveView('all')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono transition-colors',
                  activeView === 'all'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/50'
                )}
              >
                <Layers size={13} aria-hidden="true" />
                <span>All Panels</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'analytics'}
                onClick={() => setActiveView('analytics')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono transition-colors',
                  activeView === 'analytics'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/50'
                )}
              >
                <BarChart2 size={13} aria-hidden="true" />
                <span>Industrial Analytics</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeView === 'operations'}
                onClick={() => setActiveView('operations')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono transition-colors',
                  activeView === 'operations'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/50'
                )}
              >
                <Activity size={13} aria-hidden="true" />
                <span>Operations &amp; Fleet</span>
              </button>
            </div>

            <span className="font-mono text-xs text-muted-foreground">
              {metrics.totalMachines} machines · {metrics.totalPredictions} evaluations
            </span>
          </div>

          {/* 1. Fleet KPI Summary Cards */}
          <MonitoringSummaryCards metrics={metrics} />

          {/* 2. Executive Analytics Summary (Computed Insights) */}
          {(activeView === 'all' || activeView === 'analytics') && (
            <AnalyticsInsightsSummary insights={executiveInsights} />
          )}

          {/* 3. Side-by-side Risk Distribution & Physical Operational Health */}
          {(activeView === 'all' || activeView === 'operations') && (
            <FleetRiskAndStatusSection
              riskDistribution={metrics.riskDistribution}
              statusDistribution={metrics.statusDistribution}
              totalMachines={metrics.totalMachines}
              onFilterRisk={handleFilterRisk}
              onFilterStatus={handleFilterStatus}
            />
          )}

          {/* 4. Fleet Risk Analytics: Probability Ranking & 10-Bin Histogram */}
          {(activeView === 'all' || activeView === 'analytics') && (
            <div className="grid gap-6 lg:grid-cols-2">
              <ProbabilityRankingChart rankedMachines={rankedMachines} />
              <ProbabilityHistogramChart bins={probabilityBins} />
            </div>
          )}

          {/* 5. Sensor Telemetry Diagnostics Grid */}
          {(activeView === 'all' || activeView === 'analytics') && (
            <SensorTelemetryGrid sensorAnalytics={sensorAnalytics} />
          )}

          {/* 6. Multivariate Risk vs. Sensor Correlation Scatter Plot */}
          {(activeView === 'all' || activeView === 'analytics') && (
            <RiskCorrelationScatterPlot machines={machines} />
          )}

          {/* 7. Actionable Attention Queue */}
          {(activeView === 'all' || activeView === 'operations') && (
            <ActionableAttentionQueue attentionQueue={attentionQueue} />
          )}

          {/* 8. Temporal Inferences & Failure Outcome Comparison */}
          {(activeView === 'all' || activeView === 'analytics') && (
            <div className="grid gap-6 lg:grid-cols-2">
              <PredictionTimelineChart timeline={predictionTimeline} />
              <FailureOutcomeComparison outcomeSummary={failureOutcomeSummary} />
            </div>
          )}

          {/* 9. Monitored Machine Telemetry Registry (Searchable & Filterable) */}
          {(activeView === 'all' || activeView === 'operations') && (
            <MonitoredFleetTable
              machines={filteredMachines}
              totalCount={metrics.totalMachines}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterTab={filterTab}
              onFilterTabChange={setFilterTab}
              onResetFilters={resetFilters}
              metrics={metrics}
            />
          )}

          {/* 10. Recent Prediction Inference Activity */}
          {(activeView === 'all' || activeView === 'operations') && (
            <RecentInferenceActivity predictions={recentPredictions} />
          )}

          {/* 11. Telemetry Pipeline Status & Data Integrity Disclosure */}
          <TelemetryStreamNotice />
        </div>
      )}
    </PageContainer>
  )
}

export default Monitoring
