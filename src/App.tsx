import { useEffect, useState } from 'react'
import { About } from './sections/About'
import { Projects } from './sections/Projects'
import { Experience } from './sections/Experience'
import { Skills } from './sections/Skills'
import { Achievements } from './sections/Achievements'
import { Contact } from './sections/Contact'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { TopBar } from './components/TopBar'
import { AdminApp } from './components/admin/AdminApp'
import './styles/sections.css'
import './styles/case-study.css'

/** True when the URL points at the private owner console. */
function isAdminRoute(): boolean {
  const { hash, pathname } = window.location
  if (hash.startsWith('#/admin')) return true
  return pathname === '/admin' || pathname === '/admin/'
}

export default function App() {
  const [adminRoute, setAdminRoute] = useState<boolean>(isAdminRoute)

  useEffect(() => {
    const onChange = () => setAdminRoute(isAdminRoute())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  if (adminRoute) {
    return <AdminApp />
  }

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <TopBar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  )
}