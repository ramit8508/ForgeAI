/**
 * ForgeAI — Settings Sidebar Navigation
 *
 * Vertical navigation for settings sections, rendered as an
 * in-page sidebar within the settings workspace. On mobile,
 * collapses to a horizontal scrollable tab strip.
 */

import { cn } from '../../lib/utils'
import { SETTINGS_SECTIONS } from '../../data/settings/settingsDefinitions'

function SettingsNav({ activeSection, onSelect }) {
  return (
    <nav aria-label="Settings sections">
      {/* Desktop: vertical sidebar */}
      <div className="hidden lg:block">
        <span className="mb-3 block px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Settings
        </span>
        <ul className="grid gap-0.5" role="list">
          {SETTINGS_SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => onSelect(section.id)}
                className={cn(
                  'w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                  activeSection === section.id
                    ? 'border border-primary/20 bg-primary/8 text-primary'
                    : 'border border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                )}
                aria-current={activeSection === section.id ? 'page' : undefined}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile/tablet: horizontal scrollable tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 lg:hidden" role="tablist">
        {SETTINGS_SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            role="tab"
            onClick={() => onSelect(section.id)}
            aria-selected={activeSection === section.id}
            className={cn(
              'shrink-0 cursor-pointer rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
              activeSection === section.id
                ? 'border border-primary/20 bg-primary/8 text-primary'
                : 'border border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground',
            )}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default SettingsNav
