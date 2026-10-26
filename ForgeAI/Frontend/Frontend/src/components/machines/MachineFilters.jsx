import { Search, X, ArrowUpDown, RotateCcw } from 'lucide-react'

/**
 * Machine Fleet Filters & Controls
 *
 * Provides industrial-grade client-side search, multi-axis filtering (Risk & Status),
 * sorting by technical metrics, and filter resetting.
 *
 * @param {{
 *   searchQuery: string,
 *   onSearchChange: (query: string) => void,
 *   riskFilter: string,
 *   onRiskChange: (risk: string) => void,
 *   statusFilter: string,
 *   onStatusChange: (status: string) => void,
 *   sortBy: string,
 *   onSortByChange: (sort: string) => void,
 *   sortOrder: 'asc'|'desc',
 *   onToggleSortOrder: () => void,
 *   onReset: () => void,
 *   totalCount: number,
 *   filteredCount: number
 * }} props
 */
function MachineFilters({
  searchQuery,
  onSearchChange,
  riskFilter,
  onRiskChange,
  statusFilter,
  onStatusChange,
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
    riskFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    sortBy !== 'id' ||
    sortOrder !== 'asc'

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:p-4">
      {/* Top bar: Search + Quick stats */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <label htmlFor="machine-search-input" className="sr-only">
            Search machines by ID, name, or location
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <Search size={16} strokeWidth={2} aria-hidden="true" />
          </div>
          <input
            id="machine-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search machines by ID, name, or location..."
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

        {/* Count badge */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono text-muted-foreground">
          <span>
            SHOWING <strong className="text-foreground font-semibold">{filteredCount}</strong> OF{' '}
            <strong className="text-foreground font-semibold">{totalCount}</strong> MACHINES
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

      {/* Controls row: Risk Filter, Status Filter, Sort Selection, Sort Direction */}
      <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        {/* Risk Filter */}
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="risk-filter-select"
            className="hidden font-mono text-xs uppercase tracking-wider text-muted-foreground md:inline"
          >
            Risk:
          </label>
          <select
            id="risk-filter-select"
            value={riskFilter}
            onChange={(e) => onRiskChange(e.target.value)}
            aria-label="Filter machines by risk level"
            className="w-full sm:w-auto rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground transition-colors focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="status-filter-select"
            className="hidden font-mono text-xs uppercase tracking-wider text-muted-foreground md:inline"
          >
            Status:
          </label>
          <select
            id="status-filter-select"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter machines by operational status"
            className="w-full sm:w-auto rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground transition-colors focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL">Critical</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>

        {/* Sort Field */}
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="sort-by-select"
            className="hidden font-mono text-xs uppercase tracking-wider text-muted-foreground md:inline"
          >
            Sort:
          </label>
          <select
            id="sort-by-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            aria-label="Sort machines by attribute"
            className="w-full sm:w-auto rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground transition-colors focus:border-primary focus:outline-none"
          >
            <option value="id">Machine ID</option>
            <option value="failureProbability">Failure Probability</option>
            <option value="risk">Risk Level</option>
            <option value="lastPrediction">Last Prediction</option>
          </select>
        </div>

        {/* Sort Order Toggle */}
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
      </div>
    </div>
  )
}

export default MachineFilters
