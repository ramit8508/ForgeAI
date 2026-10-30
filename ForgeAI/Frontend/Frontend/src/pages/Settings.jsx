/**
 * ForgeAI — Settings Workspace (Part 11)
 *
 * Professional settings workspace with sidebar navigation and five sections:
 * General, Appearance, Predictions, API & System, About.
 *
 * User preferences are persisted in localStorage and applied immediately.
 * Model parameters, API URLs, and classification thresholds are read-only.
 *
 * No credentials, API keys, or sensitive data are stored or exposed.
 */

import { useState, useCallback } from 'react'
import { RotateCcw } from 'lucide-react'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import SettingsNav from '../components/settings/SettingsNav'
import GeneralSection from '../components/settings/sections/GeneralSection'
import AppearanceSection from '../components/settings/sections/AppearanceSection'
import PredictionPreferencesSection from '../components/settings/sections/PredictionPreferencesSection'
import ApiSystemSection from '../components/settings/sections/ApiSystemSection'
import AboutSection from '../components/settings/sections/AboutSection'
import { useSettings } from '../hooks/useSettings'
import { DEFAULT_PREFERENCES } from '../data/settings/settingsDefinitions'

function Settings() {
  const [activeSection, setActiveSection] = useState('general')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetFeedback, setResetFeedback] = useState('')

  const {
    preferences,
    updatePreference,
    resetPreferences,
    isDirty,
  } = useSettings()

  const hasChanges = isDirty(DEFAULT_PREFERENCES)

  const handleResetAll = useCallback(() => {
    resetPreferences()
    setShowResetConfirm(false)
    setResetFeedback('All preferences restored to defaults.')
    const timer = setTimeout(() => setResetFeedback(''), 3000)
    return () => clearTimeout(timer)
  }, [resetPreferences])

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSection preferences={preferences} onUpdate={updatePreference} />
      case 'appearance':
        return <AppearanceSection preferences={preferences} onUpdate={updatePreference} />
      case 'predictions':
        return <PredictionPreferencesSection preferences={preferences} onUpdate={updatePreference} />
      case 'api-system':
        return <ApiSystemSection />
      case 'about':
        return <AboutSection />
      default:
        return <GeneralSection preferences={preferences} onUpdate={updatePreference} />
    }
  }

  return (
    <PageContainer>
      <PageHeader
        breadcrumb="Settings"
        tag="Configuration"
        title="Settings"
        description="Application preferences, display formatting, and system information."
      >
        {/* Reset all button */}
        {hasChanges && (
          <div className="relative">
            {!showResetConfirm ? (
              <Button
                variant="secondary"
                onClick={() => setShowResetConfirm(true)}
                className="gap-2 text-xs"
              >
                <RotateCcw size={13} strokeWidth={2} />
                Reset All
              </Button>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/8 px-3 py-2">
                <span className="text-xs text-warning">Reset all to defaults?</span>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="cursor-pointer rounded px-2 py-1 text-xs font-semibold text-warning transition-colors hover:bg-warning/15"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="cursor-pointer rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </PageHeader>

      {/* Reset feedback */}
      {resetFeedback && (
        <div
          className="mt-4 rounded-md border border-success/30 bg-success/8 px-4 py-2.5 text-xs font-medium text-success"
          role="status"
          aria-live="polite"
        >
          {resetFeedback}
        </div>
      )}

      {/* Main settings layout */}
      <div className="mt-7 grid gap-6 lg:grid-cols-[200px_1fr] lg:items-start">
        {/* Sidebar nav */}
        <div className="lg:sticky lg:top-20">
          <SettingsNav activeSection={activeSection} onSelect={setActiveSection} />
        </div>

        {/* Section content */}
        <div className="min-w-0">
          {renderSection()}
        </div>
      </div>
    </PageContainer>
  )
}

export default Settings
