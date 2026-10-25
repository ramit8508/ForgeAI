import { Gauge } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'

function Insights() {
  return (
    <PageContainer>
      <PageHeader
        breadcrumb="AI Insights"
        tag="Explainable AI"
        title="AI Insights"
        description="SHAP-powered explainability and intelligent recommendations for predictive maintenance."
      />

      <Card className="mt-7 p-8 sm:p-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="grid size-14 place-items-center rounded-lg bg-muted text-muted-foreground">
            <Gauge size={26} strokeWidth={1.5} />
          </span>
          <div className="grid gap-1.5">
            <h2 className="text-base font-semibold sm:text-lg">Explainable AI &amp; intelligence</h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Understand why the model makes each prediction with SHAP feature
              contributions, intelligent troubleshooting recommendations, and
              eventually an AI-powered industrial copilot.
            </p>
          </div>
          <span className="mt-2 rounded-full border border-border px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
            Coming in Phase 10
          </span>
        </div>
      </Card>
    </PageContainer>
  )
}

export default Insights
