import { useEffect, useMemo, useRef } from 'react'
import { publicProjects } from '../data/publicProjects'
import { SectionShell } from '../components/SectionShell'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectCaseStudy } from '../components/ProjectCaseStudy'
import { useCaseStudyRoute } from '../hooks/useCaseStudyRoute'

export function Projects() {
  const caseStudyId = useCaseStudyRoute()

  const currentCaseStudy = useMemo(
    () => publicProjects.find((p) => p.id === caseStudyId) ?? null,
    [caseStudyId],
  )
  const showingCaseStudy = caseStudyId !== null
  const showingNotFound = showingCaseStudy && currentCaseStudy === null

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
      lede="Projects, described honestly."
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
          <p className="projects__count" aria-live="polite">
            {publicProjects.length} {publicProjects.length === 1 ? 'project' : 'projects'} shown.
          </p>
          <ul id="projects__list" className="projects__grid" role="list">
            {publicProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </ul>
        </div>
      )}
    </SectionShell>
  )
}
