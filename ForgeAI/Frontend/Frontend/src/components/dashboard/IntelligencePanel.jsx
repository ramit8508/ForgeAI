import { ArrowUpRight, BrainCircuit, Sparkles } from 'lucide-react'
import Card from '../ui/Card'

function IntelligencePanel() {
  return (
    <Card className="overflow-hidden p-5" as="section" aria-labelledby="intelligence-title">
      <div className="flex items-start justify-between border-b border-border pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Predictive maintenance
          </span>
          <h2 className="mt-1 text-base font-semibold" id="intelligence-title">
            Machine Intelligence
          </h2>
        </div>
        <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary" aria-hidden="true">
          <BrainCircuit size={18} strokeWidth={1.7} />
        </span>
      </div>

      <div className="grid gap-5 py-6 sm:grid-cols-[8rem_1fr] sm:items-center">
        {/* Visual element */}
        <div
          className="relative mx-auto grid size-28 place-items-center rounded-full border border-primary/20 bg-primary/5 text-primary"
          aria-hidden="true"
        >
          <span className="absolute inset-3 rounded-full border border-dashed border-primary/20" />
          <span className="absolute inset-6 rounded-full border border-primary/15" />
          <BrainCircuit size={30} strokeWidth={1.2} />
        </div>

        <div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
            Prediction workspace
          </span>
          <h3 className="mt-1.5 text-lg font-semibold tracking-tight">
            Predictive Maintenance Intelligence
          </h3>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Monitor machine conditions, estimate failure probability, and understand the
            factors driving each prediction through explainable AI.
          </p>
          <button
            className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-border px-3.5 py-2 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground opacity-60"
            type="button"
            disabled
          >
            Open prediction workspace
            <ArrowUpRight size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
        <span className="flex items-center gap-2">
          <Sparkles size={14} strokeWidth={1.7} />
          Workspace module
        </span>
        <span>Available in Phase 3</span>
      </div>
    </Card>
  )
}

export default IntelligencePanel
