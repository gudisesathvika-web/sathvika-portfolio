import { useEffect, useState } from 'react'

/** Normalize a pathname: strip trailing slashes, default to "/". */
export function normalize(path: string): string {
  const trimmed = path.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

export function currentPath(): string {
  return normalize(window.location.pathname)
}

/** Programmatic SPA navigation (pushState + re-render). */
export function navigate(to: string) {
  const target = normalize(to)
  if (currentPath() === target && !window.location.hash) return
  window.history.pushState({}, '', target)
  window.dispatchEvent(new Event('routechange'))
}

/** Current pathname, re-rendering on internal navigation or back/forward. */
export function usePathname(): string {
  const [path, setPath] = useState(currentPath)
  useEffect(() => {
    const onChange = () => setPath(currentPath())
    window.addEventListener('popstate', onChange)
    window.addEventListener('routechange', onChange)
    return () => {
      window.removeEventListener('popstate', onChange)
      window.removeEventListener('routechange', onChange)
    }
  }, [])
  return path
}

/** Current location hash (e.g. "#/admin"), re-rendering on change. */
export function useHash(): string {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    window.addEventListener('routechange', onChange)
    return () => {
      window.removeEventListener('hashchange', onChange)
      window.removeEventListener('routechange', onChange)
    }
  }, [])
  return hash
}
