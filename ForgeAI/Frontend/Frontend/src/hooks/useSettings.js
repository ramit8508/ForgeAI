/**
 * ForgeAI — User Preferences Hook
 *
 * Manages non-sensitive display preferences via localStorage.
 * Provides read/write/reset for individual keys and the full
 * preferences object.
 *
 * Invalid or missing stored values fall back to safe defaults.
 * Never stores credentials, API keys, or model parameters.
 */

import { useState, useCallback, useMemo } from 'react'
import {
  SETTINGS_STORAGE_KEY,
  DEFAULT_PREFERENCES,
} from '../data/settings/settingsDefinitions'

/**
 * Read saved preferences from localStorage, falling back to defaults
 * for any missing or invalid keys.
 */
function loadPreferences() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PREFERENCES }

    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { ...DEFAULT_PREFERENCES }
    }

    // Merge with defaults so new keys always have a value
    // and stale/unexpected keys don't corrupt state
    const merged = { ...DEFAULT_PREFERENCES }
    for (const key of Object.keys(DEFAULT_PREFERENCES)) {
      if (key in parsed && typeof parsed[key] === typeof DEFAULT_PREFERENCES[key]) {
        merged[key] = parsed[key]
      }
    }
    return merged
  } catch {
    return { ...DEFAULT_PREFERENCES }
  }
}

/**
 * Persist the full preferences object to localStorage.
 */
function persistPreferences(prefs) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // Storage quota exceeded or private browsing — silently ignore
  }
}

/**
 * @returns {{
 *   preferences: Record<string, any>,
 *   updatePreference: (key: string, value: any) => void,
 *   updatePreferences: (partial: Record<string, any>) => void,
 *   resetPreferences: () => void,
 *   resetSection: (keys: string[]) => void,
 *   isDirty: (compareWith: Record<string, any>) => boolean,
 * }}
 */
export function useSettings() {
  const [preferences, setPreferences] = useState(loadPreferences)

  /** Update a single preference key and persist immediately. */
  const updatePreference = useCallback((key, value) => {
    setPreferences((prev) => {
      if (!(key in DEFAULT_PREFERENCES)) return prev
      const next = { ...prev, [key]: value }
      persistPreferences(next)
      return next
    })
  }, [])

  /** Batch-update multiple preferences and persist. */
  const updatePreferences = useCallback((partial) => {
    setPreferences((prev) => {
      const next = { ...prev }
      for (const [key, value] of Object.entries(partial)) {
        if (key in DEFAULT_PREFERENCES) {
          next[key] = value
        }
      }
      persistPreferences(next)
      return next
    })
  }, [])

  /** Reset all preferences to factory defaults. */
  const resetPreferences = useCallback(() => {
    const defaults = { ...DEFAULT_PREFERENCES }
    setPreferences(defaults)
    persistPreferences(defaults)
  }, [])

  /** Reset a subset of preferences (e.g. a single section). */
  const resetSection = useCallback((keys) => {
    setPreferences((prev) => {
      const next = { ...prev }
      for (const key of keys) {
        if (key in DEFAULT_PREFERENCES) {
          next[key] = DEFAULT_PREFERENCES[key]
        }
      }
      persistPreferences(next)
      return next
    })
  }, [])

  /** Check if current preferences differ from a snapshot. */
  const isDirty = useCallback(
    (compareWith) => {
      for (const key of Object.keys(DEFAULT_PREFERENCES)) {
        if (preferences[key] !== compareWith[key]) return true
      }
      return false
    },
    [preferences],
  )

  return useMemo(
    () => ({
      preferences,
      updatePreference,
      updatePreferences,
      resetPreferences,
      resetSection,
      isDirty,
    }),
    [preferences, updatePreference, updatePreferences, resetPreferences, resetSection, isDirty],
  )
}
