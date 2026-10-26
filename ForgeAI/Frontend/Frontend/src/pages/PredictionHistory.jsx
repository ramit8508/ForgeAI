import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import PredictionNavTabs from '../components/predictions/PredictionNavTabs'
import PredictionHistorySummary from '../components/predictions/history/PredictionHistorySummary'
import PredictionHistoryFilters from '../components/predictions/history/PredictionHistoryFilters'
import PredictionHistoryTable from '../components/predictions/history/PredictionHistoryTable'
import { usePredictionHistory } from '../hooks/usePredictionHistory'

/**
 * ForgeAI — Prediction History Page (Part 10)
 *
 * Operational log of previous machine failure prediction events.
 * Provides multi-axis filtering, sorting, client search, dynamic KPI summaries,
 * and seamless navigation to prediction detail inspection.
 */
function PredictionHistory() {
  const navigate = useNavigate()
  const {
    predictions,
    filteredPredictions,
    summary,
    availableMachines,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    machineFilter,
    setMachineFilter,
    riskFilter,
    setRiskFilter,
    resultFilter,
    setResultFilter,
    dateRange,
    setDateRange,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    resetFilters,
    refetch,
  } = usePredictionHistory()

  const handleSelectPrediction = (predictionId) => {
    navigate(`/predictions/history/${predictionId}`)
  }

  const handleToggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  const isFiltered =
    searchQuery.trim() !== '' ||
    machineFilter !== 'ALL' ||
    riskFilter !== 'ALL' ||
    resultFilter !== 'ALL' ||
    dateRange !== 'ALL' ||
    sortBy !== 'newest' ||
    sortOrder !== 'desc'

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        breadcrumb="Predictions / History"
        tag="Operational Audit Log"
        title="Prediction History"
        description="Review previous machine-failure predictions, historical inference outcomes, and evaluation telemetry."
      />

      {/* Nav Tabs: Switcher between Workspace and History */}
      <div className="mt-6">
        <PredictionNavTabs />
      </div>

      {/* Summary KPI Cards */}
      <div className="mt-2">
        <PredictionHistorySummary summary={summary} />
      </div>

      {/* Search, Filter, Sort Controls */}
      <div className="mt-6">
        <PredictionHistoryFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          machineFilter={machineFilter}
          onMachineChange={setMachineFilter}
          availableMachines={availableMachines}
          riskFilter={riskFilter}
          onRiskChange={setRiskFilter}
          resultFilter={resultFilter}
          onResultChange={setResultFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onToggleSortOrder={handleToggleSortOrder}
          onReset={resetFilters}
          totalCount={predictions.length}
          filteredCount={filteredPredictions.length}
        />
      </div>

      {/* Prediction History Table & Responsive Mobile Cards */}
      <div className="mt-4">
        <PredictionHistoryTable
          predictions={filteredPredictions}
          loading={loading}
          error={error}
          isFiltered={isFiltered}
          onSelect={handleSelectPrediction}
          onReset={resetFilters}
          onRetry={refetch}
        />
      </div>
    </PageContainer>
  )
}

export default PredictionHistory
