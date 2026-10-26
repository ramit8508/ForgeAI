import { Bell, ChevronDown, Menu } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { headerNavItems, routeLabels } from '../../lib/navigation'
import StatusIndicator from '../ui/StatusIndicator'

function Header({ onMenuToggle }) {
  const { pathname } = useLocation()
  const currentLabel =
    routeLabels[pathname] ||
    (pathname.startsWith('/machines')
      ? 'Machines'
      : pathname.startsWith('/predictions')
        ? 'Predictions'
        : 'Overview')

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:px-6">
      {/* Mobile menu trigger */}
      <button
        className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        type="button"
        onClick={onMenuToggle}
        aria-label="Toggle navigation menu"
      >
        <Menu size={20} strokeWidth={1.8} />
      </button>

      {/* Brand + breadcrumb */}
      <div className="flex items-center gap-2.5">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2.5"
          aria-label="ForgeAI — go to overview"
        >
          <span className="grid size-8 place-items-center rounded-sm border border-primary/50 bg-primary/8 font-mono text-sm font-bold text-primary">
            F
          </span>
          <span className="hidden leading-none sm:grid sm:gap-0.5">
            <strong className="text-sm font-semibold tracking-[0.12em]">FORGEAI</strong>
            <small className="font-mono text-xs tracking-[0.14em] text-muted-foreground">
              INDUSTRIAL AI
            </small>
          </span>
        </NavLink>

        {/* Breadcrumb */}
        <span className="hidden text-sm text-muted-foreground sm:inline" aria-hidden="true">/</span>
        <span className="hidden font-mono text-sm font-semibold uppercase tracking-[0.08em] text-foreground sm:inline">
          {currentLabel}
        </span>
      </div>

      {/* Desktop inline nav */}
      <nav className="ml-4 hidden h-full items-center gap-0.5 lg:flex" aria-label="Primary navigation">
        {headerNavItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.id}
            className={({ isActive }) => {
              const active =
                isActive ||
                (item.path === '/machines' && pathname.startsWith('/machines')) ||
                (item.path === '/predictions' && pathname.startsWith('/predictions'))
              return `relative flex h-full items-center px-3.5 text-sm font-medium transition-colors hover:text-foreground ${
                active
                  ? 'text-foreground after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:rounded-full after:bg-primary'
                  : 'text-muted-foreground'
              }`
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-3">
        <StatusIndicator status="online" className="hidden md:inline-flex" />
        <button
          className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          type="button"
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={1.8} />
        </button>
        <button
          className="flex items-center gap-1.5 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          type="button"
          aria-label="Open account menu"
        >
          <span className="grid size-8 place-items-center rounded-full bg-primary/12 font-mono text-xs font-semibold text-primary">
            OP
          </span>
          <ChevronDown size={14} strokeWidth={1.8} className="hidden sm:block" />
        </button>
      </div>
    </header>
  )
}

export default Header
