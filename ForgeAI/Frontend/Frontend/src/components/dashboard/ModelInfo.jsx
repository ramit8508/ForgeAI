import { Cpu } from 'lucide-react'
import Card from '../ui/Card'
import { config } from '../../lib/config'

const modelParams = [
  { label: 'Algorithm',        value: config.model.name },
  { label: 'Estimators',       value: config.model.estimators },
  { label: 'Max Depth',        value: config.model.maxDepth },
  { label: 'Min Samples Leaf', value: config.model.minSamplesLeaf },
  { label: 'Threshold',        value: config.model.threshold },
]

/**
 * Compact card displaying the production model's configuration.
 */
function ModelInfo() {
  return (
    <Card className="p-5" as="section" aria-labelledby="model-info-title">
      <div className="flex items-start justify-between border-b border-border pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Production model
          </span>
          <h2 className="mt-1 text-base font-semibold" id="model-info-title">
            Model Configuration
          </h2>
        </div>
        <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary" aria-hidden="true">
          <Cpu size={16} strokeWidth={1.7} />
        </span>
      </div>

      <div className="divide-y divide-border">
        {modelParams.map(({ label, value }) => (
          <div className="flex items-center justify-between py-2.5 text-sm" key={label}>
            <span className="text-secondary-foreground">{label}</span>
            <span className="font-mono text-sm font-semibold text-foreground">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-3 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
        <span className="size-2 rounded-full bg-success" aria-hidden="true" />
        Model in production
      </div>
    </Card>
  )
}

export default ModelInfo
