import { useEffect, useRef } from 'react'
import { type PublicProject } from '../data/publicProjects'
import { CloseIcon, GitHubIcon, ExternalIcon } from './icons'

interface ProjectModalProps {
  project: PublicProject | null
  onClose: () => void
}

function repoLink(project: PublicProject) {
  return project.links.find((link) => /github\.com/i.test(link.url)) ?? null
}

function demoLink(project: PublicProject) {
  return project.links.find((link) => !/github\.com/i.test(link.url)) ?? null
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!project) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  if (!project) return null

  const repository = repoLink(project)
  const demo = demoLink(project)
  const overview = project.problem.length > 0 ? project.problem[0] : project.summary
  const whatBuilt = [...project.solution, ...project.my_contribution].slice(0, 4)
  const technical = [...project.stack_detail, ...project.architecture, ...project.challenges].slice(0, 4)

  return (
    <div
      className="project-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <button
        type="button"
        className="project-modal__backdrop"
        aria-label="Close project details"
        onClick={onClose}
      />
      <div className="project-modal__panel">
        <button
          ref={closeRef}
          type="button"
          className="project-modal__close"
          aria-label="Close"
          onClick={onClose}
        >
          <CloseIcon size={18} />
        </button>

        <div className="project-modal__preview" aria-hidden="true">
          <span className="project-modal__preview-mark">
            {project.title.charAt(0).toUpperCase()}
          </span>
          <span className="project-modal__preview-label">Project preview</span>
        </div>

        <header className="project-modal__head">
          <p className="project-modal__direction">{project.direction}</p>
          <h2 id="project-modal-title" className="project-modal__title">
            {project.title}
          </h2>
          <p className="project-modal__summary">{project.summary}</p>
          <ul className="project-modal__tags">
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="project-modal__actions">
            {repository && (
              <a
                className="btn"
                href={repository.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open the ${project.title} GitHub repository`}
              >
                <GitHubIcon size={16} />
                GitHub Repository
              </a>
            )}
            {demo && (
              <a
                className="btn btn--ghost"
                href={demo.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open the ${project.title} live demo`}
              >
                <ExternalIcon size={14} />
                Live Demo
              </a>
            )}
          </div>
        </header>

        <div className="project-modal__body">
          <section className="project-modal__block">
            <h3 className="project-modal__block-title">Overview</h3>
            <p className="project-modal__text">{overview}</p>
          </section>

          {whatBuilt.length > 0 && (
            <section className="project-modal__block">
              <h3 className="project-modal__block-title">What I built</h3>
              <ul className="project-modal__list">
                {whatBuilt.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {technical.length > 0 && (
            <section className="project-modal__block">
              <h3 className="project-modal__block-title">Technical details</h3>
              <ul className="project-modal__list">
                {technical.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
