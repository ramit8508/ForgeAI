import { Bot } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'

function Predictions() {
  return (
    <PageContainer>
      <PageHeader
        breadcrumb="Predictions"
        tag="Failure analysis"
        title="Predictions"
        description="Submit sensor readings and receive machine failure probability predictions."
      />

      <Card className="mt-7 p-10 sm:p-14">
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="grid size-14 place-items-center rounded-lg bg-muted text-muted-foreground">
            <Bot size={26} strokeWidth={1.5} />
          </span>
          <div className="grid gap-2">
            <h2 className="text-base font-semibold">Prediction workspace</h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              The prediction workspace will allow you to input sensor readings,
              run the Random Forest model, and view failure probability with
              risk classification and explainable AI insights.
            </p>
          </div>
          <span className="mt-2 rounded-full border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
            Coming in Phase 3
          </span>
        </div>
      </Card>
    </PageContainer>
  )
}

export default Predictions
