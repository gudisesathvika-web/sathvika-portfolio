import { useEffect, useState } from 'react'

const CASE_PREFIX = '#cases/'

/** Reads the case-study id from the current URL hash, or null. */
function readCaseStudyId(): string | null {
  const { hash } = window.location
  if (!hash.startsWith(CASE_PREFIX)) return null
  const id = decodeURIComponent(hash.slice(CASE_PREFIX.length))
  return id.length > 0 ? id : null
}

/**
 * Tracks the active case-study id from the hash route (#cases/<id>).
 *
 * Subscribes to `hashchange` so in-app links, direct URL loads, and browser
 * Back/Forward all update the view. Returns null whenever the hash is not a
 * case-study route, which lets the caller fall back to the project library.
 */
export function useCaseStudyRoute(): string | null {
  const [id, setId] = useState<string | null>(readCaseStudyId)

  useEffect(() => {
    const onChange = () => setId(readCaseStudyId())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return id
}
