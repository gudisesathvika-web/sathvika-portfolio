import type React from 'react'
import { type PublicProject } from '../data/publicProjects'
import { GitHubIcon, ExternalIcon } from './icons'

interface ProjectCardProps {
  project: PublicProject
  index?: number
  onOpen?: (project: PublicProject) => void
}

export function ProjectCard({ project, index = 0, onOpen }: ProjectCardProps) {
  const repoLink = project.links.find((link) => /github\.com/i.test(link.url))
  const demoLink = project.links.find((link) => !/github\.com/i.test(link.url))

  const open = () => onOpen?.(project)

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      open()
    }
  }

  return (
    <li
      className="project-card"
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${project.title}`}
      onClick={open}
      onKeyDown={handleKeyDown}
    >
      <div className="project-card__preview" aria-hidden="true">
        <span className="project-card__preview-mark">
          {project.title.charAt(0).toUpperCase()}
        </span>
      </div>

      <header className="project-card__head">
        <span className="mono project-card__index">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="project-card__badges">
          {project.underReview ? (
            <span className="tag tag--review">Under review</span>
          ) : (
            <span className="tag" style={{ color: 'var(--accent)' }}>
              Verified
            </span>
          )}
        </div>
      </header>

      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__summary">{project.summary}</p>

      <ul className="project-card__stack">
        {project.stack.slice(0, 5).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="project-card__actions">
        {repoLink ? (
          <a
            className="project-card__action-link"
            href={repoLink.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open the ${project.title} GitHub repository`}
            onClick={(event) => event.stopPropagation()}
          >
            <GitHubIcon size={14} />
            GitHub Repository
          </a>
        ) : (
          <span className="project-card__no-links">Repository not linked</span>
        )}
        {demoLink && (
          <a
            className="project-card__action-link"
            href={demoLink.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open the ${project.title} live demo`}
            onClick={(event) => event.stopPropagation()}
          >
            <ExternalIcon size={14} />
            Live Demo
          </a>
        )}
      </div>
    </li>
  )
}
