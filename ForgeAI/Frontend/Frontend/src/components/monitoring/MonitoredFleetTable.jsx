import { Link, useNavigate } from 'react-router-dom'
import { Search, X, SlidersHorizontal, ArrowRight, Eye } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import RiskBadge from '../ui/RiskBadge'
import ProbabilityIndicator from '../ui/ProbabilityIndicator'
import MachineStatusBadge from '../machines/MachineStatusBadge'
import { MONITORING_FILTER_TABS } from '../../hooks/useMonitoring'
import { formatSensorReading } from '../../lib/formatters'
import { cn } from '../../lib/utils'

/**
 * MonitoredFleetTable
 *
 * Searchable, filterable operational overview of all monitored machines.
 */
function MonitoredFleetTable({
  machines = [],
  totalCount = 0,
  searchQuery = '',
  onSearchChange,
  filterTab = MONITORING_FILTER_TABS.ALL,
  onFilterTabChange,
  onResetFilters,
  metrics,
}) {
  const navigate = useNavigate()

  const tabs = [
    { id: MONITORING_FILTER_TABS.ALL, label: 'All Fleet', count: totalCount },
    { id: MONITORING_FILTER_TABS.HIGH_RISK, label: 'High Risk', count: metrics?.highRiskCount ?? 0 },
    {
      id: MONITORING_FILTER_TABS.WARNING_CRITICAL,
      label: 'Warning / Critical',
      count: (metrics?.statusDistribution?.warning ?? 0) + (metrics?.statusDistribution?.critical ?? 0),
    },
    { id: MONITORING_FILTER_TABS.OPERATIONAL, label: 'Operational', count: metrics?.statusDistribution?.operational ?? 0 },
    { id: MONITORING_FILTER_TABS.OFFLINE, label: 'Offline', count: metrics?.statusDistribution?.offline ?? 0 },
  ]

  const isFiltered = searchQuery.trim() !== '' || filterTab !== MONITORING_FILTER_TABS.ALL

  return (
    <Card className="overflow-hidden" as="section" aria-labelledby="fleet-table-heading">
      {/* Table Header with Title & Total */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/80 px-5 py-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Inventory Observability
          </span>
          <h2 id="fleet-table-heading" className="mt-0.5 text-base font-semibold text-foreground">
            Monitored Machine Registry
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{machines.length}</strong> of {totalCount} machines
          </span>
          {isFiltered && (
            <Button
              type="button"
              variant="ghost"
              onClick={onResetFilters}
              className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              <X size={12} aria-hidden="true" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="border-b border-border/70 bg-background/50 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by machine ID, name, or location..."
              className={cn(
                'w-full rounded-md border border-border bg-background py-1.5 pl-9 pr-8 text-xs text-foreground',
                'placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
              )}
              aria-label="Search monitored machines"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter machines by status or risk">
            {tabs.map((tab) => {
              const active = filterTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onFilterTabChange(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono transition-colors',
                    active
                      ? 'bg-primary/15 text-primary border border-primary/30 font-semibold'
                      : 'text-muted-foreground hover:bg-accent/40 border border-transparent',
                  )}
                >
                  <span>{tab.label}</span>
                  <span className={cn('text-[10px] px-1 rounded', active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground')}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Table Content */}
      {machines.length === 0 ? (
        <div className="p-12 text-center">
          <div className="grid size-12 place-items-center rounded-lg border border-border bg-secondary/30 mx-auto text-muted-foreground">
            <SlidersHorizontal size={20} aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-foreground">No matching machines</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            No monitored machines match your current search query or filter selection.
          </p>
          <div className="mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onResetFilters}
              className="text-xs h-8 px-3"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-xs" aria-label="Monitored Fleet Table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-5 py-3 text-left font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Machine
                </th>
                <th className="px-3 py-3 text-left font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Location
                </th>
                <th className="px-3 py-3 text-left font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Status
                </th>
                <th className="px-3 py-3 text-left font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  AI Risk
                </th>
                <th className="px-3 py-3 text-left font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Failure Probability
                </th>
                <th className="px-3 py-3 text-left font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Latest Telemetry
                </th>
                <th className="px-4 py-3 text-right font-mono font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {machines.map((machine) => {
                const sensors = machine.sensors || {}
                return (
                  <tr
                    key={machine.id}
                    className="transition-colors hover:bg-accent/40"
                  >
                    {/* Machine ID & Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col">
                        <Link
                          to={`/machines/${machine.id}`}
                          className="font-mono font-bold text-foreground hover:text-primary transition-colors hover:underline"
                        >
                          {machine.id}
                        </Link>
                        <span className="text-muted-foreground truncate max-w-[200px]" title={machine.name}>
                          {machine.name}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-3 py-3.5 font-mono text-muted-foreground">
                      {machine.location || '—'}
                    </td>

                    {/* Physical Status */}
                    <td className="px-3 py-3.5">
                      <MachineStatusBadge status={machine.status} />
                    </td>

                    {/* Risk Level */}
                    <td className="px-3 py-3.5">
                      <RiskBadge level={machine.riskLevel} />
                    </td>

                    {/* Failure Probability */}
                    <td className="px-3 py-3.5 w-44">
                      <ProbabilityIndicator
                        probability={machine.failureProbability}
                        riskLevel={machine.riskLevel}
                      />
                    </td>

                    {/* Telemetry Snapshot */}
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                        <span title="Spindle Speed">{formatSensorReading('rotational_speed', sensors.rotational_speed).fullString}</span>
                        <span>·</span>
                        <span title="Drive Torque">{formatSensorReading('torque', sensors.torque).fullString}</span>
                        <span>·</span>
                        <span title="Tool Wear">{formatSensorReading('tool_wear', sensors.tool_wear).fullString}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate(`/machines/${machine.id}`)}
                        className="h-7 px-2.5 text-xs gap-1"
                        aria-label={`View diagnostics for ${machine.id}`}
                      >
                        <Eye size={12} aria-hidden="true" />
                        <span>Diagnostics</span>
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Table Footer */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3 bg-card/40 text-xs text-muted-foreground font-mono">
        <span>Simulated machine telemetry snapshot records</span>
        <Link
          to="/machines"
          className="flex items-center gap-1 text-primary hover:underline"
        >
          <span>Open Fleet Management</span>
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </Card>
  )
}

export default MonitoredFleetTable
