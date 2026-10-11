import { type PublishedProject } from '../api/client'

interface ProjectCaseStudyProps {
  project: PublishedProject
}

const BULLET_SECTIONS: {
  key: 'problem' | 'solution' | 'my_contribution' | 'architecture' | 'challenges' | 'outcomes'
  label: string
}[] = [
  { key: 'problem', label: 'The problem' },
  { key: 'solution', label: 'The solution' },
  { key: 'my_contribution', label: 'My contribution' },
  { key: 'architecture', label: 'Architecture & data flow' },
  { key: 'challenges', label: 'Challenges & lessons' },
  { key: 'outcomes', label: 'Verified outcomes' },
]

/**
 * Public case-study view for a published project. Renders the structured
 * sections persisted in the database and exposed by the public API — every
 * section is optional, empty sections are hidden, and no content is invented.
 * Draft content is never reachable here (published-only endpoint).
 */
export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  return (
    <article className="case-study">
      <a className="case-study__back" href="#projects">
        ← Projects
      </a>

      <header className="case-study__head">
        <p className="mono case-study__direction">{project.direction}</p>
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
      </header>

      <div className="case-study__body">
        {project.problem.length > 0 ||
        project.solution.length > 0 ||
        project.my_contribution.length > 0 ||
        project.architecture.length > 0 ||
        project.challenges.length > 0 ||
        project.outcomes.length > 0 ||
        project.users !== '' ? (
          BULLET_SECTIONS.map(({ key, label }) =>
            project[key].length > 0 ? (
              <section className="case-study__section" key={key}>
                <h2 className="case-study__section-label">{label}</h2>
                <div className="case-study__section-inner">
                  <ul className="case-study__list">
                    {project[key].map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null,
          )
        ) : (
          <section className="case-study__section">
            <h2 className="case-study__section-label">About this project</h2>
            <div className="case-study__section-inner">
              <p>{project.summary}</p>
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

        {project.stack_detail.length > 0 && (
          <section className="case-study__section">
            <h2 className="case-study__section-label">Technical stack</h2>
            <div className="case-study__section-inner">
              <ul className="case-study__list">
                {project.stack_detail.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {project.links.length > 0 && (
          <section className="case-study__section">
            <h2 className="case-study__section-label">References</h2>
            <div className="case-study__section-inner">
              <p className="case-study__links-label">Code, demo, or documentation</p>
              <ul className="case-study__link-list">
                {project.links.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="case-study__section">
          <h2 className="case-study__section-label">Content source</h2>
          <div className="case-study__section-inner">
            <p className="case-study__muted">
              This case study is loaded from the portfolio API and editable in the
              owner dashboard (last updated {project.updated_at}). Sections only
              appear when verified content exists — nothing is invented.
            </p>
          </div>
        </section>
      </div>
    </article>
  )
}