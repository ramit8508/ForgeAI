import { SlidersHorizontal } from 'lucide-react'
import PageHeader from '../layout/PageHeader'
import { config } from '../../lib/config'
import { PREDICTION_PRESETS } from '../../data/predictions/prediction.mock'

/**
 * ForgeAI — Prediction Header
 *
 * Renders page title, breadcrumbs, model configuration metadata,
 * and quick-load machine sensor presets.
 */
function PredictionHeader({ activePreset, onSelectPreset }) {
  const { model } = config

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb="Predictions"
        tag="AI Inference Workstation"
        title="Predictive Analysis"
        description="Evaluate machine failure risk from current operating conditions using machine-learning inference."
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Model info badge */}
          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs">
            <span className="text-muted-foreground">Model:</span>
            <span className="font-semibold text-foreground">{model.name}</span>
          </div>

          {/* Threshold info badge */}
          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs">
            <span className="text-muted-foreground">Threshold:</span>
            <span className="font-semibold text-primary">{model.threshold.toFixed(2)}</span>
          </div>

          {/* Architecture mode indicator */}
          <div className="flex items-center gap-1.5 rounded-md border border-info/25 bg-info/5 px-2.5 py-1.5 font-mono text-xs text-info">
            <span className="size-1.5 rounded-full bg-info" aria-hidden="true" />
            <span>Phase 4 · Demo Service</span>
          </div>
        </div>
      </PageHeader>

      {/* Sensor Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card/60 px-4 py-2.5 backdrop-blur-xs">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <SlidersHorizontal size={14} className="text-primary" />
          <span className="font-mono uppercase tracking-[0.08em]">Telemetry Presets:</span>
          <span className="hidden sm:inline text-muted-foreground/80">
            Quick-load calibrated machine readings to test nominal vs failure outcomes
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Sensor Presets">
          {PREDICTION_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-medium transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-xs'
                    : 'border-border/80 bg-secondary/50 text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground'
                }`}
                title={`Load ${preset.name} readings`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    preset.tone === 'success'
                      ? 'bg-success'
                      : preset.tone === 'danger'
                        ? 'bg-destructive'
                        : 'bg-warning'
                  }`}
                  aria-hidden="true"
                />
                <span>{preset.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PredictionHeader
