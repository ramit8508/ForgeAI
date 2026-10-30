/**
 * ForgeAI — ExplainabilityDisclaimer
 *
 * Renders a concise model explanation disclaimer.
 * Important for technical credibility — SHAP values describe
 * model behavior, not causal relationships.
 */

import { Info } from 'lucide-react'

function ExplainabilityDisclaimer() {
  return (
    <div
      className="flex items-start gap-2.5 rounded-md border border-border/50 bg-secondary/20 p-3"
      role="note"
      aria-label="Model explanation disclaimer"
    >
      <Info
        size={14}
        className="shrink-0 text-muted-foreground/70 mt-0.5"
        aria-hidden="true"
      />
      <p className="text-sm text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground/80">Model explanation</span> — SHAP
        values describe how input features influenced the model&apos;s prediction. They
        should not be interpreted as direct causal relationships. Model explanations
        support human review and should not replace engineering judgment.
      </p>
    </div>
  )
}

export default ExplainabilityDisclaimer
