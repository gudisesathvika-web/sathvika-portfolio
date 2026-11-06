import { useState } from 'react'
import { projects } from '../data/content'
import { Link } from './RouterLink'
import { ArrowRightIcon, GitHubIcon } from './icons'
import './featured-projects.css'

type FilterCategory = 'all' | 'ai-cv' | 'automation' | 'systems'

export function FeaturedProjects() {
  const [filter, setFilter] = useState<FilterCategory>('all')

  const allFeatured = projects.filter((p) => p.status === 'featured')

  const filtered = allFeatured.filter((p) => {
    if (filter === 'ai-cv') {
      return (
        p.id === 'crisis-mind' ||
        p.id === 'smartid' ||
        p.direction.toLowerCase().includes('vision') ||
        p.direction.toLowerCase().includes('multimodal')
      )
    }
    if (filter === 'automation') {
      return (
        p.id === 'scoutiq' ||
        p.id === 'grant-automator' ||
        p.direction.toLowerCase().includes('automation') ||
        p.direction.toLowerCase().includes('lead')
      )
    }
    if (filter === 'systems') {
      return (
        p.id === 'skillforge' ||
        p.id === 'accessguard' ||
        p.direction.toLowerCase().includes('learning') ||
        p.direction.toLowerCase().includes('anomaly')
      )
    }
    return true
  })

  const aiCount = allFeatured.filter(
    (p) =>
      p.id === 'crisis-mind' ||
      p.id === 'smartid' ||
      p.direction.toLowerCase().includes('vision') ||
      p.direction.toLowerCase().includes('multimodal'),
  ).length

  const automationCount = allFeatured.filter(
    (p) =>
      p.id === 'scoutiq' ||
      p.id === 'grant-automator' ||
      p.direction.toLowerCase().includes('automation') ||
      p.direction.toLowerCase().includes('lead'),
  ).length

  const systemsCount = allFeatured.filter(
    (p) =>
      p.id === 'skillforge' ||
      p.id === 'accessguard' ||
      p.direction.toLowerCase().includes('learning') ||
      p.direction.toLowerCase().includes('anomaly'),
  ).length

  return (
    <section className="featured-work" id="featured-work" aria-labelledby="featured-work-title">
      <div className="container">
        <header className="featured-work__head">
          <div className="featured-work__kicker-wrap">
            <span className="kicker mono">Selected Engineering</span>
            <span className="featured-work__count mono">
              {String(allFeatured.length).padStart(2, '0')} Flagship Systems
            </span>
          </div>
          <h2 className="featured-work__title" id="featured-work-title">
            Featured Projects
          </h2>
          <p className="featured-work__lede">
            Real intelligent systems with working architectures, practical problem spaces, forensic heatmaps, and verified codebases.
          </p>

          <div className="featured-work__filters" role="tablist" aria-label="Filter featured projects">
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              className={`featured-filter-btn ${filter === 'all' ? 'featured-filter-btn--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Flagships <span className="featured-filter-count">{allFeatured.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'ai-cv'}
              className={`featured-filter-btn ${filter === 'ai-cv' ? 'featured-filter-btn--active' : ''}`}
              onClick={() => setFilter('ai-cv')}
            >
              AI &amp; Computer Vision <span className="featured-filter-count">{aiCount}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'automation'}
              className={`featured-filter-btn ${filter === 'automation' ? 'featured-filter-btn--active' : ''}`}
              onClick={() => setFilter('automation')}
            >
              Autonomous Automations <span className="featured-filter-count">{automationCount}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'systems'}
              className={`featured-filter-btn ${filter === 'systems' ? 'featured-filter-btn--active' : ''}`}
              onClick={() => setFilter('systems')}
            >
              Adaptive &amp; Security Systems <span className="featured-filter-count">{systemsCount}</span>
            </button>
          </div>
        </header>

        <div className="featured-work__grid">
          {filtered.map((project, idx) => {
            const repoLink = project.links.find((l) => /github\.com/i.test(l.url))
            return (
              <article key={project.id} className="featured-card glass-panel">
                <div className="featured-card__top">
                  <div className="featured-card__meta">
                    <span className="featured-card__index mono">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="tag tag--accent">{project.direction}</span>
                  </div>

                  <h3 className="featured-card__title">
                    <a href={`/projects#cases/${project.id}`}>{project.title}</a>
                  </h3>

                  <p className="featured-card__summary">{project.summary}</p>

                  <div className="featured-card__highlights">
                    <h4 className="featured-card__subhead mono">Architecture &amp; Contribution</h4>
                    <p className="featured-card__text">
                      {project.myContribution[0] || project.solution[0]}
                    </p>
                  </div>
                </div>

                <div className="featured-card__bottom">
                  <div className="featured-card__stack-wrap">
                    <span className="featured-card__stack-label mono">Tech Stack:</span>
                    <ul className="featured-card__stack" role="list">
                      {project.stack.map((tech) => (
                        <li key={tech} className="featured-card__pill">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="featured-card__actions">
                    {repoLink && (
                      <a
                        className="btn btn--ghost featured-card__btn"
                        href={repoLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`GitHub repository for ${project.title}`}
                      >
                        <GitHubIcon size={14} />
                        GitHub Repo
                      </a>
                    )}
                    <a
                      className="btn btn--primary featured-card__btn"
                      href={`/projects#cases/${project.id}`}
                    >
                      Read Case Study
                      <ArrowRightIcon size={13} />
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="featured-work__footer">
          <div className="featured-work__footer-card glass-panel">
            <div className="featured-work__footer-info">
              <h3 className="featured-work__footer-title">Looking for more?</h3>
              <p className="featured-work__footer-text">
                Browse all case studies, anomaly detection systems, and automation projects in the full library.
              </p>
            </div>
            <Link className="btn btn--primary" to="/projects">
              Explore All Projects
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
