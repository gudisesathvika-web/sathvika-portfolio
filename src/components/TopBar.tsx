import { useEffect, useRef, useState } from 'react'
import { assets, navLinks, site, featuredProjectIds, caseStudyHref } from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { ResumeAction } from './ResumeAction'
import { CloseIcon, MenuIcon } from './icons'
import './topbar.css'

const sectionIds = navLinks.map((link) => link.href.replace('#', ''))

/**
 * Compact sticky navigation.
 * Desktop: inline links + resume action.
 * Mobile: menu button toggling a full-width panel (Escape closes it,
 * body scroll locks, closing is automatic when a link is followed).
 */
export function TopBar() {
  const [open, setOpen] = useState(false)
  const isCompact = useMediaQuery('(max-width: 860px)')
  const activeSection = useActiveSection(sectionIds)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Close the mobile panel when leaving the compact breakpoint.
  useEffect(() => {
    if (!isCompact) setOpen(false)
  }, [isCompact])

  // Escape closes the panel and returns focus to the toggle.
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

  const isCurrent = (id: string) => activeSection === id

  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <a
          className="topbar__brand"
          href="#top"
          aria-label={`${site.name} — back to top`}
        >
          <span className="topbar__monogram" aria-hidden="true">
            {site.initials}
          </span>
          <span className="topbar__brand-text">
            <span className="topbar__brand-name">{site.name}</span>
            <span className="topbar__brand-role">{site.identity}</span>
          </span>
        </a>

        <nav className="topbar__nav" aria-label="Primary">
          <ul>
            {navLinks.map((link) => {
              const id = link.href.replace('#', '')
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isCurrent(id) ? 'true' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
            {featuredProjectIds.map((id) => {
              const href = caseStudyHref(id)
              const label = featuredProjectIds.indexOf(id) + 1
              return (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={false}
                  >
                    <span className="sr-only">Case study: </span>
                    {label < 10 ? '0' : ''}{label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="topbar__actions">
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

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        className={`topbar__mobile${open ? ' is-open' : ''}`}
        hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul>
            {navLinks.map((link, index) => {
              const id = link.href.replace('#', '')
              return (
                <li key={link.href} style={{ '--i': index } as React.CSSProperties}>
                  <a
                    href={link.href}
                    aria-current={isCurrent(id) ? 'true' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span className="topbar__mobile-index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="topbar__mobile-footer">
          <ResumeAction variant="primary" />
          <p className="topbar__mobile-note">
            Portrait &amp; resume files live in{' '}
            <code>public/{assets.resume.path.split('/')[0]}/</code>
          </p>
        </div>
      </div>
    </header>
  )
}
