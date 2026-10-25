/**
 * ForgeAI — Navigation configuration
 *
 * Single source of truth for all navigation items.
 * Both <Header /> and <Sidebar /> render from this config.
 * Adding/removing a route only requires a change here.
 */

import {
  Activity,
  Bot,
  Gauge,
  LayoutDashboard,
  Settings,
  Wrench,
} from 'lucide-react'

/**
 * Each section maps to a visual group in the sidebar.
 * `path` maps to a React Router route.
 */
export const navigationSections = [
  {
    label: 'WORKSPACE',
    items: [
      { id: 'overview',    label: 'Overview',    icon: LayoutDashboard, path: '/dashboard' },
      { id: 'machines',    label: 'Machines',    icon: Wrench,          path: '/machines' },
      { id: 'predictions', label: 'Predictions', icon: Bot,             path: '/predictions' },
    ],
  },
  {
    label: 'MONITORING',
    items: [
      { id: 'monitoring',  label: 'Monitoring',  icon: Activity, path: '/monitoring' },
      { id: 'ai-insights', label: 'AI Insights', icon: Gauge,    path: '/insights' },
    ],
  },
]

/**
 * System section — rendered at the bottom of the sidebar.
 */
export const systemNavigation = [
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
]

/**
 * Flat list of all nav items for the header.
 */
export const headerNavItems = navigationSections.flatMap((s) => s.items)

/**
 * Lookup map: path → label (used by Header breadcrumb).
 */
export const routeLabels = Object.fromEntries(
  [...headerNavItems, ...systemNavigation].map((item) => [item.path, item.label]),
)
