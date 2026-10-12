import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { navigate, normalize } from '../router'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
  /** Optional element id to scroll to after navigation. */
  anchor?: string
  children: ReactNode
}

/**
 * Anchor that navigates with the SPA router, preserving real `href`s so direct
 * URL loading and middle-click/new-tab keep working.
 */
export function Link({ to, anchor, children, onClick, ...rest }: LinkProps) {
  const href = `${normalize(to)}${anchor ? `#${anchor}` : ''}`

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return
    }
    event.preventDefault()
    navigate(to)
    if (anchor) {
      window.history.replaceState({}, '', `${normalize(to)}#${anchor}`)
      window.requestAnimationFrame(() => {
        const el = document.getElementById(anchor)
        if (el) el.scrollIntoView({ block: 'start' })
      })
    } else {
      window.scrollTo({ top: 0 })
    }
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
