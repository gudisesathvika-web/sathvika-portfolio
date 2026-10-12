import { type PublicProject } from '../data/publicProjects'
import { GitHubIcon } from './icons'

interface ProjectCaseStudyProps {
  project: PublicProject
}

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const repoLink = project.links.find((link) => /github\.com/i.test(link.url))

  return (
    <article className="case-study">
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
            <li key={item}>
              <span className="tag">{item}</span>
            </li>
          ))}
        </ul>
        {repoLink && (
          <div className="case-study__repo">
            <a
              className="btn btn--ghost"
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
        {project.underReview && (
          <p className="case-study__review-note">
            <span className="tag tag--review">Under review</span>
            Details for this project are still being confirmed.
          </p>
        )}
      </header>

      <div className="case-study__body">
        {project.problem.length > 0 && (
          <section className="case-study__section">
            <h2 className="case-study__section-label">Problem</h2>
            <div className="case-study__section-inner">
              {project.problem.length === 1 ? (
                <p>{project.problem[0]}</p>
              ) : (
                <ul className="case-study__list">
                  {project.problem.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {project.solution.length > 0 && (
          <section className="case-study__section">
            <h2 className="case-study__section-label">Solution</h2>
            <div className="case-study__section-inner">
              {project.solution.length === 1 ? (
                <p>{project.solution[0]}</p>
              ) : (
                <ul className="case-study__list">
                  {project.solution.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {((project.my_contribution.length > 0) ||
          (project.stack_detail.length > 0) ||
          (project.architecture.length > 0) ||
          (project.challenges.length > 0)) && (
          <section className="case-study__section">
            <h2 className="case-study__section-label">Technical Highlights</h2>
            <div className="case-study__section-inner">
              {project.stack_detail.length > 0 && (
                <>
                  <h3 className="case-study__subheading">Technical stack</h3>
                  <ul className="case-study__list">
                    {project.stack_detail.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
              {project.architecture.length > 0 && (
                <>
                  <h3 className="case-study__subheading">Architecture</h3>
                  {project.architecture.length === 1 ? (
                    <p>{project.architecture[0]}</p>
                  ) : (
                    <ul className="case-study__list">
                      {project.architecture.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
              {project.my_contribution.length > 0 && (
                <>
                  <h3 className="case-study__subheading">My contribution</h3>
                  {project.my_contribution.length === 1 ? (
                    <p>{project.my_contribution[0]}</p>
                  ) : (
                    <ul className="case-study__list">
                      {project.my_contribution.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
              {project.challenges.length > 0 && (
                <>
                  <h3 className="case-study__subheading">Challenges &amp; lessons</h3>
                  {project.challenges.length === 1 ? (
                    <p>{project.challenges[0]}</p>
                  ) : (
                    <ul className="case-study__list">
                      {project.challenges.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </section>
        )}

        {project.users !== '' && (
          <section className="case-study__section">
            <h2 className="case-study__section-label">Who it is for</h2>
            <div className="case-study__section-inner">
              <p className="case-study__users">{project.users}</p>
            </div>
          </section>
        )}

        {project.outcomes.length > 0 && (
          <section className="case-study__section">
            <h2 className="case-study__section-label">Verified outcomes</h2>
            <div className="case-study__section-inner">
              {project.outcomes.length === 1 ? (
                <p>{project.outcomes[0]}</p>
              ) : (
                <ul className="case-study__list">
                  {project.outcomes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}