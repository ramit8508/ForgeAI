import { useState } from 'react'
import { Thermometer, Gauge, Activity, Timer } from 'lucide-react'
import Card from '../../ui/Card'
import { ENGINEERING_LIMITS } from '../../../utils/monitoringAnalytics'
import { cn } from '../../../lib/utils'

/**
 * SensorTelemetryGrid
 *
 * Multi-chart sensor section for:
 * 1. Drive Torque [Nm]
 * 2. Tool Wear [min]
 * 3. Rotational Speed [rpm]
 * 4. Thermal Variance (Process, Air, ΔT) [K]
 *
 * Strictly visualizes current diagnostic snapshot records without fabricating fake historical points.
 */
function SensorTelemetryGrid({ sensorAnalytics }) {
  const [hoveredPoint, setHoveredPoint] = useState(null)

  if (!sensorAnalytics) return null

  const { airTemp, processTemp, tempDiff, rotationalSpeed, torque, toolWear } = sensorAnalytics

  const sensorCards = [
    {
      id: 'torque',
      label: 'Drive Torque',
      unit: 'Nm',
      icon: Activity,
      stats: torque,
      warningLimit: ENGINEERING_LIMITS.torqueWarning,
      criticalLimit: ENGINEERING_LIMITS.torqueCritical,
      outlierCount: torque.elevatedCount,
      outlierLabel: '≥ 55 Nm strain',
      description: 'Mechanical resistance load on spindle drive motors.',
      domain: [20, 80],
    },
    {
      id: 'toolWear',
      label: 'Tool Wear Accumulation',
      unit: 'min',
      icon: Timer,
      stats: toolWear,
      warningLimit: ENGINEERING_LIMITS.toolWearWarning,
      outlierCount: toolWear.warningCount,
      outlierLabel: '≥ 200 min critical wear',
      description: 'Cumulative contact cutting duration before tool exchange.',
      domain: [0, 260],
    },
    {
      id: 'rotationalSpeed',
      label: 'Rotational Speed',
      unit: 'rpm',
      icon: Gauge,
      stats: rotationalSpeed,
      warningLimit: ENGINEERING_LIMITS.speedMinWarning,
      outlierCount: rotationalSpeed.belowNominalCount,
      outlierLabel: '< 1350 rpm under load',
      description: 'Spindle rotational velocity during active machining cycles.',
      domain: [1200, 1650],
    },
    {
      id: 'thermal',
      label: 'Thermal Variance (ΔT)',
      unit: 'K',
      icon: Thermometer,
      stats: tempDiff,
      warningLimit: ENGINEERING_LIMITS.tempDiffWarning,
      outlierCount: tempDiff.elevatedCount,
      outlierLabel: '≥ 9.5 K gradient',
      description: 'Core heat buildup (Process Temp − Ambient Air Temp).',
      domain: [0, 15],
    },
  ]

  return (
    <Card className="p-5" as="section" aria-labelledby="sensor-telemetry-heading">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
            Diagnostic Telemetry
          </span>
          <h3 id="sensor-telemetry-heading" className="mt-0.5 text-base font-semibold text-foreground">
            Sensor Telemetry Analysis
          </h3>
        </div>

        <span className="font-mono text-[11px] text-muted-foreground">
          Single-point snapshot measurements across active machines
        </span>
      </div>

      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
        Distribution of individual physical sensor readings across the fleet. Shows current snapshot operating points relative to nominal boundaries. Continuous time-series streaming is not connected.
      </p>

      {/* Grid of 4 Compact Sensor Visualizations */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sensorCards.map((sc) => {
          const Icon = sc.icon
          const readings = sc.stats?.readings || []
          const [dMin, dMax] = sc.domain
          const span = dMax - dMin || 1

          return (
            <div
              key={sc.id}
              className="rounded-lg border border-border/70 bg-background/50 p-4 flex flex-col justify-between"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-foreground">
                    {sc.label}
                  </span>
                  <Icon size={15} className="text-primary" aria-hidden="true" />
                </div>

                {/* Main Avg / Range Metric */}
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-xl font-bold text-foreground">
                    {sc.stats.avg ? sc.stats.avg.toFixed(1) : '—'}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {sc.unit} avg
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Min: {sc.stats.min ? sc.stats.min.toFixed(1) : '0'}</span>
                  <span>Max: {sc.stats.max ? sc.stats.max.toFixed(1) : '0'}</span>
                </div>

                {/* Visual Reading Strip */}
                <div className="mt-4 pt-2 border-t border-border/50">
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1">
                    <span>{dMin}</span>
                    <span className="text-warning font-semibold">Limit: {sc.warningLimit}</span>
                    <span>{dMax}</span>
                  </div>

                  {/* Horizontal point track */}
                  <div className="h-6 w-full rounded bg-muted/40 relative flex items-center px-1 overflow-hidden">
                    {/* Warning boundary line */}
                    {sc.warningLimit && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-warning/60 z-10"
                        style={{ left: `${Math.max(0, Math.min(100, ((sc.warningLimit - dMin) / span) * 100))}%` }}
                      />
                    )}

                    {/* Points for each machine */}
                    {readings.map((r) => {
                      const xPct = Math.max(3, Math.min(97, ((r.value - dMin) / span) * 100))
                      const isHovered = hoveredPoint?.id === r.id && hoveredPoint?.sensor === sc.id
                      const isHigh = r.riskLevel === 'HIGH'

                      return (
                        <div
                          key={r.id}
                          className={cn(
                            'absolute size-2.5 rounded-full border transition-all cursor-pointer -translate-x-1/2',
                            isHigh
                              ? 'bg-destructive border-destructive/60'
                              : 'bg-primary border-primary/60',
                            isHovered ? 'scale-150 z-20 ring-2 ring-foreground' : 'opacity-70 hover:opacity-100'
                          )}
                          style={{ left: `${xPct}%` }}
                          onMouseEnter={() => setHoveredPoint({ id: r.id, name: r.name, value: r.value, unit: sc.unit, sensor: sc.id })}
                          onMouseLeave={() => setHoveredPoint(null)}
                          title={`${r.id} (${r.name}): ${r.value.toFixed(1)} ${sc.unit}`}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Footer Strain Counter */}
              <div className="mt-4 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] font-mono">
                <span className={sc.outlierCount > 0 ? 'text-warning font-semibold' : 'text-muted-foreground'}>
                  {sc.outlierCount} {sc.outlierLabel}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Hovered Point Feedback Bar */}
      <div className="mt-4 rounded border border-border/60 bg-muted/20 px-3 py-2 text-xs font-mono min-h-[34px] flex items-center justify-between">
        {hoveredPoint ? (
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">{hoveredPoint.id}:</span>
            <span className="text-foreground">{hoveredPoint.name}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-foreground font-semibold">
              {hoveredPoint.value.toFixed(1)} {hoveredPoint.unit}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">
            Hover over points on any sensor strip to inspect individual machine values.
          </span>
        )}
        <span className="text-muted-foreground text-[10px]">
          Ambient Air: {airTemp.avg.toFixed(1)} K · Core Process: {processTemp.avg.toFixed(1)} K
        </span>
      </div>
    </Card>
  )
}

export default SensorTelemetryGrid
