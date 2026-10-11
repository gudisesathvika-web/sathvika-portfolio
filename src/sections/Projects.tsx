import { useEffect, useMemo, useRef, useState } from 'react'
import type { PublishedProject } from '../api/client'
import { SectionShell } from '../components/SectionShell'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectCaseStudy } from '../components/ProjectCaseStudy'
import { SearchIcon, CloseIcon } from '../components/icons'
import { useCaseStudyRoute } from '../hooks/useCaseStudyRoute'
import { usePublishedProjects } from '../hooks/usePublishedProjects'

/**
 * Combined, lower-cased text a published project can be matched against.
 * The API exposes title, direction, summary, and stack — search adapts to that.
 */
function searchableText(project: PublishedProject): string {
  return [project.title, project.direction, project.summary, ...project.stack]
    .join(' ')
    .toLowerCase()
}

export function Projects() {
  const [query, setQuery] = useState('')
  const caseStudyId = useCaseStudyRoute()
  const { projects, loading, error, retry } = usePublishedProjects()

  const currentCaseStudy = useMemo(
    () => projects.find((p) => p.id === caseStudyId) ?? null,
    [projects, caseStudyId],
  )
  const showingCaseStudy = caseStudyId !== null
  const showingNotFound = showingCaseStudy && currentCaseStudy === null

  const normalizedQuery = query.trim().toLowerCase()
  const results = useMemo(() => {
    if (!normalizedQuery) return projects
    return projects.filter(
      (project) => searchableText(project).includes(normalizedQuery),
    )
  }, [projects, normalizedQuery])

  const isFiltering = normalizedQuery.length > 0

  const resetFilters = () => setQuery('')

  // Focus management across library → case study → library transitions.
  const wasShowingCaseStudy = useRef(false)
  useEffect(() => {
    if (showingCaseStudy) {
      const id = showingNotFound ? 'cs-notfound' : `${currentCaseStudy?.id ?? ''}-title`
      const heading = document.getElementById(`cs-${id}`)
      if (heading) {
        heading.setAttribute('tabindex', '-1')
        heading.scrollIntoView({ block: 'start' })
        heading.focus({ preventScroll: true })
      }
    } else if (wasShowingCaseStudy.current) {
      const heading = document.getElementById('projects-title')
      if (heading) {
        heading.setAttribute('tabindex', '-1')
        heading.scrollIntoView({ block: 'start' })
        heading.focus({ preventScroll: true })
      }
    }
    wasShowingCaseStudy.current = showingCaseStudy
  }, [showingCaseStudy, showingNotFound, currentCaseStudy])

  return (
    <SectionShell
      id="projects"
      index="02"
      kicker="Projects"
      title="Work, told properly."
      lede="Published projects are served live from the portfolio API. Drafts are never shown publicly. Search below by name, direction, summary, or stack."
    >
      {showingNotFound ? (
        <div className="projects__case-study">
          <div className="case-study">
            <a className="case-study__back" href="#projects">
              ← Projects
            </a>
            <h1
              className="case-study__title"
              id="cs-cs-notfound"
              tabIndex={-1}
            >
              Case study not found
            </h1>
            <p className="case-study__lede">
              This case study is either unpublished or unavailable. It is never
              shown from draft content — only published projects are reachable.
            </p>
          </div>
        </div>
      ) : showingCaseStudy && currentCaseStudy ? (
        <div className="projects__case-study">
          <ProjectCaseStudy project={currentCaseStudy} />
        </div>
      ) : (
        <div className="projects__lib">
          <div className="projects__lib-head">
            <h2 className="projects__lib-title">Project library</h2>
            <p className="projects__lib-lede">
              Published projects from the portfolio API, newest first in the
              feed order. Searchable and keyboard accessible.
            </p>
          </div>

          <div
            className="projects__filters"
            role="search"
            aria-label="Filter projects"
          >
            <div className="projects__search">
              <SearchIcon size={14} aria-hidden="true" />
              <input
                type="search"
                className="projects__search-input"
                placeholder="Filter by name or tag…"
                aria-label="Search published projects by name, summary, or stack"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query.length > 0 && (
                <button
                  type="button"
                  className="projects__search-clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <CloseIcon size={14} />
                </button>
              )}
            </div>
          </div>

          {error ? (
            <div className="projects__empty">
              <p role="alert">{error}</p>
              <button
                type="button"
                className="btn btn--ghost projects__reset"
                onClick={retry}
              >
                Retry loading projects
              </button>
            </div>
          ) : loading ? (
            <p className="projects__count" role="status" aria-live="polite">
              Loading published projects…
            </p>
          ) : results.length === 0 ? (
            <div className="projects__empty">
              <p>
                {isFiltering
                  ? 'No published projects match your search.'
                  : 'No published projects yet. Published work will appear here.'}
              </p>
              {isFiltering && (
                <button
                  type="button"
                  className="btn btn--ghost projects__reset"
                  onClick={resetFilters}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="projects__count" aria-live="polite">
                {results.length} {results.length === 1 ? 'project' : 'projects'}
                {isFiltering ? ' match your search.' : ' published.'}
              </p>
              <ul id="projects__list" className="projects__grid" role="list">
                {results.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </SectionShell>
  )
}