import { Thermometer, Gauge, Activity, Timer, Zap } from 'lucide-react'
import Card from '../ui/Card'
import { calculateTemperatureDifference, formatSensorReading } from '../../lib/formatters'

/**
 * Machine Current Condition Snapshot
 *
 * Renders latest available telemetry reading snapshot for a monitored machine.
 * Displays standard industrial units (K, rpm, Nm, min) and derived temperature delta.
 *
 * @param {{
 *   sensors: {
 *     air_temperature: number,
 *     process_temperature: number,
 *     rotational_speed: number,
 *     torque: number,
 *     tool_wear: number
 *   }
 * }} props
 */
function MachineConditionSnapshot({ sensors = {} }) {
  const airTemp = sensors.air_temperature || 0
  const processTemp = sensors.process_temperature || 0
  const tempDiff = calculateTemperatureDifference(processTemp, airTemp)
  const rotationalSpeed = sensors.rotational_speed || 0
  const torque = sensors.torque || 0
  const toolWear = sensors.tool_wear || 0

  const items = [
    {
      key: 'air_temperature',
      label: 'Air Temperature',
      reading: formatSensorReading('air_temperature', airTemp),
      icon: Thermometer,
      description: 'Ambient enclosure temperature',
    },
    {
      key: 'process_temperature',
      label: 'Process Temperature',
      reading: formatSensorReading('process_temperature', processTemp),
      icon: Thermometer,
      description: 'Active cycle core temperature',
    },
    {
      key: 'temperature_difference',
      label: 'Temp Difference (ΔT)',
      reading: formatSensorReading('temperature_difference', tempDiff),
      icon: Zap,
      description: 'Derived thermal variance (Process - Air)',
      highlight: true,
    },
    {
      key: 'rotational_speed',
      label: 'Rotational Speed',
      reading: formatSensorReading('rotational_speed', rotationalSpeed),
      icon: Gauge,
      description: 'Spindle rotational velocity',
    },
    {
      key: 'torque',
      label: 'Drive Torque',
      reading: formatSensorReading('torque', torque),
      icon: Activity,
      description: 'Mechanical resistance load',
    },
    {
      key: 'tool_wear',
      label: 'Tool Wear',
      reading: formatSensorReading('tool_wear', toolWear),
      icon: Timer,
      description: 'Cumulative contact runtime',
    },
  ]

  return (
    <Card className="p-5 sm:p-6" as="section" aria-labelledby="condition-snapshot-heading">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
            Telemetry Snapshot
          </span>
          <h2 id="condition-snapshot-heading" className="mt-1 text-base font-semibold text-foreground">
            Current Sensor Condition
          </h2>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          Single sensor baseline reading
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.key}
              className={`rounded-lg border p-3.5 transition-colors ${
                item.highlight
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border/80 bg-background/50'
              }`}
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="font-mono text-xs uppercase tracking-wider">{item.label}</span>
                <Icon size={14} strokeWidth={2} className={item.highlight ? 'text-primary' : ''} />
              </div>

              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground tabular-nums">
                  {item.reading.formattedValue}
                </span>
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  {item.reading.unit}
                </span>
              </div>

              <p className="mt-1.5 text-xs text-muted-foreground truncate">{item.description}</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default MachineConditionSnapshot
