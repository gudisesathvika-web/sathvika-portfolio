import { useEffect, useState } from 'react'

export type AssetStatus = 'checking' | 'available' | 'missing'

/**
 * Checks whether a static asset (resume PDF, portrait, …) actually exists on
 * the server before we offer it to the user. Missing assets fail gracefully:
 * the UI switches to an explanation instead of a dead link.
 *
 * Note: a HEAD request is used; static hosts answer 404 for missing files,
 * which we interpret as "missing".
 */
export function useAssetStatus(url: string): AssetStatus {
  const [status, setStatus] = useState<AssetStatus>('checking')

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const check = async () => {
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal,
        })
        if (cancelled) return
        const type = response.headers.get('content-type') ?? ''
        const ok =
          response.ok && !type.includes('text/html') && response.status !== 404
        setStatus(ok ? 'available' : 'missing')
      } catch {
        if (!cancelled) setStatus('missing')
      }
    }

    void check()
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [url])

  return status
}
