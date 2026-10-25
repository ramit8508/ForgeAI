import { Wrench } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'

function Machines() {
  return (
    <PageContainer>
      <PageHeader
        breadcrumb="Machines"
        tag="Fleet management"
        title="Machines"
        description="Machine inventory, health monitoring, and individual machine diagnostics."
      />

      <Card className="mt-7 p-10 sm:p-14">
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="grid size-14 place-items-center rounded-lg bg-muted text-muted-foreground">
            <Wrench size={26} strokeWidth={1.5} />
          </span>
          <div className="grid gap-2">
            <h2 className="text-base font-semibold">Machine monitoring</h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Machine inventory and health information will appear here.
              This module will display individual machine status, sensor readings,
              failure probability, and prediction history.
            </p>
          </div>
          <span className="mt-2 rounded-full border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
            Coming in Phase 7
          </span>
        </div>
      </Card>
    </PageContainer>
  )
}

export default Machines
