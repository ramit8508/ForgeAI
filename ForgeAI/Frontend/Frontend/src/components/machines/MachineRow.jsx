import { ChevronRight } from 'lucide-react'
import MachineStatusBadge from './MachineStatusBadge'
import RiskBadge from '../ui/RiskBadge'
import ProbabilityIndicator from '../ui/ProbabilityIndicator'

function formatPredictionTime(iso) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch {
    return '—'
  }
}

/**
 * Desktop & Tablet Machine Table Row
 *
 * @param {{
 *   machine: {
 *     id: string,
 *     name: string,
 *     status: string,
 *     riskLevel: 'LOW'|'MEDIUM'|'HIGH',
 *     failureProbability: number,
 *     lastPredictionAt: string,
 *     location: string,
 *     operatingHours?: number
 *   },
 *   onSelect: (machineId: string) => void
 * }} props
 */
function MachineRow({ machine, onSelect }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(machine.id)
    }
  }

  return (
    <tr
      onClick={() => onSelect(machine.id)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="row"
      aria-label={`Machine ${machine.id}: ${machine.name}, Status ${machine.status}, Risk ${machine.riskLevel}`}
      className="group cursor-pointer border-b border-border transition-colors hover:bg-accent/40 focus-visible:bg-accent/40 focus-visible:outline-none"
    >
      {/* Machine Identity */}
      <td className="px-4 py-3.5 sm:px-5">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {machine.id}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[220px] lg:max-w-[260px]">
            {machine.name}
          </span>
        </div>
      </td>

      {/* Operational Status */}
      <td className="px-3 py-3.5">
        <MachineStatusBadge status={machine.status} />
      </td>

      {/* Failure Risk */}
      <td className="px-3 py-3.5">
        <RiskBadge level={machine.riskLevel} />
      </td>

      {/* Failure Probability */}
      <td className="px-3 py-3.5">
        <ProbabilityIndicator
          probability={machine.failureProbability}
          riskLevel={machine.riskLevel}
        />
      </td>

      {/* Last Prediction */}
      <td className="px-3 py-3.5 hidden md:table-cell">
        <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
          {formatPredictionTime(machine.lastPredictionAt)}
        </span>
      </td>

      {/* Location */}
      <td className="px-3 py-3.5 hidden lg:table-cell">
        <span className="text-xs text-secondary-foreground truncate max-w-[140px] block">
          {machine.location}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5 text-right sm:px-5">
        <span className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
          <span className="hidden sm:inline">Inspect</span>
          <ChevronRight size={15} strokeWidth={2} />
        </span>
      </td>
    </tr>
  )
}

export default MachineRow
