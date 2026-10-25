import { Activity } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'

function Monitoring() {
  return (
    <PageContainer>
      <PageHeader
        breadcrumb="Monitoring"
        tag="Observability"
        title="Monitoring"
        description="Real-time sensor monitoring, risk trends, and fleet-level observability."
      />

      <Card className="mt-7 p-8 sm:p-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="grid size-14 place-items-center rounded-lg bg-muted text-muted-foreground">
            <Activity size={26} strokeWidth={1.5} />
          </span>
          <div className="grid gap-1.5">
            <h2 className="text-base font-semibold sm:text-lg">Machine monitoring</h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Observability-style monitoring with sensor trends, risk distribution,
              failure prediction history, and system health indicators.
            </p>
          </div>
          <span className="mt-2 rounded-full border border-border px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
            Coming in Phase 8
          </span>
        </div>
      </Card>
    </PageContainer>
  )
}

export default Monitoring
