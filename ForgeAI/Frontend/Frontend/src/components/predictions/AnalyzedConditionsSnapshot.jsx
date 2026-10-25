import { Activity, Flame, Gauge, Wrench, ArrowRightLeft } from 'lucide-react'
import {
  formatSensorReading,
  calculateTemperatureDifference,
} from '../../lib/formatters'
import { cn } from '../../lib/utils'

/**
 * ForgeAI — AnalyzedConditionsSnapshot (Part 6)
 *
 * Compact technical data layout capturing the exact sensor inputs used for
 * model inference. Provides full operational traceability:
 *
 * Machine Conditions (5 sensors + 1 derived) -> AI Prediction -> Risk Assessment
 *
 * Note: Temperature Difference is strictly a frontend-derived feature
 * (Process Temp - Air Temp) calculated locally for operator awareness.
 *
 * @param {{
 *   snapshot: {
 *     air_temperature: number|string,
 *     process_temperature: number|string,
 *     rotational_speed: number|string,
 *     torque: number|string,
 *     tool_wear: number|string,
 *   },
 *   className?: string
 * }} props
 */
function AnalyzedConditionsSnapshot({ snapshot, className }) {
  if (!snapshot) return null

  const tempDiff = calculateTemperatureDifference(
    snapshot.process_temperature,
    snapshot.air_temperature,
  )

  const metrics = [
    {
      id: 'air_temperature',
      label: 'Air Temperature',
      icon: Flame,
      iconColor: 'text-warning',
      ...formatSensorReading('air_temperature', snapshot.air_temperature),
      isDerived: false,
    },
    {
      id: 'process_temperature',
      label: 'Process Temperature',
      icon: Flame,
      iconColor: 'text-warning',
      ...formatSensorReading('process_temperature', snapshot.process_temperature),
      isDerived: false,
    },
    {
      id: 'temperature_difference',
      label: 'Temperature Difference',
      icon: ArrowRightLeft,
      iconColor: 'text-primary',
      ...formatSensorReading('temperature_difference', tempDiff),
      isDerived: true,
      derivedTag: 'Derived (ΔT)',
    },
    {
      id: 'rotational_speed',
      label: 'Rotational Speed',
      icon: Gauge,
      iconColor: 'text-primary',
      ...formatSensorReading('rotational_speed', snapshot.rotational_speed),
      isDerived: false,
    },
    {
      id: 'torque',
      label: 'Torque',
      icon: Gauge,
      iconColor: 'text-primary',
      ...formatSensorReading('torque', snapshot.torque),
      isDerived: false,
    },
    {
      id: 'tool_wear',
      label: 'Tool Wear',
      icon: Wrench,
      iconColor: 'text-warning',
      ...formatSensorReading('tool_wear', snapshot.tool_wear),
      isDerived: false,
    },
  ]

  return (
    <div
      className={cn(
        'rounded-lg border border-border/70 bg-card/60 p-4 sm:p-5',
        className,
      )}
      aria-labelledby="analyzed-conditions-heading"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-primary" aria-hidden="true" />
          <h4
            id="analyzed-conditions-heading"
            className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground"
          >
            Analyzed Conditions
          </h4>
        </div>
        <span className="inline-flex items-center gap-1 rounded bg-secondary/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground border border-border/40">
          Inference Snapshot
        </span>
      </div>

      {/* Dense Technical Data Grid */}
      <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {metrics.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-md border border-border/50 bg-background/50 p-2.5 transition-colors hover:border-border"
            >
              <div className="flex items-center justify-between gap-1 text-[10px] font-mono uppercase tracking-[0.06em] text-muted-foreground">
                <span className="truncate" title={item.label}>
                  {item.label}
                </span>
                <Icon size={12} className={cn('shrink-0 opacity-75', item.iconColor)} aria-hidden="true" />
              </div>

              <div className="mt-1.5 flex items-baseline justify-between gap-1">
                <span className="font-mono text-base font-semibold tracking-tight text-foreground">
                  {item.formattedValue}
                </span>
                <span className="font-mono text-[11px] font-medium text-muted-foreground">
                  {item.unit}
                </span>
              </div>

              {item.isDerived ? (
                <div className="mt-1 flex items-center gap-1">
                  <span className="rounded bg-primary/10 px-1 py-0.2 font-mono text-[9px] font-medium text-primary border border-primary/20">
                    {item.derivedTag}
                  </span>
                </div>
              ) : (
                <div className="mt-1 text-[9px] font-mono text-muted-foreground/60">
                  Calibrated sensor
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Traceability Note */}
      <p className="mt-3 border-t border-border/40 pt-2 font-mono text-[10px] text-muted-foreground/80 leading-relaxed">
        Traceability: Telemetry values locked at time of inference. Temperature Difference is a frontend-derived delta (Process Temp − Air Temp).
      </p>
    </div>
  )
}

export default AnalyzedConditionsSnapshot
