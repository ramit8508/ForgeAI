/**
 * ForgeAI — API & System Settings Section
 *
 * Displays the configured API base URL (read-only from env config)
 * and performs a real health check against the backend /health endpoint.
 *
 * Never exposes credentials, keys, or environment variables
 * prefixed for private server use. The API URL is not editable
 * because the architecture uses build-time environment variables.
 */

import { useState, useCallback } from 'react'
import { RefreshCw, ExternalLink, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import SettingsField from './SettingsField'
import { config } from '../../../lib/config'
import { getHealthStatus } from '../../../services/api/health'

const STATUS_CONFIG = {
  idle:    { icon: null,          label: 'Not checked',    color: 'text-muted-foreground' },
  loading: { icon: Loader2,       label: 'Checking…',      color: 'text-muted-foreground' },
  online:  { icon: CheckCircle2,  label: 'Connected',      color: 'text-success' },
  offline: { icon: XCircle,       label: 'Unavailable',    color: 'text-destructive' },
}

function ApiSystemSection() {
  const [healthStatus, setHealthStatus] = useState('idle')
  const [healthDetail, setHealthDetail] = useState(null)
  const [lastChecked, setLastChecked] = useState(null)

  const checkHealth = useCallback(async () => {
    setHealthStatus('loading')
    setHealthDetail(null)
    try {
      const data = await getHealthStatus()
      setHealthStatus('online')
      setHealthDetail(data)
      setLastChecked(new Date())
    } catch {
      setHealthStatus('offline')
      setHealthDetail(null)
      setLastChecked(new Date())
    }
  }, [])

  const statusCfg = STATUS_CONFIG[healthStatus]
  const StatusIcon = statusCfg.icon

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-base font-semibold">API & System</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Backend connection configuration and system health.
        </p>
      </div>

      {/* API connection */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">API Connection</h3>
        <div className="grid gap-5">
          <SettingsField
            label="API Base URL"
            description="Configured via VITE_API_BASE_URL environment variable at build time. Not editable at runtime."
            readOnly
          >
            <div className="flex items-center gap-2">
              <code className="rounded-md border border-border bg-muted/60 px-3 py-2 font-mono text-sm text-muted-foreground">
                {config.api.baseUrl}
              </code>
              <a
                href={config.api.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md px-2 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Open API base URL in new tab"
              >
                <ExternalLink size={14} strokeWidth={1.8} />
              </a>
            </div>
          </SettingsField>

          <div className="border-t border-border" />

          {/* Health check */}
          <SettingsField
            label="Connection Status"
            description="Live connectivity check against the backend /health endpoint."
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className={`inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium ${statusCfg.color}`}>
                {StatusIcon && (
                  <StatusIcon
                    size={15}
                    strokeWidth={2}
                    className={healthStatus === 'loading' ? 'animate-spin' : ''}
                  />
                )}
                {statusCfg.label}
              </div>
              <Button
                variant="secondary"
                onClick={checkHealth}
                disabled={healthStatus === 'loading'}
                className="gap-2 text-xs"
              >
                <RefreshCw
                  size={13}
                  strokeWidth={2}
                  className={healthStatus === 'loading' ? 'animate-spin' : ''}
                />
                Test Connection
              </Button>
            </div>
            {lastChecked && (
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </SettingsField>

          {/* Health response detail */}
          {healthDetail && (
            <>
              <div className="border-t border-border" />
              <div className="rounded-md border border-border bg-muted/40 px-4 py-3">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Health Response
                </span>
                <pre className="overflow-x-auto font-mono text-xs text-foreground">
                  {JSON.stringify(healthDetail, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Runtime info */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Runtime Information</h3>
        <div className="grid gap-2">
          {[
            { label: 'Frontend Framework', value: 'React + Vite' },
            { label: 'Styling', value: 'Tailwind CSS v4' },
            { label: 'HTTP Client', value: 'Native Fetch' },
            { label: 'Request Timeout', value: '10 000 ms' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="font-mono text-xs text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default ApiSystemSection
