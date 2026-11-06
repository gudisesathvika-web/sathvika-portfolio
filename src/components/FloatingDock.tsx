import { useState, useEffect } from 'react'
import { contact } from '../data/content'
import { GitHubIcon, LinkedInIcon } from './icons'
import './floating-dock.css'

interface FloatingDockProps {
  onOpenTerminal: () => void
}

export function FloatingDock({ onOpenTerminal }: FloatingDockProps) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // fallback
      window.location.href = `mailto:${contact.email}`
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className={`floating-dock ${visible ? 'floating-dock--visible' : ''}`} role="region" aria-label="Quick Actions">
        <div className="floating-dock__inner glass-panel">
          {/* Terminal / CLI Trigger */}
          <button
            type="button"
            className="floating-dock__btn floating-dock__btn--terminal mono"
            onClick={onOpenTerminal}
            aria-label="Open Interactive CLI Terminal"
            title="Open Interactive CLI Terminal"
          >
            <span className="floating-dock__prompt">&gt;_</span>
            <span className="floating-dock__label">CLI</span>
          </button>

          <div className="floating-dock__divider" aria-hidden="true" />

          {/* Copy Email Button */}
          <button
            type="button"
            className="floating-dock__btn"
            onClick={copyEmail}
            aria-label="Copy email address"
            title={contact.email}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span className="floating-dock__label">{copied ? 'Copied!' : 'Email'}</span>
          </button>

          {/* GitHub link */}
          <a
            className="floating-dock__btn"
            href="https://github.com/Sathvikagudise"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            title="GitHub"
          >
            <GitHubIcon size={14} />
          </a>

          {/* LinkedIn link */}
          <a
            className="floating-dock__btn"
            href="https://www.linkedin.com/in/sathvikayadav"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            title="LinkedIn"
          >
            <LinkedInIcon size={14} />
          </a>

          {/* Back to top */}
          <button
            type="button"
            className="floating-dock__btn floating-dock__btn--top"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            title="Back to top"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Floating Copied Toast */}
      {copied && (
        <div className="dock-toast" role="status" aria-live="polite">
          <span className="dock-toast__dot" />
          <span>Email copied to clipboard ({contact.email})</span>
        </div>
      )}
    </>
  )
}

