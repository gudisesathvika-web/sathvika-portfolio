import { useEffect } from 'react'
import type { ComponentType } from 'react'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ResumePage } from './pages/ResumePage'
import { ExperiencePage } from './pages/ExperiencePage'
import { AchievementsPage } from './pages/AchievementsPage'
import { Footer } from './components/Footer'
import { TopBar } from './components/TopBar'
import { AdminApp } from './components/admin/AdminApp'
import { useHash, usePathname } from './router'
import './styles/sections.css'
import './styles/case-study.css'
import './styles/pages.css'

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
    </>
  )
}
