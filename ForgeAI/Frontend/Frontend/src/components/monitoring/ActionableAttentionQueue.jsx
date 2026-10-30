import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Bot, ShieldCheck, Thermometer, Activity, Timer } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import RiskBadge from '../ui/RiskBadge'
import ProbabilityIndicator from '../ui/ProbabilityIndicator'
import MachineStatusBadge from '../machines/MachineStatusBadge'
import { calculateTemperatureDifference, formatSensorReading } from '../../lib/formatters'

/**
 * ActionableAttentionQueue
 *
 * Highlights machines that require immediate maintenance or predictive investigation
 * (High ML Failure Risk or Critical/Warning operational states).
 *
 * @param {{
 *   attentionQueue: Array<Object>,
 *   onSelectMachine?: (machineId: string) => void
 * }} props
 */
function ActionableAttentionQueue({ attentionQueue = [], onSelectMachine }) {
  const navigate = useNavigate()

  const handleRunPrediction = (machine) => {
    navigate('/predictions', {
      state: {
        machineId: machine.id,
        machineName: machine.name,
        sensorValues: machine.sensors,
      },
    })
  }

  return (
    <Card className="overflow-hidden" as="section" aria-labelledby="attention-queue-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/80 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-destructive">
              Action Required
            </span>
            <span className="rounded-full bg-destructive/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-destructive border border-destructive/25">
              {attentionQueue.length} Flagged
            </span>
          </div>
          <h2 id="attention-queue-heading" className="mt-0.5 text-base font-semibold text-foreground">
            High-Risk &amp; Critical Attention Queue
          </h2>
        </div>

        <Link
          to="/machines"
          className="flex items-center gap-1 font-mono text-xs text-primary hover:underline"
        >
          <span>View all machines</span>
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>

      {attentionQueue.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="grid size-12 place-items-center rounded-full bg-success/10 text-success border border-success/30">
            <ShieldCheck size={24} aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-foreground">Nominal Fleet Operating State</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            No machines currently exceed high-risk thresholds or report critical operational warnings.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {attentionQueue.map((machine) => {
            const sensors = machine.sensors || {}
            const tempDiff = calculateTemperatureDifference(
              sensors.process_temperature,
              sensors.air_temperature,
            )

            return (
              <div
                key={machine.id}
                className="p-5 transition-colors hover:bg-accent/30"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Machine Identification & State */}
                  <div className="space-y-1.5 min-w-[240px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/machines/${machine.id}`}
                        className="font-mono text-sm font-bold text-foreground hover:text-primary transition-colors hover:underline"
                      >
                        {machine.id}
                      </Link>
                      <MachineStatusBadge status={machine.status} />
                      <RiskBadge level={machine.riskLevel} />
                    </div>

                    <h3 className="text-sm font-medium text-foreground">{machine.name}</h3>
                    <p className="font-mono text-xs text-muted-foreground">{machine.location} · {machine.type}</p>
                    {machine.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 italic max-w-lg">
                        {machine.description}
                      </p>
                    )}
                  </div>

                  {/* Telemetry Snapshot Highlights */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 rounded-lg border border-border/60 bg-background/50 p-3 text-xs">
                    <div>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground uppercase">
                        <Timer size={12} className="text-muted-foreground" aria-hidden="true" />
                        Tool Wear
                      </span>
                      <div className="mt-1 font-mono font-semibold text-foreground">
                        {formatSensorReading('tool_wear', sensors.tool_wear).fullString}
                      </div>
                    </div>
                    <div>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground uppercase">
                        <Activity size={12} className="text-muted-foreground" aria-hidden="true" />
                        Torque
                      </span>
                      <div className="mt-1 font-mono font-semibold text-foreground">
                        {formatSensorReading('torque', sensors.torque).fullString}
                      </div>
                    </div>
                    <div>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground uppercase">
                        <Thermometer size={12} className="text-muted-foreground" aria-hidden="true" />
                        Temp ΔT
                      </span>
                      <div className="mt-1 font-mono font-semibold text-foreground">
                        {formatSensorReading('temperature_difference', tempDiff).fullString}
                      </div>
                    </div>
                  </div>

                  {/* Risk Indicator & Quick Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:flex-col lg:items-end">
                    <div className="w-full sm:w-44">
                      <ProbabilityIndicator
                        probability={machine.failureProbability}
                        riskLevel={machine.riskLevel}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          if (onSelectMachine) onSelectMachine(machine.id)
                          else navigate(`/machines/${machine.id}`)
                        }}
                        className="text-xs h-8 px-3"
                      >
                        Diagnostics
                      </Button>

                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => handleRunPrediction(machine)}
                        className="text-xs h-8 px-3 gap-1.5"
                        title="Analyze current telemetry snapshot in prediction workspace"
                      >
                        <Bot size={13} aria-hidden="true" />
                        <span>Predict</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export default ActionableAttentionQueue
