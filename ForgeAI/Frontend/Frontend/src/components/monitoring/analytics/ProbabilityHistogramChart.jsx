import { useState } from 'react'
import Card from '../../ui/Card'
import { config } from '../../../lib/config'
import { cn } from '../../../lib/utils'

/**
 * ProbabilityHistogramChart
 *
 * 10-bin histogram visualizing machine distribution across failure probability ranges.
 * Labeled explicitly as model-predicted failure probabilities (not observed physical failures).
 *
 * @param {{
 *   bins: Array<{ range: string, min: number, max: number, count: number, percentage: number, machines: Array<Object> }>
 * }} props
 */
function ProbabilityHistogramChart({ bins = [] }) {
  const [activeBin, setActiveBin] = useState(null)
  const maxCount = Math.max(1, ...bins.map((b) => b.count))

  return (
    <Card className="p-5" as="section" aria-labelledby="histogram-heading">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
            Statistical Spread
          </span>
          <h3 id="histogram-heading" className="mt-0.5 text-base font-semibold text-foreground">
            Failure Probability Distribution
          </h3>
        </div>

        <span className="font-mono text-[11px] text-muted-foreground">
          Model-predicted failure probability (10% increments)
        </span>
      </div>

      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
        Distribution of model-predicted failure probabilities across active machinery. Note: Represents statistical inference distribution, not observed physical failure frequency.
      </p>

      {/* Histogram SVG / Responsive Bars */}
      <div className="mt-6">
        <div className="h-44 flex items-end gap-1.5 sm:gap-2 px-2 pb-6 border-b border-border/60 relative">
          {/* Threshold reference line at 45% */}
          <div
            className="absolute top-0 bottom-6 border-l-2 border-dashed border-primary/50 pointer-events-none z-10 flex flex-col justify-start"
            style={{ left: '45%' }}
            title={`Threshold: ${config.model.thresholdPercent}`}
          >
            <span className="bg-primary/20 text-primary border border-primary/30 rounded px-1 text-[9px] font-mono font-semibold -translate-x-1/2 -mt-2">
              Cutoff 45%
            </span>
          </div>

          {bins.map((bin) => {
            const heightPct = (bin.count / maxCount) * 100
            const isHovered = activeBin?.range === bin.range

            // Color bin based on risk band
            const barBg = bin.min >= 0.7
              ? 'bg-destructive/80 hover:bg-destructive'
              : bin.min >= 0.3
                ? 'bg-warning/80 hover:bg-warning'
                : 'bg-success/80 hover:bg-success'

            return (
              <div
                key={bin.range}
                className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                onMouseEnter={() => setActiveBin(bin)}
                onMouseLeave={() => setActiveBin(null)}
                tabIndex={0}
                role="figure"
                aria-label={`Bin ${bin.range}: ${bin.count} machines (${bin.percentage}%)`}
              >
                {/* Count badge above bar */}
                <span className={cn(
                  'font-mono text-[10px] font-semibold mb-1 transition-opacity',
                  bin.count > 0 ? 'text-foreground' : 'text-muted-foreground/40',
                  isHovered ? 'opacity-100 text-primary font-bold' : 'opacity-80'
                )}>
                  {bin.count}
                </span>

                {/* Vertical Bar */}
                <div
                  className={cn(
                    'w-full rounded-t transition-all duration-300',
                    barBg,
                    isHovered ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''
                  )}
                  style={{ height: `${Math.max(heightPct, 4)}%` }}
                />

                {/* X-Axis Range Label */}
                <span className="absolute -bottom-6 font-mono text-[9px] sm:text-[10px] text-muted-foreground whitespace-nowrap -rotate-45 sm:rotate-0 origin-top-left sm:origin-center mt-1">
                  {bin.range}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Active Bin Inspector Panel */}
      <div className="mt-8 pt-3 border-t border-border/60 min-h-[42px] flex items-center justify-between text-xs font-mono">
        {activeBin ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground">Range {activeBin.range}:</span>
            <span className="text-primary font-bold">{activeBin.count} asset{activeBin.count !== 1 ? 's' : ''} ({activeBin.percentage}%)</span>
            {activeBin.machines.length > 0 && (
              <span className="text-muted-foreground">
                [{activeBin.machines.map((m) => m.id).join(', ')}]
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">
            Hover over any probability column to view matching machine assets.
          </span>
        )}

        <span className="text-muted-foreground">
          Total: {bins.reduce((s, b) => s + b.count, 0)} machines
        </span>
      </div>
    </Card>
  )
}

export default ProbabilityHistogramChart
