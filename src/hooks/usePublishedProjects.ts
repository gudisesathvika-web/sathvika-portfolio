import { useCallback, useEffect, useState } from 'react'
import { fetchPublishedProjects, type PublishedProject } from '../api/client'

interface PublishedProjectsState {
  projects: PublishedProject[]
  loading: boolean
  error: string
  retry: () => void
}

/**
 * Loads published projects from GET /api/v1/projects (never the admin
 * endpoints). Exposes loading, a truthful error message, and a retry.
 */
export function usePublishedProjects(): PublishedProjectsState {
  const [projects, setProjects] = useState<PublishedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    fetchPublishedProjects()
      .then((data) => {
        if (!cancelled) setProjects(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setProjects([])
          setError(err instanceof Error ? err.message : 'Could not load projects.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  return { projects, loading, error, retry }
}