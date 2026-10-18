import { useEffect, useRef, useState } from 'react'
import { navLinks, site } from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePathname } from '../router'
import { Link } from './RouterLink'
import { ResumeAction } from './ResumeAction'
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './icons'
import './topbar.css'

/** Route-aware primary navigation. */
const NAV = [
  { label: 'Home', to: '/', anchor: undefined as string | undefined, id: 'top' },
  { label: 'About', to: '/', anchor: 'about', id: 'about' },
  { label: 'Projects', to: '/projects', anchor: undefined, id: 'projects' },
  { label: 'Resume', to: '/resume', anchor: undefined, id: 'resume' },
  { label: 'Experience', to: '/experience', anchor: undefined, id: 'experience' },
  { label: 'Achievements', to: '/achievements', anchor: undefined, id: 'achievements' },
  { label: 'Contact', to: '/', anchor: 'contact', id: 'contact' },
]

const sectionIds = navLinks
  .filter((link) => link.href.startsWith('#'))
  .map((link) => link.href.replace('#', ''))

/**
 * Compact sticky navigation.
 * Desktop: inline route links + resume action.
 * Mobile: menu button toggling a full-width panel.
 */
export function TopBar() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = window.localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })
  const isCompact = useMediaQuery('(max-width: 860px)')
  const activeSection = useActiveSection(sectionIds)
  const path = usePathname()
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem('theme', theme)
    } catch {
      // ignore
    }
  }, [theme])

  useEffect(() => {
    if (!isCompact) setOpen(false)
  }, [isCompact])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open])

  const isCurrent = (item: (typeof NAV)[number]) => {
    if (item.anchor) return path === '/' && activeSection === item.anchor
    return path === item.to && !item.anchor
  }

  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <Link
          className="topbar__brand"
          to="/"
          aria-label={`${site.name} — home`}
        >
          <span className="topbar__monogram" aria-hidden="true">
            {site.initials}
          </span>
          <span className="topbar__brand-text">
            <span className="topbar__brand-name">{site.name}</span>
            <span className="topbar__brand-role">{site.identity}</span>
          </span>
        </Link>

        <nav className="topbar__nav" aria-label="Primary">
          <ul>
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  anchor={item.anchor}
                  aria-current={isCurrent(item) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="topbar__actions">
          <button
            type="button"
            className="topbar__theme"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <ResumeAction variant="ghost" compact className="topbar__resume" />
          <button
            ref={toggleRef}
            type="button"
            className="topbar__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`topbar__mobile${open ? ' is-open' : ''}`}
        hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul>
            {NAV.map((item, index) => (
              <li key={item.label} style={{ '--i': index } as React.CSSProperties}>
                <Link
                  to={item.to}
                  anchor={item.anchor}
                  aria-current={isCurrent(item) ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="topbar__mobile-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="topbar__mobile-footer">
          <ResumeAction variant="primary" />
        </div>
      </div>
    </header>
  )
}
