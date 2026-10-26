import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Bot,
  AlertCircle,
  Clock,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Calendar,
  Layers,
} from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import RiskBadge from '../components/ui/RiskBadge'
import ProbabilityIndicator from '../components/ui/ProbabilityIndicator'
import MachineStatusBadge from '../components/machines/MachineStatusBadge'
import MachineConditionSnapshot from '../components/machines/MachineConditionSnapshot'
import { machineService } from '../services/machineService'

function formatDateTime(iso) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch {
    return '—'
  }
}

function formatDateOnly(iso) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return '—'
  }
}

function MachineDetail() {
  const { machineId } = useParams()
  const navigate = useNavigate()

  const [machine, setMachine] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    machineService.getMachineById(machineId).then((data) => {
      if (isMounted) {
        setMachine(data)
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [machineId])

  const handleAnalyzeMachine = () => {
    if (!machine) return
    navigate('/predictions', {
      state: {
        machineId: machine.id,
        machineName: machine.name,
        sensorValues: machine.sensors,
      },
    })
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <Loader2 size={32} className="animate-spin text-primary" aria-hidden="true" />
          <span className="mt-4 font-mono text-sm text-muted-foreground">
            Loading machine record for {machineId}...
          </span>
        </div>
      </PageContainer>
    )
  }

  // Not-Found State for unknown machine ID
  if (!machine) {
    return (
      <PageContainer>
        {/* Breadcrumb */}
        <nav
          className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link to="/dashboard" className="hover:text-foreground">
            ForgeAI
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/machines" className="hover:text-foreground">
            Machines
          </Link>
          <span aria-hidden="true">/</span>
          <strong className="text-destructive">{machineId || 'Unknown'}</strong>
        </nav>

        <Card className="mt-8 flex flex-col items-center justify-center p-12 text-center">
          <div className="grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle size={28} strokeWidth={2} aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-foreground">Machine Not Found</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            No monitored machine exists with identifier{' '}
            <code className="font-mono font-semibold text-foreground">{machineId}</code>. The
            machine may have been decommissioned or the ID may be invalid.
          </p>
          <div className="mt-6">
            <Button variant="secondary" onClick={() => navigate('/machines')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Machine Fleet
            </Button>
          </div>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Top Breadcrumb Navigation */}
      <nav
        className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link to="/dashboard" className="hover:text-foreground">
          ForgeAI
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/machines" className="hover:text-foreground">
          Machines
        </Link>
        <span aria-hidden="true">/</span>
        <strong className="text-foreground">{machine.id}</strong>
      </nav>

      {/* Machine Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
              Machine Diagnostics
            </span>
            <span className="text-border" aria-hidden="true">
              •
            </span>
            <MachineStatusBadge status={machine.status} />
            <RiskBadge level={machine.riskLevel} />
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-mono">
            {machine.id}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{machine.name}</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="secondary" onClick={() => navigate('/machines')} aria-label="Return to fleet list">
            <ArrowLeft size={15} className="mr-1.5" />
            Back to Fleet
          </Button>

          <Button
            variant="primary"
            onClick={handleAnalyzeMachine}
            className="gap-2"
            aria-label={`Analyze machine ${machine.id} in Prediction Workspace`}
          >
            <Bot size={16} strokeWidth={2} />
            Analyze Machine
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Machine Metadata & Overview (~50% desktop) */}
        <div className="space-y-6 lg:col-span-6">
          {/* Metadata Card */}
          <Card className="p-5 sm:p-6" as="section" aria-labelledby="machine-specs-heading">
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <h2 id="machine-specs-heading" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                Machine Specifications
              </h2>
              <span className="font-mono text-xs text-muted-foreground">Registry ID: {machine.id}</span>
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
              <div className="flex flex-col gap-1 rounded-md border border-border/70 bg-background/50 p-3">
                <dt className="font-mono text-xs text-muted-foreground uppercase flex items-center gap-1.5">
                  <Layers size={13} />
                  Equipment Model
                </dt>
                <dd className="font-semibold text-foreground font-mono">{machine.model || 'Standard Unit'}</dd>
              </div>

              <div className="flex flex-col gap-1 rounded-md border border-border/70 bg-background/50 p-3">
                <dt className="font-mono text-xs text-muted-foreground uppercase flex items-center gap-1.5">
                  <MapPin size={13} />
                  Facility Location
                </dt>
                <dd className="font-semibold text-foreground">{machine.location}</dd>
              </div>

              <div className="flex flex-col gap-1 rounded-md border border-border/70 bg-background/50 p-3">
                <dt className="font-mono text-xs text-muted-foreground uppercase flex items-center gap-1.5">
                  <Clock size={13} />
                  Operating Hours
                </dt>
                <dd className="font-semibold text-foreground font-mono">
                  {(machine.operatingHours || 0).toLocaleString()} hrs
                </dd>
              </div>

              <div className="flex flex-col gap-1 rounded-md border border-border/70 bg-background/50 p-3">
                <dt className="font-mono text-xs text-muted-foreground uppercase flex items-center gap-1.5">
                  <Calendar size={13} />
                  Last Inspection
                </dt>
                <dd className="font-semibold text-foreground font-mono">
                  {formatDateOnly(machine.lastInspection)}
                </dd>
              </div>
            </dl>

            {machine.description && (
              <p className="mt-4 border-t border-border/70 pt-3 text-xs leading-relaxed text-muted-foreground">
                {machine.description}
              </p>
            )}
          </Card>

          {/* Operational Risk Assessment Card */}
          <Card className="p-5 sm:p-6" as="section" aria-labelledby="risk-assessment-heading">
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <h2 id="risk-assessment-heading" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                Predictive Risk Assessment
              </h2>
              <RiskBadge level={machine.riskLevel} />
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <div className="rounded-lg border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Model Failure Probability
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    Last evaluated: {formatDateTime(machine.lastPredictionAt)}
                  </span>
                </div>
                <div className="mt-2.5">
                  <ProbabilityIndicator
                    probability={machine.failureProbability}
                    riskLevel={machine.riskLevel}
                  />
                </div>
              </div>

              {/* Status vs Risk clarification callout */}
              <div
                className={`rounded-lg border p-4 text-xs leading-relaxed ${
                  machine.riskLevel === 'HIGH'
                    ? 'border-destructive/30 bg-destructive/5 text-destructive-foreground'
                    : machine.riskLevel === 'MEDIUM'
                      ? 'border-warning/30 bg-warning/5 text-warning-foreground'
                      : 'border-success/30 bg-success/5 text-success-foreground'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {machine.riskLevel === 'HIGH' ? (
                    <ShieldAlert size={16} className="shrink-0 text-destructive mt-0.5" />
                  ) : (
                    <ShieldCheck size={16} className="shrink-0 text-success mt-0.5" />
                  )}
                  <div>
                    <strong className="block font-semibold font-mono uppercase tracking-wider mb-1">
                      Operational Note: Status vs. Risk
                    </strong>
                    <p className="text-muted-foreground">
                      This machine is currently{' '}
                      <span className="font-semibold text-foreground uppercase">{machine.status}</span>.
                      {machine.riskLevel === 'HIGH'
                        ? ' Although operational/in-service, model inference indicates high risk of impending failure under continuous load. Preemptive inspection recommended.'
                        : machine.riskLevel === 'MEDIUM'
                          ? ' Machine is running under nominal or warning telemetry with moderate failure risk. Routine monitoring advised.'
                          : ' Operating under nominal thermal and mechanical parameters with low failure probability.'}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="secondary"
                onClick={handleAnalyzeMachine}
                className="w-full justify-center gap-2 mt-1"
              >
                <Bot size={15} />
                Inspect Live Telemetry in Prediction Workspace
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Sensor Condition Snapshot (~50% desktop) */}
        <div className="lg:col-span-6">
          <MachineConditionSnapshot sensors={machine.sensors} />
        </div>
      </div>
    </PageContainer>
  )
}

export default MachineDetail
