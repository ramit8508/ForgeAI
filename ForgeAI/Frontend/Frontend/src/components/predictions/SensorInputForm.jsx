import { Gauge, RotateCcw, Cpu, Flame } from 'lucide-react'
import SensorField from './SensorField'
import DerivedMetric from './DerivedMetric'
import Button from '../ui/Button'
import { SENSOR_FIELD_DEFINITIONS } from '../../data/predictions/prediction.mock'

/**
 * ForgeAI — Sensor Input Form
 *
 * Primary engineering workstation form for collecting machine sensor readings.
 * Groups fields logically into Thermal and Mechanical subsystems.
 */
function SensorInputForm({
  values,
  errors,
  onChange,
  onBlur,
  onSubmit,
  onReset,
  isProcessing = false,
}) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-6"
      aria-label="Machine Sensor Readings Form"
    >
      {/* Subsystem 1: Thermal Dynamics */}
      <section
        className="flex flex-col gap-4 rounded-lg border border-border/70 bg-card p-5"
        aria-labelledby="thermal-subsystem-heading"
      >
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <Flame size={16} className="text-warning" aria-hidden="true" />
          <h2
            id="thermal-subsystem-heading"
            className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-foreground"
          >
            Thermal Dynamics
          </h2>
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">
            2 raw sensors · 1 derived feature
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SensorField
            definition={SENSOR_FIELD_DEFINITIONS.air_temperature}
            value={values.air_temperature}
            error={errors.air_temperature}
            onChange={onChange}
            onBlur={onBlur}
            disabled={isProcessing}
          />
          <SensorField
            definition={SENSOR_FIELD_DEFINITIONS.process_temperature}
            value={values.process_temperature}
            error={errors.process_temperature}
            onChange={onChange}
            onBlur={onBlur}
            disabled={isProcessing}
          />
        </div>

        {/* Derived Temperature Difference */}
        <DerivedMetric
          airTemp={values.air_temperature}
          processTemp={values.process_temperature}
        />
      </section>

      {/* Subsystem 2: Mechanical Operations */}
      <section
        className="flex flex-col gap-4 rounded-lg border border-border/70 bg-card p-5"
        aria-labelledby="mechanical-subsystem-heading"
      >
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <Gauge size={16} className="text-primary" aria-hidden="true" />
          <h2
            id="mechanical-subsystem-heading"
            className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-foreground"
          >
            Mechanical Operations
          </h2>
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">
            3 raw sensors
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SensorField
            definition={SENSOR_FIELD_DEFINITIONS.rotational_speed}
            value={values.rotational_speed}
            error={errors.rotational_speed}
            onChange={onChange}
            onBlur={onBlur}
            disabled={isProcessing}
          />
          <SensorField
            definition={SENSOR_FIELD_DEFINITIONS.torque}
            value={values.torque}
            error={errors.torque}
            onChange={onChange}
            onBlur={onBlur}
            disabled={isProcessing}
          />
          <SensorField
            definition={SENSOR_FIELD_DEFINITIONS.tool_wear}
            value={values.tool_wear}
            error={errors.tool_wear}
            onChange={onChange}
            onBlur={onBlur}
            disabled={isProcessing}
          />
        </div>
      </section>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <Button
          type="button"
          variant="secondary"
          onClick={onReset}
          disabled={isProcessing}
          className="gap-2 text-xs uppercase tracking-[0.06em]"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>Reset</span>
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={isProcessing}
            className="min-w-[160px] gap-2 text-xs uppercase tracking-[0.08em]"
          >
            {isProcessing ? (
              <>
                <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Cpu size={15} aria-hidden="true" />
                <span>Analyze Machine</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default SensorInputForm
