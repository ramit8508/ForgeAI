/**
 * ForgeAI — Prediction Preferences Section
 *
 * Display preferences for probability formatting and default
 * prediction workspace behavior. These are frontend display
 * preferences only — they do not modify the model's inference,
 * classification threshold, or risk logic.
 */

import Card from '../../ui/Card'
import SettingsField from './SettingsField'
import {
  PROBABILITY_DECIMAL_OPTIONS,
  RAW_PROBABILITY_DECIMAL_OPTIONS,
  DEFAULT_PRESET_OPTIONS,
} from '../../../data/settings/settingsDefinitions'
import { config } from '../../../lib/config'

function PredictionPreferencesSection({ preferences, onUpdate }) {
  // Live preview using current preference values
  const previewPercent = (0.82400123 * 100).toFixed(preferences.probabilityDecimals) + '%'
  const previewRaw = (0.82400123).toFixed(preferences.rawProbabilityDecimals)

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-base font-semibold">Prediction Preferences</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Display preferences for probability formatting and workspace defaults.
          These settings affect how results are displayed — they do not change model behavior.
        </p>
      </div>

      {/* Probability display */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Probability Display</h3>
        <div className="grid gap-5">
          <SettingsField
            label="Percentage Precision"
            description="Number of decimal places for failure probability percentages."
            htmlFor="setting-prob-decimals"
          >
            <select
              id="setting-prob-decimals"
              value={preferences.probabilityDecimals}
              onChange={(e) => onUpdate('probabilityDecimals', Number(e.target.value))}
              className="w-full max-w-xs cursor-pointer rounded-md border border-border bg-muted/60 px-3 py-2 text-sm text-foreground transition-colors hover:border-border-strong focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {PROBABILITY_DECIMAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingsField>

          <div className="border-t border-border" />

          <SettingsField
            label="Raw Probability Precision"
            description="Decimal places for raw probability values in technical detail views."
            htmlFor="setting-raw-decimals"
          >
            <select
              id="setting-raw-decimals"
              value={preferences.rawProbabilityDecimals}
              onChange={(e) => onUpdate('rawProbabilityDecimals', Number(e.target.value))}
              className="w-full max-w-xs cursor-pointer rounded-md border border-border bg-muted/60 px-3 py-2 text-sm text-foreground transition-colors hover:border-border-strong focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {RAW_PROBABILITY_DECIMAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingsField>

          {/* Live preview */}
          <div className="rounded-md border border-border bg-muted/40 px-4 py-3">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Preview
            </span>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span>
                <span className="text-muted-foreground">Percentage: </span>
                <span className="font-mono font-semibold text-foreground">{previewPercent}</span>
              </span>
              <span className="text-border">|</span>
              <span>
                <span className="text-muted-foreground">Raw: </span>
                <span className="font-mono font-semibold text-foreground">{previewRaw}</span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Default workspace behavior */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Workspace Defaults</h3>
        <div className="grid gap-5">
          <SettingsField
            label="Default Sensor Preset"
            description="Initial telemetry preset loaded when opening the prediction workspace."
            htmlFor="setting-default-preset"
          >
            <select
              id="setting-default-preset"
              value={preferences.defaultPreset}
              onChange={(e) => onUpdate('defaultPreset', e.target.value)}
              className="w-full max-w-xs cursor-pointer rounded-md border border-border bg-muted/60 px-3 py-2 text-sm text-foreground transition-colors hover:border-border-strong focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {DEFAULT_PRESET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingsField>
        </div>
      </Card>

      {/* Model parameters — read-only reference */}
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Model Parameters</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          These values are configured on the backend and cannot be changed through the frontend.
          They are displayed here for operational reference only.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: 'Model', value: config.model.name },
            { label: 'Threshold', value: config.model.thresholdPercent },
            { label: 'Estimators', value: String(config.model.estimators) },
            { label: 'Max Depth', value: String(config.model.maxDepth) },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2">
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="font-mono text-xs font-semibold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default PredictionPreferencesSection
