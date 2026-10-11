import { type PublishedProject, caseStudyHref } from '../api/client'
import { ArrowRightIcon } from './icons'

interface ProjectCardProps {
  project: PublishedProject
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <li className="project-card">
      <header className="project-card__head">
        <span className="mono project-card__index">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="project-card__badges">
          <span className="tag" style={{ color: 'var(--accent)' }}>
            Published
          </span>
        </div>
      </header>

      <p className="project-card__direction">{project.direction}</p>
      <h3 className="project-card__title">{project.title}</h3>
      <p className="project-card__summary">{project.summary}</p>

      <ul className="project-card__stack">
        {project.stack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="project-card__footer">
        <span className="project-card__no-links">
          From the published portfolio feed
        </span>
        <a
          className="btn project-card__cta"
          href={caseStudyHref(project.id)}
        >
          Case study
          <ArrowRightIcon size={14} />
        </a>
      </div>
    </li>
  )
}