import { Settings as SettingsIcon } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'

function Settings() {
  return (
    <PageContainer>
      <PageHeader
        breadcrumb="Settings"
        tag="Configuration"
        title="Settings"
        description="Application, model, and system configuration."
      />

      <Card className="mt-7 p-8 sm:p-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="grid size-14 place-items-center rounded-lg bg-muted text-muted-foreground">
            <SettingsIcon size={26} strokeWidth={1.5} />
          </span>
          <div className="grid gap-1.5">
            <h2 className="text-base font-semibold sm:text-lg">Application settings</h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Model configuration, API connection settings, notification preferences,
              and system administration will be available here.
            </p>
          </div>
          <span className="mt-2 rounded-full border border-border px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
            Coming in a future phase
          </span>
        </div>
      </Card>
    </PageContainer>
  )
}

export default Settings
