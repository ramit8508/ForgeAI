import { useState } from 'react'
import { Clock } from 'lucide-react'
import Card from '../../ui/Card'
import { cn } from '../../../lib/utils'

/**
 * PredictionTimelineChart
 *
 * Visualizes prediction event volume over time from actual historical timestamps.
 * Distinguishes failure predictions from non-failure predictions without interpolating fake points.
 *
 * @param {{
 *   timeline: Array<{ periodLabel: string, timestamp: string, total: number, failures: number, nonFailures: number, highRisk: number }>
 * }} props
 */
function PredictionTimelineChart({ timeline = [] }) {
  const [activeItem, setActiveItem] = useState(null)
  const maxTotal = Math.max(1, ...timeline.map((t) => t.total))

  return (
    <Card className="p-5" as="section" aria-labelledby="timeline-heading">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
              Temporal Inferences
            </span>
            <span className="rounded bg-warning/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-warning border border-warning/30">
              Demo Data
            </span>
          </div>
          <h3 id="timeline-heading" className="mt-0.5 text-base font-semibold text-foreground">
            Prediction Activity Over Time
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-destructive" aria-hidden="true" />
            Failure Predicted
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-success" aria-hidden="true" />
            No Failure
          </span>
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
        Aggregated historical inference events grouped by evaluation timestamp window. Shows breakdown between failure predictions and nominal evaluations.
      </p>

      {timeline.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground">
          No timestamped prediction activity recorded.
        </div>
      ) : (
        <div className="mt-5">
          <div className="h-40 flex items-end gap-2 sm:gap-3 px-2 pb-6 border-b border-border/60">
            {timeline.map((item) => {
              const heightPct = (item.total / maxTotal) * 100
              const failurePct = item.total > 0 ? (item.failures / item.total) * 100 : 0
              const nonFailurePct = item.total > 0 ? (item.nonFailures / item.total) * 100 : 0
              const isHovered = activeItem?.periodLabel === item.periodLabel

              return (
                <div
                  key={item.periodLabel}
                  className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer"
                  onMouseEnter={() => setActiveItem(item)}
                  onMouseLeave={() => setActiveItem(null)}
                  role="figure"
                  aria-label={`${item.periodLabel}: ${item.total} predictions (${item.failures} failures, ${item.nonFailures} no failure)`}
                >
                  {/* Total on top */}
                  <span className={cn(
                    'font-mono text-[10px] font-semibold mb-1',
                    isHovered ? 'text-primary font-bold' : 'text-muted-foreground'
                  )}>
                    {item.total}
                  </span>

                  {/* Stacked bar: Failures on top (red), Non-failures on bottom (green) */}
                  <div
                    className={cn(
                      'w-full max-w-[40px] rounded overflow-hidden flex flex-col justify-end transition-all duration-300',
                      isHovered ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''
                    )}
                    style={{ height: `${Math.max(heightPct, 6)}%` }}
                  >
                    {item.failures > 0 && (
                      <div
                        className="bg-destructive transition-all"
                        style={{ height: `${failurePct}%` }}
                        title={`${item.failures} failures`}
                      />
                    )}
                    {item.nonFailures > 0 && (
                      <div
                        className="bg-success/80 transition-all"
                        style={{ height: `${nonFailurePct}%` }}
                        title={`${item.nonFailures} no failure`}
                      />
                    )}
                  </div>

                  {/* X-axis label */}
                  <span className="absolute -bottom-6 font-mono text-[9px] text-muted-foreground whitespace-nowrap">
                    {item.periodLabel}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Active Item Inspector */}
          <div className="mt-8 pt-2 min-h-[30px] flex items-center justify-between text-xs font-mono">
            {activeItem ? (
              <div className="flex items-center gap-2">
                <span className="text-foreground font-semibold">{activeItem.periodLabel}:</span>
                <span className="text-primary font-bold">{activeItem.total} total evaluations</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-destructive font-semibold">{activeItem.failures} failures</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-success font-semibold">{activeItem.nonFailures} nominal</span>
              </div>
            ) : (
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock size={12} className="text-muted-foreground" aria-hidden="true" />
                Hover over bars to inspect time window details.
              </span>
            )}
            <span className="text-muted-foreground">
              Total window: {timeline.reduce((s, t) => s + t.total, 0)} inferences
            </span>
          </div>
        </div>
      )}
    </Card>
  )
}

export default PredictionTimelineChart
