import { useCallback, useEffect, useState } from 'react'
import { fetchPublishedAbout, type PublishedAbout } from '../api/client'

interface State {
  about: PublishedAbout | null
  loading: boolean
  error: string
  retry: () => void
}

export function usePublishedAbout(): State {
  const [about, setAbout] = useState<PublishedAbout | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    fetchPublishedAbout()
      .then((data) => {
        if (!cancelled) setAbout(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setAbout(null)
          setError(err instanceof Error ? err.message : 'Could not load About content.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  return { about, loading, error, retry }
}