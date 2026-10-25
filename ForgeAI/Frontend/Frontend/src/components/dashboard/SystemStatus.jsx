import { Check, CircleAlert, Container, Cpu, Database, Server } from 'lucide-react'
import Card from '../ui/Card'
import { config } from '../../lib/config'

const serviceIcons = {
  api: Server,
  model: Cpu,
  inference: Check,
  docker: Container,
  pipeline: Database,
}

/**
 * @param {{ services: Array<{ id: string, label: string, status: string, healthy: boolean }> }} props
 */
function SystemStatus({ services = [] }) {
  return (
    <Card className="p-5" as="section" aria-labelledby="system-status-title">
      <div className="flex items-start justify-between border-b border-border pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Environment
          </span>
          <h2 className="mt-1 text-base font-semibold" id="system-status-title">
            System Status
          </h2>
        </div>
        <CircleAlert className="text-muted-foreground" size={18} strokeWidth={1.7} aria-hidden="true" />
      </div>

      <div className="grid gap-0.5 py-3">
        {services.map(({ id, label, status, healthy }) => {
          const Icon = serviceIcons[id] || Server
          return (
            <div
              className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm transition-colors hover:bg-accent"
              key={id}
            >
              <span className="flex items-center gap-2.5 text-secondary-foreground">
                <Icon size={16} strokeWidth={1.8} />
                {label}
              </span>
              <span
                className={`flex items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] ${
                  healthy ? 'text-success' : 'text-destructive'
                }`}
              >
                <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                {status}
              </span>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
        <div className="grid gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">Model</span>
          <strong className="text-sm font-semibold">{config.model.name}</strong>
        </div>
        <div className="grid gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">Threshold</span>
          <strong className="text-sm font-semibold">{config.model.threshold}</strong>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="size-2 rounded-full bg-muted-foreground" aria-hidden="true" />
        Demo status · Not connected to API
      </div>
    </Card>
  )
}

export default SystemStatus
