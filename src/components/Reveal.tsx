import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '../hooks/useMediaQuery'

interface RevealProps {
  children: ReactNode
  /** Optional class for the wrapper. */
  className?: string
  /** Stagger delay in ms when combined in a sequence. */
  delay?: number
  /** Render as a different element (e.g. 'li'). */
  as?: 'div' | 'li' | 'article'
}

/**
 * Fades content in once it scrolls into view. Falls back to immediately
 * visible content when IntersectionObserver is unavailable or the user
 * prefers reduced motion — animation must never hide information.
 */
export function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const reducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion])

  const style = { '--reveal-delay': `${delay}ms` } as React.CSSProperties
  const classes = ['reveal', visible ? 'is-visible' : '', className]
    .filter(Boolean)
    .join(' ')

  const Tag = as
  return (
    <Tag
      ref={ref as never}
      className={classes}
      style={style}
    >
      {children}
    </Tag>
  )
}
