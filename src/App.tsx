import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ResumePage } from './pages/ResumePage'
import { ExperiencePage } from './pages/ExperiencePage'
import { AchievementsPage } from './pages/AchievementsPage'
import { Footer } from './components/Footer'
import { TopBar } from './components/TopBar'
import { AdminApp } from './components/admin/AdminApp'
import { FloatingDock } from './components/FloatingDock'
import { InteractiveTerminal } from './components/InteractiveTerminal'
import { useHash, usePathname } from './router'
import './styles/sections.css'
import './styles/case-study.css'
import './styles/pages.css'
import './styles/polish.css'

const ROUTES: Record<string, ComponentType> = {
  '/projects': ProjectsPage,
  '/resume': ResumePage,
  '/experience': ExperiencePage,
  '/achievements': AchievementsPage,
}

function isAdminRoute(path: string, hash: string): boolean {
  if (hash.startsWith('#/admin')) return true
  return path === '/admin' || path === '/admin/'
}

export default function App() {
  const path = usePathname()
  const hash = useHash()
  const [terminalOpen, setTerminalOpen] = useState(false)

  // Keep the scroll position sensible on route changes.
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0 })
  }, [path])

  if (isAdminRoute(path, hash)) {
    return <AdminApp />
  }

  const Page = ROUTES[path]

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <TopBar />
      <main id="main">{Page ? <Page /> : <HomePage />}</main>
      <Footer />

      {/* Phase 4: Floating Quick Action Dock & Interactive CLI */}
      <FloatingDock onOpenTerminal={() => setTerminalOpen(true)} />
      <InteractiveTerminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </>
  )
}
