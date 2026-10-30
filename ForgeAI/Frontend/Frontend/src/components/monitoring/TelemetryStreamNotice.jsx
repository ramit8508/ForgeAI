import { Radio, Database } from 'lucide-react'
import Card from '../ui/Card'

/**
 * TelemetryStreamNotice
 *
 * Data integrity notice explaining the state of the telemetry pipeline.
 * Transparently discloses that live streaming is not connected, avoiding false
 * claims of live streaming or fabricated historical sensor trends.
 */
function TelemetryStreamNotice() {
  return (
    <Card className="p-4 sm:p-5 border-border/80 bg-secondary/20" as="aside" aria-label="Telemetry Pipeline Status">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-warning/30 bg-warning/10 text-warning mt-0.5">
            <Radio size={18} aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Telemetry Pipeline: Batch Simulated Mode
              </h3>
              <span className="rounded bg-warning/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-warning border border-warning/30">
                Demo Data
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              Sensor data shown across the fleet consists of single-point diagnostic snapshots. Continuous real-time sensor trends (OPC-UA / MQTT broker ingestion) are not yet connected. Historical trendline charts are deliberately omitted to preserve data integrity until continuous time-series endpoints are deployed on the backend.
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 text-[11px] font-mono text-muted-foreground border-t sm:border-t-0 border-border/60 pt-2 sm:pt-0">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-warning animate-pulse" aria-hidden="true" />
            Ingestion: Offline
          </span>
          <span className="flex items-center gap-1">
            <Database size={11} aria-hidden="true" />
            Source: Mock Fleet Contract
          </span>
        </div>
      </div>
    </Card>
  )
}

export default TelemetryStreamNotice
