import { useCallback, useEffect, useState } from 'react'
import { fetchPublishedAchievements, type PublishedAchievement } from '../api/client'

interface State {
  achievements: PublishedAchievement[]
  loading: boolean
  error: string
  retry: () => void
}

export function usePublishedAchievements(): State {
  const [achievements, setAchievements] = useState<PublishedAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    fetchPublishedAchievements()
      .then((data) => { if (!cancelled) setAchievements(data) })
      .catch((err: unknown) => {
        if (!cancelled) {
          setAchievements([])
          setError(err instanceof Error ? err.message : 'Could not load achievements.')
        }
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [attempt])

  return { achievements, loading, error, retry }
}