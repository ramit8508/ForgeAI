/**
 * ForgeAI — General Settings Section
 *
 * Timezone, date/time formatting, and number locale preferences.
 * All settings here are display-only preferences — they do not
 * change model inference or backend behavior.
 */

import { config } from '../../../lib/config'
import Card from '../../ui/Card'
import SettingsField from './SettingsField'
import {
  TIMEZONE_OPTIONS,
  DATE_FORMAT_OPTIONS,
  NUMBER_LOCALE_OPTIONS,
} from '../../../data/settings/settingsDefinitions'

function GeneralSection({ preferences, onUpdate }) {
  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-base font-semibold">General</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Application identity and display format preferences.
        </p>
      </div>

      {/* Application name — read-only constant */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Application</h3>
        <div className="grid gap-4">
          <SettingsField
            label="Application Name"
            description="Product identifier configured at build time."
            readOnly
          >
            <div className="rounded-md border border-border bg-muted/60 px-3 py-2 font-mono text-sm text-muted-foreground">
              {config.app.name}
            </div>
          </SettingsField>
        </div>
      </Card>

      {/* Display format preferences */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Display Formats</h3>
        <div className="grid gap-5">
          <SettingsField
            label="Timezone"
            description="Timezone used for displaying dates and timestamps throughout the application."
            htmlFor="setting-timezone"
          >
            <select
              id="setting-timezone"
              value={preferences.timezone}
              onChange={(e) => onUpdate('timezone', e.target.value)}
              className="w-full max-w-xs cursor-pointer rounded-md border border-border bg-muted/60 px-3 py-2 text-sm text-foreground transition-colors hover:border-border-strong focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {TIMEZONE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingsField>

          <div className="border-t border-border" />

          <SettingsField
            label="Date & Time Format"
            description="How dates and timestamps are displayed in history, predictions, and monitoring views."
            htmlFor="setting-date-format"
          >
            <select
              id="setting-date-format"
              value={preferences.dateFormat}
              onChange={(e) => onUpdate('dateFormat', e.target.value)}
              className="w-full max-w-xs cursor-pointer rounded-md border border-border bg-muted/60 px-3 py-2 text-sm text-foreground transition-colors hover:border-border-strong focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {DATE_FORMAT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingsField>

          <div className="border-t border-border" />

          <SettingsField
            label="Number Format"
            description="Locale used for formatting numeric values and sensor readings."
            htmlFor="setting-number-locale"
          >
            <select
              id="setting-number-locale"
              value={preferences.numberLocale}
              onChange={(e) => onUpdate('numberLocale', e.target.value)}
              className="w-full max-w-xs cursor-pointer rounded-md border border-border bg-muted/60 px-3 py-2 text-sm text-foreground transition-colors hover:border-border-strong focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {NUMBER_LOCALE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingsField>
        </div>
      </Card>
    </div>
  )
}

export default GeneralSection
