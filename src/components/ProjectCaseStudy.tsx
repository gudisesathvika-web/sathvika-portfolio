import { type PublicProject } from '../data/publicProjects'
import { GitHubIcon } from './icons'

interface ProjectCaseStudyProps {
  project: PublicProject
}

function getWhatBuilt(project: PublicProject): string[] {
  const items: string[] = []
  if (project.solution.length > 0) {
    items.push(project.solution[0])
  }
  if (project.my_contribution.length > 0) {
    items.push(project.my_contribution[0])
  }
  return items.slice(0, 4)
}

function getTech(project: PublicProject): string[] {
  const items: string[] = []
  if (project.stack_detail.length > 0) items.push(project.stack_detail[0])
  if (project.architecture.length > 0) items.push(project.architecture[0])
  if (project.challenges.length > 0) items.push(project.challenges[0])
  return items.slice(0, 3)
}

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const repoLink = project.links.find((link) => /github\.com/i.test(link.url))
  const overview = project.problem.length > 0 ? project.problem[0] : project.summary
  const whatBuilt = getWhatBuilt(project)
  const tech = getTech(project)

  return (
    <article className="case-study case-study--compact">
      <a className="case-study__back" href="#projects">
        ← Back to All Projects
      </a>

      <header className="case-study__head">
        <div className="case-study__meta">
          <span className="mono case-study__direction">{project.direction}</span>
          {!project.underReview && (
            <span className="tag" style={{ color: 'var(--accent)' }}>
              Verified
            </span>
          )}
        </div>
        <h1
          className="case-study__title"
          id={`cs-${project.id}-title`}
          tabIndex={-1}
        >
          {project.title}
        </h1>
        <p className="case-study__lede">{project.summary}</p>
        <ul className="case-study__tags">
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {repoLink && (
          <div className="case-study__repo">
            <a
              className="btn"
              href={repoLink.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open the ${project.title} GitHub repository`}
            >
              <GitHubIcon size={16} />
              GitHub Repository
            </a>
          </div>
        )}
      </header>

      <div className="case-study__body">
        <section className="case-study__block">
          <h2 className="case-study__block-title">Overview</h2>
          <p className="case-study__text">{overview}</p>
        </section>

        {whatBuilt.length > 0 && (
          <section className="case-study__block">
            <h2 className="case-study__block-title">What I built</h2>
            <ul className="case-study__list">
              {whatBuilt.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {tech.length > 0 && (
          <section className="case-study__block">
            <h2 className="case-study__block-title">Technical approach</h2>
            <ul className="case-study__list">
              {tech.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}