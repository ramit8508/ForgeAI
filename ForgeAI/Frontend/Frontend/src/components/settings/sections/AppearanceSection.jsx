/**
 * ForgeAI — Appearance Settings Section
 *
 * Layout density preference. The application uses a dark-first design
 * with color-scheme: dark hardcoded in global.css — there is no light
 * theme implementation, so a theme toggle is not offered.
 *
 * Density applies a CSS class on the root element so components
 * can conditionally tighten padding/spacing.
 */

import { useEffect } from 'react'
import Card from '../../ui/Card'
import SettingsField from './SettingsField'
import { DENSITY_OPTIONS } from '../../../data/settings/settingsDefinitions'
import { cn } from '../../../lib/utils'

function AppearanceSection({ preferences, onUpdate }) {
  // Apply density class to <html> so it's globally available
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('density-comfortable', 'density-compact')
    root.classList.add(`density-${preferences.density}`)
  }, [preferences.density])

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-base font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Visual presentation and layout density.
        </p>
      </div>

      {/* Theme — informational read-only */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Theme</h3>
        <SettingsField
          label="Color Theme"
          description="ForgeAI uses a dark graphite theme designed for industrial monitoring environments. Light and system themes are not currently available."
          readOnly
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-md border border-primary/25 bg-primary/8 px-3 py-2 text-sm font-medium text-primary">
              <span className="size-3 rounded-full bg-[#0a0e13] ring-1 ring-border" aria-hidden="true" />
              Dark
            </span>
          </div>
        </SettingsField>
      </Card>

      {/* Density */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Layout Density</h3>
        <SettingsField
          label="Interface Density"
          description="Controls spacing, padding, and element sizing across the application."
        >
          <div className="mt-1 grid gap-2 sm:grid-cols-2 sm:max-w-md">
            {DENSITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUpdate('density', opt.value)}
                className={cn(
                  'cursor-pointer rounded-lg border px-4 py-3 text-left transition-colors',
                  preferences.density === opt.value
                    ? 'border-primary/40 bg-primary/8 text-foreground'
                    : 'border-border bg-muted/40 text-muted-foreground hover:border-border-strong hover:bg-muted/70',
                )}
                aria-pressed={preferences.density === opt.value}
              >
                <span className="text-sm font-medium">{opt.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {opt.description}
                </span>
              </button>
            ))}
          </div>
        </SettingsField>
      </Card>
    </div>
  )
}

export default AppearanceSection
