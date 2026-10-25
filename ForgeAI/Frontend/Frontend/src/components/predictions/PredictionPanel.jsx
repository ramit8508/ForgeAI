import { Bot } from 'lucide-react'
import Card from '../ui/Card'
import PredictionStatus from './PredictionStatus'

/**
 * ForgeAI — Prediction Panel
 *
 * Dedicated right-column workspace container for AI machine-failure prediction.
 * Displays inference state transitions and results.
 */
function PredictionPanel({
  predictionState,
  predictionResult,
  errorMessage,
  onAnalyze,
  onReset,
}) {
  const statusLabels = {
    idle: { label: 'Ready', tone: 'bg-muted-foreground/40 text-muted-foreground' },
    validating: { label: 'Validating', tone: 'bg-primary/20 text-primary animate-pulse' },
    processing: { label: 'Inference Running', tone: 'bg-primary/20 text-primary animate-pulse' },
    success: { label: 'Analysis Complete', tone: 'bg-success/20 text-success' },
    error: { label: 'Analysis Error', tone: 'bg-destructive/20 text-destructive' },
  }

  const currentStatus = statusLabels[predictionState] || statusLabels.idle

  return (
    <Card className="flex flex-col overflow-hidden border-border/80 shadow-panel">
      {/* Panel Top Header */}
      <div className="flex items-center justify-between border-b border-border/70 bg-card/80 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md bg-primary/10 text-primary">
            <Bot size={16} />
          </span>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              AI Prediction Panel
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Realtime risk inference engine
            </p>
          </div>
        </div>

        {/* State Badge */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.06em] ${currentStatus.tone}`}
        >
          <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
          {currentStatus.label}
        </span>
      </div>

      {/* Body View */}
      <div className="flex-1">
        <PredictionStatus
          state={predictionState}
          result={predictionResult}
          errorMessage={errorMessage}
          onAnalyze={onAnalyze}
          onReset={onReset}
        />
      </div>

      {/* Panel Footer note */}
      <div className="border-t border-border/50 bg-secondary/20 px-5 py-2.5 text-center">
        <p className="font-mono text-[11px] text-muted-foreground">
          Connected to FastAPI prediction service
        </p>
      </div>
    </Card>
  )
}

export default PredictionPanel
