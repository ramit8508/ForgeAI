import { AlertCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * ForgeAI — Sensor Field
 *
 * An engineering-grade numeric input control with visible label,
 * unit indicator, description helper, and inline validation message.
 */
function SensorField({
  definition,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  className,
}) {
  const { key, label, unit, step, min, description, placeholder } = definition
  const inputId = `sensor-input-${key}`
  const errorId = `sensor-error-${key}`
  const descId = `sensor-desc-${key}`

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {/* Label and Unit Row */}
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground"
        >
          {label}
        </label>
        <span
          className="rounded border border-border/80 bg-muted/60 px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground"
          aria-label={`Unit: ${unit}`}
        >
          {unit}
        </span>
      </div>

      {/* Input Field Container */}
      <div className="relative">
        <input
          id={inputId}
          name={key}
          type="number"
          step={step}
          min={min}
          value={value ?? ''}
          onChange={(e) => onChange(key, e.target.value)}
          onBlur={() => onBlur && onBlur(key)}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={`${descId} ${error ? errorId : ''}`.trim()}
          className={cn(
            'w-full rounded-md border bg-background px-3.5 py-2.5 font-mono text-sm text-foreground shadow-subtle transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-destructive focus-visible:outline-destructive'
              : 'border-border hover:border-border-strong',
          )}
        />
      </div>

      {/* Technical Helper Description */}
      {description && (
        <p id={descId} className="text-[12px] leading-snug text-muted-foreground">
          {description}
        </p>
      )}

      {/* Inline Validation Error */}
      {error && (
        <div
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-destructive transition-opacity"
        >
          <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

export default SensorField
