import { ShieldCheck, ShieldAlert } from 'lucide-react'
import { cn } from '../../../lib/utils'

/**
 * Prediction Outcome Result Badge
 *
 * Clearly distinguishes NO FAILURE from FAILURE DETECTED using icon + semantic styling.
 * Avoids calling the outcome "confidence" or "diagnosis".
 *
 * @param {{
 *   failure: 0 | 1 | boolean,
 *   className?: string
 * }} props
 */
function PredictionResultBadge({ failure, className }) {
  const isFailure = failure === 1 || failure === true

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-[0.06em]',
        isFailure
          ? 'border-destructive/30 bg-destructive/10 text-destructive'
          : 'border-success/30 bg-success/10 text-success',
        className,
      )}
      role="status"
      aria-label={`Prediction outcome: ${isFailure ? 'Failure Detected' : 'No Failure'}`}
    >
      {isFailure ? (
        <>
          <ShieldAlert size={14} strokeWidth={2.2} aria-hidden="true" />
          <span>Failure Detected</span>
        </>
      ) : (
        <>
          <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" />
          <span>No Failure</span>
        </>
      )}
    </span>
  )
}

export default PredictionResultBadge
