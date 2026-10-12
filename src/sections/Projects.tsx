import { useEffect, useMemo, useRef, useState } from 'react'
import { publicProjects, type PublicProject } from '../data/publicProjects'
import { SectionShell } from '../components/SectionShell'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectCaseStudy } from '../components/ProjectCaseStudy'
import { SearchIcon, CloseIcon } from '../components/icons'
import { useCaseStudyRoute } from '../hooks/useCaseStudyRoute'

/**
 * Combined, lower-cased text a project can be matched against. Search spans
 * title, direction, summary, and stack.
 */
function searchableText(project: PublicProject): string {
  return [project.title, project.direction, project.summary, ...project.stack]
    .join(' ')
    .toLowerCase()
}

export function Projects() {
  const [query, setQuery] = useState('')
  const caseStudyId = useCaseStudyRoute()

  const currentCaseStudy = useMemo(
    () => publicProjects.find((p) => p.id === caseStudyId) ?? null,
    [caseStudyId],
  )
  const showingCaseStudy = caseStudyId !== null
  const showingNotFound = showingCaseStudy && currentCaseStudy === null

  const normalizedQuery = query.trim().toLowerCase()
  const results = useMemo(() => {
    if (!normalizedQuery) return publicProjects
    return publicProjects.filter((project) =>
      searchableText(project).includes(normalizedQuery),
    )
  }, [normalizedQuery])

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
      lede="Projects, described honestly. Search below by name, direction, summary, or stack."
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
              This case study is either unpublished or unavailable. Only
              verified projects are reachable here.
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
              Every documented project. Searchable and keyboard accessible.
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
                aria-label="Search projects by name, summary, or stack"
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

          {results.length === 0 ? (
            <div className="projects__empty">
              <p>
                {isFiltering
                  ? 'No projects match your search.'
                  : 'No projects yet. Documented work will appear here.'}
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
                {isFiltering ? ' match your search.' : ' shown.'}
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
