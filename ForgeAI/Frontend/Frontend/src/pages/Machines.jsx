import { useNavigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import MachineSummary from '../components/machines/MachineSummary'
import MachineFilters from '../components/machines/MachineFilters'
import MachineTable from '../components/machines/MachineTable'
import { useMachines } from '../hooks/useMachines'

/**
 * ForgeAI — Machines Page (Part 8)
 *
 * Industrial AI machine intelligence workstation:
 * - Fleet health & risk summary
 * - Multi-axis filtering by operational status and failure risk
 * - Real-time client-side search across ID, name, location
 * - Dense desktop operations table and touch-friendly mobile card view
 * - Seamless navigation to machine diagnostics and prediction workspace
 */
function Machines() {
  const navigate = useNavigate()
  const {
    machines,
    filteredMachines,
    fleetSummary,
    loading,
    searchQuery,
    setSearchQuery,
    riskFilter,
    setRiskFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    resetFilters,
  } = useMachines()

  const handleSelectMachine = (machineId) => {
    navigate(`/machines/${machineId}`)
  }

  const handleToggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        breadcrumb="Machines"
        tag="Fleet Intelligence"
        title="Machine Fleet"
        description="Monitored industrial machinery inventory, operational running states, and predictive failure risk."
      />

      {/* Fleet Summary KPIs */}
      <div className="mt-6">
        <MachineSummary summary={fleetSummary} />
      </div>

      {/* Search, Filter, Sort Controls */}
      <div className="mt-6">
        <MachineFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          riskFilter={riskFilter}
          onRiskChange={setRiskFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onToggleSortOrder={handleToggleSortOrder}
          onReset={resetFilters}
          totalCount={machines.length}
          filteredCount={filteredMachines.length}
        />
      </div>

      {/* Machine Fleet Table & Responsive Cards */}
      <div className="mt-4">
        <MachineTable
          machines={filteredMachines}
          loading={loading}
          onSelect={handleSelectMachine}
          onReset={resetFilters}
        />
      </div>
    </PageContainer>
  )
}

export default Machines
