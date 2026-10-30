import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info, ExternalLink } from 'lucide-react'
import Card from '../../ui/Card'
import { config } from '../../../lib/config'
import { computeCorrelationPoints } from '../../../utils/monitoringAnalytics'
import { formatProbabilityPercent } from '../../../lib/formatters'
import { cn } from '../../../lib/utils'

const SENSOR_OPTIONS = [
  { id: 'tool_wear', label: 'Tool Wear', unit: 'min', domain: [0, 250] },
  { id: 'torque', label: 'Drive Torque', unit: 'Nm', domain: [20, 80] },
  { id: 'rotational_speed', label: 'Rotational Speed', unit: 'rpm', domain: [1200, 1650] },
  { id: 'temperature_difference', label: 'Temp Difference (ΔT)', unit: 'K', domain: [0, 15] },
  { id: 'process_temperature', label: 'Process Temperature', unit: 'K', domain: [295, 320] },
  { id: 'air_temperature', label: 'Air Temperature', unit: 'K', domain: [294, 308] },
]

/**
 * RiskCorrelationScatterPlot
 *
 * Interactive scatter plot exploring the relationship between model-predicted
 * failure probability (Y axis) and selectable sensor values (X axis).
 *
 * @param {{ machines: Array<Object> }} props
 */
function RiskCorrelationScatterPlot({ machines = [] }) {
  const navigate = useNavigate()
  const [selectedSensor, setSelectedSensor] = useState('tool_wear')
  const [hoveredPoint, setHoveredPoint] = useState(null)

  const activeSensorConfig = SENSOR_OPTIONS.find((s) => s.id === selectedSensor) || SENSOR_OPTIONS[0]

  const points = useMemo(() => {
    return computeCorrelationPoints(machines, selectedSensor)
  }, [machines, selectedSensor])

  const [xMin, xMax] = activeSensorConfig.domain
  const xSpan = xMax - xMin || 1

  const threshold = config.model.threshold // 0.45

  return (
    <Card className="p-5" as="section" aria-labelledby="correlation-plot-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3.5">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
            Multivariate Exploration
          </span>
          <h3 id="correlation-plot-heading" className="mt-0.5 text-base font-semibold text-foreground">
            Failure Risk vs. Sensor Telemetry
          </h3>
        </div>

        {/* Sensor Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap" role="tablist" aria-label="Select X-axis sensor">
          {SENSOR_OPTIONS.map((opt) => {
            const active = selectedSensor === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setSelectedSensor(opt.id)
                  setHoveredPoint(null)
                }}
                className={cn(
                  'rounded px-2.5 py-1 font-mono text-[11px] transition-colors',
                  active
                    ? 'bg-primary/20 text-primary border border-primary/30 font-semibold'
                    : 'text-muted-foreground hover:bg-muted/50 border border-transparent'
                )}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
        Plotting predicted failure probability (%) against {activeSensorConfig.label} ({activeSensorConfig.unit}).
      </p>

      {/* SVG Scatter Plot Canvas */}
      <div className="mt-5 relative bg-background/50 rounded-lg border border-border/60 p-4">
        {/* Y Axis Label */}
        <div className="absolute left-2 top-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
          Failure Probability (Y)
        </div>

        {/* X Axis Label */}
        <div className="absolute right-4 bottom-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
          {activeSensorConfig.label} [{activeSensorConfig.unit}] (X) →
        </div>

        <svg
          viewBox="0 0 600 280"
          className="w-full h-64 overflow-visible"
          role="img"
          aria-label={`Scatter plot of failure probability vs ${activeSensorConfig.label}`}
        >
          {/* Background Grid Lines */}
          <line x1="40" y1="20" x2="580" y2="20" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
          <line x1="40" y1="75" x2="580" y2="75" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
          <line x1="40" y1="130" x2="580" y2="130" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
          <line x1="40" y1="185" x2="580" y2="185" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
          <line x1="40" y1="240" x2="580" y2="240" stroke="currentColor" strokeOpacity="0.2" />

          {/* 45% Threshold Reference Line */}
          {(() => {
            const yThreshold = 240 - threshold * 220
            return (
              <g>
                <line
                  x1="40"
                  y1={yThreshold}
                  x2="580"
                  y2={yThreshold}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.6"
                />
                <text x="585" y={yThreshold + 3} fill="#38bdf8" fontSize="9" fontFamily="monospace">
                  45% Cutoff
                </text>
              </g>
            )
          })()}

          {/* Y-Axis tick labels */}
          <text x="35" y="24" fill="currentColor" fillOpacity="0.6" fontSize="9" fontFamily="monospace" textAnchor="end">100%</text>
          <text x="35" y="79" fill="currentColor" fillOpacity="0.6" fontSize="9" fontFamily="monospace" textAnchor="end">75%</text>
          <text x="35" y="134" fill="currentColor" fillOpacity="0.6" fontSize="9" fontFamily="monospace" textAnchor="end">50%</text>
          <text x="35" y="189" fill="currentColor" fillOpacity="0.6" fontSize="9" fontFamily="monospace" textAnchor="end">25%</text>
          <text x="35" y="244" fill="currentColor" fillOpacity="0.6" fontSize="9" fontFamily="monospace" textAnchor="end">0%</text>

          {/* X-Axis tick labels */}
          <text x="40" y="258" fill="currentColor" fillOpacity="0.6" fontSize="9" fontFamily="monospace" textAnchor="start">{xMin}</text>
          <text x="310" y="258" fill="currentColor" fillOpacity="0.6" fontSize="9" fontFamily="monospace" textAnchor="middle">{((xMin + xMax) / 2).toFixed(0)}</text>
          <text x="580" y="258" fill="currentColor" fillOpacity="0.6" fontSize="9" fontFamily="monospace" textAnchor="end">{xMax}</text>

          {/* Data Points */}
          {points.map((p) => {
            const xVal = Math.max(xMin, Math.min(xMax, p.sensorValue))
            const cx = 40 + ((xVal - xMin) / xSpan) * 540
            const cy = 240 - p.failureProbability * 220
            const isHovered = hoveredPoint?.machineId === p.machineId

            const fill = p.riskLevel === 'HIGH'
              ? '#ef4444'
              : p.riskLevel === 'MEDIUM'
                ? '#f59e0b'
                : '#10b981'

            return (
              <g
                key={p.machineId}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => navigate(`/machines/${p.machineId}`)}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 7 : 5}
                  fill={fill}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                  className={cn('transition-all', isHovered ? 'opacity-100 ring-2' : 'opacity-85 hover:opacity-100')}
                />
                {isHovered && (
                  <text
                    x={cx}
                    y={cy - 10}
                    fill="#f8fafc"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {p.machineId} ({formatProbabilityPercent(p.failureProbability)})
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Point Inspector & Correlation Disclosure */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono border-t border-border/60 pt-3">
        {hoveredPoint ? (
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">{hoveredPoint.machineId}:</span>
            <span className="text-foreground">{hoveredPoint.machineName}</span>
            <span className="text-muted-foreground">•</span>
            <span>{activeSensorConfig.label}: <strong className="text-foreground">{hoveredPoint.sensorValue.toFixed(1)} {activeSensorConfig.unit}</strong></span>
            <span className="text-muted-foreground">•</span>
            <span>Prob: <strong className="text-primary">{formatProbabilityPercent(hoveredPoint.failureProbability)}</strong> ({hoveredPoint.riskLevel})</span>
            <ExternalLink size={12} className="text-primary cursor-pointer" onClick={() => navigate(`/machines/${hoveredPoint.machineId}`)} />
          </div>
        ) : (
          <span className="text-muted-foreground">
            Hover or click on any asset point to view machine telemetry and navigate to diagnostics.
          </span>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Info size={13} className="text-primary shrink-0" aria-hidden="true" />
          <span>Exploratory correlation, not proof of single-factor causality.</span>
        </div>
      </div>
    </Card>
  )
}

export default RiskCorrelationScatterPlot
