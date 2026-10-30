/**
 * ForgeAI — Settings Field Layout
 *
 * Reusable wrapper for a single setting row providing consistent
 * label, description, read-only badge, and control slot.
 */

import { cn } from '../../../lib/utils'

function SettingsField({ label, description, htmlFor, readOnly, children, className }) {
  return (
    <div className={cn('grid gap-1.5', className)}>
      <div className="flex items-center gap-2">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        {readOnly && (
          <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Read-only
          </span>
        )}
      </div>
      {description && (
        <p className="max-w-lg text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      <div className="mt-1">{children}</div>
    </div>
  )
}

export default SettingsField
