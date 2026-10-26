import { ChevronRight, MapPin, Clock } from 'lucide-react'
import Card from '../ui/Card'
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
 * Mobile Machine Card
 *
 * Dedicated touch-friendly card representation for mobile viewports,
 * avoiding squished desktop tables and preventing horizontal overflow.
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
function MachineCard({ machine, onSelect }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(machine.id)
    }
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(machine.id)}
      onKeyDown={handleKeyDown}
      aria-label={`Inspect machine ${machine.id}: ${machine.name}`}
      className="group relative cursor-pointer p-4 transition-all hover:border-primary/40 hover:bg-card/90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Header: Machine ID + Display Name */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="font-mono text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {machine.id}
          </span>
          <h3 className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {machine.name}
          </h3>
        </div>
        <span className="grid size-7 place-items-center rounded bg-muted text-muted-foreground group-hover:text-primary transition-colors shrink-0">
          <ChevronRight size={16} strokeWidth={2} />
        </span>
      </div>

      {/* Badges: Status and Risk */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <MachineStatusBadge status={machine.status} />
        <RiskBadge level={machine.riskLevel} />
      </div>

      {/* Failure Risk probability */}
      <div className="mt-4 rounded-md border border-border/70 bg-background/60 p-2.5">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block mb-1">
          Predicted Failure Risk
        </span>
        <ProbabilityIndicator
          probability={machine.failureProbability}
          riskLevel={machine.riskLevel}
        />
      </div>

      {/* Metadata footer: Location & Last Prediction */}
      <div className="mt-3.5 flex flex-col gap-1.5 border-t border-border/50 pt-2.5 text-xs text-muted-foreground font-mono">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} strokeWidth={2} className="shrink-0 text-muted-foreground" />
          <span className="truncate">{machine.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} strokeWidth={2} className="shrink-0 text-muted-foreground" />
          <span>Last prediction: {formatPredictionTime(machine.lastPredictionAt)}</span>
        </div>
      </div>
    </Card>
  )
}

export default MachineCard
