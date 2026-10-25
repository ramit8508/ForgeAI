import { NavLink } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { navigationSections, systemNavigation } from '../../lib/navigation'
import { config } from '../../lib/config'

function NavItem({ item, onClick }) {
  const { label, icon: Icon, path } = item

  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'border-primary/20 bg-primary/8 text-primary'
            : 'border-transparent text-secondary-foreground hover:bg-card hover:text-foreground'
        }`
      }
      aria-label={label}
    >
      {({ isActive }) => (
        <>
          <Icon size={17} strokeWidth={isActive ? 2 : 1.8} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  )
}

function Sidebar({ mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col justify-between
          border-r border-border bg-[#0c1218] transition-transform duration-200
          lg:static lg:z-auto lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Sidebar navigation"
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-border p-3 lg:hidden">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Navigation
          </span>
          <button
            className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            type="button"
            onClick={onMobileClose}
            aria-label="Close navigation"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Navigation sections */}
        <div className="flex flex-1 flex-col gap-7 overflow-y-auto p-3 pt-5">
          {navigationSections.map((section) => (
            <div className="grid gap-2" key={section.label}>
              <span className="px-3 font-mono text-xs font-semibold tracking-[0.14em] text-muted-foreground">
                {section.label}
              </span>
              <nav className="grid gap-0.5" aria-label={section.label}>
                {section.items.map((item) => (
                  <NavItem item={item} key={item.id} onClick={onMobileClose} />
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* System section */}
        <div className="grid gap-2 border-t border-border p-4">
          <span className="px-3 font-mono text-xs font-semibold tracking-[0.14em] text-muted-foreground">
            SYSTEM
          </span>
          {systemNavigation.map((item) => (
            <NavItem item={item} key={item.id} onClick={onMobileClose} />
          ))}
          <div className="flex items-center gap-2 px-3 pt-2 font-mono text-xs text-muted-foreground">
            <SlidersHorizontal size={14} strokeWidth={1.8} />
            {config.app.name} / v{config.app.version}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
