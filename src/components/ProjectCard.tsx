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
  const hue = (project.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) * 37) % 80 + 180

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
      <div
        className="project-card__preview"
        aria-hidden="true"
        style={{
          background: `linear-gradient(135deg, hsla(${hue}, 72%, 58%, 0.24), rgba(17, 23, 40, 0.96)), radial-gradient(600px 220px at 22% 0%, hsla(${hue + 20}, 80%, 62%, 0.22), transparent 62%)`,
        }}
      >
        <span className="project-card__preview-mark">
          {project.title.charAt(0).toUpperCase()}
        </span>
        <span className="project-card__preview-label">Preview placeholder</span>
        {repoLink && (
          <a
            className="project-card__preview-action"
            href={repoLink.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open the ${project.title} GitHub repository`}
            onClick={(event) => event.stopPropagation()}
          >
            <GitHubIcon size={14} />
            GitHub Repository
          </a>
        )}
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

      <p className="project-card__direction">{project.direction}</p>
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
