import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  AlertCircle,
  Clock,
  Wrench,
  Gauge,
  RotateCw,
  ExternalLink,
  Layers,
  Sparkles,
  Loader2,
  Thermometer,
  Activity,
  Timer,
  Zap,
} from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import RiskBadge from '../components/ui/RiskBadge'
import ProbabilityIndicator from '../components/ui/ProbabilityIndicator'
import PredictionResultBadge from '../components/predictions/history/PredictionResultBadge'
import { predictionHistoryService } from '../services/predictionHistoryService'
import { formatSensorReading } from '../lib/formatters'

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
      second: '2-digit',
      hour12: false,
    })
  } catch {
    return '—'
  }
}

function PredictionHistoryDetail() {
  const { predictionId } = useParams()
  const navigate = useNavigate()

  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    predictionHistoryService.getPredictionById(predictionId).then((data) => {
      if (isMounted) {
        setPrediction(data)
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [predictionId])

  const handleAnalyzeAgain = () => {
    if (!prediction) return
    navigate('/predictions', {
      state: {
        machineId: prediction.machine?.id,
        machineName: prediction.machine?.name,
        sensorValues: {
          air_temperature: prediction.inputs?.airTemperature,
          process_temperature: prediction.inputs?.processTemperature,
          rotational_speed: prediction.inputs?.rotationalSpeed,
          torque: prediction.inputs?.torque,
          tool_wear: prediction.inputs?.toolWear,
        },
      },
    })
  }

  const handleViewMachine = () => {
    if (!prediction?.machine?.id) return
    navigate(`/machines/${prediction.machine.id}`)
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <Loader2 size={32} className="animate-spin text-primary" aria-hidden="true" />
          <span className="mt-4 font-mono text-sm text-muted-foreground">
            Loading prediction record for {predictionId}...
          </span>
        </div>
      </PageContainer>
    )
  }

  // Not-Found State for unknown prediction ID
  if (!prediction) {
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
          <Link to="/predictions/history" className="hover:text-foreground">
            Prediction History
          </Link>
          <span aria-hidden="true">/</span>
          <strong className="text-destructive">{predictionId || 'Unknown'}</strong>
        </nav>

        <Card className="mt-8 flex flex-col items-center justify-center p-12 text-center">
          <div className="grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle size={28} strokeWidth={2} aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-foreground">
            Prediction Record Not Found
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            No prediction record exists with identifier{' '}
            <code className="font-mono font-semibold text-foreground">{predictionId}</code>. The
            log entry may have expired or the ID may be invalid.
          </p>
          <div className="mt-6">
            <Button variant="secondary" onClick={() => navigate('/predictions/history')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Prediction History
            </Button>
          </div>
        </Card>
      </PageContainer>
    )
  }

  const inputs = prediction.inputs || {}
  const tempDiff =
    inputs.temperatureDifference !== undefined
      ? inputs.temperatureDifference
      : Number((inputs.processTemperature - inputs.airTemperature).toFixed(2))

  const sensorCards = [
    {
      key: 'airTemperature',
      label: 'Air Temperature',
      reading: formatSensorReading('air_temperature', inputs.airTemperature),
      icon: Thermometer,
      description: 'Ambient enclosure temperature',
    },
    {
      key: 'processTemperature',
      label: 'Process Temperature',
      reading: formatSensorReading('process_temperature', inputs.processTemperature),
      icon: Thermometer,
      description: 'Active cycle core temperature',
    },
    {
      key: 'temperatureDifference',
      label: 'Temp Difference (ΔT)',
      reading: formatSensorReading('temperature_difference', tempDiff),
      icon: Zap,
      description: 'Derived thermal variance (Process - Air)',
      highlight: true,
    },
    {
      key: 'rotationalSpeed',
      label: 'Rotational Speed',
      reading: formatSensorReading('rotational_speed', inputs.rotationalSpeed),
      icon: Gauge,
      description: 'Spindle rotational velocity',
    },
    {
      key: 'torque',
      label: 'Drive Torque',
      reading: formatSensorReading('torque', inputs.torque),
      icon: Activity,
      description: 'Mechanical resistance load',
    },
    {
      key: 'toolWear',
      label: 'Tool Wear',
      reading: formatSensorReading('tool_wear', inputs.toolWear),
      icon: Timer,
      description: 'Cumulative contact runtime',
    },
  ]

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
        <Link to="/predictions/history" className="hover:text-foreground">
          Prediction History
        </Link>
        <span aria-hidden="true">/</span>
        <strong className="text-foreground">{prediction.id}</strong>
      </nav>

      {/* Record Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary">
              Prediction Audit Record
            </span>
            <span className="text-border" aria-hidden="true">
              •
            </span>
            <PredictionResultBadge failure={prediction.result?.machineFailure} />
            <RiskBadge level={prediction.result?.riskLevel} />
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-mono">
            {prediction.id}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-mono text-xs">
              <Clock size={13} className="text-muted-foreground" />
              {formatDateTime(prediction.createdAt)}
            </span>
            <span>•</span>
            <span className="font-semibold text-foreground">{prediction.machine?.id}</span>
            <span>—</span>
            <span>{prediction.machine?.name}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            onClick={() => navigate('/predictions/history')}
            aria-label="Return to prediction history list"
          >
            <ArrowLeft size={15} className="mr-1.5" />
            Back to History
          </Button>

          <Button
            variant="secondary"
            onClick={handleViewMachine}
          >
            <Wrench size={15} className="mr-1.5" />
            View Machine
          </Button>

          <Button
            variant="primary"
            onClick={handleAnalyzeAgain}
            className="gap-2"
          >
            <RotateCw size={15} />
            Analyze Again
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Assessment & Model Metadata (~50% desktop) */}
        <div className="space-y-6 lg:col-span-6">
          {/* Result & Assessment Card */}
          <Card className="p-5 sm:p-6" as="section" aria-labelledby="assessment-heading">
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <h2
                id="assessment-heading"
                className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono"
              >
                Inference Outcome
              </h2>
              <PredictionResultBadge failure={prediction.result?.machineFailure} />
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <div className="rounded-lg border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Failure Probability
                  </span>
                  <RiskBadge level={prediction.result?.riskLevel} />
                </div>
                <div className="mt-2.5">
                  <ProbabilityIndicator
                    probability={prediction.result?.failureProbability}
                    riskLevel={prediction.result?.riskLevel}
                  />
                </div>
              </div>

              {/* Assessment note */}
              <div
                className={`rounded-lg border p-4 text-xs leading-relaxed ${
                  prediction.result?.machineFailure === 1
                    ? 'border-destructive/30 bg-destructive/5 text-destructive-foreground'
                    : 'border-success/30 bg-success/5 text-success-foreground'
                }`}
              >
                <strong className="block font-semibold font-mono uppercase tracking-wider mb-1">
                  {prediction.result?.machineFailure === 1
                    ? 'Positive Failure Detected'
                    : 'Nominal — No Failure Detected'}
                </strong>
                <p className="text-muted-foreground">
                  {prediction.result?.machineFailure === 1
                    ? 'Model inference determined that the telemetry profile crossed critical degradation limits. The failure probability exceeded the decision boundary.'
                    : 'Telemetry inputs remained within standard operating envelope boundaries without imminent breakdown risk.'}
                </p>
              </div>

              {/* Model Specifications */}
              <dl className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-border/70">
                <div className="flex flex-col gap-1 rounded-md border border-border/70 bg-background/50 p-3">
                  <dt className="font-mono text-xs text-muted-foreground uppercase flex items-center gap-1.5">
                    <Layers size={13} />
                    Inference Model
                  </dt>
                  <dd className="font-semibold text-foreground font-mono">
                    {prediction.model?.name || 'Random Forest'}
                  </dd>
                </div>

                <div className="flex flex-col gap-1 rounded-md border border-border/70 bg-background/50 p-3">
                  <dt className="font-mono text-xs text-muted-foreground uppercase flex items-center gap-1.5">
                    <Gauge size={13} />
                    Classification Threshold
                  </dt>
                  <dd className="font-semibold text-primary font-mono">
                    {prediction.model?.threshold?.toFixed(2) || '0.45'}
                  </dd>
                </div>
              </dl>
            </div>
          </Card>

          {/* Explainability Connection Card */}
          <Card className="p-5 sm:p-6" as="section" aria-labelledby="explainability-heading">
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <h2
                id="explainability-heading"
                className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-2"
              >
                <Sparkles size={15} className="text-primary" />
                Model Explainability (SHAP)
              </h2>
              {prediction.hasExplanation ? (
                <span className="font-mono text-xs text-primary font-semibold">Available</span>
              ) : (
                <span className="font-mono text-xs text-muted-foreground">Unavailable</span>
              )}
            </div>

            <div className="mt-4">
              {prediction.hasExplanation ? (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Feature attribution (SHAP values) was captured for this prediction event. You can
                    inspect the detailed feature contributions in the Prediction Workspace.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={handleAnalyzeAgain}
                    className="justify-center gap-2"
                  >
                    <ExternalLink size={14} />
                    Inspect SHAP Feature Contributions in Workspace
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border border-border/70 bg-muted/40 p-4 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground block mb-1">
                    Explanation Not Captured
                  </span>
                  Model explanation (SHAP feature attribution) is not available for this historical
                  record. Historical explanation snapshots are only preserved when full feature
                  logging was enabled.
                </div>
              )}
            </div>
          </Card>

          {/* Machine Association Card */}
          <Card className="p-5 sm:p-6" as="section" aria-labelledby="machine-context-heading">
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <h2
                id="machine-context-heading"
                className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono"
              >
                Machine Association
              </h2>
              <span className="font-mono text-xs text-muted-foreground">{prediction.machine?.id}</span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <div>
                <strong className="block font-mono text-base font-semibold text-foreground">
                  {prediction.machine?.id}
                </strong>
                <span className="text-xs text-muted-foreground">{prediction.machine?.name}</span>
              </div>

              <Button
                variant="secondary"
                onClick={handleViewMachine}
                className="justify-center gap-2 mt-2"
              >
                <Wrench size={14} />
                View Machine Fleet Profile
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Input Telemetry Snapshot (~50% desktop) */}
        <div className="lg:col-span-6">
          <Card className="p-5 sm:p-6" as="section" aria-labelledby="inputs-heading">
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <h2
                id="inputs-heading"
                className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono"
              >
                Input Telemetry Snapshot
              </h2>
              <span className="font-mono text-xs text-muted-foreground">Recorded Inputs</span>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Sensor telemetry parameters submitted for this inference event.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
              {sensorCards.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.key}
                    className={`rounded-lg border p-3.5 transition-colors ${
                      item.highlight
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border/80 bg-background/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-mono text-xs uppercase tracking-wider">{item.label}</span>
                      <Icon size={14} strokeWidth={2} className={item.highlight ? 'text-primary' : ''} />
                    </div>

                    <div className="mt-2.5 flex items-baseline gap-1.5">
                      <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground tabular-nums">
                        {item.reading.formattedValue}
                      </span>
                      <span className="font-mono text-xs font-semibold text-muted-foreground">
                        {item.reading.unit}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-muted-foreground truncate">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}

export default PredictionHistoryDetail
