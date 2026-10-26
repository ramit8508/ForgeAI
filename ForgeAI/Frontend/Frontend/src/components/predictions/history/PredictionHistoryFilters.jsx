import { Search, X, ArrowUpDown, RotateCcw } from 'lucide-react'

/**
 * Prediction History Filters & Search Controls
 *
 * Provides industrial-grade client-side search, multi-axis filtering (Machine, Risk, Result, Date),
 * and sorting by technical metrics.
 *
 * @param {{
 *   searchQuery: string,
 *   onSearchChange: (q: string) => void,
 *   machineFilter: string,
 *   onMachineChange: (m: string) => void,
 *   availableMachines: Array<{ id: string, name: string }>,
 *   riskFilter: string,
 *   onRiskChange: (r: string) => void,
 *   resultFilter: string,
 *   onResultChange: (res: string) => void,
 *   dateRange: string,
 *   onDateRangeChange: (d: string) => void,
 *   sortBy: string,
 *   onSortByChange: (s: string) => void,
 *   sortOrder: 'asc'|'desc',
 *   onToggleSortOrder: () => void,
 *   onReset: () => void,
 *   totalCount: number,
 *   filteredCount: number
 * }} props
 */
function PredictionHistoryFilters({
  searchQuery,
  onSearchChange,
  machineFilter,
  onMachineChange,
  availableMachines = [],
  riskFilter,
  onRiskChange,
  resultFilter,
  onResultChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  onReset,
  totalCount,
  filteredCount,
}) {
  const isFiltered =
    searchQuery.trim() !== '' ||
    machineFilter !== 'ALL' ||
    riskFilter !== 'ALL' ||
    resultFilter !== 'ALL' ||
    dateRange !== 'ALL' ||
    sortBy !== 'newest' ||
    sortOrder !== 'desc'

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:p-4">
      {/* Top row: Search input + Results count & Reset */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <label htmlFor="history-search-input" className="sr-only">
            Search predictions by ID, machine ID, or machine name
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <Search size={16} strokeWidth={2} aria-hidden="true" />
          </div>
          <input
            id="history-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by prediction ID, machine ID, or machine name..."
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              aria-label="Clear search query"
            >
              <X size={15} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono text-muted-foreground">
          <span>
            SHOWING <strong className="text-foreground font-semibold">{filteredCount}</strong> OF{' '}
            <strong className="text-foreground font-semibold">{totalCount}</strong> PREDICTIONS
          </span>
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded border border-border-strong px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-primary"
              aria-label="Reset all search and filter controls"
            >
              <RotateCcw size={12} strokeWidth={2} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Multi-axis filter controls row */}
      <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        {/* Machine Filter */}
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="history-machine-filter"
            className="hidden font-mono text-xs uppercase tracking-wider text-muted-foreground md:inline"
          >
            Machine:
          </label>
          <select
            id="history-machine-filter"
            value={machineFilter}
            onChange={(e) => onMachineChange(e.target.value)}
            aria-label="Filter predictions by machine"
            className="w-full sm:w-auto rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground transition-colors focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Machines</option>
            {availableMachines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} — {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Risk Filter */}
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="history-risk-filter"
            className="hidden font-mono text-xs uppercase tracking-wider text-muted-foreground md:inline"
          >
            Risk:
          </label>
          <select
            id="history-risk-filter"
            value={riskFilter}
            onChange={(e) => onRiskChange(e.target.value)}
            aria-label="Filter predictions by risk level"
            className="w-full sm:w-auto rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground transition-colors focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
        </div>

        {/* Result Filter */}
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="history-result-filter"
            className="hidden font-mono text-xs uppercase tracking-wider text-muted-foreground md:inline"
          >
            Outcome:
          </label>
          <select
            id="history-result-filter"
            value={resultFilter}
            onChange={(e) => onResultChange(e.target.value)}
            aria-label="Filter predictions by result outcome"
            className="w-full sm:w-auto rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground transition-colors focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Outcomes</option>
            <option value="FAILURE">Failure Detected</option>
            <option value="NO_FAILURE">No Failure</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="history-date-filter"
            className="hidden font-mono text-xs uppercase tracking-wider text-muted-foreground md:inline"
          >
            Time Window:
          </label>
          <select
            id="history-date-filter"
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            aria-label="Filter predictions by time window"
            className="w-full sm:w-auto rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground transition-colors focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today (24h)</option>
            <option value="7_DAYS">Last 7 Days</option>
            <option value="30_DAYS">Last 30 Days</option>
          </select>
        </div>

        {/* Sort Selection */}
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="history-sort-select"
            className="hidden font-mono text-xs uppercase tracking-wider text-muted-foreground md:inline"
          >
            Sort:
          </label>
          <select
            id="history-sort-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            aria-label="Sort predictions by attribute"
            className="w-full sm:w-auto rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground transition-colors focus:border-primary focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="failureProbability">Failure Probability</option>
            <option value="risk">Risk Level</option>
          </select>
        </div>

        {/* Sort Order Toggle (for numeric/risk attributes) */}
        {(sortBy === 'failureProbability' || sortBy === 'risk') && (
          <button
            type="button"
            onClick={onToggleSortOrder}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-primary"
            aria-label={`Toggle sort order (currently ${sortOrder === 'asc' ? 'ascending' : 'descending'})`}
            title={`Currently ${sortOrder === 'asc' ? 'Ascending' : 'Descending'} — click to reverse`}
          >
            <ArrowUpDown size={13} strokeWidth={2} />
            <span className="uppercase">{sortOrder === 'asc' ? 'ASC' : 'DESC'}</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default PredictionHistoryFilters
