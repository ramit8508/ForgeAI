import { AlertTriangle, RotateCcw, RefreshCw } from 'lucide-react'
import Card from '../../ui/Card'
import PredictionHistoryRow from './PredictionHistoryRow'
import PredictionHistoryCard from './PredictionHistoryCard'

/**
 * Prediction History Table & Responsive Card List
 *
 * Supports:
 * - Real skeleton table loading state (no giant page spinner)
 * - Accessible error state with retry
 * - Dedicated empty states (no history vs no search/filter matches)
 * - Responsive desktop table and mobile touch cards
 *
 * @param {{
 *   predictions: Array<Object>,
 *   loading?: boolean,
 *   error?: string | null,
 *   isFiltered?: boolean,
 *   onSelect: (id: string) => void,
 *   onReset: () => void,
 *   onRetry?: () => void
 * }} props
 */
function PredictionHistoryTable({
  predictions = [],
  loading = false,
  error = null,
  isFiltered = false,
  onSelect,
  onReset,
  onRetry,
}) {
  // Error state
  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-10 sm:p-14 text-center">
        <div className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle size={24} strokeWidth={2} aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          Prediction history unavailable
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          We couldn&apos;t load previous prediction records. {error}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-primary"
          >
            <RefreshCw size={15} strokeWidth={2} />
            Retry
          </button>
        )}
      </Card>
    )
  }

  // Loading state: Skeleton rows
  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table
            className="w-full text-left text-sm"
            role="table"
            aria-label="Loading prediction history table"
          >
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 sm:px-5 font-mono text-xs uppercase text-muted-foreground">
                  Time
                </th>
                <th className="px-3 py-3 font-mono text-xs uppercase text-muted-foreground">ID</th>
                <th className="px-3 py-3 font-mono text-xs uppercase text-muted-foreground">
                  Machine
                </th>
                <th className="px-3 py-3 font-mono text-xs uppercase text-muted-foreground">
                  Result
                </th>
                <th className="px-3 py-3 font-mono text-xs uppercase text-muted-foreground">
                  Risk
                </th>
                <th className="px-3 py-3 font-mono text-xs uppercase text-muted-foreground">
                  Probability
                </th>
                <th className="px-3 py-3 font-mono text-xs uppercase text-muted-foreground hidden xl:table-cell">
                  Model
                </th>
                <th className="px-4 py-3 sm:px-5 text-right font-mono text-xs uppercase text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse" aria-hidden="true">
                  <td className="px-4 py-4 sm:px-5">
                    <div className="h-4 w-20 rounded bg-muted" />
                  </td>
                  <td className="px-3 py-4">
                    <div className="h-4 w-14 rounded bg-muted" />
                  </td>
                  <td className="px-3 py-4">
                    <div className="h-4 w-28 rounded bg-muted" />
                  </td>
                  <td className="px-3 py-4">
                    <div className="h-5 w-24 rounded-full bg-muted" />
                  </td>
                  <td className="px-3 py-4">
                    <div className="h-5 w-16 rounded-full bg-muted" />
                  </td>
                  <td className="px-3 py-4">
                    <div className="h-4 w-16 rounded bg-muted" />
                  </td>
                  <td className="px-3 py-4 hidden xl:table-cell">
                    <div className="h-4 w-24 rounded bg-muted" />
                  </td>
                  <td className="px-4 py-4 sm:px-5">
                    <div className="ml-auto h-4 w-10 rounded bg-muted" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    )
  }

  // Empty state
  if (predictions.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-10 sm:p-14 text-center">
        <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <AlertTriangle size={24} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          {isFiltered ? 'No matching predictions' : 'No prediction history'}
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {isFiltered
            ? 'Try adjusting your filters or search query.'
            : 'Prediction records will appear here once predictions are available.'}
        </p>
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-primary"
          >
            <RotateCcw size={15} strokeWidth={2} />
            Reset Filters
          </button>
        )}
      </Card>
    )
  }

  return (
    <div>
      {/* Mobile Card List (visible below md breakpoint) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {predictions.map((pred) => (
          <PredictionHistoryCard key={pred.id} prediction={pred} onSelect={onSelect} />
        ))}
      </div>

      {/* Desktop & Tablet Table (visible on md and up) */}
      <Card className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table
            className="w-full text-left text-sm"
            role="table"
            aria-label="Prediction History Table"
          >
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                >
                  Machine
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                >
                  Result
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                >
                  Risk
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                >
                  Failure Probability
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground hidden xl:table-cell"
                >
                  Model
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-5 text-right font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                >
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {predictions.map((pred) => (
                <PredictionHistoryRow key={pred.id} prediction={pred} onSelect={onSelect} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default PredictionHistoryTable
