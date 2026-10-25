import { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

/**
 * Root application layout.
 * Wraps all pages with the persistent sidebar + header shell.
 * Individual page content is rendered via React Router's <Outlet />.
 */
function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])
  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), [])

  return (
    <div className="min-h-screen">
      <Header onMenuToggle={toggleSidebar} />
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <Sidebar mobileOpen={sidebarOpen} onMobileClose={closeSidebar} />
        <main
          className="min-w-0 flex-1 bg-[linear-gradient(90deg,rgb(255_255_255_/_0.012)_1px,transparent_1px),linear-gradient(rgb(255_255_255_/_0.012)_1px,transparent_1px)] bg-[size:5rem_5rem]"
          id="main-content"
          role="main"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
