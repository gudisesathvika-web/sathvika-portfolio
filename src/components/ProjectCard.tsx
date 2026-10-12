import { type PublicProject, caseStudyHref } from '../data/publicProjects'
import { ArrowRightIcon } from './icons'

interface ProjectCardProps {
  project: PublicProject
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
        {project.stack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="project-card__footer">
        <span className="project-card__no-links">
          {project.underReview ? 'Details being confirmed' : 'Verified project'}
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