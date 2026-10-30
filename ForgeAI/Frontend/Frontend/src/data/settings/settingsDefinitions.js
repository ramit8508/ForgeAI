/**
 * ForgeAI — Settings Definitions
 *
 * Centralised preference definitions, default values, and option lists.
 * Separates data from UI so that adding/removing a preference only
 * requires a change here and in the matching section component.
 *
 * All user preferences are non-sensitive display settings stored
 * in browser localStorage. No credentials, API keys, or model
 * parameters are stored here.
 */

// ─── Storage key ──────────────────────────────────────────────
export const SETTINGS_STORAGE_KEY = 'forgeai_user_preferences'

// ─── Default preference values ────────────────────────────────
export const DEFAULT_PREFERENCES = Object.freeze({
  // General
  timezone: 'local',
  dateFormat: 'relative',
  numberLocale: 'en-US',

  // Appearance
  density: 'comfortable',

  // Prediction display
  probabilityDecimals: 2,
  rawProbabilityDecimals: 6,
  defaultPreset: 'nominal',
})

// ─── Option lists ─────────────────────────────────────────────

export const TIMEZONE_OPTIONS = Object.freeze([
  { value: 'local', label: 'Local (Browser)' },
  { value: 'UTC', label: 'UTC' },
])

export const DATE_FORMAT_OPTIONS = Object.freeze([
  { value: 'relative', label: 'Relative (e.g. 3 min ago)' },
  { value: 'absolute', label: 'Absolute (e.g. 30 Oct 2026, 12:04)' },
  { value: 'iso', label: 'ISO 8601 (e.g. 2026-10-30T12:04:31)' },
])

export const NUMBER_LOCALE_OPTIONS = Object.freeze([
  { value: 'en-US', label: 'English (US) — 1,234.56' },
  { value: 'en-GB', label: 'English (UK) — 1,234.56' },
  { value: 'de-DE', label: 'German — 1.234,56' },
  { value: 'fr-FR', label: 'French — 1 234,56' },
  { value: 'ja-JP', label: 'Japanese — 1,234.56' },
])

export const DENSITY_OPTIONS = Object.freeze([
  { value: 'comfortable', label: 'Comfortable', description: 'Default spacing with generous padding.' },
  { value: 'compact', label: 'Compact', description: 'Reduced padding for information-dense views.' },
])

export const PROBABILITY_DECIMAL_OPTIONS = Object.freeze([
  { value: 0, label: '0 — 82%' },
  { value: 1, label: '1 — 82.4%' },
  { value: 2, label: '2 — 82.40%' },
  { value: 3, label: '3 — 82.400%' },
  { value: 4, label: '4 — 82.4000%' },
])

export const RAW_PROBABILITY_DECIMAL_OPTIONS = Object.freeze([
  { value: 4, label: '4 — 0.8240' },
  { value: 6, label: '6 — 0.824000' },
  { value: 8, label: '8 — 0.82400000' },
])

export const DEFAULT_PRESET_OPTIONS = Object.freeze([
  { value: 'nominal', label: 'Nominal Baseline' },
  { value: 'thermal_overstrain', label: 'Thermal Overstrain' },
  { value: 'tool_wear_critical', label: 'Severe Tool Wear' },
  { value: 'empty', label: 'Empty (blank fields)' },
])

// ─── Settings sections for navigation ─────────────────────────
export const SETTINGS_SECTIONS = Object.freeze([
  { id: 'general', label: 'General' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'predictions', label: 'Predictions' },
  { id: 'api-system', label: 'API & System' },
  { id: 'about', label: 'About' },
])
