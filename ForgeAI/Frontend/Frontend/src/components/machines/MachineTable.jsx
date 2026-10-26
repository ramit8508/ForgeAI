import { AlertCircle, RotateCcw, Loader2 } from 'lucide-react'
import Card from '../ui/Card'
import MachineRow from './MachineRow'
import MachineCard from './MachineCard'

/**
 * Machine Fleet Table & Responsive List
 *
 * Desktop/Tablet: Dense, technical industrial table.
 * Mobile (<768px): Dedicated touch card representation preventing horizontal overflow.
 *
 * @param {{
 *   machines: Array<Object>,
 *   loading?: boolean,
 *   onSelect: (machineId: string) => void,
 *   onReset: () => void
 * }} props
 */
function MachineTable({ machines = [], loading = false, onSelect, onReset }) {
  if (loading) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <Loader2 size={28} className="animate-spin text-primary" aria-hidden="true" />
        <span className="mt-3 font-mono text-sm text-muted-foreground">
          Loading monitored machine fleet...
        </span>
      </Card>
    )
  }

  if (machines.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-10 sm:p-14 text-center">
        <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <AlertCircle size={24} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">No machines found</h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          No monitored machines match your current search and filter criteria. Try adjusting your
          search query or resetting filters.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-primary"
        >
          <RotateCcw size={15} strokeWidth={2} />
          Reset Filters
        </button>
      </Card>
    )
  }

  return (
    <div>
      {/* Mobile Card List (visible below md breakpoint) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} onSelect={onSelect} />
        ))}
      </div>

      {/* Desktop & Tablet Table (visible on md and up) */}
      <Card className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" role="table" aria-label="Machine Fleet Table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th
                  scope="col"
                  className="px-4 py-3 sm:px-5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                >
                  Machine
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                >
                  Status
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
                  className="px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground hidden md:table-cell"
                >
                  Last Prediction
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell"
                >
                  Location
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
              {machines.map((machine) => (
                <MachineRow key={machine.id} machine={machine} onSelect={onSelect} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default MachineTable
