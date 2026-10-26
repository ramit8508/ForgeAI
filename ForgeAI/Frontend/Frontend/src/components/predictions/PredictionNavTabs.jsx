import { NavLink } from 'react-router-dom'
import { Bot, History } from 'lucide-react'

/**
 * Prediction Navigation Tabs
 *
 * Tab switcher between the interactive AI Inference Workspace and the
 * historical operational log of predictions.
 */
function PredictionNavTabs() {
  return (
    <nav
      className="flex items-center gap-2 border-b border-border mb-6"
      aria-label="Predictions Navigation"
    >
      <NavLink
        to="/predictions"
        end
        className={({ isActive }) =>
          `inline-flex items-center gap-2 border-b-2 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
            isActive
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:border-border-strong hover:text-foreground'
          }`
        }
      >
        <Bot size={15} />
        <span>Inference Workspace</span>
      </NavLink>

      <NavLink
        to="/predictions/history"
        className={({ isActive }) =>
          `inline-flex items-center gap-2 border-b-2 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
            isActive
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:border-border-strong hover:text-foreground'
          }`
        }
      >
        <History size={15} />
        <span>Prediction History</span>
      </NavLink>
    </nav>
  )
}

export default PredictionNavTabs
